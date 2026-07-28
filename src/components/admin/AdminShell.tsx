import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  UserPlus,
  Megaphone,
  FileText,
  ImageIcon,
  Settings,
  ScrollText,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { signOutAdmin } from "@/lib/admin/auth";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string; // present once the module is live
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Blogs", icon: Newspaper, to: "/admin/blogs" },
  { label: "Careers", icon: Briefcase, to: "/admin/careers" },
  { label: "Career Applications", icon: Users, to: "/admin/applications" },
  { label: "Contact Leads", icon: MessageSquare, to: "/admin/contacts" },
  { label: "Newsletter", icon: Mail, to: "/admin/newsletter" },
  { label: "Early Access", icon: UserPlus, to: "/admin/early-access" },
  { label: "Product Updates", icon: Megaphone, to: "/admin/updates" },
  { label: "Press Releases", icon: FileText, to: "/admin/press" },
  { label: "Media Library", icon: ImageIcon, to: "/admin/media" },
  { label: "Website Settings", icon: Settings, to: "/admin/settings" },
  { label: "Activity Logs", icon: ScrollText, to: "/admin/logs" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link to="/admin" className="flex items-center gap-2 px-2 py-1.5">
            <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary shadow-emerald">
              <img
                src="/logo.png"
                alt="Vednix Technology"
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="font-display text-sm font-semibold group-data-[collapsible=icon]:hidden">
              Vednix Admin
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Content Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    !!item.to &&
                    (item.to === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.to));
                  return (
                    <SidebarMenuItem key={item.label}>
                      {item.to ? (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.to}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          disabled
                          className="cursor-not-allowed opacity-50"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                            Soon
                          </span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="truncate px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                {admin?.email}
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOutAdmin()}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <div className="text-sm font-medium text-muted-foreground">
            Vednix CMS
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
