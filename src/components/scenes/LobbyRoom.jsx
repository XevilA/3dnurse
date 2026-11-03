import React, { useMemo, useEffect } from 'react';
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
import { CANVAS_THAI_FONT, fillRightText, whenFontsReady } from '../../utils/canvasText';

function useDirectionalSignTexture(
  icon,
  title,
  subtitle,
  bgStart,
  bgEnd,
  borderColor,
  textColor,
  arrowColor,
  arrowDir = 'right'
) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
      g.addColorStop(0, bgStart);
      g.addColorStop(1, bgEnd);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.font = `68px ${CANVAS_THAI_FONT}`;
      ctx.fillText(icon, 30, canvas.height / 2);

      ctx.fillStyle = textColor;
      ctx.font = `900 46px ${CANVAS_THAI_FONT}`;
      ctx.fillText(title, 124, canvas.height * 0.39);

      ctx.font = `700 24px ${CANVAS_THAI_FONT}`;
      ctx.fillText(subtitle, 124, canvas.height * 0.72);

      ctx.fillStyle = arrowColor;
      ctx.font = `900 62px ${CANVAS_THAI_FONT}`;
      fillRightText(ctx, arrowDir === 'left' ? '⬅' : '➔', canvas.width - 34, canvas.height / 2);
    };

    draw();

    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    t.__redraw = () => {
      draw();
      t.needsUpdate = true;
    };
    return t;
  }, [icon, title, subtitle, bgStart, bgEnd, borderColor, textColor, arrowColor, arrowDir]);

  useEffect(() => {
    const cancel = whenFontsReady(() => {
      if (tex && tex.__redraw) tex.__redraw();
    });
    return () => {
      cancel();
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

export default function LobbyRoom() {
  const hasCompletedPretest = useStore((state) => state.hasCompletedPretest);
  const triggerPretestWarning = useStore((state) => state.triggerPretestWarning);
  const requestRoomEntry = useStore((state) => state.requestRoomEntry);
  const openLightbox = useStore((state) => state.openLightbox);

  const handleDirectionalSignClick = (roomInfo) => {
    if (!hasCompletedPretest) {
      triggerPretestWarning(roomInfo.roomKey);
      return;
    }
    requestRoomEntry(roomInfo);
  };

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
    '#0284c7',
    'left'
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
          🖼️ FLANKING MOTHER & BABY FRAMED POSTERS WITH FLORAL GARLANDS (อัปเดตภาพคู่ซ้าย-ขวาใหม่ตามคอมเมนต์ลูกค้า)
          - ซ้าย (sideIdx === 0): ภาพครอบครัวพ่อแม่ลูกกรอบชมพูโบว์ชมพู (/images/rev/lobby_poster_baby_v2.jpg)
          - ขวา (sideIdx === 1): ภาพคุณแม่อุ้มลูกน้อยกรอบชมพูโบว์ชมพู (/images/rev/lobby_poster_mother_v2.jpg)
          ══════════════════════════════════════════════════════════════════════════════ */}
      {[-5.35, 5.35].map((px, sideIdx) => {
        const posterSrc =
          sideIdx === 0
            ? '/images/rev/lobby_poster_baby_v2.jpg'
            : '/images/rev/lobby_poster_mother_v2.jpg';
        return (
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

            {/* 3D WebGL Poster Mesh พอดีกรอบสัดส่วน 4:5 (2.40 x 3.00) เต็มเฟรมไม่ถูกแถบข้อความบีบ */}
            <FramedImagePoster3D
              position={[0, 2.66, 0.09]}
              width={2.52}
              height={2.86}
              contain={true}
              src={posterSrc}
              title=""
              badgeText=""
              onClick={() =>
                openLightbox({
                  src: posterSrc,
                  title:
                    sideIdx === 0
                      ? 'ครอบครัวอบอุ่น: การมีส่วนร่วมของครอบครัวในการดูแลแม่และทารกหลังคลอด'
                      : 'สายใยรักแม่ลูก: การโอบอุ้มดูแลมารดาหลังคลอดและทารกแรกเกิดด้วยความอบอุ่น',
                  badge: sideIdx === 0 ? 'โปสเตอร์ต้อนรับ (ฝั่งลูก)' : 'โปสเตอร์ต้อนรับ (ฝั่งแม่)',
                  description:
                    'ปกป้องดูแลคุณแม่หลังคลอดและทารกแรกเกิดด้วยความรัก ความอบอุ่น และมาตรฐานทางการพยาบาลครบวงจร',
                })
              }
            />
          </group>
        );
      })}

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
        seatOffset={[0, 0.46, 0.05]}
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
        seatOffset={[0, 0.46, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={1.05} layout="left" />
      </InteractiveSeat>




      {/* ── Patient Mobility: Hospital Wheelchairs Parked Neatly in the South-West & South-East Corners ("จอดชิดมุม") ── */}
      <InteractiveSeat
        id="lobby_wheelchair_1"
        name="รถเข็นโรงพยาบาล มุมห้องฝั่งปีกมารดา (West Corner)"
        type="wheelchair"
        position={[-9.1, 0, 8.1]}
        rotation={[0, Math.PI * 0.38, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.12} />
      </InteractiveSeat>

      <InteractiveSeat
        id="lobby_wheelchair_2"
        name="รถเข็นโรงพยาบาล มุมห้องฝั่งปีกทารก (East Corner)"
        type="wheelchair"
        position={[8.05, 0, 9.15]}
        rotation={[0, -Math.PI * 0.72, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.12} />
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
          + โปสเตอร์ภาพหน้าห้องแม่ครบทั้ง 4 ห้อง (สัดส่วน 2:3 1024x1536 คลิกขยายใหญ่ได้)
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
      <FramedImagePoster3D
        position={[-10.75, 1.54, -4.82]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#ec4899"
        src="/images/rev/lobby_front_w101.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_w101.jpg',
            title: 'Ward 101: การดูแลร่างกายและการฟื้นตัวหลังคลอด',
            badge: 'หน้าห้องแม่ 1 (Ward 101)',
            description: 'การพักผ่อนให้เพียงพอ ดื่มน้ำสะอาด รับประทานอาหารครบ 5 หมู่ การบริหารร่างกายเบา ๆ และการทำความสะอาดร่างกายหลังคลอด',
          })
        }
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
      <FramedImagePoster3D
        position={[-10.75, 1.54, -0.42]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#ec4899"
        src="/images/rev/lobby_front_w102.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_w102.jpg',
            title: 'Ward 102: การดูแลแผลหลังคลอด',
            badge: 'หน้าห้องแม่ 2 (Ward 102)',
            description: 'การดูแลทำความสะอาดแผลฝีเย็บและแผลผ่าตัดคลอดอย่างถูกวิธี เพื่อป้องกันการติดเชื้อและส่งเสริมการหายของแผล',
          })
        }
      />

      <WalkableRoomPortal
        roomKey="motherCare3"
        roomNumber="Mother Care 3"
        roomTitle="ดูแลเต้านม"
        icon="🤱"
        theme="mother"
        position={[-10.78, 0, 2.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <FramedImagePoster3D
        position={[-10.75, 1.54, 3.98]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#ec4899"
        src="/images/rev/lobby_front_w103.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_w103.jpg',
            title: 'Ward 103: การดูแลเต้านมและหัวนมหลังคลอด',
            badge: 'หน้าห้องแม่ 3 (Ward 103)',
            description: 'การทำความสะอาดมือและเต้านม การเลือกชุดชั้นในพยุงเต้านม และการดูแลหัวนมอย่างเหมาะสมสำหรับการให้นมบุตร',
          })
        }
      />

      <WalkableRoomPortal
        roomKey="motherCare4"
        roomNumber="Mother Care 4"
        roomTitle="สังเกตอาการผิดปกติ"
        icon="🩺"
        theme="mother"
        position={[-10.78, 0, 6.6]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <FramedImagePoster3D
        position={[-10.75, 1.54, 8.32]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#ec4899"
        src="/images/rev/lobby_front_w104.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_w104.jpg',
            title: 'Ward 104: การสังเกตอาการผิดปกติหลังคลอด',
            badge: 'หน้าห้องแม่ 4 (Ward 104)',
            description: 'สัญญาณอันตรายหลังคลอดที่ต้องรีบมาพบแพทย์ เช่น มีไข้สูง ปวดศีรษะรุนแรง เลือดออกมากผิดปกติ หรือเต้านมอักเสบปวดบวมแดง',
          })
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          👶 WING 2 (EAST / RIGHT WALL): โซนการดูแลทารกแรกเกิด (Newborn Care Nurseries 201-204)
          Portals attached flush against the inner wall surface at X = +10.78 (ไม่ลอย)
          + โปสเตอร์ภาพหน้าห้องทารก 4 ห้อง (สัดส่วน 2:3 1024x1536 คลิกขยายใหญ่ได้)
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
      <FramedImagePoster3D
        position={[10.75, 1.54, -4.82]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#0284c7"
        src="/images/rev/lobby_front_nb201.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_nb201.jpg',
            title: 'Nursery 201: การให้นมทารกแรกเกิดและการอุ้มเรอ',
            badge: 'หน้าห้องทารก 1 (Nursery 201)',
            description: 'การจัดท่าอุ้มให้นมบุตรอย่างถูกวิธี 4 ท่าหลัก การเข้าเต้าอย่างมีประสิทธิภาพ และการอุ้มไล่ลมหลังอิ่มนม',
          })
        }
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
      <FramedImagePoster3D
        position={[10.75, 1.54, -0.42]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#0284c7"
        src="/images/rev/lobby_front_nb202.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_nb202.jpg',
            title: 'Nursery 202: การอาบน้ำและการเปลี่ยนผ้าอ้อมทารก',
            badge: 'หน้าห้องทารก 2 (Nursery 202)',
            description: 'ขั้นตอนการสระผม อาบน้ำ เช็ดตัวห่อตัวให้อบอุ่น และการสวมผ้าอ้อมให้ทารกแรกเกิดอย่างปลอดภัย',
          })
        }
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
      <FramedImagePoster3D
        position={[10.75, 1.54, 3.98]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#0284c7"
        src="/images/rev/lobby_front_nb203.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_nb203.jpg',
            title: 'Nursery 203: การดูแลสายสะดือทารกแรกเกิด',
            badge: 'หน้าห้องทารก 3 (Nursery 203)',
            description: 'การเช็ดทำความสะอาดสายสะดือทารกแรกเกิดอย่างถูกวิธี การพับขอบผ้าอ้อมใต้สะดือ และการสังเกตสัญญาณผิดปกติของสะดือ',
          })
        }
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
      <FramedImagePoster3D
        position={[10.75, 1.54, 8.32]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.08}
        height={1.58}
        contain={true}
        backlit={false}
        frameColor="#8c5a32"
        accentColor="#0284c7"
        src="/images/rev/lobby_front_nb204.jpg"
        title=""
        badgeText=""
        onClick={() =>
          openLightbox({
            src: '/images/rev/lobby_front_nb204.jpg',
            title: 'Nursery 204: สภาพแวดล้อมที่ปลอดภัยสำหรับทารก',
            badge: 'หน้าห้องทารก 4 (Nursery 204)',
            description: 'การจัดเตียงนอนและสภาพแวดล้อมห้องนอนทารกที่ปลอดภัย อากาศถ่ายเท แสงไฟอ่อนโยน ปราศจากยุง ควันบุหรี่ และสิ่งของเสี่ยงอันตรายบนที่นอน',
          })
        }
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
        roomTitle="ห้องแต่งตัวคุณแม่หลังคลอด (Postpartum Studio)"
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
      <RealPlant type="succulent" position={[-10.1, 0, 0.78]} scale={1.2} />
      <RealPlant type="succulent" position={[10.1, 0, 0.78]} scale={1.2} />

      {/* ── Panoramic Garden Glass Window & Welcome Zone Directional Wall (South Wall Z = +10.78 ติดผนังด้านใน 100%) ── */}
      <group position={[0, 0, 10.78]} rotation={[0, Math.PI, 0]}>
        {/* หน้าต่างกระจกพาโนรามาชมวิวสวนขนาดกว้างเต็มผืนผนัง ("ปรับวิว ขอบกว้างกว่านี้ค่ะ" + กระจกใสสะท้อนแสงจริง) */}
        <FramedImagePoster3D
          position={[-2.45, 2.55, 0.02]}
          width={12.0}
          height={4.86}
          src="/images/rev/lobby_garden_window.jpg"
          frameColor="#334155"
          backlit={false}
          title=""
          badgeText=""
          onClick={() =>
            openLightbox({
              src: '/images/rev/lobby_garden_window.jpg',
              title: 'โซนต้อนรับและสวนธรรมชาติบำบัด (Welcome & Healing Garden Zone)',
              badge: 'โซนต้อนรับ',
              description: 'บรรยากาศโซนต้อนรับอบอุ่น ผ่อนคลาย มองเห็นสวนสีเขียวธรรมชาติผ่านกระจกบานกว้าง พร้อมป้ายบอกทางไปห้องดูแลคุณแม่และห้องดูแลทารก',
            })
          }
        >
          {/* แผ่นกระจกใสสะท้อนแสงด้านหน้าภาพสวน (Architectural Clear Glass Curtain Wall) */}
          <mesh position={[0, 0, 0.052]}>
            <planeGeometry args={[11.92, 4.78]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.16}
              roughness={0.04}
              metalness={0.35}
            />
          </mesh>
          {/* เส้นแสงสะท้อนเฉียงบนบานกระจกพาโนรามา */}
          {[-4.2, -1.2, 1.8, 4.6].map((gx, gi) => (
            <mesh key={`lob_glint_${gi}`} position={[gx, 0.1, 0.055]} rotation={[0, 0, -0.32]}>
              <planeGeometry args={[0.38, 4.35]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
            </mesh>
          ))}
          {/* เสาซี่ลูกฟักกระจกอลูมิเนียมสถาปัตย์ 4 ช่อง + คานขวางบน + ธรณีหน้าต่างล่าง */}
          {[-3.0, 0, 3.0].map((mx) => (
            <mesh key={`lob_mul_${mx}`} position={[mx, 0, 0.06]}>
              <boxGeometry args={[0.07, 4.78, 0.05]} />
              <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 1.48, 0.06]}>
            <boxGeometry args={[11.92, 0.065, 0.05]} />
            <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.25} />
          </mesh>
          <mesh position={[0, -2.42, 0.08]}>
            <boxGeometry args={[12.16, 0.11, 0.15]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        </FramedImagePoster3D>

        {/* Vertical Warm Oak Wood Slat Feature Wall Column behind Directional Signs */}
        <group position={[6.15, 0, 0]}>
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
              handleDirectionalSignClick({
                roomKey: 'motherCare1',
                roomNumber: 'Ward 101',
                roomTitle: 'การดูแลร่างกายและการฟื้นตัวหลังคลอด',
                icon: '🤱',
                theme: 'mother',
              });
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
              handleDirectionalSignClick({
                roomKey: 'newbornCare1',
                roomNumber: 'Nursery 201',
                roomTitle: 'การให้นมทารกแรกเกิด',
                icon: '👶',
                theme: 'newborn',
              });
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
        seatOffset={[0, 0.46, 0.05]}
      >
        <RealisticHospitalSofa position={[0, 0, 0]} scale={0.98} layout="right" />
      </InteractiveSeat>

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
