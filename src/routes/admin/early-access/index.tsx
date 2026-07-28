import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Loader2, Search } from "lucide-react";
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
  deleteEarlyAccessUser,
  listEarlyAccessUsers,
} from "@/lib/admin/earlyAccess";
import { exportToCsv } from "@/lib/admin/csv";
import { logActivity } from "@/lib/admin/activity";
import type { EarlyAccessUser } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/early-access/")({
  component: AdminEarlyAccessPage,
});

function AdminEarlyAccessPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <EarlyAccessContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function EarlyAccessContent() {
  const [users, setUsers] = useState<EarlyAccessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listEarlyAccessUsers());
    } catch (err) {
      console.error("Failed to load early access signups:", err);
      setError(err instanceof Error ? err.message : "Failed to retrieve early access list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.city.toLowerCase().includes(term),
    );
  }, [users, search]);

  async function handleDelete(user: EarlyAccessUser) {
    await deleteEarlyAccessUser(user.id);
    await logActivity(
      "early_access.deleted",
      `Deleted early access signup from ${user.fullName}`,
    );
    refresh();
  }

  function handleExport() {
    exportToCsv(
      filtered.map((u) => ({
        Name: u.fullName,
        Email: u.email,
        Phone: u.phone,
        Occupation: u.occupation,
        City: u.city,
        Date: u.createdAt?.toDate().toISOString() ?? "",
      })),
      `early-access-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    logActivity(
      "early_access.exported",
      `Exported ${filtered.length} early access signups to CSV`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Early Access</h1>
          <p className="text-sm text-muted-foreground">
            Everyone who signed up from /early-access.
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

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name, email, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Early Access Signups</p>
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
          No early access signups match your search yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{user.email}</div>
                    <div>{user.phone}</div>
                  </TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt?.toDate().toLocaleDateString() ?? "—"}
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
                            Delete this signup?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {user.fullName}'s early access signup will be
                            permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user)}>
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
