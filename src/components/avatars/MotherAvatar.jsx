import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useTexture, useFBX } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * MotherAvatar — Authentic Healthcare & Maternity Female Character Suite
 *
 * 100% Female character supporting:
 *  1. 🤰 คุณแม่ตั้งครรภ์ (Pregnant Mother) — อุ้มท้อง ท้องป่องนูนกลมสวยงามสมจริงตามสรีระ (Baby Bump 36-40 wk)
 *  2. 👩‍🍼 คุณแม่หลังคลอด (Postpartum Mother) — มารดาพักฟื้นหลังคลอด สรีระนุ่มนวล พร้อมโหมดอุ้มทารก
 *  3. 👩‍⚕️ พยาบาลวิชาชีพสาว (Registered Nurse & Midwife) — เจ้าหน้าที่พยาบาลสาว สวมหูฟังตรวจ (Stethoscope) และป้ายประจำตัว
 *
 * Supports seamless switching between 6 high-detail hospital & maternity outfits without unbinding bones.
 */
const MotherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();

  const selectedCharacter = useStore((state) => state.selectedCharacter) || 'pregnant_mother';
  const selectedOutfit = useStore((state) => state.selectedOutfit) || 'pink';
  const motherClothing = useStore((state) => state.motherClothing);
  const bellyBump = useStore((state) => state.bellyBump) || '9months';
  const isHoldingBaby = useStore((state) => state.isHoldingBaby);
  const isSitting = useStore((state) => state.isSitting);

  // Load the authentic female character model (Megan - natural human female proportions & face, optimized 4MB)
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  
  // Load animations from soldier (matching identical +Y bone translation axes)
  const { animations: soldierAnimations } = useGLTF('/models/soldier.glb');

  // Load Mixamo authentic female sitting pose
  const sittingFbx = useFBX('/models/animations/Female_Sitting_Pose.fbx');

  // Authentic hospital & maternity recovery robe color schemes
  const OUTFIT_COLOR_SCHEMES = useMemo(() => ({
    pink: {
      shirt: '#f472b6', // Maternity Soft Pink
      pants: '#f472b6', // Matching gown fabric
      badge: 'ชมพูนวลมารดา',
    },
    blue: {
      shirt: '#38bdf8', // Hospital Sky Blue
      pants: '#38bdf8', // Matching gown fabric
      badge: 'ฟ้าครามคนไข้',
    },
    lavender: {
      shirt: '#c084fc', // Pure Lavender
      pants: '#c084fc', // Matching gown fabric
      badge: 'ม่วงลาเวนเดอร์',
    },
    mint: {
      shirt: '#34d399', // Fresh Mint
      pants: '#34d399', // Matching gown fabric
      badge: 'เขียวมิ้นต์สดใส',
    },
    white: {
      shirt: '#f8fafc', // Pure Medical White
      pants: '#f8fafc', // Matching clean white
      badge: 'ขาวบริสุทธิ์คลินิก',
    },
    peach: {
      shirt: '#fb923c', // Sunrise Warm Peach
      pants: '#fb923c', // Matching warm peach
      badge: 'ส้มพีชอบอุ่น',
    },
  }), []);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(meganScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        console.log('MOTHER MESH FOUND:', child.name, 'geometry vertices:', child.geometry?.attributes?.position?.count);
        child.castShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.85;
          child.material.metalness = 0.0;
          if (child.material.specularColorTexture) child.material.specularColorTexture = null;
          if (child.material.metalnessMap) child.material.metalnessMap = null;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [meganScene]);

  // ── Authentic Skinned Maternity Gown (ชุดคลุมยาวทรงหลวม สไตล์คุณแม่หลังคลอด นุ่มนวล ทิ้งตัวสวย) ──
  const maternitySkinnedDress = useMemo(() => {
    // Generous A-line maternity gown skirt falling from under-bust (Y=1.04) to knees (Y=0.56)
    const radiusTop = 0.155;
    const radiusBottom = 0.280;
    const height = 0.48;
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 36, 12, true);
    geo.scale(1.08, 1.0, 0.82); // Natural elliptical human waist & hip curve
    geo.translate(0, 0.80, 0.012);

    // Natural flowing cloth pleats
    const pos = geo.attributes.position;
    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Subtle fabric wave
      const angle = Math.atan2(z, x);
      const pleat = Math.sin(angle * 8) * 0.004 * THREE.MathUtils.clamp((1.04 - y) / 0.48, 0, 1);
      pos.setX(i, x + Math.cos(angle) * pleat);
      pos.setZ(i, z + Math.sin(angle) * pleat);

      // Smooth skinning to Hips (bone 0) and Spine (bone 1)
      const t = THREE.MathUtils.clamp((1.04 - y) / 0.48, 0, 1);
      const wSpine = Math.max(0, 0.40 * (1.0 - t));
      const wHips = 1.0 - wSpine;

      skinIndices.push(0, 1, 0, 0);
      skinWeights.push(wHips, wSpine, 0, 0);
    }
    geo.computeVertexNormals();

    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    const mat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.SkinnedMesh(geo, mat);
    mesh.name = 'MaternitySkinnedDress';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }, []);

  // Bind Maternity Skinned Dress to character skeleton and add to scene
  useEffect(() => {
    if (!clonedScene || !maternitySkinnedDress) return;
    let mainSkinnedMesh = null;
    clonedScene.traverse((child) => {
      if (child.isSkinnedMesh && child.skeleton && !mainSkinnedMesh) {
        mainSkinnedMesh = child;
      }
    });

    if (mainSkinnedMesh && mainSkinnedMesh.skeleton) {
      maternitySkinnedDress.bind(mainSkinnedMesh.skeleton, mainSkinnedMesh.bindMatrix);
      if (mainSkinnedMesh.bindMatrixInverse) {
        maternitySkinnedDress.bindMatrixInverse.copy(mainSkinnedMesh.bindMatrixInverse);
      }
      if (!clonedScene.getObjectByName('MaternitySkinnedDress')) {
        clonedScene.add(maternitySkinnedDress);
      }
    }
  }, [clonedScene, maternitySkinnedDress]);

  // Seamless outfit changing across all 6 maternity & hospital recovery robe colorways
  useEffect(() => {
    if (!clonedScene) return;
    const scheme = OUTFIT_COLOR_SCHEMES[selectedOutfit] || OUTFIT_COLOR_SCHEMES.pink;

    // Synchronize skirt material color & matte hospital fabric finish
    if (maternitySkinnedDress && maternitySkinnedDress.material) {
      if (selectedCharacter === 'nurse') {
        maternitySkinnedDress.visible = false;
      } else {
        maternitySkinnedDress.visible = true;
        maternitySkinnedDress.material.color.set(scheme.shirt);
        maternitySkinnedDress.material.roughness = 0.85;
        maternitySkinnedDress.material.metalness = 0.0;
        maternitySkinnedDress.material.needsUpdate = true;
      }
    }

    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      if (child.name === 'Ch22_Shirt') {
        // Medical scrub / maternity gown top
        child.material.map = null;
        child.material.normalMap = null;
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#ffffff'); // Registered Nurse clean white scrub top
        } else {
          child.material.color.set(scheme.shirt);
        }
        child.material.roughness = 0.85;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Pants') {
        // Matching soft hospital gown tone underneath
        child.material.map = null;
        child.material.normalMap = null;
        if (selectedCharacter === 'nurse') {
          child.material.color.set('#0284c7'); // Nurse professional navy blue slacks
        } else {
          child.material.color.set(scheme.shirt);
        }
        child.material.roughness = 0.85;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.map = null;
        child.material.color.set('#f8fafc'); // Sanitary white hospital footwear
        child.material.roughness = 0.45;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        // Keep Megan's authentic human female facial texture, lips, eyes, and natural skin
        child.material.color.set('#ffffff');
        child.material.roughness = 0.65;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        // Natural Asian brunette / dark brown hair
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, selectedOutfit, selectedCharacter, OUTFIT_COLOR_SCHEMES, maternitySkinnedDress]);

  // ── Professional Nurse Accessories (Stethoscope & Nurse ID Badge) ──
  const nurseAccessories = useMemo(() => {
    const root = new THREE.Group();
    root.name = 'NurseAccessoriesGroup';

    // 1. Stethoscope around neck
    const stethGroup = new THREE.Group();
    stethGroup.position.set(0, 0.04, 0.02);

    // Silicone neck tube (torus)
    const torusGeo = new THREE.TorusGeometry(0.082, 0.008, 12, 28, Math.PI * 0.92);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.1 });
    const neckTorus = new THREE.Mesh(torusGeo, tubeMat);
    neckTorus.rotation.x = Math.PI / 2.3;
    stethGroup.add(neckTorus);

    // Left tube
    const leftTubeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.15, 12);
    const leftTube = new THREE.Mesh(leftTubeGeo, tubeMat);
    leftTube.position.set(-0.065, -0.06, 0.07);
    leftTube.rotation.z = 0.22;
    stethGroup.add(leftTube);

    // Right tube
    const rightTubeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.15, 12);
    const rightTube = new THREE.Mesh(rightTubeGeo, tubeMat);
    rightTube.position.set(0.065, -0.06, 0.07);
    rightTube.rotation.z = -0.22;
    stethGroup.add(rightTube);

    // Chrome diaphragm disc
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

    // Clip
    const clipGeo = new THREE.BoxGeometry(0.016, 0.01, 0.006);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clip.position.set(0, 0.035, 0);
    badgeGroup.add(clip);

    // Card
    const cardGeo = new THREE.BoxGeometry(0.046, 0.062, 0.003);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const card = new THREE.Mesh(cardGeo, cardMat);
    badgeGroup.add(card);

    // Medical Red Cross
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

  // Attach Nurse accessories to Spine2
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
        spine2Bone.add(nurseAccessories);
      } else {
        spine2Bone.remove(nurseAccessories);
      }
    }
  }, [clonedScene, selectedCharacter, nurseAccessories]);

  // Normalize clip names and retarget Mixamo FBX animations to match megan_opt.glb skeleton
  const animClips = useMemo(() => {
    const list = [];
    if (soldierAnimations && soldierAnimations.length > 0) {
      soldierAnimations.forEach((origClip) => {
        const clip = origClip.clone();
        clip.name = clip.name.toLowerCase();
        clip.tracks = clip.tracks.filter((track) => {
          if (track.name.endsWith('.scale')) return false;
          if (track.name.endsWith('.position')) return false;
          if (track.name.toLowerCase().includes('hips')) return false; // Keep root upright in GLTF space
          return true;
        });
        list.push(clip);
      });
    }

    // Retarget authentic Mixamo Female Sitting Pose
    if (sittingFbx && sittingFbx.animations && sittingFbx.animations.length > 0) {
      const origSit = sittingFbx.animations[0].clone();
      origSit.name = 'sitting';
      const retargetedTracks = [];
      origSit.tracks.forEach((track) => {
        if (track.name.endsWith('.scale')) return;
        if (track.name.endsWith('.position')) return; // Strip translation tracks so rig height is cleanly controlled
        if (track.name.toLowerCase().includes('hips')) return; // Prevent double-rotation flip from Mixamo FBX root

        // Ensure bone name matches clonedScene node names (mixamorig...)
        let newName = track.name.replace(/^mixamorig:/, 'mixamorig');

        const newTrack = track.clone();
        newTrack.name = newName;
        retargetedTracks.push(newTrack);
      });
      origSit.tracks = retargetedTracks;
      list.push(origSit);
    }

    return list;
  }, [soldierAnimations, sittingFbx]);

  // Bind animations directly to character rig
  const { actions } = useAnimations(animClips, clonedScene);

  // Find and store arm & leg bones for cradling or natural posing
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
        if (child.name.includes('Spine') && !child.name.includes('Spine1') && !child.name.includes('Spine2')) b.spine = child;
      }
    });
    bones.current = b;
    window.__avatarBones = b;
  }, [clonedScene]);

  // Expose bone search & group for external attachment
  useImperativeHandle(ref, () => ({
    getBone: (name) => {
      let found = null;
      clonedScene.traverse((child) => {
        if (child.isBone && child.name.toLowerCase().includes(name.toLowerCase())) {
          found = child;
        }
      });
      return found;
    },
    group: group.current,
  }));

  // Play natural animations immediately on mount & when state changes
  useEffect(() => {
    if (!actions) return;

    let animName = currentAnimation.toLowerCase();
    if (isSitting) {
      animName = 'sitting';
    }

    const act = actions[animName] || actions['idle'] || Object.values(actions)[0];

    if (act) {
      Object.values(actions).forEach((a) => {
        if (a !== act) a.fadeOut(0.25);
      });
      act.reset().fadeIn(0.25).play();
    }
  }, [currentAnimation, isSitting, actions]);

  // Procedural posture adjustments in useFrame
  useFrame(() => {
    if (!clonedScene) return;
    const { leftArm, rightArm, leftForeArm, rightForeArm } = bones.current;
    if (!leftArm || !rightArm) return;

    if (isSitting) {
      // ── Realistic Seated Posture on Wheelchair / Chair / Sofa ("นั่งเนียนๆ ไม่ทะลุ") ──
      // The authentic Mixamo sitting animation naturally places hips, thighs, knees, and hands on lap.
      if (avatarRigRef.current) {
        avatarRigRef.current.position.set(0, 0.08, 0.10);
        avatarRigRef.current.rotation.set(0, 0, 0);
      }

      if (isHoldingBaby) {
        // Cradling baby while seated
        leftArm.rotation.set(0.65, 0.35, 0.75);
        rightArm.rotation.set(-0.65, -0.35, 0.75);
        if (leftForeArm) leftForeArm.rotation.set(-1.15, 0.3, 0.2);
        if (rightForeArm) rightForeArm.rotation.set(1.15, -0.3, -0.2);
      }
    } else {
      // ── Standing / Walking Posture ──
      if (avatarRigRef.current) {
        avatarRigRef.current.position.set(0, 0, 0);
        avatarRigRef.current.rotation.set(0, 0, 0);
      }

      if (isHoldingBaby) {
        // Loving baby cradling
        leftArm.rotation.set(0.6, 0.3, 0.8);
        rightArm.rotation.set(-0.6, -0.3, 0.8);
        if (leftForeArm) leftForeArm.rotation.set(-1.2, 0.3, 0.2);
        if (rightForeArm) rightForeArm.rotation.set(1.2, -0.3, -0.2);
      } else if (currentAnimation === 'idle') {
        // Natural polite resting arms alongside torso ("มือแนบลำตัว สุภาพ นุ่มนวล")
        leftArm.rotation.set(0.08, 0.05, 1.25);
        rightArm.rotation.set(0.08, -0.05, 1.25);
        if (leftForeArm) leftForeArm.rotation.set(0.0, 0.0, 0.15);
        if (rightForeArm) rightForeArm.rotation.set(0.0, 0.0, 0.15);
      }
    }
  });

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
useGLTF.preload('/models/soldier.glb');
