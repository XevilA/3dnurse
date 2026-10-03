import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import Washbasin from '../furniture/Washbasin';
import MedicalCart from '../furniture/MedicalCart';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import LaundryBasket from '../decorations/LaundryBasket';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import DrawerCabinet from '../furniture/DrawerCabinet';
import CleaningBottle from '../decorations/CleaningBottle';

export default function NewbornCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "1. การเตรียมพื้นที่และอุปกรณ์", desc: "วางเบาะรองเปลี่ยนผ้าอ้อมบนโต๊ะที่มั่นคง เตรียมสำลีชุบน้ำต้มสุก ผ้าอ้อมสำเร็จรูป และถังขยะ" },
    { title: "2. การเช็ดทำความสะอาดถูกหลักอนามัย", desc: "เช็ดจากด้านหน้าไปด้านหลังเสมอ เพื่อป้องกันเชื้อโรคเข้าสู่ท่อปัสสาวะ โดยเฉพาะในทารกเพศหญิง" },
    { title: "3. การสังเกตอุจจาระและปัสสาวะ", desc: "ทารกควรปัสสาวะ 6-8 ครั้ง/วัน อุจจาระสีเหลืองทอง หากถ่ายเหลวเป็นมูกเลือดหรือสีซีดควรปรึกษาแพทย์" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare3');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการเปลี่ยนผ้าอ้อมสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        roomTitle="ห้องบริบาลทารก: การเปลี่ยนผ้าอ้อมและการสังเกตการขับถ่าย"
        roomNumber="Nursery Changing 203"
      />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{ background: 'white', padding: '14px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(217,119,6,0.15)', border: '2px solid #fcd34d' }}>
          <h2 style={{ color: '#d97706', margin: 0, fontSize: '20px' }}>👶 บทเรียนที่ 3: การเปลี่ยนผ้าอ้อมและการสังเกตการขับถ่าย</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NATURE ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Supplies and Diaper Stock Cabinet */}
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* Nursery Laundry Hamper for Soiled Baby Clothing */}
      <LaundryBasket position={[2.2, 0, -2.6]} scale={1.05} />

      {/* Sanitary Pedal Disposal Bin right next to Changing Station */}
      <HospitalTrashBin position={[-2.2, 0, -3.2]} scale={0.9} />

      {/* Real Diaper Changing Station with Real Drawer Cabinet, Changing Pad and Baby */}
      <group position={[0, 0, -3.5]} onClick={handleNext} className="cursor-pointer">
        <DrawerCabinet position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.9} />
        {/* Waterproof Wipe-Clean Contoured Changing Pad resting on cabinet */}
        <mesh position={[0, 1.72, 0.05]} receiveShadow castShadow>
          <boxGeometry args={[1.1, 0.08, 0.55]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.3} />
        </mesh>
        {/* Antiseptic Spray Cleaner on Table */}
        <CleaningBottle position={[-0.45, 1.76, 0.15]} scale={0.7} />
        {/* Soft Glowing Station Beacon */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.25, 32]} />
          <meshBasicMaterial color="#d97706" transparent opacity={0.6} />
        </mesh>
        {/* Baby lying on back on changing table */}
        {!isHoldingBaby && (
          <BabyAvatar
            pose="sleeping"
            position={[0, 1.76, 0.05]}
            scale={0.36}
            withBlanket={false}
          />
        )}
        <Html position={[0, 2.5, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              useStore.getState().setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #d97706, #b45309)',
              border: '2px solid white'
            }}
          >
            <span>👶</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยบนเบาะเปลี่ยนผ้าอ้อม' : 'ลูกน้อยบนเบาะ (คลิกอุ้มขึ้น)'}</span>
          </div>
        </Html>
      </group>

      {/* Real Porcelain Washbasin (for handwashing & baby bottom cleaning) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Clinical Mobile Cart with Diapers, Wipes & Creams */}
      <group position={[5.2, 0, 1.0]} onClick={handleNext}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={true} withTape={false} scale={0.88} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center distanceFactor={15}>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #d97706' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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
