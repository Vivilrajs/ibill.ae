import { Outlet, ScrollRestoration } from "react-router-dom";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { useSettings } from "@/lib/queries";
import { SITE_SETTINGS_FALLBACK } from "@/lib/settings-fallback";

export function SiteLayout() {
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
