import { AdminPage } from "@/components/admin/admin-page";
import { ResourceManager } from "@/components/admin/resource-manager";
import { TESTIMONIAL_CONFIG } from "@/components/admin/resource-configs";

export default function AdminTestimonialsPage() {
  return (
    <AdminPage title="Testimonials" description="Client quotes shown on the home page.">
      <ResourceManager config={TESTIMONIAL_CONFIG} />
    </AdminPage>
  );
}
