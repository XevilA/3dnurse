import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * RealPlant — Authentic 3D Plant / Tree Models (CC0 / PBR Materials)
 *
 * Types:
 * - 'potted': Realistic indoor leafy Ficus potted plant
 * - 'succulent': Modern tabletop/floor potted plant
 * - 'house': Lush indoor foliage
 */
export default function RealPlant({
  type = 'potted',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const modelPath =
    type === 'succulent'
      ? '/models/potted_plant_02.glb'
      : type === 'house'
      ? '/models/plant_house.glb'
      : '/models/potted_plant_01.glb';

  const { scene } = useGLTF(modelPath);

  const plantScene = useMemo(() => {
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

  // Adjust base scale & offset according to model geometry
  const defaultScale = type === 'house' ? 0.75 : type === 'succulent' ? 1.4 : 1.2;
  const finalScale = typeof scale === 'number' ? [scale * defaultScale, scale * defaultScale, scale * defaultScale] : scale;

  if (!plantScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={plantScene} scale={finalScale} />
    </group>
  );
}

useGLTF.preload('/models/potted_plant_01.glb');
useGLTF.preload('/models/potted_plant_02.glb');
useGLTF.preload('/models/plant_house.glb');
