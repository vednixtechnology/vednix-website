import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductUpdateEditor } from "@/components/admin/updates/ProductUpdateEditor";

export const Route = createFileRoute("/admin/updates/new")({
  component: NewUpdatePage,
});

function NewUpdatePage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/updates"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-2xl font-semibold">
              New Product Update
            </h1>
          </div>
          <ProductUpdateEditor initial={null} />
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
