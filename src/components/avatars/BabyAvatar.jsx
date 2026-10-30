import React, { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import RealisticNewborn from './RealisticNewborn';

/**
 * CradledSwaddledBaby — Lightweight, zero-Suspense-flash cradled newborn infant
 * with gentle soothing breathing rhythm and soft hospital swaddle cradle wrap.
 */
function RealRiggedBaby({
  blanketColor = '#fbcfe8',
  beanieColor = '#fce7f3',
  active = true,
}) {
  const babyRootRef = useRef();

  useFrame((state) => {
    if (!active || !babyRootRef.current) return;
    // Subtle newborn breathing & soothing rhythm
    const t = state.clock.elapsedTime;
    babyRootRef.current.position.y = Math.sin(t * 2.4) * 0.004;
  });

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
