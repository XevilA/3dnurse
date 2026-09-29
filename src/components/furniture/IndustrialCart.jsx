import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * IndustrialCart — Authentic Real 3D Medical Wheeled Storage Cart
 *
 * Uses industrial_storage_cart.glb with steel racks, swivel wheels, and medical trays.
 */
export default function IndustrialCart({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], children }) {
  const { scene } = useGLTF('/models/industrial_storage_cart.glb');

  const clonedScene = useMemo(() => {
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
      <primitive object={clonedScene} />
      {children}
    </group>
  );
}

useGLTF.preload('/models/industrial_storage_cart.glb');
