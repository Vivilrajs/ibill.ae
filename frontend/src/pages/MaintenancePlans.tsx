import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/lib/nav";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/primitives";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { CtaBand } from "@/components/site/cta-band";
import { Seo } from "@/lib/seo";
import { useMaintenancePlans } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default function MaintenancePlansPage() {
  const { t } = useTranslation("maintenance");
  const plans = useMaintenancePlans().data ?? [];

  return (
    <>
      <Seo pageKey="maintenancePlans" path="/maintenance-plans" />
      <PageHero
        kicker={t("heroKicker")}
        title={t("heroTitle")}
        body={t("heroBody")}
        image="/images/it.jpg"
        crumbs={[{ label: t("heroKicker") }]}
      />

      <Section>
        <div className="container-x">
          {plans.length > 0 ? (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <StaggerItem key={plan.id}>
                  <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                    <h2 className="font-heading text-xl font-semibold text-brand-ink">
                      {plan.name}
                    </h2>
                    {plan.summary ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {plan.summary}
                      </p>
                    ) : null}

                    <div className="mt-6">
                      <div className="font-heading text-3xl font-bold text-brand-ink">
                        <span dir="ltr">{formatCurrency(plan.annualFee)}</span>
                        <span className="ms-1.5 text-sm font-medium text-muted-foreground">
                          {t("perYear")}
                        </span>
                      </div>
                      {plan.feeNote ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {plan.feeNote}
                        </p>
                      ) : null}
                    </div>

                    {plan.inclusions.length > 0 && (
                      <>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                          {t("included")}
                        </p>
                        <ul className="mt-3 flex-1 space-y-2.5">
                          {plan.inclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm">
                              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                                <Check className="size-3" />
                              </span>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <Link
                      to="/contact"
                      className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      {t("request")}{" "}
                      <ArrowRight className="size-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("empty")}
            </p>
          )}
        </div>
      </Section>

      <CtaBand
        title={t("ctaTitle")}
        body={t("ctaBody")}
        cta={t("ctaButton")}
      />
    </>
  );
}
