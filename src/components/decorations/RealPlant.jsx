import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const IS_MOBILE_PLANT =
  typeof navigator !== 'undefined' &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

/**
 * RealPlant — Authentic 3D Plant Models (with mobile-safe memory & shadow budget)
 */
export default function RealPlant({
  type = 'potted',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const effectiveType = IS_MOBILE_PLANT ? 'succulent' : type;
  const modelPath =
    effectiveType === 'succulent'
      ? '/models/potted_plant_02.glb'
      : effectiveType === 'house'
      ? '/models/plant_house.glb'
      : '/models/potted_plant_01.glb';

  const { scene } = useGLTF(modelPath);

  const plantScene = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        // Avoid casting 100k+ foliage triangles into the shadow map
        child.castShadow = false;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  const defaultScale = type === 'house' ? 0.75 : type === 'succulent' ? 1.4 : 1.2;
  const finalScale =
    typeof scale === 'number'
      ? [scale * defaultScale, scale * defaultScale, scale * defaultScale]
      : scale;

  if (!plantScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={plantScene} scale={finalScale} />
    </group>
  );
}
