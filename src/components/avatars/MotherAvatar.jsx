import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * MotherAvatar — Authentic Postpartum Asian Thai Mother Character
 *
 * Fully rigged with Mixamo animations using SkeletonUtils.clone to prevent T-pose:
 * - Naturally idle, walking, and running animations
 * - Radiant fair Asian skin tone, warm smile, neat dark hair
 * - Authentic hospital maternity gown in soft medical pastel pink / baby blue
 * - Patient identification wristband & soft indoor hospital slippers
 * - Natural cradling arm pose when holding baby in clinical care rooms
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

  // Load the rigged character mesh
  const { scene: michelleScene } = useGLTF('/models/michelle.glb');
  
  // Load animations from xbot (shares identical Mixamo skeleton hierarchy)
  const { animations: xbotAnimations } = useGLTF('/models/xbot.glb');

  // Load the authentic Asian Thai Mother texture
  const motherTexture = useTexture('/textures/mother_diffuse.jpg');

  // Ensure texture color space & glTF UV mapping orientation
  useEffect(() => {
    if (motherTexture) {
      motherTexture.flipY = false;
      motherTexture.colorSpace = THREE.SRGBColorSpace;
      motherTexture.needsUpdate = true;
    }
  }, [motherTexture]);

  // Clone scene with SkeletonUtils so SkinnedMesh bones are properly bound and animated (Fixes T-Pose!)
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(michelleScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.map = motherTexture;
          child.material.color = new THREE.Color(1, 1, 1);
          child.material.roughness = 0.55;
          child.material.metalness = 0.02;
          if (child.material.specularColorTexture) {
            child.material.specularColorTexture = null;
          }
          if (child.material.metalnessMap) {
            child.material.metalnessMap = null;
          }
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [michelleScene, motherTexture]);

  // Bind xbot animations directly to clonedScene's skeleton hierarchy
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

  // Play natural animations
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
      <primitive object={clonedScene} />
    </group>
  );
});

MotherAvatar.displayName = 'MotherAvatar';
export default MotherAvatar;

useGLTF.preload('/models/michelle.glb');
useGLTF.preload('/models/xbot.glb');
useTexture.preload('/textures/mother_diffuse.jpg');
