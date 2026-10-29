import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * ExaminationLamp — Authentic 3D Articulated Medical / Examination Lamp (Poly Haven CC0)
 *
 * For wound inspection, umbilical cord checks, and doctor consultation desks.
 */
export default function ExaminationLamp({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/desk_lamp_arm_01.glb');

  const lamp = useMemo(() => {
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

  const lScale = typeof scale === 'number' ? [scale * 1.2, scale * 1.2, scale * 1.2] : scale;

  if (!lamp) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={lamp} scale={lScale} position={[0, 0, 0]} />
    </group>
  );
}
