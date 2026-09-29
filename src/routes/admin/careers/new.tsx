import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { JobEditor } from "@/components/admin/careers/JobEditor";

export const Route = createFileRoute("/admin/careers/new")({
  component: NewJobPage,
});

function NewJobPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/careers"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-2xl font-semibold">New Job</h1>
          </div>
          <JobEditor initial={null} />
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
