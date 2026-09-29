import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * RealTree — Authentic 3D Tree Model (Poly Haven CC0)
 *
 * Real trunk, bark texture, branches and foliage. Perfect for Grand Lobby and Garden courtyards.
 */
export default function RealTree({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const { scene } = useGLTF('/models/tree_small_02.glb');

  const treeScene = useMemo(() => {
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

  const treeScale = typeof scale === 'number' ? [scale * 1.1, scale * 1.1, scale * 1.1] : scale;

  if (!treeScene) return null;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      {/* Decorative Modern Planter Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.9, 0.8, 32]} />
        <meshStandardMaterial color="#eceff1" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 32]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Real 3D Tree */}
      <primitive object={treeScene} scale={treeScale} position={[0, 0.8, 0]} />
    </group>
  );
}

useGLTF.preload('/models/tree_small_02.glb');
