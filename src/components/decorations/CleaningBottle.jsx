import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * CleaningBottle — Authentic Real 3D Medical Antiseptic / Multi-Surface Cleaner Bottle
 *
 * Uses multi_cleaner_bottle.glb with trigger nozzle and spray bottle geometry.
 */
export default function CleaningBottle({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const { scene } = useGLTF('/models/multi_cleaner_bottle.glb');

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
