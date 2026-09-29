import React, { useState } from 'react';
import useStore from '../../store/useStore';

const MOTHER_ROOMS = [
  { key: 'motherCare1', label: '1. ดูแลร่างกาย/ฟื้นตัว', icon: '🏥' },
  { key: 'motherCare2', label: '2. ดูแลแผลหลังคลอด', icon: '🩹' },
  { key: 'motherCare3', label: '3. ดูแลเต้านม', icon: '🤱' },
  { key: 'motherCare4', label: '4. สังเกตอาการผิดปกติ', icon: '🩺' },
];

const NEWBORN_ROOMS = [
  { key: 'newbornCare1', label: '1. การให้นมทารก', icon: '🍼' },
  { key: 'newbornCare2', label: '2. การอาบน้ำทารก', icon: '🛁' },
  { key: 'newbornCare3', label: '3. เปลี่ยนผ้าอ้อม', icon: '👶' },
  { key: 'newbornCare4', label: '4. ดูแลสายสะดือ', icon: '🔗' },
  { key: 'newbornCare5', label: '5. จัดสภาพแวดล้อม', icon: '🏠' },
];

export default function HUD() {
  const currentRoom = useStore((s) => s.currentRoom);
  const setRoom = useStore((s) => s.setRoom);
  const learningProgress = useStore((s) => s.learningProgress);
  const [showNav, setShowNav] = useState(false);

  const completedCount = Object.keys(learningProgress).length;
  const totalModules = 9;

  return (
    <>
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2"
        style={{ background: 'linear-gradient(180deg, rgba(173,216,255,0.95) 0%, rgba(173,216,255,0) 100%)' }}>

        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <div>
            <h1 className="text-sm font-bold text-blue-900 leading-tight">
              Postpartum & Newborn Care
            </h1>
            <p className="text-xs text-blue-700">Learning Metaverse</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-blue-800 shadow">
            📚 {completedCount}/{totalModules} บทเรียน
          </div>
          <button
            onClick={() => setShowNav(!showNav)}
            className="bg-white/90 hover:bg-white rounded-full px-3 py-1 text-xs font-bold text-blue-800 shadow cursor-pointer transition"
          >
            {showNav ? '✕ ปิด' : '☰ เมนู'}
          </button>
        </div>
      </div>

      {/* ── Lobby Quick Room Selector Bar (Always visible in Lobby) ── */}
      {currentRoom === 'lobby' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200 p-2.5 pointer-events-auto">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-base">🚪</span>
              <span className="text-xs font-bold text-blue-950">เลือกเข้าสู่ห้องเรียนรู้ (แตะเข้าห้องได้ทันที)</span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
              มีทั้งหมด 10 ห้องปฏิบัติการจริง
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 text-xs">
            {/* Mother Care Rooms */}
            {MOTHER_ROOMS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRoom(r.key)}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-pink-50/90 hover:bg-pink-100 border border-pink-200 text-pink-900 transition transform hover:scale-[1.02] active:scale-95 text-left font-medium shadow-sm cursor-pointer"
              >
                <span className="text-base flex-shrink-0">{r.icon}</span>
                <span className="truncate text-[11px]">{r.label}</span>
                {learningProgress[r.key] && <span className="ml-auto text-emerald-600 text-xs">✅</span>}
              </button>
            ))}

            {/* Newborn Care Rooms */}
            {NEWBORN_ROOMS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRoom(r.key)}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-blue-900 transition transform hover:scale-[1.02] active:scale-95 text-left font-medium shadow-sm cursor-pointer"
              >
                <span className="text-base flex-shrink-0">{r.icon}</span>
                <span className="truncate text-[11px]">{r.label}</span>
                {learningProgress[r.key] && <span className="ml-auto text-emerald-600 text-xs">✅</span>}
              </button>
            ))}

            {/* Quiz Room */}
            <button
              type="button"
              onClick={() => setRoom('quiz')}
              className="col-span-2 sm:col-span-3 md:col-span-5 lg:col-span-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold transition transform hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
            >
              <span className="text-base">🎓</span>
              <span className="text-[11px]">แบบทดสอบหลังเรียน</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Navigation Panel ── */}
      {showNav && (
        <div className="absolute top-12 right-2 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">

          {/* Lobby Button */}
          <button
            onClick={() => { setRoom('lobby'); setShowNav(false); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition border-b border-blue-50
              ${currentRoom === 'lobby' ? 'bg-blue-100 font-bold' : ''}`}
          >
            <span className="text-xl">🌐</span>
            <div>
              <div className="text-sm font-semibold text-blue-900">ห้องต้อนรับ</div>
              <div className="text-xs text-gray-500">แนะนำการใช้งาน Metaverse</div>
            </div>
          </button>

          {/* Mother Care Zone */}
          <div className="px-3 pt-3 pb-1">
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wide">
              💗 โซนดูแลตนเองของมารดา
            </div>
          </div>
          {MOTHER_ROOMS.map((room) => (
            <button
              key={room.key}
              onClick={() => { setRoom(room.key); setShowNav(false); }}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-pink-50 transition
                ${currentRoom === room.key ? 'bg-pink-100 font-bold' : ''}`}
            >
              <span className="text-lg">{room.icon}</span>
              <span className="text-sm text-gray-800">{room.label}</span>
              {learningProgress[room.key] && (
                <span className="ml-auto text-green-500 text-sm">✅</span>
              )}
            </button>
          ))}

          {/* Newborn Care Zone */}
          <div className="px-3 pt-3 pb-1 border-t border-blue-50">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">
              👶 โซนดูแลทารกแรกเกิด
            </div>
          </div>
          {NEWBORN_ROOMS.map((room) => (
            <button
              key={room.key}
              onClick={() => { setRoom(room.key); setShowNav(false); }}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-blue-50 transition
                ${currentRoom === room.key ? 'bg-blue-100 font-bold' : ''}`}
            >
              <span className="text-lg">{room.icon}</span>
              <span className="text-sm text-gray-800">{room.label}</span>
              {learningProgress[room.key] && (
                <span className="ml-auto text-green-500 text-sm">✅</span>
              )}
            </button>
          ))}

          {/* Quiz */}
          <button
            onClick={() => { setRoom('quiz'); setShowNav(false); }}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition border-t border-blue-100
              ${currentRoom === 'quiz' ? 'bg-purple-100 font-bold' : ''}`}
          >
            <span className="text-xl">🎓</span>
            <div>
              <div className="text-sm font-semibold text-purple-900">ห้องแบบทดสอบหลังเรียน</div>
              <div className="text-xs text-gray-500">ประเมินความรู้</div>
            </div>
          </button>
        </div>
      )}

      {/* ── Bottom motto ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-1.5 shadow text-center">
          <p className="text-xs text-pink-600 font-medium">
            ❤️ "แม่มั่นใจ...ลูกปลอดภัย...ครอบครัวอบอุ่น" ❤️
          </p>
        </div>
      </div>
    </>
  );
}
