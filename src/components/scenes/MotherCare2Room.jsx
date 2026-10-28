import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import MedicalCart from '../furniture/MedicalCart';
import Washbasin from '../furniture/Washbasin';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import Pillows from '../decorations/Pillows';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import DoctorDesk from '../furniture/DoctorDesk';
import { DiaperStack, BabyBottle, CottonJar, IcePack } from '../furniture/BabyProps';
import { getQuestionsByRoomKey } from '../../data/quizData';

import { WallBoard, TitleSign, WallScreen, WindowWithCurtains, CareBooth, LoungeCorner, useEnterToActivate } from '../ward/WardKit';
import { WARD102_BOARDS } from '../ward/wardData';

export default function MotherCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal, openWardModal, wardFlow, learningProgress } = useStore();
  const ROOM = 'motherCare2';
  const flow = wardFlow[ROOM] || {};
  const slideSeen = !!flow.slide;
  const activityDone = !!flow.activity;
  const isCompleted = !!(learningProgress && learningProgress[ROOM]) || activityDone;
  const B = WARD102_BOARDS;

  const [activeTab, setActiveTab] = useState(0); // 0: ทำความสะอาดแผล, 1: ลดปวด/บวม, 2: ขับถ่าย/ปัสสาวะ, 3: REEDA, 4: แบบประเมิน
  const [isBoardFullScreen, setIsBoardFullScreen] = useState(false);
  const [missionCollapsed, setMissionCollapsed] = useState(false);

  // ── กิจกรรม 1: ทำความสะอาดแผลฝีเย็บ (เรียงลำดับ 6 ขั้นตอน) ──
  const initialSteps = [
    { id: 3, text: 'ทำความสะอาดจากด้านหน้าไปด้านหลัง (จากช่องคลอดไปทวารหนัก)', correctOrder: 3 },
    { id: 1, text: 'ล้างมือให้สะอาดด้วยสบู่และน้ำไหล', correctOrder: 1 },
    { id: 5, text: 'เปลี่ยนผ้าอนามัยทุก 3–4 ชั่วโมง หรือเมื่อชุ่ม', correctOrder: 5 },
    { id: 2, text: 'ใช้น้ำสะอาดหรือน้ำเกลือจากขวด Peri-bottle ชะล้างแผล', correctOrder: 2 },
    { id: 6, text: 'สังเกตลักษณะแผลและการเปลี่ยนแปลงของน้ำคาวปลา', correctOrder: 6 },
    { id: 4, text: 'ซับให้แห้งอย่างเบามือด้วยผ้าหรือทิชชูสะอาด', correctOrder: 4 },
  ];

  const [userOrder, setUserOrder] = useState(initialSteps);
  const [act1Feedback, setAct1Feedback] = useState(null);

  const moveStep = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= userOrder.length) return;
    const updated = [...userOrder];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setUserOrder(updated);
    setAct1Feedback(null);
  };

  const checkAct1 = () => {
    const isCorrect = userOrder.every((item, idx) => item.correctOrder === idx + 1);
    if (isCorrect) {
      setAct1Feedback({
        pass: true,
        msg: '✓ ถูกต้องทั้งหมด! ลำดับการทำความสะอาดแผลเริ่มจากล้างมือ ใช้น้ำสะอาด ชะล้างจากหน้าไปหลัง ซับแห้ง เปลี่ยนผ้าอนามัย และสังเกตแผล (White & Atchan 2022)'
      });
    } else {
      setAct1Feedback({
        pass: false,
        msg: '✕ ลำดับยังไม่ถูกต้อง: ต้องเริ่มจากล้างมือก่อนเสมอ และทำความสะอาดจากด้านหน้าไปด้านหลังเพื่อป้องกันเชื้อโรคจากทวารหนัก'
      });
    }
  };

  // ── กิจกรรม 2: ลดปวดและบวม ──
  const [selectedReliefs, setSelectedReliefs] = useState([]);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const reliefOptions = [
    { id: 'cold_pack', text: 'ประคบเย็นด้วยเจล/ถุงประคบห่อผ้าสะอาดตามคำแนะนำ', correct: true, desc: 'ลดอาการปวดและลดการบวมของเนื้อเยื่อ (Şolt Kırca et al. 2022)' },
    { id: 'donut_cushion', text: 'ใช้เบาะรองนั่งรูปวงโดนัทเพื่อลดแรงกดทับบริเวณแผล', correct: true, desc: 'ลดแรงกดโดยตรง ทำให้คุณแม่นั่งสบายขึ้น' },
    { id: 'painkiller', text: 'พักผ่อนและรับประทานยาแก้ปวดตามแผนการรักษาของแพทย์', correct: true, desc: 'ยาพาราเซตามอลหรือยาที่แพทย์สั่ง ปลอดภัยต่อการให้นมบุตร' },
    { id: 'direct_ice', text: 'วางก้อนน้ำแข็งสัมผัสผิวหนังบริเวณแผลโดยตรง', correct: false, desc: 'ห้ามทำ! ความเย็นจัดทำลายเนื้อเยื่อและเสี่ยงติดเชื้อ' },
    { id: 'sit_long', text: 'นั่งบนเก้าอี้แข็งนานๆ หลายชั่วโมงต่อเนื่อง', correct: false, desc: 'ห้ามทำ! เพิ่มแรงกดทับ ทำให้แผลบวมและปวดมากขึ้น' },
    { id: 'hot_pack_early', text: 'ประคบร้อนจัดที่แผลทันทีใน 24 ชั่วโมงแรก', correct: false, desc: 'ห้ามทำ! ความร้อนในช่วงแรกทำให้หลอดเลือดขยายตัว เลือดออกและบวมมากขึ้น' },
  ];

  const toggleRelief = (id) => {
    setSelectedReliefs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setAct2Feedback(null);
  };

  const checkAct2 = () => {
    const hasUnsafe = selectedReliefs.some(id => id === 'direct_ice' || id === 'sit_long' || id === 'hot_pack_early');
    const correctCount = selectedReliefs.filter(id => id === 'cold_pack' || id === 'donut_cushion' || id === 'painkiller').length;

    if (hasUnsafe) {
      setAct2Feedback({ pass: false, msg: '✕ คำตอบมีวิธีที่ไม่ปลอดภัย เช่น การวางน้ำแข็งบนผิวโดยตรง หรือการนั่งนาน ซึ่งทำให้แผลระคายเคืองและปวดมากขึ้น' });
    } else if (correctCount === 3) {
      setAct2Feedback({ pass: true, msg: '✓ ยอดเยี่ยมมาก! ทั้ง 3 วิธีปลอดภัยและมีหลักฐานเชิงประจักษ์รองรับ ช่วยบรรเทาอาการปวดบวมได้อย่างมีประสิทธิภาพ' });
    } else {
      setAct2Feedback({ pass: false, msg: '✕ กรุณาเลือกวิธีที่ปลอดภัยและควรทำ 3 ข้อ' });
    }
  };

  // ── กิจกรรม 3: การขับถ่ายและการปัสสาวะ ──
  const [excretionItems, setExcretionItems] = useState([
    { id: 'water', text: 'ดื่มน้ำให้เพียงพอตามความต้องการของร่างกาย', cat: null, correct: 'do' },
    { id: 'fiber', text: 'รับประทานอาหารมีกากใย (ผัก ผลไม้ ถั่ว ธัญพืช)', cat: null, correct: 'do' },
    { id: 'no_hold', text: 'ไม่กลั้นปัสสาวะหรืออุจจาระ เมื่อปวดให้เข้าห้องน้ำทันที', cat: null, correct: 'do' },
    { id: 'dysuria', text: 'ปัสสาวะแสบขัด หรือปัสสาวะลำบาก/ไม่ออก', cat: null, correct: 'notify' },
    { id: 'frequent_pain', text: 'ปวดเกร็งท้องน้อยขณะปัสสาวะ ปัสสาวะกะปริบกะปรอยมีกลิ่นฉุน', cat: null, correct: 'notify' },
  ]);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const assignExcretion = (id, targetCat) => {
    setExcretionItems(prev => prev.map(item => item.id === id ? { ...item, cat: targetCat } : item));
    setAct3Feedback(null);
  };

  const checkAct3 = () => {
    const allFilled = excretionItems.every(i => i.cat !== null);
    if (!allFilled) {
      setAct3Feedback({ pass: false, msg: 'กรุณาจัดหมวดหมู่ให้ครบทุกข้อก่อนตรวจคำตอบครับ' });
      return;
    }
    const isAllCorrect = excretionItems.every(i => i.cat === i.correct);
    if (isAllCorrect) {
      setAct3Feedback({
        pass: true,
        msg: '✓ ถูกต้องทั้งหมด! แยกแยะพฤติกรรมดูแลตนเอง (ดื่มน้ำ กินผักผลไม้ ไม่กลั้น) ออกจากอาการผิดปกติที่ต้องแจ้งแพทย์ (ปัสสาวะแสบขัด/ขัดเบา) ได้อย่างถูกต้อง'
      });
    } else {
      setAct3Feedback({
        pass: false,
        msg: '✕ ยังมีบางข้ออยู่ในช่องที่ไม่ถูกต้อง: อาการปัสสาวะแสบขัดหรือปัสสาวะลำบากต้องแจ้งบุคลากรสุขภาพ ไม่ใช่พฤติกรรมที่ควรทำ'
      });
    }
  };

  // ── กิจกรรม 4: ฝึกสังเกตแผลด้วย REEDA ──
  const [selectedReeda, setSelectedReeda] = useState('R');

  const reedaData = {
    R: { code: 'R', title: 'Redness (รอยแดง)', desc: 'สังเกตบริเวณรอบรอยเย็บว่ามีรอยแดงลุกลามเกิน 0.5 ซม. หรือมีสีแดงก่ำร้อนหรือไม่', normal: 'มีรอยแดงเล็กน้อยรอบแผล < 0.25 ซม.', abnormal: 'แดงกว้าง > 0.5 ซม. สองข้าง ร้อนและปวดตุบๆ' },
    E1: { code: 'E', title: 'Edema (อาการบวม)', desc: 'สังเกตอาการบวมตึงของเนื้อเยื่อฝีเย็บและรอบรอยเย็บ', normal: 'บวมเล็กน้อย < 1 ซม. จากรอยแผล', abnormal: 'บวมมาก > 2 ซม. ผิวตึงเงา กดบุ๋ม หรือบวมลามถึงแคมใหญ่' },
    E2: { code: 'E', title: 'Ecchymosis (รอยฟกช้ำ)', desc: 'สังเกตรอยฟกช้ำ สีเขียวคล้ำ หรือห้อเลือดใต้ผิวหนัง', normal: 'รอยช้ำจางๆ < 1 ซม. ไม่ขยายวงกว้าง', abnormal: 'รอยช้ำม่วงคล้ำขนาดใหญ่ > 2 ซม. หรือมีก้อนเลือดคั่ง (Hematoma)' },
    D: { code: 'D', title: 'Discharge (สิ่งคัดหลั่ง)', desc: 'สังเกตสิ่งที่ซึมออกจากรอยเย็บ เช่น น้ำเหลือง เลือดสด หรือหนอง', normal: 'ไม่มีสิ่งคัดหลั่งซึม หรือมีเพียงน้ำคาวปลาตามระยะปกติ', abnormal: 'มีหนองสีเหลือง/เขียวซึม มีกลิ่นเหม็น หรือเลือดสดไหลซึมไม่หยุด' },
    A: { code: 'A', title: 'Approximation (ขอบแผลชิดกัน)', desc: 'สังเกตการสมานตัวและการแนบชิดของขอบแผลเย็บ', normal: 'ขอบแผลสองข้างแนบชิดสนิทดี ไม่มีช่องว่าง', abnormal: 'ขอบแผลแยกออกจากกัน มีช่องว่าง หรือไหมเย็บหลุดก่อนกำหนด' },
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 2 & 17) ──
  const room2Questions = getQuestionsByRoomKey('motherCare2');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = room2Questions[quizIndex] || room2Questions[0];

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
    if (quizIndex < room2Questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare2');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้องที่ 2 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room2Questions.length} คะแนน)`
      );
    }
  };

  const startActivity = () => {
    openWardModal('booth', ROOM);
  };
  useEnterToActivate([2.0, 1.0], 2.2, startActivity);

  const renderProjectorBoardContent = (isModal = false) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      padding: isModal ? '20px' : '22px',
      borderRadius: '24px',
      width: isModal ? '100%' : '880px',
      maxWidth: isModal ? '880px' : 'none',
      maxHeight: isModal ? '88vh' : 'none',
      overflowY: isModal ? 'auto' : 'visible',
      boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
      border: '3px solid #f48fb1',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fce4ec', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ background: '#e91e63', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
            ZONE 2: การดูแลแผลฝีเย็บหลังคลอด (Ward 102)
          </span>
          <h2 style={{ margin: '6px 0 0 0', color: '#c2185b', fontSize: '20px', fontWeight: 800 }}>
            {activeTab === 0 && 'กิจกรรม 1 — ทำความสะอาดแผลฝีเย็บ'}
            {activeTab === 1 && 'กิจกรรม 2 — ลดปวดและบวม'}
            {activeTab === 2 && 'กิจกรรม 3 — การขับถ่ายและการปัสสาวะ'}
            {activeTab === 3 && 'กิจกรรม 4 — ฝึกสังเกตแผลด้วยเครื่องมือ REEDA'}
            {activeTab === 4 && 'แบบประเมินความรู้ประจำห้องที่ 2 (ข้อ 2 & 17)'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => openWardModal('slide', ROOM)}
            style={{ background: '#fdf2f8', color: '#be185d', border: '1.5px solid #f472b6', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            📖 สไลด์ Zone 2
          </button>
          <button
            type="button"
            onClick={() => openWardModal('booth', ROOM)}
            style={{ background: '#fff1f2', color: '#be123c', border: '1.5px solid #fb7185', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            🩹 กิจกรรมบูทดูแลแผลฝีเย็บ
          </button>
          <button
            type="button"
            onClick={() => openWardModal('quiz', ROOM)}
            style={{ background: '#f8fafc', color: '#334155', border: '1.5px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            📝 แบบประเมินประจำห้อง
          </button>
          {!isModal ? (
            <button
              type="button"
              onClick={() => setIsBoardFullScreen(true)}
              style={{ background: '#e91e63', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              🔍 ขยายเต็มจอ (เล่นบนมือถือ)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsBoardFullScreen(false)}
              style={{ background: '#1e293b', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              ✕ ปิดหน้าต่างขยาย
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['1. ทำความสะอาดแผล', '2. ลดปวดและบวม', '3. การขับถ่าย/ปัสสาวะ', '4. ฝึกสังเกต REEDA', '5. แบบประเมิน (Quiz)'].map((label, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              flex: '1 1 130px',
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

      {/* ── TAB 0: กิจกรรม 1 — ทำความสะอาดแผลฝีเย็บ ── */}
      {activeTab === 0 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> ฝึกเลือกอุปกรณ์และเรียงลำดับขั้นตอนการดูแลทำความสะอาดแผลฝีเย็บอย่างถูกต้อง (ใช้ปุ่มขึ้น/ลงเพื่อเรียงลำดับ 1 ถึง 6)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {userOrder.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: '#e91e63', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{step.text}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveStep(idx, -1)}
                    style={{ padding: '4px 10px', background: idx === 0 ? '#f1f5f9' : '#e0f2fe', color: idx === 0 ? '#cbd5e1' : '#0369a1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: idx === 0 ? 'default' : 'pointer' }}
                  >
                    ▲ ขึ้น
                  </button>
                  <button
                    type="button"
                    disabled={idx === userOrder.length - 1}
                    onClick={() => moveStep(idx, 1)}
                    style={{ padding: '4px 10px', background: idx === userOrder.length - 1 ? '#f1f5f9' : '#e0f2fe', color: idx === userOrder.length - 1 ? '#cbd5e1' : '#0369a1', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: idx === userOrder.length - 1 ? 'default' : 'pointer' }}
                  >
                    ▼ ลง
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={checkAct1}
              style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ✓ ตรวจลำดับขั้นตอน
            </button>
            {act1Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ไปกิจกรรม 2: ลดปวดและบวม ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 1: กิจกรรม 2 — ลดปวดและบวม ── */}
      {activeTab === 1 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>สถานการณ์:</strong> คุณแม่มีอาการปวดและบวมบริเวณแผลฝีเย็บหลังคลอด ให้เลือกวิธีบรรเทาอาการที่ถูกต้องและปลอดภัย 3 ข้อ
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {reliefOptions.map(r => {
              const isChecked = selectedReliefs.includes(r.id);
              return (
                <div
                  key={r.id}
                  onClick={() => toggleRelief(r.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isChecked ? '2px solid #e91e63' : '1px solid #e2e8f0',
                    background: isChecked ? '#fce4ec' : 'white',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span>{isChecked ? '☑' : '☐'}</span>
                    <strong style={{ fontSize: '13px', color: isChecked ? '#c2185b' : '#1e293b' }}>{r.text}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', paddingLeft: '24px' }}>{r.desc}</div>
                </div>
              );
            })}
          </div>

          {act2Feedback && (
            <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act2Feedback.pass ? '#dcfce7' : '#fee2e2', color: act2Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
              {act2Feedback.msg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={checkAct2}
              style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ✓ ตรวจคำตอบกิจกรรม 2
            </button>
            {act2Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ไปกิจกรรม 3: การขับถ่ายและปัสสาวะ ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: กิจกรรม 3 — การขับถ่ายและการปัสสาวะ ── */}
      {activeTab === 2 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> ฝึกแยกแยะพฤติกรรมดูแลตนเองที่ช่วยให้ขับถ่ายได้เหมาะสม ออกจากอาการผิดปกติที่ต้องแจ้งบุคลากรสุขภาพ
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {excretionItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{item.text}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => assignExcretion(item.id, 'do')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: item.cat === 'do' ? '#16a34a' : '#cbd5e1',
                      background: item.cat === 'do' ? '#dcfce7' : 'white',
                      color: item.cat === 'do' ? '#15803d' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ควรทำ
                  </button>
                  <button
                    type="button"
                    onClick={() => assignExcretion(item.id, 'notify')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: item.cat === 'notify' ? '#dc2626' : '#cbd5e1',
                      background: item.cat === 'notify' ? '#fee2e2' : 'white',
                      color: item.cat === 'notify' ? '#991b1b' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ควรแจ้งบุคลากรสุขภาพ
                  </button>
                </div>
              </div>
            ))}
          </div>

          {act3Feedback && (
            <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act3Feedback.pass ? '#dcfce7' : '#fee2e2', color: act3Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
              {act3Feedback.msg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={checkAct3}
              style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ✓ ตรวจคำตอบกิจกรรม 3
            </button>
            {act3Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ไปกิจกรรม 4: ฝึกสังเกต REEDA ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: กิจกรรม 4 — ฝึกสังเกตแผลด้วย REEDA ── */}
      {activeTab === 3 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> รู้จักเครื่องมือประเมินแผล REEDA ทั้ง 5 ตัวอักษร เพื่อใช้ในการฝึกสังเกตลักษณะแผลอย่างเป็นระบบ
          </div>

          {/* REEDA Selector Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {Object.keys(reedaData).map(k => {
              const item = reedaData[k];
              const isSelected = selectedReeda === k;
              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => setSelectedReeda(k)}
                  style={{
                    flex: '1 1 80px',
                    padding: '10px 8px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: isSelected ? '#e91e63' : '#e2e8f0',
                    background: isSelected ? '#fce4ec' : 'white',
                    color: isSelected ? '#c2185b' : '#334155',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '18px' }}>{item.code}</div>
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>{item.title.split(' ')[0]}</div>
                </button>
              );
            })}
          </div>

          {/* REEDA Detail Card */}
          {reedaData[selectedReeda] && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#c2185b', fontSize: '16px' }}>
                {reedaData[selectedReeda].title}
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569' }}>
                {reedaData[selectedReeda].desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', fontSize: '12.5px' }}>
                  <strong style={{ color: '#166534' }}>🟢 ลักษณะปกติ:</strong>
                  <div style={{ color: '#14532d', marginTop: '4px' }}>{reedaData[selectedReeda].normal}</div>
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', fontSize: '12.5px' }}>
                  <strong style={{ color: '#991b1b' }}>🔴 สัญญาณผิดปกติ (ต้องพบแพทย์):</strong>
                  <div style={{ color: '#7f1d1d', marginTop: '4px' }}>{reedaData[selectedReeda].abnormal}</div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Note */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#92400e', marginBottom: '14px' }}>
            ⚠️ <strong>Safety Note:</strong> REEDA เป็นสื่อการเรียนรู้เพื่อฝึกสังเกตลักษณะแผล ไม่ใช่การวินิจฉัยโรคด้วยตนเอง หากแผลฝีเย็บมีอาการบวม แดง ปวดมากขึ้น หรือมีหนองซึม ควรติดต่อบุคลากรสุขภาพทันที
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setActiveTab(4)}
              style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ทำแบบประเมินความรู้ท้ายบท ➜
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: แบบประเมินความรู้ประจำห้องที่ 2 (ข้อ 2 & 17) ── */}
      {activeTab === 4 && (
        <div>
          {!quizFinished ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#fce4ec', color: '#c2185b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  📋 แบบประเมิน: {currentQ.room}
                </span>
                <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                  ข้อ {quizIndex + 1} / {room2Questions.length} | คะแนนสะสม: {quizScore}
                </span>
              </div>

              <h3 style={{ color: '#222', fontSize: '17px', fontWeight: 'bold', lineHeight: '1.45', margin: '0 0 16px 0' }}>
                &ldquo;{currentQ.question}&rdquo;
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <button
                  type="button"
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
                  type="button"
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
                      type="button"
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
                      {quizIndex < room2Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สำเร็จบทเรียน 🏆'}
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
              <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ห้องที่ 2 แล้ว!</h2>
              <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                คะแนนของคุณ: <strong>{quizScore} / {room2Questions.length} คะแนน</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                คุณมีความเข้าใจที่ถูกต้องในการดูแลแผลฝีเย็บ การรักษาความสะอาด และการสังเกตความผิดปกติด้วย REEDA
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => { setQuizIndex(0); setQuizUserChoice(null); setQuizShowFeedback(false); setQuizScore(0); setQuizFinished(false); }}
                  style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 'bold', background: '#f3f4f6', color: '#333', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ทำแบบประเมินซ้ำ ↻
                </button>
                {isModal && (
                  <button
                    type="button"
                    onClick={() => setIsBoardFullScreen(false)}
                    style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 'bold', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    🚶 อยู่ในห้อง 3D ต่อ
                  </button>
                )}
                <button
                  type="button"
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
  );

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 2: การดูแลแผลหลังคลอด (แผลฝีเย็บและแผลผ่าตัด)"
        roomNumber="Wound Care Ward 102"
      />

      {/* ── Top-Right Mission HUD (Portaled to document.body so user can explore 3D room freely) ── */}
      <ScreenPortal>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-pink-400 text-slate-800">
          <div
            onClick={() => setMissionCollapsed((v) => !v)}
            className={`flex items-center justify-between cursor-pointer select-none ${
              missionCollapsed ? '' : 'border-b border-pink-100 pb-2 mb-2'
            }`}
          >
            <span className="text-xs font-extrabold text-pink-900">
              🩹 ภารกิจห้องดูแลแผลหลังคลอด (Ward 102)
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'
                }`}
              >
                {isCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังเรียนรู้'}
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
                onClick={() => setIsBoardFullScreen(true)}
                className="w-full p-2 rounded-xl border border-pink-300 bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>🎯 1. กิจกรรมโปรเจกเตอร์ (4 กิจกรรม)</span>
                <span className="font-bold">เปิดทำ ▶</span>
              </button>

              <button
                type="button"
                onClick={() => openWardModal('slide', ROOM)}
                className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                  slideSeen
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-950'
                }`}
              >
                <span>📖 2. อ่านสไลด์ความรู้ Zone 2</span>
                <span className="font-bold">{slideSeen ? '☑ อ่านแล้ว' : 'เปิดอ่าน ▶'}</span>
              </button>

              <button
                type="button"
                onClick={() => openWardModal('booth', ROOM)}
                className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                  activityDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-950'
                }`}
              >
                <span>🩹 3. กิจกรรมบูทดูแลแผลฝีเย็บ</span>
                <span className="font-bold">{activityDone ? '☑ สำเร็จ' : 'เริ่มทำ ▶'}</span>
              </button>

              <button
                type="button"
                onClick={() => openWardModal('quiz', ROOM)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>📝 4. แบบประเมินทบทวนประจำห้อง</span>
                <span className="font-bold text-pink-700">{flow.quiz ? '☑ ทำแล้ว' : 'ทำข้อสอบ ▶'}</span>
              </button>
            </div>
          )}
        </div>
      </ScreenPortal>

      {/* Full-Screen Modal View of the 4-Activity Projector Board (for comfortable Mobile & Desktop play) */}
      {isBoardFullScreen && (
        <ScreenPortal>
          <div
            onClick={() => setIsBoardFullScreen(false)}
            className="fixed inset-0 z-[180] bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[900px]">
              {renderProjectorBoardContent(true)}
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* ── ป้ายและบอร์ดผนัง (ติดผนังด้านใน z = -8.76 อย่างแนบสนิท ไม่ชนกรอบโปรเจกเตอร์) ── */}
      <TitleSign position={[-6.3, 4.9, -8.76]} width={4.4} height={2.0} line1={B.title.line1} line2={B.title.line2} />
      <WallBoard position={[-6.3, 2.5, -8.76]} width={3.2} height={2.6} title={B.goals.title} items={B.goals.items} />
      <WallBoard position={[4.1, 3.4, -8.76]} width={2.85} height={3.6} title={B.howTo.title} items={B.howTo.items} numbered />
      <WallBoard position={[7.2, 3.4, -8.76]} width={2.85} height={3.6} title={B.warning.title} items={B.warning.items} accent="#e53935" />
      {/* จอสไลด์ความรู้ Zone 2 ติดผนังฝั่งขวา (ไม่ซ้อนทับหลังโปรเจกเตอร์) */}
      <WallScreen position={[8.72, 3.3, -5.6]} rotation={[0, -Math.PI / 2, 0]} width={3.4} src="/images/ward/zone2_slide.jpg" room={ROOM} label="Zone 2" />
      <WindowWithCurtains position={[-8.78, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* ══════════════════════════════════════════════════════════════════════════
          🩹 INTERACTIVE PROJECTOR LEARNING BOARD (Framed Cleanly on North Wall Projector Screen)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[-0.65, 3.05, -8.76]}>
        {/* Projector Top Housing Roller Bar */}
        <mesh position={[0, 1.92, 0.04]} castShadow>
          <boxGeometry args={[4.75, 0.14, 0.14]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Clean Projector Screen Bezel & Matte White Canvas */}
        <mesh position={[0, 0, -0.02]} castShadow>
          <boxGeometry args={[4.56, 3.72, 0.05]} />
          <meshStandardMaterial color="#8d5a3a" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[4.36, 3.52]} />
          <meshBasicMaterial color="#fff9fb" />
        </mesh>
      </group>
      {!isBoardFullScreen && (
        <Html position={[-0.65, 3.05, -8.68]} center transform scale={0.19} zIndexRange={[15, 0]}>
          {renderProjectorBoardContent(false)}
        </Html>
      )}

      <LoungeCorner position={[7.4, 0, 6.2]} rotation={[0, -Math.PI / 2, 0]} />
      <CareBooth position={[2.0, 0, 1.0]} locked={false} onActivate={startActivity} />

      {/* ── REAL 3D CLINICAL ASSETS & ARCHITECTURE ── */}
      <RealPlant type="potted" position={[7.5, 0, -7.5]} scale={1.1} />
      <MedicineCabinet position={[8.4, 0, -2.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Drivable Hospital Wheelchair parked neatly along entrance wall */}
      <InteractiveSeat
        id="ward102_wheelchair"
        name="รถเข็นผู้ป่วย Ward 102"
        type="wheelchair"
        position={[-7.5, 0, 3.2]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* ── 1. Hospital Patient Bed with Soft Pillows (กิจกรรม 2: การประคบและลดปวดบวม) ── */}
      <InteractiveSeat
        id="room102_bed"
        name="เตียงพักฟื้นคุณแม่"
        type="bed"
        position={[-5.4, 0, -6.0]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.68, 0]}
      >
        <group onClick={() => setActiveTab(1)}>
          <HospitalBed position={[0, 0, 0]} />
          {/* Pillows resting securely on top of mattress headboard */}
          <Pillows position={[0.05, 0.72, -0.75]} rotation={[0, 0, 0]} scale={0.75} />
        </group>
      </InteractiveSeat>

      {/* ── 2. Sterile Wound Care Cart (กิจกรรม 1: ทำความสะอาดแผลฝีเย็บ/ผ่าตัด) ── */}
      <group position={[-7.2, 0, -6.5]} onClick={() => setActiveTab(0)}>
        <MedicalCart position={[0, 0, 0]} scale={1.05} />
      </group>

      {/* ── 3. Porcelain Sanitary Wash Station (กิจกรรม 3: การขับถ่ายและสุขอนามัย) ── */}
      {/* Mounted flush against the right perimeter wall */}
      <group position={[8.3, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} onClick={() => setActiveTab(2)}>
        <Washbasin position={[0, 0, 0]} />
      </group>
      <HospitalTrashBin position={[8.3, 0, 0.8]} scale={0.85} />

      {/* ── 4. Clinical Consultation & REEDA Evaluation Station (กิจกรรม 4: REEDA Score) ── */}
      <group position={[5.4, 0, -6.5]} rotation={[0, -Math.PI / 6, 0]} onClick={() => setActiveTab(3)}>
        <DoctorDesk position={[0, 0, 0]} scale={0.85} />
        {/* Examination desk lamp positioned properly on the consultation desk */}
        <ExaminationLamp position={[-0.3, 0.78, 0]} scale={0.65} />
      </group>

      {/* ── Baby care supplies on consultation desk ── */}
      <DiaperStack position={[5.8, 0.82, -6.2]} count={4} />
      <CottonJar position={[5.0, 0.82, -6.7]} />
      <BabyBottle position={[4.7, 0.82, -6.3]} rotation={[0, 0.8, 0]} />

      {/* ── ประคบเย็น (Zone 2 ref: cold compress/ice pack) ── */}
      <IcePack position={[-6.8, 0.88, -6.2]} rotation={[0, 0.5, 0]} />
      <IcePack position={[-7.0, 0.88, -6.8]} rotation={[0, -0.3, 0]} />

      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
