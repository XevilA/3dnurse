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

import { ALL_QUIZ_QUESTIONS } from '../../data/quizData';

export default function QuizRoom() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null); // true | false | 'unsure'
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [answersHistory, setAnswersHistory] = useState([]);

  const questions = ALL_QUIZ_QUESTIONS;
  const currentQ = questions[currentQuestion] || questions[0];

  const handleSelectChoice = (choiceValue) => {
    if (showFeedback) return;
    setUserChoice(choiceValue);
    setShowFeedback(true);

    const isCorrect = choiceValue === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFlashColor('rgba(76, 175, 80, 0.25)');
    } else {
      setFlashColor('rgba(239, 68, 68, 0.25)');
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        id: currentQ.id,
        userChoice: choiceValue,
        isCorrect,
        correctAnswer: currentQ.answer,
        reason: currentQ.reason,
      },
    ]);

    setTimeout(() => setFlashColor(null), 400);
  };

  const handleNextQuestion = () => {
    setUserChoice(null);
    setShowFeedback(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
      if (score >= 16) {
        completeModule('quiz');
        setShowSuccessModal(true, `ยอดเยี่ยมมาก! คุณผ่านแบบประเมินความรู้รวมแล้ว ได้ ${score}/20 คะแนน (ผ่านเกณฑ์มาตรฐานงานวิจัย)`);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserChoice(null);
    setShowFeedback(false);
    setShowResult(false);
    setAnswersHistory([]);
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
        <boxGeometry args={[7.8, 5.0, 0.2]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Quiz UI on Digital Board */}
      <Html position={[0, 5.2, -10.35]} transform scale={0.44}>
        <div style={{
          background: 'white',
          padding: '28px',
          borderRadius: '20px',
          width: '760px',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          border: '3px solid #7c3aed',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {!showResult ? (
            <>
              {/* Header Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                      {currentQ.room}
                    </span>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      ระดับ: {currentQ.bloom}
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#4b5563' }}>
                    คะแนนสะสม: <span style={{ color: '#7c3aed' }}>{score}</span> / {currentQuestion + (showFeedback && userChoice === currentQ.answer ? 1 : 0)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #ec4899)', transition: 'width 0.3s' }} />
                </div>

                <div style={{ color: '#6d28d9', fontSize: '15px', fontWeight: 'bold', marginBottom: '6px' }}>
                  ข้อที่ {currentQuestion + 1} จาก {questions.length} ข้อ:
                </div>
                <h2 style={{ color: '#1f2937', fontSize: '20px', lineHeight: '1.45', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                  "{currentQ.question}"
                </h2>
              </div>

              {/* True / False / Unsure Choices */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <button
                  disabled={showFeedback}
                  onClick={() => handleSelectChoice(true)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: showFeedback && currentQ.answer === true ? '#16a34a' : (userChoice === true ? '#7c3aed' : '#d1d5db'),
                    background: showFeedback && currentQ.answer === true ? '#dcfce7' : (userChoice === true ? '#ede9fe' : '#f9fafb'),
                    color: showFeedback && currentQ.answer === true ? '#15803d' : '#1f2937',
                    cursor: showFeedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}
                >
                  ✓ ถูก (True)
                </button>

                <button
                  disabled={showFeedback}
                  onClick={() => handleSelectChoice(false)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: showFeedback && currentQ.answer === false ? '#16a34a' : (userChoice === false ? '#dc2626' : '#d1d5db'),
                    background: showFeedback && currentQ.answer === false ? '#dcfce7' : (userChoice === false ? '#fee2e2' : '#f9fafb'),
                    color: showFeedback && currentQ.answer === false ? '#15803d' : '#1f2937',
                    cursor: showFeedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}
                >
                  ✕ ผิด (False)
                </button>

                <button
                  disabled={showFeedback}
                  onClick={() => handleSelectChoice('unsure')}
                  style={{
                    padding: '16px',
                    fontSize: '17px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: userChoice === 'unsure' ? '#6b7280' : '#e5e7eb',
                    background: userChoice === 'unsure' ? '#f3f4f6' : '#fafafa',
                    color: '#4b5563',
                    cursor: showFeedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  ？ ไม่แน่ใจ
                </button>
              </div>

              {/* Feedback and Scientific Explanation */}
              {showFeedback ? (
                <div style={{
                  background: userChoice === currentQ.answer ? '#f0fdf4' : '#fffbeb',
                  border: `2px solid ${userChoice === currentQ.answer ? '#86efac' : '#fde68a'}`,
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: userChoice === currentQ.answer ? '#16a34a' : '#d97706'
                    }}>
                      {userChoice === currentQ.answer ? '🎉 คำตอบถูกต้อง (+1 คะแนน)' : `⚠️ ข้อนี้ตอบ: ${currentQ.answerText}`}
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      style={{
                        padding: '8px 20px',
                        background: '#7c3aed',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {currentQuestion < questions.length - 1 ? 'ข้อถัดไป ➔' : 'ดูผลสรุปคะแนน 🏆'}
                    </button>
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>
                    <strong>💡 เหตุผลทางวิชาการ:</strong> {currentQ.reason}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', padding: '10px' }}>
                  กดเลือกคำตอบเพื่อบันทึกและดูคำอธิบายเหตุผลทางวิชาการ
                </div>
              )}
            </>
          ) : (
            /* Result Screen */
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <h1 style={{ color: score >= 16 ? '#16a34a' : '#dc2626', fontSize: '32px', margin: '0 0 10px 0' }}>
                {score >= 16 ? '🎉 ผ่านการประเมินความรู้ตามเกณฑ์!' : '⚠️ ยังไม่ผ่านเกณฑ์มาตรฐาน'}
              </h1>
              <div style={{
                background: score >= 16 ? '#f0fdf4' : '#fef2f2',
                border: `2px solid ${score >= 16 ? '#86efac' : '#fca5a5'}`,
                borderRadius: '16px',
                padding: '18px',
                maxWidth: '480px',
                margin: '0 auto 20px auto'
              }}>
                <div style={{ fontSize: '16px', color: '#4b5563', marginBottom: '6px' }}>คะแนนรวมแบบประเมินความรู้</div>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: score >= 16 ? '#15803d' : '#b91c1c' }}>
                  {score} <span style={{ fontSize: '24px', color: '#6b7280' }}>/ 20</span>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  คิดเป็น {Math.round((score / 20) * 100)}% (เกณฑ์ผ่าน 80% หรือ 16 คะแนนขึ้นไป)
                </div>
              </div>

              <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                {score >= 16
                  ? 'คุณมีความรู้และความเข้าใจถูกต้องครบถ้วนในการดูแลตนเองและทารกแรกเกิดก่อนจำหน่ายตามมาตรฐานงานวิจัย'
                  : 'ท่านสามารถทบทวนเนื้อหาในห้องการเรียนรู้ต่าง ๆ และกลับมาทำแบบทดสอบใหม่เพื่อเพิ่มพูนความรู้ได้ตลอดเวลา'}
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button
                  onClick={restartQuiz}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  ลองทำแบบทดสอบอีกครั้ง ↻
                </button>
                <button
                  onClick={() => setRoom('lobby')}
                  style={{
                    padding: '12px 28px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  กลับสู่ล็อบบี้หลัก 🏥
                </button>
              </div>
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
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
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
