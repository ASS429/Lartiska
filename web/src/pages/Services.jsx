import { useState } from 'react';
import { useCategories, useServices } from '@/hooks/useApi';
import { formatPriceRange } from '@/utils/format';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Seo } from '@/hooks/useSeo';

const CATEGORY_ICON = {
  'peinture-fresques': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
      <path d="M18 5h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7" />
      <path d="M5 12v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h7" />
      <circle cx="10" cy="20" r="2" />
    </svg>
  ),
  'plafonnage': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="6" rx="1" />
      <path d="M3 9v12" /><path d="M21 9v12" /><path d="M3 21h18" />
    </svg>
  ),
  'carrelage': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  ),
  'decoration': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  ),
};

export default function Services() {
  const [active, setActive] = useState('all');
  const { data: categories } = useCategories();
  const { data: services, isLoading } = useServices(active === 'all' ? {} : { category: active });

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="Services & Tarifs"
        description="Peinture artistique, plafonnage décoratif, carrelage design, décoration d'intérieur. Tarifs indicatifs, devis gratuit sous 48h."
        path="/services"
      />
      <header className="max-w-2xl mb-14">
        <p className="eyebrow mb-4">— Services & Tarifs</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Une approche artistique<br />
          <em className="gold-em">à chaque étape</em>.
        </h1>
        <p className="mt-6 text-fg/85 leading-relaxed">
          Du concept au chantier, chaque prestation est étudiée sur-mesure. Les fourchettes ci-dessous sont indicatives — un devis détaillé est toujours offert.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActive('all')}
          className={clsx(
            'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300 font-semibold',
            active === 'all' ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/80 hover:text-gold',
          )}
        >
          Tout
        </button>
        {(categories || []).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.slug)}
            className={clsx(
              'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300 font-semibold',
              active === c.slug ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/80 hover:text-gold',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-fg/55">Chargement…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {(services || []).map((s) => {
            const slug = s.category?.slug || '';
            return (
              <article key={s.id} className={clsx('service-card p-8 md:p-9 flex flex-col gap-5', slug && `cat-${slug}`)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Icon block coloré selon la catégorie (palette mosaïque) */}
                    <div
                      className="shrink-0 w-12 h-12 rounded-full grid place-items-center shadow-sm"
                      style={{
                        color: 'currentColor',
                        background: 'currentColor',
                        opacity: 1,
                      }}
                    >
                      <span style={{ color: 'rgb(var(--bg-rgb))', display: 'flex' }}>
                        {CATEGORY_ICON[slug] || (
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.32em] font-semibold mb-2" style={{ color: 'currentColor' }}>
                        {s.category?.name}
                      </p>
                      <h2 className="font-serif text-2xl md:text-[26px] leading-tight text-fg">{s.title}</h2>
                    </div>
                  </div>
                  {s.unit && (
                    <span className="shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-line text-fg/80 font-medium uppercase tracking-wider">
                      {s.unit}
                    </span>
                  )}
                </div>

                <p className="text-[15px] text-fg/85 leading-[1.7] flex-1">{s.description}</p>

                <div className="flex items-end justify-between border-t border-line pt-5 mt-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-fg/65 font-semibold mb-1">À partir de</p>
                    <p className="font-serif text-2xl md:text-[28px] text-gold leading-none tabular-nums">
                      {formatPriceRange(s.price_from, s.price_to)}
                    </p>
                  </div>
                  <Link
                    to="/devis"
                    className="text-[11px] uppercase tracking-widest font-semibold text-fg/85 hover:text-gold border-b border-line hover:border-gold pb-0.5 transition-colors"
                  >
                    Demander un devis →
                  </Link>
                </div>
              </article>
            );
          })}
          {(services || []).length === 0 && (
            <p className="text-fg/60">Aucun service dans cette catégorie pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
}
