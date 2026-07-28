import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { listActivityLogs } from "@/lib/admin/activity";
import type { ActivityLogEntry } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/logs/")({
  component: AdminLogsPage,
});

function AdminLogsPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <LogsContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function actionCategory(action: string): string {
  return action.split(".")[0] ?? "other";
}

function LogsContent() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setError(null);
    listActivityLogs()
      .then(setLogs)
      .catch((err) => {
        console.error("Failed to load logs:", err);
        setError(err instanceof Error ? err.message : "Failed to retrieve activity logs");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter(
      (l) =>
        l.summary.toLowerCase().includes(term) ||
        l.actorEmail.toLowerCase().includes(term) ||
        l.action.toLowerCase().includes(term),
    );
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">
          Every action taken by an admin, recorded automatically.
        </p>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search summary, actor, or action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Activity Logs</p>
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
          No activity recorded yet — actions across the CMS will show up here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Summary</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.summary}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {actionCategory(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.actorEmail}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.createdAt?.toDate().toLocaleString() ?? "—"}
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
