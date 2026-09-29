import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * MedicalCart — Authentic 3D Wheeled Clinical Storage Trolley / Cart (Poly Haven CC0)
 *
 * Real multi-tier wheeled hospital cart for dressing packs, medications, and baby supplies.
 * Completely replaces all primitive box tables with authentic mobile hospital equipment.
 */
export default function MedicalCart({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withMedicalBox = true,
  withTape = true
}) {
  const { scene: cartScene } = useGLTF('/models/industrial_storage_cart.glb');
  const { scene: boxScene } = useGLTF('/models/medical_box.glb');
  const { scene: tapeScene } = useGLTF('/models/medical_tape.glb');

  const cart = useMemo(() => {
    if (!cartScene) return null;
    const cloned = cartScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [cartScene]);

  const medicalBox = useMemo(() => {
    if (!boxScene) return null;
    const cloned = boxScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
    return cloned;
  }, [boxScene]);

  const tape = useMemo(() => {
    if (!tapeScene) return null;
    const cloned = tapeScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
    return cloned;
  }, [tapeScene]);

  const cartScale = typeof scale === 'number' ? [scale * 0.72, scale * 0.72, scale * 0.72] : scale;

  if (!cart) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      {/* Real multi-tier wheeled cart */}
      <primitive object={cart} scale={cartScale} position={[0, 0, 0]} />

      {/* Real Medical First Aid Box on top shelf */}
      {withMedicalBox && medicalBox && (
        <primitive object={medicalBox} scale={[0.55, 0.55, 0.55]} position={[-0.2, 0.98, 0]} />
      )}

      {/* Real Surgical Adhesive Tape on shelf */}
      {withTape && tape && (
        <primitive object={tape} scale={[3.0, 3.0, 3.0]} position={[0.25, 0.98, 0.1]} />
      )}
    </group>
  );
}

useGLTF.preload('/models/industrial_storage_cart.glb');
useGLTF.preload('/models/medical_box.glb');
useGLTF.preload('/models/medical_tape.glb');
