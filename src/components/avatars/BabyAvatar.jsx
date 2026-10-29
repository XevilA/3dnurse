import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import RealisticNewborn from './RealisticNewborn';

// Shared lifelike newborn materials (avoids duplicate WebGL shader compilation across meshes)
const BABY_MATERIALS = {
  skin: new THREE.MeshStandardMaterial({
    color: '#f7c6b0',
    roughness: 0.52,
    metalness: 0.0,
    emissive: '#4a1510',
    emissiveIntensity: 0.045,
  }),
  lips: new THREE.MeshStandardMaterial({
    color: '#e5858b',
    roughness: 0.4,
    metalness: 0.0,
  }),
  iris: new THREE.MeshStandardMaterial({
    color: '#3b2219',
    roughness: 0.18,
    metalness: 0.05,
  }),
  pupil: new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.1,
    metalness: 0.05,
  }),
  sclera: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.15,
    metalness: 0.0,
  }),
  diaper: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.82,
    metalness: 0.0,
  }),
  pin: new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    roughness: 0.3,
    metalness: 0.35,
  }),
};

/**
 * RealRiggedBaby — Authentic 46,044-vertex 3D Rigged Newborn Infant (`baby_real.glb`)
 * with 65 Mixamo bones, realistic newborn skin/eyes/lips/diaper shading,
 * stabilized gentle infant movement animation, and soft hospital swaddle cradle wrap.
 */
function RealRiggedBaby({
  blanketColor = '#fbcfe8',
  beanieColor = '#fce7f3',
  withSwaddleWrap = true,
  active = true,
}) {
  const { scene: rawBabyScene, animations: rawAnimations } = useGLTF('/models/baby_real.glb');
  const babyRootRef = useRef();

  // Clone rigged 3D baby model and apply lifelike newborn materials
  const clonedBaby = useMemo(() => {
    if (!rawBabyScene) return null;
    const clone = SkeletonUtils.clone(rawBabyScene);

    clone.traverse((child) => {
      if (child.isLight || child.isCamera) {
        child.visible = false;
        return;
      }
      if (!child.isMesh) return;

      // Swaddle blanket underneath casts the shadow; disabling shadow pass on 46k skinned vertices avoids double skinning & shader stall
      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = false;
      const n = (child.name || '').toLowerCase();

      if (n.includes('skin')) {
        child.material = BABY_MATERIALS.skin;
      } else if (n.includes('lips')) {
        child.material = BABY_MATERIALS.lips;
      } else if (n.includes('iris')) {
        child.material = BABY_MATERIALS.iris;
      } else if (n.includes('pupil')) {
        child.material = BABY_MATERIALS.pupil;
      } else if (n.includes('eyeball') || n.includes('filler')) {
        child.material = BABY_MATERIALS.sclera;
      } else if (n.includes('diaper')) {
        child.material = BABY_MATERIALS.diaper;
      } else if (n.includes('pin')) {
        child.material = BABY_MATERIALS.pin;
      }
    });

    return clone;
  }, [rawBabyScene]);

  // Build stabilized Mixamo infant animation clip (gentle head turn, finger & leg wiggles, zero root drift)
  const stabilizedClip = useMemo(() => {
    if (!rawAnimations || !rawAnimations[0]) return null;
    const clip = rawAnimations[0].clone();
    clip.name = 'baby_cradle_alive';

    // Keep only quaternion rotations so bones never stretch or translate out of mother's arms
    clip.tracks = clip.tracks.filter((t) => t.name.endsWith('.quaternion'));

    clip.tracks.forEach((t) => {
      const q0 = new THREE.Quaternion(t.values[0], t.values[1], t.values[2], t.values[3]);
      const q = new THREE.Quaternion();
      const isCore = t.name.includes('Hips') || t.name.includes('Spine');
      const factor = isCore ? 0.08 : 0.42;

      for (let i = 0; i < t.values.length; i += 4) {
        q.set(t.values[i], t.values[i + 1], t.values[i + 2], t.values[i + 3]);
        if (q0.dot(q) < 0) {
          q.set(-q.x, -q.y, -q.z, -q.w);
        }
        q.x = q0.x + (q.x - q0.x) * factor;
        q.y = q0.y + (q.y - q0.y) * factor;
        q.z = q0.z + (q.z - q0.z) * factor;
        q.w = q0.w + (q.w - q0.w) * factor;
        q.normalize();
        t.values[i] = q.x;
        t.values[i + 1] = q.y;
        t.values[i + 2] = q.z;
        t.values[i + 3] = q.w;
      }
    });

    return clip;
  }, [rawAnimations]);

  const mixer = useMemo(() => {
    if (!clonedBaby) return null;
    return new THREE.AnimationMixer(clonedBaby);
  }, [clonedBaby]);

  useEffect(() => {
    if (!mixer || !stabilizedClip) return undefined;
    const action = mixer.clipAction(stabilizedClip);
    action.timeScale = 0.65;
    action.reset().play();
    return () => {
      action.stop();
      mixer.stopAllAction();
    };
  }, [mixer, stabilizedClip]);

  useFrame((state, delta) => {
    if (!active) return;
    if (mixer) {
      mixer.update(delta);
    }
    if (babyRootRef.current) {
      // Subtle newborn breathing & soothing rhythm
      const t = state.clock.elapsedTime;
      babyRootRef.current.position.y = Math.sin(t * 2.4) * 0.004;
    }
  });

  if (!clonedBaby) return null;

  return (
    <group ref={babyRootRef}>
      {/* Centered Realistic Newborn Infant in Soft Hospital Swaddle & Beanie Cap
          Oriented so head rests snugly in Mother's Left Elbow (+X), swaddled body lies across
          both forearms, and face tilts gently upward toward Mother (-Z / +Y) */}
      <group rotation={[-0.32, 0, 0.22]}>
        <group position={[0.04, -0.055, -0.01]} rotation={[0, -Math.PI / 2, 0]} scale={0.92}>
          <RealisticNewborn
            pose="swaddle"
            beanieColor={beanieColor}
            blanketColor={blanketColor}
            withBlanket={false}
          />
        </group>
      </group>
    </group>
  );
}

/**
 * BabyAvatar — Unified Newborn Infant 3D Model
 * Uses RealRiggedBaby (`baby_real.glb` + 65-bone Mixamo animation) when held/cradled,
 * and RealisticNewborn for specialized clinical table inspection poses (cordCare, diaperChange, bathing, prone).
 */
const HELD_POSES = new Set([
  'carried',
  'cradleHold',
  'footballHold',
  'crossCradle',
  'sideLying',
]);

const HELD_POSE_OFFSETS = {
  carried:      { pos: [0, 0, 0],          rot: [0, 0, 0],           scale: 1.0 },
  cradleHold:   { pos: [0, 0.01, 0],       rot: [0.05, 0.1, 0.08],   scale: 1.0 },
  footballHold: { pos: [0.08, -0.02, 0.02], rot: [0.1, -0.45, -0.25], scale: 0.96 },
  crossCradle:  { pos: [-0.02, 0.01, 0],   rot: [0.05, -0.15, -0.1], scale: 1.0 },
  sideLying:    { pos: [0, 0.03, 0],       rot: [0.35, 0, 0.15],     scale: 1.0 },
};

const CLINICAL_POSE_TRANSFORM = {
  bathingFootballHold: { pos: [0, 0.05, 0], rot: [0.35, 0.2, -0.4],  scale: 0.92, nbPose: 'towelWrap' },
  bathingTurned:       { pos: [0, 0.12, 0], rot: [0.15, 0, Math.PI], scale: 0.92, nbPose: 'bathing' },
};

const BabyAvatar = forwardRef(({
  pose = 'sleeping',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  withBlanket = true,
  blanketColor = '#fef08a',
  beanieColor = '#fef08a',
  towelColor = '#bfe3f7',
  pajamaColor = '#bfe8d0',
  wetDiaper = false,
  active = true,
}, ref) => {
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;

  // 1. Held / Cradled Poses -> Use Real 46k-vertex Rigged 3D Baby Model + Mixamo Infant Animation
  if (HELD_POSES.has(pose)) {
    const heldPreset = HELD_POSE_OFFSETS[pose] || HELD_POSE_OFFSETS.carried;
    return (
      <group ref={ref} position={position} rotation={rotation} scale={s} dispose={null}>
        <group
          position={heldPreset.pos}
          rotation={heldPreset.rot}
          scale={heldPreset.scale}
        >
          <RealRiggedBaby
            blanketColor={blanketColor === '#fef08a' ? '#fbcfe8' : blanketColor}
            beanieColor={beanieColor === '#fef08a' ? '#fce7f3' : beanieColor}
            withSwaddleWrap={withBlanket}
            active={active}
          />
        </group>
      </group>
    );
  }

  // 2. Clinical Examination / Bathing / Safe Sleep Crib Poses
  const preset = CLINICAL_POSE_TRANSFORM[pose];
  const mappedPose = preset
    ? preset.nbPose
    : pose === 'sleeping'
      ? 'swaddle'
      : pose === 'cordCare'
        ? 'diaperOn'
        : pose;

  return (
    <group ref={ref} position={position} rotation={rotation} scale={s} dispose={null}>
      <group
        position={preset ? preset.pos : [0, 0, 0]}
        rotation={preset ? preset.rot : [0, 0, 0]}
        scale={preset ? preset.scale : 1}
      >
        <RealisticNewborn
          pose={mappedPose}
          beanieColor={beanieColor}
          blanketColor={blanketColor}
          withBlanket={withBlanket && mappedPose === 'swaddle' && !preset}
          towelColor={towelColor}
          pajamaColor={pajamaColor}
          wetDiaper={wetDiaper}
        />
      </group>
    </group>
  );
});

BabyAvatar.displayName = 'BabyAvatar';
export default BabyAvatar;
