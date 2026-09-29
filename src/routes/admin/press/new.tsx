import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { PressReleaseEditor } from "@/components/admin/press/PressReleaseEditor";

export const Route = createFileRoute("/admin/press/new")({
  component: NewPressPage,
});

function NewPressPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/press"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-2xl font-semibold">
              New Press Release
            </h1>
          </div>
          <PressReleaseEditor initial={null} />
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
