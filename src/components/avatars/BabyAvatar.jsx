import React, { forwardRef } from 'react';
import RealisticNewborn from './RealisticNewborn';

/**
 * BabyAvatar — Unified Newborn Infant 3D Model powered by RealisticNewborn.
 * Supports all medical & nursing poses:
 *  - 'sleeping' / 'swaddle'     : Swaddled newborn sleeping supine
 *  - 'prone'                    : Sleeping prone (for Safe Sleep room hazard training)
 *  - 'diaperChange'             : Open diaper underneath, legs raised, umbilical cord & clamp visible
 *  - 'diaperOn' / 'cordCare'    : Wearing diaper folded below umbilical cord stump
 *  - 'bathing'                  : Wet newborn in bath basin with gentle soap suds
 *  - 'towelWrap'                : Wrapped in soft hooded bath towel
 *  - 'dressed'                  : Wearing newborn snap-button sleepwear & footed pants
 *  - 'naked'                    : Unwrapped newborn ready for diapering/dressing
 *  - 'carried' / 'cradleHold' / 'footballHold' / 'crossCradle' / 'sideLying' / 'bathingFootballHold' / 'bathingTurned'
 */
const POSE_TRANSFORM = {
  carried:             { pos: [0, 0.04, 0], rot: [Math.PI / 2 - 0.35, 0.25, 0.45], scale: 0.92, nbPose: 'swaddle' },
  cradleHold:          { pos: [0, 0.04, 0], rot: [Math.PI / 2 - 0.2, 0.45, 0.6],   scale: 0.92, nbPose: 'swaddle' },
  footballHold:        { pos: [0, 0.04, 0], rot: [Math.PI / 2 + 0.35, 0.15, -0.75], scale: 0.92, nbPose: 'swaddle' },
  crossCradle:         { pos: [0, 0.04, 0], rot: [Math.PI / 2 - 0.25, -0.4, -0.55], scale: 0.92, nbPose: 'swaddle' },
  sideLying:           { pos: [0, 0.06, 0], rot: [0, 0, -Math.PI / 2],              scale: 0.92, nbPose: 'swaddle' },
  bathingFootballHold: { pos: [0, 0.05, 0], rot: [0.35, 0.2, -0.4],                 scale: 0.92, nbPose: 'towelWrap' },
  bathingTurned:       { pos: [0, 0.12, 0], rot: [0.15, 0, Math.PI],                scale: 0.92, nbPose: 'bathing' },
};

const BabyAvatar = forwardRef(({
  pose = 'sleeping',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  withBlanket = true,
  blanketColor = '#fef08a',
  beanieColor = '#fef08a',
  towelColor = '#bfe3f7',
  pajamaColor = '#bfe8d0',
  wetDiaper = false,
}, ref) => {
  const s = typeof scale === 'number' ? [scale, scale, scale] : scale;
  const preset = POSE_TRANSFORM[pose];

  const mappedPose = preset
    ? preset.nbPose
    : pose === 'sleeping'
      ? 'swaddle'
      : pose === 'cordCare'
        ? 'diaperOn'
        : pose;

  return (
    <group ref={ref} position={position} rotation={rotation} scale={s} dispose={null}>
      <group
        position={preset ? preset.pos : [0, 0, 0]}
        rotation={preset ? preset.rot : [0, 0, 0]}
        scale={preset ? preset.scale : 1}
      >
        <RealisticNewborn
          pose={mappedPose}
          beanieColor={beanieColor}
          blanketColor={blanketColor}
          withBlanket={withBlanket && mappedPose === 'swaddle' && !preset}
          towelColor={towelColor}
          pajamaColor={pajamaColor}
          wetDiaper={wetDiaper}
        />
      </group>
    </group>
  );
});

BabyAvatar.displayName = 'BabyAvatar';
export default BabyAvatar;
