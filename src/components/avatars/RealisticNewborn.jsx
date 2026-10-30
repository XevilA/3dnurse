import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * RealisticNewborn — ทารกแรกเกิดสัดส่วนสมจริง (ศีรษะใหญ่ ขาพับท่า frog, แก้มอ้วน, หู, ผมบาง)
 *
 * พิกัด: ทารกนอนหงายตามแนวแกน Z (ศีรษะที่ -Z, เท้าที่ +Z), หน้าหงายขึ้น +Y, พื้นที่ y = 0
 *
 * pose:
 *  - 'swaddle'     ห่อตัวนอนหลับ (ใส่หมวก)
 *  - 'diaperChange' เปลี่ยนผ้าอ้อม — เปิดผ้าอ้อม ยกขา วางบนผ้าอ้อมใหม่ (มีสะดือ+คลิปหนีบ)
 *  - 'diaperOn'    สวมผ้าอ้อมแล้ว (พับขอบใต้สะดือ)
 *  - 'bathing'     แช่ในกาบะมัง/อ่างอาบน้ำ ผิวเปียก มีฟองสบู่
 *  - 'towelWrap'   ห่อตัวด้วยผ้าขนหนูมีฮู้ด
 *  - 'dressed'     ชุดนอนเด็ก (เสื้อกระดุมแป้ก + กางเกงติดเท้า) ใส่หมวก
 */

const SKIN = '#f3c2a4';
const SKIN_PINK = '#eba593';
const SKIN_DARK = '#d98f7c';

/* ── texture helpers ─────────────────────────────────────────────── */
function useCanvasTexture(draw, w = 256, h = 256, repeat = [1, 1]) {
  const tex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (tex) tex.dispose();
    };
  }, [tex]);

  return tex;
}

const drawStars = (base, accent) => (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  g.fillStyle = accent;
  const star = (x, y, r) => {
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    g.closePath(); g.fill();
  };
  star(64, 64, 22); star(192, 128, 18); star(64, 192, 16); star(200, 36, 10); star(128, 224, 10);
  g.beginPath(); g.arc(150, 60, 9, 0, Math.PI * 2); g.fill();
};

const drawTerry = (base) => (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * w; const y = Math.random() * h;
    g.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.07)';
    g.beginPath(); g.arc(x, y, 1.6 + Math.random() * 1.6, 0, Math.PI * 2); g.fill();
  }
};

const drawFeatheredBabyHair = (wet = false) => (g, w, h) => {
  g.clearRect(0, 0, w, h);
  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0.0, wet ? 'rgba(38, 24, 18, 0.90)' : 'rgba(66, 43, 31, 0.85)');
  grad.addColorStop(0.55, wet ? 'rgba(46, 30, 22, 0.72)' : 'rgba(78, 52, 38, 0.65)');
  grad.addColorStop(0.84, 'rgba(92, 62, 46, 0.22)');
  grad.addColorStop(1.0, 'rgba(92, 62, 46, 0.0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  for (let i = 0; i < 420; i++) {
    const x0 = (i / 420) * w + Math.sin(i * 3.7) * 4;
    const swerve = Math.sin(i * 1.9) * 10;
    const len = h * (0.68 + ((i * 29) % 32) / 100);
    const strandGrad = g.createLinearGradient(x0, 0, x0 + swerve, len);
    strandGrad.addColorStop(0, 'rgba(38, 24, 17, 0.50)');
    strandGrad.addColorStop(0.75, 'rgba(68, 44, 32, 0.30)');
    strandGrad.addColorStop(1, 'rgba(68, 44, 32, 0.0)');
    g.strokeStyle = strandGrad;
    g.lineWidth = 1.1 + (i % 3) * 0.45;
    g.beginPath();
    g.moveTo(x0, 0);
    g.quadraticCurveTo(x0 + swerve * 0.5, len * 0.55, x0 + swerve, len);
    g.stroke();
  }
};

const drawSoftCheekBlush = () => (g, w, h) => {
  g.clearRect(0, 0, w, h);
  const rad = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w * 0.48);
  rad.addColorStop(0.0, 'rgba(244, 132, 132, 0.40)');
  rad.addColorStop(0.55, 'rgba(244, 145, 140, 0.16)');
  rad.addColorStop(1.0, 'rgba(244, 145, 140, 0.0)');
  g.fillStyle = rad;
  g.fillRect(0, 0, w, h);
};

/* ── primitives ──────────────────────────────────────────────────── */
const _up = new THREE.Vector3(0, 1, 0);
/** tapered limb segment between two points (+ end caps) */
function Limb({ a, b, r0, r1, color = SKIN, mat = {}, map = null, caps = true }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a); const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va); const l = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(_up, d.clone().normalize());
    return { pos: va.clone().add(vb).multiplyScalar(0.5).toArray(), quat: q, len: l };
  }, [a, b]);
  return (
    <group>
      <mesh position={pos} quaternion={quat} castShadow>
        <cylinderGeometry args={[r1, r0, len, 20]} />
        <meshStandardMaterial color={color} map={map} roughness={0.7} {...mat} />
      </mesh>
      {caps && (
        <>
          <mesh position={a} castShadow><sphereGeometry args={[r0, 20, 16]} /><meshStandardMaterial color={color} map={map} roughness={0.7} {...mat} /></mesh>
          <mesh position={b} castShadow><sphereGeometry args={[r1, 20, 16]} /><meshStandardMaterial color={color} map={map} roughness={0.7} {...mat} /></mesh>
        </>
      )}
    </group>
  );
}

function Skin({ color = SKIN, wet = false }) {
  return <meshPhysicalMaterial color={color} roughness={wet ? 0.28 : 0.62} sheen={0.8} sheenColor="#ffd9c7" sheenRoughness={0.5} clearcoat={wet ? 0.7 : 0} clearcoatRoughness={0.3} />;
}

function Ellipsoid({ p, s, color = SKIN, wet = false, children, mat }) {
  return (
    <mesh position={p} scale={s} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 24]} />
      {mat || <Skin color={color} wet={wet} />}
      {children}
    </mesh>
  );
}

/* ── head (lifelike sculpted newborn baby face + feathered wispy baby hair) ── */
function Head({ wet = false, beanie = null, eyes = 'closed', mouth = 'rest' }) {
  const hair = wet ? '#241812' : '#4a3123';
  const hairTex = useCanvasTexture(drawFeatheredBabyHair(wet), 512, 256, [2, 1]);
  const blushTex = useCanvasTexture(drawSoftCheekBlush(), 128, 128, [1, 1]);

  return (
    <group>
      {/* Unified smooth cranium & lower face (same warm SKIN tone so there are zero harsh seam lines!) */}
      <Ellipsoid p={[0, 0.005, -0.004]} s={[0.084, 0.089, 0.092]} wet={wet} />
      {/* Soft rounded baby cheeks blended smoothly into cranium */}
      <Ellipsoid p={[-0.044, -0.026, 0.056]} s={[0.040, 0.036, 0.034]} color={SKIN} wet={wet} />
      <Ellipsoid p={[0.044, -0.026, 0.056]} s={[0.040, 0.036, 0.034]} color={SKIN} wet={wet} />
      {/* Smooth baby chin & jaw contour */}
      <Ellipsoid p={[0, -0.058, 0.050]} s={[0.038, 0.026, 0.030]} color={SKIN} wet={wet} />

      {/* Airbrushed radial rosy cheek blush */}
      {[-0.048, 0.048].map((x) => (
        <mesh key={x} position={[x, -0.022, 0.084]} rotation={[0.1, x < 0 ? -0.42 : 0.42, 0]}>
          <planeGeometry args={[0.044, 0.036]} />
          <meshBasicMaterial map={blushTex} transparent depthWrite={false} />
        </mesh>
      ))}

      {/* Expressive Newborn Eyes (Flush almond eye contour, soft upper eyelid hood, large warm dark irises + catchlights) */}
      {[-1, 1].map((sx) => (
        <group key={sx} position={[sx * 0.029, 0.008, 0.0795]} rotation={[-0.04, sx * 0.28, sx * -0.04]}>
          {eyes === 'closed' ? (
            <>
              <Ellipsoid p={[0, 0.001, 0.003]} s={[0.016, 0.007, 0.005]} color="#efb9a3" wet={wet} />
              <mesh position={[0, -0.0015, 0.0068]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.0125, 0.0012, 8, 22, Math.PI * 0.82]} />
                <meshStandardMaterial color="#422c23" roughness={0.55} />
              </mesh>
            </>
          ) : (
            <>
              {/* Flush Almond Sclera (recessed naturally into eye socket — zero side bulge) */}
              <mesh position={[0, 0, 0.0015]} scale={[1.15, 0.78, 0.42]}>
                <sphereGeometry args={[0.0108, 20, 16]} />
                <meshStandardMaterial color="#fdf8f6" roughness={0.22} />
              </mesh>
              {/* Large warm dark-brown newborn iris */}
              <mesh position={[0, -0.0004, 0.0044]} scale={[1.0, 0.94, 0.32]}>
                <sphereGeometry args={[0.0076, 20, 16]} />
                <meshStandardMaterial color="#361f14" roughness={0.14} />
              </mesh>
              {/* Deep glossy pupil */}
              <mesh position={[0, -0.0004, 0.0062]} scale={[1.0, 0.94, 0.25]}>
                <sphereGeometry args={[0.0043, 16, 12]} />
                <meshStandardMaterial color="#0f172a" roughness={0.08} />
              </mesh>
              {/* Lifelike white corneal catchlight sparkles */}
              <mesh position={[0.0022, 0.002, 0.0075]}>
                <circleGeometry args={[0.0016, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[-0.0018, -0.0018, 0.0074]}>
                <circleGeometry args={[0.0008, 10]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Soft upper baby eyelid hood & lash line */}
              <mesh position={[0, 0.0036, 0.0026]} rotation={[0.18, 0, 0]} scale={[1.18, 0.52, 0.48]}>
                <sphereGeometry args={[0.0112, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
                <meshStandardMaterial color="#efb9a1" roughness={0.65} />
              </mesh>
              <mesh position={[0, 0.0022, 0.0058]} rotation={[-0.12, 0, 0]}>
                <torusGeometry args={[0.0108, 0.0011, 8, 20, Math.PI * 0.86]} />
                <meshStandardMaterial color="#4a2e22" roughness={0.6} />
              </mesh>
            </>
          )}
          {/* Delicate curved baby eyebrow */}
          <mesh position={[0, 0.0155, 0.004]} rotation={[0, 0, sx * -0.08]}>
            <torusGeometry args={[0.0135, 0.0012, 6, 16, Math.PI * 0.62]} />
            <meshStandardMaterial color={hair} transparent opacity={0.45} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Soft sculpted baby button nose */}
      <Ellipsoid p={[0, -0.002, 0.088]} s={[0.0075, 0.011, 0.0075]} color={SKIN} wet={wet} />
      <Ellipsoid p={[0, -0.012, 0.093]} s={[0.0115, 0.009, 0.011]} color="#f1ba9f" wet={wet} />
      {[-0.0045, 0.0045].map((x) => (
        <mesh key={x} position={[x, -0.0165, 0.0975]}>
          <sphereGeometry args={[0.0022, 8, 8]} />
          <meshStandardMaterial color="#c48272" roughness={0.7} />
        </mesh>
      ))}

      {/* Cute rosy Cupid's-bow newborn lips */}
      <Ellipsoid p={[-0.004, -0.034, 0.088]} s={[0.0085, 0.0042, 0.005]} color="#e58c8a" wet={wet} />
      <Ellipsoid p={[0.004, -0.034, 0.088]} s={[0.0085, 0.0042, 0.005]} color="#e58c8a" wet={wet} />
      <Ellipsoid p={[0, -0.0405, 0.087]} s={[0.0115, 0.0052, 0.0055]} color="#ec9997" wet={wet} />
      <mesh position={[0, -0.0372, 0.0912]}>
        <boxGeometry args={[mouth === 'open' ? 0.015 : 0.018, mouth === 'open' ? 0.005 : 0.0011, 0.001]} />
        <meshStandardMaterial color={mouth === 'open' ? '#88343a' : '#b45c62'} />
      </mesh>

      {/* Soft sculpted baby ears */}
      {[-1, 1].map((sx) => (
        <group key={sx} position={[sx * 0.085, -0.008, -0.004]} rotation={[0, sx * 0.15, sx * -0.15]}>
          <Ellipsoid p={[0, 0, 0]} s={[0.008, 0.020, 0.015]} color="#f0b49d" wet={wet} />
          <mesh position={[sx * 0.003, 0, 0.001]} scale={[0.4, 0.85, 0.7]}>
            <sphereGeometry args={[0.010, 12, 12]} />
            <meshStandardMaterial color="#dc9784" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Feathered silky newborn hair tilted BACK (-0.48 rad around X) so forehead & face stay 100% clear and natural */}
      {!beanie && (
        <group rotation={[-0.48, 0, 0]} position={[0, 0.005, -0.005]}>
          <mesh scale={[0.0855 / 0.084, 0.0905 / 0.089, 0.0935 / 0.092]}>
            <sphereGeometry args={[0.0845, 36, 26, 0, Math.PI * 2, 0, Math.PI * 0.50]} />
            <meshStandardMaterial
              map={hairTex}
              transparent
              roughness={0.92}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      {beanie && (
        <group position={[0, 0.012, -0.012]} rotation={[-0.22, 0, 0]}>
          <mesh castShadow scale={[1.04, 1.02, 1.03]}>
            <sphereGeometry args={[0.0905, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.50]} />
            <meshStandardMaterial color={beanie} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.002, 0.002]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.03, 1]}>
            <torusGeometry args={[0.089, 0.010, 12, 40]} />
            <meshStandardMaterial color="#fffaf0" roughness={0.98} />
          </mesh>
          <mesh position={[0, 0.094, -0.004]}>
            <sphereGeometry args={[0.013, 16, 16]} />
            <meshStandardMaterial color="#fffaf0" roughness={1} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ── hands / feet ────────────────────────────────────────────────── */
function Fist({ p, rot = [0, 0, 0], wet = false, side = 1 }) {
  return (
    <group position={p} rotation={rot}>
      <Ellipsoid p={[0, 0, 0]} s={[0.019, 0.017, 0.019]} color={SKIN_PINK} wet={wet} />
      {[-0.0105, -0.0035, 0.0035, 0.0105].map((x, i) => (
        <Ellipsoid key={i} p={[x, 0.012, 0.011 - Math.abs(x) * 0.2]} s={[0.0062, 0.0085, 0.0062]} color={SKIN_PINK} wet={wet} />
      ))}
      <Ellipsoid p={[side * -0.015, 0.002, 0.012]} s={[0.0068, 0.0068, 0.0105]} color={SKIN_PINK} wet={wet} />
    </group>
  );
}
function Foot({ p, rot = [0, 0, 0], wet = false }) {
  return (
    <group position={p} rotation={rot}>
      <Ellipsoid p={[0, 0, 0]} s={[0.0175, 0.012, 0.03]} color={SKIN_PINK} wet={wet} />
      <Ellipsoid p={[0, -0.005, -0.021]} s={[0.012, 0.01, 0.012]} color={SKIN_PINK} wet={wet} />
      {[-0.0105, -0.0052, 0, 0.0052, 0.0105].map((x, i) => (
        <Ellipsoid key={i} p={[x, 0.0015, 0.0325 + (i === 0 || i === 4 ? -0.004 : 0)]} s={[0.0042, 0.0042, 0.0052]} color="#f0b4a2" wet={wet} />
      ))}
    </group>
  );
}

/* ── body-plan presets (supine, frog legs) ───────────────────────── */
const PLAN = {
  rest: {
    armL: { s: [-0.078, 0.066, -0.056], e: [-0.118, 0.05, -0.012], h: [-0.088, 0.078, -0.07] },
    legL: { h: [-0.042, 0.05, 0.15], k: [-0.108, 0.058, 0.205], a: [-0.07, 0.036, 0.262] },
  },
  raised: {
    armL: { s: [-0.078, 0.066, -0.056], e: [-0.125, 0.045, -0.04], h: [-0.1, 0.07, -0.098] },
    legL: { h: [-0.042, 0.05, 0.15], k: [-0.075, 0.135, 0.205], a: [-0.045, 0.2, 0.15] },
  },
};
const mirror = (v) => [-v[0], v[1], v[2]];

function Body({ plan = 'rest', wet = false, cloth = null, clothMap = null, diaper = false, cordClamp = false, exposeNavel = true }) {
  const P = PLAN[plan];
  const R = (c) => c;
  const clothed = !!cloth;
  const sleeve = 0.007;
  const clothMat = { roughness: 0.92, map: clothMap };
  return (
    <group>
      {/* neck + torso (breathing group) */}
      <Ellipsoid p={[0, 0.048, -0.104]} s={[0.028, 0.03, 0.026]} wet={wet} />
      {!clothed && (
        <>
          <Ellipsoid p={[0, 0.06, -0.036]} s={[0.088, 0.056, 0.076]} wet={wet} />
          <Ellipsoid p={[0, 0.056, 0.058]} s={[0.082, 0.056, 0.086]} wet={wet} />
          {/* collarbones hint */}
          <Ellipsoid p={[-0.03, 0.108, -0.07]} s={[0.026, 0.005, 0.006]} color="#eeb59f" wet={wet} />
          <Ellipsoid p={[0.03, 0.108, -0.07]} s={[0.026, 0.005, 0.006]} color="#eeb59f" wet={wet} />
          {/* nipples */}
          {[-0.035, 0.035].map((x) => <Ellipsoid key={x} p={[x, 0.113, -0.018]} s={[0.006, 0.003, 0.006]} color="#d98f7c" />)}
        </>
      )}
      {clothed && (
        <>
          <Ellipsoid p={[0, 0.062, -0.034]} s={[0.097, 0.064, 0.086]} mat={<meshStandardMaterial color={cloth} {...clothMat} />} />
          <Ellipsoid p={[0, 0.058, 0.062]} s={[0.092, 0.063, 0.095]} mat={<meshStandardMaterial color={cloth} {...clothMat} />} />
          {/* crew collar */}
          <mesh position={[0, 0.088, -0.083]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
            <torusGeometry args={[0.04, 0.0085, 12, 30]} />
            <meshStandardMaterial color="#fffaf0" roughness={0.95} />
          </mesh>
          {/* front snap placket + buttons */}
          <mesh position={[0, 0.123, 0.0]} rotation={[0.04, 0, 0]}>
            <boxGeometry args={[0.014, 0.003, 0.2]} />
            <meshStandardMaterial color="#fffaf0" roughness={0.9} />
          </mesh>
          {[-0.065, -0.02, 0.025, 0.07, 0.115].map((z, i) => (
            <mesh key={i} position={[0, 0.1265 - Math.abs(z) * 0.03, z]}>
              <sphereGeometry args={[0.0058, 14, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.15} />
            </mesh>
          ))}
        </>
      )}
      {/* navel + cord */}
      {!clothed && exposeNavel && (
        <group position={[0, 0.108, 0.06]}>
          <Ellipsoid p={[0, 0, 0]} s={[0.011, 0.005, 0.011]} color="#e59f8b" wet={wet} />
          {cordClamp && (
            <>
              <mesh position={[0, 0.011, 0]} rotation={[0.2, 0, 0]}><cylinderGeometry args={[0.0042, 0.0058, 0.026, 12]} /><meshStandardMaterial color="#e8d5a8" roughness={0.6} /></mesh>
              <mesh position={[0, 0.011, 0]}><boxGeometry args={[0.02, 0.008, 0.009]} /><meshStandardMaterial color="#38bdf8" roughness={0.35} /></mesh>
            </>
          )}
        </group>
      )}
      {/* pelvis */}
      {!clothed && !diaper && <Ellipsoid p={[0, 0.048, 0.15]} s={[0.078, 0.048, 0.062]} wet={wet} />}

      {/* arms & legs, symmetric */}
      {[1, -1].map((sg) => {
        const f = (v) => (sg === 1 ? v : mirror(v));
        const arm = P.armL; const leg = P.legL;
        const s = f(arm.s); const e = f(arm.e); const h = f(arm.h);
        const hp = f(leg.h); const kn = f(leg.k); const an = f(leg.a);
        return (
          <group key={sg}>
            {/* arm */}
            <Limb a={s} b={e} r0={0.021} r1={0.0175} color={clothed ? cloth : SKIN} mat={clothed ? clothMat : {}} wet={wet} />
            <Limb a={e} b={h} r0={0.0175} r1={0.0145} color={clothed ? cloth : SKIN} mat={clothed ? clothMat : {}} />
            {clothed && (
              <mesh position={h} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.0152, 0.0045, 10, 20]} />
                <meshStandardMaterial color="#fffaf0" roughness={0.95} />
              </mesh>
            )}
            <Fist p={[h[0], h[1] + 0.006, h[2] - 0.011]} rot={[-0.5, 0, sg * 0.3]} wet={wet} side={sg} />
            {/* leg: chubby thigh, shin, foot */}
            <Limb a={hp} b={kn} r0={0.034} r1={0.026} color={clothed ? cloth : SKIN} mat={clothed ? clothMat : {}} />
            <Limb a={kn} b={an} r0={0.025} r1={0.0165} color={clothed ? cloth : SKIN} mat={clothed ? clothMat : {}} />
            {/* thigh skin-fold */}
            {!clothed && <Ellipsoid p={[(hp[0] + kn[0]) / 2, (hp[1] + kn[1]) / 2 + 0.002, (hp[2] + kn[2]) / 2]} s={[0.032, 0.026, 0.032]} wet={wet} />}
            {clothed ? (
              <Ellipsoid p={[an[0], an[1] - 0.004, an[2] + 0.014]} s={[0.021, 0.0155, 0.036]} mat={<meshStandardMaterial color={cloth} {...clothMat} />} />
            ) : (
              <Foot p={[an[0], an[1] - 0.004, an[2] + 0.018]} rot={[0.1, sg * -0.25, 0]} wet={wet} />
            )}
          </group>
        );
      })}
      {R(null)}
    </group>
  );
}

/* ── disposable diaper ───────────────────────────────────────────── */
function WornDiaper({ folded = true, wet = false }) {
  return (
    <group>
      {/* brief body hugging the pelvis */}
      <Ellipsoid p={[0, 0.05, 0.152]} s={[0.092, 0.058, 0.074]}
        mat={<meshStandardMaterial color="#ffffff" roughness={0.88} />} />
      {/* elastic leg gathers */}
      {[-1, 1].map((sg) => (
        <mesh key={sg} position={[sg * 0.058, 0.052, 0.185]} rotation={[0.3, sg * 0.5, 0]}>
          <torusGeometry args={[0.036, 0.006, 8, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </mesh>
      ))}
      {/* waistband — folded under the navel */}
      <mesh position={[0, 0.102, 0.108]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.15, 0.016, 0.024]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {folded && (
        <mesh position={[0, 0.113, 0.103]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.145, 0.006, 0.018]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
      )}
      {/* tabs */}
      {[-1, 1].map((sg) => (
        <mesh key={sg} position={[sg * 0.07, 0.092, 0.122]} rotation={[0.2, sg * 0.25, sg * 0.2]}>
          <boxGeometry args={[0.032, 0.004, 0.02]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.5} />
        </mesh>
      ))}
      {/* wetness indicator line + printed motif */}
      <mesh position={[0, 0.1085, 0.16]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.012, 0.0012, 0.07]} />
        <meshStandardMaterial color={wet ? '#facc15' : '#38bdf8'} />
      </mesh>
      <mesh position={[0, 0.109, 0.19]} rotation={[0.1, 0, 0]}><circleGeometry args={[0.012, 5]} /><meshStandardMaterial color="#fda4af" /></mesh>
    </group>
  );
}

/** open diaper (flat) laid under the baby's bottom, with tapes */
function OpenDiaper({ dirty = false }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.11, -0.12); s.lineTo(0.11, -0.12);
    s.bezierCurveTo(0.12, -0.04, 0.06, -0.02, 0.06, 0.02);
    s.bezierCurveTo(0.06, 0.06, 0.12, 0.08, 0.11, 0.14);
    s.lineTo(-0.11, 0.14);
    s.bezierCurveTo(-0.12, 0.08, -0.06, 0.06, -0.06, 0.02);
    s.bezierCurveTo(-0.06, -0.02, -0.12, -0.04, -0.11, -0.12);
    return s;
  }, []);
  return (
    <group position={[0, 0.006, 0.17]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.008, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.005, 0.0105]}>
        <planeGeometry args={[0.07, 0.16]} />
        <meshStandardMaterial color={dirty ? '#d9c28a' : '#f1f5f9'} roughness={1} />
      </mesh>
      {[-1, 1].map((sg) => (
        <mesh key={sg} position={[sg * 0.13, 0.11, 0.006]}>
          <boxGeometry args={[0.04, 0.026, 0.004]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ── towel, swaddle, suds ────────────────────────────────────────── */
function HoodedTowel({ color = '#bfe3f7', map }) {
  const mat = <meshStandardMaterial color="#ffffff" map={map} roughness={1} />;
  return (
    <group>
      {/* wrapped body */}
      <mesh position={[0, 0.062, 0.11]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow scale={[1, 1, 0.78]}>
        <cylinderGeometry args={[0.118, 0.092, 0.4, 36]} />
        {mat}
      </mesh>
      {/* closed foot end tuck */}
      <mesh position={[0, 0.058, 0.318]} scale={[1, 0.8, 0.9]} castShadow><sphereGeometry args={[0.094, 28, 20]} />{mat}</mesh>
      {/* diagonal wrap overlaps across chest */}
      <mesh position={[0, 0.128, 0.0]} rotation={[0.18, 0, -0.45]} castShadow>
        <boxGeometry args={[0.24, 0.022, 0.15]} />{mat}
      </mesh>
      <mesh position={[0, 0.132, 0.055]} rotation={[0.12, 0, 0.5]} castShadow>
        <boxGeometry args={[0.24, 0.022, 0.15]} />{mat}
      </mesh>
      {/* trim */}
      <mesh position={[0, 0.13, 0.0]} rotation={[0.18, 0, -0.45]}><boxGeometry args={[0.245, 0.006, 0.014]} /><meshStandardMaterial color={color} roughness={1} /></mesh>
      {/* folded flap at feet */}
      <mesh position={[0, 0.12, 0.27]} rotation={[0.25, 0, 0]} castShadow><boxGeometry args={[0.2, 0.02, 0.1]} />{mat}</mesh>
      {/* hood (cupped around the head) */}
      <group position={[0, 0.012, -0.178]}>
        <mesh rotation={[0.25, 0, 0]} scale={[1.05, 1.05, 1.1]} castShadow>
          <sphereGeometry args={[0.108, 36, 26, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color="#ffffff" map={map} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* hood binding around the face opening */}
        <mesh position={[0, -0.002, 0.012]} rotation={[Math.PI / 2 - 0.9, 0, 0]} scale={[1, 1.1, 1]}>
          <torusGeometry args={[0.101, 0.008, 10, 40]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
        {/* hood ears (cute bear ears) */}
        {[-1, 1].map((sg) => (
          <mesh key={sg} position={[sg * 0.068, 0.082, -0.032]} castShadow>
            <sphereGeometry args={[0.027, 18, 14]} />
            <meshStandardMaterial color="#ffffff" map={map} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SwaddleWrap({ color = '#fef3c7', blanketColor, withBlanket }) {
  return (
    <group>
      <mesh position={[0, 0.07, 0.09]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow scale={[1, 1, 0.8]}>
        <cylinderGeometry args={[0.105, 0.076, 0.37, 32]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.068, 0.265]} scale={[1, 0.82, 1]} castShadow><sphereGeometry args={[0.076, 24, 18]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      {/* crossed wrap flaps */}
      <mesh position={[0, 0.128, -0.028]} rotation={[0.22, 0, -0.42]} castShadow><boxGeometry args={[0.22, 0.016, 0.13]} /><meshStandardMaterial color={blanketColor || '#fef08a'} roughness={0.92} /></mesh>
      <mesh position={[0, 0.131, -0.012]} rotation={[0.18, 0, 0.42]} castShadow><boxGeometry args={[0.22, 0.016, 0.13]} /><meshStandardMaterial color={color} roughness={0.92} /></mesh>
      {/* pinned tiny fist */}
      <Fist p={[0.072, 0.128, -0.07]} rot={[-0.4, 0, -0.3]} side={-1} />
      {withBlanket && (
        <group position={[0, 0.115, 0.15]}>
          <mesh castShadow receiveShadow><boxGeometry args={[0.31, 0.04, 0.26]} /><meshStandardMaterial color={blanketColor || '#fef08a'} roughness={0.92} /></mesh>
          <mesh position={[0, 0.02, -0.125]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.31, 14]} /><meshStandardMaterial color="#ffffff" roughness={0.95} /></mesh>
        </group>
      )}
    </group>
  );
}

function Suds() {
  const bubbles = useMemo(() => Array.from({ length: 26 }).map((_, i) => ({
    p: [((i * 53) % 21 - 10) * 0.0095, 0.07 + ((i * 29) % 7) * 0.012, -0.05 + ((i * 37) % 24) * 0.0125],
    r: 0.009 + ((i * 17) % 5) * 0.0036,
  })), []);
  return (
    <group>
      {bubbles.map((b, i) => (
        <mesh key={i} position={b.p}>
          <sphereGeometry args={[b.r, 12, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} transparent opacity={0.86} />
        </mesh>
      ))}
    </group>
  );
}

/* ── main component ──────────────────────────────────────────────── */
export default function RealisticNewborn({
  pose = 'swaddle',
  beanieColor = '#fef08a',
  blanketColor = '#fef08a',
  withBlanket = false,
  towelColor = '#bfe3f7',
  pajamaColor = '#bfe8d0',
  wetDiaper = false,
}) {
  const breath = useRef();
  const headRef = useRef();
  const isSwaddle = pose === 'swaddle';
  const isTowel = pose === 'towelWrap';
  const isDressed = pose === 'dressed' || pose === 'prone';
  const isProne = pose === 'prone';
  const isBath = pose === 'bathing';
  const isChange = pose === 'diaperChange';
  const isDiaperOn = pose === 'diaperOn';
  const isNaked = pose === 'naked';
  const isAwakeTable = isDiaperOn || isChange || isBath || isNaked;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (breath.current) {
      const b = Math.sin(t * 3.0) * 0.014;
      breath.current.scale.set(1 + b * 0.5, 1 + b * 1.4, 1 + b * 0.4);
    }
    if (headRef.current && isAwakeTable) {
      headRef.current.rotation.z = Math.sin(t * 1.1) * 0.06;
    }
  });
  const starMap = useCanvasTexture(drawStars(pajamaColor, '#ffffff'), 256, 256, [3, 5]);
  const terry = useCanvasTexture(drawTerry(towelColor), 256, 256, [3, 3]);

  const headBeanie = isSwaddle ? beanieColor : (isDressed && !isProne) ? '#fffaf0' : null;

  return (
    <group rotation={isProne ? [0, 0, Math.PI] : [0, 0, 0]} position={isProne ? [0, 0.16, 0] : [0, 0, 0]}>
      {/* head — rotated so the face points up (+Y) when lying supine, or turned slightly to the side when prone */}
      <group
        ref={headRef}
        position={[0, 0.088, -0.178]}
        rotation={
          isProne
            ? [-Math.PI / 2, 0.55, 0]
            : [-Math.PI / 2 + (isBath ? 0.12 : 0), 0, 0]
        }
      >
        <Head
          wet={isBath}
          beanie={headBeanie}
          eyes={isAwakeTable ? 'open' : 'closed'}
          mouth={isChange ? 'open' : 'rest'}
        />
      </group>

      {(isSwaddle) && <SwaddleWrap blanketColor={blanketColor} withBlanket={withBlanket} />}

      {isTowel && (
        <>
          <group position={[0, 0.0, 0]} ref={breath}>
            <HoodedTowel color={towelColor} map={terry} />
          </group>
          {/* little neck + chin peeking out of towel */}
          <Ellipsoid p={[0, 0.046, -0.105]} s={[0.03, 0.03, 0.028]} />
        </>
      )}

      {!isSwaddle && !isTowel && (
        <group ref={breath}>
          <Body
            plan={isChange ? 'raised' : 'rest'}
            wet={isBath}
            cloth={isDressed ? pajamaColor : null}
            clothMap={isDressed ? starMap : null}
            diaper={isChange || isDiaperOn}
            cordClamp={isChange || isBath || isDiaperOn || isNaked}
          />
        </group>
      )}

      {isDiaperOn && <WornDiaper wet={wetDiaper} />}
      {isChange && <OpenDiaper dirty={wetDiaper} />}
      {isBath && <Suds />}
      {isDressed && (
        // folded sleepwear collar cap & cute chest label stripe
        <mesh position={[0, 0.131, 0.18]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[0.1, 0.002, 0.014]} />
          <meshStandardMaterial color="#fda4af" />
        </mesh>
      )}
    </group>
  );
}
