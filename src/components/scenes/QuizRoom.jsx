import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import NursingChair from '../furniture/NursingChair';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import RealTree from '../decorations/RealTree';
import FlowerVase from '../decorations/FlowerVase';
import DoctorDesk from '../furniture/DoctorDesk';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import MedicineCabinet from '../furniture/MedicineCabinet';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyCrib from '../furniture/BabyCrib';

export default function QuizRoom() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [flashColor, setFlashColor] = useState(null);

  const questions = [
    { q: "ทารกควรได้รับนมแม่ครั้งแรกภายในกี่ชั่วโมงหลังคลอด?", options: ["1 ชม.", "6 ชม.", "12 ชม.", "24 ชม."], answer: 0 },
    { q: "อุณหภูมิน้ำที่เหมาะสมในการอาบน้ำทารกคือเท่าไร?", options: ["30°C", "35°C", "37-38°C", "40°C"], answer: 2 },
    { q: "สายสะดือทารกจะหลุดภายในกี่วัน?", options: ["1-3 วัน", "7-14 วัน", "21-28 วัน", "30 วัน"], answer: 1 },
    { q: "ท่าให้นมแม่ที่ถูกต้องมีกี่ท่า?", options: ["1", "2", "3", "4"], answer: 3 },
    { q: "มารดาหลังคลอดควรพักผ่อนวันละกี่ชั่วโมง?", options: ["4-6", "6-8", "8-10", "12+"], answer: 2 },
    { q: "การทำความสะอาดแผลฝีเย็บควรเช็ดจากทิศทางใด?", options: ["หลังไปหน้า", "หน้าไปหลัง", "ซ้ายไปขวา", "วงกลม"], answer: 1 },
    { q: "อุณหภูมิห้องที่เหมาะสมสำหรับทารกคือเท่าไร?", options: ["20-22°C", "24-26°C", "28-30°C", "30-32°C"], answer: 1 },
    { q: "ทารกควรนอนในท่าใดเพื่อป้องกัน SIDS?", options: ["นอนคว่ำ", "นอนตะแคง", "นอนหงาย", "ท่าใดก็ได้"], answer: 2 },
    { q: "อาการใดเป็นสัญญาณอันตรายของการติดเชื้อหลังคลอด?", options: ["ปวดหัวเล็กน้อย", "ไข้สูงกว่า 38°C", "เหนื่อยบ้าง", "นอนไม่หลับ"], answer: 1 },
    { q: "การให้นมแม่ควรให้บ่อยแค่ไหน?", options: ["ทุก 1 ชม.", "ทุก 2-3 ชม.", "ทุก 4-6 ชม.", "ทุก 8 ชม."], answer: 1 }
  ];

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentQuestion].answer;

    if (isCorrect) {
      setScore(score + 1);
      setFlashColor('rgba(76, 175, 80, 0.3)');
    } else {
      setFlashColor('rgba(244, 67, 54, 0.3)');
    }

    setTimeout(() => {
      setFlashColor(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setShowResult(true);
        if (finalScore >= 8) {
          completeModule('quiz');
          setShowSuccessModal(true, `คุณผ่านแบบทดสอบแล้ว! ได้ ${finalScore}/10 คะแนน`);
        }
      }
    }, 500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <group>
      {/* ── Authentic 3D Examination Grand Hall Architecture ── */}
      <HospitalRoomShell
        theme="quiz"
        width={26}
        depth={26}
        height={10}
        roomTitle="หอประชุมและห้องประเมินความรู้หลังเรียน (Examination Hall)"
        roomNumber="Hall 301"
      />

      {/* Flash Effect Layer */}
      {flashColor && (
        <Html position={[0, 0, 0]} center fullscreen>
          <div style={{ width: '100vw', height: '100vh', backgroundColor: flashColor, pointerEvents: 'none', transition: 'background-color 0.2s' }} />
        </Html>
      )}

      {/* ── Authentic 3D Nature & Ambience ── */}
      <RealTree position={[-10.5, 0, -10]} scale={0.85} />
      <RealTree position={[10.5, 0, -10]} scale={0.85} />
      <RealPlant type="potted" position={[-5.5, 0, -9]} scale={1.1} />
      <RealPlant type="house" position={[5.5, 0, -9]} scale={1.0} />

      {/* Real Velvet Sofas for Examinee Waiting Area */}
      <InteractiveSeat
        id="quiz_sofa_left"
        name="โซฟารอสอบฝั่งซ้าย"
        type="sofa"
        position={[-9.2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      <InteractiveSeat
        id="quiz_sofa_right"
        name="โซฟารอสอบฝั่งขวา"
        type="sofa"
        position={[9.2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      {/* Real Exam & Records Archive Cabinet */}
      <MedicineCabinet position={[10.2, 0, -5]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} withMedicalBox={false} />

      {/* Real Doctor / Examiner Desk */}
      <DoctorDesk position={[0, 0, -9.5]} scale={1.25} />
      <FlowerVase position={[1.4, 0.98, -9.5]} scale={0.9} />

      {/* Computer Screen / Big Interactive Board for Quiz */}
      <mesh position={[0, 5.2, -10.5]} castShadow>
        <boxGeometry args={[7.2, 4.4, 0.2]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Quiz UI on Digital Board */}
      <Html position={[0, 5.2, -10.35]} transform scale={0.46}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '640px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', border: '3px solid #8b5cf6' }}>
          {!showResult ? (
            <>
              <h2 style={{ color: '#5b21b6', marginBottom: '25px', textAlign: 'center', fontSize: '26px', fontWeight: 'bold' }}>
                ข้อ {currentQuestion + 1}/10: {questions[currentQuestion].q}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%' }}>
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{ padding: '16px', fontSize: '18px', fontWeight: '600', background: '#ede9fe', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.target.style.background = '#8b5cf6'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.background = '#ede9fe'; e.target.style.color = '#4c1d95'; }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: score >= 8 ? '#16a34a' : '#dc2626', fontSize: '36px', margin: '0 0 10px 0' }}>
                {score >= 8 ? '🎉 ผ่านเกณฑ์มาตรฐาน!' : '⚠️ ยังไม่ผ่านเกณฑ์'}
              </h1>
              <h2 style={{ fontSize: '26px', margin: '16px 0', color: '#333' }}>คะแนนของคุณ: {score}/10 (เกณฑ์ผ่าน 8/10)</h2>
              <p style={{ color: '#666', fontSize: '15px', marginBottom: '20px' }}>
                {score >= 8 ? 'คุณมีความพร้อมและความรู้ถูกต้องครบถ้วนในการดูแลมารดาและทารกแรกเกิด' : 'ทบทวนบทเรียนอีกครั้งเพื่อเพิ่มความมั่นใจ'}
              </p>
              {score < 8 ? (
                <button
                  onClick={restartQuiz}
                  style={{ padding: '12px 28px', fontSize: '18px', fontWeight: 'bold', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  ลองทำแบบทดสอบอีกครั้ง ↻
                </button>
              ) : (
                <button
                  onClick={() => setRoom('lobby')}
                  style={{ padding: '12px 28px', fontSize: '18px', fontWeight: 'bold', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  รับใบรับรองและกลับล็อบบี้ 🏆
                </button>
              )}
            </div>
          )}
        </div>
      </Html>

      {/* ── Real 3D Quiz Seating Chair ── */}
      <InteractiveSeat
        id="quiz_exam_chair"
        name="เก้าอี้สอบความรู้"
        type="chair"
        position={[0, 0, -6.5]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.45, 0.05]}
      >
        <NursingChair position={[0, 0, 0]} rotation={[0, 0, 0]} />
      </InteractiveSeat>

      {/* ── Real Baby Bassinet beside Mother during Quiz (แม่และลูกร่วมเรียนรู้) ── */}
      <group position={[2.4, 0, -6.5]} rotation={[0, -0.3, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar position={[0, 1.05, 0]} rotation={[-1.57, 0, 0]} scale={[0.55, 0.55, 0.55]} />
          )}
        </BabyCrib>
        <Html position={[0, 1.6, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            style={{
              background: isHoldingBaby ? 'rgba(16, 185, 129, 0.95)' : 'rgba(236, 72, 153, 0.95)',
              color: 'white',
              border: '2px solid white',
              whiteSpace: 'nowrap',
            }}
          >
            {isHoldingBaby ? '🧸 วางลูกน้อยลงเปล' : '👶 ลูกน้อยหลับอยู่ (คลิกอุ้ม)'}
          </div>
        </Html>
      </group>

      {/* ── GTA-Style Player Character in Quiz Room ── */}
      <PlayerController initialPosition={[0, 0, -4]} />
    </group>
  );
}
