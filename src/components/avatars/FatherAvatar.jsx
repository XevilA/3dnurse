import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * FatherAvatar — Supportive Father / Male Caregiver Character
 * Uses soldier.glb Vanguard model with medical/caregiver clean attire.
 */
const FatherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();
  const isSitting = useStore((state) => state.isSitting);
  const selectedOutfit = useStore((state) => state.selectedOutfit) || 'blue';

  const { scene: soldierScene, animations } = useGLTF('/models/soldier.glb');

  // Clone with SkeletonUtils
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(soldierScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
        }
      }
    });
    return clone;
  }, [soldierScene]);

  // Normalize animations
  const animClips = useMemo(() => {
    if (!animations) return [];
    return animations.map((clip) => {
      const c = clip.clone();
      c.name = c.name.toLowerCase();
      return c;
    });
  }, [animations]);

  const { actions } = useAnimations(animClips, clonedScene);

  // Expose bone search & group
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

  // Play animation
  useEffect(() => {
    if (!actions) return;
    const animName = isSitting ? 'idle' : currentAnimation.toLowerCase();
    const act = actions[animName] || actions['idle'] || Object.values(actions)[0];
    if (act) {
      Object.values(actions).forEach((a) => {
        if (a !== act) a.fadeOut(0.25);
      });
      act.reset().fadeIn(0.25).play();
    }
  }, [currentAnimation, isSitting, actions]);

  // Dynamic Outfit Color Tint
  useEffect(() => {
    if (!clonedScene) return;
    const outfitColors = {
      pink: new THREE.Color(0.92, 0.75, 0.82),
      blue: new THREE.Color(0.45, 0.75, 0.95),
      lavender: new THREE.Color(0.75, 0.65, 0.90),
      mint: new THREE.Color(0.45, 0.85, 0.70),
      white: new THREE.Color(0.95, 0.95, 0.98),
      peach: new THREE.Color(0.95, 0.70, 0.55),
    };
    const col = outfitColors[selectedOutfit] || outfitColors.blue;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.name.includes('vanguard_Mesh') && child.material) {
        child.material.color = col;
        child.material.needsUpdate = true;
      }
    });
  }, [selectedOutfit, clonedScene]);

  useFrame(() => {
    if (avatarRigRef.current) {
      avatarRigRef.current.position.y = isSitting ? -0.42 : 0;
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

FatherAvatar.displayName = 'FatherAvatar';
export default FatherAvatar;
