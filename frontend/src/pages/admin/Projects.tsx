import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { PROJECT_CONFIG } from "@/components/admin/resource-configs";

export default function AdminProjectsPage() {
  return (
    <AdminPage
      title="Projects"
      description="Portfolio case studies shown on the projects page and detail pages."
    >
      <ResourceManager config={PROJECT_CONFIG} />
    </AdminPage>
  );
}
