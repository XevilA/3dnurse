import React, { useMemo, useState, useEffect } from 'react';
import { RoundedBox, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';
import BillboardLabel3D from '../ui/BillboardLabel3D';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import {
  RealisticThrowPillow3D,
  RealisticNursingPillow3D,
  RealisticIPad3D,
  RealisticBookStack3D,
  RealisticOpenBook3D,
  RealisticFoldedClothStack3D,
  RealisticWickerTraySet3D,
  RealisticCeramicMug3D,
  RealisticKnittedPouf3D,
  RealisticPlushToy3D,
} from './RealisticProps3D';

const THAI_FONT = CANVAS_THAI_FONT;

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
  const { tex, redraw } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d');
    const s = heightPx / 180;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;

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
        ctx.textBaseline = 'middle';
        fillCenteredText(ctx, badge, 18 * s + bw / 2, heightPx / 2 + 1, bw - 16 * s);
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

      t.needsUpdate = true;
    };

    draw();
    return { tex: t, redraw: draw };
  }, [title, subtitle, badge, bgColor, textColor, accentColor, widthPx, heightPx]);

  useEffect(() => {
    const cancelFonts = whenFontsReady(redraw);
    return () => {
      cancelFonts();
      tex.dispose();
    };
  }, [tex, redraw]);

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
  contain = false,
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
  const imgW = width - 0.08;
  const imgY = hasHeader ? -headerH / 2 - 0.01 : 0;
  const headerY = height / 2 - headerH / 2 - 0.03;

  const [fitW, fitH] = useMemo(() => {
    if (!contain || !tex?.image?.width || !tex?.image?.height) {
      return [imgW, imgH];
    }
    const aspect = tex.image.width / tex.image.height;
    let w = imgW;
    let h = w / aspect;
    if (h > imgH) {
      h = imgH;
      w = h * aspect;
    }
    return [w, h];
  }, [contain, tex, imgW, imgH]);

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
    if (e.delta > 10) return;
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
        <planeGeometry args={[fitW, fitH]} />
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
  ipadMode = 'danger',
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

      {/* ── 2. โซฟาตัว L ผ้าบุนุ่มขอบมนสมจริง (Sculpted Plush L-Shaped Sectional Sofa) ── */}
      <group
        position={[0, 0, -0.2]}
        onClick={(e) => {
          if (onClickSofa) {
            e.stopPropagation();
            onClickSofa();
          }
        }}
      >
        {/* ฐานไม้และขาโซฟาไม้โอ๊คทรงสอบพร้อมแหวนทองเหลือง */}
        {[
          [-1.55, -0.42],
          [1.55, -0.42],
          [-1.55, 1.35],
          [-0.55, 1.35],
          [1.55, 0.42],
        ].map(([lx, lz], idx) => (
          <group key={idx} position={[lx, 0.07, lz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.026, 0.14, 16]} />
              <meshStandardMaterial color="#8c5a32" roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.027, 0.025, 0.018, 16]} />
              <meshStandardMaterial color="#d4a373" metalness={0.55} roughness={0.28} />
            </mesh>
          </group>
        ))}

        {/* โครงฐานโซฟาตัวหลัก (ขอบมนหุ้มผ้าทอ) */}
        <RoundedBox
          args={[3.3, 0.22, 0.98]}
          radius={0.042}
          smoothness={4}
          position={[0, 0.24, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8f8377" roughness={0.86} />
        </RoundedBox>

        {/* เบาะนั่งโซฟาฝั่งกลางและขวา (แบ่ง 2 เบาะหนานุ่มขอบมนมีตะเข็บ) */}
        {[0.02, 1.07].map((cx, cIdx) => (
          <RoundedBox
            key={cIdx}
            args={[1.05, 0.17, 0.92]}
            radius={0.052}
            smoothness={5}
            position={[cx, 0.405, 0.02]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#a19589" roughness={0.82} />
          </RoundedBox>
        ))}

        {/* ส่วนยื่นโซฟาเบดตัว L ฝั่งซ้าย (Plush Chaise Lounge Extension) */}
        <RoundedBox
          args={[1.12, 0.22, 1.92]}
          radius={0.042}
          smoothness={4}
          position={[-1.08, 0.24, 0.48]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8f8377" roughness={0.86} />
        </RoundedBox>
        <RoundedBox
          args={[1.08, 0.17, 1.86]}
          radius={0.055}
          smoothness={5}
          position={[-1.08, 0.405, 0.50]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#a19589" roughness={0.82} />
        </RoundedBox>

        {/* พนักพิงหลังโซฟาขอบมน */}
        <RoundedBox
          args={[3.34, 0.68, 0.2]}
          radius={0.048}
          smoothness={4}
          position={[0, 0.72, -0.42]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8a7e72" roughness={0.86} />
        </RoundedBox>

        {/* หมอนพิงหลังหนานุ่มทรงโค้งมน 3 ใบ */}
        {[-1.04, 0.0, 1.04].map((bx, i) => (
          <RoundedBox
            key={i}
            args={[1.01, 0.50, 0.19]}
            radius={0.068}
            smoothness={5}
            position={[bx, 0.73, -0.25]}
            rotation={[-0.08, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#aba094" roughness={0.82} />
          </RoundedBox>
        ))}

        {/* ที่วางแขนซ้าย-ขวาขอบโค้งมน */}
        {[-1.68, 1.68].map((ax, idx) => (
          <RoundedBox
            key={idx}
            args={[0.2, 0.49, 0.98]}
            radius={0.055}
            smoothness={4}
            position={[ax, 0.52, -0.02]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#8a7e72" roughness={0.85} />
          </RoundedBox>
        ))}

        {/* ── หมอนอิงผ้าทอ 3D สมจริงจากโมเดลผ้าพับย่น (Poly Haven Sculpted Cloth Mesh + Normal Map) ── */}
        {/* หมอนอิงสีเขียวเซจ (Sage Green) */}
        <RealisticThrowPillow3D
          color="#6e9981"
          variant={0}
          position={[-1.20, 0.65, -0.10]}
          rotation={[-0.14, 0.22, -0.06]}
          scale={0.88}
        />
        {/* หมอนอิงสีเหลืองมัสตาร์ด (Warm Ochre / Mustard) */}
        <RealisticThrowPillow3D
          color="#e0a03f"
          variant={1}
          position={[-0.74, 0.62, -0.07]}
          rotation={[-0.12, -0.15, 0.05]}
          scale={0.80}
        />
        {/* หมอนอิงสีชมพูพีช (Soft Blush Terracotta) */}
        <RealisticThrowPillow3D
          color="#e79a8c"
          variant={0}
          position={[1.24, 0.65, -0.08]}
          rotation={[-0.14, -0.24, 0.07]}
          scale={0.90}
        />

        {/* ── หมอนรองให้นมรูปตัว U (Seamless Boppy Nursing Pillow ไร้รอยตัดเปิดปลาย) ── */}
        <RealisticNursingPillow3D
          position={[1.08, 0.56, 0.14]}
          rotation={[0, -0.35, 0]}
          scale={0.96}
        />

        {/* ── ชุดหนังสือคู่มือคุณแม่ปกแข็ง + หนังสือเปิดกาง + ผ้าอ้อมผ้าสาลูพับนุ่มบน Chaise Lounge ── */}
        <RealisticBookStack3D
          position={[-1.12, 0.49, 0.52]}
          rotation={[0, 0.22, 0]}
          scale={0.92}
          withOpenTop={true}
        />
        <RealisticFoldedClothStack3D
          position={[-1.02, 0.49, 1.02]}
          rotation={[0, -0.15, 0]}
          scale={0.88}
        />
      </group>

      {/* ── 3. สตูลพรมถักกลมสีเขียวเซจ (Sculpted Cable-Knit Pouf Ottoman) หน้าโซฟาตัว L ── */}
      <RealisticKnittedPouf3D position={[-1.08, 0, 1.80]} color="#a3b899" />

      {/* ── 4. โต๊ะกลางกลมท็อปขาวขาไม้โอ๊ค + iPad Pro พร้อมขาตั้ง Smart Folio & Apple Pencil + ตะกร้าหวาย + แก้วชา + แจกันดอกไม้จริง ── */}
      <group
        position={[0.80, 0, 1.56]}
        onClick={(e) => {
          if (onClickTablet) {
            e.stopPropagation();
            onClickTablet();
          }
        }}
      >
        {/* ท็อปโต๊ะกลมสีขาวนวลขอบมน (Top surface y = 0.443) */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.68, 0.67, 0.045, 44]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.675, 0.022, 14, 44]} />
          <meshStandardMaterial color="#f5f0e6" roughness={0.28} />
        </mesh>

        {/* ขาโต๊ะไม้โอ๊คทรงสอบเฉียงสแกนดิเนเวีย */}
        {[
          [-0.36, -0.36, -0.1, 0.1],
          [0.36, -0.36, -0.1, -0.1],
          [-0.36, 0.36, 0.1, 0.1],
          [0.36, 0.36, 0.1, -0.1],
        ].map(([lx, lz, rx, rz], idx) => (
          <mesh key={idx} position={[lx, 0.21, lz]} rotation={[rx, 0, rz]} castShadow>
            <cylinderGeometry args={[0.03, 0.02, 0.425, 16]} />
            <meshStandardMaterial color="#9c6644" roughness={0.46} />
          </mesh>
        ))}

        {/* iPad Pro + Smart Folio Stand + Apple Pencil วางแนบบนท็อปโต๊ะ หันหน้าจอคมชัดสู่ผู้เรียน */}
        <RealisticIPad3D
          position={[-0.15, 0.443, 0.10]}
          rotation={[0, -0.38, 0]}
          scale={1.06}
          mode={ipadMode}
          folioColor={ipadMode === 'breastfeeding' ? '#9d174d' : '#334155'}
          onClick={onClickTablet}
        />

        {/* ตะกร้าหวายแท้ (Poly Haven GLB) พร้อมผ้าอ้อมผ้าสาลูพับ แพมเพิส และขวดนมวัดสเกล */}
        <RealisticWickerTraySet3D
          position={[0.08, 0.443, -0.26]}
          rotation={[0, 0.24, 0]}
          scale={0.94}
        />

        {/* แก้วเซรามิกสีเขียวเซจมีหูจับ + น้ำชาสมุนไพรอุ่นบนจานรองไม้โอ๊ค */}
        <RealisticCeramicMug3D position={[-0.41, 0.443, -0.15]} rotation={[0, 0.5, 0]} />

        {/* แจกันแก้วจัดช่อดอกไม้สด 3D สมจริง (Poly Haven GLB) */}
        <FlowerVase position={[0.36, 0.415, 0.12]} scale={0.92} />

        {/* ป้ายคลิกแท็บเล็ตบนโต๊ะ (3D WebGL depth-buffered ไม่ลอยทับตัวละคร) */}
        {onClickTablet && (
          <BillboardLabel3D
            position={[-0.08, 0.78, 0]}
            text={tabletLabel}
            bg="#ffffff"
            textColor="#9d174d"
            borderColor="#f472b6"
            width={1.75}
            height={0.34}
            pill={false}
            onClick={onClickTablet}
          />
        )}
      </group>
    </group>
  );
}

/**
 * CozyRoomDecorCorners — ของตกแต่งมุมห้องอบอุ่นสมจริงระดับโมเดล 3D ละเอียด:
 * 1) มุมซ้ายหน้า: พรมสานกลม + ตะกร้าหวายสานแท้ (GLB) มีผ้าห่มพับพาด + ต้นไม้ใบจริง (GLB)
 * 2) มุมซ้ายใน: พรมกลม + ตุ๊กตากระต่ายผ้าขนปุยผูกโบว์ + หนังสือคู่มือเปิดกาง
 * 3) ด้านขวาหลังโซฟา: ตู้ไซด์บอร์ดไม้โอ๊คสแกนดิเนเวียมีบานเปิด/ขาไม้สอบ + โคมไฟเซรามิก + กองหนังสือ + ต้นไม้จริง (GLB)
 */
export function CozyRoomDecorCorners() {
  const { scene: wickerScene } = useGLTF('/models/wicker_basket_01.glb');
  const hamperBasket = useMemo(() => {
    if (!wickerScene) return null;
    const c = wickerScene.clone(true);
    c.traverse((ch) => {
      if (ch.isMesh) {
        ch.castShadow = true;
        ch.receiveShadow = true;
      }
    });
    return c;
  }, [wickerScene]);

  return (
    <group>
      {/* ── 1. มุมซ้ายหน้า: พรมสานกลม + ตะกร้าหวายแท้ใส่ผ้าห่ม + ต้นไม้ใบจริง 3D (ขยับพ้นแนวโปสเตอร์ผนังซ้ายและประตู) ── */}
      <group position={[-6.0, 0, 4.42]}>
        {/* พรมสานกลมสีเบจพร้อมขอบเย็บ */}
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.15, 36]} />
          <meshStandardMaterial color="#d9c3a9" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.03, 1.14, 36]} />
          <meshStandardMaterial color="#c2a88b" roughness={0.95} />
        </mesh>

        {/* ตะกร้าหวายสาน 3D (Poly Haven GLB) + ผ้าห่มนุ่มพับซ้อนด้านใน */}
        <group position={[0.20, 0, -0.15]}>
          {hamperBasket ? (
            <primitive object={hamperBasket} scale={[1.55, 3.6, 1.85]} position={[0, 0, 0]} />
          ) : (
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.24, 0.44, 24]} />
              <meshStandardMaterial color="#b88b5a" roughness={0.85} />
            </mesh>
          )}
          <RoundedBox args={[0.38, 0.16, 0.28]} radius={0.045} position={[0, 0.34, 0]} castShadow>
            <meshStandardMaterial color="#faf3e8" roughness={0.88} />
          </RoundedBox>
          <RoundedBox
            args={[0.22, 0.26, 0.06]}
            radius={0.025}
            position={[0.18, 0.30, 0.08]}
            rotation={[0.15, 0.2, -0.38]}
            castShadow
          >
            <meshStandardMaterial color="#fde8e8" roughness={0.86} />
          </RoundedBox>
        </group>

        {/* กระถางต้นไม้ใบเขียว 3D สมจริง (RealPlant GLB) */}
        <RealPlant type="potted" position={[-0.48, 0, 0.26]} scale={0.95} />
      </group>

      {/* ── 2. มุมซ้ายใน: พรมกลม + ตุ๊กตากระต่ายผ้าผูกโบว์ + หนังสือคู่มือเปิดกาง ── */}
      <group position={[-4.2, 0, -4.8]}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.98, 32]} />
          <meshStandardMaterial color="#e6d5c3" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.86, 0.97, 32]} />
          <meshStandardMaterial color="#cfb9a1" roughness={0.95} />
        </mesh>

        {/* ตุ๊กตากระต่ายน้อย 3D สมจริง */}
        <RealisticPlushToy3D
          kind="bunny"
          position={[0.22, 0.012, 0.08]}
          rotation={[0, 0.42, 0]}
          scale={1.08}
        />

        {/* หนังสือคู่มือเปิดกางวางข้างตุ๊กตากระต่ายบนพรม */}
        <RealisticOpenBook3D
          position={[-0.26, 0.015, 0.14]}
          rotation={[0, -0.35, 0]}
          width={0.38}
          depth={0.26}
          coverColor="#db2777"
        />
      </group>

      {/* ── 3. ด้านขวาหลังโซฟา: ตู้ไซด์บอร์ดไม้โอ๊คสแกนดิเนเวีย + โคมไฟเซรามิก + กองหนังสือ + ต้นไม้จริง ── */}
      <group position={[3.6, 0, -2.2]} rotation={[0, -0.25, 0]}>
        {/* ขาตู้ไม้โอ๊คทรงสอบเฉียง 4 มุม */}
        {[
          [-0.72, -0.20, -0.06, 0.08],
          [0.72, -0.20, -0.06, -0.08],
          [-0.72, 0.20, 0.06, 0.08],
          [0.72, 0.20, 0.06, -0.08],
        ].map(([lx, lz, rx, rz], idx) => (
          <mesh key={idx} position={[lx, 0.11, lz]} rotation={[rx, 0, rz]} castShadow>
            <cylinderGeometry args={[0.028, 0.018, 0.22, 14]} />
            <meshStandardMaterial color="#7f5539" roughness={0.45} />
          </mesh>
        ))}

        {/* โครงตู้ไม้โอ๊คขอบมน */}
        <RoundedBox
          args={[1.64, 0.56, 0.52]}
          radius={0.024}
          smoothness={3}
          position={[0, 0.49, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#a47148" roughness={0.48} />
        </RoundedBox>
        {/* ท็อปไม้โอ๊คแผ่นบนยื่นขอบมน */}
        <RoundedBox
          args={[1.70, 0.036, 0.56]}
          radius={0.014}
          smoothness={3}
          position={[0, 0.78, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#b88458" roughness={0.4} />
        </RoundedBox>

        {/* บานตู้ลูกฟักสีครีมขาวซ้าย-ขวา พร้อมมือจับทองเหลือง */}
        {[-0.41, 0.41].map((dx, idx) => (
          <group key={idx} position={[dx, 0.49, 0.264]}>
            <RoundedBox args={[0.75, 0.47, 0.018]} radius={0.01} smoothness={2} castShadow>
              <meshStandardMaterial color="#faf6f0" roughness={0.35} />
            </RoundedBox>
            <RoundedBox args={[0.65, 0.37, 0.008]} radius={0.006} smoothness={2} position={[0, 0, 0.008]}>
              <meshStandardMaterial color="#f2e9dc" roughness={0.42} />
            </RoundedBox>
            <mesh
              position={[idx === 0 ? 0.28 : -0.28, 0, 0.022]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.014, 0.01, 0.022, 14]} />
              <meshStandardMaterial color="#d4a373" metalness={0.7} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* โคมไฟตั้งโต๊ะฐานเซรามิกทรงแจกัน + โป๊ะผ้าลินินแสงอบอุ่น */}
        <group position={[0.52, 0.798, 0]}>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.08, 0.085, 0.024, 20]} />
            <meshStandardMaterial color="#7f5539" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.12, 0]} scale={[1, 1.25, 1]} castShadow>
            <sphereGeometry args={[0.085, 20, 18]} />
            <meshStandardMaterial color="#ede0d4" roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 12]} />
            <meshStandardMaterial color="#d4a373" metalness={0.75} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.20, 0.23, 24, 1, true]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#f59e0b"
              emissiveIntensity={0.62}
              roughness={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.33, 0]}>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          <pointLight position={[0, 0.36, 0]} color="#ffd8a8" intensity={0.65} distance={5} />
        </group>

        {/* กองหนังสือคู่มือคุณแม่และทารกปกแข็งวางตรงกลางตู้ไซด์บอร์ด */}
        <RealisticBookStack3D
          position={[0.0, 0.798, 0.02]}
          rotation={[0, -0.12, 0]}
          scale={0.86}
        />

        {/* ต้นไม้ฟอกอากาศใบจริง 3D บนตู้ไม้ (RealPlant GLB แทนทรงกลมเขียว) */}
        <RealPlant type="succulent" position={[-0.50, 0.855, 0]} scale={0.58} />
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
  const { screenTex, redrawScreen } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, 1024, 600);
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
      ctx.textBaseline = 'middle';
      fillCenteredText(ctx, badge, 512, 93, 296);

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
      fillCenteredText(ctx, title, 512, 390, 900);

      ctx.fillStyle = '#fbcfe8';
      ctx.font = `700 28px ${THAI_FONT}`;
      fillCenteredText(ctx, subtitle, 512, 455, 900);

      // Bottom pill
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      roundRect2D(ctx, 292, 495, 440, 50, 25);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = `800 24px ${THAI_FONT}`;
      fillCenteredText(ctx, '▶ คลิกที่จอทีวีเพื่อเปิดดูสื่อการสอน', 512, 521, 412);

      tex.needsUpdate = true;
    };

    draw();
    return { screenTex: tex, redrawScreen: draw };
  }, [title, subtitle, badge, accentColor]);

  useEffect(() => {
    const cancelFonts = whenFontsReady(redrawScreen);
    return () => {
      cancelFonts();
      screenTex.dispose();
    };
  }, [screenTex, redrawScreen]);

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

