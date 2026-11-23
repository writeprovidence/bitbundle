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
  ArrowDown,
  Bell,
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
    supportedNetworks: ["mtn", "telecel", "airtel", "glo"],
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
    supportedNetworks: ["safaricom", "airtel", "telkom"],
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
    supportedNetworks: ["airtel", "tigo", "halotel"],
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

function formatBundleLabel(plan: DataBundlePlan) {
  let cleanName = plan.name;
  if (cleanName.toLowerCase().startsWith(plan.dataAmount.toLowerCase())) {
    cleanName = cleanName.slice(plan.dataAmount.length).trim();
    cleanName = cleanName.replace(/^[-–—\s]+/, "");
  }

  const parts: string[] = [plan.dataAmount];
  if (cleanName) {
    parts.push(cleanName);
  } else if (plan.validity) {
    parts.push(plan.validity);
  }

  if (
    plan.validity &&
    cleanName &&
    !cleanName.toLowerCase().includes(plan.validity.toLowerCase()) &&
    !cleanName.toLowerCase().includes(plan.category.toLowerCase())
  ) {
    parts.push(plan.validity);
  }

  return parts.join(" - ");
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
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
  const dataDropdownRef = useRef<HTMLDivElement>(null);

  // Sync if parent updates countryCode or countryName
  useEffect(() => {
    if (countryCode) {
      setSelectedCountryCode(countryCode.toUpperCase());
    } else if (countryName) {
      const p = resolveCountryProfile(undefined, countryName);
      setSelectedCountryCode(p.code);
    }
  }, [countryCode, countryName]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setIsCountryPickerOpen(false);
      }
      if (dataDropdownRef.current && !dataDropdownRef.current.contains(e.target as Node)) {
        setIsDataDropdownOpen(false);
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
  const isOutOfStock = (operator as any)?.inStock === false;

  // Data bundle state
  const availableBundles = useMemo(
    () => getDataBundles(profile.code, operator.id),
    [profile.code, operator.id]
  );
  const [selectedBundleId, setSelectedBundleId] = useState<string>(availableBundles[0]?.id || "");

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
  const [showNotifyInput, setShowNotifyInput] = useState(false);
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
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/mtn.webp" alt="MTN" fill priority className="object-cover" />
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
            <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Telecel Ghana</span>
          </div>
        )}
        {operator.logoType === "vodacom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/vodacom-new.png" alt="Vodacom" fill priority className="object-cover" />
          </div>
        )}
        {operator.logoType === "cellc" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/cell-c.webp" alt="Cell C" fill className="object-cover" />
          </div>
        )}
        {operator.logoType === "telkom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/telkom.webp" alt="Telkom" fill className="object-cover" />
          </div>
        )}
        {operator.logoType === "safaricom" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/safaricom.jfif" alt="Safaricom" fill className="object-cover" />
          </div>
        )}
        {operator.logoType === "tigo" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/tigo-tanzania.webp" alt="Tigo Tanzania" fill className="object-cover" />
          </div>
        )}
        {operator.logoType === "halotel" && (
          <div className="relative w-[300px] sm:w-[340px] md:w-[370px] h-[195px] sm:h-[220px] md:h-[240px] rounded-[18px] overflow-hidden shadow-xs">
            {!hasService && (
              <span className="absolute top-3 left-3 z-10 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                Out Of Stock
              </span>
            )}
            <Image src="/assets/telecom-card/halotel.webp" alt="Halotel" fill className="object-cover" />
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
              {Object.values(COUNTRY_PROFILES)
                .filter((c) => c.supportedNetworks.includes(operator.id))
                .map((c) => {
                  const isSelected = c.code === profile.code;
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
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* If operator does NOT operate in the selected country */}
      {!hasService && (
        <div className="mb-6 max-w-[500px] p-4 sm:p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
              <span className="font-serif font-black text-xs leading-none">!</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-amber-950 tracking-tight">
              {operator.name} does not operate in {profile.name}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/80 mb-3 leading-relaxed">
            Please choose an operator that operates in {profile.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {activeNetworks.map((netId) => {
              const op = OPERATORS[netId];
              if (!op) return null;
              return (
                <Link
                  key={netId}
                  href={`/products/${netId}?country=${profile.code}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
                >
                  <span>{op.name}</span>
                  <span>→</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Out of Stock Card Matching Exact Reference Design (only when operator operates in country but is temporarily out of stock) */}
      {hasService && isOutOfStock && (
        <div className="mb-6 max-w-[500px] p-4 sm:p-5 bg-[#ECEEF0] rounded-2xl shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-6 h-6 rounded-full bg-[#02332B] text-white flex items-center justify-center shrink-0">
              <span className="font-serif font-black text-xs leading-none">i</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#02332B] tracking-tight">
              We are currently out of stock on this product
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowNotifyInput((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#02332B] hover:bg-[#034439] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notify me when it&apos;s back</span>
            </button>

            <Link
              href={`/products?country=${profile.code}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#02332B] underline hover:text-[#034439] transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Similar products</span>
            </Link>
          </div>

          {/* Inline Email Input for Stock Notification */}
          {showNotifyInput && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-300/60 animate-in fade-in duration-150">
              {waitlistSent ? (
                <div className="p-2.5 bg-emerald-100/90 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>We will notify you immediately once this service is restocked.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (waitlistEmail.trim()) setWaitlistSent(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#02332B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#02332B] hover:bg-[#034439] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
              )}
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
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${topupType === "airtime"
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
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${topupType === "data"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
            }`}
        >
          <Wifi className={`w-4 h-4 ${topupType === "data" ? "text-emerald-600" : ""}`} />
          <span>Data Bundle</span>
        </button>
      </div>

      {/* Airtime Mode: Enter Amount */}
      {topupType === "airtime" ? (
        <div className="mb-6 w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Enter Amount
          </label>

          {/* Amount input */}
          <div className="flex items-center border border-slate-200 focus-within:border-slate-600 transition-colors py-2 px-3 bg-white rounded-[6px]">
            <input
              type="number"
              min={profile.minAmount}
              max={profile.maxAmount}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Enter amount (${profile.minAmount} - ${profile.maxAmount.toLocaleString()})`}
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
        /* Data Bundle Mode: Dropdown Selector */
        <div className="relative mb-6 w-full" ref={dataDropdownRef}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Data Plan
          </label>

          {/* Dropdown Input / Trigger */}
          <button
            type="button"
            onClick={() => setIsDataDropdownOpen((prev) => !prev)}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-500 rounded-[6px] px-3.5 py-3 flex items-center justify-between text-left transition-colors cursor-pointer shadow-2xs"
          >
            <div className="min-w-0 flex-1 pr-3">
              {selectedBundle ? (
                <span className="text-sm sm:text-base font-medium text-slate-900 truncate block">
                  {formatBundleLabel(selectedBundle)}
                </span>
              ) : (
                <span className="text-sm text-slate-400">Select data plan...</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {selectedBundle && (
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {profile.currencySymbol}{selectedBundle.priceLocal.toLocaleString()}
                  <span className="text-slate-400 font-normal ml-1">
                    (≈ ${(selectedBundle.priceLocal * profile.usdRate).toFixed(2)})
                  </span>
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  isDataDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu (Matches design in screenshot) */}
          {isDataDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 rounded-[6px] shadow-lg max-h-[285px] overflow-y-auto divide-y divide-gray-100 animate-in fade-in-50 zoom-in-95 duration-150 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-slate-500">
              {availableBundles.length === 0 ? (
                <div className="px-4 py-4 text-xs text-slate-500 text-center">
                  No data plans available.
                </div>
              ) : (
                availableBundles.map((plan) => {
                  const isSelected = selectedBundleId === plan.id;
                  const label = formatBundleLabel(plan);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        setSelectedBundleId(plan.id);
                        setAmount(plan.priceLocal);
                        setIsDataDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 sm:py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer select-none ${
                        isSelected ? "bg-slate-50/90 font-medium" : ""
                      }`}
                    >
                      <span className={`text-sm sm:text-[15px] ${isSelected ? "text-slate-900 font-semibold" : "text-[#1c3845] font-normal"}`}>
                        {label}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-500 shrink-0 ml-3">
                        {profile.currencySymbol}{plan.priceLocal.toLocaleString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
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
              ? `Unavailable in ${profile.name}`
              : isOutOfStock
                ? "Out of Stock"
                : isAlreadyInCart
                  ? "In Cart (View)"
                  : "Get started"}
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
