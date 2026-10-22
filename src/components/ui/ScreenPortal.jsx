import React from 'react';
import { createPortal } from 'react-dom';
import { Html } from '@react-three/drei';

function BodyPortal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

/**
 * Renders 2D screen-space UI (Modals, Mission HUDs) from inside a R3F Canvas
 * directly into `document.body` via React Portal so that:
 * 1. `position: fixed; inset: 0` is 100% viewport-relative (never squished to 0px by Drei's transform parent).
 * 2. It never drifts off-center when the camera rotates and never disappears (`display: none`) when [0,0,0] is behind the camera.
 * 3. It sits cleanly in the browser DOM above 3D `<Html distanceFactor>` labels.
 */
export default function ScreenPortal({ children }) {
  return (
    <Html style={{ display: 'none', pointerEvents: 'none' }}>
      <BodyPortal>{children}</BodyPortal>
    </Html>
  );
}
