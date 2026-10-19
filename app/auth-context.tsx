"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  username: string;
  avatar_url: string | null;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AUTH_BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"; // URL de ton backend FastAPI (doit être configurée dans les variables d'environnement Vercel)

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        const stored = localStorage.getItem("session_token");
        if (stored) {
          const res = await fetch(`${AUTH_BACKEND}/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            return;
          }
        }
        localStorage.removeItem("session_token");
        setUser(null);
        return;
      }

      // Token depuis l'URL (callback OAuth)
      const res = await fetch(`${AUTH_BACKEND}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("session_token", token);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(() => {
    window.location.href = `${AUTH_BACKEND}/auth/github`;
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("session_token");
    if (token) {
      try {
        await fetch(`${AUTH_BACKEND}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    localStorage.removeItem("session_token");
    localStorage.removeItem("repos_history");
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
