import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalTrashBin — Authentic 3D Metal Sanitary Pedal Bin (Poly Haven CC0)
 *
 * For hygienic clinical waste, diapers, dressings, and sanitizing wipes disposal.
 */
export default function HospitalTrashBin({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/metal_trash_can.glb');

  const bin = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  const bScale = typeof scale === 'number' ? [scale * 0.9, scale * 0.9, scale * 0.9] : scale;

  if (!bin) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={bin} scale={bScale} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/models/metal_trash_can.glb');
