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

export default function NewbornCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "การทำความสะอาดสะดือ", desc: "ใช้คอตตอนบัดชุบแอลกอฮอล์ 70% เช็ดจากโคนสะดือวนออกไปด้านนอกอย่างเบามือ" },
    { title: "การดูแลให้แห้ง", desc: "พับขอบผ้าอ้อมให้ต่ำกว่าโคนสะดือเพื่อให้สะดือแห้ง และงดอาบน้ำแบบจุ่มตัวจนกว่าสะดือจะหลุด" },
    { title: "สัญญาณอันตราย", desc: "ระวังอาการบวมแดง มีหนอง มีกลิ่นเหม็น หรือเลือดออก หากพบควรพบแพทย์" },
    { title: "การหลุดของสายสะดือ", desc: "สายสะดือจะแห้งและหลุดไปเองภายใน 7-14 วัน ห้ามดึงหรือแกะเด็ดขาด" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare4');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการดูแลสายสะดือสำเร็จแล้ว');
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

      {/* Examination Table */}
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[6, 4, 3]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>

      {/* 1. Cotton Swabs & Alcohol (Step 0) */}
      <PulsingMesh position={[-2, 4.5, -6]} active={step === 0} onClick={handleNext} color="#81d4fa">
        <boxGeometry args={[1, 1, 1]} />
      </PulsingMesh>

      {/* 2. Diaper Area / Baby lower half placeholder (Step 1) */}
      <PulsingMesh position={[1, 4.2, -6]} active={step === 1} onClick={handleNext} color="#ffb74d">
        <cylinderGeometry args={[0.8, 0.8, 2]} rotation={[0, 0, Math.PI / 2]} />
      </PulsingMesh>

      {/* 3. Warning Sign (Step 2) */}
      <PulsingMesh position={[-5, 7, -14.4]} active={step === 2} onClick={handleNext} color="#ef5350">
        <boxGeometry args={[3, 3, 0.2]} />
      </PulsingMesh>

      {/* 4. Timeline Chart (Step 3) */}
      <PulsingMesh position={[5, 7, -14.4]} active={step === 3} onClick={handleNext} color="#ce93d8">
        <boxGeometry args={[4, 3, 0.2]} />
      </PulsingMesh>

      {/* Educational Panel */}
      {step < stepsData.length && (
        <Html position={[0, 7, -4]} center>
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
      <BabyAvatar position={[0, 1.45, -2]} rotation={[-1.57, 0, 0]} />
    </group>
  );
}
