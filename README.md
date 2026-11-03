# 3DNURSE — สื่อการเรียนรู้เสมือนจริงสามมิติ เรื่อง การดูแลมารดาหลังคลอดและทารกแรกเกิด

**Interactive 3D Virtual Postpartum & Newborn Care Hospital Learning Platform**

[![Production Deployment](https://img.shields.io/badge/Deployment-3dnurse.vercel.app-0f172a?style=for-the-badge&logo=vercel)](https://3dnurse.vercel.app)
[![Android APK](https://img.shields.io/badge/Android_APK-v1.0.0_Download-3ddc84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/XevilA/3dnurse/releases/latest/download/3DNURSE-v1.0.0.apk)
[![React 18](https://img.shields.io/badge/React-18.3-0284c7?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-be185d?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5.x-7c3aed?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 1. บทนำและวัตถุประสงค์ของโครงการ (Project Overview)

**3DNURSE** คือเว็บแอปพลิเคชันสื่อการเรียนรู้เสมือนจริงสามมิติ (3D Web-Based Virtual Hospital Simulation) ที่พัฒนาขึ้นเพื่อส่งเสริมความรู้และทักษะปฏิบัติในการดูแลตนเองของมารดาหลังคลอดและการดูแลทารกแรกเกิดอย่างถูกต้องตามหลักวิชาการพยาบาลศาสตร์

ผู้เรียนสามารถสำรวจพื้นที่โรงพยาบาลจำลองในรูปแบบสามมิติ (มุมมองบุคคลที่ 3 และบุคคลที่ 1) ศึกษาสื่ออินโฟกราฟิกทางคลินิก วิดีโอสาธิต ฝึกปฏิบัติผ่านสถานการณ์จำลองเชิงโต้ตอบ (Interactive Clinical Simulations) และประเมินผลการเรียนรู้ด้วยแบบทดสอบก่อนเรียน–หลังเรียน (Pre-test / Post-test) ได้ทั้งบนคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟนโดยไม่ต้องติดตั้งโปรแกรมเพิ่มเติม

- **เว็บไซต์ใช้งานจริง (Production URL):** https://3dnurse.vercel.app
- **แอปพลิเคชัน Android (`.apk` พร้อมติดตั้ง):** https://github.com/XevilA/3dnurse/releases/latest/download/3DNURSE-v1.0.0.apk
- **ซอร์สโค้ด (GitHub Repository):** https://github.com/XevilA/3dnurse

---

## 2. โครงสร้างเนื้อหาและห้องเรียนรู้ทางคลินิก (Clinical Learning Modules)

ระบบประกอบด้วยพื้นที่ส่วนกลาง **3 โซน** และห้องเรียนรู้เฉพาะทาง **8 ห้อง** (แบ่งเป็นด้านมารดาหลังคลอด 4 ห้อง และด้านทารกแรกเกิด 4 ห้อง):

### 2.1 พื้นที่ส่วนกลางและระบบประเมินผล (Central Hubs)

| รหัสห้อง | ชื่อห้องเรียนรู้ | รายละเอียดและการทำงาน |
| :--- | :--- | :--- |
| **Lobby** | **โถงต้อนรับและปฐมนิเทศ** (`LobbyRoom`) | จุดเริ่มต้นของผู้เรียน ป้ายแนะนำเนื้อหาหน้าห้องครบทั้ง 8 ห้อง เคาน์เตอร์พยาบาลวิชาชีพ และระบบทำแบบทดสอบก่อนเรียน (Pre-test) |
| **Suite 001** | **ห้องแต่งตัวมารดาหลังคลอด** (`DressingRoom`) | ปรับแต่งชุดและลักษณะตัวละครมารดาหลังคลอดก่อนเข้าสู่หอผู้ป่วยจำลอง |
| **Hall 301** | **ห้องประเมินความรู้รวม** (`QuizRoom`) | แบบประเมินความรู้มาตรฐานจำนวน **20 ข้อ** (ด้านมารดา 10 ข้อ และด้านทารกแรกเกิด 10 ข้อ) จำแนกตามระดับพุทธิพิสัยของ Bloom พร้อมเฉลยและเหตุผลทางคลินิก |

### 2.2 โซนการดูแลมารดาหลังคลอด (Maternal Postpartum Care — Wards 101–104)

| ห้อง | หัวข้อการเรียนรู้ทางคลินิก | กิจกรรมการเรียนรู้และสื่อโต้ตอบ |
| :--- | :--- | :--- |
| **Ward 101** | **การดูแลร่างกายและการฟื้นตัวหลังคลอด** (`MotherCare1Room`) | โภชนาการสำหรับมารดาหลังคลอดและให้นมบุตร การพักผ่อน การบริหารร่างกายหลังคลอด และการดูแลสุขภาพจิต |
| **Ward 102** | **การดูแลแผลหลังคลอดและสุขอนามัย** (`MotherCare2Room`) | แนวทางการดูแลความสะอาดแผลฝีเย็บ (คลอดปกติ) และแผลผ่าตัดคลอดทางหน้าท้อง การสังเกตลักษณะแผลผิดปกติ |
| **Ward 103** | **การดูแลเต้านมและการเลี้ยงลูกด้วยนมแม่** (`MotherCare3Room`) | วิธีทำความสะอาดและประเมินเต้านม การนวดเต้านม การจัดท่าให้นมบุตร และการแก้ไขปัญหาเต้านมคัดตึง/หัวนมแตก |
| **Ward 104** | **การสังเกตอาการผิดปกติและภาวะแทรกซ้อนหลังคลอด** (`MotherCare4Room`) | เฝ้าระวัง 5 สัญญาณอันตรายสำคัญ (ตกเลือดหลังคลอด, ไข้/น้ำคาวปลาเหม็น, ปวดศีรษะรุนแรง/ตาพร่ามัว, ปวดบวมน่อง DVT, เจ็บหน้าอก/หายใจลำบาก) พร้อมกิจกรรมคัดแยกอาการฉุกเฉิน |

### 2.3 โซนการดูแลทารกแรกเกิด (Newborn Care — Nurseries 201–204)

| ห้อง | หัวข้อการเรียนรู้ทางคลินิก | กิจกรรมการเรียนรู้และสื่อโต้ตอบ |
| :--- | :--- | :--- |
| **Nursery 201** | **การให้นมทารกแรกเกิด** (`NewbornCare1Room`) | หลักการเข้าเต้าอย่างถูกวิธี (Latch-on) สัญญาณหิวนมของทารก การอุ้มเรอหลังให้นม และการประเมินความเพียงพอของน้ำนม |
| **Nursery 202** | **การอาบน้ำและการเปลี่ยนผ้าอ้อมทารก** (`NewbornCare2Room`) | สถานการณ์จำลองเชิงปฏิบัติการเรียงลำดับและฝึกทักษะการอาบน้ำทารกและการเปลี่ยนผ้าอ้อมครบ **14 ขั้นตอน** |
| **Nursery 203** | **การดูแลสายสะดือทารกแรกเกิด** (`NewbornCare3Room`) | ขั้นตอนการเช็ดทำความสะอาดรอบโคนสะดือ การดูแลให้สะดือแห้งสะอาด และการสังเกตอาการติดเชื้อของสะดือ |
| **Nursery 204** | **การจัดสภาพแวดล้อมและท่านอนที่ปลอดภัยของทารก** (`NewbornCare4Room`) | แบบทดลองปฏิบัติจัดเตียงทารกให้ปลอดภัย (หยิบสิ่งของเสี่ยงอันตรายออกจากเตียง) และการจัดท่านอนหงายที่ปลอดภัยเพื่อป้องกันภาวะ SIDS |

---

## 3. คุณสมบัติทางเทคนิคที่สำคัญ (Key Technical Features)

- **ระบบสำรวจพื้นที่สามมิติแบบเรียลไทม์ (Real-Time 3D Navigation & Physics):** รองรับการเดินสำรวจด้วยคีย์บอร์ด (`W A S D` / ปุ่มลูกศร) บนคอมพิวเตอร์ และจอยสติ๊กเสมือนบนหน้าจอสัมผัส (Mobile Virtual Joystick) พร้อมระบบตรวจสอบการชนขอบเขตวัตถุ (`collisionSystem.js`) และระบบนั่งพักฟื้นค่าพลังงาน (Interactive Seating & Stamina)
- **ระบบแสดงผลโปสเตอร์และอินโฟกราฟิกความละเอียดสูง (3D Wall Posters & Zoomable Lightbox):** ป้ายความรู้บนผนังเรนเดอร์ด้วย WebGL Mesh แนบสนิทกับพื้นผิวผนัง เมื่อคลิกจะเปิดหน้าต่างอ่านสไลด์รายละเอียดทางคลินิกที่รองรับการซูมขยายและสลับสไลด์
- **การจัดการหน่วยความจำสำหรับอุปกรณ์พกพา (Mobile & iOS Safari Optimization):** แยกโหลดโค้ดและโมเดลสามมิติรายห้องแบบ Lazy Chunk Splitting (`room-*`) เพื่อลดขนาดไฟล์เริ่มต้นและป้องกันปัญหาหน่วยความจำเกินขีดจำกัดบนเบราว์เซอร์มือถือ
- **ระบบบันทึกความก้าวหน้ารายบุคคล (Persistent Learning Progress):** จดจำรหัสผู้เรียน สถานะการทำ Pre-test คะแนน Post-test และความคืบหน้าของแต่ละห้องไว้ใน `localStorage` โดยอัตโนมัติ

---

## 4. สถาปัตยกรรมและเทคโนโลยีที่ใช้พัฒนา (Technology Stack)

| หมวดหมู่ | เทคโนโลยี |
| :--- | :--- |
| **Frontend Framework** | React 18.3 (Functional Components & Lazy Suspense) |
| **3D Graphics Engine** | Three.js (`0.163`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **State Management** | Zustand (`useStore.js` พร้อมระบบ Persist ลง `localStorage`) |
| **Animation & UI Styling** | GSAP (`gsap`), Tailwind CSS v4, Sarabun Thai Typography (`canvasText.js`) |
| **Build Tool & Bundler** | Vite 5 (Manual Vendor & Per-Room Chunk Splitting) |
| **Android Mobile App** | Pure Native Android (Kotlin + AndroidX WebKit Hardware-Accelerated WebGL, `com.dotmini.threednurse`) |
| **Hosting & CDN** | Vercel Production Edge Network (`vercel.json`) |

---

## 5. โครงสร้างโฟลเดอร์ของโครงการ (Project Structure)

```text
3DNURSE/
├── public/
│   ├── images/              # ภาพโปสเตอร์หน้าห้อง ภาพสรุปอาการ และอินโฟกราฟิกรายละเอียดทางคลินิก
│   ├── models/              # โมเดลสามมิติ (.glb) ที่ปรับลดขนาดสำหรับใช้งานบนเว็บและมือถือ
│   └── textures/            # พื้นผิววัสดุอาคาร พื้นหินอ่อน และผนังหอผู้ป่วย
├── src/
│   ├── components/
│   │   ├── avatars/         # โมเดลตัวละครมารดา บิดา และแอนิเมชันการเคลื่อนไหว
│   │   ├── characters/      # โมเดลพยาบาลวิชาชีพและทารกแรกเกิด
│   │   ├── decorations/     # ต้นไม้และของตกแต่งภายในห้องพักฟื้น
│   │   ├── environment/     # โครงสร้างผนัง ประตูทางเชื่อมห้อง (WalkableRoomPortal) และแสงสว่าง
│   │   ├── furniture/       # เฟอร์นิเจอร์ทางการแพทย์ เตียงทารก ตู้เวชภัณฑ์ โซฟา และกรอบโปสเตอร์ 3D
│   │   ├── player/          # ระบบควบคุมการเดินและมุมกล้อง (PlayerController)
│   │   ├── scenes/          # ฉากทั้ง 11 ห้อง (LobbyRoom, DressingRoom, MotherCare1-4, NewbornCare1-4, QuizRoom)
│   │   ├── ui/              # หน้าต่างอินเทอร์เฟซ HUD, Lightbox, แบบทดสอบ และจอยสติ๊กมือถือ
│   │   └── ward/            # ชุดอุปกรณ์มาตรฐานประจำหอผู้ป่วย (WardKit)
│   ├── data/
│   │   └── quizData.js      # คลังข้อสอบมาตรฐาน 20 ข้อ (ด้านมารดา 10 ข้อ / ด้านทารก 10 ข้อ) พร้อมเฉลย
│   ├── physics/
│   │   └── collisionSystem.js # ระบบคำนวณขอบเขตการชน (AABB Colliders) ประจำแต่ละห้อง
│   ├── store/
│   │   └── useStore.js      # ศูนย์กลางจัดการสถานะผู้เรียน ความก้าวหน้า และคะแนนแบบประเมิน
│   ├── utils/
│   │   └── canvasText.js    # ระบบวาดอักษรภาษาไทยและสระบนพื้นผิว Canvas2D / WebGL Texture
│   ├── App.jsx              # โครงสร้างหลักของระบบ 3D Canvas, Lazy Loader และ Error Boundaries
│   └── main.jsx             # จุดเริ่มต้นการทำงานของแอปพลิเคชัน
├── android-app/             # ซอร์สโค้ดแอปพลิเคชัน Android แบบ Pure Native (Kotlin + Gradle)
│   ├── android/             # โครงการ Android Native, MainActivity.kt และ Adaptive Icons
│   └── assets/              # ต้นฉบับไอคอนความละเอียดสูงของแอปพลิเคชัน 3DNURSE
├── .env.example             # แม่แบบการตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
├── vercel.json              # กฎการจัดการ Cache-Control และ SPA Rewrites บน Vercel
├── vite.config.js           # การตั้งค่าการแบ่งชุดไฟล์ Build (Code Splitting)
└── package.json             # รายการไลบรารีและคำสั่งสคริปต์ของโครงการ
```

---

## 6. การติดตั้งและรันระบบในเครื่องพัฒนา (Local Development Setup)

### ความต้องการของระบบ (Prerequisites)
- **Node.js** เวอร์ชัน `18.0` ขึ้นไป (แนะนำ `20 LTS`)
- **npm** เวอร์ชัน `9.0` ขึ้นไป
- เว็บเบราว์เซอร์ที่รองรับมาตรฐาน **WebGL 2.0** (Chrome, Safari, Edge, Firefox)

### ขั้นตอนการติดตั้ง (Installation)

1. **โคลนซอร์สโค้ดจาก GitHub Repository**
   ```bash
   git clone https://github.com/XevilA/3dnurse.git
   cd 3dnurse
   ```

2. **ตั้งค่าไฟล์ตัวแปรสภาพแวดล้อม (Environment Variables)**
   คัดลอกไฟล์แม่แบบ `.env.example` เป็น `.env.local` สำหรับใช้งานในเครื่อง:
   ```bash
   cp .env.example .env.local
   ```

3. **ติดตั้งไลบรารีทั้งหมด**
   ```bash
   npm install
   ```

4. **เริ่มต้นเซิร์ฟเวอร์พัฒนา (Development Server)**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

---

## 7. การสร้างชุดไฟล์ใช้งานจริงและการเผยแพร่ (Build & Deployment)

### สร้างชุดไฟล์สำหรับ Production
```bash
npm run build
npm run preview
```
ผลลัพธ์จากการ Build จะถูกสร้างไว้ในโฟลเดอร์ `dist/` โดยแบ่งแยกไฟล์โมดูลหลัก (`vendor-three`, `vendor-r3f`, `vendor-react`) และไฟล์รายห้อง (`room-*`) โดยอัตโนมัติ

### การเผยแพร่ขึ้น Vercel Production
โครงการตั้งค่า [`vercel.json`](./vercel.json) เพื่อควบคุม `Cache-Control` ให้โหลดไฟล์ HTML และรูปภาพสื่อการสอนเวอร์ชันล่าสุดเสมอ สามารถเผยแพร่ผ่าน Vercel CLI ได้ด้วยคำสั่ง:
```bash
vercel --prod
```

---

## 8. แอปพลิเคชันสำหรับสมาร์ทโฟนและแท็บเล็ต Android (Android App)

โครงการรองรับการติดตั้งเป็นแอปพลิเคชันเนทีฟบนอุปกรณ์ Android (`Package ID: com.dotmini.threednurse`) พร้อมระบบเร่งความเร็วกราฟิกสามมิติ (Hardware-Accelerated WebGL), ระบบสั่นตอบสนองเมื่อสัมผัสปุ่ม (Native Haptic Feedback) และการจัดการปุ่มย้อนกลับของเครื่อง Android (ปิดภาพขยาย → กลับโถงต้อนรับ → กดซ้ำเพื่อออกจากแอป)

### ดาวน์โหลดและติดตั้งไฟล์ `.apk`
1. ดาวน์โหลดไฟล์ติดตั้งเวอร์ชันล่าสุดจาก GitHub Releases:  
   **https://github.com/XevilA/3dnurse/releases/latest/download/3DNURSE-v1.0.0.apk**
2. เปิดไฟล์ `3DNURSE-v1.0.0.apk` บนโทรศัพท์หรือแท็บเล็ต Android (รองรับ Android 7.0 ขึ้นไป ทุกสถาปัตยกรรม `arm64-v8a`, `armeabi-v7a`, `x86_64`) และกดยืนยันการติดตั้ง

### การสร้างไฟล์ `.apk` จากซอร์สโค้ด (`android-app/`)
ต้องการ **JDK 17** และ **Android SDK (`compileSdk 36`)**:
```bash
cd android-app/android
./gradlew assembleRelease
```
ไฟล์ผลลัพธ์จะอยู่ที่ `android-app/android/app/build/outputs/apk/release/app-release.apk`

---

## 9. การควบคุมการใช้งานเบื้องต้น (User Controls)

- **คอมพิวเตอร์ (Desktop):**
  - เดินเคลื่อนที่: ปุ่ม `W`, `A`, `S`, `D` หรือปุ่มลูกศร `↑ ↓ ← →`
  - วิ่งเร็ว: กด `Shift` ค้างไว้ขณะเดิน
  - หมุนมุมกล้อง: คลิกซ้ายค้างแล้วลากเมาส์
  - โต้ตอบกับป้ายความรู้ / อุปกรณ์ / ประตูห้อง: คลิกซ้ายที่ป้ายหรือวัตถุเรืองแสงโดยตรง
- **สมาร์ทโฟนและแท็บเล็ต (Mobile / Tablet):**
  - เดินเคลื่อนที่: ลากปุ่มจอยสติ๊กเสมือนบริเวณมุมซ้ายล่างของหน้าจอ
  - หมุนมุมกล้อง: ลากนิ้วบริเวณพื้นที่ว่างบนหน้าจอ 3D
  - เปิดอ่านสื่อความรู้และทำกิจกรรม: แตะที่ป้ายโปสเตอร์ แท็บเล็ต หรือวัตถุในห้องโดยตรง

---

## 10. สิทธิบัตรและขอบเขตการใช้งานทางวิชาการ (Academic & Usage Notice)

สื่อการเรียนรู้เสมือนจริง **3DNURSE** พัฒนาขึ้นเพื่อใช้ประโยชน์ด้านการศึกษา การเรียนการสอน และการวิจัยทางการพยาบาลมารดา–ทารกและผดุงครรภ์ ห้ามนำไปดัดแปลงเพื่อการค้าโดยไม่ได้รับอนุญาตจากคณะผู้พัฒนาและคณะผู้วิจัย
