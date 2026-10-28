import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import PlayerController from '../player/PlayerController';
import HospitalRoomShell from '../environment/HospitalRoomShell';
import RealPlant from '../decorations/RealPlant';
import InteractiveSeat from '../furniture/InteractiveSeat';
import { TitleSign, WindowWithCurtains } from '../ward/WardKit';
import {
  WoodFramedBacklitPanel,
  FramedImagePoster3D,
  CozySectionalSofaSet,
  CozyRoomDecorCorners,
} from '../furniture/CozyRoomFurniture';
import { getQuestionsByRoomKey } from '../../data/quizData';

// ── ข้อมูลภาพสไลด์ทั้ง 6 ภาพของ Ward 104 (ภาพรวม + รายละเอียด 1–5 ตาม IMG_7526, 7529–7533) ──
const W104_GALLERY = [
  {
    src: '/images/rev/w104_overview.jpg',
    title: 'ภาพรวม: การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด (5 อาการสำคัญ)',
    badge: 'ภาพรวม 5 อาการสำคัญ',
    description: 'อาการสำคัญที่ต้องเฝ้าระวังหลังคลอด 5 อาการ: 1.เลือดออกมาก 2.ไข้/น้ำคาวปลาเหม็น 3.ปวดศีรษะรุนแรง/ตาพร่ามัว 4.ปวดหรือบวมน่อง 5.เจ็บหน้าอก/หายใจลำบาก หากพบอาการเหล่านี้ ควรรีบไปพบแพทย์ทันที',
    details: [
      '1. เลือดออกมาก — ภาวะตกเลือดหลังคลอด',
      '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น — การติดเชื้อหลังคลอด',
      '3. ปวดศีรษะรุนแรง ตาพร่ามัว — ภาวะความดันโลหิตสูง (Preeclampsia/Eclampsia)',
      '4. ปวดหรือบวมน่อง — ภาวะลิ่มเลือดอุดตัน (DVT)',
      '5. เจ็บหน้าอก หรือหายใจลำบาก — ภาวะฉุกเฉินระบบหัวใจและปอด',
    ],
  },
  {
    src: '/images/rev/w104_card1_pph.jpg',
    title: '1. เลือดออกมากหลังคลอด (ตกเลือดหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 1/5',
    description: 'ภาวะตกเลือดหลังคลอด คือ การเสียเลือดทางช่องคลอดมากกว่าปกติ ส่วนใหญ่เกิดใน 24 ชั่วโมงแรกหลังคลอด แต่สามารถเกิดได้ภายหลัง',
    details: [
      '⚠️ อาการอันตราย (ต้องไปโรงพยาบาลทันที):',
      '• เลือดออกมากขึ้น ไม่ลดลง',
      '• มีเลือดสดไหลต่อเนื่อง',
      '• มีลิ่มเลือดขนาดใหญ่',
      '• เปียกผ้าอนามัยเร็วกว่า 1 แผ่น/ชั่วโมง ต่อเนื่อง 2 ชั่วโมง',
      '• หน้ามืด ใจสั่น เวียนศีรษะ อ่อนเพลีย ซีด',
      '🛡️ การป้องกัน: ให้ลูกดูดนมเร็วและบ่อย, พักผ่อนเพียงพอ, หลีกเลี่ยงการยกของหนักใน 6 สัปดาห์แรก',
      '• ปัสสาวะให้เรียบร้อย ไม่กลั้นปัสสาวะ',
      '• มาตรวจตามนัด 6 สัปดาห์ หรือเร็วกว่านั้นหากมีอาการผิดปกติ',
    ],
  },
  {
    src: '/images/rev/w104_card2_fever_lochia.jpg',
    title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น (การติดเชื้อหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 2/5',
    description: 'หลังคลอดอาจมีไข้และน้ำคาวปลาที่ผิดปกติได้จากการติดเชื้อมดลูกหรืออวัยวะสืบพันธุ์ ทำให้น้ำคาวปลามีกลิ่นเหม็น สีผิดปกติ และอาจมีไข้ร่วมด้วย',
    details: [
      '✅ ลักษณะน้ำคาวปลาปกติ:',
      '• ระยะที่ 1 (1–3 วันแรก): สีแดงคล้ำ ปริมาณค่อย ๆ ลดลง',
      '• ระยะที่ 2 (4–10 วัน): สีชมพู',
      '• ระยะที่ 3 (หลัง 10 วันขึ้นไป): สีขาวเหลือง ปริมาณน้อย ๆ ลดลง',
      '⚠️ ลักษณะน้ำคาวปลาผิดปกติ (ต้องไปโรงพยาบาล):',
      '• มีไข้ ≥ 38 °C หรือไข้ต่อเนื่อง, น้ำคาวปลามีกลิ่นเหม็น',
      '• น้ำคาวปลาเปลี่ยนเป็นสีผิดปกติ (เหลือง เขียว น้ำตาล)',
      '• ปวดท้องน้อยมากขึ้น หรือมีกดเจ็บมดลูก',
      '• หนาวสั่น อ่อนเพลีย มีอาการผิดปกติร่วม',
      '🛡️ การดูแลตนเอง: พักผ่อน, รักษาความสะอาดร่างกายและแผลฝีเย็บ, เปลี่ยนผ้าอนามัยทุก 3–4 ชั่วโมง, ดื่มน้ำให้เพียงพอ, รับประทานอาหารครบ 5 หมู่, หลีกเลี่ยงการสวนล้างช่องคลอด',
    ],
  },
  {
    src: '/images/rev/w104_card3_preeclampsia.jpg',
    title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว (ภาวะความดันโลหิตสูงหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 3/5',
    description: 'การปวดศีรษะรุนแรงหรือนานผิดปกติ ร่วมกับตาพร่ามัว มองเห็นไม่ชัด อาจเป็นสัญญาณของภาวะความดันโลหิตสูงหลังคลอด (Preeclampsia/Eclampsia)',
    details: [
      '✅ อาการปกติ (เฝ้าสังเกต):',
      '• ปวดศีรษะเล็กน้อย จากการพักผ่อนน้อย',
      '• อาการดีขึ้นเมื่อพักผ่อน',
      '• ไม่มีตาพร่ามัว หรือการมองเห็นผิดปกติ',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที):',
      '• ปวดศีรษะรุนแรง ปวดไม่หาย',
      '• ตาพร่ามัว มองเห็นไม่ชัด เห็นสว่าง หรือเห็นภาพซ้อน',
      '• ร่วมกับความดันโลหิตสูง (ค่าวัดได้ ≥ 140/90 mmHg)',
      '• คลื่นไส้ อาเจียน ปวดแน่นบริเวณลิ้นปี่',
      '⚠️ สัญญาณอันตราย: ความดันโลหิตสูง ≥ 140/90 mmHg + ชัก หรือหมดสติ + ปวดแน่นบริเวณลิ้นปี่ + เห็นสวาง หรือตาพร่ามัวมากขึ้น + คลื่นไส้ อาเจียนรุนแรง',
      '🛡️ การดูแลตนเอง: พักผ่อน ลดความเครียด, หากมีเครื่องวัดความดันโลหิต ควรตรวจตามคำแนะนำ, รับประทานอาหารที่มีประโยชน์ ลดเค็ม, หลีกเลี่ยงคาเฟอีนและเครื่องดื่มกระตุ้น',
    ],
  },
  {
    src: '/images/rev/w104_card4_dvt.jpg',
    title: '4. ปวดหรือบวมน่อง (ภาวะลิ่มเลือดอุดตันหลอดเลือดดำ)',
    badge: 'ผนังที่ 2 • ภาพที่ 4/5',
    description: 'อาการปวด บวม ตึง หรือรู้สึกหนักที่น่อง อาจเกิดจากลิ่มเลือดอุดตันในหลอดเลือดดำลึก ซึ่งพบบ่อยหลังคลอด เนื่องจากร่างกายมีการเปลี่ยนแปลงของการแข็งตัวของเลือด และการไหลเวียนเลือดช้า',
    details: [
      '✅ อาการปกติ (เฝ้าสังเกต):',
      '• รู้สึกตึง หรือหนักน่องเล็กน้อย',
      '• อาจมีบวมเล็กน้อยโดยเฉพาะช่วงเย็น',
      '• อาการดีขึ้นเมื่อยกขาสูง หรือพักผ่อน',
      '• มักไม่แดง ไม่ร้อน และไม่ปวดมาก',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที):',
      '• ปวดน่องมากขึ้น โดยเฉพาะข้างเดียว',
      '• น่องบวมผิดปกติ ข้างเดียวโดยขึ้น',
      '• กดแล้วเจ็บ รู้สึกตึง หรือแน่น',
      '• ผิวหนังแดง ร้อน หรือมีสีคล้ำ',
      '• อาจมีอาการร่วม เช่น หายใจเหนื่อย แน่นหน้าอก (อาจมีลิ่มเลือดไปที่ปอด)',
      '🛡️ การป้องกัน: ขยับร่างกายและเดินบ่อย ๆ ไม่อยู่ในท่าเดิมนาน, ยกขาสูงเมื่อพักผ่อน, ดื่มน้ำให้เพียงพอ, รับประทานอาหารที่มีประโยชน์, นวดเบา ๆ เพื่อกระตุ้นการไหลเวียนเลือด, หากมีปัจจัยเสี่ยงควรปรึกษาแพทย์',
    ],
  },
  {
    src: '/images/rev/w104_card5_chest_pain.jpg',
    title: '5. เจ็บหน้าอก หรือหายใจลำบาก (ภาวะฉุกเฉินระบบหัวใจและปอด)',
    badge: 'ผนังที่ 2 • ภาพที่ 5/5',
    description: 'อาการเจ็บหน้าอก หายใจไม่อิ่ม แน่นหน้าอก หายใจลำบาก หรือหายใจเร็ว อาจเกิดจากภาวะแทรกซ้อนที่อันตราย เช่น ลิ่มเลือดอุดตันในปอด (Pulmonary Embolism) ภาวะหัวใจล้มเหลว หรือการติดเชื้อรุนแรง',
    details: [
      '✅ อาการปกติ (เฝ้าสังเกต):',
      '• หายใจปกติ ไม่เหนื่อยง่าย',
      '• ไม่เจ็บหน้าอก',
      '• สามารถทำกิจวัตรประจำวันได้ตามปกติ',
      '• ไม่มีอาการแน่นหน้าอก หรือใจสั่น',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที):',
      '• เจ็บหน้าอกรุนแรงหรือแน่นหน้าอก',
      '• หายใจลำบาก หายใจไม่อิ่ม หรือหายใจเร็ว',
      '• หายใจแล้วเจ็บมากขึ้น',
      '• ใจสั่น หน้ามืด เหงื่อออกมาก',
      '• ไมมีเลือดปน',
      '• หมดสติ หรือรู้สึกเหมือนจะเป็นลม (อาจเกิดจากลิ่มเลือดอุดตันในปอด)',
      '🛡️ การป้องกัน: ขยับร่างกายและเดินบ่อย ๆ ไม่อยู่ในท่าเดิมนาน, ดื่มน้ำให้เพียงพอ, รับประทานอาหารที่มีประโยชน์, หลีกเลี่ยงการสูบบุหรี่และเครื่องดื่มแอลกอฮอล์, บริหารขาและเท้าเพื่อกระตุ้นการไหลเวียนเลือด, สังเกตอาการตนเองหากมีอาการผิดปกติให้ไปพบแพทย์ทันที',
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
  const { setRoom, completeModule, learningProgress, setHoldingBaby, sitDown, seatedTarget } = useStore();
  const openLightbox = useStore((s) => s.openLightbox);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [missionCollapsed, setMissionCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('classify'); // 'classify' | 'review' | 'quiz'
  const [answers, setAnswers] = useState({});
  const [classifyFeedback, setClassifyFeedback] = useState(null);
  const [reviewedCards, setReviewedCards] = useState([]);

  useEffect(() => {
    setHoldingBaby(false);
  }, [setHoldingBaby]);

  const openGalleryAt = (index) => {
    const item = W104_GALLERY[index];
    openLightbox({
      ...item,
      clinicalDetails: item.details || item.clinicalDetails,
      caption: item.description,
      category: 'การสังเกตอาการผิดปกติหลังคลอด',
      items: W104_GALLERY.map((g) => ({
        ...g,
        clinicalDetails: g.details || g.clinicalDetails,
        caption: g.description,
        category: 'การสังเกตอาการผิดปกติหลังคลอด',
      })),
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
      seatOffset: [0, 0.46, 0.15],
      isDrivable: false,
    });
    setShowActivityModal(true);
  };

  return (
    <group>
      <HospitalRoomShell
        theme="mother"
        cozyMode={true}
        roomTitle="สังเกตอาการผิดปกติ"
        roomNumber=""
      />

      {/* ── Top-Right Mission HUD (Portaled to document.body) ── */}
      <ScreenPortal>
        <div className="fixed top-20 right-4 z-30 pointer-events-auto max-w-xs w-80 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-rose-400 text-slate-800">
          <div
            onClick={() => setMissionCollapsed((v) => !v)}
            className={`flex items-center justify-between cursor-pointer select-none ${
              missionCollapsed ? '' : 'border-b border-rose-100 pb-2 mb-2'
            }`}
          >
            <span className="text-xs font-extrabold text-rose-900">
              🩺 ภารกิจห้องสังเกตอาการผิดปกติ
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  classifyFeedback?.pass || learningProgress?.motherCare4
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {classifyFeedback?.pass || learningProgress?.motherCare4 ? 'สำเร็จแล้ว ✓' : 'กำลังเรียนรู้'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMissionCollapsed((v) => !v);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 transition cursor-pointer"
                title={missionCollapsed ? 'เปิดดูรายการภารกิจ' : 'พับเก็บหน้าต่างภารกิจ'}
              >
                {missionCollapsed ? '▼' : '▲'}
              </button>
            </div>
          </div>
          {!missionCollapsed && (
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => openGalleryAt(0)}
                className="w-full p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>🖼️ 1. ดูโปสเตอร์ 5 อาการสำคัญ (6 ภาพ)</span>
                <span className="font-bold text-rose-700">เปิดดู ▶</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('classify');
                  handleSitSofa();
                }}
                className={`w-full p-2 rounded-xl border text-left font-semibold flex items-center justify-between transition cursor-pointer ${
                  classifyFeedback?.pass
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 border-rose-300 text-white shadow'
                }`}
              >
                <span>🚨 2. จำแนกอาการปกติ vs ผิดปกติ</span>
                <span className="font-bold">{classifyFeedback?.pass ? '☑ สำเร็จ' : 'เริ่มทำ ▶'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('review');
                  setShowActivityModal(true);
                }}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <span>📋 3. ทบทวนภาวะแทรกซ้อน & แบบทดสอบ</span>
                <span className="font-bold text-rose-700">เปิดดู ▶</span>
              </button>
            </div>
          )}
        </div>
      </ScreenPortal>

      {/* ป้ายชื่อห้องและหน้าต่าง ติดผนังด้านใน z = -8.78 อย่างแนบสนิท */}
      <TitleSign
        position={[0, 4.95, -8.78]}
        width={6.2}
        height={1.65}
        line1="ZONE 2 สังเกตอาการผิดปกติ"
        line2="การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด"
      />

      <WindowWithCurtains position={[-5.8, 2.8, -8.78]} width={3.4} height={2.8} />
      <WindowWithCurtains position={[5.8, 2.8, -8.78]} width={3.4} height={2.8} />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังกลาง (Z = -8.78): ภาพรวม 5 อาการสำคัญ (IMG_7526.JPG) พร้อมกรอบไม้โอ๊ค 3D แท้ติดผนัง
          ══════════════════════════════════════════════════════════════════════════ */}
      <FramedImagePoster3D
        position={[0, 2.45, -8.78]}
        rotation={[0, 0, 0]}
        width={5.6}
        height={3.9}
        src="/images/rev/w104_overview.jpg"
        title="การสังเกตอาการผิดปกติหลังคลอด (5 อาการสำคัญ)"
        badgeText="🔍 คลิกขยาย"
        headerColor="#be185d"
        onClick={() => openGalleryAt(0)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 1 (ซ้าย X = -8.78): แสดงภาพ 1, 2, 3 ด้วย 3D Mesh แท้ติดผนังซ้าย
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[-8.78, 2.75, 0]} rotation={[0, Math.PI / 2, 0]} width={11.0} height={4.3}>
        {[
          { idx: 1, x: -3.55, title: '1. เลือดออกมากหลังคลอด', img: '/images/rev/w104_card1_pph.jpg' },
          { idx: 2, x: 0, title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น', img: '/images/rev/w104_card2_fever_lochia.jpg' },
          { idx: 3, x: 3.55, title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว', img: '/images/rev/w104_card3_preeclampsia.jpg' },
        ].map((card) => (
          <FramedImagePoster3D
            key={card.idx}
            position={[card.x, 0, 0.02]}
            width={3.3}
            height={3.75}
            src={card.img}
            title={card.title}
            badgeText="🔍 ขยาย"
            headerColor="#e11d48"
            onClick={() => openGalleryAt(card.idx)}
          />
        ))}
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 2 (ขวา X = +8.78): แสดงภาพ 4, 5 ด้วย 3D Mesh แท้ติดผนังขวา
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[8.78, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]} width={8.2} height={4.3}>
        {[
          { idx: 4, x: -1.95, title: '4. ปวดหรือบวมน่อง', img: '/images/rev/w104_card4_dvt.jpg' },
          { idx: 5, x: 1.95, title: '5. เจ็บหน้าอก หรือหายใจลำบาก', img: '/images/rev/w104_card5_chest_pain.jpg' },
        ].map((card) => (
          <FramedImagePoster3D
            key={card.idx}
            position={[card.x, 0, 0.02]}
            width={3.65}
            height={3.75}
            src={card.img}
            title={card.title}
            badgeText="🔍 ขยาย"
            headerColor="#d97706"
            onClick={() => openGalleryAt(card.idx)}
          />
        ))}
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
        seatOffset={[0, 0.46, 0.15]}
      >
        <Html position={[0, 1.88, 0]} center zIndexRange={[20, 0]}>
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
              padding: '6px 14px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(190,24,93,0.35)',
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
        <ScreenPortal>
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
              zIndex: 95,
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
                    การสังเกตอาการผิดปกติหลังคลอด
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
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setShowActivityModal(false)}
                            style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🚶 อยู่ในห้อง 3D ต่อ (ปิดหน้าต่าง)
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('review')}
                            style={{
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            ไปกิจกรรมที่ 2: ทบทวนภาวะแทรกซ้อน 5 อาการ ➜
                          </button>
                        </div>
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

                    <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setShowActivityModal(false)}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '14px',
                          fontWeight: 900,
                          fontSize: '16px',
                          cursor: 'pointer',
                        }}
                      >
                        🚶 อยู่ในห้อง 3D ต่อ (ปิดหน้าต่าง)
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('quiz')}
                        style={{
                          background: '#7c3aed',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '14px',
                          fontWeight: 900,
                          fontSize: '16px',
                          cursor: 'pointer',
                        }}
                      >
                        📝 ทำแบบทดสอบทบทวน ➜
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    {!quizFinished ? (
                      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '2px solid #fecdd3' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, color: '#9f1239' }}>
                          <span>แบบประเมินความรู้ การสังเกตอาการผิดปกติหลังคลอด</span>
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
                              {quizIndex < room4Questions.length - 1 ? 'ข้อถัดไป ➜' : 'สรุปผลคะแนน 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px' }}>
                        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#15803d', marginBottom: '8px' }}>
                          🎉 ผ่านการเรียนรู้ การสังเกตอาการผิดปกติหลังคลอดเรียบร้อยแล้ว!
                        </h3>
                        <p style={{ fontSize: '17px', fontWeight: 700, color: '#475569', marginBottom: '18px' }}>
                          คะแนนแบบทดสอบทบทวน: {quizScore} / {room4Questions.length} คะแนน
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setShowActivityModal(false)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🚶 อยู่ในห้อง 3D ต่อ (เดินสำรวจห้อง)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuizIndex(0);
                              setQuizScore(0);
                              setQuizUserChoice(null);
                              setQuizShowFeedback(false);
                              setQuizFinished(false);
                            }}
                            style={{
                              background: '#ffe4e6',
                              color: '#be123c',
                              border: '2px solid #f43f5e',
                              padding: '12px 22px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🔄 ทำแบบประเมินซ้ำ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowActivityModal(false);
                              setRoom('lobby');
                            }}
                            style={{
                              background: '#e11d48',
                              color: '#fff',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '14px',
                              fontWeight: 900,
                              fontSize: '16px',
                              cursor: 'pointer',
                            }}
                          >
                            🏥 กลับสู่โถงล็อบบี้
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScreenPortal>
      )}

      <PlayerController initialPosition={[0, 0, 4.2]} />
    </group>
  );
}
