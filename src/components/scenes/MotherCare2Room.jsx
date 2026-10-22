import React from 'react';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
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

import { WallBoard, TitleSign, WallScreen, WindowWithCurtains, CareBooth, LoungeCorner, useEnterToActivate } from '../ward/WardKit';
import { WARD102_BOARDS } from '../ward/wardData';
export default function MotherCare2Room() {
  const { openWardModal, wardFlow, learningProgress } = useStore();
  const ROOM = 'motherCare2';
  const flow = wardFlow[ROOM] || {};
  const slideSeen = !!flow.slide;
  const activityDone = !!flow.activity;
  const isCompleted = !!(learningProgress && learningProgress[ROOM]) || activityDone;
  const B = WARD102_BOARDS;

  const startActivity = () => {
    openWardModal('booth', ROOM);
  };
  useEnterToActivate([2.0, 1.0], 2.2, startActivity);

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 2: การดูแลแผลหลังคลอด (แผลฝีเย็บและแผลผ่าตัด)"
        roomNumber="Wound Care Ward 102"
      />

      {/* ── Top-Right Mission HUD (Portaled to document.body so user can explore 3D room freely) ── */}
      <ScreenPortal>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-pink-400 text-slate-800">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2">
            <span className="text-xs font-extrabold text-pink-900">
              🩹 ภารกิจห้องดูแลแผลหลังคลอด (Ward 102)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'
              }`}
            >
              {isCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังเรียนรู้'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => openWardModal('slide', ROOM)}
              className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                slideSeen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-950'
              }`}
            >
              <span>📖 1. อ่านสไลด์ความรู้ Zone 2</span>
              <span className="font-bold">{slideSeen ? '☑ อ่านแล้ว' : 'เปิดอ่าน ▶'}</span>
            </button>

            <button
              type="button"
              onClick={() => openWardModal('booth', ROOM)}
              className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                activityDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 border-pink-300 text-white shadow'
              }`}
            >
              <span>🩹 2. กิจกรรมบูทดูแลแผลฝีเย็บ</span>
              <span className="font-bold">{activityDone ? '☑ สำเร็จ' : 'เริ่มทำ ▶'}</span>
            </button>

            <button
              type="button"
              onClick={() => openWardModal('quiz', ROOM)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span>📝 3. แบบประเมินทบทวนประจำห้อง</span>
              <span className="font-bold text-pink-700">{flow.quiz ? '☑ ทำแล้ว' : 'ทำข้อสอบ ▶'}</span>
            </button>
          </div>
        </div>
      </ScreenPortal>

      {/* ── ป้ายและบอร์ดผนัง (ติดผนังด้านใน z = -8.80, x = -8.80 อย่างแนบสนิท) ── */}
      <TitleSign position={[-6.3, 4.9, -8.78]} width={4.4} height={2.0} line1={B.title.line1} line2={B.title.line2} />
      <WallBoard position={[-6.3, 2.5, -8.78]} width={3.2} height={2.6} title={B.goals.title} items={B.goals.items} />
      <WallScreen position={[-0.8, 3.0, -8.78]} width={5.8} src="/images/ward/zone2_slide.jpg" room={ROOM} label="Zone 2" />
      <WallBoard position={[4.1, 3.4, -8.78]} width={2.85} height={3.6} title={B.howTo.title} items={B.howTo.items} numbered />
      <WallBoard position={[7.2, 3.4, -8.78]} width={2.85} height={3.6} title={B.warning.title} items={B.warning.items} accent="#e53935" />
      <WindowWithCurtains position={[-8.78, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} />

      <LoungeCorner position={[7.4, 0, 6.2]} rotation={[0, -Math.PI / 2, 0]} />
      <CareBooth position={[2.0, 0, 1.0]} locked={false} onActivate={startActivity} />

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
