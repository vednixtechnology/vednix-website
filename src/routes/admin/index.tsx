import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  CheckCircle2,
  PenLine,
  Briefcase,
  Users,
  Mail,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { listAdminBlogs } from "@/lib/admin/blogs";
import { listAdminJobs } from "@/lib/admin/careers";
import { listApplications } from "@/lib/admin/careerApplications";
import { listContactMessages } from "@/lib/admin/contacts";
import { listEarlyAccessUsers } from "@/lib/admin/earlyAccess";
import { listNewsletterSubscribers } from "@/lib/admin/newsletter";
import type {
  BlogPost,
  CareerJob,
  CareerApplication,
  ContactMessage,
  EarlyAccessUser,
  NewsletterSubscriber,
} from "@/lib/admin/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

interface CardDef {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number | null; // null = module not built yet
}

function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <AdminShell>
        <DashboardContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function DashboardContent() {
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const [jobs, setJobs] = useState<CareerJob[] | null>(null);
  const [applications, setApplications] = useState<CareerApplication[] | null>(
    null,
  );
  const [contacts, setContacts] = useState<ContactMessage[] | null>(null);
  const [earlyAccess, setEarlyAccess] = useState<EarlyAccessUser[] | null>(
    null,
  );
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(
    null,
  );

  useEffect(() => {
    listAdminBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]));
    listAdminJobs()
      .then(setJobs)
      .catch(() => setJobs([]));
    listApplications()
      .then(setApplications)
      .catch(() => setApplications([]));
    listContactMessages()
      .then(setContacts)
      .catch(() => setContacts([]));
    listEarlyAccessUsers()
      .then(setEarlyAccess)
      .catch(() => setEarlyAccess([]));
    listNewsletterSubscribers()
      .then(setSubscribers)
      .catch(() => setSubscribers([]));
  }, []);

  const total = blogs?.length ?? null;
  const published = blogs
    ? blogs.filter((b) => b.status === "published").length
    : null;
  const drafts = blogs
    ? blogs.filter((b) => b.status === "draft").length
    : null;

  const cards: CardDef[] = [
    { label: "Total Blogs", icon: FileText, value: total },
    { label: "Published Blogs", icon: CheckCircle2, value: published },
    { label: "Drafts", icon: PenLine, value: drafts },
    { label: "Jobs", icon: Briefcase, value: jobs?.length ?? null },
    { label: "Applications", icon: Users, value: applications?.length ?? null },
    { label: "Subscribers", icon: Mail, value: subscribers?.length ?? null },
    { label: "Contacts", icon: MessageSquare, value: contacts?.length ?? null },
    {
      label: "Early Access Users",
      icon: UserPlus,
      value: earlyAccess?.length ?? null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your website content.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {card.value === null ? (
                <div className="text-2xl font-semibold text-muted-foreground/40">
                  —
                </div>
              ) : (
                <div className="text-2xl font-semibold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Subscribers will show 0 until a public newsletter signup form is added —
        the Newsletter admin page and data collection are ready.
      </p>
    </div>
  );
}
