import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { SERVICE_CONFIG } from "@/components/admin/resource-configs";

export default function AdminServicesPage() {
  return (
    <AdminPage title="Services" description="Accounting and IT services shown across the site.">
      <ResourceManager config={SERVICE_CONFIG} />
    </AdminPage>
  );
}
