import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading, IconTile } from "@/components/site/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Media } from "@/components/site/media";
import { StatCounter } from "@/components/site/stat-counter";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { ABOUT, VALUE_PILLARS, HOME, STAT_LABELS } from "@/lib/content/pages";
import { getTeam, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "IBILL Software and Consultancy specializes in bespoke software applications and comprehensive accounts consultancy for businesses in India and the GCC region.",
};

export default async function AboutPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()]);

  const stats = [
    { key: "statExperienceYears", value: settings.statExperienceYears },
    { key: "statProjectsDone", value: settings.statProjectsDone },
    { key: "statHappyClients", value: settings.statHappyClients },
  ] as const;

  return (
    <>
      <PageHero
        kicker={ABOUT.kicker}
        title="About IBILL"
        body={ABOUT.whoBody}
        image="/images/who-we-are.jpg"
        crumbs={[{ label: "About Us" }]}
      />

      {/* Value pillars */}
      <div className="container-x relative z-10 -mt-10">
        <Stagger className="grid divide-y divide-border rounded-2xl border border-border bg-card shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {VALUE_PILLARS.map((p) => (
            <StaggerItem key={p.key} className="flex items-center gap-4 p-6">
              <IconTile>
                <Icon name={p.icon} />
              </IconTile>
              <div>
                <div className="font-heading text-sm font-semibold uppercase tracking-wide text-brand-700">
                  {p.label}
                </div>
                <div className="text-sm text-muted-foreground">{p.line}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Journey */}
      <Section ledger>
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              kicker="Our Journey"
              title={ABOUT.journeyTitle}
              body={ABOUT.journeyBody}
            />
          </div>
          <Reveal>
            <Media src="/images/journey.jpg" className="aspect-[4/3] w-full" />
          </Reveal>
        </div>
      </Section>

      {/* Real accounting services */}
      <Section tint>
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Media src="/images/who-we-are.jpg" className="aspect-[4/3] w-full" />
          </Reveal>
          <div>
            <SectionHeading
              kicker={HOME.aboutKicker}
              title={HOME.aboutTitle}
              body={HOME.aboutBody[0]}
            />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {HOME.aboutBody[1]}
            </p>
          </div>
        </div>
      </Section>

      {/* Achievement / stats */}
      <section className="relative overflow-hidden bg-gradient-brand-deep py-20 text-white lg:py-24">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="container-x relative">
          <SectionHeading
            kicker={ABOUT.achievementKicker}
            title={<span className="text-white">{ABOUT.achievementTitle}</span>}
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-10 text-center sm:grid-cols-3">
            {stats.map((s) => (
              <StatCounter
                key={s.key}
                value={s.value}
                label={STAT_LABELS[s.key as keyof typeof STAT_LABELS]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <Section>
        <div className="container-x">
          <SectionHeading
            kicker={HOME.whyChooseTitle}
            title="What sets our team apart"
            body={HOME.whyChooseBody}
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-3">
            {HOME.whyChooseTags.map((t) => (
              <StaggerItem
                key={t.label}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <IconTile size="lg">
                  <Icon name={t.icon} />
                </IconTile>
                <h3 className="mt-4 font-heading text-lg font-semibold text-brand-ink">
                  {t.label}
                </h3>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Team */}
      <Section tint>
        <div className="container-x">
          <SectionHeading
            kicker={ABOUT.teamKicker}
            title={ABOUT.teamTitle}
            align="center"
          />
          {team.length > 0 ? (
            <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <StaggerItem
                  key={m.id}
                  className="rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto size-24">
                    <Media src={m.photo} className="size-24" rounded="rounded-full" />
                  </div>
                  <h3 className="mt-4 font-heading font-semibold text-brand-ink">
                    {m.name}
                  </h3>
                  <p className="text-sm text-brand-600">{m.role}</p>
                  {m.bio ? (
                    <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
                  ) : null}
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="mx-auto mt-10 max-w-md text-center text-muted-foreground">
              {ABOUT.teamEmpty}
            </p>
          )}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
