import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Generates a woven beige fabric rug texture matching the reference images
 * (สมุดโน้ตไม่มีชื่อ 2_p2.png, p4.png, nb4_room_ref.jpg).
 */
export function useWovenRugTexture(pattern = 'weave') {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e7dacb';
    ctx.fillRect(0, 0, 512, 512);

    if (pattern === 'diamond') {
      // Diamond geometric relief rug (matching nb4_room_ref.jpg)
      ctx.strokeStyle = 'rgba(180, 156, 132, 0.55)';
      ctx.lineWidth = 5;
      const step = 64;
      for (let y = -512; y < 1024; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y + 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(512, y);
        ctx.lineTo(0, y + 512);
        ctx.stroke();
      }
    } else {
      // Ribbed woven sisal/boucle rug (matching Ward 103 & 104 reference)
      for (let y = 0; y < 512; y += 6) {
        ctx.fillStyle = y % 12 === 0 ? 'rgba(166, 142, 118, 0.25)' : 'rgba(255, 248, 240, 0.22)';
        ctx.fillRect(0, y, 512, 3);
      }
      for (let x = 0; x < 512; x += 8) {
        ctx.fillStyle = 'rgba(150, 125, 100, 0.12)';
        ctx.fillRect(x, 0, 2, 512);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [pattern]);
}

/**
 * WoodFramedBacklitPanel — กรอบไม้โอ๊คโค้งมนพร้อมไฟซ่อน Warm LED รอบกรอบภาพ
 * (ตรงตามภาพตัวอย่าง สมุดโน้ตไม่มีชื่อ 2 หน้า 2 และหน้า 4)
 */
export function WoodFramedBacklitPanel({
  width = 5.0,
  height = 4.2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* แสงไฟซ่อน Warm LED รอบกรอบด้านหลัง */}
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[width + 0.52, height + 0.52]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.42} />
      </mesh>
      {/* กรอบไม้โอ๊คด้านนอก */}
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.36, height + 0.36, 0.06]} />
        <meshStandardMaterial color="#8c5a32" roughness={0.45} />
      </mesh>
      {/* เส้นไฟซ่อน LED สีส้มอุ่นด้านในขอบไม้ */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.05]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#f59e0b"
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* พื้นหลังบอร์ดสีขาวนวล */}
      <mesh position={[0, 0, 0.01]} receiveShadow>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color="#fffdf9" roughness={0.3} />
      </mesh>
      {children}
    </group>
  );
}

/**
 * CozySectionalSofaSet — ชุดโซฟาตัว L ผ้าบุนุ่มสีเทาอมเบจ + หมอนอิง 3 สี + หมอนรองให้นมรูปตัว U
 * + สตูลพรมถักสีเขียวพาสเทล + พรมทอสีเบจ + โต๊ะกลมท็อปขาวขาไม้ + แท็บเล็ตสื่อการสอน & แจกันดอกเดซี่
 * (ถอดแบบจากภาพตัวอย่าง สมุดโน้ตไม่มีชื่อ 2 หน้า 2 และหน้า 4)
 */
export function CozySectionalSofaSet({
  onClickSofa,
  onClickTablet,
  tabletLabel = '📋 คลิกแท็บเล็ตเพื่อทำกิจกรรม',
}) {
  const wovenRugTex = useWovenRugTexture('weave');

  return (
    <group>
      {/* ── 1. พรมทอสีครีมเบจผืนใหญ่กลางห้องบนพื้นไม้ ── */}
      <mesh position={[0.1, 0.012, 0.85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.8, 4.2]} />
        <meshStandardMaterial map={wovenRugTex} roughness={0.92} />
      </mesh>
      {/* ขอบพรมเย็บคิ้วสีเบจเข้ม */}
      <mesh position={[0.1, 0.01, 0.85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.96, 4.36]} />
        <meshStandardMaterial color="#cbb69d" roughness={0.95} />
      </mesh>

      {/* ── 2. โซฟาตัว L ผ้าบุนุ่มสีเทาอมเบจ (L-Shaped Sectional Sofa) ── */}
      <group
        position={[0, 0, -0.2]}
        onClick={(e) => {
          if (onClickSofa) {
            e.stopPropagation();
            onClickSofa();
          }
        }}
      >
        {/* ฐานไม้และขาโซฟาไม้โอ๊ค */}
        {[
          [-1.55, -0.42],
          [1.55, -0.42],
          [-1.55, 1.35],
          [-0.45, 1.35],
          [1.55, 0.45],
        ].map(([lx, lz], idx) => (
          <mesh key={idx} position={[lx, 0.07, lz]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.14, 12]} />
            <meshStandardMaterial color="#8c5a32" roughness={0.5} />
          </mesh>
        ))}

        {/* โครงฐานโซฟาตัวหลัก (3 ที่นั่ง) */}
        <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.3, 0.22, 0.98]} />
          <meshStandardMaterial color="#8f8377" roughness={0.85} />
        </mesh>

        {/* เบาะนั่งโซฟาฝั่งขวาและกลาง */}
        <mesh position={[0.55, 0.4, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[2.15, 0.16, 0.92]} />
          <meshStandardMaterial color="#9e9286" roughness={0.82} />
        </mesh>

        {/* ส่วนยื่นโซฟาเบดตัว L ฝั่งซ้าย (Chaise Lounge Extension) */}
        <mesh position={[-1.08, 0.24, 0.48]} castShadow receiveShadow>
          <boxGeometry args={[1.12, 0.22, 1.92]} />
          <meshStandardMaterial color="#8f8377" roughness={0.85} />
        </mesh>
        <mesh position={[-1.08, 0.4, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.16, 1.86]} />
          <meshStandardMaterial color="#9e9286" roughness={0.82} />
        </mesh>

        {/* พนักพิงหลังโซฟา */}
        <mesh position={[0, 0.72, -0.42]} castShadow receiveShadow>
          <boxGeometry args={[3.3, 0.68, 0.2]} />
          <meshStandardMaterial color="#8a7e72" roughness={0.85} />
        </mesh>
        {/* หมอนพิงหลัง 3 ใบ */}
        {[-1.02, 0.02, 1.04].map((bx, i) => (
          <mesh key={i} position={[bx, 0.72, -0.26]} castShadow>
            <boxGeometry args={[0.98, 0.48, 0.16]} />
            <meshStandardMaterial color="#a69a8e" roughness={0.82} />
          </mesh>
        ))}

        {/* ที่วางแขนซ้าย-ขวา */}
        <mesh position={[-1.68, 0.52, -0.02]} castShadow>
          <boxGeometry args={[0.18, 0.48, 0.98]} />
          <meshStandardMaterial color="#8a7e72" roughness={0.85} />
        </mesh>
        <mesh position={[1.68, 0.52, -0.02]} castShadow>
          <boxGeometry args={[0.18, 0.48, 0.98]} />
          <meshStandardMaterial color="#8a7e72" roughness={0.85} />
        </mesh>

        {/* ── หมอนอิงสีพาสเทล 3 สีตามภาพตัวอย่าง (เขียวเซจ, เหลืองมัสตาร์ด, ชมพูพีช) ── */}
        {/* หมอนอิงสีเขียวเซจ (Sage Green) */}
        <mesh position={[-1.18, 0.68, -0.12]} rotation={[0.18, 0.15, -0.08]} castShadow>
          <boxGeometry args={[0.42, 0.4, 0.13]} />
          <meshStandardMaterial color="#6b8e78" roughness={0.8} />
        </mesh>
        {/* หมอนอิงสีเหลืองมัสตาร์ด (Warm Ochre/Mustard) */}
        <mesh position={[-0.72, 0.64, -0.1]} rotation={[0.12, -0.1, 0.05]} castShadow>
          <boxGeometry args={[0.38, 0.34, 0.12]} />
          <meshStandardMaterial color="#d4943a" roughness={0.8} />
        </mesh>
        {/* หมอนอิงสีชมพูพีช (Soft Terracotta Pink) */}
        <mesh position={[1.22, 0.68, -0.1]} rotation={[0.15, -0.2, 0.08]} castShadow>
          <boxGeometry args={[0.44, 0.4, 0.13]} />
          <meshStandardMaterial color="#e29587" roughness={0.8} />
        </mesh>

        {/* ── หมอนรองให้นมรูปตัว U (C-Shaped Nursing Pillow) บนโซฟาฝั่งขวา ── */}
        <group position={[0.92, 0.51, 0.12]} rotation={[Math.PI / 2, 0, -0.3]}>
          <mesh castShadow>
            <torusGeometry args={[0.22, 0.085, 16, 28, Math.PI * 1.45]} />
            <meshStandardMaterial color="#fff8f0" roughness={0.75} />
          </mesh>
        </group>

        {/* ── ผ้าอ้อมพับวางบนส่วน Chaise Lounge ฝั่งซ้าย ── */}
        <mesh position={[-1.05, 0.5, 0.65]} rotation={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.45, 0.04, 0.36]} />
          <meshStandardMaterial color="#fff1f2" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 3. สตูลพรมถักกลมสีเขียวอ่อน (Sage Knitted Pouf Ottoman) หน้าโซฟาตัว L ── */}
      <mesh position={[-1.08, 0.18, 1.72]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.32, 24]} />
        <meshStandardMaterial color="#a3b899" roughness={0.9} />
      </mesh>

      {/* ── 4. โต๊ะกลางกลมท็อปสีขาว ขาไม้โอ๊ค + แท็บเล็ตสื่อการสอน + แก้วน้ำ + แจกันดอกเดซี่ ── */}
      <group
        position={[0.75, 0, 1.38]}
        onClick={(e) => {
          if (onClickTablet) {
            e.stopPropagation();
            onClickTablet();
          }
        }}
      >
        {/* ท็อปโต๊ะกลมสีขาวนวล */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.68, 0.68, 0.045, 36]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.3} />
        </mesh>
        {/* ขาโต๊ะไม้โอ๊คเฉียง */}
        {[
          [-0.36, -0.36],
          [0.36, -0.36],
          [-0.36, 0.36],
          [0.36, 0.36],
        ].map(([lx, lz], idx) => (
          <mesh key={idx} position={[lx, 0.21, lz]} castShadow>
            <cylinderGeometry args={[0.03, 0.022, 0.42, 12]} />
            <meshStandardMaterial color="#9c6644" roughness={0.5} />
          </mesh>
        ))}

        {/* แท็บเล็ต / iPad ตั้งบนโต๊ะกลม (ตามภาพตัวอย่างมุมขวาล่าง) */}
        <group position={[-0.12, 0.56, 0.06]} rotation={[-0.25, -0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.25, 0.018]} />
            <meshStandardMaterial color="#1e293b" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[0.33, 0.22]} />
            <meshBasicMaterial color="#fdf2f8" />
          </mesh>
          {/* ขาตั้งแท็บเล็ต */}
          <mesh position={[0, -0.06, -0.06]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.14, 0.14, 0.015]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        {/* แก้วเซรามิกสีเขียวพาสเทลบนจานรองไม้ */}
        <group position={[-0.32, 0.45, -0.18]}>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.015, 16]} />
            <meshStandardMaterial color="#b07d4f" />
          </mesh>
          <mesh position={[0, 0.055, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.08, 16]} />
            <meshStandardMaterial color="#84a98c" roughness={0.35} />
          </mesh>
        </group>

        {/* แจกันดอกเดซี่สีขาวด้านขวาของโต๊ะ */}
        <group position={[0.28, 0.45, -0.05]}>
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.08, 0.18, 16]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.4} />
          </mesh>
          {[
            [0, 0.22, 0],
            [-0.05, 0.2, 0.03],
            [0.05, 0.21, -0.02],
            [0.02, 0.24, 0.04],
          ].map(([fx, fy, fz], i) => (
            <group key={i} position={[fx, fy, fz]}>
              <mesh>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.018, 8, 8]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
            </group>
          ))}
        </group>

        {/* ป้ายคลิกแท็บเล็ตบนโต๊ะ */}
        {onClickTablet && (
          <Html position={[-0.1, 0.95, 0]} center distanceFactor={11} zIndexRange={[15, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClickTablet();
              }}
              className="cursor-pointer bg-white/95 hover:bg-pink-50 text-pink-800 border-2 border-pink-400 px-3 py-1 rounded-full text-xs font-extrabold shadow-md whitespace-nowrap transition hover:scale-105"
            >
              {tabletLabel}
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}

/**
 * CozyRoomDecorCorners — ของตกแต่งมุมห้องอบอุ่นตามภาพตัวอย่าง:
 * 1) มุมซ้ายหน้า: พรมสานกลม + ตะกร้าหวายมีผ้าพาด + กระถางต้นไม้ใบเขียว
 * 2) มุมซ้ายใน: พรมกลม + ตุ๊กตากระต่ายน้อย + กระถางต้นไม้
 * 3) มุมขวาหลังโซฟา: ตู้ไม้เตี้ย + โคมไฟตั้งโต๊ะแสงสีส้มอุ่น + ต้นไม้ฟอกอากาศ
 */
export function CozyRoomDecorCorners() {
  return (
    <group>
      {/* ── 1. มุมซ้ายหน้า: พรมสานกลม + ตะกร้าหวายใส่ผ้าห่ม + กระถางต้นไม้ ── */}
      <group position={[-5.4, 0, 2.2]}>
        {/* พรมสานกลมสีเบจ */}
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.15, 32]} />
          <meshStandardMaterial color="#d9c3a9" roughness={0.95} />
        </mesh>
        {/* ตะกร้าหวายสาน */}
        <mesh position={[0.15, 0.24, -0.15]} castShadow>
          <cylinderGeometry args={[0.28, 0.24, 0.46, 20]} />
          <meshStandardMaterial color="#b88b5a" roughness={0.85} />
        </mesh>
        {/* ผ้าขนหนูสีครีมพาดขอบตะกร้า */}
        <mesh position={[0.28, 0.35, -0.05]} rotation={[0.2, 0, -0.35]} castShadow>
          <boxGeometry args={[0.18, 0.32, 0.22]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.8} />
        </mesh>
        {/* กระถางต้นไม้สีขาวทรงสูง + พุ่มใบไม้สีเขียวสด */}
        <group position={[-0.45, 0, 0.25]}>
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.18, 0.52, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#3f6212" roughness={0.7} />
          </mesh>
          <mesh position={[0.15, 1.15, -0.1]} castShadow>
            <sphereGeometry args={[0.35, 14, 14]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── 2. มุมซ้ายใน: พรมกลม + ตุ๊กตากระต่ายน้อย + ต้นไม้ประดับ ── */}
      <group position={[-4.2, 0, -4.8]}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.95, 28]} />
          <meshStandardMaterial color="#e6d5c3" roughness={0.95} />
        </mesh>
        {/* ตุ๊กตากระต่ายน้อยนั่งบนพรม */}
        <group position={[0.2, 0, 0.1]} rotation={[0, 0.4, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color="#ebd8d0" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.095, 14, 14]} />
            <meshStandardMaterial color="#ebd8d0" roughness={0.85} />
          </mesh>
          <mesh position={[-0.04, 0.44, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.02, 0.025, 0.16, 10]} />
            <meshStandardMaterial color="#f5ebe0" />
          </mesh>
          <mesh position={[0.04, 0.44, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.02, 0.025, 0.16, 10]} />
            <meshStandardMaterial color="#f5ebe0" />
          </mesh>
        </group>
      </group>

      {/* ── 3. ด้านขวาหลังโซฟา: ตู้ไม้โอ๊คเตี้ย + โคมไฟตั้งโต๊ะแสงสีส้มอุ่น + ต้นไม้ ── */}
      <group position={[3.6, 0, -2.2]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.76, 0.52]} />
          <meshStandardMaterial color="#a47148" roughness={0.5} />
        </mesh>
        {/* โคมไฟตั้งโต๊ะแสงอบอุ่น */}
        <group position={[0.42, 0.8, 0]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.03, 0.08, 0.28, 12]} />
            <meshStandardMaterial color="#7f5539" />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 18]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#f59e0b"
              emissiveIntensity={0.65}
            />
          </mesh>
          <pointLight position={[0, 0.4, 0]} color="#ffd8a8" intensity={0.6} distance={5} />
        </group>
        {/* กระถางต้นไม้บนตู้ไม้ */}
        <group position={[-0.4, 0.8, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.09, 0.07, 0.18, 14]} />
            <meshStandardMaterial color="#d4a373" />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#3f6212" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
