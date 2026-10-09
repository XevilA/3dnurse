import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyCrib from '../furniture/BabyCrib';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import MedicineCabinet from '../furniture/MedicineCabinet';
import DoctorDesk from '../furniture/DoctorDesk';
import HospitalSofa from '../furniture/HospitalSofa';
import InteractiveSeat from '../furniture/InteractiveSeat';
import Pillows from '../decorations/Pillows';
import { getQuestionsByRoomKey } from '../../data/quizData';

export default function NewbornCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby, openLightbox } = useStore();
  const [activeTab, setActiveTab] = useState(0); // 0: Safe Sleep Practice, 1: ตรวจความปลอดภัยในเปล, 2: สภาพแวดล้อมห้อง, 3: แบบประเมิน

  // ── กิจกรรม 1: ท่านอนที่ปลอดภัย (Safe Sleep Practice: Back to Sleep) ──
  const [sleepPose, setSleepPose] = useState('supine'); // 'supine' (หงาย) | 'prone' (คว่ำ) | 'side' (ตะแคง)
  const [act1Feedback, setAct1Feedback] = useState({
    pass: true,
    msg: '✓ ท่านอนหงาย (Supine position) เป็นท่านอนที่ปลอดภัยที่สุดตามคำแนะนำของ AAP และ WHO ช่วยลดความเสี่ยงต่อภาวะทารกเสียชีวิตเฉียบพลันขณะหลับ (SIDS)'
  });

  const handleSelectSleepPose = (pose) => {
    setSleepPose(pose);
    if (pose === 'supine') {
      setAct1Feedback({
        pass: true,
        msg: '✓ ถูกต้องยอดเยี่ยม! ท่านอนหงาย (Back to Sleep) เป็นท่านอนที่ปลอดภัยที่สุดสำหรับทารกแรกเกิด ทั้งเวลากลางวันและกลางคืน ทางเดินหายใจจะเปิดโล่ง ไม่ถูกกดทับ'
      });
    } else if (pose === 'prone') {
      setAct1Feedback({
        pass: false,
        msg: '✕ อันตรายมาก! ท่านอนคว่ำ (Prone) เพิ่มความเสี่ยงต่อการขาดอากาศหายใจและการเสียชีวิตเฉียบพลัน (SIDS) ห้ามให้ทารกนอนคว่ำโดยไม่มีผู้ดูแลใกล้ชิด'
      });
    } else {
      setAct1Feedback({
        pass: false,
        msg: '✕ ไม่แนะนำ: ท่านอนตะแคง (Side) ไม่ปลอดภัยเนื่องจากทารกสามารถพลิกคว่ำหน้าลงไปได้ง่าย เสี่ยงต่อการอุดกั้นทางเดินหายใจ'
      });
    }
  };

  // ── กิจกรรม 2: ตรวจความปลอดภัยในเปลนอน (Bare is Best) ──
  // วัตถุในเปล: อะไรควรอยู่ / อะไรต้องนำออก
  const [cribItems, setCribItems] = useState([
    { id: 'mattress', name: 'ที่นอนแน่นและเรียบ (Firm Mattress) ผ้าปูตึงพอดี', keep: true, status: 'kept' },
    { id: 'baby_clothing', name: 'เสื้อผ้าเด็กพอดีตัว อบอุ่นกำลังดี', keep: true, status: 'kept' },
    { id: 'pillow', name: 'หมอนหนุนศีรษะนุ่มๆ', keep: false, status: 'in_crib' },
    { id: 'bolster', name: 'หมอนข้างนิ่มๆ วางขนาบข้างลำตัว', keep: false, status: 'in_crib' },
    { id: 'doll', name: 'ตุ๊กตาผ้า / ของเล่นนุ่มนิ่ม', keep: false, status: 'in_crib' },
    { id: 'thick_blanket', name: 'ผ้านวมหนา / ผ้าห่มขนสัตว์ฟู', keep: false, status: 'in_crib' },
  ]);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const toggleCribItem = (id) => {
    setCribItems(prev => prev.map(item => item.id === id ? { ...item, status: item.status === 'in_crib' ? 'removed' : 'in_crib' } : item));
    setAct2Feedback(null);
  };

  const checkCribSafety = () => {
    // Correct if all unsafe items are 'removed'
    const unsafeItems = cribItems.filter(i => !i.keep);
    const allUnsafeRemoved = unsafeItems.every(i => i.status === 'removed');

    if (allUnsafeRemoved) {
      setAct2Feedback({
        pass: true,
        msg: '✓ ยอดเยี่ยมมาก! เปลนอนปลอดภัย 100% ตามหลัก "Bare is Best" ไม่มีหมอน หมอนข้าง ตุ๊กตา หรือผ้านวมหนา ที่อาจตกลงมาอุดกั้นจมูกและปากของทารก'
      });
    } else {
      setAct2Feedback({
        pass: false,
        msg: '✕ ยังมีสิ่งของอันตรายอยู่ในเปลนอน! กรุณานำหมอน หมอนข้าง ตุ๊กตา และผ้านวมหนาออกจากเปลให้หมด'
      });
    }
  };

  // ── กิจกรรม 3: สภาพแวดล้อมห้องนอนที่ปลอดภัย ──
  const [envFactors, setEnvFactors] = useState({
    temp: '25', // '25' | 'cold' | 'hot'
    smoke: 'no', // 'no' | 'yes'
    room_share: 'share_crib', // 'share_crib' | 'share_bed' | 'separate_room'
  });
  const [act3Feedback, setAct3Feedback] = useState(null);

  const checkEnv = () => {
    const isTempOk = envFactors.temp === '25';
    const isSmokeOk = envFactors.smoke === 'no';
    const isShareOk = envFactors.room_share === 'share_crib';

    if (isTempOk && isSmokeOk && isShareOk) {
      setAct3Feedback({
        pass: true,
        msg: '✓ การจัดสภาพแวดล้อมถูกต้องสมบูรณ์! อุณหภูมิ 25–26°C อากาศถ่ายเท ปลอดควันบุหรี่ 100% และนอนในเปลเด็กข้างเตียงแม่ (Room-sharing) ช่วยลดความเสี่ยง SIDS ได้ถึง 50%'
      });
    } else {
      setAct3Feedback({
        pass: false,
        msg: '✕ กรุณาปรับสภาพแวดล้อมให้เหมาะสม: อุณหภูมิห้อง 25–26°C ปลอดควันบุหรี่ และนอนในเปลเด็กแยกต่างหากข้างเตียงแม่ ไม่นอนเตียงเดียวกันเพื่อป้องกันการนอนทับ'
      });
    }
  };

  // ── แบบประเมินความรู้ท้ายห้อง (ข้อ 13 & 15) ──
  const room4Questions = getQuestionsByRoomKey('newbornCare4');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizUserChoice, setQuizUserChoice] = useState(null);
  const [quizShowFeedback, setQuizShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = room4Questions[quizIndex] || room4Questions[0];

  const handleQuizAnswer = (choice) => {
    if (quizShowFeedback) return;
    setQuizUserChoice(choice);
    setQuizShowFeedback(true);
    if (choice === currentQ.answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room4Questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('newbornCare4');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านบทเรียนและการประเมินความรู้ห้อง Nursery 204 แล้ว (ได้ ${quizScore + (quizUserChoice === currentQ.answer ? 1 : 0)}/${room4Questions.length} คะแนน)`
      );
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Hospital Room Architecture ── */}
      <HospitalRoomShell
        theme="mother"
        roomTitle="ห้องบริบาลทารก 4: สภาพแวดล้อมที่ปลอดภัยสำหรับทารก (Safe Sleep)"
        roomNumber="Safe Nursery Ward 204"
      />

      {/* ── REAL 3D ASSETS ── */}
      <RealPlant type="potted" position={[7.2, 0, -7.2]} scale={1.1} />
      <RealPlant type="succulent" position={[-7.5, 0, 6.5]} scale={1.2} />
      <MedicineCabinet position={[7.8, 0, -2.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} withMedicalBox={true} />

      {/* ══════════════════════════════════════════════════════════════════════════
          1. 3D SIDS CRIB SIMULATION (จำลอง 3 มิติ: พลิกตัวทารก & หยิบของออกจากเปล)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[-3.8, 0, -3.2]}>
        <BabyCrib position={[0, 0, 0]} scale={1.12}>
          {/* SIDS Risk Aura Indicator on Mattress */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 0.65]} />
            <meshBasicMaterial
              color={sleepPose === 'prone' || cribItems.some(i => !i.keep && i.status === 'in_crib') ? '#ef4444' : '#10b981'}
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Baby Avatar inside Crib with Supine/Prone Flip */}
          {!isHoldingBaby && (
            <group
              position={[0, sleepPose === 'prone' ? 0.06 : 0, 0]}
              rotation={sleepPose === 'prone' ? [Math.PI, 0, 0] : [0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSleepPose(sleepPose === 'prone' ? 'supine' : 'prone');
              }}
              className="cursor-pointer"
            >
              <BabyAvatar
                pose="sleeping"
                position={[0, 0, 0]}
                scale={1.0}
                withBlanket={cribItems.find(i => i.id === 'baby_clothing')?.status === 'kept'}
                blanketColor={sleepPose === 'prone' ? '#fecaca' : '#bae6fd'}
              />
            </group>
          )}

          {/* ── 3D Interactive Crib Hazards (คลิกหยิบออกจากเปลได้) ── */}
          {/* 1. หมอนหนุนศีรษะ (Soft Pillow Hazard) */}
          {cribItems.find(i => i.id === 'pillow')?.status === 'in_crib' && (
            <group
              position={[0, 0.05, -0.22]}
              onClick={(e) => {
                e.stopPropagation();
                toggleCribItem('pillow');
              }}
              className="cursor-pointer"
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.06, 0.24]} />
                <meshStandardMaterial color="#fbcfe8" roughness={0.9} />
              </mesh>
              <Html position={[0, 0.12, 0]} center distanceFactor={14}>
                <span className="select-none bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-pulse">
                  ⚠️ หมอน (คลิกหยิบออก)
                </span>
              </Html>
            </group>
          )}

          {/* 2. ตุ๊กตาผ้า / ของเล่นนุ่มนิ่ม (Plush Teddy Bear Hazard) */}
          {cribItems.find(i => i.id === 'doll')?.status === 'in_crib' && (
            <group
              position={[0.34, 0.06, 0.08]}
              rotation={[0, -0.4, 0.1]}
              onClick={(e) => {
                e.stopPropagation();
                toggleCribItem('doll');
              }}
              className="cursor-pointer"
            >
              {/* Teddy Body */}
              <mesh castShadow>
                <sphereGeometry args={[0.075, 16, 16]} />
                <meshStandardMaterial color="#d97706" roughness={0.95} />
              </mesh>
              {/* Teddy Head */}
              <mesh position={[0, 0.085, 0]} castShadow>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial color="#d97706" roughness={0.95} />
              </mesh>
              {/* Ears */}
              <mesh position={[-0.04, 0.13, 0]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
              <mesh position={[0.04, 0.13, 0]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
              <Html position={[0, 0.18, 0]} center distanceFactor={14}>
                <span className="select-none bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-pulse">
                  ⚠️ ตุ๊กตา (คลิกหยิบออก)
                </span>
              </Html>
            </group>
          )}

          {/* 3. หมอนข้างนิ่มๆ (Bolster Hazard) */}
          {cribItems.find(i => i.id === 'bolster')?.status === 'in_crib' && (
            <group
              position={[-0.32, 0.05, 0]}
              rotation={[0, 0, Math.PI / 2]}
              onClick={(e) => {
                e.stopPropagation();
                toggleCribItem('bolster');
              }}
              className="cursor-pointer"
            >
              <mesh castShadow receiveShadow>
                <capsuleGeometry args={[0.045, 0.45, 8, 16]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.9} />
              </mesh>
              <Html position={[0, 0.15, 0]} center distanceFactor={14}>
                <span className="select-none bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-pulse">
                  ⚠️ หมอนข้าง (คลิกหยิบออก)
                </span>
              </Html>
            </group>
          )}

          {/* 4. ผ้านวมหนา / ผ้าห่มฟู (Thick Blanket Hazard) */}
          {cribItems.find(i => i.id === 'thick_blanket')?.status === 'in_crib' && (
            <group
              position={[0, 0.04, 0.22]}
              onClick={(e) => {
                e.stopPropagation();
                toggleCribItem('thick_blanket');
              }}
              className="cursor-pointer"
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.05, 0.24]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
              </mesh>
              <Html position={[0, 0.12, 0]} center distanceFactor={14}>
                <span className="select-none bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-pulse">
                  ⚠️ ผ้านวมหนา (คลิกหยิบออก)
                </span>
              </Html>
            </group>
          )}
        </BabyCrib>

        {/* 3D Crib Control Floating Action Bar */}
        <Html position={[0, 1.45, 0]} center distanceFactor={16}>
          <div className="flex flex-col items-center gap-1.5 select-none whitespace-nowrap">
            {/* Flip Baby Button */}
            <button
              onClick={() => handleSelectSleepPose(sleepPose === 'prone' ? 'supine' : 'prone')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95 border-2 border-white ${
                sleepPose === 'prone'
                  ? 'bg-rose-600 hover:bg-rose-500 animate-bounce'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <span>{sleepPose === 'prone' ? '⚠️ นอนคว่ำอยู่ (คลิกพลิกนอนหงาย ป้องกัน SIDS)' : '✓ นอนหงาย (Back to Sleep)'}</span>
            </button>

            {/* Quick Remove All Hazards Button */}
            {cribItems.some(i => !i.keep && i.status === 'in_crib') ? (
              <button
                onClick={() => {
                  setCribItems(prev => prev.map(i => i.keep ? i : { ...i, status: 'removed' }));
                  setAct2Feedback({
                    pass: true,
                    msg: '✓ ยอดเยี่ยมมาก! เปลนอนปลอดภัย 100% ตามหลัก "Bare is Best" ไม่มีหมอน หมอนข้าง ตุ๊กตา หรือผ้านวมหนา'
                  });
                }}
                className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-lg bg-amber-600 hover:bg-amber-500 border border-white transition transform hover:scale-105"
              >
                🧸 หยิบของอันตรายออกจากเปล ({cribItems.filter(i => !i.keep && i.status === 'in_crib').length} ชิ้น)
              </button>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 shadow">
                ✓ เปลโล่งปลอดภัย 100% (Bare is Best)
              </span>
            )}
          </div>
        </Html>
      </group>

      {/* Mother Sofa for Room-Sharing Demo */}
      <InteractiveSeat
        id="nursery204_sofa"
        name="เตียง/โซฟาคุณแม่ข้างเปล"
        type="sofa"
        position={[-6.2, 0, -3.2]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.42, 0.15]}
      >
        <group onClick={() => setActiveTab(2)}>
          <HospitalSofa position={[0, 0, 0]} scale={1.1} />
          <Pillows position={[0.2, 0.45, 0]} scale={0.85} />
        </group>
      </InteractiveSeat>

      {/* Doctor Consultation Desk & Quiz Kiosk */}
      <group position={[4.5, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]}>
        <DoctorDesk position={[0, 0, 0]} scale={0.9} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. 4 MODERN DISPLAY SCREENS (4 หน้าจอแสดงผลทันสมัย กดซูมดูภาพได้)
             Mounted along East Wall (X: 7.8, rotation: [0, -Math.PI / 2, 0])
          ══════════════════════════════════════════════════════════════════════════ */}
      {[
        {
          id: 'screen1',
          pos: [7.8, 2.7, -4.5],
          title: '1. Back to Sleep (ท่านอนหงาย)',
          sub: 'ลดความเสี่ยง SIDS มากกว่า 50%',
          img: '/references/zone1_2/img_007.png',
          details: [
            '1. ท่านอนหงาย (Supine) เป็นท่านอนที่ปลอดภัยที่สุดสำหรับทารกแรกเกิด',
            '2. หลอดลมอยู่เหนือหลอดอาหาร ป้องกันการสำลักและเปิดทางเดินหายใจให้โล่ง',
            '3. ห้ามทารกนอนคว่ำหรือนอนตะแคงโดยไม่มีผู้ดูแลเด็ดขาด'
          ]
        },
        {
          id: 'screen2',
          pos: [7.8, 2.7, -1.5],
          title: '2. Bare is Best (เตียงนอนโล่ง)',
          sub: 'ปราศจากหมอน หมอนข้าง และตุ๊กตา',
          img: '/references/room1/img_001.jpg',
          details: [
            '1. ที่นอนต้องแน่น เรียบ และมีขนาดพอดีกับเปล ไม่มียุบตัว',
            '2. นำหมอน หมอนข้าง ตุ๊กตาผ้า และผ้านวมหนาออกจากเปลทั้งหมด',
            '3. ป้องกันสิ่งของตกลงมาปิดทับปากและจมูกทารกขณะหลับ'
          ]
        },
        {
          id: 'screen3',
          pos: [7.8, 2.7, 1.5],
          title: '3. Room-Sharing (นอนร่วมห้อง)',
          sub: 'แยกเตียงเด็กลดความเสี่ยงนอนทับ',
          img: '/references/zone1_2/img_000.png',
          details: [
            '1. วางเปลนอนของทารกไว้ข้างเตียงคุณแม่ในระยะเอื้อมถึง อย่างน้อย 6 เดือนแรก',
            '2. ไม่ควรให้ทารกนอนบนเตียงเดียวกันกับผู้ใหญ่ (หลีกเลี่ยง Bed-sharing)',
            '3. ช่วยลดความเสี่ยงจากการนอนทับ และช่วยให้ให้นมแม่สะดวก'
          ]
        },
        {
          id: 'screen4',
          pos: [7.8, 2.7, 4.5],
          title: '4. Safe Climate & Smoke-Free',
          sub: 'อุณหภูมิ 25°C ปลอดควันบุหรี่ 100%',
          img: '/references/room2/img_003.png',
          details: [
            '1. ปรับอุณหภูมิห้องให้อยู่ที่ประมาณ 25–26°C อากาศถ่ายเทสะดวก',
            '2. ไม่สวมเสื้อผ้าหนาเกินไปจนร่างกายร้อนจัด (Overheating)',
            '3. ห้องนอนและสภาพแวดล้อมต้องปลอดควันบุหรี่ทั้งมือสองและมือสาม 100%'
          ]
        }
      ].map((scr, idx) => (
        <group key={scr.id} position={scr.pos} rotation={[0, -Math.PI / 2, 0]}>
          {/* Futuristic Backlit Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.6, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* LED Glowing Border */}
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[2.46, 1.66, 0.02]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.6} roughness={0.2} />
          </mesh>
          {/* Glass Screen Face */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.32, 1.52]} />
            <meshStandardMaterial color="#020617" roughness={0.1} />
          </mesh>

          {/* Interactive Screen Overlay */}
          <Html position={[0, 0, 0.06]} center transform scale={0.21}>
            <div
              className="select-none bg-slate-950/95 text-white rounded-xl p-3 shadow-2xl flex flex-col justify-between border-2 border-cyan-400"
              style={{ width: '420px', height: '280px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-800/60 pb-1.5">
                <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                  🖥️ หน้าจออัจฉริยะ {idx + 1}/4
                </span>
                <button
                  onClick={() => openLightbox({
                    src: scr.img,
                    title: scr.title,
                    caption: scr.sub,
                    category: 'สภาพแวดล้อมที่ปลอดภัย (Nursery 204)',
                    clinicalDetails: scr.details
                  })}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1"
                >
                  🔍 ขยายภาพ
                </button>
              </div>

              {/* Screen Graphic & Info */}
              <div
                className="my-1.5 flex-1 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800 cursor-pointer flex items-center justify-center group"
                onClick={() => openLightbox({
                  src: scr.img,
                  title: scr.title,
                  caption: scr.sub,
                  category: 'สภาพแวดล้อมที่ปลอดภัย (Nursery 204)',
                  clinicalDetails: scr.details
                })}
              >
                <img
                  src={scr.img}
                  alt={scr.title}
                  className="w-full h-full object-cover p-1 group-hover:scale-105 transition"
                />
                <div className="absolute bottom-1 inset-x-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-center">
                  <div className="font-bold text-cyan-200 text-xs truncate">{scr.title}</div>
                  <div className="text-[10px] text-slate-300 truncate">{scr.sub}</div>
                </div>
              </div>

              {/* Bottom Clinical Note */}
              <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>มาตรฐานความปลอดภัย AAP & WHO</span>
                <span className="text-cyan-400 font-semibold underline cursor-pointer" onClick={() => openLightbox({
                  src: scr.img,
                  title: scr.title,
                  caption: scr.sub,
                  category: 'สภาพแวดล้อมที่ปลอดภัย (Nursery 204)',
                  clinicalDetails: scr.details
                })}>
                  คลิกดูรายละเอียด ➔
                </span>
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* ══════════════════════════════════════════════════════════════════════════
          🏠 INTERACTIVE LEARNING HUD (Nursery 204: Safe Sleep Environment)
          ══════════════════════════════════════════════════════════════════════════ */}
      <Html position={[0, 1.85, -7.8]} center transform scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.22 : 0.27}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '24px',
          borderRadius: '24px',
          width: '880px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '3px solid #38bdf8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e0f2fe', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ background: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
                NURSERY 204: สภาพแวดล้อมที่ปลอดภัยสำหรับทารก (Safe Sleep)
              </span>
              <h2 style={{ margin: '6px 0 0 0', color: '#0369a1', fontSize: '22px' }}>
                {activeTab === 0 && 'ท่านอนที่ปลอดภัยสำหรับทารก (Back to Sleep)'}
                {activeTab === 1 && 'การจัดเตียงนอนที่ปลอดภัยตามหลัก Bare is Best'}
                {activeTab === 2 && 'การควบคุมสภาพแวดล้อมห้องนอน (อุณหภูมิและการนอนร่วมห้อง)'}
                {activeTab === 3 && 'แบบประเมินความรู้ประจำห้อง Nursery 204 (ข้อ 13 & 15)'}
              </h2>
            </div>
            <button
              onClick={() => setRoom('lobby')}
              style={{ background: '#f3f4f6', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ⬅ กลับสู่ล็อบบี้
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            {['1. ท่านอนที่ปลอดภัย', '2. ตรวจความปลอดภัยในเปล', '3. สภาพแวดล้อมห้องนอน', '4. แบบประเมิน (Quiz)'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === idx ? '#0284c7' : '#e0f2fe',
                  color: activeTab === idx ? 'white' : '#0369a1',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── TAB 0: ท่านอนที่ปลอดภัย ── */}
          {activeTab === 0 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>เป้าหมาย:</strong> เรียนรู้ท่านอนที่ถูกต้องและปลอดภัยที่สุดสำหรับทารกแรกเกิดตามมาตรฐานของ AAP และ WHO เพื่อป้องกัน SIDS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div
                  onClick={() => handleSelectSleepPose('supine')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'supine' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                    background: sleepPose === 'supine' ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>👶💤</div>
                  <strong style={{ fontSize: '15px', color: '#166534', display: 'block', marginBottom: '6px' }}>
                    1. ท่านอนหงาย (Supine)
                  </strong>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    ปลอดภัยที่สุด (แนะนำ)
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    ทางเดินหายใจเปิดโล่ง ลิ้นไม่ตกไปอุดหลอดลม ลดความเสี่ยงทารกเสียชีวิตเฉียบพลันขณะหลับ (SIDS)
                  </p>
                </div>

                <div
                  onClick={() => handleSelectSleepPose('prone')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'prone' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    background: sleepPose === 'prone' ? '#fef2f2' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>⚠️</div>
                  <strong style={{ fontSize: '15px', color: '#991b1b', display: 'block', marginBottom: '6px' }}>
                    2. ท่านอนคว่ำ (Prone)
                  </strong>
                  <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    อันตราย ห้ามทำเด็ดขาด
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    เสี่ยงต่อการขาดอากาศหายใจ ใบหน้าแนบที่นอน และเพิ่มความร้อนในร่างกายสูงเกินไป
                  </p>
                </div>

                <div
                  onClick={() => handleSelectSleepPose('side')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: sleepPose === 'side' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    background: sleepPose === 'side' ? '#fffbeb' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔄</div>
                  <strong style={{ fontSize: '15px', color: '#b45309', display: 'block', marginBottom: '6px' }}>
                    3. ท่านอนตะแคง (Side)
                  </strong>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    ไม่แนะนำ
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569', textAlign: 'left', lineHeight: '1.4' }}>
                    ไม่มั่นคง ทารกสามารถพลิกคว่ำหน้าลงไปได้ง่าย เสี่ยงต่อการอุดกั้นทางเดินหายใจ
                  </p>
                </div>
              </div>

              {act1Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act1Feedback.pass ? '#dcfce7' : '#fee2e2', color: act1Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act1Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ไปตรวจความปลอดภัยในเปลนอน ➜
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 1: ตรวจความปลอดภัยในเปล (Bare is Best) ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>หลักการ Bare is Best:</strong> เปลนอนของทารกควรมีเพียง "ที่นอนแน่นเรียบและตัวทารก" เท่านั้น สิ่งของนุ่มๆ เช่น หมอน หมอนข้าง ตุ๊กตา หรือผ้านวมหนา ต้องนำออกจากเปลทั้งหมด
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {cribItems.filter(i => !i.keep).map(item => {
                  const isRemoved = item.status === 'removed';
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCribItem(item.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: isRemoved ? '2px solid #16a34a' : '2px solid #dc2626',
                        background: isRemoved ? '#f0fdf4' : '#fef2f2',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: isRemoved ? '#166534' : '#991b1b' }}>{item.name}</strong>
                        <div style={{ fontSize: '11px', color: isRemoved ? '#15803d' : '#b91c1c', marginTop: '2px' }}>
                          {isRemoved ? '✓ นำออกจากเปลแล้ว (ปลอดภัย)' : '⚠️ ยังอยู่ในเปล (เสี่ยงอุดกั้นทางเดินหายใจ)'}
                        </div>
                      </div>
                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: isRemoved ? '#16a34a' : '#dc2626',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {isRemoved ? 'ปลอดภัย' : 'คลิกนำออก'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {act2Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act2Feedback.pass ? '#dcfce7' : '#fee2e2', color: act2Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act2Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkCribSafety}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจสอบความปลอดภัยของเปลนอน
                </button>
                {act2Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(2)}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ไปตั้งค่าสภาพแวดล้อมห้องนอน ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: สภาพแวดล้อมห้องนอนที่ปลอดภัย ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', borderLeft: '4px solid #0284c7' }}>
                <strong>เป้าหมาย:</strong> กำหนดอุณหภูมิห้อง คุณภาพอากาศ และรูปแบบการนอนร่วมห้องที่ปลอดภัย
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {/* Temp */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>1. อุณหภูมิห้องนอน:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>อุณหภูมิที่เหมาะสมช่วยให้ทารกหลับสบาย ไม่ร้อนหรือเย็นเกินไป</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'cold', label: 'หนาวเกินไป (< 22°C)' }, { val: '25', label: 'พอดี (25–26°C)' }, { val: 'hot', label: 'ร้อนจัด (> 28°C)' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, temp: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.temp === opt.val ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          background: envFactors.temp === opt.val ? '#e0f2fe' : 'white',
                          color: envFactors.temp === opt.val ? '#0369a1' : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smoke */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>2. ควันบุหรี่ / มลพิษ:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>ควันบุหรี่มือสองและมือสามเพิ่มความเสี่ยง SIDS และโรคปอด</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'no', label: 'ปลอดควันบุหรี่ 100%' }, { val: 'yes', label: 'อนุญาตให้สูบในห้อง' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, smoke: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.smoke === opt.val ? (opt.val === 'no' ? '2px solid #16a34a' : '2px solid #dc2626') : '1px solid #cbd5e1',
                          background: envFactors.smoke === opt.val ? (opt.val === 'no' ? '#dcfce7' : '#fee2e2') : 'white',
                          color: envFactors.smoke === opt.val ? (opt.val === 'no' ? '#15803d' : '#991b1b') : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room sharing */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>3. รูปแบบการนอนร่วมห้อง:</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>การนอนห้องเดียวกันแต่แยกเปลนอน (Room-sharing without Bed-sharing)</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[{ val: 'share_crib', label: 'นอนเปลแยกข้างเตียงแม่' }, { val: 'share_bed', label: 'นอนเตียงเดียวกับพ่อแม่' }].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => { setEnvFactors(p => ({ ...p, room_share: opt.val })); setAct3Feedback(null); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '2px solid #16a34a' : '2px solid #dc2626') : '1px solid #cbd5e1',
                          background: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '#dcfce7' : '#fee2e2') : 'white',
                          color: envFactors.room_share === opt.val ? (opt.val === 'share_crib' ? '#15803d' : '#991b1b') : '#475569',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {act3Feedback && (
                <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', background: act3Feedback.pass ? '#dcfce7' : '#fee2e2', color: act3Feedback.pass ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: 'bold' }}>
                  {act3Feedback.msg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={checkEnv}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  ✓ ตรวจสอบสภาพแวดล้อมห้องนอน
                </button>
                {act3Feedback?.pass && (
                  <button
                    onClick={() => setActiveTab(3)}
                    style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    ทำแบบประเมินความรู้ท้ายบท ➜
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: แบบประเมินความรู้ประจำห้อง Nursery 204 (ข้อ 13 & 15) ── */}
          {activeTab === 3 && (
            <div>
              {!quizFinished ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      📋 แบบประเมิน: {currentQ.room}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                      ข้อ {quizIndex + 1} / {room4Questions.length} | คะแนนสะสม: {quizScore}
                    </span>
                  </div>

                  <h3 style={{ color: '#222', fontSize: '17px', fontWeight: 'bold', lineHeight: '1.45', margin: '0 0 16px 0' }}>
                    "{currentQ.question}"
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(true)}
                      style={{
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === true ? '#16a34a' : (quizUserChoice === true ? '#0284c7' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === true ? '#dcfce7' : (quizUserChoice === true ? '#e0f2fe' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === true ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer'
                      }}
                    >
                      ✓ ถูก (True)
                    </button>
                    <button
                      disabled={quizShowFeedback}
                      onClick={() => handleQuizAnswer(false)}
                      style={{
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: quizShowFeedback && currentQ.answer === false ? '#16a34a' : (quizUserChoice === false ? '#0284c7' : '#d1d5db'),
                        background: quizShowFeedback && currentQ.answer === false ? '#dcfce7' : (quizUserChoice === false ? '#e0f2fe' : '#f9fafb'),
                        color: quizShowFeedback && currentQ.answer === false ? '#15803d' : '#1f2937',
                        cursor: quizShowFeedback ? 'default' : 'pointer'
                      }}
                    >
                      ✕ ผิด (False)
                    </button>
                  </div>

                  {quizShowFeedback && (
                    <div style={{
                      background: quizUserChoice === currentQ.answer ? '#f0fdf4' : '#fffbeb',
                      border: `1.5px solid ${quizUserChoice === currentQ.answer ? '#86efac' : '#fde68a'}`,
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px', color: quizUserChoice === currentQ.answer ? '#16a34a' : '#d97706' }}>
                          {quizUserChoice === currentQ.answer ? '🎉 ถูกต้อง! (+1 คะแนน)' : `⚠️ เฉลย: ${currentQ.answerText}`}
                        </span>
                        <button
                          onClick={handleNextQuizQuestion}
                          style={{
                            padding: '6px 16px',
                            background: '#0284c7',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          {quizIndex < room4Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สำเร็จบทเรียน 🏆'}
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.4' }}>
                        <strong>💡 เหตุผล:</strong> {currentQ.reason}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <h2 style={{ color: '#2e7d32', fontSize: '24px', margin: '0 0 10px 0' }}>🎉 ผ่านบทเรียนและการประเมินความรู้ Nursery 204 แล้ว!</h2>
                  <div style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    คะแนนของคุณ: <strong>{quizScore} / {room4Questions.length} คะแนน</strong>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    คุณมีความเข้าใจที่ถูกต้องในการจัดสภาพแวดล้อมที่ปลอดภัยสำหรับทารกตามหลัก Safe Sleep สากล
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      onClick={() => { setQuizIndex(0); setQuizUserChoice(null); setQuizShowFeedback(false); setQuizScore(0); setQuizFinished(false); }}
                      style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 'bold', background: '#f3f4f6', color: '#333', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      ทำแบบประเมินซ้ำ ↻
                    </button>
                    <button
                      onClick={() => setRoom('lobby')}
                      style={{ padding: '8px 20px', fontSize: '14px', fontWeight: 'bold', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      กลับสู่ล็อบบี้ 🏥
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Html>

      {/* ── GTA Player Controller ── */}
      <PlayerController initialPosition={[0, 0, 3]} />
    </group>
  );
}
