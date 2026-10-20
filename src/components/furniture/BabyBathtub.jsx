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
        {/* Spread Out Soft White/Pastel Towel on Changing Pad (Always Visible) */}
        <mesh position={[0, 0.045, 0]} receiveShadow>
          <boxGeometry args={[0.64, 0.015, 0.92]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* ขอบกุ๊นผ้าขนหนูสีชมพูอ่อน */}
        <mesh position={[0, 0.048, 0.44]}>
          <boxGeometry args={[0.64, 0.016, 0.04]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.85} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          อุปกรณ์อาบน้ำและชุดเปลี่ยนผ้าอ้อมบนโต๊ะ (แสดงครบทุกชิ้นตลอดเวลาตามบรีฟ)
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. ผ้าเช็ดตัวผืนใหญ่ 2 ผืน + ผ้าห่อตัวทารก (มุมขวาบนของโต๊ะ z = -0.46) */}
      <group position={[1.48, 0.86, -0.46]} onClick={onMatClick}>
        {/* ผ้าเช็ดตัวผืนที่ 1 (สีขาวนวล) */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.34]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* ผ้าเช็ดตัวผืนที่ 2 (สีชมพูพาสเทล) */}
        <mesh position={[0, 0.085, 0]} castShadow>
          <boxGeometry args={[0.4, 0.05, 0.32]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.88} />
        </mesh>
        {/* ผ้าห่อตัวทารก (สีเหลืองอ่อนพาสเทล) */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <boxGeometry args={[0.36, 0.04, 0.28]} />
          <meshStandardMaterial color="#fef08a" roughness={0.85} />
        </mesh>
      </group>

      {/* 2. กองผ้าอ้อมผ้าสาลูพับ 4 ผืน + ผ้าอ้อมสำเร็จรูป (แพมเพิส) วางเรียงชัดเจนบนโต๊ะ (x = 1.48, z = 0.02) */}
      <group position={[1.48, 0.86, 0.02]} onClick={onMatClick}>
        {/* ถาดรองผ้าอ้อมสีครีม */}
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[0.46, 0.024, 0.44]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.6} />
        </mesh>
        {/* กองผ้าอ้อมผ้าสาลูพับ 4 ชั้น (ด้านซ้ายของถาด) */}
        {[
          [0.038, '#ffffff', '#38bdf8'],
          [0.072, '#fff1f2', '#f472b6'],
          [0.106, '#ffffff', '#38bdf8'],
          [0.14, '#fefce8', '#facc15'],
        ].map(([py, clothCol, trimCol], idx) => (
          <group key={`diaper_stack_${idx}`} position={[-0.09, py, -0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.03, 0.28]} />
              <meshStandardMaterial color={clothCol} roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.002, 0.13]}>
              <boxGeometry args={[0.222, 0.031, 0.024]} />
              <meshStandardMaterial color={trimCol} />
            </mesh>
          </group>
        ))}

        {/* ผ้าอ้อมสำเร็จรูป (แพมเพิส) พับพร้อมแถบกาวสีฟ้า 2 ชิ้น (ด้านขวาของถาด) */}
        {[0.042, 0.092].map((py, idx) => (
          <group key={`pampers_${idx}`} position={[0.11, py, 0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.17, 0.044, 0.24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.75} />
            </mesh>
            {/* แถบคาดเอวสีฟ้า-เหลืองของแพมเพิส */}
            <mesh position={[0, 0.023, 0.06]}>
              <boxGeometry args={[0.172, 0.006, 0.05]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0.024, 0.06]}>
              <boxGeometry args={[0.06, 0.008, 0.03]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. ชุดเสื้อผ้าทารกผูกหน้า + ห่อแพมเพิส (มุมขวาล่างของโต๊ะ x = 1.48, z = 0.48) */}
      <group position={[1.48, 0.86, 0.48]} onClick={onMatClick}>
        {/* เสื้อผ้าทารกแบบผูกหน้าสีฟ้าพาสเทล */}
        <mesh position={[-0.08, 0.025, 0]} castShadow>
          <boxGeometry args={[0.24, 0.04, 0.28]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.8} />
        </mesh>
        {/* โบว์ผูกเสื้อด้านหน้า */}
        <mesh position={[-0.08, 0.048, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.26]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* ห่อผ้าอ้อมสำเร็จรูป (Pampers Pack) ตั้งคู่กัน */}
        <group position={[0.11, 0.11, -0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.22, 0.24]} />
            <meshStandardMaterial color="#0d9488" roughness={0.35} />
          </mesh>
          <mesh position={[-0.082, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.2, 0.16]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>

      {/* 4. ขวดสบู่เหลวอาบน้ำทารก + แชมพูสระผมทารก + ฟองน้ำธรรมชาติ (ด้านหลังอ่างอาบน้ำ z = -0.56) */}
      <group position={[-0.65, 0.86, -0.56]} onClick={onMatClick}>
        {/* ถาดวางสบู่และแชมพู */}
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[0.52, 0.024, 0.24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* ขวดสบู่เหลวทารก (หัวปั๊มสีชมพู) */}
        <group position={[-0.14, 0.02, 0]}>
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.048, 0.052, 0.18, 20]} />
            <meshStandardMaterial color="#f472b6" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.09, 0.05]}>
            <boxGeometry args={[0.06, 0.1, 0.008]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.04, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        {/* ขวดแชมพูสระผมทารก (หัวปั๊มสีเหลือง/ฟ้า) */}
        <group position={[0.02, 0.02, 0]}>
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.048, 0.052, 0.18, 20]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.09, 0.05]}>
            <boxGeometry args={[0.06, 0.1, 0.008]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.04, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        {/* ฟองน้ำธรรมชาติสีเหลืองนุ่ม */}
        <mesh position={[0.17, 0.055, 0.01]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.92} />
        </mesh>
      </group>

      {/* 5. ชุดเช็ดตาและสะดือ: ถ้วยสแตนเลสใส่สำลีก้อน + ขวดน้ำเกลือ 0.9% NSS + แอลกอฮอล์ 70% + ไม้พันสำลี (x = 0.25, z = -0.56) */}
      <group position={[0.25, 0.86, -0.56]} onClick={onMatClick}>
        {/* ถาดสแตนเลสปลอดเชื้อ */}
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[0.56, 0.024, 0.24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.25} />
        </mesh>
        {/* ถ้วยใส่สำลีก้อนชุบน้ำต้มสุก */}
        <group position={[-0.18, 0.02, 0]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.048, 0.08, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
          </mesh>
          {[
            [-0.02, 0.08, -0.01],
            [0.02, 0.08, -0.01],
            [0, 0.085, 0.02],
            [0, 0.095, 0],
          ].map(([cx, cy, cz], i) => (
            <mesh key={i} position={[cx, cy, cz]} castShadow>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>
          ))}
        </group>
        {/* ขวดน้ำเกลือ 0.9% Normal Saline (ฉลากสีเขียว/ฟ้า) */}
        <group position={[-0.02, 0.02, 0]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.2, 18]} />
            <meshStandardMaterial color="#f0fdf4" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, 0.043]}>
            <boxGeometry args={[0.055, 0.11, 0.006]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, 0.215, 0]}>
            <cylinderGeometry args={[0.02, 0.024, 0.035, 12]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
        </group>
        {/* ขวดแอลกอฮอล์ 70% เช็ดสะดือ (ฉลากสีฟ้าเข้ม) */}
        <group position={[0.11, 0.02, 0]}>
          <mesh position={[0, 0.085, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.17, 18]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.085, 0.039]}>
            <boxGeometry args={[0.05, 0.09, 0.006]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.185, 0]}>
            <cylinderGeometry args={[0.018, 0.02, 0.03, 12]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>
        </group>
        {/* กระปุกไม้พันสำลี (Cotton Swabs) */}
        <group position={[0.22, 0.02, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.036, 0.1, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
          {[-0.012, 0, 0.012].map((sx, i) => (
            <mesh key={i} position={[sx, 0.11, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.06, 8]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
          ))}
        </group>
      </group>

      {/* 6. ชั้นวางของด้านล่างโต๊ะอาบน้ำ (วางตะกร้าผ้าอ้อมสำรอง & ห่อแพมเพิส) */}
      <group position={[0.85, 0.24, 0]}>
        <mesh position={[-0.35, 0.12, 0]} castShadow>
          <boxGeometry args={[0.48, 0.22, 0.38]} />
          <meshStandardMaterial color="#d4a373" roughness={0.7} />
        </mesh>
        <mesh position={[-0.35, 0.25, 0]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
        <mesh position={[0.25, 0.14, 0]} castShadow>
          <boxGeometry args={[0.38, 0.26, 0.28]} />
          <meshStandardMaterial color="#0d9488" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
