import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import useStore from '../../store/useStore';
import * as THREE from 'three';

/**
 * MotherAvatar — Authentic Postpartum Mother Character
 *
 * Uses high-res michelle.glb with authentic fair-skinned Asian Thai mother texture.
 * Uses Mixamo skeletal animations from soldier.glb (matching identical +Y bone translation axes).
 * Guaranteed natural resting arm posture in idle, smooth arm-swing in walking, and realistic sitting posture.
 */
const MotherAvatar = forwardRef(({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}, ref) => {
  const group = useRef();
  const avatarRigRef = useRef();
  const motherClothing = useStore((state) => state.motherClothing);
  const isHoldingBaby = useStore((state) => state.isHoldingBaby);
  const isSitting = useStore((state) => state.isSitting);

  // Load the character model
  const { scene: michelleScene } = useGLTF('/models/michelle.glb');
  
  // Load animations from soldier (matching identical +Y bone translation axes)
  const { animations: soldierAnimations } = useGLTF('/models/soldier.glb');

  // Load authentic fair Asian skin texture with soft pink maternity outfit
  const motherTexture = useTexture('/textures/mother_diffuse.jpg');

  useEffect(() => {
    if (motherTexture) {
      motherTexture.flipY = false;
      motherTexture.colorSpace = THREE.SRGBColorSpace;
      motherTexture.needsUpdate = true;
    }
  }, [motherTexture]);

  // Clone scene with SkeletonUtils so skinned mesh bone bindings are preserved
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(michelleScene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (motherTexture) {
            child.material.map = motherTexture;
          }
          child.material.color = new THREE.Color(1, 1, 1);
          child.material.roughness = 0.5;
          child.material.metalness = 0.0;
          if (child.material.specularColorTexture) child.material.specularColorTexture = null;
          if (child.material.metalnessMap) child.material.metalnessMap = null;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [michelleScene, motherTexture]);

  // Normalize clip names and filter tracks so only Hips keeps position track,
  // preserving Michelle's authentic female proportions without arm/body joint dislocation
  const animClips = useMemo(() => {
    if (!soldierAnimations || soldierAnimations.length === 0) return [];
    return soldierAnimations.map((origClip) => {
      const clip = origClip.clone();
      clip.name = clip.name.toLowerCase();
      clip.tracks = clip.tracks.filter((track) => {
        // Drop scale tracks to prevent distortion
        if (track.name.endsWith('.scale')) return false;
        // Drop position tracks for all limbs/bones EXCEPT Hips
        if (track.name.endsWith('.position')) {
          return track.name.toLowerCase().includes('hips');
        }
        return true;
      });
      return clip;
    });
  }, [soldierAnimations]);

  // Bind animations directly to Michelle's cloned rig
  const { actions } = useAnimations(animClips, clonedScene);

  // Find and store arm & leg bones for natural posture adjustment
  const bones = useRef({});
  useEffect(() => {
    if (!clonedScene) return;
    const b = {};
    clonedScene.traverse((child) => {
      if (child.isBone) {
        if (child.name.includes('LeftArm') && !child.name.includes('Fore')) b.leftArm = child;
        if (child.name.includes('RightArm') && !child.name.includes('Fore')) b.rightArm = child;
        if (child.name.includes('LeftForeArm')) b.leftForeArm = child;
        if (child.name.includes('RightForeArm')) b.rightForeArm = child;
        if (child.name.includes('LeftUpLeg')) b.leftUpLeg = child;
        if (child.name.includes('RightUpLeg')) b.rightUpLeg = child;
        if (child.name.includes('LeftLeg')) b.leftLeg = child;
        if (child.name.includes('RightLeg')) b.rightLeg = child;
        if (child.name.includes('LeftFoot')) b.leftFoot = child;
        if (child.name.includes('RightFoot')) b.rightFoot = child;
        if (child.name.includes('Hips')) b.hips = child;
      }
    });
    bones.current = b;
    window.__avatarBones = b;
  }, [clonedScene]);

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

    let animName = currentAnimation.toLowerCase();
    if (isSitting) {
      animName = 'idle'; // Uses idle breathing for sitting pose
    }

    const act = actions[animName] || actions['idle'] || Object.values(actions)[0];

    if (act) {
      Object.values(actions).forEach((a) => {
        if (a !== act) a.fadeOut(0.25);
      });
      act.reset().fadeIn(0.25).play();
    }
  }, [currentAnimation, isSitting, actions]);

  // Keep skin and gown bright, vibrant, and fair Asian tone
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = new THREE.Color(1, 1, 1);
        child.material.needsUpdate = true;
      }
    });
  }, [motherClothing, clonedScene]);

  // Procedural posture adjustments in useFrame:
  // 1. Sitting posture on Wheelchair, Sofa, or Chair
  // 2. Baby cradling pose
  // 3. Relaxed natural arms alongside torso in Idle ("มือแนบลำตัว")
  // 4. Natural arm swing in Walk
  useFrame(() => {
    if (!clonedScene) return;
    const {
      leftArm, rightArm, leftForeArm, rightForeArm,
      leftUpLeg, rightUpLeg, leftLeg, rightLeg, hips
    } = bones.current;
    if (!leftArm || !rightArm) return;

    if (isSitting) {
      // ── Realistic Seated Posture ──
      // Lower avatar onto cushion
      if (avatarRigRef.current) {
        avatarRigRef.current.position.y = -0.42;
      }

      // Thighs bend forward horizontally
      if (leftUpLeg) leftUpLeg.rotation.x = 1.50;
      if (rightUpLeg) {
        rightUpLeg.rotation.x = 1.90;
        rightUpLeg.rotation.z = -1.00;
      }

      // Calves bend downward at 90°
      if (leftLeg) leftLeg.rotation.x = 1.50;
      if (rightLeg) rightLeg.rotation.x = 1.50;

      // Arms resting on armrests or lap
      if (isHoldingBaby) {
        leftArm.rotation.set(0.65, 0.35, 0.75);
        rightArm.rotation.set(-0.65, -0.35, 0.75);
        if (leftForeArm) leftForeArm.rotation.set(-1.15, 0.3, 0.2);
        if (rightForeArm) rightForeArm.rotation.set(1.15, -0.3, -0.2);
      } else {
        leftArm.rotation.set(0.35, 0.1, 0.45);
        rightArm.rotation.set(-0.35, -0.1, 0.45);
        if (leftForeArm) leftForeArm.rotation.set(-0.6, 0.2, 0.1);
        if (rightForeArm) rightForeArm.rotation.set(0.6, -0.2, -0.1);
      }
    } else {
      // ── Standing / Walking Posture ──
      if (avatarRigRef.current) {
        avatarRigRef.current.position.y = 0;
      }

      if (isHoldingBaby) {
        // Gentle arm posing when cradling baby in care rooms
        leftArm.rotation.set(0.6, 0.3, 0.8);
        rightArm.rotation.set(-0.6, -0.3, 0.8);
        if (leftForeArm) leftForeArm.rotation.set(-1.2, 0.3, 0.2);
        if (rightForeArm) rightForeArm.rotation.set(1.2, -0.3, -0.2);
      } else if (currentAnimation === 'idle') {
        // Natural resting arm posture alongside torso ("มือแนบลำตัว")
        // Bring shoulders gently in and let forearms hang straight
        leftArm.rotation.z += 0.18;
        rightArm.rotation.z += 0.18;
        leftArm.rotation.y += 0.10;
        rightArm.rotation.y -= 0.10;
      }
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <group ref={avatarRigRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} rotation={[Math.PI, Math.PI, 0]} />
      </group>
    </group>
  );
});

MotherAvatar.displayName = 'MotherAvatar';
export default MotherAvatar;

useGLTF.preload('/models/michelle.glb');
useGLTF.preload('/models/soldier.glb');
useTexture.preload('/textures/mother_diffuse.jpg');
