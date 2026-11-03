import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import ScreenPortal from '../ui/ScreenPortal';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyBathtub from '../furniture/BabyBathtub';
import { BathThermometer } from '../furniture/BabyProps';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import Pillows from '../decorations/Pillows';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { WindowWithCurtains } from '../ward/WardKit';
import { FramedImagePoster3D } from '../furniture/CozyRoomFurniture';
import InteractiveSmartTv3D from '../furniture/InteractiveSmartTv3D';
import { CANVAS_THAI_FONT, fillCenteredText, whenFontsReady } from '../../utils/canvasText';

function useMissionPaperTexture() {
  const { tex, paint } = useMemo(() => {
    const W = 512;
    const H = 360;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 12;
      ctx.strokeRect(14, 14, W - 28, H - 28);

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#134e4a';
      ctx.font = `900 58px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, '📋 ภารกิจ', W / 2, H * 0.42, W - 70);

      ctx.fillStyle = '#475569';
      ctx.font = `700 32px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, 'คลิกเพื่อดูรายละเอียด', W / 2, H * 0.72, W - 70);
      t.needsUpdate = true;
    };

    draw();
    return { tex: t, paint: draw };
  }, []);

  useEffect(() => {
    const cancel = whenFontsReady(paint);
    return () => {
      cancel();
      tex.dispose();
    };
  }, [tex, paint]);

  return tex;
}

/**
 * NewbornCare2Room — ห้องที่ 2: การอาบน้ำและการดูแลความสะอาดทารก การเปลี่ยนผ้าอ้อม (Nursery 202)
 *
 * Updated 100% per:
 * - "ปรับแก้ห้องอาบน้ำทารก.pdf" (bath_p1..5)
 * - "อธิบายเพิ่มเติมการให้ทารกอาบน้ำเปลี่ยนผ้าอ้อม.pdf" (bath_extra_p1..9)
 */
export default function NewbornCare2Room() {
  const missionPaperTex = useMissionPaperTexture();
  const {
    completeModule,
    learningProgress,
    setShowSuccessModal,
    isHoldingBaby,
    setHoldingBaby,
    openLightbox,
  } = useStore();

  // ── TV Slides state (8 slides) ──
  const [tvSlide, setTvSlide] = useState(0);
  const [showTvModal, setShowTvModal] = useState(false);
  const [viewedSlides, setViewedSlides] = useState(() => new Set([0]));

  // ── Room Interactive States (Steps 1–14) ──
  const [isAcOn, setIsAcOn] = useState(true); // Initially ON; player must turn OFF in Step 1
  const [hasWashedHands, setHasWashedHands] = useState(false); // Step 2
  const [collectedItems, setCollectedItems] = useState({
    tubs: true,         // 1. อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น 37–38 °C)
    towels: false,      // 2. ผ้าขนหนูสำหรับเช็ด 1 ผืน และผ้าห่อตัวทารก 1 ผืน
    soap: false,        // 3. สบู่เหลว–ยาสระผม สูตรอ่อนโยนสำหรับเด็กทารก
    sponge: false,      // 4. ผ้าผืนเล็กหรือฟองน้ำสำหรับอาบน้ำ
    cottonBalls: false, // 5. สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ (0.9% NSS) บิดหมาด 2 ก้อน ในถ้วยเล็ก
    clothes: false,     // 6. เสื้อผ้าและผ้าอ้อมทารก
  });
  const [waterTempChecked, setWaterTempChecked] = useState(false); // Step 4

  // Step 5: Football Hold Hair Washing (5 ordered sub-steps 1..5)
  const [babySwaddledForHair, setBabySwaddledForHair] = useState(false);
  const [step5Progress, setStep5Progress] = useState(0); // 0..5 in strict order

  // Step 6: Place on mat, undress, open diaper & check stool/urine
  const [step6Undressed, setStep6Undressed] = useState(false);
  const [step6DiaperChecked, setStep6DiaperChecked] = useState(false);

  // Step 7: Placed in Tub 1 (Blue)
  const [step7InBlueTub, setStep7InBlueTub] = useState(false);

  // Step 8–10: 3 ordered sub-steps (1. ประคองศีรษะ, 2. อาบน้ำด้านหน้า, 3. อาบน้ำด้านหลัง) -> Move to Tub 2 (Pink)
  const [step8Progress, setStep8Progress] = useState(0); // 0..3 in strict order
  const [step10InPinkTub, setStep10InPinkTub] = useState(false);

  // Step 11: Place on towel mat & dry body
  const [step11DriedBody, setStep11DriedBody] = useState(false);

  // Step 12: Swaddle 1st time + Tick 3 eye supplies + Choose correct eye wiping method (Option 1 only)
  const [step12SwaddledFirst, setStep12SwaddledFirst] = useState(false);
  const [step12EyeSupplies, setStep12EyeSupplies] = useState({
    cotton: false,
    cup: false,
    saline: false,
  });
  const [step12EyeAnswer, setStep12EyeAnswer] = useState(null); // 1 (correct) | 2 (wrong)

  // Step 13: Umbilical cord cleaning
  const [step13CordCleaned, setStep13CordCleaned] = useState(false);

  // Step 14: Unwrap -> Put on diaper -> Put on clothes -> Swaddle again -> Return to crib -> Clean up table
  const [step14SubStep, setStep14SubStep] = useState(0); // 0..6

  // ── Current Wizard Step (1 to 14) & Baby 3D Location/Pose ──
  const [wizardStep, setWizardStep] = useState(1);
  // Baby location: 'crib' | 'arms' | 'mat' | 'tub1' | 'tub2'
  const [babyLocation, setBabyLocation] = useState('crib');
  const [babyPose, setBabyPose] = useState('swaddle');

  // ── Active popup modal state (ONLY shown when user clicks an object) ──
  const [activeModal, setActiveModal] = useState(null);
  const [missionCollapsed, setMissionCollapsed] = useState(false);
  // 'acSwitch' | 'sink' | 'cottonTable' | 'cabinet' | 'missionDesk' | 'trash' | 'crib' | 'bathingWizard'

  // ── Derived Mission Progress ──
  const collectedCount = Object.values(collectedItems).filter(Boolean).length;
  const isMission1Done = viewedSlides.size >= 8 || Boolean(learningProgress?.newbornCare2);
  const isMission2Done = collectedCount >= 6 || Boolean(learningProgress?.newbornCare2);
  const isMission3Done = step14SubStep >= 6 || Boolean(learningProgress?.newbornCare2);

  // ── Wall Posters Gallery (with Previous/Next buttons) ──
  const wallPosters = [
    {
      src: '/images/rev/bath_equip_poster.jpg',
      title: 'การเตรียมอุปกรณ์อาบน้ำและเปลี่ยนผ้าอ้อมทารก (น้ำอุ่น 37–38 °C)',
      caption: '3.1 อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น อุณหภูมิ 37–38 °C) และอุปกรณ์ครบ 6 ชนิด',
      category: 'การอาบน้ำทารก (Nursery 202)',
      hideDetails: true,
    },
    {
      src: '/references/room2/img_007.png',
      title: 'ขั้นตอนการอาบน้ำและการทำความสะอาดร่างกายทารก',
      caption: 'ประคองศีรษะในอุ้งฝ่ามือ อาบน้ำด้านหน้า อาบน้ำด้านหลัง และล้างน้ำสะอาดในอ่างที่ 2',
      category: 'การอาบน้ำทารก (Nursery 202)',
      hideDetails: true,
    },
    {
      src: '/references/room2/img_008.jpeg',
      title: 'การเช็ดตัวให้แห้งและการทำความสะอาดดวงตาทารก',
      caption: 'เช็ดจากหัวตาไปหางตา ทั้ง 2 ข้าง (ใช้สำลี 1 ก้อน/ตา 1 ข้าง ไม่เช็ดซ้ำ)',
      category: 'การอาบน้ำทารก (Nursery 202)',
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

  // ── 8 TV Slides (Complete topics 1 / 1.1 through 1.14, Updated to 37–38 °C) ──
  const tvSlidesData = [
    {
      title: 'บทเรียนที่ 2: การอาบน้ำและการเปลี่ยนผ้าอ้อมทารกแรกเกิด (1/8)',
      img: '/references/room2/img_002.jpeg',
      bullets: [
        '• การอาบน้ำทารกช่วยทำความสะอาดร่างกาย กระตุ้นการไหลเวียนโลหิต และสร้างความผูกพัน',
        '• อุณหภูมิห้องควรอบอุ่น ปิดแอร์ก่อนอาบน้ำ เพื่อป้องกันภาวะอุณหภูมิกายต่ำ (Hypothermia)',
      ],
    },
    {
      title: '1.1 การเตรียมสภาพแวดล้อม (ปิดแอร์) และ 1.2 การล้างมือ (2/8)',
      img: '/references/room2/img_003.png',
      bullets: [
        '1.1 ปิดเครื่องปรับอากาศ (แอร์) ก่อนอาบน้ำทารกทุกครั้ง เพื่อป้องกันทารกสูญเสียความร้อน',
        '1.2 ล้างมือให้สะอาดด้วยสบู่และน้ำสะอาดก่อนสัมผัสทารกและเตรียมอุปกรณ์',
      ],
    },
    {
      title: '1.3 การเตรียมอุปกรณ์อาบน้ำ 6 ชนิด (น้ำอุ่น 37–38 °C) (3/8)',
      img: '/images/rev/bath_equip_poster.jpg',
      bullets: [
        '3.1 อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น อุณหภูมิ 37–38 °C)',
        '3.2 ผ้าขนหนูสำหรับเช็ด 1 ผืน และผ้าห่อตัวทารก 1 ผืน',
        '3.3 สบู่เหลว–ยาสระผม สูตรอ่อนโยนสำหรับเด็กทารก',
        '3.4 ผ้าผืนเล็กหรือฟองน้ำสำหรับอาบน้ำ',
        '3.5 สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ (0.9% NSS) บิดหมาด 2 ก้อน ใส่ในถ้วยเล็กสำหรับเช็ดตาทารก',
        '3.6 เสื้อผ้าและผ้าอ้อมทารก',
      ],
    },
    {
      title: '1.4 ทดสอบอุณหภูมิน้ำ (37–38 °C) และ 1.5 การสระผมทารก (4/8)',
      img: '/references/room2/img_005.png',
      bullets: [
        '1.4 ตรวจสอบอุณหภูมิน้ำด้วยหลังมือ (น้ำอุ่น อุณหภูมิ 37–38 °C)',
        '1.5 ห่อตัวทารก อุ้มในท่า Football hold ใช้นิ้วพับหูทารกทั้ง 2 ข้างเพื่อระวังน้ำเข้าหู',
        '• ลำดับสระผม: 1. น้ำลูบหน้าทารก -> 2. ยาสระผมทารก -> 3. สระผมทารก -> 4. ล้างด้วยน้ำอ่างที่ 1 -> 5. ซับผมให้แห้ง',
      ],
    },
    {
      title: '1.6 ถอดเสื้อผ้า-ตรวจสอบการขับถ่าย และ 1.7 นำทารกลงอ่างที่ 1 (5/8)',
      img: '/references/room2/img_006.png',
      bullets: [
        '1.6 วางทารกบนเบาะผ้า ถอดเสื้อผ้า และเปิดผ้าอ้อมตรวจสอบว่ามีการขับถ่ายหรือไม่ (เช็ดทำความสะอาดจากหน้าไปหลัง)',
        '1.7 อุ้มทารกลงอ่างอาบน้ำที่ 1 (อ่างสีฟ้า) อย่างนุ่มนวล',
      ],
    },
    {
      title: '1.8–1.10 การประคองศีรษะ ฟอกสบู่ และพลิกตัวอาบน้ำอ่างที่ 2 (6/8)',
      img: '/references/room2/img_007.png',
      bullets: [
        '1.8 ใช้แขนหนึ่งข้างประคองศีรษะทารกให้อยู่ในอุ้งฝ่ามือ',
        '1.9 อาบน้ำด้านหน้า และอาบน้ำด้านหลังในอ่างที่ 1',
        '1.10 ย้ายทารกไปล้างตัวด้วยน้ำสะอาดในอ่างอาบน้ำที่ 2 (อ่างสีชมพู)',
      ],
    },
    {
      title: '1.11–1.12.2 ซับตัวให้แห้ง ห่อตัว และเช็ดตาทารก (7/8)',
      img: '/references/room2/img_008.jpeg',
      bullets: [
        '1.11 นำทารกวางบนผ้าขนหนู เช็ดตัวทารกให้แห้ง',
        '1.12 ห่อตัวทารก เตรียมสำลี ถ้วยสะอาดขนาดเล็ก และน้ำต้มสุก/0.9% NSS',
        '• เช็ดจากหัวตาไปหางตา ทั้ง 2 ข้าง (1.12.1 และ 1.12.2 ใช้สำลี 1 ก้อน/ตา 1 ข้าง ไม่เช็ดซ้ำ)',
      ],
    },
    {
      title: '1.13–1.14 เช็ดสายสะดือ ใส่ผ้าอ้อม สวมเสื้อผ้า ห่อตัว และเก็บอุปกรณ์ (8/8)',
      img: '/references/room2/img_009.png',
      bullets: [
        '1.13 ทำความสะอาดสายสะดือทารก (อ้างอิงจากห้องการดูแลสายสะดือ)',
        '1.14 คลายผ้าห่อตัว -> ใส่ผ้าอ้อม -> ใส่เสื้อผ้า -> ห่อตัวทารกอีกครั้ง -> อุ้มไปวางในเตียง -> เก็บของให้เรียบร้อย',
      ],
    },
  ];

  const handleSelectSlide = (idx) => {
    const clamped = Math.max(0, Math.min(tvSlidesData.length - 1, idx));
    setTvSlide(clamped);
    setViewedSlides((prev) => {
      const next = new Set(prev);
      next.add(clamped);
      return next;
    });
  };

  const openTvGallery = (idx) => {
    const safeIdx = Math.max(0, Math.min(tvSlidesData.length - 1, idx));
    handleSelectSlide(safeIdx);
    const gallery = tvSlidesData.map((s) => ({
      src: s.img,
      title: s.title,
      caption: null,
      category: 'การอาบน้ำทารก (Nursery 202)',
      hideDetails: true,
    }));
    openLightbox({
      ...gallery[safeIdx],
      items: gallery,
      currentIndex: safeIdx,
      onIndexChange: (nextIdx) => handleSelectSlide(nextIdx),
    });
  };

  const handleCollectItem = (key) => {
    setCollectedItems((prev) => ({ ...prev, [key]: true }));
  };

  const handleCollectAllCabinetItems = () => {
    setCollectedItems((prev) => ({
      ...prev,
      towels: true,
      soap: true,
      sponge: true,
      clothes: true,
    }));
  };

  const step5Items = [
    { id: 1, label: '1. น้ำลูบหน้าทารก', img: '/images/rev/bath_step5_1_wipe_face.jpg' },
    { id: 2, label: '2. ยาสระผมทารก', img: '/images/rev/bath_step5_2_shampoo_bottle.jpg' },
    { id: 3, label: '3. สระผมทารก', img: '/images/rev/bath_step5_3_wash_hair.jpg' },
    { id: 4, label: '4. ล้างทำความสะอาดด้วยน้ำอ่างที่ 1', img: '/images/rev/bath_step5_4_rinse_hair.jpg' },
    { id: 5, label: '5. ซับผ้าให้แห้ง', img: '/images/rev/bath_step5_5_dry_hair.jpg' },
  ];

  const step8Items = [
    {
      id: 1,
      label: '1. “ใช้แขนหนึ่งข้างประคองศีรษะทารกให้อยู่ในอุ้งฝ่ามือ”',
      img: '/images/rev/bath_step8_1_support_head.jpg',
    },
    {
      id: 2,
      label: '2. “อาบน้ำด้านหน้า”',
      img: '/images/rev/bath_step8_2_wash_front.jpg',
    },
    {
      id: 3,
      label: '3. “อาบน้ำด้านหลัง”',
      img: '/images/rev/bath_step8_3_wash_back.jpg',
    },
  ];

  return (
    <group>
      {/* ── Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        width={13}
        depth={13}
        height={5.2}
        doorZ={3.8}
        roomTitle="ห้องที่ 2: การอาบน้ำและการดูแลความสะอาดทารก การเปลี่ยนผ้าอ้อม"
        roomNumber="Nursery 202"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP-RIGHT TRANSLUCENT MISSION HUD (Collapsible per client request)
          ══════════════════════════════════════════════════════════════════════════ */}
      <ScreenPortal>
        <div
          className="fixed left-2.5 right-2.5 sm:left-auto sm:right-4 z-30 pointer-events-auto sm:max-w-xs sm:w-80 max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)-5.5rem)] overflow-y-auto bg-white/88 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-xl border border-teal-200/90 text-slate-800"
          style={{ top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 4.25rem)' }}
        >
          <div className={`flex items-center justify-between gap-1.5 ${missionCollapsed ? '' : 'border-b border-teal-200/70 pb-1.5 mb-2'}`}>
            <button
              type="button"
              onClick={() => setMissionCollapsed((v) => !v)}
              className="text-xs font-extrabold text-teal-900 tracking-wide flex items-center gap-1 text-left cursor-pointer"
              title={missionCollapsed ? 'คลิกเพื่อเปิดเนื้อหาภารกิจ' : 'คลิกเพื่อพับเก็บเนื้อหาภารกิจ'}
            >
              <span>📋 ภารกิจ (Nursery 202)</span>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModal('bathingWizard')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white hover:bg-teal-500 shadow cursor-pointer"
              >
                คู่มือ 14 ขั้น ▶
              </button>
              <button
                type="button"
                onClick={() => setMissionCollapsed((v) => !v)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-900 border border-teal-300 transition cursor-pointer"
                title={missionCollapsed ? 'เปิดดูรายการภารกิจ' : 'พับเก็บรายการภารกิจ'}
              >
                {missionCollapsed ? '▼ เปิด' : '▲ พับ'}
              </button>
            </div>
          </div>

          {!missionCollapsed && (
            <div className="space-y-1.5 text-xs">
              {/* Mission 1 */}
              <div
                onClick={() => openTvGallery(tvSlide)}
                className={`cursor-pointer p-2 rounded-xl border flex items-center gap-2 transition ${
                  isMission1Done ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-white/90 border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  isMission1Done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-400 text-transparent'
                }`}>
                  ✓
                </div>
                <div className="flex-1 font-semibold leading-tight">
                  1. ให้ผู้เล่นเรียนรู้ผ่าน TV ให้ความรู้ ({viewedSlides.size}/8)
                </div>
              </div>

              {/* Mission 2 */}
              <div
                onClick={() => setActiveModal('cabinet')}
                className={`cursor-pointer p-2 rounded-xl border flex items-center gap-2 transition ${
                  isMission2Done ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-white/90 border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  isMission2Done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-400 text-transparent'
                }`}>
                  ✓
                </div>
                <div className="flex-1 font-semibold leading-tight">
                  2. ให้ผู้เล่นเตรียมอุปกรณ์อาบน้ำและผ้าอ้อม ({collectedCount}/6)
                </div>
              </div>

              {/* Mission 3 */}
              <div
                onClick={() => setActiveModal('bathingWizard')}
                className={`cursor-pointer p-2 rounded-xl border flex items-center gap-2 transition ${
                  isMission3Done ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-white/90 border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  isMission3Done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-400 text-transparent'
                }`}>
                  ✓
                </div>
                <div className="flex-1 font-semibold leading-tight">
                  3. ให้ผู้เล่นอาบน้ำทารกให้เสร็จตามขั้นตอน (ขั้นที่ {wizardStep}/14)
                </div>
              </div>
            </div>
          )}
        </div>
      </ScreenPortal>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. NORTH WALL (FLUSH AGAINST WALL z = -6.42):
             - Wall Poster 1 (/images/rev/bath_equip_poster.jpg — 37–38 °C)
             - Wall Poster 2 (ขั้นตอนการอาบน้ำ)
             - Sittable Sofa (InteractiveSeat — sittable alone OR holding baby)
             - Baby Crib
             - Top-Right Mission Desk (โต๊ะกับกระดาษ เขียนว่า ภารกิจ — ไม่มีเก้าอี้)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Wall Poster 1 — 100% 3D WebGL Mesh Flush against North Wall z = -6.28 (ไม่จมผนัง -6.30 และไม่ลอยทับหัวตัวละคร) */}
      <FramedImagePoster3D
        position={[-1.1, 2.75, -6.28]}
        width={2.10}
        height={1.36}
        contain={true}
        backlit={false}
        src="/images/rev/bath_equip_poster.jpg"
        frameColor="#0f766e"
        accentColor="#14b8a6"
        onClick={() => openWallPoster(0)}
      />

      {/* Wall Poster 2 — 100% 3D WebGL Mesh Flush against North Wall z = -6.28 */}
      <FramedImagePoster3D
        position={[1.8, 2.75, -6.28]}
        width={2.10}
        height={1.36}
        contain={true}
        backlit={false}
        src="/references/room2/img_007.png"
        frameColor="#0d9488"
        accentColor="#14b8a6"
        onClick={() => openWallPoster(1)}
      />

      {/* ── Sittable Mother's Sofa facing TV (Sittable both alone and while holding baby) ── */}
      <InteractiveSeat
        id="nb2-mother-sofa"
        name="โซฟาพักผ่อนชม TV ให้ความรู้"
        type="sofa"
        position={[-3.3, 0, -2.8]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
      >
        <group>
          <mesh position={[0, 0.24, -0.04]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.36, 0.74]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.82, -0.38]} castShadow>
            <boxGeometry args={[1.22, 0.88, 0.24]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
          {[-0.58, 0.58].map((x, i) => (
            <mesh key={`arm_${i}`} position={[x, 0.48, -0.04]} castShadow>
              <boxGeometry args={[0.20, 0.38, 0.76]} />
              <meshStandardMaterial color="#fde68a" roughness={0.85} />
            </mesh>
          ))}
          <Pillows position={[-0.38, 0.46, -0.18]} scale={0.50} />
        </group>
      </InteractiveSeat>

      {/* ── Baby Crib at North Wall (Click to pick up or place baby; NO permanent floating badge) ── */}
      <group
        position={[1.1, 0, -4.8]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('crib');
        }}
      >
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.95]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.52, 0]} receiveShadow>
          <boxGeometry args={[1.42, 0.12, 0.88]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.7} />
        </mesh>
        {[-0.72, 0.72].map((x, i) => (
          <mesh key={`rail_end_${i}`} position={[x, 0.78, 0]} castShadow>
            <boxGeometry args={[0.04, 0.65, 0.95]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {[-0.45, 0.45].map((z, i) => (
          <mesh key={`rail_side_${i}`} position={[0, 0.78, z]} castShadow>
            <boxGeometry args={[1.5, 0.65, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {[[-0.72, -0.45], [0.72, -0.45], [-0.72, 0.45], [0.72, 0.45]].map(([x, z], i) => (
          <mesh key={`leg_${i}`} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}

        {/* 3D Baby inside Crib when babyLocation === 'crib' and not held */}
        {babyLocation === 'crib' && !isHoldingBaby && (
          <group position={[0, 0.59, 0]}>
            <BabyAvatar
              pose="swaddle"
              position={[0, 0, 0]}
              scale={0.95}
              blanketColor="#e0f2fe"
            />
          </group>
        )}
      </group>

      {/* ── Top-Right Mission Desk (โต๊ะภารกิจไม่มีเก้าอี้ เป็นโต๊ะกับกระดาษ เขียนว่า "ภารกิจ") ── */}
      <group
        position={[4.6, 0, -4.8]}
        rotation={[0, -0.35, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('missionDesk');
        }}
      >
        {/* Wooden Mission Table Top (No Chair) */}
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.06, 0.78]} />
          <meshStandardMaterial color="#d4a373" roughness={0.35} />
        </mesh>
        {[[-0.55, -0.32], [0.55, -0.32], [-0.55, 0.32], [0.55, 0.32]].map(([x, z], i) => (
          <mesh key={`md_leg_${i}`} position={[x, 0.38, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.76, 16]} />
            <meshStandardMaterial color="#8c6239" roughness={0.4} />
          </mesh>
        ))}
        {/* White Paper Sheet on Table with "ภารกิจ" written on it */}
        <mesh
          position={[0, 0.8, 0]}
          receiveShadow
          onClick={(e) => {
            if (e.delta > 10) return;
            e.stopPropagation();
            setActiveModal('missionDesk');
          }}
        >
          <boxGeometry args={[0.52, 0.02, 0.38]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* แผ่นกระดาษภารกิจ 3D CanvasTexture บนโต๊ะ (ไม่ใช้ <Html transform> จึงไม่ลอยทับตัวละคร) */}
        <mesh
          position={[0, 0.812, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => {
            if (e.delta > 10) return;
            e.stopPropagation();
            setActiveModal('missionDesk');
          }}
        >
          <planeGeometry args={[0.48, 0.34]} />
          <meshBasicMaterial map={missionPaperTex} toneMapped={false} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. WEST WALL (LEFT):
             - Air Conditioner above TV ("เพิ่มแอร์")
             - Wall-mounted TV Screen
             - AC Switch Button next to TV ("ตรงเลข 6 ปุ่มปิด/เปิดแอร์ เอากรอบเขียวออก")
             - 2-Section Nursery Cabinet ("ชุดอุปกรณ์ของใช้และของตกแต่งทารก")
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Air Conditioner Unit above TV (Flush against West inner wall x = -6.30) */}
      <group
        position={[-6.13, 4.15, -2.8]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('acSwitch');
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.42, 0.34]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Vent Louver */}
        <mesh position={[0, -0.14, 0.17]}>
          <boxGeometry args={[1.95, 0.06, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* Status LED on AC (Blue when ON, Red/Off when OFF) */}
        <mesh position={[0.82, 0.04, 0.175]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color={isAcOn ? '#38bdf8' : '#ef4444'} />
        </mesh>
      </group>

      {/* Wall Switch for Air Conditioner next to TV (Location #6, flush on West inner wall x = -6.28) */}
      <group
        position={[-6.28, 1.55, -0.85]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('acSwitch');
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.32, 0.03]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.03, 0.02]}>
          <boxGeometry args={[0.16, 0.1, 0.015]} />
          <meshStandardMaterial color={isAcOn ? '#0284c7' : '#64748b'} />
        </mesh>
        <mesh position={[0, -0.07, 0.02]}>
          <boxGeometry args={[0.1, 0.06, 0.015]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      </group>

      {/* Wall-Mounted 100% 3D WebGL Smart TV Screen (Flush against West inner wall x = -6.27, ไม่จมกำแพง -6.30) */}
      <InteractiveSmartTv3D
        position={[-6.27, 2.65, -2.8]}
        rotation={[0, Math.PI / 2, 0]}
        width={3.2}
        height={1.9}
        headerTitle={`📺 สื่อให้ความรู้การอาบน้ำทารก (${tvSlide + 1}/8)`}
        accentColor="#14b8a6"
        slide={tvSlidesData[tvSlide]}
        slideIndex={tvSlide}
        totalSlides={tvSlidesData.length}
        whiteSlideBg={true}
        footerText={`เรียนรู้แล้ว: ${viewedSlides.size}/8 หน้า${viewedSlides.size >= 8 ? ' ✓' : ''}`}
        zoomLabel="🔍 ขยายภาพ"
        secondaryLabel="📖 ดูเต็มจอ"
        secondaryColor="#0d9488"
        onOpenFullscreen={() => openTvGallery(tvSlide)}
        onSecondaryAction={() => setShowTvModal(true)}
        onPrev={() => handleSelectSlide(tvSlide - 1)}
        onNext={() => handleSelectSlide(tvSlide + 1)}
      />

      {/* ── 2 Small Trash Bins (Green / Red) on West Wall where old cabinet was removed (pdf4_bath_p1.png ①) ── */}
      <group
        position={[-6.08, 0, 0.85]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('trash');
        }}
      >
        {/* Green General Waste Bin */}
        <group position={[-0.28, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.15, 0.56, 24]} />
            <meshStandardMaterial color="#16a34a" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.57, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.04, 24]} />
            <meshStandardMaterial color="#15803d" roughness={0.3} />
          </mesh>
        </group>

        {/* Red Infectious / Soiled Diaper Waste Bin */}
        <group position={[0.28, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.15, 0.56, 24]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.57, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.04, 24]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CENTER AREA:
             - Expanded Wooden Bathing Table with 2 Tubs (Blue & Pink) + Padded Towel Mat
             - All staged accessories strictly inside wooden tabletop (no overhang)
             - 3D Baby positioned dynamically in Tub 1, Tub 2, or on Mat!
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[0.2, 0, -0.4]}>
        <BabyBathtub
          preparedItems={collectedItems}
          onTubClick={() => setActiveModal('bathingWizard')}
          onMatClick={() => setActiveModal('bathingWizard')}
        />

        {/* Water thermometer resting flat beside the soap/shampoo tray well inside tabletop bounds */}
        <BathThermometer position={[-0.65, 0.88, -0.35]} rotation={[Math.PI / 2, 0, 0.25]} />

        {/* 3D Baby inside Blue Tub #1 (Step 7–9) */}
        {babyLocation === 'tub1' && (
          <group position={[-1.18, 1.05, 0]}>
            <BabyAvatar pose={babyPose} position={[0, 0, 0]} scale={0.9} />
          </group>
        )}

        {/* 3D Baby inside Pink Tub #2 (Step 10) */}
        {babyLocation === 'tub2' && (
          <group position={[-0.12, 1.05, 0]}>
            <BabyAvatar pose={babyPose} position={[0, 0, 0]} scale={0.9} />
          </group>
        )}

        {/* 3D Baby on Padded Towel Mat beside Tubs (Step 6, 11–14) */}
        {babyLocation === 'mat' && (
          <group position={[0.82, 0.93, 0]}>
            <BabyAvatar pose={babyPose} position={[0, 0, 0]} scale={0.92} />
          </group>
        )}
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. SOUTH WALL & SOUTH-EAST CORNER NURSERY SET (Per pdf4_bath_p3.png ภาพที่ 3 & 4):
             - Unit ① (East Wall, x = 6.16): ชั้นตกแต่งสวยงามสำหรับทารก (White Decor Shelving)
             - Unit ② (South Wall, z = 6.16): ตู้ของใช้ทารก 1..5 (Warm Oak Baby Supplies Cabinet)
             - Realistic Handwashing Sink (South Wall)
             - Adjacent Small Table with Cotton ball pack / Warm water / 0.9% NSS bottle
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* ── UNIT ① (EAST WALL, South-East Corner): ชั้นตกแต่งสวยงามสำหรับทารก (ไม่จมผนัง +6.30) ── */}
      <group
        position={[6.08, 0, 4.65]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('cabinet');
        }}
      >
        {/* White/Cream Decorative Open Bookcase Frame */}
        <mesh position={[0, 1.08, -0.20]} castShadow receiveShadow>
          <boxGeometry args={[2.06, 2.16, 0.04]} />
          <meshStandardMaterial color="#f8f5f0" roughness={0.55} />
        </mesh>
        {[-1.01, 1.01].map((sx, i) => (
          <mesh key={`dec_side_${i}`} position={[sx, 1.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 2.16, 0.44]} />
            <meshStandardMaterial color="#efe9df" roughness={0.5} />
          </mesh>
        ))}
        {[0.04, 0.72, 1.40, 2.14].map((sy, i) => (
          <mesh key={`dec_shelf_${i}`} position={[0, sy, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.06, 0.04, 0.44]} />
            <meshStandardMaterial color="#ffffff" roughness={0.45} />
          </mesh>
        ))}

        {/* Top Shelf (y = 1.42): Cute Plush Teddy Bear + 2 Baby Footprint Frames + Pastel Mobile Stand */}
        <group position={[-0.62, 1.42, 0.04]}>
          {/* Teddy Body & Head */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <sphereGeometry args={[0.13, 18, 18]} />
            <meshStandardMaterial color="#c08552" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.32, 0.01]} castShadow>
            <sphereGeometry args={[0.105, 18, 18]} />
            <meshStandardMaterial color="#c08552" roughness={0.88} />
          </mesh>
          {/* Ears & Cream Snout */}
          {[-0.075, 0.075].map((ex, i) => (
            <mesh key={`tb1_ear_${i}`} position={[ex, 0.40, 0]} castShadow>
              <sphereGeometry args={[0.036, 12, 12]} />
              <meshStandardMaterial color="#9c6644" roughness={0.88} />
            </mesh>
          ))}
          <mesh position={[0, 0.30, 0.095]}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshStandardMaterial color="#faedcd" roughness={0.8} />
          </mesh>
          {/* Teddy Seated Legs */}
          {[-0.08, 0.08].map((lx, i) => (
            <mesh key={`tb1_leg_${i}`} position={[lx, 0.06, 0.10]} castShadow>
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshStandardMaterial color="#b07d4b" roughness={0.88} />
            </mesh>
          ))}
        </group>
        {/* 2 Pastel Footprint Picture Frames */}
        {[-0.12, 0.24].map((fx, i) => (
          <group key={`fp_frame_${i}`} position={[fx, 1.58, -0.04]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.30, 0.03]} />
              <meshStandardMaterial color="#e6ccb2" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.017]}>
              <planeGeometry args={[0.21, 0.25]} />
              <meshStandardMaterial color={i === 0 ? '#e0f2fe' : '#fce7f3'} roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Pastel Star/Cloud Nursery Stand */}
        <group position={[0.66, 1.42, 0.02]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.11, 0.03, 18]} />
            <meshStandardMaterial color="#fde68a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 10]} />
            <meshStandardMaterial color="#d4a373" />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.7} />
          </mesh>
        </group>

        {/* Middle Shelf (y = 0.74): Footprint Frame + Pastel Toy Blocks + Second Plush Bear */}
        <group position={[-0.64, 0.90, -0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.30, 0.03]} />
            <meshStandardMaterial color="#ddb892" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[0.22, 0.24]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.7} />
          </mesh>
        </group>
        {[-0.18, -0.04, 0.10].map((bx, i) => (
          <mesh key={`blk_${i}`} position={[bx, 0.80, 0.05]} castShadow>
            <boxGeometry args={[0.10, 0.10, 0.10]} />
            <meshStandardMaterial
              color={i === 0 ? '#fbcfe8' : i === 1 ? '#a7f3d0' : '#bae6fd'}
              roughness={0.65}
            />
          </mesh>
        ))}
        <mesh position={[-0.11, 0.90, 0.05]} castShadow>
          <boxGeometry args={[0.10, 0.10, 0.10]} />
          <meshStandardMaterial color="#fde68a" roughness={0.65} />
        </mesh>
        {/* Rose-Beige Plush Bear on Right of Middle Shelf */}
        <group position={[0.58, 0.74, 0.04]}>
          <mesh position={[0, 0.13, 0]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.29, 0.01]} castShadow>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.88} />
          </mesh>
          {[-0.07, 0.07].map((ex, i) => (
            <mesh key={`tb2_ear_${i}`} position={[ex, 0.36, 0]} castShadow>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color="#b08968" roughness={0.88} />
            </mesh>
          ))}
        </group>

        {/* Bottom Shelf (y = 0.06): Pastel Yarn Balls + Soft Woven Nursery Basket */}
        {[
          [-0.68, 0.16, '#fbcfe8'],
          [-0.48, 0.16, '#a7f3d0'],
          [-0.28, 0.16, '#fef08a'],
          [-0.58, 0.30, '#bae6fd'],
          [-0.38, 0.30, '#f5ebe0'],
        ].map(([yx, yy, col], idx) => (
          <mesh key={`dec_yarn_${idx}`} position={[yx, yy, 0.05]} castShadow>
            <sphereGeometry args={[0.088, 16, 16]} />
            <meshStandardMaterial color={col} roughness={0.85} />
          </mesh>
        ))}
        <mesh position={[0.42, 0.24, 0.03]} castShadow>
          <boxGeometry args={[0.78, 0.34, 0.32]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.75} />
        </mesh>
      </group>

      {/* ── UNIT ② (SOUTH WALL, South-East Corner): ตู้ของใช้ทารก 1..5 (ไม่จมผนัง +6.30) ── */}
      <group
        position={[4.95, 0, 6.06]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('cabinet');
        }}
      >
        {/* Warm Honey-Oak Outer Cabinet Frame */}
        <mesh position={[0, 1.09, -0.21]} castShadow receiveShadow>
          <boxGeometry args={[1.86, 2.18, 0.04]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.5} />
        </mesh>
        {[-0.91, 0.91].map((sx, i) => (
          <mesh key={`cab_side_${i}`} position={[sx, 1.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.045, 2.18, 0.46]} />
            <meshStandardMaterial color="#c89662" roughness={0.42} />
          </mesh>
        ))}
        {[0.04, 0.72, 1.40, 2.16].map((sy, i) => (
          <mesh key={`cab_shelf_${i}`} position={[0, sy, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.86, 0.045, 0.46]} />
            <meshStandardMaterial color="#c89662" roughness={0.42} />
          </mesh>
        ))}

        {/* Top Shelf (y = 1.42): 5. ผ้าห่อทารก (Folded Swaddle Wraps) + 2. สบู่อ่อน–ยาสระผมเด็ก (Pump Bottles) */}
        {[0.05, 0.14, 0.23].map((wy, i) => (
          <mesh key={`swaddle_pack_${i}`} position={[-0.44, 1.42 + wy, 0.04]} castShadow>
            <boxGeometry args={[0.58, 0.075, 0.30]} />
            <meshStandardMaterial
              color={i === 0 ? '#fef9c3' : i === 1 ? '#ffffff' : '#e0f2fe'}
              roughness={0.82}
            />
          </mesh>
        ))}
        {[
          [0.12, '#a7f3d0', 0.26],
          [0.32, '#fbcfe8', 0.28],
          [0.52, '#bae6fd', 0.26],
          [0.70, '#fef08a', 0.20],
        ].map(([bx, bcol, bh], i) => (
          <group key={`soap_btl_${i}`} position={[bx, 1.42, 0.05]}>
            <mesh position={[0, bh / 2, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.06, bh, 18]} />
              <meshStandardMaterial color={bcol} roughness={0.3} />
            </mesh>
            <mesh position={[0, bh + 0.025, 0]}>
              <cylinderGeometry args={[0.018, 0.022, 0.05, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Middle Shelf (y = 0.74): 1. ผ้าอ้อมทารก (Teal Diaper Pack) + 3. เสื้อผ้าทารก + 4. ผ้าขนหนู */}
        {/* 1. ผ้าอ้อมทารก (Pampers-style Pack) */}
        <group position={[-0.54, 0.94, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.46, 0.34, 0.28]} />
            <meshStandardMaterial color="#0d9488" roughness={0.38} />
          </mesh>
          <mesh position={[0, 0, 0.142]}>
            <planeGeometry args={[0.36, 0.22]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
        {/* 3. เสื้อผ้าทารก (Folded Pastel Baby Clothes Stack) */}
        {[0.05, 0.13, 0.21].map((cy, i) => (
          <mesh key={`clothes_st_${i}`} position={[0.02, 0.74 + cy, 0.04]} castShadow>
            <boxGeometry args={[0.42, 0.065, 0.28]} />
            <meshStandardMaterial
              color={i === 0 ? '#fce7f3' : i === 1 ? '#ffffff' : '#bae6fd'}
              roughness={0.82}
            />
          </mesh>
        ))}
        {/* 4. ผ้าขนหนู (Soft Folded Pastel Bath Towels) */}
        {[0.06, 0.15, 0.24].map((ty, i) => (
          <mesh key={`towel_st_${i}`} position={[0.54, 0.74 + ty, 0.04]} castShadow>
            <boxGeometry args={[0.44, 0.075, 0.30]} />
            <meshStandardMaterial
              color={i === 0 ? '#d9f99d' : i === 1 ? '#ffffff' : '#fbcfe8'}
              roughness={0.88}
            />
          </mesh>
        ))}

        {/* Bottom Shelf (y = 0.06): 3 Warm Rattan Woven Storage Baskets */}
        {[-0.56, 0, 0.56].map((kx, i) => (
          <mesh key={`rattan_bsk_${i}`} position={[kx, 0.25, 0.03]} castShadow>
            <boxGeometry args={[0.50, 0.34, 0.34]} />
            <meshStandardMaterial color="#b07d4b" roughness={0.78} />
          </mesh>
        ))}
      </group>

      {/* Realistic Handwashing Sink Counter (South Wall, X: -3.6, Z: 5.5) */}
      <group
        position={[-3.6, 0, 5.5]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('sink');
        }}
      >
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.84, 0.68]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.86, 0]} castShadow>
          <boxGeometry args={[1.3, 0.05, 0.72]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} />
        </mesh>
        {/* Porcelain Wash Basin */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.26, 0.1, 28]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.12} />
        </mesh>
        {/* Chrome Faucet */}
        <mesh position={[0, 1.02, -0.2]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.26, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.13, -0.12]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Liquid Hand Soap Dispenser */}
        <mesh position={[0.42, 0.95, -0.14]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.15, 16]} />
          <meshStandardMaterial color="#2dd4bf" roughness={0.2} />
        </mesh>
      </group>

      {/* Small Table beside Sink with Cotton Ball Pack, Warm Boiled Water & 0.9% NSS Bottle */}
      <group
        position={[-1.95, 0, 5.5]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal('cottonTable');
        }}
      >
        {/* Table Top & Legs */}
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.06, 0.65]} />
          <meshStandardMaterial color="#d4a373" roughness={0.35} />
        </mesh>
        {[[-0.5, -0.26], [0.5, -0.26], [-0.5, 0.26], [0.5, 0.26]].map(([x, z], i) => (
          <mesh key={`ct_leg_${i}`} position={[x, 0.38, z]} castShadow>
            <cylinderGeometry args={[0.028, 0.024, 0.76, 16]} />
            <meshStandardMaterial color="#8c6239" roughness={0.4} />
          </mesh>
        ))}

        {/* 1. สำลีซอง (Sterile Cotton Ball Pack) */}
        <mesh position={[-0.32, 0.88, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[-0.32, 0.88, 0.082]}>
          <planeGeometry args={[0.18, 0.1]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>

        {/* 2. ขวดน้ำต้มสุกอุ่น (Warm Boiled Water Flask) */}
        <mesh position={[0, 0.91, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.08, 0.24, 20]} />
          <meshStandardMaterial color="#fef08a" roughness={0.25} />
        </mesh>

        {/* 3. ขวดน้ำเกลือ 0.9% NSS (Normal Saline Bottle with Green Cap) */}
        <group position={[0.3, 0.91, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.24, 20]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.03, 0.035, 0.05, 16]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. EAST & SOUTH WALLS (FLUSH AGAINST INNER WALL ±6.26):
             - Clear Architectural Glass Outdoor View Windows with Curtains
             - Wall Poster 3 (การเช็ดตา & ซับตัว) flush against East Wall
          ══════════════════════════════════════════════════════════════════════════ */}
      <WindowWithCurtains
        position={[6.26, 2.7, 0.55]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.7}
        height={2.25}
      />
      <WindowWithCurtains
        position={[1.35, 2.7, 6.26]}
        rotation={[0, Math.PI, 0]}
        width={3.3}
        height={2.3}
      />

      {/* Wall Poster 3 — 100% 3D WebGL Mesh Flush against East inner wall x = 6.28 (ไม่จมผนัง 6.30) */}
      <FramedImagePoster3D
        position={[6.28, 2.75, -2.6]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.02}
        height={1.32}
        contain={true}
        backlit={false}
        src="/references/room2/img_008.jpeg"
        frameColor="#0f766e"
        accentColor="#14b8a6"
        onClick={() => openWallPoster(2)}
      />

      {/* 3D Player Controller */}
      <PlayerController initialPosition={[-4.2, 0, 3.2]} initialRotation={Math.PI} />

      {/* ══════════════════════════════════════════════════════════════════════════
          2D HTML INTERACTIVE OVERLAYS & MODALS (Only Shown When Clicked)
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* A. AC Wall Switch Modal (Step 1) */}
      {activeModal === 'acSwitch' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-sky-400 text-slate-800 text-center">
              <div className="text-4xl mb-2">❄️</div>
              <h3 className="text-lg font-bold text-sky-950">สวิตช์ควบคุมเครื่องปรับอากาศ (แอร์)</h3>
              <div className={`mt-3 p-3 rounded-xl font-bold text-sm border-2 ${
                isAcOn ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-emerald-50 border-emerald-400 text-emerald-900'
              }`}>
                สถานะแอร์: {isAcOn ? 'ขณะนี้กำลังเปิดอยู่ ❄️' : 'ขณะนี้กำลังปิดอยู่ ✓ (เหมาะสมสำหรับอาบน้ำทารก)'}
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                1.1 การเตรียมสภาพแวดล้อม: ต้องปิดแอร์ก่อนอาบน้ำทารกทุกครั้ง เพื่อป้องกันทารกสูญเสียความร้อน (Hypothermia)
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setIsAcOn(!isAcOn);
                    if (isAcOn && wizardStep === 1) {
                      setWizardStep(2);
                    }
                  }}
                  className={`flex-1 py-2.5 font-bold rounded-xl text-white text-xs shadow ${
                    isAcOn ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  {isAcOn ? '🔴 กดเพื่อปิดแอร์' : '🔵 กดเพื่อเปิดแอร์'}
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* B. Handwashing Sink Modal (Step 2) */}
      {activeModal === 'sink' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-teal-400 text-slate-800 text-center">
              <div className="text-4xl mb-2">🚰</div>
              <h3 className="text-lg font-bold text-teal-950">อ่างล้างมือทำความสะอาด</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                1.2 ล้างมือให้สะอาดก่อนเตรียมอุปกรณ์และอาบน้ำทารก
              </p>
              {hasWashedHands && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800">
                  ✓ ล้างมือเรียบร้อยแล้ว
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setHasWashedHands(true);
                    if (wizardStep <= 2) setWizardStep(3);
                  }}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow"
                >
                  🧼 กดล้างมือ
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* C. Cotton Ball / Warm Water / 0.9% NSS Table Modal */}
      {activeModal === 'cottonTable' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-amber-400 text-slate-800">
              <div className="flex items-center justify-between border-b pb-2.5">
                <h3 className="text-base font-bold text-amber-950">
                  ⚪ โต๊ะเตรียมสำลี น้ำต้มสุกอุ่น และน้ำเกลือ 0.9% NSS
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                3.5 สำลีก้อนใส่น้ำต้มสุกหรือน้ำเกลือ (0.9% NSS) บิดหมาด 2 ก้อน ใส่ในถ้วยเล็กสำหรับเช็ดตาทารก
              </p>
              <button
                onClick={() => {
                  handleCollectItem('cottonBalls');
                  setActiveModal(null);
                }}
                className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
              >
                {collectedItems.cottonBalls
                  ? '✓ เตรียมสำลีชุบน้ำต้มสุก/0.9% NSS บนโต๊ะอาบน้ำแล้ว'
                  : '+ เตรียมสำลีก้อนชุบน้ำต้มสุก/0.9% NSS (2 ก้อน) ไปวางที่โต๊ะอาบน้ำ'}
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* D. 2-Section Nursery Cabinet Modal ("ชุดอุปกรณ์ของใช้และของตกแต่งทารก") */}
      {activeModal === 'cabinet' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-400 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto text-slate-800">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div>
                  <h2 className="text-lg font-bold text-amber-900">
                    📦 ชุดอุปกรณ์ของใช้และของตกแต่งทารก ({collectedCount}/6)
                  </h2>
                  <p className="text-xs text-slate-500">คลิกที่ของใช้ทารกฝั่งขวาเพื่อนำจัดเตรียมบนโต๊ะอาบน้ำ</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <img
                src="/images/rev/bath_cabinet_ref.jpg"
                alt="ตู้ของใช้ทารก"
                className="w-full h-44 object-contain bg-amber-50 rounded-xl p-1.5 mt-3 border border-amber-200"
              />

              <div className="mt-3 space-y-2 text-xs">
                {[
                  {
                    key: 'tubs',
                    label: '3.1 อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น อุณหภูมิ 37–38 °C)',
                    sub: 'ตั้งเตรียมไว้บนโต๊ะอาบน้ำเรียบร้อยแล้ว',
                  },
                  {
                    key: 'towels',
                    label: '3.2 ผ้าขนหนูสำหรับเช็ด 1 ผืน และผ้าห่อตัวทารก 1 ผืน (หมายเลข 4 & 5 ในตู้)',
                    sub: 'ใช้สำหรับปูรองเช็ดตัวทารกให้แห้งและห่อตัวทารกให้อบอุ่น',
                  },
                  {
                    key: 'soap',
                    label: '3.3 สบู่เหลว–ยาสระผม สูตรอ่อนโยนสำหรับเด็กทารก (หมายเลข 2 ในตู้)',
                    sub: 'สูตรอ่อนโยนต่อผิวและดวงตาทารกแรกเกิด',
                  },
                  {
                    key: 'sponge',
                    label: '3.4 ผ้าผืนเล็กหรือฟองน้ำสำหรับอาบน้ำ',
                    sub: 'สำหรับฟอกทำความสะอาดผิวกายและข้อพับ',
                  },
                  {
                    key: 'cottonBalls',
                    label: '3.5 สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ (0.9% NSS) บิดหมาด 2 ก้อน ใส่ถ้วยเล็ก',
                    sub: 'สำหรับเช็ดทำความสะอาดดวงตาทารกทั้ง 2 ข้าง',
                  },
                  {
                    key: 'clothes',
                    label: '3.6 เสื้อผ้าและผ้าอ้อมทารก (หมายเลข 1 & 3 ในตู้)',
                    sub: 'ผ้าอ้อมทารกและชุดเสื้อผ้าสะอาดสำหรับสวมใส่หลังอาบน้ำ',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => handleCollectItem(item.key)}
                    className={`cursor-pointer p-2.5 rounded-xl border-2 flex items-center justify-between transition ${
                      collectedItems[item.key]
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-600">{item.sub}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ml-2 ${
                        collectedItems[item.key] ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {collectedItems[item.key] ? '✓ เตรียมแล้ว' : '+ หยิบเตรียม'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    handleCollectAllCabinetItems();
                    handleCollectItem('cottonBalls');
                    if (wizardStep <= 3) setWizardStep(4);
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
                >
                  ✓ หยิบเตรียมอุปกรณ์ครบทั้ง 6 ชนิดทันที
                </button>
                <button
                  onClick={() => setActiveModal('bathingWizard')}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow"
                >
                  ไปที่ขั้นตอนการอาบน้ำทารก ▶
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* E. Trash Bins Modal */}
      {activeModal === 'trash' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-5 shadow-2xl border-4 border-emerald-500 text-slate-800 text-center">
              <div className="text-3xl mb-1">🗑️</div>
              <h3 className="text-base font-bold text-slate-900">ถังขยะแยกประเภท 2 ใบ (สีเขียว / สีแดง)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                • <strong>ถังสีเขียว:</strong> ขยะทั่วไป<br />
                • <strong>ถังสีแดง:</strong> ขยะติดเชื้อ (เช่น สำลีเช็ดตา/สะดือ และผ้าอ้อมที่ใช้แล้ว)
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-2 bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* F. Baby Crib Modal */}
      {activeModal === 'crib' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-5 shadow-2xl border-4 border-sky-400 text-slate-800 text-center">
              <div className="text-3xl mb-1">👶</div>
              <h3 className="text-base font-bold text-sky-950">เตียงทารก (Baby Crib)</h3>
              <p className="text-xs text-slate-600 mt-1.5">
                สามารถอุ้มทารกไปนั่งที่โซฟา หรืออุ้มทารกไปอาบน้ำตามขั้นตอนที่โต๊ะอาบน้ำ
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    const nextHold = !isHoldingBaby;
                    setHoldingBaby(nextHold);
                    setBabyLocation(nextHold ? 'arms' : 'crib');
                    setActiveModal(null);
                  }}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
                >
                  {isHoldingBaby ? '👶 วางทารกลงในเตียง' : '🤱 อุ้มทารกขึ้นมาจากเตียง'}
                </button>
                <button
                  onClick={() => setActiveModal('bathingWizard')}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow"
                >
                  🛁 เปิดหน้าต่างปฏิบัติการอาบน้ำ 14 ขั้นตอน
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* G. Mission Desk Modal */}
      {activeModal === 'missionDesk' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-teal-600 text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-teal-950">📋 ใบภารกิจประจำห้องอาบน้ำและเปลี่ยนผ้าอ้อมทารก</h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <span className="font-bold">1. ให้ผู้เล่นเรียนรู้ผ่าน TV ให้ความรู้</span>
                  <span className="font-bold text-teal-800">{isMission1Done ? '☑ สำเร็จ' : `${viewedSlides.size}/8 หน้า`}</span>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <span className="font-bold">2. ให้ผู้เล่นเตรียมอุปกรณ์อาบน้ำและผ้าอ้อม</span>
                  <span className="font-bold text-teal-800">{isMission2Done ? '☑ สำเร็จ' : `${collectedCount}/6 ชิ้น`}</span>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <span className="font-bold">3. ให้ผู้เล่นอาบน้ำทารกให้เสร็จตามขั้นตอน</span>
                  <span className="font-bold text-teal-800">{isMission3Done ? '☑ สำเร็จ' : `ขั้นที่ ${wizardStep}/14`}</span>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  onClick={() => setActiveModal('bathingWizard')}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow"
                >
                  เริ่มปฏิบัติขั้นตอนการอาบน้ำทารก ▶
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          H. EXACT 14-STEP INTERACTIVE BATHING & DIAPER WALKTHROUGH MODAL
             (100% per "อธิบายเพิ่มเติมการให้ทารกอาบน้ำเปลี่ยนผ้าอ้อม.pdf" bath_extra_p1..9)
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeModal === 'bathingWizard' && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-teal-500 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto text-slate-800">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider">
                    Nursery 202 • ขั้นตอนที่ {wizardStep} จาก 14
                  </span>
                  <h2 className="text-lg font-bold text-teal-950">
                    🛁 ปฏิบัติการอาบน้ำและเปลี่ยนผ้าอ้อมทารกตามลำดับขั้นตอน
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Step Progress Bar (2 rows of 7 on phones for comfortable touch, 14 cols on sm+) */}
              <div className="mt-3 grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-1">
                {Array.from({ length: 14 }, (_, idx) => {
                  const sNum = idx + 1;
                  return (
                    <button
                      key={sNum}
                      onClick={() => setWizardStep(sNum)}
                      className={`h-7 sm:h-6 rounded-md text-[11px] sm:text-[10px] font-bold transition ${
                        wizardStep === sNum
                          ? 'bg-teal-600 text-white shadow'
                          : sNum < wizardStep
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {sNum}
                    </button>
                  );
                })}
              </div>

              {/* ── STEP 1: ปิดแอร์ (1.1 การเตรียมสภาพแวดล้อม) ── */}
              {wizardStep === 1 && (
                <div className="mt-4 p-4 rounded-xl bg-sky-50 border-2 border-sky-200 space-y-3">
                  <h3 className="font-bold text-base text-sky-950">
                    ขั้นที่ 1 (1.1): การเตรียมสภาพแวดล้อม — ปิดเครื่องปรับอากาศ (แอร์)
                  </h3>
                  <p className="text-xs text-slate-700">
                    กดที่สวิตช์แอร์ข้างทีวี (หมายเลข 6) เพื่อปิดแอร์ก่อนอาบน้ำทารก ป้องกันทารกสูญเสียความร้อน
                  </p>
                  <div className={`p-3 rounded-lg font-bold text-xs ${isAcOn ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                    สถานะแอร์: {isAcOn ? 'ขณะนี้กำลังเปิดอยู่ ❄️' : 'ขณะนี้กำลังปิดอยู่ ✓'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAcOn(false)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🔴 กดปุ่มปิดแอร์
                    </button>
                    <button
                      disabled={isAcOn}
                      onClick={() => setWizardStep(2)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 2: ล้างมือ) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: ล้างมือ (1.2 การล้างมือ) ── */}
              {wizardStep === 2 && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50 border-2 border-teal-200 space-y-3">
                  <h3 className="font-bold text-base text-teal-950">
                    ขั้นที่ 2 (1.2): ล้างมือที่อ่างล้างมือให้สะอาด
                  </h3>
                  <p className="text-xs text-slate-700">
                    กดปุ่ม &ldquo;ล้างมือ&rdquo; เพื่อทำความสะอาดมือก่อนเตรียมอุปกรณ์และสัมผัสทารก
                  </p>
                  {hasWashedHands && (
                    <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                      ✓ ล้างมือเรียบร้อยแล้ว
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHasWashedHands(true)}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🧼 ล้างมือ
                    </button>
                    <button
                      disabled={!hasWashedHands}
                      onClick={() => setWizardStep(3)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 3: เตรียมอุปกรณ์ 6 ชนิด) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: เตรียมอุปกรณ์อาบน้ำ 6 ชนิด (0/6 -> 6/6) ── */}
              {wizardStep === 3 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-amber-950">
                      ขั้นที่ 3 (1.3): เตรียมอุปกรณ์อาบน้ำและผ้าอ้อมให้ครบ ({collectedCount}/6)
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {collectedCount}/6 ชิ้น
                    </span>
                  </div>
                  <img
                    src="/images/rev/bath_equip_poster.jpg"
                    alt="อุปกรณ์อาบน้ำ 6 ชนิด"
                    className="w-full h-40 object-contain bg-white rounded-lg p-1 border border-amber-200"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { k: 'tubs', t: '3.1 อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น 37–38 °C)' },
                      { k: 'towels', t: '3.2 ผ้าขนหนู 1 ผืน และผ้าห่อตัว 1 ผืน' },
                      { k: 'soap', t: '3.3 สบู่เหลว–ยาสระผมสูตรอ่อนโยน' },
                      { k: 'sponge', t: '3.4 ผ้าผืนเล็กหรือฟองน้ำอาบน้ำ' },
                      { k: 'cottonBalls', t: '3.5 สำลีก้อนชุบน้ำต้มสุก/0.9% NSS 2 ก้อนในถ้วยเล็ก' },
                      { k: 'clothes', t: '3.6 เสื้อผ้าและผ้าอ้อมทารก' },
                    ].map((it) => (
                      <button
                        key={it.k}
                        onClick={() => handleCollectItem(it.k)}
                        className={`p-2 rounded-lg border text-left font-semibold flex items-center justify-between ${
                          collectedItems[it.k]
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                            : 'bg-white border-slate-300 hover:border-amber-500'
                        }`}
                      >
                        <span className="truncate pr-1">{it.t}</span>
                        <span>{collectedItems[it.k] ? '✓' : '+'}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleCollectAllCabinetItems();
                        handleCollectItem('cottonBalls');
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
                    >
                      หยิบอุปกรณ์ครบทั้ง 6 ชิ้น
                    </button>
                    <button
                      disabled={collectedCount < 6}
                      onClick={() => setWizardStep(4)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 4: ตรวจสอบอุณหภูมิน้ำ) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: ตรวจสอบอุณหภูมิน้ำด้วยหลังมือ (37–38 °C) ── */}
              {wizardStep === 4 && (
                <div className="mt-4 p-4 rounded-xl bg-sky-50 border-2 border-sky-200 space-y-3">
                  <h3 className="font-bold text-base text-sky-950">
                    ขั้นที่ 4 (1.4): ตรวจสอบอุณหภูมิน้ำในอ่างอาบน้ำ
                  </h3>
                  <p className="text-xs text-slate-700">
                    กดปุ่มเพื่อทดสอบอุณหภูมิน้ำอุ่นด้วยหลังมือว่าได้อุณหภูมิที่เหมาะสม (37–38 °C)
                  </p>
                  {waterTempChecked && (
                    <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs">
                      🌡️ ผลการวัด: น้ำอุ่น อุณหภูมิ 37–38 °C (อุ่นกำลังดี ปลอดภัยต่อผิวทารก ✓)
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWaterTempChecked(true)}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🤚 ตรวจสอบอุณหภูมิน้ำด้วยหลังมือ
                    </button>
                    <button
                      disabled={!waterTempChecked}
                      onClick={() => setWizardStep(5)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 5: อุ้ม Football Hold สระผม) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 5: อุ้มท่า Football Hold สระผม (บังคับกดเรียงลำดับ 1–5) ── */}
              {wizardStep === 5 && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50 border-2 border-teal-200 space-y-3">
                  <h3 className="font-bold text-base text-teal-950">
                    ขั้นที่ 5 (1.5): ห่อตัวทารก อุ้มท่า Football hold position และสระผมตามลำดับ 1–5
                  </h3>
                  <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold">
                    ⚠️ เตือนความจำ: &ldquo;อย่าลืมใช้นิ้วมือพับหูทารกทั้ง 2 ข้างเพื่อระวังน้ำเข้าหู&rdquo;
                  </div>

                  {!babySwaddledForHair ? (
                    <button
                      onClick={() => {
                        setBabySwaddledForHair(true);
                        setHoldingBaby(true);
                        setBabyLocation('arms');
                        setBabyPose('bathingFootballHold');
                      }}
                      className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🤱 กดเพื่อห่อตัวทารกและอุ้มในท่า Football Hold มาที่อ่างอาบน้ำ
                    </button>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-slate-700">
                        กรุณากดทำตามขั้นตอนเรียงลำดับจากข้อ 1 ถึงข้อ 5 ({step5Progress}/5):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {step5Items.map((item) => {
                          const isDone = step5Progress >= item.id;
                          const isNext = step5Progress + 1 === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (isNext) setStep5Progress(item.id);
                              }}
                              className={`rounded-xl border-2 p-1.5 flex flex-col items-center text-center transition ${
                                isDone
                                  ? 'bg-emerald-50 border-emerald-500'
                                  : isNext
                                  ? 'bg-white border-teal-500 cursor-pointer ring-2 ring-teal-300 hover:scale-[1.02]'
                                  : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <img
                                src={item.img}
                                alt={item.label}
                                className="w-full h-20 object-contain rounded bg-white"
                              />
                              <span className="text-[11px] font-bold mt-1 leading-tight">{item.label}</span>
                              <span className="text-[10px] font-extrabold mt-0.5 text-emerald-700">
                                {isDone ? '☑ เรียบร้อย' : isNext ? '👆 กดที่นี่' : '🔒 รอลำดับ'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="flex justify-end">
                    <button
                      disabled={step5Progress < 5}
                      onClick={() => {
                        setHoldingBaby(false);
                        setBabyLocation('mat');
                        setBabyPose('diaperChange');
                        setWizardStep(6);
                      }}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 6: วางทารกบนเบาะผ้า ถอดเสื้อผ้าและตรวจผ้าอ้อม) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 6: วางทารกบนผ้า ถอดเสื้อผ้า และเปิดผ้าอ้อมตรวจสอบการขับถ่าย ── */}
              {wizardStep === 6 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 space-y-3">
                  <h3 className="font-bold text-base text-amber-950">
                    ขั้นที่ 6 (1.6): วางทารกบนผ้าข้างอ่าง ถอดเสื้อผ้า และตรวจสอบผ้าอ้อม
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white rounded-xl p-1.5 border border-amber-200 text-center">
                      <img
                        src="/images/rev/bath_step6_1_placed.jpg"
                        alt="วางทารกบนเบาะผ้า"
                        className="w-full h-28 object-contain rounded"
                      />
                      <div className="text-[11px] font-bold text-amber-950 mt-1">วางทารกบนเบาะผ้า</div>
                    </div>
                    <div className="bg-white rounded-xl p-1.5 border border-amber-200 text-center">
                      <img
                        src="/images/rev/bath_step6_2_pajamas.jpg"
                        alt="คลิกถอดเสื้อผ้าทารก"
                        className="w-full h-28 object-contain rounded"
                      />
                      <div className="text-[11px] font-bold text-amber-950 mt-1">1. ถอดเสื้อผ้าทารก</div>
                    </div>
                    <div className="bg-white rounded-xl p-1.5 border border-amber-200 text-center">
                      <img
                        src="/images/rev/bath_step6_3_diaper.jpg"
                        alt="คลิกเปิดผ้าอ้อมตรวจการขับถ่าย"
                        className="w-full h-28 object-contain rounded"
                      />
                      <div className="text-[11px] font-bold text-amber-950 mt-1">2. เปิดผ้าอ้อมตรวจสอบ</div>
                    </div>
                    <div className="bg-white rounded-xl p-1.5 border border-amber-200 text-center">
                      <img
                        src="/images/rev/bath_step6_undress_check.jpg"
                        alt="1.6 ตรวจสอบการขับถ่าย"
                        className="w-full h-28 object-contain rounded"
                      />
                      <div className="text-[11px] font-bold text-amber-950 mt-1">ทำความสะอาดก่อนอาบน้ำ</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setStep6Undressed(true);
                        setBabyLocation('mat');
                        setBabyPose('diaperChange');
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border-2 text-left flex items-center justify-between ${
                        step6Undressed ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-white border-amber-400 hover:bg-amber-100'
                      }`}
                    >
                      <span>1. ถอดเสื้อผ้าทารก</span>
                      <span>{step6Undressed ? '☑ เรียบร้อย' : '👆 กดถอดเสื้อผ้า'}</span>
                    </button>

                    <button
                      disabled={!step6Undressed}
                      onClick={() => {
                        setStep6DiaperChecked(true);
                        setBabyPose('naked');
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border-2 text-left flex items-center justify-between disabled:opacity-50 ${
                        step6DiaperChecked ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-white border-amber-400 hover:bg-amber-100'
                      }`}
                    >
                      <span>2. เปิดผ้าอ้อมทารกเพื่อตรวจสอบว่ามีการขับถ่ายหรือไม่ (เช็ดทำความสะอาดจากหน้าไปหลัง)</span>
                      <span>{step6DiaperChecked ? '☑ เรียบร้อย' : '👆 กดตรวจผ้าอ้อม'}</span>
                    </button>
                  </div>

                  <button
                    disabled={!step6DiaperChecked}
                    onClick={() => setWizardStep(7)}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                  >
                    ถัดไป (ขั้นที่ 7: อุ้มทารกลงอ่างอาบน้ำที่ 1) ▶
                  </button>
                </div>
              )}

              {/* ── STEP 7: อุ้มทารกลงอ่างอาบน้ำที่ 1 (อ่างสีฟ้า) ── */}
              {wizardStep === 7 && (
                <div className="mt-4 p-4 rounded-xl bg-sky-50 border-2 border-sky-200 space-y-3">
                  <h3 className="font-bold text-base text-sky-950">
                    ขั้นที่ 7 (1.7): อุ้มทารกลงอ่างอาบน้ำอ่างที่ 1 (อ่างสีฟ้า - สำหรับฟอกสบู่)
                  </h3>
                  <img
                    src="/images/rev/bath_step7_tubs.jpg"
                    alt="อุ้มทารกลงอ่างที่ 1"
                    className="w-full h-44 object-contain bg-white rounded-xl p-1 border border-sky-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setStep7InBlueTub(true);
                        setBabyLocation('tub1');
                        setBabyPose('bathing');
                      }}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🛁 อุ้มทารกลงอ่างที่ 1 (สีฟ้า)
                    </button>
                    <button
                      disabled={!step7InBlueTub}
                      onClick={() => setWizardStep(8)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 8–10: อาบน้ำด้านหน้า-หลัง และล้างอ่างที่ 2) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 8–10: ประคองศีรษะ -> อาบน้ำด้านหน้า -> อาบน้ำด้านหลัง -> ย้ายไปอ่างที่ 2 สีชมพู ── */}
              {(wizardStep === 8 || wizardStep === 9 || wizardStep === 10) && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50 border-2 border-teal-200 space-y-3">
                  <h3 className="font-bold text-base text-teal-950">
                    ขั้นที่ 8–10 (1.8–1.10): ประคองศีรษะ อาบน้ำด้านหน้า-ด้านหลัง และย้ายไปล้างน้ำสะอาดอ่างที่ 2
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    กรุณากดติ๊กตามลำดับ 1, 2, 3 ให้ครบ ({step8Progress}/3):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {step8Items.map((item) => {
                      const isDone = step8Progress >= item.id;
                      const isNext = step8Progress + 1 === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isNext) {
                              setStep8Progress(item.id);
                              setWizardStep(7 + item.id);
                            }
                          }}
                          className={`rounded-xl border-2 p-2 flex flex-col items-center text-center transition ${
                            isDone
                              ? 'bg-emerald-50 border-emerald-500'
                              : isNext
                              ? 'bg-white border-teal-500 cursor-pointer ring-2 ring-teal-300'
                              : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-28 object-contain rounded bg-white"
                          />
                          <span className="text-xs font-bold mt-1.5 leading-snug">{item.label}</span>
                          <span className="text-[11px] font-extrabold mt-1 text-emerald-700">
                            {isDone ? '☑ เรียบร้อย' : isNext ? '👆 กดติ๊กขั้นตอนนี้' : '🔒 รอลำดับ'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {step8Progress >= 3 && (
                    <div className="p-3 bg-pink-50 border-2 border-pink-300 rounded-xl flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-pink-950">
                        1.10 ย้ายทารกจากอ่างสีฟ้า (อ่าง 1) ไปล้างน้ำสะอาดในอ่างสีชมพู (อ่าง 2)
                      </span>
                      <button
                        onClick={() => {
                          setStep10InPinkTub(true);
                          setBabyLocation('tub2');
                          setBabyPose('bathingTurned');
                          setWizardStep(10);
                        }}
                        className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs shrink-0 shadow"
                      >
                        {step10InPinkTub ? '✓ ล้างน้ำสะอาดอ่างที่ 2 แล้ว' : '🌸 ย้ายไปล้างอ่างที่ 2 (สีชมพู)'}
                      </button>
                    </div>
                  )}

                  <button
                    disabled={!step10InPinkTub}
                    onClick={() => {
                      setBabyLocation('mat');
                      setBabyPose('towelWrap');
                      setWizardStep(11);
                    }}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                  >
                    ถัดไป (ขั้นที่ 11: นำทารกขึ้นวางบนผ้าขนหนู เช็ดตัวให้แห้ง) ▶
                  </button>
                </div>
              )}

              {/* ── STEP 11: วางบนผ้าขนหนูข้างอ่าง เช็ดตัวทารกให้แห้ง ── */}
              {wizardStep === 11 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 space-y-3">
                  <h3 className="font-bold text-base text-amber-950">
                    ขั้นที่ 11 (1.11): นำทารกวางบนผ้าขนหนูข้างอ่าง และเช็ดตัวทารกให้แห้ง
                  </h3>
                  <img
                    src="/images/rev/bath_step11_dry_body.jpg"
                    alt="เช็ดตัวทารกให้แห้ง"
                    className="w-full h-44 object-contain bg-white rounded-xl p-1 border border-amber-200"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        setStep11DriedBody(true);
                        setBabyLocation('mat');
                        setBabyPose('towelWrap');
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
                    >
                      🧖 เช็ดตัวทารกให้แห้ง
                    </button>
                    <button
                      disabled={!step11DriedBody}
                      onClick={() => setWizardStep(12)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 12: ห่อตัวและเช็ดตาทารก) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 12: ห่อตัวครั้งที่ 1 + ติ๊กอุปกรณ์เช็ดตา 3 คำ + เลือกวิธีเช็ดตาที่ถูกต้อง ── */}
              {wizardStep === 12 && (
                <div className="mt-4 p-4 rounded-xl bg-sky-50 border-2 border-sky-200 space-y-3">
                  <h3 className="font-bold text-base text-sky-950">
                    ขั้นที่ 12 (1.12): ห่อตัวทารก และทำความสะอาดดวงตาทารก
                  </h3>

                  {/* Part A: Swaddle 1st time */}
                  <div className="bg-white p-3 rounded-xl border border-sky-200 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <img
                      src="/images/rev/bath_step12_swaddle.jpg"
                      alt="ห่อตัวทารก"
                      className="w-28 h-24 object-contain rounded border shrink-0"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">12.1 หยิบผ้าห่อตัวและห่อตัวทารก (ครั้งที่ 1)</div>
                      <button
                        onClick={() => {
                          setStep12SwaddledFirst(true);
                          setBabyPose('swaddle');
                        }}
                        className={`mt-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white ${
                          step12SwaddledFirst ? 'bg-emerald-600' : 'bg-sky-600 hover:bg-sky-700'
                        }`}
                      >
                        {step12SwaddledFirst ? '✓ ห่อตัวทารกเรียบร้อยแล้ว' : '🤱 กดเพื่อห่อตัวทารก'}
                      </button>
                    </div>
                  </div>

                  {/* Part B: Must tick all 3 eye cleaning supplies */}
                  {step12SwaddledFirst && (
                    <div className="bg-white p-3 rounded-xl border border-sky-200 space-y-2">
                      <div className="text-xs font-bold text-slate-900">
                        12.2 กดเลือกอุปกรณ์สำหรับเช็ดตาทารกให้ครบทั้ง 3 อย่าง:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { k: 'cotton', label: '1. สำลี' },
                          { k: 'cup', label: '2. ถ้วยสะอาดขนาดเล็ก' },
                          { k: 'saline', label: '3. น้ำต้มสุก/น้ำเกลือ 0.9% NSS' },
                        ].map((sup) => (
                          <button
                            key={sup.k}
                            onClick={() =>
                              setStep12EyeSupplies((p) => ({ ...p, [sup.k]: true }))
                            }
                            className={`p-2 rounded-lg border-2 text-xs font-bold transition ${
                              step12EyeSupplies[sup.k]
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : 'bg-slate-50 border-slate-300 hover:border-sky-500'
                            }`}
                          >
                            {step12EyeSupplies[sup.k] ? '☑ ' : '☐ '}
                            {sup.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Part C: Choose correct eye wiping direction (Must select 1 to proceed) */}
                  {step12SwaddledFirst &&
                    step12EyeSupplies.cotton &&
                    step12EyeSupplies.cup &&
                    step12EyeSupplies.saline && (
                      <div className="bg-white p-3 rounded-xl border border-sky-200 space-y-2.5">
                        <img
                          src="/images/rev/bath_step12_eye_wipe.jpg"
                          alt="การเช็ดตาทารก"
                          className="w-full h-36 object-contain rounded bg-sky-50 p-1"
                        />
                        <div className="text-xs font-extrabold text-sky-950">
                          กรุณาเลือกวิธีการเช็ดตาทารกที่ถูกต้อง:
                        </div>
                        <button
                          onClick={() => setStep12EyeAnswer(1)}
                          className={`w-full p-2.5 rounded-xl border-2 text-left text-xs font-bold transition ${
                            step12EyeAnswer === 1
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                              : 'bg-slate-50 border-slate-300 hover:bg-white'
                          }`}
                        >
                          1. เช็ดจากหัวตาไปหางตา ทั้ง 2 ข้าง (ใช้สำลี 1 ก้อน/ตา 1 ข้าง ไม่เช็ดซ้ำ)
                        </button>
                        <button
                          onClick={() => setStep12EyeAnswer(2)}
                          className={`w-full p-2.5 rounded-xl border-2 text-left text-xs font-bold transition ${
                            step12EyeAnswer === 2
                              ? 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 hover:bg-white'
                          }`}
                        >
                          2. เช็ดจากหางตาไปหัวตา ทั้ง 2 ข้าง (ใช้สำลี 1 ก้อน/ตา 1 ข้าง ไม่เช็ดซ้ำ)
                        </button>

                        {step12EyeAnswer === 2 && (
                          <div className="p-2.5 rounded-lg bg-rose-100 border border-rose-400 text-rose-900 text-xs font-bold">
                            ✕ ไม่ถูกต้อง! การเช็ดจากหางตาไปหัวตาอาจนำเชื้อโรคเข้าสู่ท่อน้ำตา กรุณาเลือกข้อ 1 เท่านั้นเพื่อไปต่อ
                          </div>
                        )}
                        {step12EyeAnswer === 1 && (
                          <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold">
                            ✓ ถูกต้อง! เช็ดจากหัวตาไปหางตา ทั้ง 2 ข้าง โดยใช้สำลีแยกก้อนกัน
                          </div>
                        )}
                      </div>
                    )}

                  <button
                    disabled={step12EyeAnswer !== 1}
                    onClick={() => setWizardStep(13)}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                  >
                    ถัดไป (ขั้นที่ 13: ทำความสะอาดสายสะดือ) ▶
                  </button>
                </div>
              )}

              {/* ── STEP 13: โปรดเช็ดสายสะดือ (/images/rev/bath_step13_cord_care.jpg) ── */}
              {wizardStep === 13 && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50 border-2 border-teal-200 space-y-3 text-center">
                  <h3 className="font-bold text-base text-teal-950">
                    ขั้นที่ 13 (1.13): โปรดเช็ดสายสะดือ (อ้างอิงจากห้องการดูแลสายสะดือ)
                  </h3>
                  <img
                    src="/images/rev/bath_step13_cord_care.jpg"
                    alt="1.13 ทำความสะอาดสายสะดือ"
                    onClick={() => setStep13CordCleaned(true)}
                    className="cursor-pointer w-full h-52 object-contain bg-white rounded-xl p-1.5 border-2 border-teal-400 hover:scale-[1.01] transition"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setStep13CordCleaned(true)}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      {step13CordCleaned ? '✓ เช็ดทำความสะอาดสายสะดือแล้ว' : '💧 กดเพื่อเช็ดทำความสะอาดสายสะดือ'}
                    </button>
                    <button
                      disabled={!step13CordCleaned}
                      onClick={() => setWizardStep(14)}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow"
                    >
                      ถัดไป (ขั้นที่ 14: ใส่ผ้าอ้อม สวมเสื้อผ้า ห่อตัว และเก็บของ) ▶
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 14: คลายผ้า -> ใส่ผ้าอ้อม -> ใส่เสื้อผ้า -> ห่อตัวอีกครั้ง -> อุ้มไปเตียง -> เก็บของ ── */}
              {wizardStep === 14 && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
                  <h3 className="font-bold text-base text-emerald-950">
                    ขั้นที่ 14 (1.14): ใส่ผ้าอ้อม สวมเสื้อผ้า ห่อตัวทารก นำไปวางในเตียง และเก็บของ
                  </h3>

                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="/images/rev/bath_step14_1_diaper.jpg"
                      alt="ใส่ผ้าอ้อม"
                      className="w-full h-28 object-contain bg-white rounded-lg border p-1"
                    />
                    <img
                      src="/images/rev/bath_step14_2_clothes.jpg"
                      alt="ใส่เสื้อผ้า"
                      className="w-full h-28 object-contain bg-white rounded-lg border p-1"
                    />
                    <img
                      src="/images/rev/bath_step14_3_swaddle_again.jpg"
                      alt="ห่อตัวอีกครั้ง"
                      className="w-full h-28 object-contain bg-white rounded-lg border p-1"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      {
                        id: 1,
                        label: '1. คลายผ้าห่อตัวทารกออก',
                        action: () => {
                          setBabyLocation('mat');
                          setBabyPose('naked');
                        },
                      },
                      {
                        id: 2,
                        label: '2. ใส่ผ้าอ้อมทารก (พับขอบผ้าอ้อมลงใต้สะดือ)',
                        action: () => {
                          setBabyLocation('mat');
                          setBabyPose('diaperOn');
                        },
                      },
                      {
                        id: 3,
                        label: '3. ใส่เสื้อผ้าทารกชุดใหม่',
                        action: () => {
                          setBabyLocation('mat');
                          setBabyPose('dressed');
                        },
                      },
                      {
                        id: 4,
                        label: '4. ห่อตัวทารกด้วยผ้าห่อตัวอีกครั้งให้อบอุ่น',
                        action: () => {
                          setBabyLocation('mat');
                          setBabyPose('swaddle');
                        },
                      },
                      {
                        id: 5,
                        label: '5. อุ้มทารกกลับไปวางในเตียงนอนทารก',
                        action: () => {
                          setHoldingBaby(false);
                          setBabyLocation('crib');
                          setBabyPose('swaddle');
                        },
                      },
                      {
                        id: 6,
                        label: '6. เดินกลับมาที่โต๊ะอาบน้ำ กดปุ่ม “เก็บของ”',
                        action: () => {
                          completeModule('newbornCare2');
                        },
                      },
                    ].map((st) => {
                      const isDone = step14SubStep >= st.id;
                      const isNext = step14SubStep + 1 === st.id;
                      return (
                        <button
                          key={st.id}
                          disabled={!isNext && !isDone}
                          onClick={() => {
                            if (isNext) {
                              st.action();
                              setStep14SubStep(st.id);
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl border-2 text-left font-bold flex items-center justify-between transition ${
                            isDone
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                              : isNext
                              ? 'bg-white border-teal-500 text-teal-950 ring-2 ring-teal-300'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          }`}
                        >
                          <span>{st.label}</span>
                          <span>{isDone ? '☑ สำเร็จ' : isNext ? '👆 กดปฏิบัติ' : '🔒 รอลำดับ'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {step14SubStep >= 6 && (
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        setShowSuccessModal(
                          true,
                          'ยินดีด้วย! คุณปฏิบัติการอาบน้ำและเปลี่ยนผ้าอ้อมทารกครบทั้ง 14 ขั้นตอนอย่างถูกต้องสมบูรณ์'
                        );
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg"
                    >
                      🎉 บันทึกความสำเร็จภารกิจห้องอาบน้ำทารก
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* I. Fullscreen TV Modal */}
      {showTvModal && (
        <ScreenPortal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border-4 border-teal-400 max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📺</span>
                  <h2 className="text-base sm:text-lg font-bold text-teal-300">
                    {tvSlidesData[tvSlide].title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowTvModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <img
                  src={tvSlidesData[tvSlide].img}
                  alt={tvSlidesData[tvSlide].title}
                  className="w-full max-h-[calc(var(--app-h,100dvh)*0.55)] object-contain rounded-xl bg-white p-2 border border-slate-700"
                />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  disabled={tvSlide === 0}
                  onClick={() => handleSelectSlide(tvSlide - 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-sm font-bold"
                >
                  ◀ ก่อนหน้า
                </button>
                <span className="text-xs text-slate-400">
                  เรียนรู้แล้ว {viewedSlides.size}/8 หน้า
                </span>
                <button
                  disabled={tvSlide === tvSlidesData.length - 1}
                  onClick={() => handleSelectSlide(tvSlide + 1)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 rounded-lg text-sm font-bold"
                >
                  ถัดไป ▶
                </button>
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}
    </group>
  );
}
