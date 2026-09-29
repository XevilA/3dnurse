import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import RealPlant from '../decorations/RealPlant';
import RealTree from '../decorations/RealTree';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import DoctorDesk from '../furniture/DoctorDesk';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import Pillows from '../decorations/Pillows';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import MedicineCabinet from '../furniture/MedicineCabinet';
import WalkableRoomPortal from '../environment/WalkableRoomPortal';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      {/* ── Realistic 3D Grand Hospital Lobby Architecture (28x28m) ── */}
      <HospitalRoomShell
        theme="lobby"
        width={28}
        depth={28}
        height={10}
        roomTitle="ศูนย์การเรียนรู้สุขภาพมารดาและทารกแรกเกิด (Metaverse Grand Lobby)"
        roomNumber="Main Reception & Triage"
      />

      {/* Decorative Terrazzo Floor Pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 4.5, 32]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.3} />
      </mesh>

      {/* ── Welcome Banner (Top Center, High on Back Wall) ── */}
      <Html position={[0, 7.8, -13.2]} center transform scale={0.55}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '16px 28px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 50, 100, 0.15)',
          border: '2px solid #b3e5fc',
          minWidth: '440px',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ color: '#d81b60', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
            🌸 ยินดีต้อนรับสู่โลกแห่งการเรียนรู้ เพื่อแม่และลูก 👶
          </h1>
          <h2 style={{ color: '#0288d1', margin: '6px 0 0 0', fontSize: '16px', fontWeight: '600' }}>
            สุขภาพดี เริ่มได้จากความรู้และการปฏิบัติจริง
          </h2>
          <p style={{ color: '#555', margin: '8px 0 0 0', fontSize: '13px', fontWeight: '500' }}>
            ❤️ "แม่มั่นใจ...ลูกปลอดภัย...ครอบครัวอบอุ่น"
          </p>
        </div>
      </Html>

      {/* ── Central Holographic Healthcare Hub ── */}
      <group position={[0, 0, -0.8]}>
        {/* Tiered Marble Plaza Pedestal */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.6, 0.5, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2.2, 0.35, 32]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Rotating Holographic Earth Globe */}
        <mesh ref={globeRef} position={[0, 2.6, 0]}>
          <sphereGeometry args={[1.3, 24, 24]} />
          <meshStandardMaterial
            color="#00b0ff"
            wireframe
            emissive="#00b0ff"
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════════════════════════
          🌸 WING 1 (WEST / LEFT WALL): โซนการดูแลตนเองของมารดา (Mother Care Wards 101-104)
          4 Distinct Walkable Doorways along X = -10.5 (Facing +X into Lobby)
          ═══════════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="motherCare1"
        roomNumber="Ward 101"
        roomTitle="การดูแลร่างกายและการฟื้นตัว"
        icon="🏥"
        theme="mother"
        position={[-10.5, 0, -6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare2"
        roomNumber="Ward 102"
        roomTitle="การดูแลแผลหลังคลอด"
        icon="🩹"
        theme="mother"
        position={[-10.5, 0, -2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare3"
        roomNumber="Ward 103"
        roomTitle="การดูแลเต้านมและท่าให้นม"
        icon="🤱"
        theme="mother"
        position={[-10.5, 0, 2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare4"
        roomNumber="Ward 104"
        roomTitle="สังเกตอาการผิดปกติและแทรกซ้อน"
        icon="🩺"
        theme="mother"
        position={[-10.5, 0, 6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════════
          👶 WING 2 (EAST / RIGHT WALL): โซนการดูแลทารกแรกเกิด (Newborn Care Nurseries 201-204)
          4 Distinct Walkable Doorways along X = +10.5 (Facing -X into Lobby)
          ═══════════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="newbornCare1"
        roomNumber="Nursery 201"
        roomTitle="การให้นมทารกแรกเกิด"
        icon="🍼"
        theme="newborn"
        position={[10.5, 0, -6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare2"
        roomNumber="Nursery 202"
        roomTitle="การอาบน้ำทารกแรกเกิด"
        icon="🛁"
        theme="newborn"
        position={[10.5, 0, -2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare3"
        roomNumber="Nursery 203"
        roomTitle="การเปลี่ยนผ้าอ้อมและขับถ่าย"
        icon="👶"
        theme="newborn"
        position={[10.5, 0, 2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare4"
        roomNumber="Nursery 204"
        roomTitle="การดูแลสายสะดือทารก"
        icon="🔗"
        theme="newborn"
        position={[10.5, 0, 6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════════
          🏛️ WING 3 (NORTH / BACK WALL): Nursery 205 + Quiz Hall 301 + Welcome Hub
          Walkable Doorways along Z = -10.5 (Facing +Z into Lobby)
          ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* 5th Newborn Room */}
      <WalkableRoomPortal
        roomKey="newbornCare5"
        roomNumber="Nursery 205"
        roomTitle="การจัดสภาพแวดล้อมที่ปลอดภัย"
        icon="🏠"
        theme="newborn"
        position={[5.4, 0, -10.5]}
        rotation={[0, 0, 0]}
      />

      {/* Grand Quiz Hall Portal (Center Back) */}
      <WalkableRoomPortal
        roomKey="quiz"
        roomNumber="Hall 301"
        roomTitle="ห้องแบบทดสอบประเมินความรู้ (Quiz)"
        icon="🎓"
        theme="quiz"
        position={[0, 0, -10.5]}
        rotation={[0, 0, 0]}
        scale={1.12}
      />

      {/* Maternity Directory Board (Left Back Wall) */}
      <group position={[-5.4, 0, -10.5]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.2, 2.6, 0.12]} />
          <meshStandardMaterial color="#fce4ec" roughness={0.3} />
        </mesh>
        <Html position={[0, 1.8, 0.08]} center transform scale={0.24}>
          <div style={{
            background: 'white',
            padding: '14px',
            borderRadius: '14px',
            border: '2px solid #f48fb1',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            width: '260px',
            textAlign: 'center',
            userSelect: 'none'
          }}>
            <div style={{ background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>
              ℹ️ ป้ายแนะนำเส้นทางแผนก
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '8px', textAlign: 'left', lineHeight: '1.4' }}>
              <p>⬅ <b>ฝั่งซ้าย:</b> แผนกบริบาลมารดา Ward 101 - 104</p>
              <p>➡ <b>ฝั่งขวา:</b> แผนกทารกแรกเกิด Nursery 201 - 205</p>
              <p>⬆ <b>ตรงกลาง:</b> หอประเมินความรู้ Hall 301</p>
            </div>
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#888' }}>
              เดินเข้าซุ้มประตูแต่ละห้องเพื่อเข้าสู่บทเรียนได้ทันที
            </div>
          </div>
        </Html>
      </group>

      {/* ── Authentic 3D Hospital Ambience & Nature (Trees, Plants & Furniture) ── */}
      {/* Real 3D Trees in 4 Corners */}
      <RealTree position={[-11.5, 0, -11]} scale={0.9} />
      <RealTree position={[11.5, 0, -11]} scale={0.9} />
      <RealTree position={[-11.5, 0, 10]} scale={0.8} />
      <RealTree position={[11.5, 0, 10]} scale={0.8} />

      {/* Real 3D Potted Plants Flanking Hallways */}
      <RealPlant type="potted" position={[-5.0, 0, -6.2]} scale={1.15} />
      <RealPlant type="house" position={[5.0, 0, -6.2]} scale={1.05} />
      <RealPlant type="succulent" position={[-10.8, 0, 0]} scale={1.2} />
      <RealPlant type="succulent" position={[10.8, 0, 0]} scale={1.2} />

      {/* Real 3D Hospital Lounge Sofas (Spacious Waiting Lounge Facing Central Hub) */}
      <InteractiveSeat
        id="lobby_sofa_left"
        name="โซฟาพักผ่อนฝั่งซ้าย"
        type="sofa"
        position={[-6.4, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} scale={1.15} />
        <Pillows position={[0.2, 0.45, 0]} scale={0.85} />
      </InteractiveSeat>

      <InteractiveSeat
        id="lobby_sofa_right"
        name="โซฟาพักผ่อนฝั่งขวา"
        type="sofa"
        position={[6.4, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} scale={1.15} />
        <Pillows position={[-0.2, 0.45, 0]} scale={0.85} />
      </InteractiveSeat>

      {/* Patient Mobility Bay: 2 Real Hospital Wheelchairs (Drivable!) */}
      <InteractiveSeat
        id="lobby_wheelchair_1"
        name="รถเข็นโรงพยาบาล คันที่ 1"
        type="wheelchair"
        position={[-4.5, 0, 4.5]}
        rotation={[0, 0.4, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      <InteractiveSeat
        id="lobby_wheelchair_2"
        name="รถเข็นโรงพยาบาล คันที่ 2"
        type="wheelchair"
        position={[4.5, 0, 4.5]}
        rotation={[0, -0.4, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      {/* Nurse Information & Triage Desk with Fresh Flowers & Examination Lamp */}
      <DoctorDesk position={[0, 0, -4.2]} rotation={[0, 0, 0]} scale={1.05} />
      <FlowerVase position={[0.65, 0.85, -4.2]} scale={1.1} />
      <ExaminationLamp position={[-0.65, 0.85, -4.0]} scale={0.7} />

      {/* Emergency First Aid & Hygiene Cabinet */}
      <MedicineCabinet position={[12.2, 0, -4.5]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} withMedicalBox={true} />

      {/* Hospital Pedal Waste Bins */}
      <HospitalTrashBin position={[1.8, 0, -4.5]} scale={0.85} />
      <HospitalTrashBin position={[-1.8, 0, -4.5]} scale={0.85} />

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
