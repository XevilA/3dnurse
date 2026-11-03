/**
 * Safari/WebKit-safe Canvas2D Thai & mixed-script text helpers.
 *
 * Root cause fixed:
 * On iOS / iPadOS WebKit (Safari & LINE WebView), Canvas2D `ctx.textAlign = 'center'`
 * fails to subtract `width / 2` when CoreText cascades to a Thai fallback font run
 * (placing the LEFT edge of Thai strings at `centerX` while centering Latin strings).
 *
 * Measuring with `ctx.measureText(str).width` and drawing with `ctx.textAlign = 'left'`
 * at `centerX - width / 2` centers Thai, Emoji, and English strings identically across
 * iOS/iPadOS Safari, Android Chrome, macOS, and Windows.
 */

export const CANVAS_THAI_FONT =
  '"Sarabun", "Noto Sans Thai", "Thonburi", "Ayuthaya", system-ui, -apple-system, sans-serif';

export function fillCenteredText(ctx, text, centerX, y, maxWidth) {
  if (!ctx || text === undefined || text === null) return;
  const str = String(text);
  if (!str) return;

  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  const measured = ctx.measureText(str).width;
  if (maxWidth && measured > maxWidth && measured > 0) {
    const scaleX = maxWidth / measured;
    ctx.save();
    ctx.translate(centerX - maxWidth / 2, y);
    ctx.scale(scaleX, 1);
    ctx.fillText(str, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(str, centerX - measured / 2, y);
  }

  ctx.textAlign = prevAlign;
}

export function fillRightText(ctx, text, rightX, y, maxWidth) {
  if (!ctx || text === undefined || text === null) return;
  const str = String(text);
  if (!str) return;

  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  const measured = ctx.measureText(str).width;
  if (maxWidth && measured > maxWidth && measured > 0) {
    const scaleX = maxWidth / measured;
    ctx.save();
    ctx.translate(rightX - maxWidth, y);
    ctx.scale(scaleX, 1);
    ctx.fillText(str, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(str, rightX - measured, y);
  }

  ctx.textAlign = prevAlign;
}

export function whenFontsReady(onReady) {
  let cancelled = false;
  const fire = () => {
    if (!cancelled) onReady();
  };
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fire).catch(() => {});
  }
  const timer = setTimeout(fire, 600);
  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
