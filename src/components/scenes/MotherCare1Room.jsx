import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';

export default function MotherCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      completeModule('motherCare1');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้เรื่องการดูแลร่างกายและการฟื้นตัวหลังคลอดจบแล้ว');
      setStep(step + 1);
    }
  };

  const PulseMesh = ({ position, args, color, onClick, active }) => {
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
        <boxGeometry args={args} />
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
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '400px' }}>
          <h2 style={{ color: '#ff3385', margin: 0 }}>บทเรียน: การดูแลร่างกายและการฟื้นตัวหลังคลอด</h2>
          <p style={{ color: '#666' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4</p>
        </div>
      </Html>

      {/* Step 0: Bed */}
      <group position={[-3, 1, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[2, 1, 4]} 
          color="#ffffff" 
          active={step === 0}
          onClick={handleNextStep}
        />
        {step === 0 && (
          <Html position={[0, 2, 0]} center>
            <div style={{ background: '#fff9e6', border: '2px solid #ffcc00', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc9900', margin: '0 0 10px 0' }}>1. การพักผ่อนอย่างเพียงพอ</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ควรนอนหลับพักผ่อน 8-10 ชั่วโมงต่อวัน และพยายามนอนพร้อมลูกเพื่อชดเชยการอดนอนตอนกลางคืน คลิกที่เตียงเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 1: Table / Food */}
      <group position={[3, 1.5, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[2, 0.2, 2]} 
          color="#cc9966" 
          active={step === 1}
          onClick={handleNextStep}
        />
        {step === 1 && (
          <Html position={[0, 2, 0]} center>
            <div style={{ background: '#e6ffe6', border: '2px solid #33cc33', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#2eb82e', margin: '0 0 10px 0' }}>2. การรับประทานอาหารที่มีประโยชน์</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>เน้นโปรตีน ธาตุเหล็ก แคลเซียม และวิตามิน เพื่อซ่อมแซมร่างกายและบำรุงน้ำนม คลิกที่โต๊ะอาหารเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 2: Exercise Mat */}
      <group position={[0, 0.1, 2]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[3, 0.1, 2]} 
          color="#3399ff" 
          active={step === 2}
          onClick={handleNextStep}
        />
        {step === 2 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#e6f2ff', border: '2px solid #3399ff', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#0073e6', margin: '0 0 10px 0' }}>3. การออกกำลังกายเบาๆ</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>เริ่มจากการเดิน ขมิบช่องคลอด (Kegel) และฝึกหายใจ เพื่อฟื้นฟูกล้ามเนื้อ คลิกที่เสื่อเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 3: Shower Area */}
      <group position={[5, 2, 2]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1, 4, 1]} 
          color="#b3ffff" 
          active={step === 3}
          onClick={handleNextStep}
        />
        {step === 3 && (
          <Html position={[0, 2, 0]} center>
            <div style={{ background: '#f2e6ff', border: '2px solid #9933ff', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#7300e6', margin: '0 0 10px 0' }}>4. การดูแลสุขอนามัย</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>อาบน้ำทำความสะอาดร่างกายและดูแลสุขภาพช่องปากอย่างสม่ำเสมอ คลิกที่ฝักบัวเพื่อสำเร็จบทเรียน</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Decorative Plants */}
      <group position={[-6, 0, -6]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.3, 0.3, 1]} /><meshStandardMaterial color="#8c8c8c" /></mesh>
        <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.6]} /><meshStandardMaterial color="#33cc33" /></mesh>
      </group>

      {/* ── 3D Mother Avatar ── */}
      <MotherAvatar position={[1.5, 0, 0]} rotation={[0, -0.4, 0]} currentAnimation="idle" />
    </group>
  );
}
