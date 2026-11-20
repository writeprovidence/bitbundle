"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Link2,
  Heart,
  User,
  Shield,
  ArrowLeft,
  Mail,
  X,
  Plus,
  AlertCircle,
  Check,
  ChevronDown,
  Star,
  Zap,
  Wifi,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PurchaseAsGiftModal from "./PurchaseAsGiftModal";
import CheckoutModal from "./CheckoutModal";
import CountryFlag from "./CountryFlag";
import { OPERATORS, type RefillOperator } from "@/lib/operators";
import { checkNetworkMatch, AFRICAN_NETWORKS_BY_COUNTRY } from "@/lib/phoneValidation";
import { getDataBundles, type DataBundlePlan } from "@/lib/dataBundles";

export { OPERATORS, type RefillOperator };

const ACCEPTED_CRYPTO = [
  {
    name: "USDT",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#26A17B" />
        <path d="M17.5 15.6v-.1c2.8-.2 4.9-.8 4.9-1.6s-2.1-1.4-4.9-1.6v1.9c-.5 0-1 0-1.5 0v-1.9c-2.8.2-4.9.8-4.9 1.6s2.1 1.4 4.9 1.6v4.7c-2.2-.1-4.3-.5-4.3-1.1v-1.1h-1.7v1.1c0 1.4 3 2.5 6 2.7v3.5h1.5v-3.5c3.1-.2 6-1.3 6-2.7v-1.1h-1.7v1.1c0 .6-2.1 1-4.3 1.1v-4.7z" fill="#FFF" />
        <path d="M10 11h12v2H10z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: "USDC",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#2775CA" />
        <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm.8 12.8h-1.6v.8h-1.6v-.8c-1.3-.2-2.1-1.1-2.2-2.3h1.8c.1.6.5 1 1.2 1 .7 0 1.2-.4 1.2-.9 0-.6-.4-.9-1.5-1.1-1.7-.4-2.6-1-2.6-2.2 0-1.2.9-2.1 2.2-2.3V12h1.6v.8c1.1.2 1.9.9 2 2.1h-1.8c-.1-.5-.4-.9-1-.9-.7 0-1.1.3-1.1.8 0 .5.4.8 1.4 1 1.8.4 2.8 1 2.8 2.2 0 1.3-.9 2.2-2.2 2.4v.8z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: "cUSD",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#35D07F" />
        <path d="M16 9c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5c1.4 0 2.6.6 3.5 1.5l-1.4 1.4c-.6-.6-1.3-1-2.1-1-1.7 0-3 1.3-3 3.1s1.3 3.1 3 3.1c.8 0 1.5-.4 2.1-1l1.4 1.4c-.9.9-2.1 1.5-3.5 1.5z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: "DAI",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F4B731" />
        <path d="M11 10h4.5c3.6 0 6.5 2.7 6.5 6s-2.9 6-6.5 6H11V10zm2 2v2.5h5.5c.3 0 .5 0 .8-.1-.4-1.4-1.6-2.4-3.3-2.4H13zm0 3.5v1h7.8c0-.3.1-.7.1-1H13zm0 2v1h7.8c-.1.3-.2.7-.3 1H13zm0 2V20h3c1.7 0 2.9-1 3.3-2.4-.3 0-.5-.1-.8-.1H13z" fill="#FFF" />
      </svg>
    ),
  },
];

interface CountryProfile {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  usdRate: number;
  dialCode: string;
  localPhoneLength: number;
  intlPhoneLength: number;
  placeholder: string;
  supportedNetworks: ("mtn" | "airtel" | "glo" | "9mobile" | "spectranet" | string)[];
}

const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  NG: {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
    minAmount: 5,
    maxAmount: 10000,
    defaultAmount: 200,
    usdRate: 0.00065,
    dialCode: "+234",
    localPhoneLength: 11,
    intlPhoneLength: 13,
    placeholder: "08062268255",
    supportedNetworks: ["mtn", "airtel", "glo", "9mobile"],
  },
  GH: {
    code: "GH",
    name: "Ghana",
    currency: "GHS",
    currencySymbol: "GH₵",
    minAmount: 5,
    maxAmount: 500,
    defaultAmount: 20,
    usdRate: 0.065,
    dialCode: "+233",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "024 123 4567",
    supportedNetworks: ["mtn", "airtel", "telecel"],
  },
  ZA: {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    currencySymbol: "R",
    minAmount: 10,
    maxAmount: 2000,
    defaultAmount: 50,
    usdRate: 0.055,
    dialCode: "+27",
    localPhoneLength: 10,
    intlPhoneLength: 11,
    placeholder: "083 123 4567",
    supportedNetworks: ["mtn", "vodacom", "cellc", "telkom"],
  },
  KE: {
    code: "KE",
    name: "Kenya",
    currency: "KES",
    currencySymbol: "KSh",
    minAmount: 50,
    maxAmount: 10000,
    defaultAmount: 200,
    usdRate: 0.0078,
    dialCode: "+254",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "071 234 5678",
    supportedNetworks: ["safaricom", "airtel"],
  },
  UG: {
    code: "UG",
    name: "Uganda",
    currency: "UGX",
    currencySymbol: "USh",
    minAmount: 1000,
    maxAmount: 200000,
    defaultAmount: 5000,
    usdRate: 0.00027,
    dialCode: "+256",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "077 123 4567",
    supportedNetworks: ["mtn", "airtel"],
  },
  TZ: {
    code: "TZ",
    name: "Tanzania",
    currency: "TZS",
    currencySymbol: "TSh",
    minAmount: 1000,
    maxAmount: 100000,
    defaultAmount: 5000,
    usdRate: 0.00038,
    dialCode: "+255",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "078 123 4567",
    supportedNetworks: ["vodacom", "airtel", "tigo", "halotel"],
  },
};

function resolveCountryProfile(code?: string, name?: string): CountryProfile {
  if (code && COUNTRY_PROFILES[code.toUpperCase()]) {
    return COUNTRY_PROFILES[code.toUpperCase()];
  }
  const cleanName = (name || "").toLowerCase().trim();
  if (cleanName.includes("ghana")) return COUNTRY_PROFILES.GH;
  if (cleanName.includes("south africa")) return COUNTRY_PROFILES.ZA;
  if (cleanName.includes("kenya")) return COUNTRY_PROFILES.KE;
  if (cleanName.includes("uganda")) return COUNTRY_PROFILES.UG;
  if (cleanName.includes("tanzania")) return COUNTRY_PROFILES.TZ;
  return COUNTRY_PROFILES.NG;
}

interface RefillDetailsViewProps {
  operatorId?: "mtn" | "airtel" | "glo" | "9mobile";
  initialPhone?: string;
  initialAmount?: number;
  initialTopupType?: "airtime" | "data";
  onBack?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  countryName?: string;
  countryCode?: string;
  countryFlag?: string;
  currencyCode?: string;
  countryNetworks?: ("mtn" | "airtel" | "glo" | "9mobile" | "spectranet" | string)[];
  onCountryChange?: (countryCode: string, countryName: string) => void;
}

export default function RefillDetailsView({
  operatorId = "mtn",
  initialPhone = "",
  initialAmount,
  initialTopupType = "airtime",
  onBack,
  isModal = false,
  isOpen = true,
  onClose,
  countryName = "Nigeria",
  countryCode,
  currencyCode,
  countryNetworks,
  onCountryChange,
}: RefillDetailsViewProps) {
  const operator = OPERATORS[operatorId] || OPERATORS.mtn;
  const { items, addItem, clearCart, setIsCartOpen } = useCart();

  const [topupType, setTopupType] = useState<"airtime" | "data">(initialTopupType);

  const initialResolved = resolveCountryProfile(countryCode, countryName);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    (countryCode || initialResolved.code).toUpperCase()
  );
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  // Sync if parent updates countryCode or countryName
  useEffect(() => {
    if (countryCode) {
      setSelectedCountryCode(countryCode.toUpperCase());
    } else if (countryName) {
      const p = resolveCountryProfile(undefined, countryName);
      setSelectedCountryCode(p.code);
    }
  }, [countryCode, countryName]);

  // Click outside to close picker dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setIsCountryPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profile = useMemo(
    () => COUNTRY_PROFILES[selectedCountryCode] || resolveCountryProfile(countryCode, countryName),
    [selectedCountryCode, countryCode, countryName]
  );

  const activeCountry = profile.name;
  const activeCurrency = profile.currency;
  const activeNetworks = profile.supportedNetworks || ["mtn", "airtel", "glo", "9mobile"];
  const hasService = activeNetworks.includes(operator.id);

  // Data bundle state
  const availableBundles = useMemo(
    () => getDataBundles(profile.code, operator.id),
    [profile.code, operator.id]
  );
  const [selectedBundleId, setSelectedBundleId] = useState<string>(availableBundles[0]?.id || "");
  const [bundleCategoryFilter, setBundleCategoryFilter] = useState<"all" | "daily" | "weekly" | "monthly">("all");

  useEffect(() => {
    if (availableBundles.length > 0) {
      if (!availableBundles.some((b) => b.id === selectedBundleId)) {
        setSelectedBundleId(availableBundles[0].id);
      }
    }
  }, [availableBundles, selectedBundleId]);

  const selectedBundle = useMemo(() => {
    return availableBundles.find((b) => b.id === selectedBundleId) || availableBundles[0];
  }, [availableBundles, selectedBundleId]);

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [amount, setAmount] = useState<number>(
    initialAmount ?? (topupType === "data" && selectedBundle ? selectedBundle.priceLocal : profile.defaultAmount)
  );
  const [phone, setPhone] = useState<string>(initialPhone || "");
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // When switching to data or changing selected data bundle, sync the amount
  useEffect(() => {
    if (topupType === "data" && selectedBundle) {
      setAmount(selectedBundle.priceLocal);
    }
  }, [topupType, selectedBundle]);

  const filteredBundles = useMemo(() => {
    if (bundleCategoryFilter === "all") return availableBundles;
    return availableBundles.filter((b) => b.category === bundleCategoryFilter);
  }, [availableBundles, bundleCategoryFilter]);

  // Check if entered phone number matches the selected operator
  const networkMatch = useMemo(() => {
    return checkNetworkMatch(phone, operator.id, profile.code);
  }, [phone, operator.id, profile.code]);

  // Dynamic carrier placeholder based on selected operator and country
  const carrierPlaceholder = useMemo(() => {
    const config = AFRICAN_NETWORKS_BY_COUNTRY[profile.code];
    const net = config?.networks[operator.id];
    if (net && net.prefixes.length > 0) {
      return `e.g. ${net.prefixes[0]} 123 4567`;
    }
    return `e.g. ${profile.placeholder}`;
  }, [profile.code, profile.placeholder, operator.id]);

  // Sync initial phone when initialPhone changes (e.g. URL query params or modal trigger)
  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone);
    }
  }, [initialPhone]);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    } else {
      setAmount(profile.defaultAmount);
    }
  }, [operatorId, initialAmount, profile]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isModal, isOpen]);

  // Handle escape key to dismiss popup
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
        else if (onBack) onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModal, isOpen, onClose, onBack]);

  const usdAmount = useMemo(() => (amount * profile.usdRate).toFixed(2), [amount, profile.usdRate]);

  const dynamicTitle = useMemo(() => {
    return topupType === "data" ? `${operator.name} Data Bundle` : `${operator.name} Airtime Top-up`;
  }, [operator, topupType]);

  const dynamicDescription = useMemo(() => {
    if (topupType === "data") {
      return `Buy ${operator.name} ${profile.name} high-speed mobile data bundles with cryptocurrency. Instant digital activation directly to your line in seconds.`;
    }
    if (operator.id === "mtn") {
      return `MTN formerly M-Cell, is one of ${profile.name}'s premier mobile service providers. With Bitbundle's MTN top-up, you can top-up mobile minutes and data from MTN with cryptocurrency.`;
    }
    if (operator.id === "airtel") {
      return `Airtel is one of ${profile.name}'s leading telecommunications providers. Easily top up airtime and mobile data in under a minute with cryptocurrency.`;
    }
    if (operator.id === "glo") {
      return `Globacom (Glo) provides top-quality cellular services across ${profile.name}. Top up Glo airtime and data with instant digital delivery.`;
    }
    if (operator.id === "9mobile") {
      return `9mobile provides high-speed mobile network services across ${profile.name}. Top up mobile balance or send minutes to family securely with cryptocurrency.`;
    }
    return `${operator.name} ${profile.name} is a leading mobile service provider. Easily top-up airtime and mobile data instantly with cryptocurrency.`;
  }, [operator, profile, topupType]);

  function validatePhone(raw: string) {
    if (!raw.trim()) return { isValid: false, error: null };
    const digits = raw.replace(/\D/g, "");
    if (!digits) return { isValid: false, error: null };
    const isIntl = raw.startsWith("+") || raw.startsWith(profile.dialCode.replace("+", ""));
    const targetLength = isIntl ? profile.intlPhoneLength : profile.localPhoneLength;
    if (digits.length > targetLength) {
      return { isValid: false, error: "Too many digits — please check for extra numbers." };
    }
    if (digits.length < targetLength) {
      return { isValid: false, error: "The phone number is not complete." };
    }
    // Network mismatch validation
    if (!networkMatch.isMatch) {
      return {
        isValid: false,
        error: networkMatch.errorMessage || "This number does not match the selected network.",
      };
    }
    return { isValid: true, error: null };
  }

  const phoneValidation = useMemo(
    () => validatePhone(phone),
    [phone, profile, networkMatch]
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const isAlreadyInCart = useMemo(() => {
    return items.some(
      (it) => it.networkId === operator.id && (it.topupType || "airtime") === topupType
    );
  }, [items, operator.id, topupType]);

  const handleBuyNow = () => {
    if (topupType === "airtime") {
      if (amount > profile.maxAmount || amount < profile.minAmount || !phoneValidation.isValid) return;
    } else {
      if (!selectedBundle || !phoneValidation.isValid) return;
    }
    if (isAlreadyInCart) {
      setIsCartOpen(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} ${profile.name}`,
      phoneNumber: phone.trim(),
      amountNgn: amount,
      amountUsd: Number((amount * profile.usdRate).toFixed(2)),
      isGift: false,
      topupType: topupType,
      dataPlan:
        topupType === "data" && selectedBundle
          ? {
              id: selectedBundle.id,
              name: selectedBundle.name,
              validity: selectedBundle.validity,
              dataAmount: selectedBundle.dataAmount,
            }
          : undefined,
    });
    setIsCartOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGiftCheckout = (giftDetails: {
    recipientName: string;
    recipientEmail: string;
    senderName: string;
    message?: string;
  }) => {
    if (topupType === "airtime") {
      if (amount > profile.maxAmount || !phoneValidation.isValid) return;
    } else {
      if (!selectedBundle || !phoneValidation.isValid) return;
    }
    if (isAlreadyInCart) {
      setIsGiftModalOpen(false);
      setIsCartOpen(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} ${profile.name}`,
      phoneNumber: phone.trim() || profile.placeholder,
      amountNgn: amount,
      amountUsd: Number((amount * profile.usdRate).toFixed(2)),
      isGift: true,
      giftDetails,
      topupType: topupType,
      dataPlan:
        topupType === "data" && selectedBundle
          ? {
              id: selectedBundle.id,
              name: selectedBundle.name,
              validity: selectedBundle.validity,
              dataAmount: selectedBundle.dataAmount,
            }
          : undefined,
    });
    setIsGiftModalOpen(false);
    setIsCartOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    }
  };

  if (!isOpen) return null;

  const isDisabled =
    topupType === "airtime"
      ? amount > profile.maxAmount || amount < profile.minAmount || !phoneValidation.isValid
      : !selectedBundle || !phoneValidation.isValid;

  // Render operator logo tile
  const renderLogoTile = () => (
    <div className="shrink-0 w-full md:w-[440px] lg:w-[480px] md:sticky md:top-28 self-start">
      <div
        className={`relative w-full aspect-square bg-[#EBEBEB] flex items-center justify-center p-6 sm:p-10 ${!isModal ? "rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden" : "rounded-none"
          }`}
      >
        {/* Action icon buttons: copy link & favourite */}
        <div className="absolute top-5 right-5 flex gap-2.5 z-10">
          <button
            type="button"
            onClick={handleCopyLink}
            title={linkCopied ? "Copied!" : "Copy link"}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-200/80 hover:border-slate-300 hover:scale-105 transition cursor-pointer"
          >
            <Link2 className={`w-4 h-4 ${linkCopied ? "text-emerald-600" : "text-slate-600"}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            title="Favourite"
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-200/80 hover:border-slate-300 hover:scale-105 transition cursor-pointer"
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
          </button>
        </div>

        {/* Operator Brand Graphics (Enlarged) */}
        {operator.logoType === "mtn" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#FFCC00] rounded-[18px] flex items-center justify-center shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <div className="w-52 sm:w-60 md:w-64 h-30 sm:h-34 md:h-38 border-[5.5px] border-black rounded-full flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-black select-none">MTN</span>
            </div>
          </div>
        )}
        {operator.logoType === "airtel" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-white rounded-[18px] flex items-center justify-center p-7 shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/airtel-brand-logo.png" alt="Airtel" width={260} height={140} className="w-auto h-26 sm:h-30 md:h-34 object-contain" />
          </div>
        )}
        {operator.logoType === "glo" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-white rounded-[18px] flex items-center justify-center p-6 shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/glo.jpg" alt="Glo" width={180} height={180} className="w-34 h-34 sm:w-38 sm:h-38 md:w-42 md:h-42 rounded-2xl object-cover" />
          </div>
        )}
        {operator.logoType === "9mobile" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#045F40] rounded-[18px] flex items-center justify-center p-7 shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/9mobile-brand-logo.png" alt="9mobile" width={260} height={140} className="w-auto h-26 sm:h-30 md:h-34 object-contain brightness-0 invert" />
          </div>
        )}
        {operator.logoType === "telecel" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#E40000] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">telecel</span>
              <span className="w-3.5 h-3.5 rounded-full bg-white" />
            </div>
            <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Vodafone Ghana</span>
          </div>
        )}
        {operator.logoType === "vodacom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#E60000] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#E60000] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white -translate-y-0.5 -translate-x-0.5" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">vodacom</span>
          </div>
        )}
        {operator.logoType === "cellc" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-black rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="w-14 h-14 rounded-full border-[5px] border-white flex items-center justify-center mb-2">
              <span className="text-2xl font-black text-white">C</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white">CELL C</span>
          </div>
        )}
        {operator.logoType === "telkom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#0089CF] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="w-12 h-12 border-4 border-white rounded-lg rotate-45 flex items-center justify-center mb-2">
              <div className="w-4 h-4 bg-white -rotate-45" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Telkom</span>
          </div>
        )}
        {operator.logoType === "safaricom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#009E49] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="w-10 h-10 rounded-full border-4 border-[#E40000] bg-white flex items-center justify-center mb-2">
              <div className="w-4 h-4 rounded-full bg-[#009E49]" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">Safaricom</span>
          </div>
        )}
        {operator.logoType === "tigo" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#0033A0] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight lowercase">tigo</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFD700]" />
            </div>
            <span className="text-xs font-bold text-[#FFD700] tracking-widest uppercase mt-1">Tanzania</span>
          </div>
        )}
        {operator.logoType === "halotel" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] bg-[#FF6600] rounded-[18px] flex flex-col items-center justify-center p-6 shadow-xs select-none">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight lowercase">halotel</span>
            <div className="w-16 h-1 bg-white/70 rounded-full mt-2" />
          </div>
        )}
      </div>
    </div>
  );

  // Render form content
  const renderFormContent = () => (
    <div
      className={`flex-1 min-w-0 max-w-[560px] ${!isModal
          ? "bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 shadow-sm"
          : ""
        }`}
    >
      {/* Dynamic Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
        {dynamicTitle}
      </h1>

      {/* Dynamic Description */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 max-w-xl">
        {dynamicDescription}
      </p>

      {/* Dynamic Network Country Indication with interactive SVG flag selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs sm:text-sm text-slate-500 font-medium select-none">
          Select country:
        </span>

        <div className="relative inline-block" ref={countryPickerRef}>
          <button
            type="button"
            onClick={() => setIsCountryPickerOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs transition-all cursor-pointer focus:outline-none select-none"
            title="Change country"
            aria-expanded={isCountryPickerOpen}
          >
            <CountryFlag
              countryCode={profile.code}
              countryName={profile.name}
              width={18}
              height={12}
              className="w-4.5 h-3 rounded-[2px] shadow-2xs border border-black/10 shrink-0"
            />
            <span>{profile.name}</span>

          </button>

          {/* Country Selection Dropdown */}
          {isCountryPickerOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
              {Object.values(COUNTRY_PROFILES).map((c) => {
                const isSelected = c.code === profile.code;
                const worksForThisOperator = c.supportedNetworks.includes(operator.id);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode(c.code);
                      setIsCountryPickerOpen(false);
                      if (onCountryChange) {
                        onCountryChange(c.code, c.name);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition-colors cursor-pointer ${isSelected
                      ? "bg-emerald-50 text-emerald-900 font-bold"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CountryFlag
                        countryCode={c.code}
                        countryName={c.name}
                        width={20}
                        height={14}
                        className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/10 shrink-0"
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {!worksForThisOperator && (
                      <span className="text-[10px] text-[#FF5A1F] bg-orange-50 px-1.5 py-0.5 rounded-md shrink-0 font-semibold">
                        Out of stock
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>


      </div>

      {!hasService && (
        <div className="mb-6 max-w-[420px] p-4 bg-orange-50/80 border border-orange-200 rounded-2xl text-orange-950">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#FF5A1F] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold">
                {operator.name} is currently unavailable in {profile.name}
              </p>
              <p className="text-orange-800 text-xs mt-0.5 leading-relaxed">
                This operator is out of stock or does not operate in {profile.name}. Enter your email to be notified when service launches.
              </p>
            </div>
          </div>
          {waitlistSent ? (
            <div className="mt-3 p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You&apos;re on the waitlist! We&apos;ll notify you when service arrives.</span>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-1.5 bg-white border border-orange-300 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (waitlistEmail.trim()) setWaitlistSent(true);
                }}
                className="px-3.5 py-1.5 bg-[#FF5A1F] hover:bg-[#e04e19] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Notify Me
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Type Switcher (Airtime vs Data Bundle) */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setTopupType("airtime");
            setAmount(profile.defaultAmount);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
            topupType === "airtime"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className={`w-4 h-4 ${topupType === "airtime" ? "text-amber-500 fill-amber-500" : ""}`} />
          <span>Airtime</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTopupType("data");
            if (selectedBundle) {
              setAmount(selectedBundle.priceLocal);
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
            topupType === "data"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Wifi className={`w-4 h-4 ${topupType === "data" ? "text-emerald-600" : ""}`} />
          <span>Data Bundle</span>
        </button>
      </div>

      {/* Airtime Mode: Amount input & Quick selectors */}
      {topupType === "airtime" ? (
        <div className="mb-6 w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Amount ({profile.currency})
          </label>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              profile.defaultAmount,
              profile.defaultAmount * 2.5,
              profile.defaultAmount * 5,
              profile.defaultAmount * 10,
            ]
              .map((val) => Math.round(val))
              .filter((v) => v >= profile.minAmount && v <= profile.maxAmount)
              .map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => setAmount(quickVal)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    amount === quickVal
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {profile.currencySymbol}{quickVal.toLocaleString()}
                </button>
              ))}
          </div>

          {/* Custom amount input */}
          <div className="flex items-center border border-slate-200 focus-within:border-slate-600 transition-colors py-2 px-3 bg-white rounded-lg">
            <input
              type="number"
              min={profile.minAmount}
              max={profile.maxAmount}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Custom amount (${profile.minAmount} - ${profile.maxAmount.toLocaleString()})`}
              className="flex-1 py-1 bg-transparent text-sm sm:text-base text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
            />
            {amount > 0 && (
              <span className="pl-2 text-xs sm:text-sm font-semibold text-slate-500 shrink-0">
                ≈ ${usdAmount}
              </span>
            )}
          </div>
          {amount > profile.maxAmount && (
            <p className="text-xs text-red-500 mt-1.5">
              Maximum is {profile.currencySymbol}{profile.maxAmount.toLocaleString()}.
            </p>
          )}
        </div>
      ) : (
        /* Data Bundle Mode: Plans Grid */
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Choose Data Plan
            </label>
            <div className="flex items-center gap-1">
              {(["all", "daily", "weekly", "monthly"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setBundleCategoryFilter(cat)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md capitalize transition-colors cursor-pointer ${
                    bundleCategoryFilter === cat
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800 bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Data Plans Grid */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredBundles.map((plan) => {
              const isSelected = selectedBundleId === plan.id;
              const planUsd = (plan.priceLocal * profile.usdRate).toFixed(2);
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setSelectedBundleId(plan.id);
                    setAmount(plan.priceLocal);
                  }}
                  className={`relative text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`absolute -top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        plan.badge === "Popular"
                          ? "bg-emerald-600 text-white"
                          : plan.badge === "Hot"
                          ? "bg-[#DE1D35] text-white"
                          : "bg-amber-500 text-black"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <div className="text-base font-black text-slate-900 leading-tight">
                      {plan.dataAmount}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {plan.validity}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {profile.currencySymbol}{plan.priceLocal.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      ≈ ${planUsd}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Phone number */}
      <div className="mb-6 w-full">
        <div>
          <div
            className={`flex items-center border transition-colors rounded-[6px] px-3 ${!networkMatch.isMatch
                ? "border-rose-400 bg-rose-50/20 focus-within:border-rose-600"
                : phoneValidation.error
                  ? "border-rose-400 focus-within:border-rose-600"
                  : "border-slate-200 focus-within:border-slate-600"
              }`}
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={carrierPlaceholder}
              className="w-full border-0 bg-transparent focus:outline-none py-2 px-0 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Network Mismatch Notice with One-Click Switch */}
          {!networkMatch.isMatch && networkMatch.detectedOperator ? (
            <div className="mt-2.5 p-3 rounded-lg bg-rose-50/90 border border-rose-200 text-rose-950 text-xs shadow-xs animate-in fade-in duration-150">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-rose-900 leading-snug">
                    This phone number belongs to{" "}
                    <strong className="font-extrabold underline">{networkMatch.detectedOperator.name}</strong> ({profile.name}), but
                    you are topping up <strong className="font-bold">{operator.name}</strong>.
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {networkMatch.detectedOperator.isSupportedOperator ? (
                      <Link
                        href={`/products/${networkMatch.detectedOperator.id}?${profile.code !== "NG" ? `country=${profile.code}&` : ""
                          }phone=${encodeURIComponent(phone.trim())}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-[11px] rounded-none transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        <span>Switch to {networkMatch.detectedOperator.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">
                        Carrier not supported on this page.
                      </span>
                    )}

                  </div>
                </div>
              </div>
            </div>
          ) : phoneValidation.error ? (
            <p className="text-xs text-rose-500 mt-1.5 flex items-start gap-1.5 font-medium leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{phoneValidation.error}</span>
            </p>
          ) : null}
        </div>
      </div>


      {/* Accordions */}
      <div className="border-t border-slate-200 w-full">
        {/* Terms and Conditions Accordion */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === "terms" ? null : "terms")}
            className="w-full flex items-center justify-between py-4 text-left font-bold text-sm text-slate-900 hover:text-slate-700 transition-colors cursor-pointer select-none"
          >
            <span>Important Notice</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${openAccordion === "terms" ? "rotate-180" : ""
                }`}
            />
          </button>
          {openAccordion === "terms" && (
            <div className="pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1.5 animate-in fade-in duration-150">
              <p>
                All top-ups are final once delivered. Please ensure that the recipient phone number and operator country are accurate before submitting payment.
              </p>
            </div>
          )}
        </div>


      </div>

      {/* CTA buttons */}
      <div className="grid grid-cols-2 gap-3 w-full mt-8 mb-4">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isDisabled || !hasService}
          className={`w-full h-[50px] flex items-center justify-center gap-2 px-3 font-bold text-xs sm:text-sm rounded-none border border-transparent transition-all cursor-pointer ${!hasService
            ? "bg-[#DE1D35] text-white opacity-70 cursor-not-allowed"
            : isAlreadyInCart
              ? "bg-[#045F40] hover:bg-[#034932] text-white active:scale-95"
              : "bg-[#DE1D35] hover:bg-[#c21429] text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            }`}
        >
          {isAlreadyInCart ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            hasService && (
              topupType === "data" ? (
                <Wifi className="w-4 h-4 shrink-0" />
              ) : (
                <Zap className="w-4 h-4 fill-current shrink-0" />
              )
            )
          )}
          <span className="truncate">
            {!hasService
              ? "Out of Stock"
              : isAlreadyInCart
              ? "In Cart (View)"
              : "Buy now"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (isAlreadyInCart) {
              setIsCartOpen(true);
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            } else {
              setIsGiftModalOpen(true);
            }
          }}
          disabled={isDisabled || !hasService}
          className={`w-full h-[50px] flex items-center justify-center gap-2 px-3 font-bold text-xs sm:text-sm rounded-none border transition-all cursor-pointer active:scale-95 ${isAlreadyInCart
            ? "bg-slate-100 text-slate-500 border-slate-200"
            : "bg-[#F0F2F5] hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 border-slate-200/60"
            }`}
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {isAlreadyInCart ? "In Cart (View)" : topupType === "data" ? "Gift Data Bundle" : "Purchase as gift"}
          </span>
        </button>
      </div>

      {isAlreadyInCart && (
        <div className="w-full mb-8 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>{operator.name} {topupType === "data" ? "data bundle" : "airtime"} is already in your cart.</span>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-bold underline text-amber-900 hover:text-black cursor-pointer shrink-0 ml-2"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isModal ? (
        /* ── MODAL POPUP MODE ── */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[980px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sleek Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Close top-up dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main content body */}
            <div className="p-7 sm:p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
                {renderLogoTile()}
                {renderFormContent()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── STANDALONE PAGE MODE ── */
        <div className="w-full bg-[#F8FAFC] pb-24 text-slate-900">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
            {/* Main Content Layout */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start justify-center">
              {renderLogoTile()}
              {renderFormContent()}
            </div>
          </div>
        </div>
      )}

      {/* Sub-modals for gift & checkout */}
      <PurchaseAsGiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        data={{
          networkId: operator.id,
          networkName: `${operator.name} ${profile.name}`,
          amountNgn: amount,
          amountUsd: Number(usdAmount),
          phoneNumber: phone,
        }}
        onAddToCart={handleGiftCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
