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
    name: 'คุณแม่หลังคลอด',
    nameSub: 'Postpartum Mother',
    icon: '👩‍🍼',
    desc: 'ชุดผู้ป่วยพักฟื้น\nหลังคลอด',
    accent: 'from-pink-400 to-rose-500',
    border: 'border-pink-300',
    ring: 'ring-pink-400',
    badge: 'ค่าเริ่มต้น',
    badgeBg: 'bg-pink-500',
  },
  {
    id: 'pregnant_mother',
    name: 'คุณแม่ตั้งครรภ์ (สมจริง)',
    nameSub: 'Pregnant Megan — ท้องป่องนิดๆ',
    icon: '🤰',
    desc: 'โมเดล Megan 3D สมจริง\nท้องป่องนิดๆ ตามธรรมชาติ',
    accent: 'from-purple-400 to-violet-500',
    border: 'border-purple-300',
    ring: 'ring-purple-400',
    badge: '🌸 สมจริง ท้องนิดๆ',
    badgeBg: 'bg-purple-500',
  },
  {
    id: 'nurse',
    name: 'พยาบาลวิชาชีพ',
    nameSub: 'Registered Nurse',
    icon: '👩‍⚕️',
    desc: 'ชุดสครับ + หูฟัง\n+ บัตรประจำตัว',
    accent: 'from-sky-400 to-blue-500',
    border: 'border-sky-300',
    ring: 'ring-sky-400',
    badge: 'บุคลากร',
    badgeBg: 'bg-sky-500',
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function DressingRoomOverlay() {
  const currentRoom = useStore((s) => s.currentRoom);
  const setRoom = useStore((s) => s.setRoom);

  const selectedCharacter = useStore((s) => s.selectedCharacter) || 'postpartum_mother';
  const setCharacter = useStore((s) => s.setCharacter);
  const selectedOutfit = useStore((s) => s.selectedOutfit) || 'pink';
  const setOutfit = useStore((s) => s.setOutfit);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);
  const setBellyBump = useStore((s) => s.setBellyBump);

  const [activeTab, setActiveTab] = useState('outfit');
  const [saved, setSaved] = useState(false);

  // Only render when in dressing room
  if (currentRoom !== 'dressingRoom' && currentRoom !== 'wardrobe') return null;

  const handleCharacterSelect = (id) => {
    setCharacter(id);
    if (id === 'pregnant_mother') { setBellyBump('9months'); setHoldingBaby(false); }
    else if (id === 'postpartum_mother') setBellyBump('none');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentOutfit = OUTFITS.find((o) => o.id === selectedOutfit) || OUTFITS[0];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
    >
      {/* ── Top Bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 pointer-events-auto"
        style={{ zIndex: 31 }}>
        <button
          onClick={() => setRoom('lobby')}
          className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-pink-700 font-bold text-sm px-4 py-2 rounded-xl shadow-lg border border-pink-200 hover:bg-pink-50 transition cursor-pointer"
        >
          ← กลับล็อบบี้
        </button>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-pink-200 flex items-center gap-2">
          <span className="text-xl">👗</span>
          <div className="leading-tight">
            <div className="text-xs font-extrabold text-pink-800">ห้องแต่งตัว</div>
            <div className="text-[10px] text-pink-500">Maternity Wardrobe Studio</div>
          </div>
          {saved && (
            <span className="ml-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-bounce">
              ✓ บันทึกแล้ว!
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom Panel ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        style={{ zIndex: 31, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto max-w-3xl px-3 pb-3">
          <div className="bg-white/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-200 overflow-hidden">

            {/* Tab Header */}
            <div className="flex items-center gap-1 px-3 pt-2.5 pb-1.5 border-b border-gray-100">
              {[
                { id: 'outfit', label: '👗 เลือกชุด', active: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' },
                { id: 'character', label: '👩 ตัวละคร', active: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white' },
                { id: 'accessories', label: '👶 ทารก', active: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    activeTab === tab.id
                      ? tab.active + ' shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Current selection summary */}
              <div className="ml-auto flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1">
                <div
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: currentOutfit.color }}
                />
                <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[80px]">
                  {currentOutfit.name}
                </span>
              </div>
            </div>

            {/* ── Tab: Outfit Selection ── */}
            {activeTab === 'outfit' && (
              <div className="p-2.5">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {OUTFITS.map((outfit) => {
                    const isSelected = selectedOutfit === outfit.id;
                    return (
                      <button
                        key={outfit.id}
                        onClick={() => setOutfit(outfit.id)}
                        className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${outfit.border} ring-2 ${outfit.ring} ring-offset-1 shadow-lg scale-[1.04] bg-white`
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white hover:scale-[1.02]'
                        }`}
                      >
                        {/* Large Color Swatch */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md border-4 border-white flex items-center justify-center text-lg"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, ${outfit.color}, ${outfit.colorDark})`,
                            boxShadow: isSelected
                              ? `0 0 0 3px ${outfit.color}44, 0 4px 12px ${outfit.color}55`
                              : '0 2px 8px rgba(0,0,0,0.12)',
                          }}
                        >
                          <span className="drop-shadow">{outfit.emoji}</span>
                        </div>

                        {/* Dress graphic icon */}
                        <div className="text-center leading-tight">
                          <div className="text-[10px] font-bold text-gray-800">{outfit.name}</div>
                          <div className="text-[9px] text-gray-500">{outfit.nameSub}</div>
                        </div>

                        {/* Badge */}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full text-white font-bold ${outfit.badgeColor}`}>
                          {outfit.badge}
                        </span>

                        {/* Selected Tick */}
                        {isSelected && (
                          <div
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md"
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

            {/* ── Tab: Character Selection ── */}
            {activeTab === 'character' && (
              <div className="p-2.5">
                <div className="grid grid-cols-3 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = selectedCharacter === char.id;
                    return (
                      <button
                        key={char.id}
                        onClick={() => handleCharacterSelect(char.id)}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? `${char.border} ring-2 ${char.ring} ring-offset-1 shadow-lg scale-[1.03] bg-white`
                            : 'border-gray-200 bg-gray-50 hover:bg-white hover:scale-[1.01]'
                        }`}
                      >
                        {/* Character Avatar Icon */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${char.accent} flex items-center justify-center text-4xl shadow-md`}
                        >
                          {char.icon}
                        </div>

                        <div className="text-center leading-tight">
                          <div className="text-xs font-extrabold text-gray-800">{char.name}</div>
                          <div className="text-[9px] text-gray-500">{char.nameSub}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5 whitespace-pre-line">{char.desc}</div>
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded-full text-white font-bold ${char.badgeBg}`}>
                          {char.badge}
                        </span>

                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black shadow-md">
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
              <div className="p-3">
                {selectedCharacter === 'pregnant_mother' ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center text-sm text-purple-700">
                    <div className="text-2xl mb-1">🤰</div>
                    <div className="font-bold">คุณแม่ตั้งครรภ์</div>
                    <div className="text-xs text-purple-500 mt-1">สรีระอุ้มท้องสมจริง ไม่สามารถอุ้มทารกในโหมดนี้</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">👶</span>
                        <div>
                          <div className="text-sm font-bold text-gray-800">อุ้มทารกแรกเกิด</div>
                          <div className="text-xs text-gray-500">ท่าทางอุ้มทารกน้อยแนบอกแม่ 3D สมจริง</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setHoldingBaby(!isHoldingBaby)}
                        className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                          isHoldingBaby ? 'bg-pink-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                            isHoldingBaby ? 'translate-x-7' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    {isHoldingBaby && (
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-2.5 text-xs text-pink-700 flex items-center gap-2">
                        <span className="text-lg">🌸</span>
                        <span>กำลังอุ้มทารกน้อย — แม่เต้นเบาๆ สายตาจับที่ลูก</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-base">✨</span>
                <span>ตัวละคร: <strong className="text-gray-700">{CHARACTERS.find((c) => c.id === selectedCharacter)?.name}</strong></span>
              </div>
              <button
                onClick={handleSave}
                className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>✓</span>
                <span>บันทึกและสวมใส่ชุดนี้</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
