import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalBed from '../furniture/HospitalBed';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import Pillows from '../decorations/Pillows';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import InteractiveSeat from '../furniture/InteractiveSeat';
import DoctorDesk from '../furniture/DoctorDesk';
import MedicineCabinet from '../furniture/MedicineCabinet';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function MotherCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [activeTab, setActiveTab] = useState(0); // 0: 5 สัญญาณอันตราย, 1: ฝึกจำแนกอาการ, 2: สายด่วนฉุกเฉิน, 3: แบบประเมิน

  // ── กิจกรรม 1: 5 สัญญาณอันตรายสำคัญ (Critical Danger Signs) ──
  const [selectedDangerIndex, setSelectedDangerIndex] = useState(0);

  const dangerSigns = [
    {
      id: 1,
      title: '1. เลือดออกมากหลังคลอด (ตกเลือด)',
      icon: '🩸',
      img: '/references/mother_zone2/danger_bleeding.png',
      normalText: 'น้ำคาวปลา 2–3 วันแรกสีแดงคล้ายประจำเดือน แล้วค่อยๆ เปลี่ยนเป็นสีชมพู และสีขาวเหลืองในสัปดาห์ที่ 2–6 โดยปริมาณลดลงเรื่อยๆ',
      dangerText: 'เปียกผ้าอนามัยชุ่มเต็มแผ่น > 1 แผ่น/ชั่วโมง ติดต่อกัน 2 ชั่วโมง, มีลิ่มเลือดขนาดใหญ่กว่าไข่ไก่, เลือดสดไหลพุ่งไม่หยุด, หน้ามืด ใจสั่น ซีด เป็นลม',
      action: 'ไปโรงพยาบาลทันที! ภาวะตกเลือดหลังคลอดอาจเกิดจากมดลูกหดรัดตัวไม่ดี หรือมีเศษรกค้าง'
    },
    {
      id: 2,
      title: '2. ไข้สูง และน้ำคาวปลามีกลิ่นเหม็น',
      icon: '🌡️',
      img: '/references/mother_zone2/danger_fever.png',
      normalText: 'อุณหภูมิร่างกายปกติ 36.5–37.4°C น้ำคาวปลามีกลิ่นคาวเลือดจางๆ ไม่มีกลิ่นเหม็นเน่า',
      dangerText: 'มีไข้ ≥ 38.0°C หรือหนาวสั่น, น้ำคาวปลามีกลิ่นเหม็นผิดปกติ สีเหลือง/เขียว/น้ำตาลเข้ม, ปวดเกร็งท้องน้อยรุนแรง หรือมดลูกกดเจ็บมาก',
      action: 'พบแพทย์ทันที! เสี่ยงต่อการติดเชื้อในโพรงมดลูก (Endometritis) หรือติดเชื้อทางเดินปัสสาวะ'
    },
    {
      id: 3,
      title: '3. ปวดศีรษะรุนแรง / ตาพร่ามัว',
      icon: '⚡',
      img: '/references/mother_zone2/danger_headache.png',
      normalText: 'ปวดศีรษะเล็กน้อยจากการอดนอนหรือเหนื่อยล้า และอาการดีขึ้นเมื่อได้นอนหลับพักผ่อน',
      dangerText: 'ปวดศีรษะรุนแรงไม่ทุเลา, ตาพร่ามัว มองเห็นภาพซ้อน เห็นแสงวาบเหมือนฟ้าแลบ, ปวดจุกแน่นใต้ชายโครงขวา/ลิ้นปี่, ความดันโลหิต ≥ 140/90 mmHg, ชัก หรือหมดสติ',
      action: 'ฉุกเฉิน! สัญญาณของภาวะความดันโลหิตสูงรุนแรงหลังคลอด / ครรภ์เป็นพิษ (Preeclampsia/Eclampsia) ต้องพบแพทย์ด่วนที่สุด'
    },
    {
      id: 4,
      title: '4. ปวดหรือบวมน่อง (เสี่ยงลิ่มเลือดอุดตัน)',
      icon: '🦵',
      img: '/references/mother_zone2/danger_dvt.png',
      normalText: 'รู้สึกตึงหรือหนักน่องเล็กน้อยสองข้างในช่วงเย็น และอาการดีขึ้นเมื่อยกขาสูงหรือพักผ่อน',
      dangerText: 'ปวดน่องรุนแรง โดยเฉพาะขาข้างใดข้างหนึ่ง, น่องบวมโตข้างเดียวอย่างเห็นได้ชัด, ผิวหนังแดง ร้อน และกดเจ็บลึกๆ',
      action: 'ห้ามนวดขาเด็ดขาด! และรีบไปโรงพยาบาลทันที เสี่ยงภาวะลิ่มเลือดอุดตันในหลอดเลือดดำลึก (DVT)'
    },
    {
      id: 5,
      title: '5. เจ็บหน้าอก หรือหายใจลำบาก',
      icon: '🫁',
      img: '/references/mother_zone2/danger_pe.png',
      normalText: 'หายใจสะดวก โล่งสบาย ไม่เหนื่อยหอบขณะทำกิจวัตรประจำวันตามปกติ',
      dangerText: 'เจ็บแน่นหน้าอกรุนแรง, หายใจไม่อิ่ม หอบเหนื่อยฉับพลัน, หายใจเข้าแล้วเจ็บแปลบ, ไอมีเสมหะปนเลือด, หน้ามืด เหงื่อแตก',
      action: 'โทร 1669 เรียกรถพยาบาลฉุกเฉินทันที! เสี่ยงภาวะลิ่มเลือดหลุดไปอุดตันในปอด (Pulmonary Embolism: PE)'
    },
  ];

  // ── กิจกรรม 2: ฝึกจำแนกอาการ (เฝ้าสังเกต vs ไปโรงพยาบาลทันที) ──
  const [triageItems, setTriageItems] = useState([
    { id: 't1', text: 'ผ้าอนามัยชุ่มเต็มแผ่นภายใน 45 นาที และมีลิ่มเลือดขนาดใหญ่', ans: null, correct: 'er' },
    { id: 't2', text: 'น้ำคาวปลาสีชมพูจางลงในวันที่ 5 หลังคลอด ไม่มีกลิ่นเหม็น', ans: null, correct: 'obs' },
    { id: 't3', text: 'มีไข้ 38.6°C หนาวสั่น และปวดเกร็งท้องน้อย', ans: null, correct: 'er' },
    { id: 't4', text: 'ปวดศีรษะเล็กน้อยจากการเลี้ยงลูก พักผ่อนแล้วดีขึ้น', ans: null, correct: 'obs' },
    { id: 't5', text: 'ปวดศีรษะรุนแรงร่วมกับตาพร่ามัวเห็นแสงวาบ', ans: null, correct: 'er' },
    { id: 't6', text: 'น่องข้างขวาบวม แดง ร้อน และกดเจ็บมาก', ans: null, correct: 'er' },
    { id: 't7', text: 'เจ็บแน่นหน้าอกฉับพลันและหายใจหอบเหนื่อย', ans: null, correct: 'er' },
  ]);
  const [triageFeedback, setTriageFeedback] = useState(null);

  const handleTriageSelect = (id, choice) => {
    setTriageItems(prev => prev.map(item => item.id === id ? { ...item, ans: choice } : item));
    setTriageFeedback(null);
  };

  const checkTriage = () => {
    const allAnswered = triageItems.every(i => i.ans !== null);
    if (!allAnswered) {
      setTriageFeedback({ pass: false, msg: 'กรุณาจำแนกอาการให้ครบทุกข้อก่อนตรวจคำตอบครับ' });
      return;
    }
    const isAllCorrect = triageItems.every(i => i.ans === i.correct);
    if (isAllCorrect) {
      setTriageFeedback({
        pass: true,
        msg: '✓ ถูกต้อง 100%! คุณแม่สามารถแยกแยะอาการปกติที่เฝ้าสังเกตได้ ออกจากสัญญาณอันตรายที่ต้องไปโรงพยาบาลทันทีได้อย่างแม่นยำ'
      });
    } else {
      setTriageFeedback({
        pass: false,
        msg: '✕ ยังมีบางข้อไม่ถูกต้อง: สัญญาณอันตราย เช่น เลือดออกมาก ไข้สูง ตาพร่ามัว ขาบวมข้างเดียว เจ็บหน้าอก ต้องไปโรงพยาบาลทันที ห้ามรอดูอาการ'
      });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 1, 4 & 7) ──
  const room4Questions = getQuestionsByRoomKey('motherCare4');
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
      completeModule('motherCare4');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้องที่ 4 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room4Questions.length} คะแนน)`
      );
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา 4: สังเกตอาการผิดปกติและสัญญาณอันตรายหลังคลอด"
        roomNumber="Emergency Observation Ward 104"
      />

      {/* ── REAL 3D ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <MedicineCabinet position={[7.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />
      <HospitalTrashBin position={[6.0, 0, 2.8]} scale={0.85} />
      <ExaminationLamp position={[-6.8, 0, -3.8]} />

      {/* Emergency Wheelchair */}
      <InteractiveSeat
        id="ward104_wheelchair"
        name="รถเข็นฉุกเฉิน Ward 104"
        type="wheelchair"
        position={[-7.2, 0, 1.5]}
        rotation={[0, Math.PI / 3, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* Patient Observation Bed - Shifted Left */}
      <InteractiveSeat
        id="room104_bed"
        name="เตียงสังเกตอาการฉุกเฉิน"
        type="bed"
        position={[-5.2, 0, -3.8]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.72, 0]}
      >
        <group onClick={() => setActiveTab(0)}>
          <HospitalBed position={[0, 0, 0]} />
          <Pillows position={[0.2, 0.95, -0.6]} scale={0.8} />
        </group>
      </InteractiveSeat>

      {/* Doctor Consultation Desk & Emergency Red Hotline (กิจกรรม 2 & 3) */}
      <group position={[4.5, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={0.9} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          🚨 INTERACTIVE LEARNING HUD (Based on Manual Zone 2: Danger Signs)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html position={[0, 2.1, -7.8]} center transform scale={0.27}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '24px',
          borderRadius: '24px',
          width: '880px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '3px solid #ef4444',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fee2e2', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ background: '#dc2626', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                ZONE 2: การสังเกตอาการผิดปกติและสัญญาณอันตรายหลังคลอด (Ward 104)
              </span>
              <h2 style={{ margin: '6px 0 0 0', color: '#b91c1c', fontSize: '22px' }}>
                {activeTab === 0 && '5 สัญญาณอันตรายสำคัญที่ต้องรีบไปโรงพยาบาล'}
                {activeTab === 1 && 'กิจกรรมจำแนกอาการ: เฝ้าสังเกต vs ต้องไปโรงพยาบาลทันที'}
                {activeTab === 2 && 'สายด่วนฉุกเฉินและคำแนะนำด้านความปลอดภัย'}
                {activeTab === 3 && 'แบบประเมินความรู้ประจำห้องที่ 4 (ข้อ 1, 4 & 7)'}
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
            {['1. 5 สัญญาณอันตราย', '2. ฝึกจำแนกอาการ', '3. สายด่วนฉุกเฉิน 1669', '4. แบบประเมิน (Quiz)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === idx ? '#dc2626' : '#fee2e2',
                  color: activeTab === idx ? 'white' : '#991b1b',
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

          {/* ── TAB 0: 5 สัญญาณอันตรายสำคัญ ── */}
          {activeTab === 0 && (
            <div>
              <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ef4444' }}>
                <strong>หลักการสำคัญ:</strong> สื่อนี้ใช้เพื่อการเรียนรู้และฝึกสังเกตอาการ ไม่ใช้แทนการตรวจรักษาจริง หากพบสัญญาณอันตรายข้อใดข้อหนึ่ง ให้ขอความช่วยเหลือทางการแพทย์ทันที
              </div>

              {/* Danger Signs Selection Buttons */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {dangerSigns.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDangerIndex(idx)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: selectedDangerIndex === idx ? '#dc2626' : '#e2e8f0',
                      background: selectedDangerIndex === idx ? '#fef2f2' : 'white',
                      color: selectedDangerIndex === idx ? '#991b1b' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '18px' }}>{d.icon}</div>
                    <div style={{ marginTop: '2px' }}>{d.title.split('.')[1]?.trim()}</div>
                  </button>
                ))}
              </div>

              {/* Active Danger Sign Detail */}
              {dangerSigns[selectedDangerIndex] && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#b91c1c', fontSize: '16px' }}>
                      {dangerSigns[selectedDangerIndex].icon} {dangerSigns[selectedDangerIndex].title}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                      ภาพประกอบอ้างอิงจากคู่มือหลักสูตร
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                    {dangerSigns[selectedDangerIndex].img && (
                      <div style={{ flexShrink: 0, width: '160px', height: '125px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #cbd5e1', background: 'white' }}>
                        <img
                          src={dangerSigns[selectedDangerIndex].img}
                          alt={dangerSigns[selectedDangerIndex].title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '10px', borderRadius: '10px' }}>
                        <strong style={{ color: '#166534', fontSize: '12.5px' }}>🟢 อาการปกติ (เฝ้าสังเกตได้):</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#14532d', lineHeight: '1.35' }}>
                          {dangerSigns[selectedDangerIndex].normalText}
                        </p>
                      </div>

                      <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '10px', borderRadius: '10px' }}>
                        <strong style={{ color: '#991b1b', fontSize: '12.5px' }}>🔴 สัญญาณอันตราย (ต้องไป รพ. ทันที):</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#7f1d1d', lineHeight: '1.35' }}>
                          {dangerSigns[selectedDangerIndex].dangerText}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff1f2', borderLeft: '4px solid #e11d48', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#9f1239', fontWeight: 'bold' }}>
                    🚨 สิ่งที่ต้องปฏิบัติ: {dangerSigns[selectedDangerIndex].action}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  คลิกดูรายละเอียดครบทั้ง 5 สัญญาณ เพื่อความเข้าใจที่ถูกต้อง
                </span>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ไปฝึกจำแนกอาการ ➜
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 1: ฝึกจำแนกอาการ (Triage) ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #ef4444' }}>
                <strong>เป้าหมาย:</strong> ฝึกวิเคราะห์สถานการณ์จริง และจำแนกว่าควร "เฝ้าสังเกต" หรือ "ต้องไปโรงพยาบาลทันที"
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '280px', overflowY: 'auto' }}>
                {triageItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{item.text}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleTriageSelect(item.id, 'obs')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: item.ans === 'obs' ? '#16a34a' : '#cbd5e1',
                          background: item.ans === 'obs' ? '#dcfce7' : 'white',
                          color: item.ans === 'obs' ? '#15803d' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        เฝ้าสังเกต
                      </button>
                      <button
                        onClick={() => handleTriageSelect(item.id, 'er')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: item.ans === 'er' ? '#dc2626' : '#cbd5e1',
                          background: item.ans === 'er' ? '#fee2e2' : 'white',
                          color: item.ans === 'er' ? '#991b1b' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ต้องไป รพ. ทันที
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {triageFeedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: triageFeedback.pass ? '#dcfce7' : '#fee2e2', color: triageFeedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {triageFeedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkTriage}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจคำตอบการจำแนกอาการ
                </button>
                {triageFeedback?.pass && (
                  <button
                    onClick={() => setActiveTab(2)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปดูสายด่วนฉุกเฉิน ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: สายด่วนฉุกเฉินและคำแนะนำความปลอดภัย ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '14px', border: '1px solid #fecaca', marginBottom: '16px', textAlign: 'center' }}>
                <h3 style={{ color: '#b91c1c', margin: '0 0 6px 0', fontSize: '20px' }}>
                  📞 สายด่วนการแพทย์ฉุกเฉินแห่งชาติ: โทร 1669 (ฟรี 24 ชม.)
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d' }}>
                  หากมีอาการรุนแรง เช่น เลือดออกไม่หยุด ชัก หมดสติ เจ็บหน้าอก หายใจลำบาก ให้โทรเรียกรถพยาบาลทันที
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>📝 ข้อมูลที่ต้องแจ้งเมื่อโทร 1669:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
                    <li>แจ้งว่า "เป็นมารดาหลังคลอด" และระบุว่าคลอดมากี่วัน</li>
                    <li>บอกอาการสำคัญ เช่น เลือดออกมาก หมดสติ หรือหายใจหอบ</li>
                    <li>บอกสถานที่เกิดเหตุและจุดสังเกตให้ชัดเจน</li>
                    <li>แจ้งชื่อและเบอร์โทรศัพท์ติดต่อกลับ</li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>🏥 การตรวจหลังคลอดตามนัด (Postpartum Visit):</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
                    <li>ไปตรวจหลังคลอดตามนัด (ปกติ 6 สัปดาห์ หรือเร็วกว่านั้นหากมีอาการ)</li>
                    <li>การตรวจช่วยค้นหาภาวะแทรกซ้อนที่ยังไม่แสดงอาการชัดเจน</li>
                    <li>ปรึกษาการคุมกำเนิดที่เหมาะสมสำหรับแม่ให้นมบุตร</li>
                    <li>ประเมินสุขภาพจิตและภาวะซึมเศร้าหลังคลอด</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveTab(3)}
                  style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ทำแบบประเมินความรู้ท้ายบท ➜
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: แบบประเมินความรู้ประจำห้องที่ 4 (ข้อ 1, 4 & 7) ── */}
          {activeTab === 3 && (
            <div>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#fce4ec', color: '#c2185b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
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
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#dc2626' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#fee2e2' : '#f9fafb'),
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
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#dc2626' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#fee2e2' : '#f9fafb'),
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
                            background: '#dc2626',
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
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ห้องที่ 4 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room4Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องเกี่ยวกับ 5 สัญญาณอันตรายหลังคลอด และพร้อมขอความช่วยเหลือทางการแพทย์ได้อย่างทันท่วงที
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
                      style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 'bold', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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
