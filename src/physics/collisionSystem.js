/**
 * Realistic Kinematic Physics & Collision System for 3D Nurse Learning Metaverse
 *
 * Implements:
 * 1. Continuous Swept & Sliding Collision Resolution (Wall Sliding Physics)
 * 2. Capsule / Cylinder Humanoid & Wheelchair Colliders
 * 3. Accurate Room Boundary & Furniture AABB/Circle Colliders for all 11 rooms
 * 4. Zero Tunneling through walls, desks, beds, cribs, or obstacles
 * 5. Dynamic seat deactivation when seated on specific furniture
 */

// Player physical dimensions
export const PLAYER_RADIUS = 0.42;       // Walking character collision radius in meters
export const WHEELCHAIR_RADIUS = 0.58;   // Wheelchair driving collision radius in meters

// Comprehensive Collider Registry for all rooms
export const ROOM_COLLIDERS = {
  // ── 1. Grand Hospital Lobby (22x22m, Walkable [-10.55, 10.55]) ──
  lobby: {
    bounds: { minX: -10.55, maxX: 10.55, minZ: -10.55, maxZ: 10.55 },
    doorways: [
      // West Wall Portals (Mother Care Wards 101 - 104)
      { wall: 'minX', minSpan: -7.8, maxSpan: -5.4, thresholdLimit: -10.88, name: 'Ward 101' },
      { wall: 'minX', minSpan: -3.4, maxSpan: -1.0, thresholdLimit: -10.88, name: 'Ward 102' },
      { wall: 'minX', minSpan: 1.0, maxSpan: 3.4, thresholdLimit: -10.88, name: 'Ward 103' },
      { wall: 'minX', minSpan: 5.4, maxSpan: 7.8, thresholdLimit: -10.88, name: 'Ward 104' },
      // East Wall Portals (Newborn Care Nurseries 201 - 204)
      { wall: 'maxX', minSpan: -7.8, maxSpan: -5.4, thresholdLimit: 10.88, name: 'Nursery 201' },
      { wall: 'maxX', minSpan: -3.4, maxSpan: -1.0, thresholdLimit: 10.88, name: 'Nursery 202' },
      { wall: 'maxX', minSpan: 1.0, maxSpan: 3.4, thresholdLimit: 10.88, name: 'Nursery 203' },
      { wall: 'maxX', minSpan: 5.4, maxSpan: 7.8, thresholdLimit: 10.88, name: 'Nursery 204' },
      // North Wall Portals (Hall 301 & Suite 001)
      { wall: 'minZ', minSpan: -1.6, maxSpan: 1.6, thresholdLimit: -10.88, name: 'Hall 301 Quiz' },
      { wall: 'minZ', minSpan: 4.2, maxSpan: 6.6, thresholdLimit: -10.88, name: 'Suite 001 Dressing Room' },
    ],
    boxes: [
      // Information & Nurse Reception Desk (Centered at Z: -4.2)
      { minX: -3.0, maxX: 3.0, minZ: -5.4, maxZ: -2.8, name: 'เคาน์เตอร์พยาบาลส่วนกลาง' },
      // Left Hospital Lounge Velvet Sofa
      { minX: -7.2, maxX: -4.4, minZ: -1.4, maxZ: 1.4, name: 'โซฟาพักผ่อนฝั่งซ้าย', seatId: 'lobby_sofa_left' },
      // Right Hospital Lounge Velvet Sofa
      { minX: 4.4, maxX: 7.2, minZ: -1.4, maxZ: 1.4, name: 'โซฟาพักผ่อนฝั่งขวา', seatId: 'lobby_sofa_right' },
    ],
    circles: [
      // 4 Real Hospital Corner Trees
      { x: -9.6, z: -9.6, radius: 0.8, name: 'ต้นไม้ล็อบบี้ 1' },
      { x: 9.6, z: -9.6, radius: 0.8, name: 'ต้นไม้ล็อบบี้ 2' },
      { x: -9.6, z: 9.6, radius: 0.8, name: 'ต้นไม้ล็อบบี้ 3' },
      { x: 9.6, z: 9.6, radius: 0.8, name: 'ต้นไม้ล็อบบี้ 4' },
      // Potted Plants
      { x: -4.8, z: -6.2, radius: 0.6, name: 'กระถางต้นไม้ซ้าย' },
      { x: 4.8, z: -6.2, radius: 0.6, name: 'กระถางต้นไม้ขวา' },
      // Hospital Wheelchairs (parked snugly in South-West & South-East corners)
      { x: -9.1, z: 8.1, radius: 0.65, name: 'รถเข็น 1', seatId: 'lobby_wheelchair_1' },
      { x: 8.05, z: 9.15, radius: 0.65, name: 'รถเข็น 2', seatId: 'lobby_wheelchair_2' },
    ]
  },

  // ── 2. Ward 101: Postpartum Recovery & Body Care (18x18m) ──
  motherCare1: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Hospital Patient Bed at [-5.4, 0, -6.0]
      { minX: -6.25, maxX: -4.55, minZ: -7.15, maxZ: -4.85, name: 'เตียงพักฟื้นคุณแม่', seatId: 'room101_bed' },
      // Bedside Nightstand at [-7.2, 0, -6.8]
      { minX: -7.75, maxX: -6.65, minZ: -7.35, maxZ: -6.25, name: 'โต๊ะข้างเตียง' },
      // Newborn Bassinet / Crib at [-3.4, 0, -6.0]
      { minX: -4.05, maxX: -2.75, minZ: -6.65, maxZ: -5.35, name: 'เตียงนอนเด็กแรกเกิด' },
      // Maternal Recovery Lounge & Side Table at [5.4, 0, -6.5] & [4.0, 0, -6.8]
      { minX: 3.5, maxX: 6.2, minZ: -7.35, maxZ: -5.65, name: 'เก้าอี้พักผ่อนคุณแม่' },
      // Porcelain Sanitary Wash Station (flush against right wall at [8.3, 0, 2.5])
      { minX: 7.35, maxX: 8.55, minZ: 1.8, maxZ: 3.2, name: 'อ่างล้างมือปลอดเชื้อ' },
      // Medicine Cabinet at [8.4, 0, -2.2]
      { minX: 7.55, maxX: 8.55, minZ: -3.0, maxZ: -1.4, name: 'ตู้ยาและเวชภัณฑ์' },
      // LoungeCorner at [7.4, 0, 6.2]
      { minX: 6.4, maxX: 8.55, minZ: 5.2, maxZ: 8.55, name: 'มุมพักผ่อน/ชั้นหนังสือ' },
    ],
    circles: [
      { x: -7.5, z: 3.2, radius: 0.65, name: 'รถเข็นผู้ป่วย', seatId: 'ward101_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้ประจำห้อง' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้ปรับอากาศ' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะติดเชื้อ' },
      { x: 1.5, z: 1.5, radius: 1.3, name: 'โต๊ะอาหาร' },
    ]
  },

  // ── 3. Ward 102: Wound Care & Perineal Hygiene (18x18m) ──
  motherCare2: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Examination Bed at [-5.4, 0, -6.0]
      { minX: -6.25, maxX: -4.55, minZ: -7.15, maxZ: -4.85, name: 'เตียงตรวจแผลคุณแม่', seatId: 'room102_bed' },
      // Sterile Wound Care Cart at [-7.2, 0, -6.5]
      { minX: -7.8, maxX: -6.6, minZ: -7.15, maxZ: -5.85, name: 'รถทำแผลปลอดเชื้อ' },
      // Clinical Consultation & REEDA Station at [5.4, 0, -6.5]
      { minX: 4.45, maxX: 6.35, minZ: -7.25, maxZ: -5.75, name: 'โต๊ะตรวจประเมิน REEDA' },
      // Porcelain Wash Station at [8.3, 0, 2.5]
      { minX: 7.35, maxX: 8.55, minZ: 1.8, maxZ: 3.2, name: 'อ่างล้างมือ' },
      // Medicine Cabinet at [8.4, 0, -2.2]
      { minX: 7.55, maxX: 8.55, minZ: -3.0, maxZ: -1.4, name: 'ตู้ยาและเวชภัณฑ์ทำแผล' },
      // LoungeCorner at [7.4, 0, 6.2]
      { minX: 6.4, maxX: 8.55, minZ: 5.2, maxZ: 8.55, name: 'มุมพักผ่อน/ชั้นหนังสือ' },
      // CareBooth at [2.0, 0, 1.0]
      { minX: 0.45, maxX: 3.55, minZ: 0.2, maxZ: 1.6, name: 'บูทดูแลแผลฝีเย็บ' },
    ],
    circles: [
      { x: -7.5, z: 3.2, radius: 0.65, name: 'รถเข็นผู้ป่วย', seatId: 'ward102_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะสำลี' },
    ]
  },

  // ── 4. Ward 103: Breastfeeding & Lactation Support (18x18m — Cozy Sectional Sofa Layout) ──
  motherCare3: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Cozy L-Shaped Sectional Sofa Main Body at [0, 0, -0.2]
      { minX: -1.65, maxX: 1.65, minZ: -0.7, maxZ: 0.3, name: 'โซฟาฝึกนวดเต้านม', seatId: 'room103_practice_sofa' },
      // Chaise Lounge Extension on Left of Sofa
      { minX: -1.65, maxX: -0.5, minZ: -0.7, maxZ: 1.25, name: 'โซฟาตัวแอลฝั่งซ้าย', seatId: 'room103_practice_sofa' },
      // Low Oak Credenza behind Sofa at [3.6, 0, -2.2]
      { minX: 2.8, maxX: 4.4, minZ: -2.55, maxZ: -1.85, name: 'ตู้ไม้ประดับโคมไฟอุ่น' },
    ],
    circles: [
      { x: 0.75, z: 1.38, radius: 0.72, name: 'โต๊ะกลางวางแท็บเล็ตสื่อการสอน' },
      { x: -1.08, z: 1.72, radius: 0.40, name: 'สตูลพรมถัก' },
      { x: -5.55, z: 2.25, radius: 0.65, name: 'มุมตะกร้าหวายและต้นไม้' },
      { x: -7.6, z: -7.2, radius: 0.55, name: 'ต้นไม้ประดับมุมซ้าย' },
      { x: 7.6, z: -7.2, radius: 0.55, name: 'ต้นไม้ประดับมุมขวา' },
      { x: 7.5, z: 6.8, radius: 0.50, name: 'ต้นไม้ฟอกอากาศ' },
    ]
  },

  // ── 5. Ward 104: Postpartum Complications & Danger Signs (18x18m — Cozy Sectional Sofa Layout) ──
  motherCare4: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Cozy L-Shaped Sectional Sofa Main Body at [0, 0, -0.2]
      { minX: -1.65, maxX: 1.65, minZ: -0.7, maxZ: 0.3, name: 'โซฟาเรียนรู้สัญญาณอันตราย', seatId: 'room104_sofa' },
      // Chaise Lounge Extension on Left of Sofa
      { minX: -1.65, maxX: -0.5, minZ: -0.7, maxZ: 1.25, name: 'โซฟาตัวแอลฝั่งซ้าย', seatId: 'room104_sofa' },
      // Low Oak Credenza behind Sofa at [3.6, 0, -2.2]
      { minX: 2.8, maxX: 4.4, minZ: -2.55, maxZ: -1.85, name: 'ตู้ไม้ประดับโคมไฟอุ่น' },
    ],
    circles: [
      { x: 0.75, z: 1.38, radius: 0.72, name: 'โต๊ะกลางวางแท็บเล็ตจำแนกอาการ' },
      { x: -1.08, z: 1.72, radius: 0.40, name: 'สตูลพรมถัก' },
      { x: -5.55, z: 2.25, radius: 0.65, name: 'มุมตะกร้าหวายและต้นไม้' },
      { x: -7.6, z: -7.2, radius: 0.55, name: 'ต้นไม้ประดับมุมซ้าย' },
      { x: 7.6, z: -7.2, radius: 0.55, name: 'ต้นไม้ประดับมุมขวา' },
      { x: 7.5, z: 6.8, radius: 0.50, name: 'ต้นไม้ฟอกอากาศ' },
    ]
  },

  // ── 6. Newborn Room 1: Infant Feeding Technique (14x14m) ──
  newbornCare1: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 4.0, maxSpan: 6.5, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Classic Wooden Baby Crib at [0.4, 0, -5.2] & Bedside Nightstand at [-1.2, 0, -5.2]
      { minX: -0.45, maxX: 1.25, minZ: -5.75, maxZ: -4.65, name: 'เตียงนอนทารก' },
      { minX: -1.55, maxX: -0.85, minZ: -5.55, maxZ: -4.85, name: 'โต๊ะข้างเตียงทารก' },
      // Nursing Sofa at [-1.1, 0, -1.6]
      { minX: -1.55, maxX: -0.65, minZ: -2.35, maxZ: -0.85, name: 'เก้าอี้โซฟาให้นมทารก', seatId: 'nb1-nursing-sofa' },
      // Low Wooden Coffee Table at [-2.8, 0, -1.6]
      { minX: -3.3, maxX: -2.3, minZ: -2.4, maxZ: -0.8, name: 'โต๊ะวางอุปกรณ์เก็บน้ำนมแม่' },
      // South-East Nursery Dresser flush against East Wall at [6.50, 0, 4.75]
      { minX: 6.05, maxX: 6.55, minZ: 3.95, maxZ: 5.55, name: 'โต๊ะของใช้ทารก' },
      // South Wall: Breastmilk Fridge (x=-0.60), Kettle Table (x=0.75), Handwashing Sink (x=2.15) at z=6.47..6.54
      { minX: -1.1, maxX: 2.75, minZ: 6.05, maxZ: 6.55, name: 'ตู้เย็นเก็บน้ำนม โต๊ะน้ำร้อน และอ่างล้างมือ' },
    ],
    circles: [
      { x: 5.95, z: -5.95, radius: 0.45, name: 'แจกันดอกไม้มุมห้อง' },
      { x: 3.05, z: 6.45, radius: 0.35, name: 'ถังขยะข้างอ่างล้างมือ' },
    ]
  },

  // ── 7. Newborn Room 2: Infant Bathing & Skin Care (13x13m) ──
  newbornCare2: {
    bounds: { minX: -6.05, maxX: 6.05, minZ: -6.05, maxZ: 6.05 },
    doorways: [{ wall: 'minX', minSpan: 2.5, maxSpan: 5.1, thresholdLimit: -6.38, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Baby Crib at North Wall [1.1, 0, -4.8]
      { minX: 0.25, maxX: 1.95, minZ: -5.35, maxZ: -4.25, name: 'เตียงนอนทารก' },
      // Mission Desk at [4.6, 0, -4.8]
      { minX: 3.95, maxX: 5.25, minZ: -5.25, maxZ: -4.35, name: 'โต๊ะภารกิจ' },
      // Central Ergonomic Baby Bathing Table at [0.2, 0, -0.4]
      { minX: -1.45, maxX: 2.15, minZ: -1.05, maxZ: 0.25, name: 'โต๊ะอ่างอาบน้ำทารก' },
      // East Wall Decor Bookcase at [6.16, 0, 4.65]
      { minX: 5.85, maxX: 6.05, minZ: 3.6, maxZ: 5.7, name: 'ชั้นตกแต่งสวยงามสำหรับทารก' },
      // South Wall Baby Supplies Cabinet at [4.95, 0, 6.16]
      { minX: 4.0, maxX: 5.9, minZ: 5.85, maxZ: 6.05, name: 'ตู้ของใช้ทารก' },
      // South Wall Handwashing Sink [-3.6, 0, 5.5] & Cotton/NSS Table [-1.95, 0, 5.5]
      { minX: -4.25, maxX: -1.35, minZ: 5.1, maxZ: 6.05, name: 'อ่างล้างมือและโต๊ะเตรียมสำลีเช็ดตา' },
      // West Wall 2 Small Trash Bins at [-6.08, 0, 0.85]
      { minX: -6.05, maxX: -5.75, minZ: 0.35, maxZ: 1.35, name: 'ถังขยะแยกประเภท' },
    ],
    circles: []
  },

  // ── 8. Newborn Room 3: Umbilical Cord Care (14x14m) ──
  newbornCare3: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 2.4, maxSpan: 5.2, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Center Baby Examination Bed at [0, 0, -1.2]
      { minX: -1.02, maxX: 1.02, minZ: -1.78, maxZ: -0.62, name: 'เตียงตรวจเช็ดสายสะดือทารก' },
      // Stainless Steel Dressing Trolley at [-1.65, 0, -1.2]
      { minX: -2.25, maxX: -1.1, minZ: -1.6, maxZ: -0.78, name: 'รถเข็นอุปกรณ์เช็ดสะดือ' },
      // Wheeled Hospital Newborn Bassinet Cart at [1.95, 0, -1.65]
      { minX: 1.38, maxX: 2.52, minZ: -2.05, maxZ: -1.25, name: 'รถเข็นเตียงนอนทารก' },
      // West Wall Sink Counter at [-6.35, 0, -0.1]
      { minX: -6.8, maxX: -5.98, minZ: -1.2, maxZ: 1.0, name: 'เคาน์เตอร์อ่างล้างมือ' },
      // Corner Lounge Sofa at [3.4, 0, -4.6]
      { minX: 2.45, maxX: 4.35, minZ: -5.1, maxZ: -4.05, name: 'โซฟาพักผ่อนมุมห้อง', seatId: 'nb3-lounge-sofa' },
    ],
    circles: [
      { x: 5.5, z: -5.2, radius: 0.55, name: 'ต้นไม้' },
      { x: 0.88, z: -0.22, radius: 0.38, name: 'คุณแม่นั่งชมการสาธิต' },
      { x: -2.33, z: -1.1, radius: 0.28, name: 'ถังขยะติดเชื้อ' },
    ]
  },

  // ── 9. Newborn Room 4: Safe Sleep Environment (14x14m) ──
  newbornCare4: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 2.4, maxSpan: 5.2, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Parent's Bed flush against North wall at [2.42, 0, -5.22]
      { minX: 1.08, maxX: 3.76, minZ: -6.8, maxZ: -3.65, name: 'เตียงผู้ปกครอง' },
      // Nightstand flush against North wall at [4.18, 0, -6.48]
      { minX: 3.82, maxX: 4.54, minZ: -6.8, maxZ: -6.15, name: 'โต๊ะข้างเตียงโคมไฟ' },
      // 1-Tier Baby Co-Sleeper Crib beside Mother's Bed at [0.36, 0, -5.05]
      { minX: -0.14, maxX: 0.86, minZ: -5.75, maxZ: -4.35, name: 'เตียงนอนทารกปลอดภัย 1 ชั้น' },
      // Built-in Wardrobe flush in North-East corner at [5.82, 0, -6.44]
      { minX: 4.85, maxX: 6.8, minZ: -6.8, maxZ: -6.08, name: 'ตู้เสื้อผ้าบิวท์อิน' },
      // Cozy Armchair at [-4.65, 0, -4.45]
      { minX: -5.25, maxX: -4.05, minZ: -5.05, maxZ: -3.85, name: 'เก้าอี้นวมพักผ่อน', seatId: 'nb204_cozy_armchair' },
      // West Wall TV Console at [-6.78, 0, -0.5]
      { minX: -6.8, maxX: -6.0, minZ: -2.2, maxZ: 1.2, name: 'ตู้คอนโซลทีวี' },
    ],
    circles: [
      { x: -3.35, z: -5.2, radius: 0.48, name: 'โต๊ะกลมโคมไฟ' },
      { x: -5.9, z: -5.8, radius: 0.55, name: 'ต้นไม้' },
    ]
  },

  // ── 10. Final Examination & Certification Room (Quiz Room 26x26m) ──
  quiz: {
    bounds: { minX: -12.55, maxX: 12.55, minZ: -12.55, maxZ: 12.55 },
    doorways: [{ wall: 'minX', minSpan: 8.4, maxSpan: 11.2, thresholdLimit: -12.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Examiner / Doctor Desk (Left Wing)
      { minX: -8.8, maxX: -6.2, minZ: -7.5, maxZ: -5.5, name: 'โต๊ะกรรมการสอบ' },
      // Big Digital Exam Screen
      { minX: -4.0, maxX: 4.0, minZ: -10.0, maxZ: -9.5, name: 'บอร์ดข้อสอบดิจิทัล' },
      // Examinee Nursing Chair (where mother sits to take test)
      { minX: -5.3, maxX: -3.7, minZ: -6.3, maxZ: -4.7, name: 'เก้าอี้สอบความรู้', seatId: 'quiz_exam_chair' },
      // Baby Crib beside examinee
      { minX: 5.8, maxX: 7.8, minZ: -5.5, maxZ: -3.5, name: 'เตียงทารกระหว่างสอบ' },
      // Left Waiting Sofa
      { minX: -9.8, maxX: -8.2, minZ: -1.6, maxZ: 1.6, name: 'โซฟารอสอบฝั่งซ้าย', seatId: 'quiz_sofa_left' },
      // Right Waiting Sofa
      { minX: 8.2, maxX: 9.8, minZ: -1.6, maxZ: 1.6, name: 'โซฟารอสอบฝั่งขวา', seatId: 'quiz_sofa_right' },
      // Archive Cabinet
      { minX: 7.2, maxX: 8.3, minZ: -5.8, maxZ: -4.2, name: 'ตู้เก็บประวัติและเกียรติบัตร' },
    ],
    circles: [
      { x: -5.5, z: -9.0, radius: 0.6, name: 'ต้นไม้' },
      { x: 5.5, z: -9.0, radius: 0.6, name: 'ต้นไม้' },
    ]
  },

  // ── 12. Wardrobe & Dressing Suite (18x18m) ──
  dressingRoom: {
    bounds: { minX: -8.0, maxX: 8.0, minZ: -8.0, maxZ: 8.0 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      { minX: -2.0, maxX: 2.0, minZ: -8.0, maxZ: -7.0, name: 'กระจกแต่งตัวเต็มตัว' },
      { minX: -7.8, maxX: -6.0, minZ: -4.0, maxZ: 0.0, name: 'ตู้เสื้อผ้าและลิ้นชัก' },
      { minX: 5.5, maxX: 7.8, minZ: -2.5, maxZ: 0.5, name: 'โซฟานั่งลองชุด' },
    ],
    circles: [
      { x: -6.8, z: -6.8, radius: 0.6, name: 'ต้นไม้' },
      { x: 6.8, z: -6.8, radius: 0.6, name: 'ต้นไม้' },
    ]
  }
};

/**
 * Swept & Sliding Physics Collision Resolver
 *
 * Separately evaluates X and Z movement with substeps.
 * When encountering an obstacle or boundary, cancels velocity along collision normal
 * while smoothly sliding the player along the unobstructed tangential plane.
 *
 * @param {number} currentX - Current X position
 * @param {number} currentZ - Current Z position
 * @param {number} moveX - Desired movement vector X (normalized)
 * @param {number} moveZ - Desired movement vector Z (normalized)
 * @param {number} speed - Movement speed (m/s)
 * @param {number} delta - Frame delta time (seconds)
 * @param {string} roomName - Current room ID
 * @param {object} options - { isSitting, seatedSeatId, isDrivingWheelchair }
 * @returns {{ x: number, z: number, collided: boolean }} - New resolved position
 */
export function resolveMovement(
  currentX,
  currentZ,
  moveX,
  moveZ,
  speed,
  delta,
  roomName = 'lobby',
  options = {}
) {
  const roomData = ROOM_COLLIDERS[roomName] || ROOM_COLLIDERS['lobby'];
  const radius = options.isDrivingWheelchair ? WHEELCHAIR_RADIUS : PLAYER_RADIUS;
  const seatedSeatId = options.seatedSeatId || null;

  // Filter out obstacles that the player is actively sitting on
  const activeBoxes = (roomData.boxes || []).filter(
    (b) => !b.seatId || b.seatId !== seatedSeatId
  );
  const activeCircles = (roomData.circles || []).filter(
    (c) => !c.seatId || c.seatId !== seatedSeatId
  );

  const bounds = roomData.bounds || { minX: -11, maxX: 11, minZ: -11, maxZ: 11 };
  const doorways = roomData.doorways || [];

  // Calculate full intended displacement
  const totalDx = moveX * speed * delta;
  const totalDz = moveZ * speed * delta;
  const totalDist = Math.sqrt(totalDx * totalDx + totalDz * totalDz);

  if (totalDist === 0) {
    return { x: currentX, z: currentZ, collided: false };
  }

  // Adaptive substepping for zero-tunneling high speed / low FPS stability
  const maxStepDist = radius * 0.4;
  const steps = Math.max(1, Math.ceil(totalDist / maxStepDist));
  const subDx = totalDx / steps;
  const subDz = totalDz / steps;

  let px = currentX;
  let pz = currentZ;
  let anyCollision = false;

  for (let s = 0; s < steps; s++) {
    // ── Substep 1: Move X axis alone, resolve collisions (Slide along Z) ──
    let candX = px + subDx;

    // 1a. Room boundary clamp along X with doorway openings
    const minXDoor = doorways.find((d) => d.wall === 'minX' && pz >= d.minSpan && pz <= d.maxSpan);
    const effectiveMinX = minXDoor ? minXDoor.thresholdLimit : bounds.minX;
    if (candX - radius < effectiveMinX) {
      candX = effectiveMinX + radius;
      anyCollision = true;
    }

    const maxXDoor = doorways.find((d) => d.wall === 'maxX' && pz >= d.minSpan && pz <= d.maxSpan);
    const effectiveMaxX = maxXDoor ? maxXDoor.thresholdLimit : bounds.maxX;
    if (candX + radius > effectiveMaxX) {
      candX = effectiveMaxX - radius;
      anyCollision = true;
    }

    // Doorway channel containment along X
    const minZDoor = doorways.find((d) => d.wall === 'minZ' && px >= d.minSpan && px <= d.maxSpan);
    const maxZDoor = doorways.find((d) => d.wall === 'maxZ' && px >= d.minSpan && px <= d.maxSpan);
    if (pz < bounds.minZ && minZDoor) {
      candX = Math.max(minZDoor.minSpan + radius, Math.min(minZDoor.maxSpan - radius, candX));
    } else if (pz > bounds.maxZ && maxZDoor) {
      candX = Math.max(maxZDoor.minSpan + radius, Math.min(maxZDoor.maxSpan - radius, candX));
    }

    // 1b. Check Box Colliders along X
    for (const box of activeBoxes) {
      // Expanded bounding box with player radius
      const bMinX = box.minX - radius;
      const bMaxX = box.maxX + radius;
      const bMinZ = box.minZ - radius;
      const bMaxZ = box.maxZ + radius;

      // If current Z is within box range and candidate X penetrates
      if (pz >= bMinZ && pz <= bMaxZ) {
        if (candX > bMinX && candX < bMaxX) {
          anyCollision = true;
          // Push out to the closest side based on previous position
          if (px <= bMinX) {
            candX = bMinX;
          } else if (px >= bMaxX) {
            candX = bMaxX;
          } else {
            // Penetrating: push out to nearest edge
            candX = (candX - bMinX < bMaxX - candX) ? bMinX : bMaxX;
          }
        }
      }
    }

    // 1c. Check Circle Colliders along X
    for (const circle of activeCircles) {
      const dx = candX - circle.x;
      const dz = pz - circle.z;
      const minDist = radius + circle.radius;
      if (dx * dx + dz * dz < minDist * minDist) {
        anyCollision = true;
        // Project candidate X outside circle at current Z
        const underRad = minDist * minDist - dz * dz;
        if (underRad > 0) {
          const pushDist = Math.sqrt(underRad);
          candX = px <= circle.x ? circle.x - pushDist : circle.x + pushDist;
        }
      }
    }

    px = candX;

    // ── Substep 2: Move Z axis alone, resolve collisions (Slide along X) ──
    let candZ = pz + subDz;

    // 2a. Room boundary clamp along Z with doorway openings
    const activeMinZDoor = doorways.find((d) => d.wall === 'minZ' && px >= d.minSpan && px <= d.maxSpan);
    const effectiveMinZ = activeMinZDoor ? activeMinZDoor.thresholdLimit : bounds.minZ;
    if (candZ - radius < effectiveMinZ) {
      candZ = effectiveMinZ + radius;
      anyCollision = true;
    }

    const activeMaxZDoor = doorways.find((d) => d.wall === 'maxZ' && px >= d.minSpan && px <= d.maxSpan);
    const effectiveMaxZ = activeMaxZDoor ? activeMaxZDoor.thresholdLimit : bounds.maxZ;
    if (candZ + radius > effectiveMaxZ) {
      candZ = effectiveMaxZ - radius;
      anyCollision = true;
    }

    // Doorway channel containment along Z
    const activeMinXDoor = doorways.find((d) => d.wall === 'minX' && pz >= d.minSpan && pz <= d.maxSpan);
    const activeMaxXDoor = doorways.find((d) => d.wall === 'maxX' && pz >= d.minSpan && pz <= d.maxSpan);
    if (px < bounds.minX && activeMinXDoor) {
      candZ = Math.max(activeMinXDoor.minSpan + radius, Math.min(activeMinXDoor.maxSpan - radius, candZ));
    } else if (px > bounds.maxX && activeMaxXDoor) {
      candZ = Math.max(activeMaxXDoor.minSpan + radius, Math.min(activeMaxXDoor.maxSpan - radius, candZ));
    }

    // 2b. Check Box Colliders along Z
    for (const box of activeBoxes) {
      const bMinX = box.minX - radius;
      const bMaxX = box.maxX + radius;
      const bMinZ = box.minZ - radius;
      const bMaxZ = box.maxZ + radius;

      // If current X is within box range and candidate Z penetrates
      if (px >= bMinX && px <= bMaxX) {
        if (candZ > bMinZ && candZ < bMaxZ) {
          anyCollision = true;
          if (pz <= bMinZ) {
            candZ = bMinZ;
          } else if (pz >= bMaxZ) {
            candZ = bMaxZ;
          } else {
            candZ = (candZ - bMinZ < bMaxZ - candZ) ? bMinZ : bMaxZ;
          }
        }
      }
    }

    // 2c. Check Circle Colliders along Z
    for (const circle of activeCircles) {
      const dx = px - circle.x;
      const dz = candZ - circle.z;
      const minDist = radius + circle.radius;
      if (dx * dx + dz * dz < minDist * minDist) {
        anyCollision = true;
        const underRad = minDist * minDist - dx * dx;
        if (underRad > 0) {
          const pushDist = Math.sqrt(underRad);
          candZ = pz <= circle.z ? circle.z - pushDist : circle.z + pushDist;
        }
      }
    }

    pz = candZ;

    // ── Substep 3: Corner radial push (prevents diagonal snagging) ──
    for (const box of activeBoxes) {
      // Find closest point on unexpanded box
      const cx = Math.max(box.minX, Math.min(px, box.maxX));
      const cz = Math.max(box.minZ, Math.min(pz, box.maxZ));
      const distSq = (px - cx) * (px - cx) + (pz - cz) * (pz - cz);
      if (distSq < radius * radius && distSq > 0.0001) {
        anyCollision = true;
        const d = Math.sqrt(distSq);
        const overlap = radius - d;
        px += ((px - cx) / d) * overlap;
        pz += ((pz - cz) / d) * overlap;
      }
    }

    for (const circle of activeCircles) {
      const dx = px - circle.x;
      const dz = pz - circle.z;
      const distSq = dx * dx + dz * dz;
      const minDist = radius + circle.radius;
      if (distSq < minDist * minDist && distSq > 0.0001) {
        anyCollision = true;
        const d = Math.sqrt(distSq);
        const overlap = minDist - d;
        px += (dx / d) * overlap;
        pz += (dz / d) * overlap;
      }
    }
  }

  return {
    x: px,
    z: pz,
    collided: anyCollision,
  };
}
