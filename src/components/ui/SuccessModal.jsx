import React from 'react';
import useStore from '../../store/useStore';

export default function SuccessModal() {
  const setShowSuccessModal = useStore((s) => s.setShowSuccessModal);
  const successMessage = useStore((s) => s.successMessage);
  const setRoom = useStore((s) => s.setRoom);
  const completedCount = Object.keys(useStore((s) => s.learningProgress) || {}).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center animate-bounce-in">
        {/* Celebration emoji */}
        <div className="text-6xl mb-4">🎉</div>

        <h2 className="text-2xl font-bold text-green-700 mb-2">
          ยินดีด้วย!
        </h2>

        <p className="text-gray-700 mb-2">
          {successMessage || 'คุณเรียนรู้บทเรียนนี้สำเร็จแล้ว!'}
        </p>

        <p className="text-sm text-blue-600 mb-6">
          📚 ผ่านแล้ว {completedCount}/9 บทเรียน
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setShowSuccessModal(false);
              setRoom('lobby');
            }}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition shadow-lg"
          >
            🌐 กลับหน้าหลัก
          </button>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition"
          >
            ทบทวนอีกครั้ง
          </button>
        </div>
      </div>
    </div>
  );
}
