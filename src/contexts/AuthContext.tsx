"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";

interface AuthState {
  address: string | null;
  userId: string | null;
  isSignedIn: boolean;
  isLoading: boolean;
  /** Opens Privy login modal (wallets, email, socials) */
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  address: null,
  userId: null,
  isSignedIn: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Find active address from Privy user's wallet, useWallets(), or Wagmi
  const activeAddress = useMemo(() => {
    return (
      user?.wallet?.address ||
      wallets[0]?.address ||
      (isConnected ? wagmiAddress : null) ||
      null
    );
  }, [user, wallets, isConnected, wagmiAddress]);

  const activeUserId = useMemo(() => {
    if (user?.id) return user.id;
    if (activeAddress) return `usr_${activeAddress.slice(2, 10).toLowerCase()}`;
    return null;
  }, [user, activeAddress]);

  const signIn = useCallback(async () => {
    try {
      login();
    } catch (err) {
      console.warn("Privy login notice:", err);
    }
  }, [login]);

  const signOut = useCallback(async () => {
    try {
      await logout();
      disconnect();
      await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    } catch (err) {
      console.warn("Sign out notice:", err);
    }
  }, [logout, disconnect]);

  const isSignedIn = authenticated || !!activeAddress;

  return (
    <AuthContext.Provider
      value={{
        address: activeAddress,
        userId: activeUserId,
        isSignedIn,
        isLoading: !ready,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
