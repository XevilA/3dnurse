import React, { useMemo } from 'react';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';

/**
 * RealisticHospitalSofa Component
 * 100% Faithful Recreation of the Client Reference Photo (media_1791422511168_a47c3c00.jpg):
 * - High-end modern Japanese / Scandinavian hospital waiting lounge seating
 * - Solid blonde oak wood platform base with tapered cylindrical legs
 * - Dual-tone hospital-grade upholstery:
 *     Backrest: Soft Muted Dusty Rose / Blush Terracotta (#df988d)
 *     Seat: Warm Alabaster Cream / Ivory (#faf6f0)
 * - Integrated blonde oak planter box with lush green foliage
 * - Round blonde oak & white solid surface coffee table with succulent vase & brochure tent
 * - Gamified interactive seating target for stamina recovery
 */
export default function RealisticHospitalSofa({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  layout = 'right', // 'right' (L-shape matching photo foreground) | 'left' (bench matching photo background)
}) {
  const isRight = layout === 'right';

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* ══════════════════════════════════════════════════════════════════════════════
          1. SECTIONAL MODULAR HOSPITAL LOUNGE SOFA
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0]}>
        {/* Blonde Oak Base Platform (Natural warm wood grain) */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.12, 0.88]} />
          <meshStandardMaterial color="#d4a373" roughness={0.45} />
        </mesh>

        {/* Tapered Cylindrical Solid Oak Legs (4 corners + center support) */}
        {[
          [-1.12, -0.34],
          [1.12, -0.34],
          [-1.12, 0.34],
          [1.12, 0.34],
          [0, 0],
        ].map(([lx, lz], lIdx) => (
          <group key={`leg_${lIdx}`} position={[lx, 0.05, lz]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.032, 0.024, 0.10, 16]} />
              <meshStandardMaterial color="#c49363" roughness={0.4} />
            </mesh>
            {/* Non-slip Rubber Glide Pad */}
            <mesh position={[0, -0.051, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.006, 16]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
        ))}

        {/* ── Seat Cushions (Warm Alabaster Cream / Ivory - 3 Modular Pads) ── */}
        {[-0.78, 0, 0.78].map((sx, sIdx) => (
          <group key={`seat_${sIdx}`} position={[sx, 0.31, 0.04]}>
            {/* Main High-Density Foam Seat Cushion */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.74, 0.18, 0.74]} />
              <meshStandardMaterial color="#faf6f0" roughness={0.7} />
            </mesh>
            {/* Subtle Seat Piping Seam */}
            <mesh position={[0, 0.088, 0]}>
              <boxGeometry args={[0.745, 0.012, 0.745]} />
              <meshStandardMaterial color="#f0ece4" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* ── Backrest Support Frame (Blonde Oak Back Panel) ── */}
        <mesh position={[0, 0.52, -0.38]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.62, 0.08]} />
          <meshStandardMaterial color="#d4a373" roughness={0.45} />
        </mesh>

        {/* ── Backrest Pillows (Soothing Muted Dusty Rose / Blush Terracotta - 3 Units) ── */}
        {[-0.78, 0, 0.78].map((bx, bIdx) => (
          <group key={`back_${bIdx}`} position={[bx, 0.54, -0.28]} rotation={[-0.08, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.73, 0.44, 0.16]} />
              <meshStandardMaterial color="#df988d" roughness={0.75} />
            </mesh>
            {/* Soft Tufting / Crease Accent */}
            <mesh position={[0, 0, 0.082]}>
              <boxGeometry args={[0.62, 0.008, 0.01]} />
              <meshStandardMaterial color="#cc857a" roughness={0.85} />
            </mesh>
          </group>
        ))}

        {/* ── L-Shape / Corner Sectional Extension (Matching Photo Foreground) ── */}
        {isRight && (
          <group position={[1.48, 0, 0.72]}>
            {/* Oak Base Extension */}
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.88, 0.12, 1.32]} />
              <meshStandardMaterial color="#d4a373" roughness={0.45} />
            </mesh>
            {/* Legs */}
            {[
              [-0.34, 0.54],
              [0.34, 0.54],
              [0.34, -0.54],
            ].map(([cx, cz], cIdx) => (
              <mesh key={`cleg_${cIdx}`} position={[cx, 0.05, cz]} castShadow>
                <cylinderGeometry args={[0.032, 0.024, 0.10, 16]} />
                <meshStandardMaterial color="#c49363" roughness={0.4} />
              </mesh>
            ))}
            {/* Alabaster Cream Seat Extension (2 Pads) */}
            {[-0.28, 0.32].map((sz, szIdx) => (
              <group key={`cseat_${szIdx}`} position={[0.02, 0.31, sz]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.74, 0.18, 0.56]} />
                  <meshStandardMaterial color="#faf6f0" roughness={0.7} />
                </mesh>
              </group>
            ))}
            {/* Side Backrest Panel in Oak & Dusty Rose Cushion */}
            <mesh position={[0.40, 0.52, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.08, 0.62, 1.32]} />
              <meshStandardMaterial color="#d4a373" roughness={0.45} />
            </mesh>
            <mesh position={[0.30, 0.54, 0]} rotation={[0, 0, 0.08]} castShadow receiveShadow>
              <boxGeometry args={[0.15, 0.44, 1.24]} />
              <meshStandardMaterial color="#df988d" roughness={0.75} />
            </mesh>
          </group>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════════
            2. INTEGRATED BLONDE OAK PLANTER BOX (Connecting to sofa like in photo)
            ══════════════════════════════════════════════════════════════════════════════ */}
        <group position={[-1.52, 0, -0.02]}>
          {/* Planter Box Outer Frame */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.54, 0.56, 0.88]} />
            <meshStandardMaterial color="#d4a373" roughness={0.45} />
          </mesh>
          {/* Inner Soil Top */}
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.46, 0.04, 0.80]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
          {/* Real Green Leafy Foliage Shrub */}
          <RealPlant type="potted" position={[0, 0.54, 0]} scale={0.95} />
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════════════
          3. SCANDINAVIAN BLONDE OAK ROUND COFFEE TABLE (Directly from photo)
          ══════════════════════════════════════════════════════════════════════════════ */}
      <group position={[isRight ? 0.35 : -0.2, 0, 1.45]}>
        {/* Solid Oak Cylindrical Drum Pedestal Base */}
        <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.34, 32]} />
          <meshStandardMaterial color="#d4a373" roughness={0.42} />
        </mesh>
        {/* White Solid Surface Tabletop with Elegant Rounded Bevel */}
        <mesh position={[0, 0.355, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.46, 0.46, 0.035, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Small White Ceramic Potted Succulent Plant (From Photo) */}
        <group position={[-0.08, 0.375, -0.06]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.035, 0.08, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#4ade80" roughness={0.65} />
          </mesh>
        </group>

        {/* Folded Acrylic Informational Brochure Tent (From Photo) */}
        <group position={[0.12, 0.375, 0.04]} rotation={[0, -0.35, 0]}>
          {/* Clear Acrylic Body */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <boxGeometry args={[0.10, 0.14, 0.02]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.85}
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Printed Health Poster Insert inside Acrylic */}
          <mesh position={[0, 0.07, 0.002]}>
            <planeGeometry args={[0.085, 0.12]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
        </group>

        {/* กองผ้าอ้อมพับและขวดนมบนโต๊ะรับรองสำหรับคุณแม่และทารก */}
        {[
          { y: 0.39, color: '#ffffff', trim: '#f472b6' },
          { y: 0.422, color: '#fce7f3', trim: '#ec4899' },
          { y: 0.454, color: '#e0f2fe', trim: '#38bdf8' },
        ].map((d, i) => (
          <group key={i} position={[-0.08, d.y, 0.14]} rotation={[0, 0.15 + i * 0.08, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.20, 0.03, 0.16]} />
              <meshStandardMaterial color={d.color} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, 0.081]}>
              <boxGeometry args={[0.18, 0.012, 0.006]} />
              <meshStandardMaterial color={d.trim} roughness={0.6} />
            </mesh>
          </group>
        ))}
        <group position={[0.14, 0.375, -0.14]}>
          <mesh position={[0, 0.055, 0]} castShadow>
            <cylinderGeometry args={[0.032, 0.035, 0.11, 16]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.034, 0.034, 0.022, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.145, 0]}>
            <coneGeometry args={[0.018, 0.035, 14]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
