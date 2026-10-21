import React, { useEffect } from 'react';
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
import DoctorDesk from '../furniture/DoctorDesk';
import { DiaperStack, BabyBottle, CottonJar, IcePack } from '../furniture/BabyProps';

import { WallBoard, TitleSign, WallScreen, WindowWithCurtains, DiningTable, CareBooth, LoungeCorner, useEnterToActivate } from '../ward/WardKit';
import { WARD102_BOARDS } from '../ward/wardData';
export default function MotherCare2Room() {
  const { openWardModal, wardFlow } = useStore();
  const ROOM = 'motherCare2';
  const slideSeen = !!(wardFlow[ROOM] && wardFlow[ROOM].slide);
  const B = WARD102_BOARDS;

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
    openWardModal(f && f.slide ? 'booth' : 'slide', ROOM);
  };
  useEnterToActivate([2.0, 1.0], 3.2, startActivity);

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 2: การดูแลแผลหลังคลอด (แผลฝีเย็บและแผลผ่าตัด)"
        roomNumber="Wound Care Ward 102"
      />

      {/* ── ป้ายและบอร์ดผนัง (ติดผนังด้านใน z = -8.80, x = -8.80 อย่างแนบสนิท) ── */}
      <TitleSign position={[-6.3, 4.9, -8.78]} width={4.4} height={2.0} line1={B.title.line1} line2={B.title.line2} />
      <WallBoard position={[-6.3, 2.5, -8.78]} width={3.2} height={2.6} title={B.goals.title} items={B.goals.items} />
      <WallScreen position={[-0.8, 3.0, -8.78]} width={5.8} src="/images/ward/zone2_slide.jpg" room={ROOM} label="Zone 2" />
      <WallBoard position={[4.1, 3.4, -8.78]} width={2.85} height={3.6} title={B.howTo.title} items={B.howTo.items} numbered />
      <WallBoard position={[7.2, 3.4, -8.78]} width={2.85} height={3.6} title={B.warning.title} items={B.warning.items} accent="#e53935" />
      <WindowWithCurtains position={[-8.78, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} />

      <LoungeCorner position={[7.4, 0, 6.2]} rotation={[0, -Math.PI / 2, 0]} />
      <CareBooth position={[2.0, 0, 1.0]} locked={!slideSeen} onActivate={startActivity} />

      {/* ── REAL 3D CLINICAL ASSETS & ARCHITECTURE ── */}
      <RealPlant type="potted" position={[7.5, 0, -7.5]} scale={1.1} />
      <MedicineCabinet position={[8.4, 0, -2.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Drivable Hospital Wheelchair parked neatly along entrance wall */}
      <InteractiveSeat
        id="ward102_wheelchair"
        name="รถเข็นผู้ป่วย Ward 102"
        type="wheelchair"
        position={[-7.5, 0, 3.2]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* ── 1. Hospital Patient Bed with Soft Pillows (กิจกรรม 2: การประคบและลดปวดบวม) ── */}
      <InteractiveSeat
        id="room102_bed"
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

      {/* ── 2. Sterile Wound Care Cart (กิจกรรม 1: ทำความสะอาดแผลฝีเย็บ/ผ่าตัด) ── */}
      <group position={[-7.2, 0, -6.5]} >
        <MedicalCart position={[0, 0, 0]} scale={1.05} />
      </group>

      {/* ── 3. Porcelain Sanitary Wash Station (กิจกรรม 3: การขับถ่ายและสุขอนามัย) ── */}
      {/* Mounted flush against the right perimeter wall */}
      <group position={[8.3, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} >
        <Washbasin position={[0, 0, 0]} />
      </group>
      <HospitalTrashBin position={[8.3, 0, 0.8]} scale={0.85} />

      {/* ── 4. Clinical Consultation & REEDA Evaluation Station (กิจกรรม 4: REEDA Score) ── */}
      <group position={[5.4, 0, -6.5]} rotation={[0, -Math.PI / 6, 0]} >
        <DoctorDesk position={[0, 0, 0]} scale={0.85} />
        {/* Examination desk lamp positioned properly on the consultation desk */}
        <ExaminationLamp position={[-0.3, 0.78, 0]} scale={0.65} />
      </group>

      {/* ── Baby care supplies on consultation desk ── */}
      <DiaperStack position={[5.8, 0.82, -6.2]} count={4} />
      <CottonJar position={[5.0, 0.82, -6.7]} />
      <BabyBottle position={[4.7, 0.82, -6.3]} rotation={[0, 0.8, 0]} />

      {/* ── ประคบเย็น (Zone 2 ref: cold compress/ice pack) ── */}
      <IcePack position={[-6.8, 0.88, -6.2]} rotation={[0, 0.5, 0]} />
      <IcePack position={[-7.0, 0.88, -6.8]} rotation={[0, -0.3, 0]} />

      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
