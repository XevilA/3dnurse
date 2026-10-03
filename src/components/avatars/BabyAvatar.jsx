import React, { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BabyAvatar — Production Real 3D Infant Model
 *
 * Uses baby_real.glb with authentic newborn proportions and pose support:
 *   - pose="sleeping": Perfectly aligned lying supine on back (Safe Sleep standard).
 *                      Lowest point of back rests at local Y=0, head towards -Z (pillow),
 *                      feet towards +Z, with soft hospital swaddle blanket option.
 *   - pose="carried":  Upright / angled in Mother's embrace, centered at chest/hips.
 *   - pose="free":     Raw orientation for customized positioning.
 */
const BabyAvatar = forwardRef(({
  pose = 'sleeping', // 'sleeping' | 'carried' | 'free'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.38,
  withBlanket = true,
  blanketColor = '#fef08a', // soft warm pastel yellow / hospital baby blanket
}, ref) => {
  const group = useRef();

  // Load the baby model
  const { scene: babyScene } = useGLTF('/models/baby_real.glb');

  // Clone scene for multiple instances across rooms with enhanced materials
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
              roughness: 0.85,
            });
          } else if (name.includes('eye')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#2d3748',
              roughness: 0.2,
            });
          } else if (name.includes('lip')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#e08585',
              roughness: 0.4,
            });
          } else {
            // Baby soft newborn skin tone
            child.material = new THREE.MeshStandardMaterial({
              color: '#f8c8a8',
              roughness: 0.55,
              metalness: 0.02,
            });
          }
        }
      }
    });
    return clone;
  }, [babyScene]);

  // Handle scalar or array scale
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;

  // Gentle rhythmic infant breathing motion
  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      const breath = 1 + Math.sin(t * 2.2) * 0.015;
      group.current.scale.set(s[0] * breath, s[1] * breath, s[2]);
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={s} dispose={null}>
      {pose === 'sleeping' ? (
        /* ── Supine Safe Sleep Pose (Resting directly on mattress at Y=0) ── */
        <group>
          {/* Rotated & Translated Infant Model: Back at Y=0, Head at -Z, Feet at +Z */}
          <group
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-0.0024, 1.5773, 0.8268]}
          >
            <primitive object={clonedScene} />
          </group>

          {/* Soft Hospital Swaddle Blanket covering torso down to feet */}
          {withBlanket && (
            <group position={[0, 0.08, 0.12]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.38, 0.07, 0.32]} />
                <meshStandardMaterial
                  color={blanketColor}
                  roughness={0.8}
                />
              </mesh>
              {/* Folded edge rim of the blanket */}
              <mesh position={[0, 0.02, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.36, 16]} />
                <meshStandardMaterial color="#fef9c3" roughness={0.85} />
              </mesh>
            </group>
          )}
        </group>
      ) : pose === 'carried' ? (
        /* ── Upright / Carried Pose (Centered at chest/hips in arms) ── */
        <group position={[-0.0024, -0.8268, 1.3894]}>
          <primitive object={clonedScene} />
        </group>
      ) : (
        /* ── Free raw model pose ── */
        <primitive object={clonedScene} />
      )}
    </group>
  );
});

BabyAvatar.displayName = 'BabyAvatar';
export default BabyAvatar;

useGLTF.preload('/models/baby_real.glb');
