import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * NursingChair — Real 3D Nursing / Armchair Model
 *
 * Uses Khronos SheenChair (authentic fabric, wooden legs, realistic PBR materials).
 */
export default function NursingChair({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const { scene } = useGLTF('/models/nursing_chair.glb');

  const chairScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={chairScene} scale={[1.35, 1.35, 1.35]} />
    </group>
  );
}
