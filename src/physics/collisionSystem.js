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
      // Hospital Wheelchairs (unoccupied)
      { x: -3.8, z: 3.8, radius: 0.65, name: 'รถเข็น 1', seatId: 'lobby_wheelchair_1' },
      { x: 4.8, z: 3.8, radius: 0.65, name: 'รถเข็น 2', seatId: 'lobby_wheelchair_2' },
    ]
  },

  // ── 2. Ward 101: Postpartum Recovery & Body Care (18x18m) ──
  motherCare1: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Hospital Patient Bed (backed against wall)
      { minX: -5.2, maxX: -2.8, minZ: -7.8, maxZ: -5.2, name: 'เตียงพักฟื้นคุณแม่', seatId: 'room101_bed' },
      // Bedside Nightstand
      { minX: -6.5, maxX: -5.1, minZ: -8.3, maxZ: -6.9, name: 'โต๊ะข้างเตียง' },
      // Newborn Bassinet / Crib (Rooming-in beside bed)
      { minX: -2.8, maxX: -1.2, minZ: -7.3, maxZ: -5.7, name: 'เตียงนอนเด็กแรกเกิด' },
      // Maternal Recovery & Gentle Mobilization Lounge
      { minX: 4.4, maxX: 6.4, minZ: -7.5, maxZ: -5.5, name: 'เก้าอี้พักผ่อนคุณแม่' },
      // Porcelain Sanitary Wash Station (flush against right wall)
      { minX: 7.2, maxX: 8.3, minZ: 1.8, maxZ: 3.2, name: 'อ่างล้างมือปลอดเชื้อ' },
      // Medicine Cabinet
      { minX: 7.4, maxX: 8.3, minZ: -3.0, maxZ: -1.4, name: 'ตู้ยาและเวชภัณฑ์' },
    ],
    circles: [
      { x: -7.5, z: 3.2, radius: 0.65, name: 'รถเข็นผู้ป่วย', seatId: 'ward101_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้ประจำห้อง' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้ปรับอากาศ' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะติดเชื้อ' },
    ]
  },

  // ── 3. Ward 102: Wound Care & Perineal Hygiene (18x18m) ──
  motherCare2: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Examination Bed
      { minX: -5.2, maxX: -2.8, minZ: -7.8, maxZ: -5.2, name: 'เตียงตรวจแผลคุณแม่', seatId: 'room102_bed' },
      // Sterile Wound Care Cart
      { minX: -6.9, maxX: -5.5, minZ: -7.2, maxZ: -5.8, name: 'รถทำแผลปลอดเชื้อ' },
      // Clinical Consultation & REEDA Station
      { minX: 4.4, maxX: 6.4, minZ: -7.3, maxZ: -5.7, name: 'โต๊ะตรวจประเมิน REEDA' },
      // Porcelain Wash Station (flush against right wall)
      { minX: 7.2, maxX: 8.3, minZ: 1.8, maxZ: 3.2, name: 'อ่างล้างมือ' },
      // Medicine Cabinet
      { minX: 7.4, maxX: 8.3, minZ: -3.0, maxZ: -1.4, name: 'ตู้ยาและเวชภัณฑ์ทำแผล' },
    ],
    circles: [
      { x: -7.5, z: 3.2, radius: 0.65, name: 'รถเข็นผู้ป่วย', seatId: 'ward102_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะสำลี' },
    ]
  },

  // ── 4. Ward 103: Breastfeeding & Lactation Support (18x18m) ──
  motherCare3: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Ergonomic Nursing Armchair
      { minX: -4.8, maxX: -3.2, minZ: -7.3, maxZ: -5.7, name: 'เก้าอี้ให้นมบุตร', seatId: 'room103_nursing_chair' },
      // Nightstand
      { minX: -6.5, maxX: -5.1, minZ: -7.9, maxZ: -6.5, name: 'โต๊ะข้างเก้าอี้' },
      // Baby Crib (Rooming-in)
      { minX: -2.8, maxX: -1.2, minZ: -7.3, maxZ: -5.7, name: 'เตียงทารก' },
      // Nursing Mother Rest Sofa
      { minX: 4.4, maxX: 6.4, minZ: -7.5, maxZ: -5.5, name: 'โซฟาพักผ่อนให้นม', seatId: 'room103_sofa' },
      // Medical Cart (Breast pumps)
      { minX: 7.0, maxX: 8.3, minZ: -2.8, maxZ: -1.2, name: 'รถเข็นอุปกรณ์เต้านม' },
      // Consultation Desk
      { minX: 7.0, maxX: 8.3, minZ: 1.7, maxZ: 3.3, name: 'โต๊ะปรึกษาแพทย์' },
    ],
    circles: [
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะ' },
    ]
  },

  // ── 5. Ward 104: Emergency Care & Postpartum Complications (18x18m) ──
  motherCare4: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Emergency Patient Bed with IV Stand
      { minX: -6.6, maxX: -4.2, minZ: -7.2, maxZ: -4.8, name: 'เตียงฉุกเฉินผู้ป่วย', seatId: 'room104_bed' },
      // Bedside Nightstand
      { minX: -8.0, maxX: -6.4, minZ: -7.5, maxZ: -6.1, name: 'โต๊ะข้างเตียง' },
      // Doctor Consultation Desk & Emergency Hotline
      { minX: 7.0, maxX: 8.3, minZ: 1.7, maxZ: 3.3, name: 'โต๊ะแพทย์ฉุกเฉิน' },
      // Medicine Cabinet
      { minX: 7.4, maxX: 8.3, minZ: -3.0, maxZ: -1.4, name: 'ตู้ยาฉุกเฉิน' },
    ],
    circles: [
      { x: -7.5, z: 3.2, radius: 0.65, name: 'รถเข็นฉุกเฉิน', seatId: 'ward104_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.55, name: 'ต้นไม้' },
      { x: 8.3, z: 0.8, radius: 0.45, name: 'ถังขยะติดเชื้อ' },
    ]
  },

  // ── 6. Newborn Room 1: Infant Feeding Technique (18x18m) ──
  newbornCare1: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      { minX: 6.5, maxX: 8.3, minZ: -1.6, maxZ: 1.6, name: 'โซฟาพักผ่อนคุณแม่', seatId: 'newborn1_sofa' },
      { minX: -4.3, maxX: -2.7, minZ: -4.3, maxZ: -2.7, name: 'เก้าอี้ให้นมบุตร', seatId: 'newborn1_nursing_chair' },
      { minX: 2.6, maxX: 4.4, minZ: -4.3, maxZ: -2.7, name: 'เตียงเด็ก' },
      { minX: -6.2, maxX: -4.8, minZ: -4.2, maxZ: -2.8, name: 'โต๊ะวางขวดนม' },
    ],
    circles: [
      { x: 6.0, z: 3.2, radius: 0.55, name: 'ตะกร้าผ้าอ้อม' },
      { x: -5.8, z: 3.5, radius: 0.45, name: 'ถังขยะ' },
      { x: 7.2, z: -7.2, radius: 0.55, name: 'ต้นไม้' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
    ]
  },

  // ── 7. Newborn Room 2: Infant Bathing & Skin Care (18x18m) ──
  newbornCare2: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Central Ergonomic Baby Bathtub
      { minX: -1.8, maxX: 1.8, minZ: -4.5, maxZ: -2.5, name: 'อ่างอาบน้ำทารก' },
      // Washbasin Counter
      { minX: -6.4, maxX: -4.6, minZ: -0.9, maxZ: 0.9, name: 'อ่างล้างมือ' },
      // Baby Skincare & Towel Mobile Cart
      { minX: 4.3, maxX: 6.1, minZ: 0.1, maxZ: 1.9, name: 'รถเข็นผ้าขนหนูและสบู่' },
      // Baby Toiletries Cabinet
      { minX: 7.0, maxX: 8.3, minZ: -3.4, maxZ: -1.6, name: 'ตู้เก็บผลิตภัณฑ์อาบน้ำ' },
      // Laundry Hamper
      { minX: 1.5, maxX: 2.9, minZ: -3.4, maxZ: -1.8, name: 'ตะกร้าผ้าเปียก' },
    ],
    circles: [
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
      { x: 7.2, z: -7.2, radius: 0.55, name: 'ต้นไม้' },
      { x: -5.8, z: 2.5, radius: 0.45, name: 'ถังขยะ' },
    ]
  },

  // ── 8. Newborn Room 3: Diaper Changing & Hygiene (18x18m) ──
  newbornCare3: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Diaper Changing Dresser Counter
      { minX: -1.6, maxX: 1.6, minZ: -4.4, maxZ: -2.6, name: 'เบาะเปลี่ยนผ้าอ้อม' },
      // Washbasin
      { minX: -6.4, maxX: -4.6, minZ: -0.9, maxZ: 0.9, name: 'อ่างทำความสะอาด' },
      // Diaper & Cleanser Cart
      { minX: 4.3, maxX: 6.1, minZ: 0.1, maxZ: 1.9, name: 'รถเข็นผ้าอ้อม' },
      // Cabinet
      { minX: 7.0, maxX: 8.3, minZ: -3.4, maxZ: -1.6, name: 'ตู้สำลีและทิชชู่เปียก' },
      // Soiled Diaper Bin
      { minX: -2.8, maxX: -1.6, minZ: -3.8, maxZ: -2.6, name: 'ถังผ้าอ้อมใช้แล้ว' },
    ],
    circles: [
      { x: 7.2, z: -7.2, radius: 0.55, name: 'ต้นไม้' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
    ]
  },

  // ── 9. Newborn Room 4: Umbilical Cord Care (18x18m) ──
  newbornCare4: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Clinical Examination & Cord Care Table
      { minX: -1.8, maxX: 1.8, minZ: -4.6, maxZ: -2.4, name: 'เตียงตรวจสายสะดือ' },
      // Washbasin
      { minX: -6.4, maxX: -4.6, minZ: -0.9, maxZ: 0.9, name: 'อ่างล้างมือสเตอร์ไรล์' },
      // Alcohol 70% & Sterile Gauze Mobile Cart
      { minX: 2.9, maxX: 4.7, minZ: -4.0, maxZ: -2.4, name: 'รถเข็นแอลกอฮอล์เช็ดสะดือ' },
      // Sterile Supplies Cabinet
      { minX: 7.0, maxX: 8.3, minZ: -3.4, maxZ: -1.6, name: 'ตู้เวชภัณฑ์สเตอร์ไรล์' },
    ],
    circles: [
      { x: 2.5, z: -3.2, radius: 0.45, name: 'ถังขยะติดเชื้อ' },
      { x: 7.2, z: -7.2, radius: 0.55, name: 'ต้นไม้' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
    ]
  },

  // ── 10. Newborn Room 5: Safe Sleep & Nursery Environment (18x18m) ──
  newbornCare5: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Safe Nursery Crib (Firm mattress, no loose pillows)
      { minX: -1.6, maxX: 1.6, minZ: -4.5, maxZ: -2.5, name: 'เตียงนอนปลอดภัยทารก' },
      // Nursing Chair
      { minX: -5.8, maxX: -4.2, minZ: -0.8, maxZ: 0.8, name: 'เก้าอี้คุณแม่' },
      // Bedside Table
      { minX: -5.8, maxX: -4.2, minZ: 1.7, maxZ: 3.3, name: 'โต๊ะข้างเตียง' },
      // Steel Shelves (Child safety locks)
      { minX: 6.8, maxX: 8.3, minZ: -3.0, maxZ: -0.6, name: 'ชั้นวางของความปลอดภัย' },
    ],
    circles: [
      { x: 6.0, z: 2.8, radius: 0.55, name: 'ตะกร้าผ้า' },
      { x: -5.8, z: 3.2, radius: 0.45, name: 'ถังขยะ' },
      { x: 7.2, z: -7.2, radius: 0.55, name: 'ต้นไม้' },
      { x: -7.5, z: 6.5, radius: 0.55, name: 'ต้นไม้' },
    ]
  },

  // ── 11. Final Examination & Certification Room (Quiz Room) ──
  quiz: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
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
