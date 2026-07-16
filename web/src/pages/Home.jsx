import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCategories, useSettings } from '@/hooks/useApi';
import { apiClient } from '@/api/client';
import { Seo } from '@/hooks/useSeo';
import { SectionWipe } from '@/components/layout/SectionWipe';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { BrushStroke } from '@/components/ui/BrushStroke';
import { CraftStory } from '@/components/home/CraftStory';
import { EpoxyStudio } from '@/components/home/EpoxyStudio';

export default function Home() {
  const { data: categories } = useCategories();
  const { data: settings } = useSettings();

  const { data: featuredProjects } = useQuery({
    queryKey: ['public-featured-projects'],
    queryFn: () => apiClient.get('/projects', { params: { featured: 1, per_page: 6 } }).then((r) => r.data),
  });

  const { data: testimonials } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: () => apiClient.get('/testimonials', { params: { limit: 6 } }).then((r) => r.data.data),
  });

  const projects = featuredProjects?.data || [];
  const essence = settings?.['company.essence'] || 'émeraude · or · pièce signature';

  return (
    <>
      <Seo
        title=""
        description="Lartiska — Maître Artisan finition luxe à Mbour, Sénégal. Peinture artistique, fresques murales, plafonnage décoratif, carrelage zellige, mosaïque, epoxy résine. Devis gratuit sous 48h. Intervention partout au Sénégal et à l'international."
        path="/"
      />
      {/* ─── HERO — section conservée (validée par le user) ─── */}
      <section className="hero-video relative min-h-[88vh] grid place-items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/1.jpg"
          className="hero-video__media absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Lartiska.mp4" type="video/mp4" />
        </video>
        <div className="hero-video__overlay absolute inset-0 pointer-events-none" />

        <div className="container-art relative z-10 text-center py-20">
          <p className="eyebrow-deco mb-6">
            <span className="w-6 h-px bg-gold" />
            Lartiska · Partout au Sénégal · International
            <span className="w-6 h-px bg-gold" />
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-shadow-soft">
            L'art qui transforme<br />
            <span className="italic text-gold">vos espaces.</span>
          </h1>
          <BrushStroke className="hero-brush" delay={0.5} />
          <p className="mt-8 max-w-2xl mx-auto text-fg/85 text-base md:text-lg leading-relaxed">
            Peinture, plafonnage, carrelage et décoration d'intérieur réunis dans une démarche artistique sur-mesure. Chaque chantier devient une œuvre.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/devis" className="btn-gold">Demander un devis</Link>
            <Link to="/portfolio" className="btn-ghost">Voir le portfolio</Link>
          </div>
        </div>
      </section>

      {/* ─── EXPLOSION BRIDGE — wipe vidéo V1 + texte ─── */}
      <SectionWipe video="/V1.mp4">
        <section className="container-art py-24 md:py-32 relative z-[5]">
          <div className="max-w-3xl border-l-2 border-gold/40 pl-8 md:pl-12 py-2">
            <p className="eyebrow mb-5">— Notre essence</p>
            <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.05]">
              Une explosion de <em className="gold-em">couleur</em><br />
              dans chaque pièce.
            </h2>
            <p className="mt-7 max-w-xl text-fg/80 leading-[1.75]">
              Chez Lartiska, chaque mur, chaque plafond, chaque carreau devient une toile. Nous transformons vos espaces avec des matières, des teintes et des finitions pensées comme une œuvre d'art.
            </p>
          </div>
        </section>
      </SectionWipe>

      {/* ─── ŒUVRES — triptyque de VRAIES réalisations Lartiska ─── */}
      <section className="container-art py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <figure className="art-frame aspect-[3/4]">
            <LazyVideo src="/videos/oeuvre-marbre.mp4" />
            <figcaption>
              <span className="art-caption-line" />
              <span className="art-caption-text">intérieur marbré · moulures</span>
            </figcaption>
          </figure>
          <figure className="art-frame aspect-[3/4]">
            <LazyVideo src="/videos/oeuvre-art3d.mp4" />
            <figcaption>
              <span className="art-caption-line" />
              <span className="art-caption-text">fresque art 3D</span>
            </figcaption>
          </figure>
          <figure className="art-frame aspect-[3/4]">
            <LazyVideo src="/videos/oeuvre-plafond.mp4" />
            <figcaption>
              <span className="art-caption-line" />
              <span className="art-caption-text">plafond lumière</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ─── SCROLLYTELLING SIGNATURE — Du brut à l'œuvre (pin + scrub) ─── */}
      <CraftStory />

      {/* ─── SERVICES — wipe V5 + eyebrow ✦ + image art-frame "émeraude · or · pièce signature" ─── */}
      <SectionWipe video="/V5.mp4">
        <section id="services" className="py-24 md:py-32 border-y border-line relative z-[5]">
          <div className="container-art">
            <header className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow-deco mb-5">
                <span className="text-gold">✦</span> Nos services <span className="text-gold">✦</span>
              </p>
              <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight">
                L'<em className="gold-em">excellence</em> dans chaque finition.
              </h2>
              <p className="mt-6 text-fg/75 leading-relaxed">
                Une approche artistique appliquée à votre intérieur — du concept à la pose. Chaque chantier est traité comme une pièce unique.
              </p>
            </header>

            {/* Œuvre encadrée — salon émeraude marbré or */}
            <figure className="art-frame max-w-3xl mx-auto aspect-[16/10] mb-14">
              <img src="/1.jpg" alt="Peinture artistique Lartiska au Sénégal — mur d'art émeraude marbré avec veines dorées à la feuille, salon contemporain à Mbour. Maître Artisan Tounkara." loading="lazy" width="1200" height="750" />
              <figcaption>
                <span className="art-caption-line" />
                <span className="art-caption-text">{essence}</span>
              </figcaption>
            </figure>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(categories || []).slice(0, 4).map((c, idx) => (
                <article
                  key={c.id}
                  className="surface-card p-7 transition-transform duration-500 ease-cinema hover:-translate-y-1"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="w-11 h-11 rounded-full grid place-items-center bg-gold/15 text-gold mb-5">
                    <CategoryIcon slug={c.slug} />
                  </div>
                  <h3 className="font-serif text-xl mb-2">{c.name}</h3>
                  <p className="text-fg/70 text-sm leading-relaxed">{c.description}</p>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/services" className="btn-ghost">Voir tous les services</Link>
            </div>
          </div>
        </section>
      </SectionWipe>

      {/* ─── STUDIO EPOXY — teinte en temps réel + devis prérempli ─── */}
      <EpoxyStudio />

      {/* ─── PORTFOLIO TEASER — wipe V4 + project-cards style index.html ─── */}
      <SectionWipe video="/V4.mp4">
        <section className="py-24 md:py-32 relative z-[5]">
          <div className="container-art">
            <header className="max-w-2xl mb-12">
              <p className="eyebrow mb-4">— Portfolio</p>
              <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.04]">
                Nos réalisations, <em className="gold-em">partout</em><br />
                où l'on nous appelle.
              </h2>
              <p className="mt-6 text-fg/75 leading-relaxed max-w-xl">
                Partout au Sénégal — et à l'international pour les projets d'envergure. Chaque chantier est l'occasion de redéfinir un espace et d'y signer notre art.
              </p>
            </header>

            {projects.length === 0 ? (
              <p className="text-fg/55">Bientôt — les premières réalisations seront publiées.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {projects.slice(0, 4).map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/portfolio/${p.slug}`}
                    className="project-card"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {p.cover_image && (
                      <div
                        className="project-img"
                        style={{ backgroundImage: `url('${p.cover_thumbnail || p.cover_image}')` }}
                      />
                    )}
                    <div className="project-ring" />
                    {p.category?.slug && (
                      <span className={`cat-tag absolute top-3 left-3 z-[3] cat-${p.category.slug}`}>
                        {p.category.name}
                      </span>
                    )}
                    <div className="project-meta">
                      <p className="city">{p.city}</p>
                      <h3>{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/portfolio" className="btn-ghost">Tout le portfolio →</Link>
            </div>
          </div>
        </section>
      </SectionWipe>

      {/* ─── TESTIMONIALS — wipe V6 ─── */}
      {testimonials && testimonials.length > 0 && (
        <SectionWipe video="/V6.mp4">
          <section className="py-24 md:py-32 relative z-[5] border-y border-line">
            <div className="container-art">
              <header className="text-center max-w-2xl mx-auto mb-14">
                <p className="eyebrow-deco mb-5">
                  <span className="text-gold">✦</span> Ils nous font confiance <span className="text-gold">✦</span>
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-light">Témoignages</h2>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.slice(0, 6).map((t) => (
                  <article key={t.id} className="surface-card p-7 flex flex-col gap-4">
                    {t.rating && (
                      <p className="text-gold text-sm tracking-widest">{'★'.repeat(t.rating)}</p>
                    )}
                    <blockquote className="font-serif text-lg italic leading-relaxed flex-1">
                      « {t.content} »
                    </blockquote>
                    <footer className="pt-3 border-t border-line">
                      <p className="font-medium">{t.client_name}</p>
                      <p className="text-xs text-fg/55 uppercase tracking-widest mt-1">
                        {[t.client_role, t.city].filter(Boolean).join(' · ')}
                      </p>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </SectionWipe>
      )}

      {/* ─── DERNIERS TRAVAUX (en bandeau si > 4 projets) ─── */}
      {projects.length > 4 && (
        <section className="container-art py-24 md:py-32">
          <header className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <p className="eyebrow mb-3">— Derniers travaux</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light">Tout récents</h2>
            </div>
            <Link to="/portfolio" className="text-xs uppercase tracking-widest text-gold border-b border-gold/40 hover:border-gold pb-1">
              Tout voir →
            </Link>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {projects.slice(4, 8).map((p) => (
              <Link key={p.id} to={`/portfolio/${p.slug}`} className="project-card">
                {p.cover_image && (
                  <div className="project-img" style={{ backgroundImage: `url('${p.cover_thumbnail || p.cover_image}')` }} />
                )}
                <div className="project-ring" />
                {p.category?.slug && (
                  <span className={`cat-tag absolute top-3 left-3 z-[3] cat-${p.category.slug}`}>
                    {p.category.name}
                  </span>
                )}
                <div className="project-meta">
                  <p className="city">{p.city}</p>
                  <h3>{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA FINAL — wipe Pinceau ─── */}
      <SectionWipe video="/Pinceau.mp4">
        <section className="py-24 md:py-32 text-center relative z-[5]">
          <div className="container-art">
            <p className="eyebrow-deco mb-5">
              <span className="text-gold">✦</span> Prêt à commencer <span className="text-gold">✦</span>
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight max-w-3xl mx-auto">
              Discutons de votre projet.<br />
              <em className="gold-em">Devis offert sous 48h.</em>
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/devis" className="btn-gold">Lancer mon devis</Link>
              <Link to="/contact" className="btn-ghost">Nous contacter</Link>
            </div>
          </div>
        </section>
      </SectionWipe>
    </>
  );
}

function CategoryIcon({ slug }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (slug) {
    case 'peinture-fresques':
      return <svg {...common}><path d="M18 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2"/><path d="M18 5h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7"/><path d="M5 12v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h7"/><circle cx="10" cy="20" r="2"/></svg>;
    case 'plafonnage':
      return <svg {...common}><rect x="3" y="3" width="18" height="6" rx="1"/><path d="M3 9v12"/><path d="M21 9v12"/><path d="M3 21h18"/></svg>;
    case 'carrelage':
      return <svg {...common}><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>;
    case 'decoration':
    case 'sur-mesure':
      return <svg {...common}><path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
    case 'maconnerie':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18"/><path d="M3 14h18"/><path d="M9 4v5"/><path d="M15 9v5"/><path d="M9 14v6"/></svg>;
    case 'charpente':
      return <svg {...common}><path d="M3 20 12 5l9 15"/><path d="M7.5 13.5h9"/><path d="M5.5 17h13"/><path d="M12 5v15"/></svg>;
    case 'couverture':
      return <svg {...common}><path d="M2 12 12 4l10 8"/><path d="M5 10v9h14v-9"/><path d="M5 14h14"/></svg>;
    case 'facade-platrerie':
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h3v3H8z"/><path d="M13 7h3v3h-3z"/><path d="M8 13h3v3H8z"/><path d="M13 13h3v3h-3z"/></svg>;
    case 'isolation':
      return <svg {...common}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="M12 8v5"/><path d="M9.5 10.5h5"/></svg>;
    case 'menuiserie':
      return <svg {...common}><path d="M4 20 17 7l3 3L7 23z"/><path d="m14 10 3 3"/><path d="M4 20l3 3"/><path d="M19 2l3 3-2 2-3-3z"/></svg>;
    case 'ameublement':
      return <svg {...common}><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 0 1 4 0v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/><path d="M5 19v2"/><path d="M19 19v2"/></svg>;
    case 'espaces-verts':
      return <svg {...common}><path d="M12 21c4-3 8-6.5 8-11a8 8 0 0 0-16 0c0 4.5 4 8 8 11z"/><path d="M12 21V10"/><path d="M12 13l3-3"/><path d="M12 16l-3-3"/></svg>;
    case 'etancheite':
      return <svg {...common}><path d="M12 3c3.5 4.5 6 7.7 6 11a6 6 0 0 1-12 0c0-3.3 2.5-6.5 6-11z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M7 12h10"/></svg>;
  }
}
