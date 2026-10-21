import React from 'react';
import * as THREE from 'three';

/**
 * BabyProps — Reusable 3D baby care prop collection
 * Built from R3F primitives — no external GLB loading needed
 */

/** ผ้าอ้อม Stack — Stack of folded diapers on a surface */
export function DiaperStack({ position = [0, 0, 0], count = 5, color = '#f8fafc' }) {
  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.028, 0]} castShadow>
          <boxGeometry args={[0.18, 0.025, 0.14]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : '#e2e8f0'} roughness={0.8} />
        </mesh>
      ))}
      {/* Yellow stripe accent on top diaper */}
      <mesh position={[0, count * 0.028, 0]} castShadow>
        <boxGeometry args={[0.12, 0.004, 0.06]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** ขวดนม — Baby feeding bottle */
export function BabyBottle({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#bae6fd' }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.038, 0.16, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.75} roughness={0.1} metalness={0.05} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.095, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.035, 0.025, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      {/* Nipple/Cap */}
      <mesh position={[0, 0.115, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.02, 10]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} />
      </mesh>
      {/* Milk level indicator */}
      <mesh position={[0, -0.01, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.039, 0.10, 12]} />
        <meshStandardMaterial color="#f0f9ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** อ่างอาบน้ำเด็ก — Small infant bathtub (table-top style) */
export function InfantBathTub({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tub body — slightly tapered oval shape using scaled box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.22, 0.34]} />
        <meshStandardMaterial color="#7dd3fc" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Inner basin (slightly smaller, inset) */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.50, 0.18, 0.28]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.2} side={THREE.BackSide} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <boxGeometry args={[0.60, 0.018, 0.36]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} />
      </mesh>
      {/* Drain stopper */}
      <mesh position={[0.20, -0.10, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {/* Small legs/stand */}
      {[[-0.24, -0.18, -0.13], [0.24, -0.18, -0.13], [-0.24, -0.18, 0.13], [0.24, -0.18, 0.13]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** Thermometer — เทอร์โมมิเตอร์วัดอุณหภูมิน้ำ */
export function BathThermometer({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.075, 0]} castShadow>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Baby towel — ผ้าเช็ดตัวพับ */
export function BabyTowel({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#fce7f3' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.30, 0.04, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Hood/ear fold */}
      <mesh position={[0.13, 0.025, -0.09]} castShadow>
        <boxGeometry args={[0.04, 0.02, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Baby cotton swabs / สำลี in a small jar */
export function CottonJar({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.065, 10]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Cotton top */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <sphereGeometry args={[0.026, 8, 8]} />
        <meshStandardMaterial color="white" roughness={0.95} />
      </mesh>
    </group>
  );
}

/** ชั้นวางของใช้ทารก — Shelf unit with colorful diaper rows */
export function BabyShelf({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const colors = ['#fde68a', '#a7f3d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];
  return (
    <group position={position} rotation={rotation}>
      {/* Back panel */}
      <mesh position={[0, 0.8, -0.12]} castShadow receiveShadow>
        <boxGeometry args={[0.90, 1.60, 0.04]} />
        <meshStandardMaterial color="#d4a96a" roughness={0.7} />
      </mesh>
      {/* Side panels */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0]} castShadow>
          <boxGeometry args={[0.04, 1.60, 0.28]} />
          <meshStandardMaterial color="#c9954a" roughness={0.7} />
        </mesh>
      ))}
      {/* 4 shelves */}
      {[0.05, 0.45, 0.85, 1.25].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.90, 0.04, 0.28]} />
          <meshStandardMaterial color="#c9954a" roughness={0.6} />
        </mesh>
      ))}
      {/* Top panel */}
      <mesh position={[0, 1.60, 0]} castShadow>
        <boxGeometry args={[0.90, 0.04, 0.28]} />
        <meshStandardMaterial color="#c9954a" roughness={0.6} />
      </mesh>
      {/* Diaper packages on each shelf — 3 per shelf */}
      {[0.08, 0.48, 0.88, 1.28].map((y, si) =>
        [-0.25, 0, 0.25].map((x, pi) => (
          <mesh key={`${si}-${pi}`} position={[x, y + 0.065, 0.02]} castShadow>
            <boxGeometry args={[0.22, 0.10, 0.20]} />
            <meshStandardMaterial color={colors[(si * 3 + pi) % colors.length]} roughness={0.6} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** ถังขยะโรงพยาบาล — Hospital waste bin (step-open style) */
export function HospitalBin({ position = [0, 0, 0], color = '#64748b' }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.10, 0.44, 10]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.455, 0]} castShadow>
        <cylinderGeometry args={[0.135, 0.135, 0.025, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Foot pedal */}
      <mesh position={[0.10, 0.04, 0]} castShadow>
        <boxGeometry args={[0.06, 0.018, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** ประคบเย็น — Ice pack / cold compress (round blue cushion) */
export function IcePack({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Round blue compress pad */}
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.045, 16]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.5} />
      </mesh>
      {/* Top surface texture ring */}
      <mesh position={[0, 0.025, 0]}>
        <torusGeometry args={[0.10, 0.018, 8, 20]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Food tray — ถาดอาหาร with plate + cup */
export function FoodTray({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tray */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.018, 0.30]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Plate */}
      <mesh position={[-0.06, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.10, 0.10, 0.012, 16]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
      {/* Food on plate (simple dome) */}
      <mesh position={[-0.06, 0.03, 0]} castShadow>
        <sphereGeometry args={[0.065, 10, 6, 0, Math.PI*2, 0, Math.PI/2]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.8} />
      </mesh>
      {/* Cup/glass */}
      <mesh position={[0.13, 0.04, -0.06]} castShadow>
        <cylinderGeometry args={[0.028, 0.022, 0.08, 10]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.7} roughness={0.1} />
      </mesh>
      {/* Water in cup */}
      <mesh position={[0.13, 0.055, -0.06]}>
        <cylinderGeometry args={[0.025, 0.020, 0.045, 10]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/** Water jug / กระบอกน้ำ */
export function WaterJug({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.048, 0.20, 10]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.75} roughness={0.1} metalness={0.05} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.065, 0.02, 0]} castShadow>
        <torusGeometry args={[0.028, 0.008, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.108, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.055, 0.018, 10]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
    </group>
  );
}
