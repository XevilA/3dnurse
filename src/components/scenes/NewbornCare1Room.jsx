import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';

const PulsingMesh = ({ position, rotation, children, onClick, active, color }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (active && meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={position} rotation={rotation} onClick={active ? onClick : undefined}>
      <mesh ref={meshRef}>
        {children}
        <meshStandardMaterial 
          color={color} 
          emissive={active ? '#ffffbb' : '#000000'} 
          emissiveIntensity={active ? 0.6 : 0} 
        />
      </mesh>
      {active && (
        <Html position={[0, 2, 0]} center>
          <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            คลิกเพื่อเรียนรู้
          </div>
        </Html>
      )}
    </group>
  );
};

export default function NewbornCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "การเริ่มให้นมแม่ภายใน 1 ชั่วโมงหลังคลอด", desc: "ควรให้ทารกดูดนมแม่เร็วที่สุด เพื่อกระตุ้นการสร้างน้ำนมและให้เกิด Skin-to-skin contact" },
    { title: "ท่าอุ้มให้นมที่ถูกต้อง", desc: "มี 4 ท่าหลัก: ท่าอุ้มขวางตัก (Cradle), ท่าอุ้มขวางตักประยุกต์ (Cross-cradle), ท่าอุ้มลูกฟุตบอล (Football), ท่านอนตะแคง (Side-lying)" },
    { title: "การสังเกตการดูดนมที่ถูกต้อง", desc: "ทารกอ้าปากกว้าง อมลานนม คางชิดเต้านม และได้ยินเสียงกลืนนมเป็นจังหวะ" },
    { title: "ความถี่และระยะเวลาในการให้นม", desc: "ควรให้นมทุก 2-3 ชั่วโมง หรือ 8-12 ครั้งต่อวัน ครั้งละ 15-20 นาทีต่อข้าง" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare1');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการให้นมทารกสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e0f7fa" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 6, -15]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#b2ebf2" />
      </mesh>
      <mesh position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#b2ebf2" />
      </mesh>
      <mesh position={[15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 12, 1]} />
        <meshStandardMaterial color="#b2ebf2" />
      </mesh>

      {/* Decorative Plants */}
      <group position={[-12, 0, -12]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.8, 0.6, 2]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="#4caf50" />
        </mesh>
      </group>

      {/* Interactive Objects */}
      {/* 1. Clock (Step 0) */}
      <PulsingMesh position={[0, 8, -14.4]} active={step === 0} onClick={handleNext} color="#ffb74d">
        <cylinderGeometry args={[1.5, 1.5, 0.2]} rotation={[Math.PI / 2, 0, 0]} />
      </PulsingMesh>

      {/* 2. Nursing Chair (Step 1) */}
      <PulsingMesh position={[-4, 2, -7]} active={step === 1} onClick={handleNext} color="#f48fb1">
        <boxGeometry args={[4, 4, 4]} />
      </PulsingMesh>

      {/* 3. Baby Crib (Step 2) */}
      <PulsingMesh position={[5, 2.5, -7]} active={step === 2} onClick={handleNext} color="#81d4fa">
        <boxGeometry args={[5, 3, 3]} />
      </PulsingMesh>

      {/* 4. Notepad/Table (Step 3) */}
      <PulsingMesh position={[10, 3, -12]} active={step === 3} onClick={handleNext} color="#fff59d">
        <boxGeometry args={[3, 0.2, 2]} />
      </PulsingMesh>

      {/* Educational Panel */}
      {step < stepsData.length && (
        <Html position={[0, 5, -8]} center>
          <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0,0,0,0.3)', width: '350px', textAlign: 'center', borderTop: '5px solid #00acc1' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00838f', fontSize: '22px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: 0, fontSize: '18px', color: '#424242', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
          </div>
        </Html>
      )}

      {/* Back Button */}
      <Html position={[-12, 10, -14]} center>
        <button 
          onClick={() => setRoom('lobby')}
          style={{ padding: '12px 24px', fontSize: '20px', background: '#ef5350', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          กลับหน้าหลัก
        </button>
      </Html>

      {/* ── 3D Production Characters ── */}
      <MotherAvatar position={[-2, 0, -2]} rotation={[0, 0.5, 0]} currentAnimation="idle" />
      <BabyAvatar position={[2, 1.2, -2]} rotation={[-1.57, 0, 0]} />
    </group>
  );
}
