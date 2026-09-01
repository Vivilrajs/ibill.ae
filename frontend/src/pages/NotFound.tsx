import { useTranslation } from "react-i18next";
import { Link } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <main className="grid min-h-[70vh] place-items-center bg-gradient-brand-deep px-6 text-center text-white">
      <div>
        <p className="font-heading text-6xl font-bold text-brand-300">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-white/70">{t("notFound.body")}</p>
        <Button asChild className="mt-8 bg-white text-[#1a5493] hover:bg-white/90">
          <Link to="/">{t("notFound.back")}</Link>
        </Button>
      </div>
    </main>
  );
}
