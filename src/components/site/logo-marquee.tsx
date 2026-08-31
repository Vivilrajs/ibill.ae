const PLACEHOLDER_CLIENTS = [
  "Northline",
  "Meridian Co.",
  "Gulf Retail",
  "Aster Group",
  "BluePeak",
  "Vantage",
  "Harbor & Co.",
  "Lumen",
];

export function LogoMarquee() {
  const row = [...PLACEHOLDER_CLIENTS, ...PLACEHOLDER_CLIENTS];
  return (
    <div className="marquee-pause overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Trusted by growing businesses
      </p>
      <div className="mt-6 flex w-max animate-marquee gap-12">
        {row.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="font-heading text-lg font-semibold text-brand-300"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
