import React, { useMemo } from 'react';
import * as THREE from 'three';
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
import { FramedImagePoster3D } from '../furniture/CozyRoomFurniture';

function useDirectionalSignTexture(icon, title, subtitle, bgStart, bgEnd, borderColor, textColor, arrowColor) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 920;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, bgStart);
    g.addColorStop(1, bgEnd);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = '84px system-ui, sans-serif';
    ctx.fillText(icon, 38, canvas.height / 2);

    ctx.fillStyle = textColor;
    ctx.font = '900 58px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText(title, 150, canvas.height * 0.39);

    ctx.font = '700 30px "Sarabun", system-ui, -apple-system, sans-serif';
    ctx.fillText(subtitle, 150, canvas.height * 0.72);

    ctx.textAlign = 'right';
    ctx.fillStyle = arrowColor;
    ctx.font = '900 72px system-ui, sans-serif';
    ctx.fillText('➔', canvas.width - 42, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [icon, title, subtitle, bgStart, bgEnd, borderColor, textColor, arrowColor]);
}

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const hasCompletedPretest = useStore((state) => state.hasCompletedPretest);
  const openLightbox = useStore((state) => state.openLightbox);

  const motherDirSignTex = useDirectionalSignTexture(
    '🤱',
    'ห้องดูแลคุณแม่',
    'Maternal Care Room (Ward 101–104)',
    '#fff1f2',
    '#ffe4e6',
    '#f472b6',
    '#9d174d',
    '#db2777'
  );

  const newbornDirSignTex = useDirectionalSignTexture(
    '👶',
    'ห้องดูแลทารก',
    'Newborn Care Room (Nursery 201–204)',
    '#f0f9ff',
    '#e0f2fe',
    '#38bdf8',
    '#0369a1',
    '#0284c7'
  );

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
          (3D Mesh แท้ติดผนังฉากหลังเคาน์เตอร์พยาบาล ไม่ลอย 100%)
          ══════════════════════════════════════════════════════════════════════════════ */}
      {[-5.35, 5.35].map((px, sideIdx) => (
        <group key={`lobby_flank_${sideIdx}`} position={[px, 0, -5.20]}>
          {/* Architectural Backing Panel Connected Flush to Nurse Station Backdrop */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.5, 5.0, 0.15]} />
            <meshStandardMaterial color="#fffaf4" roughness={0.3} />
          </mesh>
          {/* Vertical Warm Oak Wood Slats on Outer Edge */}
          {[-1.56, -1.40, 1.40, 1.56].map((sx, si) => (
            <mesh key={`slat_${si}`} position={[sx, 2.5, 0.06]} castShadow>
              <boxGeometry args={[0.06, 4.9, 0.08]} />
              <meshStandardMaterial color="#b07d4b" roughness={0.45} />
            </mesh>
          ))}
          {/* Pink & White Floral Garland at Bottom of Frame */}
          {[-0.85, -0.5, -0.18, 0.18, 0.5, 0.85].map((fx, fi) => (
            <group key={`fl_gar_${fi}`} position={[fx, 0.88, 0.14]}>
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

          {/* 3D WebGL Poster Mesh Mounted Flush on the Architectural Backing Wall */}
          <FramedImagePoster3D
            position={[0, 2.65, 0.09]}
            width={2.36}
            height={3.16}
            src="/images/rev/lobby_mother_baby_poster.jpg"
            title={sideIdx === 0 ? 'สุขภาพดี เริ่มได้ที่นี่' : 'ดูแลด้วยหัวใจ ทุกช่วงชีวิต'}
            badgeText="🔍 คลิกขยาย"
            headerColor="#e11d48"
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
              })
            }
          />
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
          Portals attached flush against the inner wall surface at X = -10.78 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="motherCare1"
        roomNumber="Ward 101"
        roomTitle="การดูแลร่างกายและการฟื้นตัว"
        icon="🏥"
        theme="mother"
        position={[-10.78, 0, -6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare2"
        roomNumber="Ward 102"
        roomTitle="การดูแลแผลหลังคลอด"
        icon="🩹"
        theme="mother"
        position={[-10.78, 0, -2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare3"
        roomNumber="Ward 103"
        roomTitle="การดูแลเต้านมและท่าให้นม"
        icon="🤱"
        theme="mother"
        position={[-10.78, 0, 2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="motherCare4"
        roomNumber="Ward 104"
        roomTitle="สังเกตอาการผิดปกติและแทรกซ้อน"
        icon="🩺"
        theme="mother"
        position={[-10.78, 0, 6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          👶 WING 2 (EAST / RIGHT WALL): โซนการดูแลทารกแรกเกิด (Newborn Care Nurseries 201-204)
          Portals attached flush against the inner wall surface at X = +10.78 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="newbornCare1"
        roomNumber="Nursery 201"
        roomTitle="การให้นมทารกแรกเกิด"
        icon="🍼"
        theme="newborn"
        position={[10.78, 0, -6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare2"
        roomNumber="Nursery 202"
        roomTitle="การอาบน้ำและการเปลี่ยนผ้าอ้อม"
        icon="🛁"
        theme="newborn"
        position={[10.78, 0, -2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare3"
        roomNumber="Nursery 203"
        roomTitle="การดูแลสายสะดือทารกแรกเกิด"
        icon="🔗"
        theme="newborn"
        position={[10.78, 0, 2.2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WalkableRoomPortal
        roomKey="newbornCare4"
        roomNumber="Nursery 204"
        roomTitle="สภาพแวดล้อมที่ปลอดภัยสำหรับทารก"
        icon="🏠"
        theme="newborn"
        position={[10.78, 0, 6.6]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          🏛️ WING 3 (NORTH / BACK WALL): Grand Quiz Hall 301 + Welcome Hub
          Portals attached flush against inner back wall at Z = -10.78 (ไม่ลอย)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <WalkableRoomPortal
        roomKey="quiz"
        roomNumber="Hall 301"
        roomTitle="ห้องแบบทดสอบประเมินความรู้ (20 ข้อ)"
        icon="🎓"
        theme="quiz"
        position={[0, 0, -10.78]}
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
        position={[5.4, 0, -10.78]}
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

      {/* ── Panoramic Garden Glass Window & Welcome Zone Directional Wall (South Wall Z = +10.78 ติดผนังด้านใน 100%) ── */}
      <group position={[0, 0, 10.78]} rotation={[0, Math.PI, 0]}>
        {/* 3D Panoramic Garden Window Frame & View (3D Mesh แท้ติดผนัง ไม่ลอย) */}
        <FramedImagePoster3D
          position={[-2.2, 2.55, 0.02]}
          width={9.8}
          height={3.6}
          src="/images/rev/lobby_garden_window.jpg"
          title="โซนต้อนรับและสวนธรรมชาติบำบัด (Welcome & Healing Garden Zone)"
          badgeText="🔍 คลิกชมภาพใหญ่"
          headerColor="#059669"
          onClick={() =>
            openLightbox({
              src: '/images/rev/lobby_garden_window.jpg',
              title: 'โซนต้อนรับและสวนธรรมชาติบำบัด (Welcome & Healing Garden Zone)',
              badge: 'โซนต้อนรับ',
              description: 'บรรยากาศโซนต้อนรับอบอุ่น ผ่อนคลาย มองเห็นสวนสีเขียวธรรมชาติ พร้อมป้ายบอกทางไปห้องดูแลคุณแม่และห้องดูแลทารก',
            })
          }
        />

        {/* Vertical Warm Oak Wood Slat Feature Wall Column behind Directional Signs */}
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

          {/* 3D Directional Wall Signs Mounted Flush on Wood Slat Wall (ไม่ใช้ Html transform จึงไม่ลอย) */}
          <group
            position={[0, 3.25, 0.10]}
            onClick={(e) => {
              e.stopPropagation();
              setRoom('motherCare1');
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[3.4, 0.88, 0.04]} />
              <meshStandardMaterial color="#f472b6" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[3.34, 0.84]} />
              <meshBasicMaterial map={motherDirSignTex} toneMapped={false} />
            </mesh>
          </group>

          <group
            position={[0, 2.18, 0.10]}
            onClick={(e) => {
              e.stopPropagation();
              setRoom('newbornCare1');
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[3.4, 0.88, 0.04]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[3.34, 0.84]} />
              <meshBasicMaterial map={newbornDirSignTex} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Soft Cream Carpet Rug & Garden Waiting Lounge Sofa in front of the Panoramic Garden Window */}
      <mesh position={[3.0, 0.012, 6.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.3, 40]} />
        <meshStandardMaterial color="#f5ebe0" roughness={0.92} />
      </mesh>
      <InteractiveSeat
        id="lobby_garden_sofa"
        name="โซฟาพักผ่อนชมสวนธรรมชาติบำบัด"
        type="sofa"
        position={[3.2, 0, 7.6]}
        rotation={[0, Math.PI, 0]}
        seatOffset={[0, 0.44, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={0.98} layout="right" />
      </InteractiveSeat>

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
