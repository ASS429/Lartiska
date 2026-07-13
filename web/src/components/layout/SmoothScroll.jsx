import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

/**
 * Smooth scroll inertiel (Lenis) synchronisé avec GSAP ScrollTrigger.
 * C'est le liant de tous les effets cinématiques du site public.
 *
 * - désactivé si prefers-reduced-motion ;
 * - remonte en haut à chaque changement de route (comportement SPA attendu) ;
 * - piloté par le ticker GSAP pour que scrub/pin restent parfaitement synchro.
 */
export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis; // accessible pour scrollTo programmatique

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Retour en haut à chaque navigation (Lenis ou natif).
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
