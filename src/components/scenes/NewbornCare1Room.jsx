import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import FlowerVase from '../decorations/FlowerVase';
import Pillows from '../decorations/Pillows';
import HospitalNightstand from '../furniture/HospitalNightstand';
import { DiaperStack, BabyBottle, CottonJar, HospitalBin, BabyShelf } from '../furniture/BabyProps';
import InteractiveSeat from '../furniture/InteractiveSeat';

/**
 * NewbornCare1Room — ห้องที่ 1: การให้นมและการอุ้มจัดท่าทารก (Nursery 201)
 *
 * Updated 100% per "ปรับแก้ห้องให้นมทารก.pdf" (bf_p1..bf_p6):
 * - Removed extra table & chair set and red chair.
 * - Labels/recommendations only appear when clicking on the object (no permanent floating clutter).
 * - 3 North Wall posters mounted flush against the wall; clicking opens Lightbox with Previous/Next buttons;
 *   Poster 3 uses /images/rev/bf_4holds.jpg sized cleanly with object-contain.
 * - Sofa + Coffee table aligned directly in front of the West Wall TV (z = -1.6).
 * - TV has 8 slides (1/8 to 8/8), where 8/8 is the playable YouTube video (https://www.youtube.com/watch?v=G1muyuyuD60);
 *   citation & link appear ONLY on slide 8/8.
 * - Handwashing sink, Hot water thermos & cup table, and Breastmilk Refrigerator moved to the Left Wall
 *   (middle-left, flush against wall) and modeled realistically.
 * - Sofa is clickable & sittable via InteractiveSeat; mother sits on sofa with baby to practice the 4 holds.
 * - Coffee table items clickable to display name & usage only when clicked.
 * - North-East corner decorated per Reference Image 6 (/images/rev/bf_corner_decor_ref.jpg):
 *   (1) โต๊ะของใช้ทารก พร้อมของ, (2) ภาพดอกไม้สวยงาม & แผนที่ Nursery Land, (3) ชั้นประดับห้อง, (4) ที่แขวนของ.
 * - Corner flower vase in South-East corner.
 * - Top-right translucent Mission HUD ("ให้นมทารกให้ถูกต้องเหมาะสม").
 */
export default function NewbornCare1Room() {
  const {
    completeModule,
    completedModules,
    setShowSuccessModal,
    isHoldingBaby,
    setHoldingBaby,
    isSitting,
    seatedTarget,
    sitDown,
    standUp,
  } = useStore();
  const openLightbox = useStore((s) => s.openLightbox);

  // ── TV Slides state (1/8 to 8/8, where 8/8 is Video) ──
  const [tvSlide, setTvSlide] = useState(0);
  const [showTvModal, setShowTvModal] = useState(false);

  // ── Active popup / clicked object state (only shown when clicked) ──
  const [activeModal, setActiveModal] = useState(null);
  // 'fridge' | 'tableItems' | 'postureSelector' | 'sink' | 'kettleTable' | 'cribPrompt' | 'cornerDecor'
  const [selectedTableItem, setSelectedTableItem] = useState(1);

  // ── Breastfeeding selection state ──
  const [selectedHold, setSelectedHold] = useState('cradleHold');
  const [holdFeedback, setHoldFeedback] = useState(null);
  const [missionCompleted, setMissionCompleted] = useState(Boolean(completedModules?.newbornCare1));
  const [missionCollapsed, setMissionCollapsed] = useState(false);

  const isMotherSeatedOnSofa = isSitting && seatedTarget?.id === 'nb1-nursing-sofa';

  // ── 3 North Wall Posters (with Previous/Next gallery items) ──
  const wallPosters = [
    {
      src: '/references/room1/img_006.png',
      title: '4 Key Signs การอมหัวนมและการดูดนมแม่ที่ถูกต้อง (Latching)',
      caption: 'ลานนมบนเห็นมากกว่าล่าง, อ้าปากกว้าง >140°, คางแนบชิดเต้า, ริมฝีปากบานออกคล้ายปากปลา',
      category: 'การให้นมบุตร (Nursery 201)',
      hideDetails: true,
    },
    {
      src: '/references/room1/img_010.jpeg',
      title: '4 Key Points for Breastfeeding Positioning (มาตรฐานสากล)',
      caption: 'ท้องแนบท้อง หันหน้าหาเต้า ลำตัวและคอตรงแนว ประคองศีรษะและสะโพกมั่นคง',
      category: 'การให้นมบุตร (Nursery 201)',
      hideDetails: true,
    },
    {
      src: '/images/rev/bf_4holds.jpg',
      title: 'ท่าให้นมทารก 4 ท่า (Breastfeeding Positions)',
      caption: '1. Cradle Hold (ท่าอุ้มลูกบนแขน) | 2. Football Hold (ท่าอุ้มสอดข้างลำตัว) | 3. Side Lying (ท่านอนตะแคง) | 4. Cross Cradle (ท่าอุ้มข้ามตัก)',
      category: 'การให้นมบุตร (Nursery 201)',
      hideDetails: true,
    },
  ];

  const openWallPoster = (index) => {
    openLightbox({
      ...wallPosters[index],
      items: wallPosters,
      currentIndex: index,
    });
  };

  // ── 8 TV Slides (1/8 to 8/8, with 8/8 as Video) ──
  const tvSlidesData = [
    {
      title: 'ยินดีต้อนรับเข้าสู่ห้อง "การให้นมทารก" (1/8)',
      img: '/references/room1/img_002.jpeg',
      bullets: [
        '1. ทารกควรได้ดื่มนมแม่ ภายใน 1 ชั่วโมงแรกหลังคลอด เพื่อกระตุ้นน้ำนมและสร้างภูมิคุ้มกัน',
        '2. ทารกควรกินนมแม่อย่างเดียวไม่น้อยกว่า 6 เดือน โดยไม่ต้องให้น้ำหรืออาหารอื่น',
        '3. หลังจาก 6 เดือน ให้นมแม่ร่วมกับการให้อาหารเสริมตามวัยจนถึงอายุ 2 ปี หรือนานกว่านั้น',
      ],
    },
    {
      title: 'ประโยชน์ของการเลี้ยงลูกด้วยนมแม่ 10 ข้อ (2/8)',
      img: '/references/room1/img_003.jpeg',
      bullets: [
        '1. มีคุณค่าทางสารอาหารที่จำเป็นต่อทารกครบถ้วนและย่อยง่าย',
        '2. เสริมสร้างภูมิคุ้มกันโรค (มีแอนติบอดี IgA ปกป้องลำไส้และทางเดินหายใจ)',
        '3. ช่วยลดอัตราการเจ็บป่วยจากโรคติดเชื้อต่างๆ และลดภูมิแพ้',
        '4. เสริมสร้างพัฒนาการทางสมอง ระบบประสาท และการมองเห็น (DHA & ARA)',
        '5. ส่งเสริมความรักความผูกพันอันอบอุ่นระหว่างมารดาและทารก (Bonding)',
      ],
    },
    {
      title: 'ส่วนประกอบของน้ำนมแม่ในแต่ละระยะ (3/8)',
      img: '/references/room1/img_004.jpeg',
      bullets: [
        '• ระยะที่ 1 (1–3 วันหลังคลอด): หัวน้ำนม (Colostrum) สีเหลืองใส อุดมด้วยภูมิคุ้มกันเข้มข้น เสมือนวัคซีนหยดแรก',
        '• ระยะที่ 2 (5 วัน ถึง 2 สัปดาห์แรก): น้ำนมปรับเปลี่ยน (Transitional Milk) สีขาวนวล ไขมันและแลคโตสเพิ่มขึ้น',
        '• ระยะที่ 3 (หลัง 2 สัปดาห์แรก): น้ำนมสมบูรณ์ (Mature Milk) มีทั้งน้ำนมส่วนหน้าและน้ำนมส่วนหลัง',
      ],
    },
    {
      title: 'การเตรียมตัวก่อนให้นมบุตร (4/8)',
      img: '/references/room1/img_005.jpeg',
      bullets: [
        '1. เตรียมร่างกายและจิตใจ: ผ่อนคลาย ดื่มน้ำอุ่น ล้างมือให้สะอาด',
        '2. จัดท่านั่งให้สบาย: มีหมอนหนุนหลังและหมอนรองให้นม ไม่โน้มตัวเข้าหาลูก',
        '3. สังเกตสัญญาณหิวระยะแรกของทารก: ขยับปาก ส่ายหัวหาเต้า ดูดนิ้วมือ (อย่ารอจนร้องไห้)',
      ],
    },
    {
      title: '4 Key Signs การอมหัวนมและการดูดนมแม่ที่ถูกต้อง (5/8)',
      img: '/references/room1/img_006.png',
      bullets: [
        '1. เห็นลานนมด้านบนมากกว่าด้านล่าง (ลานนมล่างถูกอมมิด)',
        '2. อ้าปากกว้างแนบสนิทกับเต้านม (ทำมุมกว้างกว่า 140 องศา)',
        '3. คางแนบชิดเต้านมแม่ และจมูกเป็นอิสระหายใจสะดวก',
        '4. ริมฝีปากบนและล่างบานออกคล้ายปากปลา (Flanged Lips) ไม่เม้ม',
      ],
    },
    {
      title: '4 Key Points for Breastfeeding Positioning (6/8)',
      img: '/references/room1/img_007.jpeg',
      bullets: [
        '1. ลำตัวชิดกับแม่ (Tummy to Tummy ท้องแนบท้อง อกแนบอก)',
        '2. ลูกหันหน้าเข้าหาเต้านมแม่ (จมูกอยู่ตรงระดับหัวนมก่อนเข้าเต้า)',
        '3. ศีรษะ ลำตัว และสะโพกทารกอยู่ในแนวเส้นตรงเดียวกัน',
        '4. ทารกได้รับการประคองอย่างมั่นคงทั้งศีรษะ หลัง และก้น',
      ],
    },
    {
      title: 'ปัญหาที่พบบ่อยขณะให้นมและการแก้ไข (7/8)',
      img: '/references/room1/img_009.jpeg',
      bullets: [
        '1. หัวนมเจ็บ: แก้ไขการจัดท่าและการอมหัวนมให้ลึกถึงลานนม',
        '2. เต้านมคัด: ให้นมบ่อยทุก 2–3 ชม. ประคบอุ่นเบาๆ ก่อนให้นม และบีบระบายน้ำนมออก',
        '3. ทารกดูดนมไม่ดี: เน้นสัมผัสเนื้อแนบเนื้อ (Skin-to-skin) และจัดท่าอุ้มให้ศีรษะไม่เอียงบิด',
      ],
    },
    {
      title: 'วีดีโอ: ท่าอุ้มและการดูดนมที่ถูกวิธี (8/8)',
      isVideo: true,
      videoUrl: 'https://www.youtube.com/embed/G1muyuyuD60',
      externalUrl: 'https://www.youtube.com/watch?v=G1muyuyuD60',
      citation: 'ที่มา: กรมอนามัย กระทรวงสาธารณสุข “ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”',
      bullets: [
        'รับชมวีดีโอสาธิตท่าอุ้มให้นมทารกและการเข้าเต้าที่ถูกวิธี',
        'ที่มา: https://www.youtube.com/watch?v=G1muyuyuD60',
        '“ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”',
      ],
    },
  ];

  const openTvLightbox = (idx) => {
    const allSlides = tvSlidesData.map((s) => ({
      src: s.img || null,
      isVideo: Boolean(s.isVideo),
      videoUrl: s.videoUrl || null,
      externalUrl: s.externalUrl || null,
      citation: s.citation || null,
      title: s.title,
      caption: null,
      category: 'การให้นมบุตร (Nursery 201)',
      hideDetails: true,
    }));
    const safeIdx = Math.max(0, Math.min(allSlides.length - 1, idx));
    setTvSlide(safeIdx);
    openLightbox({
      ...allSlides[safeIdx],
      items: allSlides,
      currentIndex: safeIdx,
      onIndexChange: (nextIdx) => setTvSlide(nextIdx),
    });
  };

  // ── Table Items Details (shown ONLY when clicked) ──
  const tableEquipmentList = [
    {
      id: 1,
      name: '1. แก้วเล็กสำหรับเก็บนมแม่',
      location: 'วางบนโต๊ะกลางห้องหน้าโซฟา',
      usage: 'ใช้สำหรับรองรับน้ำนมแม่จากการบีบน้ำนมด้วยมือ (Hand Expression) สะอาด ปลอดภัย และทำความสะอาดง่าย',
      icon: '🥛',
      color: 'pink',
    },
    {
      id: 2,
      name: '2. ถ้วย/แก้วสำหรับป้อนนมทารก (Cup Feeding)',
      location: 'วางบนโต๊ะกลางห้องหน้าโซฟา',
      usage: 'ใช้สำหรับป้อนนมทารกในกรณีเต้านมมีอาการผิดปกติไม่สามารถให้นมจากเต้าได้ หรือทารกยังดูดเต้าไม่เก่ง เพื่อป้องกันภาวะสับสนหัวนม (Nipple Confusion)',
      icon: '🥃',
      color: 'sky',
    },
    {
      id: 3,
      name: '3. ไซริงค์สำหรับเก็บน้ำนม + ถุงซิป',
      location: 'วางบนโต๊ะกลางห้องหน้าโซฟา',
      usage: 'ไซริงค์ใช้สำหรับดูดเก็บหัวน้ำนมหยดแรก (Colostrum) ที่มีภูมิคุ้มกันสูงในวันแรกๆ หลังคลอด และถุงซิปจัดเก็บน้ำนมแม่สำหรับเขียนวันที่และนำไปแช่ตู้เย็น',
      icon: '💉',
      color: 'purple',
    },
    {
      id: 4,
      name: '4. ตู้เย็นสำหรับเก็บน้ำนม',
      location: 'ชิดผนังด้านหลังโซนล้างมือและเตรียมน้ำอุ่น',
      usage: 'ใช้เก็บรักษาน้ำนมแม่เพื่อคงคุณค่าสารอาหารและภูมิคุ้มกัน (ช่องธรรมดา 4°C เก็บได้ 3–5 วัน, ช่องแช่แข็ง -18°C เก็บได้ 3–6 เดือน)',
      icon: '🧊',
      color: 'amber',
    },
  ];

  const handleSelectHold = (holdKey) => {
    setSelectedHold(holdKey);
    if (holdKey === 'sideLying') {
      setHoldFeedback({
        isCorrect: false,
        title: '✕ ไม่ถูกต้องสำหรับการนั่งให้นมบนเก้าอี้โซฟา',
        desc: '“ท่า Side Lying เป็นการให้นมทารกบนเตียงนอน ข้อดีคือ เหมาะกับคุณแม่เต้านมใหญ่ สะดวกสบายไม่ต้องเกร็งแขน สามารถพักผ่อนไปพร้อมๆกับการให้ทารกดูดนมได้”',
      });
    } else {
      let holdName = '';
      if (holdKey === 'cradleHold') holdName = '1. Cradle Hold (ท่าอุ้มลูกบนแขน)';
      if (holdKey === 'footballHold') holdName = '2. Football Hold (ท่าอุ้มสอดข้างลำตัว)';
      if (holdKey === 'crossCradle') holdName = '4. Cross Cradle (ท่าอุ้มข้ามตัก)';
      setHoldFeedback({
        isCorrect: true,
        title: `✓ ถูกต้อง! (${holdName})`,
        desc: `คุณแม่เลือก ${holdName} ซึ่งเหมาะสมอย่างยิ่งกับการนั่งให้นมทารกบนเก้าอี้โซฟา ทารกแนบชิดลำตัวแม่และดูดนมได้อย่างปลอดภัย`,
      });
      setMissionCompleted(true);
      completeModule('newbornCare1');
    }
  };

  const handleSitAndBreastfeed = () => {
    sitDown({
      id: 'nb1-nursing-sofa',
      name: 'เก้าอี้โซฟาให้นมทารก',
      type: 'sofa',
      position: [-1.1, 0, -1.6],
      rotationY: -Math.PI / 2,
      seatOffset: [0, 0.46, 0.05],
      isDrivable: false,
    });
    if (isHoldingBaby) {
      setActiveModal('postureSelector');
    }
  };

  const currentSlide = tvSlidesData[tvSlide];

  return (
    <group>
      {/* ── Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        width={14}
        depth={14}
        height={5.2}
        doorZ={5.3}
        roomTitle="ห้องที่ 1: การให้นมและการอุ้มจัดท่าทารก (Lactation & Positioning Room)"
        roomNumber="Nursery 201"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          MISSION HUD (Top-Right Translucent Box per bf_p6.jpg)
          ══════════════════════════════════════════════════════════════════════════ */}
      <ScreenPortal>
        <div
          className="fixed left-2.5 right-2.5 sm:left-auto sm:right-4 z-30 pointer-events-auto sm:max-w-xs sm:w-72 max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)-5.5rem)] overflow-y-auto bg-white/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-xl border border-pink-200/90 text-slate-800"
          style={{ top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 4.25rem)' }}
        >
          <div
            onClick={() => setMissionCollapsed((v) => !v)}
            className={`flex items-center justify-between cursor-pointer select-none ${
              missionCollapsed ? '' : 'border-b border-pink-200/70 pb-1.5 mb-2'
            }`}
          >
            <span className="text-xs font-extrabold text-pink-800 tracking-wide flex items-center gap-1.5">
              🎯 Mission ภารกิจประจำห้อง
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${missionCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {missionCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังปฏิบัติ'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMissionCollapsed((v) => !v);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-pink-100 text-slate-700 transition cursor-pointer"
                title={missionCollapsed ? 'เปิดดูรายการภารกิจ' : 'พับเก็บหน้าต่างภารกิจ'}
              >
                {missionCollapsed ? '▼' : '▲'}
              </button>
            </div>
          </div>

          {!missionCollapsed && (
            <>
              <div
                onClick={() => {
                  if (!isHoldingBaby) {
                    setHoldingBaby(true);
                  }
                  handleSitAndBreastfeed();
                  setActiveModal('postureSelector');
                }}
                className={`cursor-pointer p-2.5 rounded-xl border transition flex items-start gap-2.5 ${
                  missionCompleted
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-white/90 border-slate-200 hover:border-pink-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs mt-0.5 shrink-0 ${
                  missionCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-slate-400 text-transparent'
                }`}>
                  ✓
                </div>
                <div className="text-xs leading-snug">
                  <div className="font-bold">1. ให้นมและจัดท่าอุ้มทารกให้ถูกต้อง</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {!isHoldingBaby
                      ? 'คลิกเพื่ออุ้มทารกและเลือกท่าให้นม 4 ท่า ▶'
                      : !isMotherSeatedOnSofa
                      ? 'คลิกที่เก้าอี้โซฟาหน้า TV เพื่อนั่งให้นม ▶'
                      : 'คลิกเพื่อเลือกท่าให้นมทารกบนโซฟา ▶'}
                  </div>
                </div>
              </div>

              <div className="mt-1.5 space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => openTvLightbox(tvSlide)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white/90 hover:border-pink-400 text-left font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>📺 2. เรียนรู้ผ่านจอ TV ({tvSlide + 1}/8)</span>
                  <span className="text-pink-600 font-bold">เปิดดู ▶</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('tableItems')}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white/90 hover:border-pink-400 text-left font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>🍼 3. ดูอุปกรณ์เก็บน้ำนมแม่บนโต๊ะ</span>
                  <span className="text-pink-600 font-bold">ดูอุปกรณ์ ▶</span>
                </button>
              </div>
            </>
          )}
        </div>
      </ScreenPortal>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. NORTH WALL (BACK — FLUSH AGAINST WALL z = -6.92):
             - 3 Framed Educational Wall Posters (with Previous/Next in Lightbox)
             - Baby Crib with sleeping baby (NO floating label; click to interact)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Wall Poster 1: "4 Key Signs" — Flush against North Wall */}
      <group position={[-4.2, 2.75, -6.92]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            openWallPoster(0);
          }}
        >
          <boxGeometry args={[2.15, 1.5, 0.03]} />
          <meshStandardMaterial color="#b45309" roughness={0.35} />
        </mesh>
        <Html position={[0, 0, 0.02]} center transform scale={0.22} style={{ pointerEvents: 'none' }}>
          <div
            className="select-none bg-white p-1.5 rounded-lg border-2 border-amber-500 shadow-md overflow-hidden"
            style={{ width: '400px', pointerEvents: 'none' }}
          >
            <img
              src="/references/room1/img_006.png"
              alt="4 Key Signs"
              style={{ width: '100%', height: '215px', objectFit: 'contain', backgroundColor: '#fffbeb', borderRadius: '6px' }}
            />
          </div>
        </Html>
      </group>

      {/* Wall Poster 2: "4 Key Points" — Flush against North Wall */}
      <group position={[-1.7, 2.75, -6.92]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            openWallPoster(1);
          }}
        >
          <boxGeometry args={[2.15, 1.5, 0.03]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} />
        </mesh>
        <Html position={[0, 0, 0.02]} center transform scale={0.22} style={{ pointerEvents: 'none' }}>
          <div
            className="select-none bg-white p-1.5 rounded-lg border-2 border-sky-500 shadow-md overflow-hidden"
            style={{ width: '400px', pointerEvents: 'none' }}
          >
            <img
              src="/references/room1/img_010.jpeg"
              alt="4 Key Points"
              style={{ width: '100%', height: '215px', objectFit: 'contain', backgroundColor: '#f0f9ff', borderRadius: '6px' }}
            />
          </div>
        </Html>
      </group>

      {/* Wall Poster 3: "ท่าให้นมทารก 4 ท่า" (/images/rev/bf_4holds.jpg sized cleanly with object-contain) */}
      <group position={[1.1, 2.75, -6.92]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            openWallPoster(2);
          }}
        >
          <boxGeometry args={[2.65, 1.55, 0.03]} />
          <meshStandardMaterial color="#be185d" roughness={0.35} />
        </mesh>
        <Html position={[0, 0, 0.02]} center transform scale={0.22} style={{ pointerEvents: 'none' }}>
          <div
            className="select-none bg-white p-1.5 rounded-lg border-2 border-pink-500 shadow-md overflow-hidden"
            style={{ width: '490px', pointerEvents: 'none' }}
          >
            <img
              src="/images/rev/bf_4holds.jpg"
              alt="ท่าให้นมทารก 4 ท่า"
              style={{ width: '100%', height: '220px', objectFit: 'contain', backgroundColor: '#fdf2f8', borderRadius: '6px' }}
            />
          </div>
        </Html>
      </group>

      {/* ── Classic Wooden Baby Crib against North Wall (Click to pick up / place baby; NO permanent floating badge) ── */}
      <group
        position={[0.4, 0, -5.2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('cribPrompt');
        }}
      >
        {/* Crib Base Frame */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.95]} />
          <meshStandardMaterial color="#e5d0b1" roughness={0.4} />
        </mesh>
        {/* Mattress with soft pink blanket */}
        <mesh position={[0, 0.48, 0]} receiveShadow>
          <boxGeometry args={[1.42, 0.12, 0.88]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.8} />
        </mesh>
        {/* Slatted Crib Rails */}
        {[-0.72, 0.72].map((x, i) => (
          <mesh key={`rail_end_${i}`} position={[x, 0.75, 0]} castShadow>
            <boxGeometry args={[0.04, 0.65, 0.95]} />
            <meshStandardMaterial color="#d4be9b" roughness={0.4} />
          </mesh>
        ))}
        {[-0.45, 0.45].map((z, i) => (
          <mesh key={`rail_side_${i}`} position={[0, 0.75, z]} castShadow>
            <boxGeometry args={[1.5, 0.65, 0.04]} />
            <meshStandardMaterial color="#d4be9b" roughness={0.4} />
          </mesh>
        ))}
        {/* 4 Corner Legs */}
        {[[-0.72, -0.45], [0.72, -0.45], [-0.72, 0.45], [0.72, 0.45]].map(([x, z], i) => (
          <mesh key={`leg_${i}`} position={[x, 0.48, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.96, 16]} />
            <meshStandardMaterial color="#bfa47e" roughness={0.4} />
          </mesh>
        ))}

        {/* Peaceful Sleeping Baby in Crib */}
        {!isHoldingBaby && (
          <group position={[0, 0.54, 0]}>
            <BabyAvatar
              pose="sleeping"
              position={[0, 0, 0]}
              scale={0.95}
              blanketColor="#fbcfe8"
              beanieColor="#fce7f3"
            />
          </group>
        )}

        {/* Crib Action Popup — ONLY shown when Crib is clicked */}
        {activeModal === 'cribPrompt' && (
          <Html position={[0, 1.55, 0]} center zIndexRange={[20, 0]}>
            <div
              className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border-2 border-pink-400 w-64 text-center"
              style={{ minWidth: '250px', whiteSpace: 'nowrap' }}
            >
              <div className="text-xs font-extrabold text-pink-900 mb-2">
                👶 เตียงนอนทารก (Baby Crib)
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextHold = !isHoldingBaby;
                  setHoldingBaby(nextHold);
                  setActiveModal(null);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white shadow bg-pink-600 hover:bg-pink-500 transition"
              >
                {isHoldingBaby ? 'วางทารกลงในเตียง' : '🤱 อุ้มทารกขึ้นมาจากเตียง'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal(null);
                }}
                className="mt-1.5 text-[11px] text-slate-500 hover:text-slate-700 font-semibold"
              >
                ปิดป้าย
              </button>
            </div>
          </Html>
        )}
      </group>

      {/* Bedside Nightstand left of Crib */}
      <group position={[-1.2, 0, -5.2]}>
        <HospitalNightstand position={[0, 0, 0]} scale={0.88} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. WEST WALL (LEFT):
             - Large Wall-Mounted TV (z = -1.6) with 8 Slides (8/8 is Video)
             - Flush along middle-left of West Wall (x = -6.48):
                 (a) Realistic Handwashing Sink (z = 1.0)
                 (b) Realistic Utility Table with Hot Water Thermos & Cup (z = 2.4)
                 (c) Realistic 2-Door Breastmilk Refrigerator (z = 3.85)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[-6.88, 2.55, -1.6]} rotation={[0, Math.PI / 2, 0]}>
        {/* TV Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.7, 2.2, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[3.55, 2.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>

        {/* TV Interactive Display (1/8 to 8/8) */}
        <Html position={[0, 0, 0.045]} center transform scale={0.24}>
          <div
            className="select-none bg-slate-950 text-white rounded-lg p-3 shadow-2xl flex flex-col justify-between"
            style={{ width: '570px', height: '345px', border: '3px solid #38bdf8' }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 px-1">
              <span className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                📺 สื่อให้ความรู้การให้นมบุตร ({tvSlide + 1}/{tvSlidesData.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openTvLightbox(tvSlide)}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold shadow"
                >
                  🔍 ขยายเต็มจอ
                </button>
                <button
                  onClick={() => setTvSlide(7)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold shadow flex items-center gap-1 ${
                    tvSlide === 7 ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  ▶ หน้า 8/8 วีดีโอ
                </button>
              </div>
            </div>

            {/* Slide Content Preview (Slides 1..7 = Image, Slide 8/8 = Playable YouTube Video) */}
            {currentSlide.isVideo ? (
              <div className="my-1.5 flex-1 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col">
                <div className="flex-1 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/G1muyuyuD60"
                    title="ท่าอุ้มและการดูดนมที่ถูกวิธี"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-slate-950/95 px-2.5 py-1 flex items-center justify-between text-[10px] border-t border-slate-800">
                  <span className="text-amber-300 font-semibold truncate">
                    “ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”
                  </span>
                  <a
                    href="https://www.youtube.com/watch?v=G1muyuyuD60"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded font-bold shrink-0 ml-2"
                  >
                    🔗 เปิดดูบน YouTube
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="my-1.5 flex-1 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800 cursor-pointer flex items-center justify-center group"
                onClick={() => openTvLightbox(tvSlide)}
              >
                <img
                  src={currentSlide.img}
                  alt={currentSlide.title}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition"
                />
                <div className="absolute bottom-1 inset-x-2 bg-black/65 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-sky-200 text-center truncate">
                  {currentSlide.title} (คลิกเพื่อขยายใหญ่)
                </div>
              </div>
            )}

            {/* Bottom Controls — Citation ONLY displayed on Slide 8/8 per requirement */}
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] px-1">
              <button
                disabled={tvSlide === 0}
                onClick={() => setTvSlide((s) => Math.max(0, s - 1))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded font-bold"
              >
                ◀ ก่อนหน้า
              </button>
              <div className="text-slate-300 text-[10px] text-center truncate px-2 font-medium">
                {tvSlide === 7 ? (
                  <span className="text-amber-300">
                    ที่มา: กรมอนามัย (https://www.youtube.com/watch?v=G1muyuyuD60)
                  </span>
                ) : (
                  <span className="text-slate-400">สไลด์แผ่นที่ {tvSlide + 1} จาก 8</span>
                )}
              </div>
              <button
                disabled={tvSlide === tvSlidesData.length - 1}
                onClick={() => setTvSlide((s) => Math.min(tvSlidesData.length - 1, s + 1))}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 rounded font-bold"
              >
                ถัดไป ▶
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ── (a) Realistic Handwashing Sink (South Wall middle-left per ภาพที่ 4 ①, flush against wall z = 6.90) ── */}
      <group
        position={[2.15, 0, 6.53]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('sink');
        }}
      >
        {/* Vanity Base Cabinet */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.84, 0.65]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        {/* Cabinet Door Panels */}
        {[-0.26, 0.26].map((x, i) => (
          <mesh key={`sink_door_${i}`} position={[x, 0.4, 0.33]} castShadow>
            <boxGeometry args={[0.48, 0.68, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
        ))}
        {/* Countertop */}
        <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.16, 0.05, 0.7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} />
        </mesh>
        {/* Porcelain Basin Rim & Bowl */}
        <mesh position={[0, 0.9, 0.02]} castShadow>
          <cylinderGeometry args={[0.32, 0.25, 0.1, 28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.92, 0.02]}>
          <cylinderGeometry args={[0.27, 0.22, 0.08, 28]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.15} />
        </mesh>
        {/* Chrome Gooseneck Faucet & Handles */}
        <group position={[0, 0.92, -0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.022, 0.24, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.12, 0.08]} rotation={[Math.PI / 3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Hot/Cold Levers */}
          <mesh position={[-0.08, -0.04, 0.02]} castShadow>
            <boxGeometry args={[0.05, 0.03, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0.08, -0.04, 0.02]} castShadow>
            <boxGeometry args={[0.05, 0.03, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
        {/* Liquid Soap Dispenser Bottle */}
        <group position={[0.38, 0.95, -0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.14, 16]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
        {/* Wall Mirror above Sink */}
        <mesh position={[0, 1.5, -0.31]} castShadow>
          <boxGeometry args={[0.85, 0.95, 0.03]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.5, -0.29]}>
          <planeGeometry args={[0.76, 0.86]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.05} />
        </mesh>
      </group>

      {/* ── (b) Realistic Table with Hot Water Thermos & Cup (South Wall middle per ภาพที่ 4 ①, flush against wall z = 6.90) ── */}
      <group
        position={[0.75, 0, 6.54]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('kettleTable');
        }}
      >
        {/* Warm Oak Counter Table */}
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.06, 0.68]} />
          <meshStandardMaterial color="#d4a373" roughness={0.35} />
        </mesh>
        {/* Lower Shelf */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.04, 0.6]} />
          <meshStandardMaterial color="#e5c19a" roughness={0.4} />
        </mesh>
        {/* 4 Wooden Legs */}
        {[[-0.52, -0.28], [0.52, -0.28], [-0.52, 0.28], [0.52, 0.28]].map(([x, z], i) => (
          <mesh key={`kt_leg_${i}`} position={[x, 0.38, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.76, 16]} />
            <meshStandardMaterial color="#a97142" roughness={0.4} />
          </mesh>
        ))}
        {/* Realistic Electric Hot Water Dispenser / Thermos (กระติกน้ำร้อนไฟฟ้า) */}
        <group position={[-0.24, 0.79, 0]}>
          {/* Main Body */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.125, 0.34, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.25} />
          </mesh>
          {/* Top Lid & Dispense Button */}
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.115, 0.12, 0.04, 24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.385, 0.03]}>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          {/* Water Level Gauge Window */}
          <mesh position={[0, 0.18, 0.122]}>
            <boxGeometry args={[0.03, 0.22, 0.01]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          {/* Spout */}
          <mesh position={[0, 0.31, 0.13]} rotation={[Math.PI / 3, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>

        {/* Wooden Tray with Warm Water Cup & Saucer (แก้วน้ำอุ่นสำหรับคุณแม่) */}
        <group position={[0.22, 0.80, 0.04]}>
          {/* Tray */}
          <mesh receiveShadow>
            <boxGeometry args={[0.42, 0.02, 0.32]} />
            <meshStandardMaterial color="#b07d4f" roughness={0.4} />
          </mesh>
          {/* Saucer */}
          <mesh position={[-0.08, 0.018, 0]}>
            <cylinderGeometry args={[0.07, 0.05, 0.012, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>
          {/* Ceramic Mug */}
          <mesh position={[-0.08, 0.065, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.09, 20]} />
            <meshStandardMaterial color="#fef08a" roughness={0.2} />
          </mesh>
          {/* Second Glass Cup */}
          <mesh position={[0.1, 0.065, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.034, 0.1, 20]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.85} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ── (c) Realistic 2-Door Breastmilk Refrigerator (South Wall middle per ภาพที่ 4 ①, flush against wall z = 6.90) ── */}
      <group
        position={[-0.60, 0, 6.47]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('fridge');
        }}
      >
        {/* Main Refrigerator Body */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 1.8, 0.82]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.35} />
        </mesh>
        {/* Upper Freezer Door (-18°C) */}
        <mesh position={[0, 1.42, 0.42]} castShadow>
          <boxGeometry args={[0.88, 0.62, 0.04]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.18} metalness={0.4} />
        </mesh>
        {/* Lower Fridge Door (4°C) */}
        <mesh position={[0, 0.56, 0.42]} castShadow>
          <boxGeometry args={[0.88, 1.04, 0.04]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.18} metalness={0.4} />
        </mesh>
        {/* Digital Temperature LED Display on Upper Door */}
        <mesh position={[0, 1.48, 0.445]}>
          <boxGeometry args={[0.18, 0.08, 0.01]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Metallic Handles */}
        <mesh position={[0.36, 1.4, 0.46]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.36, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.36, 0.72, 0.46]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.55, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CENTER AREA (ALIGNED DIRECTLY IN FRONT OF TV AT z = -1.6):
             - Nursing Sofa wrapped in InteractiveSeat (x = -1.1, z = -1.6)
             - Low Wooden Coffee Table with 3 Clickable Items (x = -2.8, z = -1.6)
          ══════════════════════════════════════════════════════════════════════════ */}
      <InteractiveSeat
        id="nb1-nursing-sofa"
        name="เก้าอี้โซฟาให้นมทารก (คลิกเพื่อนั่ง)"
        type="sofa"
        position={[-1.1, 0, -1.6]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
      >
        <group
          onClick={() => {
            if (isHoldingBaby) {
              setTimeout(() => setActiveModal('postureSelector'), 150);
            }
          }}
        >
          {/* Plush Sofa Seat Base */}
          <mesh position={[0, 0.24, -0.04]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.36, 0.74]} />
            <meshStandardMaterial color="#faf6f0" roughness={0.7} />
          </mesh>
          {/* Reclining Backrest */}
          <mesh position={[0, 0.82, -0.38]} rotation={[-0.10, 0, 0]} castShadow>
            <boxGeometry args={[1.38, 0.88, 0.24]} />
            <meshStandardMaterial color="#faf6f0" roughness={0.7} />
          </mesh>
          {/* Plush Armrests */}
          {[-0.65, 0.65].map((x, i) => (
            <mesh key={`arm_${i}`} position={[x, 0.48, -0.04]} castShadow>
              <boxGeometry args={[0.20, 0.38, 0.76]} />
              <meshStandardMaterial color="#f2ede4" roughness={0.75} />
            </mesh>
          ))}
          {/* Nursing Cushion neatly tucked at side corner of Sofa */}
          <Pillows position={[-0.45, 0.46, -0.18]} scale={0.52} />

          {/* When Mother is Seated with Baby, show floating action bar above her head (never covering face) */}
          {isMotherSeatedOnSofa && activeModal !== 'postureSelector' && (
            <Html position={[0, 1.92, 0]} center zIndexRange={[20, 0]}>
              <div
                className="flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border-2 border-pink-400"
                style={{ minWidth: '250px', whiteSpace: 'nowrap' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isHoldingBaby) setHoldingBaby(true);
                    setActiveModal('postureSelector');
                  }}
                  className="w-full px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 shadow whitespace-nowrap"
                >
                  🤱 เลือกท่าให้นมทารก (4 ท่า)
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    standUp();
                  }}
                  className="w-full px-3 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 whitespace-nowrap"
                >
                  🚶‍♀️ ลุกออกจากโซฟา
                </button>
              </div>
            </Html>
          )}
        </group>
      </InteractiveSeat>

      {/* ── Low Wooden Coffee Table Directly in Front of Sofa & TV (x = -2.8, z = -1.6) ── */}
      <group position={[-2.8, 0, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Table Top */}
        <mesh
          position={[0, 0.38, 0]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(1);
            setActiveModal('tableItems');
          }}
        >
          <boxGeometry args={[1.55, 0.06, 0.92]} />
          <meshStandardMaterial color="#c29b68" roughness={0.35} />
        </mesh>
        {/* Table Legs */}
        {[[-0.68, -0.38], [0.68, -0.38], [-0.68, 0.38], [0.68, 0.38]].map(([x, z], i) => (
          <mesh key={`tbl_leg_${i}`} position={[x, 0.19, z]} castShadow>
            <cylinderGeometry args={[0.028, 0.025, 0.38, 16]} />
            <meshStandardMaterial color="#8c6239" roughness={0.4} />
          </mesh>
        ))}

        {/* Item 1: แก้วเล็กสำหรับเก็บนมแม่ (Click to view details) */}
        <group
          position={[-0.42, 0.42, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(1);
            setActiveModal('tableItems');
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.048, 0.11, 20]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.018, 20]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} />
          </mesh>
        </group>

        {/* Item 2: ถ้วย/แก้วสำหรับป้อนนมทารก (Click to view details) */}
        <group
          position={[0, 0.42, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(2);
            setActiveModal('tableItems');
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.038, 0.095, 20]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.052, 0]}>
            <cylinderGeometry args={[0.054, 0.054, 0.015, 20]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
        </group>

        {/* Item 3: ไซริงค์สำหรับเก็บน้ำนม + ถุงซิป (Click to view details) */}
        <group
          position={[0.42, 0.42, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(3);
            setActiveModal('tableItems');
          }}
        >
          {/* Syringe */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, -0.1]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 16]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.09, 0.02, -0.1]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
            <meshStandardMaterial color="#a855f7" />
          </mesh>
          {/* Pre-sterilized Milk Zip Bags */}
          <mesh position={[0, 0.015, 0.1]} rotation={[-0.05, 0.15, 0]} castShadow>
            <boxGeometry args={[0.2, 0.025, 0.24]} />
            <meshStandardMaterial color="#e9d5ff" transparent opacity={0.85} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. SOUTH-EAST CORNER NURSERY DECORATION (Per ภาพที่ 5 ④ & ภาพที่ 6: /images/rev/bf_corner_decor_ref.jpg)
             (1) โต๊ะของใช้ทารก พร้อมของ (Dresser table against East Wall, nursing pillow, clothes/diapers stack, rug)
             (2) ภาพดอกไม้สวยงาม (Mounted flush on South Wall)
             (3) ชั้นประดับห้อง (Floating shelves on East Wall above dresser with teddy bears & frames)
             (4) ที่แขวนของ (Wall pegboard on East Wall with hanging baby items)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('cornerDecor');
        }}
      >
        {/* Soft Round Woven Nursery Rug on Floor in South-East Corner */}
        <mesh position={[5.35, 0.015, 5.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.45, 36]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.9} />
        </mesh>
        <mesh position={[5.35, 0.018, 5.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[1.15, 1.38, 36]} />
          <meshStandardMaterial color="#e3d5ca" roughness={0.9} />
        </mesh>

        {/* (1) โต๊ะของใช้ทารก พร้อมของ (Birch Wood Baby Care Dresser Table flush against East Wall x = 6.90) */}
        <group position={[6.50, 0, 4.75]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.55, 0.88, 0.68]} />
            <meshStandardMaterial color="#f3e5d8" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.91, 0]} castShadow>
            <boxGeometry args={[1.62, 0.05, 0.74]} />
            <meshStandardMaterial color="#d4a373" roughness={0.35} />
          </mesh>
          {/* U-Shaped Nursing Pillow on Table */}
          <mesh position={[-0.42, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.18, 0.075, 16, 28, Math.PI * 1.45]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.8} />
          </mesh>
          {/* Folded Stack of Pastel Baby Clothes & Diapers */}
          <mesh position={[0.08, 0.97, 0]} castShadow>
            <boxGeometry args={[0.32, 0.07, 0.26]} />
            <meshStandardMaterial color="#fef08a" roughness={0.75} />
          </mesh>
          <mesh position={[0.08, 1.04, 0]} castShadow>
            <boxGeometry args={[0.3, 0.06, 0.24]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.75} />
          </mesh>
          <mesh position={[0.08, 1.1, 0]} castShadow>
            <boxGeometry args={[0.28, 0.06, 0.22]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.75} />
          </mesh>
          {/* Wipes Box & Baby Care Basket */}
          <mesh position={[0.5, 1.0, 0]} castShadow>
            <boxGeometry args={[0.28, 0.14, 0.22]} />
            <meshStandardMaterial color="#e6ccb2" roughness={0.6} />
          </mesh>
          {/* ── Feeding Props on Dresser — ขวดนม, ผ้าอ้อม, สำลี ── */}
          <BabyBottle position={[-0.55, 1.03, 0.08]} rotation={[0, 0.5, 0]} />
          <BabyBottle position={[-0.55, 1.03, -0.10]} rotation={[0, -0.3, 0]} color="#bbf7d0" />
          <DiaperStack position={[-0.28, 0.97, 0]} count={4} />
          <CottonJar position={[0.72, 1.01, 0]} />
        </group>

        {/* (2) ภาพดอกไม้สวยงาม (Mounted flush on South Wall z = 6.86 — ปรับแก้ห้องให้นมทารก หน้า 3 ภาพที่ 5 & 6) */}
        <group position={[5.45, 2.25, 6.86]} rotation={[0, Math.PI, 0]}>
          {/* กรอบภาพดอกไม้สวยงาม */}
          <mesh
            castShadow
            onClick={(e) => {
              if (e.delta > 10) return;
              e.stopPropagation();
              setActiveModal('cornerDecor');
            }}
          >
            <boxGeometry args={[1.15, 0.85, 0.03]} />
            <meshStandardMaterial color="#d4a373" roughness={0.4} />
          </mesh>
          <Html position={[0, 0, 0.02]} center transform scale={0.16} style={{ pointerEvents: 'none' }}>
            <div
              className="select-none bg-gradient-to-br from-rose-50 via-amber-50/70 to-pink-50 p-2 rounded border-2 border-rose-300 shadow text-center"
              style={{ width: '260px', pointerEvents: 'none' }}
            >
              <svg viewBox="0 0 280 150" className="w-full h-36 rounded bg-white/80 border border-rose-100">
                <path
                  d="M25 132 Q95 78 145 72 T255 36"
                  fill="none"
                  stroke="#84a98c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M70 125 Q120 100 175 94 T245 80"
                  fill="none"
                  stroke="#a3b18a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <ellipse cx="82" cy="90" rx="16" ry="7" transform="rotate(-28 82 90)" fill="#a3b18a" />
                <ellipse cx="132" cy="58" rx="17" ry="7" transform="rotate(-18 132 58)" fill="#84a98c" />
                <ellipse cx="195" cy="82" rx="16" ry="7" transform="rotate(20 195 82)" fill="#a3b18a" />
                <g transform="translate(142, 68)">
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-16"
                      rx="10.5"
                      ry="16"
                      transform={`rotate(${deg})`}
                      fill="#f4acb7"
                      opacity="0.95"
                    />
                  ))}
                  <circle cx="0" cy="0" r="8.5" fill="#fcbf49" />
                </g>
                <g transform="translate(75, 106)">
                  {[0, 72, 144, 216, 288].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-12"
                      rx="8"
                      ry="12.5"
                      transform={`rotate(${deg})`}
                      fill="#ffcad4"
                      opacity="0.95"
                    />
                  ))}
                  <circle cx="0" cy="0" r="6.5" fill="#f77f00" />
                </g>
                <g transform="translate(208, 62)">
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-12.5"
                      rx="8.5"
                      ry="13"
                      transform={`rotate(${deg})`}
                      fill="#fde68a"
                      opacity="0.95"
                    />
                  ))}
                  <circle cx="0" cy="0" r="7" fill="#fb8500" />
                </g>
              </svg>
              <div className="text-[10px] font-bold text-rose-900 mt-1">🌸 2. ภาพดอกไม้สวยงาม</div>
            </div>
          </Html>
        </group>
        {/* Framed Botanical Art beside main floral frame on South Wall */}
        <group position={[4.45, 2.25, 6.86]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.78, 0.03]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.48, 0.66]} />
            <meshStandardMaterial color="#fbcfe8" />
          </mesh>
        </group>

        {/* (3) ชั้นประดับห้อง (Floating Wooden Shelves on East Wall x = 6.76 above Dresser) */}
        <group position={[6.76, 2.22, 4.75]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Top Shelf */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.2, 0.04, 0.24]} />
            <meshStandardMaterial color="#d4a373" roughness={0.4} />
          </mesh>
          {/* Cute Teddy Bear on Top Shelf */}
          <group position={[-0.32, 0.46, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#c68b59" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.09, 0]} castShadow>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#c68b59" roughness={0.85} />
            </mesh>
          </group>
          {/* Small Picture Frame on Top Shelf */}
          <mesh position={[0.22, 0.48, 0]} castShadow>
            <boxGeometry args={[0.22, 0.26, 0.03]} />
            <meshStandardMaterial color="#fef3c7" />
          </mesh>

          {/* Lower Shelf */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[1.2, 0.04, 0.24]} />
            <meshStandardMaterial color="#d4a373" roughness={0.4} />
          </mesh>
          {/* Pastel Yarn / Decor Ornaments on Lower Shelf */}
          <mesh position={[-0.25, -0.06, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.06, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.8} />
          </mesh>
          <mesh position={[0.28, -0.05, 0]} castShadow>
            <boxGeometry args={[0.18, 0.16, 0.14]} />
            <meshStandardMaterial color="#fde68a" roughness={0.6} />
          </mesh>
        </group>

        {/* (4) ที่แขวนของ (Wooden Pegboard / Wall Hanger with Hanging Baby Items on East Wall x = 6.86) */}
        <group position={[6.86, 1.58, 3.35]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.55, 0.03]} />
            <meshStandardMaterial color="#e6ccb2" roughness={0.45} />
          </mesh>
          {/* Pegs & Hanging Items (Baby Booties, Rattle, Bib) */}
          {[-0.25, 0, 0.25].map((x, idx) => (
            <group key={`peg_${idx}`} position={[x, -0.05, 0.04]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
                <meshStandardMaterial color="#9c6644" />
              </mesh>
              <mesh position={[0, -0.12, 0.02]} castShadow>
                <capsuleGeometry args={[0.045, 0.1, 8, 12]} />
                <meshStandardMaterial
                  color={idx === 0 ? '#fbcfe8' : idx === 1 ? '#fef08a' : '#bae6fd'}
                  roughness={0.7}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. EAST WALL & NORTH-EAST CORNER (Per ภาพที่ 3 & ภาพที่ 5):
             - Full-length Standing Wooden Mirror on East Wall
             - Beautiful Corner Flower Vase in North-East Corner (x = 6.15, z = -6.15)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Full Length Standing Wooden Arched Mirror */}
      <group position={[6.35, 0, 1.65]} rotation={[0, -Math.PI / 2 + 0.12, 0]}>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.78, 1.85, 0.06]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.05, 0.032]}>
          <planeGeometry args={[0.68, 1.72]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.65, -0.32]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* Beautiful Corner Flower Vase in North-East Corner per ภาพที่ 3 (x = 6.15, z = -6.15) */}
      <group position={[6.15, 0, -6.15]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.3, 0.7, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <FlowerVase position={[0, 0.7, 0]} scale={1.35} />
      </group>

      {/* 3D Player Controller */}
      <PlayerController initialPosition={[-2.2, 0, 3.2]} initialRotation={Math.PI} />

      {/* ══════════════════════════════════════════════════════════════════════════
          2D HTML INTERACTIVE OVERLAYS & MODALS (Only Shown When Clicked)
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Coffee Table Equipment Modal (Shown ONLY when table or items on table are clicked) */}
      {activeModal === 'tableItems' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-indigo-400">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🍼</span> อุปกรณ์สำหรับเก็บและป้อนนมทารก
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-2.5 text-sm text-slate-800">
                {tableEquipmentList.map((item) => {
                  const isSelected = selectedTableItem === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTableItem(item.id)}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] font-semibold text-indigo-600">{item.location}</div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{item.usage}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 2. Breastmilk Refrigerator Modal (Shown ONLY when refrigerator is clicked) */}
      {activeModal === 'fridge' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-400 text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>🧊</span> 4. ตู้เย็นสำหรับเก็บน้ำนมแม่
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-3">
                ใช้สำหรับเก็บรักษาน้ำนมแม่ที่บีบเก็บในถุงซิปหรือภาชนะสะอาด เพื่อคงคุณค่าสารอาหารและภูมิคุ้มกัน:
              </p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <div className="font-bold text-amber-900">• อุณหภูมิห้อง (ไม่เกิน 25°C):</div>
                  <div className="text-slate-700">เก็บได้นานประมาณ 4 ชั่วโมง</div>
                </div>
                <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200">
                  <div className="font-bold text-sky-900">• ตู้เย็นช่องธรรมดา (4°C):</div>
                  <div className="text-slate-700">เก็บได้นาน 3 – 5 วัน (วางด้านในตู้ ไม่วางที่ประตูตู้เย็น)</div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                  <div className="font-bold text-blue-900">• ช่องแช่แข็งตู้เย็น 2 ประตู (-18°C):</div>
                  <div className="text-slate-700">เก็บได้นานถึง 3 – 6 เดือน</div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 3. Handwashing Sink Modal (Shown ONLY when sink is clicked) */}
      {activeModal === 'sink' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border-4 border-sky-400 text-slate-800 text-center">
              <div className="text-3xl mb-1">🚰</div>
              <h3 className="text-base font-bold text-sky-900">อ่างล้างมือสำหรับคุณแม่</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                คุณแม่ควรล้างมือให้สะอาดด้วยสบู่และน้ำสะอาดทุกครั้งก่อนอุ้มทารกให้นม หรือก่อนบีบเก็บน้ำนมแม่
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
              >
                ✓ ล้างมือสะอาดเรียบร้อยแล้ว
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 4. Hot Water Thermos & Cup Table Modal (Shown ONLY when clicked) */}
      {activeModal === 'kettleTable' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border-4 border-amber-400 text-slate-800 text-center">
              <div className="text-3xl mb-1">☕</div>
              <h3 className="text-base font-bold text-amber-900">โต๊ะวางของ กระติกน้ำร้อน และแก้วน้ำ</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                การดื่มน้ำอุ่น 1 แก้วก่อนและหลังให้นมบุตร ช่วยกระตุ้นการหลั่งฮอร์โมนออกซิโทซิน ทำให้น้ำนมไหลได้ดีขึ้นและชดเชยน้ำที่ร่างกายสูญเสีย
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
              >
                เข้าใจแล้ว ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 5. Nursery Corner Decor Modal (Shown ONLY when corner #4 is clicked) */}
      {activeModal === 'cornerDecor' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border-4 border-pink-400 text-slate-800">
              <div className="flex items-center justify-between border-b pb-2.5">
                <h3 className="text-base font-bold text-pink-900">🧸 มุมของใช้และของตกแต่งห้องทารก (จุดที่ 4)</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="w-full bg-gradient-to-br from-rose-50 via-amber-50/70 to-pink-50 rounded-xl p-3 mt-3 border border-pink-200 flex flex-col items-center">
                <svg viewBox="0 0 320 155" className="w-full h-40 rounded-lg bg-white/90 border border-rose-100 p-2">
                  <path
                    d="M30 135 Q105 82 160 74 T285 38"
                    fill="none"
                    stroke="#84a98c"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M78 128 Q135 102 195 96 T270 82"
                    fill="none"
                    stroke="#a3b18a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <ellipse cx="92" cy="92" rx="17" ry="7.5" transform="rotate(-28 92 92)" fill="#a3b18a" />
                  <ellipse cx="145" cy="60" rx="18" ry="7.5" transform="rotate(-18 145 60)" fill="#84a98c" />
                  <ellipse cx="215" cy="84" rx="17" ry="7.5" transform="rotate(20 215 84)" fill="#a3b18a" />
                  <g transform="translate(160, 72)">
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <ellipse
                        key={deg}
                        cx="0"
                        cy="-17"
                        rx="11"
                        ry="17"
                        transform={`rotate(${deg})`}
                        fill="#f4acb7"
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#fcbf49" />
                  </g>
                  <g transform="translate(88, 110)">
                    {[0, 72, 144, 216, 288].map((deg) => (
                      <ellipse
                        key={deg}
                        cx="0"
                        cy="-13"
                        rx="8.5"
                        ry="13"
                        transform={`rotate(${deg})`}
                        fill="#ffcad4"
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="7" fill="#f77f00" />
                  </g>
                  <g transform="translate(232, 64)">
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <ellipse
                        key={deg}
                        cx="0"
                        cy="-13"
                        rx="9"
                        ry="13.5"
                        transform={`rotate(${deg})`}
                        fill="#fde68a"
                        opacity="0.95"
                      />
                    ))}
                    <circle cx="0" cy="0" r="7.5" fill="#fb8500" />
                  </g>
                </svg>
                <span className="text-xs font-bold text-rose-800 mt-1.5">
                  🌸 ภาพดอกไม้สวยงามประดับผนังสีชมพูพาสเทล
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                <li><strong>1. โต๊ะของใช้ทารก พร้อมของ:</strong> ตู้ลิ้นชักวางหมอนรองให้นม ผ้าอ้อม ชุดเสื้อผ้าทารก และกระบอกน้ำ</li>
                <li><strong>2. ภาพดอกไม้สวยงาม:</strong> กรอบภาพดอกไม้โทนพาสเทลติดผนัง สร้างบรรยากาศอบอุ่นผ่อนคลาย</li>
                <li><strong>3. ชั้นประดับห้อง:</strong> ชั้นไม้ติดผนังวางตุ๊กตาหมีและกรอบรูป</li>
                <li><strong>4. ที่แขวนของ:</strong> ราวไม้แขวนถุงเท้าเด็ก ของเล่นเขย่ามือ และผ้าซับน้ำลาย</li>
              </ul>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* 6. 4 Breastfeeding Holds Activity Modal (Per bf_p5.jpg) */}
      {activeModal === 'postureSelector' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 shadow-2xl border-4 border-pink-400 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div>
                  <h2 className="text-lg font-bold text-pink-900">🤱 ท่าให้นมทารก 4 ท่า (ขณะนั่งที่เก้าอี้โซฟา)</h2>
                  <p className="text-xs text-slate-500">เลือกท่าให้นมทารกที่เหมาะสมสำหรับการนั่งให้นมบนโซฟา</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Reference Poster of 4 Holds */}
              <div className="mt-3 bg-pink-50/70 rounded-xl p-2 border border-pink-200">
                <img
                  src="/images/rev/bf_4holds.jpg"
                  alt="ท่าให้นมทารก 4 ท่า"
                  className="w-full h-44 object-contain rounded-lg bg-white"
                />
              </div>

              {/* 4 Choices (1, 2, 4 -> ✓, 3 Side Lying -> ✕ with reason) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
                <button
                  onClick={() => handleSelectHold('cradleHold')}
                  className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    selectedHold === 'cradleHold' && holdFeedback
                      ? 'border-emerald-500 bg-emerald-50 shadow'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">1. Cradle Hold</div>
                    <div className="text-xs text-slate-600">(ท่าอุ้มลูกบนแขน)</div>
                  </div>
                  {selectedHold === 'cradleHold' && holdFeedback && (
                    <span className="text-xl font-extrabold text-emerald-600">✓</span>
                  )}
                </button>

                <button
                  onClick={() => handleSelectHold('footballHold')}
                  className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    selectedHold === 'footballHold' && holdFeedback
                      ? 'border-emerald-500 bg-emerald-50 shadow'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">2. Football Hold</div>
                    <div className="text-xs text-slate-600">(ท่าอุ้มสอดข้างลำตัว)</div>
                  </div>
                  {selectedHold === 'footballHold' && holdFeedback && (
                    <span className="text-xl font-extrabold text-emerald-600">✓</span>
                  )}
                </button>

                <button
                  onClick={() => handleSelectHold('sideLying')}
                  className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    selectedHold === 'sideLying' && holdFeedback
                      ? 'border-rose-500 bg-rose-50 shadow'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">3. Side Lying</div>
                    <div className="text-xs text-slate-600">(ท่านอนตะแคง)</div>
                  </div>
                  {selectedHold === 'sideLying' && holdFeedback && (
                    <span className="text-xl font-extrabold text-rose-600">✕</span>
                  )}
                </button>

                <button
                  onClick={() => handleSelectHold('crossCradle')}
                  className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    selectedHold === 'crossCradle' && holdFeedback
                      ? 'border-emerald-500 bg-emerald-50 shadow'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">4. Cross Cradle</div>
                    <div className="text-xs text-slate-600">(ท่าอุ้มข้ามตัก)</div>
                  </div>
                  {selectedHold === 'crossCradle' && holdFeedback && (
                    <span className="text-xl font-extrabold text-emerald-600">✓</span>
                  )}
                </button>
              </div>

              {/* Feedback Box */}
              {holdFeedback && (
                <div
                  className={`mt-3.5 p-3.5 rounded-xl border-2 text-sm ${
                    holdFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  <div className="font-bold text-sm">{holdFeedback.title}</div>
                  <p className="mt-1 text-xs leading-relaxed">{holdFeedback.desc}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง (อยู่ในห้อง 3D ต่อ)
                </button>
                {holdFeedback?.isCorrect && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setShowSuccessModal(true, 'ยินดีด้วย! คุณผ่านภารกิจการให้นมทารกอย่างถูกต้องเหมาะสมแล้ว');
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

      {/* 7. Fullscreen TV Video Modal (for Slide 8/8) */}
      {showTvModal && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border-4 border-sky-400 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📺</span>
                  <h2 className="text-lg font-bold text-sky-400">
                    หน้า 8/8: คลิปวีดีโอ ท่าอุ้มและการดูดนมที่ถูกวิธี
                  </h2>
                </div>
                <button
                  onClick={() => setShowTvModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/G1muyuyuD60"
                    title="คลิปวีดีโอ1 ท่าอุ้มและการดูดนมที่ถูกวิธี"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-slate-800 p-3.5 rounded-xl text-xs text-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-amber-300">ที่มา: กรมอนามัย กระทรวงสาธารณสุข</p>
                    <p className="mt-0.5">“ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”</p>
                  </div>
                  <a
                    href="https://www.youtube.com/watch?v=G1muyuyuD60"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shrink-0 shadow"
                  >
                    🔗 เปิดดูบน YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* ── ถังขยะข้างอ่างล้างมือ (ชิดผนังข้างโซนอ่างล้างมือ ไม่บังประตูทางออก) ── */}
      <HospitalBin position={[3.05, 0, 6.58]} color="#eab308" />
    </group>
  );
}
