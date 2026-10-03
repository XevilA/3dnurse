import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
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

import DoctorDesk from '../furniture/DoctorDesk';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function MotherCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();
  const [step, setStep] = useState(0);

  // Official Research Quiz State for Room 1 (Questions 5 & 6)
  const room1Questions = getQuestionsByRoomKey('motherCare1');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const currentQ = room1Questions[quizIndex] || room1Questions[0];

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      // Advance to step 4: Quiz Station
      setStep(4);
      setShowQuizModal(true);
    }
  };

  const handleQuizAnswer = (choice) => {
    if (quizShowFeedback) return;
    setQuizUserChoice(choice);
    setQuizShowFeedback(true);
    if (choice === currentQ.answer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room1Questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare1');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านแบบประเมินความรู้ประจำห้องที่ 1 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room1Questions.length} คะแนน)`
      );
    }
  };

  const restartRoomQuiz = () => {
    setQuizIndex(0);
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลมารดา: การดูแลร่างกายและการฟื้นตัว"
        roomNumber="Ward 101"
      />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{
          background: 'white',
          padding: '14px 24px',
          borderRadius: '16px',
          textAlign: 'center',
          minWidth: '420px',
          boxShadow: '0 8px 24px rgba(233,30,99,0.15)',
          border: '2px solid #f48fb1'
        }}>
          <h2 style={{ color: '#d81b60', margin: 0, fontSize: '20px' }}>🏥 บทเรียนที่ 1: การดูแลร่างกายและการฟื้นตัวหลังคลอด</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>
            ความก้าวหน้า: {quizFinished ? '5 / 5 (สำเร็จครบทุกฐานและแบบประเมินแล้ว ✅)' : `${Math.min(step + 1, 5)} / 5 ฐานการเรียนรู้ & แบบประเมิน`}
          </p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NATURE ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Authentic Medicine and Vitamin Cabinet */}
      <MedicineCabinet position={[7.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} withMedicalBox={true} />

      {/* Authentic Hospital Wheelchair for Mother Recovery Mobility (Drivable!) */}
      <InteractiveSeat
        id="ward101_wheelchair"
        name="รถเข็นผู้ป่วย Ward 101"
        type="wheelchair"
        position={[-7.2, 0, 1.5]}
        rotation={[0, Math.PI / 3, 0]}
        seatOffset={[0, 0.46, 0.05]}
        isDrivable={true}
      >
        <HospitalWheelchair position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.1} />
      </InteractiveSeat>

      {/* Sanitary Foot-pedal Waste Bin */}
      <HospitalTrashBin position={[6.0, 0, 2.8]} scale={0.85} />

      {/* Station 0: REAL Hospital Patient Bed with Soft Pillows (การพักผ่อนและการนอนหลับ) */}
      <InteractiveSeat
        id="room101_bed"
        name="เตียงพักฟื้นคุณแม่"
        type="bed"
        position={[-4, 0, -4]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.72, 0]}
      >
        <group onClick={step === 0 ? handleNextStep : undefined}>
          <HospitalBed position={[0, 0, 0]} />
          <Pillows position={[0.2, 0.95, -0.6]} rotation={[0, 0, 0]} scale={0.8} />
          {step === 0 && (
            <Html position={[0, 2.2, 0]} center distanceFactor={12}>
              <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
                <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>1. การพักผ่อนและการนอนหลับ</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>นอนหลับพักผ่อนให้เพียงพอ อย่างน้อย 8-10 ชม./วัน เมื่อลูกหลับ แม่ควรหลับพักตาม</p>
                <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเตียงเพื่อผ่าน ➜</div>
              </div>
            </Html>
          )}
        </group>
      </InteractiveSeat>

      {/* Newborn Bassinet right beside Mother's bed (แม่และลูกอยู่ร่วมกัน) */}
      <group position={[-1.7, 0, -4]} rotation={[0, -0.2, 0]} onClick={() => setHoldingBaby(!isHoldingBaby)}>
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

      {/* Station 1: REAL Hospital Nightstand with Hydration Water & Fresh Flowers (โภชนาการและน้ำดื่ม) */}
      <group position={[1.5, 0, -4]} onClick={step === 1 ? handleNextStep : undefined}>
        <HospitalNightstand position={[0, 0, 0]} scale={1.1}>
          <FlowerVase position={[0.15, 0.82, 0.1]} scale={0.7} />
          {/* Hydration Water Carafe */}
          <mesh position={[-0.15, 0.72, -0.05]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 24]} />
            <meshPhysicalMaterial color="#e0f7fa" transmission={0.9} roughness={0.05} />
          </mesh>
        </HospitalNightstand>
        {step === 1 && (
          <Html position={[0, 2.0, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>2. โภชนาการและน้ำดื่มบำรุงน้ำนม</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>รับประทานอาหารครบ 5 หมู่ ดื่มน้ำสะอาดวันละ 2.5-3 ลิตร เลี่ยงของหมักดองและแอลกอฮอล์</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกโต๊ะอาหารเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 2: REAL Maternal Rehabilitation Exercise Station (การบริหารอุ้งเชิงกราน Kegel) */}
      <group position={[-4, 0, 2]} onClick={step === 2 ? handleNextStep : undefined}>
        {/* Contoured High-Density Foam Exercise Mat with Beveled Edges */}
        <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.4, 0.07, 1.5]} />
          <meshStandardMaterial color="#ba68c8" roughness={0.6} />
        </mesh>
        {/* Real Support Pillows for Pelvic Elevation */}
        <Pillows position={[0, 0.12, -0.45]} scale={0.95} />
        {/* Real Rolled Mat at Head of Station */}
        <mesh position={[0, 0.14, 0.65]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.45, 24]} />
          <meshStandardMaterial color="#8e24aa" roughness={0.7} />
        </mesh>
        {/* Inflatable Fitness Gym Ball for Posture Alignment */}
        <mesh position={[-1.2, 0.38, 0.2]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#ce93d8" roughness={0.3} metalness={0.1} />
        </mesh>

        {step === 2 && (
          <Html position={[0, 1.6, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>3. การบริหารร่างกายหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>ขมิบช่องคลอด (Kegel Exercise) ช่วยฟื้นฟูกล้ามเนื้ออุ้งเชิงกราน ป้องกันมดลูกหย่อน</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกเบาะบริหารเพื่อผ่าน ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 3: REAL Porcelain Washbasin (สุขอนามัยและการอาบน้ำ) */}
      <group position={[4.5, 0, 2]} onClick={step === 3 ? handleNextStep : undefined}>
        <Washbasin position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        {step === 3 && (
          <Html position={[0, 2.2, 0]} center>
            <div style={{ background: '#ffffff', border: '2px solid #e91e63', padding: '16px', borderRadius: '14px', width: '280px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={handleNextStep}>
              <h3 style={{ color: '#e91e63', margin: '0 0 8px 0', fontSize: '16px' }}>4. สุขอนามัยและการอาบน้ำ</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>อาบน้ำฝักบัวทำความสะอาดร่างกาย แปรงฟัน ล้างมือให้สะอาดก่อนจับตัวลูกและก่อนให้นม</p>
              <div style={{ marginTop: '10px', background: '#e91e63', color: 'white', padding: '6px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>คลิกอ่างเพื่อไปทำแบบประเมินความรู้ท้ายบท ➜</div>
            </div>
          </Html>
        )}
      </group>

      {/* Station 4: REAL Doctor Consultation Desk & Quiz Kiosk (แบบประเมินความรู้ห้องที่ 1: ข้อ 5, 6) */}
      <group position={[4.5, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={0.9} />
        <FlowerVase position={[0.8, 0.72, 0.2]} scale={0.65} />

        {/* Interactive Indicator / Kiosk Button */}
        <Html position={[0, 1.4, 0]} center distanceFactor={14}>
          <div
            onClick={() => { setStep(4); setShowQuizModal(true); }}
            className="cursor-pointer select-none px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            style={{
              background: step === 4 ? '#e91e63' : (quizFinished ? '#10b981' : '#8b5cf6'),
              color: 'white',
              border: '2px solid white',
              whiteSpace: 'nowrap'
            }}
          >
            {quizFinished ? '✅ ผ่านแบบประเมินห้อง 1 แล้ว (คลิกทำซ้ำ)' : '📝 แบบประเมินความรู้ห้องที่ 1 (2 ข้อ)'}
          </div>
        </Html>

        {/* Interactive Room 1 Quiz Board */}
        {(step === 4 || showQuizModal) && (
          <Html position={[0, 2.3, 0]} center transform scale={0.38}>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '20px',
              width: '640px',
              minHeight: '380px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              border: '3px solid #e91e63',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#fce4ec', color: '#c2185b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      📋 แบบประเมินความรู้: {currentQ.room}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                      ข้อ {quizIndex + 1} / {room1Questions.length} | คะแนน: {quizScore}
                    </span>
                  </div>

                  <h3 style={{ color: '#222', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.45', margin: '0 0 16px 0' }}>
                    "{currentQ.question}"
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(true)}
                      style={{
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#e91e63' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#fce4ec' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === true ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ✓ ถูก (True)
                    </button>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(false)}
                      style={{
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#e91e63' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#fce4ec' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === false ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ✕ ผิด (False)
                    </button>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer('unsure')}
                      style={{
                        padding: '12px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizUserChoice === 'unsure' ? '#6b7280' : '#e5e7eb',
                        background: quizUserChoice === 'unsure' ? '#f3f4f6' : '#fafafa',
                        color: '#4b5563',
                        cursor: quizShowFeedback ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ？ ไม่แน่ใจ
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
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านแบบประเมินความรู้ห้องที่ 1 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room1Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องในการดูแลร่างกายและการฟื้นตัวหลังคลอดตามมาตรฐานงานวิจัย
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      onClick={restartRoomQuiz}
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
          </Html>
        )}
      </group>

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
