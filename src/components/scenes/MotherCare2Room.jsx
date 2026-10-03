import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import MedicalCart from '../furniture/MedicalCart';
import Washbasin from '../furniture/Washbasin';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import Pillows from '../decorations/Pillows';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyCrib from '../furniture/BabyCrib';

export default function MotherCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
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
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา: การดูแลแผลหลังคลอด"
        roomNumber="Wound Care Ward 102"
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
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🩹 บทเรียนที่ 2: การดูแลแผลหลังคลอด (แผลฝีเย็บและแผลผ่าตัด)</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 3)} / 3 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NATURE ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="house" position={[-7.5, 0, 6.5]} scale={0.9} />

      {/* Authentic Medicine and Sterile Wound Dressing Cabinet */}
      <MedicineCabinet position={[7.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Wheelchair for Mobility (Drivable!) */}
      <InteractiveSeat
        id="room102_wheelchair"
        name="รถเข็นผู้ป่วย Ward 102"
        type="wheelchair"
        position={[-7.2, 0, 1.8]}
        rotation={[0, Math.PI / 4, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* Foot-pedal Waste Bin for Soiled Dressings */}
      <HospitalTrashBin position={[2.5, 0, -3.2]} scale={0.9} />

      {/* Station 0: REAL Hospital Examination Bed with Pillows (การดูแลแผลฝีเย็บ) */}
      <InteractiveSeat
        id="room102_bed"
        name="เตียงตรวจแผลคุณแม่"
        type="bed"
        position={[-4, 0, -4]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.72, 0]}
      >
        <group onClick={step === 0 ? handleNextStep : undefined}>
          <HospitalBed position={[0, 0, 0]} />
          <Pillows position={[0.2, 0.95, -0.6]} scale={0.8} />
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
      </InteractiveSeat>

      {/* Newborn Bassinet right beside Mother (แม่และลูกผูกพันใกล้ชิด) */}
      <group position={[-1.7, 0, -4]} rotation={[0, -0.2, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
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

      {/* Station 1: REAL Sterile Dressing Mobile Cart with Medical Box, Surgical Tape, and Examination Lamp */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={true} withTape={true} scale={0.9} />
        <ExaminationLamp position={[0.45, 0.98, -0.2]} scale={0.7} />
        {step === 1 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>2. การดูแลแผลผ่าคลอด (Cesarean Section)</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ระวังอย่าให้แผลเปียกน้ำในช่วง 7 วันแรก ไม่แกะเกาแผล สวมเสื้อผ้าหลวมสบาย</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกรถทำแผลเพื่อผ่าน ➜</div>
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
