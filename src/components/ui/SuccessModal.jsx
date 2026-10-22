import React from 'react';
import useStore from '../../store/useStore';

export default function SuccessModal() {
  const setShowSuccessModal = useStore((s) => s.setShowSuccessModal);
  const successMessage = useStore((s) => s.successMessage);
  const setRoom = useStore((s) => s.setRoom);
  const completedCount = Object.keys(useStore((s) => s.learningProgress) || {}).length;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-bounce-in border-4 border-emerald-400">
        {/* Celebration emoji */}
        <div className="text-6xl mb-4">🎉</div>

        <h2 className="text-2xl font-bold text-green-700 mb-2">
          ยินดีด้วย!
        </h2>

        <p className="text-gray-700 mb-2">
          {successMessage || 'คุณเรียนรู้บทเรียนนี้สำเร็จแล้ว!'}
        </p>

        <p className="text-sm text-blue-600 font-semibold mb-6">
          📚 ผ่านแล้ว {completedCount} บทเรียน
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition shadow-lg cursor-pointer"
          >
            🚶 อยู่ในห้อง 3D ต่อ (เดินสำรวจ)
          </button>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              setRoom('lobby');
            }}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold transition cursor-pointer"
          >
            🏥 กลับสู่โถงล็อบบี้
          </button>
        </div>
      </div>
    </div>
  );
}
