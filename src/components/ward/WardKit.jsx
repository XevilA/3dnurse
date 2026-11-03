import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import BillboardLabel3D from '../ui/BillboardLabel3D';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';
import FlowerVase from '../decorations/FlowerVase';
import { RealisticTableFood } from './RealisticTableFood';
import {
  RealisticThrowPillow3D,
  RealisticWickerTraySet3D,
  RealisticOpenBook3D,
  RealisticBookStack3D,
  RealisticMedicalBottle3D,
} from '../furniture/RealisticProps3D';

/**
 * WardKit — ชิ้นส่วน 3D ที่ใช้ร่วมกันใน Ward 101 / Ward 102
 *  - WallBoard / TitleSign : ป้ายข้อความบนผนัง (วาดด้วย canvas ให้ตัวอักษรคมชัด อ่านง่าย จัดกึ่งกลางแม่นยำบน Safari/iPad)
 *  - WallScreen            : จอสไลด์ Zone ติดผนัง (คลิกเพื่อขยายอ่าน)
 *  - ProjectorScreenBoard  : จอโปรเจกเตอร์กิจกรรม 3D พอดีกรอบ 100% ทุกอุปกรณ์ (คลิกเปิดกระดานกิจกรรมเต็มจอ)
 *  - WindowWithCurtains    : หน้าต่างกระจกใสบานใหญ่ มองเห็นวิวสวนภายนอก พร้อมผ้าม่าน
 *  - DiningTable           : โต๊ะอาหารกลมสำหรับกิจกรรมเลือกเมนู (เก้าอี้หันเข้าโต๊ะทุกตัว)
 *  - CareBooth             : บูทดูแลแผลฝีเย็บ (Ward 102)
 *  - LoungeCorner          : โซฟา โต๊ะกลาง พรม ชั้นหนังสือ
 */

const FONT = CANVAS_THAI_FONT;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** ตัดบรรทัดสำหรับภาษาไทย รองรับ '\n' และตัดตามขอบเขตคำภาษาไทย (Intl.Segmenter) ไม่ให้ฉีกพยางค์กลางคำ */
const THAI_WORD_SEGMENTER =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('th', { granularity: 'word' })
    : null;

function segmentThaiTokens(str) {
  if (!THAI_WORD_SEGMENTER) return Array.from(str);
  return Array.from(THAI_WORD_SEGMENTER.segment(str), (s) => s.segment);
}

function wrapLines(ctx, text, maxWidth) {
  const paragraphs = String(text || '').split('\n');
  const lines = [];
  paragraphs.forEach((para) => {
    const tokens = segmentThaiTokens(para);
    let cur = '';
    const pushChars = (token) => {
      for (const ch of token) {
        if (ctx.measureText(cur + ch).width > maxWidth && cur) {
          lines.push(cur.trimEnd());
          cur = ch;
        } else {
          cur += ch;
        }
      }
    };
    tokens.forEach((tok) => {
      if (!cur && /^\s+$/.test(tok)) return;
      const trial = cur + tok;
      if (ctx.measureText(trial).width <= maxWidth) {
        cur = trial;
      } else if (ctx.measureText(tok.trimStart()).width <= maxWidth) {
        if (cur.trimEnd()) lines.push(cur.trimEnd());
        cur = tok.trimStart();
      } else {
        if (cur.trimEnd()) {
          lines.push(cur.trimEnd());
          cur = '';
        }
        pushChars(tok.trimStart());
      }
    });
    if (cur.trimEnd()) lines.push(cur.trimEnd());
  });
  return lines;
}

function useBoardTexture(draw, w, h, deps) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    draw(ctx, w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
    t.__redraw = () => {
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h);
      t.needsUpdate = true;
    };
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cancel = whenFontsReady(() => {
      if (tex && tex.__redraw) tex.__redraw();
    });
    return () => {
      cancel();
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

/** ป้ายรายการ (หัวข้อ + รายการพร้อมไอคอน จัดเนื้อหาอยู่กึ่งกลางสมดุลทุกบรรทัด) */
export function WallBoard({ position, rotation = [0, 0, 0], width = 3, height = 3, title, items = [], accent = '#ec407a', numbered = false }) {
  const W = 900;
  const H = Math.round((W * height) / width);
  const itemsSig = items.map((it) => `${it.icon || ''}:${it.text || ''}`).join('|');
  const tex = useBoardTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#ffeaf2'); g.addColorStop(1, '#ffd6e5');
    ctx.fillStyle = g;
    roundRect(ctx, 0, 0, w, h, 54); ctx.fill();
    ctx.lineWidth = 14; ctx.strokeStyle = '#f6a5c3';
    roundRect(ctx, 7, 7, w - 14, h - 14, 50); ctx.stroke();

    ctx.fillStyle = '#8e1450'; ctx.textBaseline = 'middle';
    let fs = 70;
    ctx.font = `800 ${fs}px ${FONT}`;
    let tl = wrapLines(ctx, title, w - 100);
    while (tl.length > 2 && fs > 44) { fs -= 4; ctx.font = `800 ${fs}px ${FONT}`; tl = wrapLines(ctx, title, w - 100); }
    const titleH = tl.length * fs * 1.2 + 30;
    tl.forEach((ln, i) => fillCenteredText(ctx, ln, w / 2, 50 + fs * 0.65 + i * fs * 1.2, w - 100));

    const top = 50 + titleH;
    const gap = 18;
    const rowH = Math.min(150, (h - top - 50 - gap * (items.length - 1)) / Math.max(1, items.length));
    items.forEach((it, i) => {
      const y = top + i * (rowH + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      roundRect(ctx, 40, y, w - 80, rowH, 32); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(244,143,177,0.8)'; ctx.stroke();
      // ไอคอนวงกลมด้านซ้าย
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(40 + rowH / 2, y + rowH / 2, rowH * 0.36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${Math.round(rowH * 0.42)}px ${FONT}`;
      fillCenteredText(ctx, numbered ? String(i + 1) : it.icon, 40 + rowH / 2, y + rowH / 2 + 2);
      // ข้อความจัดกึ่งกลางในพื้นที่การ์ดสีขาวอย่างสมดุล
      ctx.fillStyle = '#3b1230';
      let tfs = Math.min(56, rowH * 0.42);
      ctx.font = `700 ${tfs}px ${FONT}`;
      const textLeft = 40 + rowH + 10;
      const textRight = w - 54;
      const maxW = textRight - textLeft;
      const textCenterX = (textLeft + textRight) / 2;
      if (!String(it.text || '').includes('\n') && ctx.measureText(it.text).width > maxW && ctx.measureText(it.text).width <= maxW * 1.18) {
        while (ctx.measureText(it.text).width > maxW && tfs > 40) {
          tfs -= 2;
          ctx.font = `700 ${tfs}px ${FONT}`;
        }
      }
      let lines = wrapLines(ctx, it.text, maxW);
      while (lines.length > 2 && tfs > 30) { tfs -= 3; ctx.font = `700 ${tfs}px ${FONT}`; lines = wrapLines(ctx, it.text, maxW); }
      const lh = tfs * 1.18;
      const startY = y + rowH / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln, li) => fillCenteredText(ctx, ln, textCenterX, startY + li * lh, maxW));
    });
  }, W, H, [title, itemsSig, accent, numbered, width, height]);

  const openLightbox = useStore((s) => s.openLightbox);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hover]);

  const handleOpenBoard = (e) => {
    if (e.delta > 10) return;
    e.stopPropagation();
    const dataUrl = tex?.image?.toDataURL ? tex.image.toDataURL('image/png') : '';
    openLightbox({
      src: dataUrl,
      title: title || 'บอร์ดความรู้ติดผนัง',
      badge: '🔍 ภาพขยายบอร์ดความรู้',
      hideDetails: true,
    });
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleOpenBoard}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.04]} />
        <meshStandardMaterial color={hover ? '#ec407a' : '#f6a5c3'} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** ป้ายชื่อห้องขนาดใหญ่ (Ward 101 / ดูแลร่างกายและฟื้นตัว) */
export function TitleSign({ position, rotation = [0, 0, 0], width = 4.6, height = 2.1, line1, line2, heartColor = '#e53935' }) {
  const W = 1000;
  const H = Math.round((W * height) / width);
  const tex = useBoardTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#fff3f8'); g.addColorStop(1, '#ffd9e8');
    ctx.fillStyle = g; roundRect(ctx, 0, 0, w, h, h * 0.4); ctx.fill();
    ctx.lineWidth = 16; ctx.strokeStyle = '#f6a5c3'; roundRect(ctx, 8, 8, w - 16, h - 16, h * 0.38); ctx.stroke();
    // หัวใจ + ชีพจร
    ctx.fillStyle = heartColor;
    const hx = h * 0.42; const hy = h * 0.5; const s = h * 0.2;
    ctx.beginPath();
    ctx.moveTo(hx, hy + s * 0.9);
    ctx.bezierCurveTo(hx - s * 1.6, hy - s * 0.2, hx - s * 0.9, hy - s * 1.4, hx, hy - s * 0.5);
    ctx.bezierCurveTo(hx + s * 0.9, hy - s * 1.4, hx + s * 1.6, hy - s * 0.2, hx, hy + s * 0.9);
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - s * 1.0, hy + s * 0.05); ctx.lineTo(hx - s * 0.4, hy + s * 0.05); ctx.lineTo(hx - s * 0.15, hy - s * 0.5);
    ctx.lineTo(hx + s * 0.2, hy + s * 0.6); ctx.lineTo(hx + s * 0.45, hy + s * 0.05); ctx.lineTo(hx + s * 1.0, hy + s * 0.05);
    ctx.stroke();
    // ข้อความจัดกึ่งกลางในพื้นที่ด้านขวาของไอคอนหัวใจ
    ctx.textBaseline = 'middle';
    const textLeft = h * 0.76;
    const textRight = w - 40;
    const maxTextW = textRight - textLeft;
    const textCenterX = (textLeft + textRight) / 2;

    ctx.fillStyle = '#1a2a6c';
    let fs1 = Math.round(h * 0.34);
    ctx.font = `900 ${fs1}px ${FONT}`;
    while (ctx.measureText(line1).width > maxTextW && fs1 > 36) { fs1 -= 2; ctx.font = `900 ${fs1}px ${FONT}`; }
    fillCenteredText(ctx, line1, textCenterX, h * 0.36, maxTextW);

    let fs = Math.round(h * 0.22);
    ctx.font = `800 ${fs}px ${FONT}`;
    while (ctx.measureText(line2).width > maxTextW && fs > 20) { fs -= 2; ctx.font = `800 ${fs}px ${FONT}`; }
    ctx.fillStyle = '#243b8c';
    fillCenteredText(ctx, line2, textCenterX, h * 0.72, maxTextW);
  }, W, H, [line1, line2, heartColor, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.04]} />
        <meshStandardMaterial color="#f6a5c3" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

/** จอสไลด์ติดผนัง — คลิกเพื่อเปิดสไลด์ขยาย */
export function WallScreen({ position, rotation = [0, 0, 0], width = 6.6, src, room, label, hideButton = false }) {
  const tex = useTexture(src);
  useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.needsUpdate = true; }, [tex]);
  const height = width * (tex.image ? tex.image.height / tex.image.width : 2 / 3);
  const openWardModal = useStore((s) => s.openWardModal);
  const seen = useStore((s) => (s.wardFlow[room] || {}).slide);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : 'auto'; return () => { document.body.style.cursor = 'auto'; }; }, [hover]);
  const open = (e) => { e.stopPropagation(); openWardModal('slide', room); };

  const btnLabel = seen ? '📖 ดูสไลด์อีกครั้ง' : `📖 ${label || 'อ่านเนื้อหาก่อนเริ่มกิจกรรม'} (คลิกเพื่อขยาย)`;
  const btnTex = useBoardTexture((ctx, w, h) => {
    ctx.fillStyle = seen ? '#2e7d32' : '#e91e63';
    roundRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    roundRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.font = `800 36px ${FONT}`;
    fillCenteredText(ctx, btnLabel, w / 2, h / 2 + 1, w - 44);
  }, 760, 88, [btnLabel, seen]);

  return (
    <group position={position} rotation={rotation}>
      {/* กรอบจอ ติดผนัง */}
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[width + 0.28, height + 0.28, 0.12]} />
        <meshStandardMaterial color={hover ? '#ec407a' : '#8d5a3a'} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.008]} onClick={open} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {!hideButton && (
        <mesh
          position={[0, -height / 2 - 0.34, 0.015]}
          onClick={open}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <planeGeometry args={[Math.min(width, 3.2), 0.38]} />
          <meshBasicMaterial map={btnTex} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/**
 * จอโปรเจกเตอร์กิจกรรม 3D พอดีกรอบ 100% ทุกอุปกรณ์ (iPad / iPhone / Desktop)
 * แก้ปัญหา CSS3D <Html transform> เลื่อนหรือล้นกรอบบน Safari โดยวาดลง WebGL CanvasTexture ขนาดพอดีกับกรอบจอ 1:1
 */
export function ProjectorScreenBoard({
  position = [-0.65, 3.05, -8.76],
  rotation = [0, 0, 0],
  badge = '🏥 Ward 101 • Zone 1',
  title = 'กระดานกิจกรรมเรียนรู้ประจำห้อง',
  subtitle = 'คลิกที่จอโปรเจกเตอร์เพื่อเปิดทำกิจกรรมโต้ตอบครบทั้ง 4 หัวข้อและแบบประเมิน',
  activities = [],
  quizDone = false,
  onOpen,
  hideButton = false,
}) {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hover]);

  const actSig = activities.map((a) => `${a.icon || ''}:${a.title || ''}:${a.desc || ''}:${a.done ? 1 : 0}`).join('|');

  const tex = useBoardTexture((ctx, w, h) => {
    // พื้นหลังจอโปรเจกเตอร์ขาวอมชมพูอ่อน พอดีขอบ 100%
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#fffdfd');
    bg.addColorStop(1, '#fff5f8');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // กรอบด้านในของสไลด์โปรเจกเตอร์
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 8;
    roundRect(ctx, 16, 16, w - 32, h - 32, 26);
    ctx.stroke();

    // แถบหัวข้อด้านบน
    const hdr = ctx.createLinearGradient(28, 28, w - 28, 210);
    hdr.addColorStop(0, '#fdf2f8');
    hdr.addColorStop(1, '#fce7f3');
    ctx.fillStyle = hdr;
    roundRect(ctx, 32, 30, w - 64, 184, 22);
    ctx.fill();
    ctx.strokeStyle = '#f9a8d4';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textBaseline = 'middle';
    // Badge pill
    ctx.fillStyle = '#db2777';
    roundRect(ctx, w / 2 - 190, 46, 380, 44, 22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 24px ${FONT}`;
    fillCenteredText(ctx, badge, w / 2, 68, 350);

    // Title
    ctx.fillStyle = '#831843';
    ctx.font = `900 44px ${FONT}`;
    fillCenteredText(ctx, title, w / 2, 130, w - 120);

    // Subtitle
    ctx.fillStyle = '#9d174d';
    ctx.font = `700 24px ${FONT}`;
    fillCenteredText(ctx, subtitle, w / 2, 180, w - 120);

    // ตารางการ์ดกิจกรรม 2x2
    const gridTop = 236;
    const gridLeft = 40;
    const gapX = 24;
    const gapY = 22;
    const cardW = (w - gridLeft * 2 - gapX) / 2;
    const cardH = 272;

    activities.slice(0, 4).forEach((act, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = gridLeft + col * (cardW + gapX);
      const cy = gridTop + row * (cardH + gapY);

      ctx.fillStyle = act.done ? '#f0fdf4' : '#ffffff';
      roundRect(ctx, cx, cy, cardW, cardH, 22);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = act.done ? '#4ade80' : '#f9a8d4';
      ctx.stroke();

      // แถบสถานะมุมขวาบน
      const pillW = 136;
      ctx.fillStyle = act.done ? '#16a34a' : '#fce7f3';
      roundRect(ctx, cx + cardW - pillW - 18, cy + 16, pillW, 36, 18);
      ctx.fill();
      ctx.fillStyle = act.done ? '#ffffff' : '#be185d';
      ctx.font = `800 20px ${FONT}`;
      fillCenteredText(ctx, act.done ? '✓ สำเร็จแล้ว' : `กิจกรรมที่ ${idx + 1}`, cx + cardW - pillW / 2 - 18, cy + 34, pillW - 16);

      // ไอคอนวงกลมตรงกลางบน
      ctx.fillStyle = act.done ? '#dcfce7' : '#fdf2f8';
      ctx.beginPath();
      ctx.arc(cx + 58, cy + 56, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `40px ${FONT}`;
      ctx.fillStyle = '#1e293b';
      fillCenteredText(ctx, act.icon || '✨', cx + 58, cy + 58);

      // ชื่อกิจกรรม (จัดกึ่งกลางการ์ด)
      ctx.fillStyle = '#1e293b';
      ctx.font = `900 32px ${FONT}`;
      fillCenteredText(ctx, act.title, cx + cardW / 2, cy + 132, cardW - 44);

      // คำอธิบายสั้น (จัดกึ่งกลางการ์ด)
      ctx.fillStyle = '#475569';
      ctx.font = `700 23px ${FONT}`;
      const descLines = wrapLines(ctx, act.desc || '', cardW - 48).slice(0, 2);
      descLines.forEach((ln, li) => {
        fillCenteredText(ctx, ln, cx + cardW / 2, cy + 186 + li * 32, cardW - 48);
      });
    });

    // แถบปุ่มกดเปิดทำกิจกรรมด้านล่างสุด
    const ctaY = 826;
    const ctaGrad = ctx.createLinearGradient(40, ctaY, w - 40, ctaY + 104);
    ctaGrad.addColorStop(0, quizDone ? '#15803d' : '#be185d');
    ctaGrad.addColorStop(1, quizDone ? '#16a34a' : '#ec4899');
    ctx.fillStyle = ctaGrad;
    roundRect(ctx, 40, ctaY, w - 80, 102, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 32px ${FONT}`;
    fillCenteredText(
      ctx,
      quizDone
        ? '🎉 ทำแบบประเมินประจำห้องสำเร็จแล้ว — คลิกเพื่อทบทวนกิจกรรมหรือทำซ้ำ'
        : '🎯 คลิกที่จอโปรเจกเตอร์เพื่อเปิดทำ 4 กิจกรรมโต้ตอบ & แบบประเมินท้ายบท',
      w / 2,
      ctaY + 51,
      w - 130
    );
  }, 1200, 968, [badge, title, subtitle, actSig, quizDone]);

  const handleOpen = (e) => {
    if (e && e.delta > 10) return;
    if (e) e.stopPropagation();
    if (onOpen) onOpen();
  };

  const projBtnLabel = quizDone
    ? '✅ เปิดทบทวนกระดานกิจกรรม (4 กิจกรรม + Quiz)'
    : '🎯 เปิดกระดานกิจกรรมโปรเจกเตอร์ (คลิกเพื่อทำ 4 กิจกรรม)';
  const projBtnTex = useBoardTexture((ctx, w, h) => {
    ctx.fillStyle = quizDone ? '#15803d' : '#e91e63';
    roundRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    roundRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.font = `800 34px ${FONT}`;
    fillCenteredText(ctx, projBtnLabel, w / 2, h / 2 + 1, w - 44);
  }, 940, 88, [projBtnLabel, quizDone]);

  return (
    <group position={position} rotation={rotation}>
      {/* กล่องม้วนจอโปรเจกเตอร์ด้านบน */}
      <mesh position={[0, 1.92, 0.04]} castShadow>
        <boxGeometry args={[4.75, 0.14, 0.14]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* กรอบไม้จอโปรเจกเตอร์ */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[4.56, 3.72, 0.05]} />
        <meshStandardMaterial color={hover ? '#ec407a' : '#8d5a3a'} roughness={0.45} />
      </mesh>
      {/* ผืนผ้าใบโปรเจกเตอร์ พอดีกรอบ 4.36 x 3.52 (100% ทุกมุมมองและทุกอุปกรณ์) */}
      <mesh
        position={[0, 0, 0.012]}
        onClick={handleOpen}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <planeGeometry args={[4.36, 3.52]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>

      {!hideButton && (
        <mesh
          position={[0, -2.14, 0.015]}
          onClick={handleOpen}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <planeGeometry args={[3.95, 0.37]} />
          <meshBasicMaterial map={projBtnTex} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/**
 * หน้าต่างกระจกใสบานใหญ่ มองเห็นวิวสวนธรรมชาติภายนอก + แสงสะท้อนกระจกจริง + ผ้าม่านสองข้าง
 * รองรับ prop `viewSrc` หากต้องการเปลี่ยนรูปวิวภายนอกจากไฟล์ภาพโดยตรงในอนาคต
 */
function WindowCustomViewPane({ width, height, src }) {
  const tex = useTexture(src);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);
  return (
    <mesh position={[0, 0, 0.008]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

export function WindowWithCurtains({
  position,
  rotation = [0, 0, 0],
  width = 4.2,
  height = 3.2,
  withCurtains = true,
  viewSrc = null,
  frameColor = '#c69c6d',
  curtainColors = ['#f5ebe0', '#e6ccb2'],
  timeOfDay = 'day',
  slightlyOpen = false,
}) {
  const outdoorView = useBoardTexture((ctx, w, h) => {
    if (timeOfDay === 'evening') {
      // ท้องฟ้ายามพลบค่ำ-ค่ำคืนอันเงียบสงบ น่านอนพักผ่อน (Nursery 204 Safe Sleep)
      const nightGrad = ctx.createLinearGradient(0, 0, 0, h * 0.76);
      nightGrad.addColorStop(0, '#0f1e36');
      nightGrad.addColorStop(0.55, '#1d3557');
      nightGrad.addColorStop(1, '#3b5b7c');
      ctx.fillStyle = nightGrad;
      ctx.fillRect(0, 0, w, h);

      // ดวงดาวระยิบระยับนุ่มนวล
      ctx.fillStyle = 'rgba(255,253,235,0.85)';
      [
        [0.14, 0.16, 2.4], [0.28, 0.11, 1.8], [0.42, 0.20, 2.2],
        [0.55, 0.12, 2.6], [0.68, 0.24, 1.9], [0.22, 0.29, 1.7],
        [0.48, 0.31, 1.8], [0.88, 0.28, 2.1],
      ].forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.arc(sx * w, sy * h, sr, 0, Math.PI * 2);
        ctx.fill();
      });

      // แสงรัศมีดวงจันทร์ + ดวงจันทร์เสี้ยวสีครีมอุ่น
      const moonGlow = ctx.createRadialGradient(w * 0.77, h * 0.21, 8, w * 0.77, h * 0.21, w * 0.18);
      moonGlow.addColorStop(0, 'rgba(254,243,199,0.55)');
      moonGlow.addColorStop(1, 'rgba(254,243,199,0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(w * 0.77, h * 0.21, h * 0.085, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#142744';
      ctx.beginPath();
      ctx.arc(w * 0.745, h * 0.195, h * 0.072, 0, Math.PI * 2);
      ctx.fill();

      // เนินสวนและทิวต้นไม้ยามค่ำคืน + ไฟทางเดินสวนสีส้มอบอุ่น
      ctx.fillStyle = '#183642';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.68);
      ctx.quadraticCurveTo(w * 0.30, h * 0.56, w * 0.62, h * 0.67);
      ctx.quadraticCurveTo(w * 0.84, h * 0.59, w, h * 0.66);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      const nightLawn = ctx.createLinearGradient(0, h * 0.68, 0, h);
      nightLawn.addColorStop(0, '#1b4332');
      nightLawn.addColorStop(1, '#102a20');
      ctx.fillStyle = nightLawn;
      ctx.fillRect(0, h * 0.68, w, h * 0.32);

      for (let i = 0; i < 11; i++) {
        const tx = (i / 10) * w;
        const ty = h * (0.69 + 0.035 * Math.sin(i * 1.8));
        ctx.fillStyle = i % 2 === 0 ? '#1f4e3d' : '#2d6a4f';
        ctx.beginPath();
        ctx.arc(tx, ty, h * 0.125, 0, Math.PI * 2);
        ctx.fill();
      }
      // โคมไฟสวนแสงอุ่นเบา ๆ
      [0.24, 0.54, 0.82].forEach((lx) => {
        const lg = ctx.createRadialGradient(w * lx, h * 0.82, 2, w * lx, h * 0.82, h * 0.08);
        lg.addColorStop(0, 'rgba(253,230,138,0.85)');
        lg.addColorStop(1, 'rgba(253,230,138,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(w * lx, h * 0.82, h * 0.08, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // ท้องฟ้าสดใสไล่เฉดสมจริงหลังกระจกใส
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.72);
      skyGrad.addColorStop(0, '#3b9ae8');
      skyGrad.addColorStop(0.50, '#8dd1fa');
      skyGrad.addColorStop(1, '#e3f5ff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // แสงอาทิตย์นุ่มนวลมุมบนขวา
      const sunGrad = ctx.createRadialGradient(w * 0.82, h * 0.16, 10, w * 0.82, h * 0.16, w * 0.30);
      sunGrad.addColorStop(0, 'rgba(255,253,232,0.95)');
      sunGrad.addColorStop(0.4, 'rgba(255,248,205,0.38)');
      sunGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      // ก้อนเมฆนุ่มหลายชั้น
      ctx.fillStyle = 'rgba(255,255,255,0.90)';
      [
        [0.18, 0.19, 0.10], [0.25, 0.17, 0.08], [0.13, 0.21, 0.07],
        [0.56, 0.24, 0.11], [0.64, 0.22, 0.08], [0.49, 0.25, 0.07],
      ].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.ellipse(x * w, y * h, r * w, r * w * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // เนินเขาสีเขียวอมฟ้าไกล ๆ
      ctx.fillStyle = '#9ad0c3';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.66);
      ctx.quadraticCurveTo(w * 0.25, h * 0.52, w * 0.55, h * 0.64);
      ctx.quadraticCurveTo(w * 0.80, h * 0.54, w, h * 0.63);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // สนามหญ้าสวนบำบัดโรงพยาบาล
      const lawnGrad = ctx.createLinearGradient(0, h * 0.62, 0, h);
      lawnGrad.addColorStop(0, '#86cf6e');
      lawnGrad.addColorStop(1, '#469e47');
      ctx.fillStyle = lawnGrad;
      ctx.fillRect(0, h * 0.64, w, h * 0.36);

      // ทางเดินหินในสวน
      ctx.fillStyle = '#efe7da';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h);
      ctx.quadraticCurveTo(w * 0.48, h * 0.80, w * 0.56, h * 0.66);
      ctx.lineTo(w * 0.63, h * 0.66);
      ctx.quadraticCurveTo(w * 0.57, h * 0.82, w * 0.56, h);
      ctx.closePath();
      ctx.fill();

      // แนวต้นไม้ร่มรื่น + ดอกไม้ชมพู-ขาวในสวน
      for (let i = 0; i < 13; i++) {
        const tx = (i / 12) * w;
        const ty = h * (0.64 + 0.04 * Math.sin(i * 1.9));
        ctx.fillStyle = i % 2 === 0 ? '#3b8e3e' : '#53b04f';
        ctx.beginPath();
        ctx.arc(tx, ty, h * 0.13, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 11; i++) {
        const bx = (i / 10) * w + 18;
        const by = h * 0.88;
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(bx, by, h * 0.10, 0, Math.PI * 2);
        ctx.fill();
        if (i % 2 === 0) {
          ctx.fillStyle = '#f9a8d4';
          ctx.beginPath();
          ctx.arc(bx - 10, by - 14, h * 0.025, 0, Math.PI * 2);
          ctx.arc(bx + 12, by - 8, h * 0.022, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // เงาความลึกขอบวงกบหน้าต่างด้านบน (ทำให้วิวดูลึกออกไปนอกกระจกจริง)
    const topDepth = ctx.createLinearGradient(0, 0, 0, h * 0.09);
    topDepth.addColorStop(0, 'rgba(15, 23, 42, 0.26)');
    topDepth.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = topDepth;
    ctx.fillRect(0, 0, w, h * 0.09);

    // เส้นแสงสะท้อนเฉียงคมชัดบนบานกระจกใส (เมื่อไม่ได้แง้มบานเลื่อนแยกแผ่น)
    if (!slightlyOpen) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.moveTo(w * 0.11, 0);
      ctx.lineTo(w * 0.21, 0);
      ctx.lineTo(w * 0.04, h);
      ctx.lineTo(-w * 0.06, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.42)';
      ctx.beginPath();
      ctx.moveTo(w * 0.225, 0);
      ctx.lineTo(w * 0.245, 0);
      ctx.lineTo(w * 0.075, h);
      ctx.lineTo(w * 0.055, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.20)';
      ctx.beginPath();
      ctx.moveTo(w * 0.62, 0);
      ctx.lineTo(w * 0.70, 0);
      ctx.lineTo(w * 0.52, h);
      ctx.lineTo(w * 0.44, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.beginPath();
      ctx.moveTo(w * 0.715, 0);
      ctx.lineTo(w * 0.732, 0);
      ctx.lineTo(w * 0.552, h);
      ctx.lineTo(w * 0.535, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }, 1024, 720, [timeOfDay, slightlyOpen]);

  const folds = 6;
  const frameT = 0.11;
  const sashT = 0.042;
  const mullionCols = width >= 5.6 ? [-width / 4, 0, width / 4] : [0];
  const leftSashW = width * 0.51;
  const rightSashW = width * 0.49;
  const openGap = Math.min(0.42, width * 0.14);

  return (
    <group position={position} rotation={rotation}>
      {/* วิวสวนภายนอกหลังกระจกใส */}
      {viewSrc ? (
        <WindowCustomViewPane width={width} height={height} src={viewSrc} />
      ) : (
        <mesh position={[0, 0, 0.010]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={outdoorView} toneMapped={false} />
        </mesh>
      )}

      {slightlyOpen ? (
        <>
          {/* บานเลื่อนกระจกฝั่งซ้าย (บานตายติดรางใน) */}
          <group position={[-width / 2 + leftSashW / 2, 0, 0.025]}>
            <mesh>
              <planeGeometry args={[leftSashW - sashT, height - sashT]} />
              <meshStandardMaterial
                color="#bae6fd"
                transparent
                opacity={0.24}
                roughness={0.04}
                metalness={0.38}
              />
            </mesh>
            <mesh position={[-0.08, 0, 0.003]} rotation={[0, 0, -0.32]}>
              <planeGeometry args={[0.16, height * 0.82]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
            </mesh>
            <mesh position={[0, height / 2 - sashT / 2, 0.004]}>
              <boxGeometry args={[leftSashW, sashT, 0.026]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[0, -height / 2 + sashT / 2, 0.004]}>
              <boxGeometry args={[leftSashW, sashT, 0.026]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[-leftSashW / 2 + sashT / 2, 0, 0.004]}>
              <boxGeometry args={[sashT, height, 0.026]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[leftSashW / 2 - sashT / 2, 0, 0.004]}>
              <boxGeometry args={[sashT, height, 0.026]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
          </group>

          {/* บานเลื่อนกระจกฝั่งขวา (เลื่อนเปิดแง้มมาทางซ้าย ระบายอากาศถ่ายเท) */}
          <group position={[width / 2 - rightSashW / 2 - openGap, 0, 0.048]}>
            <mesh>
              <planeGeometry args={[rightSashW - sashT, height - sashT]} />
              <meshStandardMaterial
                color="#bae6fd"
                transparent
                opacity={0.28}
                roughness={0.04}
                metalness={0.38}
              />
            </mesh>
            <mesh position={[0.04, 0, 0.003]} rotation={[0, 0, -0.32]}>
              <planeGeometry args={[0.16, height * 0.82]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
            </mesh>
            <mesh position={[0, height / 2 - sashT / 2, 0.004]}>
              <boxGeometry args={[rightSashW, sashT, 0.028]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[0, -height / 2 + sashT / 2, 0.004]}>
              <boxGeometry args={[rightSashW, sashT, 0.028]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[-rightSashW / 2 + sashT / 2, 0, 0.004]}>
              <boxGeometry args={[sashT, height, 0.028]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            <mesh position={[rightSashW / 2 - sashT / 2, 0, 0.004]}>
              <boxGeometry args={[sashT, height, 0.028]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.25} />
            </mesh>
            {/* มือจับบานเลื่อนโครเมียม */}
            <mesh position={[rightSashW / 2 - sashT * 0.55, -0.05, 0.022]}>
              <boxGeometry args={[0.022, 0.16, 0.022]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.18} />
            </mesh>
          </group>
        </>
      ) : (
        <>
          {/* แผ่นกระจกใสสะท้อนแสง (Architectural Clear Tinted Glass Pane) */}
          <mesh position={[0, 0, 0.024]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.22}
              roughness={0.04}
              metalness={0.35}
            />
          </mesh>

          {/* กรอบบานกระจกชั้นในสีขาว (Inner White UPVC/Aluminum Glass Sash Trim) */}
          <mesh position={[0, height / 2 - sashT / 2, 0.032]}>
            <boxGeometry args={[width, sashT, 0.028]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          <mesh position={[0, -height / 2 + sashT / 2, 0.032]}>
            <boxGeometry args={[width, sashT, 0.028]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          <mesh position={[-width / 2 + sashT / 2, 0, 0.032]}>
            <boxGeometry args={[sashT, height, 0.028]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          <mesh position={[width / 2 - sashT / 2, 0, 0.032]}>
            <boxGeometry args={[sashT, height, 0.028]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>

          {/* ซี่ลูกฟักบานกระจกสีขาวสะอาดตา + มือจับล็อกบานกระจกโครเมียม */}
          {mullionCols.map((mx, idx) => (
            <group key={`v_mul_${idx}`} position={[mx, 0, 0.036]}>
              <mesh>
                <boxGeometry args={[0.052, height, 0.036]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.25} />
              </mesh>
              <mesh position={[0.018, -0.08, 0.024]}>
                <boxGeometry args={[0.022, 0.13, 0.022]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.18} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, height * 0.18, 0.035]}>
            <boxGeometry args={[width, 0.046, 0.034]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
        </>
      )}

      {/* วงกบหน้าต่างชั้นนอก 4 ด้านแบบโปร่งกลาง (ไม่ทึบบังกระจก) */}
      {/* ขอบบน */}
      <mesh position={[0, height / 2 + frameT / 2, 0.038]} castShadow>
        <boxGeometry args={[width + frameT * 2, frameT, 0.09]} />
        <meshStandardMaterial color={frameColor} roughness={0.42} />
      </mesh>
      {/* ขอบล่าง + ขอบธรณีหน้าต่าง (Window Sill) */}
      <mesh position={[0, -height / 2 - frameT / 2, 0.055]} castShadow>
        <boxGeometry args={[width + frameT * 2 + 0.16, frameT + 0.02, 0.15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* ขอบซ้าย */}
      <mesh position={[-width / 2 - frameT / 2, 0, 0.038]} castShadow>
        <boxGeometry args={[frameT, height, 0.09]} />
        <meshStandardMaterial color={frameColor} roughness={0.42} />
      </mesh>
      {/* ขอบขวา */}
      <mesh position={[width / 2 + frameT / 2, 0, 0.038]} castShadow>
        <boxGeometry args={[frameT, height, 0.09]} />
        <meshStandardMaterial color={frameColor} roughness={0.42} />
      </mesh>

      {/* ผ้าม่านโปร่งแสงนุ่มนวลรวบไว้ด้านข้างซ้าย-ขวา ไม่บังวิวกระจก */}
      {withCurtains && (
        <>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * (width / 2 + 0.24), 0.02, 0.11]}>
              {Array.from({ length: folds }).map((_, i) => (
                <mesh key={i} position={[(i - folds / 2 + 0.5) * 0.095 * side, 0, (i % 2) * 0.04]}>
                  <boxGeometry args={[0.105, height + 0.36, 0.045]} />
                  <meshStandardMaterial color={i % 2 ? curtainColors[0] : curtainColors[1]} roughness={0.88} />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[0, height / 2 + 0.24, 0.13]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, width + 1.2, 12]} />
            <meshStandardMaterial color="#8d5a3a" roughness={0.45} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ───────────────────────── ชุดโต๊ะอาหาร (Ward 101) ─────────────────────────
const gingham = (a = '#f48fb1', b = '#fff5f8') => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = b; ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = a;
  for (let i = 0; i < 8; i += 2) { ctx.globalAlpha = 0.55; ctx.fillRect(i * 32, 0, 32, 256); ctx.fillRect(0, i * 32, 256, 32); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};

const OUTER_DISHES = ['rice', 'friedchicken', 'noodle', 'somtam', 'fruit', 'soup', 'greens', 'instant'];
const INNER_DRINKS_DESSERT = ['milk', 'bubbletea', 'water', 'cake'];

export function DiningTable({ position = [0, 0, 0], onActivate, locked = false }) {
  const cloth = useMemo(() => gingham(), []);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : 'auto'; return () => { document.body.style.cursor = 'auto'; }; }, [hover]);
  const activate = (e) => { e.stopPropagation(); onActivate && onActivate(); };
  return (
    <group position={position}>
      <group onClick={activate} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        {/* โต๊ะกลม + ผ้าปูลายตารางไร้รอยต่อ */}
        <mesh position={[0, 0.73, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.38, 1.38, 0.06, 44]} />
          <meshStandardMaterial map={cloth} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.72, 16]} />
          <meshStandardMaterial color="#9b6b43" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.06, 24]} />
          <meshStandardMaterial color="#9b6b43" />
        </mesh>
        <mesh position={[0, 0.60, 0]}>
          <cylinderGeometry args={[1.38, 1.46, 0.32, 44, 1, true]} />
          <meshStandardMaterial map={cloth} side={THREE.DoubleSide} roughness={0.88} />
        </mesh>

        {/* วงนอก 8 เมนูอาหารจานหลัก ชามก๋วยเตี๋ยว ชามซุป และจานผลไม้สดสมจริง */}
        {OUTER_DISHES.map((k, i) => {
          const a = (i / OUTER_DISHES.length) * Math.PI * 2;
          const r = 0.96;
          return (
            <group
              key={k}
              position={[Math.cos(a) * r, 0.761, Math.sin(a) * r]}
              rotation={[0, -a + Math.PI / 2, 0]}
              scale={1.08}
            >
              <RealisticTableFood kind={k} />
            </group>
          );
        })}

        {/* วงใน 3 เครื่องดื่มแก้วใส (นมสด, ชานมไข่มุกพร้อมหลอด, น้ำเปล่า) + เค้กช็อกโกแลต 5 ชั้น */}
        {INNER_DRINKS_DESSERT.map((k, i) => {
          const a = (i / INNER_DRINKS_DESSERT.length) * Math.PI * 2 + Math.PI / 4;
          const r = 0.48;
          return (
            <group
              key={k}
              position={[Math.cos(a) * r, 0.761, Math.sin(a) * r]}
              rotation={[0, -a + Math.PI / 2, 0]}
              scale={1.08}
            >
              <RealisticTableFood kind={k} />
            </group>
          );
        })}

        {/* แจกันแก้วจัดช่อดอกไม้สด 3D กลางโต๊ะ */}
        <FlowerVase position={[-0.09, 0.71, 0]} scale={0.78} />
      </group>
      {/* เก้าอี้ (หันหน้าเข้าหาโต๊ะกลมทุกตัว) */}
      {[0.4, 2.0, 3.55, 5.1].map((a, i) => (
        <group key={i} position={[Math.cos(a) * 1.72, 0, Math.sin(a) * 1.72]} rotation={[0, -a - Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.5, 0.06, 0.5]} /><meshStandardMaterial color="#c9a074" /></mesh>
          <mesh position={[0, 0.78, -0.23]}><boxGeometry args={[0.5, 0.6, 0.05]} /><meshStandardMaterial color="#c9a074" /></mesh>
          {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map((p, j) => (
            <mesh key={j} position={[p[0], 0.22, p[1]]}><boxGeometry args={[0.05, 0.44, 0.05]} /><meshStandardMaterial color="#9b6b43" /></mesh>
          ))}
        </group>
      ))}
      <BillboardLabel3D
        position={[0, 1.48, 0]}
        text={locked ? '📖 อ่านสไลด์ Zone 1 ก่อน แล้วมาเลือกอาหาร' : '🍽️ โต๊ะอาหาร — คลิกเพื่อเลือกเมนู'}
        bg={locked ? '#8e24aa' : '#e91e63'}
        width={locked ? 1.95 : 1.65}
        height={0.32}
        pill={true}
        onClick={activate}
      />
    </group>
  );
}

// ───────────────────────── บูทดูแลแผลฝีเย็บ (Ward 102) ─────────────────────────
function BoothSign({ width = 3.6, height = 0.95 }) {
  const tex = useBoardTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#ff8fb8'); g.addColorStop(1, '#ffc1d9');
    ctx.fillStyle = g; roundRect(ctx, 0, 0, w, h, h * 0.45); ctx.fill();
    ctx.lineWidth = 10; ctx.strokeStyle = '#fff'; roundRect(ctx, 8, 8, w - 16, h - 16, h * 0.4); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.fillStyle = '#8e1450';
    ctx.font = `900 ${Math.round(h * 0.46)}px ${FONT}`;
    fillCenteredText(ctx, 'บูทดูแลแผลฝีเย็บ', w / 2, h * 0.42, w - 80);
    ctx.fillStyle = '#ad1457';
    ctx.font = `700 ${Math.round(h * 0.22)}px ${FONT}`;
    fillCenteredText(ctx, '“เลือกให้ถูก ดูแลแผลได้ดี”', w / 2, h * 0.78, w - 80);
  }, 1000, Math.round((1000 * height) / width), [width, height]);
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

const BOOTH_ITEMS = [
  { c: '#bfe3ff', shape: 'bowl' }, { c: '#ffffff', shape: 'box' }, { c: '#f9c5da', shape: 'pad' },
  { c: '#ff8fbf', shape: 'box' }, { c: '#f1dfb8', shape: 'box' }, { c: '#3b8fe0', shape: 'bowl' },
  { c: '#ffffff', shape: 'roll' }, { c: '#3a8fe8', shape: 'bottle' }, { c: '#f4a3c3', shape: 'bottle' },
];

export function CareBooth({ position = [0, 0, 0], rotation = [0, 0, 0], onActivate, locked = false }) {
  const cloth = useMemo(() => gingham('#f48fb1', '#fff5f8'), []);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : 'auto'; return () => { document.body.style.cursor = 'auto'; }; }, [hover]);
  const activate = (e) => { e.stopPropagation(); onActivate && onActivate(); };
  return (
    <group position={position} rotation={rotation}>
      <group onClick={activate} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        {/* โครงไม้ */}
        {[-1.55, 1.55].map((x) => (
          <mesh key={x} position={[x, 1.2, -0.5]} castShadow><boxGeometry args={[0.1, 2.4, 0.1]} /><meshStandardMaterial color="#d9b27f" /></mesh>
        ))}
        <mesh position={[0, 2.35, -0.5]}><boxGeometry args={[3.2, 0.1, 0.1]} /><meshStandardMaterial color="#d9b27f" /></mesh>
        <mesh position={[0, 1.2, -0.62]}><boxGeometry args={[3.1, 2.2, 0.03]} /><meshStandardMaterial color="#fff0f5" /></mesh>
        {/* โต๊ะสามชั้นคลุมผ้าลายตาราง */}
        {[0.72, 1.18, 1.62].map((y, i) => (
          <mesh key={y} position={[0, y, -0.25 + (i === 2 ? 0.05 : 0.3 - i * 0.15)]} castShadow receiveShadow>
            <boxGeometry args={[2.9 - i * 0.2, 0.06, 0.9 - i * 0.2]} />
            <meshStandardMaterial map={cloth} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0.05]}><boxGeometry args={[2.9, 0.72, 0.9]} /><meshStandardMaterial map={cloth} roughness={0.9} /></mesh>
        {/* อุปกรณ์ 9 ชิ้น (ตะกร้าหวาย 3x3 พร้อมโมเดลเวชภัณฑ์ดูแลแผลฝีเย็บสมจริง) */}
        {BOOTH_ITEMS.map((it, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const y = [1.67, 1.23, 0.77][row];
          const z = [-0.2, 0.05, 0.3][row];
          const x = (col - 1) * 0.82;
          return (
            <group key={i} position={[x, y, z]}>
              {/* ถาดหวายขอบมนพร้อมก้นถาดสาน */}
              <RoundedBox args={[0.52, 0.055, 0.35]} radius={0.016} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#c9955c" roughness={0.68} />
              </RoundedBox>
              <mesh position={[0, 0.03, 0]}>
                <boxGeometry args={[0.46, 0.008, 0.29]} />
                <meshStandardMaterial color="#f5ebe0" roughness={0.85} />
              </mesh>

              {/* 1) กะละมังแช่ก้น (Sitz Bath Basin) ขอบม้วนพร้อมน้ำอุ่น */}
              {it.shape === 'bowl' && (
                <group position={[0, 0.032, 0]}>
                  <mesh position={[0, 0.055, 0]} castShadow>
                    <cylinderGeometry args={[0.185, 0.125, 0.11, 24]} />
                    <meshStandardMaterial color={it.c} roughness={0.22} />
                  </mesh>
                  <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.185, 0.014, 12, 24]} />
                    <meshStandardMaterial color={it.c} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 0.088, 0]}>
                    <cylinderGeometry args={[0.165, 0.15, 0.01, 22]} />
                    <meshStandardMaterial color="#e0f2fe" transparent opacity={0.78} roughness={0.06} metalness={0.2} />
                  </mesh>
                </group>
              )}

              {/* 2) กล่องผ้าก๊อซปลอดเชื้อ / กล่องกระดาษทิชชู่ซับแผล / แผ่นประคบ */}
              {it.shape === 'box' && (
                <group position={[0, 0.085, 0]}>
                  <RoundedBox args={[0.33, 0.105, 0.22]} radius={0.016} smoothness={3} castShadow>
                    <meshStandardMaterial color={it.c} roughness={0.42} />
                  </RoundedBox>
                  {/* ช่องดึงกระดาษทิชชู่/ผ้าก๊อซด้านบนพร้อมแผ่นสีขาวโผล่ออกมา */}
                  <mesh position={[0, 0.054, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.18, 0.05]} />
                    <meshStandardMaterial color="#475569" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.088, 0.01]} rotation={[0.18, 0.1, -0.12]} castShadow>
                    <boxGeometry args={[0.14, 0.075, 0.006]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.85} />
                  </mesh>
                  {/* แถบฉลากเวชภัณฑ์ด้านหน้า */}
                  <mesh position={[0, 0, 0.112]}>
                    <planeGeometry args={[0.24, 0.056]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                  <mesh position={[-0.08, 0, 0.113]}>
                    <boxGeometry args={[0.028, 0.01, 0.002]} />
                    <meshBasicMaterial color="#e11d48" />
                  </mesh>
                  <mesh position={[-0.08, 0, 0.113]}>
                    <boxGeometry args={[0.01, 0.028, 0.002]} />
                    <meshBasicMaterial color="#e11d48" />
                  </mesh>
                </group>
              )}

              {/* 3) ผ้าอนามัยหลังคลอดทรงโค้งมีปีก (Contoured Maternity Sanitary Pad with Wings) */}
              {it.shape === 'pad' && (
                <group position={[0, 0.052, 0]} rotation={[0, 0.22, 0]}>
                  <RoundedBox args={[0.33, 0.032, 0.135]} radius={0.016} smoothness={4} castShadow>
                    <meshStandardMaterial color="#fffbfc" roughness={0.82} />
                  </RoundedBox>
                  <RoundedBox args={[0.26, 0.01, 0.075]} radius={0.005} position={[0, 0.018, 0]}>
                    <meshStandardMaterial color={it.c} roughness={0.78} />
                  </RoundedBox>
                  {/* ปีกผ้าอนามัยซ้าย-ขวา */}
                  {[-1, 1].map((side) => (
                    <RoundedBox
                      key={side}
                      args={[0.09, 0.008, 0.048]}
                      radius={0.004}
                      position={[0, 0.004, side * 0.082]}
                    >
                      <meshStandardMaterial color="#ffffff" roughness={0.85} />
                    </RoundedBox>
                  ))}
                </group>
              )}

              {/* 4) ม้วนสำลีทางการแพทย์ห่อกระดาษปลอดเชื้อเห็นแกนสำลี */}
              {it.shape === 'roll' && (
                <group position={[0, 0.115, 0]} rotation={[0, 0.25, Math.PI / 2]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.088, 0.088, 0.23, 24]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.92} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.09, 0.09, 0.13, 24, 1, true]} />
                    <meshStandardMaterial color="#38bdf8" roughness={0.45} side={THREE.DoubleSide} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.025, 0.025, 0.234, 16]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
                  </mesh>
                </group>
              )}

              {/* 5) ขวดน้ำเกลือล้างแผล NSS / ขวดสบู่เหลวอ่อนโยนพร้อมหัวปั๊มและฉลาก */}
              {it.shape === 'bottle' && (
                <RealisticMedicalBottle3D
                  position={[0, 0.03, 0]}
                  scale={1.08}
                  bodyColor={it.c}
                  title={i === 7 ? 'NSS 0.9%' : 'PERI-WASH'}
                  subtitle={i === 7 ? 'Normal Saline' : 'Gentle Cleanser'}
                  withPump={i !== 7}
                />
              )}
            </group>
          );
        })}
        {/* ป้ายบูท */}
        <group position={[0, 2.75, -0.45]}><BoothSign /></group>
        {/* ดอกไม้ประดับ */}
        {[-1.2, 1.2].map((x) => (
          <group key={x} position={[x, 2.4, -0.45]}>
            {[0, 1, 2, 3, 4].map((k) => (
              <mesh key={k} position={[(k - 2) * 0.1, 0.05 + (k % 2) * 0.06, 0]}><sphereGeometry args={[0.08, 10, 8]} /><meshStandardMaterial color={k % 2 ? '#ff8fb8' : '#fff0f5'} /></mesh>
            ))}
          </group>
        ))}
      </group>
      <BillboardLabel3D
        position={[0, 2.22, 0.22]}
        text={locked ? '📖 อ่านสไลด์ Zone 2 ก่อน แล้วมาที่บูท' : '🩹 บูทดูแลแผลฝีเย็บ — คลิกเพื่อเริ่มกิจกรรม'}
        bg={locked ? '#8e24aa' : '#e91e63'}
        width={locked ? 1.95 : 1.95}
        height={0.34}
        pill={true}
        onClick={activate}
      />
    </group>
  );
}

// ───────────────────────── มุมพักผ่อน (โซฟาบุนุ่ม + หมอนอิงผ้าจริง + ตะกร้าหวาย + ชั้นหนังสือปกแข็ง) ─────────────────────────
export function LoungeCorner({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const books = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        c: ['#be185d', '#0369a1', '#0f766e', '#d97706', '#6d28d9', '#059669'][i % 6],
        band: ['#fce7f3', '#bae6fd', '#ccfbf1', '#fef3c7', '#ede9fe', '#d1fae5'][i % 6],
        h: 0.27 + ((i * 7) % 5) * 0.025,
      })),
    []
  );
  return (
    <group position={position} rotation={rotation}>
      {/* โซฟาผ้าบุนุ่มขอบโค้งมนสมจริง */}
      <RoundedBox args={[2.6, 0.38, 0.95]} radius={0.045} smoothness={4} position={[0, 0.27, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d9c7b0" roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[2.6, 0.56, 0.22]} radius={0.05} smoothness={4} position={[0, 0.71, -0.38]} castShadow receiveShadow>
        <meshStandardMaterial color="#cdb99e" roughness={0.88} />
      </RoundedBox>
      {[-1.38, 1.38].map((x) => (
        <RoundedBox key={x} args={[0.22, 0.62, 0.95]} radius={0.05} smoothness={4} position={[x, 0.45, 0]} castShadow>
          <meshStandardMaterial color="#cdb99e" roughness={0.86} />
        </RoundedBox>
      ))}
      {[-0.82, 0.0, 0.82].map((x) => (
        <RoundedBox key={x} args={[0.81, 0.15, 0.74]} radius={0.045} smoothness={4} position={[x, 0.54, 0.03]} castShadow receiveShadow>
          <meshStandardMaterial color="#eadbc7" roughness={0.84} />
        </RoundedBox>
      ))}
      {/* หมอนอิงผ้าทอ 3D สมจริงจากโมเดลผ้าพับย่น (Poly Haven GLB) */}
      <RealisticThrowPillow3D
        color="#f48fb1"
        variant={0}
        position={[-0.94, 0.74, -0.11]}
        rotation={[-0.16, 0.2, -0.06]}
        scale={0.84}
      />
      <RealisticThrowPillow3D
        color="#f8bbd0"
        variant={1}
        position={[0.94, 0.74, -0.11]}
        rotation={[-0.16, -0.2, 0.06]}
        scale={0.84}
      />

      {/* พรม + โต๊ะกลางไม้โอ๊คพร้อมตะกร้าหวายชุดของใช้ทารกและหนังสือคู่มือเปิดกาง */}
      <mesh position={[0, 0.01, 1.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 40]} />
        <meshStandardMaterial color="#efe6da" roughness={0.96} />
      </mesh>
      <group position={[0, 0, 1.55]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.56, 0.55, 0.05, 36]} />
          <meshStandardMaterial color="#a9784f" roughness={0.46} />
        </mesh>
        {[
          [-0.3, -0.3],
          [0.3, -0.3],
          [-0.3, 0.3],
          [0.3, 0.3],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], 0.2, p[1]]} castShadow>
            <cylinderGeometry args={[0.03, 0.022, 0.4, 14]} />
            <meshStandardMaterial color="#8a5c38" roughness={0.48} />
          </mesh>
        ))}

        {/* ตะกร้าหวายแท้พร้อมผ้าอ้อมพับ แพมเพิส และขวดนมวัดสเกล */}
        <RealisticWickerTraySet3D position={[-0.12, 0.426, -0.06]} rotation={[0, 0.2, 0]} scale={0.92} />

        {/* หนังสือคู่มือคุณแม่เปิดกางอ่านบนโต๊ะกลาง */}
        <RealisticOpenBook3D
          position={[0.20, 0.426, 0.20]}
          rotation={[0, -0.45, 0]}
          width={0.34}
          depth={0.23}
          coverColor="#db2777"
        />
      </group>

      {/* ชั้นหนังสือไม้โอ๊คพร้อมหนังสือปกแข็งสันโค้งเห็นชั้นกระดาษสมจริง */}
      <group position={[-2.25, 0, -0.26]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox args={[0.45, 1.82, 1.42]} radius={0.02} smoothness={3} position={[0, 0.91, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#b98657" roughness={0.55} />
        </RoundedBox>
        {[0.45, 0.95, 1.45].map((y, r) => (
          <group key={y}>
            <mesh position={[0.06, y - 0.03, 0]} castShadow>
              <boxGeometry args={[0.38, 0.032, 1.32]} />
              <meshStandardMaterial color="#d9b27f" roughness={0.5} />
            </mesh>
            {books.slice(r * 7, r * 7 + 5).map((b, i) => {
              const bz = -0.54 + i * 0.062;
              const bw = 0.044;
              const bd = 0.22;
              return (
                <group key={i} position={[0.11, y + b.h / 2 - 0.012, bz]}>
                  {/* ปกหน้าและปกหลัง */}
                  <mesh position={[0, 0, -bd * 0.01]} castShadow>
                    <boxGeometry args={[bd, b.h, bw]} />
                    <meshStandardMaterial color={b.c} roughness={0.38} />
                  </mesh>
                  {/* สันหนังสือโค้งมนด้านหน้า (+X) พร้อมแถบป้ายชื่อสีทอง/พาสเทล */}
                  <mesh position={[bd / 2, 0, 0]}>
                    <cylinderGeometry args={[bw / 2, bw / 2, b.h, 12]} />
                    <meshStandardMaterial color={b.c} roughness={0.35} />
                  </mesh>
                  <mesh position={[bd / 2 + 0.001, b.h * 0.22, 0]}>
                    <cylinderGeometry args={[bw / 2 + 0.001, bw / 2 + 0.001, 0.036, 12]} />
                    <meshStandardMaterial color={b.band} roughness={0.35} />
                  </mesh>
                  <mesh position={[bd / 2 + 0.001, -b.h * 0.28, 0]}>
                    <cylinderGeometry args={[bw / 2 + 0.001, bw / 2 + 0.001, 0.014, 12]} />
                    <meshStandardMaterial color="#fde68a" metalness={0.4} roughness={0.3} />
                  </mesh>
                  {/* ขอบกระดาษสีครีมด้านบนหนังสือ */}
                  <mesh position={[-0.004, b.h / 2 + 0.0005, 0]}>
                    <boxGeometry args={[bd - 0.012, 0.002, bw - 0.008]} />
                    <meshStandardMaterial color="#fcf8ee" roughness={0.8} />
                  </mesh>
                </group>
              );
            })}
            {/* กองหนังสือคู่มือปกแข็งวางนอนสลับบนชั้นวางแต่ละชั้น */}
            <RealisticBookStack3D
              position={[0.10, y - 0.014, 0.26]}
              rotation={[0, Math.PI / 2 + (r - 1) * 0.08, 0]}
              scale={0.82}
            />
          </group>
        ))}
      </group>
    </group>
  );
}

/** Enter = เริ่มกิจกรรมเมื่อเดินเข้าใกล้ (จุด near) — ไม่ชนกับปุ่ม E/F เดิม */
export function useEnterToActivate(target, radius, onActivate) {
  const playerPosition = useStore((s) => s.playerPosition);
  const modal = useStore((s) => s.wardModal);
  const cb = useRef(onActivate);
  cb.current = onActivate;
  const near = playerPosition && Math.hypot(playerPosition[0] - target[0], playerPosition[2] - target[2]) < radius;
  useEffect(() => {
    if (!near || modal) return undefined;
    const onKey = (e) => { if (e.key === 'Enter') cb.current && cb.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [near, modal]);
  return near;
}
