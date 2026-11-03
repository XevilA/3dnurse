import React, { useMemo, useEffect, useState } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';

function drawRoundedRect(ctx, x, y, w, h, r) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function usePinkLabelTexture(label, widthPx = 420, heightPx = 76) {
  const { tex, paint } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = widthPx;
    c.height = heightPx;
    const ctx = c.getContext('2d');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, widthPx, heightPx);
      drawRoundedRect(ctx, 4, 4, widthPx - 8, heightPx - 8, (heightPx - 8) / 2);
      ctx.fillStyle = '#fbcfe8';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#f472b6';
      ctx.stroke();

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1e293b';
      ctx.font = `900 30px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, label, widthPx / 2, heightPx / 2 + 1, widthPx - 36);
      t.needsUpdate = true;
    };

    draw();
    return { tex: t, paint: draw };
  }, [label, widthPx, heightPx]);

  useEffect(() => {
    const cancel = whenFontsReady(paint);
    return () => {
      cancel();
      tex.dispose();
    };
  }, [tex, paint]);

  return tex;
}

function useBearWipesTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(0, 0, 256, 160);
      drawRoundedRect(ctx, 14, 14, 228, 132, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Cute Teddy Bear Face
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(98, 46, 14, 0, Math.PI * 2);
      ctx.arc(158, 46, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(128, 68, 30, 0, Math.PI * 2);
      ctx.fill();
      // Eyes & Nose
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(116, 63, 3.5, 0, Math.PI * 2);
      ctx.arc(140, 63, 3.5, 0, Math.PI * 2);
      ctx.arc(128, 72, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0284c7';
      ctx.font = '800 22px system-ui, sans-serif';
      fillCenteredText(ctx, 'Baby Wipes', 128, 122, 200);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function PinkShelfPill3D({ label, position = [0, 0, 0], width = 0.44, height = 0.082 }) {
  const tex = usePinkLabelTexture(label, Math.round((width / height) * 80), 80);
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/**
 * BabySupplyWardrobe3D — ตู้ของใช้ทารก 3D แบบเปิด 2 คอลัมน์ 8 หมวดหมู่สมจริง (ตามไฟล์ แก้ไขเพิ่มเติม.pdf ห้องนอนทารก Nursery 204)
 *
 * คอลัมน์ซ้าย (บนลงล่าง):
 *   1. เสื้อผ้าเด็ก (ราวแขวนสแตนเลส + ไม้แขวนเสื้อเด็ก + ชุดบอดี้สูท/เสื้อผ้าทารกสีพาสเทล 9 ชุด)
 *   2. ผ้าอ้อมสำเร็จรูป และทิชชู่เปียก (ตั้งแพมเพิสพับ 2 กอง + ห่อทิชชู่เปียกลายหมีสีชมพู)
 *   3. ผ้าสำหรับเช็ดตัว/เช็ดหน้า (กองผ้าขนหนูพับเป็นชั้นสีพาสเทล 2 ตั้ง)
 *   4. ผ้าห่ม/ผ้าปูที่นอน (ผ้าห่มนุ่มพับหนา 2 ตั้ง)
 *
 * คอลัมน์ขวา (บนลงล่าง):
 *   1. ผ้าอ้อม ผ้าเช็ดตัว ผ้าเช็ดหน้า (ผ้าเช็ดตัวขนหนูพับหนา 4 ผืน + ตั้งผ้าอ้อมผ้าสาลูพับเรียบ 8 ผืน)
 *   2. ผลิตภัณฑ์ทำความสะอาดและดูแลผิว (ขวดปั๊มโลชั่น สบู่เหลว แชมพูเด็ก กระปุกสำลีก้าน ครีมทาผิว หวีแปรงขนนุ่ม)
 *   3. อุปกรณ์การให้นม (ขวดนมทารกฝาพาสเทลพร้อมจุกนม 4 ขวด + กล่องเก็บของลายหมี & กล่องเก็บจุกนม)
 *   4. อุปกรณ์ดูแลสุขภาพและของใช้ทั่วไป (กล่องใส่กรรไกรตัดเล็บทารก ปรอทวัดไข้ ลูกยางดูดน้ำมูกสีฟ้า คอตตอนบัด กล่องอเนกประสงค์)
 */
export default function BabySupplyWardrobe3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const bearWipesTex = useBearWipesTexture();

  useEffect(() => {
    return () => {
      bearWipesTex.dispose();
    };
  }, [bearWipesTex]);

  useEffect(() => {
    if (!onClick) return undefined;
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, onClick]);

  // Wardrobe outer dimensions: 1.76m wide x 2.18m high x 0.52m deep (back flush at z = 0, extending forward to z = +0.52)
  const W = 1.76;
  const H = 2.18;
  const D = 0.52;
  const T = 0.032; // Wood panel thickness
  const colCenterL = -W / 4 + T / 4; // -0.432
  const colCenterR = W / 4 - T / 4;  // +0.432
  const colInnerW = W / 2 - T * 1.5; // 0.832

  const woodColor = hovered ? '#fffaf3' : '#f5eee6';
  const innerWoodColor = '#efe6dc';

  const hangingClothes = [
    { x: -0.35, color: '#fce7f3', trim: '#f9a8d4', h: 0.42 },
    { x: -0.26, color: '#fda4af', trim: '#ffe4e6', h: 0.44 },
    { x: -0.17, color: '#fffbeb', trim: '#fbcfe8', h: 0.41 },
    { x: -0.08, color: '#fbcfe8', trim: '#ffffff', h: 0.45 },
    { x: 0.01, color: '#f8fafc', trim: '#bae6fd', h: 0.43 },
    { x: 0.10, color: '#bfdbfe', trim: '#eff6ff', h: 0.44 },
    { x: 0.19, color: '#ffffff', trim: '#fde68a', h: 0.41 },
    { x: 0.28, color: '#fef08a', trim: '#fef9c3', h: 0.43 },
    { x: 0.36, color: '#fce7f3', trim: '#fbcfe8', h: 0.44 },
  ];

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation();
          setHovered(true);
        }
      }}
      onPointerOut={() => {
        if (onClick) setHovered(false);
      }}
    >
      {/* ── 1. โครงตู้ไม้สีครีมขาวอบอุ่น 2 คอลัมน์ (Back flush at z = 0 .. +0.52) ── */}
      {/* แผ่นหลังตู้ */}
      <mesh position={[0, H / 2, T / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color={innerWoodColor} roughness={0.55} />
      </mesh>
      {/* แผงข้างซ้าย & ขวา */}
      <mesh position={[-W / 2 + T / 2, H / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} />
      </mesh>
      <mesh position={[W / 2 - T / 2, H / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} />
      </mesh>
      {/* แผงกั้นกลางแนวตั้ง */}
      <mesh position={[0, H / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[T, H - T * 2, D - 0.02]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} />
      </mesh>
      {/* แผงบนสุด & แผงฐานล่าง */}
      <mesh position={[0, H - T / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, T, D]} />
        <meshStandardMaterial color={woodColor} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.04, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.08, D]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} />
      </mesh>

      {/* บานประตูตู้เปิดแง้มซ้าย-ขวา พร้อมบานพับถ้วยสแตนเลส 3 จุดต่อข้าง (เหมือนภาพต้นฉบับ) */}
      {[-1, 1].map((side) => (
        <group
          key={`door_${side}`}
          position={[side * (W / 2 - 0.01), 0, D - 0.01]}
          rotation={[0, side * 1.32, 0]}
        >
          <mesh position={[side * 0.09, H / 2, 0]} castShadow>
            <boxGeometry args={[0.18, H - 0.02, 0.024]} />
            <meshStandardMaterial color={woodColor} roughness={0.42} />
          </mesh>
          {[0.34, 1.12, 1.88].map((hy, hi) => (
            <mesh key={`hinge_${side}_${hi}`} position={[-side * 0.005, hy, -0.015]}>
              <boxGeometry args={[0.045, 0.065, 0.025]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
            </mesh>
          ))}
        </group>
      ))}

      {/* แผ่นชั้นวางแนวนอนฝั่งซ้าย (y = 1.24, 0.84, 0.44) */}
      {[1.24, 0.84, 0.44].map((sy, idx) => (
        <mesh key={`shelf_l_${idx}`} position={[colCenterL, sy, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[colInnerW, 0.026, D - 0.03]} />
          <meshStandardMaterial color={woodColor} roughness={0.45} />
        </mesh>
      ))}

      {/* แผ่นชั้นวางแนวนอนฝั่งขวา (y = 1.60, 1.08, 0.56) */}
      {[1.60, 1.08, 0.56].map((sy, idx) => (
        <mesh key={`shelf_r_${idx}`} position={[colCenterR, sy, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[colInnerW, 0.026, D - 0.03]} />
          <meshStandardMaterial color={woodColor} roughness={0.45} />
        </mesh>
      ))}

      {/* ══════════════════════════════════════════════════════════════════════════
          คอลัมน์ซ้าย (4 ช่อง): เสื้อผ้าเด็ก • ผ้าอ้อมสำเร็จรูป/ทิชชู่เปียก • ผ้าเช็ดตัว • ผ้าห่ม/ผ้าปูที่นอน
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* L1. ช่องบนซ้าย: เสื้อผ้าเด็ก (y = 1.26 .. 2.14) */}
      <group position={[colCenterL, 0, 0]}>
        <PinkShelfPill3D label="เสื้อผ้าเด็ก" position={[0, 2.07, D + 0.008]} width={0.38} height={0.078} />
        {/* ราวแขวนสแตนเลส */}
        <mesh position={[0, 1.96, 0.27]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.011, 0.011, colInnerW - 0.02, 14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.18} />
        </mesh>
        {/* ชุดเสื้อผ้าเด็ก 3D แขวนบนไม้แขวนเสื้อไม้ 9 ชุด */}
        {hangingClothes.map((item, idx) => (
          <group key={`garment_${idx}`} position={[item.x, 1.95, 0.27]} rotation={[0, 0.22, 0]}>
            {/* ตะขอแขวนโลหะ */}
            <mesh position={[0, -0.025, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* ไม้แขวนเสื้อไม้เด็ก */}
            <mesh position={[0, -0.065, 0]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.022, 0.022, 0.22]} />
              <meshStandardMaterial color="#c69c6d" roughness={0.5} />
            </mesh>
            {/* ตัวชุดบอดี้สูท/เสื้อผ้าเด็กพาสเทล */}
            <RoundedBox
              args={[0.056, item.h, 0.25]}
              radius={0.018}
              smoothness={3}
              position={[0, -0.08 - item.h / 2, 0]}
              castShadow
            >
              <meshStandardMaterial color={item.color} roughness={0.82} />
            </RoundedBox>
            {/* แขนเสื้อพับลงด้านหน้า-หลัง */}
            <RoundedBox
              args={[0.064, item.h * 0.58, 0.075]}
              radius={0.015}
              smoothness={2}
              position={[0, -0.17, 0.115]}
              rotation={[-0.12, 0, 0]}
            >
              <meshStandardMaterial color={item.trim} roughness={0.82} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* L2. ช่องที่ 2 ซ้าย: ผ้าอ้อมสำเร็จรูป และทิชชู่เปียก (y = 0.855 .. 1.24) */}
      <group position={[colCenterL, 0.855, 0]}>
        <PinkShelfPill3D
          label="ผ้าอ้อมสำเร็จรูป และทิชชู่เปียก"
          position={[0, 0.35, D + 0.008]}
          width={0.62}
          height={0.076}
        />
        {/* ตั้งแพมเพิสสำเร็จรูปพับซ้อน 2 กองทางซ้าย */}
        {[-0.27, -0.07].map((dx, stackIdx) => (
          <group key={`diaper_stack_${stackIdx}`} position={[dx, 0, 0.30]}>
            {[0, 1, 2, 3, 4, 5].map((layer) => (
              <group key={`dp_${layer}`} position={[0, 0.022 + layer * 0.041, 0]}>
                <RoundedBox args={[0.17, 0.037, 0.24]} radius={0.014} smoothness={3} castShadow>
                  <meshStandardMaterial color="#ffffff" roughness={0.78} />
                </RoundedBox>
                {/* แถบคาดเอวสีพาสเทลบนแพมเพิส */}
                <mesh position={[0, 0, 0.121]}>
                  <planeGeometry args={[0.11, 0.012]} />
                  <meshBasicMaterial color={layer % 2 === 0 ? '#bbf7d0' : '#fef08a'} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
        {/* ห่อทิชชู่เปียกสีชมพูลายหมี (Baby Wipes Pack) พร้อมฝาเปิดด้านบน */}
        <group position={[0.20, 0.095, 0.31]}>
          <RoundedBox args={[0.31, 0.18, 0.21]} radius={0.032} smoothness={4} castShadow>
            <meshStandardMaterial color="#fbcfe8" roughness={0.42} />
          </RoundedBox>
          {/* ลายหมี Baby Wipes ด้านหน้า */}
          <mesh position={[0, 0, 0.107]}>
            <planeGeometry args={[0.24, 0.145]} />
            <meshBasicMaterial map={bearWipesTex} toneMapped={false} />
          </mesh>
          {/* ฝาพลาสติกเปิด-ปิดทิชชู่เปียกด้านบน */}
          <RoundedBox args={[0.14, 0.018, 0.095]} radius={0.008} smoothness={3} position={[0, 0.094, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </RoundedBox>
        </group>
      </group>

      {/* L3. ช่องที่ 3 ซ้าย: ผ้าสำหรับเช็ดตัว/เช็ดหน้า (y = 0.455 .. 0.84) */}
      <group position={[colCenterL, 0.455, 0]}>
        <PinkShelfPill3D
          label="ผ้าสำหรับเช็ดตัว/เช็ดหน้า"
          position={[0, 0.35, D + 0.008]}
          width={0.54}
          height={0.076}
        />
        {[-0.20, 0.20].map((tx, col) => (
          <group key={`face_towel_col_${col}`} position={[tx, 0, 0.30]}>
            {(col === 0
              ? ['#bfdbfe', '#ffffff', '#f8fafc', '#e0f2fe', '#ffffff']
              : ['#dbeafe', '#fce7f3', '#fffbeb', '#fce7f3', '#ffffff']
            ).map((clr, li) => (
              <RoundedBox
                key={`ft_${li}`}
                args={[0.35, 0.044, 0.28]}
                radius={0.016}
                smoothness={3}
                position={[0, 0.024 + li * 0.045, 0]}
                castShadow
              >
                <meshStandardMaterial color={clr} roughness={0.85} />
              </RoundedBox>
            ))}
          </group>
        ))}
      </group>

      {/* L4. ช่องล่างสุดซ้าย: ผ้าห่ม/ผ้าปูที่นอน (y = 0.08 .. 0.44) */}
      <group position={[colCenterL, 0.08, 0]}>
        <PinkShelfPill3D
          label="ผ้าห่ม/ผ้าปูที่นอน"
          position={[0, 0.33, D + 0.008]}
          width={0.44}
          height={0.076}
        />
        {/* กองซ้าย: ผ้าห่มลายหมีสีครีมเบจ 3 ชั้น */}
        <group position={[-0.20, 0, 0.30]}>
          {['#fef3c7', '#fffbeb', '#fde68a'].map((clr, li) => (
            <RoundedBox
              key={`blk_l_${li}`}
              args={[0.35, 0.068, 0.30]}
              radius={0.024}
              smoothness={3}
              position={[0, 0.036 + li * 0.07, 0]}
              castShadow
            >
              <meshStandardMaterial color={clr} roughness={0.88} />
            </RoundedBox>
          ))}
        </group>
        {/* กองขวา: ผ้าห่มสีชมพูพาสเทลและสีขาวครีม 4 ชั้น */}
        <group position={[0.20, 0, 0.30]}>
          {['#f9a8d4', '#fbcfe8', '#fffbeb', '#ffffff'].map((clr, li) => (
            <RoundedBox
              key={`blk_r_${li}`}
              args={[0.36, 0.056, 0.30]}
              radius={0.022}
              smoothness={3}
              position={[0, 0.03 + li * 0.058, 0]}
              castShadow
            >
              <meshStandardMaterial color={clr} roughness={0.88} />
            </RoundedBox>
          ))}
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          คอลัมน์ขวา (4 ช่อง): ผ้าอ้อม/ผ้าเช็ดตัว • ผลิตภัณฑ์ดูแลผิว • อุปกรณ์ให้นม • อุปกรณ์ดูแลสุขภาพ
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* R1. ช่องบนสุดขวา: ผ้าอ้อม ผ้าเช็ดตัว ผ้าเช็ดหน้า (y = 1.615 .. 2.14) */}
      <group position={[colCenterR, 1.615, 0]}>
        <PinkShelfPill3D
          label="ผ้าอ้อม ผ้าเช็ดตัว ผ้าเช็ดหน้า"
          position={[0, 0.455, D + 0.008]}
          width={0.58}
          height={0.078}
        />
        {/* ซ้าย: ผ้าขนหนูผืนใหญ่พับนุ่ม 4 ชั้น (ครีม / ฟ้า / ขาวชมพู / ชมพู) */}
        <group position={[-0.20, 0, 0.30]}>
          {['#fffbeb', '#93c5fd', '#fdf2f8', '#f9a8d4'].map((clr, li) => (
            <RoundedBox
              key={`plush_${li}`}
              args={[0.37, 0.088, 0.30]}
              radius={0.032}
              smoothness={4}
              position={[0, 0.046 + li * 0.09, 0]}
              castShadow
            >
              <meshStandardMaterial color={clr} roughness={0.9} />
            </RoundedBox>
          ))}
        </group>
        {/* ขวา: ผ้าอ้อมผ้าสาลูพับเรียบ 8 ชั้น */}
        <group position={[0.21, 0, 0.30]}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((li) => (
            <RoundedBox
              key={`gauze_${li}`}
              args={[0.33, 0.038, 0.27]}
              radius={0.012}
              smoothness={3}
              position={[0, 0.02 + li * 0.04, 0]}
              castShadow
            >
              <meshStandardMaterial
                color={li === 6 ? '#dbeafe' : li % 2 === 0 ? '#ffffff' : '#fff7ed'}
                roughness={0.85}
              />
            </RoundedBox>
          ))}
        </group>
      </group>

      {/* R2. ช่องที่ 2 ขวา: ผลิตภัณฑ์ทำความสะอาดและดูแลผิว (y = 1.095 .. 1.60) */}
      <group position={[colCenterR, 1.095, 0]}>
        <PinkShelfPill3D
          label="ผลิตภัณฑ์ทำความสะอาดและดูแลผิว"
          position={[0, 0.455, D + 0.008]}
          width={0.66}
          height={0.076}
        />
        {/* ขวดปั๊มใหญ่แถวหลัง (ชมพู, ขาว, ฟ้า, เหลืองแชมพู, ขาวโฟม) */}
        {[
          { x: -0.31, z: 0.24, r: 0.056, h: 0.28, color: '#fbcfe8', pump: '#f472b6', hasPump: true },
          { x: -0.15, z: 0.23, r: 0.054, h: 0.26, color: '#f8fafc', pump: '#e2e8f0', hasPump: true },
          { x: -0.01, z: 0.25, r: 0.046, h: 0.20, color: '#bae6fd', pump: '#60a5fa', hasPump: false },
          { x: 0.14, z: 0.23, r: 0.056, h: 0.27, color: '#fef08a', pump: '#ffffff', hasPump: true },
          { x: 0.29, z: 0.23, r: 0.048, h: 0.22, color: '#ffffff', pump: '#f1f5f9', hasPump: true },
        ].map((b, bi) => (
          <group key={`skin_back_${bi}`} position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h / 2, 0]} castShadow>
              <cylinderGeometry args={[b.r * 0.88, b.r, b.h, 18]} />
              <meshStandardMaterial color={b.color} roughness={0.28} />
            </mesh>
            {/* ฉลากหน้าขวด */}
            <mesh position={[0, b.h * 0.48, b.r * 0.94]}>
              <planeGeometry args={[b.r * 1.15, b.h * 0.48]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* หัวปั๊ม */}
            <mesh position={[0, b.h + 0.022, 0]}>
              <cylinderGeometry args={[0.016, 0.02, 0.044, 12]} />
              <meshStandardMaterial color={b.pump} roughness={0.3} />
            </mesh>
            {b.hasPump && (
              <mesh position={[0.018, b.h + 0.042, 0.018]} rotation={[0.25, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0.006, 0.008, 0.048, 10]} />
                <meshStandardMaterial color={b.pump} roughness={0.3} />
              </mesh>
            )}
          </group>
        ))}

        {/* แถวหน้า: ขวดเบบี้ออยล์ชมพูเล็ก, กระปุกสำลีก้านฝาชมพู, กระปุกครีมฝาฟ้า, แก้วชมพูใส่แปรงขนนุ่มและหวี */}
        {/* ขวดโลชั่น/ออยล์ชมพูเล็ก */}
        <group position={[-0.22, 0, 0.37]}>
          <RoundedBox args={[0.095, 0.19, 0.056]} radius={0.022} smoothness={3} position={[0, 0.095, 0]} castShadow>
            <meshStandardMaterial color="#fce7f3" roughness={0.28} />
          </RoundedBox>
          <mesh position={[0, 0.205, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
            <meshStandardMaterial color="#f9a8d4" />
          </mesh>
        </group>
        {/* กระปุกสำลีก้านฝาชมพู */}
        <group position={[-0.08, 0, 0.37]}>
          <mesh position={[0, 0.055, 0]} castShadow>
            <cylinderGeometry args={[0.044, 0.042, 0.11, 16]} />
            <meshStandardMaterial color="#fff7ed" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.115, 0]}>
            <cylinderGeometry args={[0.046, 0.046, 0.02, 16]} />
            <meshStandardMaterial color="#f9a8d4" roughness={0.35} />
          </mesh>
        </group>
        {/* กระปุกครีมทาผิวฝาสีฟ้า */}
        <group position={[0.05, 0, 0.38]}>
          <mesh position={[0, 0.035, 0]} castShadow>
            <cylinderGeometry args={[0.052, 0.05, 0.07, 18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.078, 0]}>
            <cylinderGeometry args={[0.053, 0.053, 0.024, 18]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.3} />
          </mesh>
        </group>
        {/* แก้วสีชมพูใส่แปรงหวีผมทารกขนนุ่ม */}
        <group position={[0.31, 0, 0.36]}>
          <mesh position={[0, 0.055, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.046, 0.11, 18]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.35} />
          </mesh>
          {/* ด้ามแปรงหวีผมทารก */}
          <mesh position={[0.015, 0.14, 0]} rotation={[0, 0, -0.22]} castShadow>
            <boxGeometry args={[0.034, 0.14, 0.014]} />
            <meshStandardMaterial color="#fde2e4" roughness={0.35} />
          </mesh>
          <mesh position={[-0.018, 0.13, 0.01]} rotation={[0, 0, 0.18]} castShadow>
            <boxGeometry args={[0.026, 0.13, 0.01]} />
            <meshStandardMaterial color="#f472b6" roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* R3. ช่องที่ 3 ขวา: อุปกรณ์การให้นม (y = 0.575 .. 1.08) */}
      <group position={[colCenterR, 0.575, 0]}>
        <PinkShelfPill3D
          label="อุปกรณ์การให้นม"
          position={[0, 0.455, D + 0.008]}
          width={0.42}
          height={0.076}
        />
        {/* ขวดนมทารก 4 ขวด (ฝาเกลียวสีชมพู, ฟ้า, เหลือง, พีช พร้อมจุกนมซิลิโคน) */}
        {[
          { x: -0.32, ring: '#fbcfe8', milkH: 0.14, bodyH: 0.19 },
          { x: -0.19, ring: '#bae6fd', milkH: 0.05, bodyH: 0.19 },
          { x: -0.06, ring: '#fef08a', milkH: 0.04, bodyH: 0.18 },
          { x: 0.07, ring: '#fed7aa', milkH: 0.12, bodyH: 0.17 },
        ].map((bt, bi) => (
          <group key={`milk_bottle_${bi}`} position={[bt.x, 0, 0.32]}>
            {/* ตัวขวดนม */}
            <mesh position={[0, bt.bodyH / 2, 0]} castShadow>
              <cylinderGeometry args={[0.044, 0.046, bt.bodyH, 18]} />
              <meshStandardMaterial color="#fffdf7" transparent opacity={0.82} roughness={0.18} />
            </mesh>
            {/* น้ำนมด้านใน */}
            <mesh position={[0, bt.milkH / 2 + 0.005, 0]}>
              <cylinderGeometry args={[0.039, 0.041, bt.milkH, 16]} />
              <meshStandardMaterial color={bi === 3 ? '#fef08a' : '#fffbeb'} roughness={0.35} />
            </mesh>
            {/* เกลียวคอขวดสีพาสเทล */}
            <mesh position={[0, bt.bodyH + 0.018, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.046, 0.036, 18]} />
              <meshStandardMaterial color={bt.ring} roughness={0.32} />
            </mesh>
            {/* จุกนม & ฝาครอบใส */}
            <mesh position={[0, bt.bodyH + 0.054, 0]}>
              <cylinderGeometry args={[0.012, 0.026, 0.042, 14]} />
              <meshStandardMaterial color="#fde68a" roughness={0.35} />
            </mesh>
            <mesh position={[0, bt.bodyH + 0.065, 0]}>
              <cylinderGeometry args={[0.036, 0.04, 0.062, 16]} />
              <meshStandardMaterial color="#f8fafc" transparent opacity={0.45} roughness={0.12} />
            </mesh>
          </group>
        ))}

        {/* กล่องเก็บนมผง/อุปกรณ์ให้นมสีครีมลายหมี + กล่องใสใส่จุกนมด้านหน้า */}
        <group position={[0.26, 0, 0.25]}>
          <RoundedBox args={[0.23, 0.22, 0.18]} radius={0.028} smoothness={3} position={[0, 0.11, 0]} castShadow>
            <meshStandardMaterial color="#f5f0eb" roughness={0.38} />
          </RoundedBox>
          <mesh position={[0, 0.11, 0.092]}>
            <circleGeometry args={[0.032, 16]} />
            <meshBasicMaterial color="#d97706" />
          </mesh>
        </group>
        <group position={[0.27, 0, 0.39]}>
          <RoundedBox args={[0.22, 0.095, 0.11]} radius={0.014} smoothness={3} position={[0, 0.048, 0]} castShadow>
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.65} roughness={0.2} />
          </RoundedBox>
        </group>
      </group>

      {/* R4. ช่องล่างสุดขวา: อุปกรณ์ดูแลสุขภาพและของใช้ทั่วไป (y = 0.08 .. 0.56) */}
      <group position={[colCenterR, 0.08, 0]}>
        <PinkShelfPill3D
          label="อุปกรณ์ดูแลสุขภาพและของใช้ทั่วไป"
          position={[0, 0.435, D + 0.008]}
          width={0.66}
          height={0.076}
        />
        {/* กล่องใสซ้าย: กรรไกรตัดเล็บทารกปลายมน & สำลีแผ่น */}
        <group position={[-0.27, 0, 0.31]}>
          <RoundedBox args={[0.21, 0.13, 0.22]} radius={0.018} smoothness={3} position={[0, 0.065, 0]} castShadow>
            <meshStandardMaterial color="#f1f5f9" transparent opacity={0.75} roughness={0.22} />
          </RoundedBox>
          {/* ห่วงกรรไกรตัดเล็บทารกสีขาวด้านหน้า */}
          {[-0.025, 0.025].map((sx, si) => (
            <mesh key={`scis_${si}`} position={[sx, 0.045, 0.115]}>
              <torusGeometry args={[0.02, 0.006, 10, 18]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* ปรอทวัดไข้ดิจิทัล + ลูกยางดูดน้ำมูกสีฟ้า (Nasal Aspirator Bulb) */}
        <group position={[-0.08, 0, 0.36]}>
          {/* ปรอทวัดไข้ดิจิทัล */}
          <mesh position={[-0.045, 0.075, 0]} rotation={[0.15, 0, 0.08]} castShadow>
            <cylinderGeometry args={[0.012, 0.01, 0.15, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          {/* ลูกยางดูดน้ำมูกสีฟ้า */}
          <mesh position={[0.035, 0.058, 0]} scale={[1, 1.25, 1]} castShadow>
            <sphereGeometry args={[0.042, 18, 18]} />
            <meshStandardMaterial color="#60a5fa" roughness={0.42} />
          </mesh>
          <mesh position={[0.035, 0.125, 0]} castShadow>
            <cylinderGeometry args={[0.006, 0.016, 0.055, 14]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.25} />
          </mesh>
        </group>

        {/* กล่องคอตตอนบัดตรงกลาง */}
        <group position={[0.07, 0, 0.34]}>
          <RoundedBox args={[0.12, 0.13, 0.16]} radius={0.016} smoothness={3} position={[0, 0.065, 0]} castShadow>
            <meshStandardMaterial color="#f8fafc" roughness={0.32} />
          </RoundedBox>
        </group>

        {/* กล่องเก็บของอเนกประสงค์มีฝาปิดสีครีมขวาสุด */}
        <group position={[0.27, 0, 0.31]}>
          <RoundedBox args={[0.23, 0.16, 0.22]} radius={0.022} smoothness={3} position={[0, 0.08, 0]} castShadow>
            <meshStandardMaterial color="#efe8e0" roughness={0.42} />
          </RoundedBox>
          <RoundedBox args={[0.24, 0.026, 0.23]} radius={0.01} smoothness={3} position={[0, 0.168, 0]}>
            <meshStandardMaterial color="#f8f4ef" roughness={0.35} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}
