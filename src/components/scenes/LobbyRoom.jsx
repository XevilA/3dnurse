import React from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import RealPlant from '../decorations/RealPlant';
import RealTree from '../decorations/RealTree';
import HospitalNurseStation from '../furniture/HospitalNurseStation';
import RealisticHospitalSofa from '../furniture/RealisticHospitalSofa';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import WalkableRoomPortal from '../environment/WalkableRoomPortal';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const hasCompletedPretest = useStore((state) => state.hasCompletedPretest);
  const openLightbox = useStore((state) => state.openLightbox);

  return (
    <group>
      {/* ── Realistic 3D Grand Hospital Lobby Architecture (22x22m) ── */}
      <HospitalRoomShell
        theme="lobby"
        width={22}
        depth={22}
        height={8}
        roomTitle="ศูนย์การเรียนรู้สุขภาพมารดาและทารกแรกเกิด (Metaverse Grand Hospital Lobby)"
        roomNumber="Main Reception & Nurse Station"
      />

      {/* Decorative Terrazzo Floor Pathways & Warm Hospital Welcoming Inlays */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.8]}>
        <ringGeometry args={[3.2, 6.2, 40]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1.8]}>
        <ringGeometry args={[6.25, 6.42, 40]} />
        <meshStandardMaterial color="#d4a373" roughness={0.4} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════════
          🏥 CENTRAL NURSE RECEPTION STATION (Faithfully matching client reference photo)
          - Curved Oak Slats with Warm LED Kickplate Glow
          - Center: Red Cross circular emblem & "ยินดีต้อนรับ เราพร้อมดูแลคุณ ❤️"
          - Left: Sky Blue Queue Display Board (A015, A014, B007, B006)
          - 3 Nurses: Pink, Sky Blue, Pink
          - White & Pink Floral Vases, Desktop Monitors, Canopy Downlights
          ══════════════════════════════════════════════════════════════════════════════ */}
      <HospitalNurseStation position={[0, 0, -4.2]} scale={1.08} />

      {/* ══════════════════════════════════════════════════════════════════════════════
          🖼️ AUTHENTIC HOSPITAL WALL POSTERS (Positioned to the left of the counter like in photo)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[-5.2, 0, -4.8]}>
        {/* Wall Panel Backing */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.8, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>

        {/* Poster 1: "สุขภาพดี เริ่มได้ที่นี่ (Mother Care)" — คลิกเพื่อขยายใหญ่ */}
        <group
          position={[-0.8, 2.7, 0.06]}
          onClick={() =>
            openLightbox({
              src: '/references/room1/img_002.jpeg',
              title: 'สุขภาพดี เริ่มได้ที่นี่: การบริบาลสุขภาพมารดาหลังคลอด (Mother Care)',
              badge: 'โปสเตอร์แผนกสูติ-นรีเวช',
              description: 'การดูแลสุขภาพมารดาหลังคลอดเพื่อฟื้นฟูร่างกายอย่างถูกต้อง ปลอดภัยในทุกย่างก้าว และส่งเสริมสุขภาวะทั้งร่างกายและจิตใจ',
              details: [
                '1. การฟื้นตัวของระบบสืบพันธุ์ มดลูกหดรัดตัวเข้าสู่อุ้งเชิงกราน',
                '2. การดูแลความสะอาดแผลฝีเย็บและแผลผ่าตัดคลอด',
                '3. โภชนาการที่อุดมด้วยโปรตีน ธาตุเหล็ก และน้ำสะอาดสำหรับแม่ให้นมบุตร',
                '4. การออกกำลังกายเบาๆ เพื่อฟื้นฟูกล้ามเนื้ออุ้งเชิงกราน (Kegel exercises)'
              ],
              tips: 'หากมีเลือดออกชุ่มผ้าอนามัยเกิน 1 แผ่น/ชม. หรือมีไข้สูง ปวดท้องรุนแรง ให้รีบแจ้งแพทย์พยาบาลทันที'
            })
          }
        >
          <mesh castShadow>
            <boxGeometry args={[1.25, 1.85, 0.03]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          <Html position={[0, 0, 0.02]} center transform scale={0.15}>
            <div
              style={{
                width: '240px',
                height: '360px',
                background: 'linear-gradient(180deg, #ffffff 0%, #fff1f2 100%)',
                border: '2px solid #fda4af',
                borderRadius: '12px',
                padding: '16px 12px',
                boxSizing: 'border-box',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>👩‍🍼</div>
              <h3 style={{ color: '#e11d48', fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>
                สุขภาพดี<br />เริ่มได้ที่นี่
              </h3>
              <div style={{ width: '40px', height: '3px', background: '#f43f5e', margin: '6px auto' }} />
              <p style={{ color: '#475569', fontSize: '11px', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                การดูแลสุขภาพมารดาหลังคลอด<br />
                เพื่อฟื้นฟูร่างกายอย่างถูกต้อง<br />
                และปลอดภัยในทุกย่างก้าว
              </p>
              <div style={{
                background: '#e11d48',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(225,29,72,0.3)'
              }}>
                <span>🔍 แตะเพื่อขยายใหญ่</span>
              </div>
            </div>
          </Html>
        </group>

        {/* Poster 2: "ดูแลด้วยหัวใจ ทุกช่วงของชีวิต (Newborn Care)" — คลิกเพื่อขยายใหญ่ */}
        <group
          position={[0.8, 2.7, 0.06]}
          onClick={() =>
            openLightbox({
              src: '/references/room1/img_006.png',
              title: 'ดูแลด้วยหัวใจ ทุกช่วงของชีวิต: การบริบาลทารกแรกเกิด (Newborn Care)',
              badge: 'โปสเตอร์แผนกทารกแรกเกิด',
              description: 'ปกป้องทารกแรกเกิดด้วยความรักและสัมผัสอันอบอุ่น สร้างสายใยผูกพันแม่สู่ลูกเพื่อพัฒนาการที่สมบูรณ์แข็งแรง',
              details: [
                '1. การให้นมแม่ตั้งแต่ชั่วโมงแรกหลังคลอด และให้ต่อเนื่องอย่างน้อย 6 เดือน',
                '2. การรักษาความอบอุ่นของร่างกายทารก (Thermoregulation)',
                '3. การทำความสะอาดสายสะดืออย่างถูกวิธีเพื่อป้องกันการติดเชื้อ',
                '4. การจัดท่านอนหงาย (Back to Sleep) ป้องกันภาวะ SIDS'
              ],
              tips: 'ทารกแรกเกิดต้องได้รับการสังเกตอาการตัวเหลือง การดูดนม และการหายใจอย่างใกล้ชิด'
            })
          }
        >
          <mesh castShadow>
            <boxGeometry args={[1.25, 1.85, 0.03]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          <Html position={[0, 0, 0.02]} center transform scale={0.15}>
            <div
              style={{
                width: '240px',
                height: '360px',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                border: '2px solid #86efac',
                borderRadius: '12px',
                padding: '16px 12px',
                boxSizing: 'border-box',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>💖🤲</div>
              <h3 style={{ color: '#16a34a', fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>
                ดูแลด้วยหัวใจ<br />ทุกช่วงของชีวิต
              </h3>
              <div style={{ width: '40px', height: '3px', background: '#22c55e', margin: '6px auto' }} />
              <p style={{ color: '#475569', fontSize: '11px', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                ปกป้องทารกแรกเกิดด้วยความรัก<br />
                สายใยผูกพันแม่สู่ลูก<br />
                เติบโตสมวัยแข็งแรงสมบูรณ์
              </p>
              <div style={{
                background: '#16a34a',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(22,163,74,0.3)'
              }}>
                <span>🔍 แตะเพื่อขยายใหญ่</span>
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          🏥 HOSPITAL WAYFINDING DIRECTORY SIGN (Positioned on the right pillar like in photo)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[5.2, 0, -4.8]}>
        {/* Architectural Column Backing */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 4.8, 0.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Wood Slat Trim on Side */}
        {Array.from({ length: 4 }).map((_, si) => (
          <mesh key={`p_slat_${si}`} position={[0.9 + (si * 0.1), 2.5, 0]} castShadow>
            <boxGeometry args={[0.06, 4.78, 0.38]} />
            <meshStandardMaterial color="#b07d4b" roughness={0.4} />
          </mesh>
        ))}

        {/* Directory Signboard Plaque */}
        <group position={[-0.2, 2.9, 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1.8, 0.04]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <Html position={[0, 0, 0.03]} center transform scale={0.16}>
            <div style={{
              width: '280px',
              background: '#ffffff',
              borderRadius: '10px',
              padding: '12px 14px',
              boxSizing: 'border-box',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                background: '#0284c7',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '6px',
                fontWeight: '900',
                fontSize: '12px',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                ℹ️ แผนผังแผนกผู้ป่วย
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px' }}>
                  <span>⬅ แผนกมารดาหลังคลอด</span>
                  <span style={{ fontWeight: 'bold', color: '#db2777' }}>Ward 101-104</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px' }}>
                  <span>➡ แผนกทารกแรกเกิด</span>
                  <span style={{ fontWeight: 'bold', color: '#0284c7' }}>Nursery 201-204</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px' }}>
                  <span>⬆ ห้องสอบประเมินความรู้</span>
                  <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>Hall 301</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>👗 ห้องแต่งตัวคุณแม่</span>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>Suite 001</span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          🛋️ MODERN HOSPITAL WAITING LOUNGES (Exact Pink & Cream Modular Sofas from Photo)
          Foreground & Midground seating with round oak coffee table & green planter boxes
          ══════════════════════════════════════════════════════════════════════════════ */}
      {/* Right Waiting Lounge (Facing diagonal towards Nurse Station, like in photo foreground) */}
      <InteractiveSeat
        id="lobby_lounge_right"
        name="โซฟารอรับบริการ ด้านหน้าขวา"
        type="sofa"
        position={[3.4, 0, 0.2]}
        rotation={[0, -Math.PI * 0.45, 0]}
        seatOffset={[0, 0.44, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={1.05} layout="right" />
      </InteractiveSeat>

      {/* Left Waiting Lounge (Midground left) */}
      <InteractiveSeat
        id="lobby_lounge_left"
        name="โซฟารอรับบริการ ด้านซ้าย"
        type="sofa"
        position={[-3.8, 0, 0.4]}
        rotation={[0, Math.PI * 0.45, 0]}
        seatOffset={[0, 0.44, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={1.05} layout="left" />
      </InteractiveSeat>




      {/* ── Patient Mobility: 2 Real Hospital Wheelchairs Parked Side-by-Side (รถเข็นจอดชิดติดกัน 2 คัน) ── */}
      <InteractiveSeat
        id="lobby_wheelchair_1"
        name="รถเข็นโรงพยาบาล คันที่ 1"
        type="wheelchair"
        position={[-3.6, 0, 4.2]}
        rotation={[0, 0.2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      <InteractiveSeat
        id="lobby_wheelchair_2"
        name="รถเข็นโรงพยาบาล คันที่ 2"
        type="wheelchair"
        position={[-4.8, 0, 4.2]}
        rotation={[0, 0.2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      {/* ── Floor Guidance Pathway to Hall 301 ── */}
      {!hasCompletedPretest && (
        <group position={[0, 0.015, -7.8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1.6, 4.5]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.2}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[-0.82, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, 4.5]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.82, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, 4.5]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════════
          🌸 WING 1 (WEST / LEFT WALL): โซนการดูแลตนเองของมารดา (Mother Care Wards 101-104)
          Portals attached flush against the wall at X = -10.90 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="motherCare1"
        roomNumber="Ward 101"
        roomTitle="การดูแลร่างกายและการฟื้นตัว"
        icon="🏥"
        theme="mother"
        position={[-10.90, 0, -6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare2"
        roomNumber="Ward 102"
        roomTitle="การดูแลแผลหลังคลอด"
        icon="🩹"
        theme="mother"
        position={[-10.90, 0, -2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare3"
        roomNumber="Ward 103"
        roomTitle="การดูแลเต้านมและท่าให้นม"
        icon="🤱"
        theme="mother"
        position={[-10.90, 0, 2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare4"
        roomNumber="Ward 104"
        roomTitle="สังเกตอาการผิดปกติและแทรกซ้อน"
        icon="🩺"
        theme="mother"
        position={[-10.90, 0, 6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          👶 WING 2 (EAST / RIGHT WALL): โซนการดูแลทารกแรกเกิด (Newborn Care Nurseries 201-204)
          Portals attached flush against the wall at X = +10.90 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="newbornCare1"
        roomNumber="Nursery 201"
        roomTitle="การให้นมทารกแรกเกิด"
        icon="🍼"
        theme="newborn"
        position={[10.90, 0, -6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare2"
        roomNumber="Nursery 202"
        roomTitle="การอาบน้ำและการเปลี่ยนผ้าอ้อม"
        icon="🛁"
        theme="newborn"
        position={[10.90, 0, -2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare3"
        roomNumber="Nursery 203"
        roomTitle="การดูแลสายสะดือทารกแรกเกิด"
        icon="🔗"
        theme="newborn"
        position={[10.90, 0, 2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare4"
        roomNumber="Nursery 204"
        roomTitle="สภาพแวดล้อมที่ปลอดภัยสำหรับทารก"
        icon="🏠"
        theme="newborn"
        position={[10.90, 0, 6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          🏛️ WING 3 (NORTH / BACK WALL): Grand Quiz Hall 301 + Welcome Hub
          Portals attached flush against back wall at Z = -10.90 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="quiz"
        roomNumber="Hall 301"
        roomTitle="ห้องแบบทดสอบประเมินความรู้ (20 ข้อ)"
        icon="🎓"
        theme="quiz"
        position={[0, 0, -10.90]}
        rotation={[0, 0, 0]}
        scale={1.15}
      />

      {/* Wardrobe & Dressing Suite Portal (Right Back Wall) */}
      <WalkableRoomPortal
        roomKey="dressingRoom"
        roomNumber="Suite 001"
        roomTitle="ห้องแต่งตัว & สรีระคุณแม่ (Maternity Studio)"
        icon="👗"
        theme="mother"
        position={[5.4, 0, -10.90]}
        rotation={[0, 0, 0]}
        scale={1.05}
      />

      {/* ── Authentic Hospital Trees & Plants ── */}
      <RealTree position={[-9.6, 0, -9.6]} scale={0.85} />
      <RealTree position={[9.6, 0, -9.6]} scale={0.85} />
      <RealTree position={[-9.6, 0, 9.6]} scale={0.8} />
      <RealTree position={[9.6, 0, 9.6]} scale={0.8} />

      <RealPlant type="potted" position={[-4.8, 0, -6.2]} scale={1.15} />
      <RealPlant type="house" position={[4.8, 0, -6.2]} scale={1.05} />
      <RealPlant type="succulent" position={[-10.1, 0, 0]} scale={1.2} />
      <RealPlant type="succulent" position={[10.1, 0, 0]} scale={1.2} />

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
