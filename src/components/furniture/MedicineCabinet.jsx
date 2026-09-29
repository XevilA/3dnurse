import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * MedicineCabinet — Authentic 3D Medical Cabinet & First Aid Medical Supplies (Poly Haven CC0)
 *
 * Modeled for clinical nursery storage, medical records, and postpartum care medicines.
 */
export default function MedicineCabinet({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withMedicalBox = true
}) {
  const { scene: cabinetScene } = useGLTF('/models/drawer_cabinet.glb');
  const { scene: boxScene } = useGLTF('/models/medical_box.glb');

  const cabinet = useMemo(() => {
    if (!cabinetScene) return null;
    const cloned = cabinetScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [cabinetScene]);

  const medicalBox = useMemo(() => {
    if (!boxScene) return null;
    const cloned = boxScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [boxScene]);

  const cabScale = typeof scale === 'number' ? [scale * 1.0, scale * 1.0, scale * 1.0] : scale;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      {cabinet && <primitive object={cabinet} scale={cabScale} position={[0, 0, 0]} />}
      {withMedicalBox && medicalBox && (
        <primitive object={medicalBox} scale={[0.8, 0.8, 0.8]} position={[0, 1.9, 0]} />
      )}
    </group>
  );
}

useGLTF.preload('/models/drawer_cabinet.glb');
useGLTF.preload('/models/medical_box.glb');
