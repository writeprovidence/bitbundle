"use client";

import { useState, useEffect } from "react";

export const SUPPORTED_GEO_COUNTRIES = ["NG", "GH", "ZA", "KE", "UG", "TZ"] as const;
export type SupportedCountryCode = typeof SUPPORTED_GEO_COUNTRIES[number];

export interface GeoCountryInfo {
  code: SupportedCountryCode;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  networks: string[];
  placeholder: string;
}

export const COUNTRY_DATA: Record<SupportedCountryCode, GeoCountryInfo> = {
  NG: {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    dialCode: "+234",
    currency: "NGN",
    networks: ["mtn", "airtel", "glo", "9mobile"],
    placeholder: "080 1234 5678",
  },
  GH: {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    dialCode: "+233",
    currency: "GHS",
    networks: ["mtn", "vodafone", "airtel", "glo", "telecel"],
    placeholder: "024 123 4567",
  },
  ZA: {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    dialCode: "+27",
    currency: "ZAR",
    networks: ["mtn", "vodacom", "cellc", "telkom"],
    placeholder: "083 123 4567",
  },
  KE: {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    dialCode: "+254",
    currency: "KES",
    networks: ["safaricom", "airtel", "telkom"],
    placeholder: "071 234 5678",
  },
  UG: {
    code: "UG",
    name: "Uganda",
    flag: "🇺🇬",
    dialCode: "+256",
    currency: "UGX",
    networks: ["mtn", "airtel"],
    placeholder: "077 123 4567",
  },
  TZ: {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    dialCode: "+255",
    currency: "TZS",
    networks: ["vodacom", "airtel", "tigo", "halotel"],
    placeholder: "078 123 4567",
  },
};

/**
 * Synchronous initial heuristic from localStorage or browser timezone.
 * Returns instantly on client with 0ms latency and no UI flicker.
 */
export function getQuickDetectedCountry(): SupportedCountryCode {
  if (typeof window === "undefined") return "NG";

  try {
    // 1. User's previously selected preference
    const saved = localStorage.getItem("bitbundle_selected_country");
    if (saved && SUPPORTED_GEO_COUNTRIES.includes(saved.toUpperCase() as SupportedCountryCode)) {
      return saved.toUpperCase() as SupportedCountryCode;
    }

    // 2. Browser Timezone mapping (native & instant)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Lagos") || tz.includes("Nigeria") || tz.includes("Porto-Novo")) return "NG";
    if (tz.includes("Accra") || tz.includes("Ghana")) return "GH";
    if (tz.includes("Johannesburg") || tz.includes("South_Africa") || tz.includes("Maseru") || tz.includes("Mbabane")) return "ZA";
    if (tz.includes("Nairobi") || tz.includes("Kenya") || tz.includes("Addis_Ababa")) return "KE";
    if (tz.includes("Kampala") || tz.includes("Uganda")) return "UG";
    if (tz.includes("Dar_es_Salaam") || tz.includes("Tanzania")) return "TZ";
  } catch {
    // fallback
  }

  return "NG";
}

/**
 * Persists the user's explicit country selection so it sticks across the session.
 */
export function saveUserCountry(code: string) {
  if (typeof window !== "undefined" && code) {
    try {
      localStorage.setItem("bitbundle_selected_country", code.toUpperCase());
    } catch {
      // ignore
    }
  }
}

/**
 * Hook to automatically determine user country based on IP and location.
 * Always initializes with "NG" on both server and initial client hydration
 * to guarantee 100% hydration consistency, then immediately resolves local
 * heuristics and server headers in useEffect.
 */
export function useUserCountry() {
  const [countryCode, setCountryCodeState] = useState<SupportedCountryCode>("NG");
  const [hasResolved, setHasResolved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const setCountryCode = (code: SupportedCountryCode | string) => {
    const upper = code.toUpperCase() as SupportedCountryCode;
    if (SUPPORTED_GEO_COUNTRIES.includes(upper)) {
      setCountryCodeState(upper);
      saveUserCountry(upper);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // Apply client heuristic immediately on mount without SSR mismatch
    const quick = getQuickDetectedCountry();
    setCountryCodeState(quick);

    // If user already explicitly saved a preference, respect it and don't override
    try {
      const saved = localStorage.getItem("bitbundle_selected_country");
      if (saved && SUPPORTED_GEO_COUNTRIES.includes(saved.toUpperCase() as SupportedCountryCode)) {
        setCountryCodeState(saved.toUpperCase() as SupportedCountryCode);
        setHasResolved(true);
        return;
      }
    } catch {}

    let isSubscribed = true;

    // Asynchronous verification via our internal geo route (reads edge headers)
    async function resolveLocation() {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.country && SUPPORTED_GEO_COUNTRIES.includes(data.country.toUpperCase() as SupportedCountryCode)) {
            if (isSubscribed) {
              const detected = data.country.toUpperCase() as SupportedCountryCode;
              setCountryCodeState(detected);
              setHasResolved(true);
              return;
            }
          }
        }
      } catch {}

      try {
        // Fallback to client-side public GeoIP
        const res2 = await fetch("https://api.country.is", { cache: "no-store" });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2?.country && SUPPORTED_GEO_COUNTRIES.includes(data2.country.toUpperCase() as SupportedCountryCode)) {
            if (isSubscribed) {
              const detected = data2.country.toUpperCase() as SupportedCountryCode;
              setCountryCodeState(detected);
              setHasResolved(true);
              return;
            }
          }
        }
      } catch {}

      if (isSubscribed) {
        setHasResolved(true);
      }
    }

    resolveLocation();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return { countryCode, hasResolved, setCountryCode, isMounted };
}
