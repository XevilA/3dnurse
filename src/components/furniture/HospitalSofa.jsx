import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalSofa — Authentic 3D Velvet Armchair / Lounge Sofa (Khronos PBR)
 *
 * For postpartum mother recovery rest area, visitors, and lobby waiting zone.
 */
export default function HospitalSofa({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/sofa_velvet.glb');

  const sofaScene = useMemo(() => {
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

  const sofaScale = typeof scale === 'number' ? [scale * 1.3, scale * 1.3, scale * 1.3] : scale;

  if (!sofaScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={sofaScene} scale={sofaScale} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/models/sofa_velvet.glb');
