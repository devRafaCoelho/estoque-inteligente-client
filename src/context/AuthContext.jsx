import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { clearSessionStorage } from "../services/apiClient";
import { TOKEN_KEY, USER_KEY } from "../config/constants";

export const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => readStoredUser());
  const [booting, setBooting] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    sessionStorage.setItem(TOKEN_KEY, nextToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearSessionStorage();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authService.login({ email, password });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateSessionUser = useCallback((nextUser) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const refreshSessionUser = useCallback(async () => {
    const data = await authService.me();
    updateSessionUser(data.user);
    return data.user;
  }, [updateSessionUser]);

  useEffect(() => {
    let active = true;
    async function boot() {
      if (!token) {
        if (active) setBooting(false);
        return;
      }
      try {
        await refreshSessionUser();
      } catch {
        clearSession();
      } finally {
        if (active) setBooting(false);
      }
    }
    boot();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      booting,
      login,
      register,
      logout,
      clearSession,
      updateSessionUser,
      refreshSessionUser,
    }),
    [
      token,
      user,
      booting,
      login,
      register,
      logout,
      clearSession,
      updateSessionUser,
      refreshSessionUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
