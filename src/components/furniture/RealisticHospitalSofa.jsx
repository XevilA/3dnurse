import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import RealPlant from '../decorations/RealPlant';
import FlowerVase from '../decorations/FlowerVase';

/**
 * RealisticHospitalSofa Component
 * Authentic Photorealistic 3D Hospital Waiting Lounge:
 * - High-end curved channel-tufted velvet sofa in Pale Pink / Dusty Rose (from sofa_velvet.glb)
 * - Brass / warm oak feet
 * - Round hospital coffee table with white marble/laminate top and oak base
 * - Real 3D indoor potted foliage plant (RealPlant)
 * - Health reading booklets & flower vase
 */
export default function RealisticHospitalSofa({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  reverseLayout = false
}) {
  const dir = reverseLayout ? -1 : 1;
  const { scene: sofaGlbScene } = useGLTF('/models/sofa_velvet.glb');

  // Clone and style the velvet sofa with pale pink upholstery and brass feet
  const styledSofa = useMemo(() => {
    if (!sofaGlbScene) return null;
    const cloned = sofaGlbScene.clone(true);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes('fabric')) {
          // Authentic Dusty Rose / Pale Pink hospital velvet upholstery
          child.material = child.material.clone();
          child.material.color.set('#f472b6'); // Pale Pink velvet
          child.material.roughness = 0.72;
          child.material.metalness = 0.05;
          child.material.needsUpdate = true;
        } else if (child.name.includes('feet')) {
          // Warm champagne brass accents
          child.material = child.material.clone();
          child.material.color.set('#fcd34d');
          child.material.metalness = 0.85;
          child.material.roughness = 0.25;
          child.material.needsUpdate = true;
        } else if (child.name.includes('legs')) {
          // Dark oak / slate metal leg frame
          child.material = child.material.clone();
          child.material.color.set('#1e293b');
          child.material.roughness = 0.4;
          child.material.needsUpdate = true;
        }
      }
    });

    return cloned;
  }, [sofaGlbScene]);

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* ── Realistic 3D Velvet Lounge Sofa ── */}
      {styledSofa && (
        <primitive
          object={styledSofa}
          scale={[1.35, 1.35, 1.35]}
          position={[0, 0, 0]}
        />
      )}

      {/* ── Low Round Blonde Oak Coffee Table (Directly matching photo) ── */}
      <group position={[dir * 0.4, 0, 1.35]}>
        {/* Cylindrical Oak Pedestal Base */}
        <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.34, 32]} />
          <meshStandardMaterial color="#d4a373" roughness={0.45} />
        </mesh>
        {/* White Solid Surface Tabletop with Soft Chamfer */}
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.04, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.05} />
        </mesh>
        {/* Small Tabletop Ceramic Flower Vase / Green Succulent */}
        <FlowerVase position={[0, 0.38, -0.08]} scale={0.75} />
        {/* Tabletop Acrylic Info Stand */}
        <group position={[0.16, 0.38, 0.08]} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.03]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.1} transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── Real 3D Potted Foliage Plant (Flanking the Sofa) ── */}
      <RealPlant
        type="potted"
        position={[dir * 2.2, 0, 0.2]}
        scale={1.25}
      />
    </group>
  );
}

useGLTF.preload('/models/sofa_velvet.glb');
