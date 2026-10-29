import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/**
 * CeilingFan — Authentic 3D Ceiling Fan with Rotating Blades (Poly Haven CC0)
 *
 * For nursery room ventilation and comfortable airflow according to pediatric safe guidelines.
 */
export default function CeilingFan({
  position = [0, 7.8, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const fanRef = useRef();
  const { scene } = useGLTF('/models/ceiling_fan.glb');

  const fan = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  // Rotate blades smoothly
  useFrame((_, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.y += delta * 2.5;
    }
  });

  const fScale = typeof scale === 'number' ? [scale * 1.2, scale * 1.2, scale * 1.2] : scale;

  if (!fan) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <group ref={fanRef}>
        <primitive object={fan} scale={fScale} position={[0, 0, 0]} />
      </group>
    </group>
  );
}
