import React, { useState } from 'react';
import useStore from '../../store/useStore';

const MOTHER_ROOMS = [
  { key: 'motherCare1', label: '1. ดูแลร่างกาย/ฟื้นตัว', icon: '🏥' },
  { key: 'motherCare2', label: '2. ดูแลแผลหลังคลอด', icon: '🩹' },
  { key: 'motherCare3', label: '3. ดูแลเต้านม', icon: '🤱' },
  { key: 'motherCare4', label: '4. สังเกตอาการผิดปกติ', icon: '🩺' },
];

const NEWBORN_ROOMS = [
  { key: 'newbornCare1', label: '1. การให้นมและการอุ้มจัดท่า (201)', icon: '🍼' },
  { key: 'newbornCare2', label: '2. การอาบน้ำและเปลี่ยนผ้าอ้อม (202)', icon: '🛁' },
  { key: 'newbornCare3', label: '3. การดูแลสายสะดือทารก (203)', icon: '🔗' },
  { key: 'newbornCare4', label: '4. สภาพแวดล้อมที่ปลอดภัย (204)', icon: '🏠' },
];

const ROOM_TITLES = {
  lobby: 'Grand Hospital Lobby (ห้องต้อนรับ)',
  dressingRoom: '👗 ห้องแต่งตัว & ปรับแต่งตัวละคร (Suite 001)',
  motherCare1: '🏥 ดูแลร่างกายและฟื้นตัว (Ward 101)',
  motherCare2: '🩹 ดูแลแผลหลังคลอด (Ward 102)',
  motherCare3: '🤱 ดูแลเต้านม',
  motherCare4: '🩺 สังเกตอาการผิดปกติ',
  newbornCare1: '🍼 การให้นมและการอุ้มจัดท่า (Nursery 201)',
  newbornCare2: '🛁 การอาบน้ำและเปลี่ยนผ้าอ้อม (Nursery 202)',
  newbornCare3: '🔗 การดูแลสายสะดือทารก (Nursery 203)',
  newbornCare4: '🏠 สภาพแวดล้อมที่ปลอดภัย (Nursery 204)',
  quiz: '🎓 แบบทดสอบประเมินความรู้ (Hall 301)',
};

export default function HUD() {
  const currentRoom = useStore((s) => s.currentRoom);
  const setRoom = useStore((s) => s.setRoom);
  const learningProgress = useStore((s) => s.learningProgress);
  const hasCompletedPretest = useStore((s) => s.hasCompletedPretest);
  const pretestScore = useStore((s) => s.pretestScore);
  const showPretestWarning = useStore((s) => s.showPretestWarning);
  const triggerPretestWarning = useStore((s) => s.triggerPretestWarning);
  const dismissPretestWarning = useStore((s) => s.dismissPretestWarning);
  const requestRoomEntry = useStore((s) => s.requestRoomEntry);
  const userId = useStore((s) => s.userId);
  const unlockAllRooms = useStore((s) => s.unlockAllRooms);
  const [showNav, setShowNav] = useState(false);

  const completedCount = Object.keys(learningProgress).length;
  const totalModules = 8;

  const handleSelectRoom = (roomKey, roomTitle, roomNumber, icon) => {
    if (roomKey !== 'lobby' && roomKey !== 'dressingRoom' && roomKey !== 'quiz' && !hasCompletedPretest) {
      triggerPretestWarning(roomKey);
      setShowNav(false);
      return;
    }
    setShowNav(false);
    requestRoomEntry({
      roomKey,
      roomTitle: roomTitle || ROOM_TITLES[roomKey] || roomKey,
      roomNumber: roomNumber || 'Ward / Nursery',
      icon: icon || '🚪',
    });
  };

  return (
    <>
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 pointer-events-auto"
        style={{
          paddingTop: 'max(0.375rem, env(safe-area-inset-top, 0px))',
          background: 'linear-gradient(180deg, rgba(173,216,255,0.95) 0%, rgba(173,216,255,0) 100%)',
        }}>

        {/* Left: Back button if inside a room, or App branding if in lobby */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 md:flex-initial mr-1.5">
          {currentRoom !== 'lobby' ? (
            <button
              type="button"
              onClick={() => setRoom('lobby')}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] sm:text-xs shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>⬅</span>
              <span className="hidden sm:inline">กลับล็อบบี้</span>
              <span className="sm:hidden">ล็อบบี้</span>
            </button>
          ) : (
            <span className="text-xl sm:text-2xl shrink-0">🏥</span>
          )}
          <div className="min-w-0 bg-white/88 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none px-2.5 py-1 sm:p-0 rounded-full sm:rounded-none shadow-sm sm:shadow-none">
            <h1 className="text-[11px] sm:text-sm font-bold text-blue-950 sm:text-blue-900 leading-tight truncate">
              {ROOM_TITLES[currentRoom] || 'Postpartum & Newborn Care'}
            </h1>
            <p className="text-[9px] sm:text-xs text-blue-700 hidden sm:block">Learning Metaverse</p>
          </div>
        </div>

        {/* Center: Desktop Quick Room Trigger Button */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNav(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-sm">🚪</span>
            <span>เลือกห้องเรียนรู้ (10 ห้อง)</span>
            {!hasCompletedPretest && <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-black">Pre-test ก่อน</span>}
          </button>
        </div>

        {/* Right: Wardrobe Button (hidden when already inside dressingRoom) + Progress & Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {currentRoom !== 'dressingRoom' && (
            <button
              type="button"
              onClick={() => setRoom('dressingRoom')}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full font-bold text-[11px] sm:text-xs shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            >
              <span>👗</span>
              <span className="hidden sm:inline">แต่งตัว/เปลี่ยนชุด</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowNav(true)}
            className="flex items-center gap-1 bg-white/90 hover:bg-white rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-bold text-blue-800 shadow cursor-pointer transition"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">บทเรียน</span>
            <span>{completedCount}/{totalModules}</span>
            {!hasCompletedPretest && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-0.5"></span>}
          </button>
          <button
            type="button"
            onClick={() => setShowNav(!showNav)}
            className="bg-white/90 hover:bg-white rounded-full px-2.5 py-1 text-xs font-bold text-blue-800 shadow cursor-pointer transition"
          >
            {showNav ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Dropdown Room Selection Popup ── */}
      {showNav && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowNav(false)}
          />

          <div
            className="fixed sm:absolute left-2.5 right-2.5 sm:left-auto sm:right-4 z-50 sm:w-96 bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden pointer-events-auto transition-all flex flex-col"
            style={{
              top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.65rem)',
              maxHeight: 'calc(var(--app-h, 100dvh) - max(0.375rem, env(safe-area-inset-top, 0px)) - max(0.75rem, env(safe-area-inset-bottom, 0px)) - 3.25rem)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-blue-950">เลือกห้องเรียนรู้ (10 ห้อง)</h2>
                  <p className="text-[10px] text-blue-700">
                    {!hasCompletedPretest ? '⚠️ ต้องทำแบบทดสอบก่อนเรียน (Pre-test) ก่อน' : 'คลิกเพื่อเข้าสู่ห้องเรียนรู้ได้ทันที'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNav(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-bold text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content List */}
            <div className="p-3 flex-1 min-h-0 overflow-y-auto space-y-3">
              {/* Highlight Pre-test First if not completed */}
              <div>
                <button
                  type="button"
                  onClick={() => { setRoom('quiz'); setShowNav(false); }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 border transition cursor-pointer shadow-md ${
                    !hasCompletedPretest
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black animate-pulse'
                      : 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">🎓</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold">
                      {!hasCompletedPretest ? '⭐ 1. ทำแบบทดสอบก่อนเรียน (Pre-test)' : 'แบบทดสอบประเมินความรู้ (Hall 301)'}
                    </div>
                    <div className="text-[10px] opacity-90">
                      {!hasCompletedPretest ? 'บังคับทำ 20 ข้อ เพื่อปลดล็อคห้องเรียนรู้' : `คะแนนก่อนเรียน: ${pretestScore}/20 (ทำ Post-test ได้)`}
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/25 px-2.5 py-1 rounded-full font-bold">
                    {!hasCompletedPretest ? 'ต้องทำก่อน ➜' : 'เข้าทำ ➜'}
                  </span>
                </button>
              </div>

              {/* Lobby Button */}
              <button
                type="button"
                onClick={() => { setRoom('lobby'); setShowNav(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition border ${
                  currentRoom === 'lobby'
                    ? 'bg-blue-100 border-blue-300 font-bold text-blue-900 shadow-sm'
                    : 'bg-gray-50 hover:bg-blue-50/70 border-gray-200 text-gray-800'
                }`}
              >
                <span className="text-xl">🌐</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-blue-900">ห้องต้อนรับ (Grand Lobby)</div>
                  <div className="text-[10px] text-gray-500">เดินสำรวจซุ้มประตูเข้าห้องเรียนรู้</div>
                </div>
                {currentRoom === 'lobby' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">ปัจจุบัน</span>}
              </button>

              {/* Dressing Room & Wardrobe Button */}
              <button
                type="button"
                onClick={() => { setRoom('dressingRoom'); setShowNav(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition border ${
                  currentRoom === 'dressingRoom'
                    ? 'bg-pink-100 border-pink-400 font-bold text-pink-900 shadow-sm'
                    : 'bg-pink-50/70 hover:bg-pink-100/80 border-pink-200 text-pink-900'
                }`}
              >
                <span className="text-xl">👗</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-pink-900">ห้องแต่งตัว & เปลี่ยนชุดตัวละคร (Suite 001)</div>
                  <div className="text-[10px] text-pink-600">เลือกชุดผู้ป่วย/ชุดคลอด 6 สไตล์ และสลับตัวละคร</div>
                </div>
                {currentRoom === 'dressingRoom' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-600 text-white font-bold">ปัจจุบัน</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-pink-700 font-bold border border-pink-300">เข้าแต่งตัว ➜</span>
                )}
              </button>

              {/* Mother Care Zone */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className="text-sm">💗</span>
                  <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wide">
                    โซนดูแลตนเองของมารดา (4 ห้อง)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MOTHER_ROOMS.map((room) => (
                    <button
                      key={room.key}
                      type="button"
                      onClick={() =>
                        handleSelectRoom(
                          room.key,
                          room.label,
                          room.key === 'motherCare3' || room.key === 'motherCare4'
                            ? 'โซนดูแลมารดา'
                            : `Ward 10${room.key.slice(-1)}`,
                          room.icon
                        )
                      }
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 border transition cursor-pointer ${
                        currentRoom === room.key
                          ? 'bg-pink-100 border-pink-400 font-bold text-pink-900 shadow-sm'
                          : 'bg-pink-50/60 hover:bg-pink-100/70 border-pink-100 text-gray-800'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{room.icon}</span>
                      <span className="text-xs font-medium flex-1">{room.label}</span>
                      {!hasCompletedPretest ? (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">🔒 ล็อค</span>
                      ) : learningProgress[room.key] ? (
                        <span className="text-emerald-600 text-xs font-bold">✅ ผ่านแล้ว</span>
                      ) : (
                        <span className="text-[10px] text-pink-400">เข้าห้อง ➜</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newborn Care Zone */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className="text-sm">👶</span>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                    โซนดูแลทารกแรกเกิด (4 ห้อง)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {NEWBORN_ROOMS.map((room) => (
                    <button
                      key={room.key}
                      type="button"
                      onClick={() => handleSelectRoom(room.key, room.label, `Nursery 20${room.key.slice(-1)}`, room.icon)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 border transition cursor-pointer ${
                        currentRoom === room.key
                          ? 'bg-blue-100 border-blue-400 font-bold text-blue-900 shadow-sm'
                          : 'bg-blue-50/60 hover:bg-blue-100/70 border-blue-100 text-gray-800'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{room.icon}</span>
                      <span className="text-xs font-medium flex-1">{room.label}</span>
                      {!hasCompletedPretest ? (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">🔒 ล็อค</span>
                      ) : learningProgress[room.key] ? (
                        <span className="text-emerald-600 text-xs font-bold">✅ ผ่านแล้ว</span>
                      ) : (
                        <span className="text-[10px] text-blue-400">เข้าห้อง ➜</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Session Info & Developer Unlock Button (จดจำข้อมูลผู้ใช้ / ปลดล็อคข้อสอบ) */}
              <div className="mt-2 pt-2.5 border-t border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span>🆔</span>
                    <span className="font-mono font-bold text-slate-700">{userId}</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-600">
                    บันทึกประวัติอัตโนมัติ
                  </span>
                </div>
                {!hasCompletedPretest && (
                  <button
                    type="button"
                    onClick={() => {
                      unlockAllRooms();
                      setShowNav(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🔓</span>
                    <span>ปลดล็อคทุกห้องทันที (โหมดทดสอบ / ผู้ประเมิน)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Pre-test Mandatory Enforcement Modal ── */}
      {showPretestWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[calc(var(--app-h,100dvh)-1.5rem)] overflow-y-auto shadow-2xl border-4 border-amber-400 text-center animate-fade-in">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow">
              🔒
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ต้องทำแบบทดสอบก่อนเรียนก่อน
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3">
              กรุณาทำ Pre-test ก่อนเข้าห้องเรียนรู้
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              ตามระเบียบการเรียนรู้ คุณแม่ต้องเดินไปยัง <b>Hall 301 (ตรงกลางด้านหน้า)</b> เพื่อทำแบบทดสอบวัดความรู้ก่อนเรียน (Pre-test 20 ข้อ) ก่อน จึงจะปลดล็อคห้องเรียนรู้ได้ครับ
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  dismissPretestWarning();
                  setRoom('quiz');
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>🎯</span>
                <span>ไปทำแบบทดสอบที่ Hall 301 ทันที ➜</span>
              </button>
              <button
                type="button"
                onClick={dismissPretestWarning}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                เข้าใจแล้ว (เดินสำรวจล็อบบี้ต่อ)
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
