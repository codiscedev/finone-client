"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import { apiClient } from "./api";

export interface DbUser {
  userId: string;
  email: string;
  name: string;
  currency: string;
  newUser: boolean;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  firebaseUser: null,
  dbUser: null,
  loading: true,
  logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = React.useState<DbUser | null>(null);
  const [loading, setLoading] = React.useState(true);

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
        } catch (err) {
          console.error("Backend auth sync failed:", err);
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
    const isProtectedRoute = pathname.startsWith("/dashboard");

    if (!firebaseUser && isProtectedRoute) {
      router.push("/login");
    } else if (firebaseUser && isAuthRoute) {
      router.push("/dashboard");
    }
  }, [firebaseUser, loading, pathname, router]);

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

  return (
    <AuthContext.Provider value={{ firebaseUser, dbUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
