import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f8ff" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 4, -10]} receiveShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#e6f7ff" />
      </mesh>
      <mesh position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#e6f7ff" />
      </mesh>
      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial color="#e6f7ff" />
      </mesh>

      {/* Welcome Sign */}
      <Html position={[0, 6, -9]} center transform>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#ff6699', margin: 0, fontSize: '24px' }}>ยินดีต้อนรับ สู่โลกแห่งการเรียนรู้ เพื่อแม่และลูก</h1>
          <h2 style={{ color: '#4da6ff', margin: '10px 0 0 0', fontSize: '18px' }}>สุขภาพดี เริ่มได้จากความรู้</h2>
          <p style={{ color: '#333', marginTop: '15px', fontWeight: 'bold' }}>แม่มั่นใจ...ลูกปลอดภัย...ครอบครัวอบอุ่น</p>
        </div>
      </Html>

      {/* Holographic Globe */}
      <mesh ref={globeRef} position={[0, 3, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#4da6ff" wireframe emissive="#4da6ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Mother Care Zone Portal (Left) */}
      <group position={[-6, 2, -8]}>
        <mesh 
          onClick={() => setRoom('motherCare1')}
          onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[3, 4, 0.5]} />
          <meshStandardMaterial color="#ff99cc" emissive="#ff99cc" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 2.5, 0]} center transform>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '200px', cursor: 'pointer' }} onClick={() => setRoom('motherCare1')}>
            <h3 style={{ color: '#ff3385', margin: 0 }}>โซนดูแลตนเองของมารดา (4 ห้อง)</h3>
            <ul style={{ color: '#333', fontSize: '12px', paddingLeft: '15px', textAlign: 'left', margin: '5px 0 0 0' }}>
              <li>ร่างกายและฟื้นตัว</li>
              <li>การดูแลแผล</li>
              <li>การดูแลเต้านม</li>
              <li>ป้องกันภาวะแทรกซ้อน</li>
            </ul>
          </div>
        </Html>
      </group>

      {/* Newborn Care Zone Portal (Right) */}
      <group position={[6, 2, -8]}>
        <mesh>
          <boxGeometry args={[3, 4, 0.5]} />
          <meshStandardMaterial color="#99ccff" emissive="#99ccff" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 2.5, 0]} center transform>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '200px' }}>
            <h3 style={{ color: '#0066cc', margin: 0 }}>โซนดูแลทารกแรกเกิด (5 ห้อง)</h3>
            <ul style={{ color: '#333', fontSize: '12px', paddingLeft: '15px', textAlign: 'left', margin: '5px 0 0 0' }}>
              <li>เร็วๆ นี้...</li>
            </ul>
          </div>
        </Html>
      </group>

      {/* Quiz Portal (Back) */}
      <group position={[0, 2, -9]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="#cc99ff" emissive="#cc99ff" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 1, 0]} center transform>
          <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            <h3 style={{ color: '#9933ff', margin: 0 }}>ห้องแบบทดสอบหลังเรียน</h3>
          </div>
        </Html>
      </group>

      {/* Decorative Plants */}
      <group position={[-8, 0, -8]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 1]} />
          <meshStandardMaterial color="#8c8c8c" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.8]} />
          <meshStandardMaterial color="#33cc33" />
        </mesh>
      </group>
      <group position={[8, 0, -8]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 1]} />
          <meshStandardMaterial color="#8c8c8c" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.8]} />
          <meshStandardMaterial color="#33cc33" />
        </mesh>
      </group>

      {/* ── 3D Production Characters in Lobby ── */}
      <group position={[-0.8, 0, 1.5]}>
        <MotherAvatar position={[0, 0, 0]} rotation={[0, 0.2, 0]} currentAnimation="idle" />
      </group>
      
      {/* Baby in Welcome Bassinet */}
      <group position={[1.2, 0, 1.5]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.8, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.45, 0.1, 24]} />
          <meshStandardMaterial color="#bbdefb" />
        </mesh>
        <BabyAvatar position={[0, 0.88, 0]} rotation={[-0.3, 0, 0]} />
      </group>
    </group>
  );
}
