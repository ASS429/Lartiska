import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useCategories, useProjects } from '@/hooks/useApi';

export default function Portfolio() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null); // { project, index }
  const { data: categories } = useCategories();
  const { data, isLoading } = useProjects(active === 'all' ? { per_page: 30 } : { category: active, per_page: 30 });
  const projects = data?.data || [];

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && lightbox.project.images?.length) {
        setLightbox((l) => ({ ...l, index: (l.index + 1) % l.project.images.length }));
      }
      if (e.key === 'ArrowLeft' && lightbox.project.images?.length) {
        setLightbox((l) => ({ ...l, index: (l.index - 1 + l.project.images.length) % l.project.images.length }));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div className="container-art py-16 md:py-24">
      <header className="max-w-3xl mb-12 md:mb-14">
        <p className="eyebrow mb-4">— Portfolio</p>
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.04]">
          Nos <em className="text-gold not-italic">réalisations</em><br />
          à travers l'Afrique de l'Ouest.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed max-w-xl">
          Du Sénégal à la Mauritanie, en passant par la Gambie — chaque chantier est l'occasion de redéfinir un espace et d'y signer notre art.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <FilterPill active={active === 'all'} onClick={() => setActive('all')}>Toutes</FilterPill>
        {(categories || []).map((c) => (
          <FilterPill key={c.id} active={active === c.slug} onClick={() => setActive(c.slug)}>
            {c.name}
          </FilterPill>
        ))}
      </div>

      {isLoading ? (
        <p className="text-fg/55">Chargement des réalisations…</p>
      ) : projects.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="font-serif text-2xl mb-3 text-gold">Bientôt</p>
          <p className="text-fg/70 max-w-md mx-auto">
            Aucun projet ne correspond à ce filtre pour le moment. En attendant, suis Lartiska sur Instagram pour les dernières créations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setLightbox({ project: p, index: 0 })}
              className="project-card text-left"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {p.cover_image && (
                <div className="project-img" style={{ backgroundImage: `url('${p.cover_image}')` }} />
              )}
              <div className="project-ring" />
              <div className="project-meta">
                <p className="city">{p.city || p.category?.name}</p>
                <h3>{p.title}</h3>
                <p className="mt-2 text-[11px] tracking-widest uppercase text-gold/85 inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Voir la galerie →
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightbox && <Lightbox lightbox={lightbox} setLightbox={setLightbox} />}
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all duration-300',
        active ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/70 hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}

function Lightbox({ lightbox, setLightbox }) {
  const { project, index } = lightbox;
  const images = project.images || [];
  const current = images[index];

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const next = () => images.length && setLightbox((l) => ({ ...l, index: (l.index + 1) % images.length }));
  const prev = () => images.length && setLightbox((l) => ({ ...l, index: (l.index - 1 + images.length) % images.length }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}
    >
      <header className="flex items-start justify-between gap-6 p-6 md:p-10 border-b border-line">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{project.category?.name}{project.city ? ` · ${project.city}` : ''}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight">{project.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => setLightbox(null)}
          className="shrink-0 w-11 h-11 rounded-full border border-line text-fg/75 hover:text-rust hover:border-rust grid place-items-center transition-all"
          aria-label="Fermer"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 grid md:grid-cols-[1fr_320px] overflow-hidden">
        <div className="relative overflow-hidden bg-ink">
          {current ? (
            current.type === 'video' ? (
              <video src={current.url} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <img src={current.url} alt={current.caption || project.title} className="w-full h-full object-contain" />
            )
          ) : (
            <div className="grid place-items-center h-full text-fg/55">Pas d'image disponible</div>
          )}

          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/70 backdrop-blur-md border border-line text-fg hover:text-gold hover:border-gold grid place-items-center transition-all" aria-label="Précédent">←</button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/70 backdrop-blur-md border border-line text-fg hover:text-gold hover:border-gold grid place-items-center transition-all" aria-label="Suivant">→</button>
            </>
          )}

          {images.length > 0 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bg/70 backdrop-blur-md border border-line text-xs text-fg/85">
              {index + 1} / {images.length}
            </span>
          )}
        </div>

        <aside className="p-6 md:p-8 overflow-y-auto border-t md:border-t-0 md:border-l border-line space-y-5">
          {project.description && (
            <p className="text-fg/85 leading-relaxed">{project.description}</p>
          )}

          <dl className="space-y-3 text-sm">
            {project.city && <Row label="Ville" value={project.city} />}
            {project.materials && <Row label="Matériaux" value={project.materials} />}
            {project.duration && <Row label="Durée" value={project.duration} />}
            {project.completed_at && <Row label="Livré" value={project.completed_at} />}
          </dl>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-line">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightbox({ project, index: i })}
                  className={clsx(
                    'aspect-square rounded-md overflow-hidden border-2 transition-all',
                    i === index ? 'border-gold' : 'border-transparent opacity-65 hover:opacity-100',
                  )}
                >
                  <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <Link to={`/portfolio/${project.slug}`} className="btn-ghost w-full text-xs">
            Page dédiée du projet →
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-[0.32em] text-gold mb-0.5">{label}</dt>
      <dd className="text-fg/85">{value}</dd>
    </div>
  );
}
