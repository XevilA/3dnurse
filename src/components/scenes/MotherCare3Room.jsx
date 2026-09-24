import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';
import PlayerController from '../player/PlayerController';

export default function MotherCare3Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      completeModule('motherCare3');
      setShowSuccessModal(true, 'เก่งมาก! คุณได้เรียนรู้เรื่องการดูแลเต้านมและให้นมบุตรครบถ้วน');
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
        {shape === 'box' ? <boxGeometry args={args} /> : <cylinderGeometry args={args} />}
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
          <h2 style={{ color: '#ff3385', margin: 0 }}>บทเรียน: การดูแลเต้านม</h2>
          <p style={{ color: '#666' }}>ความก้าวหน้า: {Math.min(step + 1, 4)} / 4</p>
        </div>
      </Html>

      {/* Step 0: Warm Compress */}
      <group position={[-3, 1.5, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.8, 0.2, 0.8]} 
          color="#ffb366" 
          active={step === 0}
          onClick={handleNextStep}
        />
        {step === 0 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#fff9e6', border: '2px solid #ffcc00', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc9900', margin: '0 0 10px 0' }}>1. การเตรียมเต้านมก่อนให้นม</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ประคบเต้านมด้วยผ้าชุบน้ำอุ่น 3-5 นาที นวดคลึงเบาๆ เพื่อกระตุ้นการไหลของน้ำนม คลิกที่แผ่นประคบอุ่นเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 1: Nursing Chair */}
      <group position={[3, 1, -4]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1.5, 1.5, 1.5]} 
          color="#99ccff" 
          active={step === 1}
          onClick={handleNextStep}
        />
        {step === 1 && (
          <Html position={[0, 2, 0]} center>
            <div style={{ background: '#e6ffe6', border: '2px solid #33cc33', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#2eb82e', margin: '0 0 10px 0' }}>2. ท่าให้นมที่ถูกวิธี</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ลูกอมลานนมได้ลึก คางชิดเต้านม ท่าที่นิยม: Cradle hold, Football hold, Side-lying คลิกที่เก้าอี้ให้นมเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 2: Breast Pump */}
      <group position={[-2, 1.5, 1]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.5, 0.8, 0.5]} 
          color="#ff99ff" 
          active={step === 2}
          onClick={handleNextStep}
          shape="cylinder"
        />
        {step === 2 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#f2e6ff', border: '2px solid #9933ff', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#7300e6', margin: '0 0 10px 0' }}>3. การบีบน้ำนมด้วยมือ</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>วางนิ้วหัวแม่มือและนิ้วชี้เป็นรูปตัว C ห่างจากหัวนม 2-3 ซม. กดเข้าหาหน้าอกและบีบเข้าหากัน คลิกที่เครื่องปั๊มนมเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 3: Cold Pack */}
      <group position={[2, 1.5, 1]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[0.8, 0.2, 0.8]} 
          color="#99ffff" 
          active={step === 3}
          onClick={handleNextStep}
        />
        {step === 3 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#e6ffff', border: '2px solid #00cccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#009999', margin: '0 0 10px 0' }}>4. การแก้ปัญหาเต้านมคัดตึง</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ให้ลูกดูดบ่อยขึ้น หรือปั๊มนมออก หากปวดมากให้ประคบเย็นหลังการให้นม คลิกที่เจลเย็นเพื่อสำเร็จบทเรียน</p>
            </div>
          </Html>
        )}
      </group>

      {/* Decorative Plants */}
      <group position={[-6, 0, -6]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.3, 0.3, 1]} /><meshStandardMaterial color="#8c8c8c" /></mesh>
        <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.6]} /><meshStandardMaterial color="#33cc33" /></mesh>
      </group>

      {/* ── GTA-Style Player Character ── */}
      <PlayerController initialPosition={[0, 0, 2]} />

      {/* ── 3D Baby in Nursing Station ── */}
      <BabyAvatar position={[1.5, 0.85, 0]} rotation={[-0.3, 0.4, 0]} />
    </group>
  );
}
