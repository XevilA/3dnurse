import React from 'react';

/**
 * BabyCrib — Real 3D Medical Nursery Bassinet / Transparent Acrylic Baby Crib
 *
 * Modeled after real hospital newborn wheeled bassinets with transparent side walls,
 * soft mattress, and medical chrome mobile frame.
 */
export default function BabyCrib({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], children }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Wheeled Stainless Steel Cart Frame ── */}
      {/* Base frame */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.9]} />
        <meshStandardMaterial color="#90a4ae" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 4 Wheels */}
      {[-0.65, 0.65].map((x) =>
        [-0.38, 0.38].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.07, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
            <meshStandardMaterial color="#263238" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Vertical Support Struts */}
      <mesh position={[-0.65, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.65, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ── Transparent Clear Acrylic Baby Basket ── */}
      {/* Basket Bottom */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[1.4, 0.05, 0.8]} />
        <meshStandardMaterial color="#e0f7fa" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Transparent Front/Back Walls */}
      <mesh position={[0, 1.15, 0.38]}>
        <boxGeometry args={[1.4, 0.38, 0.04]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} />
      </mesh>
      <mesh position={[0, 1.15, -0.38]}>
        <boxGeometry args={[1.4, 0.38, 0.04]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} />
      </mesh>
      {/* Transparent Left/Right Walls */}
      <mesh position={[-0.68, 1.15, 0]}>
        <boxGeometry args={[0.04, 0.38, 0.76]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} />
      </mesh>
      <mesh position={[0.68, 1.15, 0]}>
        <boxGeometry args={[0.04, 0.38, 0.76]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.05} ior={1.5} />
      </mesh>

      {/* Soft Mattress with Pink/Blue Trim */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.32, 0.08, 0.72]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.02, -0.2]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.3]} />
        <meshStandardMaterial color="#e1bee7" roughness={0.9} />
      </mesh>

      {/* Child elements (Baby avatar inside crib) */}
      {children}
    </group>
  );
}
