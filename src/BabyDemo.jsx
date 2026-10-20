import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import RealisticNewborn from './components/avatars/RealisticNewborn';

/** Dev-only preview: /?babydemo=<pose>&view=top|side|front */
export default function BabyDemo({ pose, view = 'top' }) {
  const cams = { top: [0.0, 0.75, 0.25], side: [0.7, 0.3, 0.1], front: [0, 0.25, -0.75], face: [0, 0.35, -0.2] };
  const target = view === 'face' ? [0, 0.09, -0.18] : [0, 0.06, 0.05];
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#dfe7ee' }}>
      <Canvas shadows camera={{ position: cams[view] || cams.top, fov: 38 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.6} castShadow />
        <Environment preset="apartment" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.002, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="#f7f2ee" />
        </mesh>
        <RealisticNewborn pose={pose} withBlanket />
        <OrbitControls target={target} />
      </Canvas>
    </div>
  );
}
