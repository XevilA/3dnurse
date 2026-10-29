import React, { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, Stars, Html, useGLTF, useTexture } from '@react-three/drei';
import useStore from './store/useStore';
import HUD from './components/ui/HUD';
import WardModals from './components/ui/WardModals';
import SuccessModal from './components/ui/SuccessModal';
import GTAControlsHUD from './components/ui/GTAControlsHUD';
import ImageViewerModal from './components/ui/ImageViewerModal';
import RoomConfirmationModal from './components/ui/RoomConfirmationModal';
import DressingRoomOverlay from './components/ui/DressingRoomOverlay';

// ── Room scenes — lazy-loaded so each room's JS only downloads when first visited ──
// This is the #1 perf win: initial JS bundle shrinks dramatically
const LobbyRoom       = lazy(() => import('./components/scenes/LobbyRoom'));
const DressingRoom    = lazy(() => import('./components/scenes/DressingRoom'));
const MotherCare1Room = lazy(() => import('./components/scenes/MotherCare1Room'));
const MotherCare2Room = lazy(() => import('./components/scenes/MotherCare2Room'));
const MotherCare3Room = lazy(() => import('./components/scenes/MotherCare3Room'));
const MotherCare4Room = lazy(() => import('./components/scenes/MotherCare4Room'));
const NewbornCare1Room = lazy(() => import('./components/scenes/NewbornCare1Room'));
const NewbornCare2Room = lazy(() => import('./components/scenes/NewbornCare2Room'));
const NewbornCare3Room = lazy(() => import('./components/scenes/NewbornCare3Room'));
const NewbornCare4Room = lazy(() => import('./components/scenes/NewbornCare4Room'));
const QuizRoom        = lazy(() => import('./components/scenes/QuizRoom'));

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
  quiz: QuizRoom,
};

// ── Detect Mobile / iOS / Tablet once so WebGL stays well inside iOS Safari Jetsam memory limits ──
const IS_MOBILE_DEVICE =
  typeof navigator !== 'undefined' &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && typeof window !== 'undefined' && window.innerWidth < 1180));

// ── Preload ONLY the player avatar at startup.
//    All room-specific 3D models load on-demand via <Suspense> so mobile/iOS Safari
//    never decodes 25+ GLB texture sets into memory simultaneously. ──
useGLTF.preload('/models/megan_opt.glb');
useTexture.preload('/textures/floor_marble_lobby.jpg');

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
    console.error('🔴 Room render error caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room !== this.props.room && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error?.message || String(this.state.error);
      return (
        <group position={[0, 1.5, 0]}>
          <Html center>
            <div className="p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-rose-400 text-center max-w-sm pointer-events-auto">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-rose-700 font-bold text-base mb-1">เกิดข้อผิดพลาดในการโหลดห้อง</div>
              <p className="text-gray-600 text-xs mb-2">ระบบรักษาความปลอดภัยพร้อมพาท่านกลับสู่ล็อบบี้หลัก</p>
              {/* Debug: show actual error for diagnosis */}
              <p className="text-red-500 text-xs font-mono mb-3 break-all">{errMsg}</p>
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

/** Error boundary for UI overlays to prevent white screen if an overlay errors */
class GlobalUIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI overlay error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
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
    <div className="w-screen h-screen h-[100dvh] relative bg-slate-900 overflow-hidden select-none">
      {/* ── 3D Canvas (Isolated stacking context prevents Drei Html from escaping above UI) ── */}
      <div className="w-full h-full absolute inset-0 z-0 isolate">
        <Canvas
          shadows={!IS_MOBILE_DEVICE}
          dpr={IS_MOBILE_DEVICE ? [1, 1.35] : [1, 2]}
          gl={{
            antialias: !IS_MOBILE_DEVICE,
            powerPreference: IS_MOBILE_DEVICE ? 'default' : 'high-performance',
            // preserveDrawingBuffer removed — halves GPU memory bandwidth
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 3, 8], fov: 55 }}
          style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #f0fdf4 100%)', touchAction: 'none' }}
        >
          {/* Authentic Hospital Interior Lighting (Persistent so lights never unmount during room change) */}
          <ambientLight intensity={0.75} color="#ffffff" />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.1}
            castShadow={!IS_MOBILE_DEVICE}
            shadow-mapSize={[512, 512]}
            shadow-bias={-0.0001}
          />
          <hemisphereLight
            skyColor="#f0f9ff"
            groundColor="#e2e8f0"
            intensity={0.45}
          />
          <pointLight position={[-6, 6, -4]} intensity={0.35} color="#bae6fd" />
          <pointLight position={[6, 6, 4]} intensity={0.25} color="#fbcfe8" />

          {/* Subtle Metaverse Stars in Lobby (desktop only) */}
          {currentRoom === 'lobby' && !IS_MOBILE_DEVICE && <Stars radius={60} depth={25} count={250} factor={2} />}

          {/* Current Room Scene with Error Boundary & Smooth Hospital Transition Fallback */}
          <RoomErrorBoundary room={currentRoom} onReset={() => useStore.getState().setRoom('lobby')}>
            <Suspense fallback={<RoomLoadingFallback />}>
              <RoomComponent />
            </Suspense>
          </RoomErrorBoundary>
        </Canvas>
      </div>

      {/* ── UI Overlays (z-20 to z-50) ── */}
      <GlobalUIErrorBoundary>
        <HUD />
        <GTAControlsHUD />
        <WardModals />
        {showSuccessModal && <SuccessModal />}
        <RoomConfirmationModal />
        <ImageViewerModal />
        <DressingRoomOverlay />
      </GlobalUIErrorBoundary>

      {/* ── Visual Asset Loader ── */}
      <Loader
        dataInterpolation={(p) => `กำลังโหลดโมเดล 3D ${p.toFixed(0)}%`}
      />
    </div>
  );
}
