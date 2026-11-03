import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import BillboardLabel3D from '../ui/BillboardLabel3D';
import PlayerController from '../player/PlayerController';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { TitleSign, WindowWithCurtains } from '../ward/WardKit';
import {
  WoodFramedBacklitPanel,
  FramedImagePoster3D,
  CozySectionalSofaSet,
  CozyRoomDecorCorners,
} from '../furniture/CozyRoomFurniture';
import { getQuestionsByRoomKey } from '../../data/quizData';

// ── ข้อมูลโปสเตอร์ผนังทั้ง 3 ด้าน (อัปเดตภาพตรง คมชัด ไร้พื้นหลัง ตามไฟล์ แก้ไข-30) ──
const W103_GALLERY = [
  {
    src: '/images/rev/w103_wall1_left_straight.jpg',
    title: 'ผนังที่ 1 (ซ้าย): 1. การดูแลเต้านม — สังเกตความปกติของเต้านม',
    badge: 'ผนังที่ 1 • ส่วนที่ 1',
    description: 'สังเกตความปกติของเต้านม (ปกติ, บวม, แดง ร้อน, เจ็บ กดเจ็บ)',
    details: [
      'สังเกตความปกติของเต้านม: ปกติ / บวม / แดง ร้อน / เจ็บ กดเจ็บ',
    ],
  },
  {
    src: '/images/rev/w103_clean_assess.jpg',
    title: 'ผนังที่ 1 (ขวา): การทำความสะอาดเต้านม & การประเมินเต้านมด้วยตนเอง',
    badge: 'ผนังที่ 1 • ส่วนที่ 2',
    description: 'วิธีทำความสะอาดเต้านมอย่างอ่อนโยนและการตรวจประเมินเต้านมด้วยตนเองอย่างสม่ำเสมอ',
    details: [
      'การทำความสะอาดเต้านม: อาบน้ำด้วยน้ำสะอาด, ไม่ถูแรง, เช็ดให้แห้ง, ไม่ใช้สบู่/แอลกอฮอล์บริเวณหัวนม',
      'การประเมินเต้านมด้วยตนเอง: คลำหาก้อน, สังเกตผิวหนัง, ดูหัวนมและทิศทางการไหลของน้ำนม, สอบถามเมื่อมีความผิดปกติ',
    ],
  },
  {
    src: '/images/rev/w103_wall2_massage_v2.jpg',
    title: 'ผนังที่ 2: การนวดเต้านมและบีบน้ำนมด้วยมือ (4 ขั้นตอน)',
    badge: 'ผนังที่ 2',
    description: 'นวดเบา ๆ วันละ 2–3 ครั้ง หรือก่อนให้นม/เมื่อรู้สึกคัดตึง',
    details: [
      '1. ประคองเต้านม: วางมือด้านบนและด้านล่าง ขยับมือสวนทางกันเบา ๆ โดยไม่ให้เจ็บ',
      '2. นวดวนเบา ๆ: ไม่กดลึกหรือขยี้ก้อนแข็ง',
      '3. ลูบเต้านมเบา ๆ: ใช้มือประคองเต้า อีกมือลูบผิวเบา ๆ หากเต้าบวมให้ลูบไปทางรักแร้และอกด้านบน',
      '4. บีบน้ำนมด้วยมือ: วางนิ้วหัวแม่มือกับนิ้วชี้ห่างฐานหัวนมประมาณ 3–4 ซม. กดเข้าหาหน้าอก → บีบ → คลาย ไม่ดึงหรือบีบหัวนม',
    ],
  },
  {
    src: '/images/rev/w103_problems_all.jpg',
    title: 'ผนังที่ 3: ปัญหาเต้านมที่พบบ่อยและการดูแลเบื้องต้น (4 อาการ)',
    badge: 'ผนังที่ 3',
    description: 'เต้านมคัดตึง, หัวนมเจ็บ/หัวนมแตก, ท่อน้ำนมอุดตัน และเต้านมอักเสบ พร้อมอาการและวิธีจัดการดูแลตนเอง',
    details: [
      '1. เต้านมคัดตึง (Breast engorgement): ให้ลูกดูดบ่อยขึ้น ประคบอุ่นก่อนให้นม 5–10 นาที นวดเบา ๆ และระบายน้ำนม',
      '2. หัวนมเจ็บ / หัวนมแตก (Nipple pain / cracked nipple): ตรวจและแก้ท่าให้นม ใช้น้ำนมแม่ทาเคลือบหัวนม ปล่อยให้แห้ง',
      '3. ท่อน้ำนมอุดตัน (Blocked duct): ให้ลูกดูดบ่อย นวดเบา ๆ จากด้านนอกเข้าหาหัวนม ประคบอุ่นก่อนให้นม',
      '4. เต้านมอักเสบ (Mastitis): พักผ่อน ดื่มน้ำมาก ๆ ระบายน้ำนมต่อเนื่อง และพบแพทย์ทันทีเมื่อมีไข้/ปวดแดงร้อน',
    ],
  },
  {
    src: '/images/rev/w103_scenarios_v2.jpg',
    title: 'สถานการณ์จำลอง: การดูแลเต้านม (4 สถานการณ์)',
    badge: 'สถานการณ์จำลอง',
    description: 'ฝึกวิเคราะห์และเลือกวิธีจัดการปัญหาเต้านมทั้ง 4 สถานการณ์อย่างเหมาะสม',
  },
];

// ── สถานการณ์จำลอง 4 ข้อ ตามแผ่นภาพ IMG_7527.JPG แบบเป๊ะ 100% ──
const W103_SCENARIOS = [
  {
    id: 1,
    title: '1. เต้านมคัดตึง',
    situation: 'หลังคลอดวันที่ 3 รู้สึกเต้านมทั้งสองข้างตึง แข็ง เจ็บ โดยเฉพาะช่วงเช้า',
    prompt: 'เลือกวิธีจัดการที่เหมาะสม (เลือก 2–3 ข้อ)',
    options: [
      { id: 's1_1', text: 'ให้นมหรือบีบระบายน้ำนม', correct: true },
      { id: 's1_2', text: 'ประคบเย็นเพื่อลดอาการ', correct: true },
      { id: 's1_3', text: 'กดหรือนวดเต้านมอย่างรุนแรง', correct: false },
    ],
  },
  {
    id: 2,
    title: '2. หัวนมเจ็บ / หัวนมแตก',
    situation: 'ให้นมแล้วรู้สึกเจ็บบริเวณหัวนม และพบรอยแตกเล็กน้อย เวลาลูกดูดนมเจ็บมาก',
    prompt: 'เลือกวิธีจัดการที่เหมาะสม',
    options: [
      { id: 's2_1', text: 'จัดท่าให้นมและการเข้าเต้าที่ถูกต้อง', correct: true },
      { id: 's2_2', text: 'ใช้น้ำนมแม่ทาเคลือบหัวนม', correct: true },
      { id: 's2_3', text: 'ใช้แอลกอฮอล์เช็ดหัวนม', correct: false },
    ],
  },
  {
    id: 3,
    title: '3. มีก้อน และเจ็บเฉพาะจุด',
    situation: 'หลังคลอด 2 สัปดาห์ คลำพบก้อนเล็ก ๆ ที่เต้านมซ้าย เจ็บเมื่อกด ไม่แดง ไม่มีไข้',
    prompt: 'เลือกวิธีจัดการที่เหมาะสม',
    options: [
      { id: 's3_1', text: 'นวดอย่างอ่อนโยนขณะให้นม', correct: true },
      { id: 's3_2', text: 'สังเกตอาการอย่างต่อเนื่อง', correct: true },
      { id: 's3_3', text: 'หากไม่ดีขึ้นให้พบแพทย์', correct: true },
    ],
  },
  {
    id: 4,
    title: '4. เต้านมแดง ร้อน ปวดมาก (เต้านมอักเสบ)',
    situation: 'หลังคลอด 1 เดือน มีไข้ 38.5 °C เต้านมขวาแดง ร้อน ปวดมาก รู้สึกไม่สบาย',
    prompt: 'เลือกวิธีจัดการที่เหมาะสม',
    options: [
      { id: 's4_1', text: 'รับประทานยาเองและรอดูอาการ', correct: false },
      { id: 's4_2', text: 'ติดต่อบุคลากรสุขภาพเพื่อรับการประเมินทันที', correct: true },
    ],
  },
];

const MASSAGE_STEPS = [
  { id: 1, title: 'ขั้นตอนที่ 1 ประคองเต้านม', desc: 'วางมือด้านบนและด้านล่าง ขยับมือสวนทางกันเบา ๆ โดยไม่ให้เจ็บ' },
  { id: 2, title: 'ขั้นตอนที่ 2 นวดวนเบา ๆ', desc: 'นวดวนเบา ๆ รอบเต้านม ไม่กดลึกหรือขยี้ก้อนแข็ง' },
  { id: 3, title: 'ขั้นตอนที่ 3 ลูบเต้านมเบา ๆ', desc: 'ใช้มือประคองเต้า อีกมือลูบผิวเบา ๆ หากเต้าบวมให้ลูบไปทางรักแร้และอกด้านบน' },
  { id: 4, title: 'ขั้นตอนที่ 4 บีบน้ำนมด้วยมือ', desc: 'วางนิ้วหัวแม่มือกับนิ้วชี้ห่างฐานหัวนมประมาณ 3–4 ซม. กดเข้าหาหน้าอก → บีบ → คลาย ไม่ดึงหรือบีบหัวนม' },
];

export default function MotherCare3Room() {
  const { setRoom, completeModule, learningProgress, setHoldingBaby, sitDown, seatedTarget } = useStore();
  const openLightbox = useStore((s) => s.openLightbox);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [missionCollapsed, setMissionCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('massage'); // 'massage' | 'scenarios' | 'quiz'
  const [practicedSteps, setPracticedSteps] = useState([]);
  const [selectedOpts, setSelectedOpts] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [scenarioFeedback, setScenarioFeedback] = useState(null);
  const [activeHint, setActiveHint] = useState(null);

  // ห้อง Ward 103 ไม่เอาลูก/เตียงเด็ก ตามที่ลูกค้าสั่ง ("ไม่เอาลูก")
  useEffect(() => {
    setHoldingBaby(false);
  }, [setHoldingBaby]);

  const openGalleryAt = (index) => {
    const item = W103_GALLERY[index];
    openLightbox({
      ...item,
      caption: item.description,
      category: 'การดูแลเต้านม',
      items: W103_GALLERY.map((g) => ({
        ...g,
        caption: g.description,
        category: 'การดูแลเต้านม',
      })),
      currentIndex: index,
    });
  };

  const toggleMassageStep = (stepId) => {
    setPracticedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
  };

  const toggleScenarioOption = (scenId, optId) => {
    setSelectedOpts((prev) => {
      const cur = prev[scenId] || [];
      const next = cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId];
      return { ...prev, [scenId]: next };
    });
    setScenarioFeedback(null);
  };

  const checkAllScenarios = () => {
    for (const sc of W103_SCENARIOS) {
      const picked = selectedOpts[sc.id] || [];
      const correctIds = sc.options.filter((o) => o.correct).map((o) => o.id);
      const wrongPicked = picked.some((id) => !correctIds.includes(id));
      const allCorrectPicked = correctIds.every((id) => picked.includes(id));
      if (wrongPicked || !allCorrectPicked) {
        setScenarioFeedback({
          pass: false,
          msg: `✕ สถานการณ์ที่ ${sc.id} (${sc.title}) ยังเลือกไม่ครบหรือไม่ถูกต้อง กรุณาเลือกเฉพาะข้อที่ถูกต้อง (✓) ให้ครบทุกข้อ แล้วกดตรวจคำตอบอีกครั้งค่ะ`,
        });
        return;
      }
    }
    setScenarioFeedback({
      pass: true,
      msg: '✓ ยอดเยี่ยมมากค่ะ! คุณแม่เลือกวิธีจัดการปัญหาเต้านมได้ถูกต้องครบทั้ง 4 สถานการณ์',
    });
    completeModule('motherCare3');
  };

  // แบบประเมินความรู้ท้ายห้อง
  const room3Questions = getQuestionsByRoomKey('motherCare3');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const currentQ = room3Questions[quizIndex] || room3Questions[0];

  const handleQuizAnswer = (choice) => {
    if (quizShowFeedback) return;
    setQuizUserChoice(choice);
    setQuizShowFeedback(true);
    if (choice === currentQ.answer) setQuizScore((prev) => prev + 1);
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room3Questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare3');
    }
  };

  const handleSitAndPractice = () => {
    sitDown({
      id: 'room103_practice_sofa',
      name: 'โซฟาฝึกนวดเต้านมและทำสถานการณ์จำลอง',
      type: 'sofa',
      position: [0.5, 0, -0.2],
      rotationY: 0,
      seatOffset: [0, 0.46, 0.15],
      isDrivable: false,
    });
    setActiveHint('sofa');
    setShowActivityModal(true);
  };

  return (
    <group>
      {/* ── โครงสร้างห้องอบอุ่น พื้นไม้โอ๊คแท้ + ไฟหลุมฝ้าเพดานอบอุ่น (ตามภาพตัวอย่าง สมุดโน้ตไม่มีชื่อ 2 หน้า 2) ── */}
      <HospitalRoomShell
        theme="mother"
        cozyMode={true}
        doorZ={6.65}
        roomTitle="การดูแลเต้านม"
        roomNumber=""
      />

      {/* ── Top-Right Mission HUD (Responsive across 320px–4K & iOS Safari visualViewport) ── */}
      <ScreenPortal>
        <div
          className="fixed left-2.5 right-2.5 sm:left-auto sm:right-4 z-30 pointer-events-auto sm:max-w-xs sm:w-80 max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)-5.5rem)] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-2xl border-2 border-pink-400 text-slate-800"
          style={{ top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 4.25rem)' }}
        >
          <div
            onClick={() => setMissionCollapsed((v) => !v)}
            className={`flex items-center justify-between cursor-pointer select-none ${
              missionCollapsed ? '' : 'border-b border-pink-100 pb-2 mb-2'
            }`}
          >
            <span className="text-xs font-extrabold text-pink-900">
              🤱 ภารกิจห้องดูแลเต้านม
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  scenarioFeedback?.pass || learningProgress?.motherCare3
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-pink-100 text-pink-700'
                }`}
              >
                {scenarioFeedback?.pass || learningProgress?.motherCare3 ? 'สำเร็จแล้ว ✓' : 'กำลังเรียนรู้'}
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
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => openGalleryAt(0)}
                className="w-full p-2 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>🖼️ 1. ดูโปสเตอร์ความรู้รอบห้อง (5 ภาพ)</span>
                <span className="font-bold text-pink-700">เปิดดู ▶</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('massage');
                  handleSitAndPractice();
                }}
                className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                  practicedSteps.length === 4
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-950'
                }`}
              >
                <span>🛋️ 2. นั่งโซฟาฝึกนวดเต้านม ({practicedSteps.length}/4)</span>
                <span className="font-bold">{practicedSteps.length === 4 ? '☑ ครบแล้ว' : 'ฝึกทำ ▶'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('scenarios');
                  setShowActivityModal(true);
                }}
                className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                  scenarioFeedback?.pass
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-gradient-to-r from-pink-500 to-rose-600 border-pink-300 text-white shadow'
                }`}
              >
                <span>📋 3. ทำสถานการณ์จำลอง 4 ข้อ</span>
                <span className="font-bold">{scenarioFeedback?.pass ? '☑ สำเร็จ' : 'เริ่มทำ ▶'}</span>
              </button>
            </div>
          )}
        </div>
      </ScreenPortal>

      {/* แสงไฟโทนอบอุ่นสบายตาในห้อง */}
      <pointLight position={[0, 4.2, 0.5]} intensity={0.75} color="#ffd8a8" distance={14} />

      {/* ป้ายชื่อห้องด้านบนผนังกลาง (ติดผนังด้านใน z = -8.78 เหนือกรอบโปสเตอร์อย่างไม่ซ้อนทับ) */}
      <TitleSign
        position={[0, 5.52, -8.78]}
        width={5.2}
        height={1.15}
        line1="ZONE 1 การดูแลเต้านม"
        line2="การดูแลเต้านมและกระตุ้นการไหลของน้ำนม"
      />

      {/* หน้าต่างกระจกใสบานใหญ่เห็นวิวสวนภายนอกพร้อมผ้าม่าน ติดผนังด้านใน z = ±8.76 */}
      <WindowWithCurtains position={[-6.82, 2.8, -8.76]} width={2.25} height={2.75} />
      <WindowWithCurtains position={[6.82, 2.8, -8.76]} width={2.25} height={2.75} />
      <WindowWithCurtains position={[0, 2.85, 8.76]} rotation={[0, Math.PI, 0]} width={6.4} height={3.1} />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 1 (ซ้าย X = -8.78): ภาพตรง คมชัด ไร้พื้นหลัง พอดีกรอบสัดส่วนจริง 100%
          - ซ้าย: 1. การดูแลเต้านม — สังเกตความปกติของเต้านม (ดัด perspective ตรง 100%)
          - ขวา: การทำความสะอาดเต้านม & การประเมินเต้านมด้วยตนเอง (IMG_8524.JPG)
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel
        position={[-8.78, 2.75, -1.55]}
        rotation={[0, Math.PI / 2, 0]}
        width={9.4}
        height={4.2}
      >
        <FramedImagePoster3D
          position={[-2.30, 0, 0.02]}
          width={4.36}
          height={2.66}
          src="/images/rev/w103_wall1_left_straight.jpg"
          title=""
          badgeText=""
          onClick={() => openGalleryAt(0)}
        />
        <FramedImagePoster3D
          position={[2.32, 0, 0.02]}
          width={4.18}
          height={3.58}
          src="/images/rev/w103_clean_assess.jpg"
          title=""
          badgeText=""
          onClick={() => openGalleryAt(1)}
        />
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 2 (กลาง Z = -8.78): ภาพใหม่ 4 ขั้นตอนการนวดเต้านมและบีบน้ำนมด้วยมือ (1024x576 สัดส่วน 16:9 เป๊ะ ขยายขนาดใหญ่ตามคอมเมนต์ "ขอขยายใหญ่ๆ")
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel
        position={[0, 2.58, -8.78]}
        rotation={[0, 0, 0]}
        width={7.80}
        height={4.54}
      >
        <FramedImagePoster3D
          position={[0, 0, 0.02]}
          width={7.36}
          height={4.14}
          src="/images/rev/w103_wall2_massage_v2.jpg"
          title=""
          badgeText=""
          onClick={() => openGalleryAt(2)}
        />
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 3 (ขวา X = +8.78): โปสเตอร์ปัญหาเต้านม 4 อาการแผ่นเดียว คมชัด ตรง ไร้พื้นหลัง (IMG_8528.JPG)
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel
        position={[8.78, 2.75, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={4.0}
        height={4.95}
      >
        <FramedImagePoster3D
          position={[0, 0, 0.02]}
          width={3.56}
          height={4.64}
          src="/images/rev/w103_problems_all.jpg"
          title=""
          badgeText=""
          onClick={() => openGalleryAt(3)}
        />
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          🛋️ ชุดโซฟาตัว L ผ้าบุนุ่มสีเทาอมเบจ + หมอนรองให้นมรูปตัว U + สตูลถักสีเขียว + พรมทอ
             + โต๊ะกลมท็อปขาวขาไม้ + แท็บเล็ตสื่อการสอน (ตรงตามภาพตัวอย่าง สมุดโน้ตไม่มีชื่อ 2 หน้า 2)
          ══════════════════════════════════════════════════════════════════════════ */}
      <InteractiveSeat
        id="room103_practice_sofa"
        name="โซฟาฝึกนวดเต้านมและทำสถานการณ์จำลอง"
        type="sofa"
        position={[0.5, 0, -0.2]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.46, 0.15]}
      >
        <BillboardLabel3D
          position={[0, 1.56, -0.38]}
          text={
            seatedTarget?.id === 'room103_practice_sofa'
              ? '🤱 กำลังนั่งบนโซฟา — คลิกเปิดฝึกนวดเต้านม & สถานการณ์จำลอง'
              : '🛋️ คลิกนั่งโซฟาเพื่อฝึกนวดเต้านม & ทำสถานการณ์จำลอง 4 ข้อ'
          }
          bg="#ec4899"
          bgEnd="#be185d"
          width={2.15}
          height={0.36}
          pill={false}
          onClick={handleSitAndPractice}
        />
      </InteractiveSeat>

      <CozySectionalSofaSet
        onClickSofa={handleSitAndPractice}
        onClickTablet={() => {
          setShowActivityModal(true);
          setActiveTab('scenarios');
        }}
        tabletLabel="📋 คลิกแท็บเล็ตบนโต๊ะ: ทำสถานการณ์จำลอง 4 ข้อ"
        ipadMode="breastfeeding"
      />

      {/* ของตกแต่งมุมห้องอบอุ่นตามภาพตัวอย่าง (ตะกร้าหวายบนพรมกลม, ตู้ไม้โคมไฟอุ่น, ตุ๊กตากระต่าย, ต้นไม้) */}
      <CozyRoomDecorCorners />
      <RealPlant type="potted" position={[-7.6, 0, -7.2]} scale={1.2} />
      <RealPlant type="potted" position={[7.6, 0, -7.2]} scale={1.2} />
      <RealPlant type="succulent" position={[7.5, 0, 6.8]} scale={1.25} />

      {/* ══════════════════════════════════════════════════════════════════════════
          📋 หน้าต่างกิจกรรมฝึกนวดเต้านมบนโซฟา & สถานการณ์จำลอง 4 สถานการณ์ (IMG_7527.JPG)
          ══════════════════════════════════════════════════════════════════════════ */}
      {showActivityModal && (
        <ScreenPortal>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 95,
              fontFamily: '"Sarabun", system-ui, -apple-system, sans-serif',
            }}
            onClick={() => setShowActivityModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(980px, 96vw)',
                maxHeight: 'calc(var(--app-h, 100dvh) - 32px)',
                background: '#fffdf9',
                borderRadius: '22px',
                border: '3px solid #f472b6',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: 'linear-gradient(90deg, #fce7f3 0%, #fbcfe8 50%, #fde68a 100%)',
                  padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 24px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  borderBottom: '2px solid #f9a8d4',
                }}
              >
                <div>
                  <span style={{
                    background: '#db2777',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 900,
                  }}>
                    การดูแลเต้านม
                  </span>
                  <h2 style={{ margin: '6px 0 0', fontSize: 'clamp(16px, 3.2vw, 24px)', fontWeight: 900, color: '#831843' }}>
                    ฝึกปฏิบัติบนโซฟาและทำสถานการณ์จำลองการดูแลเต้านม
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => openGalleryAt(4)}
                    style={{
                      background: '#ffffff',
                      color: '#be185d',
                      border: '2px solid #f472b6',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: 'clamp(12px, 2.2vw, 14px)',
                      cursor: 'pointer',
                    }}
                  >
                    🖼️ ดูแผ่นภาพโจทย์เต็ม
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    style={{
                      background: '#be185d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontWeight: 900,
                      fontSize: 'clamp(12px, 2.4vw, 15px)',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ ปิด
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '6px', padding: '10px clamp(10px, 2.5vw, 24px) 0', background: '#fff5f7', flexWrap: 'wrap' }}>
                {[
                  { id: 'massage', label: '1. ฝึกนวดเต้านม (4 ขั้น)' },
                  { id: 'scenarios', label: '2. สถานการณ์จำลอง (4 ข้อ)' },
                  { id: 'quiz', label: '3. แบบทดสอบท้ายห้อง' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      flex: '1 1 130px',
                      padding: '9px 10px',
                      borderRadius: '12px 12px 0 0',
                      border: 'none',
                      background: activeTab === t.id ? '#db2777' : '#fce7f3',
                      color: activeTab === t.id ? '#ffffff' : '#9d174d',
                      fontWeight: 900,
                      fontSize: 'clamp(12px, 2.2vw, 16px)',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div style={{ padding: 'clamp(12px, 3vw, 22px)', overflowY: 'auto', flex: 1 }}>
                {activeTab === 'massage' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      onClick={() => openGalleryAt(2)}
                      style={{
                        background: '#e0f2fe',
                        borderRadius: '18px',
                        border: '2.5px solid #38bdf8',
                        padding: '10px',
                        cursor: 'zoom-in',
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src="/images/rev/w103_wall2_massage_v2.jpg"
                        alt="การนวดเต้านม 4 ขั้นตอน"
                        style={{ width: '100%', maxHeight: '520px', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto' }}
                      />
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', marginTop: '8px' }}>
                        🔍 คลิกที่ภาพเพื่อเปิดดูภาพขยายใหญ่เต็มจอ (ซูมขยายได้)
                      </div>
                    </div>

                    <div>
                      <div style={{
                        background: '#fef3c7',
                        border: '2px solid #f59e0b',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        marginBottom: '14px',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#92400e',
                      }}>
                        💡 นวดเบา ๆ วันละ 2–3 ครั้ง หรือก่อนให้นม/เมื่อรู้สึกคัดตึง (กดทำตามทีละขั้นตอนให้ครบทั้ง 4 ขั้นตอน)
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {MASSAGE_STEPS.map((st) => {
                          const done = practicedSteps.includes(st.id);
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => toggleMassageStep(st.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                                padding: '14px 18px',
                                borderRadius: '14px',
                                border: done ? '2.5px solid #16a34a' : '2px solid #f9a8d4',
                                background: done ? '#dcfce7' : '#ffffff',
                                color: '#1e293b',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '17px',
                                fontWeight: 800,
                              }}
                            >
                              <span>
                                <strong style={{ color: '#db2777' }}>{st.title}:</strong> {st.desc}
                              </span>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '999px',
                                background: done ? '#16a34a' : '#fce7f3',
                                color: done ? '#fff' : '#be185d',
                                fontSize: '14px',
                                fontWeight: 900,
                                flexShrink: 0,
                              }}>
                                {done ? '✓ ทำตามแล้ว' : 'กดฝึกทำตาม'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {practicedSteps.length === 4 && (
                        <div style={{ marginTop: '16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setActiveTab('scenarios')}
                            style={{
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '17px',
                              cursor: 'pointer',
                            }}
                          >
                            ฝึกครบ 4 ขั้นตอนแล้ว! ไปทำสถานการณ์จำลอง 4 ข้อ ➜
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'scenarios' && (
                  <div>
                    <div style={{
                      background: '#fdf2f8',
                      borderLeft: '5px solid #db2777',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '16px',
                      color: '#831843',
                      fontWeight: 700,
                    }}>
                      คำแนะนำ: อ่านสถานการณ์ทั้ง 4 ข้อ แล้วติ๊กเลือกวิธีจัดการที่เหมาะสมให้ครบทุกข้อตามหลักการดูแลเต้านม
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
                      {W103_SCENARIOS.map((sc) => {
                        const picked = selectedOpts[sc.id] || [];
                        return (
                          <div
                            key={sc.id}
                            style={{
                              background: '#ffffff',
                              borderRadius: '18px',
                              border: '2px solid #fbcfe8',
                              padding: '16px',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                            }}
                          >
                            <div style={{ fontSize: '19px', fontWeight: 900, color: '#be185d', marginBottom: '6px' }}>
                              {sc.title}
                            </div>
                            <div style={{
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: '10px',
                              padding: '10px 12px',
                              fontSize: '15px',
                              color: '#7c2d12',
                              fontWeight: 700,
                              marginBottom: '10px',
                            }}>
                              <strong>สถานการณ์:</strong> {sc.situation}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                              ❓ {sc.prompt}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {sc.options.map((opt) => {
                                const isChecked = picked.includes(opt.id);
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => toggleScenarioOption(sc.id, opt.id)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '10px',
                                      padding: '10px 14px',
                                      borderRadius: '12px',
                                      border: isChecked
                                        ? opt.correct
                                          ? '2px solid #16a34a'
                                          : '2px solid #dc2626'
                                        : '1.5px solid #cbd5e1',
                                      background: isChecked
                                        ? opt.correct
                                          ? '#dcfce7'
                                          : '#fee2e2'
                                        : '#f8fafc',
                                      color: '#0f172a',
                                      fontWeight: 800,
                                      fontSize: '15px',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                    }}
                                  >
                                    <span>
                                      {isChecked ? '☑ ' : '☐ '}
                                      {opt.text}
                                    </span>
                                    {isChecked && (
                                      <span style={{
                                        fontWeight: 900,
                                        color: opt.correct ? '#15803d' : '#dc2626',
                                        whiteSpace: 'nowrap',
                                      }}>
                                        {opt.correct ? '✓ ถูกต้อง' : '✕ ไม่เหมาะสม'}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {scenarioFeedback && (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        background: scenarioFeedback.pass ? '#dcfce7' : '#fee2e2',
                        color: scenarioFeedback.pass ? '#166534' : '#991b1b',
                        fontWeight: 900,
                        fontSize: '16px',
                      }}>
                        {scenarioFeedback.msg}
                      </div>
                    )}

                    <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={checkAllScenarios}
                        style={{
                          background: '#db2777',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 28px',
                          borderRadius: '14px',
                          fontWeight: 900,
                          fontSize: '17px',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ ยืนยันและตรวจคำตอบทั้ง 4 สถานการณ์
                      </button>

                      {scenarioFeedback?.pass && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setShowActivityModal(false)}
                            style={{
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🚶 อยู่ในห้อง 3D ต่อ (ปิดหน้าต่าง)
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('quiz')}
                            style={{
                              background: '#7c3aed',
                              color: '#ffffff',
                              border: 'none',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            📝 ทำแบบทดสอบทบทวน ➜
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    {!quizFinished ? (
                      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '2px solid #fbcfe8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, color: '#9d174d', flexWrap: 'wrap', gap: '6px' }}>
                          <span>แบบประเมินความรู้ การดูแลเต้านม</span>
                          <span>ข้อ {quizIndex + 1} / {room3Questions.length}</span>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>
                          "{currentQ.question}"
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                          {[
                            { val: true, label: '✓ ใช่ / ถูกต้อง' },
                            { val: false, label: '✕ ไม่ใช่ / ไม่ถูกต้อง' },
                          ].map((btn) => (
                            <button
                              key={String(btn.val)}
                              type="button"
                              disabled={quizShowFeedback}
                              onClick={() => handleQuizAnswer(btn.val)}
                              style={{
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 900,
                                borderRadius: '14px',
                                border: quizShowFeedback
                                  ? currentQ.answer === btn.val
                                    ? '2.5px solid #16a34a'
                                    : quizUserChoice === btn.val
                                    ? '2.5px solid #dc2626'
                                    : '2px solid #f472b6'
                                  : '2px solid #f472b6',
                                background: quizShowFeedback
                                  ? currentQ.answer === btn.val
                                    ? '#dcfce7'
                                    : quizUserChoice === btn.val
                                    ? '#fee2e2'
                                    : '#fff1f2'
                                  : '#fff1f2',
                                color: '#831843',
                                cursor: quizShowFeedback ? 'default' : 'pointer',
                              }}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        {quizShowFeedback && (
                          <div
                            style={{
                              background: quizUserChoice === currentQ.answer ? '#f0fdf4' : '#fff1f2',
                              border: `2px solid ${quizUserChoice === currentQ.answer ? '#86efac' : '#fda4af'}`,
                              padding: '14px',
                              borderRadius: '14px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 900,
                                fontSize: '17px',
                                color: quizUserChoice === currentQ.answer ? '#166534' : '#be123c',
                                marginBottom: '6px',
                              }}
                            >
                              {quizUserChoice === currentQ.answer ? '🎉 ถูกต้องค่ะ!' : `⚠️ ยังไม่ถูกต้อง — เฉลย: ${currentQ.answerText}`}
                            </div>
                            <div style={{ fontSize: '15px', color: '#334155', marginBottom: '12px' }}>
                              💡 {currentQ.reason}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextQuizQuestion}
                              style={{
                                background: '#db2777',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '12px',
                                fontWeight: 900,
                                fontSize: '16px',
                                cursor: 'pointer',
                              }}
                            >
                              {quizIndex < room3Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สรุปผลคะแนน 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px' }}>
                        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#15803d', marginBottom: '8px' }}>
                          🎉 ผ่านการเรียนรู้ การดูแลเต้านมเรียบร้อยแล้ว!
                        </h3>
                        <p style={{ fontSize: '17px', fontWeight: 700, color: '#475569', marginBottom: '18px' }}>
                          คะแนนแบบทดสอบทบทวน: {quizScore} / {room3Questions.length} คะแนน
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setShowActivityModal(false)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🚶 อยู่ในห้อง 3D ต่อ (เดินสำรวจห้อง)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuizIndex(0);
                              setQuizScore(0);
                              setQuizUserChoice(null);
                              setQuizShowFeedback(false);
                              setQuizFinished(false);
                            }}
                            style={{
                              background: '#fce7f3',
                              color: '#be185d',
                              border: '2px solid #f472b6',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🔄 ทำแบบประเมินซ้ำ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowActivityModal(false);
                              setRoom('lobby');
                            }}
                            style={{
                              background: '#db2777',
                              color: '#fff',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🏥 กลับสู่โถงล็อบบี้
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* ── GTA Player Controller ── */}
      <PlayerController initialPosition={[0, 0, 4.2]} />
    </group>
  );
}
