import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

/**
 * WardKit — ชิ้นส่วน 3D ที่ใช้ร่วมกันใน Ward 101 / Ward 102
 *  - WallBoard / TitleSign : ป้ายข้อความบนผนัง (วาดด้วย canvas ให้ตัวอักษรคมชัด อ่านง่าย)
 *  - WallScreen            : จอสไลด์ Zone ติดผนัง (คลิกเพื่อขยายอ่าน)
 *  - WindowWithCurtains    : หน้าต่างบานใหญ่พร้อมผ้าม่าน
 *  - DiningTable           : โต๊ะอาหารกลมสำหรับกิจกรรมเลือกเมนู (Ward 101)
 *  - CareBooth             : บูทดูแลแผลฝีเย็บ (Ward 102)
 *  - LoungeCorner          : โซฟา โต๊ะกลาง พรม ชั้นหนังสือ
 */

const FONT = '"Sarabun","Noto Sans Thai","Thonburi","Ayuthaya",system-ui,sans-serif';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** ตัดบรรทัดสำหรับภาษาไทย (ไม่มีช่องว่าง → ตัดทีละตัวอักษรเมื่อเต็มความกว้าง) */
function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  const pushChars = (word) => {
    for (const ch of word) {
      if (ctx.measureText(cur + ch).width > maxWidth && cur) { lines.push(cur); cur = ch; } else cur += ch;
    }
  };
  words.forEach((w) => {
    const trial = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(trial).width <= maxWidth) cur = trial;
    else if (ctx.measureText(w).width <= maxWidth) { if (cur) lines.push(cur); cur = w; }
    else { if (cur) { lines.push(cur); cur = ''; } pushChars(w); }
  });
  if (cur) lines.push(cur);
  return lines;
}

function useBoardTexture(draw, w, h, deps) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    // วาดซ้ำหลังฟอนต์โหลดเสร็จ เพื่อให้ภาษาไทยคมชัดเสมอ
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { ctx.clearRect(0, 0, w, h); draw(ctx, w, h); tex.needsUpdate = true; });
    }
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** ป้ายรายการ (หัวข้อ + รายการพร้อมไอคอน) */
export function WallBoard({ position, rotation = [0, 0, 0], width = 3, height = 3, title, items = [], accent = '#ec407a', numbered = false }) {
  const W = 900;
  const H = Math.round((W * height) / width);
  const tex = useBoardTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#ffeaf2'); g.addColorStop(1, '#ffd6e5');
    ctx.fillStyle = g;
    roundRect(ctx, 0, 0, w, h, 54); ctx.fill();
    ctx.lineWidth = 14; ctx.strokeStyle = '#f6a5c3';
    roundRect(ctx, 7, 7, w - 14, h - 14, 50); ctx.stroke();

    ctx.fillStyle = '#8e1450'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let fs = 70;
    ctx.font = `800 ${fs}px ${FONT}`;
    let tl = wrapLines(ctx, title, w - 100);
    while (tl.length > 2 && fs > 44) { fs -= 4; ctx.font = `800 ${fs}px ${FONT}`; tl = wrapLines(ctx, title, w - 100); }
    const titleH = tl.length * fs * 1.2 + 30;
    tl.forEach((ln, i) => ctx.fillText(ln, w / 2, 50 + fs * 0.65 + i * fs * 1.2));

    const top = 50 + titleH;
    const gap = 18;
    const rowH = Math.min(150, (h - top - 50 - gap * (items.length - 1)) / Math.max(1, items.length));
    items.forEach((it, i) => {
      const y = top + i * (rowH + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      roundRect(ctx, 40, y, w - 80, rowH, 32); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(244,143,177,0.8)'; ctx.stroke();
      // ไอคอน
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(40 + rowH / 2, y + rowH / 2, rowH * 0.36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = `${Math.round(rowH * 0.42)}px ${FONT}`;
      ctx.fillText(numbered ? String(i + 1) : it.icon, 40 + rowH / 2, y + rowH / 2 + 3);
      // ข้อความ
      ctx.fillStyle = '#3b1230'; ctx.textAlign = 'left';
      let tfs = Math.min(58, rowH * 0.42);
      ctx.font = `700 ${tfs}px ${FONT}`;
      const maxW = w - 80 - rowH - 40;
      let lines = wrapLines(ctx, it.text, maxW);
      while (lines.length > 2 && tfs > 30) { tfs -= 3; ctx.font = `700 ${tfs}px ${FONT}`; lines = wrapLines(ctx, it.text, maxW); }
      const lh = tfs * 1.18;
      const startY = y + rowH / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln, li) => ctx.fillText(ln, 40 + rowH + 14, startY + li * lh));
    });
  }, W, H, [title, items.length, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.04]} />
        <meshStandardMaterial color="#f6a5c3" roughness={0.6} />
      </mesh>
      <mesh>
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
    // ข้อความ
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1a2a6c';
    ctx.font = `900 ${h * 0.34}px ${FONT}`;
    ctx.fillText(line1, h * 0.8, h * 0.36);
    let fs = h * 0.22;
    ctx.font = `800 ${fs}px ${FONT}`;
    while (ctx.measureText(line2).width > w - h * 0.9 && fs > 20) { fs -= 2; ctx.font = `800 ${fs}px ${FONT}`; }
    ctx.fillStyle = '#243b8c';
    ctx.fillText(line2, h * 0.8, h * 0.72);
  }, W, H, [line1, line2, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.04]} />
        <meshStandardMaterial color="#f6a5c3" roughness={0.6} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

/** จอสไลด์ติดผนัง — คลิกเพื่อเปิดสไลด์ขยาย */
export function WallScreen({ position, rotation = [0, 0, 0], width = 6.6, src, room, label }) {
  const tex = useTexture(src);
  useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.needsUpdate = true; }, [tex]);
  const height = width * (tex.image ? tex.image.height / tex.image.width : 2 / 3);
  const openWardModal = useStore((s) => s.openWardModal);
  const seen = useStore((s) => (s.wardFlow[room] || {}).slide);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : 'auto'; return () => { document.body.style.cursor = 'auto'; }; }, [hover]);
  const open = (e) => { e.stopPropagation(); openWardModal('slide', room); };

  return (
    <group position={position} rotation={rotation}>
      {/* กรอบจอ ติดผนัง */}
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[width + 0.28, height + 0.28, 0.12]} />
        <meshStandardMaterial color={hover ? '#ec407a' : '#8d5a3a'} roughness={0.5} />
      </mesh>
      <mesh onClick={open} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <Html position={[0, -height / 2 - 0.32, 0.05]} center distanceFactor={9} zIndexRange={[20, 0]}>
        <button
          type="button" onClick={(e) => { e.stopPropagation(); openWardModal('slide', room); }}
          style={{
            background: seen ? '#2e7d32' : '#e91e63', color: '#fff', border: '2px solid #fff', borderRadius: 20,
            padding: '6px 18px', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,.35)', fontFamily: FONT,
          }}
        >{seen ? '📖 ดูสไลด์อีกครั้ง' : `📖 ${label || 'อ่านเนื้อหาก่อนเริ่มกิจกรรม'} (คลิกเพื่อขยาย)`}</button>
      </Html>
    </group>
  );
}

/** หน้าต่างบานใหญ่ + ผ้าม่านสองข้าง */
export function WindowWithCurtains({ position, rotation = [0, 0, 0], width = 4.2, height = 3.2 }) {
  const sky = useBoardTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#7fc4f2'); g.addColorStop(0.6, '#d4efff'); g.addColorStop(1, '#e6f6e0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // เมฆ
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    [[0.22, 0.2, 0.09], [0.66, 0.28, 0.11], [0.45, 0.12, 0.07]].forEach(([x, y, r]) => {
      ctx.beginPath(); ctx.ellipse(x * w, y * h, r * w, r * w * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    });
    // ต้นไม้
    ctx.fillStyle = '#4c9a3f';
    for (let i = 0; i < 14; i++) {
      ctx.beginPath(); ctx.arc((i / 13) * w, h * (0.78 + 0.08 * Math.sin(i * 1.7)), h * 0.16, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#2f7d32';
    for (let i = 0; i < 10; i++) {
      ctx.beginPath(); ctx.arc((i / 9) * w + 20, h * 0.95, h * 0.13, 0, Math.PI * 2); ctx.fill();
    }
  }, 512, 400, []);
  const folds = 6;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.3, height + 0.3, 0.1]} />
        <meshStandardMaterial color="#b98657" roughness={0.6} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {/* ขื่อหน้าต่าง */}
      <mesh position={[0, 0, 0.02]}><boxGeometry args={[0.07, height, 0.05]} /><meshStandardMaterial color="#8a5a35" /></mesh>
      <mesh position={[0, 0.2, 0.02]}><boxGeometry args={[width, 0.07, 0.05]} /><meshStandardMaterial color="#8a5a35" /></mesh>
      {/* ผ้าม่าน */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (width / 2 + 0.28), 0.05, 0.12]}>
          {Array.from({ length: folds }).map((_, i) => (
            <mesh key={i} position={[(i - folds / 2 + 0.5) * 0.11 * side, 0, (i % 2) * 0.05]}>
              <boxGeometry args={[0.12, height + 0.5, 0.05]} />
              <meshStandardMaterial color={i % 2 ? '#d9b992' : '#c9a57a'} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, height / 2 + 0.28, 0.14]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, width + 1.5, 12]} />
        <meshStandardMaterial color="#7a5230" />
      </mesh>
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

function FoodMound({ kind }) {
  switch (kind) {
    case 'rice': return (<><mesh position={[-0.03, 0.04, 0]}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#fffaf0" /></mesh><mesh position={[0.04, 0.035, 0.01]}><sphereGeometry args={[0.06, 12, 8]} /><meshStandardMaterial color="#9a6a3a" /></mesh></>);
    case 'friedchicken': return (<>{[[-0.04, 0], [0.04, 0.02], [0, -0.04]].map((p, i) => <mesh key={i} position={[p[0], 0.04, p[1]]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color="#d38b2c" /></mesh>)}</>);
    case 'noodle': return (<mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.1, 0.07, 0.07, 16]} /><meshStandardMaterial color="#efe3bd" /></mesh>);
    case 'somtam': return (<mesh position={[0, 0.045, 0]}><sphereGeometry args={[0.09, 12, 8]} /><meshStandardMaterial color="#e1792f" /></mesh>);
    case 'fruit': return (<><mesh position={[-0.04, 0.04, 0]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color="#ffd23c" /></mesh><mesh position={[0.04, 0.04, 0.02]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color="#f06a2a" /></mesh><mesh position={[0, 0.04, -0.05]}><sphereGeometry args={[0.04, 10, 8]} /><meshStandardMaterial color="#e83e8c" /></mesh></>);
    case 'cake': return (<mesh position={[0, 0.045, 0]} rotation={[0, 0.4, 0]}><cylinderGeometry args={[0.08, 0.08, 0.07, 3]} /><meshStandardMaterial color="#4a2a1b" /></mesh>);
    case 'milk': return (<mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.04, 0.035, 0.16, 14]} /><meshStandardMaterial color="#ffffff" /></mesh>);
    case 'bubbletea': return (<mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.042, 0.035, 0.18, 14]} /><meshStandardMaterial color="#b88a64" /></mesh>);
    case 'soup': return (<mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.095, 0.07, 0.06, 16]} /><meshStandardMaterial color="#c7d98f" /></mesh>);
    case 'greens': return (<mesh position={[0, 0.045, 0]}><sphereGeometry args={[0.09, 12, 8]} /><meshStandardMaterial color="#2f7d32" /></mesh>);
    case 'water': return (<mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.04, 0.035, 0.16, 14]} /><meshStandardMaterial color="#cfeaff" transparent opacity={0.7} /></mesh>);
    default: return (<mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.085, 12, 8]} /><meshStandardMaterial color="#e8b84a" /></mesh>);
  }
}

const FOOD_ORDER = ['rice', 'friedchicken', 'noodle', 'somtam', 'fruit', 'cake', 'milk', 'bubbletea', 'soup', 'greens', 'water', 'instant'];

export function DiningTable({ position = [0, 0, 0], onActivate, locked = false }) {
  const cloth = useMemo(() => gingham(), []);
  const [hover, setHover] = useState(false);
  useEffect(() => { document.body.style.cursor = hover ? 'pointer' : 'auto'; return () => { document.body.style.cursor = 'auto'; }; }, [hover]);
  const activate = (e) => { e.stopPropagation(); onActivate && onActivate(); };
  return (
    <group position={position}>
      <group onClick={activate} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        {/* โต๊ะกลม + ผ้าปูลายตาราง */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.08, 40]} />
          <meshStandardMaterial map={cloth} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.72, 16]} />
          <meshStandardMaterial color="#9b6b43" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.55, 0.6, 0.06, 24]} /><meshStandardMaterial color="#9b6b43" /></mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[1.4, 1.5, 0.3, 40, 1, true]} />
          <meshStandardMaterial map={cloth} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        {/* จาน 12 เมนู */}
        {FOOD_ORDER.map((k, i) => {
          const ring = i < 8 ? 1 : 0;
          const r = ring ? 0.98 : 0.52;
          const n = ring ? 8 : 4;
          const idx = ring ? i : i - 8;
          const a = (idx / n) * Math.PI * 2 + (ring ? 0 : Math.PI / 4);
          return (
            <group key={k} position={[Math.cos(a) * r, 0.77, Math.sin(a) * r]}>
              <mesh castShadow><cylinderGeometry args={[0.15, 0.13, 0.025, 20]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>
              <FoodMound kind={k} />
            </group>
          );
        })}
        {/* แจกันดอกไม้กลางโต๊ะ */}
        <group position={[0, 0.76, 0]}>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.09, 0.24, 14]} /><meshStandardMaterial color="#cfeaf5" transparent opacity={0.85} /></mesh>
          {[[0, 0.35], [0.07, 0.3], [-0.07, 0.3], [0.03, 0.4]].map((p, i) => (
            <mesh key={i} position={[p[0], p[1], 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color={i % 2 ? '#ff8fb8' : '#ffd1e3'} /></mesh>
          ))}
        </group>
      </group>
      {/* เก้าอี้ */}
      {[0.4, 2.0, 3.55, 5.1].map((a, i) => (
        <group key={i} position={[Math.cos(a) * 1.95, 0, Math.sin(a) * 1.95]} rotation={[0, -a + Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.5, 0.06, 0.5]} /><meshStandardMaterial color="#c9a074" /></mesh>
          <mesh position={[0, 0.78, -0.23]}><boxGeometry args={[0.5, 0.6, 0.05]} /><meshStandardMaterial color="#c9a074" /></mesh>
          {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map((p, j) => (
            <mesh key={j} position={[p[0], 0.22, p[1]]}><boxGeometry args={[0.05, 0.44, 0.05]} /><meshStandardMaterial color="#9b6b43" /></mesh>
          ))}
        </group>
      ))}
      <Html position={[0, 1.95, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
        <button
          type="button" onClick={activate}
          style={{
            background: locked ? '#8e24aa' : '#e91e63', color: '#fff', border: '2px solid #fff', borderRadius: 22,
            padding: '8px 20px', fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap', cursor: 'pointer',
            boxShadow: '0 5px 16px rgba(0,0,0,.4)', fontFamily: FONT,
          }}
        >{locked ? '📖 อ่านสไลด์ Zone 1 ก่อน แล้วมาเลือกอาหาร' : '🍽️ โต๊ะอาหาร — คลิกเพื่อเลือกเมนู'}</button>
      </Html>
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
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#8e1450';
    ctx.font = `900 ${h * 0.46}px ${FONT}`;
    ctx.fillText('บูทดูแลแผลฝีเย็บ', w / 2, h * 0.42);
    ctx.fillStyle = '#ad1457';
    ctx.font = `700 ${h * 0.22}px ${FONT}`;
    ctx.fillText('“เลือกให้ถูก ดูแลแผลได้ดี”', w / 2, h * 0.78);
  }, 1000, Math.round((1000 * height) / width), []);
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
        {/* อุปกรณ์ 9 ชิ้น (ตะกร้า 3x3) */}
        {BOOTH_ITEMS.map((it, i) => {
          const row = Math.floor(i / 3); const col = i % 3;
          const y = [1.67, 1.23, 0.77][row];
          const z = [-0.2, 0.05, 0.3][row] - (row === 0 ? 0.0 : 0.0);
          const x = (col - 1) * 0.82;
          return (
            <group key={i} position={[x, y, z]}>
              <mesh><boxGeometry args={[0.52, 0.08, 0.34]} /><meshStandardMaterial color="#c9955c" /></mesh>
              {it.shape === 'bowl' && <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.2, 0.12, 0.12, 16]} /><meshStandardMaterial color={it.c} transparent opacity={0.9} /></mesh>}
              {it.shape === 'box' && <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.34, 0.12, 0.24]} /><meshStandardMaterial color={it.c} /></mesh>}
              {it.shape === 'pad' && <mesh position={[0, 0.07, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.32, 0.04, 0.14]} /><meshStandardMaterial color={it.c} /></mesh>}
              {it.shape === 'roll' && <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.2, 16]} /><meshStandardMaterial color={it.c} /></mesh>}
              {it.shape === 'bottle' && <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.07, 0.08, 0.26, 12]} /><meshStandardMaterial color={it.c} /></mesh>}
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
      <Html position={[0, 3.55, -0.3]} center distanceFactor={10} zIndexRange={[20, 0]}>
        <button
          type="button" onClick={activate}
          style={{
            background: locked ? '#8e24aa' : '#e91e63', color: '#fff', border: '2px solid #fff', borderRadius: 22,
            padding: '8px 20px', fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap', cursor: 'pointer',
            boxShadow: '0 5px 16px rgba(0,0,0,.4)', fontFamily: FONT,
          }}
        >{locked ? '📖 อ่านสไลด์ Zone 2 ก่อน แล้วมาที่บูท' : '🩹 บูทดูแลแผลฝีเย็บ — คลิกเพื่อเริ่มกิจกรรม'}</button>
      </Html>
    </group>
  );
}

// ───────────────────────── มุมพักผ่อน ─────────────────────────
export function LoungeCorner({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const books = useMemo(() => Array.from({ length: 22 }).map((_, i) => ({ c: ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac'][i % 6], h: 0.28 + ((i * 7) % 5) * 0.03 })), []);
  return (
    <group position={position} rotation={rotation}>
      {/* โซฟา */}
      <mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[2.6, 0.42, 0.95]} /><meshStandardMaterial color="#d9c7b0" roughness={0.9} /></mesh>
      <mesh position={[0, 0.7, -0.38]} castShadow><boxGeometry args={[2.6, 0.55, 0.22]} /><meshStandardMaterial color="#cdb99e" roughness={0.9} /></mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]} castShadow><boxGeometry args={[0.2, 0.62, 0.95]} /><meshStandardMaterial color="#cdb99e" /></mesh>
      ))}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.56, 0.02]} castShadow><boxGeometry args={[0.8, 0.14, 0.7]} /><meshStandardMaterial color="#e6d6c0" /></mesh>
      ))}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.78, -0.12]} rotation={[0.2, 0, 0.1]}><boxGeometry args={[0.42, 0.42, 0.12]} /><meshStandardMaterial color="#f4a3c3" /></mesh>
      ))}
      {/* พรม + โต๊ะกลางพร้อมผ้าอ้อมและชุดดูแลทารก */}
      <mesh position={[0, 0.01, 1.7]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.5, 40]} /><meshStandardMaterial color="#efe6da" roughness={1} /></mesh>
      <group position={[0, 0, 1.55]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow><cylinderGeometry args={[0.55, 0.55, 0.05, 28]} /><meshStandardMaterial color="#a9784f" roughness={0.5} /></mesh>
        {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.2, p[1]]}><cylinderGeometry args={[0.03, 0.03, 0.4, 8]} /><meshStandardMaterial color="#8a5c38" /></mesh>
        ))}
        {/* ถาดไม้พร้อมผ้าอ้อมพับ แพมเพิส และขวดนมบนโต๊ะกลาง */}
        <mesh position={[0, 0.435, 0]} castShadow>
          <boxGeometry args={[0.62, 0.025, 0.42]} />
          <meshStandardMaterial color="#dfc19b" roughness={0.6} />
        </mesh>
        {[
          { y: 0.465, color: '#ffffff', trim: '#f48fb1' },
          { y: 0.505, color: '#e0f2fe', trim: '#38bdf8' },
          { y: 0.545, color: '#fce7f3', trim: '#ec4899' },
        ].map((d, i) => (
          <group key={i} position={[-0.14, d.y, -0.04]} rotation={[0, i * 0.08, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.036, 0.20]} />
              <meshStandardMaterial color={d.color} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, 0.101]}>
              <boxGeometry args={[0.22, 0.014, 0.008]} />
              <meshStandardMaterial color={d.trim} roughness={0.6} />
            </mesh>
          </group>
        ))}
        {/* แพมเพิส (ผ้าอ้อมสำเร็จรูป) */}
        {[0, 1].map((i) => (
          <group key={i} position={[0.14, 0.462 + i * 0.036, 0.04]} rotation={[0, -0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.20, 0.032, 0.16]} />
              <meshStandardMaterial color="#fffef8" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.017, 0.05]}>
              <boxGeometry args={[0.18, 0.005, 0.028]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* ขวดนม */}
        <group position={[0.16, 0.45, -0.11]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.034, 0.038, 0.12, 16]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.025, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.02, 0.04, 14]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>
        </group>
      </group>
      {/* ชั้นหนังสือ */}
      <group position={[2.9, 0, 0.1]}>
        <mesh position={[0, 0.9, 0]} castShadow><boxGeometry args={[0.45, 1.8, 1.4]} /><meshStandardMaterial color="#b98657" roughness={0.6} /></mesh>
        {[0.45, 0.95, 1.45].map((y, r) => (
          <group key={y}>
            <mesh position={[0.06, y - 0.03, 0]}><boxGeometry args={[0.38, 0.03, 1.3]} /><meshStandardMaterial color="#d9b27f" /></mesh>
            {books.slice(r * 7, r * 7 + 7).map((b, i) => (
              <mesh key={i} position={[0.12, y + b.h / 2 - 0.01, -0.55 + i * 0.16]}><boxGeometry args={[0.22, b.h, 0.1]} /><meshStandardMaterial color={b.c} /></mesh>
            ))}
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
