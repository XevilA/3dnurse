import React from 'react';
import FlowerVase from '../decorations/FlowerVase';

/**
 * HospitalWaitingLounge Component
 * Faithfully matches the waiting area in modern hospitals as depicted in reference photos:
 * - Two-tone dusty rose / blush pink and warm cream modular waiting sofa
 * - Low round blonde oak coffee table with hospital reading leaflets
 * - Modern planter box with trimmed lush green shrubs
 */
export default function HospitalWaitingLounge({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, reverseLayout = false }) {
  const dir = reverseLayout ? -1 : 1;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Modern Modular Hospital Waiting Sofa (2-3 Seater) ── */}
      <group position={[0, 0, 0]}>
        {/* Plinth Base / Recessed Kickboard */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.16, 0.95]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {/* Thick Comfortable Seat Cushion (Dusty Rose / Blush Pink #f472b6 / #f43f5e) */}
        <mesh position={[0, 0.32, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.32, 0.88]} />
          <meshStandardMaterial color="#fb7185" roughness={0.45} />
        </mesh>

        {/* Soft Backrest (Warm Cream / Soft Sand #fef08a / #ffedd5) */}
        <mesh position={[0, 0.68, -0.32]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.48, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.5} />
        </mesh>

        {/* Side Armrests (Soft Sand) */}
        <mesh position={[-1.18, 0.52, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.86]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        <mesh position={[1.18, 0.52, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.86]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>

        {/* Decorative Throw Pillows */}
        <mesh position={[-0.7, 0.44, -0.16]} rotation={[0.1, 0.2, 0]}>
          <boxGeometry args={[0.38, 0.32, 0.12]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.5} />
        </mesh>
        <mesh position={[0.7, 0.44, -0.16]} rotation={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.38, 0.32, 0.12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.5} />
        </mesh>
      </group>

      {/* ── Low Round Blonde Oak Coffee Table ── */}
      <group position={[dir * 0.4, 0, 1.25]}>
        {/* Table Top */}
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
          <meshStandardMaterial color="#d4a373" roughness={0.4} />
        </mesh>
        {/* Tripod Table Legs */}
        {[-0.25, 0.25].map((xL, idx) => (
          <mesh key={`leg_${idx}`} position={[xL, 0.17, 0]} rotation={[0, 0, xL > 0 ? -0.1 : 0.1]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
        ))}
        {/* Mini Flower Vase on Coffee Table */}
        <FlowerVase position={[0, 0.38, -0.1]} scale={0.7} />

        {/* Stack of Health Magazines / Educational Booklets */}
        <group position={[0.15, 0.38, 0.12]} rotation={[0, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.02, 0.28]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.01, 0.02, 0.01]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.28]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
        </group>
      </group>

      {/* ── Manicured Indoor Planter Box with Lush Green Hedge ── */}
      <group position={[dir * 1.75, 0, 0]}>
        {/* Modern White Planter Trough */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.56, 1.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Dark Soil */}
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.41, 0.04, 1.54]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        {/* Dense Lush Green Hedge Foliage */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[0.42, 0.65, 1.52]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
        {/* Organic Shrub Variation Bulges */}
        {[-0.5, 0, 0.5].map((zPos, sIdx) => (
          <mesh key={`shrub_${sIdx}`} position={[0, 1.15, zPos]} castShadow>
            <sphereGeometry args={[0.24, 12, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.65} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
