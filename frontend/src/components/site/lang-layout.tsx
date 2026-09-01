import { useEffect, type ReactNode } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { Direction } from "radix-ui";
import { getI18n, DIR, type Locale } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { useSettings } from "@/lib/queries";
import { SITE_SETTINGS_FALLBACK } from "@/lib/settings-fallback";

function HtmlDirEffect({ lang, dir }: { lang: Locale; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
  }, [lang, dir]);
  return null;
}

/** i18n + direction + lang context, no chrome. Used for bare pages (404). */
export function LangShell({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  const dir = DIR[lang];
  return (
    <I18nextProvider i18n={getI18n(lang)}>
      <LangProvider lang={lang}>
        <Direction.Provider dir={dir}>
          <HtmlDirEffect lang={lang} dir={dir} />
          {children}
        </Direction.Provider>
      </LangProvider>
    </I18nextProvider>
  );
}

function SiteChrome() {
  const { data: settings } = useSettings();
  return (
    <>
      <ScrollRestoration />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter settings={settings ?? SITE_SETTINGS_FALLBACK} />
    </>
  );
}

/** Route element for a locale-scoped marketing site (header + footer + pages). */
export function SiteLangLayout({ lang }: { lang: Locale }) {
  return (
    <LangShell lang={lang}>
      <SiteChrome />
    </LangShell>
  );
}
