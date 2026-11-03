import React, { useState } from 'react';
import { RoundedBox } from '@react-three/drei';
import ScreenPortal from '../ui/ScreenPortal';
import BillboardLabel3D from '../ui/BillboardLabel3D';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import MotherAvatar from '../avatars/MotherAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import InteractiveSeat from '../furniture/InteractiveSeat';
import RealPlant from '../decorations/RealPlant';
import { FramedImagePoster3D } from '../furniture/CozyRoomFurniture';
import { WindowWithCurtains } from '../ward/WardKit';
import { DiaperStack, BabyTowel, CottonJar } from '../furniture/BabyProps';
import {
  RealisticThrowPillow3D,
  RealisticFoldedClothStack3D,
  RealisticBookStack3D,
  RealisticMedicalBottle3D,
} from '../furniture/RealisticProps3D';

/**
 * NewbornCare3Room — ห้องที่ 3: การดูแลสายสะดือทารกแรกเกิด (Nursery 203)
 *
 * Updated 100% per "โน้ตห้อง ทารก 3-4.pdf" (nb34_p1..nb34_p5):
 * - Room layout matching /images/rev/nb3_room_ref.jpg:
 *   Inside the room: Nurse + Baby (in diaper on examination bed) + Mother's chair beside the bed.
 * - Stainless steel dressing trolley beside the bed with 4 clickable equipment items
 *   ("อุปกรณ์สามารถคลิก ว่านี่คืออะไร"):
 *     1. สำลีก้อน (Sterile Cotton Balls)
 *     2. ไม้พันสำลี / สำลีก้าน (Sterile Cotton Swabs)
 *     3. Alcohol 70% (ขวดแอลกอฮอล์ 70%)
 *     4. ถังขยะติดเชื้อสีแดง (Red Biohazard Waste Bin)
 * - 6 Large, Clear Educational Wall Posters flush around the room walls (North, West, East)
 *   with Previous/Next gallery navigation:
 *     ภาพที่ 1: /images/rev/nb3_poster1_equip.jpg (อุปกรณ์เช็ดสะดือ)
 *     ภาพที่ 2: /images/rev/nb3_poster2_fresh.jpg (วิธีการเช็ดสะดือทารก - สะดือสด)
 *     ภาพที่ 3: /images/rev/nb3_poster3_dry.jpg (วิธีการเช็ดสะดือทารก - สะดือเริ่มแห้ง)
 *     ภาพที่ 4: /images/rev/nb3_poster4_timeline.jpg (สายสะดือมักหลุดเมื่อไหร่ ?)
 *     ภาพที่ 5: /images/rev/nb3_poster5_warning.jpg (ข้อควรสังเกต สัญญาณผิดปกติของสะดือทารก)
 *     ภาพที่ 6: /images/rev/nb3_poster6_diaper.jpg (การใส่แพมเพิสที่ถูกต้อง)
 * - Mother's Ordering Test Activity ("บททดสอบ ของคุณแม่: ให้เรียงภาพขั้นตอน การเช็ดสะดือ เมื่อเริ่มแห้ง"):
 *   Uses /images/rev/nb3_card1_base.jpg, /images/rev/nb3_card2_shaft.jpg, /images/rev/nb3_card3_tip.jpg
 *   and reveals official answer sheet /images/rev/nb3_quiz_answer.jpg.
 */
/**
 * ScenicDaytimeWindow3D — หน้าต่างบานใหญ่มองเห็นทิวทัศน์ธรรมชาติภายนอกสบายตา
 * (ท้องฟ้าสดใส เมฆสีขาว ต้นไม้สีเขียว สนามหญ้า และผ้าม่านสีชมพูพาสเทล ตามภาพอ้างอิง image1.jpeg & page_1.png)
 */
/**
 * ScenicDaytimeWindow3D — หน้าต่างกระจกใสสถาปัตย์สมจริงเห็นวิวสวนธรรมชาติ + แสงสะท้อนกระจก + ผ้าม่านสีชมพูพาสเทล
 */
function ScenicDaytimeWindow3D({ position = [0, 0, 0], rotation = [0, 0, 0], width = 3.8, height = 2.45 }) {
  return (
    <WindowWithCurtains
      position={position}
      rotation={rotation}
      width={Math.max(2.4, width - 0.6)}
      height={height}
      frameColor="#f8fafc"
      curtainColors={['#fce7f3', '#f9a8d4']}
    />
  );
}

/**
 * WheeledHospitalBassinet3D — รถเข็นเตียงนอนทารกโรงพยาบาลอ่างอะคริลิกใสพร้อมล้อเข็น
 * (ตรงตามภาพอ้างอิง image1.jpeg & image2.jpeg จอดอยู่ข้างพยาบาลและโต๊ะเช็ดสะดือ)
 */
function WheeledHospitalBassinet3D({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* โครงฐานล่างและล้อเข็น 4 ล้อ */}
      {[
        [-0.46, -0.26],
        [0.46, -0.26],
        [-0.46, 0.26],
        [0.46, 0.26],
      ].map(([wx, wz], idx) => (
        <group key={`whl_${idx}`} position={[wx, 0, wz]}>
          {/* ล้อยางหมุนได้ */}
          <mesh position={[0, 0.055, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.036, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 14]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* เสาโครงรถเข็นสีฟ้าพาสเทล-สแตนเลส */}
          <mesh position={[0, 0.46, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.74, 14]} />
            <meshStandardMaterial color="#93c5fd" metalness={0.25} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* ชั้นวางของด้านล่างรถเข็น + ผ้าห่มทารกพับสีชมพูและสีฟ้า */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.035, 0.54]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[-0.22, 0.285, 0]} castShadow>
        <boxGeometry args={[0.34, 0.055, 0.36]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.85} />
      </mesh>
      <mesh position={[0.22, 0.285, 0]} castShadow>
        <boxGeometry args={[0.34, 0.055, 0.36]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.85} />
      </mesh>

      {/* กรอบสแตนเลสรองรับอ่างทารก + มือจับเข็นโค้งด้านข้าง */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[1.04, 0.045, 0.60]} />
        <meshStandardMaterial color="#bfdbfe" roughness={0.35} />
      </mesh>
      {[-0.56, 0.56].map((hx, hi) => (
        <mesh key={`hdl_${hi}`} position={[hx, 0.90, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.48, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.18} />
        </mesh>
      ))}

      {/* อ่างนอนทารกอะคริลิกใส (Clear Acrylic Hospital Newborn Tub) */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.96, 0.03, 0.54]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      {/* ผนังอะคริลิกใส 4 ด้าน */}
      {[
        [0, 1.00, 0.27, [0.96, 0.28, 0.025]],
        [0, 1.00, -0.27, [0.96, 0.28, 0.025]],
        [-0.48, 1.00, 0, [0.025, 0.28, 0.54]],
        [0.48, 1.00, 0, [0.025, 0.28, 0.54]],
      ].map(([px, py, pz, args], wi) => (
        <mesh key={`tub_w_${wi}`} position={[px, py, pz]}>
          <boxGeometry args={args} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.34}
            roughness={0.08}
            metalness={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* เบาะนอนทารกสีชมพูอ่อนนุ่ม + หมอนหลุมทารก + ป้ายชื่อหน้าเตียง */}
      <mesh position={[0, 0.89, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.06, 0.48]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.925, 0]} castShadow>
        <boxGeometry args={[0.48, 0.025, 0.44]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.85} />
      </mesh>
      <mesh position={[-0.26, 0.925, 0]} castShadow>
        <boxGeometry args={[0.20, 0.03, 0.30]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      {/* ป้ายบัตรประจำตัวทารกติดขอบอ่างใส */}
      <mesh position={[0, 1.04, 0.286]}>
        <boxGeometry args={[0.20, 0.11, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.07, 0.292]}>
        <planeGeometry args={[0.18, 0.03]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
    </group>
  );
}

export default function NewbornCare3Room() {
  const {
    completeModule,
    learningProgress,
    setShowSuccessModal,
    openLightbox,
  } = useStore();

  // ── Active Modal State (Only shown when clicked) ──
  const [activeModal, setActiveModal] = useState(null); // 'equipment' | 'orderingQuiz' | 'nurseDialog'
  const [selectedEquipId, setSelectedEquipId] = useState(1);

  // ── Ordering Quiz State ("ให้เรียงภาพขั้นตอน การเช็ดสะดือ เมื่อเริ่มแห้ง") ──
  // Scrambled order per nb34_p4.jpg: [Card 2 (shaft), Card 3 (tip), Card 1 (base)]
  const [selectedSequence, setSelectedSequence] = useState([]); // Array of card IDs clicked in order (correct: [1, 2, 3])
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [missionCompleted, setMissionCompleted] = useState(Boolean(learningProgress?.newbornCare3));
  const [hudCollapsed, setHudCollapsed] = useState(false);

  // ── 6 Large Wall Posters around the Room ──
  const wallPosters = [
    {
      src: '/images/rev/nb3_poster1_equip.jpg',
      title: 'ภาพที่ 1: อุปกรณ์สำหรับทำความสะอาดสะดือทารก',
      caption: 'สำลีก้อน, ไม้พันสำลี, Alcohol 70%, และถังขยะติดเชื้อสีแดง',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '1. สำลีก้อนปลอดเชื้อ (Sterile Cotton Balls)',
        '2. ไม้พันสำลีปลอดเชื้อ (Sterile Cotton Swabs)',
        '3. แอลกอฮอล์ 70% (70% Alcohol) สำหรับฆ่าเชื้อและช่วยให้สะดือแห้งเร็ว',
        '4. ถังขยะติดเชื้อสีแดง สำหรับทิ้งสำลีและไม้พันสำลีที่ใช้เช็ดสะดือแล้ว',
      ],
    },
    {
      src: '/images/rev/nb3_poster2_fresh.jpg',
      title: 'ภาพที่ 2: วิธีการเช็ดสะดือทารก (สะดือสด) โดยใช้ไม้พันสำลีชุบ 70% Alcohol',
      caption: '1. เช็ดที่รอยตัดของสะดือ -> 2. เช็ดที่สายสะดือจากบนลงล่างไปที่โคนสะดือ -> 3. เช็ดบริเวณรอบโคนสะดือประมาณ 1 - 1.5 cm.',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '1. เช็ดที่รอยตัดของสะดือ (ปลายสายสะดือ)',
        '2. เช็ดที่สายสะดือจากบนลงล่างไปที่โคนสะดือ',
        '3. เช็ดบริเวณรอบโคนสะดือประมาณ 1 - 1.5 cm.',
      ],
    },
    {
      src: '/images/rev/nb3_poster3_dry.jpg',
      title: 'ภาพที่ 3: วิธีการเช็ดสะดือทารก (สะดือเริ่มแห้ง) ใช้ไม้พันสำลีชุบ 70% Alcohol',
      caption: '1. เช็ดที่รอบโคนสะดือ -> 2. เช็ดที่สายสะดือจากโคนสะดือไปถึงปลายสะดือ -> 3. เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '1. เช็ดที่รอบโคนสะดือ (ดึงผิวหนังหน้าท้องเบาๆ ให้เห็นโคนสะดือชัดเจน)',
        '2. เช็ดที่สายสะดือจากโคนสะดือไปถึงปลายสะดือ',
        '3. เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
      ],
    },
    {
      src: '/images/rev/nb3_poster4_timeline.jpg',
      title: 'ภาพที่ 4: สายสะดือมักหลุดเมื่อไหร่ ?',
      caption: 'ระยะการเปลี่ยนแปลงของสายสะดือทารกแรกเกิดจนหลุดแห้งสนิท (ประมาณ 7–14 วันหลังคลอด)',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '• แรกเกิด – 3 วัน: สายสะดือยังสด สีขาวอมเหลือง',
        '• 4 – 7 วัน: สายสะดือเริ่มแห้งและเปลี่ยนเป็นสีน้ำตาลคล้ำถึงดำ',
        '• 7 – 14 วัน: สายสะดือแห้งและหลุดออกเองตามธรรมชาติ (ห้ามดึงออกเอง)',
      ],
    },
    {
      src: '/images/rev/nb3_poster5_warning.jpg',
      title: 'ภาพที่ 5: ข้อควรสังเกต สัญญาณผิดปกติของสะดือทารก',
      caption: 'รอบสะดือแดง, บวม, ร้อน, มีหนอง, มีกลิ่นเหม็น หรือมีเลือดออกผิดปกติ ต้องรีบพบแพทย์',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '1. ผิวหนังรอบโคนสะดือแดง บวม หรือร้อน',
        '2. มีหนองซึมออกมาจากสะดือ',
        '3. มีกลิ่นเหม็นผิดปกติ หรือมีเลือดสดออกไม่หยุด',
        '4. หากพบอาการเหล่านี้ ต้องรีบพาทารกไปพบแพทย์ทันที',
      ],
    },
    {
      src: '/images/rev/nb3_poster6_diaper.jpg',
      title: 'ภาพที่ 6: การใส่แพมเพิส (ผ้าอ้อมสำเร็จรูป) ที่ถูกต้อง',
      caption: '✓ พับขอบผ้าอ้อมลงใต้สะดือ ไม่อับชื้น vs ✕ ปิดทับสะดือ ทำให้สะดืออับชื้นติดเชื้อ',
      category: 'การดูแลสายสะดือ (Nursery 203)',
      clinicalDetails: [
        '✓ วิธีที่ถูกต้อง: พับขอบผ้าอ้อมลงให้อยู่ต่ำกว่าสายสะดือเสมอ เพื่อให้อากาศถ่ายเทและไม่เสียดสีสะดือ',
        '✕ วิธีที่ไม่ถูกต้อง: ดึงผ้าอ้อมขึ้นมาปิดทับสะดือ ทำให้สะดืออับชื้นและเสี่ยงติดเชื้อจากปัสสาวะ',
      ],
    },
  ];

  const openWallPoster = (index) => {
    openLightbox({
      ...wallPosters[index],
      items: wallPosters,
      currentIndex: index,
    });
  };

  // ── 4 Clickable Dressing Cart Equipment Items ──
  const equipmentItems = [
    {
      id: 1,
      name: '1. สำลีก้อนปลอดเชื้อ (Sterile Cotton Balls)',
      usage: 'ใช้ซับบริเวณสะดือให้แห้งหลังอาบน้ำ หรือชุบ 70% Alcohol เช็ดทำความสะอาดบริเวณรอบสะดือ (ใช้ก้อนเดียวเช็ดแล้วทิ้ง ไม่เช็ดซ้ำ)',
      icon: '⚪',
    },
    {
      id: 2,
      name: '2. ไม้พันสำลีปลอดเชื้อ (Sterile Cotton Swabs)',
      usage: 'ใช้ชุบ 70% Alcohol เช็ดทำความสะอาดร่องลึกบริเวณโคนสะดือ สายสะดือ และรอยตัดของสะดือได้อย่างทั่วถึงและแม่นยำ',
      icon: '🥢',
    },
    {
      id: 3,
      name: '3. แอลกอฮอล์ 70% (70% Ethyl Alcohol)',
      usage: 'น้ำยาฆ่าเชื้อมาตรฐานสำหรับเช็ดทำความสะอาดสายสะดือทารก ช่วยฆ่าเชื้อโรคและทำให้สายสะดือแห้งและหลุดตามธรรมชาติ',
      icon: '🧴',
    },
    {
      id: 4,
      name: '4. ถังขยะติดเชื้อสีแดง (Red Biohazard Bin)',
      usage: 'สำหรับทิ้งไม้พันสำลีและสำลีก้อนที่ใช้เช็ดสะดือทารกแล้ว เพื่อป้องกันการแพร่กระจายเชื้อโรค',
      icon: '🗑️',
    },
  ];

  // ── 3 Scrambled Cards for the Ordering Test (Per nb34_p4.jpg) ──
  const scrambledCards = [
    {
      correctStep: 2,
      img: '/images/rev/nb3_card2_shaft.jpg',
      label: 'เช็ดที่สายสะดือจากโคนสะดือไปถึงปลายสะดือ',
    },
    {
      correctStep: 3,
      img: '/images/rev/nb3_card3_tip.jpg',
      label: 'เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
    },
    {
      correctStep: 1,
      img: '/images/rev/nb3_card1_base.jpg',
      label: 'เช็ดที่รอบโคนสะดือ',
    },
  ];

  const handleToggleCardStep = (correctStep) => {
    setQuizFeedback(null);
    setSelectedSequence((prev) => {
      if (prev.includes(correctStep)) {
        return prev.filter((id) => id !== correctStep);
      }
      if (prev.length >= 3) return prev;
      const next = [...prev, correctStep];
      if (next.length === 3) {
        const isCorrect = next[0] === 1 && next[1] === 2 && next[2] === 3;
        if (isCorrect) {
          setQuizFeedback({
            pass: true,
            title: '✓ ถูกต้องยอดเยี่ยม! เรียงลำดับการเช็ดสะดือเมื่อเริ่มแห้งได้ถูกต้องครบทั้ง 3 ขั้นตอน',
            msg: 'ขั้นตอนที่ 1: เช็ดที่รอบโคนสะดือ -> ขั้นตอนที่ 2: เช็ดที่สายสะดือจากโคนสะดือไปถึงปลายสะดือ -> ขั้นตอนที่ 3: เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
          });
          setMissionCompleted(true);
          completeModule('newbornCare3');
        } else {
          setQuizFeedback({
            pass: false,
            title: '✕ ลำดับยังไม่ถูกต้อง กรุณาลองเรียงใหม่อีกครั้ง',
            msg: 'คำแนะนำสำหรับสะดือเริ่มแห้ง: เริ่มจาก (1) เช็ดที่รอบโคนสะดือ -> (2) เช็ดที่สายสะดือจากโคนไปถึงปลายสะดือ -> (3) เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
          });
        }
      }
      return next;
    });
  };

  return (
    <group>
      {/* ── Room Architecture (Warm Oak Wood Plank Floor) ── */}
      <HospitalRoomShell
        theme="newborn"
        cozyMode={true}
        width={14}
        depth={14}
        height={5.2}
        roomTitle="ห้องที่ 3: การดูแลสายสะดือทารกแรกเกิด (Umbilical Cord Care Room)"
        roomNumber="Nursery 203"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP-RIGHT TRANSLUCENT MISSION HUD (Collapsible)
          ══════════════════════════════════════════════════════════════════════════ */}
      <ScreenPortal>
        <div
          className="fixed left-2.5 right-2.5 sm:left-auto sm:right-4 z-30 pointer-events-auto sm:max-w-xs sm:w-80 max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)-5.5rem)] overflow-y-auto bg-white/92 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-xl border border-amber-200/90 text-slate-800"
          style={{ top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 4.25rem)' }}
        >
          <div className={`flex items-center justify-between ${hudCollapsed ? '' : 'border-b border-amber-200/70 pb-1.5 mb-2'}`}>
            <span className="text-xs font-extrabold text-amber-900 tracking-wide flex items-center gap-1.5">
              🩹 ภารกิจห้องดูแลสายสะดือ (Nursery 203)
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                missionCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {missionCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังปฏิบัติ'}
              </span>
              <button
                type="button"
                onClick={() => setHudCollapsed((v) => !v)}
                className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-black flex items-center justify-center cursor-pointer transition"
                title={hudCollapsed ? 'ขยายหน้าต่างภารกิจ' : 'ย่อหน้าต่างภารกิจ'}
              >
                {hudCollapsed ? '▼' : '▲'}
              </button>
            </div>
          </div>

          {!hudCollapsed && (
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setActiveModal('equipment')}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white/90 hover:border-amber-400 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>🔍 1. คลิกดูอุปกรณ์เช็ดสะดือบนรถเข็น</span>
                <span className="text-amber-600 font-bold">ดูอุปกรณ์ ▶</span>
              </button>

              <button
                onClick={() => openWallPoster(0)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white/90 hover:border-amber-400 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>🖼️ 2. ศึกษาโปสเตอร์ความรู้รอบห้อง (6 ภาพ)</span>
                <span className="text-amber-600 font-bold">เปิดดู ▶</span>
              </button>

              <button
                onClick={() => setActiveModal('orderingQuiz')}
                className={`w-full p-2.5 rounded-xl border text-left font-bold flex items-center gap-2 transition cursor-pointer ${
                  missionCompleted
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50 border-amber-400 text-amber-950 hover:bg-amber-100'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  missionCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-amber-600 text-transparent'
                }`}>
                  ✓
                </div>
                <span className="flex-1">
                  3. บททดสอบคุณแม่: เรียงภาพขั้นตอนการเช็ดสะดือเมื่อเริ่มแห้ง
                </span>
              </button>
            </div>
          )}
        </div>
      </ScreenPortal>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. 6 LARGE EDUCATIONAL WALL POSTERS & OUTDOOR SCENIC WINDOWS
             - Zero overlap with West-wall exit door ([-6.78, 0, +3.8]) or sink counter
             - True aspect ratios for every DOCX poster (no stretching, crisp readable text)
             - North Wall (z = -6.78): Poster 1, Poster 2 + Sunny Outdoor Window
             - West Wall North (x = -6.78, z = -4.45): Poster 5 (portrait)
             - East Wall (x = 6.78): Poster 3 (portrait), Poster 4, Poster 6
             - South Wall (z = 6.78): Panoramic Outdoor Daytime Window
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Poster 1 (North Wall Left, 3:2 landscape): อุปกรณ์สำหรับทำความสะอาดสะดือทารก */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster1_equip.jpg"
        width={3.85}
        height={2.7}
        position={[-4.55, 2.8, -6.78]}
        title="อุปกรณ์สำหรับทำความสะอาดสะดือทารก"
        badge="ภาพที่ 1"
        frameColor="#8c5a32"
        accentColor="#d97706"
        onClick={() => openWallPoster(0)}
      />

      {/* Poster 2 (North Wall Center, 3:2 landscape): วิธีการเช็ดสะดือทารก (สะดือสด) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster2_fresh.jpg"
        width={3.85}
        height={2.7}
        position={[-0.35, 2.8, -6.78]}
        title="วิธีการเช็ดสะดือทารก (สะดือสด)"
        badge="ภาพที่ 2"
        frameColor="#8c5a32"
        accentColor="#0284c7"
        onClick={() => openWallPoster(1)}
      />

      {/* หน้าต่างวิวธรรมชาติภายนอกด้านหลังโซฟาพักผ่อน (North Wall Right — ตามภาพอ้างอิง nb3_room_ref.jpg) */}
      <ScenicDaytimeWindow3D
        position={[4.25, 2.7, -6.76]}
        width={3.8}
        height={2.5}
      />

      {/* Poster 3 (East Wall North, 3:4 portrait): วิธีการเช็ดสะดือทารก (สะดือเริ่มแห้ง) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster3_dry.jpg"
        width={2.75}
        height={3.45}
        position={[6.78, 2.8, -4.55]}
        rotation={[0, -Math.PI / 2, 0]}
        title="วิธีการเช็ดสะดือทารก (สะดือเริ่มแห้ง)"
        badge="ภาพที่ 3"
        frameColor="#8c5a32"
        accentColor="#0d9488"
        onClick={() => openWallPoster(2)}
      />

      {/* Poster 4 (East Wall Center, 6:5): สายสะดือมักหลุดเมื่อไหร่ ? */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster4_timeline.jpg"
        width={3.65}
        height={3.1}
        position={[6.78, 2.8, -0.75]}
        rotation={[0, -Math.PI / 2, 0]}
        title="สายสะดือทารกมักหลุดเมื่อไหร่ ?"
        badge="ภาพที่ 4"
        frameColor="#8c5a32"
        accentColor="#d97706"
        onClick={() => openWallPoster(3)}
      />

      {/* Poster 6 (East Wall South, 3:2 landscape): การใส่แพมเพิสที่ถูกต้อง */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster6_diaper.jpg"
        width={4.1}
        height={2.85}
        position={[6.78, 2.8, 3.85]}
        rotation={[0, -Math.PI / 2, 0]}
        title="การใส่แพมเพิส (ผ้าอ้อมสำเร็จรูป) ที่ถูกต้อง"
        badge="ภาพที่ 6"
        frameColor="#8c5a32"
        accentColor="#10b981"
        onClick={() => openWallPoster(5)}
      />

      {/* Poster 5 (West Wall North, 3:4 portrait — พ้นประตูทางออกและอ่างล้างมือ 100%): ข้อควรสังเกต สัญญาณผิดปกติของสะดือทารก */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster5_warning.jpg"
        width={2.8}
        height={3.45}
        position={[-6.78, 2.8, -4.45]}
        rotation={[0, Math.PI / 2, 0]}
        title="ข้อควรสังเกต สัญญาณผิดปกติของสะดือทารก"
        badge="ภาพที่ 5"
        frameColor="#8c5a32"
        accentColor="#e11d48"
        onClick={() => openWallPoster(4)}
      />

      {/* หน้าต่างบานใหญ่วิวภายนอกบนผนังด้านทิศใต้ที่โล่ง ("หน้าต่าง ตรงที่โล่งๆ ขอเป็นวิวภายนอก") */}
      <ScenicDaytimeWindow3D
        position={[0, 2.7, 6.76]}
        rotation={[0, Math.PI, 0]}
        width={5.4}
        height={2.65}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          1B. BACKGROUND & SIDE ROOM FURNITURE MATCHING /images/rev/nb3_room_ref.jpg:
              - Left Wall: Wooden Sink Counter + Upper White Glass-Door Cabinet with Rolled Pink/Blue Towels
              - Left-Back: Pastel Pink Privacy Curtain
              - Right-Back: Sunny Window with Pastel Pink Curtains + Cozy Beige Sofa with Pink Pillow + Round Oak Table
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* เคาน์เตอร์อ่างล้างมือไม้โอ๊คด้านซ้าย + ตู้แขวนบานกระจกเก็บผ้าขนหนูม้วนสีชมพู/ฟ้า (ตามรูป nb3_room_ref.jpg) */}
      <group position={[-6.35, 0, -0.1]} rotation={[0, Math.PI / 2, 0]}>
        {/* ตู้เคาน์เตอร์ไม้โอ๊คด้านล่าง */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.88, 0.62]} />
          <meshStandardMaterial color="#c69264" roughness={0.5} />
        </mesh>
        {/* ท็อปเคาน์เตอร์หินสีขาวครีม */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.16, 0.05, 0.66]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        {/* อ่างล้างมือสแตนเลส + ก๊อกน้ำคอหงส์ */}
        <mesh position={[-0.45, 0.92, 0.04]}>
          <boxGeometry args={[0.55, 0.03, 0.38]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.2} />
        </mesh>
        <mesh position={[-0.45, 1.06, -0.14]}>
          <cylinderGeometry args={[0.016, 0.016, 0.24, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* ขวดสบู่ล้างมือ + กล่องทิชชู่สีขาว + กระถางต้นไม้เล็กบนเคาน์เตอร์ */}
        <mesh position={[0.05, 1.0, -0.1]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.16, 14]} />
          <meshStandardMaterial color="#fde68a" roughness={0.35} />
        </mesh>
        <mesh position={[0.42, 0.97, 0.02]} castShadow>
          <boxGeometry args={[0.24, 0.1, 0.14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
        <group position={[0.78, 0.92, -0.06]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.065, 0.16, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.75} />
          </mesh>
        </group>

        {/* ตู้แขวนผนังสีขาวบานกระจกใส + ผ้าขนหนูม้วนสีชมพูและสีฟ้าด้านใน (ยึดติดผนังซ้ายแนบสนิท) */}
        <group position={[0, 2.05, -0.22]}>
          <mesh castShadow>
            <boxGeometry args={[1.95, 0.78, 0.38]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.195]}>
            <planeGeometry args={[1.82, 0.66]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.32} roughness={0.1} />
          </mesh>
          {/* ม้วนผ้าขนหนูสีชมพูและสีฟ้าเรียงในตู้ */}
          {[-0.65, -0.42, -0.18, 0.18, 0.42, 0.65].map((tx, ti) => (
            <mesh key={`towel_roll_${ti}`} position={[tx, -0.12, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.22, 14]} />
              <meshStandardMaterial color={ti < 3 ? '#f9a8d4' : '#93c5fd'} roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ม่านกั้นห้องสีชมพูพาสเทลรวบเก็บเรียบร้อยชิดผนังซ้ายข้างเคาน์เตอร์อ่างล้างมือ (ไม่บังโปสเตอร์ 100%) */}
      <group position={[-6.18, 0, -2.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 2.65, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 1.05, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
        </mesh>
        {[-0.36, -0.18, 0, 0.18, 0.36].map((cx, ci) => (
          <mesh key={`curt_fold_${ci}`} position={[cx, 1.32, (ci % 2) * 0.03]} castShadow>
            <boxGeometry args={[0.18, 2.55, 0.08]} />
            <meshStandardMaterial color={ci % 2 === 0 ? '#fbcfe8' : '#f9a8d4'} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* โซฟาพักผ่อนสีครีมเบจ + หมอนอิงสีชมพู + โต๊ะกลางไม้กลม ด้านหลังขวา (ตามรูป nb3_room_ref.jpg) */}
      <InteractiveSeat
        id="nb3-lounge-sofa"
        name="โซฟาพักผ่อนมุมห้องดูแลสายสะดือ"
        type="sofa"
        position={[3.4, 0, -4.6]}
        rotation={[0, -0.25, 0]}
        seatOffset={[0, 0.46, 0.05]}
      >
        <group>
          <RoundedBox args={[1.75, 0.34, 0.86]} radius={0.045} smoothness={4} position={[0, 0.3, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#ede0d4" roughness={0.85} />
          </RoundedBox>
          <RoundedBox args={[1.75, 0.58, 0.22]} radius={0.05} smoothness={4} position={[0, 0.72, -0.34]} castShadow receiveShadow>
            <meshStandardMaterial color="#ede0d4" roughness={0.85} />
          </RoundedBox>
          {[-0.82, 0.82].map((ax, ai) => (
            <RoundedBox key={`s_arm_${ai}`} args={[0.18, 0.42, 0.86]} radius={0.045} smoothness={4} position={[ax, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#e6ccb2" roughness={0.85} />
            </RoundedBox>
          ))}
          {/* หมอนอิงผ้าทอ 3D สมจริงจากโมเดลผ้าพับย่น (Poly Haven GLB) */}
          <RealisticThrowPillow3D
            color="#f9a8d4"
            variant={0}
            position={[-0.46, 0.62, -0.14]}
            rotation={[-0.18, 0.18, -0.05]}
            scale={0.78}
          />
          <RealisticThrowPillow3D
            color="#fde68a"
            variant={1}
            position={[0.46, 0.62, -0.14]}
            rotation={[-0.18, -0.18, 0.05]}
            scale={0.78}
          />
        </group>
      </InteractiveSeat>
      {/* โต๊ะกลางไม้กลมหน้าโซฟามุมห้อง พร้อมผ้าอ้อมพับนุ่ม & ชุดหนังสือคู่มือปกแข็ง */}
      <group position={[3.18, 0, -3.15]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.47, 0.045, 32]} />
          <meshStandardMaterial color="#c69264" roughness={0.48} />
        </mesh>
        {[[-0.24, -0.24], [0.24, -0.24], [0, 0.26]].map(([lx, lz], i) => (
          <mesh key={`ct_leg_${i}`} position={[lx, 0.21, lz]} castShadow>
            <cylinderGeometry args={[0.024, 0.018, 0.42, 14]} />
            <meshStandardMaterial color="#8c5a32" roughness={0.5} />
          </mesh>
        ))}
        <RealisticFoldedClothStack3D
          position={[-0.14, 0.443, 0.06]}
          rotation={[0, 0.15, 0]}
          scale={0.78}
        />
        <RealisticBookStack3D
          position={[0.14, 0.443, -0.05]}
          rotation={[0, -0.32, 0]}
          scale={0.78}
          withOpenTop={false}
        />
      </group>
      <RealPlant type="potted" position={[5.5, 0, -5.2]} scale={1.25} />

      {/* ══════════════════════════════════════════════════════════════════════════
          2. CENTER CLINICAL SCENE (Matching /images/rev/nb3_room_ref.jpg):
             - Baby Examination Bed with Oak Wooden Base + White Padded Mattress + RealisticNewborn (pose="diaperOn")
               + Stack of Diapers & Pampers on the side of the examination bed!
             - Nurse standing behind the bed demonstrating umbilical cord care
             - Mother's Chair beside the bed (InteractiveSeat)
             - Stainless Steel Dressing Trolley with 4 Clickable Equipment Items + Diaper Pack + Red Biohazard Bin
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Baby Examination Bed / Table (Center: x = 0, z = -1.2) */}
      <group
        position={[0, 0, -1.2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('orderingQuiz');
        }}
      >
        {/* Warm Oak Wooden Cabinet Base with 2 Drawers (Matching nb3_room_ref.jpg) */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.88, 0.86, 0.98]} />
          <meshStandardMaterial color="#c69264" roughness={0.48} />
        </mesh>
        {[-0.45, 0.45].map((dx, di) => (
          <mesh key={`bed_drw_${di}`} position={[dx, 0.56, 0.495]}>
            <boxGeometry args={[0.76, 0.26, 0.02]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
        ))}
        {/* Soft White Padded Examination Mattress with Raised Bolster Edges */}
        <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.94, 0.1, 1.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.75} />
        </mesh>
        {/* Soft Ergonomic Dimpled Infant Head Pillow */}
        <group position={[-0.48, 0.985, 0]}>
          <RoundedBox args={[0.36, 0.055, 0.50]} radius={0.026} smoothness={4} castShadow>
            <meshStandardMaterial color="#e0f2fe" roughness={0.82} />
          </RoundedBox>
          <mesh position={[0.02, 0.024, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.045, 0.095, 22]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.85} />
          </mesh>
        </group>

        {/* Realistic Newborn Baby in Diaper lying Supine on Bed (pose="diaperOn", showing umbilical cord!) */}
        <group position={[-0.08, 0.99, 0]} rotation={[0, Math.PI / 2, 0]}>
          <BabyAvatar
            pose="diaperOn"
            position={[0, 0, 0]}
            scale={1.08}
          />
        </group>

        {/* ชุดผ้าอ้อมสำเร็จรูป (แพมเพิส) & ผ้าอ้อมผ้าสาลูพับวางเตรียมไว้บนปลายเตียงตรวจสะดือ (x = 0.68) */}
        <group position={[0.68, 0.97, 0]}>
          {/* ผ้าอ้อมผ้าสาลูพับ 3 ผืน */}
          {[
            [0.02, '#ffffff', '#38bdf8'],
            [0.055, '#fce7f3', '#ec4899'],
            [0.09, '#ffffff', '#38bdf8'],
          ].map(([py, col, trim], idx) => (
            <group key={`bed_diaper_${idx}`} position={[0, py, -0.18]}>
              <mesh castShadow>
                <boxGeometry args={[0.3, 0.032, 0.26]} />
                <meshStandardMaterial color={col} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.002, 0.12]}>
                <boxGeometry args={[0.302, 0.033, 0.024]} />
                <meshStandardMaterial color={trim} />
              </mesh>
            </group>
          ))}
          {/* แพมเพิสสำเร็จรูปพับขอบใต้สะดือ (พร้อมแถบกาวสีฟ้า) */}
          <group position={[0, 0.03, 0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.045, 0.24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.024, 0.05]}>
              <boxGeometry args={[0.262, 0.008, 0.05]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0.025, 0.05]}>
              <boxGeometry args={[0.08, 0.01, 0.03]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
          </group>
        </group>

        {/* ป้ายคลิกที่เตียงตรวจสะดือทารก (100% 3D WebGL depth-buffered ไม่ทับหัวตัวละคร) */}
        <BillboardLabel3D
          position={[0, 1.48, 0]}
          text="👶 เตียงเช็ดสะดือทารก & เปลี่ยนผ้าอ้อม"
          subtext="(คลิกทำบททดสอบคุณแม่)"
          bg="#f59e0b"
          bgEnd="#d97706"
          subtextColor="#fef3c7"
          width={1.78}
          height={0.42}
          pill={false}
          onClick={() => setActiveModal('orderingQuiz')}
        />
      </group>

      {/* 3D Nurse Standing behind the Examination Bed (Uniform Dress + Nurse Cap, Teaching Mother) */}
      <group
        position={[0, 0, -2.05]}
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('orderingQuiz');
        }}
      >
        <MotherAvatar
          characterOverride="nurse"
          outfitOverride="blue"
          isSittingOverride={false}
          isHoldingBabyOverride={false}
          showHeldBaby={false}
          currentAnimation="idle"
        />
      </group>

      {/* รถเข็นเตียงนอนทารกโรงพยาบาลอ่างอะคริลิกใสพร้อมล้อ จอดอยู่ข้างพยาบาลและเตียงเช็ดสะดือ ("ขอให้มีเตียงนอนเด็ก (รถเข็น) ตามภาพที่ส่งให้ จอดอยู่ข้างๆ") */}
      <WheeledHospitalBassinet3D
        position={[1.95, 0, -1.65]}
        rotation={[0, -0.28, 0]}
      />

      {/* คุณแม่นั่งดูคุณพยาบาลสาธิตการเช็ดสะดือทารกอยู่ข้างเตียงตั้งแต่แรก ("อยากให้มีคุณแม่ที่นั่งดูตั้งแต่แรก") */}
      <group
        position={[0.88, 0, -0.22]}
        rotation={[0, -Math.PI * 0.76, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('orderingQuiz');
        }}
      >
        {/* เก้าอี้คุณแม่โทนชมพูพาสเทลขาไม้โอ๊ค (ตามภาพอ้างอิง nb3_room_ref.jpg) */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.08, 0.54]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.78, -0.24]} castShadow>
          <boxGeometry args={[0.54, 0.62, 0.07]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.65} />
        </mesh>
        {[[-0.23, -0.22], [0.23, -0.22], [-0.23, 0.22], [0.23, 0.22]].map(([x, z], i) => (
          <mesh key={`ch_leg_${i}`} position={[x, 0.22, z]} castShadow>
            <cylinderGeometry args={[0.025, 0.02, 0.44, 14]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
        ))}

        {/* 3D คุณแม่ชุดหลังคลอดสีชมพูนั่งชมการสาธิตตั้งแต่เริ่มเข้าห้อง */}
        <MotherAvatar
          position={[0, 0, 0]}
          characterOverride="postpartum_mother"
          outfitOverride="pink"
          isSittingOverride={true}
          isHoldingBabyOverride={false}
          showHeldBaby={false}
          currentAnimation="sitting"
        />
      </group>

      {/* ── Stainless Steel Dressing Cart beside Examination Bed (x = -1.65, z = -1.2) ──
           With 4 Clickable Equipment Items ("อุปกรณ์สามารถคลิก ว่านี่คืออะไร") + Diaper Pack on lower shelf */}
      <group position={[-1.65, 0, -1.2]}>
        {/* Stainless Steel Cart Frame & 2 Trays */}
        <mesh
          position={[0, 0.84, 0]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEquipId(1);
            setActiveModal('equipment');
          }}
        >
          <boxGeometry args={[1.05, 0.04, 0.66]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.04, 0.62]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 4 Stainless Legs */}
        {[[-0.48, -0.29], [0.48, -0.29], [-0.48, 0.29], [0.48, 0.29]].map(([x, z], i) => (
          <mesh key={`cart_leg_${i}`} position={[x, 0.45, z]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.9, 14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* Item 1: สำลีก้อน (Sterile Cotton Balls in Jar/Cup — ขนาดใหญ่ชัดเจน) */}
        <group
          position={[-0.32, 0.86, -0.06]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEquipId(1);
            setActiveModal('equipment');
          }}
        >
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.09, 0.18, 24]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          {/* Cotton balls inside */}
          {[
            [-0.03, 0.06, 0],
            [0.03, 0.06, 0.02],
            [0, 0.06, -0.03],
            [-0.02, 0.11, 0.02],
            [0.02, 0.11, -0.02],
            [0, 0.13, 0],
          ].map(([cx, cy, cz], idx) => (
            <mesh key={`cb_${idx}`} position={[cx, cy, cz]}>
              <sphereGeometry args={[0.034, 14, 14]} />
              <meshStandardMaterial color="#ffffff" roughness={0.95} />
            </mesh>
          ))}
        </group>

        {/* Item 2: ไม้พันสำลี / สำลีก้าน (Sterile Cotton Swabs Pack/Holder) */}
        <group
          position={[-0.02, 0.86, -0.06]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEquipId(2);
            setActiveModal('equipment');
          }}
        >
          <mesh position={[0, 0.075, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.075, 0.15, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Cotton swabs sticking up */}
          {[-0.03, -0.01, 0.01, 0.03].map((sx, idx) => (
            <group key={`swab_${idx}`} position={[sx, 0.17, (idx % 2) * 0.015 - 0.007]}>
              <mesh>
                <cylinderGeometry args={[0.005, 0.005, 0.12, 8]} />
                <meshStandardMaterial color="#fde68a" />
              </mesh>
              <mesh position={[0, 0.065, 0]}>
                <sphereGeometry args={[0.015, 10, 10]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Item 3: ขวด 70% Alcohol ทางการแพทย์สมจริงพร้อมฉลากโค้งรอบขวดและหัวปั๊ม */}
        <group
          position={[0.28, 0.86, -0.05]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEquipId(3);
            setActiveModal('equipment');
          }}
        >
          <RealisticMedicalBottle3D
            scale={1.36}
            bodyColor="#0284c7"
            title="ALCOHOL 70%"
            subtitle="เช็ดสายสะดือทารก"
            withPump={true}
          />
        </group>

        {/* ชั้นล่างของรถเข็น: ห่อแพมเพิสทรงโค้งพร้อมหูหิ้ว & ผ้าอ้อมผ้าสาลูพับนุ่มสำรอง */}
        <group position={[0, 0.38, 0]}>
          <group position={[-0.22, 0.11, 0]}>
            <RoundedBox args={[0.32, 0.21, 0.25]} radius={0.036} smoothness={4} castShadow>
              <meshStandardMaterial color="#0d9488" roughness={0.38} />
            </RoundedBox>
            <RoundedBox args={[0.24, 0.13, 0.008]} radius={0.012} position={[0, 0, 0.125]}>
              <meshBasicMaterial color="#fef9c3" />
            </RoundedBox>
            <mesh position={[0, 0.11, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <torusGeometry args={[0.045, 0.007, 10, 18, Math.PI]} />
              <meshStandardMaterial color="#99f6e4" roughness={0.4} />
            </mesh>
          </group>
          <RealisticFoldedClothStack3D position={[0.21, 0.0, 0]} scale={1.08} />
        </group>

        {/* ป้ายคลิกดูอุปกรณ์บนรถเข็นเช็ดสะดือ (100% 3D WebGL depth-buffered ไม่ทับหัวตัวละคร) */}
        <BillboardLabel3D
          position={[0, 1.24, 0]}
          text="🧴 อุปกรณ์เช็ดสะดือทารก"
          subtext="สำลีก้อน • ไม้พันสำลี • Alcohol 70%"
          bg="#ffffff"
          textColor="#78350f"
          subtextColor="#b45309"
          borderColor="#fbbf24"
          width={1.72}
          height={0.40}
          pill={false}
          onClick={() => {
            setSelectedEquipId(1);
            setActiveModal('equipment');
          }}
        />

        {/* Item 4: ถังขยะติดเชื้อสีแดง (Red Biohazard Waste Bin beside Cart) */}
        <group
          position={[-0.68, 0, 0.1]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEquipId(4);
            setActiveModal('equipment');
          }}
        >
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.16, 0.56, 24]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.57, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* 3D Player Controller */}
      <PlayerController initialPosition={[-0.95, 0, 2.8]} initialRotation={Math.PI} />

      {/* ── Baby care supplies near the umbilical cord examination bed ── */}
      <DiaperStack position={[1.1, 1.02, -1.2]} count={3} />
      <CottonJar position={[-1.65, 0.92, -0.44]} />
      <BabyTowel position={[-1.65, 0.42, -0.55]} />

      {/* ══════════════════════════════════════════════════════════════════════════
          2D HTML INTERACTIVE MODALS (Shown ONLY When Clicked)
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Equipment Details Modal (Shown when clicking items on the dressing cart) */}
      {activeModal === 'equipment' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-400 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                  <span>🩹</span> อุปกรณ์เช็ดทำความสะอาดสายสะดือทารก
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <img
                src="/images/rev/nb3_poster1_equip.jpg"
                alt="อุปกรณ์เช็ดสะดือ"
                className="w-full h-44 object-contain bg-amber-50 rounded-xl p-1.5 mt-3 border border-amber-200"
              />

              <div className="mt-3 space-y-2 text-xs">
                {equipmentItems.map((item) => {
                  const isSelected = selectedEquipId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedEquipId(item.id)}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{item.usage}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  onClick={() => setActiveModal('orderingQuiz')}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
                >
                  ไปที่บททดสอบของคุณแม่ ▶
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 2. Mother's Ordering Test Modal ("บททดสอบ ของคุณแม่: ให้เรียงภาพขั้นตอน การเช็ดสะดือ เมื่อเริ่มแห้ง" — nb34_p4..5) */}
      {activeModal === 'orderingQuiz' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-500 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                    บททดสอบของคุณแม่ • Nursery 203
                  </span>
                  <h2 className="text-lg font-bold text-amber-950">
                    📝 ให้เรียงภาพขั้นตอน &ldquo;การเช็ดสะดือ เมื่อเริ่มแห้ง&rdquo; (1 ➔ 2 ➔ 3)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mt-3">
                คลิกที่ภาพด้านล่างตามลำดับขั้นตอนที่ 1, 2 และ 3 สำหรับการเช็ดสะดือทารกเมื่อสะดือเริ่มแห้ง (คลิกซ้ำเพื่อยกเลิกลำดับ):
              </p>

              {/* 3 Scrambled Cards to Click in Order 1 -> 2 -> 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3.5">
                {scrambledCards.map((card, idx) => {
                  const orderIndex = selectedSequence.indexOf(card.correctStep);
                  const isPicked = orderIndex !== -1;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleCardStep(card.correctStep)}
                      className={`cursor-pointer rounded-2xl border-2 p-2.5 flex flex-col items-center text-center transition relative ${
                        isPicked
                          ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-white'
                      }`}
                    >
                      {isPicked && (
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                          {orderIndex + 1}
                        </div>
                      )}
                      <img
                        src={card.img}
                        alt={card.label}
                        className="w-full h-44 object-contain rounded-xl bg-white p-1 border border-slate-200"
                      />
                      <div className="text-xs font-bold text-slate-900 mt-2 leading-snug">
                        {card.label}
                      </div>
                      <div className="mt-1.5 text-[11px] font-bold text-amber-700">
                        {isPicked ? `เลือกเป็นลำดับที่ ${orderIndex + 1}` : '👆 คลิกเพื่อเลือกลำดับ'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback */}
              {quizFeedback && (
                <div
                  className={`mt-4 p-4 rounded-xl border-2 text-xs ${
                    quizFeedback.pass
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  <div className="font-bold text-sm">{quizFeedback.title}</div>
                  <p className="mt-1 leading-relaxed">{quizFeedback.msg}</p>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSequence([]);
                    setQuizFeedback(null);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  🔄 ล้างลำดับเลือกใหม่
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง
                </button>
                {quizFeedback?.pass && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setShowSuccessModal(
                        true,
                        'ยินดีด้วย! คุณผ่านบททดสอบการเรียงลำดับขั้นตอนการเช็ดสะดือเมื่อเริ่มแห้งอย่างถูกต้อง'
                      );
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
                  >
                    🎉 บันทึกความสำเร็จภารกิจ
                  </button>
                )}
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}
    </group>
  );
}
