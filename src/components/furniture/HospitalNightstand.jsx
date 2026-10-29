import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalNightstand — Authentic 3D Bedside Nightstand Table (Poly Haven CC0)
 *
 * Real bedside table with drawer and lower shelf for patient water and personal items.
 */
export default function HospitalNightstand({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  children
}) {
  const { scene } = useGLTF('/models/side_table_01.glb');

  const table = useMemo(() => {
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

  const tableScale = typeof scale === 'number' ? [scale * 1.45, scale * 1.45, scale * 1.45] : scale;

  if (!table) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={table} scale={tableScale} position={[0, 0, 0]} />
      {/* Tabletop Items */}
      {children}
    </group>
  );
}
