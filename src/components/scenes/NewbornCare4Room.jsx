import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import DoctorDesk from '../furniture/DoctorDesk';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import Pillows from '../decorations/Pillows';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function NewbornCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
  const [activeTab, setActiveTab] = useState(0); // 0: Safe Sleep Practice, 1: ตรวจความปลอดภัยในเปล, 2: สภาพแวดล้อมห้อง, 3: แบบประเมิน

  // ── กิจกรรม 1: ท่านอนที่ปลอดภัย (Safe Sleep Practice: Back to Sleep) ──
  const [sleepPose, setSleepPose] = useState('supine'); // 'supine' (หงาย) | 'prone' (คว่ำ) | 'side' (ตะแคง)
  const [act1Feedback, setAct1Feedback] = useState({
    pass: true,
    msg: '✓ ท่านอนหงาย (Supine position) เป็นท่านอนที่ปลอดภัยที่สุดตามคำแนะนำของ AAP และ WHO ช่วยลดความเสี่ยงต่อภาวะทารกเสียชีวิตเฉียบพลันขณะหลับ (SIDS)'
  });

  const handleSelectSleepPose = (pose) => {
    setSleepPose(pose);
    if (pose === 'supine') {
      setAct1Feedback({
        pass: true,
        msg: '✓ ถูกต้องยอดเยี่ยม! ท่านอนหงาย (Back to Sleep) เป็นท่านอนที่ปลอดภัยที่สุดสำหรับทารกแรกเกิด ทั้งเวลากลางวันและกลางคืน ทางเดินหายใจจะเปิดโล่ง ไม่ถูกกดทับ'
      });
    } else if (pose === 'prone') {
      setAct1Feedback({
        pass: false,
        msg: '✕ อันตรายมาก! ท่านอนคว่ำ (Prone) เพิ่มความเสี่ยงต่อการขาดอากาศหายใจและการเสียชีวิตเฉียบพลัน (SIDS) ห้ามให้ทารกนอนคว่ำโดยไม่มีผู้ดูแลใกล้ชิด'
      });
    } else {
      setAct1Feedback({
        pass: false,
        msg: '✕ ไม่แนะนำ: ท่านอนตะแคง (Side) ไม่ปลอดภัยเนื่องจากทารกสามารถพลิกคว่ำหน้าลงไปได้ง่าย เสี่ยงต่อการอุดกั้นทางเดินหายใจ'
      });
    }
  };

  // ── กิจกรรม 2: ตรวจความปลอดภัยในเปลนอน (Bare is Best) ──
  // วัตถุในเปล: อะไรควรอยู่ / อะไรต้องนำออก
  const [cribItems, setCribItems] = useState([
    { id: 'mattress', name: 'ที่นอนแน่นและเรียบ (Firm Mattress) ผ้าปูตึงพอดี', keep: true, status: 'kept' },
    { id: 'baby_clothing', name: 'เสื้อผ้าเด็กพอดีตัว อบอุ่นกำลังดี', keep: true, status: 'kept' },
    { id: 'pillow', name: 'หมอนหนุนศีรษะนุ่มๆ', keep: false, status: 'in_crib' },
    { id: 'bolster', name: 'หมอนข้างนิ่มๆ วางขนาบข้างลำตัว', keep: false, status: 'in_crib' },
    { id: 'doll', name: 'ตุ๊กตาผ้า / ของเล่นนุ่มนิ่ม', keep: false, status: 'in_crib' },
    { id: 'thick_blanket', name: 'ผ้านวมหนา / ผ้าห่มขนสัตว์ฟู', keep: false, status: 'in_crib' },
  ]);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const toggleCribItem = (id) => {
    setCribItems(prev => prev.map(item => item.id === id ? { ...item, status: item.status === 'in_crib' ? 'removed' : 'in_crib' } : item));
    setAct2Feedback(null);
  };

  const checkCribSafety = () => {
    // Correct if all unsafe items are 'removed'
    const unsafeItems = cribItems.filter(i => !i.keep);
    const allUnsafeRemoved = unsafeItems.every(i => i.status === 'removed');

    if (allUnsafeRemoved) {
      setAct2Feedback({
        pass: true,
        msg: '✓ ยอดเยี่ยมมาก! เปลนอนปลอดภัย 100% ตามหลัก "Bare is Best" ไม่มีหมอน หมอนข้าง ตุ๊กตา หรือผ้านวมหนา ที่อาจตกลงมาอุดกั้นจมูกและปากของทารก'
      });
    } else {
      setAct2Feedback({
        pass: false,
        msg: '✕ ยังมีสิ่งของอันตรายอยู่ในเปลนอน! กรุณานำหมอน หมอนข้าง ตุ๊กตา และผ้านวมหนาออกจากเปลให้หมด'
      });
    }
  };

  // ── กิจกรรม 3: สภาพแวดล้อมห้องนอนที่ปลอดภัย ──
  const [envFactors, setEnvFactors] = useState({
    temp: '25', // '25' | 'cold' | 'hot'
    smoke: 'no', // 'no' | 'yes'
    room_share: 'share_crib', // 'share_crib' | 'share_bed' | 'separate_room'
  });
  const [act3Feedback, setAct3Feedback] = useState(null);

  const checkEnv = () => {
    const isTempOk = envFactors.temp === '25';
    const isSmokeOk = envFactors.smoke === 'no';
    const isShareOk = envFactors.room_share === 'share_crib';

    if (isTempOk && isSmokeOk && isShareOk) {
      setAct3Feedback({
        pass: true,
        msg: '✓ การจัดสภาพแวดล้อมถูกต้องสมบูรณ์! อุณหภูมิ 25–26°C อากาศถ่ายเท ปลอดควันบุหรี่ 100% และนอนในเปลเด็กข้างเตียงแม่ (Room-sharing) ช่วยลดความเสี่ยง SIDS ได้ถึง 50%'
      });
    } else {
      setAct3Feedback({
        pass: false,
        msg: '✕ กรุณาปรับสภาพแวดล้อมให้เหมาะสม: อุณหภูมิห้อง 25–26°C ปลอดควันบุหรี่ และนอนในเปลเด็กแยกต่างหากข้างเตียงแม่ ไม่นอนเตียงเดียวกันเพื่อป้องกันการนอนทับ'
      });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 13 & 15) ──
  const room4Questions = getQuestionsByRoomKey('newbornCare4');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = room4Questions[quizIndex] || room4Questions[0];

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
    if (quizIndex < room4Questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('newbornCare4');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้อง Nursery 204 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room4Questions.length} คะแนน)`
      );
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลทารก 4: สภาพแวดล้อมที่ปลอดภัยสำหรับทารก (Safe Sleep)"
        roomNumber="Safe Nursery Ward 204"
      />

      {/* ── REAL 3D ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* Safe Sleep Baby Crib (Beside Mother's Sofa - Room Sharing Demo) */}
      <group position={[-4.0, 0, -3.2]} onClick={() => setActiveTab(1)}>
        <BabyCrib position={[0, 0, 0]} scale={1.1}>
          {!isHoldingBaby && (
            <BabyAvatar
              pose={sleepPose === 'supine' ? 'sleeping' : 'held'}
              position={[0, 0, 0]}
              scale={1.0}
              withBlanket={true}
            />
          )}
        </BabyCrib>
        <Html position={[0, 1.25, 0]} center distanceFactor={24}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
              border: '2px solid white'
            }}
          >
            <span>{isHoldingBaby ? '🧸 วางลงเปล' : '👶 เปลนอน (คลิกอุ้ม)'}</span>
          </div>
        </Html>
      </group>

      {/* Mother Sofa for Room-Sharing Demo */}
      <InteractiveSeat
        id="nursery204_sofa"
        name="เตียง/โซฟาคุณแม่ข้างเปล"
        type="sofa"
        position={[-6.2, 0, -3.2]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <group onClick={() => setActiveTab(2)}>
          <HospitalSofa position={[0, 0, 0]} scale={1.1} />
          <Pillows position={[0.2, 0.45, 0]} scale={0.85} />
        </group>
      </InteractiveSeat>

      {/* Doctor Consultation Desk & Quiz Kiosk */}
      <group position={[4.5, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={0.9} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          🏠 INTERACTIVE LEARNING HUD (Nursery 204: Safe Sleep Environment)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html position={[0, 1.85, -7.8]} center transform scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.22 : 0.27}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '24px',
          borderRadius: '24px',
          width: '880px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '3px solid #38bdf8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e0f2fe', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ background: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                NURSERY 204: สภาพแวดล้อมที่ปลอดภัยสำหรับทารก (Safe Sleep)
              </span>
              <h2 style={{ margin: '6px 0 0 0', color: '#0369a1', fontSize: '22px' }}>
                {activeTab === 0 && 'ท่านอนที่ปลอดภัยสำหรับทารก (Back to Sleep)'}
                {activeTab === 1 && 'การจัดเตียงนอนที่ปลอดภัยตามหลัก Bare is Best'}
                {activeTab === 2 && 'การควบคุมสภาพแวดล้อมห้องนอน (อุณหภูมิและการนอนร่วมห้อง)'}
                {activeTab === 3 && 'แบบประเมินความรู้ประจำห้อง Nursery 204 (ข้อ 13 & 15)'}
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
            {['1. ท่านอนที่ปลอดภัย', '2. ตรวจความปลอดภัยในเปล', '3. สภาพแวดล้อมห้องนอน', '4. แบบประเมิน (Quiz)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === idx ? '#0284c7' : '#e0f2fe',
                  color: activeTab === idx ? 'white' : '#0369a1',
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

          {/* ── TAB 0: ท่านอนที่ปลอดภัย ── */}
          {activeTab === 0 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>เป้าหมาย:</strong> เรียนรู้ท่านอนที่ถูกต้องและปลอดภัยที่สุดสำหรับทารกแรกเกิดตามมาตรฐานของ AAP และ WHO เพื่อป้องกัน SIDS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div
                  onClick={() => handleSelectSleepPose('supine')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'supine' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                    background: sleepPose === 'supine' ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>👶💤</div>
                  <strong style={{ fontSize: '15px', color: '#166534', display: 'block', marginBottom: '6px' }}>
                    1. ท่านอนหงาย (Supine)
                  </strong>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    ปลอดภัยที่สุด (แนะนำ)
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    ทางเดินหายใจเปิดโล่ง ลิ้นไม่ตกไปอุดหลอดลม ลดความเสี่ยงทารกเสียชีวิตเฉียบพลันขณะหลับ (SIDS)
                  </p>
                </div>

                <div
                  onClick={() => handleSelectSleepPose('prone')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'prone' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    background: sleepPose === 'prone' ? '#fef2f2' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>⚠️</div>
                  <strong style={{ fontSize: '15px', color: '#991b1b', display: 'block', marginBottom: '6px' }}>
                    2. ท่านอนคว่ำ (Prone)
                  </strong>
                  <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    อันตราย ห้ามทำเด็ดขาด
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    เสี่ยงต่อการขาดอากาศหายใจ ใบหน้าแนบที่นอน และเพิ่มความร้อนในร่างกายสูงเกินไป
                  </p>
                </div>

                <div
                  onClick={() => handleSelectSleepPose('side')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'side' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    background: sleepPose === 'side' ? '#fffbeb' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔄</div>
                  <strong style={{ fontSize: '15px', color: '#b45309', display: 'block', marginBottom: '6px' }}>
                    3. ท่านอนตะแคง (Side)
                  </strong>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    ไม่แนะนำ
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    ไม่มั่นคง ทารกสามารถพลิกคว่ำหน้าลงไปได้ง่าย เสี่ยงต่อการอุดกั้นทางเดินหายใจ
                  </p>
                </div>
              </div>

              {act1Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act1Feedback.pass ? '#dcfce7' : '#fee2e2', color: act1Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act1Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ไปตรวจความปลอดภัยในเปลนอน ➜
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 1: ตรวจความปลอดภัยในเปล (Bare is Best) ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>หลักการ Bare is Best:</strong> เปลนอนของทารกควรมีเพียง "ที่นอนแน่นเรียบและตัวทารก" เท่านั้น สิ่งของนุ่มๆ เช่น หมอน หมอนข้าง ตุ๊กตา หรือผ้านวมหนา ต้องนำออกจากเปลทั้งหมด
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {cribItems.filter(i => !i.keep).map(item => {
                  const isRemoved = item.status === 'removed';
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCribItem(item.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: isRemoved ? '2px solid #16a34a' : '2px solid #dc2626',
                        background: isRemoved ? '#f0fdf4' : '#fef2f2',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: isRemoved ? '#166534' : '#991b1b' }}>{item.name}</strong>
                        <div style={{ fontSize: '11px', color: isRemoved ? '#15803d' : '#b91c1c', marginTop: '2px' }}>
                          {isRemoved ? '✓ นำออกจากเปลแล้ว (ปลอดภัย)' : '⚠️ ยังอยู่ในเปล (เสี่ยงอุดกั้นทางเดินหายใจ)'}
                        </div>
                      </div>
                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: isRemoved ? '#16a34a' : '#dc2626',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {isRemoved ? 'ปลอดภัย' : 'คลิกนำออก'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {act2Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act2Feedback.pass ? '#dcfce7' : '#fee2e2', color: act2Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act2Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkCribSafety}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจสอบความปลอดภัยของเปลนอน
                </button>
                {act2Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(2)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปตั้งค่าสภาพแวดล้อมห้องนอน ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: สภาพแวดล้อมห้องนอนที่ปลอดภัย ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>เป้าหมาย:</strong> กำหนดอุณหภูมิห้อง คุณภาพอากาศ และรูปแบบการนอนร่วมห้องที่ปลอดภัย
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {/* Temp */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>1. อุณหภูมิห้องนอน:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>อุณหภูมิที่เหมาะสมช่วยให้ทารกหลับสบาย ไม่ร้อนหรือเย็นเกินไป</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'cold', label: 'หนาวเกินไป (< 22°C)' }, { val: '25', label: 'พอดี (25–26°C)' }, { val: 'hot', label: 'ร้อนจัด (> 28°C)' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, temp: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.temp === opt.val ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          background: envFactors.temp === opt.val ? '#e0f2fe' : 'white',
                          color: envFactors.temp === opt.val ? '#0369a1' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smoke */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>2. ควันบุหรี่ / มลพิษ:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>ควันบุหรี่มือสองและมือสามเพิ่มความเสี่ยง SIDS และโรคปอด</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'no', label: 'ปลอดควันบุหรี่ 100%' }, { val: 'yes', label: 'อนุญาตให้สูบในห้อง' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, smoke: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.smoke === opt.val ? (opt.val === 'no' ? '2px solid #16a34a' : '2px solid #dc2626') : '1px solid #cbd5e1',
                          background: envFactors.smoke === opt.val ? (opt.val === 'no' ? '#dcfce7' : '#fee2e2') : 'white',
                          color: envFactors.smoke === opt.val ? (opt.val === 'no' ? '#15803d' : '#991b1b') : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room sharing */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>3. รูปแบบการนอนร่วมห้อง:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>การนอนห้องเดียวกันแต่แยกเปลนอน (Room-sharing without Bed-sharing)</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'share_crib', label: 'นอนเปลแยกข้างเตียงแม่' }, { val: 'share_bed', label: 'นอนเตียงเดียวกับพ่อแม่' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, room_share: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '2px solid #16a34a' : '2px solid #dc2626') : '1px solid #cbd5e1',
                          background: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '#dcfce7' : '#fee2e2') : 'white',
                          color: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '#15803d' : '#991b1b') : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {act3Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act3Feedback.pass ? '#dcfce7' : '#fee2e2', color: act3Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act3Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkEnv}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจสอบสภาพแวดล้อมห้องนอน
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

          {/* ── TAB 3: แบบประเมินความรู้ประจำห้อง Nursery 204 (ข้อ 13 & 15) ── */}
          {activeTab === 3 && (
            <div>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      📋 แบบประเมิน: {currentQ.room}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                      ข้อ {quizIndex + 1} / {room4Questions.length} | คะแนนสะสม: {quizScore}
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
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#0284c7' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#e0f2fe' : '#f9fafb'),
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
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#0284c7' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#e0f2fe' : '#f9fafb'),
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
                            background: '#0284c7',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          {quizIndex < room4Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สำเร็จบทเรียน 🏆'}
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
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ Nursery 204 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room4Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องในการจัดสภาพแวดล้อมที่ปลอดภัยสำหรับทารกตามหลัก Safe Sleep สากล
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
                      style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 'bold', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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
