import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * SideTable — Authentic Real 3D Bedside / Ward Side Table
 *
 * Uses side_table_01.glb with realistic tabletop, solid legs, and shadow casting.
 */
export default function SideTable({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], children }) {
  const { scene } = useGLTF('/models/side_table_01.glb');

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
