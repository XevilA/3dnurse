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
 * Builds a rigged THREE.SkinnedMesh A-Line Midi Dress Skirt (+ Waist Sash Belt)
 * AND anatomically tapered bare female lower legs (`Ch22_BareLegs`) bound directly
 * to Megan's `Ch22_Pants.skeleton` so `Ch22_Pants` can be 100% hidden in dress/nurse modes.
 */
function createSkinnedDressMeshes(pantsMesh, bodyMesh, { isNurse = false } = {}) {
  const skeleton = pantsMesh.skeleton;
  const bones = skeleton.bones;

  const findIdx = (substr, exclude = null) => {
    const idx = bones.findIndex(
      (b) => b.name.includes(substr) && (!exclude || !b.name.includes(exclude))
    );
    return idx >= 0 ? idx : 0;
  };

  const bHips = findIdx('Hips');
  const bSpine = findIdx('Spine', 'Spine1');
  const bLUp = findIdx('LeftUpLeg');
  const bRUp = findIdx('RightUpLeg');
  const bLLeg = findIdx('LeftLeg');
  const bRLeg = findIdx('RightLeg');
  const bLFoot = findIdx('LeftFoot');
  const bRFoot = findIdx('RightFoot');

  // Determine whether LeftUpLeg sits on +X or -X in bind space
  const lMat = skeleton.boneInverses[bLUp]
    ? skeleton.boneInverses[bLUp].clone().invert()
    : new THREE.Matrix4();
  const leftSign = lMat.elements[12] >= 0 ? 1 : -1;

  const topY = 1.135;
  const hemY = isNurse ? 0.42 : 0.35; // Knee-length clinical nurse dress vs midi postpartum dress
  const flareX = isNurse ? 0.255 : 0.305;
  const flareZ = isNurse ? 0.205 : 0.235;

  const radialSegs = 36;
  const heightSegs = 14;
  const positions = [];
  const normals = [];
  const uvs = [];
  const skinIndices = [];
  const skinWeights = [];
  const indices = [];

  for (let r = 0; r <= heightSegs; r++) {
    const t = r / heightSegs; // 0 = waist, 1 = hem
    const y = topY + (hemY - topY) * t;
    const ease = Math.pow(t, 0.86);

    const cz = 0.066 * Math.pow(1 - t, 2.1) - 0.006 * t;
    const rx = 0.134 + (flareX - 0.134) * ease;
    const rz = 0.118 + (flareZ - 0.118) * ease;

    for (let s = 0; s <= radialSegs; s++) {
      const u = s / radialSegs;
      const theta = u * Math.PI * 2;
      const pleat = 1 + Math.sin(theta * 12) * (isNurse ? 0.012 : 0.024) * t * t;

      const x = Math.sin(theta) * rx * pleat;
      const z = cz + Math.cos(theta) * rz * pleat;

      positions.push(x, y, z);

      const nx = Math.sin(theta) * rz;
      const nz = Math.cos(theta) * rx;
      const ny = 0.18;
      const nLen = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / nLen, ny / nLen, nz / nLen);
      uvs.push(u, 1 - t);

      // Compute smooth anatomical bone weights so skirt drapes cleanly over lap & knees when seated
      if (y >= 1.02) {
        const wSpine = Math.min(0.65, ((y - 1.02) / 0.12) * 0.65);
        skinIndices.push(bHips, bSpine, 0, 0);
        skinWeights.push(1 - wSpine, wSpine, 0, 0);
      } else {
        const legTotal = Math.min(0.96, Math.pow((1.02 - y) / (1.02 - hemY), 0.55) * 0.96);
        const wHips = 1 - legTotal;
        // Smooth left-right crossfade across center seam so skirt never splits
        const sideRatio = THREE.MathUtils.clamp(0.5 + (x * leftSign) / 0.22, 0.08, 0.92);
        const kneeBlend =
          y < 0.58 ? THREE.MathUtils.clamp((0.58 - y) / (0.58 - hemY), 0, 1) * 0.82 : 0;

        const wLTotal = legTotal * sideRatio;
        const wRTotal = legTotal * (1 - sideRatio);

        if (kneeBlend > 0.01) {
          const domUp = sideRatio >= 0.5 ? bLUp : bRUp;
          const domLeg = sideRatio >= 0.5 ? bLLeg : bRLeg;
          const otherUp = sideRatio >= 0.5 ? bRUp : bLUp;
          const otherLeg = sideRatio >= 0.5 ? bRLeg : bLLeg;
          const domW = Math.max(wLTotal, wRTotal);
          const othW = Math.min(wLTotal, wRTotal);
          // Normalize across dominant thigh/shin + opposite leg + hips (4 bones max)
          const w1 = wHips + othW * (1 - kneeBlend);
          const w2 = domW * (1 - kneeBlend);
          const w3 = domW * kneeBlend;
          const w4 = othW * kneeBlend;
          const sum = w1 + w2 + w3 + w4 || 1;
          skinIndices.push(wHips >= othW * (1 - kneeBlend) ? bHips : otherUp, domUp, domLeg, otherLeg);
          skinWeights.push(w1 / sum, w2 / sum, w3 / sum, w4 / sum);
        } else {
          skinIndices.push(bHips, bLUp, bRUp, 0);
          skinWeights.push(wHips, wLTotal, wRTotal, 0);
        }
      }
    }
  }

  const rowStride = radialSegs + 1;
  for (let r = 0; r < heightSegs; r++) {
    for (let s = 0; s < radialSegs; s++) {
      const a = r * rowStride + s;
      const b = a + rowStride;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d, b, c, d);
    }
  }

  const skirtGeo = new THREE.BufferGeometry();
  skirtGeo.setIndex(indices);
  skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  skirtGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  skirtGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  skirtGeo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  skirtGeo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

  const skirtMat = new THREE.MeshStandardMaterial({
    color: '#f472b6',
    roughness: 0.88,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const skirtMesh = new THREE.SkinnedMesh(skirtGeo, skirtMat);
  skirtMesh.name = 'Ch22_DressSkirt';
  skirtMesh.castShadow = true;
  skirtMesh.receiveShadow = true;
  skirtMesh.frustumCulled = false;

  // Slim waist belt / sash bound to Hips + Spine
  const beltPos = [];
  const beltNorm = [];
  const beltSkinIdx = [];
  const beltSkinW = [];
  const beltIndices = [];
  const beltTop = 1.148;
  const beltBot = 1.112;
  for (let r = 0; r <= 1; r++) {
    const by = r === 0 ? beltTop : beltBot;
    for (let s = 0; s <= radialSegs; s++) {
      const theta = (s / radialSegs) * Math.PI * 2;
      const bx = Math.sin(theta) * 0.137;
      const bz = 0.066 + Math.cos(theta) * 0.121;
      beltPos.push(bx, by, bz);
      beltNorm.push(Math.sin(theta), 0, Math.cos(theta));
      beltSkinIdx.push(bHips, bSpine, 0, 0);
      beltSkinW.push(0.45, 0.55, 0, 0);
    }
  }
  for (let s = 0; s < radialSegs; s++) {
    const a = s;
    const b = s + rowStride;
    const c = b + 1;
    const d = a + 1;
    beltIndices.push(a, b, d, b, c, d);
  }
  const beltGeo = new THREE.BufferGeometry();
  beltGeo.setIndex(beltIndices);
  beltGeo.setAttribute('position', new THREE.Float32BufferAttribute(beltPos, 3));
  beltGeo.setAttribute('normal', new THREE.Float32BufferAttribute(beltNorm, 3));
  beltGeo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(beltSkinIdx, 4));
  beltGeo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(beltSkinW, 4));

  const beltMat = new THREE.MeshStandardMaterial({
    color: '#ec4899',
    roughness: 0.78,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const beltMesh = new THREE.SkinnedMesh(beltGeo, beltMat);
  beltMesh.name = 'Ch22_DressBelt';
  beltMesh.castShadow = true;
  beltMesh.frustumCulled = false;

  // Anatomically tapered bare female calves & ankles (`Ch22_BareLegs`) from knee down to ankle cuff
  // Replaces baggy `Ch22_Pants` completely when wearing a dress so there are zero inner pants!
  const legStations = [
    // [y, cxAbs, cz, rx, rz, wUp, wLeg, wFoot]
    [0.548, 0.1180, -0.0022, 0.002, 0.002, 0.22, 0.78, 0.00], // closed top cap tucked above knee inside dress
    [0.545, 0.1182, -0.0024, 0.044, 0.045, 0.20, 0.80, 0.00],
    [0.524, 0.1196, -0.0030, 0.045, 0.046, 0.06, 0.94, 0.00], // knee joint
    [0.465, 0.1232, -0.0088, 0.043, 0.045, 0.00, 1.00, 0.00], // upper shin
    [0.395, 0.1275, -0.0175, 0.046, 0.050, 0.00, 1.00, 0.00], // natural calf curve
    [0.310, 0.1328, -0.0245, 0.041, 0.044, 0.00, 1.00, 0.00], // mid-lower calf taper
    [0.220, 0.1384, -0.0300, 0.035, 0.037, 0.00, 0.95, 0.05], // slim lower leg
    [0.140, 0.1434, -0.0325, 0.032, 0.034, 0.00, 0.82, 0.18], // slim ankle above shoe
    [0.086, 0.1467, -0.0330, 0.033, 0.034, 0.00, 0.50, 0.50], // seamless match with Ch22_Body ankle cuff
    [0.062, 0.1475, -0.0350, 0.031, 0.032, 0.00, 0.20, 0.80], // tucked inside shoe/foot
  ];
  const legRadSegs = 20;
  const legStride = legRadSegs + 1;
  const legPos = [];
  const legNorm = [];
  const legUvs = [];
  const legSkinIdx = [];
  const legSkinW = [];
  const legIndices = [];

  [-1, 1].forEach((sideSign, legIdx) => {
    const isLeft = sideSign === leftSign;
    const bUp = isLeft ? bLUp : bRUp;
    const bLeg = isLeft ? bLLeg : bRLeg;
    const bFoot = isLeft ? bLFoot : bRFoot;
    const baseVertex = legIdx * legStations.length * legStride;

    legStations.forEach(([ly, cxAbs, cz, rx, rz, wUp, wLeg, wFoot], rIdx) => {
      const vCoord = rIdx / (legStations.length - 1);
      const cx = sideSign * cxAbs;
      for (let s = 0; s <= legRadSegs; s++) {
        const uCoord = s / legRadSegs;
        const theta = uCoord * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        // Subtle shin-front vs calf-back organic contour
        const shinContour = cosT > 0 ? 1 - 0.06 * cosT : 1 + 0.04 * (-cosT);
        const px = cx + sinT * rx;
        const pz = cz + cosT * rz * shinContour;
        legPos.push(px, ly, pz);

        if (rIdx === 0) {
          legNorm.push(0, 1, 0);
        } else {
          const nLen = Math.hypot(sinT * rz, cosT * rx) || 1;
          legNorm.push((sinT * rz) / nLen, 0.04, (cosT * rx) / nLen);
        }
        // Map UVs directly inside Ch22_Body's clean ankle skin patch [0.86..0.96, 0.725..0.750]
        legUvs.push(0.86 + uCoord * 0.10, 0.725 + vCoord * 0.025);
        legSkinIdx.push(bUp, bLeg, bFoot, 0);
        legSkinW.push(wUp, wLeg, wFoot, 0);
      }
    });

    for (let r = 0; r < legStations.length - 1; r++) {
      for (let s = 0; s < legRadSegs; s++) {
        const a = baseVertex + r * legStride + s;
        const b = a + legStride;
        const c = b + 1;
        const d = a + 1;
        legIndices.push(a, b, d, b, c, d);
      }
    }
  });

  const bareLegsGeo = new THREE.BufferGeometry();
  bareLegsGeo.setIndex(legIndices);
  bareLegsGeo.setAttribute('position', new THREE.Float32BufferAttribute(legPos, 3));
  bareLegsGeo.setAttribute('normal', new THREE.Float32BufferAttribute(legNorm, 3));
  bareLegsGeo.setAttribute('uv', new THREE.Float32BufferAttribute(legUvs, 2));
  bareLegsGeo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(legSkinIdx, 4));
  bareLegsGeo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(legSkinW, 4));

  const bareLegsMat = new THREE.MeshStandardMaterial({
    map: bodyMesh?.material?.map || null,
    color: '#f5d0a9',
    roughness: 0.75,
    metalness: 0.0,
  });
  const bareLegsMesh = new THREE.SkinnedMesh(bareLegsGeo, bareLegsMat);
  bareLegsMesh.name = 'Ch22_BareLegs';
  bareLegsMesh.castShadow = true;
  bareLegsMesh.receiveShadow = true;
  bareLegsMesh.frustumCulled = false;

  if (pantsMesh.parent) {
    pantsMesh.parent.add(skirtMesh);
    pantsMesh.parent.add(beltMesh);
    pantsMesh.parent.add(bareLegsMesh);
  }
  skirtMesh.bind(skeleton, pantsMesh.bindMatrix.clone());
  beltMesh.bind(skeleton, pantsMesh.bindMatrix.clone());
  bareLegsMesh.bind(skeleton, pantsMesh.bindMatrix.clone());

  return { skirtMesh, beltMesh, bareLegsMesh };
}

/**
 * MotherAvatar — Authentic Healthcare & Postpartum Female Character Suite
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
  barefoot = false,
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();
  const heldBabyRef = useRef();

  const storeCharacter = useStore((state) => state.selectedCharacter) || 'postpartum_mother';
  const storeOutfit = useStore((state) => state.selectedOutfit) || 'pink';
  const storeHoldingBaby = useStore((state) => state.isHoldingBaby);
  const storeSitting = useStore((state) => state.isSitting);
  const seatedTarget = useStore((state) => state.seatedTarget);

  const rawCharacter = characterOverride !== null ? characterOverride : storeCharacter;
  const selectedCharacter = rawCharacter === 'pregnant_mother' ? 'postpartum_dress' : rawCharacter;
  const selectedOutfit = outfitOverride !== null ? outfitOverride : storeOutfit;
  const isHoldingBaby = isHoldingBabyOverride !== null ? isHoldingBabyOverride : storeHoldingBaby;
  const isSitting = isSittingOverride !== null ? isSittingOverride : storeSitting;

  // Load optimized female character model (100% postpartum anatomy — no pregnant belly bump)
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');

  // Load authentic Mixamo female animations
  const idleFbx = useFBX('/models/animations/Standing_Idle.fbx');
  const walkFbx = useFBX('/models/animations/walking.fbx');

  // Authentic hospital & postpartum color schemes
  const OUTFIT_COLOR_SCHEMES = useMemo(() => ({
    pink: {
      primary: '#f472b6',
      belt: '#db2777',
      badge: 'ชมพูนวลมารดา',
    },
    blue: {
      primary: '#38bdf8',
      belt: '#0284c7',
      badge: 'ฟ้าครามคนไข้',
    },
    lavender: {
      primary: '#c084fc',
      belt: '#9333ea',
      badge: 'ม่วงลาเวนเดอร์',
    },
    mint: {
      primary: '#34d399',
      belt: '#059669',
      badge: 'เขียวมิ้นต์สดใส',
    },
    white: {
      primary: '#f8fafc',
      belt: '#cbd5e1',
      badge: 'ขาวบริสุทธิ์คลินิก',
    },
    peach: {
      primary: '#fb923c',
      belt: '#ea580c',
      badge: 'ส้มพีชอบอุ่น',
    },
  }), []);

  const isMaternityDress = false;
  const isNurse = selectedCharacter === 'nurse';
  const isDressStyle = selectedCharacter === 'postpartum_dress' || isNurse;

  // Clone active scene cleanly and attach rigged dress skirt + bare calves when in dress or nurse mode
  const clonedScene = useMemo(() => {
    if (!meganScene) return null;
    const clone = SkeletonUtils.clone(meganScene);
    let pantsMesh = null;
    let bodyMesh = null;
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name === 'Ch22_Pants' && child.isSkinnedMesh) {
          pantsMesh = child;
        }
        if (child.name === 'Ch22_Body' && child.isSkinnedMesh) {
          bodyMesh = child;
        }
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
    if (pantsMesh && isDressStyle) {
      createSkinnedDressMeshes(pantsMesh, bodyMesh, { isNurse });
      pantsMesh.visible = false;
    }
    return clone;
  }, [meganScene, isDressStyle, isNurse]);

  // ── 1. Official Thai Registered Nurse Cap (หมวกพยาบาลวิชาชีพสีขาวแถบกรมท่า) ──
  // Note: Megan's Armature has scale = 0.01, so bone-attached groups MUST use scale = 100!
  const nurseCapGroup = useMemo(() => {
    const capRoot = new THREE.Group();
    capRoot.name = 'NurseCapGroup';
    capRoot.scale.set(100, 100, 100);
    // HeadTop_End is at [0, +21.3cm, +1.1cm] in Head bone space -> [0, 0.184m, -0.008m] sits snugly on crown of hair
    capRoot.position.set(0, 18.2, -0.4);
    capRoot.rotation.set(-0.14, 0, 0);

    const whiteCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.02 });
    const navyStripeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });

    // Base crown band sitting on hair
    const baseCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.078, 0.036, 24), whiteCapMat);
    baseCrown.position.set(0, 0.005, -0.006);
    capRoot.add(baseCrown);

    // Classic Thai Nurse folded winged front brim
    const frontWing = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.062, 0.022), whiteCapMat);
    frontWing.position.set(0, 0.024, 0.056);
    frontWing.rotation.x = -0.18;
    frontWing.castShadow = true;
    capRoot.add(frontWing);

    // Angled side wings folding back
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.052, 0.115), whiteCapMat);
    leftWing.position.set(-0.084, 0.018, 0.006);
    leftWing.rotation.set(0.08, 0.18, 0.15);
    capRoot.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.052, 0.115), whiteCapMat);
    rightWing.position.set(0.084, 0.018, 0.006);
    rightWing.rotation.set(0.08, -0.18, -0.15);
    capRoot.add(rightWing);

    // Registered Nurse Dark Navy Velvet Rank Stripe across front wing
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.148, 0.013, 0.025), navyStripeMat);
    stripe.position.set(0, 0.036, 0.058);
    stripe.rotation.x = -0.18;
    capRoot.add(stripe);

    // Small Medical Cross Emblem
    const cH = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.005, 0.004), crossMat);
    cH.position.set(0, 0.016, 0.069);
    cH.rotation.x = -0.18;
    capRoot.add(cH);
    const cV = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.016, 0.004), crossMat);
    cV.position.set(0, 0.016, 0.069);
    cV.rotation.x = -0.18;
    capRoot.add(cV);

    return capRoot;
  }, []);

  // ── 2. Professional Nurse Accessories (Peter Pan Collar, Stethoscope & Nurse ID Badge) ──
  const nurseAccessories = useMemo(() => {
    const root = new THREE.Group();
    root.name = 'NurseAccessoriesGroup';
    root.scale.set(100, 100, 100); // Compensate for Armature 0.01 scale

    // Crisp Clinical Sky-Blue Trim Collar + Stethoscope around neck (Spine2 bone space)
    const stethGroup = new THREE.Group();
    stethGroup.position.set(0, 0.135, 0.015);

    const collarMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.35 });
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.014, 12, 28, Math.PI * 1.15), collarMat);
    collar.rotation.set(Math.PI / 2 + 0.18, 0, Math.PI * 0.92);
    stethGroup.add(collar);

    const torusGeo = new THREE.TorusGeometry(0.084, 0.0075, 12, 28, Math.PI * 0.92);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.15 });
    const neckTorus = new THREE.Mesh(torusGeo, tubeMat);
    neckTorus.rotation.x = Math.PI / 2.3;
    stethGroup.add(neckTorus);

    const leftTubeGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.15, 12);
    const leftTube = new THREE.Mesh(leftTubeGeo, tubeMat);
    leftTube.position.set(-0.065, -0.065, 0.072);
    leftTube.rotation.z = 0.22;
    stethGroup.add(leftTube);

    const rightTubeGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.15, 12);
    const rightTube = new THREE.Mesh(rightTubeGeo, tubeMat);
    rightTube.position.set(0.065, -0.065, 0.072);
    rightTube.rotation.z = -0.22;
    stethGroup.add(rightTube);

    const discGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.007, 24);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    const disc = new THREE.Mesh(discGeo, chromeMat);
    disc.position.set(-0.042, -0.148, 0.098);
    disc.rotation.x = Math.PI / 2 - 0.2;
    stethGroup.add(disc);

    root.add(stethGroup);

    // Nurse ID Badge on Left Chest
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(0.078, 0.045, 0.125);
    badgeGroup.rotation.set(-0.08, 0.12, -0.04);

    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.01, 0.006),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 })
    );
    clip.position.set(0, 0.034, 0);
    badgeGroup.add(clip);

    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.048, 0.064, 0.004),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    badgeGroup.add(card);

    const headerStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.044, 0.014),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    headerStrip.position.set(0, 0.02, 0.0025);
    badgeGroup.add(headerStrip);

    const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const c1 = new THREE.Mesh(new THREE.PlaneGeometry(0.018, 0.0055), crossMat);
    c1.position.set(0, -0.01, 0.0025);
    badgeGroup.add(c1);
    const c2 = new THREE.Mesh(new THREE.PlaneGeometry(0.0055, 0.018), crossMat);
    c2.position.set(0, -0.01, 0.0028);
    badgeGroup.add(c2);

    root.add(badgeGroup);
    return root;
  }, []);

  // Attach Nurse Cap to Head bone & Nurse Accessories to Spine2 bone when character is nurse
  useEffect(() => {
    if (!clonedScene) return;
    let spine2Bone = null;
    let headBone = null;
    clonedScene.traverse((child) => {
      if (child.isBone) {
        if (child.name.includes('Spine2')) spine2Bone = child;
        if (child.name.includes('Head') && !child.name.includes('Top')) headBone = child;
      }
    });

    if (spine2Bone) {
      if (isNurse) {
        if (!spine2Bone.getObjectByName('NurseAccessoriesGroup')) {
          spine2Bone.add(nurseAccessories);
        }
      } else {
        const existing = spine2Bone.getObjectByName('NurseAccessoriesGroup');
        if (existing) spine2Bone.remove(existing);
      }
    }

    if (headBone) {
      if (isNurse) {
        if (!headBone.getObjectByName('NurseCapGroup')) {
          headBone.add(nurseCapGroup);
        }
      } else {
        const existingCap = headBone.getObjectByName('NurseCapGroup');
        if (existingCap) headBone.remove(existingCap);
      }
    }
  }, [clonedScene, isNurse, nurseAccessories, nurseCapGroup]);

  // Seamless outfit changing across all 6 postpartum colorways (Pants Set, Midi Dress, and Nurse Uniform)
  useEffect(() => {
    if (!clonedScene) return;
    const scheme = OUTFIT_COLOR_SCHEMES[selectedOutfit] || OUTFIT_COLOR_SCHEMES.pink;

    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      if (child.name === 'Ch22_Shirt') {
        child.material.map = null;
        child.material.normalMap = null;
        child.material.color.set(isNurse ? '#ffffff' : scheme.primary);
        child.material.roughness = isNurse ? 0.72 : 0.9;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_DressSkirt') {
        child.visible = isDressStyle;
        child.material.color.set(isNurse ? '#ffffff' : scheme.primary);
        child.material.roughness = isNurse ? 0.72 : 0.88;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_DressBelt') {
        child.visible = isDressStyle;
        child.material.color.set(isNurse ? '#38bdf8' : scheme.belt);
        child.material.roughness = 0.75;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_BareLegs') {
        child.visible = isDressStyle;
        child.material.color.set('#f5d0a9');
        child.material.roughness = 0.75;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Pants') {
        // 100% hide inner trousers when wearing any dress (postpartum_dress or nurse)
        child.visible = !isDressStyle;
        child.material.map = null;
        child.material.normalMap = null;
        child.material.color.set(scheme.primary);
        child.material.roughness = 0.92;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.map = null;
        child.material.normalMap = null;
        child.material.color.set(barefoot ? '#b97e58' : '#f8fafc');
        child.material.roughness = barefoot ? 0.78 : 0.55;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        child.material.color.set('#f5d0a9'); // warm skin tone
        child.material.roughness = 0.75;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, selectedOutfit, isNurse, isDressStyle, barefoot, OUTFIT_COLOR_SCHEMES]);

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

      // 2. Proper upright chair/sofa seated pose derived from Standing_Idle (faces straight forward, thighs on top of cushion, calves in front of seat)
      const cSitBase = idleFbx.animations[0].clone();
      cSitBase.name = 'idle_base_for_sit';
      cSitBase.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      cSitBase.tracks = cSitBase.tracks.filter((t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye'));
      fixHips(cSitBase, idleFbx);

      const seatedOverrides = {
        'mixamorigLeftUpLeg.quaternion':     new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.02,  0.00,  Math.PI - 0.09, 'XYZ')),
        'mixamorigRightUpLeg.quaternion':    new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.02,  0.00, -Math.PI + 0.09, 'XYZ')),
        'mixamorigLeftLeg.quaternion':       new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.24,  0.00,  0.00, 'XYZ')),
        'mixamorigRightLeg.quaternion':      new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.24,  0.00,  0.00, 'XYZ')),
        'mixamorigLeftFoot.quaternion':      new THREE.Quaternion().setFromEuler(new THREE.Euler( 0.92,  0.00,  0.00, 'XYZ')),
        'mixamorigRightFoot.quaternion':     new THREE.Quaternion().setFromEuler(new THREE.Euler( 0.92,  0.00,  0.00, 'XYZ')),
        'mixamorigLeftShoulder.quaternion':  new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.575, -0.052, -1.42, 'XYZ')),
        'mixamorigRightShoulder.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.574, -0.001,  1.46, 'XYZ')),
        'mixamorigLeftArm.quaternion':       new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.22,  0.38,  0.05, 'XYZ')),
        'mixamorigRightArm.quaternion':      new THREE.Quaternion().setFromEuler(new THREE.Euler( 1.22, -0.38, -0.05, 'XYZ')),
        'mixamorigLeftForeArm.quaternion':   new THREE.Quaternion().setFromEuler(new THREE.Euler( 0.42,  0.28,  0.85, 'XYZ')),
        'mixamorigRightForeArm.quaternion':  new THREE.Quaternion().setFromEuler(new THREE.Euler( 0.42, -0.28, -0.85, 'XYZ')),
      };
      const sit = applyBoneOverrides(cSitBase, 'sitting', seatedOverrides);
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
  }, [idleFbx, walkFbx, clonedScene]);

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
      const activeSeat = isSittingOverride !== null ? null : seatedTarget;
      const seatHeight = activeSeat?.seatOffset?.[1] ?? 0.46;
      const hipBoneHeight = activeSeat?.type === 'wheelchair' ? 0.83 : 0.86;
      const targetY = Math.max(-(hipBoneHeight - seatHeight), -0.44);
      const targetZ =
        activeSeat?.type === 'bed'
          ? 0.14
          : activeSeat?.type === 'sofa'
            ? 0.14
            : activeSeat?.type === 'wheelchair'
              ? 0.09
              : 0.12;
      avatarRigRef.current.position.set(0, targetY, targetZ);
      avatarRigRef.current.rotation.set(0, 0, 0);
    } else {
      avatarRigRef.current.position.set(0, 0, 0);
      avatarRigRef.current.rotation.set(0, 0, 0);
    }

    // 3. Anatomically Accurate Maternal Baby-Cradling Animation & Forearm-Cradled Baby Synchronization
    if (isHoldingBaby) {
      const t = state.clock.elapsedTime;
      const rock = Math.sin(t * 2.1) * 0.035;
      const breath = Math.sin(t * 1.8) * 0.02;

      if (leftShoulder && rightShoulder) {
        leftShoulder.rotation.set(1.575, -0.052, -1.42);
        rightShoulder.rotation.set(1.574, -0.001, 1.46);
      }
      if (leftArm && rightArm) {
        leftArm.rotation.set(0.96 + breath, 0.48 + rock * 0.4, 0.36);
        rightArm.rotation.set(1.02 + breath, -0.48 + rock * 0.4, -0.34);
      }
      if (leftForeArm && rightForeArm) {
        leftForeArm.rotation.set(0.18, 0.25, 1.52 + rock * 0.5);
        rightForeArm.rotation.set(0.18, -0.25, -1.48 - rock * 0.5);
      }
      if (leftHand && rightHand) {
        leftHand.rotation.set(0.22, -0.30, 0.18);
        rightHand.rotation.set(0.22, 0.30, -0.18);
      }

      // Lock held baby snugly onto the top of the mother's cradling forearms against her chest
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

        heldBabyRef.current.position.set(midX, midY + 0.035, midZ - 0.025);
        heldBabyRef.current.rotation.set(breath * 0.5, rock * 0.7, rock * 0.4);
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <group ref={avatarRigRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} rotation={[0, 0, 0]} />

        {/* Real Rigged 3D Newborn Infant nestled directly in Mother's Cradling Hands (mounted on-demand when holding baby to save 52k skinned vertices on mobile) */}
        {showHeldBaby && isHoldingBabyOverride !== false && Boolean(isHoldingBaby) && (
          <group
            ref={heldBabyRef}
            position={[0, 1.165, 0.235]}
          >
            <BabyAvatar
              pose="carried"
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1.0}
              active={true}
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
useFBX.preload('/models/animations/Standing_Idle.fbx');
useFBX.preload('/models/animations/walking.fbx');
