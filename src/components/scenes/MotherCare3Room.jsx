import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import MedicalTable from '../furniture/MedicalTable';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';

export default function MotherCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      completeModule('motherCare3');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้เรื่องการดูแลเต้านมและท่าให้นมจบแล้ว');
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
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🤱 บทเรียนที่ 3: การดูแลเต้านมและเทคนิคการให้นมบุตร</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS ── */}

      {/* Station 0: REAL Nursing Armchair (การเตรียมเต้านมและการประคบอุ่น) */}
      <group position={[-4, 0, -4]} onClick={step === 0 ? handleNextStep : undefined}>
        <NursingChair position={[0, 0, 0]} rotation={[0, 0.4, 0]} />
        {step === 0 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>1. การเตรียมเต้านมก่อนให้นม</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ประคบอุ่น 3-5 นาที นวดเต้านมเบาๆ เป็นวงกลมจากฐานสู่ลานนมเพื่อกระตุ้น Oxytocin</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเก้าอี้ให้นมเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 1: REAL Baby Crib with Baby (ท่าอุ้มให้นมบุตร) */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <BabyCrib position={[0, 0, 0]}>
          <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} />
        </BabyCrib>
        {step === 1 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>2. ท่าอุ้มให้นมบุตรที่ถูกต้อง</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ศีรษะและลำตัวลูกเป็นเส้นตรง ท้องแนบท้อง คางชิดเต้า จมูกเปิดโล่งหายใจสะดวก</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเปลเด็กเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 2: REAL Medical Nightstand Table (การบีบเก็บน้ำนมแม่) */}
      <group position={[-4, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        <MedicalTable position={[0, 0, 0]} withBottle={true} />
        {step === 2 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>3. การบีบเก็บน้ำนมแม่</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>วางนิ้วโป้งและชี้เป็นรูปตัว C ห่างโคนหัวนม 3 ซม. กดเข้าหาผนังอกแล้วบีบเป็นจังหวะ</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกโต๊ะอุปกรณ์ปั๊มนมเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 3: Relief & Gel Pack Station (การแก้ไขปัญหาเต้านมคัดตึง) */}
      <group position={[4.5, 0, 2]} onClick={step === 3 ? handleNextStep : undefined}>
        <MedicalTable position={[0, 0, 0]} withBottle={false} />
        {step === 3 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>4. การแก้ไขปัญหาเต้านมคัดตึง</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ให้ลูกดูดบ่อยทุก 2 ชม. หากปวดเต้าหลังให้นมเสร็จ ให้ประคบเย็น 10-15 นาทีลดบวม</p>
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
