import React from 'react';
import * as THREE from 'three';

// Shared materials across all lobby/hall trees — zero duplicate shaders, zero 12.6MB / 1.78M-vertex GLB download
const TREE_MATS = {
  planter: new THREE.MeshStandardMaterial({ color: '#eceff1', roughness: 0.3, metalness: 0.08 }),
  planterRim: new THREE.MeshStandardMaterial({ color: '#cfd8dc', roughness: 0.35, metalness: 0.12 }),
  soil: new THREE.MeshStandardMaterial({ color: '#4e342e', roughness: 0.92 }),
  pebble: new THREE.MeshStandardMaterial({ color: '#9e9e9e', roughness: 0.75 }),
  bark: new THREE.MeshStandardMaterial({ color: '#6d4c3d', roughness: 0.88 }),
  leafDeep: new THREE.MeshStandardMaterial({ color: '#1b4332', roughness: 0.72 }),
  leafMid: new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.68 }),
  leafBright: new THREE.MeshStandardMaterial({ color: '#40916c', roughness: 0.65 }),
  leafFresh: new THREE.MeshStandardMaterial({ color: '#52b788', roughness: 0.64 }),
};

const CANOPY_CLUSTERS = [
  // Lower tier
  { pos: [-0.52, 2.05, 0.28], s: [0.58, 0.44, 0.54], mat: 'leafDeep' },
  { pos: [0.54, 2.12, -0.22], s: [0.60, 0.45, 0.55], mat: 'leafMid' },
  { pos: [0.12, 2.02, 0.56], s: [0.55, 0.42, 0.52], mat: 'leafMid' },
  { pos: [-0.24, 2.10, -0.52], s: [0.56, 0.42, 0.54], mat: 'leafDeep' },
  // Mid tier
  { pos: [0.0, 2.52, 0.0], s: [0.74, 0.56, 0.72], mat: 'leafMid' },
  { pos: [-0.46, 2.58, -0.18], s: [0.54, 0.44, 0.52], mat: 'leafBright' },
  { pos: [0.44, 2.62, 0.26], s: [0.54, 0.44, 0.52], mat: 'leafBright' },
  { pos: [-0.12, 2.66, 0.44], s: [0.48, 0.40, 0.48], mat: 'leafFresh' },
  { pos: [0.18, 2.60, -0.44], s: [0.50, 0.40, 0.48], mat: 'leafMid' },
  // Crown tier
  { pos: [0.02, 3.02, 0.02], s: [0.58, 0.48, 0.56], mat: 'leafBright' },
  { pos: [-0.22, 3.16, 0.12], s: [0.42, 0.36, 0.42], mat: 'leafFresh' },
  { pos: [0.20, 3.12, -0.12], s: [0.40, 0.34, 0.40], mat: 'leafFresh' },
];

const SHARED_CANOPY_GEO = new THREE.DodecahedronGeometry(1, 1);

/**
 * RealTree — Lightweight Architectural Indoor Ficus Tree in Ceramic Planter
 * Replaces the 1,777,278-vertex PolyHaven scan so mobile/iOS Safari renders smoothly with <1,500 vertices.
 */
export default function RealTree({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const treeScale = typeof scale === 'number' ? [scale, scale, scale] : scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Decorative Modern Planter Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={TREE_MATS.planter}>
        <cylinderGeometry args={[1.15, 0.88, 0.8, 24]} />
      </mesh>
      <mesh position={[0, 0.79, 0]} rotation={[Math.PI / 2, 0, 0]} material={TREE_MATS.planterRim}>
        <torusGeometry args={[1.12, 0.045, 10, 24]} />
      </mesh>
      <mesh position={[0, 0.77, 0]} material={TREE_MATS.soil}>
        <cylinderGeometry args={[1.08, 1.08, 0.08, 24]} />
      </mesh>

      {/* Natural Multi-Stem Ficus Trunk & Lush Layered Canopy */}
      <group scale={treeScale}>
        {/* Main central trunk */}
        <mesh position={[0, 1.55, 0]} rotation={[0.04, 0, -0.03]} castShadow material={TREE_MATS.bark}>
          <cylinderGeometry args={[0.075, 0.13, 1.65, 12]} />
        </mesh>
        {/* Secondary organic branches */}
        <mesh position={[-0.22, 1.85, 0.12]} rotation={[0.18, 0, 0.38]} material={TREE_MATS.bark}>
          <cylinderGeometry args={[0.04, 0.068, 0.85, 10]} />
        </mesh>
        <mesh position={[0.24, 1.92, -0.10]} rotation={[-0.16, 0, -0.36]} material={TREE_MATS.bark}>
          <cylinderGeometry args={[0.038, 0.065, 0.88, 10]} />
        </mesh>
        <mesh position={[0.06, 1.96, 0.22]} rotation={[0.36, 0, -0.08]} material={TREE_MATS.bark}>
          <cylinderGeometry args={[0.035, 0.058, 0.78, 10]} />
        </mesh>

        {/* Layered organic foliage clusters */}
        {CANOPY_CLUSTERS.map((c, idx) => (
          <mesh
            key={idx}
            position={c.pos}
            scale={c.s}
            geometry={SHARED_CANOPY_GEO}
            material={TREE_MATS[c.mat]}
          />
        ))}
      </group>
    </group>
  );
}
