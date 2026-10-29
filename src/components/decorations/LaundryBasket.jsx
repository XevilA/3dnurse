import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * LaundryBasket — Authentic 3D Woven Wicker Nursery Hamper (Poly Haven CC0)
 *
 * For nursery changing stations, baby towels, and linens.
 */
export default function LaundryBasket({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/wicker_basket_01.glb');

  const basket = useMemo(() => {
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

  const bScale = typeof scale === 'number' ? [scale * 1.1, scale * 1.1, scale * 1.1] : scale;

  if (!basket) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <primitive object={basket} scale={bScale} position={[0, 0, 0]} />
    </group>
  );
}
