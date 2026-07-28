import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "@/lib/admin/activity";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
} from "@/lib/admin/settings";
import type { WebsiteSettingsInput } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/settings/")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <SettingsContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function ImageField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "website";
}) {
  const { admin } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!admin) return;
    setUploading(true);
    try {
      const result = await uploadImageToCloudinary(file, folder);
      onChange(result.url);
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt={label}
            className="h-12 w-12 rounded-lg border border-border object-contain bg-muted/30"
          />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
            <UploadCloud className="h-4 w-4" />
          </div>
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function SettingsContent() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState<WebsiteSettingsInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWebsiteSettings()
      .then((s) => {
        const { updatedAt: _updatedAt, updatedBy: _updatedBy, ...rest } = s;
        setSettings(rest);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setError(err instanceof Error ? err.message : "Failed to load website settings");
        toast.error("Failed to load settings: " + (err instanceof Error ? err.message : ""));
      });
  }, []);

  function update<K extends keyof WebsiteSettingsInput>(
    key: K,
    value: WebsiteSettingsInput[K],
  ) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleSave() {
    if (!admin || !settings) return;
    setSaving(true);
    try {
      await updateWebsiteSettings(settings, admin.uid);
      await logActivity("settings.updated", "Updated website settings");
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive space-y-2">
        <p className="font-semibold text-base">Error Loading Website Settings</p>
        <p className="text-xs font-mono">{error}</p>
        <p className="text-xs text-muted-foreground pt-1">
          This usually happens if your Firestore Security Rules are not deployed, or if the database is inaccessible. Please deploy your security rules using the Firebase CLI or check your Firebase Console.
        </p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Website Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Stored in Firestore and ready to use — see the note at the bottom
            about what currently reads from these values.
          </p>
        </div>
        <Button disabled={saving} onClick={handleSave}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent
          value="general"
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label>Announcement Bar</Label>
              <p className="text-xs text-muted-foreground">
                Show a banner at the top of the site.
              </p>
            </div>
            <Switch
              checked={settings.announcementBarEnabled}
              onCheckedChange={(v) => update("announcementBarEnabled", v)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="announcementBarText">Announcement Bar Text</Label>
            <Input
              id="announcementBarText"
              value={settings.announcementBarText}
              onChange={(e) => update("announcementBarText", e.target.value)}
              placeholder="🚀 SmartPocket early access is now open!"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerText">Footer Text</Label>
            <Textarea
              id="footerText"
              rows={2}
              value={settings.footerText}
              onChange={(e) => update("footerText", e.target.value)}
              placeholder="© 2026 Vednix Technology. All rights reserved."
            />
          </div>
        </TabsContent>

        <TabsContent
          value="branding"
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <ImageField
            label="Logo"
            value={settings.logoUrl}
            onChange={(v) => update("logoUrl", v)}
            folder="website"
          />
          <ImageField
            label="Favicon"
            value={settings.faviconUrl}
            onChange={(v) => update("faviconUrl", v)}
            folder="website"
          />
          <ImageField
            label="Hero Banner"
            value={settings.heroBannerUrl}
            onChange={(v) => update("heroBannerUrl", v)}
            folder="website"
          />
        </TabsContent>

        <TabsContent
          value="contact"
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhoneAlt">Phone (secondary)</Label>
              <Input
                id="contactPhoneAlt"
                value={settings.contactPhoneAlt}
                onChange={(e) => update("contactPhoneAlt", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={2}
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
            <Input
              id="googleMapsUrl"
              value={settings.googleMapsUrl}
              onChange={(e) => update("googleMapsUrl", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["linkedinUrl", "LinkedIn"],
                ["instagramUrl", "Instagram"],
                ["twitterUrl", "Twitter / X"],
                ["githubUrl", "GitHub"],
                ["youtubeUrl", "YouTube"],
              ] as const
            ).map(([key, label]) => (
              <div className="space-y-1.5" key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={settings[key]}
                  onChange={(e) => update(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
              <Input
                id="privacyPolicyUrl"
                value={settings.privacyPolicyUrl}
                onChange={(e) => update("privacyPolicyUrl", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="termsUrl">Terms URL</Label>
              <Input
                id="termsUrl"
                value={settings.termsUrl}
                onChange={(e) => update("termsUrl", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="seo"
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="seoDefaultTitle">Default Meta Title</Label>
            <Input
              id="seoDefaultTitle"
              value={settings.seoDefaultTitle}
              onChange={(e) => update("seoDefaultTitle", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDefaultDescription">
              Default Meta Description
            </Label>
            <Textarea
              id="seoDefaultDescription"
              rows={2}
              value={settings.seoDefaultDescription}
              onChange={(e) => update("seoDefaultDescription", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDefaultKeywords">Default Keywords</Label>
            <Input
              id="seoDefaultKeywords"
              value={settings.seoDefaultKeywords}
              onChange={(e) => update("seoDefaultKeywords", e.target.value)}
              placeholder="fintech, budgeting app, SmartPocket"
            />
          </div>
          <ImageField
            label="Default Open Graph Image"
            value={settings.defaultOgImageUrl}
            onChange={(v) => update("defaultOgImageUrl", v)}
            folder="website"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => update("googleAnalyticsId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <Input
                id="googleTagManagerId"
                value={settings.googleTagManagerId}
                onChange={(e) => update("googleTagManagerId", e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="advanced"
          className="space-y-4 rounded-xl border border-border p-4"
        >
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label>Sitemap</Label>
              <p className="text-xs text-muted-foreground">
                Include this site in sitemap.xml generation.
              </p>
            </div>
            <Switch
              checked={settings.sitemapEnabled}
              onCheckedChange={(v) => update("sitemapEnabled", v)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="robotsTxt">robots.txt</Label>
            <Textarea
              id="robotsTxt"
              rows={5}
              className="font-mono text-sm"
              value={settings.robotsTxt}
              onChange={(e) => update("robotsTxt", e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <p className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        <strong>Note:</strong> these settings are saved to Firestore and this
        form is fully functional, but the live Navbar, Footer, and page SEO tags
        don't read from them yet — wiring that up means editing those files
        directly, which was explicitly off-limits for this project. Say the word
        and I'll do that as a deliberate, scoped follow-up.
      </p>
    </div>
  );
}
