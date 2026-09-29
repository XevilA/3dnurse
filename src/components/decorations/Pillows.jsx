import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * Pillows — Authentic 3D Fabric Throw Pillows / Support Cushions (Poly Haven CC0)
 *
 * For postpartum maternal back support, pelvic relief, and breastfeeding comfort.
 */
export default function Pillows({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/throw_pillows_01.glb');

  const pillows = useMemo(() => {
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

  const pScale = typeof scale === 'number' ? [scale * 1.35, scale * 1.35, scale * 1.35] : scale;

  if (!pillows) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={pillows} scale={pScale} position={[0, 0.2, 0]} />
    </group>
  );
}

useGLTF.preload('/models/throw_pillows_01.glb');
