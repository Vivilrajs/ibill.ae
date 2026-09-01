import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";
import { LOCALES, stripLocale, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  variant = "default",
  className,
}: {
  variant?: "default" | "inverted";
  className?: string;
}) {
  const { lang } = useLang();
  const { t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const inverted = variant === "inverted";

  function switchTo(next: Locale) {
    if (next === lang) return;
    try {
      localStorage.setItem("i18nextLng", next);
    } catch {
      /* private mode */
    }
    const bare = stripLocale(pathname);
    const target =
      (next === "ar" ? (bare === "/" ? "/ar" : `/ar${bare}`) : bare) +
      search +
      hash;
    navigate(target);
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("language.label")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-semibold",
        inverted ? "border-white/25 bg-white/10" : "border-border bg-secondary/60",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const isActive = code === lang;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t("language.switchTo", { language: t(`language.${code}`) })}
            onClick={() => switchTo(code)}
            className={cn(
              "grid h-7 min-w-7 place-items-center rounded-full px-2 uppercase transition-colors",
              isActive
                ? inverted
                  ? "bg-white text-[#1a5493]"
                  : "bg-card text-brand-600 shadow-sm"
                : inverted
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
