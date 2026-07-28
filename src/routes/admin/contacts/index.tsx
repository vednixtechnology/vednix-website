import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  deleteContactMessage,
  listContactMessages,
  updateContactNotes,
  updateContactStatus,
} from "@/lib/admin/contacts";
import { logActivity } from "@/lib/admin/activity";
import type { ContactMessage, ContactStatus } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/contacts/")({
  component: AdminContactsPage,
});

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function AdminContactsPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <ContactsContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function ContactsContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactStatus>(
    "all",
  );
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setMessages(await listContactMessages());
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setError(err instanceof Error ? err.message : "Failed to retrieve contacts list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        if (
          !m.fullName.toLowerCase().includes(term) &&
          !m.email.toLowerCase().includes(term) &&
          !m.subject.toLowerCase().includes(term)
        )
          return false;
      }
      return true;
    });
  }, [messages, search, statusFilter]);

  async function handleStatusChange(
    msg: ContactMessage,
    status: ContactStatus,
  ) {
    await updateContactStatus(msg.id, status);
    await logActivity(
      "contact.status_changed",
      `Marked message from ${msg.fullName} as "${STATUS_LABELS[status]}"`,
    );
    refresh();
  }

  async function handleDelete(msg: ContactMessage) {
    await deleteContactMessage(msg.id);
    await logActivity(
      "contact.deleted",
      `Deleted message from ${msg.fullName}`,
    );
    refresh();
  }

  async function handleSaveNotes() {
    if (!selected) return;
    await updateContactNotes(selected.id, notesDraft);
    await logActivity(
      "contact.notes_updated",
      `Updated notes for ${selected.fullName}`,
    );
    setSelected(null);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Contact Leads</h1>
        <p className="text-sm text-muted-foreground">
          Every submission from the /contact form.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | ContactStatus)}
        >
          <SelectTrigger className="w-40">
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

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Contact Leads</p>
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
          No messages match your filters yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{msg.email}</div>
                    <div>{msg.phone}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {msg.subject}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={msg.status}
                      onValueChange={(v) =>
                        handleStatusChange(msg, v as ContactStatus)
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
                    {msg.createdAt?.toDate().toLocaleDateString() ?? "—"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(msg);
                        setNotesDraft(msg.notes);
                      }}
                    >
                      View
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
                            Delete this message?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            The message from {msg.fullName} will be permanently
                            removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(msg)}>
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
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              From <span className="text-foreground">{selected?.fullName}</span>{" "}
              · {selected?.email} · {selected?.phone}
            </p>
            <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3">
              {selected?.message}
            </p>
          </div>
          <Textarea
            rows={4}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Internal notes..."
          />
          <Button onClick={handleSaveNotes}>Save Notes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
