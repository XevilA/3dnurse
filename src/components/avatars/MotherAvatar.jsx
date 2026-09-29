import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * MotherAvatar — Authentic Postpartum Mother Character
 *
 * Uses high-res michelle.glb with authentic PBR textures.
 * Rigged with Mixamo animations from xbot.glb (idle, walk, run, agree).
 */
const MotherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();
  const motherClothing = useStore((state) => state.motherClothing);
  const isHoldingBaby = useStore((state) => state.isHoldingBaby);

  // Load the character model
  const { scene: michelleScene } = useGLTF('/models/michelle.glb');
  
  // Load animations from xbot (shares identical Mixamo skeleton hierarchy)
  const { animations: xbotAnimations } = useGLTF('/models/xbot.glb');

  // Clone scene with SkeletonUtils so skinned mesh bone bindings are preserved
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(michelleScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.55;
          child.material.metalness = 0.05;
        }
      }
    });
    return clone;
  }, [michelleScene]);

  // Bind xbot animations directly to Michelle's cloned rig
  const { actions } = useAnimations(xbotAnimations, clonedScene);

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

    let animName = currentAnimation;
    if (isHoldingBaby && actions['agree']) {
      animName = 'agree';
    }

    const availableNames = Object.keys(actions);
    const match = availableNames.find((n) => n.toLowerCase().includes(animName.toLowerCase())) ||
                  availableNames.find((n) => n.toLowerCase().includes('idle')) ||
                  availableNames[0];

    if (match && actions[match]) {
      Object.values(actions).forEach((act) => act.fadeOut(0.3));
      actions[match].reset().fadeIn(0.3).play();
    }
  }, [currentAnimation, isHoldingBaby, actions]);

  // Subtle medical hospital gown tint
  useEffect(() => {
    if (!clonedScene) return;
    const tints = {
      hospitalGown: new THREE.Color(0.9, 0.95, 1.0),
      casual: new THREE.Color(1.0, 0.96, 0.96),
      sleepwear: new THREE.Color(0.96, 0.93, 1.0),
    };
    const tint = tints[motherClothing] || tints.hospitalGown;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = tint;
        child.material.needsUpdate = true;
      }
    });
  }, [motherClothing, clonedScene]);

  // Gentle arm posing to cradle infant when holding baby
  useFrame(() => {
    if (!clonedScene || !isHoldingBaby) return;
    clonedScene.traverse((child) => {
      if (child.isBone) {
        const name = child.name;
        if (name.includes('LeftArm') && !name.includes('Fore')) {
          child.rotation.x = 0.95;
          child.rotation.y = 0.25;
          child.rotation.z = 0.35;
        } else if (name.includes('LeftForeArm')) {
          child.rotation.x = 0.15;
          child.rotation.y = 0.75;
          child.rotation.z = 0.1;
        } else if (name.includes('RightArm') && !name.includes('Fore')) {
          child.rotation.x = 0.9;
          child.rotation.y = -0.2;
          child.rotation.z = -0.35;
        } else if (name.includes('RightForeArm')) {
          child.rotation.x = 0.1;
          child.rotation.y = -0.7;
          child.rotation.z = -0.15;
        }
      }
    });
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={clonedScene} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
});

MotherAvatar.displayName = 'MotherAvatar';
export default MotherAvatar;

useGLTF.preload('/models/michelle.glb');
useGLTF.preload('/models/xbot.glb');
