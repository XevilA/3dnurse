import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import MedicalTable from '../furniture/MedicalTable';
import Washbasin from '../furniture/Washbasin';

export default function MotherCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      completeModule('motherCare2');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้เรื่องการดูแลแผลหลังคลอดจบแล้ว');
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
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🩹 บทเรียนที่ 2: การดูแลแผลหลังคลอด (แผลฝีเย็บและแผลผ่าตัด)</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 3)} / 3 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Station 0: REAL Hospital Examination Bed (การดูแลแผลฝีเย็บ) */}
      <group position={[-4, 0, -4]} onClick={step === 0 ? handleNextStep : undefined}>
        <HospitalBed position={[0, 0, 0]} />
        {step === 0 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>1. การดูแลแผลฝีเย็บ (คลอดธรรมชาติ)</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ล้างด้วยน้ำสะอาดจากหน้าไปหลัง ซับให้แห้ง เปลี่ยนผ้าอนามัยทุก 3-4 ชั่วโมง</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเตียงตรวจเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 1: REAL Medical Table with Dressing Supplies (การดูแลแผลผ่าคลอดทางหน้าท้อง) */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
        {step === 1 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>2. การดูแลแผลผ่าคลอด (Cesarean Section)</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ระวังอย่าให้แผลเปียกน้ำในช่วง 7 วันแรก ไม่แกะเกาแผล สวมเสื้อผ้าหลวมสบาย</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกโต๊ะอุปกรณ์ทำแผลเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 2: REAL Washbasin (การล้างมือและการสังเกตแผลติดเชื้อ) */}
      <group position={[4.5, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        <Washbasin position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        {step === 2 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#fff3e0', border: '2px solid #f57c00', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e65100', margin: '0 0 8px 0', fontSize: '16px' }}>⚠️ 3. สัญญาณอันตรายของแผล</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>แผลบวม แดง ร้อน มีหนอง เลือดซึม หรือมีไข้สูงกว่า 38°C รีบพบแพทย์ทันที</p>
              <div style={{ marginTop: '10px', background: '#2e7d32', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกอ่างเพื่อสำเร็จบทเรียน 🏆</div>
            </div>
          </Html>
        )}
      </group>

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 2]} />
    </group>
  );
}
