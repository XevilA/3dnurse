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

const ROOM_TITLES = {
  lobby: 'Grand Hospital Lobby',
  motherCare1: '🏥 ดูแลร่างกายและฟื้นตัว (Ward 101)',
  motherCare2: '🩹 ดูแลแผลหลังคลอด (Ward 102)',
  motherCare3: '🤱 ดูแลเต้านมและการให้นม (Ward 103)',
  motherCare4: '🩺 สังเกตอาการผิดปกติ (Ward 104)',
  newbornCare1: '🍼 การให้นมทารกแรกเกิด (Nursery 201)',
  newbornCare2: '🛁 การอาบน้ำทารก (Nursery 202)',
  newbornCare3: '👶 เปลี่ยนผ้าอ้อม/ขับถ่าย (Nursery 203)',
  newbornCare4: '🔗 ดูแลสายสะดือ (Nursery 204)',
  newbornCare5: '🏠 จัดสภาพแวดล้อมปลอดภัย (Nursery 205)',
  quiz: '🎓 แบบทดสอบประเมินความรู้ (Hall 301)',
};

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
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2 pointer-events-auto"
        style={{ background: 'linear-gradient(180deg, rgba(173,216,255,0.95) 0%, rgba(173,216,255,0) 100%)' }}>

        {/* Left: Back button if inside a room, or App branding if in lobby */}
        <div className="flex items-center gap-2">
          {currentRoom !== 'lobby' ? (
            <button
              type="button"
              onClick={() => setRoom('lobby')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>⬅</span>
              <span className="hidden sm:inline">กลับล็อบบี้</span>
              <span className="sm:hidden">ล็อบบี้</span>
            </button>
          ) : (
            <span className="text-2xl">🏥</span>
          )}
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-blue-900 leading-tight">
              {ROOM_TITLES[currentRoom] || 'Postpartum & Newborn Care'}
            </h1>
            <p className="text-[10px] sm:text-xs text-blue-700">Learning Metaverse</p>
          </div>
        </div>

        {/* Center: Quick Room Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNav(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-sm">🚪</span>
            <span>เลือกห้องเรียนรู้ (10 ห้อง)</span>
          </button>
        </div>

        {/* Progress & Menu */}
        <div className="flex items-center gap-2">
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

      {/* ── Lobby Quick Floating Action Button (Only in Lobby, Non-intrusive) ── */}
      {currentRoom === 'lobby' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowNav(true)}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl border-2 border-white/90 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-lg">🚪</span>
            <span>เลือกเข้าห้องเรียนรู้ (10 ห้อง)</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">➜</span>
          </button>
        </div>
      )}

      {/* ── Room Selection Modal (Clean Centered Modal, Zero Clutter) ── */}
      {showNav && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={() => setShowNav(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏥</span>
                <div>
                  <h2 className="text-base font-bold text-blue-950">แผนผังห้องเรียนรู้ทั้งหมด</h2>
                  <p className="text-xs text-blue-700">เลือกห้องปฏิบัติการที่คุณต้องการเข้าเรียนรู้ได้ทันที</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNav(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Lobby Button */}
              <button
                type="button"
                onClick={() => { setRoom('lobby'); setShowNav(false); }}
                className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition border ${
                  currentRoom === 'lobby'
                    ? 'bg-blue-100 border-blue-300 font-bold text-blue-900'
                    : 'bg-gray-50 hover:bg-blue-50/70 border-gray-200 text-gray-800'
                }`}
              >
                <span className="text-2xl">🌐</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-blue-900">ห้องต้อนรับ (Metaverse Grand Lobby)</div>
                  <div className="text-xs text-gray-500">ศูนย์รวมการเรียนรู้ สำรวจห้องโถงโรงพยาบาลเสมือนจริง</div>
                </div>
                {currentRoom === 'lobby' && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">ห้องปัจจุบัน</span>}
              </button>

              {/* Mother Care Zone */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">💗</span>
                  <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                    โซนการดูแลตนเองของมารดา (4 ห้อง)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MOTHER_ROOMS.map((room) => (
                    <button
                      key={room.key}
                      type="button"
                      onClick={() => { setRoom(room.key); setShowNav(false); }}
                      className={`text-left p-3 rounded-xl flex items-center gap-3 border transition transform hover:scale-[1.02] active:scale-98 ${
                        currentRoom === room.key
                          ? 'bg-pink-100 border-pink-400 font-bold text-pink-900 shadow-sm'
                          : 'bg-pink-50/70 hover:bg-pink-100/80 border-pink-200 text-gray-800'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{room.icon}</span>
                      <span className="text-xs font-semibold">{room.label}</span>
                      {learningProgress[room.key] && (
                        <span className="ml-auto text-emerald-600 text-sm font-bold">✅</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newborn Care Zone */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">👶</span>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    โซนการดูแลทารกแรกเกิด (5 ห้อง)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NEWBORN_ROOMS.map((room) => (
                    <button
                      key={room.key}
                      type="button"
                      onClick={() => { setRoom(room.key); setShowNav(false); }}
                      className={`text-left p-3 rounded-xl flex items-center gap-3 border transition transform hover:scale-[1.02] active:scale-98 ${
                        currentRoom === room.key
                          ? 'bg-blue-100 border-blue-400 font-bold text-blue-900 shadow-sm'
                          : 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-200 text-gray-800'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{room.icon}</span>
                      <span className="text-xs font-semibold">{room.label}</span>
                      {learningProgress[room.key] && (
                        <span className="ml-auto text-emerald-600 text-sm font-bold">✅</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiz Room */}
              <div>
                <button
                  type="button"
                  onClick={() => { setRoom('quiz'); setShowNav(false); }}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center gap-3 border transition transform hover:scale-[1.01] active:scale-98 ${
                    currentRoom === 'quiz'
                      ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-indigo-700'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">🎓</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">ห้องแบบทดสอบหลังเรียน (Quiz)</div>
                    <div className="text-xs opacity-90">ประเมินความรู้หลังเรียน 10 ข้อ (เกณฑ์ผ่าน ≥ 80%)</div>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">เข้าทำแบบทดสอบ ➜</span>
                </button>
              </div>
            </div>
          </div>
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
