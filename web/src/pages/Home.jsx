import { Link } from 'react-router-dom';
import { useCategories, useServices } from '@/hooks/useApi';
import { formatPriceRange } from '@/utils/format';

export default function Home() {
  const { data: categories } = useCategories();
  const { data: services } = useServices();
  const featuredServices = (services || []).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] grid place-items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/1.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-screen dark:opacity-55"
        >
          <source src="/Lartiska.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/55 to-bg pointer-events-none" />

        <div className="container-art relative z-10 text-center py-20">
          <p className="eyebrow mb-6">✦ Lartiska · Sénégal · Gambie · Mauritanie ✦</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-shadow-soft">
            L'art qui transforme<br />
            <span className="italic text-gold">vos espaces.</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-fg/80 text-base md:text-lg leading-relaxed">
            Peinture, plafonnage, carrelage et décoration d'intérieur réunis dans une démarche artistique sur-mesure. Chaque chantier devient une œuvre.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/devis" className="btn-gold">Demander un devis</Link>
            <Link to="/portfolio" className="btn-ghost">Voir le portfolio</Link>
          </div>
        </div>
      </section>

      {/* ESSENCE */}
      <section className="container-art py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="eyebrow mb-5">— Notre essence</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              Une explosion de <em className="text-gold">couleur</em><br />
              dans chaque pièce.
            </h2>
            <p className="mt-6 text-fg/75 leading-relaxed">
              Chez Lartiska, chaque mur, chaque plafond, chaque carreau devient une toile. Nous transformons vos espaces avec des matières, des teintes et des finitions pensées comme une œuvre d'art.
            </p>
            <Link to="/about" className="inline-flex mt-7 text-gold font-medium text-sm border-b border-gold/40 pb-1 hover:border-gold transition-colors">
              Notre histoire →
            </Link>
          </div>

          <figure className="relative aspect-[3/4] surface-card overflow-hidden grain">
            <video src="/V3.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5 flex items-center gap-3 bg-gradient-to-t from-ink/90 to-transparent">
              <span className="block w-10 h-px bg-gold" />
              <span className="font-serif italic text-sm text-gold tracking-wider">œuvre #001</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="bg-ink-soft/40 py-24 md:py-32 border-y border-line">
        <div className="container-art">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-4">✦ Nos services ✦</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
              L'<em className="text-gold">excellence</em> dans chaque finition.
            </h2>
            <p className="mt-5 text-fg/70 leading-relaxed">
              Une approche artistique appliquée à votre intérieur — du concept à la pose. Chaque chantier est traité comme une pièce unique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {(categories || []).slice(0, 3).map((c) => (
              <article key={c.id} className="surface-card p-8 transition-transform duration-500 ease-cinema hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full grid place-items-center bg-gold/15 text-gold mb-5">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10" /><path d="M7 12h10" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl mb-3">{c.name}</h3>
                <p className="text-fg/65 text-sm leading-relaxed">{c.description}</p>
              </article>
            ))}
          </div>

          {featuredServices.length > 0 && (
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {featuredServices.map((s) => (
                <div key={s.id} className="border border-line p-5 rounded-xl">
                  <p className="text-xs uppercase tracking-widest text-gold mb-2">{s.category?.name}</p>
                  <p className="font-serif text-lg leading-snug">{s.title}</p>
                  <p className="mt-2 text-sm text-fg/60">{formatPriceRange(s.price_from, s.price_to)} <span className="text-fg/40">/ {s.unit}</span></p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services" className="btn-ghost">Voir tous les services</Link>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="container-art py-24 md:py-32 text-center">
        <p className="eyebrow mb-5">✦ Prêt à commencer ✦</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight max-w-3xl mx-auto">
          Discutons de votre projet. <em className="text-gold">Devis offert sous 48h.</em>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/devis" className="btn-gold">Lancer mon devis</Link>
          <Link to="/contact" className="btn-ghost">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
