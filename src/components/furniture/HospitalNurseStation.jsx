import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import RealisticNurse from '../characters/RealisticNurse';
import RealisticComputerWorkstation from './RealisticComputerWorkstation';

function usePlaqueTexture(drawFn, width = 640, height = 320, deps = []) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) drawFn(ctx, width, height);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

/**
 * HospitalNurseStation Component
 * 100% Faithful Recreation of the Client's Reference Photo (media_1791422511168_a47c3c00.jpg):
 * - Curved fluted oak wood reception counter with white surface and warm underglow LED
 * - Front Plaque: "เคาน์เตอร์พยาบาล / Nurse Station"
 * - 3 Friendly Nurses: Left (Pink), Center (Light Blue), Right (Pink) with Nurse Caps
 * - Center Feature Wall: Red Cross circular emblem at top, "ยินดีต้อนรับ / เราพร้อมดูแลคุณ ❤️"
 * - Left Wall Section: Digital Queue Board (Sky blue screen with A015, A014, B007, B006)
 * - Beautiful curved warm wood drop ceiling canopy with recessed spotlights
 * - Vases with fresh flowers (white on left, pink on right) and desktop computer monitors
 */
export default function HospitalNurseStation({ position = [0, 0, -3.8], rotation = [0, 0, 0], scale = 1 }) {
  const queueBlinkRef = useRef();
  const [showHisChart, setShowHisChart] = useState(false);

  const counterPlaqueTex = usePlaqueTexture((ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 54px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('เคาน์เตอร์พยาบาล', w / 2, h * 0.42);
    ctx.fillStyle = '#475569';
    ctx.font = '700 34px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('Nurse Station', w / 2, h * 0.75);
  }, 800, 180, []);

  const welcomePlaqueTex = usePlaqueTexture((ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 88px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('ยินดีต้อนรับ', w / 2, h * 0.40);
    ctx.fillStyle = '#e11d48';
    ctx.font = '800 50px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('เราพร้อมดูแลคุณ ❤️', w / 2, h * 0.76);
  }, 900, 320, []);

  const newbornWallSignTex = usePlaqueTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#fffbeb');
    g.addColorStop(0.5, '#fef3c7');
    g.addColorStop(1, '#fce7f3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, w - 14, h - 14);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '68px system-ui, sans-serif';
    ctx.fillText('👶🌸', w / 2, h * 0.27);
    ctx.fillStyle = '#be185d';
    ctx.font = '900 66px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('ห้องดูแลทารก', w / 2, h * 0.58);
    ctx.fillStyle = '#9d174d';
    ctx.font = '700 38px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('Newborn Care Room', w / 2, h * 0.82);
  }, 720, 440, []);

  const motherWallSignTex = usePlaqueTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#fff1f2');
    g.addColorStop(0.5, '#fce7f3');
    g.addColorStop(1, '#fef3c7');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, w - 14, h - 14);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '68px system-ui, sans-serif';
    ctx.fillText('🤱💖', w / 2, h * 0.27);
    ctx.fillStyle = '#be185d';
    ctx.font = '900 66px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('ห้องดูแลคุณแม่', w / 2, h * 0.58);
    ctx.fillStyle = '#9d174d';
    ctx.font = '700 38px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText('Maternal Care Room', w / 2, h * 0.82);
  }, 720, 440, []);

  useFrame(({ clock }) => {
    if (queueBlinkRef.current) {
      const t = clock.getElapsedTime();
      queueBlinkRef.current.style.opacity = Math.sin(t * 4) > 0 ? '1' : '0.35';
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Floor Glow Ring / Warm Kickplate Pool ── */}
      <mesh position={[0, 0.02, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 3.6]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.22} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════════
          1. RECEPTION DESK COUNTER (Curved Fluted Wood with White Cap & Underglow)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0.6]}>
        {/* Counter Base (Main Body) */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.55, 2.65, 1.04, 32, 1, false, -Math.PI * 0.72, Math.PI * 1.44]} />
          <meshStandardMaterial color="#d4a373" roughness={0.55} />
        </mesh>

        {/* Vertical Fluted Wood Slat Panels (ระแนงไม้โอ๊คอบอุ่น) */}
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = -Math.PI * 0.69 + (i * (Math.PI * 1.38) / 29);
          const r = 2.62;
          const x = Math.sin(angle) * r;
          const z = Math.cos(angle) * r;
          return (
            <mesh
              key={`slat_${i}`}
              position={[x, 0.52, z]}
              rotation={[0, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.065, 0.98, 0.035]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#b07d4b' : '#c99663'} roughness={0.4} />
            </mesh>
          );
        })}

        {/* Counter Top Surface (Pristine White Corian Solid Surface) */}
        <mesh position={[0, 1.06, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.75, 2.75, 0.07, 32, 1, false, -Math.PI * 0.74, Math.PI * 1.48]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.05} />
        </mesh>

        {/* Recessed Warm Golden LED Underglow along bottom kickplate */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[2.66, 2.66, 0.05, 32, 1, false, -Math.PI * 0.72, Math.PI * 1.44]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.85} />
        </mesh>
        <pointLight position={[0, 0.15, 1.6]} color="#fde047" intensity={0.95} distance={3.8} />

        {/* Front Counter Title Sign: "เคาน์เตอร์พยาบาล / Nurse Station" (3D Mesh ติดหน้าเคาน์เตอร์ ไม่ลอย) */}
        <group position={[0, 0.72, 2.66]}>
          <mesh castShadow>
            <boxGeometry args={[1.7, 0.34, 0.03]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[1.66, 0.30]} />
            <meshBasicMaterial map={counterPlaqueTex} toneMapped={false} />
          </mesh>
        </group>

        {/* ── Desktop Equipment on Counter Top ── */}
        {/* Realistic Computer Workstation 1 (Left Nurse - Triage HIS) */}
        <group
          onClick={(e) => {
            e.stopPropagation();
            setShowHisChart(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <RealisticComputerWorkstation
            position={[-1.15, 1.09, 1.48]}
            rotation={[0, Math.PI + 0.52, 0]}
            scale={0.92}
            screenTheme="triage"
            nurseName="พว. อารียา จิตต์ปราณี (พยาบาลคัดกรอง)"
          />
        </group>

        {/* Realistic Computer Workstation 2 (Right Nurse - Newborn HIS) */}
        <group
          onClick={(e) => {
            e.stopPropagation();
            setShowHisChart(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <RealisticComputerWorkstation
            position={[1.15, 1.09, 1.48]}
            rotation={[0, Math.PI - 0.52, 0]}
            scale={0.92}
            screenTheme="newborn"
            nurseName="พว. นันทนา สุขสมบูรณ์ (พยาบาลเด็กอ่อน)"
          />
        </group>

        {/* Interactive HIS Medical Chart Modal */}
        {showHisChart && (
          <Html position={[0, 1.6, 1.8]} center distanceFactor={8} zIndexRange={[100, 0]}>
            <div style={{
              width: '420px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#0f172a'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🏥</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0369a1' }}>
                      ระบบเวชระเบียนผู้ป่วยนอก (OPD HIS)
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>โรงพยาบาลศูนย์แม่และเด็ก • ตรวจคัดกรอง</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHisChart(false);
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#64748b'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ background: '#f0f9ff', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0369a1' }}>
                  HN: 67-089421 • คุณสมใจ รักลูก
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  การวินิจฉัย: มารดาพักฟื้นหลังคลอดธรรมชาติ Day 3 • สิทธิ: ประกันสุขภาพถ้วนหน้า
                </div>
              </div>

              {/* Vitals Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>ความดันโลหิต (BP)</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0284c7' }}>118/76 <span style={{ fontSize: '11px', fontWeight: 'normal' }}>mmHg</span></div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>ชีพจร (HR)</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0284c7' }}>78 <span style={{ fontSize: '11px', fontWeight: 'normal' }}>bpm</span></div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>อุณหภูมิกาย (Temp)</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0284c7' }}>36.6 <span style={{ fontSize: '11px', fontWeight: 'normal' }}>°C</span></div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>ออกซิเจนในเลือด (SpO2)</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>99 <span style={{ fontSize: '11px', fontWeight: 'normal' }}>%</span></div>
                </div>
              </div>

              {/* Assessment Notes */}
              <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#334155', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>บันทึกทางการพยาบาล:</div>
                <div>• แผลฝีเย็บแห้งดี ไม่บวมแดง ไม่มีเลือดออกผิดปกติ</div>
                <div>• น้ำนมเริ่มไหล เต้านมนุ่ม ไม่คัดตึง หัวนมปกติ</div>
                <div>• มารดาสดชื่น ทรงตัวได้ดี พร้อมรับคำแนะนำ 10 ฐานการเรียนรู้</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHisChart(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ✓ รับใบคิว & เริ่มบทเรียน
                </button>
              </div>
            </div>
          </Html>
        )}



        {/* White Hydrangea / Rose Floral Vase (Left Counter) */}
        <group position={[-1.9, 1.09, 1.15]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0.06, 0.26, 0.04]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>

        {/* Pink Hydrangea Floral Vase (Right Counter) */}
        <group position={[1.9, 1.09, 1.15]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[-0.05, 0.26, 0.04]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fda4af" roughness={0.4} />
          </mesh>
        </group>

        {/* Acrylic Brochure Stands */}
        <group position={[-0.35, 1.09, 2.15]} rotation={[0, 0.15, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.06]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.12} transparent opacity={0.38} />
          </mesh>
        </group>
        <group position={[0.35, 1.09, 2.15]} rotation={[0, -0.15, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.06]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.12} transparent opacity={0.38} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          2. 3 REALISTIC HUMAN NURSES BEHIND COUNTER (Rigged 3D Female Models in Pink & Blue)
          ══════════════════════════════════════════════════════════════════════════════ */}
      {/* Ergonomic Anti-Fatigue Platform Mat Behind Counter */}
      <mesh position={[0, 0.06, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.12, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Nurse 1: Left (Pastel Pink Hospital Scrub) */}
      <RealisticNurse
        position={[-1.15, 0.12, 0.45]}
        rotation={[0, 0.22, 0]}
        scale={0.98}
        uniformColor="pink"
        armPose="desk"
        timeOffset={1.2}
      />

      {/* Nurse 2: Center (Soft Sky Blue Hospital Scrub - Head Nurse with Stethoscope) */}
      <RealisticNurse
        position={[0, 0.12, 0.55]}
        rotation={[0, 0, 0]}
        scale={0.98}
        uniformColor="blue"
        hasStethoscope={true}
        armPose="welcoming"
        timeOffset={0}
      />

      {/* Nurse 3: Right (Pastel Pink Hospital Scrub, Typing on Computer) */}
      <RealisticNurse
        position={[1.15, 0.12, 0.45]}
        rotation={[0, -0.22, 0]}
        scale={0.98}
        uniformColor="pink"
        armPose="typing"
        timeOffset={2.4}
      />



      {/* ══════════════════════════════════════════════════════════════════════════════
          3. GRAND BACKDROP ARCHITECTURE (Matching Reference Layout Perfectly)
          Center: Red Cross & Thai Greeting | Left: Sky Blue Queue Display Board
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, -1.0]}>
        {/* Full Backdrop Wall */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 5.0, 0.15]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* ── Center Feature Wall (Directly Behind 3 Nurses) ── */}
        <group position={[0, 0, 0.08]}>
          {/* Fluted Vertical Wood Trim on left & right of center feature */}
          <group position={[-1.7, 2.5, 0]}>
            {Array.from({ length: 5 }).map((_, si) => (
              <mesh key={`c_slat_l_${si}`} position={[-0.25 + (si * 0.12), 0, 0.02]} castShadow>
                <boxGeometry args={[0.06, 4.9, 0.04]} />
                <meshStandardMaterial color="#b07d4b" roughness={0.45} />
              </mesh>
            ))}
          </group>
          <group position={[1.7, 2.5, 0]}>
            {Array.from({ length: 5 }).map((_, si) => (
              <mesh key={`c_slat_r_${si}`} position={[-0.25 + (si * 0.12), 0, 0.02]} castShadow>
                <boxGeometry args={[0.06, 4.9, 0.04]} />
                <meshStandardMaterial color="#b07d4b" roughness={0.45} />
              </mesh>
            ))}
          </group>

          {/* White Center Panel */}
          <mesh position={[0, 2.5, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[2.7, 4.9, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          {/* Red Cross Circular Emblem (Centered above nurses, clearly visible) */}
          <group position={[0, 3.55, 0.08]}>
            {/* White Circular Badge */}
            <mesh castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.03, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Red Border Ring */}
            <mesh position={[0, 0, 0.018]}>
              <ringGeometry args={[0.36, 0.40, 32]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
            {/* Red Cross Bars */}
            <mesh position={[0, 0, 0.022]} castShadow>
              <boxGeometry args={[0.11, 0.48, 0.02]} />
              <meshStandardMaterial color="#e11d48" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.022]} castShadow>
              <boxGeometry args={[0.48, 0.11, 0.02]} />
              <meshStandardMaterial color="#e11d48" roughness={0.3} />
            </mesh>
          </group>

          {/* Thai Greeting: "ยินดีต้อนรับ / เราพร้อมดูแลคุณ ❤️" (3D Mesh ติดผนัง ไม่ลอย) */}
          <mesh position={[0, 2.75, 0.048]}>
            <planeGeometry args={[2.1, 0.74]} />
            <meshBasicMaterial map={welcomePlaqueTex} toneMapped={false} />
          </mesh>
        </group>

        {/* ── Left Wall Section: Newborn Care Room Sign (3D Mesh ติดผนัง ไม่ลอย) ── */}
        <group position={[-2.45, 2.75, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[1.65, 1.05, 0.05]} />
            <meshStandardMaterial color="#b07d4b" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.027]}>
            <planeGeometry args={[1.55, 0.95]} />
            <meshBasicMaterial map={newbornWallSignTex} toneMapped={false} />
          </mesh>
        </group>

        {/* ── Right Wall Section: Maternal Care Room Sign (3D Mesh ติดผนัง ไม่ลอย) ── */}
        <group position={[2.45, 2.75, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[1.65, 1.05, 0.05]} />
            <meshStandardMaterial color="#b07d4b" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.027]}>
            <planeGeometry args={[1.55, 0.95]} />
            <meshBasicMaterial map={motherWallSignTex} toneMapped={false} />
          </mesh>
        </group>

        {/* ── Top Curved Wood Canopy / Architectural Drop Ceiling with Downlights ── */}
        <mesh position={[0, 4.95, 0.45]} castShadow>
          <boxGeometry args={[7.4, 0.25, 1.2]} />
          <meshStandardMaterial color="#b07d4b" roughness={0.4} />
        </mesh>
        {/* Recessed Warm Ceiling Downlights */}
        {[-2.2, -0.7, 0.7, 2.2].map((xSpot, spotI) => (
          <group key={`downlight_${spotI}`} position={[xSpot, 4.82, 0.5]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={0.9} />
            </mesh>
            <spotLight
              position={[0, -0.05, 0]}
              target-position={[xSpot, 0, 0.8]}
              color="#fef08a"
              intensity={1.1}
              angle={0.5}
              penumbra={0.5}
              distance={6}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
