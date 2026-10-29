import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * RealisticComputerWorkstation Component
 * Medical-Grade All-in-One (AIO) Workstation:
 * - 27" Ultra-Slim IPS Display with Satin Medical Silver / Arctic White Casing
 * - Realistic L-shaped Aluminum Stand with circular cable routing grommet
 * - Pure WebGL CanvasTexture Medical EHR / HIS Clinical Dashboard
 *   (Live Patient HN, Mother Vitals: BP 118/76, HR 78, Temp 36.6°C, SpO2 99%, Triage Queue)
 * - Low-profile chiclet keyboard with individual keycaps
 * - Ergonomic optical mouse with scroll wheel on medical blue mousepad
 * - Thai National Health Smart Card reader with inserted smart card
 * - Medical barcode scanner on charging cradle
 * - Clear acrylic brochure display holder with maternal care pamphlets
 * - Chrome desktop counter service bell
 */
export default function RealisticComputerWorkstation({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenTheme = 'triage', // 'triage' | 'newborn'
  nurseName = 'พว. อารียา จิตต์ปราณี',
}) {
  const isTriage = screenTheme === 'triage';

  // High-resolution CanvasTexture for the Medical EHR Dashboard
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // 1. Clean Hospital App Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 640);

    // 2. Top Navigation Bar (Deep Clinical Blue)
    const headerGrad = ctx.createLinearGradient(0, 0, 1024, 0);
    if (isTriage) {
      headerGrad.addColorStop(0, '#0369a1');
      headerGrad.addColorStop(1, '#0284c7');
    } else {
      headerGrad.addColorStop(0, '#be185d');
      headerGrad.addColorStop(1, '#db2777');
    }
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, 1024, 64);

    // Header Title & Hospital Crest
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('🏥 โรงพยาบาลศูนย์แม่และเด็ก • ระบบสารสนเทศผู้ป่วยนอก (OPD HIS / EHR v4.8)', 24, 40);

    // Online Status Badge & Nurse Name
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('● ออนไลน์ (Connected)', 720, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(nurseName, 880, 40);

    // 3. Patient Info Banner (Sub-header)
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 64, 1024, 46);
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('HN: 67-089421 • คุณแม่สมใจ รักลูก (มารดาหลังคลอดธรรมชาติ Day 3)', 24, 94);
    ctx.fillStyle = '#475569';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('สิทธิการรักษา: ประกันสุขภาพถ้วนหน้า (UC)', 580, 94);
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('✓ ยืนยันตัวตนสำเร็จ', 880, 94);

    // 4. Left Panel: Maternal Vitals & Clinical Assessment
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(24, 126, 480, 488, 8);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.fillText('📊 สัญญาณชีพมารดา (Maternal Vitals)', 44, 160);

    // Vitals 4-Grid Cards
    const vitals = [
      { label: 'ความดันโลหิต (BP)', val: '118/76', unit: 'mmHg', col: '#0284c7' },
      { label: 'ชีพจร (Pulse / HR)', val: '78', unit: 'bpm', col: '#0284c7' },
      { label: 'อุณหภูมิกาย (Temp)', val: '36.6', unit: '°C', col: '#0284c7' },
      { label: 'ออกซิเจนในเลือด (SpO2)', val: '99', unit: '%', col: '#16a34a' },
    ];

    vitals.forEach((v, idx) => {
      const vx = 44 + (idx % 2) * 220;
      const vy = 180 + Math.floor(idx / 2) * 88;
      ctx.fillStyle = '#f8fafc';
      ctx.roundRect(vx, vy, 210, 76, 6);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(v.label, vx + 12, vy + 24);
      ctx.fillStyle = v.col;
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText(v.val, vx + 12, vy + 58);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(v.unit, vx + 125, vy + 58);
    });

    // Simulated ECG Heartbeat Waveform
    ctx.fillStyle = '#f8fafc';
    ctx.roundRect(44, 370, 440, 70, 6);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(54, 405);
    for (let x = 54; x < 474; x += 40) {
      ctx.lineTo(x + 10, 405);
      ctx.lineTo(x + 15, 388);
      ctx.lineTo(x + 20, 422);
      ctx.lineTo(x + 25, 405);
      ctx.lineTo(x + 40, 405);
    }
    ctx.stroke();

    // Nursing Notes
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('📋 การประเมินทางคลินิก (Nursing Notes)', 44, 470);
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('• แผลฝีเย็บแห้งสะอาดดี ไม่บวมแดง ไม่มีหนอง (REEDA = 0)', 48, 502);
    ctx.fillText('• น้ำนมเริ่มไหล เต้านมนุ่ม ไม่คัดตึง หัวนมปกติ', 48, 532);
    ctx.fillText('• น้ำคาวปลาสีแดงจาง (Rubra) ปริมาณปกติ ไม่มีกลิ่นเหม็น', 48, 562);
    ctx.fillText('• ผู้ป่วยรู้สึกตัวดี เดินทรงตัวได้ปกติ ไม่มีอาการหน้ามืด', 48, 592);

    // 5. Right Panel: Queue Management & Calling
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(520, 126, 480, 488, 8);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.fillText('🕒 ลำดับคิวรับบริการ (Triage & Clinic Queue)', 540, 160);

    const qRows = [
      { q: 'A015', name: 'คุณสมใจ รักลูก', status: 'กำลังรับบริการ โต๊ะ 01', cur: true },
      { q: 'A014', name: 'คุณวิภา แจ่มใส', status: 'รอพบแพทย์ แผนกมารดา 102', cur: false },
      { q: 'B007', name: 'ด.ช. ปัณณธร (ทารกแรกเกิด)', status: 'ตรวจสะดือ แผนกเด็ก 203', cur: false },
      { q: 'B006', name: 'ด.ญ. กานต์พิชชา', status: 'ชั่งน้ำหนัก/วัดตัว แผนกเด็ก 201', cur: false },
    ];

    qRows.forEach((qr, qIdx) => {
      const qy = 185 + qIdx * 72;
      ctx.fillStyle = qr.cur ? '#e0f2fe' : '#f8fafc';
      ctx.roundRect(540, qy, 440, 62, 6);
      ctx.fill();
      ctx.strokeStyle = qr.cur ? '#0284c7' : '#e2e8f0';
      ctx.lineWidth = qr.cur ? 2 : 1;
      ctx.stroke();

      ctx.fillStyle = qr.cur ? '#0284c7' : '#1e293b';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(qr.q, 558, qy + 38);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText(qr.name, 638, qy + 36);

      ctx.fillStyle = qr.cur ? '#0284c7' : '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(qr.status, 785, qy + 36);
    });

    // Action Buttons
    ctx.fillStyle = '#0284c7';
    ctx.roundRect(540, 535, 210, 62, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('✓ บันทึกเวชระเบียน', 568, 573);

    ctx.fillStyle = '#10b981';
    ctx.roundRect(770, 535, 210, 62, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('➜ เรียกคิวถัดไป', 812, 573);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [isTriage, nurseName]);

  useEffect(() => {
    return () => {
      screenTexture.dispose();
    };
  }, [screenTexture]);

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* ══════════════════════════════════════════════════════════════════════════════
          1. 27" ALL-IN-ONE MEDICAL WORKSTATION (Sleek Arctic White & Brushed Aluminum)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0]}>
        {/* Anodized Brushed Aluminum Base Plate */}
        <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.014, 0.22]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Rubber Feet under base */}
        {[-0.11, 0.11].map((xP) =>
          [-0.09, 0.09].map((zP) => (
            <mesh key={`foot_${xP}_${zP}`} position={[xP, 0.002, zP]}>
              <cylinderGeometry args={[0.012, 0.012, 0.004, 12]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          ))
        )}

        {/* Ergonomic L-Shaped Articulated Stand Arm (Brushed Aluminum) */}
        <mesh position={[0, 0.18, -0.04]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.048, 0.35, 0.028]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.18} />
        </mesh>
        {/* Cable Routing Aperture in Stand */}
        <mesh position={[0, 0.12, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.032, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hinge Joint */}
        <mesh position={[0, 0.33, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.052, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* ── Main Monitor Chassis (Slim Bezel 16:9 Display) ── */}
        <group position={[0, 0.36, 0.01]} rotation={[-0.06, 0, 0]}>
          {/* Back Casing (Clean Arctic Medical White / Satin Pearl Finish) */}
          <mesh position={[0, 0, -0.012]} castShadow>
            <boxGeometry args={[0.66, 0.42, 0.022]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.25} roughness={0.3} />
          </mesh>

          {/* Chrome Trim Border around casing */}
          <mesh position={[0, 0, -0.012]}>
            <boxGeometry args={[0.664, 0.424, 0.020]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Rear Hospital Red Cross & Emblem Badge */}
          <group position={[0, 0.04, -0.024]} rotation={[0, Math.PI, 0]}>
            <mesh>
              <circleGeometry args={[0.035, 24]} />
              <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <ringGeometry args={[0.030, 0.034, 24]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.018, 0.006]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.006, 0.018]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
          </group>

          {/* Rear Heat Dissipation Vents */}
          {[-0.04, -0.02, 0, 0.02].map((yV) => (
            <mesh key={`vent_${yV}`} position={[0, 0.14 + yV, -0.024]}>
              <planeGeometry args={[0.34, 0.003]} />
              <meshBasicMaterial color="#cbd5e1" />
            </mesh>
          ))}

          {/* Front Bezel Frame (Micro-Edge Dark Slate Border) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.662, 0.422, 0.004]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>

          {/* Front Active Screen (WebGL CanvasTexture - 100% Solid & Depth-Buffered) */}
          <mesh position={[0, 0, 0.003]}>
            <planeGeometry args={[0.638, 0.398]} />
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          </mesh>

          {/* Web Camera & Green Status LED at Top Center */}
          <mesh position={[0, 0.203, 0.004]}>
            <circleGeometry args={[0.004, 16]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <mesh position={[0.012, 0.203, 0.004]}>
            <circleGeometry args={[0.0018, 12]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          2. SLIM CHICLET KEYBOARD (Right under nurse's hands)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0.015, 0.32]} rotation={[-0.05, 0, 0]}>
        {/* Keyboard Aluminum Chassis */}
        <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.012, 0.14]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.25} />
        </mesh>
        {/* Dark Keybed Recess */}
        <mesh position={[0, 0.011, 0]}>
          <boxGeometry args={[0.404, 0.002, 0.126]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>

        {/* Keycap Rows (Embossed Chiclet Style) */}
        {[-0.045, -0.022, 0.001, 0.024, 0.047].map((zRow, rIdx) => (
          <group key={`keyrow_${rIdx}`} position={[0, 0.014, zRow]}>
            {Array.from({ length: 14 }).map((_, cIdx) => (
              <mesh key={`key_${rIdx}_${cIdx}`} position={[-0.18 + cIdx * 0.0275, 0, 0]}>
                <boxGeometry args={[0.023, 0.006, 0.018]} />
                <meshStandardMaterial color={rIdx === 0 ? '#64748b' : '#ffffff'} roughness={0.35} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Spacebar */}
        <mesh position={[-0.02, 0.014, 0.047]}>
          <boxGeometry args={[0.13, 0.006, 0.018]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          3. ERGONOMIC OPTICAL MOUSE & MEDICAL BLUE MOUSEPAD
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0.26, 0.01, 0.32]}>
        {/* Fabric Micro-weave Mousepad */}
        <mesh position={[0, 0.002, 0]} receiveShadow>
          <boxGeometry args={[0.18, 0.004, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.003, 0]}>
          <planeGeometry args={[0.168, 0.208]} />
          <meshStandardMaterial color="#0369a1" roughness={0.85} />
        </mesh>

        {/* Ergonomic Optical Curved Mouse */}
        <group position={[0, 0.016, 0.01]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.024, 0.030, 0.022, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.011, -0.015]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.046, 0.004, 0.038]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.016, -0.015]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.006, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          4. THAI NATIONAL ID SMART CARD READER (Medical Check-in Unit)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[-0.28, 0.015, 0.24]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.09, 0.02, 0.12]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.016, -0.03]}>
          <boxGeometry args={[0.065, 0.004, 0.01]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Inserted Thai Smart Card */}
        <mesh position={[0, 0.02, 0.01]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.054, 0.002, 0.084]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} />
        </mesh>
        <mesh position={[0.012, 0.022, 0.02]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[0.012, 0.010]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          5. MEDICAL HANDHELD BARCODE SCANNER (Wristband / Medication Reader)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0.38, 0.015, 0.12]} rotation={[0, -0.4, 0]}>
        {/* Charger Cradle Base */}
        <mesh position={[0, 0.018, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.036, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Handheld Scanner Body in Cradle */}
        <group position={[0, 0.07, 0]} rotation={[0.45, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.032, 0.09, 0.035]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          {/* Scanner Head */}
          <mesh position={[0, 0.045, -0.02]} rotation={[-0.5, 0, 0]} castShadow>
            <boxGeometry args={[0.038, 0.045, 0.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.35} />
          </mesh>
          {/* Red Optical Glass Emitter */}
          <mesh position={[0, 0.045, -0.048]} rotation={[-0.5, 0, 0]}>
            <planeGeometry args={[0.028, 0.014]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          6. CLEAR ACRYLIC BROCHURE STAND (Maternal & Newborn Care Pamphlets)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[-0.42, 0.015, 0.10]} rotation={[0, 0.45, 0]}>
        {/* Clear Acrylic Body */}
        <mesh position={[0, 0.10, 0]}>
          <boxGeometry args={[0.14, 0.20, 0.06]} />
          <meshStandardMaterial
            color="#e0f2fe"
            roughness={0.12}
            transparent
            opacity={0.38}
          />
        </mesh>
        {/* Printed Maternal Care Booklets Inside */}
        <mesh position={[0, 0.10, 0.015]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.12, 0.18, 0.01]} />
          <meshStandardMaterial color="#f472b6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.11, 0.02]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[0.10, 0.14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          7. CHROME DESKTOP SERVICE COUNTER BELL
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[-0.20, 0.015, -0.08]}>
        <mesh position={[0, 0.005, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.045, 0.01, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.022, 0]} castShadow>
          <sphereGeometry args={[0.034, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.040, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.016, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
