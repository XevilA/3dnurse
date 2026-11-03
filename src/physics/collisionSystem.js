/**
 * Realistic Kinematic Physics & Collision System for 3D Nurse Learning Metaverse
 *
 * Implements:
 * 1. Continuous Substepped Circle-vs-AABB, Circle-vs-OBB (Rotated Furniture), & Circle-vs-Circle Solver
 * 2. Smooth Rounded-Corner Gliding & Frictionless Wall/Furniture Sliding (zero invisible square AABB corners)
 * 3. Tight Mesh-Fitted Humanoid (r = 0.26m) & Wheelchair (r = 0.46m) Colliders across all 11 rooms
 * 4. Shortest-Axis Depenetration & Clean Seat Stand-Up Dismount Positioning
 * 5. Dynamic seat deactivation when seated on specific furniture
 */

// Player physical dimensions (matched tightly to 3D avatar torso/dress & wheelchair width)
export const PLAYER_RADIUS = 0.26;       // Walking character collision radius in meters (52cm body width)
export const WHEELCHAIR_RADIUS = 0.46;   // Wheelchair driving collision radius in meters (92cm width)

// Comprehensive Collider Registry for all rooms (100% matched to actual 3D visual meshes)
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
      // Nurse Station Backdrop & Flanking Welcome Poster Feature Wall (z ≈ -5.20)
      { minX: -7.10, maxX: 7.10, minZ: -5.38, maxZ: -5.02, name: 'ผนังฉากหลังเคาน์เตอร์พยาบาล' },
      // White Rose Planter Box below Directional Wall Signs on South-West Wall
      { minX: -7.45, maxX: -4.85, minZ: 10.02, maxZ: 10.55, name: 'กระบะดอกกุหลาบป้ายบอกทาง' },
    ],
    obbs: [
      // Right Waiting Lounge Modular Sofa + Integrated Planter ([3.4, 0, 0.2], rotY = -0.45π, scale = 1.05, layout = 'right')
      { x: 3.356, z: -0.08, halfW: 1.58, halfD: 0.45, rotY: -Math.PI * 0.45, name: 'โซฟารอรับบริการ ด้านหน้าขวา', seatId: 'lobby_lounge_right' },
      { x: 2.896, z: 1.853, halfW: 0.45, halfD: 0.68, rotY: -Math.PI * 0.45, name: 'โซฟาตัวแอล ด้านหน้าขวา', seatId: 'lobby_lounge_right' },
      // Left Waiting Lounge Modular Sofa + Integrated Planter ([-3.8, 0, 0.4], rotY = +0.45π, scale = 1.05, layout = 'left')
      { x: -3.844, z: 0.68, halfW: 1.58, halfD: 0.45, rotY: Math.PI * 0.45, name: 'โซฟารอรับบริการ ด้านซ้าย', seatId: 'lobby_lounge_left' },
      // South Panoramic Garden Waiting Lounge ([3.2, 0, 7.6], rotY = π, scale = 0.98, layout = 'right')
      { x: 3.465, z: 7.60, halfW: 1.48, halfD: 0.42, rotY: Math.PI, name: 'โซฟาพักผ่อนชมสวนธรรมชาติบำบัด', seatId: 'lobby_garden_sofa' },
      { x: 1.75, z: 6.894, halfW: 0.42, halfD: 0.63, rotY: Math.PI, name: 'โซฟาตัวแอลชมสวน', seatId: 'lobby_garden_sofa' },
    ],
    circles: [
      // Curved Fluted Oak Nurse Reception Counter (centered at [0, -3.552], top radius = 2.75 * 1.08 = 2.97 -> tight 2.88)
      { x: 0, z: -3.55, radius: 2.88, name: 'เคาน์เตอร์พยาบาลส่วนกลาง' },
      // Round Oak Coffee Tables in front of the 3 Waiting Lounge Sofas
      { x: 1.954, z: 0.801, radius: 0.47, name: 'โต๊ะกลางโซฟาฝั่งขวา' },
      { x: -2.329, z: 0.846, radius: 0.47, name: 'โต๊ะกลางโซฟาฝั่งซ้าย' },
      { x: 2.857, z: 6.179, radius: 0.44, name: 'โต๊ะกลางโซฟาชมสวน' },
      // 4 Real Hospital Corner Trees (trunk/planter radius)
      { x: -9.6, z: -9.6, radius: 0.55, name: 'ต้นไม้ล็อบบี้ 1' },
      { x: 9.6, z: -9.6, radius: 0.55, name: 'ต้นไม้ล็อบบี้ 2' },
      { x: -9.6, z: 9.6, radius: 0.55, name: 'ต้นไม้ล็อบบี้ 3' },
      { x: 9.6, z: 9.6, radius: 0.55, name: 'ต้นไม้ล็อบบี้ 4' },
      // Potted Plants
      { x: -4.8, z: -6.2, radius: 0.38, name: 'กระถางต้นไม้ซ้าย' },
      { x: 4.8, z: -6.2, radius: 0.38, name: 'กระถางต้นไม้ขวา' },
      { x: -10.1, z: 0.78, radius: 0.30, name: 'กระถางต้นไม้ริมผนังซ้าย' },
      { x: 10.1, z: 0.78, radius: 0.30, name: 'กระถางต้นไม้ริมผนังขวา' },
      // Hospital Wheelchairs (parked snugly in South-West & South-East corners)
      { x: -9.1, z: 8.1, radius: 0.50, name: 'รถเข็น 1', seatId: 'lobby_wheelchair_1' },
      { x: 8.05, z: 9.15, radius: 0.50, name: 'รถเข็น 2', seatId: 'lobby_wheelchair_2' },
    ],
  },

  // ── 2. Ward 101: Postpartum Recovery & Body Care (18x18m) ──
  motherCare1: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Hospital Patient Bed pushed flush against North wall at [-5.35, 0, -7.56]
      { minX: -6.08, maxX: -4.62, minZ: -8.55, maxZ: -6.38, name: 'เตียงพักฟื้นคุณแม่', seatId: 'room101_bed' },
      // Bedside Nightstand flush against North wall at [-7.05, 0, -8.32]
      { minX: -7.50, maxX: -6.60, minZ: -8.55, maxZ: -7.82, name: 'โต๊ะข้างเตียง' },
      // Newborn Bassinet / Crib flush against North wall beside bed at [-3.70, 0, -7.90]
      { minX: -4.30, maxX: -3.10, minZ: -8.55, maxZ: -7.30, name: 'เตียงนอนเด็กแรกเกิด' },
      // Side Table beside Recovery Chair at [4.0, 0, -6.8]
      { minX: 3.70, maxX: 4.30, minZ: -7.10, maxZ: -6.50, name: 'โต๊ะวางถาดอาหารและน้ำดื่ม' },
      // Porcelain Sanitary Wash Station (flush against right wall at [8.3, 0, 2.5])
      { minX: 7.75, maxX: 8.55, minZ: 1.90, maxZ: 3.10, name: 'อ่างล้างมือปลอดเชื้อ' },
      // Medicine Cabinet at [8.4, 0, -2.2]
      { minX: 7.85, maxX: 8.55, minZ: -2.92, maxZ: -1.48, name: 'ตู้ยาและเวชภัณฑ์' },
      // LoungeCorner Sofa at [7.4, 0, 6.2] rotated -π/2 (exact sofa footprint, rug & walkway left 100% open!)
      { minX: 6.94, maxX: 8.55, minZ: 4.72, maxZ: 7.68, name: 'โซฟามุมพักผ่อน' },
      // LoungeCorner Oak Bookshelf (local [-2.25, -0.26] rotated -π/2 -> world x: 7.44..7.89, z: 3.25..4.65)
      { minX: 7.44, maxX: 8.55, minZ: 3.25, maxZ: 4.65, name: 'ชั้นหนังสือคู่มือสุขภาพ' },
    ],
    obbs: [
      // Maternal Recovery Chair at [5.4, 0, -6.5] rotated -π/6
      { x: 5.4, z: -6.5, halfW: 0.44, halfD: 0.44, rotY: -Math.PI / 6, name: 'เก้าอี้พักผ่อนคุณแม่' },
    ],
    circles: [
      // LoungeCorner Round Oak Coffee Table (local [0, 1.55] -> world [5.85, 6.20], r = 0.54)
      { x: 5.85, z: 6.20, radius: 0.53, name: 'โต๊ะกลางมุมพักผ่อน' },
      { x: -7.5, z: 3.2, radius: 0.50, name: 'รถเข็นผู้ป่วย', seatId: 'ward101_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.36, name: 'ต้นไม้ประจำห้อง' },
      { x: -7.85, z: 7.95, radius: 0.34, name: 'ต้นไม้ปรับอากาศ' },
      { x: 8.3, z: 0.8, radius: 0.30, name: 'ถังขยะติดเชื้อ' },
      // Round Dining Table at [1.5, 1.5] (tabletop r = 1.38) + 4 Dining Chairs at r = 1.72
      { x: 1.5, z: 1.5, radius: 1.36, name: 'โต๊ะอาหาร' },
      { x: 3.08, z: 2.17, radius: 0.27, name: 'เก้าอี้โต๊ะอาหาร 1' },
      { x: 0.78, z: 3.06, radius: 0.27, name: 'เก้าอี้โต๊ะอาหาร 2' },
      { x: -0.08, z: 0.82, radius: 0.27, name: 'เก้าอี้โต๊ะอาหาร 3' },
      { x: 2.15, z: -0.09, radius: 0.30, name: 'คุณแม่นั่งรับประทานอาหาร' },
    ],
  },

  // ── 3. Ward 102: Wound Care & Perineal Hygiene (18x18m) ──
  motherCare2: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 4.4, maxSpan: 7.2, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Examination Bed at [-5.4, 0, -6.0]
      { minX: -6.15, maxX: -4.65, minZ: -7.10, maxZ: -4.90, name: 'เตียงตรวจแผลคุณแม่', seatId: 'room102_bed' },
      // Sterile Wound Care Cart at [-7.2, 0, -6.5]
      { minX: -7.68, maxX: -6.72, minZ: -6.95, maxZ: -6.05, name: 'รถทำแผลปลอดเชื้อ' },
      // Porcelain Wash Station at [8.3, 0, 2.5]
      { minX: 7.75, maxX: 8.55, minZ: 1.90, maxZ: 3.10, name: 'อ่างล้างมือ' },
      // Medicine Cabinet at [8.4, 0, -2.2]
      { minX: 7.85, maxX: 8.55, minZ: -2.92, maxZ: -1.48, name: 'ตู้ยาและเวชภัณฑ์ทำแผล' },
      // LoungeCorner Sofa at [7.4, 0, 6.2] rotated -π/2 (exact sofa footprint)
      { minX: 6.94, maxX: 8.55, minZ: 4.72, maxZ: 7.68, name: 'โซฟามุมพักผ่อน' },
      // LoungeCorner Oak Bookshelf
      { minX: 7.44, maxX: 8.55, minZ: 3.25, maxZ: 4.65, name: 'ชั้นหนังสือคู่มือสุขภาพ' },
      // CareBooth at [2.0, 0, 1.0] (2.9m wide x 0.9m deep table + back frame)
      { minX: 0.52, maxX: 3.48, minZ: 0.35, maxZ: 1.50, name: 'บูทดูแลแผลฝีเย็บ' },
    ],
    obbs: [
      // Clinical Consultation & REEDA Station Desk at [5.4, 0, -6.5] rotated -π/6
      { x: 5.4, z: -6.5, halfW: 0.78, halfD: 0.44, rotY: -Math.PI / 6, name: 'โต๊ะตรวจประเมิน REEDA' },
    ],
    circles: [
      // LoungeCorner Round Oak Coffee Table
      { x: 5.85, z: 6.20, radius: 0.53, name: 'โต๊ะกลางมุมพักผ่อน' },
      { x: -7.5, z: 3.2, radius: 0.50, name: 'รถเข็นผู้ป่วย', seatId: 'ward102_wheelchair' },
      { x: 7.5, z: -7.5, radius: 0.36, name: 'ต้นไม้' },
      { x: 8.3, z: 0.8, radius: 0.30, name: 'ถังขยะสำลี' },
    ],
  },

  // ── 4. Ward 103: Breastfeeding & Lactation Support (18x18m — Cozy Sectional Sofa Layout) ──
  motherCare3: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 5.25, maxSpan: 8.05, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Cozy L-Shaped Sectional Sofa Main Body at [0, 0, -0.2] (exact 3.52m outer armrests x 0.98m depth)
      { minX: -1.76, maxX: 1.76, minZ: -0.71, maxZ: 0.28, name: 'โซฟาฝึกนวดเต้านม', seatId: 'room103_practice_sofa' },
      // Chaise Lounge Extension on Left of Sofa (exact 1.12m x 1.92m at local [-1.08, 0.48])
      { minX: -1.64, maxX: -0.52, minZ: -0.68, maxZ: 1.23, name: 'โซฟาตัวแอลฝั่งซ้าย', seatId: 'room103_practice_sofa' },
    ],
    obbs: [
      // Low Oak Credenza behind Sofa at [3.6, 0, -2.2] rotated -0.25 rad (1.70m x 0.56m)
      { x: 3.6, z: -2.2, halfW: 0.84, halfD: 0.28, rotY: -0.25, name: 'ตู้ไม้ประดับโคมไฟอุ่น' },
    ],
    circles: [
      // Round White & Oak Coffee Table at [0.80, 1.56] (exact 0.68m tabletop -> 0.66m collider, leaving 0.62m clear aisle!)
      { x: 0.80, z: 1.56, radius: 0.66, name: 'โต๊ะกลางวางแท็บเล็ตสื่อการสอน' },
      // Cable-Knit Pouf Ottoman at [-1.08, 1.80] (exact 0.37m visual radius)
      { x: -1.08, z: 1.80, radius: 0.35, name: 'สตูลพรมถัก' },
      // Individual props on Left-Front Rug [-6.0, 4.42] (moved clear of West Wall posters; flat rug is walkable!)
      { x: -5.80, z: 4.27, radius: 0.25, name: 'ตะกร้าหวายใส่ผ้าห่ม' },
      { x: -6.48, z: 4.68, radius: 0.26, name: 'กระถางต้นไม้ข้างพรม' },
      // Corner Potted Plants (tight pot radii)
      { x: -7.6, z: -7.2, radius: 0.35, name: 'ต้นไม้ประดับมุมซ้าย' },
      { x: 7.6, z: -7.2, radius: 0.35, name: 'ต้นไม้ประดับมุมขวา' },
      { x: 7.5, z: 6.8, radius: 0.32, name: 'ต้นไม้ฟอกอากาศ' },
    ],
  },

  // ── 5. Ward 104: Postpartum Complications & Danger Signs (18x18m — Cozy Sectional Sofa Layout) ──
  motherCare4: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'minX', minSpan: 5.35, maxSpan: 8.15, thresholdLimit: -8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Cozy L-Shaped Sectional Sofa Main Body at [0, 0, -0.2]
      { minX: -1.76, maxX: 1.76, minZ: -0.71, maxZ: 0.28, name: 'โซฟาเรียนรู้สัญญาณอันตราย', seatId: 'room104_sofa' },
      // Chaise Lounge Extension on Left of Sofa
      { minX: -1.64, maxX: -0.52, minZ: -0.68, maxZ: 1.23, name: 'โซฟาตัวแอลฝั่งซ้าย', seatId: 'room104_sofa' },
    ],
    obbs: [
      // Low Oak Credenza behind Sofa at [3.6, 0, -2.2] rotated -0.25 rad
      { x: 3.6, z: -2.2, halfW: 0.84, halfD: 0.28, rotY: -0.25, name: 'ตู้ไม้ประดับโคมไฟอุ่น' },
    ],
    circles: [
      { x: 0.80, z: 1.56, radius: 0.66, name: 'โต๊ะกลางวางแท็บเล็ตจำแนกอาการ' },
      { x: -1.08, z: 1.80, radius: 0.35, name: 'สตูลพรมถัก' },
      { x: -5.80, z: 4.27, radius: 0.25, name: 'ตะกร้าหวายใส่ผ้าห่ม' },
      { x: -6.48, z: 4.68, radius: 0.26, name: 'กระถางต้นไม้ข้างพรม' },
      { x: -7.6, z: -7.2, radius: 0.35, name: 'ต้นไม้ประดับมุมซ้าย' },
      { x: 7.6, z: -7.2, radius: 0.35, name: 'ต้นไม้ประดับมุมขวา' },
      { x: 7.5, z: 6.8, radius: 0.32, name: 'ต้นไม้ฟอกอากาศ' },
    ],
  },

  // ── 6. Newborn Room 1: Infant Feeding Technique (14x14m) ──
  newbornCare1: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 4.0, maxSpan: 6.5, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Classic Wooden Baby Crib at [0.4, 0, -5.2] (1.50m x 0.95m) & Nightstand at [-1.2, 0, -5.2]
      { minX: -0.36, maxX: 1.16, minZ: -5.68, maxZ: -4.72, name: 'เตียงนอนทารก' },
      { minX: -1.48, maxX: -0.92, minZ: -5.48, maxZ: -4.92, name: 'โต๊ะข้างเตียงทารก' },
      // Nursing Sofa at [-1.1, 0, -1.6] rotated -π/2 (exact 0.84m depth x 1.50m width -> leaves 0.90m clear aisle!)
      { minX: -1.44, maxX: -0.60, minZ: -2.35, maxZ: -0.85, name: 'เก้าอี้โซฟาให้นมทารก', seatId: 'nb1-nursing-sofa' },
      // Low Wooden Coffee Table at [-2.8, 0, -1.6] rotated -π/2 (exact 0.92m x 1.55m)
      { minX: -3.26, maxX: -2.34, minZ: -2.37, maxZ: -0.83, name: 'โต๊ะวางอุปกรณ์เก็บน้ำนมแม่' },
      // South-East Nursery Dresser flush against East Wall at [6.50, 0, 4.75]
      { minX: 6.13, maxX: 6.55, minZ: 3.95, maxZ: 5.55, name: 'โต๊ะของใช้ทารก' },
      // South Wall: Breastmilk Fridge (x=-0.60), Kettle Table (x=0.75), Handwashing Sink (x=2.15) at z=6.47..6.54
      { minX: -1.06, maxX: 2.73, minZ: 6.07, maxZ: 6.55, name: 'ตู้เย็นเก็บน้ำนม โต๊ะน้ำร้อน และอ่างล้างมือ' },
    ],
    circles: [
      { x: 5.95, z: -5.95, radius: 0.32, name: 'แจกันดอกไม้มุมห้อง' },
      { x: 3.05, z: 6.45, radius: 0.25, name: 'ถังขยะข้างอ่างล้างมือ' },
    ],
  },

  // ── 7. Newborn Room 2: Infant Bathing & Skin Care (13x13m) ──
  newbornCare2: {
    bounds: { minX: -6.05, maxX: 6.05, minZ: -6.05, maxZ: 6.05 },
    doorways: [{ wall: 'minX', minSpan: 2.5, maxSpan: 5.1, thresholdLimit: -6.38, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Baby Crib at North Wall [1.1, 0, -4.8]
      { minX: 0.34, maxX: 1.86, minZ: -5.28, maxZ: -4.32, name: 'เตียงนอนทารก' },
      // Mission Desk at [4.6, 0, -4.8]
      { minX: 4.00, maxX: 5.20, minZ: -5.20, maxZ: -4.40, name: 'โต๊ะภารกิจ' },
      // Mother's TV Sofa at [-3.3, 0, -2.8] rotated -π/2 (exact 0.84m x 1.36m)
      { minX: -3.64, maxX: -2.80, minZ: -3.48, maxZ: -2.12, name: 'โซฟาพักผ่อนชม TV ให้ความรู้', seatId: 'nb2-mother-sofa' },
      // Central Ergonomic Baby Bathing Table at [0.2, 0, -0.4]
      { minX: -1.40, maxX: 2.10, minZ: -1.00, maxZ: 0.20, name: 'โต๊ะอ่างอาบน้ำทารก' },
      // East Wall Decor Bookcase at [6.16, 0, 4.65]
      { minX: 5.90, maxX: 6.05, minZ: 3.62, maxZ: 5.68, name: 'ชั้นตกแต่งสวยงามสำหรับทารก' },
      // South Wall Baby Supplies Cabinet at [4.95, 0, 6.16]
      { minX: 4.02, maxX: 5.88, minZ: 5.90, maxZ: 6.05, name: 'ตู้ของใช้ทารก' },
      // South Wall Handwashing Sink [-3.6, 0, 5.5] & Cotton/NSS Table [-1.95, 0, 5.5]
      { minX: -4.20, maxX: -1.40, minZ: 5.15, maxZ: 6.05, name: 'อ่างล้างมือและโต๊ะเตรียมสำลีเช็ดตา' },
      // West Wall 2 Small Trash Bins at [-6.08, 0, 0.85]
      { minX: -6.05, maxX: -5.84, minZ: 0.38, maxZ: 1.32, name: 'ถังขยะแยกประเภท' },
    ],
    circles: [],
  },

  // ── 8. Newborn Room 3: Umbilical Cord Care (14x14m) ──
  newbornCare3: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 2.4, maxSpan: 5.2, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Center Baby Examination Bed at [0, 0, -1.2] (1.94m x 1.04m)
      { minX: -0.97, maxX: 0.97, minZ: -1.72, maxZ: -0.68, name: 'เตียงตรวจเช็ดสายสะดือทารก' },
      // Stainless Steel Dressing Trolley at [-1.65, 0, -1.2] (1.05m x 0.66m)
      { minX: -2.17, maxX: -1.13, minZ: -1.53, maxZ: -0.87, name: 'รถเข็นอุปกรณ์เช็ดสะดือ' },
      // West Wall Sink Counter at [-6.35, 0, -0.1] (0.66m x 2.16m)
      { minX: -6.80, maxX: -6.02, minZ: -1.18, maxZ: 0.98, name: 'เคาน์เตอร์อ่างล้างมือ' },
    ],
    obbs: [
      // Corner Lounge Sofa at [3.4, 0, -4.6] rotated -0.25 rad (exact 1.82m x 0.86m)
      { x: 3.4, z: -4.6, halfW: 0.91, halfD: 0.43, rotY: -0.25, name: 'โซฟาพักผ่อนมุมห้อง', seatId: 'nb3-lounge-sofa' },
      // Wheeled Hospital Newborn Bassinet Cart at [1.95, 0, -1.65] rotated -0.28 rad
      { x: 1.95, z: -1.65, halfW: 0.50, halfD: 0.34, rotY: -0.28, name: 'รถเข็นเตียงนอนทารก' },
    ],
    circles: [
      // Round Oak Coffee Table in front of Corner Sofa at [3.18, -3.15] (exact 0.48m tabletop)
      { x: 3.18, z: -3.15, radius: 0.46, name: 'โต๊ะกลางหน้าโซฟา' },
      { x: 5.5, z: -5.2, radius: 0.36, name: 'ต้นไม้' },
      { x: 0.0, z: -2.05, radius: 0.26, name: 'คุณพยาบาลสาธิต' },
      { x: 0.88, z: -0.22, radius: 0.32, name: 'คุณแม่นั่งชมการสาธิต' },
      { x: -2.33, z: -1.1, radius: 0.21, name: 'ถังขยะติดเชื้อ' },
    ],
  },

  // ── 9. Newborn Room 4: Safe Sleep Environment (14x14m) ──
  newbornCare4: {
    bounds: { minX: -6.55, maxX: 6.55, minZ: -6.55, maxZ: 6.55 },
    doorways: [{ wall: 'minX', minSpan: 2.85, maxSpan: 5.65, thresholdLimit: -6.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Parent's Bed flush against North wall at [2.42, 0, -5.22] (2.6m x 3.1m)
      { minX: 1.12, maxX: 3.72, minZ: -6.80, maxZ: -3.67, name: 'เตียงผู้ปกครอง' },
      // Nightstand flush against North wall at [4.18, 0, -6.48]
      { minX: 3.84, maxX: 4.52, minZ: -6.80, maxZ: -6.18, name: 'โต๊ะข้างเตียงโคมไฟ' },
      // 1-Tier Baby Co-Sleeper Crib beside Mother's Bed at [0.36, 0, -5.05] (0.94m x 1.32m)
      { minX: -0.11, maxX: 0.83, minZ: -5.71, maxZ: -4.39, name: 'เตียงนอนทารกปลอดภัย 1 ชั้น' },
      // Built-in Wardrobe flush in North-East corner at [5.82, 0, -6.44]
      { minX: 4.87, maxX: 6.80, minZ: -6.80, maxZ: -6.10, name: 'ตู้เสื้อผ้าบิวท์อิน' },
      // West Wall TV Console at [-6.78, 0, -0.5]
      { minX: -6.80, maxX: -6.08, minZ: -2.15, maxZ: 1.15, name: 'ตู้คอนโซลทีวี' },
      // Open 2-Column Baby Supply Wardrobe flush against West Wall at [-6.78, 0, -3.45] (1.76m wide x 0.54m deep)
      { minX: -6.80, maxX: -6.22, minZ: -4.35, maxZ: -2.55, name: 'ตู้ของใช้ทารก' },
    ],
    obbs: [
      // Cozy Armchair at [-4.65, 0, -4.45] rotated +π/4 (exact 1.02m x 0.90m)
      { x: -4.65, z: -4.45, halfW: 0.51, halfD: 0.45, rotY: Math.PI / 4, name: 'เก้าอี้นวมพักผ่อน', seatId: 'nb204_cozy_armchair' },
    ],
    circles: [
      { x: -3.35, z: -5.2, radius: 0.41, name: 'โต๊ะกลมโคมไฟ' },
      { x: -5.9, z: -5.8, radius: 0.35, name: 'ต้นไม้' },
    ],
  },

  // ── 10. Final Examination & Certification Room (Quiz Room 26x26m) ──
  quiz: {
    bounds: { minX: -12.55, maxX: 12.55, minZ: -12.55, maxZ: 12.55 },
    doorways: [{ wall: 'minX', minSpan: 8.4, maxSpan: 11.2, thresholdLimit: -12.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      // Big Digital Exam Screen at [0, 2.35, -9.8] (5.8m x 0.16m)
      { minX: -2.90, maxX: 2.90, minZ: -9.90, maxZ: -9.70, name: 'บอร์ดข้อสอบดิจิทัล' },
      // Left Waiting Velvet Sofa at [-9.2, 0, 0] rotated +π/2 (exact sofa_velvet.glb * 1.2075)
      { minX: -9.96, maxX: -8.72, minZ: -1.32, maxZ: 1.32, name: 'โซฟารอสอบฝั่งซ้าย', seatId: 'quiz_sofa_left' },
      // Right Waiting Velvet Sofa at [9.2, 0, 0] rotated -π/2
      { minX: 8.72, maxX: 9.96, minZ: -1.32, maxZ: 1.32, name: 'โซฟารอสอบฝั่งขวา', seatId: 'quiz_sofa_right' },
      // Archive Cabinet at [10.2, 0, -5.0] rotated -π/2
      { minX: 9.75, maxX: 10.65, minZ: -5.75, maxZ: -4.25, name: 'ตู้เก็บประวัติและเกียรติบัตร' },
    ],
    obbs: [
      // Examiner / Doctor Desk at [-7.5, 0, -6.5] rotated +π/6 (scale 1.15)
      { x: -7.5, z: -6.5, halfW: 1.05, halfD: 0.55, rotY: Math.PI / 6, name: 'โต๊ะกรรมการสอบ' },
      // Examinee Nursing Chair at [-4.5, 0, -5.5] rotated 0.35 rad
      { x: -4.5, z: -5.5, halfW: 0.43, halfD: 0.43, rotY: 0.35, name: 'เก้าอี้สอบความรู้', seatId: 'quiz_exam_chair' },
      // Baby Bassinet beside Examinee at [6.8, 0, -4.5] rotated -0.4 rad (scale 0.9)
      { x: 6.8, z: -4.5, halfW: 0.62, halfD: 0.42, rotY: -0.4, name: 'เตียงทารกระหว่างสอบ' },
    ],
    circles: [
      { x: -10.5, z: -10.0, radius: 0.48, name: 'ต้นไม้ใหญ่ซ้าย' },
      { x: 10.5, z: -10.0, radius: 0.48, name: 'ต้นไม้ใหญ่ขวา' },
      { x: -5.5, z: -9.0, radius: 0.36, name: 'ต้นไม้ซ้าย' },
      { x: 5.5, z: -9.0, radius: 0.36, name: 'ต้นไม้ขวา' },
    ],
  },

  // ── 11. Wardrobe & Dressing Suite (18x18m) ──
  dressingRoom: {
    bounds: { minX: -8.55, maxX: 8.55, minZ: -8.55, maxZ: 8.55 },
    doorways: [{ wall: 'maxZ', minSpan: -1.4, maxSpan: 1.4, thresholdLimit: 8.88, name: 'ประตูทางออกสู่โถงกลาง' }],
    boxes: [
      { minX: -1.65, maxX: 1.65, minZ: -7.90, maxZ: -7.70, name: 'กระจกแต่งตัวเต็มตัว' },
      { minX: -7.65, maxX: -6.75, minZ: -4.75, maxZ: -0.25, name: 'ตู้เสื้อผ้าและลิ้นชัก' },
      { minX: 6.32, maxX: 7.56, minZ: -2.35, maxZ: 0.35, name: 'โซฟานั่งลองชุด' },
    ],
    circles: [
      { x: 0, z: 0, radius: 1.75, name: 'แท่นหมุนโชว์ตัวละคร' },
      { x: -6.8, z: -6.8, radius: 0.40, name: 'ต้นไม้' },
      { x: 6.8, z: -6.8, radius: 0.40, name: 'ต้นไม้' },
    ],
  },
};

/**
 * Closest-point Circle vs Local Box [-hw..hw, -hd..hd] resolver.
 * - Eliminates 100% of phantom square AABB corners (collides ONLY against the true rounded corners & faces).
 * - Preserves full tangential velocity along flat faces (frictionless wall/sofa sliding).
 * - If circle center is strictly inside the box, pushes out along the single shortest face distance.
 */
function resolveCircleVsLocalBox(lx, lz, hw, hd, radius) {
  const cx = Math.max(-hw, Math.min(lx, hw));
  const cz = Math.max(-hd, Math.min(lz, hd));
  const ex = lx - cx;
  const ez = lz - cz;
  const distSq = ex * ex + ez * ez;

  if (distSq >= radius * radius) {
    return null;
  }

  if (distSq > 1e-8) {
    const dist = Math.sqrt(distSq);
    const overlap = radius - dist;
    return {
      lx: lx + (ex / dist) * overlap,
      lz: lz + (ez / dist) * overlap,
    };
  }

  // Center is strictly inside [-hw..hw, -hd..hd]: push out to the single nearest face
  const dLeft = lx + hw;
  const dRight = hw - lx;
  const dBack = lz + hd;
  const dFront = hd - lz;
  const minFace = Math.min(dLeft, dRight, dBack, dFront);

  if (minFace === dLeft) return { lx: -hw - radius, lz };
  if (minFace === dRight) return { lx: hw + radius, lz };
  if (minFace === dBack) return { lx, lz: -hd - radius };
  return { lx, lz: hd + radius };
}

/**
 * Runs one multi-pass constraint projection at (px, pz) against active boxes, OBBs, circles, and room walls/doorways.
 */
function projectConstraints(px, pz, radius, activeBoxes, activeObbs, activeCircles, bounds, doorways, iterations = 3) {
  let x = px;
  let z = pz;
  let collided = false;

  for (let iter = 0; iter < iterations; iter++) {
    // 1. Axis-Aligned Boxes (Circle vs AABB)
    for (const box of activeBoxes) {
      const ox = (box.minX + box.maxX) * 0.5;
      const oz = (box.minZ + box.maxZ) * 0.5;
      const hw = (box.maxX - box.minX) * 0.5;
      const hd = (box.maxZ - box.minZ) * 0.5;
      const res = resolveCircleVsLocalBox(x - ox, z - oz, hw, hd, radius);
      if (res) {
        x = ox + res.lx;
        z = oz + res.lz;
        collided = true;
      }
    }

    // 2. Oriented Bounding Boxes (Circle vs Rotated Sofa/Desk/Chair OBB)
    for (const obb of activeObbs) {
      const rot = obb.rotY || 0;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const dx = x - obb.x;
      const dz = z - obb.z;
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      const res = resolveCircleVsLocalBox(lx, lz, obb.halfW, obb.halfD, radius);
      if (res) {
        x = obb.x + res.lx * cos + res.lz * sin;
        z = obb.z - res.lx * sin + res.lz * cos;
        collided = true;
      }
    }

    // 3. Circle Colliders (Tables, Poufs, Plants, Wheelchairs)
    for (const circle of activeCircles) {
      const dx = x - circle.x;
      const dz = z - circle.z;
      const minDist = radius + circle.radius;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDist * minDist) {
        collided = true;
        if (distSq > 1e-8) {
          const dist = Math.sqrt(distSq);
          const overlap = minDist - dist;
          x += (dx / dist) * overlap;
          z += (dz / dist) * overlap;
        } else {
          z += minDist;
        }
      }
    }

    // 4. Room Perimeter Walls & Walkable Doorway Recesses
    const minXDoor = doorways.find((d) => d.wall === 'minX' && z >= d.minSpan + radius * 0.4 && z <= d.maxSpan - radius * 0.4);
    const effectiveMinX = minXDoor ? minXDoor.thresholdLimit : bounds.minX;
    if (x - radius < effectiveMinX) {
      x = effectiveMinX + radius;
      collided = true;
    }

    const maxXDoor = doorways.find((d) => d.wall === 'maxX' && z >= d.minSpan + radius * 0.4 && z <= d.maxSpan - radius * 0.4);
    const effectiveMaxX = maxXDoor ? maxXDoor.thresholdLimit : bounds.maxX;
    if (x + radius > effectiveMaxX) {
      x = effectiveMaxX - radius;
      collided = true;
    }

    const minZDoor = doorways.find((d) => d.wall === 'minZ' && x >= d.minSpan + radius * 0.4 && x <= d.maxSpan - radius * 0.4);
    const effectiveMinZ = minZDoor ? minZDoor.thresholdLimit : bounds.minZ;
    if (z - radius < effectiveMinZ) {
      z = effectiveMinZ + radius;
      collided = true;
    }

    const maxZDoor = doorways.find((d) => d.wall === 'maxZ' && x >= d.minSpan + radius * 0.4 && x <= d.maxSpan - radius * 0.4);
    const effectiveMaxZ = maxZDoor ? maxZDoor.thresholdLimit : bounds.maxZ;
    if (z + radius > effectiveMaxZ) {
      z = effectiveMaxZ - radius;
      collided = true;
    }

    // Doorway jamb channel containment when stepped past main wall plane
    if (x < bounds.minX && minXDoor) {
      z = Math.max(minXDoor.minSpan + radius, Math.min(minXDoor.maxSpan - radius, z));
    } else if (x > bounds.maxX && maxXDoor) {
      z = Math.max(maxXDoor.minSpan + radius, Math.min(maxXDoor.maxSpan - radius, z));
    }
    if (z < bounds.minZ && minZDoor) {
      x = Math.max(minZDoor.minSpan + radius, Math.min(minZDoor.maxSpan - radius, x));
    } else if (z > bounds.maxZ && maxZDoor) {
      x = Math.max(maxZDoor.minSpan + radius, Math.min(maxZDoor.maxSpan - radius, x));
    }
  }

  return { x, z, collided };
}

/**
 * Computes a clean, collision-free standing position right in front of a seat when the player stands up.
 */
export function resolveStandUpPosition(seat, roomName = 'lobby') {
  if (!seat || !seat.position) return null;
  const roomData = ROOM_COLLIDERS[roomName] || ROOM_COLLIDERS['lobby'];
  const rotY = typeof seat.rotationY === 'number' ? seat.rotationY : 0;
  const ox = seat.seatOffset?.[0] || 0;
  const oz = seat.seatOffset?.[2] || 0;

  const seatX = seat.position[0] + ox * Math.cos(rotY) + oz * Math.sin(rotY);
  const seatZ = seat.position[2] - ox * Math.sin(rotY) + oz * Math.cos(rotY);

  // Step forward out of the seat cushion along its facing direction
  const stepDist = seat.type === 'bed' ? 1.32 : 0.62;
  const candX = seatX + Math.sin(rotY) * stepDist;
  const candZ = seatZ + Math.cos(rotY) * stepDist;

  const projected = projectConstraints(
    candX,
    candZ,
    PLAYER_RADIUS,
    roomData.boxes || [],
    roomData.obbs || [],
    roomData.circles || [],
    roomData.bounds || { minX: -11, maxX: 11, minZ: -11, maxZ: 11 },
    roomData.doorways || [],
    4
  );

  return { x: projected.x, z: projected.z };
}

/**
 * Swept & Sliding Physics Collision Resolver
 *
 * Moves in small adaptive substeps and projects against true Circle-vs-AABB,
 * Circle-vs-OBB, Circle-vs-Circle, and room doorway boundaries so the character
 * glides around rounded furniture corners and only stops when physically touching a 3D model.
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
  const activeObbs = (roomData.obbs || []).filter(
    (o) => !o.seatId || o.seatId !== seatedSeatId
  );
  const activeCircles = (roomData.circles || []).filter(
    (c) => !c.seatId || c.seatId !== seatedSeatId
  );

  const bounds = roomData.bounds || { minX: -11, maxX: 11, minZ: -11, maxZ: 11 };
  const doorways = roomData.doorways || [];

  const totalDx = moveX * speed * delta;
  const totalDz = moveZ * speed * delta;
  const totalDist = Math.sqrt(totalDx * totalDx + totalDz * totalDz);

  if (totalDist === 0) {
    return { x: currentX, z: currentZ, collided: false };
  }

  // Adaptive substepping for zero-tunneling stability at sprint speeds & variable frame rates
  const maxStepDist = radius * 0.35;
  const steps = Math.max(1, Math.ceil(totalDist / maxStepDist));
  const subDx = totalDx / steps;
  const subDz = totalDz / steps;

  let px = currentX;
  let pz = currentZ;
  let anyCollision = false;

  for (let s = 0; s < steps; s++) {
    const res = projectConstraints(
      px + subDx,
      pz + subDz,
      radius,
      activeBoxes,
      activeObbs,
      activeCircles,
      bounds,
      doorways,
      3
    );
    px = res.x;
    pz = res.z;
    if (res.collided) anyCollision = true;
  }

  return {
    x: px,
    z: pz,
    collided: anyCollision,
  };
}
