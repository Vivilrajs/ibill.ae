import { Link } from "react-router-dom";
import {
  Wrench,
  Package,
  Newspaper,
  Users,
  Quote,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import {
  useAdminList,
  useLeads,
} from "@/lib/queries";

export default function AdminDashboard() {
  const services = useAdminList("services").data ?? [];
  const products = useAdminList("products").data ?? [];
  const posts = useAdminList("posts").data ?? [];
  const team = useAdminList("team").data ?? [];
  const testimonials = useAdminList("testimonials").data ?? [];
  const leads = useLeads().data ?? [];

  const cards = [
    { label: "Services", count: services.length, to: "/admin/services", icon: Wrench },
    { label: "Products", count: products.length, to: "/admin/products", icon: Package },
    { label: "Blog posts", count: posts.length, to: "/admin/blog", icon: Newspaper },
    { label: "Team members", count: team.length, to: "/admin/team", icon: Users },
    { label: "Testimonials", count: testimonials.length, to: "/admin/testimonials", icon: Quote },
    { label: "Leads", count: leads.length, to: "/admin/leads", icon: Inbox },
  ];

  return (
    <AdminPage title="Dashboard" description="Manage the content that appears on ibill.ae.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-200"
          >
            <div className="flex items-center justify-between">
              <c.icon className="size-5 text-brand-600" />
              <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="mt-4 font-heading text-3xl font-bold text-brand-ink">
              {c.count}
            </div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
