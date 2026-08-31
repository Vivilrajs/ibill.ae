import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/site/social-icons";
import { Logo } from "@/components/site/logo";
import { SITE } from "@/lib/site";
import { SERVICE_CATEGORY_META } from "@/lib/content/services";
import type { ISiteSettings } from "@/lib/models";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export function SiteFooter({ settings }: { settings: ISiteSettings }) {
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
        <div className="lg:pr-6">
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
          <h3 className="font-heading text-sm font-semibold text-white">Navigation</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {Object.values(SERVICE_CATEGORY_META).map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products/salon-assist" className="transition-colors hover:text-white">
                Salon Assist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <a href={SITE.phoneHref} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>{settings.address}</span>
            </li>
          </ul>
          <h3 className="mt-6 font-heading text-sm font-semibold text-white">Work Hours</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {settings.workHours.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            &copy; {year} {SITE.legalName}. All rights reserved.
          </p>
          <p>{SITE.address}</p>
        </div>
      </div>
    </footer>
  );
}
