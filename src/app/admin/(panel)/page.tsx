import Link from "next/link";
import { Wrench, Package, Newspaper, Users, Quote, Inbox, ArrowRight } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { getServices, getProducts, getPosts, getTeam, getTestimonials, getLeads } from "@/lib/data";

export default async function AdminDashboard() {
  const [services, products, posts, team, testimonials, leads] = await Promise.all([
    getServices({ admin: true }),
    getProducts({ admin: true }),
    getPosts({ admin: true }),
    getTeam({ admin: true }),
    getTestimonials({ admin: true }),
    getLeads(),
  ]);

  const cards = [
    { label: "Services", count: services.length, href: "/admin/services", icon: Wrench },
    { label: "Products", count: products.length, href: "/admin/products", icon: Package },
    { label: "Blog posts", count: posts.length, href: "/admin/blog", icon: Newspaper },
    { label: "Team members", count: team.length, href: "/admin/team", icon: Users },
    { label: "Testimonials", count: testimonials.length, href: "/admin/testimonials", icon: Quote },
    { label: "Leads", count: leads.length, href: "/admin/leads", icon: Inbox },
  ];

  return (
    <AdminPage
      title="Dashboard"
      description="Manage the content that appears on ibill.ae."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
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
