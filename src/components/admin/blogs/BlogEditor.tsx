import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/admin/blogs/RichTextEditor";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { sanitizeHtml } from "@/lib/sanitize";
import { ensureCategory, listCategories } from "@/lib/admin/categories";
import { logActivity } from "@/lib/admin/activity";
import {
  computeReadingTime,
  createBlog,
  isSlugTaken,
  slugify,
  updateBlog,
} from "@/lib/admin/blogs";
import type {
  BlogCategory,
  BlogInput,
  BlogPost,
  BlogStatus,
} from "@/lib/admin/types";

interface BlogEditorProps {
  initial: BlogPost | null; // null = creating a new post
}

interface FormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  coverImageUrl: string | null;
  ogImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  readingTimeMinutes: number;
}

function toFormState(post: BlogPost | null): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    slugTouched: !!post,
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "",
    tags: post?.tags.join(", ") ?? "",
    author: post?.author ?? "Vednix Team",
    coverImageUrl: post?.coverImageUrl ?? null,
    ogImageUrl: post?.ogImageUrl ?? null,
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    canonicalUrl: post?.canonicalUrl ?? "",
    readingTimeMinutes: post?.readingTimeMinutes ?? 1,
  };
}

export function BlogEditor({ initial }: BlogEditorProps) {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  const [blogId, setBlogId] = useState<string | null>(initial?.id ?? null);
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initial?.updatedAt?.toDate() ?? null,
  );

  const coverInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    dirtyRef.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(value: string) {
    dirtyRef.current = true;
    setForm((f) => ({
      ...f,
      title: value,
      slug: f.slugTouched ? f.slug : slugify(value),
    }));
  }

  function handleContentChange(html: string) {
    dirtyRef.current = true;
    setForm((f) => ({
      ...f,
      content: html,
      readingTimeMinutes: computeReadingTime(html),
    }));
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    try {
      const result = await uploadImageToCloudinary(file, "blogs");
      updateField("coverImageUrl", result.url);
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleOgUpload(file: File) {
    setUploadingOg(true);
    try {
      const result = await uploadImageToCloudinary(file, "blogs");
      updateField("ogImageUrl", result.url);
      toast.success("Open Graph image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingOg(false);
    }
  }

  /** Used by the rich text editor's "insert image" toolbar button. */
  async function handleEditorImageUpload(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        try {
          const result = await uploadImageToCloudinary(file, "blogs");
          resolve(result.url);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
          resolve(null);
        }
      };
      input.click();
    });
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    const category = await ensureCategory(newCategory.trim());
    setCategories((c) =>
      c.some((existing) => existing.id === category.id) ? c : [...c, category],
    );
    updateField("category", category.name);
    setNewCategory("");
  }

  function buildInput(nextStatus: BlogStatus): BlogInput {
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category.trim() || "Uncategorized",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: form.author.trim() || "Vednix Team",
      status: nextStatus,
      coverImageUrl: form.coverImageUrl,
      ogImageUrl: form.ogImageUrl,
      seoTitle: form.seoTitle.trim() || form.title.trim(),
      seoDescription: form.seoDescription.trim() || form.excerpt.trim(),
      canonicalUrl: form.canonicalUrl.trim(),
      readingTimeMinutes: form.readingTimeMinutes,
      publishDate:
        nextStatus === "published"
          ? (initial?.publishDate?.toDate() ?? new Date())
          : (initial?.publishDate?.toDate() ?? null),
    };
  }

  async function validateBeforeSave(): Promise<string | null> {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    const taken = await isSlugTaken(form.slug.trim(), blogId ?? undefined);
    if (taken)
      return `The slug "${form.slug}" is already used by another post.`;
    return null;
  }

  async function handleSave(nextStatus: BlogStatus, { silent = false } = {}) {
    if (!admin) return;
    if (!silent) {
      const error = await validateBeforeSave();
      if (error) {
        toast.error(error);
        return;
      }
    }
    setSaving(true);
    try {
      const input = buildInput(nextStatus);
      if (blogId) {
        await updateBlog(blogId, input, admin.uid);
      } else {
        const id = await createBlog(input, admin.uid);
        setBlogId(id);
      }
      setStatus(nextStatus);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      if (!silent) {
        await logActivity(
          nextStatus === "published" ? "blog.published" : "blog.draft_saved",
          `${nextStatus === "published" ? "Published" : "Saved draft of"} blog "${input.title}"`,
        );
        toast.success(
          nextStatus === "published" ? "Published!" : "Draft saved",
        );
        navigate({ to: "/admin/blogs" });
      }
    } catch (err) {
      if (!silent)
        toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // Autosave every 20s for posts that already exist, so nothing is lost
  // while writing a long article. Silent — doesn't navigate or toast.
  useEffect(() => {
    if (!blogId) return;
    const interval = setInterval(() => {
      if (dirtyRef.current && form.title.trim()) {
        handleSave(status, { silent: true });
      }
    }, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, form, status]);

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
                placeholder="How Vednix is redefining fintech onboarding"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  dirtyRef.current = true;
                  setForm((f) => ({
                    ...f,
                    slug: slugify(e.target.value),
                    slugTouched: true,
                  }));
                }}
              />
              <p className="text-xs text-muted-foreground">
                /insights/{form.slug || "your-post-slug"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="A short summary shown on the /insights cards"
              />
            </div>
          </section>

          <section className="space-y-2 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <Label>Content</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
            </div>
            <RichTextEditor
              value={form.content}
              onChange={handleContentChange}
              onRequestImageUpload={handleEditorImageUpload}
            />
            <p className="text-xs text-muted-foreground">
              Estimated reading time: {form.readingTimeMinutes} min
            </p>
          </section>

          <section className="space-y-4 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">SEO</h3>
            <div className="space-y-1.5">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={form.seoTitle}
                onChange={(e) => updateField("seoTitle", e.target.value)}
                placeholder={form.title || "Falls back to Title"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                rows={2}
                value={form.seoDescription}
                onChange={(e) => updateField("seoDescription", e.target.value)}
                placeholder={form.excerpt || "Falls back to Excerpt"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={form.canonicalUrl}
                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                placeholder={`https://vednix.com/insights/${form.slug || "slug"}`}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Publish</h3>
            <p className="text-xs text-muted-foreground">
              {lastSavedAt
                ? `Last saved ${lastSavedAt.toLocaleTimeString()}`
                : "Not saved yet"}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => handleSave("draft")}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Draft"
                )}
              </Button>
              <Button
                type="button"
                disabled={saving}
                onClick={() => handleSave("published")}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "published" ? (
                  "Update & Republish"
                ) : (
                  "Publish"
                )}
              </Button>
              {status === "published" && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={saving}
                  onClick={() => handleSave("draft")}
                >
                  Unpublish
                </Button>
              )}
            </div>
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
                  onClick={() => updateField("coverImageUrl", null)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50"
              >
                {uploadingCover ? (
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

          <section className="space-y-3 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Open Graph Image</h3>
            <p className="text-xs text-muted-foreground">
              Used for social share previews. Falls back to the cover image if
              empty.
            </p>
            {form.ogImageUrl ? (
              <div className="relative">
                <img
                  src={form.ogImageUrl}
                  alt="Open Graph"
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateField("ogImageUrl", null)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => ogInputRef.current?.click()}
                disabled={uploadingOg}
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50"
              >
                {uploadingOg ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5" />
                    Upload OG image
                  </>
                )}
              </button>
            )}
            <input
              ref={ogInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleOgUpload(file);
                e.target.value = "";
              }}
            />
          </section>

          <section className="space-y-4 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Metadata</h3>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category || undefined}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-1">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCategory}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="fintech, product, launch"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>
          </section>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.title || "Untitled post"}</DialogTitle>
          </DialogHeader>
          {form.coverImageUrl && (
            <img
              src={form.coverImageUrl}
              alt="Cover"
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(form.content) }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
