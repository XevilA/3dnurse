import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';

let _sharedLockBannerTex = null;
function getSharedLockBannerTex() {
  if (_sharedLockBannerTex) return _sharedLockBannerTex;
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 88;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.font = `900 25px ${CANVAS_THAI_FONT}`;
    fillCenteredText(
      ctx,
      '🔒 ห้องล็อค • ต้องทำแบบทดสอบก่อนเรียน (Pre-test) ที่ Hall 301 ก่อน',
      canvas.width / 2,
      canvas.height / 2,
      canvas.width - 28
    );
    tex.needsUpdate = true;
  };

  draw();
  whenFontsReady(draw);
  _sharedLockBannerTex = tex;
  return tex;
}

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
  const requestRoomEntry = useStore((state) => state.requestRoomEntry);
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
    textures.metal.wrapS = THREE.RepeatWrapping;
    textures.metal.wrapT = THREE.RepeatWrapping;
    textures.metal.repeat.set(1, 4);
    textures.metal.colorSpace = THREE.SRGBColorSpace;
    return textures.metal;
  }, [textures.metal]);

  const configuredFloor = useMemo(() => {
    if (!textures.floor) return null;
    textures.floor.wrapS = THREE.RepeatWrapping;
    textures.floor.wrapT = THREE.RepeatWrapping;
    if (roomKey !== 'lobby') {
      textures.floor.repeat.set(2, 2);
    }
    textures.floor.colorSpace = THREE.SRGBColorSpace;
    return textures.floor;
  }, [textures.floor, roomKey]);

  const configuredDoor = useMemo(() => {
    if (!textures.door) return null;
    textures.door.colorSpace = THREE.SRGBColorSpace;
    return textures.door;
  }, [textures.door]);

  const { headerSignTex, redrawHeaderSign } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = isLocked ? '#ef4444' : themeConfig.primary;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      // Top badge pill
      const badgeColor = isLocked
        ? '#dc2626'
        : roomKey === 'quiz' && !hasCompletedPretest
        ? '#d97706'
        : themeConfig.primary;
      ctx.fillStyle = badgeColor;
      ctx.fillRect(18, 14, canvas.width - 36, 58);

      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.font = `900 31px ${CANVAS_THAI_FONT}`;
      const badgeLabel = isLocked
        ? `🔒 ${roomNumber} (ล็อค — ทำ Pre-test ที่ Hall 301 ก่อน)`
        : roomKey === 'quiz' && !hasCompletedPretest
        ? `⭐ จุดเริ่มต้น: ${roomNumber} • ทำ Pre-test 20 ข้อ`
        : `${icon || ''} ${roomNumber}${isCompleted ? '  ✅ ผ่านแล้ว' : ''}`.trim();
      fillCenteredText(ctx, badgeLabel, canvas.width / 2, 43, canvas.width - 68);

      // Room title (enlarged & dead-center across iOS/iPadOS Safari & Desktop)
      ctx.fillStyle = '#0f172a';
      ctx.font = `900 46px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, roomTitle || '', canvas.width / 2, 136, canvas.width - 52);

      // Subtitle action hint
      ctx.fillStyle = isLocked ? '#dc2626' : themeConfig.text;
      ctx.font = `800 24px ${CANVAS_THAI_FONT}`;
      const subLabel = isLocked
        ? '⚠️ กรุณาทำแบบทดสอบก่อนเรียน (Pre-test) ที่ Hall 301 ก่อน'
        : '🚪 เดินเข้าใกล้เพื่อให้ประตูเปิดอัตโนมัติ หรือคลิกที่ป้ายเพื่อเข้าห้อง ➜';
      fillCenteredText(ctx, subLabel, canvas.width / 2, 208, canvas.width - 52);

      tex.needsUpdate = true;
    };

    draw();
    return { headerSignTex: tex, redrawHeaderSign: draw };
  }, [isLocked, roomKey, hasCompletedPretest, roomNumber, roomTitle, icon, isCompleted, themeConfig.primary, themeConfig.text]);

  useEffect(() => {
    const cancelFonts = whenFontsReady(redrawHeaderSign);
    return () => {
      cancelFonts();
      headerSignTex.dispose();
    };
  }, [headerSignTex, redrawHeaderSign]);

  const lockBannerTex = isLocked ? getSharedLockBannerTex() : null;

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
          if (roomKey === 'lobby') {
            setRoom('lobby');
          } else {
            requestRoomEntry({ roomKey, roomTitle, roomNumber, icon });
          }
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
      if (roomKey === 'lobby') {
        setRoom('lobby');
      } else {
        requestRoomEntry({ roomKey, roomTitle, roomNumber, icon });
      }
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
          <meshStandardMaterial
            color="#e0f7fa"
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.38}
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
          <meshStandardMaterial
            color="#e0f7fa"
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.38}
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

      {/* ── 3D Security Lock Barrier for locked learning rooms (3D Mesh ไม่ลอย) ── */}
      {isLocked && (
        <group position={[0, 1.22, 0.04]} onClick={handleEnter}>
          <mesh>
            <boxGeometry args={[1.56, 0.18, 0.02]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#dc2626"
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1.54, 0.17]} />
            <meshBasicMaterial map={lockBannerTex} toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. SLEEK BACKLIT LED DIRECTORY SIGN (ป้ายไฟชื่อห้อง 3D แท้ติดผนัง ขนาดใหญ่ชัดเจน ข้อความตรงกลาง 100%)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 2.88, 0.03]} onClick={handleEnter}>
        {/* Main Sign Box */}
        <mesh castShadow>
          <boxGeometry args={[2.72, 0.68, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.08} />
        </mesh>
        {/* Stainless Steel Perimeter Trim */}
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[2.78, 0.73, 0.04]} />
          <meshStandardMaterial map={configuredMetal} color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* 3D Sign Face Texture (แนบติดกรอบป้ายบนกำแพง 100% ไม่ใช้ Html transform) */}
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[2.66, 0.65]} />
          <meshBasicMaterial map={headerSignTex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
