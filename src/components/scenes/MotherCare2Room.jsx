import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';

export default function MotherCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal } = useStore();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      completeModule('motherCare2');
      setShowSuccessModal(true, 'ยอดเยี่ยม! คุณเรียนรู้เรื่องการดูแลแผลหลังคลอดเรียบร้อยแล้ว');
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
          <h2 style={{ color: '#ff3385', margin: 0 }}>บทเรียน: การดูแลแผลหลังคลอด</h2>
          <p style={{ color: '#666' }}>ความก้าวหน้า: {Math.min(step + 1, 3)} / 3</p>
        </div>
      </Html>

      {/* Step 0: Wound Care Kit (Perineal) */}
      <group position={[-3, 1.5, -3]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1, 0.5, 1]} 
          color="#ffb3b3" 
          active={step === 0}
          onClick={handleNextStep}
        />
        {step === 0 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#fff9e6', border: '2px solid #ffcc00', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc9900', margin: '0 0 10px 0' }}>1. การดูแลแผลฝีเย็บ</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ทำความสะอาดด้วยน้ำอุ่น จากหน้าไปหลัง ซับให้แห้ง ไม่สวนล้างช่องคลอด คลิกที่ชุดดูแลแผลเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 1: Surgical Supplies (C-section) */}
      <group position={[3, 1.5, -3]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1.5, 0.3, 1]} 
          color="#b3d9ff" 
          active={step === 1}
          onClick={handleNextStep}
        />
        {step === 1 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#e6ffe6', border: '2px solid #33cc33', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#2eb82e', margin: '0 0 10px 0' }}>2. การดูแลแผลผ่าตัดคลอด</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ระวังไม่ให้แผลโดนน้ำในช่วงแรก งดยกของหนัก และใส่ผ้ารัดหน้าท้องเพื่อลดความเจ็บปวด คลิกที่ชุดทำแผลผ่าตัดเพื่อไปต่อ</p>
            </div>
          </Html>
        )}
      </group>

      {/* Step 2: Warning Sign */}
      <group position={[0, 2, 2]}>
        <PulseMesh 
          position={[0, 0, 0]} 
          args={[1, 0.1, 1, 32]} 
          color="#ff6666" 
          active={step === 2}
          onClick={handleNextStep}
          shape="cylinder"
        />
        {step === 2 && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ background: '#ffcccc', border: '2px solid #ff3333', padding: '15px', borderRadius: '8px', width: '250px' }}>
              <h3 style={{ color: '#cc0000', margin: '0 0 10px 0' }}>3. สัญญาณอันตรายของแผล</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>หากพบอาการ บวม แดง ร้อน มีไข้ หรือมีหนอง/กลิ่นเหม็น ควรพบแพทย์ทันที คลิกลูกศรเตือนเพื่อสำเร็จบทเรียน</p>
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
