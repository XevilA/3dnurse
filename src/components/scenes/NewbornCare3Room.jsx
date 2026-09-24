import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import Washbasin from '../furniture/Washbasin';
import MedicalTable from '../furniture/MedicalTable';
import BabyAvatar from '../avatars/BabyAvatar';

export default function NewbornCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
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
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(217,119,6,0.15)', border: '2px solid #fcd34d' }}>
          <h2 style={{ color: '#d97706', margin: 0, fontSize: '20px' }}>👶 บทเรียนที่ 3: การเปลี่ยนผ้าอ้อมและการสังเกตการขับถ่าย</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Real Diaper Changing Table with Baby */}
      <group position={[0, 0, -3.5]} onClick={handleNext}>
        {/* Medical Table Frame */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.9, 1.3]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} metalness={0.05} />
        </mesh>
        {/* Soft Padded Diaper Changing Mattress */}
        <mesh position={[0, 0.94, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 1.0]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.7} />
        </mesh>
        {/* Baby lying on back on changing table */}
        <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[1, 1, 1]} />
      </group>

      {/* Real Porcelain Washbasin (for handwashing & baby bottom cleaning) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Medical Supplies Table (Diapers, wipes, creams) */}
      <group position={[5.5, 0, 0]} onClick={handleNext}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center>
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

      {/* Back Button */}
      <Html position={[-7, 7, -8.5]}>
        <button 
          onClick={() => setRoom('lobby')}
          style={{ padding: '10px 20px', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
        >
          ⬅ กลับหน้าหลัก
        </button>
      </Html>

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 1.5]} />
    </group>
  );
}
