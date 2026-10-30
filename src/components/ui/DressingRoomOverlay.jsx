/**
 * DressingRoomOverlay — Graphic Wardrobe & Character Selection UI
 * Rendered as a DOM overlay OUTSIDE the R3F Canvas to avoid Html/isolate clipping.
 * Shows rich outfit swatches, character cards, and a belly/baby toggle panel.
 */
import React, { useState } from 'react';
import useStore from '../../store/useStore';

/* ─── Data ─────────────────────────────────────────────────────────── */
const OUTFITS = [
  {
    id: 'pink',
    name: 'ชมพูนวลมารดา',
    nameSub: 'Sakura Pink Robe',
    color: '#f472b6',
    colorDark: '#ec4899',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-400',
    ring: 'ring-pink-400',
    badge: '⭐ แนะนำ',
    badgeColor: 'bg-pink-500',
    emoji: '🌸',
  },
  {
    id: 'blue',
    name: 'ฟ้าครามคนไข้',
    nameSub: 'Sky Blue Gown',
    color: '#38bdf8',
    colorDark: '#0ea5e9',
    bg: 'from-sky-50 to-blue-50',
    border: 'border-sky-400',
    ring: 'ring-sky-400',
    badge: 'มาตรฐาน',
    badgeColor: 'bg-sky-500',
    emoji: '💙',
  },
  {
    id: 'lavender',
    name: 'ม่วงลาเวนเดอร์',
    nameSub: 'Lavender Robe',
    color: '#c084fc',
    colorDark: '#a855f7',
    bg: 'from-purple-50 to-violet-50',
    border: 'border-purple-400',
    ring: 'ring-purple-400',
    badge: 'ผ่อนคลาย',
    badgeColor: 'bg-purple-500',
    emoji: '💜',
  },
  {
    id: 'mint',
    name: 'เขียวมิ้นต์สดใส',
    nameSub: 'Fresh Mint Robe',
    color: '#34d399',
    colorDark: '#10b981',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-400',
    ring: 'ring-emerald-400',
    badge: 'สดชื่น',
    badgeColor: 'bg-emerald-500',
    emoji: '🌿',
  },
  {
    id: 'white',
    name: 'ขาวบริสุทธิ์',
    nameSub: 'Clinical White',
    color: '#f1f5f9',
    colorDark: '#94a3b8',
    bg: 'from-slate-50 to-gray-50',
    border: 'border-slate-300',
    ring: 'ring-slate-300',
    badge: 'คลินิก',
    badgeColor: 'bg-slate-400',
    emoji: '🤍',
  },
  {
    id: 'peach',
    name: 'ส้มพีชอบอุ่น',
    nameSub: 'Sunrise Peach',
    color: '#fb923c',
    colorDark: '#ea580c',
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-400',
    ring: 'ring-orange-400',
    badge: 'อบอุ่น',
    badgeColor: 'bg-orange-400',
    emoji: '🍑',
  },
];

const CHARACTERS = [
  {
    id: 'postpartum_mother',
    name: 'ชุดกางเกงพักฟื้นหลังคลอด',
    nameSub: 'Postpartum Pants Set',
    icon: '👖',
    desc: 'ชุดเสื้อ + กางเกงขายาวผ้านุ่ม\nคล่องตัวสำหรับคุณแม่หลังคลอด',
    accent: 'from-pink-400 to-rose-500',
    border: 'border-pink-400',
    ring: 'ring-pink-400',
    badge: 'แบบกางเกง',
    badgeBg: 'bg-pink-500',
  },
  {
    id: 'postpartum_dress',
    name: 'ชุดเดรสคุณแม่หลังคลอด',
    nameSub: 'Postpartum Midi Dress',
    icon: '👗',
    desc: 'ชุดเดรสยาวคลุมเข่า ทรงปล่อยสบาย\nสรีระคุณแม่หลังคลอด (ไม่ท้องป่อง)',
    accent: 'from-rose-400 to-purple-500',
    border: 'border-purple-400',
    ring: 'ring-purple-400',
    badge: 'แบบชุดเดรส',
    badgeBg: 'bg-purple-500',
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function DressingRoomOverlay() {
  const currentRoom = useStore((s) => s.currentRoom);
  const setRoom = useStore((s) => s.setRoom);

  const rawCharacter = useStore((s) => s.selectedCharacter) || 'postpartum_mother';
  const selectedCharacter =
    rawCharacter === 'postpartum_dress' || rawCharacter === 'pregnant_mother'
      ? 'postpartum_dress'
      : 'postpartum_mother';
  const setCharacter = useStore((s) => s.setCharacter);
  const selectedOutfit = useStore((s) => s.selectedOutfit) || 'pink';
  const setOutfit = useStore((s) => s.setOutfit);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);
  const setBellyBump = useStore((s) => s.setBellyBump);

  const [activeTab, setActiveTab] = useState('outfit');
  const [saved, setSaved] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only render when in dressing room
  if (currentRoom !== 'dressingRoom' && currentRoom !== 'wardrobe') return null;

  const handleCharacterSelect = (id) => {
    setCharacter(id);
    setBellyBump('none');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentOutfit = OUTFITS.find((o) => o.id === selectedOutfit) || OUTFITS[0];
  const currentCharObj = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
    >
      {/* ── Save Confirmation Toast (Positioned cleanly below HUD top bar — zero header overlap) ── */}
      {saved && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem)',
            zIndex: 35,
          }}
        >
          <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs px-4 py-1.5 rounded-full font-extrabold shadow-xl border border-white/80 animate-bounce">
            <span>✓</span>
            <span>บันทึกชุดเรียบร้อยแล้ว!</span>
          </span>
        </div>
      )}

      {/* ── Responsive Bottom Wardrobe Panel (Always above iOS Safari bottom bar) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        style={{
          zIndex: 31,
          paddingBottom: 'max(0.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.35rem))',
        }}
      >
        <div className="mx-auto max-w-3xl px-2.5 sm:px-3">
          <div className="bg-white/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-200 overflow-hidden">

            {/* Responsive Tab Header — Fits 100% of 320px–430px Mobile Screens with Zero Right-Edge Cutoff */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 pt-2 pb-1.5 border-b border-gray-100">
              <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                {[
                  { id: 'outfit', mobileLabel: '👗 ชุด & สี', desktopLabel: '👗 เลือกชุด & สี', active: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' },
                  { id: 'character', mobileLabel: '👚 ทรงชุด', desktopLabel: '👚 ทรงชุด (กางเกง / เดรส)', active: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white' },
                  { id: 'accessories', mobileLabel: '👶 อุ้มทารก', desktopLabel: '👶 อุ้มทารก', active: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsCollapsed(false);
                    }}
                    className={`px-1.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition cursor-pointer text-center truncate ${
                      activeTab === tab.id && !isCollapsed
                        ? tab.active + ' shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="sm:hidden">{tab.mobileLabel}</span>
                    <span className="hidden sm:inline">{tab.desktopLabel}</span>
                  </button>
                ))}
              </div>

              {/* Desktop Current Selection Summary */}
              <div className="hidden md:flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1 shrink-0">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: currentOutfit.color }}
                />
                <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[130px]">
                  {selectedCharacter === 'postpartum_dress' ? 'ชุดเดรส' : 'ชุดกางเกง'} • {currentOutfit.name}
                </span>
              </div>

              {/* Collapse / Expand Toggle so Mobile Users can inspect full 3D outfit anytime */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="px-2 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-bold shrink-0 transition cursor-pointer"
                title={isCollapsed ? 'ขยายแผงแต่งตัว' : 'ย่อแผงแต่งตัว'}
              >
                {isCollapsed ? '▲ ขยาย' : '▼ ย่อ'}
              </button>
            </div>

            {!isCollapsed && (
              <div className="max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)*0.48)] overflow-y-auto">
                {/* ── Tab: Outfit Selection ── */}
                {activeTab === 'outfit' && (
                  <div className="p-2 sm:p-2.5 space-y-2">
                    {/* Quick 2-column Style Toggle: ชุดกางเกง vs ชุดเดรส */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {CHARACTERS.map((char) => {
                        const isStyleActive = selectedCharacter === char.id;
                        return (
                          <button
                            key={char.id}
                            type="button"
                            onClick={() => handleCharacterSelect(char.id)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border-2 text-[11px] sm:text-xs font-extrabold transition cursor-pointer min-w-0 ${
                              isStyleActive
                                ? `${char.border} bg-pink-50/80 text-pink-900 shadow-sm ring-1 ${char.ring}`
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-white'
                            }`}
                          >
                            <span className="text-sm sm:text-base shrink-0">{char.icon}</span>
                            <span className="truncate">{char.badge}</span>
                            {isStyleActive && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] sm:text-[10px] shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
                      {OUTFITS.map((outfit) => {
                        const isSelected = selectedOutfit === outfit.id;
                        return (
                          <button
                            key={outfit.id}
                            type="button"
                            onClick={() => setOutfit(outfit.id)}
                            className={`relative flex flex-col items-center gap-1 p-1.5 sm:p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? `${outfit.border} ring-1 ${outfit.ring} shadow-md bg-white`
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                            }`}
                          >
                            {/* Color Swatch */}
                            <div
                              className="w-9 h-9 sm:w-13 sm:h-13 rounded-full shadow-sm border-2 sm:border-4 border-white flex items-center justify-center text-sm sm:text-lg"
                              style={{
                                background: `radial-gradient(circle at 35% 35%, ${outfit.color}, ${outfit.colorDark})`,
                              }}
                            >
                              <span className="drop-shadow">{outfit.emoji}</span>
                            </div>

                            {/* Outfit Label */}
                            <div className="text-center leading-tight w-full min-w-0">
                              <div className="text-[10px] font-bold text-gray-800 truncate">{outfit.name}</div>
                              <div className="hidden sm:block text-[9px] text-gray-500 truncate">{outfit.nameSub}</div>
                            </div>

                            {/* Badge */}
                            <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full text-white font-bold ${outfit.badgeColor}`}>
                              {outfit.badge}
                            </span>

                            {/* Selected Tick */}
                            {isSelected && (
                              <div
                                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-md"
                                style={{ background: outfit.colorDark }}
                              >
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Tab: Character / Style Selection (2 Postpartum Styles Side-by-Side) ── */}
                {activeTab === 'character' && (
                  <div className="p-2 sm:p-2.5">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {CHARACTERS.map((char) => {
                        const isSelected = selectedCharacter === char.id;
                        return (
                          <button
                            key={char.id}
                            type="button"
                            onClick={() => handleCharacterSelect(char.id)}
                            className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? `${char.border} ring-1 ${char.ring} shadow-md bg-white`
                                : 'border-gray-200 bg-gray-50 hover:bg-white'
                            }`}
                          >
                            <div
                              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${char.accent} flex items-center justify-center text-2xl sm:text-4xl shadow-md`}
                            >
                              {char.icon}
                            </div>

                            <div className="text-center leading-tight">
                              <div className="text-[11px] sm:text-xs font-extrabold text-gray-800">{char.name}</div>
                              <div className="hidden sm:block text-[9px] text-gray-500">{char.nameSub}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5 whitespace-pre-line">{char.desc}</div>
                            </div>

                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full text-white font-bold ${char.badgeBg}`}>
                              {char.badge}
                            </span>

                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black shadow-md">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Tab: Baby/Accessories ── */}
                {activeTab === 'accessories' && (
                  <div className="p-2.5 sm:p-3">
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl sm:text-3xl shrink-0">👶</span>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-gray-800">อุ้มทารกแรกเกิด</div>
                            <div className="text-[11px] sm:text-xs text-gray-500 truncate">ท่าทางอุ้มทารกน้อยแนบอกแม่ 3D สมจริง</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHoldingBaby(!isHoldingBaby)}
                          className={`relative w-13 h-7 rounded-full transition-colors cursor-pointer shrink-0 ${
                            isHoldingBaby ? 'bg-pink-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                              isHoldingBaby ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                      {isHoldingBaby && (
                        <div className="bg-pink-50 border border-pink-200 rounded-xl p-2 text-[11px] sm:text-xs text-pink-700 flex items-center gap-2">
                          <span className="text-base">🌸</span>
                          <span>กำลังอุ้มทารกน้อย — แม่กล่อมเบาๆ สายตาจับที่ลูก</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Responsive Footer — Never Clipped or Truncated Awkwardly */}
            <div className="flex items-center justify-between gap-2 px-2.5 sm:px-3 py-2 border-t border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 min-w-0 flex-1">
                <span className="text-sm shrink-0">✨</span>
                <span className="truncate">
                  <span className="hidden xs:inline">ชุดปัจจุบัน: </span>
                  <strong className="text-gray-700">{currentCharObj.badge} • {currentOutfit.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="min-h-[38px] px-3.5 sm:px-5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap"
              >
                <span>✓</span>
                <span>บันทึกและสวมใส่</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
