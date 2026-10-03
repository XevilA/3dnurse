import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import NursingChair from '../furniture/NursingChair';
import HospitalNightstand from '../furniture/HospitalNightstand';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import LaundryBasket from '../decorations/LaundryBasket';
import CeilingFan from '../decorations/CeilingFan';
import SteelShelves from '../furniture/SteelShelves';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

export default function NewbornCare5Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "1. การจัดเตียงนอนที่ปลอดภัย (Safe Sleep)", desc: "ที่นอนต้องเรียบ แน่น ไม่ยุบตัว ไม่มีหมอน ตุ๊กตา หรือผ้าห่มหนา เพื่อป้องกันภาวะไหลตายในทารก (SIDS)" },
    { title: "2. ท่านอนที่ถูกต้อง", desc: "ทารกต้องนอนหงายเสมอในขวบปีแรก ไม่ควรให้นอนคว่ำหรือนอนตะแคงโดยไม่มีผู้ดูแลใกล้ชิด" },
    { title: "3. อุณหภูมิและการระบายอากาศ", desc: "อุณหภูมิห้องควรอยู่ที่ 24-26°C มีการถ่ายเทอากาศดี ไม่เปิดพัดลมหรือแอร์เป่าตัวทารกโดยตรง และปลอดควันบุหรี่ 100%" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare5');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการจัดสภาพแวดล้อมที่ปลอดภัยสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        roomTitle="ห้องบริบาลทารก: การจัดสภาพแวดล้อมที่ปลอดภัย"
        roomNumber="Safe Nursery 205"
      />

      {/* Real Animated Rotating Ceiling Fan for Safe Gentle Airflow */}
      <CeilingFan position={[0, 7.8, 0]} scale={1.2} />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{ background: 'white', padding: '14px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(22,163,74,0.15)', border: '2px solid #86efac' }}>
          <h2 style={{ color: '#16a34a', margin: 0, fontSize: '20px' }}>🏠 บทเรียนที่ 5: การจัดสภาพแวดล้อมที่ปลอดภัยให้แก่ทารก</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NURSERY ENVIRONMENT ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Real Steel Medical Storage Shelves */}
      <SteelShelves position={[7.8, 0, -1.8]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} />

      {/* Wicker Hamper for Nursery Linens */}
      <LaundryBasket position={[6.0, 0, 2.8]} scale={1.0} />

      {/* Sanitary Foot-pedal Waste Bin */}
      <HospitalTrashBin position={[-5.8, 0, 3.2]} scale={0.85} />

      {/* Digital Nursery Thermometer & Humidity Gauge (24°C - 26°C / 55% RH) */}
      <Html position={[6.8, 3.8, -8.4]} transform center>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          padding: '10px 16px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 'bold' }}>🌡️ Nursery Climate</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534' }}>25.0°C</div>
          <div style={{ fontSize: '11px', color: '#0369a1' }}>💧 55% Humidity (Optimal)</div>
        </div>
      </Html>

      {/* Real Safe Baby Crib with Baby Sleeping on Back (Safe Sleep Compliant) */}
      <group
        position={[0, 0, -3.5]}
        onClick={() => setHoldingBaby(!isHoldingBaby)}
        className="cursor-pointer"
      >
        <BabyCrib position={[0, 0, 0]}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={0.38} withBlanket={true} />
          )}
        </BabyCrib>
        {/* Soft Glowing Station Beacon */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.15, 32]} />
          <meshBasicMaterial color="#16a34a" transparent opacity={0.6} />
        </mesh>
        <Html position={[0, 1.8, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #16a34a, #15803d)',
              border: '2px solid white'
            }}
          >
            <span>🏠</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยในเตียง Safe Sleep' : 'ลูกน้อยนอนหงายปลอดภัย (คลิกอุ้ม)'}</span>
          </div>
        </Html>
      </group>

      {/* Real Nursing Armchair for Mother in Nursery (Left) */}
      <group position={[-5, 0, 0]} onClick={handleNext}>
        <NursingChair position={[0, 0, 0]} rotation={[0, 0.5, 0]} />
      </group>

      {/* Real Nursery Bedside Table with Fresh Flowers */}
      <group position={[-5, 0, 2.5]} onClick={handleNext}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.1}>
          <FlowerVase position={[0.15, 0.82, 0.1]} scale={0.7} />
        </HospitalNightstand>
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center distanceFactor={15}>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#14532d', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              เข้าใจแล้ว ➜ ขั้นถัดไป
            </button>
          </div>
        </Html>
      )}

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 1.5]} />
    </group>
  );
}
