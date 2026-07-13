import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Poussière d'or ambiante — ~40 particules dérivant lentement, canvas
 * plein écran en position fixed derrière le contenu. Réagit doucement
 * au scroll (les particules remontent légèrement quand on descend).
 *
 * Coût volontairement minime : un seul canvas, pas d'allocation dans la
 * boucle, pause automatique quand l'onglet est caché, désactivé si
 * prefers-reduced-motion.
 */
const COUNT = 40;

export function GoldDust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let width = 0;
    let height = 0;
    let lastScroll = window.scrollY;
    let scrollDrift = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const parts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.05 - Math.random() * 0.16,
      a: 0.08 + Math.random() * 0.22,      // opacité de base
      tw: 0.5 + Math.random() * 1.5,       // vitesse de scintillement
      ph: Math.random() * Math.PI * 2,     // phase
    }));

    const draw = (t) => {
      const scroll = window.scrollY;
      scrollDrift += (scroll - lastScroll) * 0.02;
      scrollDrift *= 0.92; // amorti
      lastScroll = scroll;

      ctx.clearRect(0, 0, width, height);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy - scrollDrift;
        if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
        if (p.y > height + 4) { p.y = -4; p.x = Math.random() * width; }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const twinkle = 0.6 + 0.4 * Math.sin(t * 0.001 * p.tw + p.ph);
        ctx.globalAlpha = p.a * twinkle;
        ctx.fillStyle = '#c9a24a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none"
    />
  );
}
