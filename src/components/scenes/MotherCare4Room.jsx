import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import DoctorDesk from '../furniture/DoctorDesk';
import MedicalCart from '../furniture/MedicalCart';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import MedicineCabinet from '../furniture/MedicineCabinet';
import HospitalSofa from '../furniture/HospitalSofa';
import Pillows from '../decorations/Pillows';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyCrib from '../furniture/BabyCrib';

export default function MotherCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
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
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา: สังเกตอาการผิดปกติและภาวะแทรกซ้อน"
        roomNumber="Observation Ward 104"
      />



      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{
          background: 'white',
          padding: '14px 24px',
          borderRadius: '16px',
          textAlign: 'center',
          minWidth: '380px',
          boxShadow: '0 8px 24px rgba(233,30,99,0.15)',
          border: '2px solid #f48fb1'
        }}>
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🩺 บทเรียนที่ 4: การสังเกตอาการผิดปกติและป้องกันภาวะแทรกซ้อน</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & EMERGENCY EQUIPMENT ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="house" position={[-7.5, 0, 6.5]} scale={0.9} />

      {/* Emergency Transport Wheelchair right beside the bed */}
      <HospitalWheelchair position={[-7.2, 0, 1.8]} rotation={[0, Math.PI / 4, 0]} scale={1.15} />

      {/* Medicine & Emergency Crash Cabinet */}
      <MedicineCabinet position={[7.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Foot-pedal Waste Bin */}
      <HospitalTrashBin position={[6.2, 0, 3.2]} scale={0.85} />

      {/* Station 0: REAL Hospital Bed with Pillows and IV Infusion Stand (การตกเลือดหลังคลอด) */}
      <group position={[-4, 0, -4]} onClick={step === 0 ? handleNextStep : undefined}>
        <HospitalBed position={[0, 0, 0]} />
        <Pillows position={[0.2, 0.95, -0.6]} scale={0.8} />

        {/* Real Chrome IV Drip Stand beside bed */}
        <group position={[-1.2, 0, -0.8]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 2.2, 16]} />
            <meshStandardMaterial color="#cfd8dc" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* IV Bag */}
          <mesh position={[0.1, 2.05, 0]} castShadow>
            <boxGeometry args={[0.16, 0.28, 0.06]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.9} roughness={0.05} />
          </mesh>
        </group>

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

      {/* Newborn Bassinet beside mother (แม่และลูกอบอุ่นร่วมกัน) */}
      <group position={[-1.7, 0, -4]} rotation={[0, -0.2, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[0.55, 0.55, 0.55]} />
          )}
        </BabyCrib>
        <Html position={[0, 1.6, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            style={{
              background: isHoldingBaby ? 'rgba(16, 185, 129, 0.95)' : 'rgba(236, 72, 153, 0.95)',
              color: 'white',
              border: '2px solid white',
              whiteSpace: 'nowrap',
            }}
          >
            {isHoldingBaby ? '🧸 วางลูกน้อยลงเปล' : '👶 ลูกน้อยหลับอยู่ (คลิกอุ้ม)'}
          </div>
        </Html>
      </group>

      {/* Station 1: REAL Doctor Desk with BP Monitoring & Examination Lamp (ภาวะครรภ์เป็นพิษและความดันโลหิตสูง) */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <DoctorDesk position={[0, 0, 0]} scale={0.95} />
        <ExaminationLamp position={[-0.6, 0.78, 0.1]} scale={0.65} />
        <FlowerVase position={[0.6, 0.78, 0.1]} scale={0.7} />
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

      {/* Station 2: REAL Medical Mobile Cart for Infection Monitoring & Thermometry (การติดเชื้อและไข้หนาวสั่น) */}
      <group position={[-4, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={true} withTape={true} scale={0.9} />
        {step === 2 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffebee', border: '2px solid #c62828', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#b71c1c', margin: '0 0 8px 0', fontSize: '16px' }}>🌡️ 3. การติดเชื้อหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>น้ำคาวปลาสีแดงสดไม่จางลง หรือมีกลิ่นเหม็นรุนแรง มีไข้หนาวสั่น ปวดท้องน้อยรุนแรง</p>
              <div style={{ marginTop: '10px', background: '#c62828', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกรถตรวจเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 3: REAL Velvet Sofa Lounge with Soft Pillows (ภาวะซึมเศร้าหลังคลอดและการประเมินจิตใจ) */}
      <group position={[4.2, 0, 2]} onClick={step === 3 ? handleNextStep : undefined}>
        <HospitalSofa position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} scale={0.95} />
        <Pillows position={[0.1, 0.45, 0]} scale={0.8} />
        {step === 3 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#f3e5f5', border: '2px solid #7b1fa2', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#6a1b9a', margin: '0 0 8px 0', fontSize: '16px' }}>💙 4. สุขภาพจิตและภาวะซึมเศร้าหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>Baby Blues อารมณ์อ่อนไหวช่วง 1-2 สัปดาห์แรก หากรู้สึกดิ่งสิ้นหวังเกิน 2 สัปดาห์ ควรปรึกษาจิตแพทย์</p>
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
