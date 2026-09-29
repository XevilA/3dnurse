import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import RealPlant from '../decorations/RealPlant';
import RealTree from '../decorations/RealTree';
import FlowerVase from '../decorations/FlowerVase';
import HospitalSofa from '../furniture/HospitalSofa';
import HospitalWheelchair from '../furniture/HospitalWheelchair';
import DoctorDesk from '../furniture/DoctorDesk';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import Pillows from '../decorations/Pillows';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';
import MedicineCabinet from '../furniture/MedicineCabinet';

export default function LobbyRoom() {
  const setRoom = useStore((state) => state.setRoom);
  const learningProgress = useStore((state) => state.learningProgress);
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      {/* ── Realistic 3D Grand Hospital Lobby Architecture ── */}
      <HospitalRoomShell
        theme="lobby"
        width={28}
        depth={28}
        height={10}
        roomTitle="ศูนย์การเรียนรู้สุขภาพมารดาและทารกแรกเกิด (Metaverse Grand Lobby)"
        roomNumber="Main Reception & Triage"
      />

      {/* Decorative Terrazzo Floor Pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 4.5, 32]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.3} />
      </mesh>

      {/* ── Central Holographic Healthcare Hub ── */}
      <group position={[0, 0, -1]}>
        {/* Tiered Marble Plaza Pedestal */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.6, 0.5, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2.2, 0.35, 32]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Rotating Holographic Earth Globe */}
        <mesh ref={globeRef} position={[0, 2.6, 0]}>
          <sphereGeometry args={[1.3, 24, 24]} />
          <meshStandardMaterial
            color="#00b0ff"
            wireframe
            emissive="#00b0ff"
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* ── Mother Care Zone Portal (Left Side - 4 ห้องจริง) ── */}
      <group position={[-7.5, 0, -6]}>
        {/* Portal Arch 3D (Clickable to enter Zone) */}
        <mesh
          position={[0, 3.5, 0]}
          castShadow
          onClick={(e) => { e.stopPropagation(); setRoom('motherCare1'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[4.2, 6.2, 0.4]} />
          <meshStandardMaterial color="#fce4ec" roughness={0.3} />
        </mesh>
        <mesh
          position={[0, 3.5, 0.05]}
          onClick={(e) => { e.stopPropagation(); setRoom('motherCare1'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[3.8, 5.8, 0.4]} />
          <meshStandardMaterial color="#f8bbd0" emissive="#ff80ab" emissiveIntensity={0.2} />
        </mesh>
        {/* Glowing Portal Arch Header */}
        <mesh position={[0, 6.5, 0.2]}>
          <boxGeometry args={[4.6, 0.9, 0.25]} />
          <meshStandardMaterial color="#e91e63" emissive="#e91e63" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 3, 1]} color="#ff80ab" intensity={1.5} distance={6} />
      </group>

      {/* ── Newborn Care Zone Portal (Right Side - 5 ห้องจริง ครบ 100%) ── */}
      <group position={[7.5, 0, -6]}>
        {/* Portal Arch 3D (Clickable to enter Zone) */}
        <mesh
          position={[0, 3.5, 0]}
          castShadow
          onClick={(e) => { e.stopPropagation(); setRoom('newbornCare1'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[4.2, 6.2, 0.4]} />
          <meshStandardMaterial color="#e1f5fe" roughness={0.3} />
        </mesh>
        <mesh
          position={[0, 3.5, 0.05]}
          onClick={(e) => { e.stopPropagation(); setRoom('newbornCare1'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[3.8, 5.8, 0.4]} />
          <meshStandardMaterial color="#b3e5fc" emissive="#03a9f4" emissiveIntensity={0.2} />
        </mesh>
        {/* Glowing Portal Arch Header */}
        <mesh position={[0, 6.5, 0.2]}>
          <boxGeometry args={[4.6, 0.9, 0.25]} />
          <meshStandardMaterial color="#0288d1" emissive="#0288d1" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 3, 1]} color="#40c4ff" intensity={1.5} distance={6} />
      </group>

      {/* ── Quiz Portal (Back Center) ── */}
      <group position={[0, 0, -11]}>
        <mesh
          position={[0, 2.5, 0]}
          castShadow
          onClick={(e) => { e.stopPropagation(); setRoom('quiz'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <cylinderGeometry args={[1.5, 1.8, 3.5, 32]} />
          <meshStandardMaterial color="#ede7f6" roughness={0.3} />
        </mesh>
        <mesh
          position={[0, 2.5, 0.05]}
          onClick={(e) => { e.stopPropagation(); setRoom('quiz'); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <cylinderGeometry args={[1.3, 1.6, 3.2, 32]} />
          <meshStandardMaterial color="#d1c4e9" emissive="#7e57c2" emissiveIntensity={0.3} />
        </mesh>
        <pointLight position={[0, 2.5, 1]} color="#b388ff" intensity={1.5} distance={6} />
      </group>

      {/* ── Authentic 3D Hospital Ambience & Nature (Trees, Plants & Furniture) ── */}
      {/* Real 3D Trees in 4 Corners */}
      <RealTree position={[-11.5, 0, -11]} scale={0.9} />
      <RealTree position={[11.5, 0, -11]} scale={0.9} />
      <RealTree position={[-11.5, 0, 10]} scale={0.8} />
      <RealTree position={[11.5, 0, 10]} scale={0.8} />

      {/* Real 3D Potted Plants Flanking Portals & Hallways */}
      <RealPlant type="potted" position={[-5.0, 0, -6.2]} scale={1.15} />
      <RealPlant type="house" position={[5.0, 0, -6.2]} scale={1.05} />
      <RealPlant type="succulent" position={[-11.5, 0, 4.5]} scale={1.25} />
      <RealPlant type="succulent" position={[11.5, 0, 4.5]} scale={1.25} />

      {/* Real 3D Hospital Lounge Sofas (Waiting Areas with Soft Cushions) */}
      <group position={[-11.2, 0, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <HospitalSofa position={[0, 0, 0]} scale={1.15} />
        <Pillows position={[0.2, 0.45, 0]} scale={0.85} />
      </group>
      <group position={[11.2, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <HospitalSofa position={[0, 0, 0]} scale={1.15} />
        <Pillows position={[-0.2, 0.45, 0]} scale={0.85} />
      </group>

      {/* Patient Mobility Bay: 2 Real Hospital Wheelchairs */}
      <HospitalWheelchair position={[-8.5, 0, 4.5]} rotation={[0, 0.4, 0]} scale={1.15} />
      <HospitalWheelchair position={[-7.2, 0, 5.2]} rotation={[0, 0.6, 0]} scale={1.15} />

      {/* Nurse Information & Triage Desk with Fresh Flowers & Examination Lamp */}
      <DoctorDesk position={[0, 0, -4.2]} rotation={[0, 0, 0]} scale={1.05} />
      <FlowerVase position={[0.65, 0.85, -4.2]} scale={1.1} />
      <ExaminationLamp position={[-0.65, 0.85, -4.0]} scale={0.7} />

      {/* Emergency First Aid & Hygiene Cabinet */}
      <MedicineCabinet position={[12.2, 0, -4.5]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} withMedicalBox={true} />

      {/* Hospital Pedal Waste Bins */}
      <HospitalTrashBin position={[1.8, 0, -4.5]} scale={0.85} />
      <HospitalTrashBin position={[-10.2, 0, 2.5]} scale={0.85} />

      {/* ── GTA 3rd/1st-Person Player Character ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
