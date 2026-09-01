import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { POST_CONFIG } from "@/components/admin/resource-configs";

export default function AdminBlogPage() {
  return (
    <AdminPage title="Blog" description="Articles. Unpublished posts stay hidden from the site.">
      <ResourceManager config={POST_CONFIG} />
    </AdminPage>
  );
}
