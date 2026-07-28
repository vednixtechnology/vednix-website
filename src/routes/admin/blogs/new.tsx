import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/blogs/BlogEditor";

export const Route = createFileRoute("/admin/blogs/new")({
  component: NewBlogPage,
});

function NewBlogPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/blogs"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-2xl font-semibold">New Blog</h1>
          </div>
          <BlogEditor initial={null} />
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
