import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';
import PlayerController from '../player/PlayerController';

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

export default function NewbornCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "การเตรียมอุปกรณ์", desc: "เตรียมน้ำอุ่น 37-38°C สบู่อาบน้ำทารก ผ้าเช็ดตัว เสื้อผ้าสะอาด และผ้าอ้อม ให้พร้อมก่อนเริ่ม" },
    { title: "ขั้นตอนการอาบน้ำ", desc: "ประคองศีรษะและคอ เช็ดหน้าก่อน (ไม่ใช้สบู่) จากนั้นลูบสบู่และล้างตัวอย่างนุ่มนวล" },
    { title: "การเช็ดตัวและแต่งตัว", desc: "ซับตัวให้แห้ง (ไม่ถู) ทาครีม และรีบแต่งตัวเพื่อป้องกันทารกสูญเสียความร้อน" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare2');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการอาบน้ำทารกสำเร็จแล้ว');
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

      {/* Decorative Plant */}
      <group position={[12, 0, -12]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.8, 0.6, 2]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="#4caf50" />
        </mesh>
      </group>

      {/* 1. Supply Table (Step 0) */}
      <PulsingMesh position={[-6, 2.5, -8]} active={step === 0} onClick={handleNext} color="#ce93d8">
        <boxGeometry args={[4, 5, 3]} />
      </PulsingMesh>

      {/* 2. Bathtub / Oval Basin (Step 1) */}
      <PulsingMesh position={[0, 3, -6]} active={step === 1} onClick={handleNext} color="#81d4fa">
        <cylinderGeometry args={[2.5, 2, 1, 32]} />
      </PulsingMesh>

      {/* 3. Towel on Changing Table (Step 2) */}
      <PulsingMesh position={[6, 3, -8]} active={step === 2} onClick={handleNext} color="#a5d6a7">
        <boxGeometry args={[3, 0.5, 4]} />
      </PulsingMesh>
      {/* Changing Table Base */}
      <mesh position={[6, 1.5, -8]}>
        <boxGeometry args={[4, 3, 5]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>

      {/* Educational Panel */}
      {step < stepsData.length && (
        <Html position={[0, 6.5, -6]} center>
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

      {/* ── GTA-Style Player Character ── */}
      <PlayerController initialPosition={[1.5, 0, 1.5]} />
      <BabyAvatar position={[0, 1.3, -2]} rotation={[-0.3, 0, 0]} />
    </group>
  );
}
