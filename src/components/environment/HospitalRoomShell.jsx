import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * HospitalRoomShell — Authentic 3D Medical / Nursery Room Architecture
 *
 * Features:
 * - Seamless sanitary vinyl flooring with anti-bacterial border trims
 * - Dual-tone architectural hospital walls with wall bumper crash-rails (protects from beds/carts)
 * - Hospital door with stainless steel kick plate, handle, and inspection glass window
 * - Panoramic hospital window with realistic outdoor landscape & daylight illumination
 * - Ceiling with recessed LED surgical/examination lighting panels
 * - Wall-mounted medical bedhead unit (oxygen, air, suction ports, nurse call button)
 * - Wall-mounted automatic hand sanitizer dispenser
 * - Hospital digital room clock
 */
export default function HospitalRoomShell({
  theme = 'mother', // 'mother' | 'newborn' | 'quiz' | 'lobby'
  width = 18,
  depth = 18,
  height = 8,
  doorWall = 'left',
  windowWall = 'back',
  roomTitle = 'ห้องบริบาลมารดาและทารก',
  roomNumber = 'Room 101'
}) {
  // Theme color palette
  const colors = useMemo(() => {
    switch (theme) {
      case 'newborn':
        return {
          wallUpper: '#f0f9ff',
          wallLower: '#e0f2fe',
          bumperRail: '#38bdf8',
          floor: '#f8fafc',
          floorBorder: '#bae6fd',
          trim: '#0284c7',
          door: '#e0f2fe',
          lightTint: '#e0f7fa'
        };
      case 'quiz':
        return {
          wallUpper: '#faf5ff',
          wallLower: '#f3e8ff',
          bumperRail: '#a855f7',
          floor: '#fcfaff',
          floorBorder: '#e9d5ff',
          trim: '#7e22ce',
          door: '#f3e8ff',
          lightTint: '#ede7f6'
        };
      case 'lobby':
        return {
          wallUpper: '#ffffff',
          wallLower: '#f1f5f9',
          bumperRail: '#0ea5e9',
          floor: '#f8fafc',
          floorBorder: '#cbd5e1',
          trim: '#0284c7',
          door: '#e2e8f0',
          lightTint: '#f0f9ff'
        };
      case 'mother':
      default:
        return {
          wallUpper: '#fff5f7',
          wallLower: '#fce7f3',
          bumperRail: '#f472b6',
          floor: '#fffafb',
          floorBorder: '#fbcfe8',
          trim: '#db2777',
          door: '#fce7f3',
          lightTint: '#fff0f5'
        };
    }
  }, [theme]);

  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group>
      {/* ── 1. Floor with Medical Vinyl Finish & Accent Perimeter ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.floor} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Floor Perimeter Accent Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[Math.min(halfW, halfD) * 0.85, Math.min(halfW, halfD) * 0.95, 4]} />
        <meshStandardMaterial color={colors.floorBorder} roughness={0.4} />
      </mesh>

      {/* ── 2. Back Wall Architecture ── */}
      <group position={[0, height / 2, -halfD]}>
        {/* Upper Wall */}
        <mesh position={[0, 1.2, 0]} receiveShadow>
          <boxGeometry args={[width, height - 2.4, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.6} />
        </mesh>
        {/* Lower Sanitary Wainscot Wall */}
        <mesh position={[0, -(height / 2) + 1.2, 0]} receiveShadow>
          <boxGeometry args={[width, 2.4, 0.44]} />
          <meshStandardMaterial color={colors.wallLower} roughness={0.3} />
        </mesh>
        {/* Hospital Bumper Crash Rail */}
        <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
          <boxGeometry args={[width, 0.22, 0.08]} />
          <meshStandardMaterial color={colors.bumperRail} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Sanitary Baseboard Trim */}
        <mesh position={[0, -(height / 2) + 0.1, 0.05]}>
          <boxGeometry args={[width, 0.2, 0.06]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* ── 3. Left Wall Architecture ── */}
      <group position={[-halfW, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.2, 0]} receiveShadow>
          <boxGeometry args={[depth, height - 2.4, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.6} />
        </mesh>
        <mesh position={[0, -(height / 2) + 1.2, 0]} receiveShadow>
          <boxGeometry args={[depth, 2.4, 0.44]} />
          <meshStandardMaterial color={colors.wallLower} roughness={0.3} />
        </mesh>
        <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
          <boxGeometry args={[depth, 0.22, 0.08]} />
          <meshStandardMaterial color={colors.bumperRail} roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -(height / 2) + 0.1, 0.05]}>
          <boxGeometry args={[depth, 0.2, 0.06]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* ── 4. Right Wall Architecture ── */}
      <group position={[halfW, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.2, 0]} receiveShadow>
          <boxGeometry args={[depth, height - 2.4, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.6} />
        </mesh>
        <mesh position={[0, -(height / 2) + 1.2, 0]} receiveShadow>
          <boxGeometry args={[depth, 2.4, 0.44]} />
          <meshStandardMaterial color={colors.wallLower} roughness={0.3} />
        </mesh>
        <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
          <boxGeometry args={[depth, 0.22, 0.08]} />
          <meshStandardMaterial color={colors.bumperRail} roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -(height / 2) + 0.1, 0.05]}>
          <boxGeometry args={[depth, 0.2, 0.06]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* ── 5. Panoramic Hospital Window (Daylight & Outdoor View) ── */}
      {windowWall === 'back' && (
        <group position={[0, 4.4, -halfD + 0.2]}>
          {/* Outer Window Frame */}
          <mesh castShadow>
            <boxGeometry args={[7.2, 3.4, 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Inner Recessed Glass Opening */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[6.8, 3.0, 0.05]} />
            <meshStandardMaterial
              color="#e0f7fa"
              emissive="#80deea"
              emissiveIntensity={0.35}
              roughness={0.1}
            />
          </mesh>
          {/* Outdoor Horizon / Blue Sky Landscape Backplate */}
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[6.7, 2.9]} />
            <meshBasicMaterial color="#b3e5fc" />
          </mesh>
          {/* Window Mullions / Cross Grids */}
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.08, 3.0, 0.08]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.3} />
          </mesh>
          <mesh position={[-2.2, 0, 0.05]} castShadow>
            <boxGeometry args={[0.08, 3.0, 0.08]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.3} />
          </mesh>
          <mesh position={[2.2, 0, 0.05]} castShadow>
            <boxGeometry args={[0.08, 3.0, 0.08]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[6.8, 0.08, 0.08]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.3} />
          </mesh>
          {/* Window Sill */}
          <mesh position={[0, -1.6, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[7.6, 0.16, 0.45]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* ── 6. Authentic Hospital Door ── */}
      {doorWall === 'left' && (
        <group position={[-halfW + 0.22, 1.8, halfD - 3.2]} rotation={[0, Math.PI / 2, 0]}>
          {/* Door Frame */}
          <mesh castShadow>
            <boxGeometry args={[2.2, 3.6, 0.15]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Door Leaf */}
          <mesh position={[0, 0, 0.02]} castShadow>
            <boxGeometry args={[2.0, 3.4, 0.08]} />
            <meshStandardMaterial color={colors.door} roughness={0.4} />
          </mesh>
          {/* Stainless Steel Kick Plate */}
          <mesh position={[0, -1.3, 0.07]}>
            <boxGeometry args={[1.9, 0.6, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Door Vision Inspection Window */}
          <mesh position={[0, 0.5, 0.06]}>
            <boxGeometry args={[0.5, 1.1, 0.04]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.1} transparent opacity={0.85} />
          </mesh>
          {/* Stainless Steel Door Handle */}
          <mesh position={[0.78, -0.1, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Room Number Sign Plate above Door */}
          <mesh position={[0, 1.95, 0.08]}>
            <boxGeometry args={[1.2, 0.35, 0.04]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* ── 7. Hospital Ceiling with Recessed LED Light Fixtures ── */}
      <group position={[0, height, 0]}>
        {/* Ceiling Plane */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        {/* 4 Recessed 2x4 LED Hospital Light Panels */}
        {[-width * 0.25, width * 0.25].map((x) =>
          [-depth * 0.25, depth * 0.25].map((z) => (
            <group key={`${x}-${z}`} position={[x, -0.05, z]}>
              {/* Fixture Rim */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.4, 1.4]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
              </mesh>
              {/* Diffuser Panel Emitting Soft White Hospital Light */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[2.2, 1.2]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1.0}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* ── 8. Clinical Wall Accessories ── */}
      {/* Wall Medical Bedhead Unit (Oxygen, Air, Vacuum, Nurse Call) */}
      <group position={[-4, 2.2, -halfD + 0.25]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 0.35, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Medical Oxygen Outlet (Green) */}
        <mesh position={[-0.8, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#22c55e" metalness={0.5} />
        </mesh>
        {/* Medical Air Outlet (Yellow) */}
        <mesh position={[-0.5, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.5} />
        </mesh>
        {/* Medical Suction/Vacuum Outlet (White) */}
        <mesh position={[-0.2, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.5} />
        </mesh>
        {/* Nurse Emergency Call Button (Red) */}
        <mesh position={[0.6, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Wall Hand Hygiene Sanitizer Dispenser */}
      <group position={[-halfW + 0.25, 2.0, halfD - 5.0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.45, 0.22]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Sanitizer level window */}
        <mesh position={[0.042, -0.05, 0]}>
          <boxGeometry args={[0.01, 0.2, 0.08]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Wall Digital Hospital Clock */}
      <group position={[halfW - 0.25, 5.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.5, 0.06]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.0, 0.35]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
}
