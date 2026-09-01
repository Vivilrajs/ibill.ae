import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type {
  Service,
  Product,
  Post,
  TeamMember,
  Testimonial,
  Faq,
  MaintenancePlan,
  SiteSettings,
  Lead,
  ResourceKey,
} from "./types";

const list =
  <T>(path: string) =>
  () =>
    api<{ items: T[] }>(path).then((r) => r.items);

/* -------------------------------- public -------------------------------- */

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: list<Service>("/services") });

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: list<Product>("/products") });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: () => api<{ item: Product }>(`/products/${slug}`).then((r) => r.item),
  });

export const usePosts = () =>
  useQuery({ queryKey: ["posts"], queryFn: list<Post>("/posts") });

export const usePost = (slug: string) =>
  useQuery({
    queryKey: ["posts", slug],
    queryFn: () => api<{ item: Post }>(`/posts/${slug}`).then((r) => r.item),
  });

export const useTeam = () =>
  useQuery({ queryKey: ["team"], queryFn: list<TeamMember>("/team") });

export const useTestimonials = () =>
  useQuery({
    queryKey: ["testimonials"],
    queryFn: list<Testimonial>("/testimonials"),
  });

export const useFaqs = () =>
  useQuery({ queryKey: ["faqs"], queryFn: list<Faq>("/faqs") });

export const useMaintenancePlans = () =>
  useQuery({
    queryKey: ["maintenancePlans"],
    queryFn: list<MaintenancePlan>("/maintenance-plans"),
  });

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: () =>
      api<{ settings: SiteSettings }>("/settings").then((r) => r.settings),
  });

/* -------------------------------- admin --------------------------------- */

export const useAdminList = <T>(resource: ResourceKey) =>
  useQuery({
    queryKey: ["admin", resource],
    queryFn: () =>
      api<{ items: T[] }>(`/admin/content/${resource}`, { auth: true }).then(
        (r) => r.items,
      ),
  });

export function useResourceMutations(resource: ResourceKey) {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", resource] });
    qc.invalidateQueries({ queryKey: [resource] });
  };
  return {
    create: useMutation({
      mutationFn: (data: Record<string, unknown>) =>
        api(`/admin/content/${resource}`, { method: "POST", body: data, auth: true }),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
        api(`/admin/content/${resource}/${id}`, {
          method: "PUT",
          body: data,
          auth: true,
        }),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        api(`/admin/content/${resource}/${id}`, { method: "DELETE", auth: true }),
      onSuccess: invalidate,
    }),
  };
}

export const useAdminSettings = () =>
  useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () =>
      api<{ settings: SiteSettings }>("/admin/settings", { auth: true }).then(
        (r) => r.settings,
      ),
  });

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) =>
      api("/admin/settings", { method: "PUT", body: data, auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export const useLeads = () =>
  useQuery({
    queryKey: ["admin", "leads"],
    queryFn: () =>
      api<{ items: Lead[] }>("/admin/leads", { auth: true }).then((r) => r.items),
  });

export function useLeadMutations() {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin", "leads"] });
  return {
    setHandled: useMutation({
      mutationFn: ({ id, handled }: { id: string; handled: boolean }) =>
        api(`/admin/leads/${id}`, {
          method: "PATCH",
          body: { handled },
          auth: true,
        }),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        api(`/admin/leads/${id}`, { method: "DELETE", auth: true }),
      onSuccess: invalidate,
    }),
  };
}

export const submitContact = (data: Record<string, unknown>) =>
  api("/contact", { method: "POST", body: data });
