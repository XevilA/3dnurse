import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import Washbasin from '../furniture/Washbasin';
import MedicalCart from '../furniture/MedicalCart';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import ExaminationLamp from '../decorations/ExaminationLamp';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

export default function NewbornCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby } = useStore();
  const [step, setStep] = useState(0);

  const stepsData = [
    { title: "1. การล้างมือและการเตรียมอุปกรณ์", desc: "ล้างมือด้วยสบู่ให้สะอาดก่อนทำความสะอาดสายสะดือ เตรียมสำลีก้อนสะอาด และแอลกอฮอล์ 70%" },
    { title: "2. เทคนิคการเช็ดสายสะดือ", desc: "ใช้สำลีชุบแอลกอฮอล์ 70% เช็ดวนจากโคนสะดือขึ้นสู่ปลายสะดือ และเปลี่ยนสำลีก้อนใหม่ทุกครั้ง ไม่เช็ดย้อนกลับ" },
    { title: "3. การพับผ้าอ้อมใต้สะดือ", desc: "พับขอบผ้าอ้อมลงมาให้อยู่ใต้สะดือเสมอ เพื่อให้สายสะดือแห้ง ไม่อับชื้น และป้องกันการปนเปื้อนปัสสาวะ" },
    { title: "4. สัญญาณอันตรายของสายสะดือ", desc: "โคนสะดือบวมแดง มีหนอง มีกลิ่นเหม็น หรือเลือดไหลไม่หยุด ควรรีบพาทารกไปพบแพทย์ทันที" }
  ];

  const handleNext = () => {
    if (step < stepsData.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
      completeModule('newbornCare4');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณเรียนรู้บทเรียนการดูแลสายสะดือสำเร็จแล้ว');
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="newborn"
        roomTitle="ห้องบริบาลทารก: การดูแลสายสะดือทารกแรกเกิด"
        roomNumber="Umbilical Care 204"
      />

      {/* Header Info */}
      <Html position={[0, 6.6, -8.4]} center transform>
        <div style={{ background: 'white', padding: '14px 24px', borderRadius: '16px', textAlign: 'center', minWidth: '380px', boxShadow: '0 8px 24px rgba(14,165,233,0.15)', border: '2px solid #7dd3fc' }}>
          <h2 style={{ color: '#0284c7', margin: 0, fontSize: '20px' }}>🔗 บทเรียนที่ 4: การดูแลสายสะดือทารกแรกเกิด</h2>
          <p style={{ color: '#555', margin: '6px 0 0 0', fontWeight: 'bold' }}>ขั้นตอน: {Math.min(step + 1, stepsData.length)} / {stepsData.length}</p>
        </div>
      </Html>

      {/* ── REAL 3D ASSETS & NATURE ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />

      {/* Antiseptic and Cord Dressing Supply Cabinet */}
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* Sanitary Foot-pedal Waste Bin for Used Alcohol Swabs */}
      <HospitalTrashBin position={[2.5, 0, -3.2]} scale={0.88} />

      {/* Real Clinical Examination Bed with Baby */}
      <group position={[0, 0, -3.5]} onClick={handleNext} className="cursor-pointer">
        {/* Stainless Steel Frame Legs */}
        {[-0.85, 0.85].map((x) =>
          [-0.45, 0.45].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.42, z]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.84, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.15} />
            </mesh>
          ))
        )}
        {/* Clinical Bed Upper Frame */}
        <mesh position={[0, 0.84, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.06, 1.1]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Padded Clinical Examination Cushion */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.08, 1.02]} />
          <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
        </mesh>
        {/* Soft Glowing Station Beacon */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.35, 32]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.6} />
        </mesh>
        {/* Baby lying on back for cord care */}
        {!isHoldingBaby && (
          <BabyAvatar
            pose="cordCare"
            position={[0, 0.94, 0]}
            scale={0.92}
          />
        )}
        <Html position={[0, 1.7, 0]} center distanceFactor={14}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              useStore.getState().setHoldingBaby(!isHoldingBaby);
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
              border: '2px solid white'
            }}
          >
            <span>🔗</span>
            <span>{isHoldingBaby ? 'วางลูกน้อยบนเตียงตรวจสายสะดือ' : 'ลูกน้อยบนเตียง (คลิกอุ้ม)'}</span>
          </div>
        </Html>
      </group>

      {/* Real Porcelain Washbasin (Mandatory aseptic handwashing) */}
      <group position={[-5.5, 0, 0]} onClick={handleNext}>
        <Washbasin position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Real Clinical Mobile Cart with 70% Alcohol, Sterile Swabs, and Examination Lamp */}
      <group position={[3.8, 0, -3.2]} onClick={handleNext}>
        <MedicalCart position={[0, 0, 0]} withMedicalBox={true} withTape={true} scale={0.88} />
        <ExaminationLamp position={[0.42, 0.98, -0.2]} scale={0.7} />
      </group>

      {/* Educational Interactive Panel */}
      {step < stepsData.length && (
        <Html position={[0, 4.2, -4]} center distanceFactor={15}>
          <div style={{ background: 'white', padding: '22px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '360px', textAlign: 'center', borderTop: '6px solid #0284c7' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '18px' }}>{stepsData[step].title}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{stepsData[step].desc}</p>
            <button
              onClick={handleNext}
              style={{ padding: '8px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              เข้าใจแล้ว ➜ ขั้นถัดไป
            </button>
          </div>
        </Html>
      )}

      {/* ── GTA Player Character ── */}
      <PlayerController initialPosition={[0, 0, 1.5]} />
    </group>
  );
}
