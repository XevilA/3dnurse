import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * MedicalTable — Real 3D Medical / Examination Bedside Table with Supplies
 *
 * Uses authentic 3D furniture from kira.glb + real 3D water bottle from Khronos.
 */
export default function MedicalTable({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], withBottle = true }) {
  const { nodes } = useGLTF('/models/kira.glb');
  const { scene: bottleScene } = useGLTF('/models/water_bottle.glb');

  const tableMesh = useMemo(() => {
    if (nodes && nodes.NightStand_3) {
      const cloned = nodes.NightStand_3.clone(true);
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      return cloned;
    }
    return null;
  }, [nodes]);

  const bottleMesh = useMemo(() => {
    if (bottleScene) {
      const cloned = bottleScene.clone(true);
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      return cloned;
    }
    return null;
  }, [bottleScene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {tableMesh && (
        <primitive object={tableMesh} scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]} />
      )}

      {/* Real 3D Medical Water Bottle on Table */}
      {withBottle && bottleMesh && (
        <primitive object={bottleMesh} scale={[3.0, 3.0, 3.0]} position={[0, 1.1, 0]} />
      )}
    </group>
  );
}

useGLTF.preload('/models/kira.glb');
useGLTF.preload('/models/water_bottle.glb');
