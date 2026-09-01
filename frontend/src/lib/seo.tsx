import { Head } from "vite-react-ssg";
import { useTranslation } from "react-i18next";
import { SITE_URL } from "./env";
import { SITE } from "./site";
import { DIR, OG_LOCALE, stripLocale, type Locale } from "./i18n";

export function Seo({
  pageKey,
  title,
  description,
  image = "/images/og.jpg",
  path = "",
  noindex = false,
}: {
  pageKey?: string;
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
}) {
  const { t, i18n } = useTranslation("seo");
  const lang = (i18n.language as Locale) || "en";
  const dir = DIR[lang];

  const siteName = t("siteName", { defaultValue: SITE.name });
  const tagline = t("tagline", { defaultValue: SITE.tagline });

  const keyTitle = pageKey
    ? t(`pages.${pageKey}.title`, { defaultValue: "" })
    : "";
  const keyDesc = pageKey
    ? t(`pages.${pageKey}.description`, { defaultValue: "" })
    : "";

  const resolvedTitle = title ?? (keyTitle || undefined);
  const desc =
    description ||
    (keyDesc || undefined) ||
    t("defaultDescription", { defaultValue: SITE.description });
  const fullTitle = resolvedTitle
    ? `${resolvedTitle} - ${siteName}`
    : `${siteName} - ${tagline}`;

  const bare = stripLocale(path || "/");
  const cleanPath = bare === "/" ? "" : bare;
  const prefix = lang === "ar" ? "/ar" : "";
  const canonical = `${SITE_URL}${prefix}${cleanPath}`;
  const enUrl = `${SITE_URL}${cleanPath}`;
  const arUrl = `${SITE_URL}/ar${cleanPath}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <html lang={lang} dir={dir} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      <meta
        property="og:locale:alternate"
        content={lang === "ar" ? OG_LOCALE.en : OG_LOCALE.ar}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Head>
  );
}
