import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/site/social-icons";
import { Logo } from "@/components/site/logo";
import { Link } from "@/lib/nav";
import { SITE, SERVICE_CATEGORIES } from "@/lib/site";
import type { SiteSettings as ISiteSettings } from "@/lib/types";

const NAV_KEYS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "products", href: "/products" },
  { key: "maintenancePlans", href: "/maintenance-plans" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export function SiteFooter({ settings }: { settings: ISiteSettings }) {
  const { t } = useTranslation();
  const socials = [
    { href: settings.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: settings.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: settings.twitter, Icon: TwitterIcon, label: "Twitter" },
    { href: settings.youtube, Icon: YoutubeIcon, label: "YouTube" },
  ].filter((s) => s.href);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1f33] text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pe-6">
          <Logo href={null} variant="inverted" />
          <p className="mt-5 text-sm leading-relaxed">{settings.companyBlurb}</p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-brand-500"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav>
          <h3 className="font-heading text-sm font-semibold text-white">
            {t("footer.navigation")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_KEYS.map((n) => (
              <li key={n.href}>
                <Link to={n.href} className="transition-colors hover:text-white">
                  {t(`nav.${n.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">
            {t("footer.services")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICE_CATEGORIES.map((c) => (
              <li key={c.href}>
                <Link to={c.href} className="transition-colors hover:text-white">
                  {t(`services:categories.${c.key}.title`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/products/salon-assist"
                className="transition-colors hover:text-white"
              >
                {t("nav.salonAssist")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">
            {t("footer.getInTouch")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <a href={SITE.phoneHref} className="hover:text-white" dir="ltr">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-white" dir="ltr">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>{settings.address}</span>
            </li>
          </ul>
          <h3 className="mt-6 font-heading text-sm font-semibold text-white">
            {t("footer.workHours")}
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {settings.workHours.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>{t("footer.rights", { year, name: SITE.legalName })}</p>
          <p>{SITE.address}</p>
        </div>
      </div>
    </footer>
  );
}
