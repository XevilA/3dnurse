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

  // Clean animation clips to match stripped bone names and remove missing eye tracks
  const cleanClips = useMemo(() => {
    if (!xbotAnimations || xbotAnimations.length === 0) return [];
    return xbotAnimations.map((origClip) => {
      const clip = origClip.clone();
      clip.tracks = clip.tracks
        .filter((t) => !t.name.includes('Eye'))
        .map((t) => {
          t.name = t.name.replace(/mixamorig:?/g, '');
          return t;
        });
      return clip;
    });
  }, [xbotAnimations]);

  // Keep references to bones and character node for direct procedural kinematic posing
  const bonesRef = useRef({});
  const characterNodeRef = useRef(null);

  // Clone scene with SkeletonUtils and clean bone names
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(michelleScene);
    bonesRef.current = {};
    characterNodeRef.current = null;

    clone.traverse((child) => {
      if (child.name) {
        child.name = child.name.replace(/^mixamorig:?/, '');
      }
      if (child.isBone) {
        bonesRef.current[child.name] = child;
      }
      // Fix upright orientation: michelle.glb Character root node has rotation.x = Math.PI / 2 (+90 deg)
      // which caused the character to lie flat on the floor when playing animations.
      if (child.name === 'Character') {
        child.rotation.set(0, 0, 0);
        child.quaternion.set(0, 0, 0, 1);
        characterNodeRef.current = child;
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.map = motherTexture;
          child.material.color = new THREE.Color(1, 1, 1);
          child.material.roughness = 0.5;
          child.material.metalness = 0.0;
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

  // Bind cleaned animations directly to clonedScene's skeleton hierarchy
  const { actions } = useAnimations(cleanClips, clonedScene);

  // Expose bone search & group for external attachment
  useImperativeHandle(ref, () => ({
    getBone: (name) => bonesRef.current[name] || null,
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
    if (availableNames.length === 0) return;

    const match = availableNames.find((n) => n.toLowerCase().includes(animName.toLowerCase())) ||
                  availableNames.find((n) => n.toLowerCase().includes('idle')) ||
                  availableNames[0];

    if (match && actions[match]) {
      Object.values(actions).forEach((act) => {
        if (act !== actions[match]) act.fadeOut(0.2);
      });
      actions[match].reset().fadeIn(0.2).play();
    }
  }, [currentAnimation, isHoldingBaby, actions]);

  // Priority 1 ensures this runs AFTER the animation mixer has updated (which runs at priority 0)
  useFrame((state) => {
    // 1. Permanently guarantee Character node is upright and cannot tilt/lie down
    if (characterNodeRef.current) {
      characterNodeRef.current.rotation.set(0, 0, 0);
      characterNodeRef.current.quaternion.set(0, 0, 0, 1);
    }

    // 2. Realistic Breastfeeding & Infant Cradling Posture
    if (isHoldingBaby) {
      const b = bonesRef.current;
      const t = state.clock.elapsedTime;

      // Left arm forms a secure cradle shelf supporting infant head & neck
      if (b['LeftArm']) b['LeftArm'].rotation.set(1.15, 0.35, 0.45);
      if (b['LeftForeArm']) b['LeftForeArm'].rotation.set(0.2, 0.85, 0.15);

      // Right arm wraps underneath supporting infant back & bottom
      if (b['RightArm']) b['RightArm'].rotation.set(1.1, -0.32, -0.42);
      if (b['RightForeArm']) b['RightForeArm'].rotation.set(0.18, -0.85, -0.15);

      // Tender maternal gaze looking down at baby at breast
      if (b['Neck']) b['Neck'].rotation.set(0.22, 0.05, 0);
      if (b['Head']) b['Head'].rotation.set(0.18, 0.05, 0);

      // Gentle maternal breathing rhythm
      if (b['Spine1']) {
        b['Spine1'].rotation.x = Math.sin(t * 2.2) * 0.025;
      }
    }
  }, 1);

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
