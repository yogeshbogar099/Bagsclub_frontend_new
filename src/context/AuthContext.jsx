import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthSession, getAuthSession } from "../utils/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => {
    function handleAuthChange() {
      setSession(getAuthSession());
    }

    window.addEventListener("authchange", handleAuthChange);
    return () => window.removeEventListener("authchange", handleAuthChange);
  }, []);

  async function logout() {
    clearAuthSession();
  }

  const value = useMemo(
    () => ({
      session,
      token: session?.token || "",
      user: session?.user || null,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

