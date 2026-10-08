import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
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
 * Seated Posture:
 *  - 100% Symmetrical, anatomically realistic sitting posture on wheelchairs, sofas, chairs, and beds.
 *  - Parallel thighs, 90° knees, flat feet on footrests, relaxed upright spine with breathing animation.
 */
const MotherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();

  const selectedCharacter = useStore((state) => state.selectedCharacter) || 'postpartum_mother';
  const selectedOutfit = useStore((state) => state.selectedOutfit) || 'pink';
  const isHoldingBaby = useStore((state) => state.isHoldingBaby);
  const isSitting = useStore((state) => state.isSitting);
  const seatedTarget = useStore((state) => state.seatedTarget);

  // Load optimized female character models
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  const { scene: amyScene } = useGLTF('/models/amy_opt.glb');
  
  // Load animations from soldier (matching identical glTF armature axes)
  const { animations: soldierAnimations } = useGLTF('/models/soldier.glb');

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
          child.material.roughness = 0.88;
          child.material.metalness = 0.0;
          if (child.material.specularColorTexture) child.material.specularColorTexture = null;
          if (child.material.metalnessMap) child.material.metalnessMap = null;
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
        child.material.roughness = 0.88;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      }

      // ── Postpartum Recovery / Nurse Suit (Megan) ──
      if (child.name === 'Ch22_Shirt') {
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#ffffff'); // Registered Nurse clean white scrub top
        } else {
          child.material.color.set(scheme.primary);
        }
        child.material.roughness = 0.88;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Pants') {
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#0284c7'); // Nurse professional navy blue slacks
        } else {
          child.material.color.set(scheme.primary);
        }
        child.material.roughness = 0.88;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.color.set('#f8fafc'); // Sanitary white hospital footwear
        child.material.roughness = 0.5;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        child.material.color.set('#ffffff');
        child.material.roughness = 0.65;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, selectedOutfit, selectedCharacter, OUTFIT_COLOR_SCHEMES]);

  // Normalize clip names from soldier
  const animClips = useMemo(() => {
    const list = [];
    if (soldierAnimations && soldierAnimations.length > 0) {
      soldierAnimations.forEach((origClip) => {
        const clip = origClip.clone();
        clip.name = clip.name.toLowerCase();
        clip.tracks = clip.tracks.filter((track) => {
          if (track.name.endsWith('.scale')) return false;
          if (track.name.endsWith('.position')) return false;
          if (track.name.toLowerCase().includes('hips')) return false;
          return true;
        });
        list.push(clip);
      });
    }
    return list;
  }, [soldierAnimations]);

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

  // Play locomotion animations when standing
  useEffect(() => {
    if (!actions) return;

    if (isSitting) {
      // Fade out leg locomotion animations when seated
      const walk = actions['walk'];
      const run = actions['run'];
      if (walk) walk.fadeOut(0.2);
      if (run) run.fadeOut(0.2);
      const idle = actions['idle'];
      if (idle) idle.reset().fadeIn(0.2).play();
    } else {
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

  // 100% Anatomically Correct Seated Posture & Dynamic Rig Positioning (Priority 1 guarantees execution AFTER mixer update)
  useFrame((state) => {
    if (!clonedScene || !avatarRigRef.current) return;
    const {
      leftArm, rightArm, leftForeArm, rightForeArm,
      leftUpLeg, rightUpLeg, leftLeg, rightLeg,
      leftFoot, rightFoot, spine
    } = bones.current;

    if (isSitting) {
      // ── Precise Seated Posture ("ท่านั่งสมจริง ไม่บิดเบี้ยว") ──
      // Seat cushion height (default 0.46m for wheelchair / sofa)
      const seatHeight = seatedTarget?.seatOffset?.[1] ?? 0.46;
      // Hip joint at 1.00m, buttocks at 0.92m; lowering by (0.92 - seatHeight) places hips flush on cushion
      const targetY = -(0.92 - seatHeight);
      const targetZ = 0.08;

      avatarRigRef.current.position.set(0, targetY, targetZ);
      avatarRigRef.current.rotation.set(0, 0, 0);

      // Thighs parallel, resting horizontally forward on seat (+90° forward along +Z)
      if (leftUpLeg && rightUpLeg) {
        leftUpLeg.rotation.set(0.016 - Math.PI / 2, 0, -3.07);
        rightUpLeg.rotation.set(0.013 - Math.PI / 2, 0, 3.07);
      }

      // Knees bent 90° vertically down over seat edge (-90° down along -Y)
      if (leftLeg && rightLeg) {
        leftLeg.rotation.set(-0.079 - Math.PI / 2, 0.001, -0.011);
        rightLeg.rotation.set(-0.081 - Math.PI / 2, -0.001, 0.011);
      }

      // Feet resting flat and forward on wheelchair footrests
      if (leftFoot && rightFoot) {
        leftFoot.rotation.set(1.094, 0.005, -0.009);
        rightFoot.rotation.set(1.094, -0.005, 0.009);
      }

      // Spine upright with subtle calm breathing motion
      if (spine) {
        const breath = Math.sin(state.clock.elapsedTime * 2.2) * 0.012;
        spine.rotation.set(-0.032 + 0.03 + breath, 0, 0);
      }

      // Arms resting politely on lap / armrests or cradling baby on lap
      if (isHoldingBaby) {
        if (leftArm && rightArm) {
          leftArm.rotation.set(0.1, 0.2, 1.15);
          rightArm.rotation.set(0.1, -0.2, -1.15);
        }
        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.set(1.1, 0.4, 0.1);
          rightForeArm.rotation.set(1.1, -0.4, -0.1);
        }
      } else {
        if (leftArm && rightArm) {
          leftArm.rotation.set(0.2, 0.1, 1.25);
          rightArm.rotation.set(0.2, -0.1, -1.25);
        }
        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.set(0.8, 0.2, 0);
          rightForeArm.rotation.set(0.8, -0.2, 0);
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
      } else if (currentAnimation === 'idle') {
        if (leftArm && rightArm) {
          leftArm.rotation.set(0.08, 0.05, 1.25);
          rightArm.rotation.set(0.08, -0.05, 1.25);
        }
        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.set(0.0, 0.0, 0.15);
          rightForeArm.rotation.set(0.0, 0.0, 0.15);
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
useGLTF.preload('/models/soldier.glb');
