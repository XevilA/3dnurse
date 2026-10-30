import React, { useEffect } from 'react';
import useStore from '../../store/useStore';

/**
 * RoomConfirmationModal
 * Prompts user for confirmation before entering any room.
 * Addresses client request: "มีปุ่มยืนยันก่อนเข้าแต่ละห้อง"
 */
export default function RoomConfirmationModal() {
  const pendingRoomConfirmation = useStore((s) => s.pendingRoomConfirmation);
  const cancelRoomEntry = useStore((s) => s.cancelRoomEntry);
  const setRoom = useStore((s) => s.setRoom);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') cancelRoomEntry();
      if (e.key === 'Enter' && pendingRoomConfirmation) {
        setRoom(pendingRoomConfirmation.roomKey);
        cancelRoomEntry();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingRoomConfirmation, cancelRoomEntry, setRoom]);

  if (!pendingRoomConfirmation) return null;

  const { roomKey, roomTitle, roomNumber, icon } = pendingRoomConfirmation;

  const handleConfirm = () => {
    setRoom(roomKey);
    cancelRoomEntry();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-sm pointer-events-auto animate-fade-in"
      onClick={cancelRoomEntry}
    >
      <div
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full max-h-[calc(var(--app-h,100dvh)-2rem)] overflow-y-auto shadow-2xl border-2 border-sky-300 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-sky-500 to-indigo-500" />

        {/* Icon & Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border border-sky-200 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
          {icon || '🚪'}
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300 uppercase tracking-wider mb-2">
          {roomNumber || 'ยืนยันเข้าห้อง'}
        </span>

        <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
          {roomTitle || 'ต้องการเข้าสู่ห้องนี้หรือไม่?'}
        </h3>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          คุณกำลังจะก้าวเข้าสู่ห้องเรียนรู้เพื่อฝึกปฏิบัติและศึกษาเนื้อหา
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>✓</span>
            <span>ตกลง (เข้าห้อง)</span>
          </button>
          <button
            type="button"
            onClick={cancelRoomEntry}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            ยกเลิก (สำรวจต่อ)
          </button>
        </div>
      </div>
    </div>
  );
}
