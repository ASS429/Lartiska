import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Lartiska';
// Site URL : configurable via VITE_SITE_URL, fallback lartiska.sn une fois
// le domaine en place (currently lartiska.onrender.com en attendant).
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lartiska.sn';
const DEFAULT_DESCRIPTION = "Lartiska — Maître Artisan finition luxe au Sénégal. Peinture artistique, fresques murales, plafonnage décoratif, carrelage zellige, epoxy résine. Tounkara, atelier Mbour. Devis gratuit sous 48h.";
const DEFAULT_IMAGE = `${SITE_URL}/1.jpg`;

/**
 * Composant SEO à placer en haut d'une page.
 *
 *   <Seo title="Portfolio" description="..." path="/portfolio" />
 *
 * Pour ajouter une structure JSON-LD spécifique à la page (Service,
 * Project, Article, etc.), passer `jsonLd={{...}}`. Le LocalBusiness
 * sitewide est injecté séparément dans Layout via <BusinessSchema />.
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Maître Artisan finition luxe au Sénégal`;
  const fullUrl = `${SITE_URL}${path}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Géolocalisation Sénégal (signal local SEO) */}
      <meta name="geo.region" content="SN-TH" />
      <meta name="geo.placename" content="Mbour, Sénégal" />
      <meta name="geo.position" content="14.4197;-16.9646" />
      <meta name="ICBM" content="14.4197, -16.9646" />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* JSON-LD spécifique à la page (Service, Project, Article…) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME };
