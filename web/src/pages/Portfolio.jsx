import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCategories } from '@/hooks/useApi';
import { fetchProjects, fetchProjectCities } from '@/api/endpoints';
import { Seo } from '@/hooks/useSeo';
import { BeforeAfterSlider } from '@/components/portfolio/BeforeAfterSlider';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

const PER_PAGE = 12;

export default function Portfolio() {
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null);

  const { data: categories } = useCategories();
  const { data: cities } = useQuery({
    queryKey: ['project-cities'],
    queryFn: fetchProjectCities,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['public-projects', { category, city, page }],
    queryFn: () => fetchProjects({
      ...(category !== 'all' ? { category } : {}),
      ...(city !== 'all' ? { city } : {}),
      page,
      per_page: PER_PAGE,
    }),
    keepPreviousData: true,
  });

  // Accumulation des projets quand on clique "Voir plus"
  const [accumulated, setAccumulated] = useState([]);
  useEffect(() => {
    if (!data?.data) return;
    if (page === 1) {
      setAccumulated(data.data);
    } else {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...data.data.filter((p) => !seen.has(p.id))];
      });
    }
  }, [data, page]);

  // Reset à la page 1 quand on change un filtre
  useEffect(() => {
    setPage(1);
  }, [category, city]);

  const hasMore = data?.meta && data.meta.current_page < data.meta.last_page;

  // Lightbox keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && lightbox.images?.length) {
        setLightbox((l) => ({ ...l, index: (l.index + 1) % l.images.length }));
      }
      if (e.key === 'ArrowLeft' && lightbox.images?.length) {
        setLightbox((l) => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length }));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="Portfolio · Fresques, mosaïques, plafonds, epoxy résine — Lartiska"
        description="Réalisations Lartiska : fresques murales, plafonds décoratifs, mosaïques zellige, sols epoxy résine au Sénégal, Gambie, Mauritanie. Filtrer par ville (Dakar, Mbour, Saint-Louis, Touba, Ziguinchor…) ou par technique."
        path="/portfolio"
      />
      <header className="max-w-3xl mb-10 md:mb-14">
        <p className="eyebrow mb-4">— Portfolio</p>
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.04]">
          Nos <em className="gold-em">réalisations</em><br />
          à travers l'Afrique de l'Ouest.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed max-w-xl">
          Du Sénégal à la Mauritanie, en passant par la Gambie — chaque chantier est l'occasion de redéfinir un espace et d'y signer notre art.
        </p>
      </header>

      {/* Filtres : catégories */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-fg/55 mr-2">Catégorie :</span>
          <FilterPill active={category === 'all'} onClick={() => setCategory('all')}>Toutes</FilterPill>
          {(categories || []).map((c) => (
            <FilterPill key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
              {c.name}
            </FilterPill>
          ))}
        </div>

        {/* Filtres : villes */}
        {(cities || []).length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-fg/55 mr-2">Ville :</span>
            <FilterPill active={city === 'all'} onClick={() => setCity('all')}>Toutes</FilterPill>
            {(cities || []).map((c) => (
              <FilterPill key={c} active={city === c} onClick={() => setCity(c)}>
                {c}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      {isLoading && accumulated.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : accumulated.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="font-serif text-2xl mb-3 text-gold">Aucun projet</p>
          <p className="text-fg/70 max-w-md mx-auto">
            Aucune réalisation ne correspond à ces filtres pour le moment.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {accumulated.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setLightbox({ project: p, images: p.images || [], index: 0 })}
                className="project-card group text-left"
                style={{ animationDelay: `${(idx % PER_PAGE) * 40}ms` }}
              >
                {p.cover_image && (
                  <div className="project-img" style={{ backgroundImage: `url('${p.cover_image}')` }} />
                )}
                <div className="project-ring" />
                {/* Cat-tag (palette mosaïque) en haut de la carte */}
                {p.category?.slug && (
                  <span
                    className={clsx(
                      'cat-tag absolute top-3 left-3 z-[3]',
                      `cat-${p.category.slug}`,
                    )}
                  >
                    {p.category.name}
                  </span>
                )}
                <div className="project-meta">
                  <p className="city">{p.city}</p>
                  <h3>{p.title}</h3>
                  <p className="mt-2 text-[11px] tracking-widest uppercase text-gold/85 inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir la galerie →
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                className="btn-ghost disabled:opacity-50"
              >
                {isFetching ? 'Chargement…' : 'Voir plus de réalisations →'}
              </button>
              <p className="text-xs text-fg/45 mt-3">
                {accumulated.length} sur {data?.meta?.total ?? '…'} réalisations
              </p>
            </div>
          )}
        </>
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
        'px-3.5 py-1.5 rounded-full text-xs uppercase tracking-widest border transition-all duration-300',
        active ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/70 hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}

function Lightbox({ lightbox, setLightbox }) {
  const { project, images, index } = lightbox;
  const current = images[index];

  // Si current = 'before', on regarde si la suivante est 'after' pour faire un slider
  const next = images[index + 1];
  const isPair = current?.before_after === 'before' && next?.before_after === 'after';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goNext = () => images.length && setLightbox((l) => ({ ...l, index: (l.index + (isPair ? 2 : 1)) % images.length }));
  const goPrev = () => images.length && setLightbox((l) => ({ ...l, index: (l.index - 1 + images.length) % images.length }));

  const whatsappShare = () => {
    const text = `J'ai vu cette réalisation Lartiska : « ${project.title} »${project.city ? ` à ${project.city}` : ''}. ` +
                 `${window.location.origin}/portfolio/${project.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const wantSimilar = `/devis${project.category?.id ? `?service_id=${project.category.id}` : ''}`;

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

      <div className="flex-1 grid md:grid-cols-[1fr_340px] overflow-hidden">
        <div className="relative overflow-hidden bg-ink p-4 md:p-8 flex items-center justify-center">
          {isPair ? (
            <div className="w-full max-w-3xl">
              <BeforeAfterSlider before={current.url} after={next.url} alt={project.title} />
              <p className="text-center text-xs uppercase tracking-widest text-fg/55 mt-3">
                Glisser pour comparer
              </p>
            </div>
          ) : current ? (
            current.type === 'video' ? (
              <video src={current.url} controls autoPlay className="max-w-full max-h-full object-contain" />
            ) : (
              <img src={current.url} alt={current.caption || project.title} className="max-w-full max-h-full object-contain" />
            )
          ) : (
            <div className="text-fg/55">Pas d'image disponible</div>
          )}

          {images.length > 1 && (
            <>
              <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/70 backdrop-blur-md border border-line text-fg hover:text-gold hover:border-gold grid place-items-center transition-all" aria-label="Précédent">←</button>
              <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/70 backdrop-blur-md border border-line text-fg hover:text-gold hover:border-gold grid place-items-center transition-all" aria-label="Suivant">→</button>
            </>
          )}

          {images.length > 0 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bg/70 backdrop-blur-md border border-line text-xs text-fg/85">
              {index + 1}{isPair ? '–' + (index + 2) : ''} / {images.length}
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
                  onClick={() => setLightbox({ project, images, index: i })}
                  className={clsx(
                    'aspect-square rounded-md overflow-hidden border-2 transition-all relative',
                    i === index ? 'border-gold' : 'border-transparent opacity-65 hover:opacity-100',
                  )}
                >
                  <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  {img.before_after === 'before' && (
                    <span className="absolute bottom-0.5 left-0.5 text-[8px] uppercase tracking-widest bg-bg/80 px-1 rounded">Av</span>
                  )}
                  {img.before_after === 'after' && (
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] uppercase tracking-widest bg-gold/80 text-bg px-1 rounded">Ap</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-3 border-t border-line">
            <Link to={wantSimilar} className="btn-gold w-full !py-2.5 text-xs">
              ✦ Je veux pareil →
            </Link>
            <button onClick={whatsappShare} className="btn-ghost w-full !py-2.5 text-xs">
              Partager sur WhatsApp
            </button>
            <Link to={`/portfolio/${project.slug}`} className="block text-center text-xs uppercase tracking-widest text-fg/55 hover:text-gold pt-2">
              Page dédiée du projet →
            </Link>
          </div>
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
