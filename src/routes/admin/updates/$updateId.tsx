import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductUpdateEditor } from "@/components/admin/updates/ProductUpdateEditor";
import { getUpdateById } from "@/lib/admin/productUpdates";
import type { ProductUpdate } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/updates/$updateId")({
  component: EditUpdatePage,
});

function EditUpdatePage() {
  const { updateId } = Route.useParams();
  const [item, setItem] = useState<ProductUpdate | null | undefined>(undefined);

  useEffect(() => {
    getUpdateById(updateId).then(setItem);
  }, [updateId]);

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
              Edit Product Update
            </h1>
          </div>
          {item === undefined ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : item === null ? (
            <p className="text-sm text-muted-foreground">
              This update couldn't be found.
            </p>
          ) : (
            <ProductUpdateEditor key={item.id} initial={item} />
          )}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
