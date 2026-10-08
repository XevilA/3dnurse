import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * BabyBathtub — Authentic Dual Infant Bathtub on Dedicated Wooden Bathing Table
 *
 * Designed according to Room 2 specifications & reference images:
 * - Large wooden rectangular bathing table ("โต๊ะเปล่า")
 * - 2 clean bathtubs side-by-side with warm water (36-37°C):
 *     1. Tub 1 (Sky Blue): First wash & lathering tub with gentle soap
 *     2. Tub 2 (Pastel Pink): Clean warm rinse water tub
 * - Both tubs feature realistic oval ergonomic silhouettes and soap holder recesses on rim (matching img_001.png)
 * - Staged accessories: soft cotton bath towel, swaddle blanket wrap, baby liquid soap/shampoo,
 *   soft washcloth/sponge, small sterile cup with cotton balls (for eyes), and fresh diaper/clothes.
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
    clothes: true
  }
}) {

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Sturdy Wooden Bathing & Changing Table (โต๊ะเปล่า per img_000.jpg layout) ── */}
      {/* Table Top Surface (Warm Honey Oak Wood) */}
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.5]} />
        <meshStandardMaterial color="#c29b68" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Table Apron & Frame */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[3.1, 0.08, 1.4]} />
        <meshStandardMaterial color="#a77d4c" roughness={0.5} />
      </mesh>

      {/* 4 Sturdy Solid Oak Wooden Legs */}
      <mesh position={[-1.48, 0.38, -0.63]} castShadow>
        <boxGeometry args={[0.1, 0.76, 0.1]} />
        <meshStandardMaterial color="#8c6239" roughness={0.45} />
      </mesh>
      <mesh position={[1.48, 0.38, -0.63]} castShadow>
        <boxGeometry args={[0.1, 0.76, 0.1]} />
        <meshStandardMaterial color="#8c6239" roughness={0.45} />
      </mesh>
      <mesh position={[-1.48, 0.38, 0.63]} castShadow>
        <boxGeometry args={[0.1, 0.76, 0.1]} />
        <meshStandardMaterial color="#8c6239" roughness={0.45} />
      </mesh>
      <mesh position={[1.48, 0.38, 0.63]} castShadow>
        <boxGeometry args={[0.1, 0.76, 0.1]} />
        <meshStandardMaterial color="#8c6239" roughness={0.45} />
      </mesh>

      {/* Lower Storage Slatted Shelf */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[3.0, 0.04, 1.3]} />
        <meshStandardMaterial color="#b38753" roughness={0.5} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════
          อ่างที่ 1: อ่างอาบน้ำสะอาดใบที่ 1 (สีฟ้า Baby Blue Tub - น้ำอุ่น 36-37°C)
          ══════════════════════════════════════════════════════════════════════════ */}
      {preparedItems.tubs && (
        <group position={[-0.78, 0.86, 0]}>
          {/* Outer Ergonomic Tub Basin with flared rim & soap dish indentation */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.48, 0.36, 0.32, 32]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.08} />
          </mesh>
          {/* Elongated Tub Rim Collar */}
          <mesh position={[0, 0.30, 0]} castShadow>
            <torusGeometry args={[0.49, 0.035, 12, 32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} />
          </mesh>
          {/* Molded Soap Dish Shelf on Rim */}
          <mesh position={[-0.42, 0.31, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.16, 0.03, 0.22]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} />
          </mesh>
          {/* Warm Soapy Water (36-37°C) */}
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.75} roughness={0.1} />
          </mesh>
          {/* Floating Bath Duck / Thermometer Badge */}
          <group position={[0.22, 0.25, 0.15]}>
            <mesh castShadow>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} />
            </mesh>
            <mesh position={[0.025, 0.01, 0]}>
              <coneGeometry args={[0.012, 0.025, 12]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          </group>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          อ่างที่ 2: อ่างอาบน้ำสะอาดใบที่ 2 (สีชมพู Pastel Pink Tub - ล้างน้ำสะอาด)
          ══════════════════════════════════════════════════════════════════════════ */}
      {preparedItems.tubs && (
        <group position={[0.32, 0.86, 0]}>
          {/* Outer Tub Basin */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.48, 0.36, 0.32, 32]} />
            <meshStandardMaterial color="#f472b6" roughness={0.2} metalness={0.08} />
          </mesh>
          {/* Rim Collar */}
          <mesh position={[0, 0.30, 0]} castShadow>
            <torusGeometry args={[0.49, 0.035, 12, 32]} />
            <meshStandardMaterial color="#db2777" roughness={0.25} />
          </mesh>
          {/* Soap Dish Shelf */}
          <mesh position={[-0.42, 0.31, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.16, 0.03, 0.22]} />
            <meshStandardMaterial color="#db2777" roughness={0.25} />
          </mesh>
          {/* Crystal Clear Warm Rinse Water */}
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
            <meshStandardMaterial color="#fbcfe8" transparent opacity={0.65} roughness={0.05} />
          </mesh>
          {/* Floating Bath Ring */}
          <mesh position={[-0.18, 0.25, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.015, 12, 24]} />
            <meshStandardMaterial color="#a7f3d0" />
          </mesh>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          STAGED ACCESSORIES ON TABLE PER REQUIREMENT 1.3:
          1. ผ้าขนหนูเช็ดตัว 1 ผืน และผ้าห่อตัว 1 ผืน
          2. สบู่เหลว-ยาสระผมสูตรอ่อนโยนสำหรับเด็กทารก
          3. ผ้าผืนเล็กหรือฟองน้ำสำหรับอาบน้ำ
          4. สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ (0.9% NSS) ในถ้วยเล็กสำหรับเช็ดตาทารก
          5. เสื้อผ้าและผ้าอ้อมทารก
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* 1. Stack of Fluffy Soft Towel & Receiving Swaddle Blanket (Right side of table) */}
      {preparedItems.towels && (
        <group position={[1.18, 0.86, -0.32]}>
          {/* Large Baby Bath Towel */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.55, 0.08, 0.45]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Soft Pastel Swaddle Wrap on top */}
          <mesh position={[0, 0.10, 0]} castShadow>
            <boxGeometry args={[0.50, 0.04, 0.40]} />
            <meshStandardMaterial color="#fef08a" roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* 2. Baby Liquid Soap & Gentle Tear-free Baby Shampoo Bottles */}
      {preparedItems.soap && (
        <group position={[1.25, 0.86, 0.18]}>
          {/* Baby Shampoo Pump Bottle (Pastel Blue) */}
          <mesh position={[-0.07, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.18, 20]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.3} />
          </mesh>
          <mesh position={[-0.07, 0.19, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Baby Body Wash Bottle (Pastel Pink) */}
          <mesh position={[0.07, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.18, 20]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.3} />
          </mesh>
          <mesh position={[0.07, 0.19, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* 3. Soft Bathing Sponge & Washcloth */}
      {preparedItems.sponge && (
        <group position={[0.92, 0.88, 0.35]}>
          {/* Natural Bath Sponge (Porous Yellow) */}
          <mesh castShadow>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#fde047" roughness={0.95} />
          </mesh>
          {/* Folded Small Cotton Washcloth */}
          <mesh position={[0.12, -0.01, 0]} castShadow>
            <boxGeometry args={[0.14, 0.03, 0.14]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 4. Small Medicine Cup with Sterile Cotton Balls (0.9% NSS) for Eye Cleansing */}
      {preparedItems.cottonBalls && (
        <group position={[0.88, 0.86, -0.42]}>
          {/* Stainless / Medical Plastic Treatment Cup */}
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.038, 0.06, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Two Pre-soaked Cotton Balls */}
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

      {/* 5. Fresh Baby Clothes & Hospital Diaper */}
      {preparedItems.clothes && (
        <group position={[1.18, 0.86, 0.42]}>
          {/* Folded Hospital Newborn Baby Vest (Soft White) */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.26, 0.03, 0.22]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
          {/* Clean Disposable Diaper */}
          <mesh position={[0, 0.045, 0]} castShadow>
            <boxGeometry args={[0.22, 0.025, 0.18]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
          {/* Diaper colored tape accent */}
          <mesh position={[0, 0.058, -0.06]}>
            <boxGeometry args={[0.14, 0.005, 0.02]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}
    </group>
  );
}
