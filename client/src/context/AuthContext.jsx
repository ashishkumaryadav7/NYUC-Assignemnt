import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import BASE_URL from "../api/url";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // ✅ State + localStorage fallback for accessToken & user
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;

  // ✅ Set session: accessToken + user in state & localStorage
  const setSession = useCallback((token, u) => {
    if (token) {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    } else {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }

    if (u) {
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  // ✅ Refresh accessToken using cookie (refresh token stored securely)
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // 👈 cookie send karega
      });

      if (!res.ok) {
        setSession(null, null);
        return false;
      }

      const data = await res.json();
      setSession(data.data.accessToken, data.data.user); // ✅ save access token + user info
      return true;
    } catch (err) {
      console.error("Refresh failed", err);
      setSession(null, null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // ✅ On mount: if no accessToken, try refresh
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
