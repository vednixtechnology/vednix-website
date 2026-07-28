import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { PressReleaseEditor } from "@/components/admin/press/PressReleaseEditor";
import { getPressReleaseById } from "@/lib/admin/pressReleases";
import type { PressRelease } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/press/$pressId")({
  component: EditPressPage,
});

function EditPressPage() {
  const { pressId } = Route.useParams();
  const [item, setItem] = useState<PressRelease | null | undefined>(undefined);

  useEffect(() => {
    getPressReleaseById(pressId).then(setItem);
  }, [pressId]);

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
              Edit Press Release
            </h1>
          </div>
          {item === undefined ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : item === null ? (
            <p className="text-sm text-muted-foreground">
              This press release couldn't be found.
            </p>
          ) : (
            <PressReleaseEditor key={item.id} initial={item} />
          )}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
