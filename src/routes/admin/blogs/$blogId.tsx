import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/blogs/BlogEditor";
import { getBlogById } from "@/lib/admin/blogs";
import type { BlogPost } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/blogs/$blogId")({
  component: EditBlogPage,
});

function EditBlogPage() {
  const { blogId } = Route.useParams();
  const [blog, setBlog] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    getBlogById(blogId).then(setBlog);
  }, [blogId]);

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
            <h1 className="font-display text-2xl font-semibold">Edit Blog</h1>
          </div>

          {blog === undefined ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : blog === null ? (
            <p className="text-sm text-muted-foreground">
              This blog post couldn't be found.
            </p>
          ) : (
            <BlogEditor key={blog.id} initial={blog} />
          )}
        </div>
      </AdminShell>
    </RequireAdmin>
  );
}
