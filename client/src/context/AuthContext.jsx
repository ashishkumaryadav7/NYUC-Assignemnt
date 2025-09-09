import  { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import BASE_URL from '../api/url'

const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const isAuthenticated = !!accessToken;

  const setSession = useCallback((token, u) => {
    setAccessToken(token || null);
    setUser(u || null);
  }, []);

 const refresh = useCallback(async () => {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    setSession(null, null);
    setLoading(false);
    return false;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) {
      setSession(null, null);
      return false;
    }

    const data = await res.json();
    // save access token and refresh token
    setSession(data.data.accessToken, data.data.user, data.data.refreshToken);
    return true;
  } catch {
    setSession(null, null);
    return false;
  } finally {
    setLoading(false);
  }
}, [setSession]);


useEffect(() => {
  if (!accessToken) {
    refresh();
  } else {
    setLoading(false);
  }
}, [refresh, accessToken]);

  const value = useMemo(
    () => ({ accessToken, user, isAuthenticated, loading, setSession, refresh }),
    [accessToken, user, isAuthenticated, loading, setSession, refresh]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}


export function useAuth() {
  return useContext(AuthCtx);
}
