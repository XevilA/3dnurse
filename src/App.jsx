import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, Stars } from '@react-three/drei';
import useStore from './store/useStore';
import HUD from './components/ui/HUD';
import SuccessModal from './components/ui/SuccessModal';
import GTAControlsHUD from './components/ui/GTAControlsHUD';

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
        style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #f0fdf4 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Authentic Hospital Interior Lighting */}
          <ambientLight intensity={0.75} color="#ffffff" />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          <hemisphereLight
            skyColor="#f0f9ff"
            groundColor="#e2e8f0"
            intensity={0.45}
          />
          <pointLight position={[-6, 6, -4]} intensity={0.35} color="#bae6fd" />
          <pointLight position={[6, 6, 4]} intensity={0.25} color="#fbcfe8" />

          {/* Subtle Metaverse Stars in Lobby */}
          {currentRoom === 'lobby' && <Stars radius={60} depth={25} count={400} factor={2} />}

          {/* Current Room with Player Controller */}
          <RoomComponent />
        </Suspense>
      </Canvas>

      {/* ── UI Overlays ── */}
      <HUD />
      <GTAControlsHUD />
      {showSuccessModal && <SuccessModal />}

      {/* ── Loader ── */}
      <Loader />
    </div>
  );
}
