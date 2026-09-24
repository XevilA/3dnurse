import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * HospitalBed — Real 3D Patient / Hospital Bed Model
 *
 * Uses authentic 3D model assets with realistic metal frame, rails, mattress, and shadows.
 */
export default function HospitalBed({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  // Load real bed model from kira assets
  const { nodes } = useGLTF('/models/kira.glb');

  const bedMesh = useMemo(() => {
    if (nodes && nodes.Bed_Single) {
      const cloned = nodes.Bed_Single.clone(true);
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

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {bedMesh ? (
        <primitive object={bedMesh} scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]} />
      ) : null}

      {/* Hospital Bed Headboard & Side Guard Rails */}
      <mesh position={[0, 0.9, -1.8]} castShadow>
        <boxGeometry args={[2.2, 1.1, 0.1]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Side Rail Left */}
      <mesh position={[-1.05, 0.7, 0]} castShadow>
        <boxGeometry args={[0.08, 0.5, 2.4]} />
        <meshStandardMaterial color="#90a4ae" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Side Rail Right */}
      <mesh position={[1.05, 0.7, 0]} castShadow>
        <boxGeometry args={[0.08, 0.5, 2.4]} />
        <meshStandardMaterial color="#90a4ae" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/kira.glb');
