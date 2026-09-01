
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitContact } from "@/lib/queries";

export function LeadForm({
  source = "contact",
  className,
  compact = false,
}: {
  source?: string;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation("contact");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setLoading(true);
    try {
      await submitContact({ ...data, source });
      toast.success(t("leadForm.success"));
      form.reset();
    } catch {
      toast.error(t("leadForm.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field
          label={t("leadForm.name")}
          name="name"
          placeholder={t("leadForm.namePlaceholder")}
          required
        />
        <Field
          label={t("leadForm.email")}
          name="email"
          type="email"
          placeholder={t("leadForm.emailPlaceholder")}
          required
        />
      </div>
      <Field
        label={t("leadForm.phone")}
        name="phone"
        placeholder={t("leadForm.phonePlaceholder")}
      />
      <div className="space-y-1.5">
        <Label htmlFor="lf-message">{t("leadForm.message")}</Label>
        <Textarea
          id="lf-message"
          name="message"
          placeholder={t("leadForm.messagePlaceholder")}
          rows={compact ? 3 : 4}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-brand text-white hover:opacity-95"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {t("leadForm.submit")} <ArrowRight className="size-4 rtl:-scale-x-100" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`lf-${name}`}>{label}</Label>
      <Input
        id={`lf-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
