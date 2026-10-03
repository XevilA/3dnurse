import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * WalkableRoomPortal — 3D Physical Doorway & Walk-in Teleporter
 *
 * Allows players to physically walk through the doorway into any specific care room!
 * Features:
 * - Real hospital textures (brushed stainless frame, authentic door leaf, destination floor mat)
 * - 3D Hospital Door Frame with illuminated LED overhead lintel & room number
 * - Pulsing floor entrance trigger pad
 * - Physical walk-in proximity detector (triggers room transition on approach)
 * - Clickable interaction fallback for mobile/touch
 * - Completion status badge (✅ ผ่านแล้ว)
 */
export default function WalkableRoomPortal({
  roomKey,
  roomNumber,
  roomTitle,
  icon,
  theme = 'mother', // 'mother' | 'newborn' | 'quiz'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) {
  const setRoom = useStore((state) => state.setRoom);
  const learningProgress = useStore((state) => state.learningProgress);
  const isCompleted = !!learningProgress[roomKey];

  const ringRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Theme palettes
  const themeConfig = {
    mother: {
      primary: '#e91e63',
      secondary: '#fce4ec',
      accent: '#ff80ab',
      text: '#880e4f',
      glow: '#ff4081',
      badgeBg: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
    },
    newborn: {
      primary: '#0288d1',
      secondary: '#e1f5fe',
      accent: '#81d4fa',
      text: '#01579b',
      glow: '#00b0ff',
      badgeBg: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
    },
    quiz: {
      primary: '#7c3aed',
      secondary: '#f3e8ff',
      accent: '#c084fc',
      text: '#4c1d95',
      glow: '#a855f7',
      badgeBg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    },
  }[theme] || {
    primary: '#0288d1',
    secondary: '#e1f5fe',
    accent: '#81d4fa',
    text: '#01579b',
    glow: '#00b0ff',
    badgeBg: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
  };

  // Textures matching the destination room
  const floorUrl =
    theme === 'mother'
      ? '/textures/floor_vinyl_mother.jpg'
      : theme === 'newborn'
      ? '/textures/floor_vinyl_nursery.jpg'
      : '/textures/floor_hall_quiz.jpg';

  const doorUrl =
    theme === 'mother'
      ? '/textures/door_mother.jpg'
      : theme === 'newborn'
      ? '/textures/door_nursery.jpg'
      : '/textures/door_quiz.jpg';

  const textures = useTexture({
    metal: '/textures/door_frame_metal.jpg',
    floor: floorUrl,
    door: doorUrl,
  });

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

  const configuredFloor = useMemo(() => {
    if (!textures.floor) return null;
    const cloned = textures.floor.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    cloned.repeat.set(2, 2);
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [textures.floor]);

  const configuredDoor = useMemo(() => {
    if (!textures.door) return null;
    const cloned = textures.door.clone();
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [textures.door]);

  const [px, py, pz] = position;

  // Proximity & Walk-In Detection
  useFrame((_, delta) => {
    // Pulse floor ring
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      const s = 1.0 + Math.sin(Date.now() * 0.004) * 0.08;
      ringRef.current.scale.set(s, s, s);
    }

    // Check player distance to portal
    const playerPos = useStore.getState().playerPosition;
    if (!playerPos) return;

    const dx = playerPos[0] - px;
    const dz = playerPos[2] - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const near = dist < 2.5;
    if (near !== isNear) {
      setIsNear(near);
    }

    // Physical walk-in threshold (< 1.15m from door center)
    if (dist < 1.15 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setRoom(roomKey);
    }
  });

  const handleEnter = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setRoom(roomKey);
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── 1. Door Frame 3D Geometry with Brushed Stainless Texture ── */}
      {/* Left Pillar */}
      <mesh position={[-0.95, 1.45, 0]} castShadow>
        <boxGeometry args={[0.18, 2.9, 0.22]} />
        <meshStandardMaterial map={configuredMetal} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[0.95, 1.45, 0]} castShadow>
        <boxGeometry args={[0.18, 2.9, 0.22]} />
        <meshStandardMaterial map={configuredMetal} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Upper Lintel Frame */}
      <mesh position={[0, 2.9, 0]} castShadow>
        <boxGeometry args={[2.08, 0.2, 0.24]} />
        <meshStandardMaterial map={configuredMetal} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Decorative Outer Arch Accent */}
      <mesh position={[0, 3.25, 0.02]} castShadow>
        <boxGeometry args={[2.2, 0.5, 0.16]} />
        <meshStandardMaterial color={themeConfig.primary} roughness={0.3} />
      </mesh>

      {/* ── Open Hospital Door Leaf Swung Inward ── */}
      <group position={[-0.85, 0, 0]} rotation={[0, -1.15, 0]}>
        {/* Door Leaf with authentic texture */}
        <mesh position={[0.42, 1.35, 0]} castShadow>
          <boxGeometry args={[0.85, 2.7, 0.05]} />
          <meshStandardMaterial map={configuredDoor} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Stainless Steel Kick Plate */}
        <mesh position={[0.42, 0.2, 0.028]}>
          <boxGeometry args={[0.83, 0.38, 0.008]} />
          <meshStandardMaterial map={configuredMetal} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Stainless Steel Lever Handle */}
        <group position={[0.78, 1.15, 0.035]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial map={configuredMetal} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Glowing Threshold Light */}
      <pointLight
        position={[0, 2.2, 0.4]}
        color={themeConfig.glow}
        intensity={isNear ? 2.5 : 1.2}
        distance={4.5}
      />

      {/* ── 2. Walkable Opening Silhouette (Depth Plane) ── */}
      {/* Semi-transparent doorway portal opening giving depth to the next room */}
      <mesh position={[0, 1.35, -0.06]}>
        <planeGeometry args={[1.72, 2.7]} />
        <meshStandardMaterial
          color={themeConfig.secondary}
          emissive={themeConfig.accent}
          emissiveIntensity={isNear ? 0.35 : 0.15}
          roughness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── 3. Floor Entrance Mat with Destination Floor Texture ── */}
      <mesh position={[0, 0.015, 0.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.7, 0.9]} />
        <meshStandardMaterial
          map={configuredFloor}
          roughness={0.4}
        />
      </mesh>

      {/* Pulsing Floor Ring with Entrance Chevron */}
      <group position={[0, 0.02, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.55, 0.72, 32]} />
          <meshBasicMaterial
            color={themeConfig.primary}
            transparent
            opacity={isNear ? 0.9 : 0.5}
          />
        </mesh>
      </group>

      {/* ── 4. Interactive Hospital Overhead Door Sign (True 3D Perspective Plaque) ── */}
      <Html position={[0, 3.35, 0.12]} center transform scale={0.24}>
        <div
          onClick={handleEnter}
          onPointerDown={handleEnter}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            textAlign: 'center',
            minWidth: '240px',
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.96)',
            border: `2.5px solid ${themeConfig.primary}`,
            boxShadow: isNear
              ? `0 0 24px ${themeConfig.primary}, 0 10px 25px rgba(0,0,0,0.3)`
              : '0 4px 14px rgba(0,0,0,0.12)',
            transform: isNear ? 'scale(1.06)' : 'scale(1.0)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'auto',
          }}
        >
          {/* Room Number Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: themeConfig.badgeBg,
              color: 'white',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span>{roomNumber}</span>
            {isCompleted && <span>✅</span>}
          </div>

          {/* Room Title */}
          <div
            style={{
              color: themeConfig.text,
              fontSize: '15px',
              fontWeight: '800',
              marginTop: '6px',
              lineHeight: '1.25',
              whiteSpace: 'nowrap',
            }}
          >
            {roomTitle}
          </div>

          {/* Walk-in Action Indicator */}
          <div
            style={{
              marginTop: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: isNear ? themeConfig.primary : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span>🚪</span>
            <span>{isNear ? 'เดินเข้าไปเพื่อเข้าสู่ห้องนี้ ➜' : 'เดินเข้าห้อง / คลิกเพื่อเข้า'}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
