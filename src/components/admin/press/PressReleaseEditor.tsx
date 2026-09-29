import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/blogs/RichTextEditor";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/lib/admin/blogs";
import { logActivity } from "@/lib/admin/activity";
import {
  createPressRelease,
  isPressSlugTaken,
  updatePressRelease,
} from "@/lib/admin/pressReleases";
import type {
  PressRelease,
  PressReleaseInput,
  PublishStatus,
} from "@/lib/admin/types";

interface FormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  content: string;
  coverImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

function toFormState(p: PressRelease | null): FormState {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    slugTouched: !!p,
    content: p?.content ?? "",
    coverImageUrl: p?.coverImageUrl ?? null,
    seoTitle: p?.seoTitle ?? "",
    seoDescription: p?.seoDescription ?? "",
    canonicalUrl: p?.canonicalUrl ?? "",
  };
}

export function PressReleaseEditor({
  initial,
}: {
  initial: PressRelease | null;
}) {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [releaseId] = useState<string | null>(initial?.id ?? null);
  const [status, setStatus] = useState<PublishStatus>(
    initial?.status ?? "draft",
  );
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: f.slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadImageToCloudinary(file, "press");
      update("coverImageUrl", result.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleEditorImageUpload(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        try {
          const result = await uploadImageToCloudinary(file, "press");
          resolve(result.url);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
          resolve(null);
        }
      };
      input.click();
    });
  }

  function buildInput(nextStatus: PublishStatus): PressReleaseInput {
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content,
      coverImageUrl: form.coverImageUrl,
      seoTitle: form.seoTitle.trim() || form.title.trim(),
      seoDescription: form.seoDescription.trim(),
      canonicalUrl: form.canonicalUrl.trim(),
      status: nextStatus,
      publishDate:
        nextStatus === "published"
          ? (initial?.publishDate?.toDate() ?? new Date())
          : (initial?.publishDate?.toDate() ?? null),
    };
  }

  async function handleSave(nextStatus: PublishStatus) {
    if (!admin) return;
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }
    const taken = await isPressSlugTaken(
      form.slug.trim(),
      releaseId ?? undefined,
    );
    if (taken) {
      toast.error(
        `The slug "${form.slug}" is already used by another press release.`,
      );
      return;
    }
    setSaving(true);
    try {
      const input = buildInput(nextStatus);
      if (releaseId) {
        await updatePressRelease(releaseId, input, admin.uid);
      } else {
        await createPressRelease(input, admin.uid);
      }
      await logActivity(
        nextStatus === "published" ? "press.published" : "press.draft_saved",
        `${nextStatus === "published" ? "Published" : "Saved draft of"} press release "${input.title}"`,
      );
      toast.success(nextStatus === "published" ? "Published!" : "Draft saved");
      navigate({ to: "/admin/press" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setStatus(nextStatus);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-xl border border-border p-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Vednix Technology Raises Seed Round"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    slug: slugify(e.target.value),
                    slugTouched: true,
                  }));
                }}
              />
              <p className="text-xs text-muted-foreground">
                /press/{form.slug || "your-release-slug"}
              </p>
            </div>
          </section>

          <section className="space-y-2 rounded-xl border border-border p-4">
            <Label>Content</Label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => update("content", html)}
              onRequestImageUpload={handleEditorImageUpload}
            />
          </section>

          <section className="space-y-4 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">SEO</h3>
            <div className="space-y-1.5">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={form.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value)}
                placeholder={form.title || "Falls back to Title"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                rows={2}
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={form.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder={`https://vednix.com/press/${form.slug || "slug"}`}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Publish</h3>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as PublishStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={saving}
              onClick={() => handleSave(status)}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </section>

          <section className="space-y-3 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Cover Image</h3>
            {form.coverImageUrl ? (
              <div className="relative">
                <img
                  src={form.coverImageUrl}
                  alt="Cover"
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => update("coverImageUrl", null)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploading}
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5" />
                    Upload cover image
                  </>
                )}
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
                e.target.value = "";
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
