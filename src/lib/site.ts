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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ibill.ae",
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

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Accounting Services", href: "/services/accounting" },
      { label: "IT Services", href: "/services/it" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [{ label: "Salon Assist", href: "/products/salon-assist" }],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
] as const;
