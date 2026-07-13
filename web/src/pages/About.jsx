import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useApi';
import { Seo } from '@/hooks/useSeo';

/**
 * Carte membre de l'équipe. Si la photo n'est pas (encore) disponible,
 * bascule sur un placeholder élégant — initiales dorées sur fond sombre.
 */
function TeamCard({ name, role, photo, initials }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className="surface-card overflow-hidden">
      <figure className="art-frame aspect-[4/5] m-0 rounded-none border-0 border-b border-line">
        {imgOk ? (
          <img
            src={photo}
            alt={`${name} — ${role}, Lartiska`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-ink">
            <span className="font-serif text-6xl text-gold/70 tracking-widest">{initials}</span>
          </div>
        )}
        <figcaption>
          <span className="art-caption-line" />
          <span className="art-caption-text">{name.split(' ')[0]}</span>
        </figcaption>
      </figure>
      <div className="p-6">
        <h3 className="font-serif text-2xl">{name}</h3>
        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-gold font-semibold">{role}</p>
      </div>
    </article>
  );
}

const STEPS = [
  {
    n: '01',
    title: 'Demande de devis',
    lead: 'Formulaire en 4 étapes ou WhatsApp direct. On reçoit la demande immédiatement.',
  },
  {
    n: '02',
    title: 'Visite ou échange',
    lead: 'Visite du chantier ou échange détaillé pour comprendre vos envies, contraintes, budget.',
  },
  {
    n: '03',
    title: 'Devis officiel',
    lead: 'Sous 24 à 48h : PDF détaillé avec matériaux, prix, planning. Validité 30 jours.',
  },
  {
    n: '04',
    title: 'Exécution artisanale',
    lead: 'Acompte 40%. Tounkara et son équipe interviennent sur place. Atelier patient, finition impeccable.',
  },
  {
    n: '05',
    title: 'Livraison & garantie',
    lead: 'Validation conjointe, solde 60%. Garantie 1 an sur les finitions. Retouches gratuites.',
  },
];

const GUARANTEES = [
  { icon: '⌛', title: 'Garantie 1 an', lead: 'Sur toutes les finitions Lartiska. Retouches sans frais en cas de défaut.' },
  { icon: '✦', title: 'Devis gratuit', lead: 'Sans engagement. PDF officiel détaillé sous 48h ouvrées.' },
  { icon: '⚒', title: 'Matériaux haut de gamme', lead: 'Acryliques haute couvrance, dorures à la feuille, zellige cuit, plâtre fin.' },
  { icon: '✉', title: 'Suivi personnalisé', lead: "Tounkara est en lien direct avec vous, du croquis à la livraison." },
];

export default function About() {
  const { data: settings } = useSettings();
  const cities = settings?.['cities.served'] || ['Dakar', 'Thiès', 'Saint-Louis', 'Tivaoune', 'Touba', 'Ziguinchor', 'Banjul (Gambie)', 'Nouakchott (Mauritanie)'];

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="À propos · Tounkara, Maître Artisan finition luxe à Mbour"
        description="Découvrez Tounkara — Maître Artisan finition luxe, fondateur de Lartiska à Mbour, Sénégal. 15 ans d'expérience en peinture artistique, fresques, plafonnage, carrelage zellige, mosaïque, epoxy résine. Nos garanties, zones d'intervention."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Tounkara',
          jobTitle: 'Maître Artisan · Finition luxe',
          worksFor: { '@type': 'LocalBusiness', name: 'Lartiska' },
          address: { '@type': 'PostalAddress', addressLocality: 'Mbour', addressCountry: 'SN' },
          knowsAbout: ['Peinture artistique', 'Fresques murales', 'Plafonnage décoratif', 'Carrelage zellige', 'Mosaïque', 'Epoxy résine', 'Décoration d\'intérieur'],
          sameAs: ['https://lartiska-portfolio.onrender.com'],
        }}
      />

      <header className="max-w-3xl">
        <p className="eyebrow mb-4">— À propos</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          L'art comme <em className="gold-em">manière de vivre</em><br />
          un espace.
        </h1>
        <p className="mt-6 text-fg/85 leading-relaxed text-lg">
          Lartiska est une entreprise du <strong className="text-gold font-semibold">second œuvre</strong> —
          tout ce qui transforme un bâtiment brut en espace de vie. Fondée par Tounkara,
          <strong className="text-gold font-semibold"> Maître Artisan en finition luxe</strong>, elle réunit
          peinture &amp; design d'intérieur, menuiserie, ameublement, carrelage, plafonnage, étanchéité
          et aménagement d'espaces verts — chaque intervention traitée avec la même exigence artistique.
        </p>
      </header>

      {/* ─── L'artiste — carte portrait Tounkara + lien portfolio externe ─── */}
      <section className="mt-16 md:mt-20">
        <div className="surface-card overflow-hidden grid md:grid-cols-[minmax(0,1fr)_1.4fr] gap-0">
          <figure className="art-frame aspect-[4/5] md:aspect-auto md:min-h-[420px] m-0 rounded-none border-0 border-r border-line">
            <img
              src="/tounkara-portrait.jpeg"
              alt="Tounkara, Maître Artisan finition luxe — fondateur de Lartiska à Mbour, Sénégal. Spécialiste peinture artistique, fresques murales, plafonnage, carrelage zellige, mosaïque et epoxy résine."
              loading="lazy"
              width="800"
              height="1000"
            />
            <figcaption>
              <span className="art-caption-line" />
              <span className="art-caption-text">Tounkara · Mbour</span>
            </figcaption>
          </figure>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="eyebrow mb-4">— L'artiste</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight">
              Ahmadou Moustapha Tounkara,<br />fondateur de <em className="gold-em">Lartiska</em>.
            </h2>
            <p className="mt-3 text-[11px] uppercase tracking-[0.32em] text-gold font-semibold">
              Maître Artisan · Finition luxe
            </p>
            <p className="mt-5 text-fg/85 leading-relaxed">
              Artiste polyvalent — peintre, plafonneur, carreleur, poseur d'epoxy résine et designer
              d'intérieur — Tounkara signe chaque chantier comme une pièce unique. À ses côtés, ses
              deux frères aînés Malick et Moussa, piliers de l'entreprise, portent avec lui chaque
              projet — de l'étude à la livraison, partout où les chantiers les appellent.
            </p>
            <p className="mt-4 text-fg/75 text-sm leading-relaxed">
              Découvrez son portfolio personnel — croquis, études, projets antérieurs et œuvres
              d'atelier qui nourrissent l'univers Lartiska.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://lartiska-portfolio.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2"
              >
                Voir son portfolio
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                </svg>
              </a>
              <Link to="/contact" className="btn-ghost">Rencontrer Tounkara →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── L'équipe — les frères Tounkara ─── */}
      <section className="mt-20" id="equipe">
        <header className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">— L'équipe</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            Une affaire de <em className="gold-em">frères</em>.
          </h2>
          <p className="mt-5 text-fg/85 leading-relaxed">
            Aux côtés d'Ahmadou Moustapha, ses deux frères aînés — <strong className="text-gold font-semibold">Malick</strong> et{' '}
            <strong className="text-gold font-semibold">Moussa Tounkara</strong> — sont des piliers incontournables
            de Lartiska. Ensemble, ils portent chaque chantier de l'étude à la livraison.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
          <TeamCard
            name="Malick Tounkara"
            role="Pilier de l'entreprise · Frère aîné"
            photo="/img/malick-tounkara.webp"
            initials="MT"
          />
          <TeamCard
            name="Moussa Tounkara"
            role="Pilier de l'entreprise · Frère aîné"
            photo="/img/moussa-tounkara.webp"
            initials="MT"
          />
        </div>
      </section>

      <section className="mt-20 grid md:grid-cols-3 gap-8 md:gap-10">
        <div>
          <p className="font-serif text-5xl text-gold">01</p>
          <h2 className="font-serif text-2xl mt-3">Vision</h2>
          <p className="mt-3 text-fg/85 leading-relaxed">
            Transformer chaque mur, chaque plafond, chaque carreau en toile. Faire entrer l'art chez chacun,
            sans concession sur la matière, la couleur ou la finition.
          </p>
        </div>
        <div>
          <p className="font-serif text-5xl text-gold">02</p>
          <h2 className="font-serif text-2xl mt-3">Méthode</h2>
          <p className="mt-3 text-fg/85 leading-relaxed">
            Du croquis à la pose, chaque chantier est traité comme une pièce signature. Matériaux choisis,
            exécution patiente, finitions impeccables.
          </p>
        </div>
        <div>
          <p className="font-serif text-5xl text-gold">03</p>
          <h2 className="font-serif text-2xl mt-3">Présence</h2>
          <p className="mt-3 text-fg/85 leading-relaxed">
            Lartiska intervient partout au Sénégal, et se déplace à l'international pour les projets
            d'envergure — résidences privées, espaces commerciaux, hôtels, restaurants.
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mt-24" id="comment-ca-marche">
        <header className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">— Comment ça marche</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            5 étapes, de la première idée<br />
            <em className="gold-em">à l'œuvre livrée</em>.
          </h2>
        </header>
        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="surface-card p-5 flex flex-col gap-3">
              <p className="font-serif text-3xl text-gold">{s.n}</p>
              <h3 className="font-serif text-lg leading-snug">{s.title}</h3>
              <p className="text-fg/80 text-sm leading-relaxed">{s.lead}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Garanties */}
      <section className="mt-24" id="garanties">
        <header className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">— Garanties</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            Notre <em className="gold-em">engagement</em> de qualité.
          </h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUARANTEES.map((g) => (
            <article key={g.title} className="surface-card p-6">
              <p className="font-serif text-3xl text-gold mb-3">{g.icon}</p>
              <h3 className="font-serif text-lg mb-2">{g.title}</h3>
              <p className="text-fg/80 text-sm leading-relaxed">{g.lead}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Zones desservies */}
      <section className="mt-24" id="zones">
        <header className="max-w-2xl mb-8">
          <p className="eyebrow mb-3">— Zones desservies</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            Partout au Sénégal · <em className="gold-em">et à l'international</em>.
          </h2>
          <p className="mt-5 text-fg/85 leading-relaxed">
            Où que soit votre chantier au Sénégal, nous venons. Pour les projets d'envergure, nous nous
            déplaçons aussi à l'étranger. Les villes ci-dessous sont nos bases les plus fréquentes —
            d'éventuels frais de déplacement sont toujours indiqués clairement dans le devis.
          </p>
        </header>
        <div className="surface-card p-8">
          <ul className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <li key={city} className="px-4 py-2 rounded-full border border-line text-sm text-fg/90 hover:border-gold/60 transition-colors">
                {city}
              </li>
            ))}
          </ul>
          <p className="text-xs text-fg/65 mt-6">
            Une autre ville ? <Link to="/contact" className="text-gold hover:underline">Contactez-nous</Link> —
            nous nous déplaçons sur projet.
          </p>
        </div>
      </section>

      <section className="mt-24 text-center">
        <p className="font-serif text-3xl md:text-4xl max-w-3xl mx-auto leading-tight">
          « Chaque espace mérite d'avoir sa propre <em className="gold-em">œuvre</em>. »
        </p>
        <p className="mt-3 text-fg/70 text-sm uppercase tracking-widest">— Tounkara, fondateur de Lartiska</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/devis" className="btn-gold">Lancer mon projet</Link>
          <Link to="/faq" className="btn-ghost">Voir la FAQ →</Link>
        </div>
      </section>
    </div>
  );
}
