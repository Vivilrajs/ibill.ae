/**
 * Central, non-editable site constants. Contact details / socials / stats that
 * the client can change at runtime live in SiteSettings (see lib/content/settings.ts
 * and the /admin/settings screen) - the values here are the build-time fallbacks.
 */

export const SITE = {
  name: "IBILL",
  legalName: "IBILL Software FZ LLC",
  brandName: "IBILL Software and Consultancy",
  tagline: "Your Professional Accounting & Software Firm",
  shortTagline: "Accounting & Software",
  url: (import.meta.env.VITE_SITE_URL as string) || "https://ibill.ae",
  description:
    "IBILL Software and Consultancy, your trusted partner in accounts consultancy and software development. We empower businesses in India and the GCC region with innovative solutions and expert guidance.",
  phone: "+971 56 570 8076",
  phoneHref: "tel:+971565708076",
  email: "info@ibill.ae",
  address:
    "Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, RAK, UAE",
  mapQuery: "Compass Building, Al Hamra Industrial Zone, Ras Al Khaimah, UAE",
  workHours: ["Mon - Fri: 7AM - 5PM", "Saturday: 9AM - 3PM"],
  socials: {
    facebook: "https://www.facebook.com/ibillsoftware/",
    instagram: "https://www.instagram.com/i_bill_software/",
  },
} as const;

/** `labelKey` resolves against the `common:nav.*` i18n namespace. */
export const NAV_LINKS = [
  { labelKey: "home", href: "/" },
  { labelKey: "about", href: "/about" },
  {
    labelKey: "services",
    href: "/services",
    children: [
      { labelKey: "accountingServices", href: "/services/accounting" },
      { labelKey: "itServices", href: "/services/it" },
    ],
  },
  {
    labelKey: "products",
    href: "/products",
    children: [{ labelKey: "salonAssist", href: "/products/salon-assist" }],
  },
  { labelKey: "maintenancePlans", href: "/maintenance-plans" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "contact", href: "/contact" },
] as const;

/** Service category route metadata. Display text lives in the `services` i18n namespace. */
export const SERVICE_CATEGORIES = [
  { key: "accounting", href: "/services/accounting" },
  { key: "it", href: "/services/it" },
] as const;
