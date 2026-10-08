import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import HospitalNightstand from '../furniture/HospitalNightstand';
import MedicalCart from '../furniture/MedicalCart';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import Pillows from '../decorations/Pillows';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import DoctorDesk from '../furniture/DoctorDesk';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function MotherCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
  const [activeTab, setActiveTab] = useState(0); // 0: การดูแลเต้านม, 1: การนวดเต้านม, 2: ปัญหาเต้านม 4 สถานการณ์, 3: แบบประเมิน

  // ── กิจกรรม 1: การดูแลเต้านมและทำความสะอาด ──
  const [act1Behaviors, setAct1Behaviors] = useState([
    { id: 'inspect', text: 'สังเกตผิวหนังเต้านม อาการบวม แดง ร้อน และอาการเจ็บเป็นประจำ', cat: null, correct: 'do', reason: 'ช่วยให้สังเกตพบความผิดปกติได้ตั้งแต่ระยะแรกเริ่ม' },
    { id: 'shower', text: 'อาบน้ำทำความสะอาดร่างกายตามปกติ ซับแห้งอย่างเบามือด้วยผ้าสะอาด', cat: null, correct: 'do', reason: 'รักษาความสะอาดโดยไม่ทำให้ผิวหนังระคายเคือง' },
    { id: 'rough_rub', text: 'ขยี้หรือถูหัวนมแรงๆ เพื่อกระตุ้นหรือทำความสะอาด', cat: null, correct: 'avoid', reason: 'ทำให้ผิวหนังหัวนมถลอก เกิดแผลแตก และเจ็บแสบ' },
    { id: 'alcohol_soap', text: 'ฟอกสบู่ที่มีฤทธิ์แรง หรือใช้แอลกอฮอล์เช็ดบริเวณหัวนมเป็นประจำ', cat: null, correct: 'avoid', reason: 'ทำลายไขมันตามธรรมชาติที่ต่อม Montgomery สร้างขึ้น ทำให้หัวนมแห้งแตกง่าย' },
  ]);
  const [act1Feedback, setAct1Feedback] = useState(null);

  const assignAct1 = (id, targetCat) => {
    setAct1Behaviors(prev => prev.map(b => b.id === id ? { ...b, cat: targetCat } : b));
    setAct1Feedback(null);
  };

  const checkAct1 = () => {
    const allFilled = act1Behaviors.every(b => b.cat !== null);
    if (!allFilled) {
      setAct1Feedback({ pass: false, msg: 'กรุณาจัดหมวดหมู่พฤติกรรมให้ครบทุกข้อก่อนตรวจคำตอบครับ' });
      return;
    }
    const isAllCorrect = act1Behaviors.every(b => b.cat === b.correct);
    if (isAllCorrect) {
      setAct1Feedback({
        pass: true,
        msg: '✓ ถูกต้องทั้งหมด! การสังเกตและดูแลเต้านมอย่างอ่อนโยนช่วยรักษาความชุ่มชื้นตามธรรมชาติ และป้องกันการเกิดแผลหัวนมแตก (Tharana & Somsap 2024)'
      });
    } else {
      setAct1Feedback({
        pass: false,
        msg: '✕ ยังมีบางข้อไม่ถูกต้อง: ควรหลีกเลี่ยงการขยี้แรง หรือใช้แอลกอฮอล์/สบู่แรงเช็ดหัวนม เพราะจะทำให้หัวนมแห้งแตก'
      });
    }
  };

  // ── กิจกรรม 2: การนวดเต้านมและกระตุ้นการไหลของน้ำนม ──
  const [massagePressure, setMassagePressure] = useState(null); // 'gentle' | 'hard'
  const [massageChecklist, setMassageChecklist] = useState([]);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const massageRules = [
    { id: 'clean_hands', text: 'ล้างมือให้สะอาดก่อนสัมผัสเต้านมเสมอ', correct: true },
    { id: 'gentle_touch', text: 'ประคองและลูบคลึงอย่างนุ่มนวลตามแนวท่อน้ำนม', correct: true },
    { id: 'stop_if_pain', text: 'หยุดกิจกรรมทันทีหากมีอาการเจ็บหรือปวดมาก', correct: true },
    { id: 'force_milk', text: 'ออกแรงกด บีบ หรือคลึงรุนแรงเพื่อให้มีน้ำนมพุ่งออกมาเร็วขึ้น', correct: false },
  ];

  const toggleMassageRule = (id) => {
    setMassageChecklist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setAct2Feedback(null);
  };

  const checkAct2 = () => {
    if (!massagePressure) {
      setAct2Feedback({ pass: false, msg: 'กรุณาเลือกระดับแรงกดในการนวดเต้านม' });
      return;
    }
    const hasUnsafe = massageChecklist.includes('force_milk');
    const hasAllSafe = massageChecklist.includes('clean_hands') && massageChecklist.includes('gentle_touch') && massageChecklist.includes('stop_if_pain');

    if (massagePressure === 'hard') {
      setAct2Feedback({ pass: false, msg: '✕ ไม่ควรใช้แรงกดรุนแรง! การบีบหรือกดแรงทำให้เนื้อเยื่อเต้านมอักเสบ บอบช้ำ และท่อน้ำนมบาดเจ็บ' });
    } else if (hasUnsafe) {
      setAct2Feedback({ pass: false, msg: '✕ การออกแรงกดบีบรุนแรงเพื่อเค้นน้ำนมเป็นสิ่งที่ไม่ควรทำ เพราะเสี่ยงต่อเต้านมอักเสบ' });
    } else if (hasAllSafe) {
      setAct2Feedback({
        pass: true,
        msg: '✓ ถูกต้องทั้งหมด! การนวดเต้านมต้องใช้แรงเบานุ่มนวล มือสะอาด และหยุดเมื่อเจ็บ (Butdapan et al. 2024) ไม่ควรกดแรงจนเจ็บ'
      });
    } else {
      setAct2Feedback({ pass: false, msg: '✕ กรุณาเลือกหลักการนวดที่ถูกต้องและปลอดภัยให้ครบทั้ง 3 ข้อ' });
    }
  };

  // ── กิจกรรม 3: การจัดการปัญหาที่พบบ่อยของเต้านม 4 สถานการณ์ ──
  const [activeScenario, setActiveScenario] = useState('A'); // A, B, C, D
  const [scenarioAnswers, setScenarioAnswers] = useState({
    A: null,
    B: null,
    C: null,
    D: null
  });
  const [act3Feedback, setAct3Feedback] = useState(null);

  const scenarios = {
    A: {
      code: 'A',
      title: 'สถานการณ์ A: เต้านมคัดตึง (Breast Engorgement)',
      symptom: 'คุณแม่รู้สึกเต้านมตึง แข็ง ผิวตึงเงา และไม่สบายเต้านมในวันที่ 3 หลังคลอด',
      options: [
        { id: 'opt_A1', text: 'ให้ลูกดูดเร็วและบ่อย (ทุก 2–3 ชม.) ระบายน้ำนมออก และประคบเย็นหลังให้นมเพื่อลดบวม', correct: true },
        { id: 'opt_A2', text: 'งดให้นมและทนรอให้เต้านมยุบไปเอง', correct: false },
        { id: 'opt_A3', text: 'บีบเค้นเต้านมอย่างรุนแรงจนช้ำเพื่อให้หายคัด', correct: false }
      ],
      solution: 'เต้านมคัดตึงแก้ได้ด้วยการระบายน้ำนมอย่างสม่ำเสมอ ประคบอุ่นสั้นๆ ก่อนให้นม และประคบเย็นหลังให้นมเพื่อลดปวดบวม'
    },
    B: {
      code: 'B',
      title: 'สถานการณ์ B: หัวนมเจ็บหรือแตก (Sore/Cracked Nipple)',
      symptom: 'คุณแม่รู้สึกเจ็บแปลบที่หัวนมขณะลูกดูดนม และเห็นรอยแตกตื้นๆ ที่ปลายหัวนม',
      options: [
        { id: 'opt_B1', text: 'ทบทวนและปรับท่าให้นม ให้ลูกอ้าปากกว้าง อมลึกถึงลานนม ไม่ใช่อมเฉพาะหัวนม', correct: true },
        { id: 'opt_B2', text: 'ทาแอลกอฮอล์เพื่อฆ่าเชื้อที่รอยแตกทุก 1 ชั่วโมง', correct: false },
        { id: 'opt_B3', text: 'ให้ลูกดูดเฉพาะปลายหัวนมเบาๆ', correct: false }
      ],
      solution: 'สาเหตุหลักของหัวนมแตกคือการเข้าเต้าไม่ลึกพอ ปรับให้ทารกอมลึกถึงลานนม (Asymmetrical latch) จะไม่เจ็บหัวนม'
    },
    C: {
      code: 'C',
      title: 'สถานการณ์ C: ท่อน้ำนมอุดตัน / ก้อนเจ็บเฉพาะจุด (Plugged Duct)',
      symptom: 'คลำได้ก้อนไตแข็งขนาดเล็ก กดเจ็บเฉพาะจุด ไม่มีไข้ เต้านมไม่แดงเป็นวงกว้าง',
      options: [
        { id: 'opt_C1', text: 'นวดคลึงเบาๆ บริเวณก้อนขณะลูกดูด ให้ลูกดูดเต้าที่มีก้อนก่อน และจัดคางลูกชี้ไปทางก้อน', correct: true },
        { id: 'opt_C2', text: 'ใช้เข็มเจาะก้อนไตเองที่บ้าน', correct: false },
        { id: 'opt_C3', text: 'งดให้ลูกดูดเต้าข้างนั้นตลอดไป', correct: false }
      ],
      solution: 'การให้ลูกดูดโดยจัดคางชี้ไปทางก้อนไต และประคบอุ่นพร้อมนวดเบาๆ ช่วยระบายน้ำนมที่คั่งค้างในท่อได้ดีที่สุด'
    },
    D: {
      code: 'D',
      title: 'สถานการณ์ D: เต้านมอักเสบ (Mastitis)',
      symptom: 'เต้านมบวม แดงเป็นปื้น ร้อน ปวดรุนแรง ร่วมกับมีไข้สูง ≥ 38.5°C หนาวสั่น อ่อนเพลีย',
      options: [
        { id: 'opt_D1', text: 'เป็นสัญญาณอันตราย! ต้องรีบติดต่อบุคลากรสุขภาพเพื่อรับยาปฏิชีวนะและการรักษาทันที', correct: true },
        { id: 'opt_D2', text: 'นวดคลึงรุนแรงเองที่บ้านต่อไปโดยไม่ต้องพบแพทย์', correct: false },
        { id: 'opt_D3', text: 'ซื้อยาชุดมาทานเองโดยไม่ปรึกษาแพทย์', correct: false }
      ],
      solution: 'เต้านมอักเสบติดเชื้อต้องได้รับการประเมินและรักษาด้วยยาปฏิชีวนะจากแพทย์ทันที ห้ามพึ่งการนวดเพียงอย่างเดียว'
    }
  };

  const handleSelectScenarioOpt = (scenarioKey, optId) => {
    setScenarioAnswers(prev => ({ ...prev, [scenarioKey]: optId }));
    setAct3Feedback(null);
  };

  const checkAct3 = () => {
    const isA = scenarioAnswers.A === 'opt_A1';
    const isB = scenarioAnswers.B === 'opt_B1';
    const isC = scenarioAnswers.C === 'opt_C1';
    const isD = scenarioAnswers.D === 'opt_D1';

    if (!scenarioAnswers.A || !scenarioAnswers.B || !scenarioAnswers.C || !scenarioAnswers.D) {
      setAct3Feedback({ pass: false, msg: 'กรุณาตอบคำถามให้ครบทั้ง 4 สถานการณ์ (A, B, C, D) ก่อนตรวจคำตอบครับ' });
      return;
    }

    if (isA && isB && isC && isD) {
      setAct3Feedback({
        pass: true,
        msg: '✓ ถูกต้องครบทั้ง 4 สถานการณ์! คุณแม่เข้าใจแนวทางการดูแลเต้านมคัดตึง หัวนมเจ็บ ท่อน้ำนมอุดตัน และรู้ว่าเต้านมอักเสบมีไข้สูงต้องพบแพทย์ทันที'
      });
    } else {
      setAct3Feedback({
        pass: false,
        msg: '✕ ยังมีบางสถานการณ์ที่เลือกวิธีแก้ไขไม่ถูกต้อง ลองทบทวนว่ากรณีใดดูแลเบื้องต้นได้ และกรณีใดเป็นสัญญาณอันตรายที่ต้องพบแพทย์'
      });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 3, 9 & 14) ──
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
    if (choice === currentQ.answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room3Questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare3');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้องที่ 3 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room3Questions.length} คะแนน)`
      );
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 3: การดูแลเต้านมและเทคนิคการให้นมบุตร"
        roomNumber="Lactation Ward 103"
      />

      {/* ── REAL 3D CLINICAL ASSETS & ARCHITECTURE ── */}
      <RealPlant type="potted" position={[7.5, 0, -7.5]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <HospitalTrashBin position={[8.3, 0, 0.8]} scale={0.85} />

      {/* ── 1. Ergonomic Nursing Chair (กิจกรรม 1: สังเกตเต้านมและการดูแล) ── */}
      <InteractiveSeat
        id="room103_nursing_chair"
        name="เก้าอี้ให้นมบุตรสรีรศาสตร์"
        type="chair"
        position={[-5.2, 0, -6.0]}
        rotation={[0, Math.PI / 6, 0]}
        seatOffset={[0, 0.48, 0]}
      >
        <group onClick={() => setActiveTab(0)}>
          <NursingChair position={[0, 0, 0]} scale={1.1} />
        </group>
      </InteractiveSeat>

      {/* ── 2. Bedside Nightstand with Hydration & Breast Pump Accessories ── */}
      <group position={[-7.0, 0, -6.8]} onClick={() => setActiveTab(0)}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.05}>
          <FlowerVase position={[0.12, 0.82, 0.08]} scale={0.65} />
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.26, 24]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.9} roughness={0.05} />
          </mesh>
        </HospitalNightstand>
      </group>

      {/* ── 3. Baby Crib with Resting Newborn (Rooming-in beside nursing chair) ── */}
      <group position={[-3.2, 0, -6.0]} rotation={[0, -0.15, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
          )}
        </BabyCrib>
        <Html position={[0, 1.25, 0]} center distanceFactor={12}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg"
            style={{
              background: isHoldingBaby ? 'rgba(16, 185, 129, 0.95)' : 'rgba(236, 72, 153, 0.95)',
              color: 'white',
              border: '2px solid white',
              whiteSpace: 'nowrap',
            }}
          >
            {isHoldingBaby ? '🧸 วางลูกน้อยลงเปล' : '👶 ลูกน้อย (คลิกอุ้ม)'}
          </div>
        </Html>
      </group>

      {/* ── 4. Velvet Nursing Recliner / Lounge Sofa (กิจกรรม 2: การนวดเต้านม) ── */}
      <InteractiveSeat
        id="room103_sofa"
        name="โซฟาพักผ่อนให้นม"
        type="sofa"
        position={[5.4, 0, -6.5]}
        rotation={[0, -Math.PI / 6, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <group onClick={() => setActiveTab(1)}>
          <HospitalSofa position={[0, 0, 0]} scale={1.1} />
          <Pillows position={[-0.2, 0.45, 0]} scale={0.85} />
        </group>
      </InteractiveSeat>

      {/* ── 5. Medical Cart with Breast Pumps & Hot/Cold Compresses (กิจกรรม 3: ปัญหาเต้านม) ── */}
      <group position={[7.8, 0, -2.0]} rotation={[0, -Math.PI / 2, 0]} onClick={() => setActiveTab(2)}>
        <MedicalCart position={[0, 0, 0]} scale={1.05} />
      </group>

      {/* ── 6. Clinical Consultation Desk & Quiz Kiosk (กิจกรรม 4: แบบประเมิน) ── */}
      <group position={[7.8, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} onClick={() => setActiveTab(3)}>
        <DoctorDesk position={[0, 0, 0]} scale={0.85} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          🤱 INTERACTIVE LEARNING HUD (Based on Manual Zone 1: Breast Care)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html position={[0, 1.85, -7.8]} center transform scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.22 : 0.27}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '24px',
          borderRadius: '24px',
          width: '880px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '3px solid #f48fb1',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fce4ec', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ background: '#e91e63', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                ZONE 1: การดูแลเต้านมและเทคนิคการให้นมบุตร (Ward 103)
              </span>
              <h2 style={{ margin: '6px 0 0 0', color: '#c2185b', fontSize: '22px' }}>
                {activeTab === 0 && 'กิจกรรม 1 — การสังเกตและดูแลเต้านม'}
                {activeTab === 1 && 'กิจกรรม 2 — การนวดเต้านมและกระตุ้นการไหลของน้ำนม'}
                {activeTab === 2 && 'กิจกรรม 3 — การจัดการปัญหาเต้านมที่พบบ่อย (4 สถานการณ์)'}
                {activeTab === 3 && 'แบบประเมินความรู้ประจำห้องที่ 3 (ข้อ 3, 9 & 14)'}
              </h2>
            </div>
            <button
              onClick={() => setRoom('lobby')}
              style={{ background: '#f3f4f6', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ⬅ กลับสู่ล็อบบี้
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {['1. การดูแลเต้านม', '2. การนวดเต้านม', '3. จัดการปัญหาเต้านม (4 ข้อ)', '4. แบบประเมิน (Quiz)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === idx ? '#e91e63' : '#fce4ec',
                  color: activeTab === idx ? 'white' : '#c2185b',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── TAB 0: กิจกรรม 1 — การสังเกตและดูแลเต้านม ── */}
          {activeTab === 0 && (
            <div>
              <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
                <strong>เป้าหมาย:</strong> ให้คุณแม่ฝึกสังเกตความผิดปกติของเต้านม และเลือกพฤติกรรมการดูแลความสะอาดที่เหมาะสมและอ่อนโยน
              </div>

              {/* Reference Infographic Header */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <img
                  src="/references/mother_zone1/breast_care.png"
                  alt="การดูแลเต้านม"
                  style={{ width: '130px', height: '90px', objectFit: 'contain', borderRadius: '8px', background: 'white', border: '1px solid #cbd5e1', padding: '2px' }}
                />
                <div style={{ flex: 1, fontSize: '12.5px', color: '#475569', lineHeight: '1.4' }}>
                  <strong style={{ color: '#be185d', fontSize: '13px' }}>คำแนะนำจากหลักสูตร:</strong>
                  <br />
                  เต้านมเป็นอวัยวะที่บอบบางในช่วงให้นมบุตร ทำความสะอาดด้วยน้ำสะอาด ไม่ขยี้แรง ไม่ใช้สบู่หรือแอลกอฮอล์เพื่อป้องกันผิวแห้งแตก
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {act1Behaviors.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '500' }}>
                      {b.text}
                      {act1Feedback && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>💡 {b.reason}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => assignAct1(b.id, 'do')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: b.cat === 'do' ? '#16a34a' : '#cbd5e1',
                          background: b.cat === 'do' ? '#dcfce7' : 'white',
                          color: b.cat === 'do' ? '#15803d' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ควรทำ
                      </button>
                      <button
                        onClick={() => assignAct1(b.id, 'avoid')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: b.cat === 'avoid' ? '#dc2626' : '#cbd5e1',
                          background: b.cat === 'avoid' ? '#fee2e2' : 'white',
                          color: b.cat === 'avoid' ? '#991b1b' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ควรหลีกเลี่ยง
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {act1Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act1Feedback.pass ? '#dcfce7' : '#fee2e2', color: act1Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act1Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkAct1}
                  style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจคำตอบกิจกรรม 1
                </button>
                {act1Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(1)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปกิจกรรม 2: การนวดเต้านม ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 1: กิจกรรม 2 — การนวดเต้านมและกระตุ้นการไหลของน้ำนม ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
                <strong>เป้าหมาย:</strong> เรียนรู้หลักการสัมผัส/นวดเต้านมอย่างอ่อนโยน นุ่มนวล และรู้ว่าไม่ควรใช้แรงกดรุนแรงจนเจ็บหรือเกิดการบาดเจ็บ
              </div>

              {/* Reference Infographic Header */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <img
                  src="/references/mother_zone1/breast_massage.png"
                  alt="การนวดเต้านม"
                  style={{ width: '130px', height: '90px', objectFit: 'contain', borderRadius: '8px', background: 'white', border: '1px solid #cbd5e1', padding: '2px' }}
                />
                <div style={{ flex: 1, fontSize: '12.5px', color: '#475569', lineHeight: '1.4' }}>
                  <strong style={{ color: '#be185d', fontSize: '13px' }}>คำแนะนำจากหลักสูตร (Butdapan et al. 2024):</strong>
                  <br />
                  การนวดเต้านมช่วยเปิดท่อน้ำนมและกระตุ้น Oxytocin ต้องนวดสัมผัสอย่างนุ่มนวล ห้ามบีบเค้นรุนแรงจนเจ็บ
                </div>
              </div>

              {/* Pressure Level Selector */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>🖐️ 1. เลือกระดับแรงกดในการนวดเต้านม:</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setMassagePressure('gentle')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: massagePressure === 'gentle' ? '#16a34a' : '#cbd5e1',
                      background: massagePressure === 'gentle' ? '#dcfce7' : 'white',
                      color: massagePressure === 'gentle' ? '#15803d' : '#334155',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🌸 เบามือ นุ่มนวล และผ่อนคลาย (แนะนำ)
                  </button>
                  <button
                    onClick={() => setMassagePressure('hard')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: massagePressure === 'hard' ? '#dc2626' : '#cbd5e1',
                      background: massagePressure === 'hard' ? '#fee2e2' : 'white',
                      color: massagePressure === 'hard' ? '#991b1b' : '#334155',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ⚠️ กดแรง บีบเค้นเต้านม (เสี่ยงช้ำ)
                  </button>
                </div>
              </div>

              {/* Rules Checklist */}
              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0', marginBottom: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>📋 2. เลือกหลักปฏิบัติที่ "ถูกต้องและปลอดภัย" (คลิกเลือกทุกข้อที่ถูกต้อง):</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {massageRules.map(r => {
                    const isChecked = massageChecklist.includes(r.id);
                    return (
                      <div
                        key={r.id}
                        onClick={() => toggleMassageRule(r.id)}
                        style={{
                          background: isChecked ? '#dcfce7' : 'white',
                          border: isChecked ? '2px solid #16a34a' : '1px solid #cbd5e1',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: isChecked ? '#14532d' : '#374151'
                        }}
                      >
                        <span>{isChecked ? '☑' : '☐'}</span>
                        <span>{r.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {act2Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act2Feedback.pass ? '#dcfce7' : '#fee2e2', color: act2Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act2Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkAct2}
                  style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจคำตอบกิจกรรม 2
                </button>
                {act2Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(2)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปกิจกรรม 3: ปัญหาเต้านม 4 สถานการณ์ ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: กิจกรรม 3 — การจัดการปัญหาเต้านมที่พบบ่อย (4 สถานการณ์) ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
                <strong>เป้าหมาย:</strong> จำแนกอาการของเต้านมคัดตึง หัวนมเจ็บ/แตก ท่อน้ำนมอุดตัน และเต้านมอักเสบ พร้อมเลือกแนวทางดูแลที่ปลอดภัย
              </div>

              {/* Reference Infographic Header */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <img
                  src="/references/mother_zone1/breast_problems.png"
                  alt="ปัญหาเต้านมที่พบบ่อย"
                  style={{ width: '130px', height: '90px', objectFit: 'contain', borderRadius: '8px', background: 'white', border: '1px solid #cbd5e1', padding: '2px' }}
                />
                <div style={{ flex: 1, fontSize: '12.5px', color: '#475569', lineHeight: '1.4' }}>
                  <strong style={{ color: '#be185d', fontSize: '13px' }}>ปัญหาเต้านม 4 สถานการณ์:</strong>
                  <br />
                  คัดตึงเต้านม, หัวนมแตกเจ็บ, ท่อน้ำนมอุดตัน, เต้านมอักเสบ (Mastitis) ต้องแก้ไขให้ตรงจุดเพื่อให้นมบุตรได้อย่างต่อเนื่อง
                </div>
              </div>

              {/* Scenario Selector Tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {Object.keys(scenarios).map(key => {
                  const s = scenarios[key];
                  const isSelected = activeScenario === key;
                  const isAnswered = scenarioAnswers[key] !== null;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveScenario(key)}
                      style={{
                        flex: 1,
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: isSelected ? '#e91e63' : '#cbd5e1',
                        background: isSelected ? '#fce4ec' : (isAnswered ? '#f0fdf4' : 'white'),
                        color: isSelected ? '#c2185b' : '#334155',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {s.code}. {s.title.split(':')[1]?.trim() || s.title} {isAnswered && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Active Scenario Card */}
              {scenarios[activeScenario] && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#c2185b', fontSize: '15px' }}>
                    {scenarios[activeScenario].title}
                  </h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>อาการ:</strong> {scenarios[activeScenario].symptom}
                  </p>

                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                    เลือกแนวทางการจัดการที่ถูกต้อง:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {scenarios[activeScenario].options.map(opt => {
                      const isChosen = scenarioAnswers[activeScenario] === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectScenarioOpt(activeScenario, opt.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: isChosen ? '2px solid #e91e63' : '1px solid #cbd5e1',
                            background: isChosen ? '#fce4ec' : 'white',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: isChosen ? 'bold' : 'normal',
                            color: isChosen ? '#c2185b' : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span>{isChosen ? '◉' : '○'}</span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {act3Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act3Feedback.pass ? '#dcfce7' : '#fee2e2', color: act3Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act3Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkAct3}
                  style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจคำตอบทั้ง 4 สถานการณ์
                </button>
                {act3Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(3)}
                    style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ทำแบบประเมินความรู้ท้ายบท ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: แบบประเมินความรู้ประจำห้องที่ 3 (ข้อ 3, 9 & 14) ── */}
          {activeTab === 3 && (
            <div>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#fce4ec', color: '#c2185b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      📋 แบบประเมิน: {currentQ.room}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                      ข้อ {quizIndex + 1} / {room3Questions.length} | คะแนนสะสม: {quizScore}
                    </span>
                  </div>

                  <h3 style={{ color: '#222', fontSize: '17px', fontWeight: 'bold', lineHeight: '1.45', margin: '0 0 16px 0' }}>
                    "{currentQ.question}"
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(true)}
                      style={{
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#e91e63' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#fce4ec' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === true ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer'
                      }}
                    >
                      ✓ ถูก (True)
                    </button>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(false)}
                      style={{
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#e91e63' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#fce4ec' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === false ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer'
                      }}
                    >
                      ✕ ผิด (False)
                    </button>
                  </div>

                  {quizShowFeedback && (
                    <div style={{
                      background: quizUserChoice === currentQ.answer ? '#f0fdf4' : '#fffbeb',
                      border: `1.5px solid ${quizUserChoice === currentQ.answer ? '#86efac' : '#fde68a'}`,
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px', color: quizUserChoice === currentQ.answer ? '#16a34a' : '#d97706' }}>
                          {quizUserChoice === currentQ.answer ? '🎉 ถูกต้อง! (+1 คะแนน)' : `⚠️ เฉลย: ${currentQ.answerText}`}
                        </span>
                        <button
                          onClick={handleNextQuizQuestion}
                          style={{
                            padding: '6px 16px',
                            background: '#e91e63',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          {quizIndex < room3Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สำเร็จบทเรียน 🏆'}
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.4' }}>
                        <strong>💡 เหตุผล:</strong> {currentQ.reason}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ห้องที่ 3 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room3Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องในการดูแลเต้านม การนวดเต้านมอย่างอ่อนโยน และการแก้ไขปัญหาการให้นมแม่ตามหลักสากล
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      onClick={() => { setQuizIndex(0); setQuizUserChoice(null); setQuizShowFeedback(false); setQuizScore(0); setQuizFinished(false); }}
                      style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 'bold', background: '#f3f4f6', color: '#333', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      ทำแบบประเมินซ้ำ ↻
                    </button>
                    <button
                      onClick={() => setRoom('lobby')}
                      style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 'bold', background: '#e91e63', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      กลับสู่ล็อบบี้ 🏥
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Html>

      {/* ── GTA Player Controller ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
