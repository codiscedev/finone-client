"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { onIdTokenChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import { apiClient } from "./api";

export interface DbUser {
  userId: string;
  email: string;
  name: string;
  currency: string;
  newUser: boolean;
  inviteConfirmed: boolean;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  logout: () => Promise<void>;
  completeOnboarding: (updatedUser: DbUser) => void;
  refreshUserStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  firebaseUser: null,
  dbUser: null,
  loading: true,
  authError: null,
  clearAuthError: () => { },
  logout: async () => { },
  completeOnboarding: () => { },
  refreshUserStatus: async () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = React.useState<DbUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);

  // Initialize dbUser state from sessionStorage if available (prevents flicker on reload)
  React.useEffect(() => {
    try {
      const cached = sessionStorage.getItem("finone_db_user");
      if (cached) {
        setDbUser(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Failed to load cached dbUser:", e);
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          // Call the backend /auth/login endpoint to sync/retrieve DB user context
          const response = await apiClient.post("/auth/login", { idToken });
          if (response.data?.success && response.data?.data) {
            const serverUser: DbUser = response.data.data;
            setDbUser(serverUser);
            sessionStorage.setItem("finone_db_user", JSON.stringify(serverUser));
          } else {
            throw new Error("Unsuccessful response from backend login");
          }
        } catch (err: any) {
          console.error("Backend auth sync failed:", err);
          const errMsg = err.response?.data?.message || err.message || "Backend synchronization failed.";
          setAuthError(errMsg);
          // Reset states to force redirect to /login and clear stale sessions
          setFirebaseUser(null);
          setDbUser(null);
          sessionStorage.removeItem("finone_db_user");
          try {
            await signOut(auth);
          } catch (signOutErr) {
            console.error("Firebase signout fallback failed:", signOutErr);
          }
        }
      } else {
        setFirebaseUser(null);
        setDbUser(null);
        sessionStorage.removeItem("finone_db_user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle route protection and redirections based on auth state
  React.useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname === "/onboarding";
    const isConfirmInviteRoute = pathname === "/confirm-invite";

    if (!firebaseUser && (isProtectedRoute || isConfirmInviteRoute)) {
      router.push("/login");
    } else if (firebaseUser) {
      if (dbUser) {
        if (!dbUser.inviteConfirmed) {
          if (pathname !== "/confirm-invite") {
            router.push("/confirm-invite");
          }
        } else {
          // Invite confirmed!
          if (pathname === "/confirm-invite") {
            if (dbUser.newUser) {
              router.push("/onboarding");
            } else {
              router.push("/dashboard");
            }
          } else if (dbUser.newUser && pathname !== "/onboarding") {
            router.push("/onboarding");
          } else if (!dbUser.newUser && pathname === "/onboarding") {
            router.push("/dashboard");
          } else if (isAuthRoute) {
            if (dbUser.newUser) {
              router.push("/onboarding");
            } else {
              router.push("/dashboard");
            }
          }
        }
      }
    }
  }, [firebaseUser, dbUser, loading, pathname, router]);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setDbUser(null);
      sessionStorage.removeItem("finone_db_user");
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const completeOnboarding = (updatedUser: DbUser) => {
    setDbUser(updatedUser);
    sessionStorage.setItem("finone_db_user", JSON.stringify(updatedUser));
  };

  const refreshUserStatus = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken(true);
        const response = await apiClient.post("/auth/login", { idToken });
        if (response.data?.success && response.data?.data) {
          const serverUser: DbUser = response.data.data;
          setDbUser(serverUser);
          sessionStorage.setItem("finone_db_user", JSON.stringify(serverUser));
        }
      } catch (err) {
        console.error("Failed to refresh user status:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, dbUser, loading, authError, clearAuthError, logout, completeOnboarding, refreshUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
