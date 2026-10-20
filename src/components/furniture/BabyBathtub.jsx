import React from 'react';

/**
 * BabyBathtub — Authentic Dual Infant Bathtub on Expanded Wooden Bathing & Changing Table
 *
 * Updated per "ปรับแก้ห้องอาบน้ำทารก.pdf" (bath_p1..5) & "อธิบายเพิ่มเติมการให้ทารกอาบน้ำเปลี่ยนผ้าอ้อม.pdf":
 * - Expanded wooden rectangular bathing table (3.8m wide) with dedicated padded towel/changing mat area
 *   beside the 2 bathtubs ("ปรับขนาดโต๊ะให้มีพื้นที่สำหรับปูผ้าวางทารก").
 * - 2 clean bathtubs side-by-side with warm water (37–38 °C):
 *     1. Tub 1 (Sky Blue, x = -1.18): First wash & lathering tub
 *     2. Tub 2 (Pastel Pink, x = -0.12): Clean warm rinse water tub
 *     3. Soft Padded Towel Mat (x = 0.85): For undressing, checking diaper, drying body, eye/cord care, dressing & swaddling.
 * - Staged accessories on right edge (x = 1.55) when preparedItems are collected.
 */
export default function BabyBathtub({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  preparedItems = {
    tubs: true,
    towels: true,
    soap: true,
    sponge: true,
    cottonBalls: true,
    clothes: true,
  },
  onTubClick,
  onMatClick,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Expanded Sturdy Wooden Bathing & Changing Table (3.85m wide x 1.55m deep) ── */}
      <mesh
        position={[0, 0.82, 0]}
        castShadow
        receiveShadow
        onClick={onMatClick}
      >
        <boxGeometry args={[3.85, 0.08, 1.55]} />
        <meshStandardMaterial color="#c29b68" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Table Apron & Frame */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[3.72, 0.08, 1.44]} />
        <meshStandardMaterial color="#a77d4c" roughness={0.5} />
      </mesh>

      {/* 4 Sturdy Solid Oak Wooden Legs */}
      {[
        [-1.78, -0.65],
        [1.78, -0.65],
        [-1.78, 0.65],
        [1.78, 0.65],
      ].map(([x, z], i) => (
        <mesh key={`leg_${i}`} position={[x, 0.38, z]} castShadow>
          <boxGeometry args={[0.1, 0.76, 0.1]} />
          <meshStandardMaterial color="#8c6239" roughness={0.45} />
        </mesh>
      ))}

      {/* Lower Storage Slatted Shelf */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.04, 1.35]} />
        <meshStandardMaterial color="#b38753" roughness={0.5} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════
          อ่างที่ 1: อ่างอาบน้ำสะอาดใบที่ 1 (สีฟ้า Baby Blue Tub - น้ำอุ่น 37–38 °C)
          ══════════════════════════════════════════════════════════════════════════ */}
      {preparedItems.tubs && (
        <group
          position={[-1.18, 0.86, 0]}
          onClick={(e) => {
            if (onTubClick) {
              e.stopPropagation();
              onTubClick(1);
            }
          }}
        >
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.46, 0.35, 0.32, 32]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.08} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <torusGeometry args={[0.47, 0.035, 12, 32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} />
          </mesh>
          <mesh position={[-0.4, 0.31, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.15, 0.03, 0.2]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} />
          </mesh>
          {/* Warm Water (37–38 °C) */}
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.78} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          อ่างที่ 2: อ่างอาบน้ำสะอาดใบที่ 2 (สีชมพู Pastel Pink Tub - น้ำอุ่น 37–38 °C ล้างน้ำสะอาด)
          ══════════════════════════════════════════════════════════════════════════ */}
      {preparedItems.tubs && (
        <group
          position={[-0.12, 0.86, 0]}
          onClick={(e) => {
            if (onTubClick) {
              e.stopPropagation();
              onTubClick(2);
            }
          }}
        >
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.46, 0.35, 0.32, 32]} />
            <meshStandardMaterial color="#f472b6" roughness={0.2} metalness={0.08} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <torusGeometry args={[0.47, 0.035, 12, 32]} />
            <meshStandardMaterial color="#db2777" roughness={0.25} />
          </mesh>
          <mesh position={[-0.4, 0.31, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.15, 0.03, 0.2]} />
            <meshStandardMaterial color="#db2777" roughness={0.25} />
          </mesh>
          {/* Crystal Clear Warm Rinse Water (37–38 °C) */}
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
            <meshStandardMaterial color="#fbcfe8" transparent opacity={0.68} roughness={0.05} />
          </mesh>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          พื้นที่สำหรับปูผ้าวางทารก (Soft Padded Baby Changing & Drying Towel Pad beside Tubs)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group
        position={[0.82, 0.86, 0]}
        onClick={(e) => {
          if (onMatClick) {
            e.stopPropagation();
            onMatClick();
          }
        }}
      >
        {/* Cushioned Changing Pad Base */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.04, 1.05]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.85} />
        </mesh>
        {/* Raised Side Bolsters on Changing Mat */}
        {[-0.36, 0.36].map((x, i) => (
          <mesh key={`mat_edge_${i}`} position={[x, 0.045, 0]} castShadow>
            <boxGeometry args={[0.06, 0.035, 1.02]} />
            <meshStandardMaterial color="#fde68a" roughness={0.85} />
          </mesh>
        ))}
        {/* Spread Out Soft White/Pastel Towel when Towels are Prepared */}
        {preparedItems.towels && (
          <mesh position={[0, 0.045, 0]} receiveShadow>
            <boxGeometry args={[0.64, 0.015, 0.92]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        )}
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          STAGED ACCESSORIES ON RIGHT SIDE OF TABLE (x = 1.52)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* 1. Folded Towel & Swaddle Cloth Stack */}
      {preparedItems.towels && (
        <group position={[1.52, 0.86, -0.42]}>
          <mesh position={[0, 0.035, 0]} castShadow>
            <boxGeometry args={[0.42, 0.07, 0.36]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.085, 0]} castShadow>
            <boxGeometry args={[0.38, 0.04, 0.32]} />
            <meshStandardMaterial color="#fef08a" roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* 2. Baby Liquid Soap & Gentle Shampoo Bottles */}
      {preparedItems.soap && (
        <group position={[1.54, 0.86, -0.02]}>
          <mesh position={[-0.07, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.18, 20]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.3} />
          </mesh>
          <mesh position={[0.07, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.18, 20]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 3. Soft Bathing Sponge & Small Cloth */}
      {preparedItems.sponge && (
        <group position={[1.45, 0.88, 0.22]}>
          <mesh castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#fde047" roughness={0.95} />
          </mesh>
          <mesh position={[0.12, -0.01, 0]} castShadow>
            <boxGeometry args={[0.14, 0.03, 0.14]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 4. Small Sterile Cup with 2 Damp Cotton Balls (น้ำต้มสุก / 0.9% NSS) */}
      {preparedItems.cottonBalls && (
        <group position={[1.32, 0.86, -0.45]}>
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.038, 0.06, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[-0.015, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[0.015, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 5. Fresh Baby Clothes & Diaper */}
      {preparedItems.clothes && (
        <group position={[1.52, 0.86, 0.48]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.28, 0.035, 0.24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.22, 0.025, 0.18]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}
