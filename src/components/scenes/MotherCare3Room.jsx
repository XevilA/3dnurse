import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import HospitalNightstand from '../furniture/HospitalNightstand';
import MedicalCart from '../furniture/MedicalCart';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import Pillows from '../decorations/Pillows';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

export default function MotherCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
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
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา: การดูแลเต้านมและเทคนิคการให้นมบุตร"
        roomNumber="Lactation Ward 103"
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
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🤱 บทเรียนที่ 3: การดูแลเต้านมและเทคนิคการให้นมบุตร</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4 ฐานการเรียนรู้</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NATURE ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Comfortable Relaxation Velvet Sofa for Nursing Mothers */}
      <InteractiveSeat
        id="room103_sofa"
        name="โซฟาพักผ่อนให้นม"
        type="sofa"
        position={[7.5, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.05} />
      </InteractiveSeat>

      {/* Hospital Foot-pedal Trash Bin */}
      <HospitalTrashBin position={[-5.8, 0, 2.5]} scale={0.85} />

      {/* Station 0: REAL Nursing Armchair with Support Pillows (การเตรียมเต้านมและการประคบอุ่น) */}
      <InteractiveSeat
        id="room103_nursing_chair"
        name="เก้าอี้ให้นมบุตร"
        type="chair"
        position={[-4, 0, -4]}
        rotation={[0, 0.4, 0]}
        seatOffset={[0, 0.45, 0.05]}
      >
        <group onClick={step === 0 ? handleNextStep : undefined}>
          <NursingChair position={[0, 0, 0]} rotation={[0, 0, 0]} />
          <Pillows position={[-0.05, 0.65, 0.05]} rotation={[0, 0, 0]} scale={0.85} />
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
      </InteractiveSeat>

      {/* Station 1: REAL Baby Crib with Baby (ท่าอุ้มให้นมบุตร) */}
      <group position={[3.5, 0, -4]} onClick={step === 1 ? handleNextStep : () => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]}>
          {!isHoldingBaby && (
            <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[0.55, 0.55, 0.55]} />
          )}
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

      {/* Station 2: REAL Hospital Nightstand Table with Breast Milk Equipment & Flowers (การบีบเก็บน้ำนมแม่) */}
      <group position={[-4, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.1}>
          <FlowerVase position={[0.15, 0.82, 0.1]} scale={0.7} />
          {/* Milk collection bottle */}
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.22, 24]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.1} />
          </mesh>
        </HospitalNightstand>
        {step === 2 && (
          <Html position={[0, 2.0, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>3. การบีบเก็บน้ำนมแม่</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>วางนิ้วโป้งและชี้เป็นรูปตัว C ห่างโคนหัวนม 3 ซม. กดเข้าหาผนังอกแล้วบีบเป็นจังหวะ</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกโต๊ะอุปกรณ์ปั๊มนมเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 3: REAL Medical Cart for Thermal Gel Pack & Engorgement Treatment (การแก้ไขปัญหาเต้านมคัดตึง) */}
      <group position={[3.8, 0, 2]} onClick={step === 3 ? handleNextStep : undefined}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={true} withTape={false} scale={0.88} />
        {step === 3 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>4. การแก้ไขปัญหาเต้านมคัดตึงและหัวนมแตก</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ให้ลูกดูดบ่อยทุก 2-3 ชม. ประคบเย็นหลังให้นมเพื่อลดบวม ใช้น้ำนมทาเคลือบหัวนมแตก</p>
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
