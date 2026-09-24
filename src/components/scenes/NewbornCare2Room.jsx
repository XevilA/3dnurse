import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyBathtub from '../furniture/BabyBathtub';
import Washbasin from '../furniture/Washbasin';
import MedicalTable from '../furniture/MedicalTable';
import BabyAvatar from '../avatars/BabyAvatar';

export default function NewbornCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
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
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f0fdfa" roughness={0.3} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2f1" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2f1" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2f1" />
      </mesh>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(0,150,136,0.15)', border: '2px solid #80cbc4' }}>
          <h2 style={{ color: '#00897b', margin: 0, fontSize: '20px' }}>🛁 บทเรียนที่ 2: การอาบน้ำและทำความสะอาดทารก</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Real Baby Bathtub Station with Baby Inside */}
      <group position={[0, 0, -3.5]} onClick={handleNext}>
        <BabyBathtub position={[0, 0, 0]} />
        <BabyAvatar position={[0, 1.25, 0]} rotation={[-0.3, 0, 0]} scale={[0.9, 0.9, 0.9]} />
      </group>

      {/* Real Porcelain Washbasin & Mirror Station (Left) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Medical Supplies Table (Right) */}
      <group position={[5.5, 0, 0]} onClick={handleNext}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center>
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
