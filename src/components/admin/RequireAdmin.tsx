import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, admin, navigate]);

  if (loading || !admin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
