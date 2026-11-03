# 3DNURSE Android Application (`com.dotmini.threednurse`)

แอปพลิเคชัน Android แบบ Pure Native (Kotlin + Hardware-Accelerated WebGL) สำหรับเข้าใช้งานสื่อการเรียนรู้เสมือนจริงสามมิติ **3DNURSE** (`https://3dnurse.vercel.app`)

## คุณสมบัติหลัก
- **Hardware-Accelerated WebGL:** เรนเดอร์ฉากหอผู้ป่วยสามมิติทั้ง 11 ห้องได้อย่างลื่นไหลโดยไม่มีภาระหน่วยความจำซ้อนทับจาก JS Bridge ขนาดใหญ่
- **Universal APK:** ไฟล์ `.apk` ขนาดกะทัดรัด รองรับสมาร์ทโฟนและแท็บเล็ต Android 7.0+ (`API 24–36`) ทุกสถาปัตยกรรม (`arm64-v8a`, `armeabi-v7a`, `x86_64`)
- **Smart Hardware Back Navigation:** ปุ่มย้อนกลับของเครื่องทำหน้าที่ตามลำดับความสำคัญ (ออกจากวิดีโอเต็มจอ → ปิดภาพขยาย Lightbox → กลับสู่โถงต้อนรับ Lobby → ย้อนหน้าเว็บ → กดซ้ำภายใน 2 วินาทีเพื่อออกจากแอป)
- **Native Tactile Haptics:** รองรับการสั่นตอบสนองเมื่อแตะปุ่มโต้ตอบภายในห้องเรียนรู้

## การสร้างไฟล์ติดตั้ง Release APK

ต้องการ **JDK 17** และ **Android SDK (`compileSdk 36`)**:

```bash
cd android
./gradlew assembleRelease
```

ไฟล์ `.apk` ที่สร้างเสร็จจะอยู่ที่:
`android/app/build/outputs/apk/release/app-release.apk`
