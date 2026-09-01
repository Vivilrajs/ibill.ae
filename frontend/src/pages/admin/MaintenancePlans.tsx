import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { MAINTENANCE_PLAN_CONFIG } from "@/components/admin/resource-configs";

export default function AdminMaintenancePlansPage() {
  return (
    <AdminPage
      title="Maintenance plans"
      description="Annual Maintenance Plan (AMP) tiers and fees shown on the maintenance plans page."
    >
      <ResourceManager config={MAINTENANCE_PLAN_CONFIG} />
    </AdminPage>
  );
}
