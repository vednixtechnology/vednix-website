import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { logActivity } from "@/lib/admin/activity";
import { createJob, updateJob } from "@/lib/admin/careers";
import { CAREER_ICONS } from "@/lib/admin/careerIcons";
import type { CareerJob, CareerJobInput, JobStatus } from "@/lib/admin/types";

interface JobEditorProps {
  initial: CareerJob | null;
}

interface FormState {
  title: string;
  department: string;
  badgeColor: "emerald" | "electric";
  iconKey: string;
  location: string;
  employmentType: string;
  experience: string;
  duration: string;
  overview: string;
  responsibilities: string; // one per line
  requirements: string; // comma-separated
  preferred: string; // comma-separated
  salary: string;
  applyLink: string;
}

function toFormState(job: CareerJob | null): FormState {
  return {
    title: job?.title ?? "",
    department: job?.department ?? "",
    badgeColor: job?.badgeColor ?? "emerald",
    iconKey: job?.iconKey ?? "briefcase",
    location: job?.location ?? "Remote / Hybrid",
    employmentType: job?.employmentType ?? "Internship",
    experience: job?.experience ?? "",
    duration: job?.duration ?? "",
    overview: job?.overview ?? "",
    responsibilities: job?.responsibilities.join("\n") ?? "",
    requirements: job?.requirements.join(", ") ?? "",
    preferred: job?.preferred.join(", ") ?? "",
    salary: job?.salary ?? "",
    applyLink: job?.applyLink ?? "",
  };
}

export function JobEditor({ initial }: JobEditorProps) {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [jobId] = useState<string | null>(initial?.id ?? null);
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? "open");
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function buildInput(): CareerJobInput {
    return {
      title: form.title.trim(),
      department: form.department.trim(),
      badgeColor: form.badgeColor,
      iconKey: form.iconKey,
      location: form.location.trim(),
      employmentType: form.employmentType.trim(),
      experience: form.experience.trim(),
      duration: form.duration.trim(),
      overview: form.overview.trim(),
      responsibilities: form.responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      requirements: form.requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      preferred: form.preferred
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      salary: form.salary.trim() || null,
      applyLink: form.applyLink.trim() || null,
      status,
    };
  }

  async function handleSave() {
    if (!admin) return;
    if (!form.title.trim()) {
      toast.error("Job title is required.");
      return;
    }
    setSaving(true);
    try {
      const input = buildInput();
      if (jobId) {
        await updateJob(jobId, input, admin.uid);
      } else {
        await createJob(input, admin.uid);
      }
      await logActivity(
        jobId ? "career.updated" : "career.created",
        `${jobId ? "Updated" : "Created"} job "${input.title}"`,
      );
      toast.success(jobId ? "Job updated" : "Job created");
      navigate({ to: "/admin/careers" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-xl border border-border p-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Flutter Developer Intern"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="overview">Description / Overview</Label>
              <Textarea
                id="overview"
                rows={3}
                value={form.overview}
                onChange={(e) => update("overview", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                rows={5}
                value={form.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
                placeholder={
                  "One per line, e.g.\nDevelop and maintain UI components\nIntegrate REST APIs"
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  rows={3}
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  placeholder="Comma-separated, e.g. Flutter, Firebase, Git"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="preferred">Preferred (nice-to-have)</Label>
                <Textarea
                  id="preferred"
                  rows={3}
                  value={form.preferred}
                  onChange={(e) => update("preferred", e.target.value)}
                  placeholder="Comma-separated, optional"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Status</h3>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as JobStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full" disabled={saving} onClick={handleSave}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Job"
              )}
            </Button>
          </section>

          <section className="space-y-4 rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold">Details</h3>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department (badge)</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Badge Color</Label>
              <Select
                value={form.badgeColor}
                onValueChange={(v) =>
                  update("badgeColor", v as "emerald" | "electric")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emerald">Emerald</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <Select
                value={form.iconKey}
                onValueChange={(v) => update("iconKey", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CAREER_ICONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Remote / Hybrid"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Input
                id="employmentType"
                value={form.employmentType}
                onChange={(e) => update("employmentType", e.target.value)}
                placeholder="Internship"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                placeholder="0-1 years"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="2-6 months"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary">Salary (optional)</Label>
              <Input
                id="salary"
                value={form.salary}
                onChange={(e) => update("salary", e.target.value)}
                placeholder="Unpaid / Stipend / ₹..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="applyLink">Apply Link (optional)</Label>
              <Input
                id="applyLink"
                value={form.applyLink}
                onChange={(e) => update("applyLink", e.target.value)}
                placeholder="Leave blank to use the built-in /career-apply form"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
