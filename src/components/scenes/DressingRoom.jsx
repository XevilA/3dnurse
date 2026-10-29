import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
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
    id: 'postpartum_mother',
    name: 'คุณแม่หลังคลอด — ชุดกางเกงพักฟื้น (Postpartum Pants Set)',
    desc: 'คุณแม่หลังคลอด สวมชุดเสื้อและกางเกงขายาวผ้านุ่มคล่องตัว สำหรับพักฟื้นและฝึกดูแลลูกน้อย',
    icon: '👖',
    role: 'ชุดกางเกงพักฟื้น',
    badge: 'ชุดกางเกง',
  },
  {
    id: 'postpartum_dress',
    name: 'คุณแม่หลังคลอด — ชุดเดรสยาว (Postpartum Midi Dress)',
    desc: 'คุณแม่หลังคลอด สวมชุดเดรสยาวคลุมเข่า ทรงเอปล่อยสบาย สรีระหลังคลอดสมจริง อ่อนโยน',
    icon: '👗',
    role: 'ชุดเดรสหลังคลอด',
    badge: 'ชุดเดรส',
  },
];

const BELLY_STAGES = [
  { id: 'none', name: 'ชุดคลุมยาวทรงสบาย (Relaxed Gown)', desc: 'ชุดคลุมยาวหลวมสบาย สรีระนุ่มนวลตามธรรมชาติ', icon: '👩‍🍼', protrusion: 'ปกติ' },
  { id: 'standard', name: 'ชุดคลุมยาวมาตรฐาน (Standard Gown)', desc: 'ชุดคลุมโรงพยาบาลมาตรฐาน ระบายอากาศดี', icon: '👘', protrusion: 'พอดีตัว' },
];

export default function DressingRoom() {
  const selectedCharacter = useStore((s) => s.selectedCharacter) || 'postpartum_mother';

  const [isAutoRotate, setIsAutoRotate] = useState(true);
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

          {/* Model Display on Turntable: 100% Female Character Suite + Hand-Locked 3D Baby */}
          {/* key={selectedCharacter} forces remount when switching between Amy/Megan so clonedScene & outfit effects fire fresh */}
          <group position={[0, 0.04, 0]}>
            <MotherAvatar
              key={selectedCharacter}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              currentAnimation="idle"
            />
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

    </group>
  );
}
