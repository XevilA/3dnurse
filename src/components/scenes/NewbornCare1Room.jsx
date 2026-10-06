import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import BabyAvatar from '../avatars/BabyAvatar';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import Pillows from '../decorations/Pillows';
import HospitalTrashBin from '../decorations/HospitalTrashBin';

/**
 * NewbornCare1Room — ห้องที่ 1: การให้นมและการอุ้มจัดท่าทารก
 *
 * Implements 100% of "ห้องที่ 1 การให้นมและการอุ้มจัดท่าทารก.docx"
 * and matches reference images img_000.jpg, img_001.jpg, and img_011.png:
 * - Room 3D Architecture: Warm peach pastel walls, warm natural wood parquet floor,
 *   panoramic windows with soft curtains and sunset exterior.
 * - North Wall:
 *     - 3 Framed educational wall posters:
 *         1. 4 Key Signs การอมหัวนมและการดูดนมแม่ที่ถูกต้อง
 *         2. 4 Key Points for Breastfeeding Positioning
 *         3. ท่าให้นมทารกทั้ง 4 ท่า (Cradle, Football, Side lying, Cross cradle)
 *     - Baby crib with peaceful sleeping baby on pink blanket & cute teddy bear.
 *     - Stool with feeding bottle.
 * - West Wall:
 *     - Large flat screen TV with 7 educational slides + YouTube video player.
 * - South Wall:
 *     - Bottom-left: Refrigerator for storing breast milk (door opens into room, not hitting wall).
 *     - Water kettle & cup counter.
 *     - Handwash sink counter with gooseneck faucet.
 * - East Wall:
 *     - Full-length arched wooden standing floor mirror beside window.
 *     - End table with lush potted green plant.
 * - Center:
 *     - Mother's cream reclining nursing armchair.
 *     - Low wooden coffee table with interactive items:
 *         1. แก้วเล็กสำหรับเก็บนมแม่
 *         2. แก้วสำหรับป้อนนมทารก
 *         3. ไซริงค์สำหรับเก็บน้ำนม + ถุงซิป
 * - Interactive gameplay:
 *     - Mother walks freely.
 *     - Can click posters for full educational modals.
 *     - Can click table items & fridge for details and usage.
 *     - Can walk to crib, pick up baby, and sit on armchair.
 *     - Breastfeeding posture menu with 4 options:
 *         - 1 (Cradle), 2 (Football), 4 (Cross cradle) -> ✓ Correct!
 *         - 3 (Side lying) -> ✕ Incorrect for armchair, explains it is for bed!
 */
export default function NewbornCare1Room() {
  const { setRoom, completeModule, setShowSuccessModal, isHoldingBaby, setHoldingBaby } = useStore();

  // ── TV Slides state ──
  const [tvSlide, setTvSlide] = useState(0);
  const [showTvModal, setShowTvModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // ── Active popup modal state ──
  const [activeModal, setActiveModal] = useState(null); // 'poster1' | 'poster2' | 'poster3' | 'fridge' | 'tableItems' | 'postureSelector'

  // ── Breastfeeding selection state ──
  const [selectedHold, setSelectedHold] = useState('cradleHold');
  const [holdFeedback, setHoldFeedback] = useState(null); // { isCorrect: boolean, title: string, desc: string }
  const [isMotherSeated, setIsMotherSeated] = useState(false);

  const tvSlidesData = [
    {
      title: 'ยินดีต้อนรับเข้าสู่ห้อง "การให้นมทารก"',
      img: '/references/room1/img_002.jpeg',
      bullets: [
        '1. ทารกควรได้ดื่มนมแม่ ภายใน 1 ชั่วโมงแรกหลังคลอด เพื่อกระตุ้นน้ำนมและสร้างภูมิคุ้มกัน',
        '2. ทารกควรกินนมแม่อย่างเดียวไม่น้อยกว่า 6 เดือน โดยไม่ต้องให้น้ำหรืออาหารอื่น',
        '3. หลังจาก 6 เดือน ให้นมแม่ร่วมกับการให้อาหารเสริมตามวัยจนถึงอายุ 2 ปี หรือนานกว่านั้น'
      ]
    },
    {
      title: 'ประโยชน์ของการเลี้ยงลูกด้วยนมแม่ (10 ข้อ)',
      img: '/references/room1/img_003.jpeg',
      bullets: [
        '1. มีคุณค่าทางสารอาหารที่จำเป็นต่อทารกครบถ้วนและย่อยง่าย',
        '2. เสริมสร้างภูมิคุ้มกันโรค (มีแอนติบอดี IgA ปกป้องลำไส้และทางเดินหายใจ)',
        '3. ช่วยลดอัตราการเจ็บป่วยจากโรคติดเชื้อต่างๆ',
        '4. ลดโอกาสเป็นโรคภูมิแพ้และหอบหืด',
        '5. เสริมสร้างพัฒนาการทางสมองและระบบประสาท',
        '6. ช่วยในการมองเห็น (มี DHA และ ARA พัฒนาจอประสาทตา)',
        '7. ช่วยในการเจริญเติบโตอย่างสมส่วน',
        '8. ลดโอกาสเกิดโรคเรื้อรัง เช่น เบาหวาน ความดันโลหิตสูงในอนาคต',
        '9. ลดอัตราการเสียชีวิตของเด็กคลอดก่อนกำหนดและน้ำหนักตัวน้อย',
        '10. ส่งเสริมความรักความผูกพันอันอบอุ่นระหว่างมารดาและทารก (Bonding)'
      ]
    },
    {
      title: 'ส่วนประกอบของน้ำนมแม่ในแต่ละระยะของการสร้างน้ำนม',
      img: '/references/room1/img_004.jpeg',
      bullets: [
        '• ระยะที่ 1 (1–3 วันหลังคลอด): หัวน้ำนม (Colostrum) สีเหลืองใส อุดมด้วยภูมิคุ้มกันและโปรตีนเข้มข้น เสมือนวัคซีนหยดแรก',
        '• ระยะที่ 2 (5 วัน จนถึง 2 สัปดาห์แรก): น้ำนมปรับเปลี่ยน (Transitional Milk) สีขาวนวล ปริมาณน้ำตาลแลคโตสและไขมันเพิ่มขึ้น',
        '• ระยะที่ 3 (หลัง 2 สัปดาห์แรก): น้ำนมสมบูรณ์ (Mature Milk) สีขาวขุ่น ประกอบด้วยน้ำนมส่วนหน้า (ดับกระหาย) และน้ำนมส่วนหลัง (ไขมันสูง ช่วยให้อิ่มและน้ำหนักตัวขึ้น)'
      ]
    },
    {
      title: 'การเตรียมตัวก่อนให้นมบุตร',
      img: '/references/room1/img_005.jpeg',
      bullets: [
        '1. เตรียมร่างกายและจิตใจก่อนให้นม: ผ่อนคลาย ดื่มน้ำอุ่น ล้างมือให้สะอาด ไม่ต้องล้างหัวนมทุกครั้ง',
        '2. จัดท่านั่งให้สบาย: มีหมอนหนุนหลังและหมอนรองแขน เท้าวางราบกับพื้น ไม่โน้มตัวเข้าหาลูก',
        '3. สร้างบรรยากาศที่ผ่อนคลาย: แสงสว่างนุ่มนวล ไม่มีเสียงรบกวน',
        '4. สังเกตสัญญาณว่าทารกพร้อมดูดนม (Early Hunger Cues): ขยับปาก ส่ายหัว ดูดนิ้วมือ (อย่ารอจนทารกร้องไห้)'
      ]
    },
    {
      title: '4 Key Signs การอมหัวนมและการดูดนมแม่ที่ถูกต้อง (Latching)',
      img: '/references/room1/img_006.png',
      bullets: [
        '1. เห็นลานนมด้านบนมากกว่าด้านล่าง (ลานนมล่างถูกอมมิด)',
        '2. อ้าปากกว้างแนบสนิทกับเต้านม (ทำมุมกว้างกว่า 140 องศา)',
        '3. คางแนบชิดเต้านมแม่ และจมูกเป็นอิสระหายใจสะดวก',
        '4. ริมฝีปากบนและล่างบานออกคล้ายปากปลา (Flanged Lips) ไม่เม้ม'
      ]
    },
    {
      title: '4 Key Points for Breastfeeding Positioning ตามมาตรฐานสากล',
      img: '/references/room1/img_007.jpeg',
      bullets: [
        '1. ลำตัวชิดกับแม่ (Tummy to Tummy ท้องแนบท้อง อกแนบอก)',
        '2. ลูกหันหน้าเข้าหาเต้านมแม่ (จมูกอยู่ตรงระดับหัวนมก่อนเข้าเต้า)',
        '3. ศีรษะ ลำตัว และสะโพกทารกอยู่ในแนวเส้นตรงเดียวกัน (หู ไหล่ สะโพก ตรงแนว)',
        '4. ทารกได้รับการประคองอย่างมั่นคงทั้งศีรษะ หลัง และก้น'
      ]
    },
    {
      title: 'ปัญหาที่พบบ่อยขณะให้นมและการแก้ไข',
      img: '/references/room1/img_009.jpeg',
      bullets: [
        '1. หัวนมเจ็บ: เกิดจากการเข้าเต้าไม่ลึกพอ ให้แก้ไขการจัดท่าและการอมหัวนมให้ลึกถึงลานนม',
        '2. เต้านมคัด: ให้นมบ่อยทุก 2–3 ชม. ประคบอุ่นเบาๆ 3–5 นาทีก่อนให้นม และบีบระบายน้ำนมออก',
        '3. ทารกดูดนมไม่ดี: เน้นสัมผัสเนื้อแนบเนื้อ (Skin-to-skin) และจัดท่าอุ้มให้ศีรษะไม่เอียงบิด',
        '4. รู้สึกว่าน้ำนมน้อย: ยิ่งดูดบ่อย ยิ่งสร้างมาก ดื่มน้ำให้เพียงพอ พักผ่อน และไม่เครียด'
      ]
    }
  ];

  const handleSelectHold = (holdKey) => {
    setSelectedHold(holdKey);
    if (holdKey === 'sideLying') {
      setHoldFeedback({
        isCorrect: false,
        title: '✕ ท่านี้ยังไม่เหมาะสมกับเก้าอี้โซฟา',
        desc: '“ท่า Side Lying เป็นการให้นมทารกบนเตียงนอน ข้อดีคือ เหมาะกับคุณแม่เต้านมใหญ่ ผ่าตัดคลอด สะดวกสบายไม่ต้องเกร็งแขน สามารถพักผ่อนไปพร้อมๆกับการให้ทารกดูดนมได้” (ขณะนั่งบนโซฟา ควรเลือกท่า Cradle, Football หรือ Cross Cradle ครับ)'
      });
    } else {
      let holdName = '';
      if (holdKey === 'cradleHold') holdName = 'Cradle Hold (ท่าอุ้มลูกบนแขน)';
      if (holdKey === 'footballHold') holdName = 'Football Hold (ท่าอุ้มสอดข้างลำตัว)';
      if (holdKey === 'crossCradle') holdName = 'Cross Cradle (ท่าอุ้มข้ามตัก)';
      setHoldFeedback({
        isCorrect: true,
        title: '✓ ถูกต้องยอดเยี่ยม!',
        desc: `คุณแม่จัดท่าให้นมในท่า ${holdName} ได้ถูกต้องตามมาตรฐาน 4 Key Points ทารกอมหัวนมแนบชิดและดูดนมได้อย่างมีประสิทธิภาพ`
      });
      completeModule('newbornCare1');
    }
  };

  return (
    <group>
      {/* ── Realistic 3D Architecture (Matching img_000.jpg & img_001.jpg) ── */}
      <HospitalRoomShell
        theme="mother"
        width={14}
        depth={14}
        height={5.2}
        roomTitle="ห้องที่ 1: การให้นมและการอุ้มจัดท่าทารก (Lactation & Positioning Room)"
        roomNumber="Nursery 201"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          1. NORTH WALL (BACK):
             - 3 Educational Wall Posters (matching img_000.jpg exactly)
             - Baby Crib with sleeping baby and teddy bear
             - Stool with bottle
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Wall Poster 1: "4 Key Signs to Watch" (Matching img_006.png) */}
      <group position={[-3.6, 2.8, -6.85]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          className="cursor-pointer"
          onClick={() => setActiveModal('poster1')}
        >
          <boxGeometry args={[2.0, 1.4, 0.04]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.4} />
        </mesh>
        {/* Frame Border */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[2.08, 1.48, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.2} />
        </mesh>
        <Html position={[0, 0, 0.05]} center transform scale={0.22}>
          <div
            onClick={() => setActiveModal('poster1')}
            className="cursor-pointer select-none bg-white p-1 rounded-lg border-2 border-amber-500 shadow-xl hover:scale-105 transition overflow-hidden"
            style={{ width: '380px' }}
          >
            <img
              src="/references/room1/img_006.png"
              alt="4 Key Signs"
              style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="text-center py-1 bg-amber-50 rounded mt-1">
              <span className="text-[11px] font-bold text-amber-900">🔍 4 Key Signs การอมหัวนม (คลิกอ่าน)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Wall Poster 2: "4 Key Points for Success" (Matching img_010.jpeg) */}
      <group position={[-1.2, 2.8, -6.85]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          className="cursor-pointer"
          onClick={() => setActiveModal('poster2')}
        >
          <boxGeometry args={[2.0, 1.4, 0.04]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[2.08, 1.48, 0.02]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
        </mesh>
        <Html position={[0, 0, 0.05]} center transform scale={0.22}>
          <div
            onClick={() => setActiveModal('poster2')}
            className="cursor-pointer select-none bg-white p-1 rounded-lg border-2 border-sky-500 shadow-xl hover:scale-105 transition overflow-hidden"
            style={{ width: '380px' }}
          >
            <img
              src="/references/room1/img_010.jpeg"
              alt="4 Key Points"
              style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="text-center py-1 bg-sky-50 rounded mt-1">
              <span className="text-[11px] font-bold text-sky-900">🤱 4 Key Points ท่าอุ้มให้นม (คลิกอ่าน)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Wall Poster 3: "ท่าให้นมทารก 4 ท่า" (Matching img_011.png) */}
      <group position={[1.4, 2.8, -6.85]} rotation={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          className="cursor-pointer"
          onClick={() => setActiveModal('poster3')}
        >
          <boxGeometry args={[2.4, 1.4, 0.04]} />
          <meshStandardMaterial color="#fce7f3" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[2.48, 1.48, 0.02]} />
          <meshStandardMaterial color="#be185d" roughness={0.3} metalness={0.2} />
        </mesh>
        <Html position={[0, 0, 0.05]} center transform scale={0.22}>
          <div
            onClick={() => setActiveModal('poster3')}
            className="cursor-pointer select-none bg-white p-1 rounded-lg border-2 border-pink-500 shadow-xl hover:scale-105 transition overflow-hidden"
            style={{ width: '440px' }}
          >
            <img
              src="/references/room1/img_011.png"
              alt="ท่าให้นมทารก 4 ท่า"
              style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="text-center py-1 bg-pink-50 rounded mt-1">
              <span className="text-[11px] font-bold text-pink-900">🌸 ท่าให้นมทารก 4 ท่าสากล (คลิกอ่าน)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* ── Classic Wooden Baby Crib against North Wall (per img_000.jpg & img_001.jpg) ── */}
      <group position={[0.4, 0, -5.2]}>
        {/* Crib Base Frame (Natural Birch Wood) */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 0.95]} />
          <meshStandardMaterial color="#e5d0b1" roughness={0.4} />
        </mesh>
        {/* Mattress with soft pink blanket */}
        <mesh position={[0, 0.48, 0]} receiveShadow>
          <boxGeometry args={[1.42, 0.12, 0.88]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.8} />
        </mesh>
        {/* Slatted Crib Rails */}
        {[-0.72, 0.72].map((x, i) => (
          <mesh key={`rail_end_${i}`} position={[x, 0.75, 0]} castShadow>
            <boxGeometry args={[0.04, 0.65, 0.95]} />
            <meshStandardMaterial color="#d4be9b" roughness={0.4} />
          </mesh>
        ))}
        {[-0.45, 0.45].map((z, i) => (
          <mesh key={`rail_side_${i}`} position={[0, 0.75, z]} castShadow>
            <boxGeometry args={[1.5, 0.65, 0.04]} />
            <meshStandardMaterial color="#d4be9b" roughness={0.4} />
          </mesh>
        ))}
        {/* 4 Corner Legs */}
        {[[-0.72, -0.45], [0.72, -0.45], [-0.72, 0.45], [0.72, 0.45]].map(([x, z], i) => (
          <mesh key={`leg_${i}`} position={[x, 0.48, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.96, 16]} />
            <meshStandardMaterial color="#bfa47e" roughness={0.4} />
          </mesh>
        ))}

        {/* Peaceful Sleeping Baby in Crib (per img_001.jpg top-down view) */}
        {!isHoldingBaby && (
          <group position={[0, 0.54, 0]}>
            <BabyAvatar
              pose="sleeping"
              position={[0, 0, 0]}
              scale={0.95}
              blanketColor="#fbcfe8"
              beanieColor="#fce7f3"
            />
            {/* Cute Teddy Bear Companion next to Baby */}
            <group position={[0.42, 0.08, -0.18]} rotation={[0, -0.5, 0.2]}>
              <mesh castShadow>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#d97706" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.08, 0]} castShadow>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial color="#d97706" roughness={0.9} />
              </mesh>
              {/* Ears */}
              <mesh position={[-0.04, 0.12, 0]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
              <mesh position={[0.04, 0.12, 0]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
            </group>
          </group>
        )}

        {/* Floating Interact Button over Crib */}
        <Html position={[0, 1.25, 0]} center distanceFactor={12}>
          <button
            onClick={() => {
              setHoldingBaby(!isHoldingBaby);
              if (!isHoldingBaby) {
                setActiveModal('postureSelector');
              }
            }}
            className="cursor-pointer select-none px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            style={{
              background: isHoldingBaby ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ec4899, #be185d)',
              border: '2px solid white'
            }}
          >
            <span>{isHoldingBaby ? '👶 วางทารกในเตียง' : '🤱 อุ้มทารกมาให้นมที่โซฟา'}</span>
          </button>
        </Html>
      </group>

      {/* Bedside Stool with Milk Bottle (Left of Crib) */}
      <group position={[-1.3, 0, -5.2]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.5, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Baby Bottle */}
        <mesh position={[0, 0.56, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 0.14, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.64, 0]}>
          <coneGeometry args={[0.025, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.4} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. WEST WALL (LEFT):
             - Large Wall-Mounted TV with 7 Slides & Video
          ══════════════════════════════════════════════════════════════════════════ */}
      <group position={[-6.85, 2.7, -1.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* TV Frame & Backing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 2.1, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Screen Glass */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.45, 1.95]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>

        {/* TV Screen Interactive Display */}
        <Html position={[0, 0, 0.06]} center transform scale={0.24}>
          <div
            className="select-none bg-slate-900 text-white rounded-lg p-3.5 shadow-2xl flex flex-col justify-between"
            style={{ width: '560px', height: '330px', border: '3px solid #38bdf8' }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-sky-400 text-sm flex items-center gap-1.5">
                📺 สื่อให้ความรู้การให้นมบุตร (สไลด์ {tvSlide + 1}/7)
              </span>
              <button
                onClick={() => setShowTvModal(true)}
                className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded text-xs font-semibold shadow"
              >
                🔍 ขยายเต็มจอ
              </button>
            </div>

            {/* Slide Content Preview */}
            <div className="my-2 bg-slate-800/90 p-2.5 rounded border border-slate-700 flex gap-3 items-center overflow-hidden">
              <img
                src={tvSlidesData[tvSlide].img}
                alt={tvSlidesData[tvSlide].title}
                className="w-36 h-28 object-contain rounded bg-white p-1 border border-slate-600"
              />
              <div className="flex-1 text-left">
                <h4 className="font-bold text-amber-300 text-xs line-clamp-1">{tvSlidesData[tvSlide].title}</h4>
                <ul className="text-[11px] text-slate-200 mt-1 space-y-1 list-disc pl-3">
                  {tvSlidesData[tvSlide].bullets.slice(0, 2).map((b, idx) => (
                    <li key={idx} className="line-clamp-2">{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <button
                disabled={tvSlide === 0}
                onClick={() => setTvSlide((s) => Math.max(0, s - 1))}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs rounded font-bold"
              >
                ◀ ย้อนกลับ
              </button>
              <button
                onClick={() => {
                  setShowVideo(true);
                  setShowTvModal(true);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-xs rounded font-bold text-white flex items-center gap-1"
              >
                ▶ ดูคลิปวิดีโอ 1 ท่าอุ้มดูดนม
              </button>
              <button
                disabled={tvSlide === tvSlidesData.length - 1}
                onClick={() => setTvSlide((s) => Math.min(tvSlidesData.length - 1, s + 1))}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-xs rounded font-bold"
              >
                ถัดไป ▶
              </button>
            </div>
          </div>
        </Html>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. SOUTH WALL (BOTTOM):
             - Refrigerator for Breast Milk (Bottom-Left Corner)
             - Kettle & Drink Table
             - Washbasin Sink Counter
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Refrigerator for Breast Milk Storage (Corner X: -4.8, Z: 5.2, oriented facing into room) */}
      <group position={[-4.8, 0, 5.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh
          castShadow
          receiveShadow
          className="cursor-pointer"
          onClick={() => setActiveModal('fridge')}
        >
          {/* Rounded Retro Pastel Refrigerator Cabinet */}
          <boxGeometry args={[0.9, 1.6, 0.85]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.25} metalness={0.15} />
        </mesh>
        {/* Door Divider Seam */}
        <mesh position={[0, 0.25, 0.43]}>
          <boxGeometry args={[0.88, 0.02, 0.02]} />
          <meshStandardMaterial color="#ca8a04" />
        </mesh>
        {/* Chrome Door Handles (Opening toward room center) */}
        <mesh position={[0.32, 0.45, 0.46]} castShadow>
          <capsuleGeometry args={[0.015, 0.12, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.32, -0.15, 0.46]} castShadow>
          <capsuleGeometry args={[0.015, 0.18, 8, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Breast Milk Label Badge */}
        <Html position={[0, 0.65, 0.44]} center distanceFactor={10}>
          <div
            onClick={() => setActiveModal('fridge')}
            className="cursor-pointer select-none bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow hover:scale-110 transition"
          >
            🥛 ตู้เย็นเก็บน้ำนมแม่
          </div>
        </Html>
      </group>

      {/* Utility Table with Electric Kettle & Tea Cups (Beside Fridge) */}
      <group position={[-3.1, 0, 5.0]}>
        {/* Wood Side Table */}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.76, 0.7]} />
          <meshStandardMaterial color="#e5d0b1" roughness={0.4} />
        </mesh>
        {/* Electric Thermal Kettle */}
        <mesh position={[-0.22, 0.92, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.28, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Warm Cup */}
        <mesh position={[0.18, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.08, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Handwash Sink Counter with Gooseneck Faucet */}
      <group position={[-1.4, 0, 5.0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.84, 0.7]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>
        {/* Stainless Basin Inset */}
        <mesh position={[0, 0.85, 0]} receiveShadow>
          <boxGeometry args={[0.65, 0.02, 0.45]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Chrome Gooseneck Faucet */}
        <group position={[0, 0.86, -0.16]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.22, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.12, 0.08]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.12, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. EAST WALL (RIGHT):
             - Standing Arched Full-Length Mirror (Beside Right Window per doc note)
             - Lush Potted Plant on End Table
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Full Length Standing Wooden Arched Mirror (X: 5.6, Z: 2.2, slightly tilted) */}
      <group position={[5.8, 0, 2.2]} rotation={[0, -Math.PI / 2 + 0.12, 0]}>
        {/* Solid Teak Wood Frame */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.78, 1.85, 0.06]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        {/* Reflective Mirror Glass */}
        <mesh position={[0, 1.05, 0.032]}>
          <planeGeometry args={[0.68, 1.72]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* A-frame Rear Kickstand Leg */}
        <mesh position={[0, 0.65, -0.32]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* End Table with Potted Plant */}
      <group position={[5.6, 0, -1.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.6, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <RealPlant type="potted" position={[0, 0.6, 0]} scale={1.1} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. CENTER AREA:
             - Mother's Reclining Cream Nursing Armchair
             - Low Coffee Table with Feeding Glass, Syringe + Zip bag, Bottles
          ══════════════════════════════════════════════════════════════════════════ */}
      {/* Mother's Comfortable Nursing Armchair */}
      <group position={[1.8, 0, 0.4]} rotation={[0, -0.3, 0]}>
        {/* Armchair Base & Cushions (Cream/Beige Fabric matching reference) */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.5, 1.05]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.7} />
        </mesh>
        {/* Reclining Backrest */}
        <mesh position={[0, 0.88, -0.38]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.05, 0.95, 0.28]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.7} />
        </mesh>
        {/* Plush Armrests */}
        {[-0.52, 0.52].map((x, i) => (
          <mesh key={`arm_${i}`} position={[x, 0.58, 0.05]} castShadow>
            <boxGeometry args={[0.22, 0.42, 0.98]} />
            <meshStandardMaterial color="#f2ede4" roughness={0.75} />
          </mesh>
        ))}
        {/* Ergonomic Nursing Pillow on lap */}
        <Pillows position={[0, 0.62, 0.1]} scale={0.9} />

        {/* Baby held in Mother's lap when seated */}
        {isHoldingBaby && (
          <group position={[0, 0.72, 0.15]}>
            <BabyAvatar
              pose={selectedHold}
              position={[0, 0, 0]}
              scale={0.92}
              blanketColor="#fef08a"
              beanieColor="#fce7f3"
            />
          </group>
        )}

        {/* Armchair Interact Button */}
        <Html position={[0, 1.5, 0]} center distanceFactor={11}>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                setIsMotherSeated(!isMotherSeated);
                if (isHoldingBaby) {
                  setActiveModal('postureSelector');
                }
              }}
              className="cursor-pointer select-none px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5 transition transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', border: '2px solid white' }}
            >
              <span>🛋️</span>
              <span>{isMotherSeated ? 'ลุกออกจากเก้าอี้' : 'นั่งเก้าอี้โซฟาให้นม'}</span>
            </button>
            {isHoldingBaby && (
              <button
                onClick={() => setActiveModal('postureSelector')}
                className="cursor-pointer select-none px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-lg bg-pink-600 hover:bg-pink-500 border border-white"
              >
                🤱 เลือกท่าให้นมบุตร (4 ท่า)
              </button>
            )}
          </div>
        </Html>
      </group>

      {/* Low Wooden Coffee Table in Front of Sofa (per img_000.jpg & img_001.jpg) */}
      <group position={[-0.4, 0, 0.4]}>
        {/* Table Surface */}
        <mesh
          position={[0, 0.36, 0]}
          castShadow
          receiveShadow
          className="cursor-pointer"
          onClick={() => setActiveModal('tableItems')}
        >
          <boxGeometry args={[1.5, 0.06, 0.9]} />
          <meshStandardMaterial color="#c29b68" roughness={0.35} />
        </mesh>
        {/* Table Legs */}
        {[[-0.68, -0.38], [0.68, -0.38], [-0.68, 0.38], [0.68, 0.38]].map(([x, z], i) => (
          <mesh key={`tbl_leg_${i}`} position={[x, 0.18, z]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.36, 16]} />
            <meshStandardMaterial color="#8c6239" roughness={0.4} />
          </mesh>
        ))}

        {/* ── Table Items Specified in Requirement 3: ── */}
        {/* 1. แก้วเล็กสำหรับเก็บนมแม่ (Small breastmilk collection cup) */}
        <group position={[-0.38, 0.40, -0.15]} onClick={() => setActiveModal('tableItems')}>
          <mesh castShadow>
            <cylinderGeometry args={[0.042, 0.038, 0.08, 20]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.046, 0.046, 0.015, 20]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} />
          </mesh>
        </group>

        {/* 2. แก้วสำหรับป้อนนมทารกในกรณีเต้านมมีอาการผิดปกติ (Cup feeding glass) */}
        <group position={[-0.15, 0.40, -0.15]} onClick={() => setActiveModal('tableItems')}>
          <mesh castShadow>
            <cylinderGeometry args={[0.038, 0.028, 0.07, 20]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.015, 20]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} />
          </mesh>
        </group>

        {/* 3. ไซริงค์สำหรับเก็บน้ำนม + ถุงซิป (Syringe + Breastmilk zip storage bags) */}
        <group position={[0.25, 0.40, -0.1]} onClick={() => setActiveModal('tableItems')}>
          {/* Syringe (5ml / 10ml colostrum collector) */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.015, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 16]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.7} />
          </mesh>
          {/* Stack of Pre-sterilized Milk Storage Zip Bags */}
          <mesh position={[0, 0.01, 0.18]} rotation={[-0.05, 0.2, 0]} castShadow>
            <boxGeometry args={[0.16, 0.02, 0.22]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Click Table Badge */}
        <Html position={[0, 0.58, 0]} center distanceFactor={10}>
          <div
            onClick={() => setActiveModal('tableItems')}
            className="cursor-pointer select-none bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg hover:scale-105 transition"
          >
            🍼 อุปกรณ์เก็บและป้อนนม (คลิกดู)
          </div>
        </Html>
      </group>

      {/* 3D Player Controller */}
      <PlayerController />

      {/* ══════════════════════════════════════════════════════════════════════════
          2D HTML INTERACTIVE OVERLAYS & MODALS
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Poster 1 Modal: 4 Key Signs */}
      {activeModal === 'poster1' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <span>🔍</span> 4 Key Signs การอมหัวนมและการดูดนมแม่ที่ถูกต้อง
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-3 text-slate-800">
                <img
                  src="/references/room1/img_006.png"
                  alt="4 Key Signs"
                  className="w-full h-44 object-contain rounded-lg bg-amber-50 p-2 border border-amber-200"
                />
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-2 text-sm">
                  <div className="font-semibold text-amber-950">1. เห็นลานนมด้านบนมากกว่าด้านล่าง</div>
                  <p className="text-xs text-slate-700 pl-4">คางของทารกจะกดลงบนลานนมส่วนล่าง ทำให้เห็นลานนมด้านบนมากกว่าด้านล่างชัดเจน</p>

                  <div className="font-semibold text-amber-950">2. อ้าปากกว้างแนบชิดสนิทกับเต้านม</div>
                  <p className="text-xs text-slate-700 pl-4">ทารกอ้าปากกว้างมากกว่า 140 องศา อมได้ลึกถึงลานนม ไม่ใช่ดูดเฉพาะหัวนม</p>

                  <div className="font-semibold text-amber-950">3. คางแนบชิดเต้านม</div>
                  <p className="text-xs text-slate-700 pl-4">คางของทารกกดแนบสนิทกับเต้านมแม่ จมูกเปิดโล่งมีช่องว่างให้หายใจสะดวก</p>

                  <div className="font-semibold text-amber-950">4. ริมฝีปากล่างบานออกคล้ายปากปลา</div>
                  <p className="text-xs text-slate-700 pl-4">ริมฝีปากบนและล่างบานม้วนออกด้านนอก ไม่เม้มเข้าใน ทำให้ไม่กดเจ็บหัวนม</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow"
              >
                เข้าใจแล้ว ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* 2. Poster 2 Modal: 4 Key Points */}
      {activeModal === 'poster2' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-sky-400 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-sky-900 flex items-center gap-2">
                  <span>🤱</span> 4 Key Points for Breastfeeding Positioning
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-3 text-slate-800">
                <img
                  src="/references/room1/img_010.jpeg"
                  alt="4 Key Points"
                  className="w-full h-44 object-contain rounded-lg bg-sky-50 p-2 border border-sky-200"
                />
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-200 space-y-2 text-sm">
                  <div className="font-semibold text-sky-950">1. ลำตัวชิดกับแม่ (Chest to chest)</div>
                  <p className="text-xs text-slate-700 pl-4">หน้าอกและหน้าท้องของทารกแนบชิดกับลำตัวแม่ ไม่หงายตัว</p>

                  <div className="font-semibold text-sky-950">2. ลูกหันหน้าเข้าหาเต้านมแม่</div>
                  <p className="text-xs text-slate-700 pl-4">จมูกทารกอยู่ตรงกับหัวนมแม่ในระยะเริ่มต้น ก่อนที่ทารกจะอ้าปากกว้างงับลานนม</p>

                  <div className="font-semibold text-sky-950">3. ศีรษะและลำตัวทารกอยู่ในแนวเดียวกัน</div>
                  <p className="text-xs text-slate-700 pl-4">ศีรษะ ลำตัว และสะโพกเป็นแนวเส้นตรง คอไม่เอียงหรือบิด ทำให้กลืนน้ำนมได้สะดวก</p>

                  <div className="font-semibold text-sky-950">4. ทารกได้รับการประคองอย่างมั่นคง</div>
                  <p className="text-xs text-slate-700 pl-4">แม่ประคองทั้งศีรษะ หลัง และก้นของทารกอย่างนุ่มนวลและมั่นคง</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow"
              >
                เข้าใจแล้ว ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* 3. Poster 3 Modal: 4 Breastfeeding Holds (Cradle, Football, Side Lying, Cross Cradle) */}
      {activeModal === 'poster3' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-4 border-pink-400 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-pink-900 flex items-center gap-2">
                  <span>🌸</span> ท่าให้นมทารก 4 ท่า (Breastfeeding Positions)
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-3 text-slate-800">
                <img
                  src="/references/room1/img_011.png"
                  alt="4 Breastfeeding Positions"
                  className="w-full h-56 object-contain rounded-lg bg-pink-50 p-2 border border-pink-200"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                    <div className="font-bold text-pink-900">1. Cradle Hold (ท่าอุ้มลูกบนแขน)</div>
                    <p className="text-slate-600 mt-1">ศีรษะลูกหนุนอยู่ในข้อพับแขนข้างเดียวกับเต้าที่ดูด ลำตัวแนบชิดอกแม่ เหมาะสำหรับทารกที่ดูดนมเก่งแล้ว</p>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
                    <div className="font-bold text-sky-900">2. Football Hold (ท่าอุ้มสอดข้างลำตัว)</div>
                    <p className="text-slate-600 mt-1">หนีบลูกข้างเอว ขาลูกชี้ไปด้านหลังแม่ มือประคองท้ายทอย เหมาะกับคุณแม่ผ่าตัดคลอดและทารกแฝด</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div className="font-bold text-emerald-900">3. Side Lying (ท่านอนตะแคง)</div>
                    <p className="text-slate-600 mt-1">แม่และลูกนอนตะแคงหันหน้าเข้าหากันบนเตียง ข้อดีคือไม่ต้องเกร็งแขน แม่พักผ่อนได้ขณะให้นม</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="font-bold text-amber-900">4. Cross Cradle (ท่าอุ้มข้ามตัก)</div>
                    <p className="text-slate-600 mt-1">ใช้มือฝั่งตรงข้ามเต้าประคองท้ายทอย มืออีกข้างจับเต้านมแบบ C-hold ช่วยควบคุมการเข้าเต้าได้ดีเยี่ยม</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow"
              >
                เข้าใจแล้ว ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* 4. Table Items Modal (Clicking on table items) */}
      {activeModal === 'tableItems' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-indigo-400">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                  <span>🍼</span> รายการอุปกรณ์บนโต๊ะกลางห้องหน้าโซฟา
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-800">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-start gap-2.5">
                  <span className="text-xl">1️⃣</span>
                  <div>
                    <div className="font-bold text-indigo-950">แก้วเล็กสำหรับเก็บนมแม่</div>
                    <p className="text-xs text-slate-600 mt-0.5">ใช้รองรับน้ำนมที่บีบด้วยมือ เพื่อเก็บน้ำนมแม่สะอาดบริสุทธิ์</p>
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 flex items-start gap-2.5">
                  <span className="text-xl">2️⃣</span>
                  <div>
                    <div className="font-bold text-sky-950">แก้วสำหรับป้อนนมทารก (Cup Feeding)</div>
                    <p className="text-xs text-slate-600 mt-0.5">ใช้ป้อนนมทารกในกรณีเต้านมมีอาการผิดปกติ ไม่สามารถให้นมจากเต้าได้ หรือป้องกันการสับสนหัวนม</p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-start gap-2.5">
                  <span className="text-xl">3️⃣</span>
                  <div>
                    <div className="font-bold text-purple-950">ไซริงค์สำหรับเก็บน้ำนม + ถุงซิป (Colostrum Syringe & Bags)</div>
                    <p className="text-xs text-slate-600 mt-0.5">ไซริงค์ใช้ดูดเก็บหัวน้ำนมหยดแรก (Colostrum) ที่มีคุณค่าสูง และถุงซิปปลอดเชื้อสำหรับแช่แข็งสต็อกน้ำนม</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2.5">
                  <span className="text-xl">4️⃣</span>
                  <div>
                    <div className="font-bold text-amber-950">ตู้เย็นสำหรับเก็บน้ำนม (ชิดมุมล่างซ้าย)</div>
                    <p className="text-xs text-slate-600 mt-0.5">ช่องธรรมดาเก็บได้ 3–5 วัน, ช่องแช่แข็งเก็บได้ 3–6 เดือน ช่วยรักษาคุณค่าสารอาหารและแอนติบอดี</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* 5. Refrigerator Modal */}
      {activeModal === 'fridge' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-400 text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>🥛</span> ตู้เย็นเก็บรักษาน้ำนมแม่ (Breast Milk Storage)
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="bg-amber-50 p-2.5 rounded border border-amber-200">
                  <div className="font-bold text-amber-900">อุณหภูมิห้อง (25°C):</div>
                  <div className="text-slate-700">เก็บได้ประมาณ 4 ชั่วโมง</div>
                </div>
                <div className="bg-sky-50 p-2.5 rounded border border-sky-200">
                  <div className="font-bold text-sky-900">กระติกน้ำแข็ง / ตู้เย็นช่องธรรมดา (4°C):</div>
                  <div className="text-slate-700">เก็บได้ 3 – 5 วัน (ควรวางด้านใน ไม่วางที่ฝาประตู)</div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
                  <div className="font-bold text-blue-900">ช่องแช่แข็งตู้เย็น 2 ประตู (-18°C):</div>
                  <div className="text-slate-700">เก็บได้นานถึง 3 – 6 เดือน</div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-5 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* 6. Posture Selector Modal (When sitting on sofa with baby) */}
      {activeModal === 'postureSelector' && (
        <Html center>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-4 border-pink-400 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-lg font-bold text-pink-900">🤱 เลือกท่าให้นมบุตรขณะนั่งที่เก้าอี้โซฟา</h2>
                  <p className="text-xs text-slate-500">เลือกท่าที่เหมาะสมเพื่อฝึกปฏิบัติก่อนไปห้องถัดไป</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* 4 Choice Cards matching img_011.png */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleSelectHold('cradleHold')}
                  className={`p-3 rounded-xl border-2 text-left transition transform hover:scale-[1.02] flex items-center gap-3 ${
                    selectedHold === 'cradleHold' ? 'border-pink-500 bg-pink-50 shadow' : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl">🤱</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">1. Cradle Hold</div>
                    <div className="text-xs text-slate-600">ท่าอุ้มลูกบนแขน</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectHold('footballHold')}
                  className={`p-3 rounded-xl border-2 text-left transition transform hover:scale-[1.02] flex items-center gap-3 ${
                    selectedHold === 'footballHold' ? 'border-sky-500 bg-sky-50 shadow' : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl">🏈</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">2. Football Hold</div>
                    <div className="text-xs text-slate-600">ท่าอุ้มสอดข้างลำตัว</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectHold('sideLying')}
                  className={`p-3 rounded-xl border-2 text-left transition transform hover:scale-[1.02] flex items-center gap-3 ${
                    selectedHold === 'sideLying' ? 'border-rose-500 bg-rose-50 shadow' : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl">🛏️</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">3. Side Lying</div>
                    <div className="text-xs text-slate-600">ท่านอนตะแคง (บนเตียง)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectHold('crossCradle')}
                  className={`p-3 rounded-xl border-2 text-left transition transform hover:scale-[1.02] flex items-center gap-3 ${
                    selectedHold === 'crossCradle' ? 'border-amber-500 bg-amber-50 shadow' : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl">🤲</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">4. Cross Cradle</div>
                    <div className="text-xs text-slate-600">ท่าอุ้มข้ามตัก</div>
                  </div>
                </button>
              </div>

              {/* Feedback box */}
              {holdFeedback && (
                <div
                  className={`mt-4 p-4 rounded-xl border-2 text-sm ${
                    holdFeedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  <div className="font-bold text-base flex items-center gap-1.5">
                    {holdFeedback.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">{holdFeedback.desc}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
                >
                  ปิดหน้าต่าง
                </button>
                {holdFeedback?.isCorrect && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setShowSuccessModal(true, 'ยินดีด้วย! คุณผ่านบทเรียนการให้นมและการจัดท่าทารกสำเร็จแล้ว');
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow"
                  >
                    🎉 บันทึกความสำเร็จ & รับเกียรติบัตร
                  </button>
                )}
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* 7. Fullscreen TV Modal */}
      {showTvModal && (
        <Html center>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border-4 border-sky-400 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📺</span>
                  <h2 className="text-lg font-bold text-sky-400">
                    {showVideo ? 'คลิปวีดีโอ 1 ท่าอุ้มและการดูดนมที่ถูกวิธี' : tvSlidesData[tvSlide].title}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowTvModal(false);
                    setShowVideo(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4">
                {showVideo ? (
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-700">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/G1muyuyuD60"
                        title="คลิปวีดีโอ1 ท่าอุ้มและการดูดนมที่ถูกวิธี"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg text-xs text-slate-300">
                      <p className="font-semibold text-amber-300">แหล่งที่มา: กรมอนามัย กระทรวงสาธารณสุข</p>
                      <p className="mt-0.5">“ใช้เพื่อการเรียนการศึกษาสำหรับให้ความรู้แก่มารดาหลังคลอด”</p>
                      <a
                        href="https://www.youtube.com/watch?v=G1muyuyuD60"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 underline mt-1 inline-block"
                      >
                        เปิดใน YouTube ใหม่
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={tvSlidesData[tvSlide].img}
                      alt={tvSlidesData[tvSlide].title}
                      className="w-full h-64 object-contain rounded-xl bg-white p-2 border border-slate-700"
                    />
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 text-sm">
                      <h4 className="font-bold text-amber-300 text-base border-b border-slate-700 pb-1.5">
                        สาระสำคัญบทเรียน
                      </h4>
                      <ul className="space-y-1.5 list-disc pl-5 text-slate-200">
                        {tvSlidesData[tvSlide].bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  disabled={tvSlide === 0 || showVideo}
                  onClick={() => setTvSlide((s) => Math.max(0, s - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-sm font-bold"
                >
                  ◀ สไลด์ก่อนหน้า
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm font-bold text-white flex items-center gap-1.5"
                  >
                    <span>{showVideo ? '📑 กลับไปดูสไลด์' : '▶ ดูคลิปวิดีโอ'}</span>
                  </button>
                </div>
                <button
                  disabled={tvSlide === tvSlidesData.length - 1 || showVideo}
                  onClick={() => setTvSlide((s) => Math.min(tvSlidesData.length - 1, s + 1))}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 rounded-lg text-sm font-bold"
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
