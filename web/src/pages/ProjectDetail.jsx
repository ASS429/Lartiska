import { useParams, Link } from 'react-router-dom';
import { useProject } from '@/hooks/useApi';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return <div className="container-art py-24"><p className="text-fg/50">Chargement du projet…</p></div>;
  }

  if (isError || !data) {
    return (
      <div className="container-art py-24 text-center">
        <p className="font-serif text-3xl mb-4">Projet introuvable</p>
        <Link to="/portfolio" className="btn-ghost">← Retour au portfolio</Link>
      </div>
    );
  }

  return (
    <article className="container-art py-16 md:py-24">
      <Link to="/portfolio" className="text-xs uppercase tracking-widest text-fg/55 hover:text-gold transition-colors">
        ← Portfolio
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="eyebrow mb-3">{data.category?.name}</p>
        <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight">{data.title}</h1>
        <p className="mt-6 text-fg/75 leading-relaxed">{data.description}</p>
      </header>

      {data.cover_image && (
        <figure className="mt-10 surface-card overflow-hidden">
          <img src={data.cover_image} alt={data.title} className="w-full h-auto object-cover" />
        </figure>
      )}

      <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.city && (
          <div className="border-l-2 border-gold/40 pl-4">
            <dt className="text-xs uppercase tracking-widest text-gold mb-1">Ville</dt>
            <dd className="font-serif text-lg">{data.city}</dd>
          </div>
        )}
        {data.materials && (
          <div className="border-l-2 border-gold/40 pl-4">
            <dt className="text-xs uppercase tracking-widest text-gold mb-1">Matériaux</dt>
            <dd className="font-serif text-lg">{data.materials}</dd>
          </div>
        )}
        {data.duration && (
          <div className="border-l-2 border-gold/40 pl-4">
            <dt className="text-xs uppercase tracking-widest text-gold mb-1">Durée</dt>
            <dd className="font-serif text-lg">{data.duration}</dd>
          </div>
        )}
        {data.completed_at && (
          <div className="border-l-2 border-gold/40 pl-4">
            <dt className="text-xs uppercase tracking-widest text-gold mb-1">Livré</dt>
            <dd className="font-serif text-lg">{data.completed_at}</dd>
          </div>
        )}
      </dl>

      {data.images?.length > 0 && (
        <section className="mt-14">
          <p className="eyebrow mb-6">Galerie</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.images.map((img) => (
              <figure key={img.id} className="aspect-square overflow-hidden surface-card">
                <img src={img.url} alt={img.caption || data.title} loading="lazy" className="w-full h-full object-cover" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 surface-card p-10 text-center">
        <p className="eyebrow mb-3">Inspiré ?</p>
        <h2 className="font-serif text-3xl">Discutons de votre projet.</h2>
        <Link to="/devis" className="btn-gold mt-7">Demander un devis</Link>
      </div>
    </article>
  );
}
