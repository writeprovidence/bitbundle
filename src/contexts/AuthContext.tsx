"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { SiweMessage } from "siwe";

interface AuthState {
  address: string | null;
  userId: string | null;
  isSignedIn: boolean;
  isLoading: boolean;
  /** Opens wallet connect + signs SIWE. Call this when user clicks "Sign in". */
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
  const { address: walletAddress, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { open: openModal } = useAppKit();

  const [userId, setUserId] = useState<string | null>(null);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session from cookie via API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = (await res.json()) as { userId: string; address: string };
          setUserId(data.userId);
          setSessionAddress(data.address);
        }
      } catch {
        // no session
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async () => {
    // 1. Make sure wallet is connected
    if (!isConnected || !walletAddress) {
      openModal({ view: "Connect" });
      return;
    }

    // 2. Fetch nonce
    const nonceRes = await fetch("/api/auth/siwe");
    const { nonce } = (await nonceRes.json()) as { nonce: string };

    // 3. Build SIWE message
    const message = new SiweMessage({
      domain: window.location.host,
      address: walletAddress,
      statement: "Sign in to Bitbundle. This request does not trigger any blockchain transaction.",
      uri: window.location.origin,
      version: "1",
      chainId: chainId ?? 1,
      nonce,
    });

    const preparedMessage = message.prepareMessage();

    // 4. Sign
    const signature = await signMessageAsync({ message: preparedMessage });

    // 5. Verify with backend
    const verifyRes = await fetch("/api/auth/siwe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: preparedMessage, signature }),
    });

    if (!verifyRes.ok) throw new Error("SIWE verification failed");

    const data = (await verifyRes.json()) as { userId: string; address: string };
    setUserId(data.userId);
    setSessionAddress(data.address);
  }, [isConnected, walletAddress, chainId, signMessageAsync, openModal]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    disconnect();
    setUserId(null);
    setSessionAddress(null);
  }, [disconnect]);

  return (
    <AuthContext.Provider
      value={{
        address: sessionAddress,
        userId,
        isSignedIn: !!userId,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
