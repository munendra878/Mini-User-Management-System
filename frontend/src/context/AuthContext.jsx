/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const setSession = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  const fetchMe = async () => {
    if (!token) return;
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to load user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser((prev) => ({ ...prev, ...decoded }));
      } catch {
        // ignore decode errors and fetch from API
      }
      fetchMe();
    } else {
      setUser(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (newToken) => {
    setSession(newToken);
    await fetchMe();
  };

  const logout = () => {
    setSession(null);
    setUser(null);
  };

  const value = { token, user, login, logout, refreshUser: fetchMe, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
