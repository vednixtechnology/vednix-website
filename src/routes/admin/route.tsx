import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}
