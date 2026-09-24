import { create } from 'zustand';

/**
 * Central Zustand store for the Postpartum & Newborn Care Learning Metaverse.
 *
 * Rooms:
 *   lobby           — ห้องต้อนรับ (Welcome)
 *   motherCare1     — การดูแลร่างกายและการฟื้นตัวหลังคลอด
 *   motherCare2     — การดูแลแผลหลังคลอด
 *   motherCare3     — การดูแลเต้านม
 *   motherCare4     — การสังเกตอาการผิดปกติและการป้องกันภาวะแทรกซ้อน
 *   newbornCare1    — การให้นมทารก
 *   newbornCare2    — การอาบน้ำทารก
 *   newbornCare3    — การเปลี่ยนผ้าอ้อม
 *   newbornCare4    — การดูแลสายสะดือ
 *   newbornCare5    — การจัดสภาพแวดล้อมที่ปลอดภัยให้แก่ทารก
 *   quiz            — ห้องแบบทดสอบหลังเรียน
 */
const useStore = create((set, get) => ({
  // ── Navigation ──
  currentRoom: 'lobby',

  // ── Simulation state ──
  currentStep: 0,

  // ── Avatar state ──
  motherClothing: 'hospitalGown',  // 'hospitalGown' | 'casual' | 'sleepwear'
  isHoldingBaby: false,

  // ── Learning progress (tracks completed modules) ──
  learningProgress: {},

  // ── UI state ──
  showSuccessModal: false,
  successMessage: '',

  // ── Actions ──
  setRoom: (room) => set({ currentRoom: room, currentStep: 0 }),
  setStep: (step) => set({ currentStep: step }),
  setClothing: (clothing) => set({ motherClothing: clothing }),
  setHoldingBaby: (val) => set({ isHoldingBaby: val }),

  completeModule: (moduleId) =>
    set((state) => ({
      learningProgress: { ...state.learningProgress, [moduleId]: true },
    })),

  setShowSuccessModal: (show, message = '') =>
    set({ showSuccessModal: show, successMessage: message }),

  resetSimulation: () =>
    set({ currentStep: 0, isHoldingBaby: false }),

  // ── Computed helpers ──
  getCompletedCount: () => Object.keys(get().learningProgress).length,
  isModuleCompleted: (moduleId) => !!get().learningProgress[moduleId],
}));

export { useStore };
export default useStore;
