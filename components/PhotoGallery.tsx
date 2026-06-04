"use client";

// Photo gallery + lightbox. Shows up to N thumbnails in a responsive grid,
// click any → fullscreen modal with prev/next + keyboard nav + swipe.

import { useEffect, useState, useCallback } from "react";

interface Props {
  photos: string[];
  alt: string;
  /** Thumbnails shown before "see all" button. Default 6. */
  preview?: number;
}

export default function PhotoGallery({ photos, alt, preview = 6 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll while lightbox open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (!photos.length) return null;

  const visible = showAll ? photos : photos.slice(0, preview);
  const hasMore = !showAll && photos.length > preview;

  // Touch swipe support
  let touchX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100 transition hover:ring-gold-400 dark:bg-ink-800 dark:ring-ink-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-3 w-full rounded-xl border border-gold-300 bg-gold-50 px-4 py-2 text-xs font-bold text-gold-900 transition hover:bg-gold-100 dark:border-gold-700 dark:bg-gold-950/30 dark:text-gold-200"
        >
          Show all {photos.length} photos →
        </button>
      )}

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25"
            aria-label="Close"
          >
            ×
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            {openIndex + 1} / {photos.length}
          </div>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[openIndex]}
            alt={`${alt} ${openIndex + 1}`}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Prev */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
