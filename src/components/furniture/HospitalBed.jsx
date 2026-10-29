import React from 'react';
import * as THREE from 'three';

const BED_MATS = {
  frameSteel: new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.35, metalness: 0.45 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.4, metalness: 0.5 }),
  absWhite: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.28, metalness: 0.04 }),
  absBlue: new THREE.MeshStandardMaterial({ color: '#7dd3fc', roughness: 0.32, metalness: 0.05 }),
  absPink: new THREE.MeshStandardMaterial({ color: '#f9a8d4', roughness: 0.34, metalness: 0.05 }),
  mattress: new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.72 }),
  sheetTop: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.78 }),
  blanket: new THREE.MeshStandardMaterial({ color: '#bae6fd', roughness: 0.82 }),
  wheelRubber: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.75 }),
};

/**
 * HospitalBed — Authentic 3D Electric Clinical Patient Bed
 * Replaces the 1,281,004-vertex CAD GLB so Ward 101 & Ward 102 load instantaneously
 * on mobile/iOS Safari with zero Draco decompression memory spike.
 * Exact clinical dimensions: width 1.10m, length 2.38m, mattress top y = 0.70m.
 */
export default function HospitalBed({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const finalScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <group position={position} rotation={rotation} scale={finalScale}>
      {/* ── 1. Lower Mobile Base Chassis & 4 Medical Casters ── */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow material={BED_MATS.frameSteel}>
        <boxGeometry args={[0.92, 0.07, 1.96]} />
      </mesh>
      {[
        [-0.44, -0.92],
        [0.44, -0.92],
        [-0.44, 0.92],
        [0.44, 0.92],
      ].map(([wx, wz], idx) => (
        <group key={`bed_caster_${idx}`} position={[wx, 0.06, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={BED_MATS.wheelRubber}>
            <cylinderGeometry args={[0.06, 0.06, 0.045, 16]} />
          </mesh>
          <mesh position={[0, 0.045, 0]} material={BED_MATS.frameSteel}>
            <cylinderGeometry args={[0.035, 0.04, 0.06, 12]} />
          </mesh>
        </group>
      ))}

      {/* Dual Electric Lift Columns */}
      {[-0.52, 0.52].map((cz, idx) => (
        <mesh key={`lift_${idx}`} position={[0, 0.31, cz]} castShadow material={BED_MATS.darkSteel}>
          <boxGeometry args={[0.38, 0.28, 0.16]} />
        </mesh>
      ))}

      {/* ── 2. Upper Bed Deck Frame (y = 0.48m) ── */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow material={BED_MATS.frameSteel}>
        <boxGeometry args={[1.08, 0.08, 2.26]} />
      </mesh>

      {/* ── 3. Molded ABS Headboard (z = -1.16) & Footboard (z = +1.16) ── */}
      {/* Headboard (North / -Z) */}
      <group position={[0, 0.80, -1.15]}>
        <mesh castShadow receiveShadow material={BED_MATS.absWhite}>
          <boxGeometry args={[1.12, 0.68, 0.07]} />
        </mesh>
        <mesh position={[0, 0.02, 0.038]} material={BED_MATS.absBlue}>
          <boxGeometry args={[0.84, 0.36, 0.015]} />
        </mesh>
      </group>

      {/* Footboard (South / +Z) with Nursing Chart Holder */}
      <group position={[0, 0.72, 1.15]}>
        <mesh castShadow receiveShadow material={BED_MATS.absWhite}>
          <boxGeometry args={[1.12, 0.52, 0.07]} />
        </mesh>
        <mesh position={[0, 0.0, 0.038]} material={BED_MATS.absBlue}>
          <boxGeometry args={[0.82, 0.26, 0.015]} />
        </mesh>
      </group>

      {/* ── 4. Clinical Ergonomic Mattress (Top y = 0.70m) & Clean Hospital Linens ── */}
      <mesh position={[0, 0.60, 0]} castShadow receiveShadow material={BED_MATS.mattress}>
        <boxGeometry args={[1.02, 0.20, 2.18]} />
      </mesh>
      {/* Pastel Sky-Blue Recovery Blanket on Lower Half */}
      <mesh position={[0, 0.625, 0.34]} castShadow receiveShadow material={BED_MATS.blanket}>
        <boxGeometry args={[1.04, 0.17, 1.46]} />
      </mesh>
      {/* Crisp Folded White Top Sheet Cuff */}
      <mesh position={[0, 0.708, -0.32]} material={BED_MATS.sheetTop}>
        <boxGeometry args={[1.045, 0.018, 0.20]} />
      </mesh>

      {/* ── 5. Split Medical Safety Side Guard Rails (Left & Right) ── */}
      {[-0.545, 0.545].map((rx, sIdx) => (
        <group key={`rail_side_${sIdx}`} position={[rx, 0, 0]}>
          {[-0.52, 0.42].map((rz, segIdx) => (
            <group key={`rail_seg_${segIdx}`} position={[0, 0.74, rz]}>
              {/* Top & Bottom Horizontal ABS Bars */}
              <mesh position={[0, 0.12, 0]} castShadow material={BED_MATS.absWhite}>
                <boxGeometry args={[0.035, 0.048, 0.76]} />
              </mesh>
              <mesh position={[0, -0.08, 0]} material={BED_MATS.absWhite}>
                <boxGeometry args={[0.03, 0.04, 0.74]} />
              </mesh>
              {/* Vertical Support Struts */}
              {[-0.30, 0, 0.30].map((sz, pIdx) => (
                <mesh key={pIdx} position={[0, -0.04, sz]} material={BED_MATS.frameSteel}>
                  <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
