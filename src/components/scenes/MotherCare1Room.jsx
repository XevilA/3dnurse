import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import HospitalNightstand from '../furniture/HospitalNightstand';
import Washbasin from '../furniture/Washbasin';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import MedicineCabinet from '../furniture/MedicineCabinet';
import Pillows from '../decorations/Pillows';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyCrib from '../furniture/BabyCrib';
import NursingChair from '../furniture/NursingChair';
import { FoodTray, WaterJug } from '../furniture/BabyProps';
import { getQuestionsByRoomKey } from '../../data/quizData';

import { WallBoard, TitleSign, WallScreen, WindowWithCurtains, DiningTable, LoungeCorner, useEnterToActivate } from '../ward/WardKit';
import { WARD101_BOARDS } from '../ward/wardData';

export default function MotherCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby, openWardModal, wardFlow, learningProgress } = useStore();
  const ROOM = 'motherCare1';
  const flow = wardFlow[ROOM] || {};
  const slideSeen = !!flow.slide;
  const activityDone = !!flow.activity;
  const isCompleted = !!(learningProgress && learningProgress[ROOM]) || activityDone;
  const B = WARD101_BOARDS;

  const [activeTab, setActiveTab] = useState(0); // 0: พักผ่อน, 1: โภชนาการ, 2: ล้างมือ, 3: เคลื่อนไหว, 4: แบบประเมิน
  const [isBoardFullScreen, setIsBoardFullScreen] = useState(false);

  // ── กิจกรรม 1: พักผ่อนและขอความช่วยเหลือ ──
  const [act1Cards, setAct1Cards] = useState([
    { id: 'rest', text: 'พักผ่อนเมื่อมีโอกาส (เมื่อลูกหลับ แม่ควรหลับพักตาม)', category: null, correct: 'do', reason: 'ช่วยให้ร่างกายและมดลูกมีเวลาฟื้นตัว ลดความเหนื่อยล้า' },
    { id: 'help', text: 'ขอความช่วยเหลือจากคนในครอบครัวเมื่อเหนื่อยหรือดูแลลูกไม่ไหว', category: null, correct: 'do', reason: 'การสนับสนุนจากครอบครัวช่วยลดภาวะซึมเศร้าและความเครียดสะสม' },
    { id: 'hard_work', text: 'ทำงานบ้านหนัก ยกของหนักทันทีหลังคลอด', category: null, correct: 'avoid', reason: 'การยกของหนักทำให้แผลหายช้า เลือดออกมากขึ้น หรือกล้ามเนื้ออุ้งเชิงกรานบาดเจ็บ' },
    { id: 'force_act', text: 'ฝืนทำกิจกรรมทั้งที่มีอาการปวดหรือเลือดออกมาก', category: null, correct: 'avoid', reason: 'หากเหนื่อยหรือมีอาการผิดปกติ ไม่ควรฝืนทำกิจกรรมหนัก ควรพักและปรึกษาแพทย์' },
  ]);
  const [act1Checked, setAct1Checked] = useState(false);
  const [act1Feedback, setAct1Feedback] = useState(null);

  const handleAct1Assign = (id, targetCat) => {
    setAct1Cards(prev => prev.map(c => c.id === id ? { ...c, category: targetCat } : c));
    setAct1Checked(false);
    setAct1Feedback(null);
  };

  const checkAct1 = () => {
    const allAssigned = act1Cards.every(c => c.category !== null);
    if (!allAssigned) {
      setAct1Feedback({ pass: false, msg: 'กรุณาจัดหมวดหมู่การ์ดพฤติกรรมให้ครบทั้ง 4 ใบก่อนตรวจคำตอบครับ' });
      return;
    }
    const allCorrect = act1Cards.every(c => c.category === c.correct);
    setAct1Checked(true);
    if (allCorrect) {
      setAct1Feedback({ pass: true, msg: '✓ ถูกต้องทั้งหมด! พฤติกรรมนี้ช่วยให้ร่างกายมีเวลาฟื้นตัวอย่างเหมาะสมตามคำแนะนำของ WHO (2022)' });
    } else {
      setAct1Feedback({ pass: false, msg: '✕ ยังมีบางข้อไม่ถูกต้อง ลองพิจารณาว่ากิจกรรมใดช่วยฟื้นตัว และกิจกรรมใดอาจทำให้แผลหรือร่างกายบาดเจ็บ' });
    }
  };

  // ── กิจกรรม 2: เลือกอาหารที่เหมาะสมหลังคลอด ──
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const foodOptions = [
    { id: 'grains', name: 'ข้าวกล้อง / ธัญพืช', group: 'healthy', desc: 'ให้พลังงานเชิงซ้อน ใยอาหารสูง' },
    { id: 'protein', name: 'ปลา / ไข่ / เนื้อสัตว์ไม่ติดมัน / ถั่ว', group: 'healthy', desc: 'โปรตีนคุณภาพสูง ซ่อมแซมเนื้อเยื่อ เสริมน้ำนม' },
    { id: 'vegetables', name: 'ผักใบเขียว / ฟักทอง / ขิง / หัวปลี', group: 'healthy', desc: 'วิตามิน แร่ธาตุ และมีใยอาหารป้องกันท้องผูก' },
    { id: 'fruits', name: 'ผลไม้สด (กล้วย ส้ม แอปเปิ้ล มะละกอ)', group: 'healthy', desc: 'วิตามินซีสูง ช่วยดูดซึมธาตุเหล็ก' },
    { id: 'calcium', name: 'นมสด / ผลิตภัณฑ์นม / งาดำ (แคลเซียม)', group: 'healthy', desc: 'บำรุงกระดูกและทดแทนแคลเซียมในน้ำนมแม่' },
    { id: 'water', name: 'น้ำดื่มสะอาด 2.5–3 ลิตร/วัน', group: 'healthy', desc: 'ดื่มน้ำให้เพียงพอตามความต้องการ เสริมการสร้างน้ำนม' },
    { id: 'junk', name: 'ของหวานจัด / มันจัด / เค็มจัด', group: 'unhealthy', desc: 'ควรลด/หลีกเลี่ยง เพิ่มความเสี่ยงบวมและความดัน' },
    { id: 'alcohol', name: 'เครื่องดื่มแอลกอฮอล์ / ของหมักดอง', group: 'unhealthy', desc: 'ควรหลีกเลี่ยงอย่างเด็ดขาด ส่งผลต่อน้ำนมและพัฒนาการทารก' },
  ];

  const toggleFood = (id) => {
    setSelectedFoods(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setAct2Feedback(null);
  };

  const checkAct2 = () => {
    const hasUnhealthy = selectedFoods.some(id => id === 'junk' || id === 'alcohol');
    const healthyCount = selectedFoods.filter(id => id !== 'junk' && id !== 'alcohol').length;

    if (hasUnhealthy) {
      setAct2Feedback({ pass: false, msg: '✕ จานอาหารของคุณมีของหวานจัด/เค็มจัด หรือแอลกอฮอล์ ซึ่งควรหลีกเลี่ยงในช่วงให้นมบุตร' });
    } else if (healthyCount >= 4) {
      setAct2Feedback({ pass: true, msg: '✓ ยอดเยี่ยมมาก! มื้อนี้มีอาหารหลากหลาย มีโปรตีน ผัก ผลไม้ แคลเซียม และน้ำสะอาดครบถ้วน ช่วยฟื้นฟูร่างกายและสร้างน้ำนมคุณภาพ' });
    } else {
      setAct2Feedback({ pass: false, msg: '✕ กรุณาเลือกอาหารที่มีประโยชน์ให้หลากหลายอย่างน้อย 4 กลุ่มขึ้นไป (โปรตีน, ผัก, ผลไม้, ธัญพืช, น้ำ)' });
    }
  };

  // ── กิจกรรม 3: การล้างมือและการดูแลความสะอาด ──
  const washOrder = [
    { stepNum: 1, text: '1. เปียกมือด้วยน้ำสะอาดที่ไหลผ่าน' },
    { stepNum: 2, text: '2. ใช้สบู่และฟอกถูให้ทั่ว (ฝ่ามือ ซอกนิ้ว หลังมือ ข้อมือ) อย่างน้อย 20 วินาที' },
    { stepNum: 3, text: '3. ล้างฟองสบู่ออกด้วยน้ำสะอาดไหลผ่าน' },
    { stepNum: 4, text: '4. เช็ดมือให้แห้งสนิทด้วยผ้าสะอาดหรือกระดาษเช็ดมือ' },
  ];
  const [selectedTimings, setSelectedTimings] = useState([]);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const timingOptions = [
    { id: 't1', text: 'ก่อนและหลังสัมผัสดูแลลูกน้อย', correct: true },
    { id: 't2', text: 'ก่อนให้นมบุตรหรือบีบเก็บน้ำนม', correct: true },
    { id: 't3', text: 'หลังเข้าห้องน้ำและขับถ่าย', correct: true },
    { id: 't4', text: 'หลังเปลี่ยนผ้าอ้อมหรือทิ้งขยะ', correct: true },
  ];

  const checkAct3 = () => {
    const allSelected = selectedTimings.length === timingOptions.length;
    if (allSelected) {
      setAct3Feedback({ pass: true, msg: '✓ ขั้นตอนถูกต้องครบถ้วน! การล้างมือสะอาดตาม 4 ขั้นตอนและล้างในเวลาสำคัญช่วยป้องกันการแพร่กระจายเชื้อสู่ลูกน้อยและแผลหลังคลอด' });
    } else {
      setAct3Feedback({ pass: false, msg: '✕ อย่าลืมเลือกช่วงเวลาสำคัญในการล้างมือให้ครบทั้ง 4 ข้อ เพื่อสุขอนามัยที่ปลอดภัยสูงสุด' });
    }
  };

  // ── กิจกรรม 4: เริ่มเคลื่อนไหวอย่างเหมาะสม ──
  const [act4Answers, setAct4Answers] = useState({
    walk: null,
    stretch: null,
    rest: null,
    heavy_lift: null,
    hard_gym: null,
  });
  const [act4Feedback, setAct4Feedback] = useState(null);

  const handleAct4Select = (key, val) => {
    setAct4Answers(prev => ({ ...prev, [key]: val }));
    setAct4Feedback(null);
  };

  const checkAct4 = () => {
    const correctMap = {
      walk: 'fit',
      stretch: 'fit',
      rest: 'fit',
      heavy_lift: 'heavy',
      hard_gym: 'heavy'
    };
    const allFilled = Object.values(act4Answers).every(v => v !== null);
    if (!allFilled) {
      setAct4Feedback({ pass: false, msg: 'กรุณาจำแนกกิจกรรมให้ครบทุกข้อก่อนตรวจคำตอบครับ' });
      return;
    }
    const isAllCorrect = Object.keys(correctMap).every(k => act4Answers[k] === correctMap[k]);
    if (isAllCorrect) {
      setAct4Feedback({ pass: true, msg: '✓ ถูกต้อง! เริ่มต้นจากการเคลื่อนไหวเบาๆ และค่อยๆ เพิ่มขึ้นตามความพร้อมของร่างกาย หากมีอาการปวดหรือเลือดออกเพิ่มขึ้นให้หยุดพักทันที' });
    } else {
      setAct4Feedback({ pass: false, msg: '✕ ยังมีบางกิจกรรมที่จำแนกไม่ถูกต้อง กิจกรรมหนักหรือการยกของหนักควรหลีกเลี่ยงในช่วง 6 สัปดาห์แรก' });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 5 & 6) ──
  const room1Questions = getQuestionsByRoomKey('motherCare1');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = room1Questions[quizIndex] || room1Questions[0];

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
    if (quizIndex < room1Questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare1');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและแบบประเมินความรู้ห้องที่ 1 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room1Questions.length} คะแนน)`
      );
    }
  };

  const startActivity = () => {
    openWardModal('food', ROOM);
  };
  useEnterToActivate([1.5, 1.5], 2.2, startActivity);

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
            ZONE 1: การดูแลตนเองหลังคลอด (Ward 101)
          </span>
          <h2 style={{ margin: '6px 0 0 0', color: '#c2185b', fontSize: '20px', fontWeight: 800 }}>
            {activeTab === 0 && 'กิจกรรม 1 — พักผ่อนและขอความช่วยเหลือ'}
            {activeTab === 1 && 'กิจกรรม 2 — เลือกอาหารที่เหมาะสมหลังคลอด'}
            {activeTab === 2 && 'กิจกรรม 3 — ล้างมือและดูแลความสะอาด'}
            {activeTab === 3 && 'กิจกรรม 4 — เริ่มเคลื่อนไหวอย่างเหมาะสม'}
            {activeTab === 4 && 'แบบประเมินความรู้ประจำห้องที่ 1 (ข้อ 5 & 6)'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => openWardModal('slide', ROOM)}
            style={{ background: '#fdf2f8', color: '#be185d', border: '1.5px solid #f472b6', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            📖 ดูสไลด์แผ่นภาพ Zone 1
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
        {['1. การพักผ่อน', '2. โภชนาการ', '3. ล้างมือ', '4. การเคลื่อนไหว', '5. แบบประเมิน (Quiz)'].map((label, idx) => (
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

      {/* ── TAB 0: กิจกรรม 1 — พักผ่อนและขอความช่วยเหลือ ── */}
      {activeTab === 0 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> ให้คุณแม่รู้จักการพักผ่อน จัดลำดับกิจกรรม และขอความช่วยเหลือในช่วงฟื้นตัว โดยแยกพฤติกรรมเป็น &ldquo;ควรทำ&rdquo; หรือ &ldquo;ควรหลีกเลี่ยง&rdquo;
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {/* Column 1: ควรทำ */}
            <div style={{ background: '#f0fdf4', border: '2px dashed #22c55e', borderRadius: '14px', padding: '14px', minHeight: '160px' }}>
              <h4 style={{ color: '#15803d', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅</span> ช่อง &ldquo;ควรทำ&rdquo; (พฤติกรรมส่งเสริมการฟื้นตัว)
              </h4>
              {act1Cards.filter(c => c.category === 'do').map(c => (
                <div key={c.id} style={{ background: 'white', padding: '10px', borderRadius: '10px', marginBottom: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: act1Checked ? (c.correct === 'do' ? '1.5px solid #22c55e' : '1.5px solid #ef4444') : '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.text}</div>
                  {act1Checked && <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>💡 {c.reason}</div>}
                  <button type="button" onClick={() => handleAct1Assign(c.id, null)} style={{ marginTop: '6px', fontSize: '11px', background: '#fee2e2', color: '#991b1b', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>นำออก</button>
                </div>
              ))}
              {act1Cards.filter(c => c.category === 'do').length === 0 && (
                <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '34px' }}>คลิกปุ่ม &ldquo;+ ควรทำ&rdquo; จากรายการด้านล่าง</div>
              )}
            </div>

            {/* Column 2: ควรหลีกเลี่ยง */}
            <div style={{ background: '#fef2f2', border: '2px dashed #ef4444', borderRadius: '14px', padding: '14px', minHeight: '160px' }}>
              <h4 style={{ color: '#b91c1c', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚠️</span> ช่อง &ldquo;ควรหลีกเลี่ยง / ต้องระวัง&rdquo;
              </h4>
              {act1Cards.filter(c => c.category === 'avoid').map(c => (
                <div key={c.id} style={{ background: 'white', padding: '10px', borderRadius: '10px', marginBottom: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: act1Checked ? (c.correct === 'avoid' ? '1.5px solid #22c55e' : '1.5px solid #ef4444') : '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.text}</div>
                  {act1Checked && <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>💡 {c.reason}</div>}
                  <button type="button" onClick={() => handleAct1Assign(c.id, null)} style={{ marginTop: '6px', fontSize: '11px', background: '#fee2e2', color: '#991b1b', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>นำออก</button>
                </div>
              ))}
              {act1Cards.filter(c => c.category === 'avoid').length === 0 && (
                <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '34px' }}>คลิกปุ่ม &ldquo;+ ควรหลีกเลี่ยง&rdquo; จากรายการด้านล่าง</div>
              )}
            </div>
          </div>

          {/* Unassigned Cards Pool */}
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>การ์ดพฤติกรรมที่ต้องจัดหมวดหมู่:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {act1Cards.filter(c => c.category === null).map(c => (
                <div key={c.id} style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '500', marginBottom: '8px' }}>{c.text}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleAct1Assign(c.id, 'do')} style={{ flex: 1, padding: '6px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      + ควรทำ
                    </button>
                    <button type="button" onClick={() => handleAct1Assign(c.id, 'avoid')} style={{ flex: 1, padding: '6px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      + ควรหลีกเลี่ยง
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              ✓ ตรวจคำตอบกิจกรรม 1
            </button>
            {act1Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ไปกิจกรรม 2: โภชนาการ ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 1: กิจกรรม 2 — เลือกอาหารที่เหมาะสมหลังคลอด ── */}
      {activeTab === 1 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> ฝึกจัดจานอาหารสุขภาพหลังคลอดที่มีความหลากหลาย มีโปรตีน ผัก ผลไม้ แคลเซียม และน้ำสะอาดเพียงพอ (WHO 2022)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {foodOptions.map(f => {
              const isSelected = selectedFoods.includes(f.id);
              return (
                <div
                  key={f.id}
                  onClick={() => toggleFood(f.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #e91e63' : '1px solid #e2e8f0',
                    background: isSelected ? '#fce4ec' : 'white',
                    transition: 'all 0.15s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: isSelected ? '#c2185b' : '#1e293b' }}>{f.name}</span>
                    <span>{isSelected ? '✅' : '➕'}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{f.desc}</div>
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
              🍽️ ตรวจมื้ออาหาร
            </button>
            {act2Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ไปกิจกรรม 3: สุขอนามัยและล้างมือ ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: กิจกรรม 3 — ล้างมือและดูแลความสะอาด ── */}
      {activeTab === 2 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> ฝึกการล้างมือ 4 ขั้นตอนอย่างถูกวิธี และเลือกช่วงเวลาสำคัญที่ต้องล้างมือเพื่อสุขอนามัยของแม่และลูก
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>💧 4 ขั้นตอนการล้างมือที่ถูกต้อง:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
              {washOrder.map(s => (
                <div key={s.stepNum} style={{ background: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px', lineHeight: '1.4' }}>
                  <strong style={{ color: '#0284c7' }}>ขั้นตอนที่ {s.stepNum}</strong>
                  <p style={{ margin: '6px 0 0 0' }}>{s.text.substring(3)}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>⏱️ เลือกช่วงเวลาที่ &ldquo;ต้องล้างมืออย่างเคร่งครัด&rdquo; (คลิกเลือกทุกข้อที่ถูกต้อง):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {timingOptions.map(t => {
                const isPicked = selectedTimings.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTimings(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                    style={{
                      background: isPicked ? '#dcfce7' : 'white',
                      border: isPicked ? '2px solid #16a34a' : '1px solid #d1d5db',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: isPicked ? '#14532d' : '#374151'
                    }}
                  >
                    <span>{isPicked ? '☑' : '☐'}</span>
                    <span>{t.text}</span>
                  </div>
                );
              })}
            </div>
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
                ไปกิจกรรม 4: การเคลื่อนไหว ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: กิจกรรม 4 — เริ่มเคลื่อนไหวอย่างเหมาะสม ── */}
      {activeTab === 3 && (
        <div>
          <div style={{ background: '#fdf2f8', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ec4899' }}>
            <strong>เป้าหมาย:</strong> แยกแยะกิจกรรมที่เหมาะสมกับการเริ่มกลับมาเคลื่อนไหวออกจากกิจกรรมที่หนักเกินไป (ACOG 2020 / WHO 2022)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {[
              { id: 'walk', label: '1. การเดินเบา ๆ รอบห้องหรือบริเวณบ้าน และเปลี่ยนอิริยาบถบ่อย ๆ' },
              { id: 'stretch', label: '2. การยืดเหยียดกล้ามเนื้อเบา ๆ และขมิบช่องคลอด (Kegel Exercise)' },
              { id: 'rest', label: '3. หยุดพักทันทีเมื่อรู้สึกเหนื่อย ล้า หรือปวด' },
              { id: 'heavy_lift', label: '4. การยกของหนัก เช่น ถังน้ำ หรือของที่มีน้ำหนักมาก' },
              { id: 'hard_gym', label: '5. เริ่มออกกำลังกายหนัก วิ่ง กระโดด หรือยกเวททันทีในสัปดาห์แรก' },
            ].map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{item.label}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleAct4Select(item.id, 'fit')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: act4Answers[item.id] === 'fit' ? '#16a34a' : '#cbd5e1',
                      background: act4Answers[item.id] === 'fit' ? '#dcfce7' : 'white',
                      color: act4Answers[item.id] === 'fit' ? '#15803d' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    เหมาะสม
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAct4Select(item.id, 'heavy')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: act4Answers[item.id] === 'heavy' ? '#dc2626' : '#cbd5e1',
                      background: act4Answers[item.id] === 'heavy' ? '#fee2e2' : 'white',
                      color: act4Answers[item.id] === 'heavy' ? '#991b1b' : '#475569',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    หนักเกินไป / ต้องปรึกษา
                  </button>
                </div>
              </div>
            ))}
          </div>

          {act4Feedback && (
            <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act4Feedback.pass ? '#dcfce7' : '#fee2e2', color: act4Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
              {act4Feedback.msg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={checkAct4}
              style={{ background: '#e91e63', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              ✓ ตรวจคำตอบกิจกรรม 4
            </button>
            {act4Feedback?.pass && (
              <button
                type="button"
                onClick={() => setActiveTab(4)}
                style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                ทำแบบประเมินความรู้ท้ายบท ➜
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: แบบประเมินความรู้ประจำห้องที่ 1 (ข้อ 5 & 6) ── */}
      {activeTab === 4 && (
        <div>
          {!quizFinished ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#fce4ec', color: '#c2185b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  📋 แบบประเมิน: {currentQ.room}
                </span>
                <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                  ข้อ {quizIndex + 1} / {room1Questions.length} | คะแนนสะสม: {quizScore}
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
                      {quizIndex < room1Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สำเร็จบทเรียน 🏆'}
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
              <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ห้องที่ 1 แล้ว!</h2>
              <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                คะแนนของคุณ: <strong>{quizScore} / {room1Questions.length} คะแนน</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                คุณมีความเข้าใจที่ถูกต้องในการดูแลร่างกายและการฟื้นตัวหลังคลอดตามมาตรฐานงานวิจัยครบถ้วน
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
        roomTitle="ห้องบริบาลมารดา 1: การดูแลร่างกายและการฟื้นตัวหลังคลอด"
        roomNumber="Ward 101"
      />

      {/* ── Top-Right Mission HUD (Portaled to document.body so user can explore 3D room freely) ── */}
      <ScreenPortal>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-pink-400 text-slate-800">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2">
            <span className="text-xs font-extrabold text-pink-900">
              🏥 ภารกิจห้องดูแลร่างกาย (Ward 101)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'
              }`}
            >
              {isCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังเรียนรู้'}
            </span>
          </div>
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
              <span>📖 2. อ่านสไลด์ความรู้ Zone 1</span>
              <span className="font-bold">{slideSeen ? '☑ อ่านแล้ว' : 'เปิดอ่าน ▶'}</span>
            </button>

            <button
              type="button"
              onClick={() => openWardModal('food', ROOM)}
              className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                activityDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-950'
              }`}
            >
              <span>🍽️ 3. กิจกรรมโต๊ะอาหาร (เลือก 3 เมนู)</span>
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

      {/* ── ป้ายและบอร์ดผนัง (ติดผนังด้านใน z = -8.80, x = -8.80 อย่างแนบสนิท) ── */}
      <TitleSign position={[-6.3, 4.9, -8.78]} width={4.4} height={2.0} line1={B.title.line1} line2={B.title.line2} />
      <WallBoard position={[-6.3, 2.5, -8.78]} width={3.2} height={2.6} title={B.goals.title} items={B.goals.items} />
      <WallScreen position={[-0.8, 3.0, -8.78]} width={5.8} src={'/images/ward/zone1_slide.jpg'} room={ROOM} label="Zone 1" />
      <WallBoard position={[4.1, 3.4, -8.78]} width={2.85} height={3.6} title={B.selfCare.title} items={B.selfCare.items} />
      <WallBoard position={[7.2, 3.4, -8.78]} width={2.85} height={3.6} title={B.recovery.title} items={B.recovery.items} accent="#26a69a" />
      <WindowWithCurtains position={[-8.78, 2.6, -2.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* ══════════════════════════════════════════════════════════════════════════
          🏥 INTERACTIVE PROJECTOR LEARNING BOARD (Restored at Projector Screen per Client Request)
          ══════════════════════════════════════════════════════════════════════════ */}
      {!isBoardFullScreen && (
        <Html position={[-0.8, 2.85, -8.62]} center transform scale={0.21} zIndexRange={[15, 0]}>
          {renderProjectorBoardContent(false)}
        </Html>
      )}

      <LoungeCorner position={[7.4, 0, 6.2]} rotation={[0, -Math.PI / 2, 0]} />
      <DiningTable position={[1.5, 0, 1.5]} locked={false} onActivate={startActivity} />

      {/* ── REAL 3D CLINICAL ASSETS & ARCHITECTURE ── */}
      <RealPlant type="potted" position={[7.5, 0, -7.5]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <MedicineCabinet position={[8.4, 0, -2.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Drivable Hospital Wheelchair parked neatly along entrance wall */}
      <InteractiveSeat
        id="ward101_wheelchair"
        name="รถเข็นผู้ป่วย Ward 101"
        type="wheelchair"
        position={[-7.5, 0, 3.2]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* ── 1. Hospital Patient Bed with Soft Pillows (กิจกรรม 1: พักผ่อนและขอความช่วยเหลือ) ── */}
      <InteractiveSeat
        id="room101_bed"
        name="เตียงพักฟื้นคุณแม่"
        type="bed"
        position={[-5.4, 0, -6.0]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.68, 0]}
      >
        <group onClick={() => setActiveTab(0)}>
          <HospitalBed position={[0, 0, 0]} />
          {/* Pillows resting securely on top of mattress headboard */}
          <Pillows position={[0.05, 0.72, -0.75]} rotation={[0, 0, 0]} scale={0.75} />
        </group>
      </InteractiveSeat>

      {/* ── 2. Bedside Nightstand with Hydration & Nutrition (กิจกรรม 2: โภชนาการและน้ำดื่ม) ── */}
      <group position={[-7.2, 0, -6.8]} onClick={() => setActiveTab(1)}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.05}>
          <FlowerVase position={[0.12, 0.82, 0.08]} scale={0.65} />
          {/* Clean Glass Water Pitcher */}
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.26, 24]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.9} roughness={0.05} />
          </mesh>
        </HospitalNightstand>
      </group>

      {/* ── 3. Newborn Bassinet at Bedside (Rooming-in next to mother's bed) ── */}
      <group position={[-3.4, 0, -6.0]} rotation={[0, -0.15, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
          )}
        </BabyCrib>
        <Html position={[0, 1.25, 0]} center zIndexRange={[15, 0]}>
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

      {/* ── 4. Porcelain Sanitary Wash Station (กิจกรรม 3: การล้างมือ 4 ขั้นตอน) ── */}
      {/* Mounted flush against the right perimeter wall */}
      <group position={[8.3, 0, 2.5]} rotation={[0, -Math.PI / 2, 0]} onClick={() => setActiveTab(2)}>
        <Washbasin position={[0, 0, 0]} />
      </group>
      <HospitalTrashBin position={[8.3, 0, 0.8]} scale={0.85} />

      {/* ── 5. Maternal Recovery & Gentle Mobilization Lounge (กิจกรรม 4: การเคลื่อนไหวอย่างเหมาะสม) ── */}
      <group position={[5.4, 0, -6.5]} rotation={[0, -Math.PI / 6, 0]} onClick={() => setActiveTab(3)}>
        <NursingChair position={[0, 0, 0]} scale={1.1} />
        {/* Soft supportive cushion on the chair */}
        <Pillows position={[0, 0.42, 0.05]} scale={0.65} />
      </group>
      {/* Side table with warm nutrition/water carafe & folded baby diapers beside the chair */}
      <group position={[4.0, 0, -6.8]}>
        <HospitalNightstand position={[0, 0, 0]} scale={0.85}>
          <mesh position={[-0.12, 0.90, -0.05]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.22, 20]} />
            <meshPhysicalMaterial color="#f0fdf4" transmission={0.85} roughness={0.1} />
          </mesh>
          {/* กองผ้าอ้อมพับสำหรับลูกน้อยบนโต๊ะข้างเก้าอี้ให้นม */}
          {[
            { y: 0.80, color: '#ffffff' },
            { y: 0.84, color: '#fce7f3' },
            { y: 0.88, color: '#e0f2fe' },
          ].map((d, i) => (
            <mesh key={i} position={[0.10, d.y, 0.04]} rotation={[0, i * 0.1, 0]} castShadow>
              <boxGeometry args={[0.22, 0.036, 0.18]} />
              <meshStandardMaterial color={d.color} roughness={0.85} />
            </mesh>
          ))}
        </HospitalNightstand>
      </group>

      <PlayerController initialPosition={[0, 0, 3]} />

      {/* ── โภชนาการ: ถาดอาหาร + กระบอกน้ำ (Zone 1 ref) ── */}
      <FoodTray position={[4.0, 0.80, -6.8]} rotation={[0, 0.3, 0]} />
      <WaterJug position={[4.25, 0.80, -7.05]} />
    </group>
  );
}
