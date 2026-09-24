import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';

export default function QuizRoom() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
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
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f3e5f5" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 6, -15]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#ce93d8" />
      </mesh>
      <mesh position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#ce93d8" />
      </mesh>
      <mesh position={[15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#ce93d8" />
      </mesh>

      {/* Flash Effect Layer */}
      {flashColor && (
        <Html position={[0, 0, 0]} center fullscreen>
          <div style={{ width: '100vw', height: '100vh', backgroundColor: flashColor, pointerEvents: 'none', transition: 'background-color 0.2s' }} />
        </Html>
      )}

      {/* Desk */}
      <mesh position={[0, 2, -10]}>
        <boxGeometry args={[8, 4, 3]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>

      {/* Graduation Cap Display (Cone + Cylinder) */}
      <group position={[-6, 4.5, -12]}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[1.5, 1, 4]} />
          <meshStandardMaterial color="#212121" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="#212121" />
        </mesh>
      </group>

      {/* Bookshelf */}
      <mesh position={[8, 5, -13]}>
        <boxGeometry args={[4, 10, 2]} />
        <meshStandardMaterial color="#795548" />
      </mesh>

      {/* Computer Screen / Big Panel for Quiz */}
      <mesh position={[0, 5, -10.5]}>
        <boxGeometry args={[6, 4, 0.5]} />
        <meshStandardMaterial color="#424242" />
      </mesh>

      {/* Quiz UI */}
      <Html position={[0, 5, -10]} transform scale={0.5}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '600px', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          {!showResult ? (
            <>
              <h2 style={{ color: '#6a1b9a', marginBottom: '30px', textAlign: 'center', fontSize: '28px' }}>
                ข้อ {currentQuestion + 1}/10: {questions[currentQuestion].q}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' }}>
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{ padding: '20px', fontSize: '20px', background: '#e1bee7', color: '#4a148c', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.target.style.background = '#ce93d8'}
                    onMouseOut={(e) => e.target.style.background = '#e1bee7'}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: score >= 8 ? '#4caf50' : '#f44336', fontSize: '36px' }}>
                {score >= 8 ? 'ผ่านแบบทดสอบ!' : 'ยังไม่ผ่าน'}
              </h1>
              <h2 style={{ fontSize: '28px', margin: '20px 0' }}>คะแนนของคุณ: {score}/10</h2>
              {score < 8 && (
                <button 
                  onClick={restartQuiz}
                  style={{ padding: '15px 30px', fontSize: '22px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ลองอีกครั้ง
                </button>
              )}
            </div>
          )}
        </div>
      </Html>

      {/* Back Button */}
      <Html position={[-12, 10, -14]} center>
        <button 
          onClick={() => setRoom('lobby')}
          style={{ padding: '12px 24px', fontSize: '20px', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          กลับหน้าหลัก
        </button>
      </Html>

      {/* ── 3D Production Characters in Quiz Room ── */}
      <MotherAvatar position={[3.5, 0, -2]} rotation={[0, -0.6, 0]} currentAnimation="idle" />
    </group>
  );
}
