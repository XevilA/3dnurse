import React, { useMemo } from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import WalkableRoomPortal from './WalkableRoomPortal';

/**
 * HospitalRoomShell — Authentic 3D Medical / Nursery Room Architecture with Real PBR Textures
 *
 * Features:
 * - Real hospital floors with authentic textures:
 *     - Mother Ward: Warm Nordic Oak Antibacterial Medical Timber Vinyl with plank seams
 *     - Newborn Nursery: Sterile Homogeneous Seamless Medical Sheet Vinyl with pastel speckles
 *     - Quiz & Conference Hall: High-gloss polished porcelain architectural checker tiles
 *     - Grand Lobby: Luxury Italian Carrara marble & Terrazzo with golden brass inlay seams
 * - Real hospital doors with photorealistic textures:
 *     - Mother Ward: Acoustic timber laminate hospital door with stainless kick plate & frosted safety window
 *     - Newborn Nursery: Clinical cyan-blue powder-coated door with observation window & hygiene pictogram
 *     - Quiz Hall: Soundproof architectural door with panic push bar & stainless steel frame
 * - Stainless steel kick plates, lever handles, recessed ceiling LEDs, and medical bedhead units
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
          bumperRail: '#94a3b8',
          door: '#e0f2fe',
          lightTint: '#e0f7fa'
        };
      case 'quiz':
        return {
          wallUpper: '#faf5ff',
          wallLower: '#f3e8ff',
          bumperRail: '#94a3b8',
          door: '#f3e8ff',
          lightTint: '#ede7f6'
        };
      case 'lobby':
        return {
          wallUpper: '#ffffff',
          wallLower: '#f1f5f9',
          bumperRail: '#94a3b8',
          door: '#e2e8f0',
          lightTint: '#f0f9ff'
        };
      case 'mother':
      default:
        return {
          wallUpper: '#fff5f7',
          wallLower: '#fce7f3',
          bumperRail: '#94a3b8',
          door: '#fce7f3',
          lightTint: '#fff0f5'
        };
    }
  }, [theme]);

  // Load authentic floor and door textures matching each specific room
  const floorTextureUrl =
    theme === 'mother'
      ? '/textures/floor_vinyl_mother.jpg'
      : theme === 'newborn'
      ? '/textures/floor_vinyl_nursery.jpg'
      : theme === 'quiz'
      ? '/textures/floor_hall_quiz.jpg'
      : '/textures/floor_marble_lobby.jpg';

  const doorTextureUrl =
    theme === 'mother'
      ? '/textures/door_mother.jpg'
      : theme === 'newborn'
      ? '/textures/door_nursery.jpg'
      : theme === 'quiz'
      ? '/textures/door_quiz.jpg'
      : '/textures/door_mother.jpg';

  const metalTextureUrl = '/textures/door_frame_metal.jpg';

  const textures = useTexture({
    floor: floorTextureUrl,
    door: doorTextureUrl,
    metal: metalTextureUrl,
  });

  // Configure repetitive tiling for floor textures
  const configuredFloor = useMemo(() => {
    if (!textures.floor) return null;
    const cloned = textures.floor.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    const repeatFactor = theme === 'lobby' ? 6 : theme === 'quiz' ? 5 : 4;
    cloned.repeat.set(repeatFactor, repeatFactor);
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [textures.floor, theme]);

  const configuredDoor = useMemo(() => {
    if (!textures.door) return null;
    const cloned = textures.door.clone();
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [textures.door]);

  const configuredMetal = useMemo(() => {
    if (!textures.metal) return null;
    const cloned = textures.metal.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(1, 4);
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [textures.metal]);

  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group>
      {/* ── 1. Authentic Medical Floor with Real Hospital Texture ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={configuredFloor}
          roughness={theme === 'lobby' ? 0.2 : theme === 'quiz' ? 0.22 : 0.45}
          metalness={theme === 'lobby' ? 0.12 : 0.02}
        />
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

      {/* ── 4b. Front / South Wall Architecture (Floor-to-Ceiling Panoramic Glass & Outdoor Garden) ── */}
      {theme === 'lobby' ? (
        // Grand Hospital Entrance Facade (Floor-to-Ceiling Medical Glass & Outside Scenery View)
        <group position={[0, height / 2, halfD]}>
          {/* Top Architectural Soffit */}
          <mesh position={[0, (height / 2) - 0.5, 0]} receiveShadow>
            <boxGeometry args={[width, 1.0, 0.4]} />
            <meshStandardMaterial color={colors.wallUpper} roughness={0.4} />
          </mesh>

          {/* Panoramic Hospital Glass Curtain Wall */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[width, height - 1.0, 0.06]} />
            <meshPhysicalMaterial
              color="#e0f2fe"
              transmission={0.88}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.85}
              ior={1.5}
            />
          </mesh>

          {/* Stainless Steel Vertical Mullions */}
          {[-8, -5.5, -3, 0, 3, 5.5, 8].map((mx) => (
            <mesh key={`mullion_${mx}`} position={[mx, -0.5, 0.04]} castShadow>
              <boxGeometry args={[0.10, height - 1.0, 0.14]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}

          {/* Horizontal Transom Glass Rails */}
          {[-1.2, 1.4].map((ry) => (
            <mesh key={`rail_${ry}`} position={[0, ry, 0.04]}>
              <boxGeometry args={[width, 0.08, 0.12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}

          {/* Bottom Kickplate Threshold */}
          <mesh position={[0, -(height / 2) + 0.15, 0.05]}>
            <boxGeometry args={[width, 0.3, 0.22]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* ══════════════════════════════════════════════════════════════════════════
              🌳 OUTDOOR SCENERY & HOSPITAL GARDEN VIEW (มองเห็นภาพวิวภายนอกผ่านกระจก)
              ══════════════════════════════════════════════════════════════════════════ */}
          {/* Outdoor Ground / Garden Lawn Terrace */}
          <group position={[0, -(height / 2), 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Lush Lawn */}
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[width * 1.5, 14]} />
              <meshStandardMaterial color="#4ade80" roughness={0.9} />
            </mesh>
            {/* Paved Walkway Pathway */}
            <mesh position={[0, 2, -0.03]}>
              <planeGeometry args={[width * 1.2, 4]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
            </mesh>
          </group>

          {/* Garden Planters & Outdoor Trees outside the window */}
          {[-7.5, -3.5, 3.5, 7.5].map((tx) => (
            <group key={`out_tree_${tx}`} position={[tx, -(height / 2), 3.2]}>
              {/* Planter Box */}
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.4, 0.9, 1.4]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              {/* Tree Trunk */}
              <mesh position={[0, 1.8, 0]}>
                <cylinderGeometry args={[0.12, 0.16, 2.2, 12]} />
                <meshStandardMaterial color="#78350f" roughness={0.8} />
              </mesh>
              {/* Lush Tree Foliage */}
              <mesh position={[0, 3.2, 0]}>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshStandardMaterial color="#22c55e" roughness={0.6} />
              </mesh>
              <mesh position={[0.2, 3.8, 0.1]}>
                <sphereGeometry args={[0.9, 14, 14]} />
                <meshStandardMaterial color="#16a34a" roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* Outdoor Sunny Sky Landscape Backdrop */}
          <mesh position={[0, 2.5, 8.5]}>
            <planeGeometry args={[width * 1.8, height * 1.6]} />
            <meshBasicMaterial color="#7dd3fc" />
          </mesh>
          {/* Distant Soft Mountain / City Skyline Horizon */}
          <mesh position={[0, 0.8, 8.4]}>
            <planeGeometry args={[width * 1.8, 4.2]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
          </mesh>
        </group>
      ) : (
        // Enclosed clinical interior front wall
        <group position={[0, height / 2, halfD]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 1.2, 0]} receiveShadow>
            <boxGeometry args={[width, height - 2.4, 0.4]} />
            <meshStandardMaterial color={colors.wallUpper} roughness={0.6} />
          </mesh>
          <mesh position={[0, -(height / 2) + 1.2, 0]} receiveShadow>
            <boxGeometry args={[width, 2.4, 0.44]} />
            <meshStandardMaterial color={colors.wallLower} roughness={0.3} />
          </mesh>
          <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
            <boxGeometry args={[width, 0.22, 0.08]} />
            <meshStandardMaterial color={colors.bumperRail} roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, -(height / 2) + 0.1, 0.05]}>
            <boxGeometry args={[width, 0.2, 0.06]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      )}

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

      {/* ── 6. Authentic Walk-in Hospital Exit Doorway (Returns to Lobby) ── */}
      {doorWall === 'left' && theme !== 'lobby' && (
        <WalkableRoomPortal
          roomKey="lobby"
          roomNumber="EXIT"
          roomTitle="ประตูทางออก — โถงกลาง (Main Lobby)"
          icon="🚪"
          theme={theme}
          position={[-halfW + 0.22, 0, halfD - 3.2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.0}
        />
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
