import { useEffect, useRef, useState } from 'react';

/**
 * Slider Avant/Après — drag pour révéler l'image "after" sous l'image "before".
 * Sans dépendance, basé sur clip-path inset.
 */
export function BeforeAfterSlider({ before, after, alt = 'Avant / Après' }) {
  const wrapperRef = useRef(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(pct);
    };
    const onUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl select-none touch-none cursor-ew-resize bg-ink"
      onMouseDown={() => { dragging.current = true; }}
      onTouchStart={() => { dragging.current = true; }}
      role="img"
      aria-label={alt}
    >
      {/* AFTER (image de fond — entièrement visible) */}
      <img
        src={after}
        alt="Après"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* BEFORE — clippée pour révéler "after" à droite */}
      <img
        src={before}
        alt="Avant"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Badges */}
      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md border border-line text-fg">
        Avant
      </span>
      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-gold/80 text-bg backdrop-blur-md">
        Après
      </span>

      {/* Curseur de drag */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gold pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold border-2 border-bg shadow-[0_4px_20px_rgba(212,175,55,0.55)] grid place-items-center text-bg">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 6 15 12 9 18" transform="translate(6 0)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
