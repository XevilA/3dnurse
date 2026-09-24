import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';

export default function MotherCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      completeModule('motherCare4');
      setShowSuccessModal(true, 'เสร็จสมบูรณ์! คุณได้เรียนรู้วิธีสังเกตอาการผิดปกติและป้องกันภาวะแทรกซ้อนแล้ว');
      setStep(step + 1);
    }
  };

  const PulseMesh = ({ position, args, color, onClick, active, shape = 'box' }) => {
    const meshRef = useRef();
    useFrame(({ clock }) => {
      if (active && meshRef.current) {
        meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 4) * 0.5;
      }
    });

    return (
      <mesh 
        ref={meshRef}
        position={position} 
        onClick={active ? onClick : undefined}
        onPointerOver={(e) => { if(active) document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { if(active) document.body.style.cursor = 'default'; }}
      >
        {shape === 'box' ? <boxGeometry args={args} /> : 
         shape === 'sphere' ? <sphereGeometry args={args} /> :
         <cylinderGeometry args={args} />}
        <meshStandardMaterial 
          color={color} 
          emissive={active ? '#ffff00' : '#000000'} 
          emissiveIntensity={0} 
        />
      </mesh>
    );
  };

  return (
    <group>
      {/* Floor & Walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#ffe6f2" />
      </mesh>
      <mesh position={[0, 4, -7.5]} receiveShadow>
        <boxGeometry args={[15, 8, 0.5]} />
        <meshStandardMaterial color="#ffcce6" />
      </mesh>

      <Html position={[-6, 7, -7]}>
        <button 
          onClick={() => setRoom('lobby')}
          style={{ padding: '10px 20px', background: '#ff3385', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          กลับหน้าหลัก
        </button>
      </Html>

      <Html position={[0, 6, -7]} center transform>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '500px' }}>
          <h2 style={{ color: '#ff3385', margin: 0 }}>บทเรียน: การสังเกตอาการผิดปกติและการป้องกันภาวะแทรกซ้อน</h2>
          <p style={{ color: '#666' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4</p>
        </div>
      </Html>

      {/* Step 0: Blood Pressure Monitor (Hemorrhage) */}
      <group position={[-3, 2, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.8, 0.5, 0.8]} 
          color="#ff4d4d" 
          active={step === 0}
          onClick={handleNextStep}
        />
        {step === 0 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#fff9e6', border: '2px solid #ffcc00', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc9900', margin: '0 0 10px 0' }}>1. การตกเลือดหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ระวังเลือดออกมากผิดปกติ ชุ่มผ้าอนามัย 1 แผ่นภายใน 1 ชม. หน้ามืด วิงเวียน คลิกที่เครื่องวัดความดันเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 1: Vital Signs Monitor (Preeclampsia) */}
      <group position={[3, 2, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1, 0.8, 0.5]} 
          color="#3399ff" 
          active={step === 1}
          onClick={handleNextStep}
        />
        {step === 1 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#e6ffe6', border: '2px solid #33cc33', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#2eb82e', margin: '0 0 10px 0' }}>2. ภาวะครรภ์เป็นพิษหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>สังเกตอาการปวดศีรษะรุนแรง ตาพร่ามัว จุกแน่นลิ้นปี่ และความดันโลหิตสูง คลิกที่จอภาพชีพจรเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 2: Thermometer (Infection) */}
      <group position={[-2, 1.5, 1]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.1, 0.8, 0.1]} 
          color="#ffcc00" 
          active={step === 2}
          onClick={handleNextStep}
          shape="cylinder"
        />
        {step === 2 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#ffcccc', border: '2px solid #ff3333', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc0000', margin: '0 0 10px 0' }}>3. การติดเชื้อหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>หากมีไข้สูงกว่า 38°C หนาวสั่น น้ำคาวปลามีกลิ่นเหม็น หรือแผลบวมแดง ให้รีบพบแพทย์ คลิกที่ปรอทวัดไข้เพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 3: Brain Model (Depression) */}
      <group position={[2, 1.5, 1]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.6]} 
          color="#cc99ff" 
          active={step === 3}
          onClick={handleNextStep}
          shape="sphere"
        />
        {step === 3 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#f2e6ff', border: '2px solid #9933ff', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#7300e6', margin: '0 0 10px 0' }}>4. ภาวะซึมเศร้าหลังคลอด</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>สังเกตอาการอารมณ์แปรปรวน ร้องไห้ไม่มีเหตุผล วิตกกังวลมากเกินไป ควรพูดคุยกับคนใกล้ชิด คลิกที่โมเดลสมองเพื่อสำเร็จบทเรียน</p>
            </div>
          </Html>
        )}
      </group>

      {/* Decorative Plants */}
      <group position={[6, 0, -6]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.3, 0.3, 1]} /><meshStandardMaterial color="#8c8c8c" /></mesh>
        <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.6]} /><meshStandardMaterial color="#33cc33" /></mesh>
      </group>

      {/* ── 3D Mother Avatar ── */}
      <MotherAvatar position={[1.5, 0, 0]} rotation={[0, -0.4, 0]} currentAnimation="idle" />
    </group>
  );
}
