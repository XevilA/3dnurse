import React from 'react';
import { RoundedBox } from '@react-three/drei';
import RealPlant from '../decorations/RealPlant';
import {
  RealisticThrowPillow3D,
  RealisticFoldedClothStack3D,
  RealisticBabyBottle3D,
  RealisticBook3D,
} from './RealisticProps3D';

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

        {/* ── Seat Cushions (Warm Alabaster Cream / Ivory - 3 Plush Rounded Modular Pads) ── */}
        {[-0.78, 0, 0.78].map((sx, sIdx) => (
          <group key={`seat_${sIdx}`} position={[sx, 0.31, 0.04]}>
            <RoundedBox args={[0.75, 0.18, 0.75]} radius={0.042} smoothness={4} castShadow receiveShadow>
              <meshStandardMaterial color="#faf6f0" roughness={0.72} />
            </RoundedBox>
          </group>
        ))}

        {/* ── Backrest Support Frame (Blonde Oak Back Panel) ── */}
        <RoundedBox args={[2.5, 0.62, 0.08]} radius={0.02} smoothness={3} position={[0, 0.52, -0.38]} castShadow receiveShadow>
          <meshStandardMaterial color="#d4a373" roughness={0.45} />
        </RoundedBox>

        {/* ── Backrest Pillows (Soothing Muted Dusty Rose / Blush Terracotta - 3 Plush Rounded Units) ── */}
        {[-0.78, 0, 0.78].map((bx, bIdx) => (
          <group key={`back_${bIdx}`} position={[bx, 0.54, -0.27]} rotation={[-0.08, 0, 0]}>
            <RoundedBox args={[0.74, 0.45, 0.17]} radius={0.055} smoothness={4} castShadow receiveShadow>
              <meshStandardMaterial color="#df988d" roughness={0.76} />
            </RoundedBox>
          </group>
        ))}

        {/* Sculpted Poly Haven Accent Throw Pillows on Lobby Sofa */}
        <RealisticThrowPillow3D
          color="#f5ebe0"
          variant={0}
          position={[-0.92, 0.54, -0.11]}
          rotation={[-0.14, 0.24, -0.06]}
          scale={0.74}
        />
        <RealisticThrowPillow3D
          color="#84a98c"
          variant={1}
          position={[0.88, 0.54, -0.11]}
          rotation={[-0.14, -0.22, 0.05]}
          scale={0.74}
        />

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

        {/* Authentic 3D Potted Succulent Plant (RealPlant GLB) */}
        <RealPlant type="succulent" position={[-0.12, 0.405, -0.10]} scale={0.35} />

        {/* Hardcover Maternal Care Guidebook on Lobby Table */}
        <RealisticBook3D
          position={[0.14, 0.373, 0.08]}
          rotation={[0, -0.35, 0]}
          width={0.18}
          height={0.026}
          depth={0.23}
          color="#be185d"
          accent="#fce7f3"
          title="คู่มือคุณแม่หลังคลอด"
          subtitle="คลินิกบริบาลมารดาและทารก"
        />

        {/* Soft U-Folded Muslin Linens & Graduated Baby Feeding Bottle */}
        <RealisticFoldedClothStack3D
          position={[-0.12, 0.373, 0.14]}
          rotation={[0, 0.18, 0]}
          scale={0.72}
        />
        <RealisticBabyBottle3D position={[0.15, 0.373, -0.14]} scale={0.88} />
      </group>
    </group>
  );
}
