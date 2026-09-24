import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import NursingChair from '../furniture/NursingChair';
import MedicalTable from '../furniture/MedicalTable';
import BabyAvatar from '../avatars/BabyAvatar';

export default function NewbornCare5Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
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
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f0fdf4" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#dcfce7" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#dcfce7" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#dcfce7" />
      </mesh>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(22,163,74,0.15)', border: '2px solid #86efac' }}>
          <h2 style={{ color: '#16a34a', margin: 0, fontSize: '20px' }}>🏠 บทเรียนที่ 5: การจัดสภาพแวดล้อมที่ปลอดภัยให้แก่ทารก</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Real Safe Baby Crib with Baby Sleeping on Back */}
      <group position={[0, 0, -3.5]} onClick={handleNext}>
        <BabyCrib position={[0, 0, 0]}>
          <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[1, 1, 1]} />
        </BabyCrib>
      </group>

      {/* Real Nursing Armchair for Mother in Nursery (Left) */}
      <group position={[-5, 0, 0]} onClick={handleNext}>
        <NursingChair position={[0, 0, 0]} rotation={[0, 0.5, 0]} />
      </group>

      {/* Real Nursery Bedside Table (Right) */}
      <group position={[5, 0, 0]} onClick={handleNext}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center>
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
