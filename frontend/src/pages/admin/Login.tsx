import { useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { Seo } from "@/lib/seo";
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/admin";
  const { authed, login } = useAuth();
  const [loading, setLoading] = useState(false);

  if (authed) return <Navigate to={next} replace />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      password: string;
    };
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate(next, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Seo title="Admin" noindex />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-soft">
        <Logo href={null} />
        <h1 className="mt-6 font-heading text-xl font-semibold text-brand-ink">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the credentials from your environment configuration.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
