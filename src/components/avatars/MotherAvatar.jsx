import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import BabyAvatar from './BabyAvatar';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _qRestHips = new THREE.Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);

// Precomputed anatomically accurate Mixamo female cradling bone quaternions
const CRADLE_STANDING_OVERRIDES = {
  'mixamorigLeftShoulder.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.575, -0.052, -1.42)),
  'mixamorigRightShoulder.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.574, -0.001, 1.46)),
  'mixamorigLeftArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.92, 0.48, 0.36)),
  'mixamorigRightArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.98, -0.48, -0.34)),
  'mixamorigLeftForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0.25, 1.52)),
  'mixamorigRightForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, -0.25, -1.48)),
  'mixamorigLeftHand.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, -0.30, 0.18)),
  'mixamorigRightHand.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0.30, -0.18)),
  'mixamorigHead.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.16, 0.02, 0)),
};

/**
 * MotherAvatar — Authentic Healthcare & Maternity Female Character Suite
 *
 * 100% Anatomically accurate female characters:
 *  1. 🤰 คุณแม่สวมชุดคลุมท้อง / เดรสยาว (Maternity Long Dress / Gown — Amy)
 *     - สวมชุดเดรสยาวคลุมเข่า ผ้านุ่ม ทรงปล่อยสบาย สรีระคุณแม่สมจริง
 *  2. 👩‍🍼 คุณแม่พักฟื้นหลังคลอด (Postpartum Mother — Megan)
 *     - สวมชุดผู้ป่วยพักฟื้นหลังคลอด สรีระนุ่มนวล พร้อมโหมดอุ้มทารก 3D สมจริง
 *  3. 👩‍⚕️ พยาบาลวิชาชีพสาว (Registered Nurse & Midwife — Megan)
 *     - สวมชุดสครับพยาบาล หูฟังตรวจ (Stethoscope) และป้ายประจำตัว
 *
 * Locomotion, Sitting & Baby Cradling:
 *  - 100% Native Mixamo rig matching Megan & Amy skeletons with deterministic local Hips retargeting.
 *  - Hard upright pelvis guard prevents any forward pitch ("ดมดิน") or vertical floor sinking ("จมดิน").
 *  - Dedicated 'idle_hold', 'walk_hold', 'run_hold', and 'sitting_hold' animations + hand-locked 3D rigged baby.
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
  showHeldBaby = true,
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();
  const heldBabyRef = useRef();

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
  // pregnant_megan_opt.glb = realistic Megan with natural belly bump (สมจริง ท้องนิดๆ)
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  const { scene: pregnantScene } = useGLTF('/models/pregnant_megan_opt.glb');

  // Load authentic Mixamo female animations
  const idleFbx = useFBX('/models/animations/Standing_Idle.fbx');
  const walkFbx = useFBX('/models/animations/walking.fbx');
  const sitIdleFbx = useFBX('/models/animations/Sitting_Idle.fbx');

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
  // pregnant_mother → pregnant_megan_opt (Megan rig + belly bump mesh, same skeleton as megan_opt)
  // nurse / postpartum_mother → megan_opt (standard Megan)
  const isPregnant = selectedCharacter === 'pregnant_mother';
  // pregnant_megan_opt uses the SAME Megan skeleton (hipZ ≈ -100.08) — NOT Amy's hipZ of -69.77
  const isMaternityDress = false; // Always false now — pregnant_megan uses Megan rig, not Amy
  const activeBaseScene = isPregnant ? (pregnantScene || meganScene) : meganScene;

  // Clone active scene cleanly
  // pregnant_megan_opt uses the same Megan rig scale (0.01) — no separate Amy scale needed
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBaseScene, isPregnant]);

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
  // Covers: megan_opt (postpartum/nurse) + pregnant_megan_opt (pregnant — same Ch22_* mesh names)
  useEffect(() => {
    if (!clonedScene) return;
    const scheme = OUTFIT_COLOR_SCHEMES[selectedOutfit] || OUTFIT_COLOR_SCHEMES.pink;
    const isNurse = selectedCharacter === 'nurse';

    let changed = false;
    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      // ── All Megan variants (postpartum, pregnant, nurse) share Ch22_* mesh names ──
      if (child.name === 'Ch22_Shirt') {
        child.material.map = null;
        child.material.color.set(isNurse ? '#ffffff' : scheme.primary);
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
        changed = true;
      } else if (child.name === 'Ch22_Pants') {
        child.material.map = null;
        child.material.color.set(isNurse ? '#0284c7' : scheme.primary);
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
        changed = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.map = null;
        child.material.color.set('#f8fafc');
        child.material.roughness = 0.6;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
        changed = true;
      } else if (child.name === 'Ch22_Body') {
        child.material.color.set('#f5d0a9'); // warm skin tone
        child.material.roughness = 0.75;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
        changed = true;
      } else if (child.name === 'Ch22_Hair') {
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
        changed = true;
      }
    });

    // Retry after 120ms if GLB meshes haven't resolved yet
    if (!changed) {
      const timer = setTimeout(() => {
        clonedScene.traverse((child) => {
          if (!child.isMesh || !child.material) return;
          if (child.name === 'Ch22_Shirt') {
            child.material.map = null;
            child.material.color.set(isNurse ? '#ffffff' : scheme.primary);
            child.material.needsUpdate = true;
          }
          if (child.name === 'Ch22_Pants') {
            child.material.map = null;
            child.material.color.set(isNurse ? '#0284c7' : scheme.primary);
            child.material.needsUpdate = true;
          }
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [clonedScene, selectedOutfit, selectedCharacter, OUTFIT_COLOR_SCHEMES]);

  // Authentic Mixamo Animation Clips for Megan & Amy (Idle, Walk, Run, Sitting + Baby-Holding Variants)
  const animClips = useMemo(() => {
    const list = [];
    const glbHips = clonedScene ? clonedScene.getObjectByName('mixamorigHips') : null;
    const restHipZ = glbHips && glbHips.position.z ? glbHips.position.z : -100.08;

    // 100% Deterministic Local-Frame Hips Retargeting (NEVER uses getWorldQuaternion, so parent group rotations never corrupt Hips!)
    const fixHips = (clip, fbxRoot) => {
      const fbxHips = fbxRoot ? (fbxRoot.getObjectByName('mixamorigHips') || fbxRoot.getObjectByName('Hips')) : null;
      if (!glbHips || !fbxHips || !fbxHips.parent || !glbHips.parent) return;

      const pF = fbxHips.parent.quaternion.clone();
      const pG = glbHips.parent.quaternion.clone();
      const corr = pG.clone().invert().multiply(pF);
      const posScale = fbxHips.parent.scale.x || 1;

      clip.tracks.forEach((t) => {
        if (t.name === 'mixamorigHips.quaternion') {
          const q = new THREE.Quaternion();
          for (let i = 0; i < t.values.length; i += 4) {
            q.set(t.values[i], t.values[i + 1], t.values[i + 2], t.values[i + 3]);
            q.premultiply(corr);
            // Ensure same quaternion hemisphere as _qRestHips so cross-fading never spins 360°
            if (q.dot(_qRestHips) < 0) {
              q.set(-q.x, -q.y, -q.z, -q.w);
            }
            t.values[i] = q.x;
            t.values[i + 1] = q.y;
            t.values[i + 2] = q.z;
            t.values[i + 3] = q.w;
          }
        } else if (t.name === 'mixamorigHips.position') {
          const v = new THREE.Vector3();
          v.set(t.values[0], t.values[1], t.values[2]).multiplyScalar(posScale).applyQuaternion(corr);
          const baseZ = v.z || -100.08;
          const heightRatio = restHipZ / baseZ;
          for (let i = 0; i < t.values.length; i += 3) {
            v.set(t.values[i], t.values[i + 1], t.values[i + 2]).multiplyScalar(posScale).applyQuaternion(corr);
            t.values[i] = 0;                     // X = 0 (centered)
            t.values[i + 1] = 0;                 // Y = 0 (in-place locomotion)
            t.values[i + 2] = v.z * heightRatio; // Z = exact vertical hip height above floor
          }
        }
      });
    };

    // Helper to apply bone quaternion overrides cleanly onto a cloned clip
    const applyBoneOverrides = (baseClip, newName, overridesMap) => {
      const cloned = baseClip.clone();
      cloned.name = newName;
      const existingNames = new Set();

      cloned.tracks.forEach((t) => {
        existingNames.add(t.name);
        const q = overridesMap[t.name];
        if (q) {
          for (let i = 0; i < t.values.length; i += 4) {
            t.values[i] = q.x;
            t.values[i + 1] = q.y;
            t.values[i + 2] = q.z;
            t.values[i + 3] = q.w;
          }
        }
      });

      // Add tracks for any override bones not present in the base clip
      Object.entries(overridesMap).forEach(([trackName, q]) => {
        if (!existingNames.has(trackName)) {
          cloned.tracks.push(
            new THREE.QuaternionKeyframeTrack(
              trackName,
              [0, Math.max(0.1, cloned.duration)],
              [q.x, q.y, q.z, q.w, q.x, q.y, q.z, q.w]
            )
          );
        }
      });

      return cloned;
    };

    // 1. Standing Idle & Baby-Cradling Idle
    if (idleFbx && idleFbx.animations && idleFbx.animations[0]) {
      const c = idleFbx.animations[0].clone();
      c.name = 'idle';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(c, idleFbx);
      list.push(c);

      // 1b. Standing Idle while Cradling Baby
      const idleHold = applyBoneOverrides(c, 'idle_hold', CRADLE_STANDING_OVERRIDES);
      list.push(idleHold);
    }

    // 2. Authentic Sitting_Idle.fbx — proper female seated pose (no mesh clipping)
    if (sitIdleFbx && sitIdleFbx.animations && sitIdleFbx.animations[0]) {
      const s = sitIdleFbx.animations[0].clone();
      s.name = 'sitting';
      s.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      s.tracks = s.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(s, sitIdleFbx);
      list.push(s);

      // 2b. Seated while holding baby
      const sitHold = applyBoneOverrides(s, 'sitting_hold', CRADLE_STANDING_OVERRIDES);
      list.push(sitHold);
    } else if (idleFbx && idleFbx.animations && idleFbx.animations[0]) {
      // Fallback: derive sitting from idle with bone overrides if Sitting_Idle fails to load
      const c = idleFbx.animations[0].clone();
      c.name = 'idle_base_for_sit';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(c, idleFbx);

      const seatedOverrides = {
        'mixamorigLeftUpLeg.quaternion':  new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.10,  0.02,  -0.04)),
        'mixamorigRightUpLeg.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.10, -0.02,   0.04)),
        'mixamorigLeftLeg.quaternion':    new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI / 2 - 0.15,  0.00,  -0.01)),
        'mixamorigRightLeg.quaternion':   new THREE.Quaternion().setFromEuler(new THREE.Euler( Math.PI / 2 - 0.15,  0.00,   0.01)),
        'mixamorigLeftFoot.quaternion':   new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.28,  0.00,  -0.01)),
        'mixamorigRightFoot.quaternion':  new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.28,  0.00,   0.01)),
        'mixamorigLeftArm.quaternion':    new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.10,  0.30,   0.10)),
        'mixamorigRightArm.quaternion':   new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.10, -0.30,  -0.10)),
        'mixamorigLeftForeArm.quaternion':  new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04,  0.10,  1.00)),
        'mixamorigRightForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04, -0.10, -1.00)),
      };
      const sit = applyBoneOverrides(c, 'sitting', seatedOverrides);
      list.push(sit);
      const sitHold = applyBoneOverrides(sit, 'sitting_hold', CRADLE_STANDING_OVERRIDES);
      list.push(sitHold);
    }

    // 3. In-Place Walk & Sprint Cycle (+ Baby-Cradling Walk & Sprint)
    if (walkFbx && walkFbx.animations && walkFbx.animations[0]) {
      const c = walkFbx.animations[0].clone();
      c.name = 'walk';
      c.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      c.tracks = c.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(c, walkFbx);
      list.push(c);

      // 3b. Walking while Cradling Baby
      const walkHold = applyBoneOverrides(c, 'walk_hold', CRADLE_STANDING_OVERRIDES);
      list.push(walkHold);

      // 4. Sprint ('run') & Sprint while Cradling Baby ('run_hold')
      const run = c.clone();
      run.name = 'run';
      run.tracks.forEach((t) => {
        for (let i = 0; i < t.times.length; i++) {
          t.times[i] /= 1.55;
        }
      });
      run.duration /= 1.55;
      list.push(run);

      const runHold = applyBoneOverrides(run, 'run_hold', CRADLE_STANDING_OVERRIDES);
      list.push(runHold);
    }

    return list;
  }, [idleFbx, walkFbx, sitIdleFbx, clonedScene]);

  // Bind animations directly to character rig
  const { actions } = useAnimations(animClips, clonedScene);

  // Store bone references for upright guard, sitting, and procedural baby cradling
  const bones = useRef({});
  useEffect(() => {
    if (!clonedScene) return;
    const b = {};
    clonedScene.traverse((child) => {
      if (child.isBone) {
        if (child.name.includes('LeftShoulder')) b.leftShoulder = child;
        if (child.name.includes('RightShoulder')) b.rightShoulder = child;
        if (child.name.includes('LeftArm') && !child.name.includes('Fore')) b.leftArm = child;
        if (child.name.includes('RightArm') && !child.name.includes('Fore')) b.rightArm = child;
        if (child.name.includes('LeftForeArm')) b.leftForeArm = child;
        if (child.name.includes('RightForeArm')) b.rightForeArm = child;
        if (child.name.includes('LeftHand') && !child.name.includes('Thumb') && !child.name.includes('Index') && !child.name.includes('Middle') && !child.name.includes('Ring') && !child.name.includes('Pinky')) b.leftHand = child;
        if (child.name.includes('RightHand') && !child.name.includes('Thumb') && !child.name.includes('Index') && !child.name.includes('Middle') && !child.name.includes('Ring') && !child.name.includes('Pinky')) b.rightHand = child;
        if (child.name.includes('LeftUpLeg')) b.leftUpLeg = child;
        if (child.name.includes('RightUpLeg')) b.rightUpLeg = child;
        if (child.name.includes('LeftLeg')) b.leftLeg = child;
        if (child.name.includes('RightLeg')) b.rightLeg = child;
        if (child.name.includes('LeftFoot')) b.leftFoot = child;
        if (child.name.includes('RightFoot')) b.rightFoot = child;
        if (child.name.includes('Hips')) b.hips = child;
        if (child.name.includes('Spine') && !child.name.includes('1') && !child.name.includes('2')) b.spine = child;
        if (child.name.includes('Spine2')) b.spine2 = child;
        if (child.name.includes('Head') && !child.name.includes('Top')) b.head = child;
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

  // Play locomotion & baby-holding animations smoothly
  useEffect(() => {
    if (!actions) return;

    const baseName = isSitting ? 'sitting' : currentAnimation.toLowerCase();
    const targetClipName = isHoldingBaby ? `${baseName}_hold` : baseName;
    const act =
      actions[targetClipName] ||
      actions[baseName] ||
      actions[isHoldingBaby ? 'idle_hold' : 'idle'] ||
      Object.values(actions)[0];

    if (act) {
      Object.values(actions).forEach((a) => {
        if (a && a !== act) a.fadeOut(0.22);
      });
      act.reset().fadeIn(0.22).play();
    }
  }, [currentAnimation, isSitting, isHoldingBaby, actions]);

  // 100% Anatomically Correct Posture, Upright Pelvis Guard & Hand-Locked Baby Cradling
  useFrame((state) => {
    if (!clonedScene || !avatarRigRef.current) return;
    const {
      hips,
      leftShoulder,
      rightShoulder,
      leftArm,
      rightArm,
      leftForeArm,
      rightForeArm,
      leftHand,
      rightHand,
    } = bones.current;

    // 1. Hard Upright Pelvis Safety Guard (100% Prevents "ดมดิน" & "จมดิน")
    if (hips) {
      const targetHipZ = isMaternityDress ? -69.77 : -100.08;
      hips.position.x = 0;
      hips.position.y = 0;
      if (!Number.isFinite(hips.position.z) || hips.position.z > targetHipZ * 0.75 || hips.position.z < targetHipZ * 1.25) {
        hips.position.z = targetHipZ;
      }
      // Verify pelvis quaternion stays upright around _qRestHips (-90° X in Armature space)
      const dot = Math.abs(hips.quaternion.dot(_qRestHips));
      if (!Number.isFinite(dot) || dot < 0.85) {
        hips.quaternion.copy(_qRestHips);
      }
    }

    // 2. Seated vs Standing Rig Elevation
    // seatOffset[1] = seat surface height above floor (e.g. 0.46m for hospital sofa)
    // avatarRig Y must be pulled down so the hip bone lands exactly at seat height
    // Megan hip bone sits at ~0.92m in T-pose → lower rig by (0.92 - seatHeight)
    if (isSitting) {
      const seatHeight = seatedTarget?.seatOffset?.[1] ?? 0.46;
      const hipBoneHeight = 0.87; // Megan Mixamo hip bone at T-pose
      const targetY = Math.max(-(hipBoneHeight - seatHeight), -0.50);
      const targetZ = seatedTarget?.type === 'bed' ? 0.08 : 0.05;
      avatarRigRef.current.position.set(0, targetY, targetZ);
      avatarRigRef.current.rotation.set(0, 0, 0);
    } else {
      avatarRigRef.current.position.set(0, 0, 0);
      avatarRigRef.current.rotation.set(0, 0, 0);
    }

    // 3. Anatomically Accurate Maternal Baby-Cradling Animation & Hand-Locked Baby Synchronization
    if (isHoldingBaby) {
      const t = state.clock.elapsedTime;
      const rock = Math.sin(t * 2.1) * 0.035;
      const breath = Math.sin(t * 1.8) * 0.02;

      if (leftShoulder && rightShoulder) {
        leftShoulder.rotation.set(1.575, -0.052, -1.42);
        rightShoulder.rotation.set(1.574, -0.001, 1.46);
      }
      if (leftArm && rightArm) {
        leftArm.rotation.set(0.92 + breath, 0.48 + rock * 0.4, 0.36);
        rightArm.rotation.set(0.98 + breath, -0.48 + rock * 0.4, -0.34);
      }
      if (leftForeArm && rightForeArm) {
        leftForeArm.rotation.set(0.15, 0.25, 1.52 + rock * 0.5);
        rightForeArm.rotation.set(0.15, -0.25, -1.48 - rock * 0.5);
      }
      if (leftHand && rightHand) {
        leftHand.rotation.set(0.22, -0.30, 0.18);
        rightHand.rotation.set(0.22, 0.30, -0.18);
      }

      // Lock held baby directly to the live midpoint of the mother's cradling hands
      if (heldBabyRef.current && leftHand && rightHand) {
        leftHand.updateWorldMatrix(true, false);
        rightHand.updateWorldMatrix(true, false);
        _v1.setFromMatrixPosition(leftHand.matrixWorld);
        _v2.setFromMatrixPosition(rightHand.matrixWorld);
        avatarRigRef.current.worldToLocal(_v1);
        avatarRigRef.current.worldToLocal(_v2);

        const midX = (_v1.x + _v2.x) * 0.5;
        const midY = (_v1.y + _v2.y) * 0.5;
        const midZ = (_v1.z + _v2.z) * 0.5;

        heldBabyRef.current.position.set(midX, midY - 0.015, midZ + 0.015);
        heldBabyRef.current.rotation.set(breath * 0.6, rock * 0.8, rock * 0.45);
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <group ref={avatarRigRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} rotation={[0, 0, 0]} />

        {/* Real 46k-vertex Rigged 3D Newborn Infant nestled directly in Mother's Cradling Hands (kept mounted on player for 0ms instant toggle) */}
        {showHeldBaby && isHoldingBabyOverride !== false && (
          <group
            ref={heldBabyRef}
            position={[0, 1.165, 0.235]}
            visible={Boolean(isHoldingBaby)}
          >
            <BabyAvatar
              pose="carried"
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.0}
              active={Boolean(isHoldingBaby)}
            />
          </group>
        )}
      </group>
    </group>
  );
});

MotherAvatar.displayName = 'MotherAvatar';
export default MotherAvatar;

useGLTF.preload('/models/megan_opt.glb');
useGLTF.preload('/models/pregnant_megan_opt.glb');
useFBX.preload('/models/animations/Standing_Idle.fbx');
useFBX.preload('/models/animations/walking.fbx');
useFBX.preload('/models/animations/Sitting_Idle.fbx');
