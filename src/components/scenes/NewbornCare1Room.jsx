import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import HospitalNightstand from '../furniture/HospitalNightstand';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import Pillows from '../decorations/Pillows';
import LaundryBasket from '../decorations/LaundryBasket';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

export default function NewbornCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
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
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        roomTitle="ห้องบริบาลทารก: การให้นมทารกแรกเกิด"
        roomNumber="Nursery 201"
      />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{ background: 'white', padding: '14px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(2,136,209,0.15)', border: '2px solid #81d4fa' }}>
          <h2 style={{ color: '#0288d1', margin: 0, fontSize: '20px' }}>🍼 บทเรียนที่ 1: การให้นมทารกแรกเกิด</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D FURNITURE & ENVIRONMENT ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Comfortable Mother Rest Sofa */}
      <InteractiveSeat
        id="newborn1_sofa"
        name="โซฟาพักผ่อนคุณแม่"
        type="sofa"
        position={[7.5, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.05} />
      </InteractiveSeat>

      {/* Nursery Laundry Hamper for Burp Cloths & Swaddles */}
      <LaundryBasket position={[6.0, 0, 3.2]} scale={1.0} />

      {/* Sanitary Trash Bin */}
      <HospitalTrashBin position={[-5.8, 0, 3.5]} scale={0.85} />

      {/* Real Nursing Armchair with Ergonomic Support Pillows (Breastfeeding Demonstration Station) */}
      <InteractiveSeat
        id="newborn1_nursing_chair"
        name="เก้าอี้ให้นมบุตร"
        type="chair"
        position={[-3.5, 0, -3.5]}
        rotation={[0, 0.4, 0]}
        seatOffset={[0, 0.45, 0.05]}
      >
        <group
          onClick={() => {
            setHoldingBaby(true);
            handleNext();
          }}
          className="cursor-pointer"
        >
          <NursingChair position={[0, 0, 0]} rotation={[0, 0, 0]} />
          <Pillows position={[-0.05, 0.65, 0.05]} rotation={[0, 0, 0]} scale={0.85} />
          {/* Soft Glowing Station Beacon */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.15, 32]} />
            <meshBasicMaterial color="#0288d1" transparent opacity={0.6} />
          </mesh>
          <Html position={[0, 1.9, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(true);
              handleNext();
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)', border: '2px solid white' }}
          >
            <span>🤱</span>
            <span>เก้าอี้ให้นมบุตร (คลิกสาธิตท่าดูดนม)</span>
          </div>
        </Html>
        </group>
      </InteractiveSeat>

      {/* Real Baby Crib with Baby */}
      <group
        position={[3.5, 0, -3.5]}
        onClick={() => setHoldingBaby(!isHoldingBaby)}
        className="cursor-pointer"
      >
        <BabyCrib position={[0, 0, 0]}>
          {!isHoldingBaby && (
            <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[0.55, 0.55, 0.55]} />
          )}
        </BabyCrib>
        {/* Soft Glowing Station Beacon */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.15, 32]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.5} />
        </mesh>
        <Html position={[0, 1.8, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ec4899, #db2777)',
              border: '2px solid white'
            }}
          >
            <span>{isHoldingBaby ? '🧸' : '👶'}</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยลงในเปล' : 'ลูกน้อยในเปล (คลิกอุ้ม)'}</span>
          </div>
        </Html>
      </group>

      {/* Real Bedside Table with Feeding Bottles & Fresh Flowers */}
      <group position={[-4, 0, 2]} onClick={handleNext}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.1}>
          <FlowerVase position={[0.15, 0.82, 0.1]} scale={0.7} />
          {/* Baby Feeding Bottle with Teat */}
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 24]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.85} roughness={0.1} />
          </mesh>
        </HospitalNightstand>
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.3, -4.5]} center distanceFactor={15}>
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

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 2]} />
    </group>
  );
}
