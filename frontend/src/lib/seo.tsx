import { Head } from "vite-react-ssg";
import { SITE_URL } from "./env";
import { SITE } from "./site";

export function Seo({
  title,
  description = SITE.description,
  image = "/images/og.jpg",
  path = "",
  noindex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
}) {
  const fullTitle = title ? `${title} - ${SITE.name}` : `${SITE.name} - ${SITE.tagline}`;
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Head>
  );
}
