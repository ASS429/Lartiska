import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useApi';

/**
 * Studio epoxy — l'utilisateur choisit une teinte et voit le sol changer
 * en temps réel (reflets, profondeur, veines pour le marbre). Le CTA
 * écrit un brouillon de devis pré-rempli (service epoxy + teinte choisie)
 * puis ouvre le formulaire : zéro ressaisie → conversion.
 *
 * Rendu 100% CSS (dégradés + reflet animé) : aucun asset, aucun WebGL —
 * fluide même sur mobile d'entrée de gamme.
 */
// Chaque teinte = vraie texture epoxy (web/public/img/epoxy_*.webp).
const TINTS = [
  { key: 'emeraude', label: 'Émeraude', img: '/img/epoxy_emeraude.webp', sheen: 'rgba(255,255,255,0.30)' },
  { key: 'ambre', label: 'Ambre doré', img: '/img/epoxy_ambre_dore.webp', sheen: 'rgba(255,236,190,0.34)' },
  { key: 'marbre', label: 'Marbre blanc', img: '/img/epoxy_marbre_blanc.webp', sheen: 'rgba(255,255,255,0.42)' },
  { key: 'noir', label: 'Noir métallisé', img: '/img/epoxy_noir_metalise.webp', sheen: 'rgba(180,200,255,0.26)' },
];

const DRAFT_KEY = 'lartiska_devis_draft';

export function EpoxyStudio() {
  const [tint, setTint] = useState(TINTS[0]);
  const navigate = useNavigate();
  const { data: services } = useServices();

  // Premier service de la catégorie epoxy — pour préremplir le devis.
  const epoxyService = useMemo(
    () => (services || []).find((s) => s.category?.slug === 'epoxy-resine'),
    [services],
  );

  const startQuote = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        step: 1,
        form: {
          service_id: epoxyService?.id ? String(epoxyService.id) : '',
          description: `Sol en résine epoxy — teinte souhaitée : ${tint.label}. Surface approximative : `,
        },
      }));
    } catch { /* pas bloquant */ }
    navigate('/devis');
  };

  return (
    <section className="py-24 md:py-32 border-y border-line">
      <div className="container-art">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow-deco mb-5">
            <span className="text-gold">✦</span> Epoxy résine <span className="text-gold">✦</span>
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight">
            Essayez votre <em className="gold-em">sol miroir</em>.
          </h2>
          <p className="mt-6 text-fg/75 leading-relaxed">
            Choisissez une teinte — le rendu change en direct. Finition haute brillance,
            résistante, pour résidentiel comme commercial.
          </p>
        </header>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 items-center max-w-5xl mx-auto">
          {/* ── Les 4 textures en grille — cliquables, la teinte active
                 est marquée or et porte le reflet balayé ─────────────── */}
          <div className="epoxy-grid" role="group" aria-label="Aperçus des 4 teintes de sol epoxy">
            {TINTS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTint(t)}
                aria-pressed={tint.key === t.key}
                className={`epoxy-tile ${tint.key === t.key ? 'is-active' : ''}`}
                style={{ '--epoxy-sheen': t.sheen }}
              >
                <img src={t.img} alt={`Sol en résine epoxy — teinte ${t.label}`} loading="lazy" />
                {tint.key === t.key && <span className="epoxy-sheen" aria-hidden="true" />}
                <span className="epoxy-tile__label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Nuancier + CTA ───────────────────────────────────── */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-fg/60 mb-4">Nuancier</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {TINTS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTint(t)}
                  aria-pressed={tint.key === t.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left ${
                    tint.key === t.key ? 'border-gold bg-gold/10' : 'border-line hover:border-gold/60'
                  }`}
                >
                  <span
                    className="w-9 h-9 rounded-full shrink-0 border border-white/20 bg-cover bg-center"
                    style={{ backgroundImage: `radial-gradient(circle at 32% 28%, ${t.sheen}, transparent 42%), url('${t.img}')` }}
                  />
                  <span className="text-sm">{t.label}</span>
                </button>
              ))}
            </div>

            <button type="button" onClick={startQuote} className="btn-gold w-full sm:w-auto">
              Je veux ce rendu → devis
            </button>
            <p className="mt-4 text-xs text-fg/55 leading-relaxed">
              Votre teinte est reportée automatiquement dans la demande de devis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
