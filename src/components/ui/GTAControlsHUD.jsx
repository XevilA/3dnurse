import React from 'react';
import useStore from '../../store/useStore';

/**
 * GTAControlsHUD — On-screen GTA-style controller & key indicators
 *
 * Provides:
 *   1. Desktop keyboard guide (WASD + Shift)
 *   2. Mobile touch buttons (Forward, Backward, Left, Right, Sprint)
 *   3. GTA style stamina / sprint indicator
 */
export default function GTAControlsHUD() {
  const setVirtualInput = useStore((s) => s.setVirtualInput);
  const virtualInput = useStore((s) => s.virtualInput);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);
  const currentRoom = useStore((s) => s.currentRoom);
  const cameraMode = useStore((s) => s.cameraMode);
  const toggleCameraMode = useStore((s) => s.toggleCameraMode);

  const handleTouchStart = (key) => {
    setVirtualInput({ [key]: true });
  };

  const handleTouchEnd = (key) => {
    setVirtualInput({ [key]: false });
  };

  return (
    <div className="pointer-events-none select-none">
      {/* ── Camera Perspective Switcher (1st / 3rd Person Toggle) ── */}
      <div className="absolute top-20 right-4 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={toggleCameraMode}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs bg-black/80 hover:bg-black text-white border border-white/30 shadow-2xl backdrop-blur-md transition transform hover:scale-105 active:scale-95"
        >
          <span className="text-base">{cameraMode === '3rdPerson' ? '🎥' : '👁️'}</span>
          <span>{cameraMode === '3rdPerson' ? 'มุมมอง 3rd Person (กด V)' : 'มุมมอง 1st Person (กด V)'}</span>
        </button>
      </div>

      {/* ── Mother & Baby Bonding Floating Action Button (Only in Clinical Care Rooms) ── */}
      {currentRoom !== 'lobby' && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={() => setHoldingBaby(!isHoldingBaby)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm shadow-2xl border-2 transition transform hover:scale-105 active:scale-95 ${
              isHoldingBaby
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-white/90 shadow-emerald-500/40 ring-4 ring-emerald-300/30'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-white/90 shadow-pink-500/40 ring-4 ring-pink-300/30 animate-bounce'
            }`}
          >
            <span className="text-xl">{isHoldingBaby ? '🧸' : '🤱'}</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยในเปล / เตียง' : 'อุ้มลูกน้อยแนบอก / ดูดนม'}</span>
          </button>
        </div>
      )}

      {/* ── Desktop Controls Guide (Bottom Left) ── */}
      <div className="absolute bottom-12 left-4 z-20 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
              การควบคุมตัวละคร
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
            <span className="text-gray-200">เดินรอบห้อง</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-white/20 border border-white/30 rounded font-mono font-bold text-green-300">
              ⇧ Shift
            </kbd>
            <span className="text-gray-200">วิ่งเร็ว</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-cyan-500/30 border border-cyan-400 rounded font-mono font-bold text-cyan-200">
              V
            </kbd>
            <span className="text-cyan-200">สลับ 1st/3rd</span>
          </div>

          {currentRoom !== 'lobby' && (
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-pink-500/40 border border-pink-400 rounded font-mono font-bold text-pink-200">
                E
              </kbd>
              <span className="text-pink-200 font-medium">🤱 อุ้ม/วางลูก</span>
            </div>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
          <span>🎥 กล้องติดตามคุณแม่ 3rd Person</span>
          <span className="text-pink-300 font-medium">แม่ & ลูก</span>
        </div>
      </div>

      {/* ── Mobile / Touch Virtual Controller (Bottom Right) ── */}
      <div className="absolute bottom-12 right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5 md:hidden">
        {/* Mobile Action Buttons: Camera Mode, Hold Baby & Sprint */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCameraMode}
            className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-cyan-400 bg-cyan-600/90 text-white"
          >
            {cameraMode === '3rdPerson' ? '👁️ 1st P.' : '🎥 3rd P.'}
          </button>
          {currentRoom !== 'lobby' && (
            <button
              type="button"
              onClick={() => setHoldingBaby(!isHoldingBaby)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border transition ${
                isHoldingBaby
                  ? 'bg-emerald-600 text-white border-white'
                  : 'bg-pink-600 text-white border-white'
              }`}
            >
              {isHoldingBaby ? '🧸 วางลูก' : '🤱 อุ้มลูก'}
            </button>
          )}
          <button
            type="button"
            onMouseDown={() => handleTouchStart('sprint')}
            onMouseUp={() => handleTouchEnd('sprint')}
            onTouchStart={() => handleTouchStart('sprint')}
            onTouchEnd={() => handleTouchEnd('sprint')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg border transition ${
              virtualInput.sprint
                ? 'bg-yellow-500 text-black border-yellow-300 scale-95'
                : 'bg-black/70 text-yellow-300 border-yellow-400/40 backdrop-blur-sm'
            }`}
          >
            ⚡ วิ่งเร็ว
          </button>
        </div>

        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          <div />
          {/* UP / Forward */}
          <button
            type="button"
            onMouseDown={() => handleTouchStart('forward')}
            onMouseUp={() => handleTouchEnd('forward')}
            onTouchStart={() => handleTouchStart('forward')}
            onTouchEnd={() => handleTouchEnd('forward')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-lg font-bold text-white shadow transition ${
              virtualInput.forward ? 'bg-cyan-500 scale-95' : 'bg-white/20 active:bg-cyan-500'
            }`}
          >
            ▲
          </button>
          <div />

          {/* LEFT */}
          <button
            type="button"
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-lg font-bold text-white shadow transition ${
              virtualInput.left ? 'bg-cyan-500 scale-95' : 'bg-white/20 active:bg-cyan-500'
            }`}
          >
            ◀
          </button>

          {/* DOWN / Backward */}
          <button
            type="button"
            onMouseDown={() => handleTouchStart('backward')}
            onMouseUp={() => handleTouchEnd('backward')}
            onTouchStart={() => handleTouchStart('backward')}
            onTouchEnd={() => handleTouchEnd('backward')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-lg font-bold text-white shadow transition ${
              virtualInput.backward ? 'bg-cyan-500 scale-95' : 'bg-white/20 active:bg-cyan-500'
            }`}
          >
            ▼
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-lg font-bold text-white shadow transition ${
              virtualInput.right ? 'bg-cyan-500 scale-95' : 'bg-white/20 active:bg-cyan-500'
            }`}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
