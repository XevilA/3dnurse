import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import MedicalTable from '../furniture/MedicalTable';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';

export default function NewbornCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "การเริ่มให้นมแม่ภายใน 1 ชั่วโมงหลังคลอด", desc: "ควรให้ทารกดูดนมแม่เร็วที่สุด เพื่อกระตุ้นการสร้างน้ำนมและให้เกิด Skin-to-skin contact" },
    { title: "ท่าอุ้มให้นมที่ถูกต้อง", desc: "มี 4 ท่าหลัก: ท่าอุ้มขวางตัก (Cradle), ท่าอุ้มขวางตักประยุกต์ (Cross-cradle), ท่าอุ้มลูกฟุตบอล (Football), ท่านอนตะแคง (Side-lying)" },
    { title: "การสังเกตการดูดนมที่ถูกต้อง", desc: "ทารกอ้าปากกว้าง อมลานนม คางชิดเต้านม และได้ยินเสียงกลืนนมเป็นจังหวะ" },
    { title: "ความถี่และระยะเวลาในการให้นม", desc: "ควรให้นมทุก 2-3 ชั่วโมง หรือ 8-12 ครั้งต่อวัน ครั้งละ 15-20 นาทีต่อข้าง" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare1');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการให้นมทารกสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(2,136,209,0.15)', border: '2px solid #81d4fa' }}>
          <h2 style={{ color: '#0288d1', margin: 0, fontSize: '20px' }}>🍼 บทเรียนที่ 1: การให้นมทารกแรกเกิด</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Real Nursing Armchair */}
      <group position={[-3.5, 0, -3.5]} onClick={handleNext}>
        <NursingChair position={[0, 0, 0]} rotation={[0, 0.4, 0]} />
      </group>

      {/* Real Baby Crib with Baby */}
      <group position={[3.5, 0, -3.5]} onClick={handleNext}>
        <BabyCrib position={[0, 0, 0]}>
          <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} />
        </BabyCrib>
      </group>

      {/* Real Medical Supplies Table */}
      <group position={[-4, 0, 2]} onClick={handleNext}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.5, -5]} center>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #0288d1' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#01579b', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button 
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#0288d1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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
      <PlayerController initialPosition={[0, 0, 2]} />
    </group>
  );
}
