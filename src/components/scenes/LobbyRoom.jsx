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
import MedicineCabinet from '../furniture/MedicineCabinet';
import WalkableRoomPortal from '../environment/WalkableRoomPortal';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const hasCompletedPretest = useStore((state) => state.hasCompletedPretest);
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

        {/* Rotating Holographic Medical Cross Emblem */}
        <group ref={globeRef} position={[0, 1.8, 0]}>
          {/* Vertical Bar */}
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.7, 0.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
          {/* Horizontal Bar */}
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.2, 0.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
          {/* Subtle Orbit Ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.65, 0.015, 16, 48]} />
            <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* ── Eye-Level Mandatory Pre-test Guidance Billboard (Facing Player Spawn) ── */}
        {!hasCompletedPretest && (
          <Html position={[0, 3.2, 0.4]} center transform scale={0.28}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(254, 243, 199, 0.98))',
              border: '3px solid #f59e0b',
              borderRadius: '24px',
              padding: '16px 28px',
              textAlign: 'center',
              boxShadow: '0 12px 35px rgba(245, 158, 11, 0.45)',
              width: '520px',
              userSelect: 'none',
              pointerEvents: 'auto',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '5px 16px',
                borderRadius: '20px',
                fontWeight: '900',
                fontSize: '13px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
              }}>
                <span>⭐</span>
                <span>ขั้นตอนแรก: บังคับทำแบบทดสอบก่อนเรียน</span>
              </div>
              <h2 style={{ color: '#1e293b', fontSize: '20px', fontWeight: '900', margin: '10px 0 6px 0' }}>
                กรุณาเดินตรงไปยัง Hall 301 ด้านหน้า
              </h2>
              <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.45' }}>
                เพื่อทำแบบทดสอบวัดระดับความรู้ก่อนเรียน (Pre-test 20 ข้อ)<br />
                เมื่อทำเสร็จสิ้น ระบบจะปลดล็อคห้องเรียนรู้ทั้ง 8 ห้องทันที!
              </p>
              <div
                onClick={() => setRoom('quiz')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#7c3aed',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
              >
                <span>🎯 วาร์ปไปที่ Hall 301 ทันที ➜</span>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ── Illuminated Golden Runway leading from Player Spawn to Hall 301 ── */}
      {!hasCompletedPretest && (
        <group position={[0, 0.012, -4.5]}>
          {/* Main Gold Runway Carpet */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[2.0, 11.5]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.25}
              roughness={0.6}
            />
          </mesh>
          {/* Glowing Border Trim Lines */}
          <mesh position={[-1.02, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 11.5]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[1.02, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 11.5]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
          {/* Directional Chevron Floor Indicators */}
          {[-4.0, -1.5, 1.0, 3.5].map((z, idx) => (
            <mesh key={`chevron_${idx}`} position={[0, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.2, 0.25]} />
              <meshStandardMaterial color="#d97706" emissive="#f59e0b" emissiveIntensity={0.6} />
            </mesh>
          ))}
        </group>
      )}

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
        roomTitle="การอาบน้ำและการเปลี่ยนผ้าอ้อม"
        icon="🛁"
        theme="newborn"
        position={[10.5, 0, -2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare3"
        roomNumber="Nursery 203"
        roomTitle="การดูแลสายสะดือทารกแรกเกิด"
        icon="🔗"
        theme="newborn"
        position={[10.5, 0, 2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare4"
        roomNumber="Nursery 204"
        roomTitle="สภาพแวดล้อมที่ปลอดภัยสำหรับทารก"
        icon="🏠"
        theme="newborn"
        position={[10.5, 0, 6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════════
          🏛️ WING 3 (NORTH / BACK WALL): Grand Quiz Hall 301 + Welcome Hub
          Walkable Doorways along Z = -10.5 (Facing +Z into Lobby)
          ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* Grand Quiz Hall Portal (Center Back) */}
      <WalkableRoomPortal
        roomKey="quiz"
        roomNumber="Hall 301"
        roomTitle="ห้องแบบทดสอบประเมินความรู้ (20 ข้อ)"
        icon="🎓"
        theme="quiz"
        position={[0, 0, -10.5]}
        rotation={[0, 0, 0]}
        scale={1.15}
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
              <p>➡ <b>ฝั่งขวา:</b> แผนกทารกแรกเกิด Nursery 201 - 204</p>
              <p>⬆ <b>ตรงกลาง:</b> หอประเมินความรู้ 20 ข้อ Hall 301</p>
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

      {/* Nurse Information & Triage Desk with Fresh Flowers & Examination Lamp (Side Bay) */}
      <DoctorDesk position={[4.6, 0, -4.2]} rotation={[0, -Math.PI / 6, 0]} scale={1.05} />
      <FlowerVase position={[5.25, 0.85, -4.2]} scale={1.1} />
      <ExaminationLamp position={[3.95, 0.85, -4.0]} scale={0.7} />

      {/* Emergency First Aid & Hygiene Cabinet */}
      <MedicineCabinet position={[12.2, 0, -4.5]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} withMedicalBox={true} />

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
