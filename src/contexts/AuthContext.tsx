"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthService } from "@/utils/auth";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const session = await AuthService.getSession();

      console.log("object", session);

      if (!session || !session.access_token) {
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (AuthService.isTokenExpired(session.expires_at)) {
        AuthService.clearSession();
        setLoading(false);
        return;
      }

      // Get current user
      const currentUser = await AuthService.getCurrentUser(
        session.access_token
      );
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      AuthService.clearSession();
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const session = await AuthService.getSession();
      if (session?.access_token) {
        await AuthService.signOut(session.access_token);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      AuthService.clearSession();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const session = await AuthService.getSession();
    if (
      session?.access_token &&
      !AuthService.isTokenExpired(session.expires_at)
    ) {
      try {
        const currentUser = await AuthService.getCurrentUser(
          session.access_token
        );
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to refresh user:", error);
        await signOut();
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};