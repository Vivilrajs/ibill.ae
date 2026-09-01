import { createInstance, type i18n as I18nType } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, NS } from "./i18n-resources";

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DIR: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_AE" };
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(v: string | undefined): v is Locale {
  return v === "en" || v === "ar";
}

/** Strip a leading `/ar` segment. Returns a path that always starts with `/`. */
export function stripLocale(pathname: string): string {
  const bare = pathname.replace(/^\/ar(?=\/|$)/, "");
  return bare === "" ? "/" : bare;
}

/** Prefix a site-relative path for the given locale. Idempotent. */
export function withLocale(to: string, locale: Locale): string {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const [pathPart, ...rest] = to.split(/(?=[?#])/);
  const suffix = rest.join("");
  const bare = stripLocale(pathPart);
  if (locale === "en") return bare + suffix;
  return (bare === "/" ? "/ar" : `/ar${bare}`) + suffix;
}

const cache = new Map<Locale, I18nType>();

export function getI18n(lng: Locale): I18nType {
  let inst = cache.get(lng);
  if (!inst) {
    inst = createInstance();
    inst.use(initReactI18next).init({
      lng,
      fallbackLng: "en",
      supportedLngs: LOCALES as unknown as string[],
      ns: NS,
      defaultNS: "common",
      resources,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      initImmediate: false,
    });
    cache.set(lng, inst);
  }
  return inst;
}
