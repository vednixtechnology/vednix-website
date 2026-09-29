import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { JobEditor } from "@/components/admin/careers/JobEditor";
import { getJobById } from "@/lib/admin/careers";
import type { CareerJob } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/careers/$jobId")({
  component: EditJobPage,
});

function EditJobPage() {
  const { jobId } = Route.useParams();
  const [job, setJob] = useState<CareerJob | null | undefined>(undefined);

  useEffect(() => {
    getJobById(jobId).then(setJob);
  }, [jobId]);

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
            <h1 className="font-display text-2xl font-semibold">Edit Job</h1>
          </div>

          {job === undefined ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : job === null ? (
            <p className="text-sm text-muted-foreground">
              This job couldn't be found.
            </p>
          ) : (
            <JobEditor key={job.id} initial={job} />
          )}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
