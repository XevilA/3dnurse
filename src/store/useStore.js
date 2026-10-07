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

  // ── Mandatory Pre-test (แบบทดสอบก่อนเรียน 20 ข้อ) ──
  hasCompletedPretest: false,
  pretestScore: 0,
  posttestScore: 0,
  showPretestWarning: false,
  pretestWarningTargetRoom: null,

  // ── UI state ──
  showSuccessModal: false,
  successMessage: '',

  // ── Actions ──
  setCompletedPretest: (score) => set({ hasCompletedPretest: true, pretestScore: score }),
  setCompletedPosttest: (score) => set({ posttestScore: score }),
  triggerPretestWarning: (roomKey) => set({ showPretestWarning: true, pretestWarningTargetRoom: roomKey }),
  dismissPretestWarning: () => set({ showPretestWarning: false, pretestWarningTargetRoom: null }),

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
  setPlayerPosition: (pos) =>
    set((state) => {
      const cur = state.playerPosition;
      if (cur && Math.abs(cur[0] - pos[0]) < 0.001 && Math.abs(cur[1] - pos[1]) < 0.001 && Math.abs(cur[2] - pos[2]) < 0.001) {
        return state;
      }
      return { playerPosition: pos };
    }),
  setPlayerRotationY: (rot) =>
    set((state) => {
      if (typeof state.playerRotationY === 'number' && Math.abs(state.playerRotationY - rot) < 0.001) {
        return state;
      }
      return { playerRotationY: rot };
    }),
  setPlayerAnimation: (anim) => set({ playerAnimation: anim }),

  // ── Gamified Seating Actions ──
  registerSeat: (seat) =>
    set((state) => {
      const existing = state.seats.find((s) => s.id === seat.id);
      if (existing) {
        const isSame =
          existing.name === seat.name &&
          existing.type === seat.type &&
          existing.rotationY === seat.rotationY &&
          existing.isDrivable === seat.isDrivable &&
          existing.position?.[0] === seat.position?.[0] &&
          existing.position?.[1] === seat.position?.[1] &&
          existing.position?.[2] === seat.position?.[2] &&
          existing.seatOffset?.[0] === seat.seatOffset?.[0] &&
          existing.seatOffset?.[1] === seat.seatOffset?.[1] &&
          existing.seatOffset?.[2] === seat.seatOffset?.[2];
        if (isSame) return state; // Idempotent: return unmodified state
        return { seats: state.seats.map((s) => (s.id === seat.id ? seat : s)) };
      }
      return { seats: [...state.seats, seat] };
    }),

  unregisterSeat: (seatId) =>
    set((state) => {
      if (!state.seats.some((s) => s.id === seatId)) return state;
      return {
        seats: state.seats.filter((s) => s.id !== seatId),
        nearbySeat: state.nearbySeat?.id === seatId ? null : state.nearbySeat,
        seatedTarget: state.seatedTarget?.id === seatId ? null : state.seatedTarget,
      };
    }),

  setNearbySeat: (seat) =>
    set((state) => {
      if (state.nearbySeat?.id === seat?.id) return state;
      return { nearbySeat: seat };
    }),

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

  setStamina: (val) =>
    set((state) => {
      const clamped = Math.min(100, Math.max(0, val));
      if (Math.abs(state.stamina - clamped) < 0.1) return state;
      return { stamina: clamped };
    }),

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
