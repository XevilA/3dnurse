import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * SteelShelves — Authentic 3D Steel Medical Supply Shelves (Poly Haven CC0)
 *
 * For organized storage of baby linen, diapers, sterile kits, and clinical records.
 */
export default function SteelShelves({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/steel_frame_shelves_01.glb');

  const shelves = useMemo(() => {
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

  const sScale = typeof scale === 'number' ? [scale * 0.95, scale * 0.95, scale * 0.95] : scale;

  if (!shelves) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={shelves} scale={sScale} position={[0, 0, 0]} />
    </group>
  );
}
