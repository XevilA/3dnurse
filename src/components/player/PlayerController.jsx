import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';
import BabyAvatar from '../avatars/BabyAvatar';

/**
 * PlayerController — True GTA 3rd-Person Character Controller
 *
 * GTA Features:
 *   1. 360° Mouse / Touch Orbit Camera
 *   2. Camera-Relative Movement (WASD relative to camera yaw)
 *   3. Smooth Character Facing
 *   4. Walk & Sprint (Shift)
 *   5. Gamified Interactive Seating (Wheelchair driving, Sofa relaxing, Chair resting)
 *   6. Proximity seat detection & [F] quick interaction
 *   7. Health/Stamina recovery while seated
 *   8. Mother & Child Bonding (Hold baby standing or sitting)
 */
export default function PlayerController({ initialPosition = [0, 0, 3], initialRotation = 0 }) {
  const playerRef = useRef();
  const avatarGroupRef = useRef();
  const { camera, gl } = useThree();

  const setPlayerPosition = useStore((s) => s.setPlayerPosition);
  const setPlayerRotationY = useStore((s) => s.setPlayerRotationY);
  const virtualInput = useStore((s) => s.virtualInput);
  const isHoldingBaby = useStore((s) => s.isHoldingBaby);
  const setHoldingBaby = useStore((s) => s.setHoldingBaby);
  const currentRoom = useStore((s) => s.currentRoom);
  const cameraMode = useStore((s) => s.cameraMode);
  const toggleCameraMode = useStore((s) => s.toggleCameraMode);

  // Gamified Seating & Stamina
  const isSitting = useStore((s) => s.isSitting);
  const seatedTarget = useStore((s) => s.seatedTarget);
  const nearbySeat = useStore((s) => s.nearbySeat);
  const setNearbySeat = useStore((s) => s.setNearbySeat);
  const sitDown = useStore((s) => s.sitDown);
  const standUp = useStore((s) => s.standUp);
  const seats = useStore((s) => s.seats);
  const stamina = useStore((s) => s.stamina);
  const setStamina = useStore((s) => s.setStamina);

  // Animation state
  const [currentAnim, setCurrentAnim] = useState('idle');

  // Keyboard input state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  // Player position & movement
  const pos = useRef(new THREE.Vector3(...initialPosition));
  const characterRotationY = useRef(initialRotation);
  const targetRotationY = useRef(initialRotation);
  const stepTime = useRef(0);

  // Camera Orbit Angles (GTA Style)
  const cameraYaw = useRef(0);
  const cameraPitch = useRef(0.35);
  const cameraDistance = useRef(4.8);
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });

  // ── Mouse & Touch Camera Orbit Listeners ──
  useEffect(() => {
    const domElement = gl.domElement;

    const isInteractive = (target) => {
      if (!target) return false;
      return !!target.closest('button, a, input, select, [data-interactive], .interactive-ui, .pointer-events-auto');
    };

    const onMouseDown = (e) => {
      if (isInteractive(e.target)) return;
      if (e.button === 0 || e.button === 1) {
        isDragging.current = true;
        previousMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePos.current.x;
      const deltaY = e.clientY - previousMousePos.current.y;
      previousMousePos.current = { x: e.clientX, y: e.clientY };

      cameraYaw.current -= deltaX * 0.005;
      cameraPitch.current += deltaY * 0.004;
      cameraPitch.current = THREE.MathUtils.clamp(cameraPitch.current, 0.05, 1.1);
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onTouchStart = (e) => {
      if (isInteractive(e.target)) return;
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePos.current.x;
      const deltaY = e.touches[0].clientY - previousMousePos.current.y;
      previousMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      cameraYaw.current -= deltaX * 0.007;
      cameraPitch.current += deltaY * 0.005;
      cameraPitch.current = THREE.MathUtils.clamp(cameraPitch.current, 0.05, 1.1);
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    const onWheel = (e) => {
      cameraDistance.current += e.deltaY * 0.003;
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current, 2.5, 9.0);
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    domElement.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      domElement.removeEventListener('wheel', onWheel);
    };
  }, [gl.domElement]);

  // ── Keyboard Listeners (Movement + Sitting [F]) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const store = useStore.getState();

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          if (store.isSitting && !store.seatedTarget?.isDrivable) {
            store.standUp();
          }
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true;
          break;
        case 'KeyV':
          toggleCameraMode();
          break;
        case 'KeyF':
          // Toggle Sitting / Standing (Wheelchair, Sofa, Chair)
          if (store.isSitting) {
            store.standUp();
          } else if (store.nearbySeat) {
            store.sitDown(store.nearbySeat);
          }
          break;
        case 'KeyE':
        case 'Space':
          if (store.isSitting && !store.seatedTarget?.isDrivable) {
            store.standUp();
          } else if (store.currentRoom !== 'lobby') {
            setHoldingBaby(!store.isHoldingBaby);
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleCameraMode, setHoldingBaby]);

  // Handle mobile virtual input for sitting toggle
  useEffect(() => {
    if (virtualInput.sit) {
      const store = useStore.getState();
      if (store.isSitting) {
        store.standUp();
      } else if (store.nearbySeat) {
        store.sitDown(store.nearbySeat);
      }
      useStore.getState().setVirtualInput({ sit: false });
    }
  }, [virtualInput.sit]);

  // ── Main Frame Update (Physics, Camera, Dynamics, Seating) ──
  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // ── 1. Proximity Detection to Interactive Seats ──
    if (!isSitting && seats.length > 0) {
      let closest = null;
      let minDist = 2.2;
      for (const seat of seats) {
        const dx = pos.current.x - seat.position[0];
        const dz = pos.current.z - seat.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDist) {
          minDist = dist;
          closest = seat;
        }
      }
      if (closest?.id !== nearbySeat?.id) {
        setNearbySeat(closest);
      }
    } else if (nearbySeat && isSitting) {
      setNearbySeat(null);
    }

    // Inputs (Keyboard + Touch Virtual)
    const isForward = keys.current.forward || virtualInput.forward;
    const isBackward = keys.current.backward || virtualInput.backward;
    const isLeft = keys.current.left || virtualInput.left;
    const isRight = keys.current.right || virtualInput.right;
    const isSprint = (keys.current.sprint || virtualInput.sprint) && !isSitting;

    let inputX = 0;
    let inputZ = 0;
    if (isForward) inputZ -= 1;
    if (isBackward) inputZ += 1;
    if (isLeft) inputX -= 1;
    if (isRight) inputX += 1;

    const isMoving = inputX !== 0 || inputZ !== 0;

    // ── 2. Seated Behavior (Wheelchair driving vs Sofa/Chair relaxing) ──
    if (isSitting) {
      if (currentAnim !== 'idle') setCurrentAnim('idle');

      if (seatedTarget?.isDrivable) {
        // ── Drivable Wheelchair Mode ──
        if (isMoving) {
          const inputLen = Math.sqrt(inputX * inputX + inputZ * inputZ);
          inputX /= inputLen;
          inputZ /= inputLen;

          const forwardX = -Math.sin(cameraYaw.current);
          const forwardZ = -Math.cos(cameraYaw.current);
          const rightX = Math.cos(cameraYaw.current);
          const rightZ = -Math.sin(cameraYaw.current);

          const moveX = forwardX * (-inputZ) + rightX * inputX;
          const moveZ = forwardZ * (-inputZ) + rightZ * inputX;

          const driveSpeed = 2.4; // Wheelchair glide speed
          pos.current.x += moveX * driveSpeed * delta;
          pos.current.z += moveZ * driveSpeed * delta;

          pos.current.x = THREE.MathUtils.clamp(pos.current.x, -11.5, 11.5);
          pos.current.z = THREE.MathUtils.clamp(pos.current.z, -11.5, 11.5);

          targetRotationY.current = Math.atan2(moveX, moveZ);
        }
      } else {
        // ── Static Chair / Sofa / Bed Resting Mode ──
        // Lock player position to seat cushion
        if (seatedTarget) {
          const targetX = seatedTarget.position[0] + (seatedTarget.seatOffset?.[0] || 0);
          const targetZ = seatedTarget.position[2] + (seatedTarget.seatOffset?.[2] || 0);
          pos.current.x = THREE.MathUtils.lerp(pos.current.x, targetX, delta * 12);
          pos.current.z = THREE.MathUtils.lerp(pos.current.z, targetZ, delta * 12);
          if (typeof seatedTarget.rotationY === 'number') {
            targetRotationY.current = seatedTarget.rotationY;
            if (!isDragging.current) {
              const frontYaw = seatedTarget.rotationY + Math.PI;
              let diffYaw = frontYaw - cameraYaw.current;
              while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
              while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
              cameraYaw.current += diffYaw * Math.min(1, delta * 3);
            }
          }
        }

        // Regenerate stamina / health while relaxing
        setStamina(stamina + delta * 20);
      }
    } else {
      // ── 3. Standing Walk & Sprint Movement ──
      if (isMoving) {
        const inputLen = Math.sqrt(inputX * inputX + inputZ * inputZ);
        inputX /= inputLen;
        inputZ /= inputLen;

        const forwardX = -Math.sin(cameraYaw.current);
        const forwardZ = -Math.cos(cameraYaw.current);
        const rightX = Math.cos(cameraYaw.current);
        const rightZ = -Math.sin(cameraYaw.current);

        const moveX = forwardX * (-inputZ) + rightX * inputX;
        const moveZ = forwardZ * (-inputZ) + rightZ * inputX;

        const speed = isSprint ? 6.5 : 3.4;
        pos.current.x += moveX * speed * delta;
        pos.current.z += moveZ * speed * delta;

        pos.current.x = THREE.MathUtils.clamp(pos.current.x, -11.5, 11.5);
        pos.current.z = THREE.MathUtils.clamp(pos.current.z, -11.5, 11.5);

        targetRotationY.current = Math.atan2(moveX, moveZ);

        if (isSprint) {
          if (currentAnim !== 'run') setCurrentAnim('run');
        } else {
          if (currentAnim !== 'walk') setCurrentAnim('walk');
        }

        // Procedural walk bounce
        stepTime.current += delta * (isSprint ? 14 : 9);
        if (avatarGroupRef.current) {
          avatarGroupRef.current.position.y = Math.abs(Math.sin(stepTime.current)) * (isSprint ? 0.08 : 0.04);
          avatarGroupRef.current.rotation.z = Math.sin(stepTime.current) * 0.025;
        }
      } else {
        if (currentAnim !== 'idle') setCurrentAnim('idle');
        if (avatarGroupRef.current) {
          avatarGroupRef.current.position.y = THREE.MathUtils.lerp(avatarGroupRef.current.position.y, 0, delta * 8);
          avatarGroupRef.current.rotation.z = THREE.MathUtils.lerp(avatarGroupRef.current.rotation.z, 0, delta * 8);
        }
      }
    }

    // ── Smooth Character Turning ──
    let diff = targetRotationY.current - characterRotationY.current;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    characterRotationY.current += diff * Math.min(1, delta * 12);

    // Apply transform to player
    playerRef.current.position.copy(pos.current);
    playerRef.current.rotation.y = characterRotationY.current;

    // Sync to store
    setPlayerPosition([pos.current.x, pos.current.y, pos.current.z]);
    setPlayerRotationY(characterRotationY.current);

    // ── Camera Update (1st Person vs 3rd Person GTA) ──
    if (cameraMode === '1stPerson') {
      const eyeY = pos.current.y + (isSitting ? 1.15 : 1.55);
      const eyeX = pos.current.x + 0.15 * Math.sin(characterRotationY.current);
      const eyeZ = pos.current.z + 0.15 * Math.cos(characterRotationY.current);
      camera.position.set(eyeX, eyeY, eyeZ);

      const targetLook = new THREE.Vector3(
        eyeX - 5.0 * Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current),
        eyeY - 5.0 * Math.sin(cameraPitch.current),
        eyeZ - 5.0 * Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current)
      );
      camera.lookAt(targetLook);
    } else {
      const targetPoint = new THREE.Vector3(
        pos.current.x,
        pos.current.y + (isSitting ? 0.95 : 1.35),
        pos.current.z
      );

      const dist = isSitting ? Math.max(3.2, cameraDistance.current * 0.85) : cameraDistance.current;
      const yaw = cameraYaw.current;
      const pitch = cameraPitch.current;

      const camX = pos.current.x + dist * Math.sin(yaw) * Math.cos(pitch);
      const camY = pos.current.y + (isSitting ? 0.95 : 1.35) + dist * Math.sin(pitch);
      const camZ = pos.current.z + dist * Math.cos(yaw) * Math.cos(pitch);

      const desiredCamPos = new THREE.Vector3(camX, camY, camZ);
      camera.position.lerp(desiredCamPos, Math.min(1, delta * 12));
      camera.lookAt(targetPoint);
    }
  });

  return (
    <group ref={playerRef} name="PlayerCharacter" position={initialPosition}>
      {/* Avatar Group */}
      <group ref={avatarGroupRef} visible={cameraMode === '3rdPerson'}>
        <MotherAvatar
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          currentAnimation={currentAnim}
        />

        {/* Infant nestled in Mother's loving arms (Standing or Sitting on lap) */}
        {isHoldingBaby && currentRoom !== 'lobby' && (
          <group
            position={isSitting ? [0.02, 0.60, 0.38] : [0.04, 1.06, 0.25]}
            rotation={isSitting ? [-0.30, 0.20, 0.15] : [-0.18, 0.25, 0.22]}
          >
            <BabyAvatar
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[0.52, 0.52, 0.52]}
            />
            {/* Soft Hospital Swaddle Blanket */}
            <mesh position={[0.02, 0.95, -0.05]} rotation={[0.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.14, 0.28, 8, 16]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.7} />
            </mesh>
          </group>
        )}
      </group>

      {/* GTA Character Indicator Ring on Floor (Visible in 3rd Person) */}
      {cameraMode === '3rdPerson' && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial
            color={isSitting ? '#10b981' : '#00e5ff'}
            transparent
            opacity={0.65}
          />
        </mesh>
      )}
    </group>
  );
}
