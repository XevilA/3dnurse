import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import DrawerCabinet from '../furniture/DrawerCabinet';
import MedicineCabinet from '../furniture/MedicineCabinet';
import SteelShelves from '../furniture/SteelShelves';
import ExaminationLamp from '../decorations/ExaminationLamp';
import WalkableRoomPortal from '../environment/WalkableRoomPortal';

const OUTFITS = [
  { id: 'pink', name: 'ชุดคลุมยาวพักฟื้น สีชมพูนวล', desc: 'Maternity Long Robe — ผ้าฝ้ายนุ่มพิเศษ สบายตัว อ่อนโยน สำหรับคุณแม่หลังคลอด', color: '#f472b6', border: '#ec4899', badge: 'แนะนำ' },
  { id: 'blue', name: 'ชุดคลุมยาวคนไข้ สีฟ้าคราม', desc: 'Hospital Sky Blue Robe — ชุดคลุมยาวมาตรฐาน สะอาดตา ผ่อนคลาย สบายใจ', color: '#38bdf8', border: '#0284c7', badge: 'มาตรฐาน' },
  { id: 'lavender', name: 'ชุดคลุมยาวอยู่ไฟ สีม่วงลาเวนเดอร์', desc: 'Pure Lavender Robe — อบอุ่น ผ่อนคลาย ระบายอากาศดีเยี่ยม สำหรับพักฟื้น', color: '#c084fc', border: '#9333ea', badge: 'สบายตัว' },
  { id: 'mint', name: 'ชุดคลุมยาว สีเขียวมิ้นต์', desc: 'Fresh Mint Robe — สดใส เติมพลังบวก เตรียมความพร้อมสำหรับการดูแลลูกน้อย', color: '#34d399', border: '#059669', badge: 'สดใส' },
  { id: 'white', name: 'ชุดคลุมยาวการแพทย์ สีขาวบริสุทธิ์', desc: 'Medical White Robe — สะอาด สง่างาม ถูกสุขอนามัย มาตรฐานสุขาภิบาล', color: '#f8fafc', border: '#94a3b8', badge: 'คลินิก' },
  { id: 'peach', name: 'ชุดคลุมยาว สีส้มพีชอบอุ่น', desc: 'Sunrise Warm Peach Robe — อบอุ่น มีชีวิตชีวา เสริมสร้างกำลังใจและความสดชื่น', color: '#fb923c', border: '#ea580c', badge: 'อบอุ่น' },
];

const CHARACTERS = [
  {
    id: 'pregnant_mother',
    name: 'คุณแม่ชุดเดรสยาว (Maternity Long Dress)',
    desc: 'คุณแม่สวมชุดเดรสยาวคลุมเข่า สไตล์คลุมท้อง ทรงปล่อยสบาย สรีระคุณแม่อ่อนหวาน ทิ้งตัวสวยงาม',
    icon: '🤰',
    role: 'ชุดเดรสยาวคลุมท้อง',
    badge: 'เดรสยาว',
  },
  {
    id: 'postpartum_mother',
    name: 'คุณแม่หลังคลอด (Postpartum Mother)',
    desc: 'คุณแม่หลังคลอด สรีระนุ่มนวลสมจริง สวมชุดผู้ป่วยพักฟื้นโรงพยาบาล พร้อมเรียนรู้การฟื้นตัวและการอุ้มลูกน้อยแนบอก',
    icon: '👩‍🍼',
    role: 'มารดาพักฟื้น',
    badge: 'ชุดผู้ป่วยพักฟื้น',
  },
  {
    id: 'nurse',
    name: 'พยาบาลวิชาชีพสาว (Registered Nurse)',
    desc: 'เจ้าหน้าที่พยาบาลสาววิชาชีพ มีหูฟังตรวจ (Stethoscope) และป้ายประจำตัวพยาบาล คอยดูแลและให้คำแนะนำ',
    icon: '👩‍⚕️',
    role: 'พยาบาลวิชาชีพ',
    badge: 'บุคลากรแพทย์',
  },
];

const BELLY_STAGES = [
  { id: 'none', name: 'ชุดคลุมยาวทรงสบาย (Relaxed Gown)', desc: 'ชุดคลุมยาวหลวมสบาย สรีระนุ่มนวลตามธรรมชาติ', icon: '👩‍🍼', protrusion: 'ปกติ' },
  { id: 'standard', name: 'ชุดคลุมยาวมาตรฐาน (Standard Gown)', desc: 'ชุดคลุมโรงพยาบาลมาตรฐาน ระบายอากาศดี', icon: '👘', protrusion: 'พอดีตัว' },
];

export default function DressingRoom() {
  const setRoom = useStore((s) => s.setRoom);
  const selectedCharacter = useStore((s) => s.selectedCharacter) || 'postpartum_mother';
  const setCharacter = useStore((s) => s.setCharacter);
  const selectedOutfit = useStore((s) => s.selectedOutfit) || 'pink';
  const setOutfit = useStore((s) => s.setOutfit);
  const bellyBump = useStore((s) => s.bellyBump) || 'none';
  const setBellyBump = useStore((s) => s.setBellyBump);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);

  const [activeTab, setActiveTab] = useState('outfit'); // 'outfit' | 'character' | 'belly'
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const turntableRef = useRef();

  useFrame((_, delta) => {
    if (turntableRef.current && isAutoRotate) {
      turntableRef.current.rotation.y += delta * 0.35;
    }
  });

  const handleManualRotate = (angle) => {
    setIsAutoRotate(false);
    if (turntableRef.current) {
      turntableRef.current.rotation.y += angle;
    }
  };

  const handleApply = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleCharacterSelect = (charId) => {
    setCharacter(charId);
    if (charId === 'pregnant_mother') {
      setBellyBump('9months');
      setHoldingBaby(false);
    } else if (charId === 'postpartum_mother') {
      setBellyBump('none');
    }
  };

  return (
    <group>
      {/* ── Studio Camera: Framed view of pregnant mother & wardrobe outfits ── */}
      <PerspectiveCamera makeDefault position={[0, 1.15, 2.75]} fov={38} />

      {/* ── Architectural Hospital Dressing Suite (18x18m) ── */}
      <HospitalRoomShell
        theme="mother"
        width={18}
        depth={18}
        height={7}
        roomTitle="ห้องแต่งตัว & ปรับแต่งตัวละคร (Wardrobe & Dressing Suite)"
        roomNumber="Suite 001"
      />

      {/* ── Studio Spotlights onto Showcase Turntable ── */}
      <spotLight
        position={[0, 5.5, 2.5]}
        target-position={[0, 1.2, 0]}
        intensity={2.8}
        angle={0.6}
        penumbra={0.5}
        color="#fff5ea"
        castShadow
      />
      <pointLight position={[2, 3, 2]} intensity={1.5} color="#fed7aa" />
      <pointLight position={[-2, 3, 2]} intensity={1.5} color="#e0f2fe" />
      <pointLight position={[0, 4, -2]} intensity={1.2} color="#fce7f3" />

      {/* ── Showcase Turntable Stage (แท่นหมุนโชว์ตัวละคร 360°) ── */}
      <group position={[0, 0, 0]}>
        {/* Outer Golden/Rose Neon Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[1.75, 1.88, 48]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[1.88, 2.3, 48]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.25} />
        </mesh>

        {/* Tiered Marble Podium Base */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.65, 1.75, 0.24, 48]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Rotating Top Stage */}
        <group ref={turntableRef} position={[0, 0.24, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.08, 48]} />
            <meshStandardMaterial color="#fdf2f8" roughness={0.2} metalness={0.15} />
          </mesh>

          {/* Model Display on Turntable: 100% Female Character Suite */}
          <group position={[0, 0.04, 0]}>
            <MotherAvatar
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              currentAnimation="idle"
            />

            {/* Optional Baby Preview when holding baby (for postpartum mother) */}
            {isHoldingBaby && selectedCharacter !== 'pregnant_mother' && (
              <group position={[0.04, 1.08, 0.26]} rotation={[-0.15, 0.18, 0.12]}>
                <BabyAvatar pose="carried" position={[0, 0, 0]} scale={0.85} />
              </group>
            )}
          </group>
        </group>
      </group>

      {/* ── Luxury Full-Length Dressing Mirrors & Vanity Wall (Back Wall Z = -7.8) ── */}
      <group position={[0, 0, -7.8]}>
        {/* Center Grand Mirror Frame */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[3.2, 4.4, 0.14]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Mirror Reflective Surface */}
        <mesh position={[0, 2.4, 0.08]}>
          <planeGeometry args={[2.9, 4.1]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.05} metalness={0.95} />
        </mesh>
        {/* Vanity Hollywood Bulbs along Frame */}
        {[-1.35, 1.35].map((x) =>
          [0.8, 1.6, 2.4, 3.2, 4.0].map((y) => (
            <mesh key={`bulb-${x}-${y}`} position={[x, y, 0.15]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#fffbeb" />
            </mesh>
          ))
        )}
      </group>

      {/* ── Dressing Room Furnishings (Wardrobe Cabinets, Shelves & Soft Sofa) ── */}
      {/* Left Wall Wardrobe & Drawer Cabinets */}
      <group position={[-7.2, 0, -2.5]} rotation={[0, Math.PI / 2, 0]}>
        <MedicineCabinet position={[-1.8, 0, 0]} scale={1.2} />
        <DrawerCabinet position={[0, 0, 0]} scale={1.25} />
        <SteelShelves position={[1.8, 0, 0]} scale={1.2} />
      </group>

      {/* Right Wall Lounge Fitting Area */}
      <group position={[6.8, 0, -1]} rotation={[0, -Math.PI / 2, 0]}>
        <HospitalSofa position={[0, 0, 0]} scale={1.2} />
        <FlowerVase position={[1.8, 0.8, 0]} scale={0.9} />
        <DrawerCabinet position={[1.8, 0, 0]} scale={1.0} />
      </group>

      {/* Corner Plants & Examination Lamp */}
      <RealPlant type="house" position={[-6.8, 0, -6.8]} scale={1.3} />
      <RealPlant type="potted" position={[6.8, 0, -6.8]} scale={1.2} />
      <RealPlant type="succulent" position={[-6.8, 0, 5.5]} scale={1.2} />
      <RealPlant type="succulent" position={[6.8, 0, 5.5]} scale={1.2} />
      <ExaminationLamp position={[-3.2, 0, -4.5]} />

      {/* ── Exit Door back to Grand Lobby (South Wall Z = +7.8) ── */}
      <WalkableRoomPortal
        roomKey="lobby"
        roomNumber="Main Hall"
        roomTitle="กลับสู่ห้องต้อนรับ (Return to Grand Lobby)"
        icon="🚪"
        theme="lobby"
        position={[0, 0, 7.8]}
        rotation={[0, Math.PI, 0]}
      />

      {/* ── 2D Interactive Customizer UI (Screen Overlay) ── */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none">
          {/* Top Title Banner */}
          <div className="self-center pointer-events-auto bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl shadow-xl border border-pink-200 flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">👗</span>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-pink-900 leading-tight">
                ห้องแต่งตัว & สรีระคุณแม่ (Maternity Wardrobe & Bump Studio)
              </h1>
              <p className="text-[10px] sm:text-xs text-pink-600">
                ตัวละครหญิง 100% | ปรับสรีระท้องป่อง (อุ้มท้อง) | เปลี่ยนชุดผู้ป่วยและชุดคลอด 6 สไตล์
              </p>
            </div>
            {saveToast && (
              <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-bounce shadow">
                ✓ บันทึกสำเร็จ!
              </span>
            )}
          </div>

          {/* Bottom Dock Control Panel */}
          <div className="self-center w-full max-w-2xl pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-pink-200 p-3 sm:p-4 mb-1">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('outfit')}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    activeTab === 'outfit'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-pink-50 text-gray-700'
                  }`}
                >
                  <span>👗</span>
                  <span>เปลี่ยนชุด ({OUTFITS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('character')}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    activeTab === 'character'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <span>👩</span>
                  <span>บทบาทหญิง ({CHARACTERS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('belly')}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer ${
                    activeTab === 'belly'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-amber-50 text-gray-700'
                  }`}
                >
                  <span>👩‍🍼</span>
                  <span>สรีระแม่หลังคลอด</span>
                </button>
              </div>

              {/* Turntable Rotation Controls */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  title="หมุนซ้าย"
                  onClick={() => handleManualRotate(-Math.PI / 4)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-pink-100 text-gray-700 font-bold text-xs shadow-sm cursor-pointer"
                >
                  ↺
                </button>
                <button
                  type="button"
                  title="เปิด/ปิดหมุนอัตโนมัติ"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={`px-2 h-7 flex items-center justify-center rounded-lg font-bold text-[10px] cursor-pointer ${
                    isAutoRotate ? 'bg-pink-100 text-pink-700' : 'bg-white text-gray-600'
                  }`}
                >
                  {isAutoRotate ? '360°' : 'หยุด'}
                </button>
                <button
                  type="button"
                  title="หมุนขวา"
                  onClick={() => handleManualRotate(Math.PI / 4)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-pink-100 text-gray-700 font-bold text-xs shadow-sm cursor-pointer"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* Tab 1: Outfit Grid */}
            {activeTab === 'outfit' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[38vh] overflow-y-auto p-1">
                {OUTFITS.map((outfit) => {
                  const isSelected = selectedOutfit === outfit.id;
                  return (
                    <button
                      key={outfit.id}
                      type="button"
                      onClick={() => setOutfit(outfit.id)}
                      className={`text-left p-2.5 rounded-xl border-2 transition flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-pink-50 border-pink-500 shadow-md transform scale-[1.02]'
                          : 'bg-gray-50/80 hover:bg-pink-50/50 border-gray-200'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shrink-0 mt-0.5 shadow border border-white"
                        style={{ backgroundColor: outfit.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {outfit.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-800 font-semibold">
                            {outfit.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                          {outfit.desc}
                        </p>
                      </div>
                      {isSelected && <span className="text-pink-600 font-black text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Female Character Grid */}
            {activeTab === 'character' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-[38vh] overflow-y-auto p-1">
                {CHARACTERS.map((char) => {
                  const isSelected = selectedCharacter === char.id;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleCharacterSelect(char.id)}
                      className={`text-left p-3 rounded-xl border-2 transition flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 border-purple-600 shadow-md transform scale-[1.02]'
                          : 'bg-gray-50/80 hover:bg-purple-50/50 border-gray-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{char.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {char.name}
                          </span>
                        </div>
                        <span className="inline-block text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-semibold my-0.5">
                          {char.badge}
                        </span>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                          {char.desc}
                        </p>
                      </div>
                      {isSelected && <span className="text-purple-600 font-black text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Postpartum Maternal Silhouette Customizer */}
            {activeTab === 'belly' && (
              <div className="space-y-2 max-h-[38vh] overflow-y-auto p-1">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <span className="text-xl">👩‍🍼</span>
                  <span>สรีระคุณแม่หลังคลอด: รูปร่างนุ่มนวล อวบอิ่ม สวมชุดเดรสคลุมท้องทรงหลวม (Maternity Smock Dress) ที่สบายตัวและระบายอากาศดี</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BELLY_STAGES.map((stage) => {
                    const isSelected = (selectedCharacter === 'pregnant_mother' && bellyBump === stage.id) || (selectedCharacter !== 'pregnant_mother' && bellyBump === stage.id);
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => {
                          setBellyBump(stage.id);
                          if (stage.id !== 'none' && selectedCharacter === 'nurse') {
                            // keep nurse or switch
                          }
                        }}
                        className={`text-left p-3 rounded-xl border-2 transition flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-md transform scale-[1.02]'
                            : 'bg-gray-50/80 hover:bg-amber-50/40 border-gray-200'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{stage.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 truncate">
                              {stage.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                              {stage.protrusion}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                        {isSelected && <span className="text-amber-600 font-black text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Baby Holding Toggle for Postpartum Mother and Nurse */}
            {selectedCharacter !== 'pregnant_mother' && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👶</span>
                  <span className="text-xs font-semibold text-gray-700">
                    ท่าทางอุ้มทารกแรกเกิดในอ้อมกอด:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHoldingBaby(!isHoldingBaby)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    isHoldingBaby
                      ? 'bg-pink-500 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isHoldingBaby ? '✓ กำลังอุ้มลูกน้อย' : 'เดินตัวเปล่า'}
                </button>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setRoom('lobby')}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>⬅</span>
                <span>กลับล็อบบี้</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>บันทึกและสวมใส่ชุดนี้</span>
              </button>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
