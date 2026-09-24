import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import MedicalTable from '../furniture/MedicalTable';
import Washbasin from '../furniture/Washbasin';

export default function MotherCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      completeModule('motherCare4');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้เรื่องการสังเกตอาการผิดปกติและป้องกันภาวะแทรกซ้อนจบแล้ว');
      setStep(step + 1);
    }
  };

  return (
    <group>
      {/* ── Floor & Walls ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -9]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fce4ec" />
      </mesh>
      <mesh position={[-9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fce4ec" />
      </mesh>
      <mesh position={[9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8, 0.5]} />
        <meshStandardMaterial color="#fce4ec" />
      </mesh>

      {/* Back Button */}
      <Html position={[-7, 7, -8.5]}>
        <button 
          onClick={() => setRoom('lobby')}
          style={{ padding: '10px 20px', background: '#e91e63', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        >
          ⬅ กลับหน้าหลัก
        </button>
      </Html>

      {/* Header Info */}
      <Html position={[0, 6.5, -8.5]} center transform>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(233,30,99,0.15)', border: '2px solid #f48fb1' }}>
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🩺 บทเรียนที่ 4: การสังเกตอาการผิดปกติและป้องกันภาวะแทรกซ้อน</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Station 0: REAL Hospital Bed (การตกเลือดหลังคลอด) */}
      <group position={[-4, 0, -4]} onClick={step === 0 ? handleNextStep : undefined}>
        <HospitalBed position={[0, 0, 0]} />
        {step === 0 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffebee', border: '2px solid #c62828', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#b71c1c', margin: '0 0 8px 0', fontSize: '16px' }}>🚨 1. การตกเลือดหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>เลือดออกชุ่มผ้าอนามัยเกิน 1 แผ่น/ชม. มีลิ่มเลือดขนาดใหญ่ มดลูกไม่หดรัดตัว นวดคลึงทันที</p>
              <div style={{ marginTop: '10px', background: '#c62828', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเตียงผู้ป่วยเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 1: REAL Medical Monitoring Table (ภาวะครรภ์เป็นพิษและความดันโลหิตสูง) */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
        {step === 1 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffebee', border: '2px solid #c62828', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#b71c1c', margin: '0 0 8px 0', fontSize: '16px' }}>⚠️ 2. ภาวะความดันโลหิตสูง / ครรภ์เป็นพิษ</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ปวดศีรษะรุนแรง ตาพร่ามัว จุกแน่นใต้ลิ้นปี่ แขนขาบวมกดบุ๋ม รีบพบแพทย์ฉุกเฉิน</p>
              <div style={{ marginTop: '10px', background: '#c62828', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกโต๊ะตรวจความดันเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 2: REAL Washbasin (การติดเชื้อและสุขอนามัย) */}
      <group position={[-4, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        {step === 2 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffebee', border: '2px solid #c62828', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#b71c1c', margin: '0 0 8px 0', fontSize: '16px' }}>🌡️ 3. การติดเชื้อหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>น้ำคาวปลาสีแดงสดไม่จางลง หรือมีกลิ่นเหม็นรุนแรง มีไข้หนาวสั่น ปวดท้องน้อยรุนแรง</p>
              <div style={{ marginTop: '10px', background: '#c62828', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกอ่างล้างมือเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 3: Mental Health Rest Area (ภาวะซึมเศร้าหลังคลอด) */}
      <group position={[4.5, 0, 2]} onClick={step === 3 ? handleNextStep : undefined}>
        <MedicalTable position={[0, 0, 0]} withBottle={false} />
        {step === 3 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#f3e5f5', border: '2px solid #7b1fa2', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#4a148c', margin: '0 0 8px 0', fontSize: '16px' }}>🧠 4. ภาวะซึมเศร้าหลังคลอด (Postpartum Depression)</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ร้องไห้ง่าย อ่อนเพลีย นอนไม่หลับ วิตกกังวลเกินเหตุ ครอบครัวต้องให้กำลังใจและปรึกษาแพทย์</p>
              <div style={{ marginTop: '10px', background: '#2e7d32', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเพื่อสำเร็จบทเรียน 🏆</div>
            </div>
          </Html>
        )}
      </group>

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 2]} />
    </group>
  );
}
