import type { RouteRecord } from "vite-react-ssg";
import { RootProviders } from "@/components/root-providers";
import { SiteLangLayout, LangShell } from "@/components/site/lang-layout";
import { AdminLayout } from "@/components/admin/admin-layout";
import { API_URL } from "@/lib/env";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceCategory from "@/pages/ServiceCategory";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import MaintenancePlans from "@/pages/MaintenancePlans";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminServices from "@/pages/admin/Services";
import AdminProducts from "@/pages/admin/Products";
import AdminBlog from "@/pages/admin/Blog";
import AdminTeam from "@/pages/admin/Team";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminMaintenancePlans from "@/pages/admin/MaintenancePlans";
import AdminSettings from "@/pages/admin/Settings";
import AdminLeads from "@/pages/admin/Leads";

/** Build-time list of slugs for prerendering dynamic routes. */
async function slugs(resource: string, fallback: string[]): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/${resource}`);
    const json = (await res.json()) as { items: { slug: string }[] };
    const list = json.items?.map((i) => i.slug).filter(Boolean) ?? [];
    return list.length ? list : fallback;
  } catch {
    return fallback;
  }
}

/**
 * The public marketing pages, mounted once per locale. `base` is "" for English
 * (parent path "/") or "/ar" for Arabic. Child paths are absolute and fully
 * qualified so vite-react-ssg's path walker emits `/ar/...` correctly (a
 * pathless layer would otherwise reset the prefix).
 */
function siteTree(base: "" | "/ar"): RouteRecord[] {
  const p = (seg: string) => `${base}/${seg}`;
  return [
    { index: true, element: <Home />, entry: "src/pages/Home.tsx" },
    { path: p("about"), element: <About />, entry: "src/pages/About.tsx" },
    { path: p("services"), element: <Services />, entry: "src/pages/Services.tsx" },
    {
      path: p("services/:category"),
      element: <ServiceCategory />,
      entry: "src/pages/ServiceCategory.tsx",
      getStaticPaths: () => [p("services/accounting"), p("services/it")],
    },
    { path: p("products"), element: <Products />, entry: "src/pages/Products.tsx" },
    {
      path: p("products/:slug"),
      element: <ProductDetail />,
      entry: "src/pages/ProductDetail.tsx",
      getStaticPaths: async () =>
        (await slugs("products", ["salon-assist"])).map((s) => p(`products/${s}`)),
    },
    {
      path: p("maintenance-plans"),
      element: <MaintenancePlans />,
      entry: "src/pages/MaintenancePlans.tsx",
    },
    { path: p("blog"), element: <Blog />, entry: "src/pages/Blog.tsx" },
    {
      path: p("blog/:slug"),
      element: <BlogPost />,
      entry: "src/pages/BlogPost.tsx",
      getStaticPaths: async () =>
        (await slugs("posts", [])).map((s) => p(`blog/${s}`)),
    },
    { path: p("contact"), element: <Contact />, entry: "src/pages/Contact.tsx" },
    { path: `${base}/*`, element: <NotFound /> },
  ];
}

export const routes: RouteRecord[] = [
  {
    element: <RootProviders />,
    entry: "src/components/root-providers.tsx",
    children: [
      {
        path: "/",
        element: <SiteLangLayout lang="en" />,
        children: siteTree(""),
      },
      {
        path: "/ar",
        element: <SiteLangLayout lang="ar" />,
        children: siteTree("/ar"),
      },

      // Admin - SPA only, English, not locale-wrapped
      {
        path: "/admin/login",
        element: <AdminLogin />,
        entry: "src/pages/admin/Login.tsx",
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        entry: "src/components/admin/admin-layout.tsx",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "services", element: <AdminServices /> },
          { path: "products", element: <AdminProducts /> },
          { path: "blog", element: <AdminBlog /> },
          { path: "team", element: <AdminTeam /> },
          { path: "testimonials", element: <AdminTestimonials /> },
          { path: "maintenance-plans", element: <AdminMaintenancePlans /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "leads", element: <AdminLeads /> },
        ],
      },

      {
        path: "/404",
        element: (
          <LangShell lang="en">
            <NotFound />
          </LangShell>
        ),
        entry: "src/pages/NotFound.tsx",
      },
      {
        path: "*",
        element: (
          <LangShell lang="en">
            <NotFound />
          </LangShell>
        ),
      },
    ],
  },
];
