/**
 * Post-SSG: set the correct <title> per prerendered page (react-helmet-async
 * writes meta/link but not <title> reliably), mark admin/404 noindex, and emit
 * sitemap.xml + robots.txt.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE_URL = (process.env.VITE_SITE_URL || "https://ibill.ae").replace(/\/$/, "");
const NAME = "IBILL";
const TAGLINE = "Your Professional Accounting & Software Firm";

const TITLES = {
  "index.html": `${NAME} - ${TAGLINE}`,
  "about.html": `About Us - ${NAME}`,
  "services.html": `Services - ${NAME}`,
  "services/accounting.html": `Accounting Services - ${NAME}`,
  "services/it.html": `IT Services - ${NAME}`,
  "products.html": `Products - ${NAME}`,
  "products/salon-assist.html": `Salon Assist - ${NAME}`,
  "blog.html": `Blog - ${NAME}`,
  "contact.html": `Contact Us - ${NAME}`,
  "404.html": `Page not found - ${NAME}`,
};

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/accounting",
  "/services/it",
  "/products",
  "/products/salon-assist",
  "/blog",
  "/contact",
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith(".html")) out.push(p);
  }
  return out;
}

for (const file of walk(DIST)) {
  const rel = relative(DIST, file);
  let html = readFileSync(file, "utf8");

  const title = TITLES[rel];
  if (title) {
    html = html.replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${title.replace(/&/g, "&amp;")}</title>`,
    );
  }

  const isAdmin = rel.startsWith("admin");
  const is404 = rel === "404.html";
  if ((isAdmin || is404) && !/name="robots"/.test(html)) {
    html = html.replace(
      /<\/head>/,
      `  <meta name="robots" content="noindex, nofollow">\n</head>`,
    );
  }

  writeFileSync(file, html);
}

// sitemap.xml
const now = new Date().toISOString();
const urls = PUBLIC_ROUTES.map(
  (r) =>
    `  <url><loc>${SITE_URL}${r === "/" ? "" : r}</loc><lastmod>${now}</lastmod></url>`,
).join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// robots.txt
writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(`postbuild: patched titles, wrote sitemap.xml + robots.txt (${SITE_URL})`);
