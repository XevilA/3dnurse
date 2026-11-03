import React, { useMemo } from 'react';
import * as THREE from 'three';

let cachedAssets = null;

function makeTex(drawFn, size = 256) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  drawFn(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function makeSectorExtrude(radius, angle, thickness) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, -angle / 2, angle / 2, false);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 16,
  });
  // Rotate so extrusion thickness goes along +Y and tip points toward -X
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function getAssets() {
  if (cachedAssets) return cachedAssets;

  // 1. Porcelain Dinner Plate (LatheGeometry with recessed well & raised rim)
  const platePts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.105, 0),
    new THREE.Vector2(0.114, 0.007),
    new THREE.Vector2(0.172, 0.024),
    new THREE.Vector2(0.175, 0.027),
    new THREE.Vector2(0.167, 0.028),
    new THREE.Vector2(0.118, 0.012),
    new THREE.Vector2(0, 0.011),
  ];
  const plateGeo = new THREE.LatheGeometry(platePts, 30);

  const dessertPlatePts = platePts.map((p) => new THREE.Vector2(p.x * 0.82, p.y * 0.9));
  const dessertPlateGeo = new THREE.LatheGeometry(dessertPlatePts, 28);

  // 2. Deep Hollow Porcelain Soup/Noodle Bowl
  const bowlPts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.072, 0),
    new THREE.Vector2(0.078, 0.010),
    new THREE.Vector2(0.118, 0.026),
    new THREE.Vector2(0.144, 0.054),
    new THREE.Vector2(0.154, 0.082),
    new THREE.Vector2(0.146, 0.084),
    new THREE.Vector2(0.136, 0.056),
    new THREE.Vector2(0.106, 0.028),
    new THREE.Vector2(0.065, 0.018),
    new THREE.Vector2(0, 0.017),
  ];
  const bowlGeo = new THREE.LatheGeometry(bowlPts, 30);

  // 3. Curved Cavendish Banana Geometry
  const bananaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.075, 0.026, -0.018),
    new THREE.Vector3(-0.032, 0.016, 0.014),
    new THREE.Vector3(0.028, 0.017, 0.016),
    new THREE.Vector3(0.074, 0.032, -0.014),
  ]);
  const bananaGeo = new THREE.TubeGeometry(bananaCurve, 18, 0.0165, 12, false);

  // 4. Layered Chocolate Cake Wedge Geometries
  const cakeRadius = 0.135;
  const cakeAngle = 0.62;
  const cakeSpongeGeo = makeSectorExtrude(cakeRadius, cakeAngle, 0.013);
  const cakeCreamGeo = makeSectorExtrude(cakeRadius * 0.995, cakeAngle * 0.99, 0.006);
  const cakeGlazeTopGeo = makeSectorExtrude(cakeRadius * 1.005, cakeAngle * 1.01, 0.004);

  // 5. High-Detail Procedural Culinary Textures (256x256)
  const brownRiceTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#dec7a6';
    ctx.fillRect(0, 0, s, s);
    const cols = ['#f5ead6', '#e6d2b5', '#c8a67d', '#b38b5fa0', '#fffaf0'];
    for (let i = 0; i < 420; i++) {
      const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * s;
      const y = (Math.sin(i * 78.233) * 0.5 + 0.5) * s;
      const ang = (i * 1.7) % Math.PI;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath();
      ctx.ellipse(0, 0, 7.5, 3.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,82,45,0.22)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }
  });

  const kapraoTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#7a3e16';
    ctx.fillRect(0, 0, s, s);
    const meatCols = ['#c97e3e', '#df9857', '#a85d24', '#e8ad72', '#8f4919'];
    for (let i = 0; i < 260; i++) {
      const x = (Math.sin(i * 31.7) * 0.5 + 0.5) * s;
      const y = (Math.cos(i * 57.3) * 0.5 + 0.5) * s;
      ctx.fillStyle = meatCols[i % meatCols.length];
      ctx.beginPath();
      ctx.ellipse(x, y, 8 + (i % 5), 6 + (i % 4), i, 0, Math.PI * 2);
      ctx.fill();
    }
    // Basil & chili bits in sauce
    for (let i = 0; i < 40; i++) {
      const x = (Math.sin(i * 93.1) * 0.5 + 0.5) * s;
      const y = (Math.cos(i * 19.4) * 0.5 + 0.5) * s;
      ctx.fillStyle = i % 3 === 0 ? '#dc2626' : '#166534';
      ctx.beginPath();
      ctx.ellipse(x, y, i % 3 === 0 ? 5 : 11, i % 3 === 0 ? 3 : 6, i * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const friedBatterTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#c86d14';
    ctx.fillRect(0, 0, s, s);
    const cols = ['#e08b26', '#f2a83b', '#ad540b', '#d97818', '#964406'];
    for (let i = 0; i < 320; i++) {
      const x = (Math.sin(i * 45.3) * 0.5 + 0.5) * s;
      const y = (Math.cos(i * 63.9) * 0.5 + 0.5) * s;
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath();
      ctx.arc(x, y, 4 + (i % 7), 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const noodleBrothTex = makeTex((ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 10, s / 2, s / 2, s / 2);
    g.addColorStop(0, '#efe1bc');
    g.addColorStop(0.75, '#dcc28a');
    g.addColorStop(1, '#c4a366');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // White rice noodle strands submerged in clear broth
    ctx.strokeStyle = 'rgba(255,252,244,0.82)';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 34; i++) {
      ctx.beginPath();
      const y0 = 28 + (i * 6.2) % (s - 56);
      ctx.moveTo(24, y0);
      ctx.bezierCurveTo(s * 0.35, y0 - 24 + (i % 5) * 10, s * 0.65, y0 + 24 - (i % 4) * 10, s - 24, y0 + ((i % 3) - 1) * 14);
      ctx.stroke();
    }
  });

  const somtamTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#9c4f21';
    ctx.fillRect(0, 0, s, s);
    const shredCols = ['#fae5b4', '#f3c77e', '#e59a4c', '#fff3d6'];
    for (let i = 0; i < 160; i++) {
      const x = 20 + ((Math.sin(i * 22.1) * 0.5 + 0.5) * (s - 40));
      const y = 20 + ((Math.cos(i * 41.7) * 0.5 + 0.5) * (s - 40));
      const ang = (i * 0.9) % Math.PI;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.strokeStyle = shredCols[i % shredCols.length];
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(22, 2);
      ctx.stroke();
      ctx.restore();
    }
    // Chili & peanut speckles
    for (let i = 0; i < 45; i++) {
      const x = (Math.sin(i * 71.3) * 0.5 + 0.5) * s;
      const y = (Math.cos(i * 29.8) * 0.5 + 0.5) * s;
      ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#d6a15c';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const dragonFruitTex = makeTex((ctx, s) => {
    const cx = s / 2;
    const cy = s / 2;
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0, 0, s, s);
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, s * 0.45);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.84, '#f8fafc');
    g.addColorStop(0.92, '#fb7185');
    g.addColorStop(1, '#e11d48');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    ctx.fill();
    // Tiny black dragonfruit seeds
    ctx.fillStyle = '#18181b';
    for (let i = 0; i < 130; i++) {
      const r = Math.sqrt(((i * 37) % 130) / 130) * (s * 0.37);
      const a = i * 2.39996;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.4, 1.6, a, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const veggieSoupTex = makeTex((ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 12, s / 2, s / 2, s / 2);
    g.addColorStop(0, '#ecc978');
    g.addColorStop(0.75, '#d4a349');
    g.addColorStop(1, '#b5812e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // Subtle shimmering broth oil droplets
    ctx.strokeStyle = 'rgba(255,248,220,0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 24; i++) {
      const x = 35 + ((Math.sin(i * 19.7) * 0.5 + 0.5) * (s - 70));
      const y = 35 + ((Math.cos(i * 53.1) * 0.5 + 0.5) * (s - 70));
      ctx.beginPath();
      ctx.arc(x, y, 4 + (i % 5), 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  const greensTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#3b1d0a'; // Rich oyster sauce base
    ctx.fillRect(0, 0, s, s);
    const leafCols = ['#14532d', '#166534', '#15803d', '#22c55e'];
    for (let i = 0; i < 95; i++) {
      const x = 24 + ((Math.sin(i * 27.4) * 0.5 + 0.5) * (s - 48));
      const y = 24 + ((Math.cos(i * 49.2) * 0.5 + 0.5) * (s - 48));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(i * 0.6);
      ctx.fillStyle = leafCols[i % leafCols.length];
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  const ramenTex = makeTex((ctx, s) => {
    ctx.fillStyle = '#9a4e08';
    ctx.fillRect(0, 0, s, s);
    const noodleCols = ['#f59e0b', '#fbbf24', '#fcd34d', '#d97706'];
    ctx.lineCap = 'round';
    for (let i = 0; i < 75; i++) {
      const yBase = (i * 13) % s;
      const xOff = (i * 29) % 40;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 7.5;
      ctx.beginPath();
      for (let x = -10; x <= s + 10; x += 14) {
        const wy = yBase + Math.sin((x + xOff) * 0.16) * 8;
        if (x === -10) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      ctx.strokeStyle = noodleCols[i % noodleCols.length];
      ctx.lineWidth = 5.2;
      ctx.beginPath();
      for (let x = -10; x <= s + 10; x += 14) {
        const wy = yBase + Math.sin((x + xOff) * 0.16) * 8;
        if (x === -10) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  });

  cachedAssets = {
    plateGeo,
    dessertPlateGeo,
    bowlGeo,
    bananaGeo,
    cakeSpongeGeo,
    cakeCreamGeo,
    cakeGlazeTopGeo,
    brownRiceTex,
    kapraoTex,
    friedBatterTex,
    noodleBrothTex,
    somtamTex,
    dragonFruitTex,
    veggieSoupTex,
    greensTex,
    ramenTex,
  };
  return cachedAssets;
}

// ─────────────────── Shared Dishware & Utensils ───────────────────

function PorcelainPlate({ dessert = false, withWoodCharger = false }) {
  const { plateGeo, dessertPlateGeo } = useMemo(() => getAssets(), []);
  return (
    <group>
      {withWoodCharger && (
        <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.19, 0.182, 0.01, 28]} />
          <meshStandardMaterial color="#b98552" roughness={0.55} />
        </mesh>
      )}
      <mesh position={[0, withWoodCharger ? 0.01 : 0, 0]} geometry={dessert ? dessertPlateGeo : plateGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.14} metalness={0.04} side={THREE.DoubleSide} />
      </mesh>
      {/* Subtle pastel pink porcelain rim accent */}
      <mesh position={[0, (withWoodCharger ? 0.01 : 0) + (dessert ? 0.0245 : 0.0275), 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[dessert ? 0.138 : 0.168, 0.0018, 8, 32]} />
        <meshStandardMaterial color="#f9a8d4" roughness={0.2} />
      </mesh>
    </group>
  );
}

function PorcelainBowl({ ribbed = false }) {
  const { bowlGeo } = useMemo(() => getAssets(), []);
  return (
    <group>
      <mesh geometry={bowlGeo} castShadow receiveShadow>
        <meshStandardMaterial color={ribbed ? '#fffcf7' : '#ffffff'} roughness={0.16} metalness={0.04} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.083, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.149, 0.0022, 8, 32]} />
        <meshStandardMaterial color={ribbed ? '#d97706' : '#f472b6'} roughness={0.25} />
      </mesh>
    </group>
  );
}

function MetalSpoon({ position = [0.13, 0.028, 0.04], rotation = [0, 0.25, -0.08] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={[1.35, 0.28, 0.85]}>
        <sphereGeometry args={[0.018, 12, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.14} />
      </mesh>
      <mesh position={[0.068, 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0032, 0.0048, 0.11, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.14} />
      </mesh>
    </group>
  );
}

function CeramicSoupSpoon({ position = [0.085, 0.074, 0.055], rotation = [0.18, -0.5, -0.32] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={[1.45, 0.45, 0.95]}>
        <sphereGeometry args={[0.021, 12, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.14} />
      </mesh>
      <mesh position={[0.062, 0.015, 0]} rotation={[0, 0, 1.32]}>
        <cylinderGeometry args={[0.0045, 0.006, 0.095, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.14} />
      </mesh>
    </group>
  );
}

function ClearGlassTumbler({ height = 0.165, topR = 0.052, botR = 0.041, coasterColor = '#f8fafc' }) {
  return (
    <group>
      {/* Coaster (ที่รองแก้ว) */}
      <mesh position={[0, 0.004, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.068, 0.070, 0.008, 24]} />
        <meshStandardMaterial color={coasterColor} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.0085, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.064, 0.0018, 8, 24]} />
        <meshStandardMaterial color="#f48fb1" roughness={0.3} />
      </mesh>
      {/* Thick Crystal Glass Base */}
      <mesh position={[0, 0.017, 0]}>
        <cylinderGeometry args={[botR, botR * 0.98, 0.018, 24]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.52} roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Transparent Specular Glass Wall */}
      <mesh position={[0, 0.026 + height / 2, 0]} renderOrder={3}>
        <cylinderGeometry args={[topR, botR, height, 28, 1, true]} />
        <meshStandardMaterial
          color="#eef9ff"
          transparent
          opacity={0.26}
          roughness={0.04}
          metalness={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Smooth Glass Rim */}
      <mesh position={[0, 0.026 + height, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
        <torusGeometry args={[topR, 0.0022, 10, 28]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={0.04} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─────────────────── All 12 Realistic Culinary Items ───────────────────

export function RealisticTableFood({ kind }) {
  const assets = useMemo(() => getAssets(), []);

  switch (kind) {
    // 1. ข้าวกล้องผัดกะเพราไก่ (+ ไข่ดาว)
    case 'rice':
      return (
        <group>
          <PorcelainPlate withWoodCharger />
          {/* พูนข้าวกล้องหุงสุกฝั่งซ้าย */}
          <mesh position={[-0.046, 0.032, 0.006]} scale={[1.05, 0.58, 1.25]} castShadow>
            <sphereGeometry args={[0.062, 18, 14]} />
            <meshStandardMaterial map={assets.brownRiceTex} roughness={0.78} />
          </mesh>
          {/* ผัดกะเพราไก่สับซอสฉ่ำฝั่งขวา */}
          <mesh position={[0.042, 0.030, 0.008]} scale={[1.1, 0.52, 1.22]} castShadow>
            <sphereGeometry args={[0.064, 18, 14]} />
            <meshStandardMaterial map={assets.kapraoTex} roughness={0.30} />
          </mesh>
          {/* ชิ้นไก่สับผัดกะเพรา 3D นูนสมจริง */}
          {[
            [0.025, 0.056, -0.02], [0.058, 0.054, 0.012], [0.035, 0.058, 0.034],
            [0.068, 0.048, -0.025], [0.018, 0.052, 0.048], [0.072, 0.046, 0.038],
          ].map(([x, y, z], i) => (
            <mesh key={`kp_m_${i}`} position={[x, y, z]} scale={[1.2, 0.75, 1.0]}>
              <sphereGeometry args={[0.013, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#c97a3a' : '#ad5e22'} roughness={0.32} />
            </mesh>
          ))}
          {/* ใบกะเพราเขียวเข้ม + พริกแดงหั่น */}
          {[
            [0.038, 0.064, 0.002, 0.4], [0.065, 0.058, 0.022, 1.3],
            [0.020, 0.062, -0.032, 2.2], [0.052, 0.060, -0.040, -0.6],
            [0.046, 0.057, 0.052, 0.9],
          ].map(([x, y, z, r], i) => (
            <mesh key={`basil_${i}`} position={[x, y, z]} rotation={[0.18, r, 0.12]} scale={[1.7, 0.15, 0.85]}>
              <sphereGeometry args={[0.013, 10, 6]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#166534' : '#15803d'} roughness={0.38} />
            </mesh>
          ))}
          {[
            [0.048, 0.065, 0.015, 0.5], [0.028, 0.063, 0.026, -0.8], [0.066, 0.056, -0.008, 1.1],
          ].map(([x, y, z, r], i) => (
            <mesh key={`chili_${i}`} position={[x, y, z]} rotation={[0, r, Math.PI / 2]}>
              <cylinderGeometry args={[0.003, 0.0025, 0.016, 6]} />
              <meshStandardMaterial color="#dc2626" roughness={0.28} />
            </mesh>
          ))}
          {/* ไข่ดาวกรอบไข่แดงเยิ้มวางเคียงบนข้าว */}
          <group position={[-0.036, 0.063, -0.036]} rotation={[0.14, 0.2, -0.18]}>
            <mesh scale={[1.15, 0.16, 1.0]}>
              <sphereGeometry args={[0.040, 16, 10]} />
              <meshStandardMaterial color="#fffdf7" roughness={0.35} />
            </mesh>
            <mesh position={[0.003, 0.006, 0.002]} scale={[1, 0.58, 1]}>
              <sphereGeometry args={[0.017, 14, 10]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.14} />
            </mesh>
          </group>
          <MetalSpoon position={[0.122, 0.036, 0.065]} rotation={[0, -0.45, -0.08]} />
        </group>
      );

    // 2. ไก่ทอดกรอบ (น่องไก่และปีกไก่ทอดสีทอง)
    case 'friedchicken':
      return (
        <group>
          <PorcelainPlate />
          {/* ใบผักกาดหอมรองจาน */}
          {[-0.6, 0.4, 1.5, 2.6].map((a, i) => (
            <mesh
              key={`let_${i}`}
              position={[Math.cos(a) * 0.078, 0.016, Math.sin(a) * 0.078]}
              rotation={[0.08, -a, 0]}
              scale={[1.4, 0.12, 1.0]}
            >
              <sphereGeometry args={[0.046, 12, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#4ade80' : '#22c55e'} roughness={0.55} />
            </mesh>
          ))}
          {/* น่องไก่ทอดกรอบพร้อมกระดูกปลายขาว 6 ชิ้นเรียงซ้อนพูนจาน */}
          {[
            [-0.038, 0.038, 0.028, 0.35, 0.12],
            [0.040, 0.038, 0.025, 2.55, -0.1],
            [0.005, 0.038, -0.048, -1.2, 0.14],
            [-0.048, 0.036, -0.032, 0.95, 0.08],
            [0.046, 0.036, -0.024, -2.2, 0.1],
            [-0.002, 0.068, 0.002, 0.75, 0.22],
          ].map(([x, y, z, ry, rz], i) => (
            <group key={`drum_${i}`} position={[x, y, z]} rotation={[0, ry, rz]}>
              {/* เนื้อน่องไก่ชุบแป้งทอดสีทองกรอบ */}
              <mesh scale={[1.38, 0.88, 0.94]} castShadow>
                <sphereGeometry args={[0.036, 14, 12]} />
                <meshStandardMaterial map={assets.friedBatterTex} roughness={0.46} />
              </mesh>
              {/* ข้อกระดูกน่องไก่สีครีมขาว */}
              <mesh position={[0.050, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.0065, 0.0085, 0.032, 8]} />
                <meshStandardMaterial color="#f5efe0" roughness={0.4} />
              </mesh>
              <mesh position={[0.066, 0, 0.005]}>
                <sphereGeometry args={[0.0075, 8, 8]} />
                <meshStandardMaterial color="#faf5e8" roughness={0.4} />
              </mesh>
              <mesh position={[0.066, 0, -0.005]}>
                <sphereGeometry args={[0.0075, 8, 8]} />
                <meshStandardMaterial color="#faf5e8" roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      );

    // 3. ก๋วยเตี๋ยวหมูน้ำใส (น้ำซุปใส เส้นก๋วยเตี๋ยว ลูกชิ้นหมู เกี๊ยว ต้นหอมซอย)
    case 'noodle':
      return (
        <group>
          <PorcelainBowl />
          {/* ผิวน้ำซุปใสเห็นเส้นก๋วยเตี๋ยวด้านล่าง */}
          <mesh position={[0, 0.060, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.137, 28]} />
            <meshStandardMaterial map={assets.noodleBrothTex} roughness={0.12} metalness={0.05} />
          </mesh>
          {/* เกี๊ยว/ฮะเก๋าขาวจับจีบตรงกลางชาม (ตรงตามภาพ ward101_foodtable.jpg) */}
          <group position={[0, 0.064, -0.004]}>
            <mesh scale={[1.1, 0.72, 1.1]} castShadow>
              <sphereGeometry args={[0.030, 14, 10]} />
              <meshStandardMaterial color="#fffaf0" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.020, 0]}>
              <coneGeometry args={[0.014, 0.014, 8]} />
              <meshStandardMaterial color="#f5ebd6" roughness={0.4} />
            </mesh>
          </group>
          {/* ลูกชิ้นหมูเด้ง 5 ลูก */}
          {[
            [-0.062, 0.036], [0.064, 0.028], [-0.048, -0.056],
            [0.052, -0.052], [0.004, 0.072],
          ].map(([x, z], i) => (
            <mesh key={`mb_${i}`} position={[x, 0.062, z]} scale={[1, 0.85, 1]} castShadow>
              <sphereGeometry args={[0.021, 12, 10]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#dfd2c5' : '#d6c6b8'} roughness={0.32} />
            </mesh>
          ))}
          {/* หมูชิ้นลวก + ต้นหอมผักชีซอยสีเขียวสด */}
          {[
            [-0.078, -0.01, 0.4], [0.074, -0.014, -0.5], [-0.012, -0.074, 1.1],
          ].map(([x, z, r], i) => (
            <mesh key={`pk_${i}`} position={[x, 0.062, z]} rotation={[0.1, r, 0]} scale={[1.5, 0.22, 0.9]}>
              <sphereGeometry args={[0.018, 10, 8]} />
              <meshStandardMaterial color="#cbb29e" roughness={0.42} />
            </mesh>
          ))}
          {[
            [-0.035, 0.018], [0.038, 0.012], [-0.024, -0.034], [0.028, -0.030],
            [0.046, 0.062], [-0.055, 0.066], [-0.088, 0.025],
          ].map(([x, z], i) => (
            <mesh key={`sc_${i}`} position={[x, 0.064, z]} rotation={[Math.PI / 2, 0, i]}>
              <torusGeometry args={[0.008, 0.0028, 6, 12]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#16a34a' : '#22c55e'} roughness={0.3} />
            </mesh>
          ))}
          <CeramicSoupSpoon />
        </group>
      );

    // 4. ส้มตำปลาร้า (เส้นมะละกอ มะเขือเทศ ถั่วฝักยาว พริก ผักกะหล่ำเคียง)
    case 'somtam':
      return (
        <group>
          <PorcelainPlate />
          {/* ผักกะหล่ำปลีสดวางเคียงขอบจาน */}
          <mesh position={[-0.088, 0.026, -0.048]} rotation={[0.2, 0.6, -0.25]} scale={[1.3, 0.35, 1.1]}>
            <sphereGeometry args={[0.044, 12, 8]} />
            <meshStandardMaterial color="#bbf7d0" roughness={0.45} />
          </mesh>
          {/* พูนเส้นมะละกอตำปลาร้าฉ่ำๆ */}
          <mesh position={[0.012, 0.035, 0.008]} scale={[1.28, 0.56, 1.24]} castShadow>
            <sphereGeometry args={[0.078, 18, 14]} />
            <meshStandardMaterial map={assets.somtamTex} roughness={0.28} />
          </mesh>
          {/* มะเขือเทศสีดาผ่าซีก 4 ชิ้น */}
          {[
            [-0.042, 0.056, 0.045, 0.4], [0.058, 0.054, 0.032, -0.7],
            [0.022, 0.072, -0.025, 1.2], [-0.025, 0.052, -0.058, -1.5],
          ].map(([x, y, z, r], i) => (
            <mesh key={`tom_${i}`} position={[x, y, z]} rotation={[0.3, r, 0.2]} scale={[1.25, 0.65, 0.75]}>
              <sphereGeometry args={[0.019, 10, 8]} />
              <meshStandardMaterial color="#ef4444" roughness={0.18} />
            </mesh>
          ))}
          {/* ถั่วฝักยาวหั่นท่อนสีเขียวสด 6 ท่อน */}
          {[
            [-0.015, 0.068, 0.028, 0.6], [0.045, 0.064, -0.018, -0.5],
            [-0.048, 0.054, -0.012, 1.4], [0.018, 0.058, 0.062, 0.2],
            [0.068, 0.048, -0.042, 0.9], [0.002, 0.078, 0.002, -0.9],
          ].map(([x, y, z, r], i) => (
            <mesh key={`bean_${i}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, r]}>
              <cylinderGeometry args={[0.0048, 0.0048, 0.038, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.35} />
            </mesh>
          ))}
          {/* พริกแดงตำ */}
          {[
            [0.032, 0.074, 0.015, 0.3], [-0.028, 0.068, -0.028, -1.1],
          ].map(([x, y, z, r], i) => (
            <mesh key={`st_ch_${i}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, r]}>
              <coneGeometry args={[0.0045, 0.026, 7]} />
              <meshStandardMaterial color="#dc2626" roughness={0.25} />
            </mesh>
          ))}
        </group>
      );

    // 5. ผลไม้สด (กล้วยหอมโค้ง • มะละกอสุกผ่าครึ่งเห็นเม็ด • แก้วมังกรเนื้อขาวเม็ดดำเปลือกชมพู)
    case 'fruit':
      return (
        <group>
          <PorcelainPlate />
          {/* ใบตองสีเขียวสดรองผลไม้บนจาน */}
          <mesh position={[0, 0.0125, 0]} rotation={[-Math.PI / 2, 0, 0.3]}>
            <circleGeometry args={[0.132, 22]} />
            <meshStandardMaterial color="#15803d" roughness={0.42} />
          </mesh>
          {/* 1) กล้วยหอมทองทรงโค้งจริง 2 ลูก */}
          {[
            [-0.045, 0.010, 0.048, 0.25],
            [-0.052, 0.024, 0.016, 0.42],
          ].map(([x, y, z, ry], i) => (
            <group key={`ban_${i}`} position={[x, y, z]} rotation={[0, ry, 0]}>
              <mesh geometry={assets.bananaGeo} castShadow>
                <meshStandardMaterial color={i === 0 ? '#facc15' : '#fde047'} roughness={0.36} />
              </mesh>
              <mesh position={[-0.077, 0.028, -0.019]}>
                <sphereGeometry args={[0.0055, 6, 6]} />
                <meshStandardMaterial color="#451a03" roughness={0.7} />
              </mesh>
              <mesh position={[0.076, 0.033, -0.015]}>
                <cylinderGeometry args={[0.004, 0.005, 0.014, 6]} />
                <meshStandardMaterial color="#65a30d" roughness={0.6} />
              </mesh>
            </group>
          ))}
          {/* 2) มะละกอสุกสีส้มสดผ่าครึ่งพร้อมโพรงเม็ดสีดำตรงกลาง */}
          <group position={[0.008, 0.032, -0.056]} rotation={[0, -0.22, 0]}>
            {/* เปลือกนอกอมส้มเขียว */}
            <mesh scale={[1.65, 0.62, 0.95]} castShadow>
              <sphereGeometry args={[0.048, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial color="#d97706" roughness={0.45} side={THREE.DoubleSide} />
            </mesh>
            {/* เนื้อมะละกอสุกสีส้มฉ่ำด้านบน */}
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.64, 0.94, 1]}>
              <circleGeometry args={[0.047, 20]} />
              <meshStandardMaterial color="#fb923c" roughness={0.25} />
            </mesh>
            {/* โพรงเม็ดมะละกอสีดำมันวาวตรงกลาง */}
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.45, 0.62, 1]}>
              <circleGeometry args={[0.019, 14]} />
              <meshStandardMaterial color="#29150c" roughness={0.2} />
            </mesh>
            {[-0.014, -0.005, 0.005, 0.014, 0, -0.009, 0.009].map((sx, si) => (
              <mesh key={`pseed_${si}`} position={[sx, 0.004, (si % 2 === 0 ? 1 : -1) * 0.004]}>
                <sphereGeometry args={[0.0038, 6, 6]} />
                <meshStandardMaterial color="#18181b" roughness={0.12} />
              </mesh>
            ))}
          </group>
          {/* 3) แก้วมังกรผ่าครึ่งเปลือกชมพูบานเย็น เนื้อขาวเม็ดงาดำ 2 ชิ้น */}
          {[
            [0.066, 0.038, 0.024, 0.35, -0.35],
            [0.098, 0.034, -0.018, -0.2, 0.2],
          ].map(([x, y, z, rx, rz], i) => (
            <group key={`df_${i}`} position={[x, y, z]} rotation={[rx, 0.3, rz]}>
              <mesh castShadow>
                <sphereGeometry args={[0.040, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                <meshStandardMaterial color="#e11d48" roughness={0.38} side={THREE.DoubleSide} />
              </mesh>
              {i === 0 && (
                <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.0395, 22]} />
                  <meshStandardMaterial map={assets.dragonFruitTex} roughness={0.28} />
                </mesh>
              )}
              {/* กลีบเปลือกแก้วมังกรปลายเขียวเล็กๆ */}
              {[-0.8, 0, 0.8].map((ga, gi) => (
                <mesh
                  key={`scale_${gi}`}
                  position={[Math.cos(ga) * 0.038, -0.012, Math.sin(ga) * 0.038]}
                  rotation={[0.4, -ga, 0.5]}
                >
                  <coneGeometry args={[0.006, 0.018, 5]} />
                  <meshStandardMaterial color="#84cc16" roughness={0.5} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );

    // 6. เค้กช็อกโกแลตหน้านิ่มสลับชั้นครีมกานาช (5 ชั้นจริง!)
    case 'cake':
      return (
        <group>
          <PorcelainPlate dessert />
          <group position={[-0.062, 0.011, 0.004]} rotation={[0, 0.15, 0]}>
            {/* ชั้นสปันจ์ช็อกโกแลต 3 ชั้น สลับชั้นครีมช็อกโกแลตกานาช 2 ชั้น */}
            <mesh position={[0, 0.000, 0]} geometry={assets.cakeSpongeGeo} castShadow>
              <meshStandardMaterial color="#32180e" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.013, 0]} geometry={assets.cakeCreamGeo}>
              <meshStandardMaterial color="#7c452b" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.019, 0]} geometry={assets.cakeSpongeGeo} castShadow>
              <meshStandardMaterial color="#32180e" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.032, 0]} geometry={assets.cakeCreamGeo}>
              <meshStandardMaterial color="#7c452b" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.038, 0]} geometry={assets.cakeSpongeGeo} castShadow>
              <meshStandardMaterial color="#32180e" roughness={0.78} />
            </mesh>
            {/* หน้าช็อกโกแลตหน้านิ่มมันวาวด้านบน */}
            <mesh position={[0, 0.051, 0]} geometry={assets.cakeGlazeTopGeo}>
              <meshStandardMaterial color="#1f0d07" roughness={0.16} metalness={0.06} />
            </mesh>
            {/* ครีมบีบแต่งหน้าเค้ก + เชอร์รี่ช็อกโกแลต & ใบมินต์ */}
            <mesh position={[0.088, 0.061, 0]} scale={[1, 0.65, 1]}>
              <sphereGeometry args={[0.015, 12, 10]} />
              <meshStandardMaterial color="#5c2f1c" roughness={0.3} />
            </mesh>
            <mesh position={[0.088, 0.072, 0]}>
              <sphereGeometry args={[0.0085, 10, 10]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.14} />
            </mesh>
            <mesh position={[0.076, 0.063, 0.012]} rotation={[0.2, 0.5, 0.2]} scale={[1.6, 0.16, 0.8]}>
              <sphereGeometry args={[0.008, 8, 6]} />
              <meshStandardMaterial color="#16a34a" roughness={0.35} />
            </mesh>
          </group>
          <MetalSpoon position={[0.062, 0.025, 0.065]} rotation={[0, -0.35, -0.06]} />
        </group>
      );

    // 7. นมรสจืด (แก้วใสพร้อมนมสดสีขาวครีมเห็นขอบแก้วด้านบนและฐานแก้วคริสตัล)
    case 'milk':
      return (
        <group>
          <ClearGlassTumbler height={0.165} topR={0.050} botR={0.040} coasterColor="#fff5f8" />
          {/* น้ำนมสดสีขาวนวลภายในแก้วใส */}
          <mesh position={[0, 0.027 + 0.126 / 2, 0]}>
            <cylinderGeometry args={[0.0465, 0.0385, 0.126, 24]} />
            <meshStandardMaterial color="#fffdf8" roughness={0.20} />
          </mesh>
          {/* วงขอบผิวน้ำนมด้านบน */}
          <mesh position={[0, 0.027 + 0.1265, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.0455, 0.0016, 8, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.15} />
          </mesh>
        </group>
      );

    // 8. ชานมไข่มุก (แก้วใสทรงสูง + ชานมสีคาราเมล + เม็ดไข่มุกสีดำก้นแก้ว + น้ำแข็ง + หลอดไข่มุกสีดำ)
    case 'bubbletea':
      return (
        <group>
          <ClearGlassTumbler height={0.185} topR={0.055} botR={0.041} coasterColor="#fef3c7" />
          {/* น้ำชานมสีน้ำตาลคาราเมลหอมมัน */}
          <mesh position={[0, 0.027 + 0.144 / 2, 0]}>
            <cylinderGeometry args={[0.0505, 0.039, 0.144, 24]} />
            <meshStandardMaterial color="#cc8e5e" roughness={0.24} />
          </mesh>
          {/* เม็ดไข่มุกสีดำมันวาวเรียงรอบก้นแก้วใส มองทะลุแก้วเห็นชัดเจน! */}
          {Array.from({ length: 22 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const a = ((i % 8) / 8) * Math.PI * 2 + row * 0.42;
            const rr = 0.0325 + row * 0.0018;
            return (
              <mesh
                key={`boba_${i}`}
                position={[Math.cos(a) * rr, 0.036 + row * 0.0155, Math.sin(a) * rr]}
              >
                <sphereGeometry args={[0.0078, 8, 8]} />
                <meshStandardMaterial color="#1c0f0a" roughness={0.15} />
              </mesh>
            );
          })}
          {/* ก้อนน้ำแข็งลอยด้านบนชานม */}
          {[
            [-0.016, 0.170, 0.012, 0.25],
            [0.015, 0.169, -0.010, -0.35],
            [-0.004, 0.171, -0.018, 0.5],
          ].map(([x, y, z, r], i) => (
            <mesh key={`ice_${i}`} position={[x, y, z]} rotation={[r, r * 1.4, -r]}>
              <boxGeometry args={[0.018, 0.014, 0.018]} />
              <meshStandardMaterial color="#fffbeb" transparent opacity={0.72} roughness={0.08} />
            </mesh>
          ))}
          {/* หลอดดูดไข่มุกขนาดใหญ่สีดำปักเอียงพ้นปากแก้ว */}
          <mesh position={[0.018, 0.148, -0.008]} rotation={[0.08, 0, -0.21]} castShadow>
            <cylinderGeometry args={[0.0082, 0.0082, 0.235, 14]} />
            <meshStandardMaterial color="#18181b" roughness={0.22} />
          </mesh>
        </group>
      );

    // 9. ต้มจืดผักรวมเต้าหู้ไข่ (ชามซุปใส เต้าหู้ไข่ แครอท บรอกโคลี ผักกาดขาว)
    case 'soup':
      return (
        <group>
          <PorcelainBowl />
          {/* ผิวน้ำซุปต้มจืดสีทองใส */}
          <mesh position={[0, 0.060, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.137, 28]} />
            <meshStandardMaterial map={assets.veggieSoupTex} roughness={0.12} />
          </mesh>
          {/* เต้าหู้ไข่หั่นแว่นสีเหลืองนวล 4 ชิ้น */}
          {[
            [-0.048, 0.038, 0.12], [0.052, 0.032, -0.15],
            [-0.015, -0.052, 0.08], [0.042, -0.048, -0.1],
          ].map(([x, z, rx], i) => (
            <mesh key={`tofu_${i}`} position={[x, 0.061, z]} rotation={[rx, i, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.014, 16]} />
              <meshStandardMaterial color="#fde68a" roughness={0.32} />
            </mesh>
          ))}
          {/* แครอทหั่นแว่นสีส้มสด 4 ชิ้น */}
          {[
            [0.008, 0.015], [-0.068, -0.015], [0.068, -0.008], [-0.022, 0.072],
          ].map(([x, z], i) => (
            <mesh key={`car_${i}`} position={[x, 0.062, z]} rotation={[0.15, i, -0.1]}>
              <cylinderGeometry args={[0.017, 0.017, 0.010, 12]} />
              <meshStandardMaterial color="#f97316" roughness={0.28} />
            </mesh>
          ))}
          {/* บรอกโคลี & ผักกาดขาวสีเขียวสด */}
          {[
            [-0.026, -0.012, '#16a34a'], [0.028, 0.058, '#22c55e'],
            [-0.058, -0.055, '#15803d'], [0.016, -0.026, '#4ade80'],
            [-0.004, 0.045, '#bbf7d0'],
          ].map(([x, z, col], i) => (
            <mesh key={`veg_${i}`} position={[x, 0.064, z]} scale={[1.15, 0.72, 1.0]}>
              <sphereGeometry args={[0.020, 10, 8]} />
              <meshStandardMaterial color={col} roughness={0.42} />
            </mesh>
          ))}
          <CeramicSoupSpoon />
        </group>
      );

    // 10. ผัดผักใบเขียวน้ำมันหอย (ก้านและใบผักสีเขียวสดมันวาว + กระเทียมเจียว + พริกแดง)
    case 'greens':
      return (
        <group>
          <PorcelainPlate />
          {/* ฐานซอสผัดน้ำมันหอยและใบผัก */}
          <mesh position={[0, 0.026, 0]} scale={[1.35, 0.36, 1.32]} castShadow>
            <sphereGeometry args={[0.082, 18, 12]} />
            <meshStandardMaterial map={assets.greensTex} roughness={0.24} />
          </mesh>
          {/* ก้านผักกรอบสีเขียวสด + ใบผักเข้มผัดมันวาวเรียงซ้อนเป็นธรรมชาติ */}
          {[
            [-0.04, 0.042, 0.02, 0.4], [0.03, 0.045, 0.03, -0.6],
            [-0.01, 0.048, -0.03, 1.1], [0.05, 0.040, -0.02, 0.2],
            [-0.05, 0.038, -0.04, -1.2], [0.01, 0.054, 0.01, 0.8],
            [-0.02, 0.046, 0.06, -0.3], [0.04, 0.042, 0.05, 1.5],
          ].map(([x, y, z, r], i) => (
            <group key={`grn_${i}`} position={[x, y, z]} rotation={[0.12, r, 0.1]}>
              {/* ก้านผัก */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.0055, 0.007, 0.068, 8]} />
                <meshStandardMaterial color="#4ade80" roughness={0.26} />
              </mesh>
              {/* ใบผักมันวาว */}
              <mesh position={[0.014, 0.004, 0.018]} scale={[1.8, 0.16, 0.95]}>
                <sphereGeometry args={[0.018, 10, 6]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#14532d' : '#166534'} roughness={0.22} />
              </mesh>
            </group>
          ))}
          {/* กระเทียมสับเจียวสีเหลืองทอง & พริกแดงหั่นแฉลบ */}
          {[
            [-0.018, 0.058, 0.012], [0.024, 0.055, -0.014], [0.005, 0.060, -0.028],
            [-0.035, 0.050, -0.010], [0.038, 0.050, 0.022],
          ].map(([x, y, z], i) => (
            <mesh key={`gar_${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshStandardMaterial color={i === 4 ? '#ef4444' : '#fde047'} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );

    // 11. น้ำเปล่าสะอาด (แก้วใสคริสตัลเห็นระดับผิวน้ำใสสะท้อนแสงจริง)
    case 'water':
      return (
        <group>
          <ClearGlassTumbler height={0.162} topR={0.050} botR={0.040} coasterColor="#e0f2fe" />
          {/* มวลน้ำดื่มใสบริสุทธิ์ภายในแก้ว */}
          <mesh position={[0, 0.027 + 0.122 / 2, 0]} renderOrder={1}>
            <cylinderGeometry args={[0.0465, 0.0385, 0.122, 24]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.38} roughness={0.04} metalness={0.08} />
          </mesh>
          {/* ผิวน้ำด้านบนและวงแหวน Meniscus สะท้อนแสง */}
          <mesh position={[0, 0.027 + 0.122, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
            <circleGeometry args={[0.0465, 24]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.62} roughness={0.03} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.027 + 0.1225, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
            <torusGeometry args={[0.046, 0.0018, 8, 24]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.78} roughness={0.05} />
          </mesh>
        </group>
      );

    // 12. บะหมี่กึ่งสำเร็จรูป (ชามราเมง + เส้นบะหมี่หยักสีเหลืองทอง 3D + ตะเกียบไม้)
    case 'instant':
    default:
      return (
        <group>
          <PorcelainBowl ribbed />
          {/* ก้อนเส้นบะหมี่กึ่งสำเร็จรูปลายเส้นหยักคมชัด */}
          <mesh position={[0, 0.046, 0]} scale={[1.28, 0.44, 1.28]} castShadow>
            <sphereGeometry args={[0.102, 22, 14]} />
            <meshStandardMaterial map={assets.ramenTex} roughness={0.38} />
          </mesh>
          {/* เส้นบะหมี่หยัก 3D โค้งนูนด้านบนชามเพิ่มมิติสมจริง */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r = (i % 3) * 0.028 + 0.022;
            return (
              <mesh
                key={`curl_${i}`}
                position={[Math.cos(a) * r, 0.068 + (i % 2) * 0.004, Math.sin(a) * r]}
                rotation={[Math.PI / 2 + 0.2 * Math.sin(i), 0.3 * Math.cos(i), a]}
              >
                <torusGeometry args={[0.020, 0.0042, 6, 12, Math.PI * 1.15]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#fbbf24'} roughness={0.36} />
              </mesh>
            );
          })}
          {/* ตะเกียบไม้ไผ่ 1 คู่วางพาดขอบชาม */}
          <group position={[0.02, 0.090, 0.075]} rotation={[0, 0.25, 0]}>
            <mesh position={[0, 0, -0.010]} rotation={[0, 0.03, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.0032, 0.0052, 0.24, 8]} />
              <meshStandardMaterial color="#c68b59" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0, 0.010]} rotation={[0, -0.03, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.0032, 0.0052, 0.24, 8]} />
              <meshStandardMaterial color="#c68b59" roughness={0.45} />
            </mesh>
          </group>
        </group>
      );
  }
}
