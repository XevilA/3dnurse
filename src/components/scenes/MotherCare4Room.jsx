import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import PlayerController from '../player/PlayerController';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { TitleSign, WindowWithCurtains } from '../ward/WardKit';
import {
  WoodFramedBacklitPanel,
  CozySectionalSofaSet,
  CozyRoomDecorCorners,
} from '../furniture/CozyRoomFurniture';
import { getQuestionsByRoomKey } from '../../data/quizData';

// ── ข้อมูลภาพสไลด์ทั้ง 6 ภาพของ Ward 104 (ภาพรวม + รายละเอียด 1–5 ตาม IMG_7526, 7529–7533) ──
const W104_GALLERY = [
  {
    src: '/images/rev/w104_overview.jpg',
    title: 'ภาพรวม: การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด (5 อาการสำคัญ)',
    badge: 'ภาพรวม • Ward 104',
    description: 'อาการสำคัญที่ต้องเฝ้าระวังหลังคลอด หากพบอาการเหล่านี้ ควรรีบไปพบแพทย์ทันที',
  },
  {
    src: '/images/rev/w104_card1_pph.jpg',
    title: '1. เลือดออกมากหลังคลอด (ตกเลือดหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 1/5',
    description: 'เลือดออกชุ่มผ้าอนามัย 1 แผ่น ภายใน 1 ชั่วโมง หรือมีก้อนเลือดขนาดใหญ่ไหลออก ร่วมกับเวียนศีรษะ หน้ามืด อ่อนเพลียมาก',
    details: [
      'สังเกตปริมาณเลือดและลักษณะก้อนเลือด',
      'หลีกเลี่ยงการลุกเดินเร็วเมื่อมีอาการหน้ามืด',
      'ขอความช่วยเหลือและไปพบแพทย์ทันที',
    ],
  },
  {
    src: '/images/rev/w104_card2_fever_lochia.jpg',
    title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น (การติดเชื้อหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 2/5',
    description: 'มีไข้ตั้งแต่ 38 °C ขึ้นไป น้ำคาวปลามีกลิ่นเหม็น สีผิดปกติ ปวดท้องน้อยมากขึ้น หรือแผลฝีเย็บ/แผลผ่าตัดบวม แดง มีหนอง',
    details: [
      'วัดอุณหภูมิร่างกายและสังเกตลักษณะน้ำคาวปลา',
      'รักษาความสะอาดของแผลและเปลี่ยนผ้าอนามัยสม่ำเสมอ',
      'รีบไปพบแพทย์เพื่อรับการตรวจและรักษา',
    ],
  },
  {
    src: '/images/rev/w104_card3_preeclampsia.jpg',
    title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว (ภาวะความดันโลหิตสูงหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 3/5',
    description: 'ปวดศีรษะรุนแรงไม่ทุเลา มองเห็นไม่ชัด ตาพร่ามัว จุกแน่นใต้ลิ้นปี่ หน้า มือ หรือเท้าบวมมากผิดปกติ',
    details: [
      'นั่งหรือนอนพักในที่ปลอดภัย ไม่ขับรถเอง',
      'วัดความดันโลหิตหากมีเครื่องวัด',
      'รีบไปโรงพยาบาลทันทีเพราะอาจเกิดภาวะชักได้',
    ],
  },
  {
    src: '/images/rev/w104_card4_dvt.jpg',
    title: '4. ปวดหรือบวมน่อง (ภาวะลิ่มเลือดอุดตันหลอดเลือดดำ)',
    badge: 'ผนังที่ 2 • ภาพที่ 4/5',
    description: 'ปวดตึง บวม แดง หรือร้อนบริเวณน่องหรือขาข้างใดข้างหนึ่ง โดยเฉพาะเวลาเดินหรือกระดกปลายเท้า',
    details: [
      'ห้ามนวดหรือบีบบริเวณน่องที่ปวดบวมเด็ดขาด',
      'พักขาและรีบไปพบแพทย์เพื่อตรวจประเมินทันที',
    ],
  },
  {
    src: '/images/rev/w104_card5_chest_pain.jpg',
    title: '5. เจ็บหน้าอก หรือหายใจลำบาก (ภาวะฉุกเฉินระบบหัวใจและปอด)',
    badge: 'ผนังที่ 2 • ภาพที่ 5/5',
    description: 'เจ็บแน่นหน้าอก หายใจลำบาก หอบเหนื่อยเฉียบพลัน ใจสั่น หรือหน้ามืดคล้ายจะเป็นลม',
    details: [
      'นั่งพักในท่าศีรษะสูงและตั้งสติ',
      'แจ้งญาติหรือเรียกรถพยาบาลฉุกเฉิน (1669) ไปโรงพยาบาลทันที',
    ],
  },
];

// ── กิจกรรมที่ 1: จำแนกอาการปกติ vs อาการผิดปกติที่ต้องไปโรงพยาบาล (ตาม IMG_7534.JPG) ──
const SYMPTOM_ITEMS = [
  {
    id: 'sym1',
    text: 'เลือดออกชุ่มผ้าอนามัยเกิน 1 แผ่นภายใน 1 ชั่วโมง หรือมีก้อนเลือดขนาดใหญ่',
    correct: 'danger',
    reason: 'เป็นสัญญาณภาวะตกเลือดหลังคลอด ต้องรีบไปโรงพยาบาลทันที',
  },
  {
    id: 'sym2',
    text: 'น้ำคาวปลาค่อย ๆ จางลงจากสีแดงเป็นสีชมพูและสีขาวเหลือง ไม่มีกลิ่นเหม็น',
    correct: 'normal',
    reason: 'เป็นการเปลี่ยนแปลงตามปกติของน้ำคาวปลา (Lochia) หลังคลอด',
  },
  {
    id: 'sym3',
    text: 'มีไข้ 38.5 °C ร่วมกับน้ำคาวปลามีกลิ่นเหม็นและปวดท้องน้อยรุนแรง',
    correct: 'danger',
    reason: 'บ่งชี้การติดเชื้อในโพรงมดลูกหลังคลอด ต้องพบแพทย์ทันที',
  },
  {
    id: 'sym4',
    text: 'ปวดศีรษะรุนแรง ตาพร่ามัว มองเห็นภาพซ้อน และจุกแน่นลิ้นปี่',
    correct: 'danger',
    reason: 'เป็นสัญญาณอันตรายของภาวะครรภ์เป็นพิษหลังคลอด ต้องรีบไปพบแพทย์ทันที',
  },
  {
    id: 'sym5',
    text: 'ปวดตึง บวม แดง ร้อนที่น่องข้างเดียว หรือเจ็บหน้าอก หายใจหอบเหนื่อย',
    correct: 'danger',
    reason: 'เสี่ยงภาวะลิ่มเลือดอุดตันหลอดเลือดดำหรือปอด ต้องไปโรงพยาบาลทันที ห้ามนวดขา',
  },
];

export default function MotherCare4Room() {
  const { setRoom, completeModule, setShowSuccessModal, setHoldingBaby, sitDown, seatedTarget } = useStore();
  const openLightbox = useStore((s) => s.openLightbox);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeTab, setActiveTab] = useState('classify'); // 'classify' | 'review' | 'quiz'
  const [answers, setAnswers] = useState({});
  const [classifyFeedback, setClassifyFeedback] = useState(null);
  const [reviewedCards, setReviewedCards] = useState([]);

  useEffect(() => {
    setHoldingBaby(false);
  }, [setHoldingBaby]);

  const openGalleryAt = (index) => {
    openLightbox({
      ...W104_GALLERY[index],
      items: W104_GALLERY,
      currentIndex: index,
    });
  };

  const handleClassify = (id, choice) => {
    setAnswers((prev) => ({ ...prev, [id]: choice }));
    setClassifyFeedback(null);
  };

  const checkClassification = () => {
    for (const item of SYMPTOM_ITEMS) {
      if (!answers[item.id]) {
        setClassifyFeedback({ pass: false, msg: 'กรุณาจำแนกอาการให้ครบทั้ง 5 ข้อก่อนตรวจคำตอบค่ะ' });
        return;
      }
      if (answers[item.id] !== item.correct) {
        setClassifyFeedback({
          pass: false,
          msg: `✕ ข้อ "${item.text}" ยังไม่ถูกต้อง ลองเลือกใหม่อีกครั้งนะคะ`,
        });
        return;
      }
    }
    setClassifyFeedback({
      pass: true,
      msg: '✓ ถูกต้องครบทุกข้อค่ะ! คุณแม่สามารถจำแนกอาการปกติและอาการอันตรายที่ต้องรีบไปพบแพทย์ได้อย่างแม่นยำ',
    });
    completeModule('motherCare4');
  };

  // Quiz
  const room4Questions = getQuestionsByRoomKey('motherCare4');
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
    if (choice === currentQ.answer) setQuizScore((prev) => prev + 1);
  };

  const handleNextQuizQuestion = () => {
    setQuizUserChoice(null);
    setQuizShowFeedback(false);
    if (quizIndex < room4Questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      completeModule('motherCare4');
      setShowSuccessModal(
        true,
        `ยินดีด้วย! คุณผ่านการเรียนรู้และการประเมินความรู้ห้อง Ward 104 การสังเกตอาการผิดปกติหลังคลอดเรียบร้อยแล้ว`
      );
    }
  };

  const handleSitSofa = () => {
    setHoldingBaby(false);
    sitDown({
      id: 'room104_sofa',
      name: 'โซฟาเรียนรู้การสังเกตอาการผิดปกติหลังคลอด',
      type: 'sofa',
      position: [0.5, 0, -0.2],
      rotationY: 0,
      seatOffset: [0, 0.44, 0.15],
      isDrivable: false,
    });
    setShowActivityModal(true);
  };

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        cozyMode={true}
        roomTitle="ห้องบริบาลมารดา 4: การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด"
        roomNumber="Ward 104"
      />

      <TitleSign
        position={[0, 4.9, -8.92]}
        width={6.2}
        height={1.65}
        line1="Ward 104"
        line2="การสังเกตอาการผิดปกติและแทรกซ้อนหลังคลอด"
      />

      <WindowWithCurtains position={[-5.8, 2.8, -8.92]} width={3.4} height={2.8} />
      <WindowWithCurtains position={[5.8, 2.8, -8.92]} width={3.4} height={2.8} />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังกลาง (Z = -8.84): ภาพรวม 5 อาการสำคัญ (IMG_7526.JPG) พร้อมกรอบไม้โอ๊คไฟซ่อนอุ่น
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[0, 2.55, -8.84]} rotation={[0, 0, 0]} width={5.8} height={4.1}>
        <Html position={[0, 0, 0]} center transform scale={0.28}>
          <div
            onClick={() => openGalleryAt(0)}
            style={{
              width: '770px',
              height: '540px',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '5px solid #ffffff',
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
              cursor: 'pointer',
              background: '#fff1f2',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <img
              src="/images/rev/w104_overview.jpg"
              alt="การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด"
              style={{ width: '100%', flex: 1, objectFit: 'contain', background: '#fff1f2' }}
            />
            <div style={{
              background: '#be185d',
              color: '#ffffff',
              padding: '8px 16px',
              fontWeight: 900,
              fontSize: '17px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด (5 อาการสำคัญ)</span>
              <span style={{ background: '#ffffff', color: '#be185d', padding: '3px 12px', borderRadius: '999px', fontSize: '14px' }}>
                🔍 คลิกเพื่อดูภาพขยาย
              </span>
            </div>
          </div>
        </Html>
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 1 (ซ้าย X = -8.84): แสดงภาพ 1, 2, 3 (ตามสมุดโน้ตไม่มีชื่อ 2 หน้า 3–4) พร้อมกรอบไม้โอ๊คไฟซ่อนอุ่น
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[-8.84, 2.75, 0]} rotation={[0, Math.PI / 2, 0]} width={10.8} height={4.2}>
        <Html position={[0, 0, 0]} center transform scale={0.28}>
          <div
            style={{
              width: '1420px',
              height: '540px',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)',
              border: '5px solid #ffffff',
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
              padding: '14px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{
              background: '#e11d48',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>ผนังที่ 1: อาการผิดปกติที่ต้องเฝ้าระวัง (ภาพที่ 1, 2, 3) — คลิกที่ภาพเพื่อขยายอ่านชัดเจน</span>
              <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '999px' }}>
                มีปุ่ม ก่อนหน้า / ถัดไป
              </span>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              {[
                { idx: 1, title: '1. เลือดออกมากหลังคลอด', img: '/images/rev/w104_card1_pph.jpg' },
                { idx: 2, title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น', img: '/images/rev/w104_card2_fever_lochia.jpg' },
                { idx: 3, title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว', img: '/images/rev/w104_card3_preeclampsia.jpg' },
              ].map((card) => (
                <div
                  key={card.idx}
                  onClick={() => openGalleryAt(card.idx)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '2px solid #fecdd3',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    style={{ width: '100%', flex: 1, objectFit: 'contain', background: '#fff1f2' }}
                  />
                  <div style={{
                    background: '#ffe4e6',
                    color: '#9f1239',
                    fontWeight: 900,
                    fontSize: '15px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>{card.title}</span>
                    <span>🔍 ขยาย</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Html>
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 2 (ขวา X = +8.84): แสดงภาพ 4, 5 (ตามสมุดโน้ตไม่มีชื่อ 2 หน้า 4) พร้อมกรอบไม้โอ๊คไฟซ่อนอุ่น
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[8.84, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]} width={8.4} height={4.2}>
        <Html position={[0, 0, 0]} center transform scale={0.28}>
          <div
            style={{
              width: '1100px',
              height: '540px',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
              border: '5px solid #ffffff',
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
              padding: '14px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{
              background: '#d97706',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>ผนังที่ 2: อาการผิดปกติที่ต้องเฝ้าระวัง (ภาพที่ 4, 5) — คลิกที่ภาพเพื่อขยายอ่านชัดเจน</span>
              <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '999px' }}>
                มีปุ่ม ก่อนหน้า / ถัดไป
              </span>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { idx: 4, title: '4. ปวดหรือบวมน่อง', img: '/images/rev/w104_card4_dvt.jpg' },
                { idx: 5, title: '5. เจ็บหน้าอก หรือหายใจลำบาก', img: '/images/rev/w104_card5_chest_pain.jpg' },
              ].map((card) => (
                <div
                  key={card.idx}
                  onClick={() => openGalleryAt(card.idx)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '2px solid #fde68a',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    style={{ width: '100%', flex: 1, objectFit: 'contain', background: '#fffbeb' }}
                  />
                  <div style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 900,
                    fontSize: '16px',
                    padding: '8px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>{card.title}</span>
                    <span>🔍 ขยาย</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Html>
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          🛋️ ชุดโซฟาแอลเชปผ้าทอสีเทาเบจ + หมอนรองให้นมรูปตัว U + สตูลพรมถักสีเขียวอ่อน +
             พรมทอสีครีมเบจ + โต๊ะกลางไม้ขาววางไอแพด/แก้วน้ำ/แจกันดอกเดซี่ + ตู้ไม้โคมไฟอุ่น
             (ตรงตามภาพตัวอย่าง สมุดโน้ตไม่มีชื่อ 2 หน้า 4 ทุกประการ)
          ══════════════════════════════════════════════════════════════════════════ */}
      <InteractiveSeat
        id="room104_sofa"
        name="โซฟาเรียนรู้การสังเกตอาการผิดปกติหลังคลอด"
        type="sofa"
        position={[0.5, 0, -0.2]}
        rotation={[0, 0, 0]}
        seatOffset={[0, 0.44, 0.15]}
      >
        <Html position={[0, 1.38, 0]} center distanceFactor={12} zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSitSofa();
            }}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be185d)',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '999px',
              padding: '8px 20px',
              fontWeight: 900,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(190,24,93,0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            {seatedTarget?.id === 'room104_sofa'
              ? '🩺 กำลังนั่งบนโซฟา — คลิกเปิดกิจกรรมสังเกตอาการผิดปกติ & ภาวะแทรกซ้อน'
              : '🛋️ คลิกนั่งโซฟาเพื่อเรียนรู้การสังเกตอาการผิดปกติ & จำแนกอาการหลังคลอด'}
          </button>
        </Html>
      </InteractiveSeat>

      <CozySectionalSofaSet
        onClickSofa={handleSitSofa}
        onClickTablet={() => setShowActivityModal(true)}
        tabletLabel="📋 คลิกแท็บเล็ตบนโต๊ะ: จำแนกอาการปกติและอาการที่ต้องไปโรงพยาบาล"
      />

      <CozyRoomDecorCorners />
      <RealPlant type="potted" position={[-7.6, 0, -7.2]} scale={1.2} />
      <RealPlant type="potted" position={[7.6, 0, -7.2]} scale={1.2} />
      <RealPlant type="succulent" position={[7.5, 0, 6.8]} scale={1.25} />

      {/* ══════════════════════════════════════════════════════════════════════════
          🩺 หน้าต่างกิจกรรม Ward 104:
          1. สังเกตอาการผิดปกติ (จำแนกอาการปกติ vs อาการผิดปกติที่ต้องพบแพทย์)
          2. ทบทวนภาวะแทรกซ้อน 5 อาการสำคัญและฝึกดูแลตนเอง
          3. แบบทดสอบความรู้ประจำห้อง
          ══════════════════════════════════════════════════════════════════════════ */}
      {showActivityModal && (
        <Html fullscreen zIndexRange={[120, 0]}>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 200,
              fontFamily: '"Sarabun", system-ui, -apple-system, sans-serif',
            }}
            onClick={() => setShowActivityModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(980px, 96vw)',
                maxHeight: '90vh',
                background: '#fffdf9',
                borderRadius: '26px',
                border: '4px solid #f43f5e',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: 'linear-gradient(90deg, #ffe4e6 0%, #fecdd3 50%, #fef3c7 100%)',
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #fda4af',
                }}
              >
                <div>
                  <span style={{
                    background: '#e11d48',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 900,
                  }}>
                    Ward 104 • การสังเกตอาการผิดปกติหลังคลอด
                  </span>
                  <h2 style={{ margin: '6px 0 0', fontSize: '23px', fontWeight: 900, color: '#881337' }}>
                    การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  style={{
                    background: '#be185d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  ✕ ปิดหน้าต่าง
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '10px', padding: '14px 24px 0', background: '#fff1f2' }}>
                {[
                  { id: 'classify', label: '1. กิจกรรมสังเกตอาการผิดปกติ (จำแนกอาการ)' },
                  { id: 'review', label: '2. ทบทวนภาวะแทรกซ้อน 5 อาการสำคัญ & ฝึกดูแลตนเอง' },
                  { id: 'quiz', label: '3. แบบทดสอบท้ายห้อง' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: '14px 14px 0 0',
                      border: 'none',
                      background: activeTab === t.id ? '#e11d48' : '#ffe4e6',
                      color: activeTab === t.id ? '#ffffff' : '#9f1239',
                      fontWeight: 900,
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
                {activeTab === 'classify' && (
                  <div>
                    <div style={{
                      background: '#fff1f2',
                      borderLeft: '5px solid #e11d48',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '16px',
                      color: '#881337',
                      fontWeight: 800,
                    }}>
                      คำแนะนำ: พิจารณาอาการต่อไปนี้ แล้วจำแนกว่าเป็น "อาการปกติ" หรือ "อาการผิดปกติที่ต้องรีบไปพบแพทย์ทันที"
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {SYMPTOM_ITEMS.map((item, i) => {
                        const chosen = answers[item.id];
                        return (
                          <div
                            key={item.id}
                            style={{
                              background: '#ffffff',
                              border: '2px solid #fecdd3',
                              borderRadius: '16px',
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '16px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: '280px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                                {i + 1}. {item.text}
                              </div>
                              {classifyFeedback && (
                                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px', fontWeight: 700 }}>
                                  💡 {item.reason}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleClassify(item.id, 'normal')}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  border: chosen === 'normal' ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
                                  background: chosen === 'normal' ? '#dcfce7' : '#ffffff',
                                  color: chosen === 'normal' ? '#15803d' : '#334155',
                                  fontWeight: 900,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                }}
                              >
                                ✓ อาการปกติหลังคลอด
                              </button>
                              <button
                                type="button"
                                onClick={() => handleClassify(item.id, 'danger')}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  border: chosen === 'danger' ? '2px solid #e11d48' : '1.5px solid #cbd5e1',
                                  background: chosen === 'danger' ? '#ffe4e6' : '#ffffff',
                                  color: chosen === 'danger' ? '#be123c' : '#334155',
                                  fontWeight: 900,
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                }}
                              >
                                🚨 อาการผิดปกติ (รีบไปพบแพทย์)
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {classifyFeedback && (
                      <div style={{
                        marginTop: '14px',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        background: classifyFeedback.pass ? '#dcfce7' : '#fee2e2',
                        color: classifyFeedback.pass ? '#166534' : '#991b1b',
                        fontWeight: 900,
                        fontSize: '16px',
                      }}>
                        {classifyFeedback.msg}
                      </div>
                    )}

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={checkClassification}
                        style={{
                          background: '#e11d48',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 28px',
                          borderRadius: '14px',
                          fontWeight: 900,
                          fontSize: '17px',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ ตรวจคำตอบ
                      </button>
                      {classifyFeedback?.pass && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('review')}
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontWeight: 900,
                            fontSize: '17px',
                            cursor: 'pointer',
                          }}
                        >
                          ไปกิจกรรมที่ 2: ทบทวนภาวะแทรกซ้อน 5 อาการ ➜
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'review' && (
                  <div>
                    <div style={{
                      background: '#fffbeb',
                      borderLeft: '5px solid #d97706',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '16px',
                      color: '#92400e',
                      fontWeight: 800,
                    }}>
                      คลิกที่แต่ละการ์ดเพื่อศึกษารายละเอียดอาการและแนวทางการดูแลตนเองเบื้องต้นก่อนไปโรงพยาบาล
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '14px' }}>
                      {W104_GALLERY.slice(1).map((card, i) => {
                        const idx = i + 1;
                        const seen = reviewedCards.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!seen) setReviewedCards((prev) => [...prev, idx]);
                              openGalleryAt(idx);
                            }}
                            style={{
                              background: '#ffffff',
                              borderRadius: '16px',
                              border: seen ? '2.5px solid #16a34a' : '2px solid #fecdd3',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            }}
                          >
                            <img
                              src={card.src}
                              alt={card.title}
                              style={{ width: '100%', height: '190px', objectFit: 'contain', background: '#fff1f2' }}
                            />
                            <div style={{ padding: '10px 14px' }}>
                              <div style={{ fontWeight: 900, fontSize: '16px', color: '#881337' }}>{card.title}</div>
                              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>{card.description}</div>
                              <div style={{
                                marginTop: '8px',
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                background: seen ? '#dcfce7' : '#ffe4e6',
                                color: seen ? '#166534' : '#be123c',
                                fontSize: '12px',
                                fontWeight: 900,
                              }}>
                                {seen ? '✓ ศึกษาแล้ว (คลิกเพื่อดูซ้ำ)' : '🔍 คลิกเพื่อดูภาพใหญ่'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: '18px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('quiz')}
                        style={{
                          background: '#7c3aed',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 26px',
                          borderRadius: '14px',
                          fontWeight: 900,
                          fontSize: '17px',
                          cursor: 'pointer',
                        }}
                      >
                        ไปทำแบบทดสอบท้ายห้อง ➜
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    {!quizFinished ? (
                      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '2px solid #fecdd3' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, color: '#9f1239' }}>
                          <span>แบบประเมินความรู้ Ward 104</span>
                          <span>ข้อ {quizIndex + 1} / {room4Questions.length}</span>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>
                          "{currentQ.question}"
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                          {[
                            { val: true, label: '✓ ใช่ / ถูกต้อง' },
                            { val: false, label: '✕ ไม่ใช่ / ไม่ถูกต้อง' },
                          ].map((btn) => (
                            <button
                              key={String(btn.val)}
                              type="button"
                              disabled={quizShowFeedback}
                              onClick={() => handleQuizAnswer(btn.val)}
                              style={{
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 900,
                                borderRadius: '14px',
                                border: '2px solid #f43f5e',
                                background: quizShowFeedback && currentQ.answer === btn.val ? '#dcfce7' : '#fff1f2',
                                color: '#881337',
                                cursor: quizShowFeedback ? 'default' : 'pointer',
                              }}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        {quizShowFeedback && (
                          <div style={{ background: '#f0fdf4', border: '2px solid #86efac', padding: '14px', borderRadius: '14px' }}>
                            <div style={{ fontWeight: 900, fontSize: '17px', color: '#166534', marginBottom: '6px' }}>
                              {quizUserChoice === currentQ.answer ? '🎉 ถูกต้องค่ะ!' : `เฉลย: ${currentQ.answerText}`}
                            </div>
                            <div style={{ fontSize: '15px', color: '#334155', marginBottom: '12px' }}>
                              💡 {currentQ.reason}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextQuizQuestion}
                              style={{
                                background: '#e11d48',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '12px',
                                fontWeight: 900,
                                fontSize: '16px',
                                cursor: 'pointer',
                              }}
                            >
                              {quizIndex < room4Questions.length - 1 ? 'ข้อถัดไป ➜' : 'เสร็จสิ้นบทเรียน 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px' }}>
                        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#15803d' }}>
                          🎉 ผ่านการเรียนรู้ Ward 104 การสังเกตอาการผิดปกติหลังคลอดเรียบร้อยแล้ว!
                        </h3>
                        <button
                          type="button"
                          onClick={() => setRoom('lobby')}
                          style={{
                            marginTop: '14px',
                            background: '#e11d48',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 26px',
                            borderRadius: '14px',
                            fontWeight: 900,
                            fontSize: '17px',
                            cursor: 'pointer',
                          }}
                        >
                          กลับสู่ล็อบบี้ 🏥
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Html>
      )}

      <PlayerController initialPosition={[0, 0, 4.2]} />
    </group>
  );
}
