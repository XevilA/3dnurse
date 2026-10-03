import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyBathtub from '../furniture/BabyBathtub';
import Washbasin from '../furniture/Washbasin';
import MedicalCart from '../furniture/MedicalCart';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import LaundryBasket from '../decorations/LaundryBasket';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

export default function NewbornCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "1. การเตรียมน้ำอุ่นและอุปกรณ์", desc: "เตรียมน้ำอุ่นอุณหภูมิ 37-38°C (ทดสอบด้วยหลังมือหรือข้อศอก) สบู่เด็ก ผ้าขนหนูนุ่ม และเสื้อผ้าชุดใหม่" },
    { title: "2. การสระผมและล้างหน้า", desc: "อุ้มท่ารักแร้ ล็อคคอและใบหู พับใบหูปิดรูหูไม่ให้น้ำเข้า สระผมเบาๆ และเช็ดให้แห้งทันที" },
    { title: "3. การอาบตัวและทำความสะอาด", desc: "ใช้มือประคองคอและไหล่ทารก ค่อยๆ หย่อนตัวลงน้ำ ฟอกสบู่จากบนลงล่าง ล้างตามข้อพับ ซับตัวให้แห้งสนิท" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare2');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการอาบน้ำทารกสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        roomTitle="ห้องบริบาลทารก: การอาบน้ำและทำความสะอาดทารก"
        roomNumber="Nursery Bath 202"
      />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{ background: 'white', padding: '14px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(0,150,136,0.15)', border: '2px solid #80cbc4' }}>
          <h2 style={{ color: '#00897b', margin: 0, fontSize: '20px' }}>🛁 บทเรียนที่ 2: การอาบน้ำและทำความสะอาดทารก</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D FURNITURE & ENVIRONMENT ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Medicine & Nursery Bath Supplies Cabinet */}
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* Wicker Hamper for Baby Towels */}
      <LaundryBasket position={[2.2, 0, -2.6]} scale={1.05} />

      {/* Sanitary Pedal Waste Bin */}
      <HospitalTrashBin position={[-5.8, 0, 2.5]} scale={0.85} />

      {/* Real Baby Bathtub Station with Baby Inside */}
      <group
        position={[0, 0, -3.5]}
        onClick={() => {
          if (!isHoldingBaby) {
            handleNext();
          }
        }}
        className="cursor-pointer"
      >
        <BabyBathtub position={[0, 0, 0]} />
        {/* Soft Glowing Station Beacon */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.45, 32]} />
          <meshBasicMaterial color="#00897b" transparent opacity={0.6} />
        </mesh>
        {!isHoldingBaby && (
          <BabyAvatar
            pose="sleeping"
            position={[0, 1.15, 0]}
            rotation={[0.1, 0, 0]}
            scale={0.36}
            withBlanket={false}
          />
        )}
        <Html position={[0, 1.9, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              useStore.getState().setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #00897b, #004d40)' : 'linear-gradient(135deg, #0288d1, #01579b)',
              border: '2px solid white'
            }}
          >
            <span>🛁</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยในอ่างอาบน้ำ' : 'ลูกน้อยในอ่าง (คลิกอุ้มขึ้น)'}</span>
          </div>
        </Html>
      </group>

      {/* Real Porcelain Washbasin & Mirror Station (Left) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Clinical Cart (Right) with Baby Wash & Supplies */}
      <group position={[5.2, 0, 1.0]} onClick={handleNext}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={false} withTape={false} scale={0.88} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center distanceFactor={15}>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #00897b' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#004d40', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#00897b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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
