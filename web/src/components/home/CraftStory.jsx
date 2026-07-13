import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

/**
 * Scrollytelling signature — « Du brut à l'œuvre ».
 *
 * Section pinnée : pendant que l'utilisateur scrolle, le "mur" central
 * traverse les 4 états du métier :
 *   1. Brut     — béton gris, lumière crue
 *   2. Enduit   — surface lissée, teinte chaude
 *   3. Couleur  — vague émeraude qui monte (clip-path organique)
 *   4. Signature— filets d'or + monogramme LK qui se dessine
 *
 * Implémentation en couches CSS + SVG animées par GSAP scrub : rendu
 * riche sans WebGL — fiable sur mobile bas de gamme et ~0 Ko d'assets.
 * Si prefers-reduced-motion : pas de pin, les 4 états s'affichent en
 * simple grille statique lisible.
 */
const STAGES = [
  { key: 'brut', label: 'Préparer', text: "Tout commence par un mur brut. On sonde, on répare, on prépare le support — l'œuvre a besoin de fondations saines." },
  { key: 'enduit', label: 'Lisser', text: "L'enduit efface les défauts. La surface devient peau : douce, régulière, prête à recevoir la couleur." },
  { key: 'couleur', label: 'Colorer', text: "La teinte signature monte comme une vague. Pigments profonds, passes croisées — la pièce change d'âme." },
  { key: 'or', label: 'Signer', text: "Les filets d'or dessinent la signature Lartiska. Chaque chantier livré est une pièce unique, signée." },
];

export function CraftStory() {
  const hostRef = useRef(null);
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || !hostRef.current) return undefined;

    const ctx = gsap.context(() => {
      const wall = hostRef.current.querySelector('.craft-wall');
      const layers = {
        enduit: wall.querySelector('.craft-layer--enduit'),
        couleur: wall.querySelector('.craft-layer--couleur'),
        or: wall.querySelector('.craft-layer--or'),
      };
      const mono = wall.querySelectorAll('.craft-mono path');
      const texts = hostRef.current.querySelectorAll('.craft-step');

      // Monogramme : préparé pour un tracé progressif
      mono.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hostRef.current,
          start: 'top top',
          end: '+=280%',       // 4 états ≈ presque 3 écrans de scroll
          pin: true,
          scrub: 0.6,
        },
      });

      // État initial : brut visible, textes cachés sauf le 1er
      gsap.set([layers.enduit, layers.couleur, layers.or], { opacity: 0 });
      gsap.set(layers.couleur, { clipPath: 'ellipse(120% 0% at 50% 100%)' });
      gsap.set(texts, { opacity: 0, y: 24 });
      gsap.set(texts[0], { opacity: 1, y: 0 });

      // 1 → 2 : l'enduit recouvre le brut
      tl.to(texts[0], { opacity: 0, y: -24, duration: 0.6 }, 0.5)
        .to(layers.enduit, { opacity: 1, duration: 1.2 }, 0.7)
        .to(texts[1], { opacity: 1, y: 0, duration: 0.6 }, 1.2);

      // 2 → 3 : la vague émeraude monte
      tl.to(texts[1], { opacity: 0, y: -24, duration: 0.6 }, 2.2)
        .to(layers.couleur, { opacity: 1, duration: 0.2 }, 2.3)
        .to(layers.couleur, {
          clipPath: 'ellipse(150% 130% at 50% 100%)',
          duration: 1.6,
          ease: 'power1.inOut',
        }, 2.4)
        .to(texts[2], { opacity: 1, y: 0, duration: 0.6 }, 3.0);

      // 3 → 4 : l'or coule et signe
      tl.to(texts[2], { opacity: 0, y: -24, duration: 0.6 }, 4.0)
        .to(layers.or, { opacity: 1, duration: 0.8 }, 4.1)
        .to(mono, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.15 }, 4.3)
        .to(texts[3], { opacity: 1, y: 0, duration: 0.6 }, 4.8);
    }, hostRef);

    return () => ctx.revert();
  }, [reduce]);

  // ── Version accessible / reduced-motion : grille statique ──────────
  if (reduce) {
    return (
      <section className="container-art py-24">
        <p className="eyebrow mb-4">— Notre méthode</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light mb-10">Du brut à <em className="gold-em">l'œuvre</em>.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAGES.map((s, i) => (
            <article key={s.key} className="surface-card p-7">
              <p className="text-gold text-xs uppercase tracking-widest mb-3">{String(i + 1).padStart(2, '0')} · {s.label}</p>
              <p className="text-fg/75 leading-relaxed text-sm">{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={hostRef} className="craft-story" aria-label="Notre méthode : du mur brut à l'œuvre signée">
      <div className="craft-story__inner container-art">
        {/* ── Le mur ─────────────────────────────────────────────── */}
        <div className="craft-wall" aria-hidden="true">
          <div className="craft-layer craft-layer--brut" />
          <div className="craft-layer craft-layer--enduit" />
          <div className="craft-layer craft-layer--couleur" />
          <div className="craft-layer craft-layer--or">
            {/* filets d'or */}
            <svg className="craft-veins" viewBox="0 0 400 600" preserveAspectRatio="none">
              <path d="M60 0 C 80 140, 40 260, 70 400 S 90 560, 60 600" stroke="rgba(212,175,55,.5)" strokeWidth="1.4" fill="none" />
              <path d="M300 0 C 320 120, 280 300, 320 430 S 300 540, 315 600" stroke="rgba(212,175,55,.35)" strokeWidth="1" fill="none" />
              <path d="M180 0 C 160 180, 220 320, 190 470 S 170 550, 185 600" stroke="rgba(212,175,55,.25)" strokeWidth="0.8" fill="none" />
            </svg>
            {/* monogramme LK tracé à la fin */}
            <svg className="craft-mono" viewBox="0 0 120 120">
              <path d="M34 22 v62 h30" stroke="#D4AF37" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M70 22 v62 M70 52 l26 -30 M70 52 l26 32" stroke="#D4AF37" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── Les textes qui se relaient ─────────────────────────── */}
        <div className="craft-copy">
          <p className="eyebrow mb-4">— Notre méthode</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.05] mb-10">
            Du brut à <em className="gold-em">l'œuvre</em>.
          </h2>
          <div className="craft-steps">
            {STAGES.map((s, i) => (
              <div key={s.key} className="craft-step">
                <p className="text-gold text-xs uppercase tracking-[0.25em] mb-3">
                  {String(i + 1).padStart(2, '0')} · {s.label}
                </p>
                <p className="text-fg/80 leading-[1.8] max-w-md">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
