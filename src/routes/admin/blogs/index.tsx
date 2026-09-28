import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { can } from "@/lib/admin/permissions";
import { deleteBlog, listAdminBlogs, setBlogStatus } from "@/lib/admin/blogs";
import { logActivity } from "@/lib/admin/activity";
import type { BlogPost, BlogStatus } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/blogs/")({
  component: AdminBlogListPage,
});

const PAGE_SIZE = 10;

function AdminBlogListPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <BlogListContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function BlogListContent() {
  const { admin } = useAdminAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [page, setPage] = useState(1);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setError(err instanceof Error ? err.message : "Failed to retrieve blogs list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (
        search.trim() &&
        !b.title.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [blogs, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleToggleStatus(blog: BlogPost) {
    if (!admin) return;
    const next: BlogStatus =
      blog.status === "published" ? "draft" : "published";
    await setBlogStatus(blog.id, next, admin.uid);
    await logActivity(
      next === "published" ? "blog.published" : "blog.unpublished",
      `${next === "published" ? "Published" : "Unpublished"} blog "${blog.title}"`,
    );
    refresh();
  }

  async function handleDelete(blog: BlogPost) {
    if (!can(admin, "blog.delete")) return;
    await deleteBlog(blog.id);
    await logActivity("blog.deleted", `Deleted blog "${blog.title}"`);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Blogs</h1>
          <p className="text-sm text-muted-foreground">
            Manage every article on /insights.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as "all" | BlogStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Blogs</p>
          <p className="text-xs font-mono">{error}</p>
          <p className="text-xs text-muted-foreground pt-1">
            This usually happens if your Firestore Security Rules are not deployed, or if the database is inaccessible. Please deploy your security rules using the Firebase CLI or check your Firebase Console.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No blogs match your filters yet.
        </p>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {blog.title}
                  </TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === "published" ? "default" : "secondary"
                      }
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {blog.updatedAt?.toDate().toLocaleDateString() ?? "—"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to="/admin/blogs/$blogId"
                        params={{ blogId: blog.id }}
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(blog)}
                    >
                      {blog.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    {can(admin, "blog.delete") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{blog.title}" will be permanently removed. This
                              can't be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(blog)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
