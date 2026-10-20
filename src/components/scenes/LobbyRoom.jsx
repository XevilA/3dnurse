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
          🖼️ FLANKING PINK MOTHER & BABY FRAMED POSTERS WITH FLORAL GARLANDS
          (Positioned on BOTH Left & Right of the Reception Desk, matching heic2.png top photo)
          ══════════════════════════════════════════════════════════════════════════════ */}
      {[-5.35, 5.35].map((px, sideIdx) => (
        <group key={`lobby_flank_${sideIdx}`} position={[px, 0, -4.75]}>
          {/* Architectural Backing Panel */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.1, 4.8, 0.14]} />
            <meshStandardMaterial color="#fffaf4" roughness={0.3} />
          </mesh>
          {/* Vertical Warm Oak Wood Slats on Outer Edge */}
          {[-1.42, -1.28, 1.28, 1.42].map((sx, si) => (
            <mesh key={`slat_${si}`} position={[sx, 2.5, 0.06]} castShadow>
              <boxGeometry args={[0.06, 4.76, 0.08]} />
              <meshStandardMaterial color="#b07d4b" roughness={0.45} />
            </mesh>
          ))}
          {/* Warm Rounded Oak Frame + LED Backlight */}
          <mesh position={[0, 2.55, 0.09]} castShadow>
            <boxGeometry args={[2.36, 3.16, 0.06]} />
            <meshStandardMaterial color="#a8703e" roughness={0.45} />
          </mesh>
          <mesh position={[0, 2.55, 0.07]}>
            <boxGeometry args={[2.44, 3.24, 0.02]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.75} />
          </mesh>
          {/* Pink & White Floral Garland at Bottom of Frame (ตามรูป heic2.png) */}
          {[-0.85, -0.5, -0.18, 0.18, 0.5, 0.85].map((fx, fi) => (
            <group key={`fl_gar_${fi}`} position={[fx, 1.02, 0.15]}>
              <mesh>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshStandardMaterial color={fi % 2 === 0 ? '#f9a8d4' : '#ffffff'} roughness={0.7} />
              </mesh>
              <mesh position={[0.06, -0.04, 0.03]}>
                <sphereGeometry args={[0.08, 10, 10]} />
                <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
              </mesh>
            </group>
          ))}

          {/* Clickable High-Res Pink Mother & Baby Poster (/images/rev/lobby_mother_baby_poster.jpg) */}
          <Html position={[0, 2.58, 0.13]} center transform scale={0.22}>
            <div
              onClick={() =>
                openLightbox({
                  src: '/images/rev/lobby_mother_baby_poster.jpg',
                  title:
                    sideIdx === 0
                      ? 'สุขภาพดี เริ่มได้ที่นี่: การบริบาลสุขภาพมารดาและทารกแรกเกิด'
                      : 'ดูแลด้วยหัวใจ ทุกช่วงของชีวิต: ศูนย์การเรียนรู้แม่และเด็ก',
                  badge: 'โปสเตอร์ต้อนรับหน้าเคาน์เตอร์พยาบาล',
                  description:
                    'ปกป้องดูแลคุณแม่หลังคลอดและทารกแรกเกิดด้วยความรัก ความอบอุ่น และมาตรฐานทางการพยาบาลครบวงจร',
                  items: [
                    {
                      src: '/images/rev/lobby_mother_baby_poster.jpg',
                      title: 'โปสเตอร์ต้อนรับ: การดูแลคุณแม่และทารกแรกเกิดด้วยหัวใจ',
                      badge: 'Main Lobby Poster',
                    },
                    {
                      src: '/images/rev/lobby_reception_ref.jpg',
                      title: 'บรรยากาศเคาน์เตอร์ต้อนรับและจุดบริการพยาบาล (Reception Station)',
                      badge: 'Main Lobby Reference',
                    },
                    {
                      src: '/images/rev/lobby_garden_ref.jpg',
                      title: 'โซนต้อนรับวิวสวนธรรมชาติและป้ายบอกทาง (Garden Welcome Zone)',
                      badge: 'Garden View Reference',
                    },
                  ],
                  currentIndex: 0,
                })
              }
              style={{
                width: '410px',
                height: '550px',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '5px solid #ffffff',
                boxShadow: '0 10px 28px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                background: '#fff1f2',
                position: 'relative',
              }}
            >
              <img
                src="/images/rev/lobby_mother_baby_poster.jpg"
                alt="Mother and Baby Care Poster"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(225, 29, 72, 0.9)',
                  color: '#ffffff',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}
              >
                🔍 แตะเพื่อดูภาพขยายใหญ่
              </div>
            </div>
          </Html>
        </group>
      ))}

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

      {/* ── Panoramic Garden Glass Window & Welcome Zone Directional Wall (South Wall Z = +10.82) ── */}
      <group position={[0, 0, 10.82]} rotation={[0, Math.PI, 0]}>
        {/* Large Panoramic Garden Window Frame */}
        <mesh position={[-2.2, 2.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.4, 3.8, 0.14]} />
          <meshStandardMaterial color="#b07d4b" roughness={0.4} />
        </mesh>
        {/* Window Glass View of Lush Green Hospital Garden */}
        <Html position={[-2.2, 2.55, 0.09]} center transform scale={0.45}>
          <div
            onClick={() =>
              openLightbox({
                src: '/images/rev/lobby_garden_ref.jpg',
                title: 'โซนต้อนรับและสวนธรรมชาติบำบัด (Welcome & Healing Garden Zone)',
                badge: 'โซนต้อนรับ',
                description: 'บรรยากาศโซนต้อนรับอบอุ่น ผ่อนคลาย มองเห็นสวนสีเขียวธรรมชาติ พร้อมป้ายบอกทางไปห้องดูแลคุณแม่และห้องดูแลทารก',
              })
            }
            style={{
              width: '880px',
              height: '310px',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '6px solid #d4a373',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              position: 'relative',
              background: '#ecfdf5',
            }}
          >
            <img
              src="/images/rev/lobby_garden_window.jpg"
              alt="Hospital Garden View"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </Html>

        {/* Vertical Warm Oak Wood Slat Feature Wall Column behind Directional Signs (ตามรูป heic2.png ล่าง) */}
        <group position={[5.8, 0, 0]}>
          <mesh position={[0, 2.55, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 4.9, 0.08]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.5} />
          </mesh>
          {Array.from({ length: 14 }).map((_, si) => (
            <mesh key={`gd_slat_${si}`} position={[-1.95 + si * 0.3, 2.55, 0.06]} castShadow>
              <boxGeometry args={[0.1, 4.86, 0.06]} />
              <meshStandardMaterial color="#b07d4b" roughness={0.45} />
            </mesh>
          ))}
          {/* Large White Planter Box with Green Foliage & Pink Roses below Directional Signs */}
          <group position={[0, 0, 0.42]}>
            <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.6, 0.72, 0.68]} />
              <meshStandardMaterial color="#ffffff" roughness={0.25} />
            </mesh>
            {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bi) => (
              <group key={`rose_bush_${bi}`} position={[bx, 0.82, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.32, 14, 14]} />
                  <meshStandardMaterial color="#2d6a4f" roughness={0.75} />
                </mesh>
                <mesh position={[0.08, 0.22, 0.14]}>
                  <sphereGeometry args={[0.11, 12, 12]} />
                  <meshStandardMaterial color={bi % 2 === 0 ? '#f472b6' : '#fbcfe8'} roughness={0.6} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* Warm Directional Wall Signs Next to Garden Window (Matching bottom photo of heic2.jpg) */}
        <Html position={[5.8, 2.85, 0.12]} center transform scale={0.28}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', userSelect: 'none' }}>
            <div
              onClick={() => setRoom('motherCare1')}
              style={{
                background: 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)',
                border: '3px solid #f472b6',
                borderRadius: '18px',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                boxShadow: '0 6px 18px rgba(244,114,182,0.22)',
                cursor: 'pointer',
                minWidth: '380px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>🤱</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#9d174d' }}>ห้องดูแลคุณแม่</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#be185d' }}>Maternal Care Room (Ward 101–104)</div>
                </div>
              </div>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#db2777' }}>➔</span>
            </div>

            <div
              onClick={() => setRoom('newbornCare1')}
              style={{
                background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)',
                border: '3px solid #f59e0b',
                borderRadius: '18px',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                boxShadow: '0 6px 18px rgba(245,158,11,0.22)',
                cursor: 'pointer',
                minWidth: '380px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>👶</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#92400e' }}>ห้องดูแลทารก</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#b45309' }}>Newborn Care Room (Nursery 201–204)</div>
                </div>
              </div>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#d97706' }}>➔</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Garden Waiting Lounge Sofa in front of the Panoramic Garden Window (ตามรูป heic2.png ล่าง) */}
      <InteractiveSeat
        id="lobby_garden_sofa"
        name="โซฟาพักผ่อนชมสวนธรรมชาติบำบัด"
        type="sofa"
        position={[3.2, 0, 7.6]}
        rotation={[0, Math.PI, 0]}
        seatOffset={[0, 0.44, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={0.98} layout="left" />
      </InteractiveSeat>

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
