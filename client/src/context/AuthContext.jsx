import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import BASE_URL from "../api/url";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // 1️⃣ Initialize state from localStorage
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;

  // 2️⃣ Set session in state + localStorage
  const setSession = useCallback((token, u, refreshToken) => {
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

    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    else localStorage.removeItem("refreshToken");
  }, []);

  // 3️⃣ Refresh token: cookie first, fallback localStorage
  const refresh = useCallback(async () => {
    try {
      // Try cookie-based refresh first
      let res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // cookie bhejega
      });

      // Fallback: localStorage refresh token
      if (!res.ok) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          setSession(null, null, null);
          return false;
        }

        res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }

      const data = await res.json();

      // Save accessToken + user + refreshToken
      setSession(data.data.accessToken, data.data.user, data.data.refreshToken);
      return true;
    } catch {
      setSession(null, null, null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // 4️⃣ On mount: if no accessToken → refresh
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
