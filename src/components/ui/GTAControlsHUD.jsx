import React, { useState, useRef, useEffect } from 'react';
import useStore from '../../store/useStore';

/**
 * Modern Touch Virtual Joystick Component
 * - Analog 360° locomotion + Directional (WASD) fallback
 * - Touch identifier tracking prevents multi-touch conflicts with camera drag
 * - Mouse fallback for responsive testing
 */
function VirtualJoystick() {
  const setVirtualInput = useStore((s) => s.setVirtualInput);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const touchIdRef = useRef(null);
  const containerRef = useRef(null);

  const maxRadius = 38; // Maximum px knob can travel from center

  const updatePosition = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;
    setKnobPos({ x: knobX, y: knobY });

    const normX = knobX / maxRadius;
    const normZ = knobY / maxRadius;

    setVirtualInput({
      vectorX: normX,
      vectorZ: normZ,
      forward: normZ < -0.25,
      backward: normZ > 0.25,
      left: normX < -0.25,
      right: normX > 0.25,
    });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchIdRef.current) {
        updatePosition(e.touches[i].clientX, e.touches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsActive(false);
        setKnobPos({ x: 0, y: 0 });
        setVirtualInput({
          vectorX: 0,
          vectorZ: 0,
          forward: false,
          backward: false,
          left: false,
          right: false,
        });
        break;
      }
    }
  };

  // Mouse emulation for desktop responsive testing
  const handleMouseDown = (e) => {
    setIsActive(true);
    updatePosition(e.clientX, e.clientY);

    const onMouseMove = (moveE) => {
      updatePosition(moveE.clientX, moveE.clientY);
    };

    const onMouseUp = () => {
      setIsActive(false);
      setKnobPos({ x: 0, y: 0 });
      setVirtualInput({
        vectorX: 0,
        vectorZ: 0,
        forward: false,
        backward: false,
        left: false,
        right: false,
      });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 transition-colors select-none touch-none cursor-pointer flex items-center justify-center shadow-2xl ${
        isActive
          ? 'bg-sky-950/70 border-cyan-400 shadow-cyan-500/30'
          : 'bg-black/55 backdrop-blur-md border-white/25 shadow-black/50'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Direction indicators */}
      <span className="absolute top-1 text-[11px] font-bold text-white/50 pointer-events-none">▲</span>
      <span className="absolute bottom-1 text-[11px] font-bold text-white/50 pointer-events-none">▼</span>
      <span className="absolute left-1.5 text-[11px] font-bold text-white/50 pointer-events-none">◀</span>
      <span className="absolute right-1.5 text-[11px] font-bold text-white/50 pointer-events-none">▶</span>

      {/* Center stick knob */}
      <div
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-black shadow-lg pointer-events-none transition-transform duration-75 ${
          isActive
            ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-white text-white scale-110 shadow-cyan-400/50'
            : 'bg-gradient-to-br from-slate-200 to-slate-400 border-white/80 text-slate-800'
        }`}
        style={{
          transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
        }}
      >
        <span>🕹️</span>
      </div>
    </div>
  );
}

/**
 * GTAControlsHUD — Gamified On-screen Controller & RPG Status Indicators
 *
 * Fully Responsive for Mobile, Tablet, and Desktop:
 *   1. Left Thumb: Modern Analog Virtual Joystick + Sprint Toggle
 *   2. Right Thumb: Action Cluster (Sit/Stand, Baby Hold/Release, Camera Toggle)
 *   3. Multi-touch decoupled from 360° camera orbit
 *   4. Responsive RPG Status Bar (Compact mobile pill vs full desktop card)
 *   5. Clean, unobstructed layout without awkward collisions
 */
export default function GTAControlsHUD() {
  const setVirtualInput = useStore((s) => s.setVirtualInput);
  const virtualInput = useStore((s) => s.virtualInput);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);
  const currentRoom = useStore((s) => s.currentRoom);
  const cameraMode = useStore((s) => s.cameraMode);
  const toggleCameraMode = useStore((s) => s.toggleCameraMode);

  // Gamified Seating & Stamina
  const isSitting = useStore((s) => s.isSitting);
  const seatedTarget = useStore((s) => s.seatedTarget);
  const nearbySeat = useStore((s) => s.nearbySeat);
  const sitDown = useStore((s) => s.sitDown);
  const standUp = useStore((s) => s.standUp);
  const stamina = useStore((s) => s.stamina);
  const hasCompletedPretest = useStore((s) => s.hasCompletedPretest);
  const playTimeSeconds = useStore((s) => s.playTimeSeconds);

  // Controls UI state & Device Mode Separation (PC vs Mobile)
  const [isSprintLocked, setIsSprintLocked] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  // Device detection: screen resolution (< 1024px) or primary touch pointer
  const [deviceMode, setDeviceMode] = useState(() => {
    if (typeof window === 'undefined') return 'pc';
    const isMobileRes = window.innerWidth < 1024;
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return isMobileRes || isTouch ? 'mobile' : 'pc';
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobileRes = window.innerWidth < 1024;
      const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      // Auto-update device mode based on viewport
      setDeviceMode(isMobileRes || isTouch ? 'mobile' : 'pc');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceMode === 'mobile';

  const handleSprintToggle = () => {
    const next = !isSprintLocked;
    setIsSprintLocked(next);
    setVirtualInput({ sprint: next });
  };

  const handleSitToggle = () => {
    if (isSitting) {
      standUp();
    } else if (nearbySeat) {
      sitDown(nearbySeat);
    }
  };

  if (currentRoom === 'dressingRoom' || currentRoom === 'quiz') {
    return null;
  }

  // Format playtime MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="pointer-events-none select-none">
      {/* ── RPG Status Bar: Maternal Wellness, Energy & Timer (Top Left) ── */}
      {/* Desktop view (>= 640px): Full Detailed Card */}
      <div className="hidden sm:block absolute top-16 left-4 z-20 pointer-events-auto bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl text-white min-w-[220px]">
        {/* Playtime Timer */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span>⏱️</span>
            <span>เวลาเล่น:</span>
          </span>
          {hasCompletedPretest ? (
            <span className="font-mono text-emerald-400 font-black tracking-wider text-[13px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse">
              {formatTime(playTimeSeconds)}
            </span>
          ) : (
            <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              เริ่มหลัง Pre-test
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
            <span>❤️</span>
            <span>สุขภาพคุณแม่</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-400">100%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-full w-full rounded-full shadow-sm" />
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
            <span>⚡</span>
            <span>พลังงาน (Stamina)</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-yellow-300">
            {hasCompletedPretest ? `${Math.round(stamina)}%` : '100% (ล็อค)'}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 shadow-sm ${
              isSitting
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300 animate-pulse'
                : 'bg-gradient-to-r from-yellow-500 to-amber-300'
            }`}
            style={{ width: `${hasCompletedPretest ? Math.max(5, Math.min(100, stamina)) : 100}%` }}
          />
        </div>

        {isSitting && (
          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[10px] text-emerald-300 font-bold animate-pulse">
            <span>✨</span>
            <span>กำลังพักผ่อนฟื้นฟูร่างกาย (+20%/วินาที)</span>
          </div>
        )}
      </div>

      {/* Mobile view (< 640px): Compact, Sleek Non-overlapping Pill */}
      <div className="sm:hidden absolute top-12 left-2 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsStatusExpanded(!isStatusExpanded)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-xl"
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 font-mono">
            <span>⏱️</span>
            <span>{hasCompletedPretest ? formatTime(playTimeSeconds) : '--:--'}</span>
          </div>
          <div className="h-2.5 w-px bg-white/30" />
          <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-300">
            <span>⚡</span>
            <span>{Math.round(stamina)}%</span>
          </div>
        </button>

        {isStatusExpanded && (
          <div className="mt-1.5 p-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white text-[10px] shadow-2xl max-w-[180px] animate-fadeIn space-y-1">
            <div className="text-cyan-300 font-bold">
              ⏱️ เวลาเล่น: {hasCompletedPretest ? formatTime(playTimeSeconds) : 'เริ่มหลัง Pre-test'}
            </div>
            <div className="text-pink-300 font-bold">❤️ สุขภาพคุณแม่: 100%</div>
            <div className="text-yellow-300 font-bold">⚡ พลังงาน: {Math.round(stamina)}%</div>
            {isSitting && <div className="text-emerald-300 font-bold">✨ ฟื้นฟูร่างกายขณะนั่งพัก</div>}
          </div>
        )}
      </div>

      {/* ── Desktop Camera Switcher (Top Right, Desktop only to avoid mobile overlap) ── */}
      <div className="hidden sm:block absolute top-16 right-4 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={toggleCameraMode}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs bg-black/80 hover:bg-black text-white border border-white/30 shadow-2xl backdrop-blur-md transition transform hover:scale-105 active:scale-95"
        >
          <span className="text-base">{cameraMode === '3rdPerson' ? '🎥' : '👁️'}</span>
          <span>{cameraMode === '3rdPerson' ? 'มุมมอง 3rd Person (กด V)' : 'มุมมอง 1st Person (กด V)'}</span>
        </button>
      </div>

      {/* ── Seated Wheelchair Driving / Rest Guidance (Center Screen) ── */}
      {isSitting && (
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-pulse max-w-[90vw] text-center">
          <span>{seatedTarget?.type === 'wheelchair' ? '♿' : '🛋️'}</span>
          <span>
            {seatedTarget?.isDrivable
              ? (isMobile
                  ? 'โหมดขับรถเข็น: ใช้จอยสติ๊กซ้ายเพื่อขับเคลื่อนรอบห้อง | แตะ [ลุกขึ้นยืน] เมื่อต้องการลุก'
                  : 'โหมดขับรถเข็น: กดปุ่ม [W A S D] เพื่อขับเคลื่อนรอบห้อง | กด [F] เพื่อลุกขึ้นยืน')
              : (isMobile
                  ? `กำลังนั่งพักบน ${seatedTarget?.name || 'เก้าอี้'} (ฟื้นฟูพลังงาน) | แตะ [ลุกขึ้นยืน] เมื่อต้องการลุก`
                  : `กำลังนั่งพักบน ${seatedTarget?.name || 'เก้าอี้'} (ฟื้นฟูพลังงาน) | กด [F] เพื่อลุกขึ้นยืน`)}
          </span>
        </div>
      )}

      {/* ── Dedicated Device Mode Switcher (PC vs Mobile Toggle) ── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs shadow-2xl">
        <button
          type="button"
          onClick={() => setDeviceMode('pc')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition text-[11px] flex items-center gap-1 cursor-pointer ${
            !isMobile
              ? 'bg-cyan-500 text-white shadow-md ring-1 ring-cyan-300'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>🖥️</span>
          <span>โหมด PC</span>
        </button>
        <div className="w-px h-3.5 bg-white/25" />
        <button
          type="button"
          onClick={() => setDeviceMode('mobile')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition text-[11px] flex items-center gap-1 cursor-pointer ${
            isMobile
              ? 'bg-pink-500 text-white shadow-md ring-1 ring-pink-300'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>📱</span>
          <span>โหมด มือถือ</span>
        </button>
        <div className="w-px h-3.5 bg-white/25" />
        <button
          type="button"
          onClick={() => setControlsVisible(!controlsVisible)}
          className="text-white/70 hover:text-white px-1.5 py-0.5 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
          title={controlsVisible ? 'ซ่อนปุ่มควบคุม' : 'แสดงปุ่มควบคุม'}
        >
          <span>{controlsVisible ? '👁️' : '🚫'}</span>
          <span className="hidden sm:inline">{controlsVisible ? 'ซ่อน' : 'แสดง'}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          📱 1. MOBILE ONLY CONTROLS (Only visible in Mobile resolution / Touch mode)
          ══════════════════════════════════════════════════════════════════════════ */}
      {isMobile && controlsVisible && (
        <>
          {/* ── Left Thumb Zone: Virtual Analog Joystick + Sprint Toggle ── */}
          <div className="absolute bottom-10 left-3 sm:left-6 z-30 pointer-events-auto flex flex-col items-center gap-2">
            {/* Quick Sprint Toggle */}
            <button
              type="button"
              onClick={handleSprintToggle}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shadow-lg border flex items-center gap-1 cursor-pointer active:scale-95 ${
                isSprintLocked
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black border-yellow-200 ring-2 ring-yellow-400/60 font-black'
                  : 'bg-black/70 backdrop-blur-md text-yellow-300 border-yellow-400/40'
              }`}
            >
              <span>⚡</span>
              <span>{isSprintLocked ? 'วิ่งเร็ว (ล็อค)' : 'วิ่งเร็ว'}</span>
            </button>

            {/* Virtual Thumbstick */}
            <VirtualJoystick />
          </div>

          {/* ── Right Thumb Zone: Action Button Cluster ── */}
          <div className="absolute bottom-10 right-3 sm:right-6 z-30 pointer-events-auto flex flex-col items-end gap-2.5">
            {/* Camera Perspective Toggle Button */}
            <button
              type="button"
              onClick={toggleCameraMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-cyan-400/50 bg-black/75 backdrop-blur-md text-cyan-200 hover:text-white active:scale-95 transition"
            >
              <span className="text-sm">{cameraMode === '3rdPerson' ? '👁️' : '🎥'}</span>
              <span>{cameraMode === '3rdPerson' ? '1st Person' : '3rd Person'}</span>
            </button>

            {/* Mother & Baby Action (Allow holding/cradling baby in any room except quiz) */}
            {currentRoom !== 'quiz' && (
              <button
                type="button"
                onClick={() => setHoldingBaby(!isHoldingBaby)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-2xl border-2 transition active:scale-95 ${
                  isHoldingBaby
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-white shadow-emerald-500/40 ring-2 ring-emerald-300/40'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-white shadow-pink-500/40 ring-2 ring-pink-300/40'
                }`}
              >
                <span className="text-base">{isHoldingBaby ? '🧸' : '🤱'}</span>
                <span>{isHoldingBaby ? 'วางลูกน้อยในเปล' : 'อุ้มลูกน้อยแนบอก'}</span>
              </button>
            )}

            {/* Interactive Sit / Stand Action Button */}
            {(nearbySeat || isSitting) && (
              <button
                type="button"
                onClick={handleSitToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-2xl border-2 transition active:scale-95 ${
                  isSitting
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-white ring-4 ring-orange-300/40 shadow-orange-500/40 animate-pulse'
                    : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-white ring-4 ring-sky-300/40 shadow-blue-500/40 animate-bounce'
                }`}
              >
                <span className="text-base">
                  {isSitting ? '🚶‍♀️' : nearbySeat?.type === 'wheelchair' ? '♿' : '🪑'}
                </span>
                <span>
                  {isSitting
                    ? 'ลุกขึ้นยืน (Stand)'
                    : `นั่ง${nearbySeat?.name || 'ที่นั่ง'}`}
                </span>
              </button>
            )}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          🖥️ 2. PC ONLY CONTROLS (Only visible in Desktop PC Mode - Zero Mobile Joystick)
          ══════════════════════════════════════════════════════════════════════════ */}
      {!isMobile && controlsVisible && (
        <>
          {/* ── Contextual Interactive Action Prompts for PC (Center-Bottom) ── */}
          {currentRoom !== 'quiz' && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-3">
              {/* PC Sit / Stand Action Prompt */}
              {(nearbySeat || isSitting) && (
                <button
                  type="button"
                  onClick={handleSitToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl border transition transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
                    isSitting
                      ? 'bg-amber-600/90 hover:bg-amber-600 text-white border-amber-300 ring-2 ring-amber-400/50'
                      : 'bg-blue-600/90 hover:bg-blue-600 text-white border-blue-300 ring-2 ring-blue-400/50 animate-bounce'
                  }`}
                >
                  <kbd className="px-2 py-0.5 bg-black/40 rounded font-mono font-black text-amber-200 border border-white/30 text-xs">
                    F
                  </kbd>
                  <span>
                    {isSitting
                      ? 'ลุกขึ้นยืน (กด F หรือคลิก)'
                      : `นั่ง${nearbySeat?.name || 'ที่นั่ง'} (กด F หรือคลิก)`}
                  </span>
                </button>
              )}

              {/* PC Hold / Release Baby Action Prompt */}
              <button
                type="button"
                onClick={() => setHoldingBaby(!isHoldingBaby)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl border transition transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
                  isHoldingBaby
                    ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white border-emerald-300'
                    : 'bg-pink-600/90 hover:bg-pink-600 text-white border-pink-300'
                }`}
              >
                <kbd className="px-2 py-0.5 bg-black/40 rounded font-mono font-black text-pink-200 border border-white/30 text-xs">
                  E / Space
                </kbd>
                <span>
                  {isHoldingBaby ? 'วางลูกน้อยในเปล' : 'อุ้มลูกน้อยแนบอก'}
                </span>
              </button>
            </div>
          )}

          {/* ── PC Keyboard & Mouse Guide Card (Bottom-Left) ── */}
          <div className="absolute bottom-10 left-4 z-20 pointer-events-auto bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white max-w-xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⌨️</span>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                  การควบคุมบนคอมพิวเตอร์ (PC)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/30 border border-cyan-400 text-cyan-200">
                {cameraMode === '1stPerson' ? '1st Person' : '3rd Person'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-white/20 border border-white/30 rounded font-mono font-bold text-yellow-300">
                  W A S D
                </kbd>
                <span className="text-gray-200">เดิน / ขับรถเข็น</span>
              </div>

              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-white/20 border border-white/30 rounded font-mono font-bold text-green-300">
                  ⇧ Shift
                </kbd>
                <span className="text-gray-200">วิ่งเร็ว</span>
              </div>

              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-blue-500/40 border border-blue-400 rounded font-mono font-bold text-blue-200">
                  F
                </kbd>
                <span className="text-blue-200 font-medium">นั่ง / ลุกขึ้น</span>
              </div>

              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-cyan-500/30 border border-cyan-400 rounded font-mono font-bold text-cyan-200">
                  V
                </kbd>
                <span className="text-cyan-200">สลับ 1st/3rd</span>
              </div>

              {currentRoom !== 'quiz' && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <kbd className="px-2 py-0.5 bg-pink-500/40 border border-pink-400 rounded font-mono font-bold text-pink-200">
                    E / Space
                  </kbd>
                  <span className="text-pink-200 font-medium">🤱 อุ้ม / วางลูกน้อย</span>
                </div>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
              <span className="flex items-center gap-1">
                <span>🖱️</span>
                <span>คลิกซ้ายลากหมุนมุมกล้อง 360°</span>
              </span>
              <span className="text-pink-300 font-medium text-[10px]">แม่ & ลูก</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
