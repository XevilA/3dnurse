import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import BillboardLabel3D from '../ui/BillboardLabel3D';

/**
 * InteractiveSeat — Gamified 3D Seating System
 *
 * Wraps wheelchairs, sofas, chairs, and beds with:
 *   1. Automatic proximity detection & floating [F] interaction badge
 *   2. Smooth sitting / standing mechanics
 *   3. Drivable wheelchair support (wheelchair follows player when driving)
 *   4. Direct click/touch to sit down
 */
export default function InteractiveSeat({
  id,
  name = 'ที่นั่งพักผ่อน',
  type = 'chair', // 'wheelchair' | 'sofa' | 'chair' | 'bed'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  seatOffset = [0, 0.45, 0],
  isDrivable = false,
  children,
}) {
  const groupRef = useRef();
  const registerSeat = useStore((s) => s.registerSeat);
  const unregisterSeat = useStore((s) => s.unregisterSeat);
  const isSitting = useStore((s) => s.isSitting);
  const sitDown = useStore((s) => s.sitDown);

  // Selective subscriptions: only re-render THIS seat when its state changes
  const isCurrentSeated = useStore((s) => s.isSitting && s.seatedTarget?.id === id);
  const isNearby = useStore((s) => s.nearbySeat?.id === id && !s.isSitting);

  // Seat rotation Y in radians
  const rotY = Array.isArray(rotation) ? rotation[1] : 0;

  // Dynamic position ref for drivable seats (wheelchairs)
  const currentPos = useRef(new THREE.Vector3(...position));
  const currentRotY = useRef(rotY);

  // Stable scalar coordinates to eliminate dependency churn
  const px = position[0] ?? 0;
  const py = position[1] ?? 0;
  const pz = position[2] ?? 0;
  const ox = seatOffset[0] ?? 0;
  const oy = seatOffset[1] ?? 0;
  const oz = seatOffset[2] ?? 0;

  // Register in central seating registry (fires strictly on mount or real coordinate change)
  useEffect(() => {
    registerSeat({
      id,
      name,
      type,
      position: [px, py, pz],
      rotationY: rotY,
      seatOffset: [ox, oy, oz],
      isDrivable,
    });
    return () => unregisterSeat(id);
  }, [id, name, type, px, py, pz, rotY, ox, oy, oz, isDrivable, registerSeat, unregisterSeat]);

  // Synchronize wheelchair movement when player drives it
  useFrame(() => {
    if (!groupRef.current) return;

    if (isCurrentSeated && isDrivable) {
      const playerPos = useStore.getState().playerPosition;
      // Wheelchair smoothly attaches to the seated player
      currentPos.current.x = playerPos[0];
      currentPos.current.z = playerPos[2];
      groupRef.current.position.copy(currentPos.current);

      // Follow player facing rotation
      const pRotY = useStore.getState().playerRotationY;
      if (typeof pRotY === 'number') {
        currentRotY.current = pRotY;
        groupRef.current.rotation.y = pRotY;
      }
    }
  });

  const handleSeatClick = (e) => {
    if (e && typeof e.delta === 'number' && e.delta > 10) return;
    if (e?.stopPropagation) e.stopPropagation();
    if (!isSitting) {
      sitDown({
        id,
        name,
        type,
        position: [currentPos.current.x, currentPos.current.y, currentPos.current.z],
        rotationY: currentRotY.current,
        seatOffset,
        isDrivable,
      });
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleSeatClick}
    >
      {/* 3D Furniture Model */}
      {children}

      {/* ── Gamified 3D Interaction Prompt (100% WebGL depth-buffered so it never overlaps character head) ── */}
      {isNearby && id !== 'room103_practice_sofa' && id !== 'room104_sofa' && (
        <BillboardLabel3D
          position={[0, seatOffset[1] + 0.88, 0]}
          text={`${type === 'wheelchair' ? '♿' : type === 'sofa' ? '🛋️' : type === 'bed' ? '🛏️' : '🪑'} แตะเพื่อนั่ง / กด [F]`}
          subtext={name}
          bg={type === 'wheelchair' ? '#0284c7' : '#db2777'}
          bgEnd={type === 'wheelchair' ? '#0369a1' : '#be185d'}
          subtextColor="#fef08a"
          width={1.55}
          height={0.42}
          pill={false}
          onClick={handleSeatClick}
        />
      )}

      {/* Subtle floor glowing halo when nearby */}
      {isNearby && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 32]} />
          <meshBasicMaterial
            color={type === 'wheelchair' ? '#00e5ff' : '#f472b6'}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}
