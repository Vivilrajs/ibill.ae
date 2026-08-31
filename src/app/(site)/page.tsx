import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Kicker, IconTile } from "@/components/site/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Media } from "@/components/site/media";
import { LeadForm } from "@/components/site/lead-form";
import { ServicesExplorer } from "@/components/site/services-explorer";
import { StatCounter } from "@/components/site/stat-counter";
import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { CtaBand } from "@/components/site/cta-band";
import { Icon } from "@/lib/icons";
import { SERVICE_CATEGORY_META } from "@/lib/content/services";
import { HOME, VALUE_PILLARS, STAT_LABELS } from "@/lib/content/pages";
import { FAQ_INTRO } from "@/lib/content/faqs";
import {
  getServices,
  getTestimonials,
  getFaqs,
  getSettings,
  getPosts,
} from "@/lib/data";

export default async function HomePage() {
  const [services, testimonials, faqs, settings, posts] = await Promise.all([
    getServices(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getPosts(),
  ]);

  const stats = [
    { key: "statExperienceYears", value: settings.statExperienceYears },
    { key: "statProjectsDone", value: settings.statProjectsDone },
    { key: "statHappyClients", value: settings.statHappyClients },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 overflow-hidden bg-[#0b1f33] pb-24 pt-32 text-white lg:-mt-20 lg:pb-32 lg:pt-40">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-deep opacity-[0.92] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#0b1f33]/40" />
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_15%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <Kicker className="text-brand-200">{HOME.heroEyebrow}</Kicker>
            <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em] text-white/60">
              {HOME.heroKicker}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
              {HOME.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {HOME.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-[#1a5493] hover:bg-white/90">
                <Link href="/services">
                  Explore Services <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/55">
              Serving businesses across India and the GCC region.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/15 bg-card p-6 text-card-foreground shadow-float sm:p-8">
              <h2 className="font-heading text-lg font-semibold text-brand-ink">
                Request a call back
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your business and we&apos;ll be in touch.
              </p>
              <LeadForm source="home-hero" compact className="mt-5" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Value pillars ribbon */}
      <div className="container-x relative z-10 -mt-12">
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

      {/* About */}
      <Section ledger>
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <Media src="/images/about.jpg" className="aspect-[4/3] w-full" />
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-card p-5 shadow-float sm:block">
              <div className="font-heading text-2xl font-bold text-brand-600">UAE</div>
              <div className="text-xs text-muted-foreground">Accounting &amp; software</div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              kicker={HOME.aboutKicker}
              title={HOME.aboutTitle}
              body={HOME.aboutBody[0]}
            />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {HOME.aboutBody[1]}
            </p>
            <Button asChild variant="link" className="mt-4 h-auto p-0 text-brand-600">
              <Link href="/about">
                Learn More <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Two practices */}
      <Section>
        <div className="container-x">
          <SectionHeading
            kicker="What We Do"
            title="Two practices, one partner"
            body="Choose the area you need help with - or bring us both."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(["accounting", "it"] as const).map((key) => {
              const meta = SERVICE_CATEGORY_META[key];
              const count = services.filter((s) => s.category === key).length;
              return (
                <Reveal key={key}>
                  <Link
                    href={meta.href}
                    className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
                  >
                    <IconTile size="lg">
                      <Icon name={key === "it" ? "Code2" : "BarChart3"} />
                    </IconTile>
                    <h3 className="mt-5 font-heading text-2xl font-semibold text-brand-ink">
                      {meta.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {meta.intro}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                      View {count} services
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section tint id="services">
        <div className="container-x">
          <SectionHeading
            kicker={HOME.servicesKicker}
            title="Expert services for every part of your business"
            body={HOME.servicesIntro}
          />
          <div className="mt-10">
            <ServicesExplorer
              services={services.map((s) => ({
                slug: s.slug,
                title: s.title,
                shortDescription: s.shortDescription,
                category: s.category,
                icon: s.icon,
              }))}
            />
          </div>
        </div>
      </Section>

      {/* Why IBILL + stats */}
      <section className="relative overflow-hidden bg-gradient-brand-deep py-20 text-white lg:py-28">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="container-x relative grid gap-14 lg:grid-cols-2">
          <Reveal>
            <Kicker className="text-brand-200">{HOME.whyKicker}</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl text-balance">
              {HOME.whyTitle}
            </h2>
            <p className="mt-4 max-w-md text-white/75">{HOME.whyBody}</p>
            <ul className="mt-8 space-y-3">
              {HOME.whyPoints.map((pt) => (
                <li key={pt.label} className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-white/15">
                    <Check className="size-3.5" />
                  </span>
                  <span className="font-medium">{pt.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-8 self-center sm:gap-10">
            {stats.map((s) => (
              <StatCounter
                key={s.key}
                value={s.value}
                label={STAT_LABELS[s.key as keyof typeof STAT_LABELS]}
              />
            ))}
            <div className="col-span-2 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/75">
              Transforming accounting and business operations for companies across
              the UAE.
            </div>
          </Reveal>
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
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t.label === "Expertise"
                    ? "Deep accounting and software knowledge applied to your goals."
                    : t.label === "Knowledge"
                      ? "Current on UAE regulation, tax, and compliance requirements."
                      : "Clear, responsive communication at every step of the engagement."}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Logo marquee */}
      <div className="container-x pb-8">
        <LogoMarquee />
      </div>

      {/* Process */}
      <Section tint>
        <div className="container-x">
          <SectionHeading
            kicker={HOME.processKicker}
            title={HOME.processTitle}
            body={HOME.processBody}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOME.processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className="relative h-full rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-sm font-bold text-brand-300">
                      0{i + 1}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                    <IconTile size="sm">
                      <Icon name={step.icon} />
                    </IconTile>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              kicker={HOME.faqKicker}
              title={HOME.faqTitle}
              body={FAQ_INTRO}
            />
          </div>
          <FaqAccordion
            items={faqs.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
          />
        </div>
      </Section>

      {/* Blog teaser */}
      {posts.length > 0 && (
        <Section tint>
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading kicker={HOME.blogKicker} title={HOME.blogTitle} />
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/blog">
                  All articles <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-border bg-card p-2 transition-shadow hover:shadow-soft"
                >
                  <Media src={p.coverImage} className="aspect-[16/10] w-full" rounded="rounded-xl" />
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="mt-1.5 font-heading font-semibold text-brand-ink group-hover:text-brand-600">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section>
          <div className="container-x">
            <SectionHeading
              kicker={HOME.testimonialsKicker}
              title={HOME.testimonialsTitle}
            />
            <div className="mt-10">
              <TestimonialsCarousel
                items={testimonials.map((t) => ({
                  id: t.id,
                  quote: t.quote,
                  authorName: t.authorName,
                  authorTitle: t.authorTitle,
                }))}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Contact */}
      <Section tint id="contact">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              kicker="Contact Us"
              title="Get Information"
              body="Have a question or need assistance? We're here to help. Reach out to us today to learn more about our accounting services and software solutions."
            />
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-brand-ink">Phone</dt>
                <dd className="text-muted-foreground">{settings.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Email</dt>
                <dd className="text-muted-foreground">{settings.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-ink">Address</dt>
                <dd className="text-muted-foreground">{settings.address}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <LeadForm source="home-contact" />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
