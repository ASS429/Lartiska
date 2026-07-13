import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/hooks/useSeo';

/**
 * JSON-LD LocalBusiness — injecté sitewide via Layout.
 *
 * Permet à Google de comprendre que Lartiska est une entreprise locale,
 * d'afficher des rich snippets (téléphone, adresse, prix, zone desservie)
 * et de prioriser le site dans les recherches "près de moi" / locales.
 *
 * Schema.org reference : https://schema.org/LocalBusiness
 */
export function BusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Lartiska',
    alternateName: 'Lartiska — Atelier Tounkara',
    description: "Entreprise du second œuvre et Maître Artisan finition luxe au Sénégal. Peinture artistique et design d'intérieur, menuiserie, ameublement, carrelage, plafonnage, étanchéité, espaces verts, epoxy résine. Atelier Tounkara à Mbour — intervention partout au Sénégal et à l'international.",
    url: SITE_URL,
    logo: `${SITE_URL}/lartiska-logo.jpg`,
    image: [
      `${SITE_URL}/1.jpg`,
      `${SITE_URL}/tounkara-portrait.jpeg`,
    ],
    telephone: ['+221785446363', '+221773468681', '+221772898537'],
    email: 'contact@lartiska.sn',
    priceRange: '$$-$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mbour',
      addressRegion: 'Thiès',
      addressCountry: 'SN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 14.4197,
      longitude: -16.9646,
    },
    areaServed: [
      // Tout le Sénégal + déplacements internationaux pour les gros projets
      { '@type': 'Country', name: 'Sénégal' },
      { '@type': 'AdministrativeArea', name: 'Afrique de l\'Ouest' },
      { '@type': 'Country', name: 'Gambie' },
      { '@type': 'Country', name: 'Mauritanie' },
      { '@type': 'City', name: 'Dakar' },
      { '@type': 'City', name: 'Saint-Louis' },
      { '@type': 'City', name: 'Thiès' },
      { '@type': 'City', name: 'Mbour' },
      { '@type': 'City', name: 'Touba' },
      { '@type': 'City', name: 'Ziguinchor' },
    ],
    founder: {
      '@type': 'Person',
      name: 'Ahmadou Moustapha Tounkara',
      jobTitle: 'Maître Artisan · Finition luxe',
      worksFor: { '@id': `${SITE_URL}/#business` },
    },
    employee: [
      {
        '@type': 'Person',
        name: 'Malick Tounkara',
        jobTitle: 'Pilier de l\'entreprise',
        worksFor: { '@id': `${SITE_URL}/#business` },
      },
      {
        '@type': 'Person',
        name: 'Moussa Tounkara',
        jobTitle: 'Pilier de l\'entreprise',
        worksFor: { '@id': `${SITE_URL}/#business` },
      },
    ],
    knowsAbout: [
      'Second œuvre',
      'Peinture artistique',
      'Fresques murales',
      'Trompe-l\'œil',
      'Plafonnage décoratif',
      'Faux plafonds',
      'Carrelage zellige',
      'Mosaïque',
      'Epoxy résine',
      'Revêtement sol résine',
      'Décoration d\'intérieur',
      'Design d\'intérieur',
      'Dorure à la feuille',
      'Menuiserie',
      'Ameublement sur mesure',
      'Étanchéité',
      'Espaces verts',
      'Maçonnerie',
      'Charpente',
      'Isolation',
    ],
    makesOffer: [
      { '@type': 'Offer', name: 'Peinture & fresques murales', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Plafonnage décoratif', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Carrelage artistique & mosaïque', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Décoration & design d\'intérieur', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Epoxy résine & revêtement sol', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Menuiserie & ameublement sur mesure', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Étanchéité', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Espaces verts & paysagisme', priceCurrency: 'XOF' },
      { '@type': 'Offer', name: 'Commandes personnalisées', priceCurrency: 'XOF' },
    ],
    sameAs: [
      'https://lartiska-portfolio.onrender.com',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
