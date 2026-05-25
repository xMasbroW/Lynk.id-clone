import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component for dynamic meta tags and JSON-LD schema generation.
 */
export const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  profileName
}) => {
  const siteName = 'Lynk';
  const fullTitle = `${title} | ${siteName}`;

  // Structured Data (JSON-LD) for better search ranking
  const structuredData = profileName ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": profileName,
      "image": image,
      "url": url
    }
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
