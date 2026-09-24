import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * BabyBathtub — Dedicated 3D Infant Bathtub on Medical Bathing Station
 *
 * Includes ergonomic baby tub with gentle incline, warm water, bath temperature gauge (37-38°C),
 * washcloth, and authentic 3D bottles from bath_day.glb.
 */
export default function BabyBathtub({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const { scene: bathScene } = useGLTF('/models/bath_day.glb');

  const bottles = useMemo(() => {
    if (bathScene) {
      const clone = bathScene.clone(true);
      clone.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
      return clone;
    }
    return null;
  }, [bathScene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Sturdy Medical Changing / Bathing Table ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.9, 1.4]} />
        <meshStandardMaterial color="#e0f2f1" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Table legs accents */}
      <mesh position={[-1.15, 0.45, 0]}>
        <boxGeometry args={[0.08, 0.9, 1.35]} />
        <meshStandardMaterial color="#80cbc4" metalness={0.4} />
      </mesh>
      <mesh position={[1.15, 0.45, 0]}>
        <boxGeometry args={[0.08, 0.9, 1.35]} />
        <meshStandardMaterial color="#80cbc4" metalness={0.4} />
      </mesh>

      {/* ── Ergonomic Baby Bathtub Rim ── */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.58, 0.4, 32]} />
        <meshStandardMaterial color="#b2ebf2" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Warm Water inside Tub (37-38°C) */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.04, 32]} />
        <meshStandardMaterial color="#4dd0e1" transparent opacity={0.7} roughness={0.05} />
      </mesh>

      {/* Thermometer Floating Gauge */}
      <mesh position={[-0.45, 1.15, 0.2]} rotation={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
        <meshStandardMaterial color="#ffeb3b" />
      </mesh>

      {/* Soft Cotton Baby Towel / Washcloth */}
      <mesh position={[0.78, 0.92, -0.2]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.08, 0.55]} />
        <meshStandardMaterial color="#fff9c4" roughness={0.9} />
      </mesh>

      {/* Real 3D Shampoo & Baby Wash Bottles */}
      {bottles && (
        <group position={[0.8, 0.94, 0.35]} scale={[0.16, 0.16, 0.16]}>
          <primitive object={bottles} />
        </group>
      )}
    </group>
  );
}

useGLTF.preload('/models/bath_day.glb');
