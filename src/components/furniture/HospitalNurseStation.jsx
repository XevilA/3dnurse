import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import RealisticNurse from '../characters/RealisticNurse';

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

        {/* Front Counter Title Sign: "เคาน์เตอร์พยาบาล / Nurse Station" */}
        <group position={[0, 0.75, 2.68]}>
          <mesh castShadow>
            <boxGeometry args={[1.7, 0.32, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <Html position={[0, 0, 0.02]} center transform scale={0.17}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: 'nowrap',
              padding: '2px 10px',
              userSelect: 'none'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '0.4px' }}>
                เคาน์เตอร์พยาบาล
              </div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', letterSpacing: '0.8px' }}>
                Nurse Station
              </div>
            </div>
          </Html>
        </group>

        {/* ── Desktop Equipment on Counter Top ── */}
        {/* Computer Monitor 1 (Left Nurse) */}
        <group position={[-1.15, 1.09, 1.45]} rotation={[0, 0.32, 0]}>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.16]} />
            <meshStandardMaterial color="#334155" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.56, 0.34, 0.03]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.28, 0.016]}>
            <planeGeometry args={[0.52, 0.3]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Computer Monitor 2 (Right Nurse) */}
        <group position={[1.15, 1.09, 1.45]} rotation={[0, -0.32, 0]}>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.16]} />
            <meshStandardMaterial color="#334155" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.56, 0.34, 0.03]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.28, 0.016]}>
            <planeGeometry args={[0.52, 0.3]} />
            <meshBasicMaterial color="#a7f3d0" />
          </mesh>
        </group>

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
            <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.1} transparent opacity={0.8} />
          </mesh>
        </group>
        <group position={[0.35, 1.09, 2.15]} rotation={[0, -0.15, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.06]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.1} transparent opacity={0.8} />
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

          {/* Thai Greeting: "ยินดีต้อนรับ / เราพร้อมดูแลคุณ ❤️" */}
          <Html position={[0, 2.82, 0.07]} center transform scale={0.32}>
            <div style={{
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              <h1 style={{
                margin: '0',
                fontSize: '28px',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '0.8px'
              }}>
                ยินดีต้อนรับ
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
                <span>เราพร้อมดูแลคุณ</span>
                <span style={{ fontSize: '18px' }}>❤️</span>
              </p>
            </div>
          </Html>
        </group>

        {/* ── Left Wall Section: Digital Queue Display Board (Exact Location from Photo) ── */}
        <group position={[-2.45, 2.7, 0.12]}>
          {/* Black Display Bezel */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 1.15, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>
          {/* Sky Blue LED Screen */}
          <mesh position={[0, 0, 0.028]}>
            <planeGeometry args={[1.42, 1.07]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.4} roughness={0.1} />
          </mesh>
          {/* Queue HTML Display Content */}
          <Html position={[0, 0, 0.035]} center transform scale={0.14}>
            <div style={{
              width: '360px',
              height: '240px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              borderRadius: '6px',
              padding: '8px 12px',
              boxSizing: 'border-box',
              color: 'white',
              fontFamily: 'system-ui, -apple-system, monospace',
              userSelect: 'none'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid rgba(255,255,255,0.4)',
                paddingBottom: '5px',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '0.5px'
              }}>
                <span>เรียกคิว (QUEUE)</span>
                <span>ช่องบริการ</span>
              </div>
              {/* Queue Rows */}
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(254, 240, 138, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  border: '1px solid #fef08a'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span ref={queueBlinkRef} style={{ color: '#22c55e', fontSize: '14px' }}>●</span>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#fef08a' }}>A015</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>01</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '2px 8px',
                  opacity: 0.85
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>A014</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>02</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '2px 8px',
                  opacity: 0.7
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>B007</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>03</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '2px 8px',
                  opacity: 0.55
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>B006</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>04</span>
                </div>
              </div>
            </div>
          </Html>
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
