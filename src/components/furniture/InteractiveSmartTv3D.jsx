import React, { useMemo, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';

const IMAGE_CACHE = new Map();

function loadSlideImage(src) {
  if (!src) return Promise.resolve(null);
  if (IMAGE_CACHE.has(src)) {
    const cached = IMAGE_CACHE.get(src);
    if (cached.complete && cached.naturalWidth > 0) return Promise.resolve(cached);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      IMAGE_CACHE.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

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

/**
 * InteractiveSmartTv3D — จอสมาร์ททีวี 3D แท้ (100% WebGL Depth-Buffered Mesh + Dynamic CanvasTexture)
 *
 * แก้ปัญหา <Html transform> ลอยทับหัวตัวละคร (CSS3D Z-index overlap) อย่างถาวร:
 * - วาดภาพสไลด์ แถบหัวข้อ และปุ่มควบคุมทั้งหมดลงบน WebGL Mesh จริงที่ผ่าน Z-Buffer ของการ์ดจอ
 * - เมื่อตัวละครเดินมายืนหน้าจอทีวี ตัวละครจะบังหน้าจอตามระยะจริง 100% ไม่มีอาการภาพลอยทับศีรษะ
 * - รองรับการคลิกปุ่ม ◀ ก่อนหน้า, ถัดไป ▶, 🔍 ขยายเต็มจอ, ปุ่มเสริม (เช่น ▶ หน้า 8/8 วีดีโอ / 📖 ดูเต็มจอ) และการคลิกกลางจอ
 */
export default function InteractiveSmartTv3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 3.5,
  height = 2.1,
  headerTitle = '📺 สื่อการเรียนรู้บนจอทีวี',
  accentColor = '#38bdf8',
  slide = null,
  slideIndex = 0,
  totalSlides = 1,
  footerText = '',
  zoomLabel = '🔍 ขยายเต็มจอ',
  secondaryLabel = '',
  secondaryActive = false,
  secondaryColor = '#e11d48',
  whiteSlideBg = false,
  onPrev,
  onNext,
  onOpenFullscreen,
  onSecondaryAction,
}) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [loadedImg, setLoadedImg] = useState(null);

  const canPrev = slideIndex > 0;
  const canNext = slideIndex < totalSlides - 1;
  const slideImgSrc = slide && !slide.isVideo ? slide.img : null;

  useEffect(() => {
    let active = true;
    if (!slideImgSrc) {
      setLoadedImg(null);
      return undefined;
    }
    loadSlideImage(slideImgSrc).then((img) => {
      if (active) setLoadedImg(img);
    });
    return () => {
      active = false;
    };
  }, [slideImgSrc]);

  useEffect(() => {
    document.body.style.cursor = hoveredZone ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredZone]);

  const W = 1024;
  const H = 620;

  const { canvas, tex } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return { canvas: c, tex: t };
  }, []);

  const paintScreen = useCallback(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark Slate Screen Background + Accent Inner Border
    ctx.fillStyle = '#090f1d';
    ctx.fillRect(0, 0, W, H);

    drawRoundedRect(ctx, 6, 6, W - 12, H - 12, 18);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = accentColor;
    ctx.stroke();

    // 2. Top Header Bar (y = 14..74)
    ctx.fillStyle = '#111c33';
    drawRoundedRect(ctx, 16, 14, W - 32, 58, 12);
    ctx.fill();

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = accentColor;
    ctx.font = `800 24px ${CANVAS_THAI_FONT}`;
    const maxTitleW = secondaryLabel ? 520 : 700;
    const rawHeader = String(headerTitle || '');
    const measuredHeader = ctx.measureText(rawHeader).width;
    if (measuredHeader > maxTitleW && measuredHeader > 0) {
      ctx.save();
      ctx.translate(30, 43);
      ctx.scale(maxTitleW / measuredHeader, 1);
      ctx.fillText(rawHeader, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(rawHeader, 30, 43);
    }

    // Top-Right Buttons: Zoom Button & Optional Secondary Button
    const secW = secondaryLabel ? 196 : 0;
    const zoomW = 166;
    const secX = W - 26 - secW;
    const zoomX = secondaryLabel ? secX - 12 - zoomW : W - 26 - zoomW;

    // Zoom Pill
    drawRoundedRect(ctx, zoomX, 23, zoomW, 40, 10);
    ctx.fillStyle = hoveredZone === 'zoom' ? '#0ea5e9' : '#0284c7';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 19px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, zoomLabel, zoomX + zoomW / 2, 43, zoomW - 18);

    // Secondary Pill (e.g. ▶ หน้า 8/8 วีดีโอ or 📖 ดูเต็มจอ)
    if (secondaryLabel) {
      drawRoundedRect(ctx, secX, 23, secW, 40, 10);
      ctx.fillStyle = secondaryActive
        ? '#f59e0b'
        : hoveredZone === 'secondary'
        ? '#f43f5e'
        : secondaryColor;
      ctx.fill();
      ctx.fillStyle = secondaryActive ? '#0f172a' : '#ffffff';
      ctx.font = `800 19px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, secondaryLabel, secX + secW / 2, 43, secW - 18);
    }

    // 3. Center Slide Viewport (y = 82..534)
    const vpX = 20;
    const vpY = 82;
    const vpW = W - 40;
    const vpH = 452;

    drawRoundedRect(ctx, vpX, vpY, vpW, vpH, 14);
    ctx.fillStyle = slide?.isVideo ? '#0b1528' : whiteSlideBg ? '#ffffff' : '#0b1120';
    ctx.fill();
    ctx.lineWidth = hoveredZone === 'center' ? 3.5 : 2;
    ctx.strokeStyle = hoveredZone === 'center' ? accentColor : '#334155';
    ctx.stroke();

    if (slide?.isVideo) {
      // Sleek Video Preview Card
      const grad = ctx.createLinearGradient(vpX, vpY, vpX + vpW, vpY + vpH);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#0c2d48');
      grad.addColorStop(1, '#1e1b4b');
      drawRoundedRect(ctx, vpX + 4, vpY + 4, vpW - 8, vpH - 8, 12);
      ctx.fillStyle = grad;
      ctx.fill();

      // Big Play Circle
      const cx = W / 2;
      const cy = vpY + 168;
      ctx.beginPath();
      ctx.arc(cx, cy, 56, 0, Math.PI * 2);
      ctx.fillStyle = hoveredZone === 'center' ? '#f43f5e' : '#e11d48';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Play Triangle
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy - 24);
      ctx.lineTo(cx + 26, cy);
      ctx.lineTo(cx - 16, cy + 24);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `900 30px ${CANVAS_THAI_FONT}`;
      fillCenteredText(
        ctx,
        slide.videoHeading || 'คลิปวีดีโอ: ท่าอุ้มและการดูดนมที่ถูกวิธี',
        cx,
        vpY + 268,
        vpW - 80
      );

      ctx.fillStyle = '#7dd3fc';
      ctx.font = `700 22px ${CANVAS_THAI_FONT}`;
      fillCenteredText(
        ctx,
        'คลิกที่หน้าจอทีวีเพื่อเปิดรับชมวิดีโอเต็มจออย่างชัดเจน',
        cx,
        vpY + 312,
        vpW - 80
      );

      // Bottom educational disclaimer bar inside video card
      drawRoundedRect(ctx, vpX + 16, vpY + vpH - 58, vpW - 32, 44, 10);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = `700 18px ${CANVAS_THAI_FONT}`;
      fillCenteredText(
        ctx,
        '“ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”',
        cx,
        vpY + vpH - 36,
        vpW - 64
      );
    } else if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
      const pad = 12;
      const availW = vpW - pad * 2;
      const availH = vpH - 46;
      const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
      let drawW = availW;
      let drawH = drawW / imgRatio;
      if (drawH > availH) {
        drawH = availH;
        drawW = drawH * imgRatio;
      }
      const dx = vpX + (vpW - drawW) / 2;
      const dy = vpY + 8 + (availH - drawH) / 2;
      ctx.drawImage(loadedImg, dx, dy, drawW, drawH);

      // Bottom Caption Pill
      drawRoundedRect(ctx, vpX + 18, vpY + vpH - 36, vpW - 36, 28, 8);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.font = `700 17px ${CANVAS_THAI_FONT}`;
      fillCenteredText(
        ctx,
        `${slide?.title || ''} (คลิกที่จอเพื่อขยายภาพเต็มจอ)`,
        W / 2,
        vpY + vpH - 22,
        vpW - 64
      );
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = `700 24px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, slide?.title || 'กำลังโหลดภาพสไลด์...', W / 2, vpY + vpH / 2, vpW - 80);
    }

    // 4. Bottom Control Bar (y = 544..604)
    const btnY = 546;
    const btnH = 48;
    const prevX = 22;
    const prevW = 164;
    const nextW = 164;
    const nextX = W - 22 - nextW;

    // Prev Button
    drawRoundedRect(ctx, prevX, btnY, prevW, btnH, 10);
    ctx.fillStyle = !canPrev
      ? '#1e293b'
      : hoveredZone === 'prev'
      ? '#475569'
      : '#334155';
    ctx.fill();
    ctx.fillStyle = !canPrev ? '#64748b' : '#ffffff';
    ctx.font = `800 20px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, '◀ ก่อนหน้า', prevX + prevW / 2, btnY + btnH / 2, prevW - 20);

    // Center Footer Status / Citation
    ctx.fillStyle = slide?.isVideo ? '#fde047' : '#cbd5e1';
    ctx.font = `700 18px ${CANVAS_THAI_FONT}`;
    fillCenteredText(
      ctx,
      footerText || `สไลด์แผ่นที่ ${slideIndex + 1} จาก ${totalSlides}`,
      W / 2,
      btnY + btnH / 2,
      W - prevW - nextW - 80
    );

    // Next Button
    drawRoundedRect(ctx, nextX, btnY, nextW, btnH, 10);
    ctx.fillStyle = !canNext
      ? '#1e293b'
      : hoveredZone === 'next'
      ? '#38bdf8'
      : accentColor;
    ctx.fill();
    ctx.fillStyle = !canNext ? '#64748b' : '#090f1d';
    ctx.font = `900 20px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, 'ถัดไป ▶', nextX + nextW / 2, btnY + btnH / 2, nextW - 20);

    tex.needsUpdate = true;
  }, [
    canvas,
    tex,
    accentColor,
    headerTitle,
    zoomLabel,
    secondaryLabel,
    secondaryActive,
    secondaryColor,
    slide,
    loadedImg,
    whiteSlideBg,
    canPrev,
    canNext,
    footerText,
    slideIndex,
    totalSlides,
    hoveredZone,
  ]);

  useEffect(() => {
    paintScreen();
    const cancelFonts = whenFontsReady(paintScreen);
    return cancelFonts;
  }, [paintScreen]);

  useEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  const screenW = width - 0.14;
  const screenH = height - 0.14;

  // Helper to convert 2D canvas rect (px) into 3D plane local coordinates on the screen surface
  const toScreenRect = (rx, ry, rw, rh) => {
    const cx = ((rx + rw / 2) / W - 0.5) * screenW;
    const cy = (0.5 - (ry + rh / 2) / H) * screenH;
    const sw = (rw / W) * screenW;
    const sh = (rh / H) * screenH;
    return { pos: [cx, cy, 0.039], size: [sw, sh] };
  };

  const secW = secondaryLabel ? 196 : 0;
  const zoomW = 166;
  const secX = W - 26 - secW;
  const zoomX = secondaryLabel ? secX - 12 - zoomW : W - 26 - zoomW;

  const zoomHit = toScreenRect(zoomX, 18, zoomW, 50);
  const secHit = secondaryLabel ? toScreenRect(secX, 18, secW, 50) : null;
  const centerHit = toScreenRect(20, 82, W - 40, 452);
  const prevHit = toScreenRect(22, 542, 168, 56);
  const nextHit = toScreenRect(W - 22 - 168, 542, 168, 56);

  return (
    <group position={position} rotation={rotation}>
      {/* TV Brushed Dark Metallic Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color="#1e293b" metalness={0.58} roughness={0.24} />
      </mesh>

      {/* Main 3D WebGL Screen Plane (Depth-buffered so character head NEVER gets overlapped!) */}
      <mesh position={[0, 0, 0.033]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>

      {/* 3D Interactive Hit-Zones on Screen Surface */}
      {/* 1. Main Slide / Video Viewport */}
      <mesh
        position={centerHit.pos}
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenFullscreen) onOpenFullscreen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredZone('center');
        }}
        onPointerOut={() => setHoveredZone((z) => (z === 'center' ? null : z))}
      >
        <planeGeometry args={centerHit.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 2. Top-Right Zoom Fullscreen Button */}
      <mesh
        position={zoomHit.pos}
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenFullscreen) onOpenFullscreen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredZone('zoom');
        }}
        onPointerOut={() => setHoveredZone((z) => (z === 'zoom' ? null : z))}
      >
        <planeGeometry args={zoomHit.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 3. Optional Secondary Top-Right Button */}
      {secHit && onSecondaryAction && (
        <mesh
          position={secHit.pos}
          onClick={(e) => {
            e.stopPropagation();
            onSecondaryAction();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredZone('secondary');
          }}
          onPointerOut={() => setHoveredZone((z) => (z === 'secondary' ? null : z))}
        >
          <planeGeometry args={secHit.size} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* 4. Bottom-Left Prev Slide Button */}
      <mesh
        position={prevHit.pos}
        onClick={(e) => {
          e.stopPropagation();
          if (canPrev && onPrev) onPrev();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (canPrev) setHoveredZone('prev');
        }}
        onPointerOut={() => setHoveredZone((z) => (z === 'prev' ? null : z))}
      >
        <planeGeometry args={prevHit.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 5. Bottom-Right Next Slide Button */}
      <mesh
        position={nextHit.pos}
        onClick={(e) => {
          e.stopPropagation();
          if (canNext && onNext) onNext();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (canNext) setHoveredZone('next');
        }}
        onPointerOut={() => setHoveredZone((z) => (z === 'next' ? null : z))}
      >
        <planeGeometry args={nextHit.size} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
