import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalWheelchair — Authentic 3D Medical Wheelchair Model (Poly Haven CC0)
 *
 * For postpartum mother mobility assistance and patient transport.
 */
export default function HospitalWheelchair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/wheelchair_01.glb');

  const wheelchairScene = useMemo(() => {
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

  const finalScale = typeof scale === 'number' ? [scale * 0.85, scale * 0.85, scale * 0.85] : scale;

  if (!wheelchairScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={wheelchairScene} scale={finalScale} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/models/wheelchair_01.glb');
