import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, IconTile } from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";
import { LeadForm } from "@/components/site/lead-form";
import { SITE } from "@/lib/site";
import { Seo } from "@/lib/seo";
import { useSettings } from "@/lib/queries";
import { SITE_SETTINGS_FALLBACK } from "@/lib/settings-fallback";

export default function ContactPage() {
  const { t } = useTranslation("contact");
  const settings = useSettings().data ?? SITE_SETTINGS_FALLBACK;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    settings.mapQuery || SITE.mapQuery,
  )}&output=embed`;

  const info = [
    {
      icon: Phone,
      label: t("labels.phone"),
      value: settings.phone,
      href: SITE.phoneHref,
      ltr: true,
    },
    {
      icon: Mail,
      label: t("labels.email"),
      value: settings.email,
      href: `mailto:${settings.email}`,
      ltr: true,
    },
    { icon: MapPin, label: t("labels.address"), value: settings.address },
    {
      icon: Clock,
      label: t("labels.workHours"),
      value: settings.workHours.join(" · "),
    },
  ];

  return (
    <>
      <Seo pageKey="contact" path="/contact" />
      <PageHero
        kicker={t("heroKicker")}
        title={t("heroTitle")}
        body={t("heroBody")}
        image="/images/about.jpg"
        crumbs={[{ label: t("heroKicker") }]}
      />

      <Section>
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand-ink">
              {t("infoTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("infoBody")}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {info.map((i) => (
                <div
                  key={i.label}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <IconTile size="sm">
                    <i.icon className="size-4" />
                  </IconTile>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {i.label}
                  </div>
                  {i.href ? (
                    <a
                      href={i.href}
                      dir={i.ltr ? "ltr" : undefined}
                      className="mt-0.5 block text-sm font-medium text-brand-ink hover:text-brand-600"
                    >
                      {i.value}
                    </a>
                  ) : (
                    <div className="mt-0.5 text-sm font-medium text-brand-ink">
                      {i.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-brand-ink">
              {t("formTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("formBody")}</p>
            <LeadForm source="contact-page" className="mt-6" />
          </Reveal>
        </div>
      </Section>

      <section className="pb-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl border border-border">
            <iframe
              title={t("mapTitle")}
              src={mapSrc}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
