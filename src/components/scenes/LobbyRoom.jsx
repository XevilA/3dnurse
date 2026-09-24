import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import BabyAvatar from '../avatars/BabyAvatar';
import PlayerController from '../player/PlayerController';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const learningProgress = useStore((state) => state.learningProgress);
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#f4f9ff" roughness={0.4} />
      </mesh>

      {/* Decorative Floor Pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 4.5, 32]} />
        <meshStandardMaterial color="#e1f0ff" roughness={0.3} />
      </mesh>

      {/* ── Walls ── */}
      <mesh position={[0, 4, -12]} receiveShadow>
        <boxGeometry args={[26, 8, 0.5]} />
        <meshStandardMaterial color="#ebf5fb" />
      </mesh>
      <mesh position={[-13, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[26, 8, 0.5]} />
        <meshStandardMaterial color="#ebf5fb" />
      </mesh>
      <mesh position={[13, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[26, 8, 0.5]} />
        <meshStandardMaterial color="#ebf5fb" />
      </mesh>

      {/* ── Welcome Banner (Top Center) ── */}
      <Html position={[0, 6.8, -11.5]} center transform>
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '16px 28px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0, 50, 100, 0.15)',
          border: '2px solid #b3e5fc',
          minWidth: '420px',
          userSelect: 'none'
        }}>
          <h1 style={{ color: '#d81b60', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
            🌸 ยินดีต้อนรับสู่โลกแห่งการเรียนรู้ เพื่อแม่และลูก 👶
          </h1>
          <h2 style={{ color: '#0288d1', margin: '6px 0 0 0', fontSize: '16px', fontWeight: '600' }}>
            สุขภาพดี เริ่มได้จากความรู้และการปฏิบัติจริง
          </h2>
          <p style={{ color: '#555', margin: '8px 0 0 0', fontSize: '13px', fontWeight: '500' }}>
            ❤️ "แม่มั่นใจ...ลูกปลอดภัย...ครอบครัวอบอุ่น"
          </p>
        </div>
      </Html>

      {/* ── Central Holographic Globe ── */}
      <mesh ref={globeRef} position={[0, 3.2, -1]}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshStandardMaterial
          color="#00b0ff"
          wireframe
          emissive="#00b0ff"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, 1.2, -1]}>
        <cylinderGeometry args={[1.8, 2.2, 0.6, 32]} />
        <meshStandardMaterial color="#81d4fa" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* ── Mother Care Zone Portal (Left Side - 4 ห้องจริง) ── */}
      <group position={[-7.5, 0, -6]}>
        {/* Portal Arch 3D */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[4.2, 6.2, 0.4]} />
          <meshStandardMaterial color="#fce4ec" roughness={0.3} />
        </mesh>
        <mesh position={[0, 3.5, 0.05]}>
          <boxGeometry args={[3.8, 5.8, 0.4]} />
          <meshStandardMaterial color="#f8bbd0" emissive="#ff80ab" emissiveIntensity={0.15} />
        </mesh>

        {/* Interactive Room Selection Panel */}
        <Html position={[0, 3.5, 0.3]} center transform>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(233, 30, 99, 0.2)',
            border: '2px solid #f48fb1',
            width: '270px',
            userSelect: 'none'
          }}>
            <div style={{
              background: '#e91e63',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              💗 โซนการดูแลตนเองของมารดา (4 ห้อง)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setRoom('motherCare1')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fce4ec',
                  border: '1px solid #f48fb1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#880e4f',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🏥 1.</span>
                <span>การดูแลร่างกายและการฟื้นตัว</span>
                {learningProgress['motherCare1'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('motherCare2')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fce4ec',
                  border: '1px solid #f48fb1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#880e4f',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🩹 2.</span>
                <span>การดูแลแผลหลังคลอด</span>
                {learningProgress['motherCare2'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('motherCare3')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fce4ec',
                  border: '1px solid #f48fb1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#880e4f',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🤱 3.</span>
                <span>การดูแลเต้านมและท่าให้นม</span>
                {learningProgress['motherCare3'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('motherCare4')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fce4ec',
                  border: '1px solid #f48fb1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#880e4f',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🩺 4.</span>
                <span>สังเกตอาการผิดปกติและแทรกซ้อน</span>
                {learningProgress['motherCare4'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ── Newborn Care Zone Portal (Right Side - 5 ห้องจริง ครบ 100%) ── */}
      <group position={[7.5, 0, -6]}>
        {/* Portal Arch 3D */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[4.2, 6.2, 0.4]} />
          <meshStandardMaterial color="#e1f5fe" roughness={0.3} />
        </mesh>
        <mesh position={[0, 3.5, 0.05]}>
          <boxGeometry args={[3.8, 5.8, 0.4]} />
          <meshStandardMaterial color="#b3e5fc" emissive="#03a9f4" emissiveIntensity={0.15} />
        </mesh>

        {/* Interactive Room Selection Panel */}
        <Html position={[0, 3.5, 0.3]} center transform>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(3, 169, 244, 0.2)',
            border: '2px solid #81d4fa',
            width: '270px',
            userSelect: 'none'
          }}>
            <div style={{
              background: '#0288d1',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              👶 โซนการดูแลทารกแรกเกิด (5 ห้อง)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <button
                onClick={() => setRoom('newbornCare1')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e1f5fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#01579b',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🍼 1.</span>
                <span>การให้นมทารก</span>
                {learningProgress['newbornCare1'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('newbornCare2')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e1f5fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#01579b',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🛁 2.</span>
                <span>การอาบน้ำทารก</span>
                {learningProgress['newbornCare2'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('newbornCare3')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e1f5fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#01579b',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>👶 3.</span>
                <span>การเปลี่ยนผ้าอ้อม</span>
                {learningProgress['newbornCare3'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('newbornCare4')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e1f5fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#01579b',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🔗 4.</span>
                <span>การดูแลสายสะดือ</span>
                {learningProgress['newbornCare4'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>

              <button
                onClick={() => setRoom('newbornCare5')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e1f5fe',
                  border: '1px solid #81d4fa',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#01579b',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🏠 5.</span>
                <span>การจัดสภาพแวดล้อมที่ปลอดภัย</span>
                {learningProgress['newbornCare5'] && <span style={{ marginLeft: 'auto' }}>✅</span>}
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ── Quiz Portal (Back Center) ── */}
      <group position={[0, 0, -11]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 3.5, 32]} />
          <meshStandardMaterial color="#ede7f6" roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.5, 0.05]}>
          <cylinderGeometry args={[1.3, 1.6, 3.2, 32]} />
          <meshStandardMaterial color="#d1c4e9" emissive="#7e57c2" emissiveIntensity={0.2} />
        </mesh>

        <Html position={[0, 2.5, 0.5]} center transform>
          <div
            onClick={() => setRoom('quiz')}
            style={{
              background: 'linear-gradient(135deg, #673ab7 0%, #512da8 100%)',
              color: 'white',
              padding: '14px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(103, 58, 183, 0.4)',
              cursor: 'pointer',
              userSelect: 'none',
              minWidth: '220px',
              border: '2px solid #b39ddb'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎓</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>ห้องแบบทดสอบหลังเรียน</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
              ประเมินความรู้ 10 ข้อ (เกณฑ์ผ่าน ≥ 80%)
            </p>
            <div style={{
              marginTop: '10px',
              background: 'white',
              color: '#512da8',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              เข้าทำแบบทดสอบ ➜
            </div>
          </div>
        </Html>
      </group>

      {/* ── Decorative Hospital Ambience ── */}
      <group position={[-11, 0, -10]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.5, 0.4, 1]} /><meshStandardMaterial color="#8c8c8c" /></mesh>
        <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.8]} /><meshStandardMaterial color="#4caf50" /></mesh>
      </group>
      <group position={[11, 0, -10]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.5, 0.4, 1]} /><meshStandardMaterial color="#8c8c8c" /></mesh>
        <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.8]} /><meshStandardMaterial color="#4caf50" /></mesh>
      </group>

      {/* ── 3D Baby in Welcome Bassinet ── */}
      <group position={[1.8, 0, 1.8]}>
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

      {/* ── GTA 3rd-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
