import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

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

      {/* ── Gamified 3D Interaction Prompt (2D screen-aligned so touch hit-testing is always exact on iOS) ── */}
      {isNearby && (
        <Html position={[0, seatOffset[1] + 0.85, 0]} center zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={handleSeatClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-2xl backdrop-blur-md cursor-pointer select-none transition transform hover:scale-105 active:scale-95 border-2 pointer-events-auto"
            style={{
              background: type === 'wheelchair'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
              color: 'white',
              borderColor: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-base">
              {type === 'wheelchair' ? '♿' : type === 'sofa' ? '🛋️' : type === 'bed' ? '🛏️' : '🪑'}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-yellow-300 font-mono tracking-wider">แตะเพื่อนั่ง / กด [F]</span>
              <span className="text-xs whitespace-nowrap">{name}</span>
            </div>
          </button>
        </Html>
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
