import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import BASE_URL from "../api/url";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;

  // ✅ Set session in state + localStorage
  const setSession = useCallback((token, u) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
    } else {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
    }

    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // ✅ Refresh access token (sirf cookies se)
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // 👈 cookie bhejega
      });

      if (!res.ok) {
        setSession(null, null);
        return false;
      }

      const data = await res.json();
      // 👇 backend se accessToken + user save karo
      setSession(data.data.accessToken, data.data.user);
      return true;
    } catch {
      setSession(null, null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // ✅ On mount, agar token nahi hai → refresh call
  useEffect(() => {
    if (!accessToken) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [refresh, accessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated,
      loading,
      setSession,
      refresh,
    }),
    [accessToken, user, isAuthenticated, loading, setSession, refresh]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
