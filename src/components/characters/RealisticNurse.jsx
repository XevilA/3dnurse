import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

/**
 * RealisticNurse Component
 * Authentic 3D Human Registered Nurse Character:
 * - Real rigged female 3D human model (Megan) with natural face, eyes, hair, and skin textures
 * - Authentic hospital scrub dress uniform (Pastel Rose Pink or Soft Medical Sky Blue)
 * - Crisp white Peter Pan nurse collar and sleeve cuffs
 * - Official Thai Registered Nurse Cap (หมวกพยาบาลสีขาวแถบน้ำเงินเข้ม)
 * - Stethoscope around neck and Nurse ID Badge on left chest
 * - Natural breathing idle animation with phase offset
 * - Realistic arm poses behind reception desk
 */
export default function RealisticNurse({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  uniformColor = 'pink', // 'pink' | 'blue'
  hasStethoscope = false,
  timeOffset = 0,
  armPose = 'desk', // 'desk' | 'typing' | 'welcoming'
  nurseName = 'พว. อารียา',
}) {
  const groupRef = useRef();

  // Load realistic female model (4.1MB, rigged human female)
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  // Load authentic female standing idle animation
  const idleFbx = useFBX('/models/animations/Standing_Idle.fbx');

  // Clone scene with SkeletonUtils to support independent instances
  const clonedScene = useMemo(() => {
    if (!meganScene) return null;
    const clone = SkeletonUtils.clone(meganScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.82;
          child.material.metalness = 0.0;
          if (child.material.specularColorTexture) child.material.specularColorTexture = null;
          if (child.material.metalnessMap) child.material.metalnessMap = null;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [meganScene]);

  // Set uniform colors and realistic skin/hair
  useEffect(() => {
    if (!clonedScene) return;

    // Authentic hospital uniform colors directly from reference photo
    const scrubColor = uniformColor === 'blue' ? '#6ba4d8' : '#f0899f';
    const pantsColor = uniformColor === 'blue' ? '#5a96cc' : '#e67c94';

    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      if (child.name === 'Ch22_Shirt') {
        child.material.map = null;
        child.material.normalMap = null;
        child.material.color.set(scrubColor);
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Pants') {
        child.material.map = null;
        child.material.normalMap = null;
        child.material.color.set(pantsColor);
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Sneakers') {
        child.material.map = null;
        child.material.color.set('#f8fafc'); // Clean white hospital nursing shoes
        child.material.roughness = 0.35;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        // Natural Asian/Thai female skin tone and warm face
        child.material.color.set('#ffe6d9');
        child.material.roughness = 0.65;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        // Natural dark brunette hair tied neatly back
        child.material.color.set('#231812');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, uniformColor]);

  // Build authentic Mixamo female idle animation with natural reception desk arm poses
  const animClips = useMemo(() => {
    const list = [];
    if (idleFbx && idleFbx.animations && idleFbx.animations[0] && clonedScene) {
      const clip = idleFbx.animations[0].clone();
      clip.name = 'idle';
      clip.tracks.forEach((t) => {
        if (!t.name.startsWith('mixamorig')) t.name = 'mixamorig' + t.name;
      });
      clip.tracks = clip.tracks.filter(
        (t) => !t.name.endsWith('.scale') && !t.name.includes('Armature') && !t.name.includes('Eye')
      );

      const glbHips = clonedScene.getObjectByName('mixamorigHips');
      const fbxHips = idleFbx.getObjectByName('mixamorigHips') || idleFbx.getObjectByName('Hips');
      if (glbHips && fbxHips && glbHips.parent && fbxHips.parent) {
        const pF = fbxHips.parent.quaternion.clone();
        const pG = glbHips.parent.quaternion.clone();
        const corr = pG.clone().invert().multiply(pF);
        const posScale = fbxHips.parent.scale.x || 1;
        const restHipZ = glbHips.position.z || -100.08;

        clip.tracks.forEach((t) => {
          if (t.name === 'mixamorigHips.quaternion') {
            const q = new THREE.Quaternion();
            for (let i = 0; i < t.values.length; i += 4) {
              q.set(t.values[i], t.values[i + 1], t.values[i + 2], t.values[i + 3]);
              q.premultiply(corr);
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
              t.values[i] = 0;
              t.values[i + 1] = 0;
              t.values[i + 2] = v.z * heightRatio;
            }
          }
        });
      }

      // Apply Mixamo female arm pose for reception desk / typing / welcoming
      const armOverrides =
        armPose === 'typing'
          ? {
              'mixamorigLeftArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.05, 0.35, 0.15)),
              'mixamorigRightArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.08, -0.35, -0.15)),
              'mixamorigLeftForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0.15, 1.15)),
              'mixamorigRightForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, -0.15, -1.15)),
            }
          : armPose === 'welcoming'
            ? {
                'mixamorigLeftArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.12, 0.42, 0.22)),
                'mixamorigRightArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.15, -0.42, -0.22)),
                'mixamorigLeftForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0.2, 1.25)),
                'mixamorigRightForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, -0.2, -1.25)),
              }
            : {
                'mixamorigLeftArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.18, 0.38, 0.1)),
                'mixamorigRightArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.2, -0.38, -0.1)),
                'mixamorigLeftForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0.12, 0.85)),
                'mixamorigRightForeArm.quaternion': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, -0.12, -0.85)),
              };

      clip.tracks.forEach((t) => {
        const q = armOverrides[t.name];
        if (q) {
          for (let i = 0; i < t.values.length; i += 4) {
            t.values[i] = q.x;
            t.values[i + 1] = q.y;
            t.values[i + 2] = q.z;
            t.values[i + 3] = q.w;
          }
        }
      });

      list.push(clip);
    }
    return list;
  }, [idleFbx, clonedScene, armPose]);

  const { actions } = useAnimations(animClips, clonedScene);

  // Play natural idle breathing with phase offset
  useEffect(() => {
    if (actions && actions['idle']) {
      const action = actions['idle'].reset().fadeIn(0.5).play();
      action.time = timeOffset;
    }
  }, [actions, timeOffset]);

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* 3D Rigged Human Character */}
      <primitive object={clonedScene} position={[0, 0, 0]} />

      {/* ── 1. Classic Thai Registered Nurse Cap on Crown of Hair ── */}
      <group position={[0, 1.49, 0.015]} rotation={[-0.12, 0, 0]}>
        {/* White Folded Nurse Cap Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.055, 0.12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Crisp Dark Navy Velvet Cap Band (แถบหมวกพยาบาลวิชาชีพ) */}
        <mesh position={[0, 0.006, 0.062]}>
          <boxGeometry args={[0.12, 0.012, 0.005]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Red Medical Cross Badge on Crown */}
        <mesh position={[0, 0.02, 0.062]}>
          <planeGeometry args={[0.012, 0.004]} />
          <meshBasicMaterial color="#e11d48" />
        </mesh>
        <mesh position={[0, 0.02, 0.062]}>
          <planeGeometry args={[0.004, 0.012]} />
          <meshBasicMaterial color="#e11d48" />
        </mesh>
      </group>

      {/* ── 2. Crisp White Peter Pan Nurse Collar (From Reference Photo) ── */}
      <group position={[0, 1.29, 0.02]} rotation={[0.18, 0, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.078, 0.014, 12, 28, Math.PI * 1.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* White Lapel Left & Right */}
        <mesh position={[-0.045, -0.022, 0.075]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.045, 0.028, 0.004]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0.045, -0.022, 0.075]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.045, 0.028, 0.004]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* ── 3. Professional Stethoscope around Neck (For Head Nurse) ── */}
      {hasStethoscope && (
        <group position={[0, 1.20, 0.04]}>
          {/* Rubber U-tube around neck */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
            <torusGeometry args={[0.075, 0.008, 12, 28, Math.PI * 0.92]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Tubes falling to chest */}
          <mesh position={[-0.055, -0.07, 0.06]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.14, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.3} />
          </mesh>
          <mesh position={[0.055, -0.07, 0.06]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.14, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.3} />
          </mesh>
          {/* Chrome Chestpiece Diaphragm */}
          <mesh position={[-0.03, -0.15, 0.08]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.007, 24]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      )}

      {/* ── 4. Nurse ID Badge on Left Chest ── */}
      <group position={[0.08, 1.13, 0.12]} rotation={[-0.1, 0.12, -0.05]}>
        {/* White Card */}
        <mesh castShadow>
          <boxGeometry args={[0.042, 0.058, 0.003]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Blue Lanyard Clip */}
        <mesh position={[0, 0.032, 0.002]}>
          <boxGeometry args={[0.016, 0.008, 0.006]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} />
        </mesh>
        {/* Photo Thumbnail */}
        <mesh position={[-0.008, 0.010, 0.002]}>
          <planeGeometry args={[0.016, 0.020]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
        {/* Red Medical Cross on Badge */}
        <mesh position={[0.012, 0.010, 0.002]}>
          <planeGeometry args={[0.010, 0.003]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.012, 0.010, 0.0021]}>
          <planeGeometry args={[0.003, 0.010]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Name Bar */}
        <mesh position={[0, -0.016, 0.002]}>
          <planeGeometry args={[0.032, 0.008]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload('/models/megan_opt.glb');
useFBX.preload('/models/animations/Standing_Idle.fbx');
