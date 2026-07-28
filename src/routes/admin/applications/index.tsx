import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  deleteApplication,
  listApplications,
  updateApplicationNotes,
  updateApplicationStatus,
} from "@/lib/admin/careerApplications";
import { logActivity } from "@/lib/admin/activity";
import type { ApplicationStatus, CareerApplication } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/applications/")({
  component: AdminApplicationsPage,
});

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

function AdminApplicationsPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <ApplicationsContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function ApplicationsContent() {
  const [apps, setApps] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
    "all",
  );
  const [selected, setSelected] = useState<CareerApplication | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  async function refresh() {
    setLoading(true);
    setApps(await listApplications());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        if (
          !a.fullName.toLowerCase().includes(term) &&
          !a.email.toLowerCase().includes(term) &&
          !a.position.toLowerCase().includes(term)
        )
          return false;
      }
      return true;
    });
  }, [apps, search, statusFilter]);

  async function handleStatusChange(
    app: CareerApplication,
    status: ApplicationStatus,
  ) {
    await updateApplicationStatus(app.id, status);
    await logActivity(
      "application.status_changed",
      `Marked ${app.fullName}'s application as "${STATUS_LABELS[status]}"`,
    );
    refresh();
  }

  async function handleDelete(app: CareerApplication) {
    await deleteApplication(app.id);
    await logActivity(
      "application.deleted",
      `Deleted application from ${app.fullName}`,
    );
    refresh();
  }

  async function handleSaveNotes() {
    if (!selected) return;
    await updateApplicationNotes(selected.id, notesDraft);
    await logActivity(
      "application.notes_updated",
      `Updated notes for ${selected.fullName}`,
    );
    setSelected(null);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Career Applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Every submission from /career-apply.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | ApplicationStatus)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No applications match your filters yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Applied Job</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{app.email}</div>
                    <div>{app.phone}</div>
                  </TableCell>
                  <TableCell>
                    {app.resumeLink ? (
                      <a
                        href={app.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-electric hover:underline"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(v) =>
                        handleStatusChange(app, v as ApplicationStatus)
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.createdAt?.toDate().toLocaleDateString() ?? "—"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(app);
                        setNotesDraft(app.notes);
                      }}
                    >
                      Notes
                    </Button>
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
                            Delete this application?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {app.fullName}'s application will be permanently
                            removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(app)}>
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

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes — {selected?.fullName}</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={6}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Internal notes about this candidate..."
          />
          <Button onClick={handleSaveNotes}>Save Notes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
