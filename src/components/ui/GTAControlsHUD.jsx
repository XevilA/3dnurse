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

  const handleTouchStart = (key) => {
    setVirtualInput({ [key]: true });
  };

  const handleTouchEnd = (key) => {
    setVirtualInput({ [key]: false });
  };

  return (
    <div className="pointer-events-none select-none">
      {/* ── Desktop Controls Guide (Bottom Left) ── */}
      <div className="absolute bottom-12 left-4 z-20 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎮</span>
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            GTA Player Controls
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
            <span className="text-gray-200">วิ่งเร็ว (Sprint)</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
          <span>🎥 กล้องติดตามตัวละครอัตโนมัติ</span>
          <span className="text-cyan-300 font-medium">3rd Person</span>
        </div>
      </div>

      {/* ── Mobile / Touch Virtual Controller (Bottom Right) ── */}
      <div className="absolute bottom-12 right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5 md:hidden">
        {/* Sprint Button */}
        <button
          type="button"
          onMouseDown={() => handleTouchStart('sprint')}
          onMouseUp={() => handleTouchEnd('sprint')}
          onTouchStart={() => handleTouchStart('sprint')}
          onTouchEnd={() => handleTouchEnd('sprint')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg border transition ${
            virtualInput.sprint
              ? 'bg-yellow-500 text-black border-yellow-300 scale-95'
              : 'bg-black/70 text-yellow-300 border-yellow-400/40 backdrop-blur-sm'
          }`}
        >
          ⚡ วิ่งเร็ว (Sprint)
        </button>

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
