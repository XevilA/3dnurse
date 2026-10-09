import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, Stars, Html, useGLTF, useTexture } from '@react-three/drei';
import useStore from './store/useStore';
import HUD from './components/ui/HUD';
import SuccessModal from './components/ui/SuccessModal';
import GTAControlsHUD from './components/ui/GTAControlsHUD';
import ImageViewerModal from './components/ui/ImageViewerModal';
import RoomConfirmationModal from './components/ui/RoomConfirmationModal';

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
import DressingRoom from './components/scenes/DressingRoom';

/** Maps room key → scene component */
const ROOM_MAP = {
  lobby: LobbyRoom,
  dressingRoom: DressingRoom,
  wardrobe: DressingRoom,
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

// ── Preload all 28 authentic 3D hospital models to prevent freeze/lag on room entrance ──
const ALL_MODELS = [
  '/models/megan_opt.glb',
  '/models/soldier.glb',
  '/models/baby_real.glb',
  '/models/ceiling_fan.glb',
  '/models/desk_lamp_arm_01.glb',
  '/models/drawer_cabinet.glb',
  '/models/flowers_vase.glb',
  '/models/hospital_bed_opt.glb',
  '/models/industrial_storage_cart.glb',
  '/models/kira.glb',
  '/models/medical_box.glb',
  '/models/medical_tape.glb',
  '/models/metal_office_desk.glb',
  '/models/metal_trash_can.glb',
  '/models/multi_cleaner_bottle.glb',
  '/models/nursing_chair.glb',
  '/models/plant_house.glb',
  '/models/potted_plant_01.glb',
  '/models/potted_plant_02.glb',
  '/models/side_table_01.glb',
  '/models/sofa_velvet.glb',
  '/models/steel_frame_shelves_01.glb',
  '/models/throw_pillows_01.glb',
  '/models/tree_small_02.glb',
  '/models/water_bottle.glb',
  '/models/wheelchair_01.glb',
  '/models/wicker_basket_01.glb',
  '/models/robot.glb',
];

ALL_MODELS.forEach((path) => {
  useGLTF.preload(path);
});

// ── Preload authentic hospital floor & door textures ──
const ALL_TEXTURES = [
  '/textures/floor_marble_lobby.jpg',
  '/textures/floor_vinyl_mother.jpg',
  '/textures/floor_vinyl_nursery.jpg',
  '/textures/floor_hall_quiz.jpg',
  '/textures/door_mother.jpg',
  '/textures/door_nursery.jpg',
  '/textures/door_quiz.jpg',
  '/textures/door_frame_metal.jpg',
  '/textures/mother_diffuse_pink.jpg',
  '/textures/mother_diffuse_blue.jpg',
  '/textures/mother_diffuse_lavender.jpg',
  '/textures/mother_diffuse_mint.jpg',
  '/textures/mother_diffuse_white.jpg',
  '/textures/mother_diffuse_peach.jpg',
];

ALL_TEXTURES.forEach((path) => {
  useTexture.preload(path);
});

/** Error boundary to prevent white-screen crashes and offer safe return to Lobby */
class RoomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Room render error caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room !== this.props.room && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <group position={[0, 1.5, 0]}>
          <Html center>
            <div className="p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-rose-400 text-center max-w-sm pointer-events-auto">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-rose-700 font-bold text-base mb-1">เกิดข้อผิดพลาดในการโหลดห้อง</div>
              <p className="text-gray-600 text-xs mb-4">ระบบรักษาความปลอดภัยพร้อมพาท่านกลับสู่ล็อบบี้หลัก</p>
              <button
                type="button"
                onClick={() => this.props.onReset()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition transform hover:scale-105 active:scale-95"
              >
                🏥 กลับสู่ห้องโถงหลัก (Lobby)
              </button>
            </div>
          </Html>
        </group>
      );
    }
    return this.props.children;
  }
}

/** Elegant 3D In-Scene Hospital Loading Indicator to avoid blank/white canvas */
function RoomLoadingFallback() {
  return (
    <group position={[0, 1.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <ringGeometry args={[1.2, 1.6, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
      <Html center>
        <div className="flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-blue-400 min-w-[280px] text-center select-none pointer-events-none">
          <div className="text-3xl mb-2 animate-bounce">🏥</div>
          <div className="text-blue-900 font-bold text-sm mb-1">กำลังจัดเตรียมห้องบริบาล...</div>
          <div className="text-blue-600 text-xs font-medium">กำลังโหลดแบบจำลอง 3D และเครื่องมือแพทย์</div>
          <div className="w-full bg-blue-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function App() {
  if (typeof window !== 'undefined') window.__useStore = useStore;
  const currentRoom = useStore((s) => s.currentRoom);
  const showSuccessModal = useStore((s) => s.showSuccessModal);
  const hasCompletedPretest = useStore((s) => s.hasCompletedPretest);
  const incrementPlayTime = useStore((s) => s.incrementPlayTime);
  const RoomComponent = ROOM_MAP[currentRoom] || LobbyRoom;

  // Active playtime timer starts only after Pre-test is completed
  React.useEffect(() => {
    if (!hasCompletedPretest) return;
    const interval = setInterval(() => {
      incrementPlayTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [hasCompletedPretest, incrementPlayTime]);

  return (
    <div className="w-screen h-screen relative bg-slate-900 overflow-hidden select-none">
      {/* ── 3D Canvas (Isolated stacking context prevents Drei Html from escaping above UI) ── */}
      <div className="w-full h-full absolute inset-0 z-0 isolate" style={{ touchAction: 'none' }}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 3, 8], fov: 55 }}
          style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #f0fdf4 100%)', touchAction: 'none' }}
        >
          {/* Authentic Hospital Interior Lighting (Persistent so lights never unmount during room change) */}
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

          {/* Current Room Scene with Error Boundary & Smooth Hospital Transition Fallback */}
          <RoomErrorBoundary room={currentRoom} onReset={() => useStore.getState().setRoom('lobby')}>
            <Suspense fallback={<RoomLoadingFallback />}>
              <RoomComponent />
            </Suspense>
          </RoomErrorBoundary>
        </Canvas>
      </div>

      {/* ── UI Overlays (z-20 to z-50) ── */}
      <HUD />
      <GTAControlsHUD />
      {showSuccessModal && <SuccessModal />}
      <RoomConfirmationModal />
      <ImageViewerModal />

      {/* ── Visual Asset Loader ── */}
      <Loader
        dataInterpolation={(p) => `กำลังโหลดโมเดล 3D ${p.toFixed(0)}%`}
      />
    </div>
  );
}
