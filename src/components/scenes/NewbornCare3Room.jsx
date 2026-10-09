import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import Washbasin from '../furniture/Washbasin';
import MedicalCart from '../furniture/MedicalCart';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import DrawerCabinet from '../furniture/DrawerCabinet';
import CleaningBottle from '../decorations/CleaningBottle';
import DoctorDesk from '../furniture/DoctorDesk';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function NewbornCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby, openLightbox } = useStore();
  const [activeTab, setActiveTab] = useState(0); // 0: ขั้นตอนการเช็ดสะดือ, 1: สะดือเปียกน้ำทำอย่างไร, 2: การพับผ้าอ้อม, 3: สังเกตการติดเชื้อ, 4: แบบประเมิน

  // ── กิจกรรม 1: ขั้นตอนการเช็ดทำความสะอาดสายสะดือ (เรียงลำดับ 4 ขั้นตอน) ──
  const [cordSteps, setCordSteps] = useState([
    { id: 2, text: 'ใช้สำลีก้อน/ไม้พันสำลีสะอาดชุบ 70% แอลกอฮอล์ หรือน้ำต้มสุกสะอาด', correctOrder: 2 },
    { id: 4, text: 'ปล่อยให้สายสะดือแห้งเองตามธรรมชาติ ห้ามโรยแป้ง ยาผง หรือสมุนไพร', correctOrder: 4 },
    { id: 1, text: 'ล้างมือให้สะอาดด้วยสบู่และน้ำไหล แล้วเช็ดมือให้แห้ง', correctOrder: 1 },
    { id: 3, text: 'เช็ดวนรอบโคนสะดือขึ้นไปสู่ปลายสะดือ (เช็ดรอบเดียวแล้วทิ้ง ห้ามเช็ดย้อนกลับ)', correctOrder: 3 },
  ]);
  const [act1Feedback, setAct1Feedback] = useState(null);

  const moveCordStep = (index, dir) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= cordSteps.length) return;
    const updated = [...cordSteps];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setCordSteps(updated);
    setAct1Feedback(null);
  };

  const checkCordSteps = () => {
    const isCorrect = cordSteps.every((item, idx) => item.correctOrder === idx + 1);
    if (isCorrect) {
      setAct1Feedback({
        pass: true,
        msg: '✓ ถูกต้องทั้งหมด! การเช็ดสะดือต้องล้างมือก่อนเสมอ ชุบแอลกอฮอล์ 70% เช็ดจากโคนสะดือวนขึ้นสู่ปลายสะดือรอบเดียวทิ้ง และปล่อยให้แห้ง ห้ามโรยแป้ง'
      });
    } else {
      setAct1Feedback({
        pass: false,
        msg: '✕ ลำดับยังไม่ถูกต้อง: ต้องเริ่มจากล้างมือให้สะอาด ชุบสำลี เช็ดจากโคนขึ้นสู่ปลาย และปล่อยให้แห้ง'
      });
    }
  };

  // ── สถานการณ์จำลองพิเศษ: "สะดือเปียกน้ำ ต้องทำอย่างไร ?" ──
  const [wetCordAnswer, setWetCordAnswer] = useState(null);
  const [wetCordFeedback, setWetCordFeedback] = useState(null);

  const handleSelectWetCord = (ans) => {
    setWetCordAnswer(ans);
    if (ans === 'dry_and_alcohol') {
      setWetCordFeedback({
        pass: true,
        title: '✓ ถูกต้องยอดเยี่ยมตามหลักสุขอนามัยทางการพยาบาล!',
        msg: 'เมื่อสะดือเปียกน้ำ ต้องรีบใช้สำลีสะอาดซับให้แห้งสนิททันที แล้วใช้สำลีชุบ 70% แอลกอฮอล์เช็ดรอบโคนสะดือวนขึ้นสู่ปลายอีกครั้ง ปล่อยให้แห้งตามธรรมชาติ ห้ามโรยแป้ง ยาผง หรือสมุนไพรใดๆ เด็ดขาด เพื่อป้องกันการสะสมของเชื้อแบคทีเรีย'
      });
    } else if (ans === 'powder') {
      setWetCordFeedback({
        pass: false,
        title: '✕ ห้ามโรยแป้งเด็ดขาด!',
        msg: 'แป้งเด็กจะจับตัวเป็นก้อนหมักหมมความชื้นไว้ใต้โคนสะดือ กลายเป็นแหล่งเพาะเชื้อแบคทีเรียชั้นดี และทำให้สะดืออักเสบติดเชื้อรุนแรงได้'
      });
    } else if (ans === 'blow_dry') {
      setWetCordFeedback({
        pass: false,
        title: '✕ ไม่ควรใช้ไดร์เป่าผม!',
        msg: 'ลมร้อนจากไดร์เป่าผมอาจลวกผิวหนังทารกที่บอบบาง และกระแสลมอาจพัดพาฝุ่นละอองเชื้อโรคเข้าสู่แผลสะดือได้'
      });
    } else {
      setWetCordFeedback({
        pass: false,
        title: '✕ ไม่ถูกต้อง!',
        msg: 'การปล่อยทิ้งไว้ให้สะดือชื้นและใส่ผ้าอ้อมทับ จะทำให้เกิดภาวะอับชื้น เป็นสาเหตุหลักของการติดเชื้อที่สายสะดือ (Omphalitis)'
      });
    }
  };

  // ── กิจกรรม 2: เทคนิคการใส่ผ้าอ้อมและการพับขอบ ──
  const [diaperFold, setDiaperFold] = useState(null); // 'below' | 'above'
  const [act2Feedback, setAct2Feedback] = useState(null);

  const handleSelectFold = (fold) => {
    setDiaperFold(fold);
    if (fold === 'below') {
      setAct2Feedback({
        pass: true,
        msg: '✓ ถูกต้องยอดเยี่ยม! การพับขอบผ้าอ้อมให้อยู่ "ต่ำกว่าสายสะดือ" ช่วยให้อากาศถ่ายเท สะดือแห้งเร็ว และป้องกันไม่ให้ปัสสาวะหรืออุจจาระเปรอะเปื้อนสะดือ'
      });
    } else {
      setAct2Feedback({
        pass: false,
        msg: '✕ ไม่ถูกต้อง: การดึงผ้าอ้อมคลุมทับสายสะดือจะทำให้สะดืออับชื้น และเสี่ยงต่อการถูกน้ำปัสสาวะเปรอะเปื้อนจนติดเชื้อรุนแรง'
      });
    }
  };

  // ── กิจกรรม 3: สังเกตสัญญาณอันตรายสะดือติดเชื้อ (Omphalitis) ──
  const [infectionSigns, setInfectionSigns] = useState([
    { id: 's1', text: 'โคนสายสะดือบวม แดง หรือมีรอยแดงลามมาที่ผิวหนังหน้าท้อง', correct: true },
    { id: 's2', text: 'มีหนองสีเหลือง/เขียว หรือมีกลิ่นเหม็นเน่ารุนแรง', correct: true },
    { id: 's3', text: 'มีเลือดสดซึมออกจากโคนสะดือไม่หยุด', correct: true },
    { id: 's4', text: 'ทารกมีไข้ ซึม ไม่ยอมดูดนม หรือร้องกวนเมื่อสัมผัสสะดือ', correct: true },
    { id: 's5', text: 'สายสะดือแห้งเป็นสีดำคล้ำและค่อยๆ หลุดเองใน 7–14 วัน โดยไม่มีกลิ่น', correct: false },
  ]);
  const [selectedSigns, setSelectedSigns] = useState([]);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const toggleSign = (id) => {
    setSelectedSigns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setAct3Feedback(null);
  };

  const checkSigns = () => {
    const hasNormal = selectedSigns.includes('s5');
    const dangerCount = selectedSigns.filter(id => id !== 's5').length;

    if (hasNormal) {
      setAct3Feedback({ pass: false, msg: '✕ ข้อ "สะดือแห้งดำคล้ำและหลุดเองใน 7–14 วัน" เป็นกระบวนการปกติ ไม่ใช่การติดเชื้อ' });
    } else if (dangerCount === 4) {
      setAct3Feedback({
        pass: true,
        msg: '✓ ถูกต้องครบถ้วน! ทั้ง 4 อาการ (บวมแดง, หนอง/กลิ่นเหม็น, เลือดซึมไม่หยุด, มีไข้ซึม) เป็นสัญญาณสะดืออักเสบติดเชื้อ ต้องรีบพาไปพบแพทย์ทันที'
      });
    } else {
      setAct3Feedback({ pass: false, msg: '✕ กรุณาเลือกสัญญาณอันตรายของการติดเชื้อให้ครบทั้ง 4 ข้อ' });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 12 & 19) ──
  const room3Questions = getQuestionsByRoomKey('newbornCare3');
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
      completeModule('newbornCare3');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้อง Nursery 203 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room3Questions.length} คะแนน)`
      );
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลทารก 3: การดูแลสายสะดือทารกแรกเกิด (ภาพจำลอง)"
        roomNumber="Cord Care Nursery 203"
      />

      {/* ── Wall Poster 1 on North Wall: การดูแลสายสะดือและการพับผ้าอ้อม ── */}
      <group position={[-3.4, 3.2, -7.8]}>
        <mesh
          castShadow
          className="cursor-pointer"
          onClick={() => openLightbox({
            src: '/references/room2/img_009.png',
            title: 'การดูแลสายสะดือทารกแรกเกิดและการพับผ้าอ้อม',
            caption: 'เช็ดวนรอบโคนสะดือสู่ปลาย ปล่อยให้แห้ง และพับขอบผ้าอ้อมใต้สะดือ',
            category: 'การดูแลสายสะดือ (Nursery 203)',
            clinicalDetails: [
              '1. เช็ดสายสะดือด้วยสำลีชุบ 70% แอลกอฮอล์ จากโคนสะดือวนขึ้นสู่ปลายสะดือ',
              '2. เช็ดรอบเดียวแล้วทิ้ง ห้ามเช็ดย้อนกลับไปมาเด็ดขาด',
              '3. ปล่อยให้แห้งเองตามธรรมชาติ ห้ามโรยแป้ง ยาผง หรือสมุนไพรใดๆ',
              '4. พับขอบผ้าอ้อมลงให้อยู่ใต้สายสะดือเสมอ เพื่อป้องกันการหมักหมมปัสสาวะและการเสียดสี'
            ]
          })}
        >
          <boxGeometry args={[2.0, 1.4, 0.04]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[2.08, 1.48, 0.02]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} />
        </mesh>
        <Html position={[0, 0, 0.05]} center transform scale={0.22}>
          <div
            onClick={() => openLightbox({
              src: '/references/room2/img_009.png',
              title: 'การดูแลสายสะดือทารกแรกเกิดและการพับผ้าอ้อม',
              caption: 'เช็ดวนรอบโคนสะดือสู่ปลาย ปล่อยให้แห้ง และพับขอบผ้าอ้อมใต้สะดือ',
              category: 'การดูแลสายสะดือ (Nursery 203)',
              clinicalDetails: [
                '1. เช็ดสายสะดือด้วยสำลีชุบ 70% แอลกอฮอล์ จากโคนสะดือวนขึ้นสู่ปลายสะดือ',
                '2. เช็ดรอบเดียวแล้วทิ้ง ห้ามเช็ดย้อนกลับไปมาเด็ดขาด',
                '3. ปล่อยให้แห้งเองตามธรรมชาติ ห้ามโรยแป้ง ยาผง หรือสมุนไพรใดๆ',
                '4. พับขอบผ้าอ้อมลงให้อยู่ใต้สายสะดือเสมอ เพื่อป้องกันการหมักหมมปัสสาวะและการเสียดสี'
              ]
            })}
            className="cursor-pointer select-none bg-white p-1 rounded-lg border-2 border-amber-500 shadow-xl hover:scale-105 transition overflow-hidden"
            style={{ width: '360px' }}
          >
            <img
              src="/references/room2/img_009.png"
              alt="การดูแลสายสะดือ"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="text-center py-1 bg-amber-50 rounded mt-1">
              <span className="text-[11px] font-bold text-amber-900">🩹 การดูแลสายสะดือ & ผ้าอ้อม (คลิกดูภาพขยาย)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* ── Wall Poster 2 on North Wall: เทคนิคการเช็ดสะดือ (โคนสู่ปลาย) ── */}
      <group position={[3.4, 3.2, -7.8]}>
        <mesh
          castShadow
          className="cursor-pointer"
          onClick={() => openLightbox({
            src: '/references/zone1_2/img_001.png',
            title: 'เทคนิคการเช็ดทำความสะอาดสายสะดืออย่างถูกวิธี',
            caption: 'การใช้ 70% แอลกอฮอล์ เช็ดรอบโคนสะดือวนขึ้นสู่ปลาย',
            category: 'การดูแลสายสะดือ (Nursery 203)',
            clinicalDetails: [
              '1. ล้างมือให้สะอาดก่อนสัมผัสสะดือทารกทุกครั้ง',
              '2. ใช้สำลีชุบ 70% แอลกอฮอล์พอหมาด เช็ดรอบโคนสะดือให้สะอาด',
              '3. วนขึ้นสู่ปลายสายสะดือ ทิ้งสำลีก้อนเดิมทันที',
              '4. ห้ามโรยแป้งฝุ่นรอบสะดือเด็ดขาด เพราะทำให้สะดือเปียกชื้นและอักเสบ'
            ]
          })}
        >
          <boxGeometry args={[2.0, 1.4, 0.04]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[2.08, 1.48, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} />
        </mesh>
        <Html position={[0, 0, 0.05]} center transform scale={0.22}>
          <div
            onClick={() => openLightbox({
              src: '/references/zone1_2/img_001.png',
              title: 'เทคนิคการเช็ดทำความสะอาดสายสะดืออย่างถูกวิธี',
              caption: 'การใช้ 70% แอลกอฮอล์ เช็ดรอบโคนสะดือวนขึ้นสู่ปลาย',
              category: 'การดูแลสายสะดือ (Nursery 203)',
              clinicalDetails: [
                '1. ล้างมือให้สะอาดก่อนสัมผัสสะดือทารกทุกครั้ง',
                '2. ใช้สำลีชุบ 70% แอลกอฮอล์พอหมาด เช็ดรอบโคนสะดือให้สะอาด',
                '3. วนขึ้นสู่ปลายสายสะดือ ทิ้งสำลีก้อนเดิมทันที',
                '4. ห้ามโรยแป้งฝุ่นรอบสะดือเด็ดขาด เพราะทำให้สะดือเปียกชื้นและอักเสบ'
              ]
            })}
            className="cursor-pointer select-none bg-white p-1 rounded-lg border-2 border-amber-600 shadow-xl hover:scale-105 transition overflow-hidden"
            style={{ width: '360px' }}
          >
            <img
              src="/references/zone1_2/img_001.png"
              alt="เทคนิคเช็ดสะดือ"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="text-center py-1 bg-amber-50 rounded mt-1">
              <span className="text-[11px] font-bold text-amber-900">✨ เทคนิคเช็ดสะดือโคนสู่ปลาย (คลิกดูภาพขยาย)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* ── REAL 3D ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* Cord Care Station Table with Baby (Shifted Left for unobstructed HUD view) */}
      <group position={[-5.2, 0, -3.2]}>
        <DrawerCabinet position={[0, 0, 0]} scale={0.9} />
        {/* Contoured Changing / Cord Care Pad */}
        <mesh position={[0, 1.72, 0.05]} receiveShadow castShadow>
          <boxGeometry args={[1.1, 0.08, 0.55]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.3} />
        </mesh>
        <CleaningBottle position={[-0.45, 1.76, 0.15]} scale={0.7} />

        {/* Baby lying on back on changing table */}
        {!isHoldingBaby && (
          <BabyAvatar
            pose="sleeping"
            position={[0, 1.76, 0.05]}
            scale={0.92}
            withBlanket={true}
          />
        )}
        <Html position={[0, 1.25, 0]} center distanceFactor={24}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #d97706, #b45309)',
              border: '2px solid white'
            }}
          >
            <span>{isHoldingBaby ? '🧸 วางลงเบาะ' : '👶 ตรวจสะดือ (คลิกอุ้ม)'}</span>
          </div>
        </Html>
      </group>

      {/* Sterile Supplies Cart */}
      <group position={[-6.8, 0, -3.2]}>
        <MedicalCart position={[0, 0, 0]} scale={1.05} />
      </group>

      {/* Doctor Consultation Desk & Quiz Kiosk */}
      <group position={[4.5, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={0.9} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          🔗 INTERACTIVE LEARNING HUD (Nursery 203: Cord Care)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html position={[0, 1.85, -7.8]} center transform scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.22 : 0.27}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '24px',
          borderRadius: '24px',
          width: '880px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '3px solid #f59e0b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fef3c7', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ background: '#d97706', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                NURSERY 203: การดูแลสายสะดือทารกแรกเกิด (ภาพจำลอง)
              </span>
              <h2 style={{ margin: '6px 0 0 0', color: '#b45309', fontSize: '22px' }}>
                {activeTab === 0 && 'ขั้นตอนการเช็ดทำความสะอาดสายสะดือ'}
                {activeTab === 1 && 'สถานการณ์จำลอง: สะดือเปียกน้ำ ต้องทำอย่างไร ?'}
                {activeTab === 2 && 'การใส่ผ้าอ้อม: พับขอบต่ำกว่าสายสะดือ'}
                {activeTab === 3 && 'การสังเกตอาการผิดปกติและสะดือติดเชื้อ'}
                {activeTab === 4 && 'แบบประเมินความรู้ประจำห้อง Nursery 203 (ข้อ 12 & 19)'}
              </h2>
            </div>
            <button
              onClick={() => setRoom('lobby')}
              style={{ background: '#f3f4f6', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ⬅ กลับสู่ล็อบบี้
            </button>
          </div>

          {/* Navigation Tabs (5 Tabs) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {['1. ขั้นตอนเช็ดสะดือ', '2. สะดือเปียกน้ำทำอย่างไร?', '3. การพับขอบผ้าอ้อม', '4. สังเกตการติดเชื้อ', '5. แบบประเมิน (Quiz)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === idx ? '#d97706' : '#fef3c7',
                  color: activeTab === idx ? 'white' : '#92400e',
                  fontWeight: 'bold',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── TAB 0: ขั้นตอนการเช็ดสะดือ (เรียงลำดับ) ── */}
          {activeTab === 0 && (
            <div>
              <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #f59e0b' }}>
                <strong>เป้าหมาย:</strong> ฝึกเรียงลำดับขั้นตอนการเช็ดสายสะดือที่ถูกต้องตามหลักสุขอนามัย (ใช้ปุ่มขึ้น/ลงเพื่อเรียงลำดับ 1 ถึง 4)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {cordSteps.map((step, idx) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#d97706', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{step.text}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        disabled={idx === 0}
                        onClick={() => moveCordStep(idx, -1)}
                        style={{ padding: '4px 10px', background: idx === 0 ? '#f1f5f9' : '#fef3c7', color: idx === 0 ? '#cbd5e1' : '#b45309', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: idx === 0 ? 'default' : 'pointer' }}
                      >
                        ▲ ขึ้น
                      </button>
                      <button
                        disabled={idx === cordSteps.length - 1}
                        onClick={() => moveCordStep(idx, 1)}
                        style={{ padding: '4px 10px', background: idx === cordSteps.length - 1 ? '#f1f5f9' : '#fef3c7', color: idx === cordSteps.length - 1 ? '#cbd5e1' : '#b45309', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: idx === cordSteps.length - 1 ? 'default' : 'pointer' }}
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkCordSteps}
                  style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจลำดับขั้นตอนเช็ดสะดือ
                </button>
                {act1Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(1)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปสถานการณ์สะดือเปียกน้ำ ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 1: สถานการณ์จำลอง "สะดือเปียกน้ำ ต้องทำอย่างไร ?" ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ background: '#ecfeff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #06b6d4' }}>
                <strong style={{ color: '#0e7490' }}>💦 สถานการณ์จำลองทางคลินิก:</strong> ระหว่างการอาบน้ำหรือทำความสะอาด หากน้ำกระเด็นใส่สายสะดือของทารกจนเปียกชื้น คุณแม่ควรปฏิบัติตามข้อใดจึงจะถูกต้องที่สุดตามหลักการพยาบาล ?
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  {
                    id: 'dry_and_alcohol',
                    title: '1. ซับให้แห้งสนิททันทีด้วยสำลีสะอาด แล้วเช็ดด้วย 70% แอลกอฮอล์รอบโคนสะดือวนขึ้นสู่ปลายอีกครั้ง ปล่อยให้แห้งตามธรรมชาติ ห้ามโรยแป้ง',
                    badge: 'ทางเลือกที่ 1'
                  },
                  {
                    id: 'powder',
                    title: '2. ใช้แป้งเด็กโรยหนาๆ รอบโคนสะดือทันที เพื่อช่วยดูดซับความชื้นและทำให้สะดือแห้งไว',
                    badge: 'ทางเลือกที่ 2'
                  },
                  {
                    id: 'blow_dry',
                    title: '3. ใช้ไดร์เป่าผมลมร้อนเป่าสะดือจนแห้งสนิท แล้วทาครีมกันผื่นเพื่อสมานแผล',
                    badge: 'ทางเลือกที่ 3'
                  },
                  {
                    id: 'do_nothing',
                    title: '4. ไม่ต้องทำอะไร ปล่อยทิ้งไว้แล้วรีบดึงขอบผ้าอ้อมคลุมปิดทับไว้ทันที',
                    badge: 'ทางเลือกที่ 4'
                  }
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectWetCord(opt.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: wetCordAnswer === opt.id
                        ? (opt.id === 'dry_and_alcohol' ? '2px solid #16a34a' : '2px solid #dc2626')
                        : '1px solid #e2e8f0',
                      background: wetCordAnswer === opt.id
                        ? (opt.id === 'dry_and_alcohol' ? '#f0fdf4' : '#fef2f2')
                        : 'white',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: wetCordAnswer === opt.id
                          ? (opt.id === 'dry_and_alcohol' ? '#16a34a' : '#dc2626')
                          : '#e2e8f0',
                        color: wetCordAnswer === opt.id ? 'white' : '#64748b',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {opt.badge}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#1e293b' }}>
                        {opt.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {wetCordFeedback && (
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  marginBottom: '14px',
                  background: wetCordFeedback.pass ? '#dcfce7' : '#fee2e2',
                  border: `1.5px solid ${wetCordFeedback.pass ? '#86efac' : '#fca5a5'}`,
                  color: wetCordFeedback.pass ? '#166534' : '#991b1b',
                  fontSize: '13px'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                    {wetCordFeedback.title}
                  </div>
                  <div>{wetCordFeedback.msg}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {wetCordFeedback?.pass && (
                  <button
                    onClick={() => setActiveTab(2)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปการพับขอบผ้าอ้อม ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: การพับขอบผ้าอ้อม ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #f59e0b' }}>
                <strong>เป้าหมาย:</strong> เรียนรู้วิธีการใส่ผ้าอ้อมที่ปลอดภัยสำหรับทารกแรกเกิดที่สายสะดือยังไม่หลุด
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div
                  onClick={() => handleSelectFold('below')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: diaperFold === 'below' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                    background: diaperFold === 'below' ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🟢</span>
                    <strong style={{ fontSize: '15px', color: '#166534' }}>พับขอบผ้าอ้อมให้ "ต่ำกว่า" สายสะดือ</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                    • เปิดให้สายสะดือสัมผัสอากาศ แห้งเร็ว ไม่อับชื้น<br />
                    • ป้องกันไม่ให้ปัสสาวะหรืออุจจาระซึมเปื้อนสายสะดือ<br />
                    • ลดการเสียดสีระหว่างขอบผ้าอ้อมกับขั้วสะดือ
                  </p>
                </div>

                <div
                  onClick={() => handleSelectFold('above')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: diaperFold === 'above' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    background: diaperFold === 'above' ? '#fef2f2' : 'white',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🔴</span>
                    <strong style={{ fontSize: '15px', color: '#991b1b' }}>ดึงขอบผ้าอ้อมขึ้นมา "คลุมทับ" สายสะดือ</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                    • ทำให้สายสะดืออับชื้น แฉะ และหลุดช้า<br />
                    • เสี่ยงต่อการเปื้อนปัสสาวะ นำไปสู่การติดเชื้อในกระแสเลือด<br />
                    • เกิดการเสียดสีจนเลือดซึมออกมา
                  </p>
                </div>
              </div>

              {act2Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act2Feedback.pass ? '#dcfce7' : '#fee2e2', color: act2Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act2Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {act2Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(3)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปสังเกตการติดเชื้อ ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: สังเกตการติดเชื้อสายสะดือ ── */}
          {activeTab === 3 && (
            <div>
              <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #f59e0b' }}>
                <strong>เป้าหมาย:</strong> แยกแยะสัญญาณอันตรายของภาวะสะดืออักเสบติดเชื้อ (Omphalitis) ที่ต้องรีบพาไปพบแพทย์
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {infectionSigns.map(s => {
                  const isChecked = selectedSigns.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSign(s.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: isChecked ? '2px solid #d97706' : '1px solid #e2e8f0',
                        background: isChecked ? '#fef3c7' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{isChecked ? '☑' : '☐'}</span>
                      <span style={{ fontSize: '13.5px', fontWeight: isChecked ? 'bold' : 'normal', color: isChecked ? '#92400e' : '#334155' }}>
                        {s.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {act3Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act3Feedback.pass ? '#dcfce7' : '#fee2e2', color: act3Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act3Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkSigns}
                  style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจสอบสัญญาณอันตราย
                </button>
                {act3Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(4)}
                    style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ทำแบบประเมินความรู้ท้ายบท ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 4: แบบประเมินความรู้ประจำห้อง Nursery 203 (ข้อ 12 & 19) ── */}
          {activeTab === 4 && (
            <div>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
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
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#d97706' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#fef3c7' : '#f9fafb'),
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
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#d97706' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#fef3c7' : '#f9fafb'),
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
                            background: '#d97706',
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
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ Nursery 203 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room3Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องในการดูแลสายสะดือให้แห้งสะอาด และการพับผ้าอ้อมอย่างปลอดภัย
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
                      style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 'bold', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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
