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
  ShoppingCart,
  FileSpreadsheet,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PurchaseAsGiftModal from "./PurchaseAsGiftModal";
import BulkUploadModal, { type BulkItem } from "./BulkUploadModal";
import CheckoutModal from "./CheckoutModal";
import CountryFlag from "./CountryFlag";
import { OPERATORS, type RefillOperator } from "@/lib/operators";

export { OPERATORS, type RefillOperator };

const ACCEPTED_CRYPTO = [
  {
    name: "Bitcoin",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F7931A" />
        <path d="M22.5 13.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.7-1.6-.4-.7 2.7c-.4-.1-.7-.2-1.1-.3l-2.3-.6-.4 1.8s1.2.3 1.2.3c.7.2.8.7.8 1.1l-.8 3.2c.1 0 .1 0 .2.1l-.2-.1-1.1 4.5c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.9 2 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5.1.3 6-2.3.8-2.1 0-3.3-1.5-4.1 1.1-.3 1.9-1 2.1-2.6zm-3.8 5.6c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.3 4.8.8 4.2 3zm.5-5.7c-.5 1.9-3.4.9-4.3.7l.8-3.3c.9.2 4 .7 3.5 2.6z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: "Lightning",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FF9900" />
        <path d="M17.5 7L10 17h6l-1.5 8 8.5-11h-6.5l1-7z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: "Ethereum",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <path d="M16 6l-6 10 6 3.5 6-3.5L16 6z" fill="#FFF" fillOpacity="0.8" />
        <path d="M16 6v13.5l6-3.5L16 6z" fill="#FFF" />
        <path d="M16 20.8l-6-3.6 6 8.8 6-8.8-6 3.6z" fill="#FFF" fillOpacity="0.8" />
        <path d="M16 20.8V26l6-8.8-6 3.6z" fill="#FFF" />
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
    name: "Solana",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#000000" />
        <path d="M9.5 21.5l2-2h11l-2 2h-11zm0-5l2-2h11l-2 2h-11zm2-5l-2-2h11l2 2h-11z" fill="url(#solGrad)" />
        <defs>
          <linearGradient id="solGrad" x1="9" y1="8" x2="23" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Polygon",
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#8247E5" />
        <path d="M20.5 13.5l-4.5-2.6-4.5 2.6v5.2l4.5 2.6 4.5-2.6v-5.2z" fill="#FFF" />
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
    supportedNetworks: ["mtn", "airtel", "glo"],
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
    supportedNetworks: ["mtn"],
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
    supportedNetworks: ["airtel"],
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
  RW: {
    code: "RW",
    name: "Rwanda",
    currency: "RWF",
    currencySymbol: "FRw",
    minAmount: 500,
    maxAmount: 50000,
    defaultAmount: 2000,
    usdRate: 0.00072,
    dialCode: "+250",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "078 123 4567",
    supportedNetworks: ["mtn", "airtel"],
  },
  ZM: {
    code: "ZM",
    name: "Zambia",
    currency: "ZMW",
    currencySymbol: "ZK",
    minAmount: 10,
    maxAmount: 1000,
    defaultAmount: 50,
    usdRate: 0.036,
    dialCode: "+260",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "096 123 4567",
    supportedNetworks: ["mtn", "airtel"],
  },
  CM: {
    code: "CM",
    name: "Cameroon",
    currency: "XAF",
    currencySymbol: "FCFA",
    minAmount: 500,
    maxAmount: 50000,
    defaultAmount: 2000,
    usdRate: 0.0016,
    dialCode: "+237",
    localPhoneLength: 9,
    intlPhoneLength: 12,
    placeholder: "067 123 4567",
    supportedNetworks: ["mtn"],
  },
  BJ: {
    code: "BJ",
    name: "Benin",
    currency: "XOF",
    currencySymbol: "CFA",
    minAmount: 500,
    maxAmount: 50000,
    defaultAmount: 2000,
    usdRate: 0.0016,
    dialCode: "+229",
    localPhoneLength: 8,
    intlPhoneLength: 11,
    placeholder: "097 123 456",
    supportedNetworks: ["mtn", "glo"],
  },
  CI: {
    code: "CI",
    name: "Côte d'Ivoire",
    currency: "XOF",
    currencySymbol: "CFA",
    minAmount: 500,
    maxAmount: 50000,
    defaultAmount: 2000,
    usdRate: 0.0016,
    dialCode: "+225",
    localPhoneLength: 10,
    intlPhoneLength: 12,
    placeholder: "05 1234 5678",
    supportedNetworks: ["mtn"],
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
    supportedNetworks: ["airtel"],
  },
  CD: {
    code: "CD",
    name: "DR Congo",
    currency: "USD",
    currencySymbol: "$",
    minAmount: 1,
    maxAmount: 100,
    defaultAmount: 5,
    usdRate: 1.0,
    dialCode: "+243",
    localPhoneLength: 9,
    intlPhoneLength: 12,
    placeholder: "099 123 4567",
    supportedNetworks: ["airtel"],
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
  if (cleanName.includes("rwanda")) return COUNTRY_PROFILES.RW;
  if (cleanName.includes("zambia")) return COUNTRY_PROFILES.ZM;
  if (cleanName.includes("cameroon")) return COUNTRY_PROFILES.CM;
  if (cleanName.includes("benin")) return COUNTRY_PROFILES.BJ;
  if (cleanName.includes("ivoire") || cleanName.includes("ivory")) return COUNTRY_PROFILES.CI;
  if (cleanName.includes("tanzania")) return COUNTRY_PROFILES.TZ;
  if (cleanName.includes("congo")) return COUNTRY_PROFILES.CD;
  return COUNTRY_PROFILES.NG;
}

interface RefillDetailsViewProps {
  operatorId?: "mtn" | "airtel" | "glo" | "9mobile";
  initialPhone?: string;
  initialAmount?: number;
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
  initialPhone = "08062268255",
  initialAmount,
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
  const { addItem, clearCart } = useCart();

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

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [amount, setAmount] = useState<number>(initialAmount ?? profile.defaultAmount);
  const [phone, setPhone] = useState<string>(initialPhone || profile.placeholder);
  // Additional phone numbers for bulk top-up
  const [extraPhones, setExtraPhones] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Sync initial phone and amounts when operator or country changes
  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone);
    } else {
      setPhone(profile.placeholder);
    }
  }, [initialPhone, profile]);

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
    return `${operator.name} Top-up`;
  }, [operator]);

  const dynamicDescription = useMemo(() => {
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
  }, [operator, profile]);

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
    return { isValid: true, error: null };
  }

  const phoneValidation = useMemo(() => validatePhone(phone), [phone, profile]);
  const extraPhoneValidations = useMemo(
    () => extraPhones.map((p) => validatePhone(p)),
    [extraPhones, profile]
  );
  const allPhonesValid =
    phoneValidation.isValid && extraPhoneValidations.every((v) => v.isValid);

  // Total USD across all phone numbers
  const totalPhones = 1 + extraPhones.length;
  const totalUsdAll = useMemo(
    () => (amount * profile.usdRate * totalPhones).toFixed(2),
    [amount, profile.usdRate, totalPhones]
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (amount > profile.maxAmount || amount < profile.minAmount || !allPhonesValid) return;
    clearCart();
    // Add primary phone as first cart item
    const perItemUsd = Number((amount * profile.usdRate).toFixed(2));
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} ${profile.name}`,
      phoneNumber: phone.trim() || profile.placeholder,
      amountNgn: amount,
      amountUsd: perItemUsd,
      isGift: false,
    });
    // Add extra phones as additional cart items
    extraPhones.forEach((p) => {
      if (p.trim()) {
        addItem({
          networkId: operator.id,
          networkName: `${operator.name} ${profile.name}`,
          phoneNumber: p.trim(),
          amountNgn: amount,
          amountUsd: perItemUsd,
          isGift: false,
        });
      }
    });
    setIsCheckoutOpen(true);
  };

  const handleGiftCheckout = (giftDetails: {
    recipientName: string;
    recipientEmail: string;
    senderName: string;
    message?: string;
  }) => {
    if (amount > profile.maxAmount || !phoneValidation.isValid) return;
    clearCart();
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} ${profile.name}`,
      phoneNumber: phone.trim() || profile.placeholder,
      amountNgn: amount,
      amountUsd: Number((amount * profile.usdRate).toFixed(2)),
      isGift: true,
      giftDetails,
    });
    setIsGiftModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBulkCheckout = (bulkItems: BulkItem[]) => {
    clearCart();
    bulkItems.forEach((b) => {
      addItem({
        networkId: operator.id,
        networkName: `${operator.name} ${profile.name}`,
        phoneNumber: b.phoneNumber.trim(),
        amountNgn: b.amountNgn,
        amountUsd: b.amountUsd,
        isGift: false,
      });
    });
    setIsBulkModalOpen(false);
    setIsCheckoutOpen(true);
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
    amount > profile.maxAmount ||
    amount < profile.minAmount ||
    !allPhonesValid;

  // Render operator logo tile
  const renderLogoTile = () => (
    <div className="shrink-0 w-full md:w-[460px] lg:w-[500px] md:sticky md:top-28 self-start">
      <div className="relative w-full aspect-square rounded-none bg-[#EBEBEB] flex items-center justify-center p-6 sm:p-10">
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
      </div>
    </div>
  );

  // Render form content
  const renderFormContent = () => (
    <div className="flex-1 min-w-0 max-w-[560px]">
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
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs transition-all cursor-pointer focus:outline-none select-none"
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

      {/* Amount input */}
      <div className="mb-6 max-w-[420px]">
        <div className="flex items-center border border-slate-200 focus-within:border-slate-600 transition-colors py-2 px-3 bg-transparent rounded-[6px]">
          <input
            type="number"
            min={profile.minAmount}
            max={profile.maxAmount}
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="flex-1 py-1 bg-transparent text-sm sm:text-base text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
          />
          {amount > 0 && (
            <span className="pl-2 text-xs sm:text-sm font-semibold text-slate-500 shrink-0">
              ${usdAmount}
            </span>
          )}
        </div>
        {amount > profile.maxAmount && (
          <p className="text-xs text-red-500 mt-1.5">
            Maximum is {profile.currencySymbol}{profile.maxAmount.toLocaleString()}.
          </p>
        )}
      </div>

      {/* Phone numbers — primary + extras */}
      <div className="mb-6 max-w-[420px]">
        {totalPhones > 1 && (
          <div className="mb-1 text-right">
            <span className="text-xs text-emerald-600 font-semibold">
              {totalPhones} numbers · ${totalUsdAll} total
            </span>
          </div>
        )}

        {/* Primary phone */}
        <div className="mb-2">
          <div className="flex items-center border border-slate-200 focus-within:border-slate-600 transition-colors rounded-[6px] px-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number to top up"
              className="flex-1 border-0 bg-transparent focus:outline-none py-2 px-0 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400"
            />
            {extraPhones.length < 4 && (
              <button
                type="button"
                onClick={() => setExtraPhones([...extraPhones, ""])}
                title="Add another phone number (up to 5)"
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0 ml-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          {phoneValidation.error && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-start gap-1.5 font-medium leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{phoneValidation.error}</span>
            </p>
          )}
        </div>

        {/* Extra phones */}
        {extraPhones.map((p, i) => (
          <div key={i} className="mb-2 animate-in fade-in duration-150">
            <div className="flex items-center border border-slate-200 focus-within:border-slate-600 transition-colors rounded-[6px] px-3">
              <input
                type="tel"
                value={p}
                onChange={(e) => {
                  const copy = [...extraPhones];
                  copy[i] = e.target.value;
                  setExtraPhones(copy);
                }}
                placeholder="Phone number to top up"
                className="flex-1 border-0 bg-transparent focus:outline-none py-2 px-0 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setExtraPhones(extraPhones.filter((_, j) => j !== i))}
                title="Remove phone number"
                className="w-7 h-7 rounded-full hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors cursor-pointer shrink-0 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {extraPhoneValidations[i]?.error && (
              <p className="text-xs text-rose-500 mt-1 flex items-start gap-1 font-medium leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                <span>{extraPhoneValidations[i].error}</span>
              </p>
            )}
          </div>
        ))}

        {/* Bulk CSV Upload trigger */}
        <div className="pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer transition-colors group select-none"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Upload CSV for bulk top-up</span>
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3 max-w-[420px] mt-10 mb-7">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isDisabled || !hasService}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-7 font-bold text-sm sm:text-base rounded-full transition-all cursor-pointer ${
            !hasService
              ? "bg-[#FF5A1F] text-white opacity-70 cursor-not-allowed"
              : "bg-[#00F0A0] hover:bg-[#05e598] text-[#030A16] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          }`}
        >
          {hasService && <Zap className="w-4 h-4 fill-current" />}
          <span>{hasService ? "Buy airtime" : "Out of Stock"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsGiftModalOpen(true)}
          disabled={isDisabled || !hasService}
          className="flex items-center justify-center gap-2 py-3.5 px-5 bg-[#F0F2F5] hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-sm rounded-full border border-slate-200/60 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Gift className="w-4 h-4" />
          <span>Purchase as gift</span>
        </button>
      </div>

      {/* Thin divider + 3 Trust Badges */}
      <div className="border-t border-slate-200 pt-16 pb-20 max-w-[420px]">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <User className="w-5 h-5 text-[#DE1D35] stroke-[1.75]" />
            <span className="text-xs font-semibold text-slate-700">No Account Required</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Mail className="w-5 h-5 text-[#DE1D35] stroke-[1.75]" />
            <span className="text-xs font-semibold text-slate-700">Instant Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Shield className="w-5 h-5 text-[#DE1D35] stroke-[1.75]" />
            <span className="text-xs font-semibold text-slate-700">Private and Safe</span>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="border-t border-slate-200 max-w-[420px]">
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
        <div className="w-full bg-white pb-24 text-slate-900">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            {/* Main Content Layout directly on full white page */}
            <div className="flex flex-col md:flex-row gap-10 lg:gap-14 items-start">
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
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        operator={operator}
        countryProfile={{
          code: profile.code,
          name: profile.name,
          currencySymbol: profile.currencySymbol,
          minAmount: profile.minAmount,
          maxAmount: profile.maxAmount,
          defaultAmount: profile.defaultAmount,
          usdRate: profile.usdRate,
          dialCode: profile.dialCode,
          localPhoneLength: profile.localPhoneLength,
          intlPhoneLength: profile.intlPhoneLength,
        }}
        onProceedToCheckout={handleBulkCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
