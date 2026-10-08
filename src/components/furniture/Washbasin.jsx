import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * Washbasin — Real 3D Medical Washbasin / Sink & Vanity Station
 *
 * Includes authentic ceramic basin, curved chrome mixer tap, mirror,
 * and real 3D soap/lotion bottles from bath_day.glb.
 */
export default function Washbasin({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Ceramic Basin Stand / Counter ── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 1.0]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* ── Inner Porcelain Basin Bowl ── */}
      <mesh position={[0, 0.92, 0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.42, 0.28, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Water inside basin */}
      <mesh position={[0, 0.88, 0.05]}>
        <cylinderGeometry args={[0.48, 0.48, 0.02, 32]} />
        <meshStandardMaterial color="#80d8ff" transparent opacity={0.65} roughness={0.05} />
      </mesh>

      {/* Basin Drain Ring */}
      <mesh position={[0, 0.79, 0.05]}>
        <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
        <meshStandardMaterial color="#37474f" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Chrome Curved Faucet / Tap ── */}
      <group position={[0, 0.95, -0.32]}>
        {/* Vertical stem */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.32, 16]} />
          <meshStandardMaterial color="#cfd8dc" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Curved spout */}
        <mesh position={[0, 0.32, 0.1]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 16]} />
          <meshStandardMaterial color="#cfd8dc" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Hot/Cold Handles */}
        <mesh position={[-0.12, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 12]} />
          <meshStandardMaterial color="#e57373" metalness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 12]} />
          <meshStandardMaterial color="#64b5f6" metalness={0.8} />
        </mesh>
      </group>

      {/* ── Vanity Wall Mirror ── */}
      <mesh position={[0, 1.85, -0.48]}>
        <boxGeometry args={[1.3, 0.9, 0.04]} />
        <meshStandardMaterial color="#eceff1" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* ── Clinical Liquid Soap & Hand Sanitizer Pump Dispensers ── */}
      <group position={[0.55, 0.92, -0.15]}>
        {/* Antiseptic Hand Wash Bottle Body */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.22, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Pump Neck */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Pump Head / Spout */}
        <mesh position={[0.02, 0.27, 0]} castShadow>
          <boxGeometry args={[0.08, 0.025, 0.03]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
