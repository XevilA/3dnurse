import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BabyAvatar — Authentic Medical Newborn Infant Character (ทารกแรกเกิด)
 *
 * Designed specifically for postpartum & newborn nursing education:
 * - Peaceful Sleeping Pose (ท่านอนหลับปลอดภัย Safe Sleep บนที่นอนเด็ก):
 *     - Head resting naturally on the ergonomic infant pillow
 *     - Closed serene eyelashes & delicate rosy baby cheeks
 *     - Authentic hospital cotton knit beanie hat with ribbed brim & top knot
 *     - Hospital flannel swaddle blanket wrap (ห่อตัวทารกแรกเกิด) with soft fabric folds
 *     - Tiny curled baby hands peeking out near the collar
 *     - Official hospital newborn ID bracelet (สายรัดข้อมือทารกแรกเกิด)
 *     - Subtle rhythmic infant breathing animation
 * - Carried Pose (ท่าอุ้มแนบอก / ท่าให้นมบุตร):
 *     - Naturally cradled in Mother's embrace against heart/chest
 * - Bathing Pose (ท่าอาบน้ำในอ่าง):
 *     - Safely reclined with supported head
 * - Cord Care Pose (ท่าดูแลสายสะดือ):
 *     - Supine with sterile umbilical cord clamp visible on abdomen
 */
const BabyAvatar = forwardRef(({
  pose = 'sleeping', // 'sleeping' | 'carried' | 'bathing' | 'cordCare'
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  withBlanket = true,
  blanketColor = '#fef08a', // hospital warm pastel yellow
  beanieColor = '#fef08a',  // hospital newborn beanie color
}, ref) => {
  const groupRef = useRef();
  const chestRef = useRef();

  // Handle scalar or array scale
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;

  // Gentle rhythmic newborn breathing animation (35-40 breaths/min)
  useFrame(({ clock }) => {
    if (chestRef.current) {
      const t = clock.getElapsedTime();
      const breath = Math.sin(t * 3.0) * 0.016;
      chestRef.current.scale.set(1 + breath * 0.8, 1 + breath * 1.6, 1 + breath * 0.5);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={s} dispose={null}>
      {/* ══════════════════════════════════════════════════════════════════════════
          1. SLEEPING POSE — Safe Sleep Supine on Mattress with Head on Pillow
          ══════════════════════════════════════════════════════════════════════════ */}
      {pose === 'sleeping' && (
        <group position={[0, 0.02, 0]}>
          {/* ── Head with Beanie & Peaceful Sleeping Face ── */}
          <group position={[0, 0.10, -0.18]}>
            {/* Baby Cranium (Soft fair Asian newborn skin) */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.095, 32, 32]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} metalness={0.02} />
            </mesh>

            {/* Soft Rosy Cheeks */}
            <mesh position={[-0.052, -0.015, 0.075]}>
              <sphereGeometry args={[0.024, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.75} />
            </mesh>
            <mesh position={[0.052, -0.015, 0.075]}>
              <sphereGeometry args={[0.024, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.75} />
            </mesh>

            {/* Cute Button Nose */}
            <mesh position={[0, 0.002, 0.096]}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="#fecdd3" roughness={0.7} />
            </mesh>

            {/* Peaceful Sleeping Eyelids & Lashes (Curved downwards) */}
            <group position={[-0.038, 0.025, 0.088]} rotation={[0.4, -0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.016, 0.0028, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            <group position={[0.038, 0.025, 0.088]} rotation={[0.4, 0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.016, 0.0028, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>

            {/* Sweet Baby Lips */}
            <mesh position={[0, -0.032, 0.088]} scale={[1.3, 0.65, 0.8]}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="#fb7185" roughness={0.4} />
            </mesh>

            {/* Newborn Baby Ears */}
            <mesh position={[-0.095, 0.005, 0.01]} rotation={[0, 0, 0.2]} scale={[0.5, 1, 0.8]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.7} />
            </mesh>
            <mesh position={[0.095, 0.005, 0.01]} rotation={[0, 0, -0.2]} scale={[0.5, 1, 0.8]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.7} />
            </mesh>

            {/* Hospital Knit Cotton Beanie Cap */}
            <group position={[0, 0.015, -0.01]}>
              {/* Cap Crown */}
              <mesh castShadow>
                <sphereGeometry args={[0.098, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
                <meshStandardMaterial color={beanieColor} roughness={0.85} />
              </mesh>
              {/* Folded Ribbed Brim */}
              <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.096, 0.012, 12, 32]} />
                <meshStandardMaterial color="#fef9c3" roughness={0.9} />
              </mesh>
              {/* Cute Knot on top of beanie */}
              <mesh position={[0, 0.108, 0]} castShadow>
                <sphereGeometry args={[0.018, 16, 16]} />
                <meshStandardMaterial color={beanieColor} roughness={0.85} />
              </mesh>
            </group>
          </group>

          {/* ── Hospital Swaddled Body with Gentle Breathing ── */}
          <group ref={chestRef}>
            {/* Main Contoured Swaddle Wrap Body */}
            <mesh position={[0, 0.08, 0.07]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.105, 0.072, 0.36, 32]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.8} />
            </mesh>

            {/* Rounded Swaddled Feet End */}
            <mesh position={[0, 0.08, 0.25]} castShadow>
              <sphereGeometry args={[0.072, 24, 16]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.8} />
            </mesh>

            {/* Swaddle Diagonal Wrap Overlap (V-neck medical swaddle line) */}
            <mesh position={[0, 0.165, -0.04]} rotation={[0.2, 0, -0.2]}>
              <boxGeometry args={[0.17, 0.015, 0.12]} />
              <meshStandardMaterial color="#fef08a" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.162, -0.03]} rotation={[0.2, 0, 0.2]}>
              <boxGeometry args={[0.17, 0.015, 0.12]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.85} />
            </mesh>

            {/* Tiny Curled Baby Fists Peeking Out near Collar */}
            {/* Left Fist */}
            <group position={[-0.068, 0.145, -0.07]}>
              <mesh castShadow>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.65} />
              </mesh>
            </group>
            {/* Right Fist with Hospital Newborn ID Bracelet */}
            <group position={[0.068, 0.145, -0.07]}>
              <mesh castShadow>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.65} />
              </mesh>
              {/* Medical Newborn ID Band */}
              <mesh position={[0, -0.012, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.023, 0.023, 0.012, 16]} />
                <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.2} />
              </mesh>
              {/* ID Barcode Label */}
              <mesh position={[0.018, -0.012, 0.015]}>
                <boxGeometry args={[0.008, 0.01, 0.018]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
            </group>
          </group>

          {/* ── Soft Receiving Quilt Blanket Drape ── */}
          {withBlanket && (
            <group position={[0, 0.09, 0.11]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.34, 0.07, 0.30]} />
                <meshStandardMaterial color={blanketColor} roughness={0.85} />
              </mesh>
              {/* Folded Top Edge Trim */}
              <mesh position={[0, 0.022, -0.14]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.33, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          2. CARRIED POSE — Cradled in Mother's Loving Arms (Upright / Chest Level)
          ══════════════════════════════════════════════════════════════════════════ */}
      {pose === 'carried' && (
        <group position={[0, 0, 0]} rotation={[-0.35, 0.25, 0.45]} scale={0.92}>
          {/* Baby Head */}
          <group position={[0, 0.18, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.09, 32, 32]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} />
            </mesh>
            {/* Rosy Cheeks */}
            <mesh position={[-0.048, -0.012, 0.07]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.048, -0.012, 0.07]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.7} />
            </mesh>
            {/* Sleeping Eyes */}
            <group position={[-0.035, 0.022, 0.082]} rotation={[0.3, -0.1, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.015, 0.0025, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            <group position={[0.035, 0.022, 0.082]} rotation={[0.3, 0.1, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.015, 0.0025, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            {/* Lips */}
            <mesh position={[0, -0.028, 0.082]} scale={[1.3, 0.65, 0.8]}>
              <sphereGeometry args={[0.011, 16, 16]} />
              <meshStandardMaterial color="#fb7185" roughness={0.4} />
            </mesh>
            {/* Beanie Cap */}
            <mesh position={[0, 0.015, -0.01]} castShadow>
              <sphereGeometry args={[0.093, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={beanieColor} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.102, -0.01]} castShadow>
              <sphereGeometry args={[0.016, 16, 16]} />
              <meshStandardMaterial color={beanieColor} roughness={0.85} />
            </mesh>
          </group>

          {/* Swaddled Body */}
          <group ref={chestRef} position={[0, -0.06, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.098, 0.07, 0.34, 24]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.17, 0]} castShadow>
              <sphereGeometry args={[0.07, 24, 16]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.8} />
            </mesh>
            {/* Tiny Hands Cradling Mother */}
            <mesh position={[-0.065, 0.06, 0.06]} castShadow>
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} />
            </mesh>
            <mesh position={[0.065, 0.06, 0.06]} castShadow>
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} />
            </mesh>
          </group>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          3. BATHING POSE — Reclining in Baby Bathtub with Supported Head
          ══════════════════════════════════════════════════════════════════════════ */}
      {pose === 'bathing' && (
        <group position={[0, 0.04, 0]} rotation={[-0.22, 0, 0]}>
          {/* Head resting comfortably on bathtub incline */}
          <group position={[0, 0.14, -0.16]}>
            <mesh castShadow>
              <sphereGeometry args={[0.092, 32, 32]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.6} />
            </mesh>
            {/* Cheeks */}
            <mesh position={[-0.05, -0.015, 0.07]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.05, -0.015, 0.07]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.7} />
            </mesh>
            {/* Sleeping Eyes */}
            <group position={[-0.036, 0.024, 0.082]} rotation={[0.4, -0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.015, 0.0025, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            <group position={[0.036, 0.024, 0.082]} rotation={[0.4, 0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.015, 0.0025, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            {/* Lips */}
            <mesh position={[0, -0.03, 0.082]} scale={[1.3, 0.65, 0.8]}>
              <sphereGeometry args={[0.011, 16, 16]} />
              <meshStandardMaterial color="#fb7185" roughness={0.4} />
            </mesh>
          </group>

          {/* Gentle Bath Towel Wrap over Torso */}
          <group ref={chestRef}>
            <mesh position={[0, 0.08, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.098, 0.075, 0.32, 24]} />
              <meshStandardMaterial color="#bae6fd" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.08, 0.24]} castShadow>
              <sphereGeometry args={[0.075, 24, 16]} />
              <meshStandardMaterial color="#bae6fd" roughness={0.85} />
            </mesh>
          </group>
        </group>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. CORD CARE POSE — Supine with Exposed Navel & Umbilical Clamp
          ══════════════════════════════════════════════════════════════════════════ */}
      {pose === 'cordCare' && (
        <group position={[0, 0.02, 0]}>
          {/* Head on Examination Bed */}
          <group position={[0, 0.10, -0.18]}>
            <mesh castShadow>
              <sphereGeometry args={[0.095, 32, 32]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} />
            </mesh>
            <mesh position={[-0.052, -0.015, 0.075]}>
              <sphereGeometry args={[0.024, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.75} />
            </mesh>
            <mesh position={[0.052, -0.015, 0.075]}>
              <sphereGeometry args={[0.024, 16, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} transparent opacity={0.75} />
            </mesh>
            <group position={[-0.038, 0.025, 0.088]} rotation={[0.4, -0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.016, 0.0028, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            <group position={[0.038, 0.025, 0.088]} rotation={[0.4, 0.15, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <torusGeometry args={[0.016, 0.0028, 8, 16, Math.PI * 0.85]} />
                <meshStandardMaterial color="#334155" roughness={0.5} />
              </mesh>
            </group>
            <mesh position={[0, -0.032, 0.088]} scale={[1.3, 0.65, 0.8]}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="#fb7185" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.015, -0.01]} castShadow>
              <sphereGeometry args={[0.098, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
              <meshStandardMaterial color={beanieColor} roughness={0.85} />
            </mesh>
          </group>

          {/* Exposed Torso & Diaper for Clinical Examination */}
          <group ref={chestRef}>
            {/* Upper Chest with Infant Vest */}
            <mesh position={[0, 0.09, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.098, 0.094, 0.14, 24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.7} />
            </mesh>
            {/* Exposed Abdomen */}
            <mesh position={[0, 0.075, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.094, 0.092, 0.08, 24]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.65} />
            </mesh>
            {/* Clinical Umbilical Cord Stump with Clamp */}
            <group position={[0, 0.125, 0.06]}>
              {/* Sterile Gauze Base */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.04, 0.04]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </mesh>
              {/* Umbilical Cord Stump */}
              <mesh position={[0, 0.015, 0]} castShadow>
                <cylinderGeometry args={[0.007, 0.008, 0.028, 12]} />
                <meshStandardMaterial color="#78350f" roughness={0.4} />
              </mesh>
              {/* Clinical Blue Plastic Cord Clamp (Cord Clamp) */}
              <mesh position={[0, 0.022, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <boxGeometry args={[0.012, 0.032, 0.012]} />
                <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
              </mesh>
            </group>
            {/* Hospital Diaper */}
            <mesh position={[0, 0.08, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.096, 0.08, 0.14, 24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
            {/* Diaper Fastener Tabs (Cyan Medical Tabs) */}
            <mesh position={[-0.085, 0.12, 0.12]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.01, 0.015, 0.03]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0.085, 0.12, 0.12]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.01, 0.015, 0.03]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
});

BabyAvatar.displayName = 'BabyAvatar';
export default BabyAvatar;
