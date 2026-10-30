import React, { useState, useMemo, useEffect } from 'react';
import useStore from '../../store/useStore';
import { getQuestionsByRoomKey } from '../../data/quizData';
import {
  WARD101_SLIDE, WARD102_SLIDE, FOOD_SITUATION, FOODS,
  BOOTH_SITUATION, EQUIPMENT, CARE_STEPS,
} from '../ward/wardData';

/**
 * WardModals — หน้าต่างเต็มจอสำหรับ Ward 101 / Ward 102
 *  - SlideLightbox : สไลด์ Zone 1 / Zone 2 (ขยายใหญ่ อ่านง่าย) — ต้องดูก่อนเริ่มกิจกรรม
 *  - FoodActivity  : โต๊ะอาหาร เลือกเมนู 3 รายการ (เลือกผิดให้เลือกต่อจนกว่าจะถูก) + หน้าเฉลย
 *  - BoothActivity : บูทดูแลแผลฝีเย็บ (เลือกอุปกรณ์ 3 อย่าง → เรียงลำดับ → ตรวจคำตอบ)
 *  - WardQuiz      : แบบประเมินท้ายห้อง
 * ใช้ตัวอักษรใหญ่ อ่านง่าย ตามหมายเหตุของลูกค้า
 */

const PINK = '#e91e63';

const overlay = {
  position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(30, 10, 25, 0.78)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 'max(8px, env(safe-area-inset-top, 0px)) clamp(8px, 2vw, 20px) max(10px, env(safe-area-inset-bottom, 0px))',
  fontFamily: "'Sarabun','Noto Sans Thai',system-ui,-apple-system,sans-serif",
  pointerEvents: 'auto',
};

function Shell({ title, subtitle, onClose, children, maxWidth = 1180, footer }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 22, width: '100%', maxWidth, maxHeight: '100%',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0,0,0,0.5)', border: '3px solid #f48fb1',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          padding: '12px 18px', background: 'linear-gradient(90deg,#fce4ec,#fff0f6)', borderBottom: '2px solid #f8bbd0',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(17px,2.4vw,24px)', fontWeight: 800, color: '#ad1457', lineHeight: 1.25 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 'clamp(13px,1.7vw,16px)', color: '#8e3a62', fontWeight: 600 }}>{subtitle}</div>}
          </div>
          <button
            type="button" onClick={onClose} aria-label="ปิด"
            style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 20, border: 'none', background: PINK, color: '#fff', fontSize: 20, fontWeight: 800, cursor: 'pointer' }}
          >✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: '10px 18px', borderTop: '2px solid #fce4ec', background: '#fff8fb' }}>{footer}</div>}
      </div>
    </div>
  );
}

const btn = (bg = PINK, color = '#fff') => ({
  background: bg, color, border: 'none', borderRadius: 14, padding: '12px 22px',
  fontSize: 'clamp(15px,2vw,18px)', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(233,30,99,0.25)',
});

// ───────────────────────── Slide lightbox ─────────────────────────
function SlideLightbox({ room }) {
  const close = useStore((s) => s.closeWardModal);
  const open = useStore((s) => s.openWardModal);
  const setWardFlow = useStore((s) => s.setWardFlow);
  const activityDone = useStore((s) => (s.wardFlow[room] || {}).activity);
  const slide = room === 'motherCare1' ? WARD101_SLIDE : WARD102_SLIDE;
  const kind = room === 'motherCare1' ? 'food' : 'booth';
  const [zoom, setZoom] = useState(1);

  const finish = (startActivity) => {
    setWardFlow(room, 'slide', true);
    if (startActivity) open(kind, room); else close();
  };

  return (
    <div style={overlay} onClick={() => finish(false)}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 1400, maxHeight: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(16px,2.4vw,24px)', textShadow: '0 2px 8px #000' }}>
            📖 {slide.title}
            <span style={{ display: 'block', fontSize: 'clamp(12px,1.6vw,15px)', fontWeight: 600, opacity: 0.9 }}>
              อ่านเนื้อหานี้ก่อนเริ่มกิจกรรม • กด + / − เพื่อขยายตัวอักษร
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} style={btn('#fff', '#ad1457')}>−</button>
            <button type="button" onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} style={btn('#fff', '#ad1457')}>＋ ขยาย</button>
            <button type="button" onClick={() => finish(false)} style={btn('#37474f')}>ปิด ✕</button>
          </div>
        </div>
        <div style={{ overflow: 'auto', background: '#000', borderRadius: 16, flex: 1, border: '3px solid #f48fb1', textAlign: 'center' }}>
          <img
            src={slide.src} alt={slide.title} draggable={false}
            style={{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? 'min(100%, calc(var(--app-h, 100dvh) * 1.38 - 120px))' : 'none', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => finish(false)} style={btn('#0284c7', '#fff')}>
            🚶 ปิดหน้าต่าง (เดินสำรวจในห้อง 3D)
          </button>
          <button type="button" onClick={() => finish(true)} style={btn(PINK)}>
            {activityDone ? '🔁 เล่นกิจกรรมอีกครั้ง ➜' : (room === 'motherCare1' ? '🍽️ เริ่มกิจกรรมโต๊ะอาหาร ➜' : '🩹 เริ่มกิจกรรมบูทดูแลแผล ➜')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Ward 101: โต๊ะอาหาร ─────────────────────────
function FoodActivity({ room }) {
  const close = useStore((s) => s.closeWardModal);
  const open = useStore((s) => s.openWardModal);
  const setWardFlow = useStore((s) => s.setWardFlow);
  const completeModule = useStore((s) => s.completeModule);
  const [picked, setPicked] = useState([]); // ids ที่เลือกถูก (วางป้ายแล้ว)
  const [wrong, setWrong] = useState({}); // id → true (เลือกผิดแล้ว)
  const [tries, setTries] = useState(0);
  const [toast, setToast] = useState(null);
  const [phase, setPhase] = useState('play'); // play | review

  const correctCount = picked.length;

  const choose = (food) => {
    if (picked.includes(food.id) || wrong[food.id]) return;
    setTries((t) => t + 1);
    if (food.correct) {
      const next = [...picked, food.id];
      setPicked(next);
      setToast({ ok: true, text: `✓ ถูกต้อง! ${food.short}: ${food.why}` });
      if (next.length === 3) {
        setWardFlow(room, 'activity', true);
        completeModule(room);
        setTimeout(() => setPhase('review'), 900);
      }
    } else {
      setWrong((w) => ({ ...w, [food.id]: true }));
      setToast({ ok: false, text: `✕ ยังไม่ใช่ — ${food.short}: ${food.why} • เลือกต่อจนกว่าจะถูกครบ 3 รายการ` });
    }
  };

  const reset = () => { setPicked([]); setWrong({}); setTries(0); setToast(null); setPhase('play'); };
  const confirm = () => { setWardFlow(room, 'activity', true); completeModule(room); open('quiz', room); };

  if (phase === 'review') {
    return (
      <Shell title="เฉลยคำตอบ" subtitle="เลือกอาหารที่เหมาะสมสำหรับคุณแม่ในสถานการณ์นี้ (เลือกได้ 3 รายการ)" onClose={close}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={reset} style={btn('#fff', '#ad1457')}>↻ เล่นใหม่</button>
            <div style={{ fontSize: 'clamp(13px,1.7vw,16px)', color: '#166534', fontWeight: 800 }}>
              🎉 ผ่านกิจกรรมโต๊ะอาหารแล้ว! (ลองเลือกทั้งหมด {tries} ครั้ง)
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={close} style={btn('#16a34a', '#fff')}>🚶 อยู่ในห้อง 3D ต่อ (ปิดหน้าต่าง)</button>
              <button type="button" onClick={confirm} style={btn(PINK)}>📝 ทำแบบทดสอบทบทวน ({getQuestionsByRoomKey(room).length} ข้อ) ›</button>
            </div>
          </div>
        }>
        <div style={{ padding: 'clamp(10px,2vw,18px)' }}>
          <div style={{ background: '#fff4d6', border: '2px solid #ffd54f', borderRadius: 16, padding: '12px 16px', marginBottom: 14, fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.55, color: '#4e342e', fontWeight: 600 }}>
            💡 <strong>คำแนะนำ:</strong> {FOOD_SITUATION.advice}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,230px),1fr))', gap: 12 }}>
            {FOODS.map((f) => (
              <div key={f.id} style={{
                borderRadius: 16, overflow: 'hidden', background: f.correct ? '#e8f5e9' : '#fff',
                border: `3px solid ${f.correct ? '#43a047' : '#f8bbd0'}`, position: 'relative',
              }}>
                <img src={f.img} alt={f.short} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: 6, right: 6, width: 34, height: 34, borderRadius: 17, background: f.correct ? '#2e7d32' : '#e53935', color: '#fff', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.correct ? '✓' : '✕'}
                </div>
                <div style={{ padding: '8px 10px 10px' }}>
                  <div style={{ fontWeight: 800, fontSize: 'clamp(15px,1.9vw,18px)', color: '#3b1230' }}>{f.short}</div>
                  <div style={{ display: 'inline-block', margin: '4px 0', padding: '2px 12px', borderRadius: 12, background: f.correct ? '#2e7d32' : '#ec407a', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                    {f.correct ? 'เลือกได้' : 'ไม่เลือก'}
                  </div>
                  <div style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: '#4a4a4a', lineHeight: 1.45, fontWeight: 600 }}>{f.why}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: '#fff0f6', border: '2px solid #f48fb1', borderRadius: 16, padding: '12px 16px' }}>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(15px,2vw,19px)', marginBottom: 8 }}>🔎 คำตอบที่ควรเลือก (3 รายการ)</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {FOODS.filter((f) => f.correct).map((f) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '2px solid #43a047', borderRadius: 14, padding: 6, paddingRight: 14 }}>
                  <img src={f.img} alt="" style={{ width: 70, height: 52, objectFit: 'cover', borderRadius: 10 }} />
                  <span style={{ fontWeight: 800, fontSize: 'clamp(14px,1.8vw,17px)' }}>{f.short} ✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={FOOD_SITUATION.heading} subtitle="🍽️ โต๊ะอาหารคุณแม่ — แตะที่เมนูเพื่อวางป้ายเลือก" onClose={close}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 800, fontSize: 'clamp(15px,2vw,19px)', color: '#ad1457' }}>
            ป้ายที่วางแล้ว:
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 34, height: 34, borderRadius: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: i < correctCount ? '#2e7d32' : '#fce4ec', color: i < correctCount ? '#fff' : '#ad1457', border: '2px solid #ec407a' }}>
                {i < correctCount ? '✓' : i + 1}
              </span>
            ))}
            <span style={{ fontSize: 15, color: '#6b2145' }}>({correctCount}/3)</span>
          </div>
          <button type="button" onClick={reset} style={btn('#fff', '#ad1457')}>↻ เริ่มเลือกใหม่</button>
        </div>
      }>
      <div style={{ padding: 'clamp(10px,2vw,18px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 12, marginBottom: 14 }}>
          <div style={{ background: '#fff0f6', border: '2px solid #f48fb1', borderRadius: 16, padding: '12px 16px' }}>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(16px,2.1vw,20px)', marginBottom: 4 }}>👩‍🍼 {FOOD_SITUATION.card}</div>
            <div style={{ fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.6, color: '#3b1230', fontWeight: 600 }}>{FOOD_SITUATION.story}</div>
          </div>
          <div style={{ background: '#fff8e1', border: '2px solid #ffd54f', borderRadius: 16, padding: '12px 16px' }}>
            <div style={{ fontWeight: 800, color: '#bf6b00', fontSize: 'clamp(16px,2.1vw,20px)', marginBottom: 4 }}>📌 คำสั่ง</div>
            <div style={{ fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.6, color: '#4e342e', fontWeight: 600 }}>{FOOD_SITUATION.order}</div>
            <div style={{ marginTop: 6, fontSize: 'clamp(13px,1.7vw,16px)', color: '#6d4c41', fontWeight: 600 }}>
              ประโยชน์: {FOOD_SITUATION.benefits.join(' • ')}
            </div>
          </div>
        </div>

        {toast && (
          <div style={{
            marginBottom: 12, padding: '10px 14px', borderRadius: 14, fontWeight: 800, lineHeight: 1.5,
            fontSize: 'clamp(14px,1.9vw,18px)', background: toast.ok ? '#e8f5e9' : '#ffebee',
            color: toast.ok ? '#1b5e20' : '#b71c1c', border: `2px solid ${toast.ok ? '#66bb6a' : '#ef5350'}`,
          }}>{toast.text}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(46%,200px),1fr))', gap: 12 }}>
          {FOODS.map((f) => {
            const isPicked = picked.includes(f.id);
            const isWrong = !!wrong[f.id];
            return (
              <button
                key={f.id} type="button" onClick={() => choose(f)} disabled={isPicked || isWrong}
                style={{
                  position: 'relative', padding: 0, textAlign: 'center', cursor: isPicked || isWrong ? 'default' : 'pointer',
                  borderRadius: 16, overflow: 'hidden', background: isPicked ? '#e8f5e9' : isWrong ? '#ffebee' : '#fff',
                  border: `3px solid ${isPicked ? '#43a047' : isWrong ? '#ef5350' : '#f8bbd0'}`,
                  opacity: isWrong ? 0.65 : 1, transition: 'transform .12s',
                }}
                onMouseDown={(e) => { if (!isPicked && !isWrong) e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              >
                <img src={f.img} alt={f.short} style={{ width: '100%', height: 118, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '6px 8px 10px', fontWeight: 800, fontSize: 'clamp(14px,1.8vw,17px)', color: '#3b1230', lineHeight: 1.3, minHeight: 46 }}>{f.short}</div>
                {isPicked && (
                  <div style={{ position: 'absolute', top: 6, left: 6, background: '#2e7d32', color: '#fff', borderRadius: 12, padding: '3px 12px', fontWeight: 900, fontSize: 14, boxShadow: '0 2px 6px rgba(0,0,0,.3)' }}>🏷️ ป้ายเลือก ✓</div>
                )}
                {isWrong && (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 32, height: 32, borderRadius: 16, background: '#e53935', color: '#fff', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

// ───────────────────────── Ward 102: บูทดูแลแผลฝีเย็บ ─────────────────────────
function BoothActivity({ room }) {
  const close = useStore((s) => s.closeWardModal);
  const open = useStore((s) => s.openWardModal);
  const setWardFlow = useStore((s) => s.setWardFlow);
  const completeModule = useStore((s) => s.completeModule);
  const [step, setStep] = useState(1); // 1 เลือก, 2 เรียง, 3 ตรวจ
  const [picked, setPicked] = useState([]);
  const [wrong, setWrong] = useState({});
  const [toast, setToast] = useState(null);
  const [slots, setSlots] = useState([null, null, null]); // ใส่ id อุปกรณ์ลงลำดับ 1-3
  const [holding, setHolding] = useState(null);
  const [orderMsg, setOrderMsg] = useState(null);

  const chooseEq = (eq) => {
    if (picked.includes(eq.id) || wrong[eq.id]) return;
    if (eq.correct) {
      const next = [...picked, eq.id];
      setPicked(next);
      setToast({ ok: true, text: `✓ ถูกต้อง! ${eq.name} ${eq.note}` });
      if (next.length === 3) setTimeout(() => { setStep(2); setToast(null); }, 900);
    } else {
      setWrong((w) => ({ ...w, [eq.id]: true }));
      setToast({ ok: false, text: `✕ ไม่เหมาะสม — ${eq.name} ${eq.note} • เลือกต่อจนกว่าจะครบ 3 อย่างที่ถูกต้อง` });
    }
  };

  const eqById = useMemo(() => Object.fromEntries(EQUIPMENT.map((e) => [e.id, e])), []);
  const shuffled = useMemo(() => [...picked].sort(() => Math.random() - 0.5), [picked.length === 3]);

  const place = (slotIdx) => {
    if (!holding) { setOrderMsg('แตะอุปกรณ์ที่ต้องการก่อน แล้วแตะช่องลำดับขั้นตอน'); return; }
    const need = CARE_STEPS[slotIdx].key;
    if (holding === need) {
      setSlots((s) => s.map((v, i) => (i === slotIdx ? holding : v)));
      setHolding(null);
      setOrderMsg(`✓ ถูกต้อง! ขั้นที่ ${slotIdx + 1} ${CARE_STEPS[slotIdx].label}`);
      const filled = slots.filter(Boolean).length + 1;
      if (filled === 3) {
        setWardFlow(room, 'activity', true);
        completeModule(room);
        setTimeout(() => { setStep(3); setOrderMsg(null); }, 900);
      }
    } else {
      setOrderMsg(`✕ ยังไม่ถูกลำดับ — ลองใหม่: ขั้นที่ ${slotIdx + 1} คือ "${CARE_STEPS[slotIdx].label}"`);
      setHolding(null);
    }
  };

  const reset = () => { setStep(1); setPicked([]); setWrong({}); setToast(null); setSlots([null, null, null]); setHolding(null); setOrderMsg(null); };
  const finish = () => { setWardFlow(room, 'activity', true); completeModule(room); open('quiz', room); };

  const stepper = (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {[1, 2, 3].map((n) => (
        <span key={n} style={{
          padding: '6px 14px', borderRadius: 18, fontWeight: 800, fontSize: 'clamp(13px,1.7vw,16px)',
          background: step === n ? PINK : step > n ? '#2e7d32' : '#fce4ec', color: step >= n ? '#fff' : '#ad1457',
        }}>
          {step > n ? '✓' : n} {n === 1 ? 'เลือกอุปกรณ์' : n === 2 ? 'เรียงลำดับ' : 'ตรวจคำตอบ'}
        </span>
      ))}
    </div>
  );

  return (
    <Shell title={`${BOOTH_SITUATION.heading} ${BOOTH_SITUATION.tagline}`} subtitle="🩹 บูทดูแลแผลฝีเย็บ" onClose={close}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {stepper}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={reset} style={btn('#fff', '#ad1457')}>↻ เริ่มใหม่</button>
            {step === 3 && (
              <>
                <button type="button" onClick={close} style={btn('#16a34a', '#fff')}>🚶 อยู่ในห้อง 3D ต่อ (ปิดหน้าต่าง)</button>
                <button type="button" onClick={finish} style={btn(PINK)}>📝 ทำแบบทดสอบทบทวน ({getQuestionsByRoomKey(room).length} ข้อ) ›</button>
              </>
            )}
          </div>
        </div>
      }>
      <div style={{ padding: 'clamp(10px,2vw,18px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 12, marginBottom: 14 }}>
          <div style={{ background: '#fff0f6', border: '2px solid #f48fb1', borderRadius: 16, padding: '12px 16px' }}>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(16px,2.1vw,20px)', marginBottom: 4 }}>💗 สถานการณ์</div>
            <div style={{ fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.6, color: '#3b1230', fontWeight: 600 }}>{BOOTH_SITUATION.story}</div>
          </div>
          <div style={{ background: '#fff8e1', border: '2px solid #ffd54f', borderRadius: 16, padding: '12px 16px' }}>
            <div style={{ fontWeight: 800, color: '#bf6b00', fontSize: 'clamp(16px,2.1vw,20px)', marginBottom: 4 }}>💡 คำแนะนำ</div>
            <div style={{ fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.6, color: '#4e342e', fontWeight: 600 }}>{BOOTH_SITUATION.tip}</div>
          </div>
        </div>

        {step === 1 && (
          <>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(17px,2.3vw,22px)', marginBottom: 8 }}>
              ① {BOOTH_SITUATION.step1.title} — {BOOTH_SITUATION.step1.sub} ({picked.length}/3)
            </div>
            {toast && (
              <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 14, fontWeight: 800, lineHeight: 1.5, fontSize: 'clamp(14px,1.9vw,18px)', background: toast.ok ? '#e8f5e9' : '#ffebee', color: toast.ok ? '#1b5e20' : '#b71c1c', border: `2px solid ${toast.ok ? '#66bb6a' : '#ef5350'}` }}>{toast.text}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(46%,210px),1fr))', gap: 12 }}>
              {EQUIPMENT.map((eq) => {
                const isPicked = picked.includes(eq.id);
                const isWrong = !!wrong[eq.id];
                return (
                  <button key={eq.id} type="button" onClick={() => chooseEq(eq)} disabled={isPicked || isWrong}
                    style={{
                      position: 'relative', padding: 0, textAlign: 'center', borderRadius: 16, overflow: 'hidden',
                      cursor: isPicked || isWrong ? 'default' : 'pointer', background: isPicked ? '#e8f5e9' : isWrong ? '#ffebee' : '#fff',
                      border: `3px solid ${isPicked ? '#43a047' : isWrong ? '#ef5350' : '#f8bbd0'}`, opacity: isWrong ? 0.65 : 1,
                    }}>
                    <div style={{ height: 112, overflow: 'hidden', background: '#fdf0f4' }}>
                      <img src={eq.img} alt={eq.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.16)', transformOrigin: '0% 100%' }} />
                    </div>
                    <div style={{ padding: '6px 8px 10px' }}>
                      <div style={{ fontWeight: 800, fontSize: 'clamp(14px,1.8vw,17px)', color: '#3b1230', lineHeight: 1.3 }}>{eq.name}</div>
                      <div style={{ fontSize: 'clamp(12px,1.5vw,14px)', color: '#6b6b6b', fontWeight: 600, lineHeight: 1.35 }}>{(isPicked || isWrong) ? eq.note : '\u00a0'}</div>
                    </div>
                    {isPicked && <div style={{ position: 'absolute', top: 6, right: 6, width: 34, height: 34, borderRadius: 17, background: '#2e7d32', color: '#fff', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>}
                    {isWrong && <div style={{ position: 'absolute', top: 6, right: 6, width: 34, height: 34, borderRadius: 17, background: '#e53935', color: '#fff', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</div>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(17px,2.3vw,22px)', marginBottom: 4 }}>② {BOOTH_SITUATION.step2.title}</div>
            <div style={{ fontWeight: 600, color: '#6b2145', fontSize: 'clamp(14px,1.9vw,18px)', marginBottom: 10 }}>{BOOTH_SITUATION.step2.sub} — แตะอุปกรณ์ แล้วแตะช่องขั้นตอนที่ถูกต้อง</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {shuffled.map((id) => {
                const eq = eqById[id];
                const used = slots.includes(id);
                const sel = holding === id;
                return (
                  <button key={id} type="button" disabled={used} onClick={() => { setHolding(id); setOrderMsg(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: 6, paddingRight: 16, borderRadius: 16, cursor: used ? 'default' : 'pointer',
                      border: `3px solid ${sel ? PINK : '#f8bbd0'}`, background: sel ? '#fce4ec' : '#fff', opacity: used ? 0.35 : 1,
                      boxShadow: sel ? '0 0 0 4px rgba(233,30,99,.25)' : 'none',
                    }}>
                    <span style={{ width: 84, height: 62, borderRadius: 10, overflow: 'hidden', display: 'inline-block', background: '#fdf0f4' }}>
                      <img src={eq.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.16)', transformOrigin: '0% 100%' }} />
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 'clamp(14px,1.8vw,17px)', color: '#3b1230', textAlign: 'left' }}>{eq.name}</span>
                  </button>
                );
              })}
            </div>
            {orderMsg && (
              <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 14, fontWeight: 800, fontSize: 'clamp(14px,1.9vw,18px)', background: orderMsg.startsWith('✓') ? '#e8f5e9' : orderMsg.startsWith('✕') ? '#ffebee' : '#fff8e1', color: orderMsg.startsWith('✓') ? '#1b5e20' : orderMsg.startsWith('✕') ? '#b71c1c' : '#6d4c41', border: '2px solid #ffd54f' }}>{orderMsg}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,230px),1fr))', gap: 12 }}>
              {CARE_STEPS.map((st, i) => {
                const filled = slots[i] ? eqById[slots[i]] : null;
                const colors = ['#1e88e5', '#ec407a', '#8e24aa'];
                return (
                  <button key={st.n} type="button" onClick={() => place(i)}
                    style={{ padding: 0, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', textAlign: 'center', background: '#fff', border: `3px solid ${filled ? '#43a047' : colors[i]}` }}>
                    <div style={{ background: colors[i], color: '#fff', fontWeight: 900, fontSize: 'clamp(16px,2.1vw,20px)', padding: '6px 10px' }}>{st.n} {st.label}</div>
                    <img src={st.img} alt={st.label} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '8px 10px 12px', minHeight: 74 }}>
                      <div style={{ fontSize: 'clamp(13px,1.7vw,16px)', color: '#4a4a4a', fontWeight: 600, lineHeight: 1.45 }}>{st.title}</div>
                      <div style={{ marginTop: 6, fontWeight: 800, fontSize: 'clamp(14px,1.8vw,17px)', color: filled ? '#1b5e20' : '#ad1457' }}>
                        {filled ? `✓ ${filled.name}` : '⬇ แตะเพื่อวางอุปกรณ์ที่นี่'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#ad1457', fontSize: 'clamp(17px,2.3vw,22px)', marginBottom: 8 }}>③ {BOOTH_SITUATION.step3.title}</div>
            <div style={{ display: 'inline-block', background: '#e8f5e9', border: '3px solid #66bb6a', borderRadius: 22, padding: '18px 28px', maxWidth: 680, width: '100%' }}>
              <div style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 900, color: '#1b5e20' }}>✔ {BOOTH_SITUATION.praise}</div>
              <div style={{ fontSize: 'clamp(16px,2.1vw,21px)', color: '#2e4a2f', fontWeight: 700, margin: '6px 0 12px' }}>{BOOTH_SITUATION.praiseSub}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                {BOOTH_SITUATION.highlights.map((h) => (
                  <div key={h} style={{ background: '#fff', borderRadius: 14, padding: '8px 14px', fontWeight: 800, fontSize: 'clamp(15px,2vw,19px)', color: '#1b5e20', border: '2px solid #a5d6a7' }}>✅ {h}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ───────────────────────── แบบประเมินท้ายห้อง ─────────────────────────
function WardQuiz({ room }) {
  const close = useStore((s) => s.closeWardModal);
  const setRoom = useStore((s) => s.setRoom);
  const completeModule = useStore((s) => s.completeModule);
  const setShowSuccessModal = useStore((s) => s.setShowSuccessModal);
  const setWardFlow = useStore((s) => s.setWardFlow);
  const questions = useMemo(() => getQuestionsByRoomKey(room), [room]);
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState(null);
  const [fb, setFb] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx] || questions[0];

  if (!q) {
    return (
      <Shell title="แบบประเมินความรู้" onClose={close}>
        <div style={{ padding: 24, fontSize: 18 }}>ยังไม่มีแบบประเมินสำหรับห้องนี้</div>
      </Shell>
    );
  }

  const answer = (c) => {
    if (fb) return;
    setChoice(c); setFb(true);
    if (c === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setChoice(null); setFb(false);
    if (idx < questions.length - 1) setIdx(idx + 1);
    else {
      setDone(true);
      completeModule(room);
      setWardFlow(room, 'quiz', true);
    }
  };

  return (
    <Shell title="📋 แบบประเมินความรู้ประจำห้อง" subtitle={done ? 'เสร็จสิ้น' : `ข้อ ${idx + 1} / ${questions.length} • คะแนนสะสม ${score}`} onClose={close}>
      <div style={{ padding: 'clamp(14px,2.5vw,26px)' }}>
        {!done ? (
          <>
            <div style={{ fontSize: 'clamp(18px,2.6vw,26px)', fontWeight: 800, color: '#222', lineHeight: 1.5, marginBottom: 18 }}>“{q.question}”</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[true, false].map((val) => {
                const isAns = fb && q.answer === val;
                const isMine = choice === val;
                return (
                  <button key={String(val)} type="button" disabled={fb} onClick={() => answer(val)} style={{
                    padding: '18px 10px', fontSize: 'clamp(18px,2.4vw,24px)', fontWeight: 900, borderRadius: 16, cursor: fb ? 'default' : 'pointer',
                    border: '3px solid', borderColor: isAns ? '#16a34a' : isMine ? PINK : '#d1d5db',
                    background: isAns ? '#dcfce7' : isMine ? '#fce4ec' : '#f9fafb', color: isAns ? '#15803d' : '#1f2937',
                  }}>{val ? '✓ ถูก' : '✕ ผิด'}</button>
                );
              })}
            </div>
            {fb && (
              <div style={{ background: choice === q.answer ? '#f0fdf4' : '#fffbeb', border: `2px solid ${choice === q.answer ? '#86efac' : '#fde68a'}`, borderRadius: 16, padding: 14 }}>
                <div style={{ fontWeight: 900, fontSize: 'clamp(16px,2.2vw,21px)', color: choice === q.answer ? '#16a34a' : '#d97706', marginBottom: 6 }}>
                  {choice === q.answer ? '🎉 ถูกต้อง! (+1 คะแนน)' : `⚠️ เฉลย: ${q.answerText}`}
                </div>
                <div style={{ fontSize: 'clamp(14px,1.9vw,18px)', color: '#444', lineHeight: 1.55 }}><strong>💡 เหตุผล:</strong> {q.reason}</div>
                <div style={{ textAlign: 'right', marginTop: 10 }}>
                  <button type="button" onClick={next} style={btn(PINK)}>{idx < questions.length - 1 ? 'ข้อถัดไป ➜' : 'สรุปผลคะแนน 🏆'}</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 6px' }}>
            <div style={{ fontSize: 'clamp(22px,3.4vw,32px)', fontWeight: 900, color: '#2e7d32', marginBottom: 8 }}>🎉 ผ่านบทเรียนและการประเมินความรู้แล้ว!</div>
            <div style={{ fontSize: 'clamp(16px,2.2vw,21px)', color: '#444', marginBottom: 18 }}>คะแนนของคุณ: <strong>{score} / {questions.length}</strong></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={close} style={btn('#16a34a', '#fff')}>🚶 อยู่ในห้อง 3D ต่อ (เดินสำรวจห้อง)</button>
              <button type="button" onClick={() => { setIdx(0); setChoice(null); setFb(false); setScore(0); setDone(false); }} style={btn('#fff', '#ad1457')}>ทำแบบประเมินซ้ำ ↻</button>
              <button type="button" onClick={() => { close(); setRoom('lobby'); }} style={btn(PINK)}>🏥 กลับสู่โถงล็อบบี้</button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

export default function WardModals() {
  const wardModal = useStore((s) => s.wardModal);
  const close = useStore((s) => s.closeWardModal);

  useEffect(() => {
    if (!wardModal) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [wardModal, close]);

  if (!wardModal) return null;
  const { kind, room } = wardModal;
  // key ทำให้ state ภายในรีเซ็ตเมื่อเปิดใหม่
  if (kind === 'slide') return <SlideLightbox key={`s-${room}`} room={room} />;
  if (kind === 'food') return <FoodActivity key={`f-${room}`} room={room} />;
  if (kind === 'booth') return <BoothActivity key={`b-${room}`} room={room} />;
  if (kind === 'quiz') return <WardQuiz key={`q-${room}`} room={room} />;
  return null;
}
