import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
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
  const hasCompletedPretest = useStore((s) => s.hasCompletedPretest);
  const pretestScore = useStore((s) => s.pretestScore);
  const posttestScore = useStore((s) => s.posttestScore);
  const setCompletedPretest = useStore((s) => s.setCompletedPretest);
  const setCompletedPosttest = useStore((s) => s.setCompletedPosttest);
  const [isPretestSubmission, setIsPretestSubmission] = useState(!hasCompletedPretest);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null); // true | false | 'unsure'
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [isQuizMinimized, setIsQuizMinimized] = useState(false);

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
      if (!hasCompletedPretest) {
        setCompletedPretest(score);
        completeModule('pretest');
      } else {
        setCompletedPosttest(score);
        if (score >= 16) {
          completeModule('quiz');
        }
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
    setIsPretestSubmission(!useStore.getState().hasCompletedPretest);
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

      {/* Flash Effect Layer (2D ScreenPortal — never skewed in 3D space) */}
      {flashColor && (
        <ScreenPortal>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 25,
              backgroundColor: flashColor,
              pointerEvents: 'none',
              transition: 'background-color 0.2s',
            }}
          />
        </ScreenPortal>
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
        seatOffset={[0, 0.44, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      <InteractiveSeat
        id="quiz_sofa_right"
        name="โซฟารอสอบฝั่งขวา"
        type="sofa"
        position={[9.2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        seatOffset={[0, 0.44, 0.15]}
      >
        <HospitalSofa position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.15} />
      </InteractiveSeat>

      {/* Real Exam & Records Archive Cabinet */}
      <MedicineCabinet position={[10.2, 0, -5]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} withMedicalBox={false} />

      {/* Real Examiner Station Desk on Left Wing */}
      <group position={[-7.5, 0, -6.5]} rotation={[0, Math.PI / 6, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={1.15} />
        <FlowerVase position={[0.5, 0.85, 0]} scale={0.8} />
      </group>

      {/* Grand Digital Interactive Examination Stage Screen (3D Backdrop — tap to reopen Quiz if minimized) */}
      <group
        position={[0, 2.35, -9.8]}
        onClick={(e) => {
          e.stopPropagation();
          setIsQuizMinimized(false);
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[5.8, 3.6, 0.16]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.25} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[5.45, 3.25]} />
          <meshStandardMaterial color="#312e81" emissive="#1e1b4b" emissiveIntensity={0.45} roughness={0.3} />
        </mesh>
      </group>

      {/* Minimized Pill to Re-open Quiz Card after viewing 3D Hall */}
      {isQuizMinimized && (
        <ScreenPortal>
          <div className="fixed inset-x-0 bottom-14 z-30 flex justify-center px-4 pointer-events-none">
            <button
              type="button"
              onClick={() => setIsQuizMinimized(false)}
              className="pointer-events-auto flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-sm sm:text-base shadow-2xl border-2 border-white active:scale-95 transition"
            >
              <span>📝</span>
              <span>
                {showResult
                  ? 'กลับสู่หน้าผลสรุปคะแนน'
                  : `เปิดทำแบบทดสอบต่อ (ข้อที่ ${currentQuestion + 1}/${questions.length})`}
              </span>
            </button>
          </div>
        </ScreenPortal>
      )}

      {/* Native 2D Screen-Space Quiz Overlay — Zero CSS matrix3d skew, 100% accurate iPhone touch targets, never blocked by 3D character */}
      {!isQuizMinimized && (
        <ScreenPortal>
          <div className="fixed inset-x-0 top-11 sm:top-14 bottom-2 sm:bottom-4 z-30 flex items-center justify-center px-2.5 sm:px-6 py-1.5 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-[760px] max-h-full overflow-y-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between shadow-2xl border-[3px] border-violet-600"
              style={{
                fontFamily: 'system-ui, -apple-system, "Sarabun", sans-serif',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {!showResult ? (
                <>
                  {/* Header Info */}
                  <div>
                    {/* Pre-test vs Post-test Mode Indicator Banner + Optional 3D View Toggle */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 mb-2.5 sm:mb-3"
                      style={{
                        background: isPretestSubmission ? '#fffbeb' : '#f5f3ff',
                        border: `1.5px solid ${isPretestSubmission ? '#f59e0b' : '#c084fc'}`,
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg sm:text-xl shrink-0">{isPretestSubmission ? '⭐' : '🏆'}</span>
                        <div className="min-w-0">
                          <div
                            className="font-black text-xs sm:text-sm leading-snug"
                            style={{ color: isPretestSubmission ? '#b45309' : '#5b21b6' }}
                          >
                            {isPretestSubmission
                              ? 'แบบทดสอบวัดระดับความรู้ก่อนเรียน (Pre-test 20 ข้อ)'
                              : 'แบบทดสอบประเมินผลสัมฤทธิ์หลังเรียน (Post-test 20 ข้อ)'}
                          </div>
                          <div
                            className="text-[11px] sm:text-xs leading-tight mt-0.5"
                            style={{ color: isPretestSubmission ? '#92400e' : '#6d28d9' }}
                          >
                            {isPretestSubmission
                              ? 'บังคับทำครบ 20 ข้อเพื่อปลดล็อคห้องเรียนรู้ทั้ง 8 ห้อง'
                              : `คะแนนก่อนเรียน (Pre-test) ที่ทำได้: ${pretestScore}/20 คะแนน`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-[11px] sm:text-xs font-black text-white px-2.5 py-1 rounded-lg shadow-sm"
                          style={{ background: isPretestSubmission ? '#d97706' : '#7c3aed' }}
                        >
                          {isPretestSubmission ? 'Pre-test' : 'Post-test'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsQuizMinimized(true)}
                          className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-300 transition"
                          title="ย่อหน้าต่างเพื่อดูห้องสอบ 3D"
                        >
                          👁️ ห้อง 3D
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-1.5 mb-2.5">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="bg-violet-100 text-violet-800 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold">
                          {currentQ.room}
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold">
                          ระดับ: {currentQ.bloom}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-600">
                        คะแนนสะสม: <span className="text-violet-700 font-black">{score}</span> /{' '}
                        {currentQuestion + (showFeedback && userChoice === currentQ.answer ? 1 : 0)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        style={{
                          width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>

                    <div className="text-violet-700 text-xs sm:text-sm font-extrabold mb-1">
                      ข้อที่ {currentQuestion + 1} จาก {questions.length} ข้อ:
                    </div>
                    <h2 className="text-slate-800 text-base sm:text-xl leading-relaxed font-extrabold m-0 mb-3.5 sm:mb-4">
                      "{currentQ.question}"
                    </h2>
                  </div>

                  {/* True / False / Unsure Choices — Large >=52px Touch Targets for Mobile Thumbs */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3.5">
                    <button
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectChoice(true)}
                      className="min-h-[52px] sm:min-h-[58px] px-2 py-3 sm:p-4 text-sm sm:text-lg font-extrabold rounded-xl border-2 transition active:scale-95 shadow-sm"
                      style={{
                        borderColor:
                          showFeedback && currentQ.answer === true
                            ? '#16a34a'
                            : userChoice === true
                            ? '#7c3aed'
                            : '#cbd5e1',
                        background:
                          showFeedback && currentQ.answer === true
                            ? '#dcfce7'
                            : userChoice === true
                            ? '#ede9fe'
                            : '#f8fafc',
                        color: showFeedback && currentQ.answer === true ? '#15803d' : '#1e293b',
                        cursor: showFeedback ? 'default' : 'pointer',
                      }}
                    >
                      ✓ ถูก (True)
                    </button>

                    <button
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectChoice(false)}
                      className="min-h-[52px] sm:min-h-[58px] px-2 py-3 sm:p-4 text-sm sm:text-lg font-extrabold rounded-xl border-2 transition active:scale-95 shadow-sm"
                      style={{
                        borderColor:
                          showFeedback && currentQ.answer === false
                            ? '#16a34a'
                            : userChoice === false
                            ? '#dc2626'
                            : '#cbd5e1',
                        background:
                          showFeedback && currentQ.answer === false
                            ? '#dcfce7'
                            : userChoice === false
                            ? '#fee2e2'
                            : '#f8fafc',
                        color: showFeedback && currentQ.answer === false ? '#15803d' : '#1e293b',
                        cursor: showFeedback ? 'default' : 'pointer',
                      }}
                    >
                      ✕ ผิด (False)
                    </button>

                    <button
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectChoice('unsure')}
                      className="min-h-[52px] sm:min-h-[58px] px-2 py-3 sm:p-4 text-sm sm:text-lg font-extrabold rounded-xl border-2 transition active:scale-95 shadow-sm"
                      style={{
                        borderColor: userChoice === 'unsure' ? '#6b7280' : '#cbd5e1',
                        background: userChoice === 'unsure' ? '#e5e7eb' : '#f8fafc',
                        color: '#374151',
                        cursor: showFeedback ? 'default' : 'pointer',
                      }}
                    >
                      ？ ไม่แน่ใจ
                    </button>
                  </div>

                  {/* Feedback and Scientific Explanation + Prominent Mobile Next Button */}
                  {showFeedback ? (
                    <div
                      className="rounded-xl p-3.5 sm:p-4 flex flex-col gap-2.5"
                      style={{
                        background: userChoice === currentQ.answer ? '#f0fdf4' : '#fffbeb',
                        border: `2px solid ${userChoice === currentQ.answer ? '#86efac' : '#fcd34d'}`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
                        <div
                          className="font-extrabold text-sm sm:text-base"
                          style={{ color: userChoice === currentQ.answer ? '#16a34a' : '#d97706' }}
                        >
                          {userChoice === currentQ.answer
                            ? '🎉 คำตอบถูกต้อง (+1 คะแนน)'
                            : `⚠️ ข้อนี้ตอบ: ${currentQ.answerText}`}
                        </div>
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer shrink-0"
                        >
                          {currentQuestion < questions.length - 1 ? 'ข้อถัดไป ➔' : 'ดูผลสรุปคะแนน 🏆'}
                        </button>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <strong>💡 เหตุผลทางวิชาการ:</strong> {currentQ.reason}
                      </div>
                      {/* Large Full-Width Mobile Next Button so thumbs NEVER struggle to hit it */}
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="sm:hidden w-full min-h-[48px] py-3 px-5 bg-gradient-to-r from-violet-600 to-purple-600 active:scale-98 text-white font-extrabold text-base rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{currentQuestion < questions.length - 1 ? 'ข้อถัดไป ➔' : 'ดูผลสรุปคะแนน 🏆'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs sm:text-sm py-2">
                      แตะเลือกคำตอบเพื่อบันทึกและดูคำอธิบายเหตุผลทางวิชาการ
                    </div>
                  )}
                </>
              ) : (
                /* Result Screen */
                <div className="text-center py-1 sm:py-2">
                  {isPretestSubmission ? (
                    /* Pre-test Complete Screen */
                    <>
                      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm mb-3">
                        ⭐ บันทึกคะแนนก่อนเรียน (Pre-test) เรียบร้อยแล้ว
                      </div>

                      <h1 className="text-emerald-700 text-xl sm:text-2xl font-black m-0 mb-3">
                        🎉 ยินดีด้วย! ปลดล็อคห้องเรียนรู้ทั้ง 8 ห้องแล้ว
                      </h1>

                      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 max-w-md mx-auto mb-3.5">
                        <div className="text-xs sm:text-sm text-emerald-800 font-bold">
                          คะแนนวัดระดับความรู้ก่อนเรียน (Baseline Score)
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-emerald-700 my-1.5">
                          {score} <span className="text-lg sm:text-xl text-slate-500">/ 20</span>
                        </div>
                        <div className="text-xs sm:text-sm text-emerald-700">
                          คิดเป็น {Math.round((score / 20) * 100)}% ของคะแนนเต็ม 20 ข้อ
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 sm:p-4 max-w-lg mx-auto mb-4 text-left text-xs sm:text-sm text-amber-900 leading-relaxed">
                        <strong>✨ ขั้นตอนถัดไป:</strong> คุณแม่สามารถเดินเข้าศึกษาในห้องเรียนรู้ต่าง ๆ ทั้ง 8 ห้อง (Ward 101-104 และ Nursery 201-204) ได้อย่างอิสระ เมื่อศึกษาครบถ้วนแล้ว สามารถกลับมาทำแบบทดสอบหลังเรียน (Post-test) เพื่อวัดพัฒนาการความรู้ได้ครับ
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuccessModal(false);
                            setRoom('motherCare1');
                          }}
                          className="min-h-[48px] px-6 py-3 text-sm sm:text-base font-black text-white rounded-xl shadow-lg active:scale-95 transition cursor-pointer"
                          style={{ background: 'linear-gradient(135deg, #e91e63, #c2185b)' }}
                        >
                          🚀 เข้าสู่ห้องแรก: Ward 101 ดูแลร่างกาย ➜
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuccessModal(false);
                            setRoom('lobby');
                          }}
                          className="min-h-[48px] px-6 py-3 text-sm sm:text-base font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md active:scale-95 transition cursor-pointer"
                        >
                          🏥 กลับสู่ล็อบบี้หลัก (เลือกห้องเอง) ➜
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Post-test Complete Screen */
                    <>
                      <h1
                        className="text-xl sm:text-2xl m-0 mb-2.5 font-black"
                        style={{ color: score >= 16 ? '#16a34a' : '#dc2626' }}
                      >
                        {score >= 16 ? '🎉 ผ่านการประเมินความรู้หลังเรียนตามเกณฑ์!' : '⚠️ ผลการประเมินหลังเรียน (Post-test)'}
                      </h1>

                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-lg mx-auto mb-3">
                        <div className="bg-slate-50 border border-slate-300 rounded-xl p-2.5">
                          <div className="text-[11px] sm:text-xs text-slate-500 font-bold">ก่อนเรียน (Pre)</div>
                          <div className="text-lg sm:text-2xl font-black text-slate-700 mt-0.5">
                            {pretestScore} <span className="text-xs sm:text-sm">/ 20</span>
                          </div>
                        </div>

                        <div
                          className="rounded-xl p-2.5 border-2"
                          style={{
                            background: score >= 16 ? '#f0fdf4' : '#fef2f2',
                            borderColor: score >= 16 ? '#86efac' : '#fca5a5',
                          }}
                        >
                          <div
                            className="text-[11px] sm:text-xs font-bold"
                            style={{ color: score >= 16 ? '#166534' : '#991b1b' }}
                          >
                            หลังเรียน (Post)
                          </div>
                          <div
                            className="text-xl sm:text-2xl font-black mt-0.5"
                            style={{ color: score >= 16 ? '#15803d' : '#b91c1c' }}
                          >
                            {score} <span className="text-xs sm:text-sm">/ 20</span>
                          </div>
                        </div>

                        <div className="bg-violet-50 border border-purple-300 rounded-xl p-2.5">
                          <div className="text-[11px] sm:text-xs text-purple-800 font-bold">พัฒนาการ (Gain)</div>
                          <div className="text-lg sm:text-2xl font-black text-violet-700 mt-0.5">
                            +{Math.max(0, score - pretestScore)}
                          </div>
                        </div>
                      </div>

                      {/* ── 🩺 การวิเคราะห์ภาวะพร่องความรู้ (Knowledge Deficit Analysis) ── */}
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 mx-auto mb-3.5 text-left shadow-sm max-h-[220px] overflow-y-auto">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base sm:text-lg">📊</span>
                            <strong className="text-xs sm:text-sm text-slate-800">
                              รายงานการวิเคราะห์ภาวะพร่องความรู้
                            </strong>
                          </div>
                          <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                            จำแนกตาม 8 ห้องเรียนรู้
                          </span>
                        </div>

                        {(() => {
                          const domainMap = [
                            { key: 'motherCare1', title: 'Ward 101: การดูแลร่างกายและการฟื้นตัว', qIds: [5, 6, 8] },
                            { key: 'motherCare2', title: 'Ward 102: การดูแลแผลฝีเย็บและผ่าคลอด', qIds: [2, 10] },
                            { key: 'motherCare3', title: 'Ward 103: การดูแลเต้านมและการให้นมแม่', qIds: [3, 9, 14] },
                            { key: 'motherCare4', title: 'Ward 104: สัญญาณอันตรายและภาวะแทรกซ้อน', qIds: [1, 4, 7] },
                            { key: 'newbornCare1', title: 'Nursery 201: ท่าอุ้มและการเข้าเต้าทารก', qIds: [11, 17] },
                            { key: 'newbornCare2', title: 'Nursery 202: การอาบน้ำและทำความสะอาด', qIds: [16, 18] },
                            { key: 'newbornCare3', title: 'Nursery 203: การดูแลสายสะดือ (ภาพจำลอง)', qIds: [12, 19] },
                            { key: 'newbornCare4', title: 'Nursery 204: สิ่งแวดล้อมปลอดภัย & Safe Sleep', qIds: [13, 15, 20] },
                          ];

                          const deficits = domainMap.map((dm) => {
                            const domainAnswers = answersHistory.filter((a) => dm.qIds.includes(a.id));
                            const wrongCount = domainAnswers.filter((a) => !a.isCorrect).length;
                            return {
                              ...dm,
                              wrongCount,
                              totalQ: dm.qIds.length,
                              hasDeficit: wrongCount > 0,
                            };
                          });

                          const hasAnyDeficit = deficits.some((d) => d.hasDeficit);

                          if (!hasAnyDeficit) {
                            return (
                              <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-lg text-emerald-800 text-xs sm:text-sm text-center">
                                🎉 ยอดเยี่ยมที่สุด! ไม่พบภาวะพร่องความรู้ในทุกหัวข้อ คุณแม่มีความรู้ครบถ้วนถูกต้อง 100% พร้อมสำหรับการดูแลตนเองและทารกที่บ้าน
                              </div>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-2">
                              <p className="m-0 mb-1 text-xs text-slate-600">
                                แนะนำให้แตะเข้าทบทวนบทเรียนในห้องที่ยังตอบผิดต่อไปนี้:
                              </p>
                              {deficits
                                .filter((d) => d.hasDeficit)
                                .map((d) => (
                                  <div
                                    key={d.key}
                                    className="flex flex-wrap items-center justify-between gap-2 bg-rose-50 border border-rose-300 p-2 sm:p-2.5 rounded-lg"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="font-bold text-xs text-rose-900">⚠️ {d.title}</span>
                                      <span className="text-[11px] text-rose-600 ml-1.5">
                                        (ผิด {d.wrongCount}/{d.totalQ} ข้อ)
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowSuccessModal(false);
                                        setRoom(d.key);
                                      }}
                                      className="min-h-[38px] bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer shrink-0"
                                    >
                                      เข้าทบทวน ➔
                                    </button>
                                  </div>
                                ))}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 justify-center">
                        <button
                          type="button"
                          onClick={restartQuiz}
                          className="min-h-[46px] px-5 py-2.5 text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl active:scale-95 transition cursor-pointer"
                        >
                          ลองทำแบบทดสอบอีกครั้ง ↻
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuccessModal(false);
                            setRoom('lobby');
                          }}
                          className="min-h-[46px] px-6 py-2.5 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md active:scale-95 transition cursor-pointer"
                        >
                          กลับสู่ล็อบบี้หลัก 🏥
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScreenPortal>
      )}

      {/* ── Real 3D Quiz Seating Chair (Angled comfortably facing digital board) ── */}
      <InteractiveSeat
        id="quiz_exam_chair"
        name="เก้าอี้สอบความรู้"
        type="chair"
        position={[-4.5, 0, -5.5]}
        rotation={[0, 0.35, 0]}
        seatOffset={[0, 0.45, 0.05]}
      >
        <NursingChair position={[0, 0, 0]} rotation={[0, 0, 0]} />
      </InteractiveSeat>

      {/* ── Real Baby Bassinet beside Mother during Quiz (Shifted to side bay X: 6.8) ── */}
      <group position={[6.8, 0, -4.5]} rotation={[0, -0.4, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
        <BabyCrib position={[0, 0, 0]} scale={0.9}>
          {!isHoldingBaby && (
            <BabyAvatar pose="sleeping" scale={1.0} withBlanket={true} />
          )}
        </BabyCrib>
        <Html position={[0, 1.35, 0]} center distanceFactor={12}>
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
            {isHoldingBaby ? '🧸 วางลูกน้อยลงเปล' : '👶 ลูกน้อยหลับอยู่ (คลิกอุ้ม)'}
          </div>
        </Html>
      </group>

      {/* ── GTA-Style Player Character in Quiz Room ── */}
      <PlayerController initialPosition={[0, 0, -4]} />
    </group>
  );
}
