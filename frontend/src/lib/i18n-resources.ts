import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enAbout from "@/locales/en/about.json";
import enServices from "@/locales/en/services.json";
import enProducts from "@/locales/en/products.json";
import enBlog from "@/locales/en/blog.json";
import enContact from "@/locales/en/contact.json";
import enMaintenance from "@/locales/en/maintenance.json";
import enFaq from "@/locales/en/faq.json";
import enSeo from "@/locales/en/seo.json";

import arCommon from "@/locales/ar/common.json";
import arHome from "@/locales/ar/home.json";
import arAbout from "@/locales/ar/about.json";
import arServices from "@/locales/ar/services.json";
import arProducts from "@/locales/ar/products.json";
import arBlog from "@/locales/ar/blog.json";
import arContact from "@/locales/ar/contact.json";
import arMaintenance from "@/locales/ar/maintenance.json";
import arFaq from "@/locales/ar/faq.json";
import arSeo from "@/locales/ar/seo.json";

export const NS = [
  "common",
  "home",
  "about",
  "services",
  "products",
  "blog",
  "contact",
  "maintenance",
  "faq",
  "seo",
] as const;

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    services: enServices,
    products: enProducts,
    blog: enBlog,
    contact: enContact,
    maintenance: enMaintenance,
    faq: enFaq,
    seo: enSeo,
  },
  ar: {
    common: arCommon,
    home: arHome,
    about: arAbout,
    services: arServices,
    products: arProducts,
    blog: arBlog,
    contact: arContact,
    maintenance: arMaintenance,
    faq: arFaq,
    seo: arSeo,
  },
} as const;
