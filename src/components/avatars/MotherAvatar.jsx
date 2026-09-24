import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * MotherAvatar — High Quality Production 3D Character
 *
 * Uses michelle.glb (high-res female character model with authentic PBR textures).
 * Uses animations from xbot.glb (idle, walk, agree, etc.) which share the exact same Mixamo rig.
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

  // Load the Michelle model (mesh + skeleton + textures)
  const { scene: michelleScene } = useGLTF('/models/michelle.glb');
  
  // Load animations from xbot (shares identical Mixamo skeleton hierarchy)
  const { animations: xbotAnimations } = useGLTF('/models/xbot.glb');

  // Clone scene so multiple avatars in different rooms don't collide
  const clonedScene = useMemo(() => {
    const clone = michelleScene.clone(true);
    // Ensure all meshes cast/receive shadows and preserve original textures
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.5;
          child.material.metalness = 0.1;
        }
      }
    });
    return clone;
  }, [michelleScene]);

  // Bind xbot animations to Michelle's cloned rig
  const { actions } = useAnimations(xbotAnimations, group);

  // Expose bone search & group for bone attachment
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
    // Find closest match or default to 'idle'
    const match = availableNames.find((n) => n.toLowerCase().includes(animName.toLowerCase())) ||
                  availableNames.find((n) => n.toLowerCase().includes('idle')) ||
                  availableNames[0];

    if (match && actions[match]) {
      // Crossfade to the animation
      Object.values(actions).forEach((act) => act.fadeOut(0.4));
      actions[match].reset().fadeIn(0.4).play();
    }
  }, [currentAnimation, isHoldingBaby, actions]);

  // Optional clothing subtle tint (preserves high-res textures, doesn't wipe them)
  useEffect(() => {
    if (!clonedScene) return;
    const tints = {
      hospitalGown: new THREE.Color(0.85, 0.92, 1.0), // clean medical tint
      casual: new THREE.Color(1.0, 0.95, 0.95),       // soft warmth
      sleepwear: new THREE.Color(0.95, 0.92, 1.0),    // calm lavender tint
    };
    const tint = tints[motherClothing] || tints.hospitalGown;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = tint;
        child.material.needsUpdate = true;
      }
    });
  }, [motherClothing, clonedScene]);

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
