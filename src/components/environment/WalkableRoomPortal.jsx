import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * WalkableRoomPortal — Modern Architectural Hospital Doorway & Walk-in Entrance
 *
 * Modeled after real premier hospital ward double-doors:
 * - Slim brushed stainless steel architrave door frame (วงกบสแตนเลสโรงพยาบาลแบบสลิม)
 * - Hospital partition wall wings with crash bumper rails on both sides
 * - Symmetrical double-leaf hospital doors (ประตูโรงพยาบาลบานคู่สมมาตร):
 *     - Observation vision panel with safety glass & stainless glazing beads
 *     - Full-width heavy-duty stainless steel kick plates
 *     - Long vertical ergonomic tubular stainless pull/push handles
 *     - Top overhead hydraulic door closer units
 * - Smooth automatic hydraulic opening animation on player approach (เปิดต้อนรับอัตโนมัติ)
 * - Clean backlit LED directory header sign (ป้ายไฟชื่อห้องมาตรฐานโรงพยาบาล)
 * - Authentic floor transition threshold with destination room texture
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
  const hasCompletedPretest = useStore((state) => state.hasCompletedPretest);
  const triggerPretestWarning = useStore((state) => state.triggerPretestWarning);
  const isCompleted = !!learningProgress[roomKey];
  const isLocked = roomKey !== 'quiz' && roomKey !== 'lobby' && roomKey !== 'dressingRoom' && !hasCompletedPretest;

  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Theme palettes
  const themeConfig = {
    lobby: {
      primary: '#0ea5e9',
      secondary: '#f0f9ff',
      accent: '#38bdf8',
      text: '#0369a1',
      glow: '#38bdf8',
      doorColor: '#cbd5e1',
      bumper: '#94a3b8',
      badgeBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    },
    mother: {
      primary: '#e91e63',
      secondary: '#fce4ec',
      accent: '#ff80ab',
      text: '#880e4f',
      glow: '#ff80ab',
      doorColor: '#dfc3a4', // warm nordic hospital oak laminate
      bumper: '#f472b6',
      badgeBg: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
    },
    newborn: {
      primary: '#0288d1',
      secondary: '#e1f5fe',
      accent: '#81d4fa',
      text: '#01579b',
      glow: '#81d4fa',
      doorColor: '#bae6fd', // clinical pastel cyan-blue
      bumper: '#38bdf8',
      badgeBg: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
    },
    quiz: {
      primary: '#7c3aed',
      secondary: '#f3e8ff',
      accent: '#c084fc',
      text: '#4c1d95',
      glow: '#c084fc',
      doorColor: '#475569', // architectural soundproof charcoal
      bumper: '#a855f7',
      badgeBg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    },
  }[theme] || {
    primary: '#0288d1',
    secondary: '#e1f5fe',
    accent: '#81d4fa',
    text: '#01579b',
    glow: '#81d4fa',
    doorColor: '#bae6fd',
    bumper: '#38bdf8',
    badgeBg: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
  };

  // Destination floor texture
  const floorUrl =
    roomKey === 'lobby'
      ? '/textures/floor_marble_lobby.jpg'
      : theme === 'mother'
      ? '/textures/floor_vinyl_mother.jpg'
      : theme === 'newborn'
      ? '/textures/floor_vinyl_nursery.jpg'
      : '/textures/floor_hall_quiz.jpg';

  const doorUrl =
    roomKey === 'lobby'
      ? '/textures/door_quiz.jpg'
      : theme === 'mother'
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

  // Proximity, Automatic Door Swing & Walk-in Trigger
  useFrame((_, delta) => {
    const playerPos = useStore.getState().playerPosition;
    if (!playerPos) return;

    const dx = playerPos[0] - px;
    const dz = playerPos[2] - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const near = dist < 2.6;
    if (near !== isNear) {
      setIsNear(near);
    }

    // Smooth hydraulic swing open ONLY when unlocked and player approaches
    const targetAngleLeft = (near && !isLocked) ? -1.18 : 0;
    const targetAngleRight = (near && !isLocked) ? 1.18 : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.damp(
        leftDoorRef.current.rotation.y,
        targetAngleLeft,
        6,
        delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.damp(
        rightDoorRef.current.rotation.y,
        targetAngleRight,
        6,
        delta
      );
    }

    // Physical walk-in threshold (< 1.35m from doorway center)
    if (dist < 1.35) {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        if (isLocked) {
          triggerPretestWarning(roomKey);
        } else {
          if (roomKey !== 'lobby') {
            const rotY = px < -5 ? Math.PI / 2 : px > 5 ? -Math.PI / 2 : 0;
            const spawnX = px < -5 ? px + 1.4 : px > 5 ? px - 1.4 : px;
            const spawnZ = pz < -5 ? pz + 1.4 : pz > 5 ? pz - 1.4 : pz;
            useStore.getState().setLobbySpawn([spawnX, 0, spawnZ], rotY);
          }
          setRoom(roomKey);
        }
      }
    } else if (dist > 2.2) {
      // Reset trigger flag when player walks away
      hasTriggeredRef.current = false;
    }
  });

  const handleEnter = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isLocked) {
      triggerPretestWarning(roomKey);
    } else {
      if (roomKey !== 'lobby') {
        const rotY = px < -5 ? Math.PI / 2 : px > 5 ? -Math.PI / 2 : 0;
        const spawnX = px < -5 ? px + 1.4 : px > 5 ? px - 1.4 : px;
        const spawnZ = pz < -5 ? pz + 1.4 : pz > 5 ? pz - 1.4 : pz;
        useStore.getState().setLobbySpawn([spawnX, 0, spawnZ], rotY);
      }
      setRoom(roomKey);
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ══════════════════════════════════════════════════════════════════════════
          1. SLIM BRUSHED STAINLESS STEEL DOOR FRAME (วงกบสแตนเลสแบบสลิม)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Left Jamb */}
      <mesh position={[-0.84, 1.25, 0]} castShadow>
        <boxGeometry args={[0.07, 2.50, 0.10]} />
        <meshStandardMaterial
          map={configuredMetal}
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>
      {/* Right Jamb */}
      <mesh position={[0.84, 1.25, 0]} castShadow>
        <boxGeometry args={[0.07, 2.50, 0.10]} />
        <meshStandardMaterial
          map={configuredMetal}
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>
      {/* Lintel Header */}
      <mesh position={[0, 2.51, 0]} castShadow>
        <boxGeometry args={[1.75, 0.06, 0.10]} />
        <meshStandardMaterial
          map={configuredMetal}
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. SYMMETRICAL DOUBLE HOSPITAL SWING DOORS (ประตูบานคู่โรงพยาบาลสมมาตร)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* ── Left Door Leaf (Pivot at left jamb X = -0.79) ── */}
      <group ref={leftDoorRef} position={[-0.79, 0, 0]}>
        {/* Main Door Slab */}
        <mesh position={[0.39, 1.22, 0]} castShadow>
          <boxGeometry args={[0.78, 2.42, 0.04]} />
          <meshStandardMaterial map={configuredDoor} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Stainless Steel Glazing Vision Window Frame */}
        <mesh position={[0.48, 1.42, 0]}>
          <boxGeometry args={[0.24, 0.88, 0.046]} />
          <meshStandardMaterial map={configuredMetal} color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Safety Glass Vision Panel */}
        <mesh position={[0.48, 1.42, 0]}>
          <boxGeometry args={[0.20, 0.84, 0.048]} />
          <meshPhysicalMaterial
            color="#e0f7fa"
            transmission={0.82}
            roughness={0.08}
            transparent
            opacity={0.9}
            ior={1.5}
          />
        </mesh>
        {/* Frosted Privacy Center Stripe on Vision Glass */}
        <mesh position={[0.48, 1.42, 0.026]}>
          <planeGeometry args={[0.19, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} transparent opacity={0.65} />
        </mesh>
        {/* Heavy-Duty Stainless Steel Kick Plate (32 cm height) */}
        <mesh position={[0.39, 0.18, 0.022]}>
          <boxGeometry args={[0.76, 0.32, 0.008]} />
          <meshStandardMaterial map={configuredMetal} color="#cbd5e1" metalness={0.88} roughness={0.2} />
        </mesh>
        {/* Long Vertical Tubular Stainless Steel Pull/Push Handle */}
        <group position={[0.70, 1.10, 0.04]}>
          {/* Main Handle Bar */}
          <mesh castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.65, 16]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Top & Bottom Stand-off Stems */}
          <mesh position={[-0.01, 0.28, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 12]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.01, -0.28, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 12]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
        {/* Overhead Hydraulic Door Closer Arm */}
        <mesh position={[0.55, 2.41, 0.03]} castShadow>
          <boxGeometry args={[0.22, 0.04, 0.05]} />
          <meshStandardMaterial map={configuredMetal} color="#94a3b8" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Right Door Leaf (Pivot at right jamb X = +0.79) ── */}
      <group ref={rightDoorRef} position={[0.79, 0, 0]}>
        {/* Main Door Slab */}
        <mesh position={[-0.39, 1.22, 0]} castShadow>
          <boxGeometry args={[0.78, 2.42, 0.04]} />
          <meshStandardMaterial map={configuredDoor} roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Stainless Steel Glazing Vision Window Frame */}
        <mesh position={[-0.48, 1.42, 0]}>
          <boxGeometry args={[0.24, 0.88, 0.046]} />
          <meshStandardMaterial map={configuredMetal} color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Safety Glass Vision Panel */}
        <mesh position={[-0.48, 1.42, 0]}>
          <boxGeometry args={[0.20, 0.84, 0.048]} />
          <meshPhysicalMaterial
            color="#e0f7fa"
            transmission={0.82}
            roughness={0.08}
            transparent
            opacity={0.9}
            ior={1.5}
          />
        </mesh>
        {/* Frosted Privacy Center Stripe on Vision Glass */}
        <mesh position={[-0.48, 1.42, 0.026]}>
          <planeGeometry args={[0.19, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} transparent opacity={0.65} />
        </mesh>
        {/* Heavy-Duty Stainless Steel Kick Plate (32 cm height) */}
        <mesh position={[-0.39, 0.18, 0.022]}>
          <boxGeometry args={[0.76, 0.32, 0.008]} />
          <meshStandardMaterial map={configuredMetal} color="#cbd5e1" metalness={0.88} roughness={0.2} />
        </mesh>
        {/* Long Vertical Tubular Stainless Steel Pull/Push Handle */}
        <group position={[-0.70, 1.10, 0.04]}>
          {/* Main Handle Bar */}
          <mesh castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.65, 16]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Top & Bottom Stand-off Stems */}
          <mesh position={[0.01, 0.28, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 12]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.01, -0.28, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 12]} />
            <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
        {/* Overhead Hydraulic Door Closer Arm */}
        <mesh position={[-0.55, 2.41, 0.03]} castShadow>
          <boxGeometry args={[0.22, 0.04, 0.05]} />
          <meshStandardMaterial map={configuredMetal} color="#94a3b8" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. INTERIOR ROOM DEPTH & WARM HOSPITAL LIGHTING
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Interior Doorway Depth Void */}
      <mesh position={[0, 1.25, -0.08]}>
        <planeGeometry args={[1.60, 2.45]} />
        <meshStandardMaterial
          color={themeConfig.secondary}
          emissive={themeConfig.accent}
          emissiveIntensity={isNear ? 0.45 : 0.20}
          roughness={0.3}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Welcoming Warm Overhead Threshold Spot */}
      <pointLight
        position={[0, 2.4, 0.35]}
        color={isLocked ? '#f59e0b' : themeConfig.glow}
        intensity={isNear ? (isLocked ? 1.8 : 2.8) : 1.2}
        distance={4.5}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          5. ENTRANCE THRESHOLD & DESTINATION FLOOR MAT
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Brushed Stainless Steel Saddle Threshold Strip */}
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <boxGeometry args={[1.62, 0.012, 0.06]} />
        <meshStandardMaterial map={configuredMetal} color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Welcoming Floor Mat featuring Destination Room Floor Texture */}
      <mesh position={[0, 0.008, 0.45]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.56, 0.82]} />
        <meshStandardMaterial map={configuredFloor} roughness={0.4} />
      </mesh>

      {/* ── Holographic 3D Security Lock Barrier for locked learning rooms ── */}
      {isLocked && (
        <group position={[0, 1.22, 0.08]}>
          <mesh>
            <boxGeometry args={[1.56, 0.16, 0.02]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#dc2626"
              emissiveIntensity={0.6}
              transparent
              opacity={0.88}
            />
          </mesh>
          <Html position={[0, 0, 0.02]} center transform scale={0.12}>
            <div style={{
              background: 'rgba(220, 38, 38, 0.95)',
              color: 'white',
              padding: '4px 14px',
              borderRadius: '12px',
              fontWeight: '900',
              fontSize: '13px',
              border: '1.5px solid white',
              boxShadow: '0 0 12px rgba(220, 38, 38, 0.9)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              cursor: 'pointer'
            }}
            onClick={handleEnter}
            >
              🔒 ห้องล็อค • ต้องทำแบบทดสอบก่อนเรียน (Pre-test) ที่ Hall 301 ก่อน
            </div>
          </Html>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. SLEEK BACKLIT LED DIRECTORY SIGN (ป้ายไฟชื่อห้องมาตรฐานโมเดิร์นคลีน)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Acrylic Backlit Header Box */}
      <group position={[0, 2.70, 0.03]}>
        {/* Main Sign Box */}
        <mesh castShadow>
          <boxGeometry args={[1.64, 0.26, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Stainless Steel Perimeter Trim */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.66, 0.28, 0.03]} />
          <meshStandardMaterial map={configuredMetal} color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Crisp HTML Sign Content */}
        <Html position={[0, -0.01, 0.035]} center transform scale={0.16}>
          <div
            onClick={handleEnter}
            onPointerDown={handleEnter}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              textAlign: 'center',
              width: '440px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              pointerEvents: 'auto',
            }}
          >
            {isLocked ? (
              /* Locked Header Sign */
              <>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <span>🔒</span>
                  <span>{roomNumber} (ล็อค)</span>
                </div>

                <div
                  style={{
                    color: '#475569',
                    fontSize: '15px',
                    fontWeight: '800',
                    marginTop: '5px',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {roomTitle}
                </div>

                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>⚠️ กรุณาทำแบบทดสอบก่อนเรียน (Pre-test) ที่ Hall 301 ก่อน</span>
                </div>
              </>
            ) : roomKey === 'quiz' && !hasCompletedPretest ? (
              /* Pre-test Starting Point Sign */
              <>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '5px 20px',
                    borderRadius: '18px',
                    fontSize: '15px',
                    fontWeight: '900',
                    letterSpacing: '0.5px',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.7)',
                  }}
                >
                  <span>⭐</span>
                  <span>จุดเริ่มต้น: ทำแบบทดสอบก่อนเรียน (20 ข้อ)</span>
                </div>

                <div
                  style={{
                    color: '#1e293b',
                    fontSize: '16px',
                    fontWeight: '900',
                    marginTop: '5px',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {roomTitle}
                </div>

                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{isNear ? '🚪 ประตูเปิดแล้ว — เดินเข้าไปเพื่อเริ่มทำแบบทดสอบ ➜' : '✨ ก้าวเข้าไปเพื่อทำ Pre-test 20 ข้อ (ปลดล็อคทุกห้อง)'}</span>
                </div>
              </>
            ) : (
              /* Regular Unlocked Sign */
              <>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: themeConfig.badgeBg,
                    color: 'white',
                    padding: '4px 18px',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  }}
                >
                  <span>{icon}</span>
                  <span>{roomNumber}</span>
                  {isCompleted && <span>✅ ผ่านแล้ว</span>}
                </div>

                <div
                  style={{
                    color: '#1e293b',
                    fontSize: '16px',
                    fontWeight: '800',
                    marginTop: '6px',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {roomTitle}
                </div>

                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: isNear ? themeConfig.primary : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{isNear ? '🚪 ประตูเปิดแล้ว — เดินเข้าไปเพื่อเข้าสู่ห้องนี้ ➜' : 'เดินเข้าใกล้เพื่อให้ประตูเปิด / คลิกเพื่อเข้า'}</span>
                </div>
              </>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}
