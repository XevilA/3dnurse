import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * DoctorDesk — Authentic 3D Metal Medical / Nurse Station Desk (Poly Haven CC0)
 *
 * Provides realistic consultation desk for nurses and doctors with steel frame and drawers.
 */
export default function DoctorDesk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/metal_office_desk.glb');

  const deskScene = useMemo(() => {
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

  const deskScale = typeof scale === 'number' ? [scale * 1.25, scale * 1.25, scale * 1.25] : scale;

  if (!deskScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={deskScene} scale={deskScale} position={[0, 0, 0]} />
    </group>
  );
}
