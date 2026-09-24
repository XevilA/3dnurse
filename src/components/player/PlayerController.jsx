import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import MotherAvatar from '../avatars/MotherAvatar';

/**
 * PlayerController — True GTA 3rd-Person Character Controller
 *
 * GTA Features:
 *   1. 360° Mouse / Touch Orbit Camera (คลิกลากเพื่อหมุนมุมกล้องรอบตัวละคร)
 *   2. Camera-Relative Movement (กด W จะเดินไปทิศที่กล้องหันไปเสมอ เหมือน GTA)
 *   3. Smooth Character Facing (ตัวละครหมุนตัวเข้าหาทิศทางเดินอย่างนุ่มนวล)
 *   4. Walk & Sprint (กด Shift วิ่งเร็ว สปีด x2)
 *   5. Procedural Body Dynamics (ตัวละครโยกตัวตามจังหวะก้าวเดิน มีชีวิตชีวา)
 *   6. Boundary Safety (ไม่ทะลุกำแพง)
 */
export default function PlayerController({ initialPosition = [0, 0, 3], initialRotation = 0 }) {
  const playerRef = useRef();
  const avatarGroupRef = useRef();
  const { camera, gl } = useThree();

  const setPlayerPosition = useStore((s) => s.setPlayerPosition);
  const virtualInput = useStore((s) => s.virtualInput);

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
  const cameraYaw = useRef(0); // Horizontal angle around player
  const cameraPitch = useRef(0.35); // Vertical pitch angle (elevation)
  const cameraDistance = useRef(4.8); // Distance from player
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });

  // ── Mouse & Touch Camera Orbit Listeners ──
  useEffect(() => {
    const domElement = gl.domElement;

    const onMouseDown = (e) => {
      // Left click or middle click
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

      // Orbit camera: adjust yaw & pitch
      cameraYaw.current -= deltaX * 0.005;
      cameraPitch.current += deltaY * 0.004;

      // Clamp pitch to avoid flipping over or going below floor
      cameraPitch.current = THREE.MathUtils.clamp(cameraPitch.current, 0.05, 1.1);
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    // Touch controls for mobile camera orbit
    const onTouchStart = (e) => {
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

    // Zoom with scroll wheel
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

  // ── Keyboard Listeners ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
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
  }, []);

  // ── Main Frame Update (Physics, Camera, Dynamics) ──
  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Inputs (Keyboard + Touch Virtual)
    const isForward = keys.current.forward || virtualInput.forward;
    const isBackward = keys.current.backward || virtualInput.backward;
    const isLeft = keys.current.left || virtualInput.left;
    const isRight = keys.current.right || virtualInput.right;
    const isSprint = keys.current.sprint || virtualInput.sprint;

    // Movement intent in screen space
    let inputX = 0;
    let inputZ = 0;
    if (isForward) inputZ -= 1;
    if (isBackward) inputZ += 1;
    if (isLeft) inputX -= 1;
    if (isRight) inputX += 1;

    const isMoving = inputX !== 0 || inputZ !== 0;

    if (isMoving) {
      // Normalize input
      const inputLen = Math.sqrt(inputX * inputX + inputZ * inputZ);
      inputX /= inputLen;
      inputZ /= inputLen;

      // ── GTA Camera-Relative Movement ──
      // Calculate forward and right vectors based on camera's horizontal yaw
      const forwardX = -Math.sin(cameraYaw.current);
      const forwardZ = -Math.cos(cameraYaw.current);
      const rightX = Math.cos(cameraYaw.current);
      const rightZ = -Math.sin(cameraYaw.current);

      // Final world movement direction
      const moveX = forwardX * (-inputZ) + rightX * inputX;
      const moveZ = forwardZ * (-inputZ) + rightZ * inputX;

      // Speeds: Walk = 3.6 m/s, Sprint = 7.2 m/s
      const speed = isSprint ? 7.2 : 3.6;
      pos.current.x += moveX * speed * delta;
      pos.current.z += moveZ * speed * delta;

      // Room boundaries clamping
      pos.current.x = THREE.MathUtils.clamp(pos.current.x, -8.5, 8.5);
      pos.current.z = THREE.MathUtils.clamp(pos.current.z, -8.5, 8.5);

      // Target character rotation: face moving direction
      targetRotationY.current = Math.atan2(moveX, moveZ);

      // Update animation state
      if (isSprint) {
        if (currentAnim !== 'run') setCurrentAnim('run');
      } else {
        if (currentAnim !== 'walk') setCurrentAnim('walk');
      }

      // ── Procedural Walk Dynamics (Bobbing & Sway) ──
      stepTime.current += delta * (isSprint ? 14 : 9);
      if (avatarGroupRef.current) {
        // Natural vertical bounce per step
        avatarGroupRef.current.position.y = Math.abs(Math.sin(stepTime.current)) * (isSprint ? 0.09 : 0.045);
        // Subtle shoulder / hip sway
        avatarGroupRef.current.rotation.z = Math.sin(stepTime.current) * 0.03;
      }
    } else {
      if (currentAnim !== 'idle') setCurrentAnim('idle');
      // Gentle idle breathing
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = THREE.MathUtils.lerp(avatarGroupRef.current.position.y, 0, delta * 8);
        avatarGroupRef.current.rotation.z = THREE.MathUtils.lerp(avatarGroupRef.current.rotation.z, 0, delta * 8);
      }
    }

    // ── Smooth Character Turning ──
    let diff = targetRotationY.current - characterRotationY.current;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    characterRotationY.current += diff * Math.min(1, delta * 14);

    // Apply transform to player
    playerRef.current.position.copy(pos.current);
    playerRef.current.rotation.y = characterRotationY.current;

    // Sync to store
    setPlayerPosition([pos.current.x, pos.current.y, pos.current.z]);

    // ── GTA 3rd-Person Camera Orbit & Follow ──
    // Player target look point (chest/head height)
    const targetPoint = new THREE.Vector3(
      pos.current.x,
      pos.current.y + 1.35,
      pos.current.z
    );

    // Calculate spherical camera position relative to player
    const dist = cameraDistance.current;
    const yaw = cameraYaw.current;
    const pitch = cameraPitch.current;

    const camX = pos.current.x + dist * Math.sin(yaw) * Math.cos(pitch);
    const camY = pos.current.y + 1.35 + dist * Math.sin(pitch);
    const camZ = pos.current.z + dist * Math.cos(yaw) * Math.cos(pitch);

    const desiredCamPos = new THREE.Vector3(camX, camY, camZ);

    // Smooth camera damping
    camera.position.lerp(desiredCamPos, Math.min(1, delta * 10));
    camera.lookAt(targetPoint);
  });

  return (
    <group ref={playerRef} position={initialPosition}>
      {/* Avatar Group with Procedural Bobbing */}
      <group ref={avatarGroupRef}>
        <MotherAvatar
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          currentAnimation={currentAnim}
        />
      </group>

      {/* GTA Character Indicator Ring on Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 32]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
