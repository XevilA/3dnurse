import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * MedicineCabinet — Authentic 3D Medical Cabinet & First Aid Medical Supplies (Poly Haven CC0)
 *
 * Modeled for clinical nursery storage, medical records, and postpartum care medicines.
 */
const LOWER_SHELF_BOOKS = [
  { x: -0.44, w: 0.048, h: 0.27, d: 0.22, color: '#e11d48', band: '#fecdd3' },
  { x: -0.388, w: 0.042, h: 0.29, d: 0.23, color: '#0284c7', band: '#bae6fd' },
  { x: -0.340, w: 0.050, h: 0.26, d: 0.21, color: '#059669', band: '#a7f3d0' },
  { x: -0.285, w: 0.038, h: 0.28, d: 0.22, color: '#7c3aed', band: '#ddd6fe' },
  { x: -0.242, w: 0.046, h: 0.30, d: 0.23, color: '#d97706', band: '#fde68a' },
  { x: -0.190, w: 0.044, h: 0.27, d: 0.22, color: '#db2777', band: '#fbcfe8' },
  { x: -0.140, w: 0.040, h: 0.25, d: 0.21, color: '#2563eb', band: '#bfdbfe' },
  { x: -0.078, w: 0.042, h: 0.27, d: 0.22, color: '#0d9488', band: '#99f6e4', tilt: 0.18 },
];

const UPPER_SHELF_BOOKS = [
  { x: -0.43, w: 0.046, h: 0.28, d: 0.22, color: '#be185d', band: '#fbcfe8' },
  { x: -0.378, w: 0.052, h: 0.30, d: 0.23, color: '#0369a1', band: '#bae6fd' },
  { x: -0.320, w: 0.040, h: 0.26, d: 0.21, color: '#15803d', band: '#bbf7d0' },
  { x: -0.274, w: 0.044, h: 0.29, d: 0.22, color: '#b45309', band: '#fde68a' },
  { x: -0.224, w: 0.046, h: 0.27, d: 0.22, color: '#6d28d9', band: '#ddd6fe' },
  { x: 0.16, w: 0.048, h: 0.28, d: 0.22, color: '#0f766e', band: '#99f6e4' },
  { x: 0.214, w: 0.044, h: 0.30, d: 0.23, color: '#e11d48', band: '#fecdd3' },
  { x: 0.264, w: 0.042, h: 0.26, d: 0.21, color: '#1d4ed8', band: '#bfdbfe' },
  { x: 0.312, w: 0.046, h: 0.28, d: 0.22, color: '#c2410c', band: '#fed7aa' },
  { x: 0.374, w: 0.042, h: 0.27, d: 0.22, color: '#db2777', band: '#fbcfe8', tilt: -0.16 },
];

export default function MedicineCabinet({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withMedicalBox = true,
  withBooks = true,
}) {
  const { scene: cabinetScene } = useGLTF('/models/drawer_cabinet.glb');
  const { scene: boxScene } = useGLTF('/models/medical_box.glb');

  const cabinet = useMemo(() => {
    if (!cabinetScene) return null;
    const cloned = cabinetScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [cabinetScene]);

  const medicalBox = useMemo(() => {
    if (!boxScene) return null;
    const cloned = boxScene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [boxScene]);

  const cabScale = typeof scale === 'number' ? [scale * 1.0, scale * 1.0, scale * 1.0] : scale;

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <group scale={cabScale}>
        {cabinet && <primitive object={cabinet} position={[0, 0, 0]} />}

        {/* หนังสือคู่มือการพยาบาลมารดาและทารกจัดเรียงบนชั้นวางของตู้ไม้ทั้ง 2 ชั้น */}
        {withBooks && (
          <group position={[0, 0, 0.03]}>
            {/* ชั้นวางล่าง (y = 1.13) — หนังสือตั้งเรียง + กองหนังสือวางนอนด้านขวา */}
            {LOWER_SHELF_BOOKS.map((b, idx) => (
              <group
                key={`low_bk_${idx}`}
                position={[b.x, 1.13 + b.h / 2, 0]}
                rotation={[0, 0, b.tilt ? -b.tilt : 0]}
              >
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[b.w, b.h, b.d]} />
                  <meshStandardMaterial color={b.color} roughness={0.55} />
                </mesh>
                {/* สันปกและแถบชื่อหนังสือ */}
                <mesh position={[0, b.h * 0.22, b.d / 2 + 0.001]}>
                  <planeGeometry args={[b.w * 0.78, 0.036]} />
                  <meshStandardMaterial color={b.band} roughness={0.4} />
                </mesh>
                {/* ขอบกระดาษด้านบน */}
                <mesh position={[0, b.h / 2 - 0.004, -0.004]}>
                  <boxGeometry args={[b.w * 0.84, 0.008, b.d * 0.92]} />
                  <meshStandardMaterial color="#fefce8" roughness={0.8} />
                </mesh>
              </group>
            ))}

            {/* กองหนังสือคู่มือวางซ้อนแนวนอนบนชั้นล่างด้านขวา */}
            {[
              { y: 1.152, w: 0.25, h: 0.042, d: 0.19, color: '#0284c7', rot: 0.04 },
              { y: 1.194, w: 0.23, h: 0.040, d: 0.18, color: '#ec4899', rot: -0.05 },
              { y: 1.233, w: 0.21, h: 0.036, d: 0.17, color: '#10b981', rot: 0.02 },
            ].map((sb, sIdx) => (
              <group key={`stack_low_${sIdx}`} position={[0.25, sb.y, 0.01]} rotation={[0, sb.rot, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[sb.w, sb.h, sb.d]} />
                  <meshStandardMaterial color={sb.color} roughness={0.55} />
                </mesh>
                <mesh position={[0.006, 0, 0.004]}>
                  <boxGeometry args={[sb.w * 0.94, sb.h * 0.76, sb.d * 0.94]} />
                  <meshStandardMaterial color="#fefce8" roughness={0.8} />
                </mesh>
              </group>
            ))}

            {/* ชั้นวางบน (y = 1.50) — หนังสือตั้งเรียงซ้าย-ขวา + สมุดคู่มือวางนอนตรงกลาง */}
            {UPPER_SHELF_BOOKS.map((b, idx) => (
              <group
                key={`up_bk_${idx}`}
                position={[b.x, 1.50 + b.h / 2, 0]}
                rotation={[0, 0, b.tilt ? -b.tilt : 0]}
              >
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[b.w, b.h, b.d]} />
                  <meshStandardMaterial color={b.color} roughness={0.55} />
                </mesh>
                <mesh position={[0, b.h * 0.22, b.d / 2 + 0.001]}>
                  <planeGeometry args={[b.w * 0.78, 0.036]} />
                  <meshStandardMaterial color={b.band} roughness={0.4} />
                </mesh>
                <mesh position={[0, b.h / 2 - 0.004, -0.004]}>
                  <boxGeometry args={[b.w * 0.84, 0.008, b.d * 0.92]} />
                  <meshStandardMaterial color="#fefce8" roughness={0.8} />
                </mesh>
              </group>
            ))}

            {[
              { y: 1.522, w: 0.22, h: 0.040, d: 0.18, color: '#f59e0b', rot: -0.03 },
              { y: 1.560, w: 0.20, h: 0.036, d: 0.17, color: '#8b5cf6', rot: 0.05 },
            ].map((sb, sIdx) => (
              <group key={`stack_up_${sIdx}`} position={[-0.03, sb.y, 0.01]} rotation={[0, sb.rot, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[sb.w, sb.h, sb.d]} />
                  <meshStandardMaterial color={sb.color} roughness={0.55} />
                </mesh>
                <mesh position={[0.005, 0, 0.004]}>
                  <boxGeometry args={[sb.w * 0.94, sb.h * 0.76, sb.d * 0.94]} />
                  <meshStandardMaterial color="#fefce8" roughness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {withMedicalBox && medicalBox && (
          <primitive object={medicalBox} scale={[0.8, 0.8, 0.8]} position={[0, 1.89, 0]} />
        )}
      </group>
    </group>
  );
}
