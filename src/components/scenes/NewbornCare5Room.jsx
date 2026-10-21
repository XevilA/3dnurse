import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { FramedImagePoster3D } from '../furniture/CozyRoomFurniture';
import { getQuestionsByRoomKey } from '../../data/quizData';

/**
 * NewbornCare5Room — ห้องที่ 5: การอาบน้ำและเปลี่ยนผ้าอ้อมทารก: สรุปทบทวน & แบบทดสอบ (Nursery 205)
 *
 * ห้องนี้เป็นห้องทบทวนความรู้ทั้งหมดจากห้อง 1–4 (การอาบน้ำ, สายสะดือ, การนอน, การจัดสภาพแวดล้อม)
 * พร้อมแบบทดสอบท้ายบท และแสดงโปสเตอร์อ้างอิงสำคัญจาก ทารก 3 & 4.pdf
 *
 * Mission:
 *  1. ศึกษาโปสเตอร์รอบห้อง (5 ภาพ)
 *  2. ทำแบบทดสอบท้ายบท (Quiz)
 */
export default function NewbornCare5Room() {
  const {
    completeModule,
    learningProgress,
    setShowSuccessModal,
    openLightbox,
  } = useStore();

  // ── Active Modal State ──
  const [activeModal, setActiveModal] = useState(null); // null | 'quiz'
  const [missionCompleted, setMissionCompleted] = useState(
    Boolean(learningProgress?.newbornCare5)
  );

  // ── 5 Large Educational Wall Posters (รูปอ้างอิงจาก ทารก 3 & 4.pdf) ──
  const wallPosters = [
    {
      src: '/images/rev/nb3_poster1_equip.jpg',
      title: 'ภาพที่ 1: อุปกรณ์อาบน้ำและดูแลสะดือทารก',
      caption: 'สำลีก้อน, ไม้พันสำลี, Alcohol 70%, ถังขยะติดเชื้อ, อ่างอาบน้ำ 2 ใบ, ผ้าห่อตัว, แชมพูเด็ก',
      category: 'ทบทวน: การอาบน้ำ & ดูแลสะดือ (Nursery 205)',
      clinicalDetails: [
        '1. อ่างอาบน้ำเด็ก สีฟ้า (อ่างที่ 1 – ชำระล้าง)',
        '2. อ่างอาบน้ำเด็ก สีชมพู (อ่างที่ 2 – ล้างสะอาด)',
        '3. น้ำอุ่นอุณหภูมิ 37–38 °C',
        '4. สำลีก้อน, ไม้พันสำลี, Alcohol 70% (ดูแลสะดือ)',
        '5. ผ้าห่อตัว, แชมพูเด็ก, ฟองน้ำ',
        '6. ผ้าอ้อม, เสื้อผ้าทารก',
      ],
    },
    {
      src: '/images/rev/nb3_poster3_dry.jpg',
      title: 'ภาพที่ 2: วิธีการเช็ดสะดือทารก (สะดือเริ่มแห้ง)',
      caption: '1. เช็ดที่รอบโคนสะดือ → 2. เช็ดสายสะดือจากโคนไปปลาย → 3. เช็ดเฉพาะที่ปลายสะดือ (รอยตัด)',
      category: 'ทบทวน: การดูแลสายสะดือ (Nursery 205)',
      clinicalDetails: [
        '1. เช็ดที่รอบโคนสะดือ (ดึงผิวหนังเบาๆ ให้เห็นโคนสะดือชัดเจน)',
        '2. เช็ดที่สายสะดือจากโคนสะดือไปถึงปลายสะดือ',
        '3. เช็ดเฉพาะที่ปลายสะดือ (บริเวณรอยตัด)',
        'ใช้ไม้พันสำลีชุบ 70% Alcohol',
        'ทำ 1–2 ครั้งต่อวัน จนสายสะดือหลุด',
      ],
    },
    {
      src: '/images/rev/nb3_poster5_warning.jpg',
      title: 'ภาพที่ 3: สัญญาณผิดปกติของสะดือทารก',
      caption: 'รอบสะดือแดง, บวม, ร้อน, มีหนอง, กลิ่นเหม็น → ต้องพบแพทย์ทันที',
      category: 'ทบทวน: สัญญาณอันตราย (Nursery 205)',
      clinicalDetails: [
        '⚠️ สัญญาณที่ต้องไปพบแพทย์ทันที:',
        '1. รอบสะดือแดง บวม หรือร้อน',
        '2. มีหนองหรือของเหลวผิดปกติออกจากสะดือ',
        '3. มีกลิ่นเหม็นหรือมีเลือดสดออกไม่หยุด',
        '4. ทารกร้องกวนมากเมื่อจับบริเวณสะดือ',
      ],
    },
    {
      src: '/images/rev/nb4_poster2_back_vs_prone.jpg',
      title: 'ภาพที่ 4: ท่านอนที่ปลอดภัย (✓ หงาย vs ✕ คว่ำ)',
      caption: '✓ นอนหงายเสมอ — ปลอดภัยที่สุด ลดความเสี่ยง SIDS • ✕ ห้ามนอนคว่ำ',
      category: 'ทบทวน: การนอนหลับปลอดภัย (Nursery 205)',
      clinicalDetails: [
        '✓ นอนหงาย (Back to Sleep): ท่านอนที่ปลอดภัยที่สุด',
        '✕ นอนคว่ำ (Prone): ห้ามเด็ดขาด เสี่ยงภาวะ SIDS',
        '✓ ที่นอนเรียบ ตึง ไม่มีของนุ่ม',
        '✕ ห้ามมีหมอน หมอนข้าง ตุ๊กตา ผ้าห่มในเตียงทารก',
      ],
    },
    {
      src: '/images/rev/nb4_poster5_danger_signs.jpg',
      title: 'ภาพที่ 5: สังเกตอาการอันตรายขณะทารกนอนหลับ',
      caption: 'หายใจลำบาก, ตัวเขียว, ซึม, ตัวร้อนจัด → รีบพาไปพบแพทย์ทันที',
      category: 'ทบทวน: อาการฉุกเฉิน (Nursery 205)',
      clinicalDetails: [
        '1. หายใจลำบาก หอบ หรือหยุดหายใจ',
        '2. ผิวหนังหรือริมฝีปากเขียวคล้ำหรือซีด',
        '3. ทารกซึมผิดปกติ ปลุกไม่ตื่น',
        '4. ตัวร้อนจัด (มีไข้) หรือตัวเย็นผิดปกติ',
        '→ หากพบอาการเหล่านี้ ปลุกตื่น ตรวจสอบ และรีบพาไปพบแพทย์',
      ],
    },
  ];

  const openWallPoster = (index) => {
    openLightbox({
      ...wallPosters[index],
      items: wallPosters,
      currentIndex: index,
    });
  };

  // ── Quiz State (แบบทดสอบท้ายบท) ──
  const room5Questions = getQuestionsByRoomKey('newbornCare5') || [];
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const currentQ = room5Questions[quizIndex] || null;

  const handleQuizAnswer = (choice) => {
    if (quizShowFeedback) return;
    setQuizUserChoice(choice);
    setQuizShowFeedback(true);
    if (currentQ && choice === currentQ.answer) setQuizScore((prev) => prev + 1);
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room5Questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setMissionCompleted(true);
      completeModule('newbornCare5');
      setShowSuccessModal(
        true,
        'ยินดีด้วย! คุณทบทวนความรู้การดูแลทารกและทำแบบประเมินห้อง Nursery 205 เรียบร้อยแล้ว'
      );
    }
  };

  return (
    <group>
      {/* ── Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        cozyMode={true}
        width={14}
        depth={14}
        height={5.2}
        roomTitle="ห้องที่ 5: ทบทวนความรู้การดูแลทารก & แบบทดสอบ (Review & Quiz Room)"
        roomNumber="Nursery 205"
      />

      {/* ── Warm Lighting ── */}
      <pointLight position={[2, 3.5, -1.5]} intensity={0.9} color="#ffd8a8" distance={13} />
      <pointLight position={[-3, 3, -2]} intensity={0.7} color="#ffe8cc" distance={11} />

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP-RIGHT MISSION HUD
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-white/85 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-green-200/90 text-slate-800">
          <div className="flex items-center justify-between border-b border-green-200/70 pb-1.5 mb-2">
            <span className="text-xs font-extrabold text-green-900 tracking-wide flex items-center gap-1.5">
              📋 ภารกิจห้องทบทวน (Nursery 205)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              missionCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-green-100 text-green-800'
            }`}>
              {missionCompleted ? 'สำเร็จแล้ว ✓' : 'กำลังปฏิบัติ'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => openWallPoster(0)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white/90 hover:border-green-400 text-left font-semibold flex items-center justify-between transition"
            >
              <span>🖼️ 1. ศึกษาโปสเตอร์รอบห้อง (5 ภาพ)</span>
              <span className="text-green-600 font-bold">เปิดดู ▶</span>
            </button>

            <button
              onClick={() => setActiveModal('quiz')}
              className={`w-full p-2.5 rounded-xl border text-left font-bold flex items-center gap-2 transition ${
                missionCompleted
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-green-50 border-green-400 text-green-950 hover:bg-green-100'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                missionCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-green-600 text-transparent'
              }`}>
                ✓
              </div>
              <span className="flex-1">
                2. แบบทดสอบท้ายบท: ทบทวนการดูแลทารก
              </span>
            </button>
          </div>
        </div>
      </Html>

      {/* ══════════════════════════════════════════════════════════════════════════
          5 EDUCATIONAL WALL POSTERS
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Poster 1 (North Wall Left) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster1_equip.jpg"
        width={3.4}
        height={2.3}
        position={[-3.8, 2.95, -6.78]}
        title="อุปกรณ์อาบน้ำและดูแลสะดือทารก"
        badge="ภาพที่ 1"
        frameColor="#2d6a4f"
        accentColor="#10b981"
        onClick={() => openWallPoster(0)}
      />

      {/* Poster 2 (North Wall Right) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster3_dry.jpg"
        width={3.4}
        height={2.3}
        position={[3.8, 2.95, -6.78]}
        title="วิธีเช็ดสะดือทารก (สะดือเริ่มแห้ง)"
        badge="ภาพที่ 2"
        frameColor="#2d6a4f"
        accentColor="#0284c7"
        onClick={() => openWallPoster(1)}
      />

      {/* Poster 3 (West Wall) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb3_poster5_warning.jpg"
        width={4.5}
        height={2.8}
        position={[-6.78, 2.95, -1.5]}
        rotation={[0, Math.PI / 2, 0]}
        title="สัญญาณผิดปกติของสะดือทารก"
        badge="ภาพที่ 3"
        frameColor="#2d6a4f"
        accentColor="#e11d48"
        onClick={() => openWallPoster(2)}
      />

      {/* Poster 4 (East Wall Upper) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster2_back_vs_prone.jpg"
        width={4.5}
        height={2.8}
        position={[6.78, 2.95, -2.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="ท่านอนที่ปลอดภัย ✓ หงาย vs ✕ คว่ำ"
        badge="ภาพที่ 4"
        frameColor="#2d6a4f"
        accentColor="#d97706"
        onClick={() => openWallPoster(3)}
      />

      {/* Poster 5 (East Wall Lower) */}
      <FramedImagePoster3D
        imgSrc="/images/rev/nb4_poster5_danger_signs.jpg"
        width={4.5}
        height={2.8}
        position={[6.78, 2.95, 2.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="อาการอันตรายขณะทารกนอนหลับ"
        badge="ภาพที่ 5"
        frameColor="#2d6a4f"
        accentColor="#e11d48"
        onClick={() => openWallPoster(4)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          BABY CRIB (Center) — Baby sleeping safely on back
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, -1.5]}>
        <BabyCrib position={[0, 0, 0]}>
          <BabyAvatar pose="sleeping" scale={1.0} />
        </BabyCrib>
        <Html position={[0, 1.8, 0]} center distanceFactor={12} zIndexRange={[10, 0]}>
          <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            👶 ทารกนอนหงาย — ปลอดภัย ✓
          </div>
        </Html>
      </group>

      {/* Corner plants */}
      <RealPlant type="potted" position={[5.5, 0, -5.5]} scale={1.2} />
      <RealPlant type="potted" position={[-5.5, 0, -5.5]} scale={1.0} />

      {/* ══════════════════════════════════════════════════════════════════════════
          QUIZ MODAL
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeModal === 'quiz' && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-base">📝 แบบทดสอบท้ายบท — Nursery 205</div>
                  <div className="text-xs opacity-90 mt-0.5">ทบทวนการดูแลทารก: สะดือ, อาบน้ำ, การนอน</div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-white/80 hover:text-white text-xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
                >✕</button>
              </div>

              <div className="p-5">
                {quizFinished ? (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-3">🎉</div>
                    <div className="text-xl font-extrabold text-emerald-800 mb-1">ทำแบบทดสอบเสร็จแล้ว!</div>
                    <div className="text-base text-slate-600 mb-3">
                      คะแนน: <span className="font-black text-emerald-700">{quizScore}/{room5Questions.length}</span>
                    </div>
                    <div className="text-sm text-slate-500">ห้อง Nursery 205 เสร็จสมบูรณ์ ✓</div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-sm"
                    >
                      ปิด
                    </button>
                  </div>
                ) : room5Questions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="font-semibold">ไม่พบข้อสอบสำหรับห้องนี้</div>
                    <div className="text-xs mt-1">กรุณาตรวจสอบไฟล์ quizData.js</div>
                    <button
                      onClick={() => { setMissionCompleted(true); completeModule('newbornCare5'); setActiveModal(null); }}
                      className="mt-4 px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition"
                    >
                      บันทึกว่าเสร็จแล้ว ✓
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Progress */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>ข้อที่ {quizIndex + 1} / {room5Questions.length}</span>
                      <span className="font-bold text-emerald-600">คะแนน: {quizScore}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${((quizIndex) / room5Questions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question */}
                    <div className="bg-green-50 rounded-xl p-3.5 mb-4 border border-green-200">
                      <p className="font-bold text-green-900 text-sm leading-snug">{currentQ.question}</p>
                    </div>

                    {/* Choices */}
                    <div className="space-y-2">
                      {currentQ.choices.map((choice, idx) => {
                        let btnClass = 'w-full text-left px-3.5 py-2.5 rounded-xl border text-sm font-medium transition cursor-pointer ';
                        if (!quizShowFeedback) {
                          btnClass += 'border-slate-200 bg-white hover:border-green-400 hover:bg-green-50';
                        } else if (choice === currentQ.answer) {
                          btnClass += 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (choice === quizUserChoice) {
                          btnClass += 'border-rose-400 bg-rose-50 text-rose-800';
                        } else {
                          btnClass += 'border-slate-100 bg-white/60 text-slate-400';
                        }
                        return (
                          <button
                            key={idx}
                            className={btnClass}
                            onClick={() => handleQuizAnswer(choice)}
                          >
                            <span className="font-bold text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {choice}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    {quizShowFeedback && (
                      <div className={`mt-3 p-3 rounded-xl text-sm font-semibold ${
                        quizUserChoice === currentQ.answer
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {quizUserChoice === currentQ.answer ? '✓ ถูกต้อง!' : `✕ ไม่ถูกต้อง คำตอบที่ถูกคือ: ${currentQ.answer}`}
                        {currentQ.explanation && (
                          <div className="mt-1 text-xs font-normal opacity-80">{currentQ.explanation}</div>
                        )}
                        <button
                          onClick={handleNextQuizQuestion}
                          className="mt-2 w-full py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          {quizIndex < room5Questions.length - 1 ? 'ข้อถัดไป →' : 'ดูผลคะแนน 🎉'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 2.5]} />
    </group>
  );
}
