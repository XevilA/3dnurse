import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import Washbasin from '../furniture/Washbasin';
import MedicalTable from '../furniture/MedicalTable';
import BabyAvatar from '../avatars/BabyAvatar';

export default function NewbornCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "1. การล้างมือและการเตรียมอุปกรณ์", desc: "ล้างมือด้วยสบู่ให้สะอาดก่อนทำความสะอาดสายสะดือ เตรียมสำลีก้อนสะอาด และแอลกอฮอล์ 70%" },
    { title: "2. เทคนิคการเช็ดสายสะดือ", desc: "ใช้สำลีชุบแอลกอฮอล์ 70% เช็ดวนจากโคนสะดือขึ้นสู่ปลายสะดือ และเปลี่ยนสำลีก้อนใหม่ทุกครั้ง ไม่เช็ดย้อนกลับ" },
    { title: "3. การพับผ้าอ้อมใต้สะดือ", desc: "พับขอบผ้าอ้อมลงมาให้อยู่ใต้สะดือเสมอ เพื่อให้สายสะดือแห้ง ไม่อับชื้น และป้องกันการปนเปื้อนปัสสาวะ" },
    { title: "4. สัญญาณอันตรายของสายสะดือ", desc: "โคนสะดือบวมแดง มีหนอง มีกลิ่นเหม็น หรือเลือดไหลไม่หยุด ควรรีบพาทารกไปพบแพทย์ทันที" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare4');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการดูแลสายสะดือสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(14,165,233,0.15)', border: '2px solid #7dd3fc' }}>
          <h2 style={{ color: '#0284c7', margin: 0, fontSize: '20px' }}>🔗 บทเรียนที่ 4: การดูแลสายสะดือทารกแรกเกิด</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Real Clinical Examination Bed with Baby */}
      <group position={[0, 0, -3.5]} onClick={handleNext}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.9, 1.2]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.2} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.94, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 1.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[1, 1, 1]} />
      </group>

      {/* Real Porcelain Washbasin (Mandatory aseptic handwashing) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Medical Supplies Table (70% alcohol & sterile swabs) */}
      <group position={[5.5, 0, 0]} onClick={handleNext}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #0284c7' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button 
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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
