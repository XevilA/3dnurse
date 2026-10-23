import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import WalkableRoomPortal from './WalkableRoomPortal';

/**
 * Generates a high-resolution, realistic Warm Oak Wood Plank floor texture
 * matching the client's reference rooms (Ward 103, Ward 104, Nursery 201-204).
 */
function useWarmWoodPlankTexture(repeatX = 5, repeatY = 5) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base warm honey-oak tone
    ctx.fillStyle = '#c89b6e';
    ctx.fillRect(0, 0, 1024, 1024);

    const rows = 8;
    const rowH = 1024 / rows;
    const plankColors = [
      '#cfa377',
      '#c49568',
      '#d5ab80',
      '#bd8d60',
      '#cc9f72',
      '#c7986b',
      '#d2a679',
      '#c09164',
    ];

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const offset = (r % 2) * 256 + ((r * 97) % 180);
      const plankW = 512;

      for (let c = -1; c < 3; c++) {
        const x = c * plankW + offset;
        const baseColor = plankColors[(r * 3 + c + 8) % plankColors.length];

        // Plank body gradient
        const grad = ctx.createLinearGradient(x, y, x + plankW, y + rowH);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.5, '#d6ac82');
        grad.addColorStop(1, baseColor);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, plankW, rowH);

        // Subtle wood grain fibers along plank
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, plankW, rowH);
        ctx.clip();

        for (let g = 0; g < 28; g++) {
          const gy = y + (g / 28) * rowH + Math.sin(g * 1.7 + r) * 3;
          ctx.strokeStyle = g % 3 === 0 ? 'rgba(120, 74, 36, 0.12)' : 'rgba(255, 235, 210, 0.10)';
          ctx.lineWidth = 1.5 + (g % 2);
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(
            x + plankW * 0.33,
            gy + Math.sin(g + r) * 4,
            x + plankW * 0.66,
            gy - Math.cos(g + r) * 4,
            x + plankW,
            gy
          );
          ctx.stroke();
        }

        // Plank vertical joint line
        ctx.strokeStyle = 'rgba(92, 54, 24, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowH);
        ctx.stroke();

        ctx.restore();
      }

      // Plank horizontal seam line with subtle bevel highlight
      ctx.strokeStyle = 'rgba(88, 50, 22, 0.62)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 236, 209, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, y + 2);
      ctx.lineTo(1024, y + 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [repeatX, repeatY]);
}

/**
 * HospitalRoomShell — Authentic 3D Room Architecture with Warm Wood Plank Floor & Cozy Interior Styling
 */
export default function HospitalRoomShell({
  theme = 'mother', // 'mother' | 'newborn' | 'quiz' | 'lobby'
  width = 18,
  depth = 18,
  height = 8,
  doorWall = 'left',
  doorZ = null,
  windowWall = 'none', // default 'none' so custom room windows & posters never collide
  cozyMode = true, // Warm residential-hospital interior (wood floor, wood baseboards, warm cove ceiling)
  roomTitle = 'ห้องบริบาลมารดาและทารก',
  roomNumber = 'Room 101',
}) {
  const isWarmWoodRoom = cozyMode && (theme === 'mother' || theme === 'newborn');

  // Theme color palette
  const colors = useMemo(() => {
    if (isWarmWoodRoom) {
      return {
        wallUpper: '#faf4ed',
        wallLower: '#f3e9dc',
        bumperRail: '#c89b6e',
        baseboard: '#9c6b3f',
        door: '#e6ccb2',
        lightTint: '#fff3e0',
      };
    }
    switch (theme) {
      case 'newborn':
        return {
          wallUpper: '#f0f9ff',
          wallLower: '#e0f2fe',
          bumperRail: '#94a3b8',
          baseboard: '#94a3b8',
          door: '#e0f2fe',
          lightTint: '#e0f7fa',
        };
      case 'quiz':
        return {
          wallUpper: '#faf5ff',
          wallLower: '#f3e8ff',
          bumperRail: '#94a3b8',
          baseboard: '#94a3b8',
          door: '#f3e8ff',
          lightTint: '#ede7f6',
        };
      case 'lobby':
        return {
          wallUpper: '#fffcf7',
          wallLower: '#f5efe6',
          bumperRail: '#d4a373',
          baseboard: '#b07d4b',
          door: '#e2e8f0',
          lightTint: '#fffbeb',
        };
      case 'mother':
      default:
        return {
          wallUpper: '#fff5f7',
          wallLower: '#fce7f3',
          bumperRail: '#94a3b8',
          baseboard: '#94a3b8',
          door: '#fce7f3',
          lightTint: '#fff0f5',
        };
    }
  }, [theme, isWarmWoodRoom]);

  // Procedural high-res oak wood plank texture for Mother & Newborn rooms
  const warmWoodPlankTex = useWarmWoodPlankTexture(
    Math.max(4, Math.round(width / 3.2)),
    Math.max(4, Math.round(depth / 3.2))
  );

  // Load floor texture for Lobby / Quiz fallback
  const floorTextureUrl =
    theme === 'quiz'
      ? '/textures/floor_hall_quiz.jpg'
      : theme === 'lobby'
      ? '/textures/floor_marble_lobby.jpg'
      : '/textures/floor_vinyl_mother.jpg';

  const textures = useTexture({
    floor: floorTextureUrl,
  });

  const configuredFloor = useMemo(() => {
    if (isWarmWoodRoom) return warmWoodPlankTex;
    if (!textures.floor) return null;
    const cloned = textures.floor.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    const repeatFactor = theme === 'lobby' ? 6 : theme === 'quiz' ? 5 : 4;
    cloned.repeat.set(repeatFactor, repeatFactor);
    cloned.colorSpace = THREE.SRGBColorSpace;
    cloned.needsUpdate = true;
    return cloned;
  }, [isWarmWoodRoom, warmWoodPlankTex, textures.floor, theme]);

  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group>
      {/* ── 1. Floor (Warm Oak Wood Planks for Mother & Newborn Rooms, Luxury Terrazzo/Marble for Lobby) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={configuredFloor}
          roughness={theme === 'lobby' ? 0.22 : isWarmWoodRoom ? 0.42 : 0.45}
          metalness={theme === 'lobby' ? 0.1 : 0.03}
        />
      </mesh>

      {/* ── 2. Back (North) Wall Architecture ── */}
      <group position={[0, height / 2, -halfD]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[width, height, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.65} />
        </mesh>
        {!isWarmWoodRoom && (
          <>
            <mesh position={[0, -(height / 2) + 1.2, 0.01]} receiveShadow>
              <boxGeometry args={[width, 2.4, 0.42]} />
              <meshStandardMaterial color={colors.wallLower} roughness={0.35} />
            </mesh>
            <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
              <boxGeometry args={[width, 0.16, 0.06]} />
              <meshStandardMaterial color={colors.bumperRail} roughness={0.3} />
            </mesh>
          </>
        )}
        {/* Warm Oak Baseboard Trim */}
        <mesh position={[0, -(height / 2) + 0.09, 0.05]}>
          <boxGeometry args={[width, 0.18, 0.06]} />
          <meshStandardMaterial color={colors.baseboard} roughness={0.45} />
        </mesh>
        {/* Warm Ceiling Crown Molding & LED Cove Strip */}
        <mesh position={[0, (height / 2) - 0.1, 0.06]}>
          <boxGeometry args={[width, 0.18, 0.12]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.5} />
        </mesh>
        <mesh position={[0, (height / 2) - 0.2, 0.08]}>
          <boxGeometry args={[width - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.65} />
        </mesh>
      </group>

      {/* ── 3. Left (West) Wall Architecture ── */}
      <group position={[-halfW, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[depth, height, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.65} />
        </mesh>
        {!isWarmWoodRoom && (
          <>
            <mesh position={[0, -(height / 2) + 1.2, 0.01]} receiveShadow>
              <boxGeometry args={[depth, 2.4, 0.42]} />
              <meshStandardMaterial color={colors.wallLower} roughness={0.35} />
            </mesh>
            <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
              <boxGeometry args={[depth, 0.16, 0.06]} />
              <meshStandardMaterial color={colors.bumperRail} roughness={0.3} />
            </mesh>
          </>
        )}
        <mesh position={[0, -(height / 2) + 0.09, 0.05]}>
          <boxGeometry args={[depth, 0.18, 0.06]} />
          <meshStandardMaterial color={colors.baseboard} roughness={0.45} />
        </mesh>
        <mesh position={[0, (height / 2) - 0.1, 0.06]}>
          <boxGeometry args={[depth, 0.18, 0.12]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.5} />
        </mesh>
        <mesh position={[0, (height / 2) - 0.2, 0.08]}>
          <boxGeometry args={[depth - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.65} />
        </mesh>
      </group>

      {/* ── 4. Right (East) Wall Architecture ── */}
      <group position={[halfW, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[depth, height, 0.4]} />
          <meshStandardMaterial color={colors.wallUpper} roughness={0.65} />
        </mesh>
        {!isWarmWoodRoom && (
          <>
            <mesh position={[0, -(height / 2) + 1.2, 0.01]} receiveShadow>
              <boxGeometry args={[depth, 2.4, 0.42]} />
              <meshStandardMaterial color={colors.wallLower} roughness={0.35} />
            </mesh>
            <mesh position={[0, -(height / 2) + 2.4, 0.05]} castShadow>
              <boxGeometry args={[depth, 0.16, 0.06]} />
              <meshStandardMaterial color={colors.bumperRail} roughness={0.3} />
            </mesh>
          </>
        )}
        <mesh position={[0, -(height / 2) + 0.09, 0.05]}>
          <boxGeometry args={[depth, 0.18, 0.06]} />
          <meshStandardMaterial color={colors.baseboard} roughness={0.45} />
        </mesh>
        <mesh position={[0, (height / 2) - 0.1, 0.06]}>
          <boxGeometry args={[depth, 0.18, 0.12]} />
          <meshStandardMaterial color="#e6ccb2" roughness={0.5} />
        </mesh>
        <mesh position={[0, (height / 2) - 0.2, 0.08]}>
          <boxGeometry args={[depth - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.65} />
        </mesh>
      </group>

      {/* ── 4b. Front / South Wall Architecture ── */}
      {theme === 'lobby' ? (
        <group position={[0, height / 2, halfD]}>
          <mesh position={[0, (height / 2) - 0.5, 0]} receiveShadow>
            <boxGeometry args={[width, 1.0, 0.4]} />
            <meshStandardMaterial color={colors.wallUpper} roughness={0.4} />
          </mesh>

          {/* Panoramic Hospital Glass Curtain Wall */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[width, height - 1.0, 0.06]} />
            <meshPhysicalMaterial
              color="#e0f2fe"
              transmission={0.88}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.85}
              ior={1.5}
            />
          </mesh>

          {/* Dark Architectural Window Mullions (Matching heic2.png bottom photo) */}
          {[-8, -5.5, -3, 0, 3, 5.5, 8].map((mx) => (
            <mesh key={`mullion_${mx}`} position={[mx, -0.5, 0.04]} castShadow>
              <boxGeometry args={[0.09, height - 1.0, 0.14]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.25} />
            </mesh>
          ))}

          {[-1.2, 1.4].map((ry) => (
            <mesh key={`rail_${ry}`} position={[0, ry, 0.04]}>
              <boxGeometry args={[width, 0.08, 0.12]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.25} />
            </mesh>
          ))}

          <mesh position={[0, -(height / 2) + 0.15, 0.05]}>
            <boxGeometry args={[width, 0.3, 0.22]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Outdoor Garden Scenery beyond the glass */}
          <group position={[0, -(height / 2), 5.0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[width * 1.5, 14]} />
              <meshStandardMaterial color="#4ade80" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2, -0.03]}>
              <planeGeometry args={[width * 1.2, 4]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
            </mesh>
          </group>

          {[-7.5, -3.5, 3.5, 7.5].map((tx) => (
            <group key={`out_tree_${tx}`} position={[tx, -(height / 2), 3.2]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.4, 0.9, 1.4]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.8, 0]}>
                <cylinderGeometry args={[0.12, 0.16, 2.2, 12]} />
                <meshStandardMaterial color="#78350f" roughness={0.8} />
              </mesh>
              <mesh position={[0, 3.2, 0]}>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshStandardMaterial color="#22c55e" roughness={0.6} />
              </mesh>
              <mesh position={[0.2, 3.8, 0.1]}>
                <sphereGeometry args={[0.9, 14, 14]} />
                <meshStandardMaterial color="#16a34a" roughness={0.6} />
              </mesh>
            </group>
          ))}

          <mesh position={[0, 2.5, 8.5]}>
            <planeGeometry args={[width * 1.8, height * 1.6]} />
            <meshBasicMaterial color="#7dd3fc" />
          </mesh>
        </group>
      ) : (
        <group position={[0, height / 2, halfD]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[width, height, 0.4]} />
            <meshStandardMaterial color={colors.wallUpper} roughness={0.65} />
          </mesh>
          <mesh position={[0, -(height / 2) + 0.09, 0.05]}>
            <boxGeometry args={[width, 0.18, 0.06]} />
            <meshStandardMaterial color={colors.baseboard} roughness={0.45} />
          </mesh>
          <mesh position={[0, (height / 2) - 0.1, 0.06]}>
            <boxGeometry args={[width, 0.18, 0.12]} />
            <meshStandardMaterial color="#e6ccb2" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* ── 5. Optional Panoramic Hospital Window (Only when windowWall === 'back') ── */}
      {windowWall === 'back' && (
        <group position={[0, 4.4, -halfD + 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[7.2, 3.4, 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[6.8, 3.0, 0.05]} />
            <meshStandardMaterial
              color="#e0f7fa"
              emissive="#80deea"
              emissiveIntensity={0.35}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* ── 6. Walk-in Exit Doorway (Returns to Lobby) ── */}
      {doorWall === 'left' && theme !== 'lobby' && (
        <WalkableRoomPortal
          roomKey="lobby"
          roomNumber="EXIT"
          roomTitle="ประตูทางออก — โถงกลาง (Main Lobby)"
          icon="🚪"
          theme={theme}
          position={[-halfW + 0.22, 0, doorZ !== null ? doorZ : halfD - 3.2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.0}
        />
      )}

      {/* ── 7. Warm Recessed Ceiling with Soft Downlights ── */}
      <group position={[0, height, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.8} />
        </mesh>
        {[-width * 0.25, width * 0.25].map((x) =>
          [-depth * 0.25, depth * 0.25].map((z) => (
            <group key={`${x}-${z}`} position={[x, -0.05, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.45, 24]} />
                <meshStandardMaterial color="#e6ccb2" roughness={0.4} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <circleGeometry args={[0.36, 24]} />
                <meshStandardMaterial
                  color="#fffbeb"
                  emissive="#fde68a"
                  emissiveIntensity={0.95}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))
        )}
      </group>
    </group>
  );
}
