import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';

/**
 * ImageViewerModal (Lightbox)
 * Full-screen responsive modal for examining educational posters and visual details clearly.
 * Supports tap-to-zoom and +/- zoom controls so mobile & desktop users can read every detail clearly.
 */
export default function ImageViewerModal() {
  const activeLightboxImage = useStore((s) => s.activeLightboxImage);
  const openLightbox = useStore((s) => s.openLightbox);
  const closeLightbox = useStore((s) => s.closeLightbox);
  const [zoom, setZoom] = useState(1);

  const items = activeLightboxImage?.items || null;
  const currentIndex = typeof activeLightboxImage?.currentIndex === 'number' ? activeLightboxImage.currentIndex : 0;
  const onIndexChange = activeLightboxImage?.onIndexChange;
  const hasGallery = Array.isArray(items) && items.length > 1;

  // Reset zoom whenever image or slide index changes
  useEffect(() => {
    setZoom(1);
  }, [activeLightboxImage?.src, currentIndex]);

  const goPrev = () => {
    if (!hasGallery) return;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onIndexChange?.(prevIdx);
    openLightbox({ ...items[prevIdx], items, currentIndex: prevIdx, onIndexChange });
  };

  const goNext = () => {
    if (!hasGallery) return;
    const nextIdx = (currentIndex + 1) % items.length;
    onIndexChange?.(nextIdx);
    openLightbox({ ...items[nextIdx], items, currentIndex: nextIdx, onIndexChange });
  };

  // Keyboard shortcut: Escape to close, ArrowLeft/ArrowRight to navigate
  useEffect(() => {
    if (!activeLightboxImage) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (hasGallery && e.key === 'ArrowLeft') goPrev();
      if (hasGallery && e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLightboxImage, hasGallery, currentIndex, items]);

  if (!activeLightboxImage) return null;

  const {
    src,
    isVideo,
    videoUrl,
    externalUrl,
    citation,
    title,
    description,
    caption,
    badge,
    category,
    details,
    clinicalDetails,
    tips,
    hideDetails,
  } = activeLightboxImage;
  const descText = description || caption;
  const badgeText = badge || category;
  const detailsList = hideDetails ? null : (details || clinicalDetails);

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center px-2.5 sm:px-6 bg-black/85 backdrop-blur-md pointer-events-auto animate-fade-in"
      style={{
        paddingTop: 'max(0.625rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))',
      }}
      onClick={closeLightbox}
    >
      <div
        className="relative bg-white text-slate-800 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-full flex flex-col shadow-2xl overflow-hidden border-2 border-white/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3.5 sm:px-6 py-3 bg-gradient-to-r from-slate-50 via-sky-50 to-pink-50 border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            {badgeText && (
              <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black bg-pink-600 text-white shadow-sm shrink-0">
                {badgeText}
              </span>
            )}
            <h3 className="text-sm sm:text-lg font-black text-slate-900 truncate">
              {title || 'สื่อการสอนทางคลินิก (ขยายใหญ่)'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!isVideo && src && (
              <>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                  disabled={zoom <= 1}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 text-slate-800 text-xs font-black transition cursor-pointer shadow-xs"
                  title="ย่อขนาดภาพ"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => (z >= 2.5 ? 1 : +(z + 0.5).toFixed(1)))}
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                  title="ขยายขนาดภาพให้ใหญ่ขึ้น"
                >
                  {zoom > 1 ? `🔍 ${Math.round(zoom * 100)}%` : '＋ ขยายรูปใหญ่'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={closeLightbox}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition cursor-pointer shrink-0 ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Main Visual Image / Video Graphic */}
          {isVideo && videoUrl ? (
            <div className="w-full space-y-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
                <iframe
                  src={videoUrl}
                  title={title || 'Educational video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {(citation || externalUrl) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
                  {citation && <p className="font-bold">{citation}</p>}
                  {externalUrl && (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition shrink-0"
                    >
                      <span>▶</span>
                      <span>เปิดดูบน YouTube</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            src && (
              <div className="w-full space-y-1.5">
                <div
                  className={`w-full bg-slate-950/5 rounded-2xl p-1.5 sm:p-2 border border-slate-200 ${
                    zoom > 1 ? 'overflow-auto max-h-[calc(var(--app-h,100dvh)*0.74)]' : 'flex items-center justify-center overflow-hidden'
                  }`}
                >
                  <img
                    src={src}
                    alt={title || 'Clinical poster'}
                    onClick={() => setZoom((z) => (z > 1 ? 1 : 1.75))}
                    style={
                      zoom > 1
                        ? { width: `${zoom * 100}%`, maxWidth: 'none', height: 'auto' }
                        : undefined
                    }
                    className={
                      zoom > 1
                        ? 'block mx-auto rounded-xl shadow-md cursor-zoom-out'
                        : `${
                            !descText && (!detailsList || detailsList.length === 0)
                              ? 'max-h-[calc(var(--app-h,100dvh)*0.76)]'
                              : 'max-h-[calc(var(--app-h,100dvh)*0.62)] sm:max-h-[calc(var(--app-h,100dvh)*0.70)]'
                          } w-auto max-w-full object-contain rounded-xl shadow-md transition-transform hover:scale-[1.01] cursor-zoom-in`
                    }
                  />
                </div>
                <div className="text-center text-[11px] font-bold text-slate-500">
                  {zoom > 1
                    ? '👆 เลื่อนนิ้วเพื่อดูรายละเอียดรอบภาพ • แตะที่ภาพอีกครั้งเพื่อย่อกลับขนาดปกติ'
                    : '🔍 แตะที่ภาพ หรือกดปุ่ม "＋ ขยายรูปใหญ่" ด้านบนเพื่อซูมอ่านรายละเอียดขนาดใหญ่'}
                </div>
              </div>
            )
          )}

          {/* Description & Clinical Information */}
          {descText && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-1">
                <span>📖</span>
                <span>คำอธิบาย / สาระสำคัญ:</span>
              </div>
              <p className="whitespace-pre-line">{descText}</p>
            </div>
          )}

          {/* Detailed Points */}
          {Array.isArray(detailsList) && detailsList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🔍</span>
                <span>รายละเอียดและขั้นตอนสำคัญ:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailsList.map((d, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips / Danger Warnings */}
          {tips && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-3 text-xs sm:text-sm text-amber-900 font-medium">
              <div className="font-bold flex items-center gap-1 mb-0.5">
                <span>⚠️</span>
                <span>ข้อควรระวังทางการพยาบาล:</span>
              </div>
              <p>{tips}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          {hasGallery ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="px-3.5 py-1.5 bg-white hover:bg-pink-50 border border-slate-300 text-slate-800 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer shadow-sm"
              >
                ◀ ก่อนหน้า
              </button>
              <span className="text-xs sm:text-sm font-black text-pink-700 px-2">
                ภาพที่ {currentIndex + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer shadow-sm"
              >
                ถัดไป ▶
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">
              แตะพื้นหลังหรือกด ESC เพื่อปิดหน้าต่าง
            </span>
          )}
          <button
            type="button"
            onClick={closeLightbox}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
