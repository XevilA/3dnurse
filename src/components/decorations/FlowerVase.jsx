import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * FlowerVase — Authentic 3D Glass Vase with Fresh Flowers (Khronos PBR)
 *
 * Perfect for hospital room bedside tables, nurse desks, and reception areas.
 */
export default function FlowerVase({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/flowers_vase.glb');

  const vaseScene = useMemo(() => {
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

  const baseScale = typeof scale === 'number' ? [scale * 2.2, scale * 2.2, scale * 2.2] : scale;

  if (!vaseScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={vaseScene} scale={baseScale} position={[0, 0.05, 0]} />
    </group>
  );
}

useGLTF.preload('/models/flowers_vase.glb');
