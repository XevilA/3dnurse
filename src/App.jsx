import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Loader, Stars } from '@react-three/drei';
import useStore from './store/useStore';
import HUD from './components/ui/HUD';
import SuccessModal from './components/ui/SuccessModal';

// ── Room scenes ──
import LobbyRoom from './components/scenes/LobbyRoom';
import MotherCare1Room from './components/scenes/MotherCare1Room';
import MotherCare2Room from './components/scenes/MotherCare2Room';
import MotherCare3Room from './components/scenes/MotherCare3Room';
import MotherCare4Room from './components/scenes/MotherCare4Room';
import NewbornCare1Room from './components/scenes/NewbornCare1Room';
import NewbornCare2Room from './components/scenes/NewbornCare2Room';
import NewbornCare3Room from './components/scenes/NewbornCare3Room';
import NewbornCare4Room from './components/scenes/NewbornCare4Room';
import NewbornCare5Room from './components/scenes/NewbornCare5Room';
import QuizRoom from './components/scenes/QuizRoom';

/** Maps room key → scene component */
const ROOM_MAP = {
  lobby: LobbyRoom,
  motherCare1: MotherCare1Room,
  motherCare2: MotherCare2Room,
  motherCare3: MotherCare3Room,
  motherCare4: MotherCare4Room,
  newbornCare1: NewbornCare1Room,
  newbornCare2: NewbornCare2Room,
  newbornCare3: NewbornCare3Room,
  newbornCare4: NewbornCare4Room,
  newbornCare5: NewbornCare5Room,
  quiz: QuizRoom,
};

export default function App() {
  const currentRoom = useStore((s) => s.currentRoom);
  const showSuccessModal = useStore((s) => s.showSuccessModal);
  const RoomComponent = ROOM_MAP[currentRoom] || LobbyRoom;

  return (
    <div className="w-screen h-screen relative">
      {/* ── 3D Canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 55 }}
        style={{ background: 'linear-gradient(180deg, #e0f0ff 0%, #f8fcff 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.3} color="#b0d4ff" />

          {/* Environment */}
          <Environment preset="apartment" />

          {/* Stars for metaverse feel */}
          {currentRoom === 'lobby' && <Stars radius={50} depth={20} count={500} factor={2} />}

          {/* Current Room */}
          <RoomComponent />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>

      {/* ── UI Overlays ── */}
      <HUD />
      {showSuccessModal && <SuccessModal />}

      {/* ── Loader ── */}
      <Loader />
    </div>
  );
}
