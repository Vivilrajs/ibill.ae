import { AdminPage } from "@/components/admin/admin-page";
import { SettingsForm } from "@/components/admin/settings-form";
import { ResourceManager } from "@/components/admin/resource-manager";
import { FAQ_CONFIG } from "@/components/admin/resource-configs";

export default function AdminSettingsPage() {
  return (
    <AdminPage
      title="Site settings"
      description="Global contact details, social links, homepage counters and FAQs."
    >
      <SettingsForm />

      <section className="mt-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-brand-ink">
          FAQs
        </h2>
        <ResourceManager config={FAQ_CONFIG} />
      </section>
    </AdminPage>
  );
}
