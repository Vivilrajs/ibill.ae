import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RequireAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { api } from "@/lib/api";
import { Seo } from "@/lib/seo";

export function AdminLayout() {
  const { data } = useQuery({
    queryKey: ["health"],
    queryFn: () => api<{ db: string }>("/health"),
    staleTime: 30_000,
  });
  const storage =
    data?.db === "connected"
      ? "MongoDB - connected"
      : data
        ? "MongoDB - unreachable"
        : "checking...";

  return (
    <RequireAuth>
      <Seo title="Admin" noindex />
      <AdminShell storage={storage}>
        <Outlet />
      </AdminShell>
    </RequireAuth>
  );
}
