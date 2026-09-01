/**
 * Post-SSG: normalise <html lang/dir>, set the correct <title> per prerendered
 * page and locale (helmet writes meta/link but not <title> reliably), inject
 * hreflang alternates, mark admin/404 noindex, and emit a bilingual sitemap.xml
 * plus robots.txt.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE_URL = (process.env.VITE_SITE_URL || "https://ibill.ae").replace(/\/$/, "");
const NAME = "IBILL";
const TAGLINE_EN = "Your Professional Accounting & Software Firm";
const TAGLINE_AR = "شريكك المحترف في المحاسبة والبرمجيات";

const DIR = { en: "ltr", ar: "rtl" };

/** route stem (relative html path, no locale prefix) -> { en, ar } <title> */
const TITLES = {
  "index.html": { en: `${NAME} - ${TAGLINE_EN}`, ar: `${NAME} - ${TAGLINE_AR}` },
  "about.html": { en: `About Us - ${NAME}`, ar: `من نحن - ${NAME}` },
  "services.html": { en: `Services - ${NAME}`, ar: `خدماتنا - ${NAME}` },
  "services/accounting.html": {
    en: `Accounting Services - ${NAME}`,
    ar: `خدمات المحاسبة - ${NAME}`,
  },
  "services/it.html": {
    en: `IT Services - ${NAME}`,
    ar: `خدمات تقنية المعلومات - ${NAME}`,
  },
  "products.html": { en: `Products - ${NAME}`, ar: `المنتجات - ${NAME}` },
  "products/salon-assist.html": {
    en: `Salon Assist - ${NAME}`,
    ar: `Salon Assist - ${NAME}`,
  },
  "maintenance-plans.html": {
    en: `Annual Maintenance Plan - ${NAME}`,
    ar: `خطة الصيانة السنوية - ${NAME}`,
  },
  "blog.html": { en: `Blog - ${NAME}`, ar: `المدونة - ${NAME}` },
  "contact.html": { en: `Contact Us - ${NAME}`, ar: `اتصل بنا - ${NAME}` },
  "404.html": { en: `Page not found - ${NAME}`, ar: `Page not found - ${NAME}` },
};

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/accounting",
  "/services/it",
  "/products",
  "/products/salon-assist",
  "/maintenance-plans",
  "/blog",
  "/contact",
];

const esc = (s) => s.replace(/&/g, "&amp;");

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith(".html")) out.push(p);
  }
  return out;
}

/** stem ("about.html", "services/it.html", "index.html") -> route ("/about") or null */
function stemToRoute(stem) {
  if (stem.startsWith("admin")) return null;
  if (stem === "404.html") return null;
  if (stem === "index.html") return "/";
  return "/" + stem.replace(/\.html$/, "").replace(/\/index$/, "");
}

for (const file of walk(DIST)) {
  const rel = relative(DIST, file);
  const isAr = rel === "ar.html" || rel.startsWith("ar/");
  const lng = isAr ? "ar" : "en";
  const stem =
    rel === "ar.html" ? "index.html" : isAr ? rel.slice(3) : rel;
  let html = readFileSync(file, "utf8");

  html = html.replace(
    /<html\b[^>]*>/i,
    `<html lang="${lng}" dir="${DIR[lng]}" class="light">`,
  );

  const title = TITLES[stem]?.[lng];
  if (title) {
    html = html.replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${esc(title)}</title>`,
    );
  }

  const route = stemToRoute(stem);
  if (route && !/hreflang="ar"/.test(html)) {
    const p = route === "/" ? "" : route;
    html = html.replace(
      /<\/head>/,
      `  <link rel="alternate" hreflang="en" href="${SITE_URL}${p}">\n` +
        `  <link rel="alternate" hreflang="ar" href="${SITE_URL}/ar${p}">\n` +
        `  <link rel="alternate" hreflang="x-default" href="${SITE_URL}${p}">\n` +
        `</head>`,
    );
  }

  const isAdmin = stem.startsWith("admin");
  const is404 = stem === "404.html";
  if ((isAdmin || is404) && !/name="robots"/.test(html)) {
    html = html.replace(
      /<\/head>/,
      `  <meta name="robots" content="noindex, nofollow">\n</head>`,
    );
  }

  writeFileSync(file, html);
}

// bilingual sitemap.xml
const now = new Date().toISOString();
const NS =
  'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"';
const urls = PUBLIC_ROUTES.flatMap((r) => {
  const p = r === "/" ? "" : r;
  const alts = [
    `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${p}"/>`,
    `<xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar${p}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${p}"/>`,
  ].join("");
  return [
    `  <url><loc>${SITE_URL}${p}</loc><lastmod>${now}</lastmod>${alts}</url>`,
    `  <url><loc>${SITE_URL}/ar${p}</loc><lastmod>${now}</lastmod>${alts}</url>`,
  ];
}).join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${NS}>\n${urls}\n</urlset>\n`,
);

// robots.txt
writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(
  `postbuild: normalised lang/dir, patched titles + hreflang, wrote bilingual sitemap.xml + robots.txt (${SITE_URL})`,
);
