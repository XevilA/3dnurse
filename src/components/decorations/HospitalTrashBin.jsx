import React from 'react';

/**
 * HospitalTrashBin — Modern Architectural Stainless Sanitary Step Pedal Bin
 *
 * Designed for clinical medical wards and nurseries:
 * - Pristine white powder-coated or brushed stainless steel cylindrical body
 * - Hygienic soft-close chrome pedal lid
 * - Sturdy non-slip rubber base rim
 * - Chrome foot pedal mechanism
 */
export default function HospitalTrashBin({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;

  return (
    <group position={position} rotation={rotation} scale={s}>
      {/* Non-slip Rubber Base Rim */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.21, 0.22, 0.04, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Main Medical Sanitary Bin Body (Pristine Powder-Coated White / Clean Stainless) */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.20, 0.20, 0.62, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Chrome Accent Ring under Lid */}
      <mesh position={[0, 0.665, 0]} castShadow>
        <cylinderGeometry args={[0.205, 0.205, 0.015, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Domed Chrome Lid with Bevel */}
      <mesh position={[0, 0.685, 0]} castShadow>
        <cylinderGeometry args={[0.208, 0.208, 0.025, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Lid Top Lift Handle / Indentation */}
      <mesh position={[0, 0.702, 0]} castShadow>
        <boxGeometry args={[0.08, 0.01, 0.03]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Chrome Foot Pedal at Base */}
      <group position={[0, 0.03, 0.21]}>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.018, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Pedal Rubber Grip */}
        <mesh position={[0, 0.01, 0.04]}>
          <boxGeometry args={[0.075, 0.005, 0.06]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>

      {/* Subtle Clinical Hygiene Label */}
      <mesh position={[0, 0.45, 0.201]}>
        <planeGeometry args={[0.09, 0.05]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
}
