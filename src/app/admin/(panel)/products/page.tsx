import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { PRODUCT_CONFIG } from "@/components/admin/resource-configs";

export default function AdminProductsPage() {
  return (
    <AdminPage title="Products" description="Software products, e.g. Salon Assist.">
      <ResourceManager config={PRODUCT_CONFIG} />
    </AdminPage>
  );
}
