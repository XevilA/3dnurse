import { create } from 'zustand';

/**
 * Central Zustand store for the Postpartum & Newborn Care Learning Metaverse.
 *
 * Clinical Learning Modules (8 Specialized Rooms + Hubs):
 *   lobby           — ห้องต้อนรับและปฐมนิเทศ (Grand Hospital Lobby)
 *   dressingRoom    — ห้องแต่งตัว & ปรับสรีระคุณแม่ (Maternity Studio Suite 001)
 *   motherCare1     — การดูแลร่างกายและการฟื้นตัวหลังคลอด (Mother Ward 101)
 *   motherCare2     — การดูแลแผลหลังคลอดและสุขอนามัย (Mother Ward 102)
 *   motherCare3     — การดูแลเต้านมและท่าให้นมบุตร (Mother Ward 103)
 *   motherCare4     — การสังเกตอาการผิดปกติและภาวะแทรกซ้อน (Mother Ward 104)
 *   newbornCare1    — การให้นมทารกแรกเกิด (Newborn Nursery 201)
 *   newbornCare2    — การอาบน้ำและการเปลี่ยนผ้าอ้อม 14 ขั้นตอน (Newborn Nursery 202)
 *   newbornCare3    — การดูแลสายสะดือทารกแรกเกิด (Newborn Nursery 203)
 *   newbornCare4    — สภาพแวดล้อมที่ปลอดภัยสำหรับทารกและการนอนหลับ (Newborn Nursery 204)
 *   quiz            — ห้องแบบทดสอบประเมินความรู้ 20 ข้อ (Grand Quiz Hall 301)
 */
const useStore = create((set, get) => ({
  // ── Navigation ──
  currentRoom: 'lobby',

  // ── Simulation state ──
  currentStep: 0,

  // ── Avatar & Player state (Postpartum Mother Suite: Pants Set vs Midi Dress) ──
  selectedCharacter: (() => {
    if (typeof localStorage === 'undefined') return 'postpartum_mother';
    const s = localStorage.getItem('3dnurse_character');
    if (s === 'postpartum_mother' || s === 'postpartum_dress') return s;
    if (s === 'pregnant_mother') return 'postpartum_dress';
    return 'postpartum_mother';
  })(),
  selectedOutfit: (typeof localStorage !== 'undefined' && localStorage.getItem('3dnurse_outfit')) || 'pink', // 'pink' | 'blue' | 'lavender' | 'mint' | 'white' | 'peach'
  motherClothing: (typeof localStorage !== 'undefined' && localStorage.getItem('3dnurse_outfit')) || 'pink',  // legacy alias
  bellyBump: (typeof localStorage !== 'undefined' && localStorage.getItem('3dnurse_belly_bump')) || 'none', // 'none' (สรีระปกติหลังคลอด)
  isHoldingBaby: false,
  cameraMode: '3rdPerson', // '3rdPerson' | '1stPerson'
  playerPosition: [0, 0, 3],
  playerRotationY: 0,
  playerAnimation: 'idle', // 'idle' | 'walk' | 'run' | 'sit'
  lobbySpawnPos: [0, 0, 3],
  lobbySpawnRotY: 0,
  setLobbySpawn: (pos, rotY = 0) => set({ lobbySpawnPos: pos, lobbySpawnRotY: rotY }),

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
    vectorX: 0,
    vectorZ: 0,
  },

  // ── User ID & Session History Memory (จดจำข้อมูลผู้ใช้ครั้งแรก) ──
  userId: (() => {
    if (typeof localStorage === 'undefined') return 'USER-1001';
    let id = localStorage.getItem('3dnurse_user_id');
    if (!id) {
      id = 'NURSE-' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('3dnurse_user_id', id);
    }
    return id;
  })(),
  setUserId: (id) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('3dnurse_user_id', id);
    set({ userId: id });
  },

  // ── Post-Pretest Timer & Playtime (เริ่มจับเวลาและนับ Stamina หลังทำ Pre-test) ──
  playTimeSeconds: 0,
  incrementPlayTime: () => set((state) => ({ playTimeSeconds: state.playTimeSeconds + 1 })),
  resetPlayTime: () => set({ playTimeSeconds: 0 }),

  // ── Learning progress (tracks completed modules) ──
  learningProgress: (() => {
    if (typeof localStorage === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('3dnurse_progress') || '{}');
    } catch {
      return {};
    }
  })(),

  // ── Mandatory Pre-test (แบบทดสอบก่อนเรียน 20 ข้อ) ──
  hasCompletedPretest: (() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('3dnurse_pretest_done') === 'true';
  })(),
  pretestScore: (() => {
    if (typeof localStorage === 'undefined') return 0;
    return parseInt(localStorage.getItem('3dnurse_pretest_score') || '0', 10);
  })(),
  posttestScore: 0,
  showPretestWarning: false,
  pretestWarningTargetRoom: null,

  // ── Lightbox Image Viewer (คลิกภาพโปสเตอร์แล้วขยายใหญ่เต็มตา) ──
  activeLightboxImage: null, // { src, title, description, badge }
  openLightbox: (imgData) => set({ activeLightboxImage: imgData }),
  closeLightbox: () => set({ activeLightboxImage: null }),

  // ── Room Entry Confirmation Modal (ปุ่มยืนยันก่อนเข้าแต่ละห้อง) ──
  pendingRoomConfirmation: null, // { roomKey, roomTitle, roomNumber, icon }
  requestRoomEntry: (info) => set({ pendingRoomConfirmation: info }),
  cancelRoomEntry: () => set({ pendingRoomConfirmation: null }),

  // ── Ward 101/102 learning flow (สไลด์ Zone → กิจกรรม → แบบประเมิน) ──
  wardModal: null, // { kind: 'slide' | 'food' | 'booth' | 'quiz', room }
  wardFlow: {}, // { motherCare1: { slide, activity, quiz } }
  openWardModal: (kind, room) => set({ wardModal: { kind, room } }),
  closeWardModal: () => set({ wardModal: null }),
  setWardFlow: (room, key, val) =>
    set((state) => ({
      wardFlow: { ...state.wardFlow, [room]: { ...(state.wardFlow[room] || {}), [key]: val } },
    })),

  // ── UI state ──
  showSuccessModal: false,
  successMessage: '',
  isQuizMinimized: false,
  setQuizMinimized: (val) => set({ isQuizMinimized: val }),

  // ── Actions ──
  setCompletedPretest: (score) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('3dnurse_pretest_done', 'true');
      localStorage.setItem('3dnurse_pretest_score', String(score));
    }
    set({ hasCompletedPretest: true, pretestScore: score });
  },
  unlockAllRooms: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('3dnurse_pretest_done', 'true');
    }
    set({ hasCompletedPretest: true, showPretestWarning: false, pretestWarningTargetRoom: null });
  },
  setCompletedPosttest: (score) => set({ posttestScore: score }),
  triggerPretestWarning: (roomKey) => set({ showPretestWarning: true, pretestWarningTargetRoom: roomKey }),
  dismissPretestWarning: () => set({ showPretestWarning: false, pretestWarningTargetRoom: null }),

  setRoom: (room, customSpawn = null, customRotY = null) =>
    set((state) => {
      // Determine realistic doorway entrance spawn coordinates
      let spawnPos = [0, 0, 3];
      let spawnRotY = 0;

      if (room === 'lobby') {
        spawnPos = customSpawn || state.lobbySpawnPos || [0, 0, 3];
        spawnRotY = typeof customRotY === 'number' ? customRotY : (state.lobbySpawnRotY || 0);
      } else if (room === 'dressingRoom') {
        spawnPos = customSpawn || [0, 0, 2];
        spawnRotY = typeof customRotY === 'number' ? customRotY : 0;
      } else if (room === 'newbornCare1') {
        spawnPos = customSpawn || [-5.2, 0, 3.8];
        spawnRotY = typeof customRotY === 'number' ? customRotY : Math.PI / 2;
      } else if (room === 'newbornCare2') {
        spawnPos = customSpawn || [-4.8, 0, 3.3];
        spawnRotY = typeof customRotY === 'number' ? customRotY : Math.PI / 2;
      } else if (room === 'quiz') {
        spawnPos = customSpawn || [0, 0, -4];
        spawnRotY = typeof customRotY === 'number' ? customRotY : 0;
      } else {
        // Standard 18x18m clinical interior rooms have entrance doorway at X: -7.4, Z: 5.8 facing East (Math.PI / 2)
        spawnPos = customSpawn || [-7.4, 0, 5.8];
        spawnRotY = typeof customRotY === 'number' ? customRotY : Math.PI / 2;
      }

      return {
        currentRoom: room,
        currentStep: 0,
        isHoldingBaby: false,
        isSitting: false,
        seatedTarget: null,
        nearbySeat: null,
        seats: [],
        playerPosition: spawnPos,
        playerRotationY: spawnRotY,
        showSuccessModal: false,
        successMessage: '',
        wardModal: null,
        isQuizMinimized: false,
      };
    }),
  setStep: (step) => set({ currentStep: step }),
  setClothing: (clothing) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('3dnurse_outfit', clothing);
    set({ motherClothing: clothing, selectedOutfit: clothing });
  },
  setOutfit: (outfit) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('3dnurse_outfit', outfit);
    set({ selectedOutfit: outfit, motherClothing: outfit });
  },
  setCharacter: (char) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('3dnurse_character', char);
    set({ selectedCharacter: char });
  },
  setBellyBump: (bump) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('3dnurse_belly_bump', bump);
    set({ bellyBump: bump });
  },
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
  sitOnSeat: (seat) => {
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
    set((state) => {
      const nextProgress = { ...state.learningProgress, [moduleId]: true };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('3dnurse_progress', JSON.stringify(nextProgress));
      }
      return { learningProgress: nextProgress };
    }),

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
  window.__store = useStore;
}
