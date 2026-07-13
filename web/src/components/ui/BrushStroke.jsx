import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

/**
 * Coup de pinceau doré qui se dessine sous un titre (hero).
 * Trois tracés superposés d'épaisseurs différentes + bords irréguliers :
 * l'œil lit un vrai geste de peintre, pas une ligne vectorielle.
 * Version statique (trait déjà peint) si prefers-reduced-motion.
 */
export function BrushStroke({ className = '', delay = 0.4 }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;

    const paths = svg.querySelectorAll('path');
    if (prefersReducedMotion()) {
      paths.forEach((p) => { p.style.strokeDasharray = 'none'; p.style.opacity = 1; });
      return undefined;
    }

    const ctx = gsap.context(() => {
      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.1,
          delay: delay + i * 0.08,
          ease: 'power2.inOut',
        });
      });
    }, svg);

    return () => ctx.revert();
  }, [delay]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 28"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {/* corps du trait */}
      <path
        d="M8 16 C 60 10, 130 8, 210 12 S 360 20, 412 13"
        stroke="#c9a24a" strokeWidth="7" strokeLinecap="round" opacity="0"
      />
      {/* débord supérieur — matière */}
      <path
        d="M22 11 C 90 6, 180 6, 260 9 S 380 15, 405 10"
        stroke="#c9a24a" strokeWidth="2.4" strokeLinecap="round" opacity="0"
      />
      {/* coulure basse — geste */}
      <path
        d="M40 21 C 120 18, 210 17, 300 19 S 385 23, 400 19"
        stroke="#b6893f" strokeWidth="3.2" strokeLinecap="round" opacity="0"
      />
    </svg>
  );
}
