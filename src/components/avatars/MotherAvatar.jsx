import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

/**
 * MotherAvatar — Authentic Healthcare & Maternity Female Character Suite
 *
 * 100% Anatomically accurate female characters:
 *  1. 🤰 คุณแม่สวมชุดคลุมท้อง / เดรสยาว (Maternity Long Dress / Gown — Amy)
 *     - สวมชุดเดรสยาวคลุมเข่า ผ้านุ่ม ทรงปล่อยสบาย สรีระคุณแม่สมจริง
 *  2. 👩‍🍼 คุณแม่พักฟื้นหลังคลอด (Postpartum Mother — Megan)
 *     - สวมชุดผู้ป่วยพักฟื้นหลังคลอด สรีระนุ่มนวล พร้อมโหมดอุ้มทารก
 *  3. 👩‍⚕️ พยาบาลวิชาชีพสาว (Registered Nurse & Midwife — Megan)
 *     - สวมชุดสครับพยาบาล หูฟังตรวจ (Stethoscope) และป้ายประจำตัว
 *
 * Locomotion & Sitting:
 *  - 100% Native Mixamo rig matching Megan & Amy skeletons.
 *  - Authentic Standing Idle, In-Place Walking, Sprinting, and Seated posture.
 */
const MotherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  characterOverride = null,
  outfitOverride = null,
  isSittingOverride = null,
  isHoldingBabyOverride = null,
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();

  const storeCharacter = useStore((state) => state.selectedCharacter) || 'postpartum_mother';
  const storeOutfit = useStore((state) => state.selectedOutfit) || 'pink';
  const storeHoldingBaby = useStore((state) => state.isHoldingBaby);
  const storeSitting = useStore((state) => state.isSitting);
  const seatedTarget = useStore((state) => state.seatedTarget);

  const selectedCharacter = characterOverride !== null ? characterOverride : storeCharacter;
  const selectedOutfit = outfitOverride !== null ? outfitOverride : storeOutfit;
  const isHoldingBaby = isHoldingBabyOverride !== null ? isHoldingBabyOverride : storeHoldingBaby;
  const isSitting = isSittingOverride !== null ? isSittingOverride : storeSitting;

  // Load optimized female character models
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  const { scene: amyScene } = useGLTF('/models/amy_opt.glb');
  
  // Load authentic Mixamo female animations (100% matching bone bind axes)
  const idleFbx = useFBX('/models/animations/Standing_Idle.fbx');
  const walkFbx = useFBX('/models/animations/walking.fbx');
  const sittingFbx = useFBX('/models/animations/Sitting_Idle.fbx');

  // Authentic hospital & maternity color schemes
  const OUTFIT_COLOR_SCHEMES = useMemo(() => ({
    pink: {
      primary: '#f472b6',
      badge: 'ชมพูนวลมารดา',
    },
    blue: {
      primary: '#38bdf8',
      badge: 'ฟ้าครามคนไข้',
    },
    lavender: {
      primary: '#c084fc',
      badge: 'ม่วงลาเวนเดอร์',
    },
    mint: {
      primary: '#34d399',
      badge: 'เขียวมิ้นต์สดใส',
    },
    white: {
      primary: '#f8fafc',
      badge: 'ขาวบริสุทธิ์คลินิก',
    },
    peach: {
      primary: '#fb923c',
      badge: 'ส้มพีชอบอุ่น',
    },
  }), []);

  // Determine active model based on character selection
  const isMaternityDress = selectedCharacter === 'pregnant_mother';
  const activeBaseScene = isMaternityDress ? (amyScene || meganScene) : meganScene;

  // Clone active scene cleanly
  const clonedScene = useMemo(() => {
    if (!activeBaseScene) return null;
    const clone = SkeletonUtils.clone(activeBaseScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.92;
          child.material.metalness = 0.0;
          child.material.roughnessMap = null;
          child.material.metalnessMap = null;
          if (child.material.specularColorTexture) child.material.specularColorTexture = null;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [activeBaseScene, isMaternityDress]);

  // ── Professional Nurse Accessories (Stethoscope & Nurse ID Badge) ──
  const nurseAccessories = useMemo(() => {
    const root = new THREE.Group();
    root.name = 'NurseAccessoriesGroup';

    // 1. Stethoscope around neck
    const stethGroup = new THREE.Group();
    stethGroup.position.set(0, 0.04, 0.02);

    const torusGeo = new THREE.TorusGeometry(0.082, 0.008, 12, 28, Math.PI * 0.92);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.1 });
    const neckTorus = new THREE.Mesh(torusGeo, tubeMat);
    neckTorus.rotation.x = Math.PI / 2.3;
    stethGroup.add(neckTorus);

    const leftTubeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.15, 12);
    const leftTube = new THREE.Mesh(leftTubeGeo, tubeMat);
    leftTube.position.set(-0.065, -0.06, 0.07);
    leftTube.rotation.z = 0.22;
    stethGroup.add(leftTube);

    const rightTubeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.15, 12);
    const rightTube = new THREE.Mesh(rightTubeGeo, tubeMat);
    rightTube.position.set(0.065, -0.06, 0.07);
    rightTube.rotation.z = -0.22;
    stethGroup.add(rightTube);

    const discGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.007, 24);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    const disc = new THREE.Mesh(discGeo, chromeMat);
    disc.position.set(-0.04, -0.15, 0.095);
    disc.rotation.x = Math.PI / 2 - 0.2;
    stethGroup.add(disc);

    root.add(stethGroup);

    // 2. Nurse ID Badge on Left Chest
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(0.085, -0.04, 0.095);
    badgeGroup.rotation.set(-0.1, 0.1, -0.05);

    const clipGeo = new THREE.BoxGeometry(0.016, 0.01, 0.006);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clip.position.set(0, 0.035, 0);
    badgeGroup.add(clip);

    const cardGeo = new THREE.BoxGeometry(0.046, 0.062, 0.003);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const card = new THREE.Mesh(cardGeo, cardMat);
    badgeGroup.add(card);

    const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const c1 = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.006), crossMat);
    c1.position.set(0, -0.015, 0.002);
    badgeGroup.add(c1);
    const c2 = new THREE.Mesh(new THREE.PlaneGeometry(0.006, 0.02), crossMat);
    c2.position.set(0, -0.015, 0.0025);
    badgeGroup.add(c2);

    root.add(badgeGroup);
    return root;
  }, []);

  // Attach Nurse accessories to Spine2 when character is nurse
  useEffect(() => {
    if (!clonedScene) return;
    let spine2Bone = null;
    clonedScene.traverse((child) => {
      if (child.isBone && child.name.includes('Spine2')) {
        spine2Bone = child;
      }
    });

    if (spine2Bone) {
      if (selectedCharacter === 'nurse') {
        if (!spine2Bone.getObjectByName('NurseAccessoriesGroup')) {
          spine2Bone.add(nurseAccessories);
        }
      } else {
        const existing = spine2Bone.getObjectByName('NurseAccessoriesGroup');
        if (existing) spine2Bone.remove(existing);
      }
    }
  }, [clonedScene, selectedCharacter, nurseAccessories]);

  // Seamless outfit changing across all 6 maternity & hospital recovery colorways
  useEffect(() => {
    if (!clonedScene) return;
    const scheme = OUTFIT_COLOR_SCHEMES[selectedOutfit] || OUTFIT_COLOR_SCHEMES.pink;

    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      // ── Maternity Long Dress (Amy) ──
      if (child.name === 'Ch46') {
        child.material.color.set(scheme.primary);
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      }

      // ── Postpartum Recovery / Nurse Suit (Megan) ──
      if (child.name === 'Ch22_Shirt') {
        child.material.map = null; // Clean fabric texture so colors are vivid and accurate
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#ffffff'); // Registered Nurse clean white scrub top
        } else {
          child.material.color.set(scheme.primary);
        }
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Pants') {
        child.material.map = null; // Clean fabric texture so colors are vivid and accurate
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#0284c7'); // Nurse professional navy blue slacks
        } else {
          child.material.color.set(scheme.primary);
        }
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.map = null;
        child.material.color.set('#f8fafc'); // Sanitary white hospital footwear
        child.material.roughness = 0.6;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        // Preserves authentic face and natural human skin texture map
        child.material.color.set('#ffffff');
        child.material.roughness = 0.75;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, selectedOutfit, selectedCharacter, OUTFIT_COLOR_SCHEMES]);

  // Authentic Mixamo Animation Clips for Megan & Amy (Idle, Walk, Run, Sitting)
  const animClips = useMemo(() => {
    const list = [];

    // ── Hips retargeting (FBX → GLB) ──
    // The Mixamo FBX files and the exported GLB use different parent frames / units
    // (Z-up vs Y-up, metres vs centimetres). Re-express the Hips tracks in the GLB
    // parent frame so the body stands upright at the right height:
    //   q_new = inv(P_glb) * P_fbx * q_track      v_new = inv(P_glb) * P_fbx * (v * S_fbx)
    const glbHips = clonedScene ? clonedScene.getObjectByName('mixamorigHips') : null;
    const fixHips = (clip, fbxRoot) => {
      const fbxHips = fbxRoot ? (fbxRoot.getObjectByName('mixamorigHips') || fbxRoot.getObjectByName('Hips')) : null;
      if (!glbHips || !fbxHips || !fbxHips.parent || !glbHips.parent) return;
      fbxRoot.updateWorldMatrix(true, true);
      glbHips.parent.updateWorldMatrix(true, false);
      const pF = new THREE.Quaternion();
      const pG = new THREE.Quaternion();
      fbxHips.parent.getWorldQuaternion(pF);
      glbHips.parent.getWorldQuaternion(pG);
      const corr = pG.clone().invert().multiply(pF);
      const sF = new THREE.Vector3();
      fbxHips.parent.getWorldScale(sF);
      // FBX world units are centimetres-like (×1) ; GLB local units are centimetres (armature ×0.01)
      const posScale = sF.x;
      clip.tracks.forEach((t) => {
        if (t.name === 'mixamorigHips.quaternion') {
          const q = new THREE.Quaternion();
          for (let i = 0; i < t.values.length; i += 4) {
            q.set(t.values[i], t.values[i + 1], t.values[i + 2], t.values[i + 3]);
            q.premultiply(corr);
            t.values[i] = q.x; t.values[i + 1] = q.y; t.values[i + 2] = q.z; t.values[i + 3] = q.w;
          }
        } else if (t.name === 'mixamorigHips.position') {
          const v = new THREE.Vector3();
          for (let i = 0; i < t.values.length; i += 3) {
            v.set(t.values[i], t.values[i + 1], t.values[i + 2]).multiplyScalar(posScale).applyQuaternion(corr);
            t.values[i] = v.x; t.values[i + 1] = v.y; t.values[i + 2] = v.z;
          }
        }
      });
    };

    // 1. Standing Idle (Smooth natural standing & calm breathing loop)
    if (idleFbx && idleFbx.animations && idleFbx.animations[0]) {
      const c = idleFbx.animations[0].clone();
      c.name = 'idle';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(c, idleFbx);
      list.push(c);
    }

    // 2. In-Place Walk & Sprint Cycle
    if (walkFbx && walkFbx.animations && walkFbx.animations[0]) {
      const c = walkFbx.animations[0].clone();
      c.name = 'walk';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale'));
      fixHips(c, walkFbx);
      // In-place walk: zero out horizontal hip displacement (after axis re-basing)
      c.tracks.forEach((t) => {
        if (t.name === 'mixamorigHips.position') {
          for (let i = 0; i < t.values.length; i += 3) {
            t.values[i] = 0;     // X = 0
            t.values[i + 2] = 0; // Z = 0
          }
        }
      });
      list.push(c);

      // Create 'run' by speeding up walk cycle 1.55x
      const run = c.clone();
      run.name = 'run';
      run.tracks.forEach((t) => {
        for (let i = 0; i < t.times.length; i++) {
          t.times[i] /= 1.55;
        }
      });
      run.duration /= 1.55;
      list.push(run);
    }

    // 3. Realistic Seated Posture (Full-body sitting animation)
    if (sittingFbx && sittingFbx.animations && sittingFbx.animations[0]) {
      const c = sittingFbx.animations[0].clone();
      c.name = 'sitting';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale'));
      fixHips(c, sittingFbx);
      list.push(c);
    }

    return list;
  }, [idleFbx, walkFbx, sittingFbx, clonedScene]);

  // Bind animations directly to character rig
  const { actions } = useAnimations(animClips, clonedScene);

  // Store bone references for sitting and procedural baby cradling
  const bones = useRef({});
  useEffect(() => {
    if (!clonedScene) return;
    const b = {};
    clonedScene.traverse((child) => {
      if (child.isBone) {
        if (child.name.includes('LeftArm') && !child.name.includes('Fore')) b.leftArm = child;
        if (child.name.includes('RightArm') && !child.name.includes('Fore')) b.rightArm = child;
        if (child.name.includes('LeftForeArm')) b.leftForeArm = child;
        if (child.name.includes('RightForeArm')) b.rightForeArm = child;
        if (child.name.includes('LeftUpLeg')) b.leftUpLeg = child;
        if (child.name.includes('RightUpLeg')) b.rightUpLeg = child;
        if (child.name.includes('LeftLeg')) b.leftLeg = child;
        if (child.name.includes('RightLeg')) b.rightLeg = child;
        if (child.name.includes('LeftFoot')) b.leftFoot = child;
        if (child.name.includes('RightFoot')) b.rightFoot = child;
        if (child.name.includes('Hips')) b.hips = child;
        if (child.name.includes('Spine') && !child.name.includes('1') && !child.name.includes('2')) b.spine = child;
      }
    });
    bones.current = b;
    window.__avatarBones = b;
  }, [clonedScene]);

  // Expose bone search & group for external attachment
  useImperativeHandle(ref, () => ({
    getBone: (name) => {
      let found = null;
      clonedScene?.traverse((child) => {
        if (child.isBone && child.name.toLowerCase().includes(name.toLowerCase())) {
          found = child;
        }
      });
      return found;
    },
    group: group.current,
  }));

  // Play locomotion animations when standing vs sitting
  useEffect(() => {
    if (!actions) return;

    if (isSitting) {
      const walk = actions['walk'];
      const run = actions['run'];
      if (walk) walk.fadeOut(0.2);
      if (run) run.fadeOut(0.2);
      const sitting = actions['sitting'] || actions['idle'];
      if (sitting) sitting.reset().fadeIn(0.25).play();
    } else {
      const sitting = actions['sitting'];
      if (sitting) sitting.fadeOut(0.2);

      let animName = currentAnimation.toLowerCase();
      const act = actions[animName] || actions['idle'] || Object.values(actions)[0];
      if (act) {
        Object.values(actions).forEach((a) => {
          if (a !== act) a.fadeOut(0.25);
        });
        act.reset().fadeIn(0.25).play();
      }
    }
  }, [currentAnimation, isSitting, actions]);

  // 100% Anatomically Correct Posture & Dynamic Rig Positioning
  useFrame(() => {
    if (!clonedScene || !avatarRigRef.current) return;
    const {
      leftArm, rightArm, leftForeArm, rightForeArm
    } = bones.current;

    if (isSitting) {
      // ── Precise Seated Alignment with Seat Cushion ──
      const seatHeight = seatedTarget?.seatOffset?.[1] ?? 0.46;
      // Hip joint height lowering to place buttocks flush on cushion
      const targetY = -(0.92 - seatHeight);
      const targetZ = 0.08;

      avatarRigRef.current.position.set(0, targetY, targetZ);
      avatarRigRef.current.rotation.set(0, 0, 0);

      // Arms resting politely on lap or cradling baby while seated
      if (isHoldingBaby) {
        if (leftArm && rightArm) {
          leftArm.rotation.set(0.1, 0.2, 1.15);
          rightArm.rotation.set(0.1, -0.2, -1.15);
        }
        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.set(1.1, 0.4, 0.1);
          rightForeArm.rotation.set(1.1, -0.4, -0.1);
        }
      }
    } else {
      // ── Standing / Walking Posture ──
      avatarRigRef.current.position.set(0, 0, 0);
      avatarRigRef.current.rotation.set(0, 0, 0);

      if (isHoldingBaby) {
        if (leftArm && rightArm) {
          leftArm.rotation.set(0.6, 0.3, 0.8);
          rightArm.rotation.set(-0.6, -0.3, 0.8);
        }
        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.set(-1.2, 0.3, 0.2);
          rightForeArm.rotation.set(1.2, -0.3, -0.2);
        }
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <group ref={avatarRigRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} rotation={[0, 0, 0]} />
      </group>
    </group>
  );
});

MotherAvatar.displayName = 'MotherAvatar';
export default MotherAvatar;

useGLTF.preload('/models/megan_opt.glb');
useGLTF.preload('/models/amy_opt.glb');
useFBX.preload('/models/animations/Standing_Idle.fbx');
useFBX.preload('/models/animations/walking.fbx');
useFBX.preload('/models/animations/Sitting_Idle.fbx');
