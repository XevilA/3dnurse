import React, { useMemo, useState, useEffect } from 'react';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const THAI_FONT = '"Sarabun","Noto Sans Thai","Thonburi","Ayuthaya",system-ui,sans-serif';

function roundRect2D(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Creates a crisp high-DPI CanvasTexture for 3D poster headers/captions
 * so we never need floating <Html transform> overlays on walls.
 */
export function usePosterTitleTexture({
  title = '',
  subtitle = '',
  badge = '',
  bgColor = '#fffdf9',
  textColor = '#7c2d12',
  accentColor = '#d97706',
  widthPx = 768,
  heightPx = 136,
}) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d');
    const s = heightPx / 180;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, widthPx, heightPx);
      ctx.fillStyle = bgColor;
      roundRect2D(ctx, 0, 0, widthPx, heightPx, 20 * s);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = Math.max(3, 6 * s);
      roundRect2D(ctx, 3, 3, widthPx - 6, heightPx - 6, 18 * s);
      ctx.stroke();

      let textStartX = 24 * s;
      if (badge) {
        ctx.font = `900 ${Math.round(31 * s)}px ${THAI_FONT}`;
        const bw = Math.max(84 * s, ctx.measureText(badge).width + 34 * s);
        ctx.fillStyle = accentColor;
        roundRect2D(ctx, 18 * s, 18 * s, bw, heightPx - 36 * s, 12 * s);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badge, 18 * s + bw / 2, heightPx / 2 + 1);
        textStartX = 18 * s + bw + 18 * s;
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;
      ctx.font = `900 ${Math.round((subtitle ? 39 : 43) * s)}px ${THAI_FONT}`;
      ctx.fillText(title, textStartX, subtitle ? heightPx * 0.36 : heightPx * 0.5, widthPx - textStartX - 24 * s);

      if (subtitle) {
        ctx.fillStyle = '#475569';
        ctx.font = `700 ${Math.round(27 * s)}px ${THAI_FONT}`;
        ctx.fillText(subtitle, textStartX, heightPx * 0.74, widthPx - textStartX - 24 * s);
      }
    };

    draw();
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }, [title, subtitle, badge, bgColor, textColor, accentColor, widthPx, heightPx]);

  useEffect(() => {
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) tex.needsUpdate = true;
      });
    }
    return () => {
      alive = false;
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

const _sharedRugTextures = {};

/**
 * Generates a shared woven beige fabric rug texture singleton per pattern
 */
export function useWovenRugTexture(pattern = 'weave') {
  return useMemo(() => {
    if (_sharedRugTextures[pattern]) return _sharedRugTextures[pattern];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#e7dacb';
      ctx.fillRect(0, 0, 256, 256);

      if (pattern === 'diamond') {
        ctx.strokeStyle = 'rgba(180, 156, 132, 0.55)';
        ctx.lineWidth = 3;
        const step = 32;
        for (let y = -256; y < 512; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(256, y + 256);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(256, y);
          ctx.lineTo(0, y + 256);
          ctx.stroke();
        }
      } else {
        for (let y = 0; y < 256; y += 4) {
          ctx.fillStyle = y % 8 === 0 ? 'rgba(166, 142, 118, 0.25)' : 'rgba(255, 248, 240, 0.22)';
          ctx.fillRect(0, y, 256, 2);
        }
        for (let x = 0; x < 256; x += 6) {
          ctx.fillStyle = 'rgba(150, 125, 100, 0.12)';
          ctx.fillRect(x, 0, 1, 256);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    _sharedRugTextures[pattern] = tex;
    return tex;
  }, [pattern]);
}

/**
 * WoodFramedBacklitPanel — กรอบไม้โอ๊คโค้งมนพร้อมไฟซ่อน Warm LED รอบกรอบภาพ
 * ยึดติดผนังแนบสนิท 100% (มีฐานยึดผนังด้านหลังลึกเข้าไปในเนื้อกำแพง ไม่ลอยเด็ดขาด)
 */
export function WoodFramedBacklitPanel({
  width = 5.0,
  height = 4.2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  frameColor = '#8c5a32',
  children,
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* แสงไฟซ่อน Warm LED รอบกรอบด้านหลัง (แนบผิวกำแพง) */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[width + 0.44, height + 0.44]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.38} />
      </mesh>
      {/* กรอบไม้โอ๊คด้านนอก (ความลึกฝังแนบเข้ากับผิวกำแพงโดยตรง ไม่มีช่องว่าง) */}
      <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.32, height + 0.32, 0.1]} />
        <meshStandardMaterial color={frameColor} roughness={0.45} />
      </mesh>
      {/* เส้นไฟซ่อน LED สีส้มอุ่นด้านในขอบไม้ */}
      <mesh position={[0, 0, 0.018]}>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.04]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#f59e0b"
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* พื้นหลังบอร์ดสีขาวนวล */}
      <mesh position={[0, 0, 0.032]} receiveShadow>
        <boxGeometry args={[width, height, 0.025]} />
        <meshStandardMaterial color="#fffdf9" roughness={0.3} />
      </mesh>
      {children}
    </group>
  );
}

/**
 * FramedImagePoster3D — โปสเตอร์/กรอบรูป 3D แท้ (WebGL Mesh + Texture) ติดผนังแนบสนิท 100%
 * ไม่ใช้ <Html transform> จึงไม่ลอยออกมาจากกำแพงและไม่ทะลุวัตถุอื่นเวลาหมุนกล้อง
 */
export function FramedImagePoster3D({
  imgSrc,
  src,
  width = 2.6,
  height = 3.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  title = '',
  subtitle = '',
  badge = '',
  badgeText = '',
  frameColor = '#8c5a32',
  accentColor = '#d97706',
  headerColor = '',
  backlit = true,
  onClick,
  children,
}) {
  const resolvedSrc = imgSrc || src || '/images/rev/lobby_mother_baby_poster.jpg';
  const resolvedBadge = badge || badgeText || '';
  const resolvedAccent = headerColor || accentColor || '#d97706';
  const tex = useTexture(resolvedSrc);
  useMemo(() => {
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
    }
  }, [tex]);

  const hasHeader = Boolean(title || resolvedBadge);
  const headerH = hasHeader ? Math.min(0.46, height * 0.17) : 0;
  const imgH = hasHeader ? height - headerH - 0.08 : height - 0.08;
  const imgY = hasHeader ? -headerH / 2 - 0.01 : 0;
  const headerY = height / 2 - headerH / 2 - 0.03;

  const headerTex = usePosterTitleTexture({
    title,
    subtitle: subtitle || (onClick ? '🔍 คลิกที่ป้ายเพื่อดูภาพขยาย' : ''),
    badge: resolvedBadge,
    accentColor: resolvedAccent,
    bgColor: '#fffdf9',
    textColor: '#1e293b',
  });

  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!onClick) return undefined;
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, onClick]);

  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
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
      {/* แสงไฟซ่อน Warm LED รอบกรอบด้านหลัง */}
      {backlit && (
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[width + 0.4, height + 0.4]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={hovered ? 0.55 : 0.35} />
        </mesh>
      )}
      {/* กรอบไม้/กรอบรูปยึดติดผนังโดยตรง (z = -0.02 ฝังเข้าผนังถึง +0.035) */}
      <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.24, height + 0.24, 0.09]} />
        <meshStandardMaterial color={hovered && onClick ? accentColor : frameColor} roughness={0.42} />
      </mesh>
      {/* ขอบไฟซ่อนหรือขอบด้านใน */}
      <mesh position={[0, 0, 0.018]}>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.035]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive={backlit ? '#f59e0b' : '#000000'}
          emissiveIntensity={backlit ? 0.75 : 0}
          roughness={0.25}
        />
      </mesh>
      {/* แผ่นพื้นหลังสีขาว */}
      <mesh position={[0, 0, 0.03]} receiveShadow>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* แถบหัวข้อด้านบน (3D Mesh Texture) */}
      {hasHeader && (
        <mesh position={[0, headerY, 0.043]}>
          <planeGeometry args={[width - 0.08, headerH]} />
          <meshBasicMaterial map={headerTex} toneMapped={false} />
        </mesh>
      )}

      {/* ภาพโปสเตอร์ 3D Mesh แนบสนิทในกรอบ */}
      <mesh position={[0, imgY, 0.043]}>
        <planeGeometry args={[width - 0.08, imgH]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
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

        {/* ── ผ้าอ้อมผ้าสาลูพับ 3 ผืน + แพมเพิสวางบนส่วน Chaise Lounge ฝั่งซ้าย ── */}
        <group position={[-1.05, 0.48, 0.68]} rotation={[0, 0.2, 0]}>
          {/* ผ้าอ้อมผืนที่ 1 (ล่าง - ชมพูอ่อน) */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.42, 0.04, 0.34]} />
            <meshStandardMaterial color="#ffe4e6" roughness={0.8} />
          </mesh>
          {/* ผ้าอ้อมผืนที่ 2 (กลาง - ขาวขลิบฟ้า) */}
          <mesh position={[0.01, 0.06, -0.01]} rotation={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.4, 0.04, 0.32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[0.01, 0.062, 0.14]} rotation={[0, -0.08, 0]}>
            <boxGeometry args={[0.4, 0.042, 0.03]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          {/* ผ้าอ้อมผืนที่ 3 (บน - ครีมอ่อนขลิบชมพู) */}
          <mesh position={[-0.01, 0.1, 0.01]} rotation={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.38, 0.04, 0.3]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.8} />
          </mesh>
          <mesh position={[-0.01, 0.102, 0.14]} rotation={[0, 0.06, 0]}>
            <boxGeometry args={[0.38, 0.042, 0.03]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
        </group>
      </group>

      {/* ── 3. สตูลพรมถักกลมสีเขียวอ่อน (Sage Knitted Pouf Ottoman) หน้าโซฟาตัว L ── */}
      <mesh position={[-1.08, 0.18, 1.72]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.32, 24]} />
        <meshStandardMaterial color="#a3b899" roughness={0.9} />
      </mesh>

      {/* ── 4. โต๊ะกลางกลมท็อปสีขาว ขาไม้โอ๊ค + แท็บเล็ตสื่อการสอน + ตะกร้าผ้าอ้อม + ขวดนม + แก้วน้ำ + แจกันดอกเดซี่ ── */}
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
        <group position={[-0.12, 0.56, 0.08]} rotation={[-0.25, -0.3, 0]}>
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

        {/* ถาดตะกร้าผ้าอ้อมสำเร็จรูป (แพมเพิส) + ผ้าอ้อมพับ + ขวดนมบนโต๊ะ */}
        <group position={[0.04, 0.45, -0.32]} rotation={[0, 0.2, 0]}>
          {/* ถาดไม้ขอบมน */}
          <mesh position={[0, 0.015, 0]} castShadow>
            <boxGeometry args={[0.38, 0.03, 0.24]} />
            <meshStandardMaterial color="#d4a373" roughness={0.5} />
          </mesh>
          {/* พับผ้าอ้อมผ้าสาลู 2 ผืนบนถาด */}
          <mesh position={[-0.08, 0.045, 0]} castShadow>
            <boxGeometry args={[0.16, 0.035, 0.18]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[-0.08, 0.08, 0]} castShadow>
            <boxGeometry args={[0.15, 0.035, 0.17]} />
            <meshStandardMaterial color="#fce7f3" roughness={0.8} />
          </mesh>
          {/* แพมเพิสพับพร้อมแถบกาวสีฟ้า */}
          <mesh position={[0.08, 0.05, 0.02]} castShadow>
            <boxGeometry args={[0.13, 0.045, 0.16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.7} />
          </mesh>
          <mesh position={[0.08, 0.074, 0.02]}>
            <boxGeometry args={[0.132, 0.008, 0.04]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          {/* ขวดนมทารก */}
          <group position={[0.12, 0.03, -0.06]}>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.028, 0.03, 0.11, 14]} />
              <meshStandardMaterial color="#fffbeb" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.125, 0]}>
              <cylinderGeometry args={[0.026, 0.028, 0.025, 14]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.016, 10, 10]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* แก้วเซรามิกสีเขียวพาสเทลบนจานรองไม้ */}
        <group position={[-0.36, 0.45, -0.14]}>
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
        <group position={[0.32, 0.45, 0.08]}>
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
          <Html position={[-0.1, 0.95, 0]} center zIndexRange={[15, 0]}>
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

/**
 * WallMountedTV3D — จอทีวีสื่อการสอนติดผนังแนบสนิท 100% (3D CanvasTexture ไม่ลอย)
 */
export function WallMountedTV3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.5,
  height = 1.48,
  title = 'วิดีโอสื่อการสอน',
  subtitle = 'คลิกที่จอทีวีเพื่อรับชมวิดีโอ',
  badge = '📺 VIDEO LESSON',
  accentColor = '#ec4899',
  onClick,
}) {
  const screenTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!ctx) return;
      const grad = ctx.createLinearGradient(0, 0, 1024, 600);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#311042');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 600);

      // Border glow
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      roundRect2D(ctx, 20, 20, 984, 560, 28);
      ctx.stroke();

      // Badge
      ctx.fillStyle = accentColor;
      roundRect2D(ctx, 352, 65, 320, 54, 27);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 26px ${THAI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge, 512, 93);

      // Play button circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(512, 245, 68, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(494, 212);
      ctx.lineTo(494, 278);
      ctx.lineTo(548, 245);
      ctx.closePath();
      ctx.fill();

      // Title & subtitle
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 42px ${THAI_FONT}`;
      ctx.fillText(title, 512, 390, 900);

      ctx.fillStyle = '#fbcfe8';
      ctx.font = `700 28px ${THAI_FONT}`;
      ctx.fillText(subtitle, 512, 455, 900);

      // Bottom pill
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      roundRect2D(ctx, 312, 495, 400, 50, 25);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = `800 24px ${THAI_FONT}`;
      ctx.fillText('▶ คลิกที่จอทีวีเพื่อเปิดดูสื่อการสอน', 512, 521);
    };

    draw();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [title, subtitle, badge, accentColor]);

  useEffect(() => {
    return () => {
      screenTex.dispose();
    };
  }, [screenTex]);

  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!onClick) return undefined;
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, onClick]);

  return (
    <group
      position={position}
      rotation={rotation}
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
      {/* ขายึดผนังด้านหลังทีวี (ฝังแนบผิวกำแพง ไม่มีช่องว่าง) */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.09]} />
        <meshStandardMaterial color={hovered ? accentColor : '#0f172a'} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* หน้าจอทีวี 3D */}
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={screenTex} toneMapped={false} />
      </mesh>
    </group>
  );
}

