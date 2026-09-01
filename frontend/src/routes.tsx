import type { RouteRecord } from "vite-react-ssg";
import { RootProviders } from "@/components/root-providers";
import { SiteLayout } from "@/components/site/site-layout";
import { AdminLayout } from "@/components/admin/admin-layout";
import { API_URL } from "@/lib/env";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceCategory from "@/pages/ServiceCategory";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
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

export const routes: RouteRecord[] = [
  {
    element: <RootProviders />,
    entry: "src/components/root-providers.tsx",
    children: [
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home />, entry: "src/pages/Home.tsx" },
      { path: "about", element: <About />, entry: "src/pages/About.tsx" },
      { path: "services", element: <Services />, entry: "src/pages/Services.tsx" },
      {
        path: "services/:category",
        element: <ServiceCategory />,
        entry: "src/pages/ServiceCategory.tsx",
        getStaticPaths: () => ["/services/accounting", "/services/it"],
      },
      { path: "products", element: <Products />, entry: "src/pages/Products.tsx" },
      {
        path: "products/:slug",
        element: <ProductDetail />,
        entry: "src/pages/ProductDetail.tsx",
        getStaticPaths: async () =>
          (await slugs("products", ["salon-assist"])).map(
            (s) => `/products/${s}`,
          ),
      },
      { path: "blog", element: <Blog />, entry: "src/pages/Blog.tsx" },
      {
        path: "blog/:slug",
        element: <BlogPost />,
        entry: "src/pages/BlogPost.tsx",
        getStaticPaths: async () =>
          (await slugs("posts", [])).map((s) => `/blog/${s}`),
      },
      { path: "contact", element: <Contact />, entry: "src/pages/Contact.tsx" },
    ],
  },

  // Admin - SPA only, not prerendered
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
      { path: "settings", element: <AdminSettings /> },
      { path: "leads", element: <AdminLeads /> },
    ],
  },

      { path: "/404", element: <NotFound />, entry: "src/pages/NotFound.tsx" },
      { path: "*", element: <NotFound /> },
    ],
  },
];
