import React, { useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import HospitalNightstand from '../furniture/HospitalNightstand';
import Washbasin from '../furniture/Washbasin';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import MedicineCabinet from '../furniture/MedicineCabinet';
import Pillows from '../decorations/Pillows';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyCrib from '../furniture/BabyCrib';
import DoctorDesk from '../furniture/DoctorDesk';
import NursingChair from '../furniture/NursingChair';

import { WallBoard, TitleSign, WallScreen, WindowWithCurtains, DiningTable, CareBooth, LoungeCorner, useEnterToActivate } from '../ward/WardKit';
import { WARD101_BOARDS } from '../ward/wardData';
export default function MotherCare1Room() {
  const { isHoldingBaby, setHoldingBaby, openWardModal, wardFlow } = useStore();
  const ROOM = 'motherCare1';
  const slideSeen = !!(wardFlow[ROOM] && wardFlow[ROOM].slide);
  const B = WARD101_BOARDS;

  // เปิดสไลด์ความรู้ Zone 1 ก่อนเริ่มกิจกรรม
  useEffect(() => {
    const t = setTimeout(() => {
      const f = useStore.getState().wardFlow[ROOM];
      if (!(f && f.slide)) openWardModal('slide', ROOM);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startActivity = () => {
    const f = useStore.getState().wardFlow[ROOM];
    openWardModal(f && f.slide ? 'food' : 'slide', ROOM);
  };
  useEnterToActivate([1.5, 1.5], 3.2, startActivity);

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 1: การดูแลร่างกายและการฟื้นตัวหลังคลอด"
        roomNumber="Ward 101"
      />

      {/* ── ป้ายและบอร์ดผนัง (ติดผนังด้านใน z = -8.80, x = -8.80 อย่างแนบสนิท) ── */}
      <TitleSign position={[-6.3, 4.9, -8.78]} width={4.4} height={2.0} line1={B.title.line1} line2={B.title.line2} />
      <WallBoard position={[-6.3, 2.5, -8.78]} width={3.2} height={2.6} title={B.goals.title} items={B.goals.items} />
      <WallScreen position={[-0.8, 3.0, -8.78]} width={5.8} src={'/images/ward/zone1_slide.jpg'} room={ROOM} label="Zone 1" />
      <WallBoard position={[4.1, 3.4, -8.78]} width={2.85} height={3.6} title={B.selfCare.title} items={B.selfCare.items} />
      <WallBoard position={[7.2, 3.4, -8.78]} width={2.85} height={3.6} title={B.recovery.title} items={B.recovery.items} accent="#26a69a" />
      <WindowWithCurtains position={[-8.78, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} />

      <LoungeCorner position={[7.4, 0, 6.2]} rotation={[0, -Math.PI / 2, 0]} />
      <DiningTable position={[1.5, 0, 1.5]} locked={!slideSeen} onActivate={startActivity} />

      {/* ── REAL 3D CLINICAL ASSETS & ARCHITECTURE ── */}
      <RealPlant type="potted" position={[7.5, 0, -7.5]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <MedicineCabinet position={[8.4, 0, -2.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Drivable Hospital Wheelchair parked neatly along entrance wall */}
      <InteractiveSeat
        id="ward101_wheelchair"
        name="รถเข็นผู้ป่วย Ward 101"
        type="wheelchair"
        position={[-7.5, 0, 3.2]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* ── 1. Hospital Patient Bed with Soft Pillows (กิจกรรม 1: พักผ่อนและขอความช่วยเหลือ) ── */}
      <InteractiveSeat
        id="room101_bed"
        name="เตียงพักฟื้นคุณแม่"
        type="bed"
        position={[-5.4, 0, -6.0]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.68, 0]}
      >
        <group >
          <HospitalBed position={[0, 0, 0]} />
          {/* Pillows resting securely on top of mattress headboard */}
          <Pillows position={[0.05, 0.72, -0.75]} rotation={[0, 0, 0]} scale={0.75} />
        </group>
      </InteractiveSeat>

      {/* ── 2. Bedside Nightstand with Hydration & Nutrition (กิจกรรม 2: โภชนาการและน้ำดื่ม) ── */}
      <group position={[-7.2, 0, -6.8]} >
        <HospitalNightstand position={[0, 0, 0]} scale={1.05}>
          <FlowerVase position={[0.12, 0.82, 0.08]} scale={0.65} />
          {/* Clean Glass Water Pitcher */}
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.26, 24]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.9} roughness={0.05} />
          </mesh>
        </HospitalNightstand>
      </group>

      {/* ── 3. Newborn Bassinet at Bedside (Rooming-in next to mother's bed) ── */}
      <group position={[-3.4, 0, -6.0]} rotation={[0, -0.15, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
          )}
        </BabyCrib>
        <Html position={[0, 1.25, 0]} center distanceFactor={12}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg"
            style={{
              background: isHoldingBaby ? 'rgba(16, 185, 129, 0.95)' : 'rgba(236, 72, 153, 0.95)',
              color: 'white',
              border: '2px solid white',
              whiteSpace: 'nowrap',
            }}
          >
            {isHoldingBaby ? '🧸 วางลูกน้อยลงเปล' : '👶 ลูกน้อย (คลิกอุ้ม)'}
          </div>
        </Html>
      </group>

      {/* ── 4. Porcelain Sanitary Wash Station (กิจกรรม 3: การล้างมือ 4 ขั้นตอน) ── */}
      {/* Mounted flush against the right perimeter wall */}
      <group position={[8.3, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} >
        <Washbasin position={[0, 0, 0]} />
      </group>
      <HospitalTrashBin position={[8.3, 0, 0.8]} scale={0.85} />

      {/* ── 5. Maternal Recovery & Gentle Mobilization Lounge (กิจกรรม 4: การเคลื่อนไหวอย่างเหมาะสม) ── */}
      <group position={[5.4, 0, -6.5]} rotation={[0, -Math.PI / 6, 0]} >
        <NursingChair position={[0, 0, 0]} scale={1.1} />
        {/* Soft supportive cushion on the chair */}
        <Pillows position={[0, 0.42, 0.05]} scale={0.65} />
      </group>
      {/* Side table with warm nutrition/water carafe & folded baby diapers beside the chair */}
      <group position={[4.0, 0, -6.8]}>
        <HospitalNightstand position={[0, 0, 0]} scale={0.85}>
          <mesh position={[-0.12, 0.90, -0.05]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.22, 20]} />
            <meshPhysicalMaterial color="#f0fdf4" transmission={0.85} roughness={0.1} />
          </mesh>
          {/* กองผ้าอ้อมพับสำหรับลูกน้อยบนโต๊ะข้างเก้าอี้ให้นม */}
          {[
            { y: 0.80, color: '#ffffff' },
            { y: 0.84, color: '#fce7f3' },
            { y: 0.88, color: '#e0f2fe' },
          ].map((d, i) => (
            <mesh key={i} position={[0.10, d.y, 0.04]} rotation={[0, i * 0.1, 0]} castShadow>
              <boxGeometry args={[0.22, 0.036, 0.18]} />
              <meshStandardMaterial color={d.color} roughness={0.85} />
            </mesh>
          ))}
        </HospitalNightstand>
      </group>

      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
