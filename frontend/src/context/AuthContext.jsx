import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { setAccessToken, clearAccessToken } from "../api/tokenStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know auth state

  // ─── Silent refresh on mount ──────────────────────────────────────────────
  // FIX #5 — No localStorage read. We rely on the httpOnly refresh-token
  // cookie being sent automatically to /auth/refresh.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await API.get("/auth/refresh");
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No active session — that's fine, stay logged out
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ─── Register ─────────────────────────────────────────────────────────────
  // FIX #20 — Single API call. The register endpoint now returns the access
  // token directly, so we don't need a second /auth/login call.
  const register = useCallback(async (formData) => {
    const { data } = await API.post("/auth/register", formData);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
