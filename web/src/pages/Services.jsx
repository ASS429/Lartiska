import { useState } from 'react';
import { useCategories, useServices } from '@/hooks/useApi';
import { formatPriceRange } from '@/utils/format';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Services() {
  const [active, setActive] = useState('all');
  const { data: categories } = useCategories();
  const { data: services, isLoading } = useServices(active === 'all' ? {} : { category: active });

  return (
    <div className="container-art py-16 md:py-24">
      <header className="max-w-2xl mb-14">
        <p className="eyebrow mb-4">— Services & Tarifs</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Une approche artistique<br />
          <em className="text-gold">à chaque étape</em>.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed">
          Du concept au chantier, chaque prestation est étudiée sur-mesure. Les fourchettes ci-dessous sont indicatives — un devis détaillé est toujours offert.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActive('all')}
          className={clsx(
            'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300',
            active === 'all' ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/70 hover:text-gold',
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
              'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300',
              active === c.slug ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/70 hover:text-gold',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-fg/50">Chargement…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {(services || []).map((s) => (
            <article key={s.id} className="surface-card p-7 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-gold mb-2">{s.category?.name}</p>
                  <h2 className="font-serif text-2xl leading-snug">{s.title}</h2>
                </div>
                <span className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-line text-fg/70">{s.unit}</span>
              </div>
              <p className="text-sm text-fg/70 leading-relaxed flex-1">{s.description}</p>
              <div className="flex items-end justify-between border-t border-line pt-4">
                <p className="font-serif text-xl text-gold">{formatPriceRange(s.price_from, s.price_to)}</p>
                <Link to="/devis" className="text-xs uppercase tracking-widest text-fg/70 hover:text-gold border-b border-line hover:border-gold pb-0.5">
                  Devis →
                </Link>
              </div>
            </article>
          ))}
          {(services || []).length === 0 && (
            <p className="text-fg/50">Aucun service dans cette catégorie pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
}
