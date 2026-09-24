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

export default function NewbornCare5Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "การจัดเตียงนอนที่ปลอดภัย", desc: "ที่นอนต้องแน่น ไม่มีหมอน ผ้าห่ม หรือของเล่นนุ่มนิ่มในเปล และให้ทารกนอนหงายเสมอ" },
    { title: "อุณหภูมิห้องที่เหมาะสม", desc: "อุณหภูมิห้องควรอยู่ที่ 24-26°C ไม่ร้อนหรือหนาวเกินไป อากาศถ่ายเทสะดวก" },
    { title: "การป้องกันอุบัติเหตุ", desc: "ห้ามปล่อยทารกไว้ตามลำพังบนที่สูง เช่น เตียงผู้ใหญ่ หรือโต๊ะเปลี่ยนผ้าอ้อม" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare5');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการจัดสภาพแวดล้อมสำเร็จแล้ว');
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

      {/* Decorative Plant */}
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

      {/* 1. Crib (Step 0) */}
      <PulsingMesh position={[0, 2.5, -6]} active={step === 0} onClick={handleNext} color="#81d4fa">
        <boxGeometry args={[6, 5, 4]} />
      </PulsingMesh>

      {/* 2. Room Thermometer (Step 1) */}
      <PulsingMesh position={[-4, 7, -14.4]} active={step === 1} onClick={handleNext} color="#ffb74d">
        <cylinderGeometry args={[0.5, 0.5, 2]} />
      </PulsingMesh>

      {/* 3. Safety Gate / Item (Step 2) */}
      <PulsingMesh position={[6, 2.5, -10]} active={step === 2} onClick={handleNext} color="#a5d6a7">
        <boxGeometry args={[5, 5, 0.5]} />
      </PulsingMesh>

      {/* Educational Panel */}
      {step < stepsData.length && (
        <Html position={[0, 7.5, -4]} center>
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
      <PlayerController initialPosition={[2, 0, 1.5]} />
      <BabyAvatar position={[0, 1.45, -2]} rotation={[-1.57, 0, 0]} />
    </group>
  );
}
