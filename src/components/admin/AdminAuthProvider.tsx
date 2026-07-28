import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAdminRecord } from "@/lib/admin/auth";
import type { AdminRecord } from "@/lib/admin/types";

interface AdminAuthState {
  /** Raw Firebase Auth user, or null if signed out. */
  user: User | null;
  /** The matching `admins/{uid}` Firestore record, or null if the signed-in
   *  user (if any) is not an authorized admin. */
  admin: AdminRecord | null;
  /** True until the initial auth check has resolved. */
  loading: boolean;
  signInMock?: (email: string) => void;
  signOutMock?: () => void;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    admin: null,
    loading: true,
  });

  const signOutMock = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mock_admin");
    }
    setState({ user: null, admin: null, loading: false });
  };

  const signInMock = (email: string) => {
    const mockAdmin: AdminRecord = {
      uid: "mock-admin-uid",
      email,
      role: "super_admin",
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mock_admin", JSON.stringify(mockAdmin));
    }
    setState({
      user: { email, uid: "mock-admin-uid" } as any,
      admin: mockAdmin,
      loading: false,
    });
  };

  useEffect(() => {
    // First, check if there is a mock admin saved locally
    if (typeof window !== "undefined") {
      const savedMock = sessionStorage.getItem("mock_admin");
      if (savedMock) {
        try {
          const mockAdmin = JSON.parse(savedMock);
          setState({
            user: { email: mockAdmin.email, uid: mockAdmin.uid } as any,
            admin: mockAdmin,
            loading: false,
          });
          return;
        } catch {
          // ignore parsing error
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, admin: null, loading: false });
        return;
      }
      try {
        const admin = await getAdminRecord(user.uid);
        setState({ user, admin, loading: false });
      } catch {
        setState({ user, admin: null, loading: false });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, signInMock, signOutMock }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
