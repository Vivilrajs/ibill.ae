
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Package,
  Newspaper,
  Users,
  Quote,
  Settings,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminShell({
  children,
  storage,
}: {
  children: React.ReactNode;
  storage: string;
}) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { logout: clearSession } = useAuth();

  function logout() {
    clearSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border p-4">
          <Logo href="/admin" />
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border p-3 text-xs text-muted-foreground">
          <p>Storage: {storage}</p>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 py-1 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" /> View site
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-1.5 py-1 hover:text-foreground"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Logo href="/admin" />
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
