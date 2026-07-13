import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, prefersReducedMotion, isCoarsePointer } from '@/lib/motion';

/**
 * Chorégraphie cinématique du site public — un seul point d'entrée :
 *
 *  1. Typographie cinétique : les titres (h1/h2) montent derrière un masque
 *     (clip-path) quand ils entrent dans le viewport.
 *  2. Cartes & cadres : fade-up en cascade (stagger) au scroll.
 *  3. Tilt 3D + reflet doré : les .project-card suivent le curseur (desktop).
 *  4. Boutons magnétiques : .btn-gold/.btn-ghost attirent légèrement le curseur.
 *
 * Tout est ignoré si prefers-reduced-motion ; le tilt et le magnétisme sont
 * ignorés sur écran tactile. Les éléments déjà animés sont marqués
 * data-fx pour ne jamais rejouer (contenu chargé en async compris).
 */
export function CinematicEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {});
    const timers = [];

    const enhance = () => {
      ctx.add(() => {
        // ── 1. Titres — reveal masqué ────────────────────────────────
        gsap.utils.toArray('main h1:not([data-fx]), main h2:not([data-fx])').forEach((el) => {
          el.dataset.fx = '1';
          gsap.fromTo(el,
            { clipPath: 'inset(0 0 100% 0)', y: 34, opacity: 0.001 },
            {
              clipPath: 'inset(0 0 -8% 0)', y: 0, opacity: 1,
              duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        });

        // ── 2. Cartes / cadres — cascade fade-up ────────────────────
        const cards = gsap.utils.toArray(
          'main .surface-card:not([data-fx]), main .project-card:not([data-fx]), main .art-frame:not([data-fx])',
        );
        cards.forEach((el) => { el.dataset.fx = '1'; });
        if (cards.length) {
          ScrollTrigger.batch(cards, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.fromTo(batch,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.07 }),
          });
        }
      });
    };

    // Premier passage + rattrapage du contenu chargé en async (React Query).
    enhance();
    timers.push(setTimeout(() => { enhance(); ScrollTrigger.refresh(); }, 600));
    timers.push(setTimeout(() => { enhance(); ScrollTrigger.refresh(); }, 1800));

    return () => {
      timers.forEach(clearTimeout);
      ctx.revert();
    };
  }, [pathname]);

  // ── 3 & 4. Tilt 3D + boutons magnétiques (délégation d'événements) ──
  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return undefined;

    const TILT_MAX = 6; // degrés — subtil, jamais gadget
    const MAG_MAX = 8;  // px de translation des boutons

    const onMove = (e) => {
      const card = e.target.closest?.('.project-card');
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--tilt-x', `${((py - 0.5) * -2 * TILT_MAX).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${((px - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`);
        card.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
        card.classList.add('is-tilting');
      }

      const btn = e.target.closest?.('.btn-gold, .btn-ghost');
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = `translate(${(dx * MAG_MAX).toFixed(1)}px, ${(dy * MAG_MAX).toFixed(1)}px)`;
      }
    };

    const onOut = (e) => {
      const card = e.target.closest?.('.project-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }
      const btn = e.target.closest?.('.btn-gold, .btn-ghost');
      if (btn && !btn.contains(e.relatedTarget)) {
        btn.style.transform = '';
      }
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);

  return null;
}
