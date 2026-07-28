import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Info, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  deleteNewsletterSubscriber,
  listNewsletterSubscribers,
} from "@/lib/admin/newsletter";
import { exportToCsv } from "@/lib/admin/csv";
import { logActivity } from "@/lib/admin/activity";
import type { NewsletterSubscriber } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/newsletter/")({
  component: AdminNewsletterPage,
});

function AdminNewsletterPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <NewsletterContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function NewsletterContent() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setSubscribers(await listNewsletterSubscribers());
    } catch (err) {
      console.error("Failed to load subscribers:", err);
      setError(err instanceof Error ? err.message : "Failed to retrieve newsletter subscribers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(term));
  }, [subscribers, search]);

  async function handleDelete(sub: NewsletterSubscriber) {
    await deleteNewsletterSubscriber(sub.id);
    await logActivity("newsletter.deleted", `Removed subscriber ${sub.email}`);
    refresh();
  }

  function handleExport() {
    exportToCsv(
      filtered.map((s) => ({
        Email: s.email,
        Date: s.createdAt?.toDate().toISOString() ?? "",
      })),
      `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    logActivity(
      "newsletter.exported",
      `Exported ${filtered.length} subscribers to CSV`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Newsletter</h1>
          <p className="text-sm text-muted-foreground">
            Subscribers saved to the newsletter_subscribers collection.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={filtered.length === 0}
        >
          <Download className="mr-1.5 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {subscribers.length === 0 && !loading && !error && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            No subscribers yet — there's no public signup form on the site yet
            either. This page is fully wired up and will populate as soon as a
            newsletter form (footer, a dedicated page, etc.) is added and starts
            writing to the <code>newsletter_subscribers</code> collection.
          </p>
        </div>
      )}

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Newsletter Subscribers</p>
          <p className="text-xs font-mono">{error}</p>
          <p className="text-xs text-muted-foreground pt-1">
            This usually happens if your Firestore Security Rules are not deployed, or if the database is inaccessible. Please deploy your security rules using the Firebase CLI or check your Firebase Console.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? null : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.createdAt?.toDate().toLocaleDateString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
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
                          <AlertDialogTitle>
                            Remove this subscriber?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {sub.email} will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(sub)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
