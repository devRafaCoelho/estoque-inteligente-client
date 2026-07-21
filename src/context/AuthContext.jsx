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

  const updateSessionUser = useCallback((nextUser) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
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

  const loginWithGoogle = useCallback(
    async (idToken) => {
      const data = await authService.loginWithGoogle({ idToken });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession],
  );

  const loginWithApple = useCallback(
    async ({ idToken, fullName }) => {
      const data = await authService.loginWithApple({ idToken, fullName });
      persistSession(data.token, data.user);
      return data;
    },
    [persistSession],
  );

  const linkGoogle = useCallback(
    async (idToken) => {
      const data = await authService.linkGoogle({ idToken });
      updateSessionUser(data.user);
      return data;
    },
    [updateSessionUser],
  );

  const linkApple = useCallback(
    async ({ idToken, fullName }) => {
      const data = await authService.linkApple({ idToken, fullName });
      updateSessionUser(data.user);
      return data;
    },
    [updateSessionUser],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

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
      loginWithGoogle,
      loginWithApple,
      linkGoogle,
      linkApple,
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
      loginWithGoogle,
      loginWithApple,
      linkGoogle,
      linkApple,
      logout,
      clearSession,
      updateSessionUser,
      refreshSessionUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
