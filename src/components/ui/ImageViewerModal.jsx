import React, { useEffect } from 'react';
import useStore from '../../store/useStore';

/**
 * ImageViewerModal (Lightbox)
 * Full-screen responsive modal for examining educational posters and visual details clearly.
 * Addresses client request: "ภาพโปสเตอร์ที่ติดข้างผนัง อยากให้เป็น กดที่ภาพแล้วภาพขยายใหญ่ เพื่อที่จะได้อ่านชัดเจน"
 */
export default function ImageViewerModal() {
  const activeLightboxImage = useStore((s) => s.activeLightboxImage);
  const closeLightbox = useStore((s) => s.closeLightbox);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox]);

  if (!activeLightboxImage) return null;

  const { src, title, description, badge, details, tips } = activeLightboxImage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md pointer-events-auto animate-fade-in"
      onClick={closeLightbox}
    >
      <div
        className="relative bg-white text-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border-2 border-white/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-50 via-sky-50 to-pink-50 border-b border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            {badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black bg-pink-600 text-white shadow-sm shrink-0">
                {badge}
              </span>
            )}
            <h3 className="text-sm sm:text-lg font-black text-slate-900 truncate">
              {title || 'สื่อการสอนทางคลินิก (ขยายใหญ่)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeLightbox}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition cursor-pointer shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Main Visual Image / Graphic */}
          {src && (
            <div className="w-full flex items-center justify-center bg-slate-950/5 rounded-2xl p-2 border border-slate-200 overflow-hidden">
              <img
                src={src}
                alt={title || 'Clinical poster'}
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-md transition-transform hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Description & Clinical Information */}
          {description && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-1">
                <span>📖</span>
                <span>คำอธิบาย / สาระสำคัญ:</span>
              </div>
              <p className="whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Detailed Points */}
          {Array.isArray(details) && details.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🔍</span>
                <span>รายละเอียดและขั้นตอนสำคัญ:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {details.map((d, i) => (
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
        <div className="px-4 sm:px-6 py-3 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            แตะพื้นหลังหรือกด ESC เพื่อปิดหน้าต่าง
          </span>
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
