import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * BillboardLabel3D — 100% WebGL depth-buffered 3D interactive floating plaque.
 * Replaces DOM `<Html>` badges so labels NEVER draw on top of the character's head,
 * face, or body when walking or sitting in front of stations.
 */
export default function BillboardLabel3D({
  position = [0, 0, 0],
  text = '',
  subtext = '',
  bg = '#db2777',
  bgEnd = null,
  textColor = '#ffffff',
  subtextColor = null,
  borderColor = '#ffffff',
  width = 1.48,
  height = null,
  pill = true,
  onClick = null,
}) {
  const [hovered, setHovered] = useState(false);
  const [fontTick, setFontTick] = useState(0);

  useEffect(() => whenFontsReady(() => setFontTick((t) => t + 1)), []);

  useEffect(() => {
    return () => {
      if (hovered && typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };
  }, [hovered]);

  const lines = useMemo(() => {
    const raw = String(text || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (subtext) raw.push(String(subtext).trim());
    return raw.length > 0 ? raw : [''];
  }, [text, subtext]);

  const resolvedHeight = height || (lines.length > 1 ? 0.42 : 0.30);

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const cw = 1024;
    const ch = Math.max(192, Math.round((cw * resolvedHeight) / Math.max(0.4, width)));
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, cw, ch);

    const pad = 12;
    const bx = pad;
    const by = pad;
    const bw = cw - pad * 2;
    const bh = ch - pad * 2;
    const rad = pill ? bh / 2 : 34;

    // Subtle crisp drop ring
    ctx.save();
    drawRoundedRect(ctx, bx, by + 4, bw, bh, rad);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
    ctx.fill();
    ctx.restore();

    // Main badge background
    drawRoundedRect(ctx, bx, by, bw, bh, rad);
    if (bgEnd) {
      const grad = ctx.createLinearGradient(0, by, 0, by + bh);
      grad.addColorStop(0, bg);
      grad.addColorStop(1, bgEnd);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bg;
    }
    ctx.fill();

    // Crisp outer border
    ctx.lineWidth = 8;
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    // Typography
    ctx.textBaseline = 'middle';
    const maxTextW = bw - 84;
    if (lines.length === 1) {
      const fontSize = Math.min(62, Math.round(bh * 0.43));
      ctx.font = `800 ${fontSize}px ${CANVAS_THAI_FONT}`;
      ctx.fillStyle = textColor;
      fillCenteredText(ctx, lines[0], cw / 2, by + bh * 0.51, maxTextW);
    } else {
      const topSize = Math.min(50, Math.round(bh * 0.285));
      const botSize = Math.min(44, Math.round(bh * 0.245));
      ctx.font = `800 ${topSize}px ${CANVAS_THAI_FONT}`;
      ctx.fillStyle = textColor;
      fillCenteredText(ctx, lines[0], cw / 2, by + bh * 0.35, maxTextW);

      ctx.font = `700 ${botSize}px ${CANVAS_THAI_FONT}`;
      ctx.fillStyle = subtextColor || textColor;
      fillCenteredText(ctx, lines.slice(1).join(' '), cw / 2, by + bh * 0.70, maxTextW);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [lines, bg, bgEnd, textColor, subtextColor, borderColor, width, resolvedHeight, pill, fontTick]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  if (!texture) return null;

  const isInteractive = typeof onClick === 'function';
  const scaleVal = isInteractive && hovered ? 1.05 : 1.0;

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh
        scale={[scaleVal, scaleVal, 1]}
        onClick={
          isInteractive
            ? (e) => {
                e.stopPropagation();
                onClick(e);
              }
            : undefined
        }
        onPointerOver={
          isInteractive
            ? (e) => {
                e.stopPropagation();
                setHovered(true);
                if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
              }
            : undefined
        }
        onPointerOut={
          isInteractive
            ? () => {
                setHovered(false);
                if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
              }
            : undefined
        }
      >
        <planeGeometry args={[width, resolvedHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          toneMapped={false}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
    </Billboard>
  );
}
