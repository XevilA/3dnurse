import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import ScreenPortal from '../ui/ScreenPortal';
import BillboardLabel3D from '../ui/BillboardLabel3D';
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

// ── ข้อมูลภาพสไลด์ทั้ง 6 ภาพของ Ward 104:
//    • coverSrc = ภาพโปสเตอร์สรุปการ์ตูนบนผนังห้อง 3D (ภาพที่ 1–5 สัดส่วน 16:9)
//    • src      = ภาพอินโฟกราฟิกรายละเอียด (สาเหตุ อาการปกติ อาการผิดปกติ การป้องกัน) ที่แสดงเมื่อคลิกที่ภาพ ──
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
    coverSrc: '/images/rev/w104_card1_pph_v2.jpg',
    src: '/images/rev/w104_detail1_pph.jpg',
    title: '1. เลือดออกมากหลังคลอด (ตกเลือดหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 1/5',
    description: 'ภาวะตกเลือดหลังคลอด คือ การเสียเลือดทางช่องคลอดมากกว่าปกติ ส่วนใหญ่เกิดใน 24 ชั่วโมงแรกหลังคลอด แต่สามารถเกิดได้ภายหลัง สังเกตไว มีข้อใดข้อหนึ่งให้ไปโรงพยาบาลทันที',
    details: [
      '📌 สาเหตุที่พบบ่อย: มดลูกหดรัดตัวไม่ดี (Atony), มีเศษรกค้าง, แผลฉีกขาดช่องทางคลอด, ความผิดปกติของการแข็งตัวของเลือด',
      '✅ อาการปกติ (เฝ้าสังเกต): มีเลือดออกคล้ายประจำเดือน 2–3 วันแรก (สีแดงคล้ำ) → สัปดาห์ที่ 1 สีชมพู → สัปดาห์ที่ 2–6 สีเหลือง/น้ำตาล และปริมาณค่อย ๆ ลดลง',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที — มีข้อใดข้อหนึ่ง ไม่ต้องรอให้ครบทุกอาการ):',
      '• เลือดชุ่มผ้าอนามัยเต็มแผ่นใน 1 ชั่วโมง (หรือเปียกเร็วกว่า 1 แผ่น/ชั่วโมง ต่อเนื่อง 2 ชั่วโมง)',
      '• มีลิ่มเลือดขนาดใหญ่ (ใหญ่กว่าไข่ไก่) หรือมีเลือดสดไหลต่อเนื่อง ไม่ลดลง',
      '• หน้ามืด ใจสั่น เวียนศีรษะ จะเป็นลม อ่อนเพลีย ซีด',
      '🛡️ การป้องกันภาวะตกเลือดหลังคลอด: ให้ลูกดูดนมเร็วและบ่อยช่วยให้มดลูกหดตัวดี, ปัสสาวะให้เรียบร้อยไม่กลั้นปัสสาวะ, พักผ่อนให้เพียงพอ, หลีกเลี่ยงการยกของหนักในช่วง 6 สัปดาห์แรก, รับประทานอาหารที่มีธาตุเหล็กและโปรตีน, มาตรวจหลังคลอดตามนัด 6 สัปดาห์',
    ],
  },
  {
    coverSrc: '/images/rev/w104_card2_fever_lochia_v2.jpg',
    src: '/images/rev/w104_detail2_fever_lochia.jpg',
    title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น (การติดเชื้อหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 2/5',
    description: 'หลังคลอดอาจมีไข้และน้ำคาวปลาที่ผิดปกติได้จากการติดเชื้อมดลูกหรืออวัยวะสืบพันธุ์ ทำให้น้ำคาวปลามีกลิ่นเหม็น สีผิดปกติ และอาจมีไข้ร่วมด้วย ต้องได้รับการประเมินและรักษาจากแพทย์ทันที',
    details: [
      '📌 สาเหตุที่พบบ่อย: การติดเชื้อมดลูก (Endometritis), การติดเชื้อแผลฝีเย็บ, การติดเชื้อทางเดินปัสสาวะ',
      '✅ ลักษณะน้ำคาวปลาปกติ: ระยะที่ 1 (1–3 วันแรก) สีแดงคล้ำ → ระยะที่ 2 (4–10 วัน) สีชมพู → ระยะที่ 3 (หลัง 10 วันขึ้นไป) สีขาวเหลือง และปริมาณค่อย ๆ ลดลง',
      '⚠️ อาการผิดปกติที่ต้องไปโรงพยาบาลทันที (มีข้อใดข้อหนึ่ง ไปโรงพยาบาลทันที ไม่ต้องรอให้มีทั้งสองอาการ):',
      '• มีไข้ตั้งแต่ 38 °C ขึ้นไป หรือมีไข้ต่อเนื่อง ร่วมกับหนาวสั่น อ่อนเพลีย',
      '• น้ำคาวปลามีกลิ่นเหม็น ปริมาณมากขึ้นแทนที่จะลดลง หรือเปลี่ยนสีผิดปกติ (เหลือง เขียว น้ำตาล)',
      '• ปวดท้องน้อยมากขึ้น หรือมีกดเจ็บบริเวณมดลูก',
      '🛡️ การดูแลตนเองเพื่อป้องกันการติดเชื้อหลังคลอด: พักผ่อนให้เพียงพอ, รักษาความสะอาดร่างกายและแผลฝีเย็บ, เปลี่ยนผ้าอนามัยบ่อย ๆ อย่างน้อยทุก 3–4 ชั่วโมง, ดื่มน้ำให้เพียงพอและรับประทานอาหารครบ 5 หมู่, หลีกเลี่ยงการสวนล้างช่องคลอดหรือใช้ยาสมุนไพรโดยไม่ปรึกษาแพทย์, มาพบแพทย์ตามนัด',
    ],
  },
  {
    coverSrc: '/images/rev/w104_card3_preeclampsia_v2.jpg',
    src: '/images/rev/w104_detail3_preeclampsia.jpg',
    title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว (ภาวะความดันโลหิตสูงหลังคลอด)',
    badge: 'ผนังที่ 1 • ภาพที่ 3/5',
    description: 'การปวดศีรษะรุนแรงหรือนานผิดปกติ ร่วมกับตาพร่ามัว มองเห็นไม่ชัด อาจเป็นสัญญาณของภาวะความดันโลหิตสูงหลังคลอด (Preeclampsia/Eclampsia) ซึ่งเป็นภาวะแทรกซ้อนที่อันตราย ต้องได้รับการประเมินจากแพทย์ทันที',
    details: [
      '📌 สาเหตุที่พบบ่อย: ภาวะความดันโลหิตสูงหลังคลอด (Preeclampsia/Eclampsia), ภาวะหลอดเลือดสมองผิดปกติ, การพักผ่อนไม่เพียงพอและความเครียด',
      '✅ อาการปกติ (เฝ้าสังเกต): ปวดศีรษะเล็กน้อยจากการพักผ่อนน้อย อาการดีขึ้นเมื่อพักผ่อน และไม่มีตาพร่ามัวหรือการมองเห็นผิดปกติ',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที — มีข้อใดข้อหนึ่ง ไม่ต้องรอให้มีทั้งสองอาการ):',
      '• ปวดศีรษะรุนแรง ปวดไม่หาย หรือปวดมากขึ้น',
      '• ตาพร่ามัว มองเห็นไม่ชัด เห็นแสงวาบ หรือเห็นภาพซ้อน',
      '• ร่วมกับความดันโลหิตสูง (ถ้าวัดได้ ≥ 140/90 mmHg), คลื่นไส้ อาเจียนรุนแรง, ปวดแน่นบริเวณลิ้นปี่, ชัก หรือหมดสติ',
      '🛡️ การป้องกันและการดูแลตนเอง: พักผ่อนให้เพียงพอ ลดความเครียด, หากมีเครื่องวัดความดันโลหิตควรตรวจตามคำแนะนำ, รับประทานอาหารที่มีประโยชน์ ลดเค็ม, หลีกเลี่ยงคาเฟอีนและเครื่องดื่มกระตุ้น เช่น ชา กาแฟ น้ำอัดลม',
    ],
  },
  {
    coverSrc: '/images/rev/w104_card4_dvt_v2.jpg',
    src: '/images/rev/w104_detail4_dvt.jpg',
    title: '4. ปวดหรือบวมน่อง (ภาวะลิ่มเลือดอุดตันหลอดเลือดดำ)',
    badge: 'ผนังที่ 2 • ภาพที่ 4/5',
    description: 'อาการปวด บวม ตึง หรือรู้สึกหนักที่น่อง อาจเกิดจากลิ่มเลือดอุดตันในหลอดเลือดดำลึก (Deep Vein Thrombosis) ซึ่งพบได้หลังคลอดจากการเปลี่ยนแปลงของการแข็งตัวของเลือดและการไหลเวียนเลือดช้าลง',
    details: [
      '📌 สาเหตุที่พบบ่อย: ลิ่มเลือดอุดตันในหลอดเลือดดำลึก (Deep Vein Thrombosis), ภาวะเลือดแข็งตัวง่ายหลังคลอด, การนั่งหรือนอนนาน ๆ ทำให้เลือดไหลเวียนช้า',
      '✅ อาการปกติ (เฝ้าสังเกต): รู้สึกตึงหรือหนักน่องเล็กน้อย อาจมีบวมเล็กน้อยเฉพาะช่วงเย็น อาการดีขึ้นเมื่อยกขาสูงหรือพักผ่อน มักไม่แดง ไม่ร้อน และไม่ปวดมาก',
      '⚠️ อาการผิดปกติ (ต้องไปโรงพยาบาลทันที — อย่านวดหรือคลึงน่องเด็ดขาด):',
      '• ปวดน่องมากขึ้น โดยเฉพาะข้างเดียว / น่องบวมผิดปกติข้างเดียวโตขึ้น',
      '• กดแล้วเจ็บ รู้สึกตึงหรือแน่น ผิวหนังแดง ร้อน หรือมีสีคล้ำ',
      '• อาจมีอาการร่วม เช่น หายใจเหนื่อย แน่นหน้าอก (อาจมีลิ่มเลือดไปที่ปอด)',
      '🛡️ การป้องกันภาวะลิ่มเลือดอุดตันหลังคลอด: ขยับร่างกายและเดินบ่อย ๆ ไม่อยู่ในท่าเดิมนาน, ยกขาสูงเมื่อพักผ่อน, ดื่มน้ำให้เพียงพอและรับประทานอาหารที่มีประโยชน์, หลีกเลี่ยงการนั่งหรือนอนนาน ๆ, หากมีปัจจัยเสี่ยงควรปรึกษาแพทย์ (หากมีอาการปวดบวมแดงร้อน อย่านวดหรือคลึงน่อง)',
    ],
  },
  {
    coverSrc: '/images/rev/w104_card5_chest_pain_v2.jpg',
    src: '/images/rev/w104_detail5_chest_pain.jpg',
    title: '5. เจ็บหน้าอก หรือหายใจลำบาก (ภาวะฉุกเฉินระบบหัวใจและปอด)',
    badge: 'ผนังที่ 2 • ภาพที่ 5/5',
    description: 'อาการเจ็บหน้าอก หายใจไม่อิ่ม แน่นหน้าอก หายใจลำบาก หรือหายใจเร็ว อาจเกิดจากภาวะแทรกซ้อนที่อันตราย เช่น ลิ่มเลือดอุดตันในปอด (Pulmonary Embolism) ภาวะหัวใจล้มเหลว หรือการติดเชื้อรุนแรง ต้องรีบไปพบแพทย์ทันทีและอย่าขับรถไปเอง',
    details: [
      '📌 สาเหตุที่พบบ่อย: ลิ่มเลือดอุดตันในปอด (Pulmonary Embolism), ภาวะหัวใจล้มเหลว (Heart Failure), การติดเชื้อรุนแรง เช่น ปอดอักเสบ',
      '✅ อาการปกติ (เฝ้าสังเกต): หายใจปกติ ไม่เหนื่อยง่าย ไม่เจ็บหน้าอก สามารถทำกิจวัตรประจำวันได้ตามปกติ ไม่มีอาการแน่นหน้าอกหรือใจสั่น',
      '⚠️ อาการผิดปกติ (รีบไปพบแพทย์ทันที — มีข้อใดข้อหนึ่ง ไม่ต้องรอ | อย่าขับรถไปเอง):',
      '• เจ็บหน้าอกรุนแรง หรือแน่นหน้าอก / หายใจแล้วเจ็บมากขึ้น',
      '• หอบเหนื่อย หายใจลำบาก หายใจไม่อิ่ม หรือหายใจเร็ว',
      '• ใจสั่น หน้ามืด เหงื่อออกมาก ไอมีเลือดปน หมดสติ หรือรู้สึกเหมือนจะเป็นลม (อาจเกิดจากลิ่มเลือดอุดตันในปอด)',
      '🛡️ การป้องกันภาวะลิ่มเลือดอุดตันหลังคลอด: ขยับร่างกายและเดินบ่อย ๆ ไม่อยู่ในท่าเดิมนาน, ดื่มน้ำให้เพียงพอและรับประทานอาหารที่มีประโยชน์, หลีกเลี่ยงการสูบบุหรี่และเครื่องดื่มแอลกอฮอล์, บริหารขาและเท้าเพื่อกระตุ้นการไหลเวียนเลือด, สังเกตอาการตนเองหากผิดปกติให้ไปพบแพทย์ทันที',
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
        doorZ={6.75}
        roomTitle="สังเกตอาการผิดปกติ"
        roomNumber=""
      />

      {/* ── Top-Right Mission HUD (Responsive across 320px–4K & iOS Safari visualViewport) ── */}
      <ScreenPortal>
        <div
          className="fixed left-2.5 right-2.5 sm:left-auto sm:right-4 z-30 pointer-events-auto sm:max-w-xs sm:w-80 max-h-[calc(var(--app-h,100dvh)*0.34)] sm:max-h-[calc(var(--app-h,100dvh)-5.5rem)] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-2xl border-2 border-rose-400 text-slate-800"
          style={{ top: 'calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 4.25rem)' }}
        >
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

      {/* ป้ายชื่อห้องและหน้าต่าง ติดผนังด้านใน z = -8.78 เหนือกรอบโปสเตอร์อย่างไม่ซ้อนทับ */}
      <TitleSign
        position={[0, 5.42, -8.78]}
        width={6.0}
        height={1.42}
        line1="ZONE 2 สังเกตอาการผิดปกติ"
        line2="การสังเกตอาการผิดปกติและอาการแทรกซ้อนหลังคลอด"
      />

      <WindowWithCurtains position={[-5.95, 2.8, -8.76]} width={3.1} height={2.8} />
      <WindowWithCurtains position={[5.95, 2.8, -8.76]} width={3.1} height={2.8} />
      <WindowWithCurtains position={[0, 2.85, 8.76]} rotation={[0, Math.PI, 0]} width={6.4} height={3.1} />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังกลาง (Z = -8.78): ภาพรวม 5 อาการสำคัญ (IMG_7526.JPG) พร้อมกรอบไม้โอ๊ค 3D แท้ติดผนัง
          ══════════════════════════════════════════════════════════════════════════ */}
      <FramedImagePoster3D
        position={[0, 2.38, -8.78]}
        rotation={[0, 0, 0]}
        width={5.45}
        height={3.62}
        src="/images/rev/w104_overview.jpg"
        title="การสังเกตอาการผิดปกติหลังคลอด (5 อาการสำคัญ)"
        badgeText="🔍 คลิกขยาย"
        headerColor="#be185d"
        onClick={() => openGalleryAt(0)}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 1 (ซ้าย X = -8.78): แสดงภาพปก 1, 2, 3 (16:9) คลิกแล้วขึ้นภาพรายละเอียด
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[-8.78, 2.75, -1.80]} rotation={[0, Math.PI / 2, 0]} width={13.0} height={3.25}>
        {[
          { idx: 1, x: -4.22, title: '1. เลือดออกมากหลังคลอด', img: '/images/rev/w104_card1_pph_v2.jpg' },
          { idx: 2, x: 0, title: '2. ไข้ น้ำคาวปลามีกลิ่นเหม็น', img: '/images/rev/w104_card2_fever_lochia_v2.jpg' },
          { idx: 3, x: 4.22, title: '3. ปวดศีรษะรุนแรง ตาพร่ามัว', img: '/images/rev/w104_card3_preeclampsia_v2.jpg' },
        ].map((card) => (
          <FramedImagePoster3D
            key={card.idx}
            position={[card.x, 0, 0.02]}
            width={3.88}
            height={2.68}
            src={card.img}
            contain
            title={card.title}
            subtitle="🔍 คลิกที่ภาพเพื่ออ่านรายละเอียด อาการผิดปกติ & การป้องกัน"
            badgeText="📖 รายละเอียด"
            headerColor="#e11d48"
            onClick={() => openGalleryAt(card.idx)}
          />
        ))}
      </WoodFramedBacklitPanel>

      {/* ══════════════════════════════════════════════════════════════════════════
          ผนังที่ 2 (ขวา X = +8.78): แสดงภาพปก 4, 5 (16:9) คลิกแล้วขึ้นภาพรายละเอียด
          ══════════════════════════════════════════════════════════════════════════ */}
      <WoodFramedBacklitPanel position={[8.78, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]} width={10.6} height={3.65}>
        {[
          { idx: 4, x: -2.55, title: '4. ปวดหรือบวมน่อง', img: '/images/rev/w104_card4_dvt_v2.jpg' },
          { idx: 5, x: 2.55, title: '5. เจ็บหน้าอก หรือหายใจลำบาก', img: '/images/rev/w104_card5_chest_pain_v2.jpg' },
        ].map((card) => (
          <FramedImagePoster3D
            key={card.idx}
            position={[card.x, 0, 0.02]}
            width={4.68}
            height={3.13}
            src={card.img}
            contain
            title={card.title}
            subtitle="🔍 คลิกที่ภาพเพื่ออ่านรายละเอียด อาการผิดปกติ & การป้องกัน"
            badgeText="📖 รายละเอียด"
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
        <BillboardLabel3D
          position={[0, 1.56, -0.38]}
          text={
            seatedTarget?.id === 'room104_sofa'
              ? '🩺 กำลังนั่งบนโซฟา — คลิกเปิดกิจกรรมสังเกตอาการผิดปกติ'
              : '🛋️ คลิกนั่งโซฟาเพื่อเรียนรู้การสังเกตอาการผิดปกติหลังคลอด'
          }
          bg="#e11d48"
          bgEnd="#be185d"
          width={2.15}
          height={0.36}
          pill={false}
          onClick={handleSitSofa}
        />
      </InteractiveSeat>

      <CozySectionalSofaSet
        onClickSofa={handleSitSofa}
        onClickTablet={() => setShowActivityModal(true)}
        tabletLabel="📋 คลิกแท็บเล็ตบนโต๊ะ: จำแนกอาการปกติและอาการที่ต้องไปโรงพยาบาล"
        ipadMode="danger"
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
                maxHeight: 'calc(var(--app-h, 100dvh) - 32px)',
                background: '#fffdf9',
                borderRadius: '22px',
                border: '3px solid #f43f5e',
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
                  padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 24px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  borderBottom: '2px solid #fda4af',
                }}
              >
                <div>
                  <span style={{
                    background: '#e11d48',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 900,
                  }}>
                    การสังเกตอาการผิดปกติหลังคลอด
                  </span>
                  <h2 style={{ margin: '6px 0 0', fontSize: 'clamp(16px, 3.2vw, 23px)', fontWeight: 900, color: '#881337' }}>
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
                    padding: '6px 14px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: 'clamp(12px, 2.4vw, 15px)',
                    cursor: 'pointer',
                  }}
                >
                  ✕ ปิด
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '6px', padding: '10px clamp(10px, 2.5vw, 24px) 0', background: '#fff1f2', flexWrap: 'wrap' }}>
                {[
                  { id: 'classify', label: '1. จำแนกอาการปกติ/ผิดปกติ' },
                  { id: 'review', label: '2. ทบทวน 5 อาการสำคัญ' },
                  { id: 'quiz', label: '3. แบบทดสอบท้ายห้อง' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      flex: '1 1 130px',
                      padding: '9px 10px',
                      borderRadius: '12px 12px 0 0',
                      border: 'none',
                      background: activeTab === t.id ? '#e11d48' : '#ffe4e6',
                      color: activeTab === t.id ? '#ffffff' : '#9f1239',
                      fontWeight: 900,
                      fontSize: 'clamp(12px, 2.2vw, 15px)',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div style={{ padding: 'clamp(12px, 3vw, 22px)', overflowY: 'auto', flex: 1 }}>
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
                            <div style={{ flex: 1, minWidth: 'min(100%, 240px)' }}>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                                {i + 1}. {item.text}
                              </div>
                              {classifyFeedback && (
                                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px', fontWeight: 700 }}>
                                  💡 {item.reason}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '14px' }}>
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
                              src={card.coverSrc || card.src}
                              alt={card.title}
                              style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'contain', background: '#fff1f2', display: 'block' }}
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
                                {seen ? '✓ ศึกษาแล้ว (คลิกเพื่อดูรายละเอียดซ้ำ)' : '📖 คลิกเพื่ออ่านรายละเอียด (อาการผิดปกติ & การป้องกัน)'}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, color: '#9f1239', flexWrap: 'wrap', gap: '6px' }}>
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
                                border: quizShowFeedback
                                  ? currentQ.answer === btn.val
                                    ? '2.5px solid #16a34a'
                                    : quizUserChoice === btn.val
                                    ? '2.5px solid #dc2626'
                                    : '2px solid #f43f5e'
                                  : '2px solid #f43f5e',
                                background: quizShowFeedback
                                  ? currentQ.answer === btn.val
                                    ? '#dcfce7'
                                    : quizUserChoice === btn.val
                                    ? '#fee2e2'
                                    : '#fff1f2'
                                  : '#fff1f2',
                                color: '#881337',
                                cursor: quizShowFeedback ? 'default' : 'pointer',
                              }}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        {quizShowFeedback && (
                          <div
                            style={{
                              background: quizUserChoice === currentQ.answer ? '#f0fdf4' : '#fff1f2',
                              border: `2px solid ${quizUserChoice === currentQ.answer ? '#86efac' : '#fda4af'}`,
                              padding: '14px',
                              borderRadius: '14px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 900,
                                fontSize: '17px',
                                color: quizUserChoice === currentQ.answer ? '#166534' : '#be123c',
                                marginBottom: '6px',
                              }}
                            >
                              {quizUserChoice === currentQ.answer ? '🎉 ถูกต้องค่ะ!' : `⚠️ ยังไม่ถูกต้อง — เฉลย: ${currentQ.answerText}`}
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
