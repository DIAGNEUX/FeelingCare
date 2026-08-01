"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  logout as logoutRequest,
  refresh as refreshAccessToken,
  type AuthUser,
} from "@/lib/api/auth.api";

const ACCESS_TOKEN_KEY = "accessToken";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  setCurrentUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredAccessToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function storeAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (accessToken: string) => {
    const currentUser = await getCurrentUser(accessToken);
    setUser(currentUser);

    return currentUser;
  }, []);

  const signIn = useCallback(
    async (accessToken: string) => {
      try {
        storeAccessToken(accessToken);
        await loadUser(accessToken);
      } catch (error) {
        clearAccessToken();
        setUser(null);
        throw error;
      }
    },
    [loadUser]
  );

  const refreshSession = useCallback(async () => {
    setLoading(true);

    try {
      const storedAccessToken = getStoredAccessToken();

      if (storedAccessToken) {
        try {
          await loadUser(storedAccessToken);
          return;
        } catch {
          clearAccessToken();
        }
      }

      const { accessToken } = await refreshAccessToken();
      storeAccessToken(accessToken);
      await loadUser(accessToken);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      refreshSession,
      signIn,
      signOut,
      setCurrentUser: setUser,
    }),
    [loading, refreshSession, signIn, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
