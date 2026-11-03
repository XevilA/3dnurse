import React, { useState, useMemo, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import BillboardLabel3D from '../ui/BillboardLabel3D';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import FlowerVase from '../decorations/FlowerVase';
import Pillows from '../decorations/Pillows';
import HospitalNightstand from '../furniture/HospitalNightstand';
import { DiaperStack, BabyBottle, CottonJar, HospitalBin, BabyShelf } from '../furniture/BabyProps';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { WindowWithCurtains } from '../ward/WardKit';
import { FramedImagePoster3D } from '../furniture/CozyRoomFurniture';
import InteractiveSmartTv3D from '../furniture/InteractiveSmartTv3D';
import { CANVAS_THAI_FONT, fillCenteredText } from '../../utils/canvasText';
import {
  RealisticNursingPillow3D,
  RealisticFoldedClothStack3D,
  RealisticBookStack3D,
} from '../furniture/RealisticProps3D';

function useFloralFrameTexture() {
  const tex = useMemo(() => {
    const W = 520;
    const H = 380;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#fff1f2');
      g.addColorStop(0.5, '#fffbeb');
      g.addColorStop(1, '#fdf2f8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 8;
      ctx.strokeRect(8, 8, W - 16, H - 16);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(24, 24, W - 48, H - 84);

      // Curved stems
      ctx.strokeStyle = '#84a98c';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(55, 272);
      ctx.quadraticCurveTo(185, 165, 275, 152);
      ctx.quadraticCurveTo(365, 138, 458, 78);
      ctx.stroke();

      ctx.strokeStyle = '#a3b18a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(135, 260);
      ctx.quadraticCurveTo(225, 208, 325, 194);
      ctx.quadraticCurveTo(400, 182, 445, 160);
      ctx.stroke();

      // Leaves
      const drawLeaf = (lx, ly, rot, col) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawLeaf(158, 188, -0.48, '#a3b18a');
      drawLeaf(248, 126, -0.32, '#84a98c');
      drawLeaf(358, 170, 0.35, '#a3b18a');

      // Blossoms
      const drawFlower = (fx, fy, petals, rx, ry, pCol, cCol, cr) => {
        ctx.save();
        ctx.translate(fx, fy);
        for (let i = 0; i < petals; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / petals);
          ctx.fillStyle = pCol;
          ctx.beginPath();
          ctx.ellipse(0, -ry, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = cCol;
        ctx.beginPath();
        ctx.arc(0, 0, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawFlower(266, 144, 6, 19, 28, '#f4acb7', '#fcbf49', 15);
      drawFlower(145, 218, 5, 15, 23, '#ffcad4', '#f77f00', 12);
      drawFlower(384, 132, 6, 15, 23, '#fde68a', '#fb8500', 13);

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#881337';
      ctx.font = `800 24px ${CANVAS_THAI_FONT}`;
      fillCenteredText(ctx, '🌸 ภาพดอกไม้ประดับมุมผ่อนคลาย', W / 2, H - 34, W - 64);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

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
  const floralArtTex = useFloralFrameTexture();
  const {
    completeModule,
    learningProgress,
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

  // ── Active popup / clicked object state (only shown when clicked) ──
  const [activeModal, setActiveModal] = useState(null);
  // 'fridge' | 'tableItems' | 'postureSelector' | 'sink' | 'kettleTable' | 'cribPrompt' | 'cornerDecor'
  const [selectedTableItem, setSelectedTableItem] = useState(1);

  // ── Breastfeeding selection state ──
  const [selectedHold, setSelectedHold] = useState('cradleHold');
  const [holdFeedback, setHoldFeedback] = useState(null);
  const [missionCompleted, setMissionCompleted] = useState(Boolean(learningProgress?.newbornCare1));
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
      {/* Wall Poster 1: "4 Key Signs" — 100% 3D WebGL Mesh Flush against North Wall z = -6.78 (ไม่จมผนัง -6.80) */}
      <FramedImagePoster3D
        position={[-4.25, 2.75, -6.78]}
        width={2.12}
        height={1.36}
        contain={true}
        backlit={false}
        src="/references/room1/img_006.png"
        frameColor="#b45309"
        accentColor="#f59e0b"
        onClick={() => openWallPoster(0)}
      />

      {/* Wall Poster 2: "4 Key Points" — 100% 3D WebGL Mesh Flush against North Wall z = -6.78 */}
      <FramedImagePoster3D
        position={[-1.72, 2.75, -6.78]}
        width={2.12}
        height={1.36}
        contain={true}
        backlit={false}
        src="/references/room1/img_010.jpeg"
        frameColor="#0284c7"
        accentColor="#38bdf8"
        onClick={() => openWallPoster(1)}
      />

      {/* Wall Poster 3: "ท่าให้นมทารก 4 ท่า" — 100% 3D WebGL Mesh Flush against North Wall z = -6.78 */}
      <FramedImagePoster3D
        position={[1.05, 2.75, -6.78]}
        width={2.52}
        height={1.48}
        contain={true}
        backlit={false}
        src="/images/rev/bf_4holds.jpg"
        frameColor="#be185d"
        accentColor="#ec4899"
        onClick={() => openWallPoster(2)}
      />

      {/* หน้าต่างกระจกใสเห็นวิวสวนธรรมชาติภายนอก (ผนังด้านเหนือ & ผนังด้านใต้โปร่งสบายตา) */}
      <WindowWithCurtains
        position={[4.55, 2.75, -6.76]}
        rotation={[0, 0, 0]}
        width={2.7}
        height={2.25}
      />
      <WindowWithCurtains
        position={[-3.95, 2.75, 6.76]}
        rotation={[0, Math.PI, 0]}
        width={3.3}
        height={2.3}
      />

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

        {/* Crib Action Popup — 100% 3D WebGL Billboard Plaque (ไม่ลอยทับหัวตัวละคร) */}
        {activeModal === 'cribPrompt' && (
          <group position={[0, 1.38, 0]}>
            <BillboardLabel3D
              position={[0, 0.14, 0]}
              text={isHoldingBaby ? '🧸 คลิกวางทารกลงในเตียง' : '🤱 คลิกอุ้มทารกขึ้นมาจากเตียง'}
              bg="#db2777"
              bgEnd="#be185d"
              width={1.68}
              height={0.32}
              pill={true}
              onClick={() => {
                setHoldingBaby(!isHoldingBaby);
                setActiveModal(null);
              }}
            />
            <BillboardLabel3D
              position={[0, -0.18, 0]}
              text="✕ ปิดป้าย"
              bg="#ffffff"
              textColor="#475569"
              borderColor="#cbd5e1"
              width={0.82}
              height={0.24}
              pill={true}
              onClick={() => setActiveModal(null)}
            />
          </group>
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
      {/* 100% 3D WebGL Smart TV (ติดผนังใน x = -6.77 ไม่จมกำแพง -6.80 และไม่ลอยทับหัวตัวละคร) */}
      <InteractiveSmartTv3D
        position={[-6.77, 2.55, -1.6]}
        rotation={[0, Math.PI / 2, 0]}
        width={3.7}
        height={2.2}
        headerTitle={`📺 สื่อให้ความรู้การให้นมบุตร (${tvSlide + 1}/${tvSlidesData.length})`}
        accentColor="#38bdf8"
        slide={currentSlide}
        slideIndex={tvSlide}
        totalSlides={tvSlidesData.length}
        footerText={
          tvSlide === 7
            ? 'ที่มา: กรมอนามัย (youtube.com/watch?v=G1muyuyuD60)'
            : `สไลด์แผ่นที่ ${tvSlide + 1} จาก ${tvSlidesData.length}`
        }
        zoomLabel="🔍 ขยายเต็มจอ"
        secondaryLabel="▶ หน้า 8/8 วีดีโอ"
        secondaryActive={tvSlide === 7}
        secondaryColor="#e11d48"
        onOpenFullscreen={() => openTvLightbox(tvSlide)}
        onSecondaryAction={() => setTvSlide(7)}
        onPrev={() => setTvSlide((s) => Math.max(0, s - 1))}
        onNext={() => setTvSlide((s) => Math.min(tvSlidesData.length - 1, s + 1))}
      />

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

          {/* When Mother is Seated with Baby, show 3D WebGL action plaques behind backrest (never overlapping head) */}
          {isMotherSeatedOnSofa && activeModal !== 'postureSelector' && (
            <group position={[0, 1.62, -0.35]}>
              <BillboardLabel3D
                position={[0, 0.16, 0]}
                text="🤱 เลือกท่าให้นมทารก (4 ท่า)"
                bg="#db2777"
                bgEnd="#be185d"
                width={1.65}
                height={0.32}
                pill={true}
                onClick={() => {
                  if (!isHoldingBaby) setHoldingBaby(true);
                  setActiveModal('postureSelector');
                }}
              />
              <BillboardLabel3D
                position={[0, -0.18, 0]}
                text="🚶‍♀️ ลุกออกจากโซฟา"
                bg="#f8fafc"
                textColor="#334155"
                borderColor="#cbd5e1"
                width={1.25}
                height={0.26}
                pill={true}
                onClick={() => standUp()}
              />
            </group>
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

        {/* Item 1: แก้ว/ภาชนะเก็บน้ำนมแม่ปลอดเชื้อพร้อมสเกล ml ฉลากวันเวลา และฝาเกลียวชมพู (Click to view details) */}
        <group
          position={[-0.42, 0.41, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(1);
            setActiveModal('tableItems');
          }}
        >
          {/* Clear Graduated Breastmilk Storage Cup */}
          <mesh position={[0, 0.058, 0]} castShadow>
            <cylinderGeometry args={[0.054, 0.047, 0.115, 24]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.48} roughness={0.08} metalness={0.08} />
          </mesh>
          {/* Creamy Expressed Breastmilk Inside */}
          <mesh position={[0, 0.044, 0]}>
            <cylinderGeometry args={[0.049, 0.044, 0.078, 22]} />
            <meshStandardMaterial color="#fff8dc" roughness={0.22} />
          </mesh>
          {/* White Date/Volume Label & Graduation Marks */}
          <mesh position={[0, 0.058, 0.051]}>
            <boxGeometry args={[0.046, 0.052, 0.002]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {[0.032, 0.050, 0.068, 0.086].map((gy, idx) => (
            <mesh key={idx} position={[0.032, gy, 0.042]}>
              <boxGeometry args={[0.014, 0.002, 0.002]} />
              <meshBasicMaterial color="#db2777" />
            </mesh>
          ))}
          {/* Ribbed Leakproof Screw Lid */}
          <mesh position={[0, 0.122, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.058, 0.02, 24]} />
            <meshStandardMaterial color="#ec4899" roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.134, 0]}>
            <cylinderGeometry args={[0.042, 0.046, 0.006, 22]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
        </group>

        {/* Item 2: ถ้วยป้อนนมทารกทางการแพทย์ขอบมนป้อนง่ายพร้อมสเกลวัดและฝาปิด (Click to view details) */}
        <group
          position={[0.0, 0.41, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(2);
            setActiveModal('tableItems');
          }}
        >
          {/* Translucent Neonatal Feeding Cup */}
          <mesh position={[0, 0.048, 0]} castShadow>
            <cylinderGeometry args={[0.048, 0.036, 0.095, 24]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.55} roughness={0.08} />
          </mesh>
          {/* Smooth Rolled Sipping Rim for Infant Lip */}
          <mesh position={[0, 0.096, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.048, 0.004, 12, 24]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.18} />
          </mesh>
          {/* Warm Breastmilk Inside Feeding Cup */}
          <mesh position={[0, 0.036, 0]}>
            <cylinderGeometry args={[0.041, 0.033, 0.058, 22]} />
            <meshStandardMaterial color="#fff8dc" roughness={0.22} />
          </mesh>
          {[0.026, 0.044, 0.062, 0.080].map((gy, idx) => (
            <mesh key={idx} position={[0, gy, 0.044]}>
              <boxGeometry args={[0.016, 0.002, 0.002]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          ))}
          {/* Hygienic Blue Snap Lid Resting Beside Cup */}
          <mesh position={[0.078, 0.008, 0.02]} castShadow>
            <cylinderGeometry args={[0.051, 0.051, 0.014, 22]} />
            <meshStandardMaterial color="#0284c7" roughness={0.32} />
          </mesh>
        </group>

        {/* Item 3: ไซริงค์ป้อนนมเหลือง (Colostrum Syringe) + ถุงซิปเก็บน้ำนมแม่พร้อมแถบซิปล็อกคู่ (Click to view details) */}
        <group
          position={[0.42, 0.41, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableItem(3);
            setActiveModal('tableItems');
          }}
        >
          {/* Detailed Oral Feeding Syringe */}
          <group position={[-0.02, 0.022, -0.11]} rotation={[0, 0.12, Math.PI / 2]}>
            {/* Clear Barrel + Golden Colostrum Fluid */}
            <mesh castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.14, 18]} />
              <meshStandardMaterial color="#f8fafc" transparent opacity={0.5} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.022, 0]}>
              <cylinderGeometry args={[0.0135, 0.0135, 0.075, 16]} />
              <meshStandardMaterial color="#fde68a" roughness={0.25} />
            </mesh>
            {/* Rubber Piston Seal */}
            <mesh position={[0, 0.018, 0]}>
              <cylinderGeometry args={[0.0145, 0.0145, 0.01, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Finger Flange Wings */}
            <RoundedBox args={[0.052, 0.005, 0.024]} radius={0.002} position={[0, 0.07, 0]}>
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
            </RoundedBox>
            {/* Purple Plunger Rod & Thumb Disc */}
            <mesh position={[0, 0.095, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.09, 12]} />
              <meshStandardMaterial color="#9333ea" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.005, 16]} />
              <meshStandardMaterial color="#7e22ce" roughness={0.35} />
            </mesh>
            {/* Oral Tip Nozzle */}
            <mesh position={[0, -0.082, 0]}>
              <cylinderGeometry args={[0.004, 0.006, 0.024, 12]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.25} />
            </mesh>
          </group>

          {/* Pre-Sterilized Double-Zip Breastmilk Storage Pouches (2 Bags) */}
          {[-0.02, 0.022].map((by, bIdx) => (
            <group
              key={bIdx}
              position={[bIdx * 0.02, 0.016 + bIdx * 0.022, 0.10 + bIdx * 0.015]}
              rotation={[0, 0.14 - bIdx * 0.22, 0]}
            >
              {/* Translucent Pouch Film Outline */}
              <RoundedBox args={[0.17, 0.014, 0.23]} radius={0.006} smoothness={3} castShadow>
                <meshStandardMaterial color="#f3e8ff" transparent opacity={0.65} roughness={0.15} />
              </RoundedBox>
              {/* Creamy Breastmilk Pouch Fill */}
              <RoundedBox args={[0.14, 0.018, 0.14]} radius={0.008} smoothness={3} position={[0, 0.002, 0.02]}>
                <meshStandardMaterial color="#fffbeb" roughness={0.28} />
              </RoundedBox>
              {/* Double Zip-Lock Purple Seal Strips */}
              <mesh position={[0, 0.009, -0.078]}>
                <boxGeometry args={[0.165, 0.003, 0.006]} />
                <meshBasicMaterial color="#9333ea" />
              </mesh>
              <mesh position={[0, 0.009, -0.068]}>
                <boxGeometry args={[0.165, 0.003, 0.005]} />
                <meshBasicMaterial color="#ec4899" />
              </mesh>
              {/* White Write-On Name/Date Header Label */}
              <mesh position={[0, 0.009, -0.096]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.15, 0.024]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>

        {/* คู่มือการให้นมแม่ปกแข็งวางมุมโต๊ะ */}
        <RealisticBookStack3D
          position={[-0.56, 0.41, -0.26]}
          rotation={[0, 0.35, 0]}
          scale={0.72}
          withOpenTop={false}
        />
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
          {/* Seamless U-Shaped Nursing Pillow on Dresser Table */}
          <RealisticNursingPillow3D
            position={[-0.42, 1.01, 0]}
            rotation={[0, 0.2, 0]}
            scale={0.84}
            color="#fce7f3"
            pipingColor="#ec4899"
          />
          {/* Soft U-Folded Pastel Baby Clothes & Muslin Cloths */}
          <RealisticFoldedClothStack3D
            position={[0.08, 0.94, 0]}
            scale={0.96}
            colors={[
              { body: '#fef9c3', trim: '#f59e0b' },
              { body: '#e0f2fe', trim: '#38bdf8' },
              { body: '#fce7f3', trim: '#ec4899' },
            ]}
          />
          {/* Baby Wipes Dispenser Box with Flip Lid */}
          <group position={[0.5, 0.99, 0]}>
            <RoundedBox args={[0.26, 0.11, 0.19]} radius={0.022} smoothness={3} castShadow>
              <meshStandardMaterial color="#fff8f0" roughness={0.45} />
            </RoundedBox>
            <RoundedBox args={[0.14, 0.016, 0.10]} radius={0.008} position={[0, 0.058, 0]}>
              <meshStandardMaterial color="#f472b6" roughness={0.35} />
            </RoundedBox>
          </group>
          {/* ── Feeding Props on Dresser — ขวดนม, ผ้าอ้อม, สำลี ── */}
          <BabyBottle position={[-0.55, 1.03, 0.08]} rotation={[0, 0.5, 0]} />
          <BabyBottle position={[-0.55, 1.03, -0.10]} rotation={[0, -0.3, 0]} color="#bbf7d0" />
          <DiaperStack position={[-0.28, 0.97, 0]} count={4} />
          <CottonJar position={[0.72, 1.01, 0]} />
        </group>

        {/* (2) ภาพดอกไม้สวยงาม (Mounted flush on South inner wall z = 6.77, ไม่จมผนัง 6.80) */}
        <group position={[5.45, 2.25, 6.77]} rotation={[0, Math.PI, 0]}>
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
          {/* ภาพดอกไม้ 3D CanvasTexture แนบสนิทในกรอบ (ไม่ใช้ <Html transform>) */}
          <mesh
            position={[0, 0, 0.018]}
            onClick={(e) => {
              if (e.delta > 10) return;
              e.stopPropagation();
              setActiveModal('cornerDecor');
            }}
          >
            <planeGeometry args={[1.05, 0.75]} />
            <meshBasicMaterial map={floralArtTex} toneMapped={false} />
          </mesh>
        </group>
        {/* Framed Botanical Art beside main floral frame on South Wall */}
        <group position={[4.45, 2.25, 6.77]} rotation={[0, Math.PI, 0]}>
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

        {/* (4) ที่แขวนของ (Wooden Pegboard / Wall Hanger with Hanging Baby Items on East inner wall x = 6.77) */}
        <group position={[6.77, 1.58, 3.35]} rotation={[0, -Math.PI / 2, 0]}>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-indigo-400">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-6 shadow-2xl border-4 border-amber-400 text-slate-800">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-5 shadow-2xl border-4 border-sky-400 text-slate-800 text-center">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-5 shadow-2xl border-4 border-amber-400 text-slate-800 text-center">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto p-4 sm:p-5 shadow-2xl border-4 border-pink-400 text-slate-800">
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

      {/* ── ถังขยะข้างอ่างล้างมือ (ชิดผนังข้างโซนอ่างล้างมือ ไม่บังประตูทางออก) ── */}
      <HospitalBin position={[3.05, 0, 6.58]} color="#eab308" />
    </group>
  );
}
