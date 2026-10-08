import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

/**
 * RealisticNurse Component
 * Authentic 3D Human Registered Nurse Character:
 * - Real rigged female 3D human model (Megan) with natural face, eyes, hair, and skin textures
 * - Authentic hospital scrub uniform (Pastel Pink or Soft Sky Blue)
 * - Classic Nurse Cap on crown of hair
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
}) {
  const groupRef = useRef();

  // Load realistic female model (4.1MB, rigged human female)
  const { scene: meganScene } = useGLTF('/models/megan_opt.glb');
  // Load animations for realistic breathing
  const { animations: soldierAnimations } = useGLTF('/models/soldier.glb');

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

  // Set uniform colors and realistic skin/hair
  useEffect(() => {
    if (!clonedScene) return;

    const scrubColor = uniformColor === 'blue' ? '#60a5fa' : '#f472b6';
    const pantsColor = uniformColor === 'blue' ? '#38bdf8' : '#f472b6';

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
        child.material.color.set('#f8fafc'); // White hospital shoes
        child.material.roughness = 0.45;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Body') {
        // Natural human female face, eyes, lips, and skin
        child.material.color.set('#ffffff');
        child.material.roughness = 0.65;
        child.material.needsUpdate = true;
      } else if (child.name === 'Ch22_Hair') {
        // Natural dark brunette hair
        child.material.color.set('#2d1a10');
        child.material.roughness = 0.85;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, uniformColor]);

  // Filter animation tracks to keep character upright & stable
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

  const { actions } = useAnimations(animClips, clonedScene);

  // Play natural idle breathing with phase offset
  useEffect(() => {
    if (actions && actions['idle']) {
      const action = actions['idle'].reset().fadeIn(0.5).play();
      action.time = timeOffset;
    }
  }, [actions, timeOffset]);

  // Natural arm posing for behind reception desk
  useEffect(() => {
    if (!clonedScene) return;

    let leftArm = null;
    let rightArm = null;
    let leftForeArm = null;
    let rightForeArm = null;

    clonedScene.traverse((child) => {
      if (child.isBone) {
        if (child.name.includes('LeftArm') && !child.name.includes('Fore')) leftArm = child;
        if (child.name.includes('RightArm') && !child.name.includes('Fore')) rightArm = child;
        if (child.name.includes('LeftForeArm')) leftForeArm = child;
        if (child.name.includes('RightForeArm')) rightForeArm = child;
      }
    });

    if (armPose === 'typing') {
      if (leftArm) leftArm.rotation.set(0.48, 0.15, 0.65);
      if (rightArm) rightArm.rotation.set(0.48, -0.15, -0.65);
      if (leftForeArm) leftForeArm.rotation.set(0.25, 0.35, 0.45);
      if (rightForeArm) rightForeArm.rotation.set(0.25, -0.35, -0.45);
    } else if (armPose === 'welcoming') {
      if (leftArm) leftArm.rotation.set(0.38, 0.1, 0.78);
      if (rightArm) rightArm.rotation.set(0.38, -0.1, -0.78);
      if (leftForeArm) leftForeArm.rotation.set(0.45, 0.25, 0.55);
      if (rightForeArm) rightForeArm.rotation.set(0.45, -0.25, -0.55);
    } else {
      if (leftArm) leftArm.rotation.set(0.28, 0.08, 0.88);
      if (rightArm) rightArm.rotation.set(0.28, -0.08, -0.88);
      if (leftForeArm) leftForeArm.rotation.set(0.35, 0.18, 0.38);
      if (rightForeArm) rightForeArm.rotation.set(0.35, -0.18, -0.38);
    }
  }, [clonedScene, armPose]);

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* 3D Rigged Human Character */}
      <primitive object={clonedScene} position={[0, 0, 0]} />

      {/* ── 1. Classic Nurse Cap on Crown of Hair ── */}
      <group position={[0, 1.48, 0.015]} rotation={[-0.15, 0, 0]}>
        {/* White Folded Nurse Cap Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.055, 0.12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Medical Colored Stripe on Cap */}
        <mesh position={[0, 0.005, 0.062]}>
          <boxGeometry args={[0.11, 0.014, 0.006]} />
          <meshBasicMaterial color={uniformColor === 'blue' ? '#0284c7' : '#e11d48'} />
        </mesh>
      </group>

      {/* ── 2. Professional Stethoscope around Neck ── */}
      {hasStethoscope && (
        <group position={[0, 1.18, 0.04]}>
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

      {/* ── 3. Nurse ID Badge on Left Chest ── */}
      <group position={[0.08, 1.12, 0.11]} rotation={[-0.1, 0.12, -0.05]}>
        {/* White Card */}
        <mesh castShadow>
          <boxGeometry args={[0.042, 0.058, 0.003]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Red Medical Cross on Badge */}
        <mesh position={[0, -0.012, 0.002]}>
          <planeGeometry args={[0.018, 0.006]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, -0.012, 0.0022]}>
          <planeGeometry args={[0.006, 0.018]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload('/models/megan_opt.glb');
useGLTF.preload('/models/soldier.glb');
