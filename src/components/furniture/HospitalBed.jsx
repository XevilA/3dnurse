import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalBed — Authentic Full 3D Medical Hospital / Patient Bed
 *
 * Real clinical adjustable bed with wheels, IV frame, guard rails, and ergonomic hospital mattress.
 */
export default function HospitalBed({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/hospital_bed_opt.glb');

  const bedScene = useMemo(() => {
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

  // Model geometry is already scaled inside the GLB (Node 239 contains 0.001 matrix).
  // Scale = 1 gives authentic clinical dimensions: length 2.49m, width 1.10m, height 1.15m.
  const s = typeof scale === 'number' ? scale : scale;
  const finalScale = Array.isArray(s) ? s : [s, s, s];

  if (!bedScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      {/* Bed base offset Y +0.62m to rest wheels accurately on the floor */}
      <primitive
        object={bedScene}
        scale={finalScale}
        position={[0.2, 0.62, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/hospital_bed_opt.glb');
