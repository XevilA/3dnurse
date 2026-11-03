import React, { useMemo, useState, useEffect } from 'react';
import { RoundedBox, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CANVAS_THAI_FONT, fillCenteredText } from '../../utils/canvasText';

function drawRoundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// ══════════════════════════════════════════════════════════════════════════════
// Shared Procedural PBR & UI Textures (Singleton caches — zero per-instance leak)
// ══════════════════════════════════════════════════════════════════════════════

let _linenWeaveTex = null;
function getLinenWeaveTexture() {
  if (_linenWeaveTex) return _linenWeaveTex;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(0,0,0,0.045)' : 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, y, size, 1);
    }
    for (let x = 0; x < size; x += 3) {
      ctx.fillStyle = x % 6 === 0 ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, 0, 1, size);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  _linenWeaveTex = tex;
  return tex;
}

let _knittedPoufTex = null;
function getKnittedPoufTexture() {
  if (_knittedPoufTex) return _knittedPoufTex;
  const w = 512;
  const h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#9db393';
    ctx.fillRect(0, 0, w, h);
    const cols = 24;
    const rows = 14;
    const cw = w / cols;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * cw + cw * 0.5;
        const cy = r * rh + rh * 0.5;
        // Left & right V-stitch knit loops
        ctx.strokeStyle = 'rgba(248, 252, 245, 0.34)';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - cw * 0.34, cy - rh * 0.32);
        ctx.quadraticCurveTo(cx - cw * 0.1, cy + rh * 0.1, cx - cw * 0.04, cy + rh * 0.34);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + cw * 0.34, cy - rh * 0.32);
        ctx.quadraticCurveTo(cx + cw * 0.1, cy + rh * 0.1, cx + cw * 0.04, cy + rh * 0.34);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(54, 73, 48, 0.28)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy - rh * 0.38);
        ctx.lineTo(cx, cy + rh * 0.38);
        ctx.stroke();
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1.5);
  tex.colorSpace = THREE.SRGBColorSpace;
  _knittedPoufTex = tex;
  return tex;
}

let _pageEdgesTex = null;
function getBookPageEdgesTexture() {
  if (_pageEdgesTex) return _pageEdgesTex;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fcf8ee';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 2) {
      ctx.fillStyle = y % 4 === 0 ? '#e7dec8' : '#fffdf7';
      ctx.fillRect(0, y, 128, 1);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  _pageEdgesTex = tex;
  return tex;
}

const _bookCoverCache = new Map();
function getBookCoverTexture(color, accent, title, subtitle, badge = '3DNURSE HANDBOOK') {
  const key = `${color}|${accent}|${title}|${subtitle}|${badge}`;
  if (_bookCoverCache.has(key)) return _bookCoverCache.get(key);

  const w = 512;
  const h = 680;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Soft pastel upper card panel
    ctx.fillStyle = '#fffdf9';
    drawRoundRect(ctx, 42, 46, w - 84, h - 130, 22);
    ctx.fill();

    // Left hardcover hinge groove shadow
    const groove = ctx.createLinearGradient(0, 0, 32, 0);
    groove.addColorStop(0, 'rgba(0,0,0,0.32)');
    groove.addColorStop(0.6, 'rgba(255,255,255,0.16)');
    groove.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = groove;
    ctx.fillRect(0, 0, 32, h);

    // Top clinical pill badge
    ctx.fillStyle = color;
    drawRoundRect(ctx, 116, 78, w - 232, 42, 21);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 18px ${CANVAS_THAI_FONT}`;
    ctx.textBaseline = 'middle';
    fillCenteredText(ctx, badge, w / 2, 100, w - 252);

    // Center botanical / maternal heart emblem
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(w / 2, 232, 78, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(w / 2, 232, 64, 0, Math.PI * 2);
    ctx.stroke();

    // Medical heart + cross icon inside emblem
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w / 2 - 18, 222, 20, 0, Math.PI * 2);
    ctx.arc(w / 2 + 18, 222, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w / 2 - 37, 228);
    ctx.lineTo(w / 2 + 37, 228);
    ctx.lineTo(w / 2, 272);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w / 2 - 5, 216, 10, 28);
    ctx.fillRect(w / 2 - 14, 225, 28, 10);

    // Book Title & Subtitle
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 34px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, title, w / 2, 372, w - 130);

    ctx.fillStyle = '#475569';
    ctx.font = `700 22px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, subtitle, w / 2, 420, w - 130);

    // Decorative divider lines
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(110, 462);
    ctx.lineTo(w - 110, 462);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = `800 19px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, 'คู่มือการพยาบาลมารดาและทารกหลังคลอด', w / 2, 505, w - 130);

    // Bottom footer bar
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 18px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, 'คลินิกบริบาลมารดาและทารก • Maternal & Newborn Care', w / 2, h - 42, w - 90);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _bookCoverCache.set(key, tex);
  return tex;
}

let _openBookSpreadTex = null;
function getOpenBookSpreadTexture() {
  if (_openBookSpreadTex) return _openBookSpreadTex;
  const w = 1024;
  const h = 680;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(0, 0, w, h);

    // Center gutter spine shadow
    const gutter = ctx.createLinearGradient(w / 2 - 42, 0, w / 2 + 42, 0);
    gutter.addColorStop(0, 'rgba(180, 160, 130, 0)');
    gutter.addColorStop(0.45, 'rgba(110, 88, 62, 0.25)');
    gutter.addColorStop(0.5, 'rgba(70, 52, 34, 0.38)');
    gutter.addColorStop(0.55, 'rgba(110, 88, 62, 0.25)');
    gutter.addColorStop(1, 'rgba(180, 160, 130, 0)');
    ctx.fillStyle = gutter;
    ctx.fillRect(w / 2 - 42, 0, 84, h);

    // Left Page: Header + Diagram + Paragraphs
    ctx.fillStyle = '#be185d';
    ctx.font = `900 26px ${CANVAS_THAI_FONT}`;
    ctx.textBaseline = 'middle';
    fillCenteredText(ctx, 'บทที่ 1 • การดูแลสุขภาพหลังคลอด', 256, 62, 400);

    ctx.fillStyle = '#fce7f3';
    drawRoundRect(ctx, 58, 102, 396, 190, 18);
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mini illustration circles on left page
    [
      { x: 136, col: '#f43f5e', lbl: 'สังเกตอาการ' },
      { x: 256, col: '#10b981', lbl: 'โภชนาการ' },
      { x: 376, col: '#0ea5e9', lbl: 'การให้นมแม่' },
    ].map((it) => {
      ctx.fillStyle = it.col;
      ctx.beginPath();
      ctx.arc(it.x, 176, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(it.x, 176, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.font = `800 18px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, it.lbl, it.x, 246, 110);
      return null;
    });

    // Simulated crisp paragraph lines on left page
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 4 === 0 ? '#334155' : '#94a3b8';
      const lw = i % 4 === 3 ? 260 : 384;
      ctx.fillRect(64, 330 + i * 28, lw, i % 4 === 0 ? 10 : 7);
    }

    // Right Page: Checklist Cards
    ctx.fillStyle = '#0f766e';
    ctx.font = `900 26px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, 'บทที่ 2 • เช็กลิสต์ความปลอดภัย', 768, 62, 400);

    [
      { y: 112, bg: '#ecfdf5', bd: '#34d399', t: '1. ให้ลูกดูดนมแม่สม่ำเสมอทุก 2–3 ชม.' },
      { y: 222, bg: '#fff1f2', bd: '#fb7185', t: '2. เฝ้าระวังเลือดออกผิดปกติและไข้สูง' },
      { y: 332, bg: '#eff6ff', bd: '#60a5fa', t: '3. จัดท่านอนหงายบนที่นอนเรียบปลอดภัย' },
      { y: 442, bg: '#fefce8', bd: '#facc15', t: '4. พักผ่อนให้เพียงพอและรับประทานครบ 5 หมู่' },
    ].map((card) => {
      ctx.fillStyle = card.bg;
      drawRoundRect(ctx, 568, card.y, 396, 88, 16);
      ctx.fill();
      ctx.strokeStyle = card.bd;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.font = `800 20px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, card.t, 766, card.y + 45, 366);
      return null;
    });

    // Page numbers
    ctx.fillStyle = '#64748b';
    ctx.font = `700 18px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, '14', 256, 636, 60);
    fillCenteredText(ctx, '15', 768, 636, 60);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _openBookSpreadTex = tex;
  return tex;
}

const _ipadScreenCache = new Map();
function getIPadScreenTexture(mode = 'danger') {
  if (_ipadScreenCache.has(mode)) return _ipadScreenCache.get(mode);

  const w = 1024;
  const h = 720;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  if (ctx) {
    const isBreast = mode === 'breastfeeding';
    const accent = isBreast ? '#db2777' : '#e11d48';
    const softBg = isBreast ? '#fdf2f8' : '#fff1f2';

    // Modern iPadOS App Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Top iPadOS Status Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 40);
    ctx.fillStyle = '#f8fafc';
    ctx.font = `700 18px ${CANVAS_THAI_FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('09:41  iPad Pro', 26, 21);
    fillCenteredText(ctx, '3DNURSE Clinical Pad', w / 2, 21, 320);
    // Battery pill on top right
    ctx.fillStyle = '#22c55e';
    drawRoundRect(ctx, w - 78, 11, 48, 18, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 13px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, '100%', w - 54, 21, 42);

    // Left iPadOS Sidebar Navigation
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 40, 220, h - 40);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, 40);
    ctx.lineTo(220, h);
    ctx.stroke();

    const navItems = isBreast
      ? ['1. ประเมินเต้านม', '2. ฝึกนวดเต้านม 4 ท่า', '3. สถานการณ์จำลอง', '4. บันทึกผลการเรียนรู้']
      : ['1. ภาพรวม 5 อาการ', '2. จำแนกอาการสำคัญ', '3. แนวทางพบแพทย์', '4. แบบทดสอบทบทวน'];
    navItems.forEach((lbl, idx) => {
      const ny = 74 + idx * 66;
      ctx.fillStyle = idx === 1 ? accent : '#ffffff';
      drawRoundRect(ctx, 16, ny, 188, 50, 14);
      ctx.fill();
      ctx.fillStyle = idx === 1 ? '#ffffff' : '#334155';
      ctx.font = `800 17px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, lbl, 110, ny + 26, 170);
    });

    // Main Content Header Banner
    const hdrGrad = ctx.createLinearGradient(244, 58, w - 24, 156);
    hdrGrad.addColorStop(0, accent);
    hdrGrad.addColorStop(1, isBreast ? '#ec4899' : '#be185d');
    ctx.fillStyle = hdrGrad;
    drawRoundRect(ctx, 244, 58, w - 268, 108, 22);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 30px ${CANVAS_THAI_FONT}`;
    fillCenteredText(
      ctx,
      isBreast ? 'ฝึกนวดเต้านม & สถานการณ์จำลอง 4 ข้อ' : 'คัดกรอง 5 สัญญาณอันตรายหลังคลอด',
      622,
      96,
      710
    );
    ctx.fillStyle = '#ffe4e6';
    ctx.font = `700 20px ${CANVAS_THAI_FONT}`;
    fillCenteredText(
      ctx,
      'แตะที่หน้าจอ iPad เพื่อเปิดทำกิจกรรมแบบอินเทอร์แอคทีฟ',
      622,
      136,
      710
    );

    // 4 Interactive Clinical Cards Grid (2x2)
    const cards = isBreast
      ? [
          { t: 'ท่าที่ 1 ประคองเต้านม', s: 'ขยับมือสวนทางเบา ๆ ไม่ให้เจ็บ', c: '#ec4899' },
          { t: 'ท่าที่ 2 นวดวนรอบเต้า', s: 'กระตุ้นท่อน้ำนม ลดอาการคัดตึง', c: '#8b5cf6' },
          { t: 'ท่าที่ 3 ลูบเบา ๆ สู่ลานนม', s: 'ช่วยให้การไหลเวียนน้ำนมดีขึ้น', c: '#0ea5e9' },
          { t: 'ท่าที่ 4 บีบน้ำนมด้วยมือ', s: 'วางนิ้วห่างฐานหัวนม 3–4 ซม.', c: '#10b981' },
        ]
      : [
          { t: 'เลือดออกมากผิดปกติ', s: 'ชุ่มผ้าอนามัย > 1 แผ่น/ชม. รีบพบแพทย์', c: '#e11d48' },
          { t: 'ไข้สูง / น้ำคาวปลาเหม็น', s: 'สัญญาณติดเชื้อหลังคลอด ต้องตรวจทันที', c: '#f97316' },
          { t: 'ปวดศีรษะรุนแรง ตาพร่ามัว', s: 'ระวังภาวะความดันโลหิตสูงหลังคลอด', c: '#8b5cf6' },
          { t: 'ปวดบวมน่อง / เจ็บหน้าอก', s: 'เฝ้าระวังภาวะลิ่มเลือดอุดตันฉุกเฉิน', c: '#0284c7' },
        ];

    cards.forEach((cd, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = 244 + col * 384;
      const cy = 188 + row * 184;

      ctx.fillStyle = softBg;
      drawRoundRect(ctx, cx, cy, 368, 164, 20);
      ctx.fill();
      ctx.strokeStyle = cd.c;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Colored status header pill
      ctx.fillStyle = cd.c;
      drawRoundRect(ctx, cx + 22, cy + 20, 324, 42, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 22px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, cd.t, cx + 184, cy + 42, 300);

      ctx.fillStyle = '#1e293b';
      ctx.font = `700 19px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, cd.s, cx + 184, cy + 104, 326);

      ctx.fillStyle = cd.c;
      ctx.font = `800 16px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, '▶ แตะเพื่อเปิดรายละเอียด', cx + 184, cy + 140, 300);
    });

    // Bottom CTA button + iPadOS Home Indicator
    ctx.fillStyle = '#059669';
    drawRoundRect(ctx, 382, 578, 480, 66, 33);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 25px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, '▶ เริ่มทำกิจกรรมบนแท็บเล็ต', 622, 612, 440);

    // Home indicator bar
    ctx.fillStyle = '#334155';
    drawRoundRect(ctx, w / 2 - 85, h - 18, 170, 7, 4);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _ipadScreenCache.set(mode, tex);
  return tex;
}

const _bottleLabelCache = new Map();
function getMedicalBottleLabelTexture(title, sub, accentColor = '#0284c7') {
  const key = `${title}|${sub}|${accentColor}`;
  if (_bottleLabelCache.has(key)) return _bottleLabelCache.get(key);
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 192);
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, 256, 48);
    ctx.fillRect(0, 168, 256, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 24px ${CANVAS_THAI_FONT}`;
    ctx.textBaseline = 'middle';
    fillCenteredText(ctx, 'STERILE CLINICAL', 128, 25, 232);
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 30px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, title, 128, 92, 230);
    ctx.fillStyle = '#475569';
    ctx.font = `700 20px ${CANVAS_THAI_FONT}`;
    fillCenteredText(ctx, sub, 128, 134, 230);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _bottleLabelCache.set(key, tex);
  return tex;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. RealisticThrowPillow3D — Real Sculpted Poly Haven Cloth Mesh + Normal/Roughness Maps
// ══════════════════════════════════════════════════════════════════════════════
const _centeredPillowGeos = {};

export function RealisticThrowPillow3D({
  color = '#6b8e78',
  variant = 0, // 0: upright square cushion, 1: relaxed creased cushion
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
}) {
  const { scene } = useGLTF('/models/throw_pillows_01.glb');

  const { geometry, material } = useMemo(() => {
    if (!scene) return { geometry: null, material: null };
    const targetName = variant === 1 ? 'throw_pillows_01_pillow01' : 'throw_pillows_01_pillow02';
    let foundMesh = null;
    scene.traverse((child) => {
      if (child.isMesh && (child.name === targetName || !foundMesh)) {
        if (child.name === targetName) foundMesh = child;
        else if (!foundMesh) foundMesh = child;
      }
    });
    if (!foundMesh) return { geometry: null, material: null };

    if (!_centeredPillowGeos[targetName]) {
      const geo = foundMesh.geometry.clone();
      // Rotate raw mesh (+90° around X) so pillow stands upright in XY and faces +Z
      geo.rotateX(Math.PI / 2);
      geo.computeBoundingBox();
      const center = new THREE.Vector3();
      geo.boundingBox.getCenter(center);
      geo.translate(-center.x, -center.y, -center.z);
      geo.computeVertexNormals();
      _centeredPillowGeos[targetName] = geo;
    }

    const origMat = foundMesh.material;
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      map: getLinenWeaveTexture(),
      normalMap: origMat?.normalMap || null,
      roughnessMap: origMat?.roughnessMap || null,
      roughness: 0.86,
      metalness: 0.0,
    });
    if (mat.normalMap) {
      mat.normalScale = new THREE.Vector2(1.15, 1.15);
    }

    return { geometry: _centeredPillowGeos[targetName], material: mat };
  }, [scene, variant, color]);

  if (!geometry || !material) return null;

  const finalScale =
    typeof scale === 'number' ? [scale * 0.84, scale * 0.88, scale * 0.68] : scale;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <mesh
        geometry={geometry}
        material={material}
        scale={finalScale}
        castShadow={castShadow}
        receiveShadow
      />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. RealisticNursingPillow3D — Seamless C-Shaped Boppy Pillow (Closed Rounded Ends + Piping)
// ══════════════════════════════════════════════════════════════════════════════
let _nursingCoverTex = null;
function getNursingCoverTexture() {
  if (_nursingCoverTex) return _nursingCoverTex;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fff9f2';
    ctx.fillRect(0, 0, 256, 256);
    const motifs = [
      [42, 46, '#f4acb7'],
      [128, 86, '#9dc08b'],
      [204, 52, '#fcd34d'],
      [76, 168, '#93c5fd'],
      [182, 184, '#f4acb7'],
      [132, 224, '#9dc08b'],
    ];
    motifs.forEach(([x, y, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(132, 169, 140, 0.55)';
      ctx.beginPath();
      ctx.ellipse(x + 9, y - 4, 6, 3, -0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  _nursingCoverTex = tex;
  return tex;
}

export function RealisticNursingPillow3D({
  color = '#fff8f0',
  pipingColor = '#f4acb7',
  patterned = true,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const arc = Math.PI * 1.48;
  const R = 0.21;
  const tube = 0.086;
  const coverMap = useMemo(() => (patterned ? getNursingCoverTexture() : getLinenWeaveTexture()), [patterned]);

  const endAngle = arc;
  const endPos = [Math.cos(endAngle) * R, Math.sin(endAngle) * R, 0];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Main Plump C-Torus Body */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[R, tube, 24, 48, arc]} />
          <meshStandardMaterial color={color} map={coverMap} roughness={0.82} />
        </mesh>
        {/* Seamless Rounded Hemispherical End-Cap 1 (at angle = 0) */}
        <mesh position={[R, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[tube * 0.995, 22, 22]} />
          <meshStandardMaterial color={color} map={coverMap} roughness={0.82} />
        </mesh>
        {/* Seamless Rounded Hemispherical End-Cap 2 (at angle = arc) */}
        <mesh position={endPos} castShadow receiveShadow>
          <sphereGeometry args={[tube * 0.995, 22, 22]} />
          <meshStandardMaterial color={color} map={coverMap} roughness={0.82} />
        </mesh>
        {/* Soft Welt Seam Piping along Outer Perimeter */}
        <mesh>
          <torusGeometry args={[R + tube * 0.94, 0.009, 12, 48, arc]} />
          <meshStandardMaterial color={pipingColor} roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. RealisticIPad3D — Anodized Aluminum Unibody + iPadOS Screen + Smart Folio Stand + Apple Pencil
// ══════════════════════════════════════════════════════════════════════════════
export function RealisticIPad3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  mode = 'danger', // 'danger' | 'breastfeeding'
  folioColor = '#475569',
  withStand = true,
  withPencil = true,
  onClick,
}) {
  const screenTex = useMemo(() => getIPadScreenTexture(mode), [mode]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!onClick) return undefined;
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, onClick]);

  // Grounded geometry: bottom edge of iPad rests at y = 0.004 directly on tabletop
  const ipadW = 0.315;
  const ipadH = 0.228;
  const ipadD = 0.009;
  const tilt = -0.38; // Tilted slightly backward (~22°) facing +Z toward viewer/sofa
  const centerY = (ipadH / 2) * Math.cos(Math.abs(tilt)) + 0.006;
  const centerZ = -(ipadH / 2) * Math.sin(Math.abs(tilt)) * 0.15;

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
      {/* Tilted iPad Unibody Assembly */}
      <group position={[0, centerY, centerZ]} rotation={[tilt, 0, 0]}>
        {/* Space-Silver Anodized Aluminum Chassis with Rounded Corners */}
        <RoundedBox args={[ipadW, ipadH, ipadD]} radius={0.013} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial
            color={hovered ? '#e2e8f0' : '#cbd5e1'}
            metalness={0.82}
            roughness={0.22}
          />
        </RoundedBox>

        {/* Glossy Black Edge-to-Edge Front Glass Bezel */}
        <RoundedBox
          args={[ipadW - 0.008, ipadH - 0.008, 0.002]}
          radius={0.011}
          smoothness={4}
          position={[0, 0, ipadD / 2 + 0.0005]}
        >
          <meshStandardMaterial color="#090d16" roughness={0.12} metalness={0.25} />
        </RoundedBox>

        {/* High-Brightness Retina Display Screen */}
        <mesh position={[0, 0, ipadD / 2 + 0.0018]}>
          <planeGeometry args={[ipadW - 0.024, ipadH - 0.024]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>

        {/* Subtle Diagonal Glass Specular Sheen */}
        <mesh position={[-0.05, 0.02, ipadD / 2 + 0.0021]} rotation={[0, 0, -0.45]}>
          <planeGeometry args={[0.045, ipadH - 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.07} />
        </mesh>

        {/* Landscape Front FaceTime Camera Lens & Sensor on Top Bezel */}
        <mesh position={[0, ipadH / 2 - 0.008, ipadD / 2 + 0.0019]}>
          <circleGeometry args={[0.0024, 14]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.008, ipadH / 2 - 0.008, ipadD / 2 + 0.0019]}>
          <circleGeometry args={[0.0014, 12]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>

        {/* Top Power Button & Volume Rockers */}
        <mesh position={[-ipadW / 2 + 0.028, ipadH / 2 + 0.001, 0]}>
          <boxGeometry args={[0.016, 0.0025, 0.0035]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[ipadW / 2 + 0.001, ipadH / 2 - 0.032, 0]}>
          <boxGeometry args={[0.0025, 0.018, 0.0035]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Rear Pro Camera Module Bump & Metallic Emblem (Visible from 360° behind table!) */}
        <group position={[ipadW / 2 - 0.034, ipadH / 2 - 0.034, -ipadD / 2 - 0.0015]}>
          <RoundedBox args={[0.038, 0.038, 0.0035]} radius={0.007} smoothness={3}>
            <meshStandardMaterial color="#94a3b8" metalness={0.78} roughness={0.25} />
          </RoundedBox>
          {[-0.008, 0.008].map((ly, idx) => (
            <mesh key={idx} position={[-0.007, ly, -0.002]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0065, 0.0065, 0.002, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          <mesh position={[0.009, 0.008, -0.002]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0032, 0.0032, 0.002, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
        {/* Center Rear Polished Metallic Emblem */}
        <mesh position={[0, 0, -ipadD / 2 - 0.0005]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.016, 20]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.08} />
        </mesh>

        {/* Apple Pencil (2nd Gen) Magnetically Docked on Top Edge */}
        {withPencil && (
          <group position={[0.015, ipadH / 2 + 0.0055, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.0044, 0.0044, 0.165, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.28} />
            </mesh>
            {/* Tapered Pencil Cone & Nib */}
            <mesh position={[0, -0.091, 0]}>
              <coneGeometry args={[0.0044, 0.018, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.099, 0]}>
              <coneGeometry args={[0.0018, 0.005, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>

      {/* Tri-Fold Origami Magnetic Smart Folio Kickstand Resting Flush on Tabletop */}
      {withStand && (
        <group position={[0, 0, -0.048]}>
          {/* Bottom Folio Base Panel Touching Tabletop */}
          <RoundedBox args={[ipadW - 0.02, 0.006, 0.105]} radius={0.002} smoothness={2} position={[0, 0.003, 0]} castShadow>
            <meshStandardMaterial color={folioColor} roughness={0.72} />
          </RoundedBox>
          {/* Angled Rear Support Flap Supporting Back of iPad */}
          <RoundedBox
            args={[ipadW - 0.024, 0.135, 0.006]}
            radius={0.002}
            smoothness={2}
            position={[0, 0.058, 0.012]}
            rotation={[0.42, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color={folioColor} roughness={0.72} />
          </RoundedBox>
          {/* Rear Triangular Brace Flap */}
          <RoundedBox
            args={[ipadW - 0.028, 0.118, 0.005]}
            radius={0.002}
            smoothness={2}
            position={[0, 0.048, -0.026]}
            rotation={[-0.64, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="#334155" roughness={0.78} />
          </RoundedBox>
        </group>
      )}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. RealisticBook3D, RealisticBookStack3D & RealisticOpenBook3D
// ══════════════════════════════════════════════════════════════════════════════
export function RealisticBook3D({
  width = 0.22,
  height = 0.034,
  depth = 0.29,
  color = '#e11d48',
  accent = '#ffe4e6',
  title = 'คู่มือคุณแม่หลังคลอด',
  subtitle = 'การฟื้นฟูร่างกายและสุขภาพมารดา',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const coverTex = useMemo(
    () => getBookCoverTexture(color, accent, title, subtitle),
    [color, accent, title, subtitle]
  );
  const pageTex = useMemo(() => getBookPageEdgesTexture(), []);
  const boardT = 0.0042;
  const pageH = Math.max(0.012, height - boardT * 2);

  return (
    <group position={position} rotation={rotation}>
      {/* Bottom Hardcover Board */}
      <RoundedBox
        args={[width, boardT, depth]}
        radius={0.0016}
        smoothness={3}
        position={[0, boardT / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.38} />
      </RoundedBox>

      {/* Top Hardcover Board + Printed Cover Artwork */}
      <RoundedBox
        args={[width, boardT, depth]}
        radius={0.0016}
        smoothness={3}
        position={[0, height - boardT / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0.003, height + 0.0004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.01, depth - 0.01]} />
        <meshStandardMaterial map={coverTex} roughness={0.32} />
      </mesh>

      {/* Rounded Curved Hardcover Spine along -X Edge */}
      <mesh
        position={[-width / 2 + 0.002, height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[height / 2, height / 2, depth, 18, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.38} />
      </mesh>
      {/* Gold/Pastel Spine Decorative Bands */}
      {[-depth * 0.34, 0, depth * 0.34].map((sz, idx) => (
        <mesh
          key={idx}
          position={[-width / 2 + 0.001, height / 2, sz]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[height / 2 + 0.0008, height / 2 + 0.0008, 0.012, 16, 1, false, Math.PI, Math.PI]} />
          <meshStandardMaterial color="#fde68a" metalness={0.45} roughness={0.3} />
        </mesh>
      ))}

      {/* Recessed Cream Paper Page-Block with Ruled Page Striations */}
      <mesh position={[0.003, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.012, pageH, depth - 0.012]} />
        <meshStandardMaterial map={pageTex} roughness={0.78} />
      </mesh>

      {/* Satin Ribbon Bookmark Tail Peeking Out */}
      <mesh position={[width * 0.16, 0.003, depth / 2 + 0.014]} rotation={[0.08, 0.18, 0]}>
        <boxGeometry args={[0.014, 0.0018, 0.036]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.45} />
      </mesh>
    </group>
  );
}

export function RealisticOpenBook3D({
  width = 0.42,
  depth = 0.29,
  coverColor = '#be185d',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const spreadTex = useMemo(() => getOpenBookSpreadTexture(), []);
  const pageTex = useMemo(() => getBookPageEdgesTexture(), []);

  // Curved arched double-page top surface geometry
  const archedSpreadGeo = useMemo(() => {
    const segX = 32;
    const geo = new THREE.PlaneGeometry(width - 0.024, depth - 0.022, segX, 1);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const norm = Math.abs(x) / ((width - 0.024) / 2); // 0 at center spine -> 1 at outer margin
      // Natural open-book page arch: dips into spine crease at 0, arches up at 0.38, settles toward 1.0
      const archY = Math.sin(norm * Math.PI) * 0.014 - (1 - Math.min(1, norm * 4)) * 0.006;
      pos.setY(i, archY);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, depth]);

  const halfW = (width - 0.016) / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Left & Right Hardcover Boards Resting Open */}
      <RoundedBox
        args={[halfW, 0.005, depth]}
        radius={0.002}
        smoothness={3}
        position={[-halfW / 2 - 0.004, 0.0025, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={coverColor} roughness={0.4} />
      </RoundedBox>
      <RoundedBox
        args={[halfW, 0.005, depth]}
        radius={0.002}
        smoothness={3}
        position={[halfW / 2 + 0.004, 0.0025, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={coverColor} roughness={0.4} />
      </RoundedBox>
      {/* Center Spine Binding Strip */}
      <mesh position={[0, 0.003, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, depth, 14]} />
        <meshStandardMaterial color={coverColor} roughness={0.45} />
      </mesh>

      {/* Left & Right Paper Page Blocks */}
      <mesh position={[-halfW / 2 - 0.002, 0.013, 0]} castShadow>
        <boxGeometry args={[halfW - 0.01, 0.016, depth - 0.02]} />
        <meshStandardMaterial map={pageTex} roughness={0.8} />
      </mesh>
      <mesh position={[halfW / 2 + 0.002, 0.013, 0]} castShadow>
        <boxGeometry args={[halfW - 0.01, 0.016, depth - 0.02]} />
        <meshStandardMaterial map={pageTex} roughness={0.8} />
      </mesh>

      {/* Curved Sculpted Illustrated Two-Page Spread */}
      <mesh geometry={archedSpreadGeo} position={[0, 0.022, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={spreadTex} roughness={0.62} />
      </mesh>

      {/* Satin Ribbon Bookmark Laying Across Gutter */}
      <mesh position={[0.006, 0.026, 0.02]} rotation={[0, 0.06, 0]}>
        <boxGeometry args={[0.008, 0.002, depth + 0.02]} />
        <meshStandardMaterial color="#e11d48" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function RealisticBookStack3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withOpenTop = false,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RealisticBook3D
        position={[0, 0, 0]}
        rotation={[0, 0.04, 0]}
        width={0.25}
        height={0.036}
        depth={0.32}
        color="#be185d"
        accent="#fce7f3"
        title="คู่มือคุณแม่หลังคลอด"
        subtitle="การดูแลสุขภาพและภาวะแทรกซ้อน"
      />
      <RealisticBook3D
        position={[0.006, 0.036, -0.004]}
        rotation={[0, -0.09, 0]}
        width={0.235}
        height={0.033}
        depth={0.305}
        color="#0f766e"
        accent="#ccfbf1"
        title="การเลี้ยงลูกด้วยนมแม่"
        subtitle="เทคนิคนวดเต้านมและท่าให้นมบุตร"
      />
      {withOpenTop ? (
        <RealisticOpenBook3D
          position={[0.01, 0.070, 0.01]}
          rotation={[0, 0.14, 0]}
          width={0.36}
          depth={0.25}
          coverColor="#0284c7"
        />
      ) : (
        <RealisticBook3D
          position={[-0.005, 0.069, 0.005]}
          rotation={[0, 0.07, 0]}
          width={0.22}
          height={0.030}
          depth={0.285}
          color="#d97706"
          accent="#fef3c7"
          title="การดูแลทารกแรกเกิด"
          subtitle="การอาบน้ำ เช็ดสะดือ และการนอนปลอดภัย"
        />
      )}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. RealisticBabyBottle3D, RealisticFoldedClothStack3D, RealisticWickerTraySet3D & RealisticCeramicMug3D
// ══════════════════════════════════════════════════════════════════════════════
export function RealisticBabyBottle3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  collarColor = '#f472b6',
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Clear Contoured Polypropylene Bottle Body */}
      <mesh position={[0, 0.056, 0]} castShadow>
        <cylinderGeometry args={[0.029, 0.032, 0.112, 20]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.46} roughness={0.08} metalness={0.1} />
      </mesh>
      {/* Warm Breastmilk Inside Bottle */}
      <mesh position={[0, 0.044, 0]}>
        <cylinderGeometry args={[0.026, 0.0285, 0.082, 18]} />
        <meshStandardMaterial color="#fff8dc" roughness={0.25} />
      </mesh>
      {/* Printed ml Graduation Scale Marks */}
      {[0.025, 0.045, 0.065, 0.085].map((my, idx) => (
        <mesh key={idx} position={[0, my, 0.0305]}>
          <boxGeometry args={[idx % 2 === 1 ? 0.016 : 0.01, 0.002, 0.001]} />
          <meshBasicMaterial color="#be185d" />
        </mesh>
      ))}
      {/* Pastel Ribbed Screw Collar Ring */}
      <mesh position={[0, 0.118, 0]} castShadow>
        <cylinderGeometry args={[0.031, 0.032, 0.022, 20]} />
        <meshStandardMaterial color={collarColor} roughness={0.35} />
      </mesh>
      {/* Sculpted Multi-Tier Soft Silicone Nipple Teat */}
      <mesh position={[0, 0.136, 0]}>
        <sphereGeometry args={[0.023, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#fde68a" transparent opacity={0.82} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.156, 0]}>
        <cylinderGeometry args={[0.007, 0.012, 0.022, 16]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.168, 0]}>
        <sphereGeometry args={[0.0075, 14, 14]} />
        <meshStandardMaterial color="#fcd34d" transparent opacity={0.88} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function RealisticFoldedClothStack3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  colors = [
    { body: '#ffe4e6', trim: '#f472b6' },
    { body: '#ffffff', trim: '#38bdf8' },
    { body: '#fef9c3', trim: '#f59e0b' },
  ],
}) {
  const linenMap = useMemo(() => getLinenWeaveTexture(), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {colors.map((item, idx) => {
        const w = 0.25 - idx * 0.01;
        const d = 0.20 - idx * 0.008;
        const h = 0.034;
        const y = idx * 0.035 + h / 2;
        const rotY = (idx % 2 === 0 ? 1 : -1) * idx * 0.06;
        return (
          <group key={idx} position={[0, y, 0]} rotation={[0, rotY, 0]}>
            {/* Bottom & Top Soft Folded Muslin Halves */}
            <RoundedBox args={[w, h * 0.48, d]} radius={0.007} smoothness={3} position={[0, -h * 0.24, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={item.body} map={linenMap} roughness={0.88} />
            </RoundedBox>
            <RoundedBox args={[w, h * 0.48, d]} radius={0.007} smoothness={3} position={[0, h * 0.24, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={item.body} map={linenMap} roughness={0.88} />
            </RoundedBox>
            {/* Rounded U-Fold Cloth Spine Front Edge */}
            <mesh position={[0, 0, d / 2 - 0.003]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[h * 0.48, h * 0.48, w - 0.01, 14]} />
              <meshStandardMaterial color={item.body} map={linenMap} roughness={0.88} />
            </mesh>
            {/* Pastel Stitched Piping Ribbon along Fold */}
            <mesh position={[0, 0.002, d / 2 + 0.011]}>
              <boxGeometry args={[w - 0.02, 0.008, 0.004]} />
              <meshStandardMaterial color={item.trim} roughness={0.65} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function RealisticWickerTraySet3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const { scene } = useGLTF('/models/wicker_basket_01.glb');
  const basketClone = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    c.traverse((ch) => {
      if (ch.isMesh) {
        ch.castShadow = true;
        ch.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Authentic Poly Haven Woven Wicker Basket Tray */}
      {basketClone ? (
        <primitive object={basketClone} scale={[1.05, 0.62, 1.02]} position={[0, 0, 0]} />
      ) : (
        <RoundedBox args={[0.38, 0.05, 0.28]} radius={0.012} position={[0, 0.025, 0]} castShadow>
          <meshStandardMaterial color="#c9955c" roughness={0.7} />
        </RoundedBox>
      )}

      {/* Soft Folded Muslin Cloths Inside Left of Basket */}
      <RealisticFoldedClothStack3D
        position={[-0.085, 0.022, 0.005]}
        scale={0.64}
        colors={[
          { body: '#ffffff', trim: '#38bdf8' },
          { body: '#fce7f3', trim: '#f472b6' },
        ]}
      />

      {/* Contoured Newborn Disposable Diaper (Pampers) with Gathered Cuffs & Waist Tape */}
      <group position={[0.055, 0.044, 0.028]} rotation={[0, -0.14, 0]}>
        <RoundedBox args={[0.125, 0.042, 0.155]} radius={0.016} smoothness={4} castShadow>
          <meshStandardMaterial color="#fffdf9" roughness={0.78} />
        </RoundedBox>
        {/* Waistband Pastel Blue Tape & Wetness Indicator Line */}
        <RoundedBox args={[0.128, 0.012, 0.044]} radius={0.004} position={[0, 0.018, 0.032]}>
          <meshStandardMaterial color="#bae6fd" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.022, 0]}>
          <boxGeometry args={[0.008, 0.002, 0.14]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Graduated Baby Milk Bottle Standing Inside Basket Corner */}
      <RealisticBabyBottle3D position={[0.125, 0.02, -0.055]} scale={0.92} />
    </group>
  );
}

export function RealisticCeramicMug3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#84a98c',
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Beveled Solid Oak Coaster */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.064, 0.068, 0.016, 24]} />
        <meshStandardMaterial color="#b07d4f" roughness={0.45} />
      </mesh>
      {/* Glazed Ceramic Mug Outer Wall */}
      <mesh position={[0, 0.058, 0]} castShadow>
        <cylinderGeometry args={[0.044, 0.038, 0.088, 24]} />
        <meshStandardMaterial color={color} roughness={0.24} metalness={0.05} />
      </mesh>
      {/* Cream Inner Ceramic Rim & Warm Herbal Tea Surface */}
      <mesh position={[0, 0.101, 0]}>
        <cylinderGeometry args={[0.040, 0.040, 0.004, 22]} />
        <meshStandardMaterial color="#faf6f0" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.098, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.008, 22]} />
        <meshStandardMaterial color="#b45309" roughness={0.12} metalness={0.1} />
      </mesh>
      {/* Sculpted Curved Ceramic C-Handle */}
      <mesh position={[0.046, 0.058, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.024, 0.0065, 12, 22, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.24} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. RealisticKnittedPouf3D, RealisticPlushToy3D & RealisticCredenza3D
// ══════════════════════════════════════════════════════════════════════════════
export function RealisticKnittedPouf3D({
  position = [0, 0, 0],
  color = '#a3b899',
}) {
  const knitTex = useMemo(() => getKnittedPoufTexture(), []);
  // Smooth organic barrel pouf profile via LatheGeometry
  const poufGeo = useMemo(() => {
    const pts = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0 bottom -> 1 top
      const angle = (t - 0.5) * Math.PI;
      const r = t === 0 || t === 1 ? 0.001 : 0.24 + Math.cos(angle) * 0.165;
      const y = 0.02 + t * 0.31 + Math.sin(t * Math.PI) * 0.015;
      pts.push(new THREE.Vector2(r, y));
    }
    const geo = new THREE.LatheGeometry(pts, 32);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={position}>
      <mesh geometry={poufGeo} castShadow receiveShadow>
        <meshStandardMaterial color={color} map={knitTex} roughness={0.92} />
      </mesh>
      {/* Center Tufted Knit Button on Top */}
      <mesh position={[0, 0.332, 0]} castShadow>
        <sphereGeometry args={[0.034, 14, 10]} />
        <meshStandardMaterial color="#7d9474" roughness={0.85} />
      </mesh>
    </group>
  );
}

export function RealisticPlushToy3D({
  kind = 'bunny', // 'bunny' | 'bear'
  color,
  ribbonColor = '#f472b6',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}) {
  const furColor = color || (kind === 'bear' ? '#c68b59' : '#efe3d8');
  const innerColor = kind === 'bear' ? '#ebd2be' : '#fbcfe8';

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    >
      {/* Chubby Seated Torso */}
      <mesh position={[0, 0.13, 0]} scale={[1, 1.12, 0.92]} castShadow receiveShadow>
        <sphereGeometry args={[0.115, 20, 18]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>
      {/* Soft Belly Patch */}
      <mesh position={[0, 0.125, 0.078]} scale={[0.72, 0.85, 0.45]}>
        <sphereGeometry args={[0.088, 16, 16]} />
        <meshStandardMaterial color="#fff8f0" roughness={0.92} />
      </mesh>

      {/* Satin Ribbon Collar & Bow Tie */}
      <mesh position={[0, 0.225, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.068, 0.009, 10, 22]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.45} />
      </mesh>
      {[-0.022, 0.022].map((bx, i) => (
        <mesh key={i} position={[bx, 0.225, 0.072]} rotation={[0, 0, i === 0 ? 0.35 : -0.35]}>
          <sphereGeometry args={[0.019, 12, 10]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.45} />
        </mesh>
      ))}

      {/* Cute Round Head */}
      <mesh position={[0, 0.31, 0.01]} scale={[1.05, 0.98, 0.98]} castShadow>
        <sphereGeometry args={[0.096, 20, 18]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>

      {/* Snout Muzzle + Nose + Glossy Button Eyes */}
      <mesh position={[0, 0.292, 0.092]} scale={[1.15, 0.85, 0.7]}>
        <sphereGeometry args={[0.034, 14, 14]} />
        <meshStandardMaterial color="#fffaf5" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.304, 0.116]}>
        <sphereGeometry args={[0.011, 12, 12]} />
        <meshStandardMaterial color={kind === 'bear' ? '#3e2723' : '#f472b6'} roughness={0.35} />
      </mesh>
      {[-0.036, 0.036].map((ex, i) => (
        <mesh key={i} position={[ex, 0.326, 0.094]}>
          <sphereGeometry args={[0.0105, 12, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.12} metalness={0.2} />
        </mesh>
      ))}

      {/* Ears: Long Sculpted Bunny Ears vs Round Teddy Bear Ears */}
      {kind === 'bunny' ? (
        [-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.044, 0.43, -0.005]}
            rotation={[0.08, 0, side * -0.16]}
          >
            <mesh scale={[0.42, 1.35, 0.24]} castShadow>
              <sphereGeometry args={[0.068, 16, 14]} />
              <meshStandardMaterial color={furColor} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.005, 0.011]} scale={[0.26, 1.08, 0.12]}>
              <sphereGeometry args={[0.062, 14, 12]} />
              <meshStandardMaterial color={innerColor} roughness={0.85} />
            </mesh>
          </group>
        ))
      ) : (
        [-1, 1].map((side) => (
          <group key={side} position={[side * 0.076, 0.382, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.036, 14, 14]} />
              <meshStandardMaterial color={furColor} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.016]} scale={[0.65, 0.65, 0.4]}>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color={innerColor} roughness={0.85} />
            </mesh>
          </group>
        ))
      )}

      {/* Chubby Arms & Seated Legs with Paw Pads */}
      {[-1, 1].map((side) => (
        <React.Fragment key={side}>
          <mesh
            position={[side * 0.105, 0.165, 0.035]}
            rotation={[0.45, 0, side * -0.45]}
            scale={[0.55, 1.15, 0.55]}
            castShadow
          >
            <sphereGeometry args={[0.056, 14, 12]} />
            <meshStandardMaterial color={furColor} roughness={0.9} />
          </mesh>
          <group position={[side * 0.072, 0.052, 0.095]} rotation={[Math.PI / 2 - 0.15, side * -0.2, 0]}>
            <mesh scale={[0.68, 1.25, 0.65]} castShadow>
              <sphereGeometry args={[0.062, 14, 12]} />
              <meshStandardMaterial color={furColor} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.074, 0]} scale={[0.62, 0.18, 0.58]}>
              <sphereGeometry args={[0.054, 12, 12]} />
              <meshStandardMaterial color={innerColor} roughness={0.85} />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* Fluffy Pom-Pom Tail */}
      <mesh position={[0, 0.075, -0.105]} castShadow>
        <sphereGeometry args={[0.034, 12, 12]} />
        <meshStandardMaterial color="#fffaf5" roughness={0.92} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. RealisticClinicalItem3D — Detailed Medical & Postpartum/Newborn Care Props
// ══════════════════════════════════════════════════════════════════════════════
export function RealisticMedicalBottle3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  bodyColor = '#0284c7',
  capColor = '#f8fafc',
  title = 'ALCOHOL 70%',
  subtitle = 'Antiseptic Solution',
  withPump = false,
}) {
  const labelTex = useMemo(
    () => getMedicalBottleLabelTexture(title, subtitle, bodyColor),
    [title, subtitle, bodyColor]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Bottle Cylinder */}
      <mesh position={[0, 0.085, 0]} castShadow>
        <cylinderGeometry args={[0.044, 0.046, 0.165, 24]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.86} roughness={0.16} />
      </mesh>
      {/* Rounded Bottle Shoulder */}
      <mesh position={[0, 0.168, 0]} castShadow>
        <sphereGeometry args={[0.044, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={bodyColor} transparent opacity={0.86} roughness={0.16} />
      </mesh>
      {/* Curved Wrap-Around Printed Medical Label */}
      <mesh position={[0, 0.086, 0]}>
        <cylinderGeometry args={[0.0462, 0.0462, 0.105, 24, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
        <meshStandardMaterial map={labelTex} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Ribbed Cap Collar */}
      <mesh position={[0, 0.214, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 0.032, 18]} />
        <meshStandardMaterial color={capColor} roughness={0.3} />
      </mesh>
      {withPump && (
        <>
          <mesh position={[0, 0.242, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.028, 12]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.25} />
          </mesh>
          <mesh position={[0.018, 0.254, 0]} rotation={[0, 0, -Math.PI / 2.3]}>
            <cylinderGeometry args={[0.005, 0.007, 0.042, 12]} />
            <meshStandardMaterial color={capColor} roughness={0.25} />
          </mesh>
        </>
      )}
    </group>
  );
}

export function RealisticBolsterPillow3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#fbcfe8',
  ribbonColor = '#ec4899',
  onClick,
}) {
  const linenMap = useMemo(() => getLinenWeaveTexture(), []);
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Main Plump Cylindrical Bolster Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.078, 0.078, 0.50, 24]} />
        <meshStandardMaterial color={color} map={linenMap} roughness={0.84} />
      </mesh>
      {/* Rounded Gathered Bolster Ends + Tied Ribbon Cinch & Ruffle */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, side * 0.25, 0]}>
          <mesh>
            <sphereGeometry args={[0.077, 20, 14]} />
            <meshStandardMaterial color={color} map={linenMap} roughness={0.84} />
          </mesh>
          <mesh position={[0, side * 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.026, 0.007, 10, 18]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.45} />
          </mesh>
          <mesh position={[0, side * 0.075, 0]} rotation={[side === 1 ? 0 : Math.PI, 0, 0]}>
            <coneGeometry args={[0.042, 0.036, 16]} />
            <meshStandardMaterial color="#fff5f8" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
