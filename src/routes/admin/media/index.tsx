import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { listMedia, updateMediaRecord } from "@/lib/admin/media";
import {
  deleteImageFromCloudinary,
  replaceImageInCloudinary,
} from "@/lib/cloudinary";
import type { CloudinaryFolder } from "@/lib/cloudinary";
import { logActivity } from "@/lib/admin/activity";
import type { MediaAsset } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/media/")({
  component: AdminMediaPage,
});

const FOLDERS: CloudinaryFolder[] = [
  "blogs",
  "careers",
  "press",
  "updates",
  "website",
];

function AdminMediaPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <MediaContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function MediaContent() {
  const { admin } = useAdminAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<"all" | CloudinaryFolder>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaAsset | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setAssets(await listMedia());
    } catch (err) {
      console.error("Failed to load media assets:", err);
      setError(err instanceof Error ? err.message : "Failed to retrieve media library assets");
      toast.error(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (folder !== "all" && a.folder !== folder) return false;
      if (
        search.trim() &&
        !a.publicId.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [assets, search, folder]);

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  async function handleDelete(asset: MediaAsset) {
    if (!can(admin, "media.delete")) {
      toast.error("Only Super Admins can delete media");
      return;
    }
    setBusyId(asset.id);
    try {
      await deleteImageFromCloudinary(asset.publicId, asset.id);
      await logActivity(
        "media.deleted",
        `Deleted "${asset.publicId}" from Cloudinary`,
      );
      toast.success("Image deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  function handleReplaceClick(asset: MediaAsset) {
    setReplaceTarget(asset);
    replaceInputRef.current?.click();
  }

  async function handleReplaceFileChosen(file: File) {
    if (!replaceTarget) return;
    setBusyId(replaceTarget.id);
    try {
      const result = await replaceImageInCloudinary(
        replaceTarget.publicId,
        file,
        replaceTarget.folder as CloudinaryFolder,
      );
      await updateMediaRecord(replaceTarget.id, {
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });
      await logActivity(
        "media.replaced",
        `Replaced "${replaceTarget.publicId}" with a new image`,
      );
      toast.success(
        "Image replaced — the URL stays the same everywhere it's used",
      );
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Replace failed");
    } finally {
      setBusyId(null);
      setReplaceTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Media Library</h1>
        <p className="text-sm text-muted-foreground">
          Every image uploaded through the CMS (Blogs, Product Updates, Press,
          Website Settings). Uploads are signed server-side and deletes go
          straight to Cloudinary — no secrets ever reach the browser.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={folder}
          onValueChange={(v) => setFolder(v as typeof folder)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All folders</SelectItem>
            {FOLDERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
          <p className="font-semibold text-base">Error Loading Media Library</p>
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
          No images uploaded yet — they'll show up here as soon as you upload
          one anywhere in the CMS.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-xl border border-border"
            >
              <img
                src={asset.url}
                alt={asset.publicId}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                <span className="self-start rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  {asset.folder}
                </span>
                <div className="flex justify-end gap-1.5">
                  {busyId === asset.id ? (
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-black/60">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        title="Copy URL"
                        onClick={() => handleCopy(asset.url)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        title="Replace"
                        onClick={() => handleReplaceClick(asset)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      {can(admin, "media.delete") && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Permanently delete this image?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the file from Cloudinary storage
                                entirely — any content still referencing this URL
                                will show a broken image. This can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(asset)}
                              >
                                Delete permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReplaceFileChosen(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
