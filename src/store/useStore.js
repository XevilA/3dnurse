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

  // ── Avatar & Player state (GTA Style Controls) ──
  motherClothing: 'hospitalGown',  // 'hospitalGown' | 'casual' | 'sleepwear'
  isHoldingBaby: false,
  cameraMode: '3rdPerson', // '3rdPerson' | '1stPerson'
  playerPosition: [0, 0, 2],
  playerAnimation: 'idle', // 'idle' | 'walk' | 'run' | 'sit'

  // ── Gamified Interactive Seating System ──
  isSitting: false,
  seatedTarget: null, // { id, name, type: 'wheelchair'|'sofa'|'chair'|'bed', position, rotationY, seatHeight, isDrivable }
  nearbySeat: null,   // seat currently in range of player
  stamina: 100,       // 0 - 100% gamified recovery
  seats: [],          // registered interactive seats in current scene
  
  // Virtual joystick / on-screen controls
  virtualInput: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    interact: false,
    sit: false,
  },

  // ── Learning progress (tracks completed modules) ──
  learningProgress: {},

  // ── UI state ──
  showSuccessModal: false,
  successMessage: '',

  // ── Actions ──
  setRoom: (room) => set({
    currentRoom: room,
    currentStep: 0,
    isHoldingBaby: false,
    isSitting: false,
    seatedTarget: null,
    nearbySeat: null,
    seats: [],
    playerPosition: [0, 0, 3],
  }),
  setStep: (step) => set({ currentStep: step }),
  setClothing: (clothing) => set({ motherClothing: clothing }),
  setHoldingBaby: (val) => set({ isHoldingBaby: val }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === '3rdPerson' ? '1stPerson' : '3rdPerson',
    })),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerRotationY: (rot) => set({ playerRotationY: rot }),
  setPlayerAnimation: (anim) => set({ playerAnimation: anim }),

  // ── Gamified Seating Actions ──
  registerSeat: (seat) =>
    set((state) => {
      const exists = state.seats.some((s) => s.id === seat.id);
      if (exists) return { seats: state.seats.map((s) => (s.id === seat.id ? seat : s)) };
      return { seats: [...state.seats, seat] };
    }),

  unregisterSeat: (seatId) =>
    set((state) => ({
      seats: state.seats.filter((s) => s.id !== seatId),
      nearbySeat: state.nearbySeat?.id === seatId ? null : state.nearbySeat,
      seatedTarget: state.seatedTarget?.id === seatId ? null : state.seatedTarget,
    })),

  setNearbySeat: (seat) => set({ nearbySeat: seat }),

  sitDown: (seat) => {
    if (!seat) return;
    set({
      isSitting: true,
      seatedTarget: seat,
      playerAnimation: 'sit',
    });
  },

  standUp: () =>
    set({
      isSitting: false,
      seatedTarget: null,
      playerAnimation: 'idle',
    }),

  setStamina: (val) => set({ stamina: Math.min(100, Math.max(0, val)) }),

  setVirtualInput: (input) =>
    set((state) => ({
      virtualInput: { ...state.virtualInput, ...input },
    })),

  completeModule: (moduleId) =>
    set((state) => ({
      learningProgress: { ...state.learningProgress, [moduleId]: true },
    })),

  setShowSuccessModal: (show, message = '') =>
    set({ showSuccessModal: show, successMessage: message }),

  resetSimulation: () =>
    set({
      currentStep: 0,
      isHoldingBaby: false,
      isSitting: false,
      seatedTarget: null,
      playerPosition: [0, 0, 3],
    }),

  // ── Computed helpers ──
  getCompletedCount: () => Object.keys(get().learningProgress).length,
  isModuleCompleted: (moduleId) => !!get().learningProgress[moduleId],
}));

export { useStore };
export default useStore;

if (typeof window !== 'undefined') {
  window.useStore = useStore;
}
