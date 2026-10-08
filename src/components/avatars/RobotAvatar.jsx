import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * RobotAvatar — AI Medical Nurse Assistant Robot
 * Uses robot.glb with rich built-in animations (Idle, Walking, Running, Sitting, ThumbsUp, Dance).
 */
const RobotAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.38, 0.38, 0.38],
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();
  const isSitting = useStore((state) => state.isSitting);
  const selectedOutfit = useStore((state) => state.selectedOutfit) || 'pink';

  const { scene: robotScene, animations } = useGLTF('/models/robot.glb');

  // Clone scene
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(robotScene);
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
  }, [robotScene]);

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

  // Expose group
  useImperativeHandle(ref, () => ({
    getBone: () => null,
    group: group.current,
  }));

  // Play animation
  useEffect(() => {
    if (!actions) return;
    let target = 'idle';
    if (isSitting) {
      target = actions['sitting'] ? 'sitting' : 'idle';
    } else if (currentAnimation === 'walk') {
      target = actions['walking'] ? 'walking' : 'walk';
    } else if (currentAnimation === 'run') {
      target = actions['running'] ? 'running' : 'run';
    }

    const act = actions[target] || actions['idle'] || Object.values(actions)[0];
    if (act) {
      Object.values(actions).forEach((a) => {
        if (a !== act) a.fadeOut(0.25);
      });
      act.reset().fadeIn(0.25).play();
    }
  }, [currentAnimation, isSitting, actions]);

  // Dynamic LED / Accent Color based on chosen outfit
  useEffect(() => {
    if (!clonedScene) return;
    const accentColors = {
      pink: new THREE.Color('#ec4899'),
      blue: new THREE.Color('#0284c7'),
      lavender: new THREE.Color('#8b5cf6'),
      mint: new THREE.Color('#10b981'),
      white: new THREE.Color('#e2e8f0'),
      peach: new THREE.Color('#f97316'),
    };
    const col = accentColors[selectedOutfit] || accentColors.pink;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.name.toLowerCase().includes('torso') || child.name.toLowerCase().includes('head')) {
          child.material.emissive = col;
          child.material.emissiveIntensity = 0.35;
        }
      }
    });
  }, [selectedOutfit, clonedScene]);

  useFrame(() => {
    if (avatarRigRef.current) {
      avatarRigRef.current.position.y = isSitting ? -0.35 : 0;
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

RobotAvatar.displayName = 'RobotAvatar';
export default RobotAvatar;

useGLTF.preload('/models/robot.glb');
