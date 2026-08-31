import { redirect } from "next/navigation";
import { isAuthed, isConfigured } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { connectDB, hasMongo } from "@/lib/mongodb";

async function storageStatus(): Promise<string> {
  if (!hasMongo) return "Local file (set MONGODB_URI for MongoDB)";
  try {
    const conn = await connectDB();
    return conn ? "MongoDB - connected" : "MongoDB - unreachable";
  } catch {
    return "MongoDB - unreachable";
  }
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isConfigured()) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-sm">
          <h1 className="font-heading text-lg font-semibold text-brand-ink">
            Admin not configured
          </h1>
          <p className="mt-2 text-muted-foreground">
            Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and{" "}
            <code>AUTH_SECRET</code> in <code>.env.local</code>, then restart the
            server.
          </p>
        </div>
      </div>
    );
  }

  if (!(await isAuthed())) redirect("/admin/login");

  return <AdminShell storage={await storageStatus()}>{children}</AdminShell>;
}
