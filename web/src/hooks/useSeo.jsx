import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Lartiska';
const SITE_URL = 'https://lartiska.onrender.com';
const DEFAULT_DESCRIPTION = "Lartiska — peinture, plafonnage, carrelage et décoration artistique. L'art qui transforme vos espaces. Sénégal · Gambie · Mauritanie.";
const DEFAULT_IMAGE = `${SITE_URL}/1.jpg`;

/**
 * Composant SEO à placer en haut d'une page :
 *   <Seo title="Portfolio" description="Nos réalisations…" path="/portfolio" />
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — L'art qui transforme vos espaces`;
  const fullUrl = `${SITE_URL}${path}`;

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
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
