import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import MotherAvatar from '../avatars/MotherAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import InteractiveSeat from '../furniture/InteractiveSeat';
import RealPlant from '../decorations/RealPlant';
import { useWovenRugTexture, FramedImagePoster3D } from '../furniture/CozyRoomFurniture';
import { getQuestionsByRoomKey } from '../../data/quizData';

/**
 * NewbornCare4Room — ห้องที่ 4: การจัดสิ่งแวดล้อมการนอนหลับที่ปลอดภัย (Nursery 204)
 *
 * Updated 100% per "ทารก 3 เเละ 4.pdf" (pages 6–9):
 * - Warm, soothing, sleep-friendly bedroom atmosphere ("ขอภาพสีสบายตา น่านอน")
 *   matching /images/rev/nb4_room_ref.jpg:
 *   - Window slightly open showing calm evening outside view ("หน้าต่างเปิดเล็กน้อย มองเห็นวิวนอกห้อง")
 *   - Parent's Bed ("เตียงผู้ปกครอง") with sleeping Mother + Baby's Crib right next to it
 *     ("เตียงทารก แยกเตียงจากผู้ปกครองแต่ให้อยู่ข้างกัน")
 *   - Wall-mounted TV ("จัดเตียงนอนลูกอย่างไร? ให้ปลอดภัยและสบายตัว") + wooden console + cozy armchair
 * - 5 Large, Clear Educational Wall Posters around the room with Lightbox Prev/Next:
 *   1. /images/rev/nb4_poster1_env.jpg (การจัดสภาพแวดล้อมในห้องนอน)
 *   2. /images/rev/nb4_poster2_back_vs_prone.jpg (✓ นอนหงาย vs ✕ นอนคว่ำ)
 *   3. /images/rev/nb4_poster3_safe_mattress.jpg (✓ ที่นอนทารกที่ปลอดภัย vs ✕ ไม่ควรมีของนุ่ม ๆ บนที่นอนทารก)
 *   4. /images/rev/nb4_poster4_separate_bed.jpg (✓ แยกเตียงจากผู้ปกครอง แต่ให้อยู่ข้างกัน)
 *   5. /images/rev/nb4_poster5_danger_signs.jpg (สังเกตอาการอันตรายระหว่างการนอนของทารก)
 * - Initial State & Hands-on Practice ("แบบทดลองปฏิบัติ"):
 *   - When entering for the first time, the baby is sleeping face-down ("เข้าไปครั้งแรก ลูกนอนคว่ำอยู่")
 *   - Inside the baby crib are 4 unsafe soft items ("หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม")
 *   - Mother practices removing all 4 soft items from the crib ("หยิบ หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม ออก")
 *     AND turning the baby from prone (นอนคว่ำ) to supine (นอนหงาย).
 */
export default function NewbornCare4Room() {
  const {
    completeModule,
    learningProgress,
    setShowSuccessModal,
    setHoldingBaby,
    openLightbox,
  } = useStore();

  // Ensure baby remains in the crib in Nursery 204
  useEffect(() => {
    setHoldingBaby(false);
  }, [setHoldingBaby]);

  // ── Active Modal State ──
  const [activeModal, setActiveModal] = useState(null); // null | 'practice' | 'quiz'

  // ── แบบทดลองปฏิบัติ: เข้าไปครั้งแรก ลูกนอนคว่ำอยู่ ('prone') และมี หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม ในเตียงทารก ──
  const [sleepPose, setSleepPose] = useState('prone'); // 'prone' (นอนคว่ำ - เริ่มต้น) | 'supine' (นอนหงาย - ปลอดภัย)
  const [cribItems, setCribItems] = useState([
    {
      id: 'pillow',
      name: 'หมอนหนุนศีรษะ',
      shortName: 'หมอน',
      icon: '🛌',
      dangerDesc: 'เสี่ยงทำให้คอทารกพับงอหรืออุดกั้นทางเดินหายใจ',
      inCrib: true,
    },
    {
      id: 'bolster',
      name: 'หมอนข้าง',
      shortName: 'หมอนข้าง',
      icon: '🥖',
      dangerDesc: 'เสี่ยงกลิ้งทับใบหน้าและจมูกของทารกขณะหลับ',
      inCrib: true,
    },
    {
      id: 'doll',
      name: 'ตุ๊กตาผ้าขนฟู',
      shortName: 'ตุ๊กตา',
      icon: '🧸',
      dangerDesc: 'ของนุ่มในเตียงอาจปิดทับจมูกและปากทารก รวมถึงสะสมฝุ่น',
      inCrib: true,
    },
    {
      id: 'blanket',
      name: 'ผ้าห่มผืนหนา',
      shortName: 'ผ้าห่ม',
      icon: '🧣',
      dangerDesc: 'ผ้าห่มอาจเลื่อนขึ้นคลุมศีรษะและใบหน้าทารก ทำให้ขาดอากาศหายใจ',
      inCrib: true,
    },
  ]);

  const removedCount = cribItems.filter((item) => !item.inCrib).length;
  const allItemsRemoved = removedCount === cribItems.length;
  const isBabySupine = sleepPose === 'supine';
  const isPracticeComplete = allItemsRemoved && isBabySupine;

  // Automatically record module completion when both conditions are met
  useEffect(() => {
    if (isPracticeComplete) {
      completeModule('newbornCare4');
    }
  }, [isPracticeComplete, completeModule]);

  const handleToggleCribItem = (id) => {
    setCribItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inCrib: !item.inCrib } : item))
    );
  };

  const handleRemoveSingleItem = (id) => {
    setCribItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inCrib: false } : item))
    );
  };

  const handleRemoveAllItems = () => {
    setCribItems((prev) => prev.map((item) => ({ ...item, inCrib: false })));
  };

  const handleResetPractice = () => {
    setSleepPose('prone');
    setCribItems((prev) => prev.map((item) => ({ ...item, inCrib: true })));
  };

  // ── 5 Large Educational Wall Posters (Per ทารก 3 เเละ 4.pdf p6–p9) ──
  const wallPosters = [
    {
      src: '/images/rev/nb4_poster1_env.jpg',
      title: 'ภาพที่ 1: การจัดสภาพแวดล้อมในห้องนอนทารก',
      caption:
        'อุณหภูมิเหมาะสม ไม่ร้อนและไม่หนาวเกินไป • อากาศถ่ายเทสะดวก ไม่อับชื้น • ปลอดควันบุหรี่ ฝุ่น และกลิ่นฉุน • แสงและเสียงเหมาะสม',
      category: 'การนอนหลับที่ปลอดภัย (Nursery 204)',
      clinicalDetails: [
        '1. อุณหภูมิเหมาะสม (ประมาณ 25–26 °C) ไม่ร้อนและไม่หนาวเกินไป',
        '2. อากาศถ่ายเทสะดวก ไม่อับชื้น (เปิดหน้าต่างระบายอากาศเล็กน้อย)',
        '3. ปลอดควันบุหรี่ ฝุ่น และกลิ่นฉุน 100%',
        '4. แสงไฟนวลสบายตาและเสียงเงียบสงบช่วยให้ทารกหลับสนิท',
      ],
    },
    {
      src: '/images/rev/nb4_poster2_back_vs_prone.jpg',
      title: 'ภาพที่ 2: ท่านอนทารก (✓ นอนหงาย vs ✕ นอนคว่ำ)',
      caption:
        '✓ นอนหงาย: ท่านอนที่ปลอดภัยที่สุดสำหรับทารก ช่วยลดความเสี่ยงการอุดกั้นทางเดินหายใจ • ✕ นอนคว่ำ: เสี่ยงอุดกั้นทางเดินหายใจและภาวะไหลตาย (SIDS)',
      category: 'การนอนหลับที่ปลอดภัย (Nursery 204)',
      clinicalDetails: [
        '✓ นอนหงาย (Supine / Back to Sleep): ท่านอนที่ปลอดภัยที่สุด ทางเดินหายใจเปิดโล่ง',
        '✕ นอนคว่ำ (Prone): ห้ามให้ทารกนอนคว่ำ เพราะเสี่ยงต่อการอุดกั้นทางเดินหายใจและภาวะ SIDS',
      ],
    },
    {
      src: '/images/rev/nb4_poster3_safe_mattress.jpg',
      title: 'ภาพที่ 3: ที่นอนทารกที่ปลอดภัย vs ไม่ควรมีของนุ่ม ๆ บนที่นอนทารก',
      caption:
        '✓ ที่นอนเรียบ ตึง ไม่ยุบตัว • ✕ ไม่ควรมีหมอน หมอนข้าง ตุ๊กตา หรือผ้าห่มคลุมหน้า เพราะเสี่ยงอุดกั้นทางเดินหายใจ',
      category: 'การนอนหลับที่ปลอดภัย (Nursery 204)',
      clinicalDetails: [
        '✓ ที่นอนทารกที่ปลอดภัย: ที่นอนเรียบ ตึง ไม่ยุบตัว ไม่มีสิ่งของวางเกะกะ',
        '✕ สิ่งที่ต้องนำออกจากเตียงทารก: หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่มหนา (เสี่ยงปิดกั้นจมูกและปากทารก)',
      ],
    },
    {
      src: '/images/rev/nb4_poster4_separate_bed.jpg',
      title: 'ภาพที่ 4: แยกเตียงจากผู้ปกครอง แต่ให้อยู่ข้างกัน (Room-Sharing)',
      caption:
        '✓ แยกเตียงทารกออกจากเตียงผู้ปกครอง แต่ตั้งไว้ข้างเตียงเดียวกัน ช่วยลดความเสี่ยงการนอนทับทารก และดูแลลูกได้ใกล้ชิด',
      category: 'การนอนหลับที่ปลอดภัย (Nursery 204)',
      clinicalDetails: [
        '✓ ให้ทารกนอนในเตียง/เปลเด็กแยกจากเตียงผู้ปกครอง แต่ตั้งอยู่ชิดข้างเตียงคุณแม่',
        '✓ ป้องกันอุบัติเหตุผู้ปกครองพลิกตัวนอนทับทารกหรือผ้าห่มผู้ใหญ่คลุมหน้าลูก',
        '✓ คุณแม่สามารถมองเห็นและให้นมลูกในเวลากลางคืนได้สะดวก',
      ],
    },
    {
      src: '/images/rev/nb4_poster5_danger_signs.jpg',
      title: 'ภาพที่ 5: สังเกตอาการอันตรายระหว่างการนอนของทารก',
      caption:
        'หายใจลำบาก หรือหยุดหายใจ • ตัวเขียว ซีด • ซึม ปลุกไม่ตื่น • ตัวร้อนหรือตัวเย็นผิดปกติ หากพบอาการเหล่านี้ต้องรีบไปพบแพทย์ทันที',
      category: 'การนอนหลับที่ปลอดภัย (Nursery 204)',
      clinicalDetails: [
        '1. หายใจลำบาก หายใจเร็วผิดปกติ หรือหยุดหายใจ',
        '2. ผิวหนังหรือริมฝีปากเขียวคล้ำ หรือซีด',
        '3. ทารกซึมผิดปกติ ปลุกไม่ตื่น',
        '4. ตัวร้อนจัด (มีไข้) หรือตัวเย็นผิดปกติ',
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

  // ── แบบประเมินความรู้ท้ายห้อง ──
  const room4Questions = getQuestionsByRoomKey('newbornCare4');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const currentQ = room4Questions[quizIndex] || room4Questions[0];

  const handleQuizAnswer = (choice) => {
    if (quizShowFeedback) return;
    setQuizUserChoice(choice);
    setQuizShowFeedback(true);
    if (choice === currentQ.answer) setQuizScore((prev) => prev + 1);
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room4Questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('newbornCare4');
      setShowSuccessModal(
        true,
        'ยินดีด้วย! คุณผ่านการฝึกจัดเตียงนอนทารกที่ปลอดภัยและทำแบบประเมินห้อง Nursery 204 เรียบร้อยแล้ว'
      );
    }
  };

  // ── พรมทอสีครีมลายข้าวหลามตัด (ตามภาพตัวอย่าง /images/rev/nb4_room_ref.jpg) ──
  const diamondRugTex = useWovenRugTexture('diamond');

  return (
    <group>
      {/* ── โครงสร้างห้องนอนโทนอบอุ่น สบายตา น่านอน (พื้นไม้โอ๊คแผ่นจริงจาก HospitalRoomShell) ── */}
      <HospitalRoomShell
        theme="newborn"
        cozyMode={true}
        width={14}
        depth={14}
        height={5.2}
        roomTitle="ห้องที่ 4: การจัดสิ่งแวดล้อมการนอนหลับที่ปลอดภัย (Safe Sleep Room)"
        roomNumber="Nursery 204"
      />

      {/* ── แสงไฟโทนอบอุ่น สบายตา น่านอน (Soothing Warm Bedroom Lighting) ── */}
      <pointLight position={[2.4, 3.2, -1.6]} intensity={0.95} color="#ffd8a8" distance={13} />
      <pointLight position={[-3.5, 2.8, -2.5]} intensity={0.75} color="#ffe8cc" distance={11} />
      <pointLight position={[4.5, 1.4, -3.5]} intensity={0.65} color="#ffb76b" distance={8} />

      {/* พรมปูพื้นสีครีมลายข้าวหลามตัด (Diamond Woven Cream Rug) ใต้เตียงผู้ปกครองและเตียงทารก */}
      <mesh position={[1.1, 0.014, -1.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.1, 5.5]} />
        <meshStandardMaterial color="#dfd1c1" roughness={0.95} />
      </mesh>
      <mesh position={[1.1, 0.017, -1.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 5.2]} />
        <meshStandardMaterial map={diamondRugTex} color="#faf4ec" roughness={0.92} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP-RIGHT TRANSLUCENT MISSION HUD (ภารกิจห้องการนอนหลับที่ปลอดภัย)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-amber-950/85 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-amber-400/50 text-amber-50">
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-1.5 mb-2">
            <span className="text-xs font-extrabold text-amber-200 tracking-wide flex items-center gap-1.5">
              🌙 ภารกิจห้องการนอนทารก (Nursery 204)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPracticeComplete || learningProgress?.newbornCare4
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
              }`}
            >
              {isPracticeComplete || learningProgress?.newbornCare4 ? 'สำเร็จแล้ว ✓' : 'กำลังปฏิบัติ'}
            </span>
          </div>

          {/* สถานะแบบทดลองปฏิบัติสด (Live Checklist) */}
          <div className="bg-black/30 rounded-xl p-2.5 mb-2 space-y-1.5 border border-white/10 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-100">
                1. หยิบของนุ่มออกจากเตียงลูก (4 ชิ้น):
              </span>
              <span
                className={`font-black ${
                  allItemsRemoved ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {removedCount}/4 ชิ้น {allItemsRemoved ? '✓' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-100">
                2. จัดท่านอนลูก (หงาย = ปลอดภัย):
              </span>
              <span
                className={`font-black ${
                  isBabySupine ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {isBabySupine ? '✓ นอนหงายแล้ว' : '✕ ลูกนอนคว่ำอยู่!'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => openWallPoster(0)}
              className="w-full p-2 rounded-xl border border-amber-300/30 bg-white/10 hover:bg-white/20 text-left font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span>🖼️ 1. ดูโปสเตอร์ความรู้รอบห้อง (5 ภาพ)</span>
              <span className="text-amber-300 font-bold">เปิดดู ▶</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('practice')}
              className={`w-full p-2.5 rounded-xl border text-left font-bold flex items-center justify-between transition cursor-pointer ${
                isPracticeComplete
                  ? 'bg-emerald-600/40 border-emerald-400 text-emerald-100'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-200 text-white shadow-lg'
              }`}
            >
              <span>🛏️ 2. แบบทดลองปฏิบัติ: จัดเตียง & พลิกตัวลูก</span>
              <span>{isPracticeComplete ? 'สำเร็จ ✓' : 'เริ่มทำ ▶'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('quiz')}
              className="w-full p-2 rounded-xl border border-amber-300/30 bg-white/10 hover:bg-white/20 text-left font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span>📝 3. แบบประเมินความรู้ท้ายห้อง</span>
              <span className="text-amber-300 font-bold">ทำข้อสอบ ▶</span>
            </button>
          </div>
        </div>
      </Html>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. ผนังด้านเหนือ (North Wall, Flush against inner wall z = -6.78):
             "หน้าต่างเปิดเล็กน้อย มองเห็นวิวนอกห้อง" + ผ้าม่านสีครีมอบอุ่น
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[0.5, 2.65, -6.78]}>
        {/* กรอบหน้าต่างไม้สีอบอุ่น (ฝังแนบผิวกำแพงด้านใน) */}
        <mesh position={[0, 0, -0.015]} castShadow>
          <boxGeometry args={[4.4, 2.5, 0.1]} />
          <meshStandardMaterial color="#8c5a3c" roughness={0.5} />
        </mesh>

        {/* วิวนอกหน้าต่างยามค่ำคืนที่เงียบสงบ น่านอน (Calm Night / Twilight Sky View) */}
        <mesh position={[0, 0, 0.036]}>
          <planeGeometry args={[4.1, 2.25]} />
          <meshBasicMaterial color="#1b263b" />
        </mesh>
        {/* แสงขอบฟ้าและดวงจันทร์เสี้ยว */}
        <mesh position={[0, -0.55, 0.04]}>
          <planeGeometry args={[4.1, 0.9]} />
          <meshBasicMaterial color="#283845" />
        </mesh>
        <mesh position={[1.1, 0.6, 0.045]}>
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial color="#fef3c7" />
        </mesh>
        {/* พุ่มไม้และต้นไม้ด้านนอกหน้าต่าง */}
        <mesh position={[-1.2, -0.75, 0.048]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshBasicMaterial color="#1f4e3d" />
        </mesh>
        <mesh position={[-0.5, -0.8, 0.048]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial color="#2d6a4f" />
        </mesh>
        <mesh position={[1.3, -0.78, 0.048]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#1f4e3d" />
        </mesh>

        {/* บานหน้าต่างเลื่อนเปิดแง้มเล็กน้อย ("หน้าต่างเปิดเล็กน้อย มองเห็นวิวนอกห้อง") */}
        {/* บานซ้าย */}
        <mesh position={[-1.05, 0, 0.06]}>
          <boxGeometry args={[1.95, 2.2, 0.04]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.22} roughness={0.1} />
        </mesh>
        {/* บานขวาเลื่อนเปิดแง้มไว้ประมาณ 45 ซม. เพื่อระบายอากาศ */}
        <mesh position={[0.6, 0, 0.08]}>
          <boxGeometry args={[1.65, 2.2, 0.04]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.25} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 0, 0.085]}>
          <boxGeometry args={[1.68, 2.22, 0.02]} />
          <meshStandardMaterial color="#a47148" wireframe />
        </mesh>

        {/* ผ้าม่านสองฝั่งสีครีมอุ่น */}
        <mesh position={[-2.05, 0, 0.12]} castShadow>
          <boxGeometry args={[0.55, 2.6, 0.12]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.85} />
        </mesh>
        <mesh position={[2.05, 0, 0.12]} castShadow>
          <boxGeometry args={[0.55, 2.6, 0.12]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.85} />
        </mesh>
        {/* ราวผ้าม่าน */}
        <mesh position={[0, 1.32, 0.14]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 4.8, 12]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>

        {/* ป้ายกำกับหน้าต่างเปิดแง้มระบายอากาศ */}
        <Html position={[1.4, -0.9, 0.15]} center distanceFactor={12} zIndexRange={[10, 0]}>
          <div
            onClick={() => openWallPoster(0)}
            className="cursor-pointer select-none bg-amber-950/90 text-amber-100 border border-amber-400/70 px-3 py-1 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap hover:scale-105 transition"
          >
            🪟 หน้าต่างเปิดเล็กน้อย อากาศถ่ายเท • 25–26 °C
          </div>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. 5 โปสเตอร์ความรู้ 3D Mesh ติดผนังแนบสนิท 100% พร้อมกรอบไม้โอ๊คไฟซ่อนอุ่น (คลิกขยายได้)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* ภาพที่ 1 (North Wall Left, z = -6.78): การจัดสภาพแวดล้อมในห้องนอน — ขนาดใหญ่ */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster1_env.jpg"
        width={3.8}
        height={2.5}
        position={[-4.2, 2.9, -6.78]}
        title="การจัดสภาพแวดล้อมในห้องนอนทารก"
        badge="ภาพที่ 1"
        frameColor="#8c5a32"
        accentColor="#d97706"
        onClick={() => openWallPoster(0)}
      />

      {/* ภาพที่ 2 (North Wall Right, z = -6.78): ✓ นอนหงาย vs ✕ นอนคว่ำ */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster2_back_vs_prone.jpg"
        width={3.6}
        height={2.5}
        position={[4.9, 2.9, -6.78]}
        title="ท่านอนทารก (✓ นอนหงาย vs ✕ นอนคว่ำ)"
        badge="ภาพที่ 2"
        frameColor="#8c5a32"
        accentColor="#10b981"
        onClick={() => openWallPoster(1)}
      />

      {/* ภาพที่ 3 (East Wall North, x = 6.78): ✓ ที่นอนทารกที่ปลอดภัย vs ✕ ไม่ควรมีของนุ่ม ๆ บนที่นอนทารก */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster3_safe_mattress.jpg"
        width={4.5}
        height={2.8}
        position={[6.78, 2.9, -3.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="ที่นอนทารกที่ปลอดภัย vs ไม่ควรมีของนุ่ม ๆ"
        badge="ภาพที่ 3"
        frameColor="#8c5a32"
        accentColor="#0284c7"
        onClick={() => openWallPoster(2)}
      />

      {/* ภาพที่ 4 (East Wall Center, x = 6.78): ✓ แยกเตียงจากผู้ปกครอง แต่ให้อยู่ข้างกัน */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster4_separate_bed.jpg"
        width={4.5}
        height={2.8}
        position={[6.78, 2.9, 0.6]}
        rotation={[0, -Math.PI / 2, 0]}
        title="แยกเตียงจากผู้ปกครอง แต่ให้อยู่ข้างกัน"
        badge="ภาพที่ 4"
        frameColor="#8c5a32"
        accentColor="#d97706"
        onClick={() => openWallPoster(3)}
      />

      {/* ภาพที่ 5 (East Wall South, x = 6.78): สังเกตอาการอันตรายระหว่างการนอนของทารก */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster5_danger_signs.jpg"
        width={4.5}
        height={2.8}
        position={[6.78, 2.9, 4.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="สังเกตอาการอันตรายระหว่างการนอนของทารก"
        badge="ภาพที่ 5"
        frameColor="#8c5a32"
        accentColor="#e11d48"
        onClick={() => openWallPoster(4)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          3. ผนังด้านซ้าย (West Wall, x = -6.78): ทีวีติดผนัง 3D Mesh + ตู้คอนโซลไม้ลิ้นชักขาวไฟซ่อนด้านล่าง
             + ชุดผ้าอ้อมพับและห่อแพมเพิสบนตู้คอนโซล + ชั้นวางโชว์ไม้
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* ทีวีจอกว้างติดผนัง 3D Mesh แนบสนิทกับผนังด้านซ้าย (x = -6.78) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster1_env.jpg"
        width={2.55}
        height={1.55}
        position={[-6.78, 2.35, -0.75]}
        rotation={[0, Math.PI / 2, 0]}
        title="จัดเตียงนอนลูกอย่างไร? ให้ปลอดภัยและสบายตัว"
        subtitle="คลิกที่จอทีวีเพื่อเริ่มแบบทดลองปฏิบัติจัดเตียงทารก"
        badge="📺 SAFE SLEEP TV"
        frameColor="#1e293b"
        accentColor="#d97706"
        onClick={() => setActiveModal('practice')}
      />

      <group position={[-6.78, 0, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* ชั้นวางไม้ซ่อนไฟอุ่นติดผนังข้างทีวี (ตามภาพ nb4_room_ref.jpg) */}
        <group position={[-1.65, 2.15, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 1.05, 0.24]} />
            <meshStandardMaterial color="#b07d4f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0.03]}>
            <boxGeometry args={[0.62, 0.38, 0.2]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0, -0.24, 0.03]}>
            <boxGeometry args={[0.62, 0.38, 0.2]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.35} />
          </mesh>
        </group>

        {/* ตู้คอนโซลไม้โอ๊คยาว + หน้าลิ้นชักสีขาว 6 ช่อง + ไฟซ่อนด้านล่าง (ตามภาพ nb4_room_ref.jpg) */}
        <mesh position={[0, 0.38, 0.28]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.58, 0.56]} />
          <meshStandardMaterial color="#b58354" roughness={0.5} />
        </mesh>
        {/* แถบไฟ LED สีส้มอุ่นใต้ตู้คอนโซล */}
        <mesh position={[0, 0.06, 0.48]}>
          <boxGeometry args={[3.2, 0.04, 0.06]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.85} />
        </mesh>
        {/* หน้าลิ้นชักสีขาว 6 บาน (2 แถว × 3 คอลัมน์) พร้อมมือจับไม้ */}
        {[-1.06, 0, 1.06].map((dx, col) =>
          [0.49, 0.25].map((dy, row) => (
            <group key={`drw_${col}_${row}`} position={[dx, dy, 0.565]}>
              <mesh castShadow>
                <boxGeometry args={[0.98, 0.2, 0.02]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0.015]}>
                <boxGeometry args={[0.16, 0.025, 0.015]} />
                <meshStandardMaterial color="#9c6b3f" roughness={0.45} />
              </mesh>
            </group>
          ))
        )}
        {/* กระถางต้นพลูด่างใบห้อยด้านซ้ายบนคอนโซล */}
        <group position={[-1.35, 0.68, 0.28]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.09, 0.2, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#3f6212" roughness={0.75} />
          </mesh>
          {[-0.08, 0, 0.08].map((vx, vi) => (
            <mesh key={`vine_${vi}`} position={[vx, -0.02 - vi * 0.04, 0.12]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color="#4d7c0f" roughness={0.75} />
            </mesh>
          ))}
        </group>
        {/* ชุดผ้าอ้อมผ้าสาลูพับ + แพมเพิสสำเร็จรูปวางบนตู้คอนโซลกลางห้อง */}
        <group position={[-0.18, 0.68, 0.28]}>
          {[
            [0.02, '#ffffff', '#38bdf8'],
            [0.055, '#fce7f3', '#ec4899'],
            [0.09, '#ffffff', '#38bdf8'],
          ].map(([py, col, trim], idx) => (
            <group key={`nb4_diaper_${idx}`} position={[-0.14, py, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.28, 0.032, 0.24]} />
                <meshStandardMaterial color={col} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.002, 0.11]}>
                <boxGeometry args={[0.282, 0.033, 0.022]} />
                <meshStandardMaterial color={trim} />
              </mesh>
            </group>
          ))}
          <mesh position={[0.16, 0.11, 0]} castShadow>
            <boxGeometry args={[0.2, 0.22, 0.22]} />
            <meshStandardMaterial color="#0d9488" roughness={0.4} />
          </mesh>
          <mesh position={[0.16, 0.11, 0.112]}>
            <planeGeometry args={[0.16, 0.15]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
        {/* เครื่องฟอกอากาศ/เบบี้มอนิเตอร์สีขาว + แจกันดอกไม้สีขาวบนคอนโซล */}
        <group position={[0.95, 0.68, 0.28]}>
          <mesh position={[0, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.1, 0.26, 18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          <mesh position={[0.28, 0.11, 0.04]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.22, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0.28, 0.26, 0.04]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── เก้าอี้นวมสีครีม + หมอนอิงสีชมพู + โต๊ะกลมวางโคมไฟโดมแสงอุ่น & กระถางต้นไม้เล็ก 2 ต้น + ต้นไม้ใหญ่ ── */}
      <InteractiveSeat
        id="nb204_cozy_armchair"
        name="เก้าอี้นวมพักผ่อนมุมห้องนอน"
        type="chair"
        position={[-4.65, 0, -4.45]}
        rotation={[0, Math.PI / 4, 0]}
        seatOffset={[0, 0.45, 0]}
      >
        <group>
          {/* ขาไม้ 4 ขา */}
          {[[-0.36, -0.34], [0.36, -0.34], [-0.36, 0.34], [0.36, 0.34]].map(([lx, lz], idx) => (
            <mesh key={`aleg_${idx}`} position={[lx, 0.11, lz]} castShadow>
              <cylinderGeometry args={[0.028, 0.02, 0.22, 12]} />
              <meshStandardMaterial color="#8c5a32" roughness={0.5} />
            </mesh>
          ))}
          {/* เบาะนั่งและพนักพิงสีครีมเบจ */}
          <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.96, 0.32, 0.9]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.78, -0.34]} castShadow>
            <boxGeometry args={[0.94, 0.68, 0.22]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.85} />
          </mesh>
          <mesh position={[-0.43, 0.54, 0]} castShadow>
            <boxGeometry args={[0.16, 0.36, 0.86]} />
            <meshStandardMaterial color="#e6d7c8" roughness={0.85} />
          </mesh>
          <mesh position={[0.43, 0.54, 0]} castShadow>
            <boxGeometry args={[0.16, 0.36, 0.86]} />
            <meshStandardMaterial color="#e6d7c8" roughness={0.85} />
          </mesh>
          {/* หมอนอิงสีชมพูพาสเทล (ตามภาพ nb4_room_ref.jpg) */}
          <mesh position={[0.08, 0.58, -0.16]} rotation={[-0.22, -0.15, 0.08]} castShadow>
            <boxGeometry args={[0.42, 0.34, 0.14]} />
            <meshStandardMaterial color="#f4acb7" roughness={0.85} />
          </mesh>
        </group>
      </InteractiveSeat>

      {/* โต๊ะกลมไม้ข้างเก้าอี้นวม + โคมไฟโดมแสงอุ่น + กระถางต้นไม้เล็ก 2 ต้น (ตามภาพ nb4_room_ref.jpg) */}
      <group position={[-3.35, 0, -5.2]}>
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 28]} />
          <meshStandardMaterial color="#b58354" roughness={0.5} />
        </mesh>
        {[[-0.22, -0.22], [0.22, -0.22], [0, 0.26]].map(([lx, lz], i) => (
          <mesh key={`stleg_${i}`} position={[lx, 0.24, lz]} castShadow>
            <cylinderGeometry args={[0.024, 0.018, 0.48, 12]} />
            <meshStandardMaterial color="#8c5a32" roughness={0.5} />
          </mesh>
        ))}
        {/* โคมไฟตั้งโต๊ะทรงโดมแสงอุ่น */}
        <mesh position={[-0.1, 0.58, -0.05]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#e6ccb2" />
        </mesh>
        <mesh position={[-0.1, 0.72, -0.05]}>
          <sphereGeometry args={[0.14, 18, 18]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.75} />
        </mesh>
        {/* กระถางต้นไม้สีขาวเล็ก 2 ต้นบนโต๊ะกลม */}
        {[
          [0.14, 0.08],
          [0.08, -0.16],
        ].map(([px, pz], pi) => (
          <group key={`mini_pl_${pi}`} position={[px, 0.5, pz]}>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.1, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial color="#4d7c0f" roughness={0.75} />
            </mesh>
          </group>
        ))}
      </group>
      {/* ต้นไม้ประดับมุมหน้าต่างซ้ายบน */}
      <RealPlant type="potted" position={[-5.9, 0, -5.8]} scale={1.25} />

      {/* ══════════════════════════════════════════════════════════════════════════
          4. เตียงผู้ปกครอง (คุณแม่นอนหลับอยู่) + ตู้เสื้อผ้าบิวท์อินบานขาวตัดไม้โอ๊ค
             + กรอบรูปใบไม้เหนือหัวเตียง 2 กรอบ + เตียงทารกขอบขาวตาข่ายโปร่งตั้งอยู่ข้างกัน
             (ตรงตามภาพตัวอย่าง /images/rev/nb4_room_ref.jpg)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* ── ตู้เสื้อผ้าบิวท์อินบานขาวตัดไม้โอ๊ค (Built-in White & Oak Wardrobe Closet) ── */}
      <group position={[5.55, 0, -4.85]} rotation={[0, -Math.PI / 6, 0]}>
        {/* โครงตู้ไม้โอ๊ค */}
        <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 3.1, 0.68]} />
          <meshStandardMaterial color="#b58354" roughness={0.5} />
        </mesh>
        {/* บานตู้สีขาวคู่ + มือจับไม้ยาว */}
        {[-0.39, 0.39].map((dx, i) => (
          <group key={`wd_door_${i}`} position={[dx, 1.55, 0.345]}>
            <mesh castShadow>
              <boxGeometry args={[0.74, 2.94, 0.02]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[i === 0 ? 0.28 : -0.28, 0, 0.02]}>
              <boxGeometry args={[0.03, 0.55, 0.02]} />
              <meshStandardMaterial color="#8c5a32" roughness={0.45} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 4.1 เตียงผู้ปกครอง (Parent's Bed with Sleeping Mother) ── */}
      <group position={[2.55, 0, -1.65]}>
        {/* ฐานเตียงไม้โอ๊คขนาดใหญ่ */}
        <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.42, 3.1]} />
          <meshStandardMaterial color="#b07d4f" roughness={0.52} />
        </mesh>
        {/* หัวเตียงไม้โอ๊ค + แถบไฟซ่อน LED สีส้มอุ่นหลังหัวเตียง (ตามภาพ nb4_room_ref.jpg) */}
        <mesh position={[0, 0.95, -1.48]} castShadow>
          <boxGeometry args={[2.75, 1.32, 0.16]} />
          <meshStandardMaterial color="#9c6b3f" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.63, -1.48]}>
          <boxGeometry args={[2.72, 0.045, 0.12]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.85} />
        </mesh>
        <mesh position={[0, 0.92, -1.39]}>
          <boxGeometry args={[2.45, 0.92, 0.06]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.8} />
        </mesh>

        {/* กรอบรูปภาพใบไม้และดอกไม้ 2 กรอบเหนือหัวเตียงคุณแม่ (ตามภาพ nb4_room_ref.jpg) */}
        {[-0.65, 0.65].map((fx, fi) => (
          <group key={`hb_art_${fi}`} position={[fx, 2.28, -1.52]}>
            <mesh castShadow>
              <boxGeometry args={[0.78, 0.96, 0.04]} />
              <meshStandardMaterial color="#9c6b3f" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[0.66, 0.84]} />
              <meshStandardMaterial color="#faf6f0" roughness={0.7} />
            </mesh>
            {/* ลวดลายใบไม้/ดอกไม้โทนธรรมชาติในกรอบรูป */}
            <mesh position={[0, -0.04, 0.026]} rotation={[0, 0, fi === 0 ? 0.25 : -0.2]}>
              <planeGeometry args={[0.24, 0.46]} />
              <meshStandardMaterial color={fi === 0 ? '#84a98c' : '#d4a373'} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* ฟูกที่นอนสีครีม */}
        <mesh position={[0, 0.52, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[2.42, 0.24, 2.9]} />
          <meshStandardMaterial color="#fff8f0" roughness={0.75} />
        </mesh>
        {/* ผ้าห่มสีชมพูตุ่นอบอุ่นคลุมเตียงผู้ปกครอง (ตามภาพ nb4_room_ref.jpg) */}
        <mesh position={[0, 0.65, 0.38]} castShadow receiveShadow>
          <boxGeometry args={[2.44, 0.14, 2.1]} />
          <meshStandardMaterial color="#d8a499" roughness={0.82} />
        </mesh>
        {/* หมอนหนุนบนเตียงผู้ปกครอง 2 ใบ */}
        <mesh position={[-0.6, 0.7, -1.0]} castShadow>
          <boxGeometry args={[0.85, 0.16, 0.48]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
        <mesh position={[0.6, 0.7, -1.0]} castShadow>
          <boxGeometry args={[0.85, 0.16, 0.48]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>

        {/* คุณแม่นอนหลับพักผ่อนอยู่บนเตียงผู้ปกครอง (นอนหงาย ศีรษะหนุนหมอนที่ z = -0.95 ปลายเท้าไปทาง +z) */}
        <group position={[-0.6, 0.78, 0.52]} rotation={[-Math.PI / 2, 0, 0]}>
          <MotherAvatar
            position={[0, 0, 0]}
            scale={0.94}
            characterOverride="postpartum_mother"
            outfitOverride="pink"
            isSittingOverride={false}
            isHoldingBabyOverride={false}
            currentAnimation="idle"
          />
        </group>

        {/* โต๊ะข้างเตียงไม้โอ๊ค 2 ลิ้นชัก + โคมไฟหัวเตียงแสงอุ่น + นาฬิกาดิจิทัล + ต้นไม้เล็ก */}
        <group position={[1.78, 0, -1.1]}>
          <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.68, 0.56]} />
            <meshStandardMaterial color="#b07d4f" roughness={0.52} />
          </mesh>
          {[0.48, 0.22].map((dy, di) => (
            <mesh key={`ns_drw_${di}`} position={[0, dy, 0.285]}>
              <boxGeometry args={[0.58, 0.2, 0.02]} />
              <meshStandardMaterial color="#c89666" roughness={0.5} />
            </mesh>
          ))}
          {/* โคมไฟหัวเตียง */}
          <mesh position={[-0.12, 0.78, -0.05]}>
            <cylinderGeometry args={[0.07, 0.09, 0.2, 14]} />
            <meshStandardMaterial color="#ddb892" />
          </mesh>
          <mesh position={[-0.12, 0.98, -0.05]}>
            <cylinderGeometry args={[0.13, 0.21, 0.25, 16]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.65} />
          </mesh>
          {/* กรอบนาฬิกา/รูปเล็กและกระถางต้นไม้บนโต๊ะข้างเตียง */}
          <mesh position={[0.16, 0.74, 0.06]} rotation={[-0.2, -0.3, 0]} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.03]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0.18, 0.74, -0.12]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.18, 0.83, -0.12]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.75} />
          </mesh>
        </group>

        {/* คลิกที่เตียงผู้ปกครองเพื่อดูคำแนะนำการแยกเตียงทารกให้อยู่ข้างเตียงผู้ปกครอง */}
      </group>

      {/* ── 4.2 เตียงทารกขอบขาวโครงไม้โอ๊คตาข่ายโปร่ง ตั้งอยู่ข้างเตียงผู้ปกครอง (ตามภาพ nb4_room_ref.jpg) ── */}
      <group position={[-0.55, 0, -1.55]}>
        <BabyCrib position={[0, 0, 0]} scale={1.18} />
        {/* ขอบเตียงทารกบุสีขาว + ผนังตาข่ายโปร่งระบายอากาศสีขาวนวลตามดีไซน์ Co-Sleeper Crib ในรูป */}
        <mesh position={[-0.47, 0.84, 0]} castShadow>
          <boxGeometry args={[0.04, 0.36, 1.32]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.45} roughness={0.6} />
        </mesh>
        <mesh position={[0.47, 0.84, 0]} castShadow>
          <boxGeometry args={[0.04, 0.36, 1.32]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.45} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.03, -0.66]} castShadow>
          <boxGeometry args={[0.98, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.03, 0.66]} castShadow>
          <boxGeometry args={[0.98, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>

        {/* แผ่นที่นอนทารกเรียบตึงภายในเตียงไม้ */}
        <mesh
          position={[0, 0.66, 0]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            setActiveModal('practice');
          }}
        >
          <boxGeometry args={[0.88, 0.08, 1.28]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.7} />
        </mesh>

        {/* ทารกนอนอยู่ในเตียง:
            - เข้าไปครั้งแรก ลูกนอนคว่ำอยู่ (sleepPose === 'prone')
            - เมื่อคุณแม่จับพลิกตัวแล้ว ลูกนอนหงาย (sleepPose === 'supine') */}
        <group
          position={[0, 0.75, 0.05]}
          rotation={
            sleepPose === 'prone'
              ? [Math.PI / 2, 0, Math.PI] // นอนคว่ำหน้าลง (Prone)
              : [-Math.PI / 2, 0, 0] // นอนหงาย (Supine - Safe)
          }
          onClick={(e) => {
            e.stopPropagation();
            setSleepPose((prev) => (prev === 'prone' ? 'supine' : 'prone'));
          }}
        >
          <BabyAvatar position={[0, 0, 0]} scale={1.15} isSwaddled={true} />
        </group>

        {/* ── อุปกรณ์นุ่ม ๆ 4 ชิ้นในเตียงทารก ที่คุณแม่ต้องหยิบออก (หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม) ── */}
        {/* 1. หมอน (Pillow) */}
        {cribItems.find((i) => i.id === 'pillow')?.inCrib && (
          <group
            position={[0, 0.73, -0.35]}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSingleItem('pillow');
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[0.52, 0.09, 0.32]} />
              <meshStandardMaterial color="#fde68a" roughness={0.75} />
            </mesh>
          </group>
        )}

        {/* 2. หมอนข้าง (Bolster) */}
        {cribItems.find((i) => i.id === 'bolster')?.inCrib && (
          <group
            position={[-0.25, 0.75, 0.08]}
            rotation={[Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSingleItem('bolster');
            }}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.085, 0.085, 0.62, 16]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.75} />
            </mesh>
          </group>
        )}

        {/* 3. ตุ๊กตา (Plush Doll / Teddy Bear) */}
        {cribItems.find((i) => i.id === 'doll')?.inCrib && (
          <group
            position={[0.26, 0.78, -0.28]}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSingleItem('doll');
            }}
          >
            {/* ตัวตุ๊กตาหมี */}
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.11, 14, 14]} />
              <meshStandardMaterial color="#c08552" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.14, 0]} castShadow>
              <sphereGeometry args={[0.085, 14, 14]} />
              <meshStandardMaterial color="#c08552" roughness={0.85} />
            </mesh>
            <mesh position={[-0.06, 0.21, 0]} castShadow>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#8c5a3c" />
            </mesh>
            <mesh position={[0.06, 0.21, 0]} castShadow>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#8c5a3c" />
            </mesh>
          </group>
        )}

        {/* 4. ผ้าห่มหนา (Thick Blanket) */}
        {cribItems.find((i) => i.id === 'blanket')?.inCrib && (
          <group
            position={[0.04, 0.79, 0.28]}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSingleItem('blanket');
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[0.68, 0.07, 0.55]} />
              <meshStandardMaterial color="#bae6fd" roughness={0.85} />
            </mesh>
          </group>
        )}

        {/* ปุ่มเดียวที่สะอาดตาเหนือเตียงทารกสำหรับเปิดหน้าต่างแบบทดลองปฏิบัติ (ไม่บดบังบรรยากาศห้องนอน) */}
        <Html position={[0, 1.42, 0]} center distanceFactor={12} zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('practice');
            }}
            className={`cursor-pointer px-4 py-1.5 rounded-full font-bold text-xs shadow-lg border border-white/90 whitespace-nowrap transition hover:scale-105 ${
              isPracticeComplete
                ? 'bg-emerald-700/95 text-white'
                : 'bg-amber-800/95 text-amber-50'
            }`}
          >
            {isPracticeComplete
              ? '✓ จัดเตียงทารกปลอดภัยแล้ว (ลูกนอนหงาย & ไม่มีของนุ่มในเตียง)'
              : `🛏️ คลิกเตียงทารก: แบบทดลองปฏิบัติ (หยิบของออก ${removedCount}/4 • ${
                  isBabySupine ? 'ลูกนอนหงายแล้ว ✓' : 'จับลูกพลิกนอนหงาย'
                })`}
          </button>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: แบบทดลองปฏิบัติ (Safe Sleep Hands-On Practice Modal)
          ตามไฟล์ "ทารก 3 เเละ 4.pdf" หน้า 8–9:
          1) หยิบ หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม ออกจากเตียงทารก
          2) จับลูกพลิกตัวจาก "นอนคว่ำ" เป็น "นอนหงาย"
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeModal === 'practice' && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 pointer-events-auto"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-2 border-amber-300 text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 mb-1">
                    Nursery 204 • แบบทดลองปฏิบัติสำหรับคุณแม่
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-slate-900">
                    🛏️ แบบทดลองปฏิบัติ: จัดเตียงทารกให้ปลอดภัย &amp; จับลูกพลิกตัวเป็นท่านอนหงาย
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    เมื่อเข้ามาครั้งแรก ลูกนอนคว่ำอยู่และมีสิ่งของนุ่ม ๆ อยู่ในเตียงทารก กรุณาหยิบสิ่งของที่ไม่ปลอดภัยออกให้ครบ 4 ชิ้น และจับลูกพลิกตัวเป็นท่านอนหงายค่ะ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* ── ส่วนที่ 1: หยิบ หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม ออกจากเตียงทารก ── */}
              <div className="mt-4 bg-sky-50/70 border-2 border-sky-200 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-sky-950">
                      ภารกิจที่ 1: หยิบสิ่งของนุ่ม ๆ ออกจากเตียงทารก ({removedCount}/4 ชิ้น)
                    </h3>
                    <p className="text-xs text-slate-600">
                      คลิกที่รายการด้านล่างเพื่อหยิบ <strong>หมอน, หมอนข้าง, ตุ๊กตา, ผ้าห่ม</strong> ออกจากที่นอนทารก (ป้องกันการอุดกั้นทางเดินหายใจ)
                    </p>
                  </div>
                  {!allItemsRemoved && (
                    <button
                      type="button"
                      onClick={handleRemoveAllItems}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                    >
                      ✨ หยิบออกทั้งหมด 4 ชิ้น
                    </button>
                  )}
                </div>

                {/* ภาพเปรียบเทียบ ที่นอนทารกที่ปลอดภัย vs ไม่ควรมีของนุ่ม ๆ บนที่นอน */}
                <div className="mb-3 bg-white p-2 rounded-xl border border-sky-200">
                  <img
                    src="/images/rev/nb4_poster3_safe_mattress.jpg"
                    alt="ที่นอนทารกที่ปลอดภัย vs ไม่ควรมีของนุ่ม ๆ บนที่นอนทารก"
                    className="w-full h-44 sm:h-52 object-contain rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cribItems.map((item) => {
                    const isRemoved = !item.inCrib;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleCribItem(item.id)}
                        className={`cursor-pointer p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition ${
                          isRemoved
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                            : 'bg-rose-50 border-rose-400 text-rose-950 hover:bg-rose-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="text-xs sm:text-sm font-black">
                              {item.name} ({item.shortName})
                            </div>
                            <div className="text-[11px] opacity-85">{item.dangerDesc}</div>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-black shrink-0 ${
                            isRemoved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white animate-pulse'
                          }`}
                        >
                          {isRemoved ? '✓ หยิบออกแล้ว' : '👆 คลิกหยิบออก'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── ส่วนที่ 2: จับลูกพลิกตัวจาก "นอนคว่ำ" เป็น "นอนหงาย" ── */}
              <div className="mt-4 bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4">
                <h3 className="text-sm sm:text-base font-black text-amber-950">
                  ภารกิจที่ 2: จับลูกพลิกตัวเป็นท่านอนที่ปลอดภัย (✓ นอนหงาย vs ✕ นอนคว่ำ)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
                  เมื่อเข้ามาครั้งแรก ลูกนอนคว่ำอยู่ ซึ่งเสี่ยงต่อการอุดกั้นทางเดินหายใจและภาวะไหลตาย (SIDS) กรุณาคลิกเลือกจับลูกพลิกตัวเป็น <strong>&ldquo;นอนหงาย&rdquo;</strong>
                </p>

                <div className="mb-3 bg-white p-2 rounded-xl border border-amber-200">
                  <img
                    src="/images/rev/nb4_poster2_back_vs_prone.jpg"
                    alt="นอนหงาย vs นอนคว่ำ"
                    className="w-full h-44 sm:h-52 object-contain rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSleepPose('supine')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      isBabySupine
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg ring-2 ring-emerald-300'
                        : 'bg-white border-emerald-400 text-emerald-950 hover:bg-emerald-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black">
                        ✓ จับลูกพลิกเป็น &ldquo;ท่านอนหงาย&rdquo; (Supine)
                      </div>
                      <div className="text-xs opacity-90 mt-0.5">
                        ท่านอนที่ปลอดภัยที่สุดสำหรับทารก ลดความเสี่ยงการอุดกั้นทางเดินหายใจ
                      </div>
                    </div>
                    <span className="text-xl font-black ml-2">
                      {isBabySupine ? '☑' : '👆'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSleepPose('prone')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                      !isBabySupine
                        ? 'bg-rose-600 border-rose-700 text-white shadow-lg'
                        : 'bg-white border-rose-300 text-rose-900 hover:bg-rose-50 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black">
                        ✕ ท่านอนคว่ำ (Prone - ตอนเข้าห้องครั้งแรก)
                      </div>
                      <div className="text-xs opacity-90 mt-0.5">
                        อันตราย! เสี่ยงอุดกั้นทางเดินหายใจและเสียชีวิตเฉียบพลันขณะหลับ
                      </div>
                    </div>
                    <span className="text-xl font-black ml-2">
                      {!isBabySupine ? '⚠️' : ''}
                    </span>
                  </button>
                </div>
              </div>

              {/* สรุปผลการทดลองปฏิบัติ */}
              <div
                className={`mt-4 p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold ${
                  isPracticeComplete
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {isPracticeComplete ? (
                  <div>
                    <div className="text-sm sm:text-base font-black text-emerald-800">
                      🎉 ยอดเยี่ยมมากค่ะ! คุณแม่จัดเตียงนอนทารกและจัดท่านอนได้ปลอดภัยครบถ้วน 100%
                    </div>
                    <p className="mt-1 font-medium">
                      ✓ หยิบหมอน, หมอนข้าง, ตุ๊กตา, และผ้าห่มออกจากเตียงลูกเรียบร้อยแล้ว (ที่นอนเรียบตึง ปลอดภัย)
                      <br />✓ จับลูกพลิกตัวจากนอนคว่ำเป็น &ldquo;นอนหงาย&rdquo; และแยกเตียงทารกวางไว้ข้างเตียงคุณแม่
                    </p>
                  </div>
                ) : (
                  <div>
                    ⏳ กรุณาทำภารกิจให้ครบทั้ง 2 ข้อ: (1) หยิบหมอน หมอนข้าง ตุ๊กตา ผ้าห่มออกจากเตียง ({removedCount}/4) และ (2) กดจับลูกพลิกตัวเป็น &ldquo;ท่านอนหงาย&rdquo;
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetPractice}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  🔄 รีเซ็ตฝึกปฏิบัติใหม่
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    ดูผลในห้อง 3D
                  </button>
                  {isPracticeComplete && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        setShowSuccessModal(
                          true,
                          'ยินดีด้วย! คุณผ่านการฝึกปฏิบัติการจัดที่นอนทารกที่ปลอดภัยและการจัดท่านอนหงายห้อง Nursery 204 เรียบร้อยแล้ว'
                        );
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg cursor-pointer"
                    >
                      🎉 บันทึกความสำเร็จภารกิจ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: แบบประเมินความรู้ท้ายห้อง (Quiz Modal)
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeModal === 'quiz' && currentQ && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 pointer-events-auto"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-5 sm:p-6 border-2 border-amber-300 text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Nursery 204 • แบบประเมินความรู้
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    📝 แบบประเมินเรื่องการนอนหลับที่ปลอดภัยของทารก
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {!quizFinished ? (
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">
                    คำถามข้อที่ {quizIndex + 1} / {room4Questions.length}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mb-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                    {currentQ.question}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { val: true, label: '✓ ใช่ / ถูกต้อง' },
                      { val: false, label: '✕ ไม่ใช่ / ไม่ถูกต้อง' },
                    ].map((btn) => {
                      const isSelected = quizUserChoice === btn.val;
                      return (
                        <button
                          key={String(btn.val)}
                          type="button"
                          onClick={() => handleQuizAnswer(btn.val)}
                          className={`p-3 rounded-xl font-black text-xs sm:text-sm border-2 transition cursor-pointer ${
                            quizShowFeedback
                              ? btn.val === currentQ.answer
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : isSelected
                                ? 'bg-rose-600 text-white border-rose-700'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {quizShowFeedback && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs mb-3 ${
                        quizUserChoice === currentQ.answer
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="font-black mb-1">
                        {quizUserChoice === currentQ.answer ? '✓ คำตอบถูกต้องค่ะ!' : '✕ คำตอบยังไม่ถูกต้อง'}
                      </div>
                      <p>{currentQ.explanation}</p>
                    </div>
                  )}

                  {quizShowFeedback && (
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs sm:text-sm shadow cursor-pointer"
                    >
                      {quizIndex < room4Questions.length - 1 ? 'ข้อถัดไป ▶' : 'สรุปผลคะแนน ▶'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="text-3xl">🎉</div>
                  <div className="text-base font-black text-slate-900">
                    คุณได้คะแนน {quizScore} / {room4Questions.length} คะแนน
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    เสร็จสิ้น
                  </button>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}

      {/* ── Player Controller ── */}
      <PlayerController />
    </group>
  );
}
