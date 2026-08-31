import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { TEAM_CONFIG } from "@/components/admin/resource-configs";

export default function AdminTeamPage() {
  return (
    <AdminPage title="Team" description="Profiles shown on the About page.">
      <ResourceManager config={TEAM_CONFIG} />
    </AdminPage>
  );
}
