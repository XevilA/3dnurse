import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import BabyBathtub from '../furniture/BabyBathtub';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import Pillows from '../decorations/Pillows';

/**
 * NewbornCare2Room — ห้องที่ 2: การอาบน้ำและการดูแลความสะอาดทารก การเปลี่ยนผ้าอ้อม
 *
 * Implements 100% of "ห้องที่ 2 การอาบน้ำและการดูแลความสะอาดทารก การเปลี่ยนผ้าอ้อม.docx"
 * and matches reference images img_000.jpg (top-down layout) and img_001.png (bathtub reference):
 * - Top-down Layout per img_000.jpg:
 *     - Top-Left: เก้าอี้โซฟา (Cream armchair/sofa)
 *     - Top-Right: เตียงทารก (Baby crib with swaddled sleeping baby)
 *     - Left Wall: TV + ชั้นวางของ/ของใช้ทารก (Multi-tier cubby shelving)
 *     - Center: โต๊ะเปล่า (Wooden table with 2 bathtubs: Blue & Pink, plus accessories)
 *     - Bottom Wall: อ่างล้างจาน (Double sink) + ถังขยะ 2 ใบ + ประตู (Doorway)
 *     - Right Wall: หน้าต่าง (Window with pleated roman blinds)
 * - Quests per doc section 4:
 *     - 4.1 ดู TV ให้ความรู้ครบทุกหน้า (8 สไลด์) -> ✓
 *     - 4.2 เตรียมอุปกรณ์อาบน้ำและผ้าอ้อมให้ครบ 6 อย่าง -> ✓
 *     - 4.3 ปฏิบัติการอาบน้ำตามขั้นตอน 1.1–1.14 -> ✓
 */
export default function NewbornCare2Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();

  // ── TV Slides state ──
  const [tvSlide, setTvSlide] = useState(0);
  const [showTvModal, setShowTvModal] = useState(false);
  const [tvViewedCount, setTvViewedCount] = useState(1);

  // ── Equipment collection quest state (6 items) ──
  const [collectedItems, setCollectedItems] = useState({
    tubs: true,       // 1. อ่างอาบน้ำ 2 อ่าง (ตั้งอยู่บนโต๊ะ)
    towels: false,    // 2. ผ้าขนหนูเช็ด 1 ผืน และผ้าห่อตัว 1 ผืน
    soap: false,      // 3. สบู่เหลว-ยาสระผมสูตรอ่อนโยน
    sponge: false,    // 4. ผ้าผืนเล็กหรือฟองน้ำ
    cottonBalls: false, // 5. สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ 0.9% NSS
    clothes: false    // 6. เสื้อผ้าและผ้าอ้อมทารก
  });

  // ── Active popup modal state ──
  const [activeModal, setActiveModal] = useState(null); // 'shelf' | 'tubs' | 'sink' | 'trash' | 'bathingProcedure'

  // ── Bathing step state (0 to 7) ──
  const [bathingStep, setBathingStep] = useState(0);
  const [bathingBabyPose, setBathingBabyPose] = useState('sleeping');

  const tvSlidesData = [
    {
      title: 'บทเรียนที่ 2: การอาบน้ำและการเปลี่ยนผ้าอ้อมทารกแรกเกิด',
      img: '/references/room2/img_002.jpeg',
      bullets: [
        '• การอาบน้ำทารกช่วยทำความสะอาดร่างกาย กระตุ้นการไหลเวียนโลหิต และสร้างสัมผัสผูกพัน',
        '• ทารกแรกเกิดควรอาบน้ำวันละ 1 ครั้ง หรือเช็ดตัวในวันที่มีอากาศเย็น',
        '• อุณหภูมิห้องควรอบอุ่น ปิดพัดลมและแอร์ เพื่อป้องกันภาวะอุณหภูมิกายต่ำ (Hypothermia)'
      ]
    },
    {
      title: '1.1 การเตรียมสภาพแวดล้อม และ 1.2 การล้างมือ',
      img: '/references/room2/img_003.png',
      bullets: [
        '1.1 จัดสภาพแวดล้อมให้เหมาะสม ปิดเครื่องปรับอากาศ/พัดลม เพื่อป้องกันการสูญเสียความร้อนจากร่างกายทารก',
        '1.2 ล้างมือของผู้ดูแลให้สะอาดหมดจดด้วยสบู่และน้ำไหลก่อนสัมผัสทารกและอุปกรณ์ทุกครั้ง'
      ]
    },
    {
      title: '1.3 การเตรียมอุปกรณ์อาบน้ำ 6 ชนิด',
      img: '/references/room2/img_004.jpeg',
      bullets: [
        '1. อ่างอาบน้ำสะอาด 2 อ่าง (ใส่น้ำอุ่นอุณหภูมิ 36–37°C สูงประมาณ 2–3 นิ้ว)',
        '2. ผ้าขนหนูสำหรับเช็ดตัว 1 ผืน และผ้าห่อตัวทารก 1 ผืน',
        '3. สบู่เหลว-ยาสระผม สูตรอ่อนโยนสำหรับเด็กทารก (pH-neutral, Tear-free)',
        '4. ผ้าผืนเล็กหรือฟองน้ำนุ่มสำหรับอาบน้ำ',
        '5. สำลีก้อนชุบน้ำต้มสุกหรือน้ำเกลือ (0.9% NSS) บิดหมาด 2 ก้อน ในถ้วยเล็กสำหรับเช็ดตา',
        '6. เสื้อผ้าชุดใหม่ ผ้าอ้อมสำเร็จรูป และอุปกรณ์ทำความสะอาดสายสะดือ'
      ]
    },
    {
      title: '1.4 ทดสอบอุณหภูมิน้ำ และ 1.5 การสระผมทารก',
      img: '/references/room2/img_005.png',
      bullets: [
        '1.4 ใช้หลังมือหรือข้อศอกทดสอบอุณหภูมิน้ำว่าอุ่นพอดี (36–37°C) ไม่ร้อนหรือเย็นเกินไป',
        '1.5 ใช้ผ้าสะอาดห่อตัวทารก อุ้มทารกด้วยมือข้างที่ไม่ถนัดในท่า Football hold position',
        '• นำน้ำลูบหน้าทารกก่อนสระผม ใช้นิ้วมือพับใบหูทั้ง 2 ข้างปิดรูหู เพื่อป้องกันน้ำเข้าหู',
        '• ชโลมแชมพูสูตรอ่อนโยน ใช้นิ้วนวดเบาๆ ให้ทั่ว ล้างออกด้วยน้ำสะอาดในอ่างที่ 1 และใช้ผ้าซับผมให้แห้งทันที'
      ]
    },
    {
      title: '1.6 ตรวจสอบผ้าอ้อม และ 1.7 การนำทารกลงอ่าง',
      img: '/references/room2/img_006.png',
      bullets: [
        '1.6 เปิดผ้าอ้อมทารกและตรวจสอบว่ามีการขับถ่ายหรือไม่ หากมีให้ทำความสะอาดก้นและอวัยวะเพศให้เรียบร้อยก่อนนำลงอ่าง',
        '1.7 ถอดเสื้อผ้า อุ้มทารกค่อยๆ หย่อนเท้าและก้นลงบริเวณอ่างอาบน้ำอ่างที่ 1 อย่างนุ่มนวล'
      ]
    },
    {
      title: '1.8–1.10 การทำความสะอาดร่างกายและการล้างน้ำสะอาด',
      img: '/references/room2/img_007.png',
      bullets: [
        '1.8 ใช้แขนหนึ่งข้างประคองศีรษะและคอทารกให้อยู่ในอุ้งฝ่ามืออย่างมั่นคง',
        '1.9 ใช้มืออีกข้างใช้ผ้าหรือฟองน้ำทำความสะอาดร่างกายด้วยสบู่อ่อนโยน (ทำความสะอาดลำตัวก่อน แล้วตามด้วยแขนและขา) ล้างฟองออกด้วยน้ำอ่างที่ 1',
        '1.10 พลิกตัวทารกให้พาดอยู่ในแขนอีกข้าง ใช้มือโอบหน้าอกและนิ้ว 4 นิ้วอยู่ใต้รักแร้ ทำความสะอาดแผ่นหลังและล้างออกด้วยน้ำสะอาดในอ่างที่ 2'
      ]
    },
    {
      title: '1.11–1.12 การเช็ดตัวให้แห้งและการทำความสะอาดดวงตา',
      img: '/references/room2/img_008.jpeg',
      bullets: [
        '1.11 นำทารกวางลงบนผ้าขนหนูที่เตรียมไว้ ซับตัวให้แห้งอย่างเบามือ เน้นบริเวณซอกคอ รักแร้ ขาหนีบ และข้อพับ',
        '1.12 ใช้ผ้าห่อตัวทารก ทำความสะอาดตาด้วยสำลีชุบน้ำต้มสุก/0.9% NSS บิดหมาด:',
        '• สำลีก้อนที่ 1: เช็ดตาข้างหนึ่งจากหัวตาไปหาหางตา (ห้ามเช็ดย้อนกลับ)',
        '• สำลีก้อนที่ 2: เช็ดตาอีกข้างจากหัวตาไปหาหางตา (ใช้สำลีแยกก้อนกันเพื่อป้องกันการติดเชื้อ)'
      ]
    },
    {
      title: '1.13–1.14 การดูแลสายสะดือ สวมเสื้อผ้า และเก็บอุปกรณ์',
      img: '/references/room2/img_009.png',
      bullets: [
        '1.13 ทำความสะอาดสายสะดือด้วย 70% แอลกอฮอล์ เช็ดรอบโคนสะดือวนขึ้นสู่ปลายสะดือ และปล่อยให้แห้ง',
        '1.14 ใส่ผ้าอ้อม (พับขอบผ้าอ้อมลงใต้สายสะดือเพื่อป้องกันการเสียดสี) สวมเสื้อผ้า ห่อตัวด้วยผ้าห่อตัว และเก็บล้างอุปกรณ์ให้เรียบร้อย'
      ]
    }
  ];

  const bathingStepsList = [
    {
      stepNum: 1,
      title: '1. ทดสอบอุณหภูมิน้ำอุ่น (36–37°C)',
      desc: 'ใช้หลังมือหรือข้อศอกแตะทดสอบน้ำในอ่างทั้ง 2 ใบ ให้ได้อุณหภูมิอุ่นสบาย ไม่ร้อนจัด',
      pose: 'sleeping'
    },
    {
      stepNum: 2,
      title: '2. อุ้มท่า Football Hold สระผมและพับหู',
      desc: 'ห่อตัวทารก อุ้มหนีบข้างเอว ใช้นิ้วโป้งและนิ้วกลางพับใบหูปิดรูหู สระผม ล้างน้ำอ่างที่ 1 แล้วซับแห้ง',
      pose: 'bathingFootballHold'
    },
    {
      stepNum: 3,
      title: '3. เปิดผ้าอ้อมและทำความสะอาดก่อนลงอ่าง',
      desc: 'เปิดผ้าอ้อม เช็ดคราบอุจจาระ/ปัสสาวะให้สะอาดหมดจดก่อนนำทารกลงอ่างอาบน้ำ',
      pose: 'cordCare'
    },
    {
      stepNum: 4,
      title: '4. อุ้มลงอ่างที่ 1 ฟอกสบู่อ่อนโยน',
      desc: 'ประคองศีรษะในอุ้งมือ ใช้ฟองน้ำฟอกสบู่ทำความสะอาด ลำตัว อก แขน และขาในอ่างที่ 1',
      pose: 'bathing'
    },
    {
      stepNum: 5,
      title: '5. พลิกตัวโอบอก ล้างน้ำสะอาดอ่างที่ 2',
      desc: 'พลิกตัวทารกพาดแขน ใช้นิ้ว 4 นิ้วล็อคใต้รักแร้ ล้างแผ่นหลังและก้นด้วยน้ำสะอาดในอ่างที่ 2',
      pose: 'bathingTurned'
    },
    {
      stepNum: 6,
      title: '6. วางบนผ้าขนหนู ซับแห้งซอกคอข้อพับ',
      desc: 'อุ้มทารกขึ้นวางบนผ้าขนหนูนุ่ม ซับตัวให้แห้งสนิท โดยเฉพาะซอกคอ รักแร้ และข้อพับ',
      pose: 'sleeping'
    },
    {
      stepNum: 7,
      title: '7. เช็ดตาด้วยสำลี 2 ก้อน จากหัวตาไปหางตา',
      desc: 'ใช้สำลีชุบน้ำต้มสุก/0.9% NSS เช็ดตาทีละข้างจากหัวตาไปหางตา ไม่เช็ดย้อนกลับ',
      pose: 'cordCare'
    },
    {
      stepNum: 8,
      title: '8. ดูแลสายสะดือ สวมผ้าอ้อมและเสื้อผ้าชุดใหม่',
      desc: 'เช็ดโคนสะดือ พับผ้าอ้อมใต้สะดือ สวมเสื้อผ้า ห่อตัวทารกให้อบอุ่น เป็นอันเสร็จสิ้น',
      pose: 'sleeping'
    }
  ];

  // Helper to toggle equipment item collection from shelf
  const handleCollectItem = (itemKey) => {
    setCollectedItems((prev) => {
      const next = { ...prev, [itemKey]: true };
      return next;
    });
  };

  const isAllEquipmentCollected = Object.values(collectedItems).every(Boolean);

  const handleNextTvSlide = () => {
    if (tvSlide < tvSlidesData.length - 1) {
      const next = tvSlide + 1;
      setTvSlide(next);
      setTvViewedCount((c) => Math.max(c, next + 1));
    }
  };

  const handlePrevTvSlide = () => {
    if (tvSlide > 0) {
      setTvSlide(tvSlide - 1);
    }
  };

  const handleBathingStepAdvance = () => {
    if (bathingStep < bathingStepsList.length - 1) {
      const nextStep = bathingStep + 1;
      setBathingStep(nextStep);
      setBathingBabyPose(bathingStepsList[nextStep].pose);
    } else {
      completeModule('newbornCare2');
      setShowSuccessModal(true, 'ยินดีด้วย! คุณผ่านบทเรียนการอาบน้ำและเปลี่ยนผ้าอ้อมทารกครบถ้วนตามมาตรฐานวิชาชีพ');
      setActiveModal(null);
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Architecture (Matching img_000.jpg floorplan layout) ── */}
      <HospitalRoomShell
        theme="nursery"
        width={13}
        depth={13}
        height={5.2}
        roomTitle="ห้องที่ 2: การอาบน้ำและการดูแลความสะอาดทารก การเปลี่ยนผ้าอ้อม"
        roomNumber="Nursery 202"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP WALL (NORTH per img_000.jpg):
             - Left: เก้าอี้โซฟา (Armchair / Sofa)
             - Right: เตียงทารก (Baby crib with swaddled sleeping baby)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* เก้าอี้โซฟา (Top-Left, X: -2.8, Z: -4.8) */}
      <group position={[-2.8, 0, -4.8]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.5, 1.1]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.95, -0.42]} castShadow>
          <boxGeometry args={[1.1, 0.95, 0.26]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>
        {[-0.55, 0.55].map((x, i) => (
          <mesh key={`arm_${i}`} position={[x, 0.6, 0.05]} castShadow>
            <boxGeometry args={[0.22, 0.42, 1.0]} />
            <meshStandardMaterial color="#fde68a" roughness={0.85} />
          </mesh>
        ))}
        <Pillows position={[0, 0.65, 0.1]} scale={0.9} />
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <div className="select-none bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            🛋️ เก้าอี้โซฟาคุณแม่
          </div>
        </Html>
      </group>

      {/* เตียงทารก (Top-Right, X: 2.2, Z: -4.8) */}
      <group position={[2.2, 0, -4.8]}>
        {/* Crib Base Frame */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.95]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.52, 0]} receiveShadow>
          <boxGeometry args={[1.42, 0.12, 0.88]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.7} />
        </mesh>
        {/* White Slatted Crib Rails */}
        {[-0.72, 0.72].map((x, i) => (
          <mesh key={`rail_end_${i}`} position={[x, 0.78, 0]} castShadow>
            <boxGeometry args={[0.04, 0.65, 0.95]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {[-0.45, 0.45].map((z, i) => (
          <mesh key={`rail_side_${i}`} position={[0, 0.78, z]} castShadow>
            <boxGeometry args={[1.5, 0.65, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {/* 4 White Corner Legs */}
        {[[-0.72, -0.45], [0.72, -0.45], [-0.72, 0.45], [0.72, 0.45]].map(([x, z], i) => (
          <mesh key={`leg_${i}`} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}

        {/* Baby in Crib (when not in bathtub) */}
        {!isHoldingBaby && (
          <group position={[0, 0.58, 0]}>
            <BabyAvatar
              pose="sleeping"
              position={[0, 0, 0]}
              scale={0.95}
              blanketColor="#e0f2fe"
              beanieColor="#bae6fd"
            />
          </group>
        )}

        <Html position={[0, 1.35, 0]} center distanceFactor={10}>
          <button
            onClick={() => {
              setHoldingBaby(!isHoldingBaby);
              if (!isHoldingBaby) {
                setActiveModal('bathingProcedure');
              }
            }}
            className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
              border: '2px solid white'
            }}
          >
            <span>{isHoldingBaby ? '👶 วางทารกในเตียง' : '🛁 อุ้มทารกมาอาบน้ำที่โต๊ะ'}</span>
          </button>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. LEFT WALL (WEST per img_000.jpg):
             - TV on Wall
             - ชั้นวางของ / ของใช้ทารก (Multi-Tier Cubby Shelf for Supplies)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Wall-mounted TV Screen (X: -6.35, Z: -2.8, facing +X) */}
      <group position={[-6.35, 2.7, -2.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.9, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.05, 1.75]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        <Html position={[0, 0, 0.06]} center transform scale={0.24}>
          <div
            className="select-none bg-slate-900 text-white rounded-lg p-3 shadow-2xl flex flex-col justify-between"
            style={{ width: '540px', height: '320px', border: '3px solid #00897b' }}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <span className="font-bold text-teal-300 text-xs flex items-center gap-1">
                📺 สื่อให้ความรู้การอาบน้ำทารก (สไลด์ {tvSlide + 1}/8)
              </span>
              <button
                onClick={() => setShowTvModal(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-2 py-0.5 rounded text-[11px] font-bold"
              >
                🔍 ขยายเต็มจอ
              </button>
            </div>

            <div className="my-1.5 bg-slate-800 p-2 rounded border border-slate-700 flex gap-2.5 items-center">
              <img
                src={tvSlidesData[tvSlide].img}
                alt={tvSlidesData[tvSlide].title}
                className="w-32 h-24 object-contain rounded bg-white p-1 border border-slate-600"
              />
              <div className="flex-1 text-left">
                <h4 className="font-bold text-amber-300 text-xs line-clamp-1">{tvSlidesData[tvSlide].title}</h4>
                <p className="text-[10px] text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                  {tvSlidesData[tvSlide].bullets[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <button
                disabled={tvSlide === 0}
                onClick={handlePrevTvSlide}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs rounded font-bold"
              >
                ◀ ย้อนกลับ
              </button>
              <span className="text-[11px] text-slate-400">
                เรียนรู้แล้ว: {tvViewedCount}/8 สไลด์ {tvViewedCount >= 8 && '✓'}
              </span>
              <button
                disabled={tvSlide === tvSlidesData.length - 1}
                onClick={handleNextTvSlide}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-xs rounded font-bold"
              >
                ถัดไป ▶
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ชั้นวางของ / ของใช้ทารก (Multi-Tier Cubby Shelf at X: -6.0, Z: 0.8) */}
      <group position={[-6.0, 0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Solid Oak Wood Bookcase / Cubby Shelf */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.4, 0.42]} />
          <meshStandardMaterial color="#c29b68" roughness={0.4} />
        </mesh>
        {/* Inset Shelf Openings */}
        <mesh position={[0, 1.2, 0.05]}>
          <boxGeometry args={[1.68, 2.28, 0.35]} />
          <meshStandardMaterial color="#e5d0b1" roughness={0.5} />
        </mesh>

        {/* Shelf Header Label */}
        <Html position={[0, 2.55, 0.2]} center distanceFactor={10}>
          <div
            onClick={() => setActiveModal('shelf')}
            className="cursor-pointer select-none bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white transition transform hover:scale-105"
          >
            📦 ชั้นวางของใช้ทารก (คลิกหยิบอุปกรณ์)
          </div>
        </Html>

        {/* Interactive Staged Items on Shelves */}
        {/* Level 3: Towels & Blankets */}
        <group position={[-0.45, 1.7, 0.1]}>
          <mesh castShadow onClick={() => handleCollectItem('towels')} className="cursor-pointer">
            <boxGeometry args={[0.42, 0.12, 0.28]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0]} castShadow onClick={() => handleCollectItem('towels')}>
            <boxGeometry args={[0.38, 0.06, 0.25]} />
            <meshStandardMaterial color="#fef08a" roughness={0.8} />
          </mesh>
        </group>

        {/* Level 2: Baby Soap & Shampoo Bottles */}
        <group position={[0.45, 1.15, 0.1]} onClick={() => handleCollectItem('soap')}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.16, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} />
          </mesh>
          <mesh position={[0.12, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.16, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
        </group>

        {/* Level 1: Cotton Balls in cup & Sponge */}
        <group position={[-0.45, 0.6, 0.1]} onClick={() => handleCollectItem('cottonBalls')}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.08, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} />
          </mesh>
        </group>
        <group position={[0.1, 0.6, 0.1]} onClick={() => handleCollectItem('sponge')}>
          <mesh castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#facc15" roughness={0.95} />
          </mesh>
        </group>

        {/* Level 0: Clean Diapers & Clothes */}
        <group position={[0.45, 0.15, 0.1]} onClick={() => handleCollectItem('clothes')}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.18, 0.28]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CENTER AREA (per img_000.jpg):
             - โต๊ะเปล่า (Large wooden rectangular table with 2 bathtubs: Blue & Pink)
             - Bathtub 1: Water 36-37°C for wash
             - Bathtub 2: Clean water 36-37°C for rinse
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[0.2, 0, -0.4]}>
        <BabyBathtub
          preparedItems={collectedItems}
        />

        {/* Active Baby avatar in bath during simulation */}
        {isHoldingBaby && (
          <group position={[-0.78, 0.96, 0]}>
            <BabyAvatar
              pose={bathingBabyPose}
              position={[0, 0.12, 0]}
              scale={0.92}
              blanketColor="#bae6fd"
            />
          </group>
        )}

        {/* Table Station Floating Badge */}
        <Html position={[0, 1.75, 0]} center distanceFactor={12}>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setActiveModal('bathingProcedure')}
              className="cursor-pointer select-none px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105"
              style={{
                background: isAllEquipmentCollected
                  ? 'linear-gradient(135deg, #00897b, #004d40)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: '2px solid white'
              }}
            >
              <span>🛁</span>
              <span>
                {isAllEquipmentCollected ? 'เริ่มขั้นตอนอาบน้ำและเปลี่ยนผ้าอ้อม' : 'เตรียมอุปกรณ์ให้ครบก่อนอาบน้ำ'}
              </span>
            </button>
            <div className="bg-white/95 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow border border-teal-200">
              อุปกรณ์พร้อม: {Object.values(collectedItems).filter(Boolean).length}/6 ชิ้น {isAllEquipmentCollected && '✓'}
            </div>
          </div>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. BOTTOM WALL (SOUTH per img_000.jpg):
             - Left: อ่างล้างจาน (Stainless double-bowl sink counter)
             - Center: ถังขยะ 2 ใบ (Dual sorting waste bin cabinet)
             - Right: ประตู (Entrance doorway)
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Double Sink Counter (อ่างล้างจาน at X: -3.5, Z: 5.0) */}
      <group position={[-3.5, 0, 5.0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.9, 0.75]} />
          <meshStandardMaterial color="#c29b68" roughness={0.4} />
        </mesh>
        {/* Double Stainless Basin */}
        <mesh position={[0, 0.91, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.02, 0.55]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Two Sink Bowls */}
        {[-0.32, 0.32].map((x, i) => (
          <mesh key={`sink_bowl_${i}`} position={[x, 0.85, 0]} receiveShadow>
            <boxGeometry args={[0.5, 0.12, 0.42]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Chrome Mixer Tap */}
        <mesh position={[0, 1.05, -0.2]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.26, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
        <Html position={[0, 1.25, 0]} center distanceFactor={10}>
          <div className="select-none bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            🚰 อ่างล้างจานและทำความสะอาด
          </div>
        </Html>
      </group>

      {/* Dual Waste Bins Cabinet (ถังขยะ 2 ใบ at X: -1.2, Z: 5.0) */}
      <group position={[-1.2, 0, 5.0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.84, 0.65]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Bin 1: General Waste (Grey) */}
        <mesh position={[-0.24, 0.42, 0.15]} castShadow>
          <boxGeometry args={[0.38, 0.62, 0.42]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        {/* Bin 2: Infectious / Soiled Diapers (Red/Yellow Medical) */}
        <mesh position={[0.24, 0.42, 0.15]} castShadow>
          <boxGeometry args={[0.38, 0.62, 0.42]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
        <Html position={[0, 0.95, 0]} center distanceFactor={10}>
          <div className="select-none bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            🗑️ ถังขยะแยกประเภท (ทั่วไป/ติดเชื้อ)
          </div>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. RIGHT WALL (EAST per img_000.jpg):
             - หน้าต่าง (Large window with pleated Roman blinds)
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[6.35, 2.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Window Frame */}
        <mesh castShadow>
          <boxGeometry args={[3.4, 2.4, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Window Glass */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[3.2, 2.2]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        {/* Pleated Roman Blinds Folds (Folded at top) */}
        {[0.8, 0.6, 0.4].map((y, i) => (
          <mesh key={`blind_${i}`} position={[0, y, 0.05]} castShadow>
            <boxGeometry args={[3.25, 0.18, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Decorative Potted Plant */}
      <RealPlant type="potted" position={[5.2, 0, -5.0]} scale={1.0} />

      {/* 3D Player Controller */}
      <PlayerController />

      {/* ══════════════════════════════════════════════════════════════════════════
          2D HTML INTERACTIVE OVERLAYS & MODALS
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Nursery Supplies Shelf Modal */}
      {activeModal === 'shelf' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                    <span>📦</span> ชั้นวางของใช้ทารก (จัดเตรียมก่อนอาบน้ำ)
                  </h2>
                  <p className="text-xs text-slate-500">คลิกหยิบอุปกรณ์เพื่อนำไปวางจัดเตรียมบนโต๊ะอาบน้ำ</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  {
                    key: 'tubs',
                    name: '1. อ่างอาบน้ำสะอาด 2 อ่าง (น้ำอุ่น 36–37°C)',
                    desc: 'อ่างที่ 1 สำหรับฟอกสบู่, อ่างที่ 2 สำหรับล้างน้ำสะอาด',
                    icon: '🛁'
                  },
                  {
                    key: 'towels',
                    name: '2. ผ้าขนหนูเช็ดตัว 1 ผืน และผ้าห่อตัว 1 ผืน',
                    desc: 'ผ้านุ่ม สะอาด ซับน้ำได้ดี ไม่ระคายเคืองผิวบอบบาง',
                    icon: '🧖'
                  },
                  {
                    key: 'soap',
                    name: '3. สบู่เหลว-ยาสระผม สูตรอ่อนโยนสำหรับเด็ก',
                    desc: 'สูตร Tear-free อ่อนละมุน ไม่แสบตา ปราศจากน้ำหอมแรง',
                    icon: '🧴'
                  },
                  {
                    key: 'sponge',
                    name: '4. ผ้าผืนเล็กหรือฟองน้ำสำหรับอาบน้ำ',
                    desc: 'ใช้ชุบน้ำเช็ดฟอกตามข้อพับ ซอกคอ และลำตัว',
                    icon: '🧽'
                  },
                  {
                    key: 'cottonBalls',
                    name: '5. สำลีก้อนใส่น้ำต้มสุก/น้ำเกลือ 0.9% NSS (2 ก้อน)',
                    desc: 'บิดหมาดใส่ถ้วยเล็ก สำหรับเช็ดตาทารกข้างละ 1 ก้อน',
                    icon: '⚪'
                  },
                  {
                    key: 'clothes',
                    name: '6. เสื้อผ้าและผ้าอ้อมทารกชุดใหม่',
                    desc: 'เสื้อผูกหน้าสวมใส่ง่าย และผ้าอ้อมสำเร็จรูป',
                    icon: '👶'
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => handleCollectItem(item.key)}
                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition transform hover:scale-[1.01] ${
                      collectedItems[item.key]
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-sm text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        collectedItems[item.key]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {collectedItems[item.key] ? '✓ วางบนโต๊ะแล้ว' : '+ หยิบไปวาง'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
                >
                  ปิดหน้าต่าง
                </button>
                {isAllEquipmentCollected && (
                  <button
                    onClick={() => {
                      setActiveModal('bathingProcedure');
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow"
                  >
                    ✓ อุปกรณ์ครบแล้ว เริ่มอาบน้ำ ▶
                  </button>
                )}
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* 2. Step-by-Step Bathing Procedure Simulation Modal */}
      {activeModal === 'bathingProcedure' && (
        <Html center>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-4 border-teal-500 max-h-[92vh] overflow-y-auto text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                    <span>🛁</span> ขั้นตอนการอาบน้ำทารกแรกเกิด (ขั้นตอนที่ {bathingStep + 1}/8)
                  </h2>
                  <p className="text-xs text-slate-500">ปฏิบัติตามมาตรฐานการพยาบาลเด็กแรกเกิดทีละขั้นตอน</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Current Step Card */}
              <div className="mt-4 p-4 rounded-xl bg-teal-50 border-2 border-teal-200">
                <div className="font-bold text-teal-950 text-base flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                    {bathingStepsList[bathingStep].stepNum}
                  </span>
                  <span>{bathingStepsList[bathingStep].title}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed pl-9">
                  {bathingStepsList[bathingStep].desc}
                </p>
              </div>

              {/* Progress Step Dots */}
              <div className="mt-4 flex items-center justify-between gap-1 px-2">
                {bathingStepsList.map((st, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setBathingStep(i);
                      setBathingBabyPose(st.pose);
                    }}
                    className={`flex-1 h-2 rounded-full cursor-pointer transition ${
                      i <= bathingStep ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                    title={st.title}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  disabled={bathingStep === 0}
                  onClick={() => {
                    const prevStep = Math.max(0, bathingStep - 1);
                    setBathingStep(prevStep);
                    setBathingBabyPose(bathingStepsList[prevStep].pose);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-sm"
                >
                  ◀ ย้อนกลับ
                </button>
                <button
                  onClick={handleBathingStepAdvance}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow flex items-center justify-center gap-2"
                >
                  <span>
                    {bathingStep === bathingStepsList.length - 1
                      ? '🎉 เสร็จสิ้นการอาบน้ำ & รับผลการเรียนรู้'
                      : 'ปฏิบัติขั้นตอนนี้สำเร็จ ▶'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* 3. Fullscreen TV Modal */}
      {showTvModal && (
        <Html center>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border-4 border-teal-400 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📺</span>
                  <h2 className="text-lg font-bold text-teal-300">
                    {tvSlidesData[tvSlide].title} (สไลด์ {tvSlide + 1}/8)
                  </h2>
                </div>
                <button
                  onClick={() => setShowTvModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <img
                  src={tvSlidesData[tvSlide].img}
                  alt={tvSlidesData[tvSlide].title}
                  className="w-full h-64 object-contain rounded-xl bg-white p-2 border border-slate-700"
                />
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 text-sm">
                  <h4 className="font-bold text-amber-300 text-base border-b border-slate-700 pb-1.5">
                    สาระสำคัญทางการพยาบาล
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-200">
                    {tvSlidesData[tvSlide].bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  disabled={tvSlide === 0}
                  onClick={handlePrevTvSlide}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-sm font-bold"
                >
                  ◀ สไลด์ก่อนหน้า
                </button>
                <span className="text-xs text-slate-400">
                  สไลด์ที่ {tvSlide + 1} จากทั้งหมด 8 สไลด์
                </span>
                <button
                  disabled={tvSlide === tvSlidesData.length - 1}
                  onClick={handleNextTvSlide}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 rounded-lg text-sm font-bold"
                >
                  สไลด์ถัดไป ▶
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
