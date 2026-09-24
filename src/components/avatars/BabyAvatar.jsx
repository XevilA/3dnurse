import React, { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BabyAvatar — Production Real 3D Infant Model
 *
 * Uses baby_real.glb (realistic baby model with head, diaper, arms, legs, and facial features).
 */
const BabyAvatar = forwardRef(({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();

  // Load the baby model
  const { scene: babyScene } = useGLTF('/models/baby_real.glb');

  // Clone scene for multiple instances across rooms
  const clonedScene = useMemo(() => {
    const clone = babyScene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Ensure realistic skin and diaper materials if not set
        if (!child.material || child.material.name === '') {
          const name = child.name.toLowerCase();
          if (name.includes('diaper')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#ffffff',
              roughness: 0.8,
            });
          } else if (name.includes('eye')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#1a1a1a',
              roughness: 0.1,
            });
          } else if (name.includes('lip')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#e08585',
              roughness: 0.4,
            });
          } else {
            // Baby soft skin tone
            child.material = new THREE.MeshStandardMaterial({
              color: '#f8c8a8',
              roughness: 0.5,
              metalness: 0.05,
            });
          }
        }
      }
    });
    return clone;
  }, [babyScene]);

  // Expose imperative methods for simulation attachment
  useImperativeHandle(ref, () => ({
    attachToParent: (parentBone) => {
      if (group.current && parentBone) {
        parentBone.add(group.current);
        group.current.position.set(0, -0.15, 0.22);
        group.current.rotation.set(-0.4, 0, 0);
        group.current.scale.set(0.8, 0.8, 0.8);
      }
    },
    detach: (sceneRoot) => {
      if (group.current && sceneRoot) {
        sceneRoot.attach(group.current);
      }
    },
    group: group.current,
  }));

  // Subtle natural breathing motion
  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      const breath = 1 + Math.sin(t * 2.5) * 0.012;
      group.current.scale.set(scale[0] * breath, scale[1] * breath, scale[2]);
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
});

BabyAvatar.displayName = 'BabyAvatar';
export default BabyAvatar;

useGLTF.preload('/models/baby_real.glb');
