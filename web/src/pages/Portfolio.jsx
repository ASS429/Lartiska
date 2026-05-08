import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useCategories, useProjects } from '@/hooks/useApi';

export default function Portfolio() {
  const [active, setActive] = useState('all');
  const { data: categories } = useCategories();
  const { data, isLoading } = useProjects(active === 'all' ? {} : { category: active });
  const projects = data?.data || [];

  return (
    <div className="container-art py-16 md:py-24">
      <header className="max-w-2xl mb-14">
        <p className="eyebrow mb-4">— Portfolio</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Quelques <em className="text-gold">œuvres</em><br />
          à travers l'Afrique de l'Ouest.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed">
          Sélection de réalisations Lartiska — fresques, plafonds, mosaïques, design d'intérieur. Cliquez sur un projet pour découvrir la galerie complète.
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
        <p className="text-fg/50">Chargement des réalisations…</p>
      ) : projects.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="font-serif text-2xl mb-3 text-gold">Bientôt</p>
          <p className="text-fg/70 max-w-md mx-auto">
            Le portfolio sera publié au fur et à mesure que Tounkara ajoutera ses chantiers depuis l'admin. En attendant, suis Lartiska sur Instagram pour les dernières créations.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/portfolio/${p.slug}`}
              className="group surface-card overflow-hidden block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-ink">
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-cinema group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5 border-t border-line">
                <p className="text-xs uppercase tracking-widest text-gold/80">{p.category?.name}</p>
                <h2 className="font-serif text-xl mt-2 leading-snug">{p.title}</h2>
                {p.city && <p className="text-fg/55 text-sm mt-1">{p.city}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
