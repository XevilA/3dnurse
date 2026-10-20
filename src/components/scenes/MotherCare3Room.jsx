import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
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

// ── ข้อมูลโปสเตอร์ผนังทั้ง 3 ด้าน (ตามไฟล์สมุดโน้ตไม่มีชื่อ 2.pdf และ IMG_7528.JPG) ──
const W103_GALLERY = [
  {
    src: '/images/rev/w103_col1.jpg',
    title: 'ผนังที่ 1: 1. การดูแลเต้านม',
    badge: 'ผนังที่ 1 • Ward 103',
    description: 'สังเกตความปกติของเต้านม (ปกติ, บวม, แดง ร้อน, เจ็บ กดเจ็บ), การทำความสะอาดเต้านม และการประเมินเต้านมด้วยตนเอง',
    details: [
      'สังเกตความปกติของเต้านม: ปกติ / บวม / แดง ร้อน / เจ็บ กดเจ็บ',
      'การทำความสะอาดเต้านม: อาบน้ำด้วยน้ำสะอาด, ไม่ถูแรง, เช็ดให้แห้ง, ไม่ใช้สบู่/แอลกอฮอล์บริเวณหัวนม',
      'การประเมินเต้านมด้วยตนเอง: คลำหาก้อน, สังเกตผิวหนัง, ดูหัวนมและทิศทางการไหลของน้ำนม, สอบถามเมื่อมีความผิดปกติ',
    ],
  },
  {
    src: '/images/rev/w103_col2.jpg',
    title: 'ผนังที่ 2: 2. การนวดเต้านมและกระตุ้นการไหลของน้ำนม',
    badge: 'ผนังที่ 2 • Ward 103',
    description: 'นวดเบา ๆ วันละ 2–3 ครั้ง หรือก่อนให้นม/เมื่อรู้สึกคัดตึง',
    details: [
      '1. ใช้นิ้วมือวนเบา ๆ จากฐานเต้านมเข้าหาหัวนม',
      '2. นวดจากด้านนอกเข้าหาลานหัวนม',
      '3. ใช้นิ้วหัวแม่มือและนิ้วชี้คลึงเบา ๆ รอบลานหัวนม',
      '4. เคล้น/บีบเบา ๆ เข้าหาหัวนมเพื่อช่วยระบายน้ำนม',
    ],
  },
  {
    src: '/images/rev/w103_prob1.jpg',
    title: 'ผนังที่ 3 (รูปที่ 1): เต้านมคัดตึง (Breast engorgement)',
    badge: 'ผนังที่ 3 • รูปที่ 1/4',
    description: 'อาการ: เต้านมแข็ง ตึง เจ็บ, รู้สึกร้อนหนัก, ลูกดูดไม่สะดวก',
    details: [
      'ให้ลูกดูดบ่อยขึ้น',
      'ประคบอุ่นก่อนให้นม 5–10 นาที',
      'นวดเบา ๆ และระบายน้ำนม',
      'สวมเสื้อในที่รองรับ ไม่รัดแน่น',
    ],
  },
  {
    src: '/images/rev/w103_prob2.jpg',
    title: 'ผนังที่ 3 (รูปที่ 2): หัวนมเจ็บ / หัวนมแตก (Nipple pain / cracked nipple)',
    badge: 'ผนังที่ 3 • รูปที่ 2/4',
    description: 'อาการ: เจ็บแสบขณะให้นม, หัวนมแดง แห้ง แตก, อาจมีเลือดออก',
    details: [
      'ตรวจและแก้ท่าให้นม/การเข้าเต้า',
      'บีบน้ำนมทาลานหัวนม',
      'ปล่อยให้แห้ง ลดการเสียดสี',
      'หากไม่ดีขึ้น ควรพบแพทย์',
    ],
  },
  {
    src: '/images/rev/w103_prob3.jpg',
    title: 'ผนังที่ 3 (รูปที่ 3): ท่อน้ำนมอุดตัน (Blocked duct)',
    badge: 'ผนังที่ 3 • รูปที่ 3/4',
    description: 'อาการ: คลำพบก้อนแข็ง, เจ็บเป็นจุด, อาจมีผิวหนังแดงเล็กน้อย',
    details: [
      'ให้ลูกดูดบ่อย กระตุ้นการไหล',
      'นวดเบา ๆ จากด้านนอกเข้าหาหัวนม',
      'ประคบอุ่นก่อนให้นม',
      'หากมีไข้ ปวดมาก ควรพบแพทย์',
    ],
  },
  {
    src: '/images/rev/w103_prob4.jpg',
    title: 'ผนังที่ 3 (รูปที่ 4): เต้านมอักเสบ (Mastitis)',
    badge: 'ผนังที่ 3 • รูปที่ 4/4',
    description: 'อาการ: เต้านมแดง ร้อน บวม, เจ็บมาก, อาจมีไข้ อ่อนเพลีย',
    details: [
      'พักผ่อน ดื่มน้ำมาก ๆ',
      'ให้ลูกดูดต่อเนื่อง/ระบายน้ำนม',
      'รับประทานยาตามแพทย์สั่ง',
      'พบแพทย์ทันที',
    ],
  },
  {
    src: '/images/rev/w103_scenarios.jpg',
    title: 'สถานการณ์จำลอง: การดูแลเต้านม (4 สถานการณ์)',
    badge: 'สถานการณ์จำลอง • Ward 103',
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
      { id: 's2_2', text: 'ทาน้ำนมแม่หรือครีมบำรุง', correct: true },
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
  { id: 1, title: 'ขั้นตอนที่ 1', desc: 'ใช้นิ้วมือวนเบา ๆ จากฐานเต้านมเข้าหาหัวนม' },
  { id: 2, title: 'ขั้นตอนที่ 2', desc: 'นวดจากด้านนอกเข้าหาลานหัวนม' },
  { id: 3, title: 'ขั้นตอนที่ 3', desc: 'ใช้นิ้วหัวแม่มือและนิ้วชี้คลึงเบา ๆ รอบลานหัวนม' },
  { id: 4, title: 'ขั้นตอนที่ 4', desc: 'เคล้น/บีบเบา ๆ เข้าหาหัวนมเพื่อช่วยระบายน้ำนม' },
];

export default function MotherCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal, setHoldingBaby, sitDown, seatedTarget } = useStore();
  const openLightbox = useStore((s) => s.openLightbox);

  const [showActivityModal, setShowActivityModal] = useState(false);
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
    openLightbox({
      ...W103_GALLERY[index],
      items: W103_GALLERY,
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
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้อง Ward 103 การดูแลเต้านมเรียบร้อยแล้ว`
      );
    }
  };

  const handleSitAndPractice = () => {
    sitDown({
      id: 'room103_practice_sofa',
      name: 'โซฟาฝึกนวดเต้านมและทำสถานการณ์จำลอง',
      type: 'sofa',
      position: [0, 0, -0.2],
      rotationY: 0,
      seatOffset: [0, 0.44, 0.15],
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
        roomTitle="ห้องบริบาลมารดา 3: การดูแลเต้านม"
        roomNumber="Ward 103"
      />

      {/* แสงไฟโทนอบอุ่นสบายตาในห้อง */}
      <pointLight position={[0, 4.2, 0.5]} intensity={0.75} color="#ffd8a8" distance={14} />

      {/* ป้ายชื่อห้องด้านบนผนังกลาง (ติดผนังด้านใน z = -8.78 อย่างแนบสนิท) */}
      <TitleSign
        position={[0, 5.05, -8.78]}
        width={5.4}
        height={1.55}
        line1="ZONE 1 การดูแลเต้านม"
        line2="Ward 103 • การดูแลเต้านมและกระตุ้นน้ำนม"
      />

      {/* หน้าต่างบานใหญ่พร้อมผ้าม่านโทนอบอุ่น ติดผนังด้านใน z = -8.78 */}
      <WindowWithCurtains position={[-5.6, 2.8, -8.78]} width={3.4} height={2.8} />
      <WindowWithCurtains position={[5.6, 2.8, -8.78]} width={3.4} height={2.8} />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 1 (ซ้าย X = -8.78): กรอบไม้ 3D แท้ติดผนัง แปะภาพ "1 การดูแลเต้านม" + โจทย์ 4 สถานการณ์
          ══════════════════════════════════════════════════════════════════════════ */}
      <FramedImagePoster3D
        position={[-8.78, 2.75, -2.35]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.2}
        height={4.6}
        src="/images/rev/w103_col1.jpg"
        title="ผนังที่ 1: 1. การดูแลเต้านม"
        badgeText="🔍 คลิกขยาย"
        headerColor="#db2777"
        onClick={() => openGalleryAt(0)}
      />

      <FramedImagePoster3D
        position={[-8.78, 2.75, 2.55]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.2}
        height={4.6}
        src="/images/rev/w103_scenarios.jpg"
        title="สถานการณ์จำลอง: การดูแลเต้านม (4 ข้อ)"
        badgeText="🔍 คลิกขยาย"
        headerColor="#be185d"
        onClick={() => openGalleryAt(6)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 2 (กลาง Z = -8.78): กรอบไม้ 3D แท้ติดผนัง "2 การนวดเต้านมและกระตุ้นการไหลของน้ำนม"
          ══════════════════════════════════════════════════════════════════════════ */}
      <FramedImagePoster3D
        position={[0, 2.45, -8.78]}
        rotation={[0, 0, 0]}
        width={4.4}
        height={3.9}
        src="/images/rev/w103_col2.jpg"
        title="ผนังที่ 2: 2. การนวดเต้านมและกระตุ้นน้ำนม"
        badgeText="🔍 คลิกขยาย"
        headerColor="#0284c7"
        onClick={() => openGalleryAt(1)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 3 (ขวา X = +8.78): กรอบไม้ไฟซ่อน LED ติดผนัง แปะรูป 1, 2, 3, 4 จัดเรียง 2x2 ด้วย 3D Mesh แท้
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel
        position={[8.78, 2.75, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={7.6}
        height={4.9}
      >
        {[
          { idx: 2, pos: [-1.82, 1.12, 0.02], label: '1. เต้านมคัดตึง', img: '/images/rev/w103_prob1.jpg' },
          { idx: 3, pos: [1.82, 1.12, 0.02], label: '2. หัวนมเจ็บ / หัวนมแตก', img: '/images/rev/w103_prob2.jpg' },
          { idx: 4, pos: [-1.82, -1.12, 0.02], label: '3. ท่อน้ำนมอุดตัน', img: '/images/rev/w103_prob3.jpg' },
          { idx: 5, pos: [1.82, -1.12, 0.02], label: '4. เต้านมอักเสบ', img: '/images/rev/w103_prob4.jpg' },
        ].map((card) => (
          <FramedImagePoster3D
            key={card.idx}
            position={card.pos}
            width={3.4}
            height={2.05}
            src={card.img}
            title={card.label}
            badgeText="🔍 ขยาย"
            headerColor="#ea580c"
            onClick={() => openGalleryAt(card.idx)}
          />
        ))}
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
        seatOffset={[0, 0.44, 0.15]}
      >
        <Html position={[0, 1.38, 0]} center distanceFactor={12} zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSitAndPractice();
            }}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '999px',
              padding: '8px 20px',
              fontWeight: 900,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(190,24,93,0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            {seatedTarget?.id === 'room103_practice_sofa'
              ? '🤱 กำลังนั่งบนโซฟา — คลิกเพื่อเปิดฝึกนวดเต้านม & สถานการณ์จำลอง'
              : '🛋️ คลิกนั่งโซฟาเพื่อฝึกนวดเต้านม & ทำสถานการณ์จำลอง 4 ข้อ'}
          </button>
        </Html>
      </InteractiveSeat>

      <CozySectionalSofaSet
        onClickSofa={handleSitAndPractice}
        onClickTablet={() => {
          setShowActivityModal(true);
          setActiveTab('scenarios');
        }}
        tabletLabel="📋 คลิกแท็บเล็ตบนโต๊ะ: ทำสถานการณ์จำลอง 4 ข้อ"
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
        <Html fullscreen zIndexRange={[120, 0]}>
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
              zIndex: 200,
              fontFamily: '"Sarabun", system-ui, -apple-system, sans-serif',
            }}
            onClick={() => setShowActivityModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(980px, 96vw)',
                maxHeight: '90vh',
                background: '#fffdf9',
                borderRadius: '26px',
                border: '4px solid #f472b6',
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
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #f9a8d4',
                }}
              >
                <div>
                  <span style={{
                    background: '#db2777',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 900,
                  }}>
                    Ward 103 • การดูแลเต้านม
                  </span>
                  <h2 style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: 900, color: '#831843' }}>
                    ฝึกปฏิบัติบนโซฟาและทำสถานการณ์จำลองการดูแลเต้านม
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openGalleryAt(6)}
                    style={{
                      background: '#ffffff',
                      color: '#be185d',
                      border: '2px solid #f472b6',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
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
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontWeight: 900,
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ ปิดหน้าต่าง
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '10px', padding: '14px 24px 0', background: '#fff5f7' }}>
                {[
                  { id: 'massage', label: '1. นั่งโซฟาฝึกนวดเต้านมทำตาม (4 ขั้นตอน)' },
                  { id: 'scenarios', label: '2. สถานการณ์จำลองการดูแลเต้านม (4 สถานการณ์)' },
                  { id: 'quiz', label: '3. แบบทดสอบท้ายห้อง' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: '14px 14px 0 0',
                      border: 'none',
                      background: activeTab === t.id ? '#db2777' : '#fce7f3',
                      color: activeTab === t.id ? '#ffffff' : '#9d174d',
                      fontWeight: 900,
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
                {activeTab === 'massage' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' }}>
                    <div
                      onClick={() => openGalleryAt(1)}
                      style={{
                        background: '#f0f9ff',
                        borderRadius: '18px',
                        border: '2px solid #bae6fd',
                        padding: '10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src="/images/rev/w103_col2.jpg"
                        alt="การนวดเต้านม 4 ขั้นตอน"
                        style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '12px' }}
                      />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginTop: '6px' }}>
                        🔍 คลิกที่ภาพเพื่อขยายใหญ่
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
                                shrink: 0,
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

                    <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <button
                          type="button"
                          onClick={() => setActiveTab('quiz')}
                          style={{
                            background: '#7c3aed',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontWeight: 900,
                            fontSize: '17px',
                            cursor: 'pointer',
                          }}
                        >
                          ไปทำแบบทดสอบท้ายห้อง ➜
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    {!quizFinished ? (
                      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '2px solid #fbcfe8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, color: '#9d174d' }}>
                          <span>แบบประเมินความรู้ Ward 103</span>
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
                                border: '2px solid #f472b6',
                                background: quizShowFeedback && currentQ.answer === btn.val ? '#dcfce7' : '#fff1f2',
                                color: '#831843',
                                cursor: quizShowFeedback ? 'default' : 'pointer',
                              }}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        {quizShowFeedback && (
                          <div style={{ background: '#f0fdf4', border: '2px solid #86efac', padding: '14px', borderRadius: '14px' }}>
                            <div style={{ fontWeight: 900, fontSize: '17px', color: '#166534', marginBottom: '6px' }}>
                              {quizUserChoice === currentQ.answer ? '🎉 ถูกต้องค่ะ!' : `เฉลย: ${currentQ.answerText}`}
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
                              {quizIndex < room3Questions.length - 1 ? 'ข้อถัดไป ➜' : 'เสร็จสิ้นบทเรียน 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px' }}>
                        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#15803d' }}>
                          🎉 ผ่านการเรียนรู้ Ward 103 การดูแลเต้านมเรียบร้อยแล้ว!
                        </h3>
                        <button
                          type="button"
                          onClick={() => setRoom('lobby')}
                          style={{
                            marginTop: '14px',
                            background: '#db2777',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 26px',
                            borderRadius: '14px',
                            fontWeight: 900,
                            fontSize: '17px',
                            cursor: 'pointer',
                          }}
                        >
                          กลับสู่ล็อบบี้ 🏥
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* ── GTA Player Controller ── */}
      <PlayerController initialPosition={[0, 0, 4.2]} />
    </group>
  );
}
