import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * DrawerCabinet — Authentic Real 3D Medical Wooden/Metal Drawer Storage Unit
 *
 * Uses drawer_cabinet.glb with 4 functioning drawers, authentic PBR materials,
 * handles, and smooth cast shadows.
 */
export default function DrawerCabinet({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const { scene } = useGLTF('/models/drawer_cabinet.glb');

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
    </group>
  );
}
