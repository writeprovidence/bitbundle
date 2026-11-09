"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Star,
  Check,
  Clock,
  Landmark,
  Wallet,
  X,
  AlertCircle,
  QrCode,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import TopupCard from "./TopupCard";
import RefillDetailsView, { OPERATORS } from "./RefillDetailsView";
import AssistantModal from "./AssistantModal";
import CheckoutModal from "./CheckoutModal";

export interface ProductItem {
  id: string;
  name: string;
  networkId: "mtn" | "airtel" | "glo" | "9mobile" | "spectranet";
  category: "Airtime" | "Data" | "PIN" | "Bundles" | "Internet";
  range: string;
  rating?: number;
  inStock: boolean;
  badge?: string;
  badgeType?: "discount" | "outofstock";
  cardBg: string;
  cardBorder?: string;
  logoType: "mtn" | "airtel" | "glo" | "9mobile" | "spectranet";
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  placeholder: string;
  networks: ("mtn" | "airtel" | "glo" | "9mobile" | "spectranet")[];
}

export const COUNTRIES: CountryOption[] = [
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    dialCode: "+234",
    placeholder: "0802 123 4567",
    networks: ["mtn", "airtel", "glo", "9mobile"],
  },
  {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    dialCode: "+233",
    placeholder: "024 123 4567",
    networks: ["mtn", "airtel", "glo"],
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    dialCode: "+27",
    placeholder: "083 123 4567",
    networks: ["mtn"],
  },
  {
    code: "UG",
    name: "Uganda",
    flag: "🇺🇬",
    dialCode: "+256",
    placeholder: "077 123 4567",
    networks: ["mtn", "airtel"],
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    dialCode: "+254",
    placeholder: "071 234 5678",
    networks: ["airtel"],
  },
  {
    code: "RW",
    name: "Rwanda",
    flag: "🇷🇼",
    dialCode: "+250",
    placeholder: "078 123 4567",
    networks: ["mtn", "airtel"],
  },
  {
    code: "ZM",
    name: "Zambia",
    flag: "🇿🇲",
    dialCode: "+260",
    placeholder: "096 123 4567",
    networks: ["mtn", "airtel"],
  },
  {
    code: "CM",
    name: "Cameroon",
    flag: "🇨🇲",
    dialCode: "+237",
    placeholder: "067 123 4567",
    networks: ["mtn"],
  },
  {
    code: "BJ",
    name: "Benin",
    flag: "🇧🇯",
    dialCode: "+229",
    placeholder: "097 123 456",
    networks: ["mtn", "glo"],
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    dialCode: "+225",
    placeholder: "05 1234 5678",
    networks: ["mtn"],
  },
  {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    dialCode: "+255",
    placeholder: "078 123 4567",
    networks: ["airtel"],
  },
  {
    code: "CD",
    name: "DR Congo",
    flag: "🇨🇩",
    dialCode: "+243",
    placeholder: "099 123 4567",
    networks: ["airtel"],
  },
];

const PRODUCTS: ProductItem[] = [
  {
    id: "mtn-airtime",
    name: "MTN",
    networkId: "mtn",
    category: "Airtime",
    range: "5 NGN - 10000 NGN",
    rating: 4.8,
    inStock: true,
    cardBg: "bg-[#FFCC00]",
    logoType: "mtn",
  },
  {
    id: "airtel-airtime",
    name: "Airtel",
    networkId: "airtel",
    category: "Airtime",
    range: "50 NGN - 10000 NGN",
    rating: 4.9,
    inStock: true,
    cardBg: "bg-white",
    cardBorder: "border border-gray-100",
    logoType: "airtel",
  },
  {
    id: "glo-airtime",
    name: "GLO",
    networkId: "glo",
    category: "Airtime",
    range: "100 NGN - 10000 NGN",
    rating: 4.8,
    inStock: true,
    cardBg: "bg-white",
    cardBorder: "border border-gray-100",
    logoType: "glo",
  },
  {
    id: "9mobile-airtime",
    name: "9Mobile",
    networkId: "9mobile",
    category: "Airtime",
    range: "5 NGN - 10000 NGN",
    rating: 4.3,
    inStock: true,
    badge: "⚡ -2%",
    badgeType: "discount",
    cardBg: "bg-[#045F40]",
    logoType: "9mobile",
  },
];

// Helper to guess Nigerian operator by phone prefix
function detectOperator(phone: string): "mtn" | "airtel" | "glo" | "9mobile" | null {
  const clean = phone.replace(/\D/g, "");
  const prefix = clean.startsWith("234") ? "0" + clean.slice(3, 6) : clean.slice(0, 4);
  
  const mtnPrefixes = ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916"];
  const airtelPrefixes = ["0802", "0808", "0708", "0812", "0701", "0902", "0901", "0904", "0907", "0912"];
  const gloPrefixes = ["0805", "0807", "0705", "0815", "0811", "0905", "0915"];
  const nineMobilePrefixes = ["0809", "0817", "0818", "0909", "0908"];

  if (mtnPrefixes.includes(prefix)) return "mtn";
  if (airtelPrefixes.includes(prefix)) return "airtel";
  if (gloPrefixes.includes(prefix)) return "glo";
  if (nineMobilePrefixes.includes(prefix)) return "9mobile";
  return null;
}

// Vector SVG flags for clear, cross-platform display (works everywhere including Windows)
function CountryFlag({ code, className = "w-5 h-3.5" }: { code: string; className?: string }) {
  const c = code.toUpperCase();
  switch (c) {
    case "NG":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="8" height="16" fill="#008751" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#008751" />
        </svg>
      );
    case "GH":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="5.33" fill="#CE1126" />
          <rect y="5.33" width="24" height="5.34" fill="#FCD116" />
          <rect y="10.67" width="24" height="5.33" fill="#006B3F" />
          <polygon points="12,5.7 12.9,8.5 15.6,8.5 13.4,10.1 14.3,12.8 12,11.2 9.7,12.8 10.6,10.1 8.4,8.5 11.1,8.5" fill="#000" />
        </svg>
      );
    case "ZA":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="8" fill="#E03C31" />
          <rect y="8" width="24" height="8" fill="#001489" />
          <polygon points="0,0 12,8 0,16" fill="#000" />
          <polygon points="0,0 2,0 13.5,7.7 24,7.7 24,8.3 13.5,8.3 2,16 0,16 11,8" fill="#FFB612" />
          <path d="M0,0 L4,0 L14,7 L24,7 L24,9 L14,9 L4,16 L0,16 L10,8 Z" fill="#007749" />
        </svg>
      );
    case "UG":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="2.67" fill="#000" />
          <rect y="2.67" width="24" height="2.67" fill="#FCDC04" />
          <rect y="5.34" width="24" height="2.67" fill="#D90000" />
          <rect y="8.01" width="24" height="2.67" fill="#000" />
          <rect y="10.68" width="24" height="2.67" fill="#FCDC04" />
          <rect y="13.35" width="24" height="2.65" fill="#D90000" />
          <circle cx="12" cy="8" r="2.6" fill="#FFF" />
          <circle cx="12" cy="8" r="1.8" fill="#000" />
        </svg>
      );
    case "KE":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="4.6" fill="#000" />
          <rect y="4.6" width="24" height="0.8" fill="#FFF" />
          <rect y="5.4" width="24" height="5.2" fill="#BB0000" />
          <rect y="10.6" width="24" height="0.8" fill="#FFF" />
          <rect y="11.4" width="24" height="4.6" fill="#006600" />
          <ellipse cx="12" cy="8" rx="2.4" ry="4" fill="#BB0000" />
          <ellipse cx="12" cy="8" rx="1.6" ry="3.5" fill="#000" />
          <circle cx="12" cy="8" r="0.8" fill="#FFF" />
        </svg>
      );
    case "RW":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="8" fill="#00A1DE" />
          <rect y="8" width="24" height="4" fill="#FAD201" />
          <rect y="12" width="24" height="4" fill="#20603D" />
          <circle cx="19" cy="4" r="1.8" fill="#E5A912" />
        </svg>
      );
    case "ZM":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="16" fill="#198A00" />
          <rect x="16" y="6" width="2.66" height="10" fill="#DE2010" />
          <rect x="18.66" y="6" width="2.66" height="10" fill="#000" />
          <rect x="21.32" y="6" width="2.68" height="10" fill="#EF7D00" />
        </svg>
      );
    case "CM":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="8" height="16" fill="#007A5E" />
          <rect x="8" width="8" height="16" fill="#CE1126" />
          <rect x="16" width="8" height="16" fill="#FCD116" />
          <polygon points="12,6.5 12.6,8.2 14.4,8.2 13,9.2 13.5,10.9 12,9.9 10.5,10.9 11,9.2 9.6,8.2 11.4,8.2" fill="#FCD116" />
        </svg>
      );
    case "BJ":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="9.6" height="16" fill="#008751" />
          <rect x="9.6" width="14.4" height="8" fill="#FCD116" />
          <rect x="9.6" y="8" width="14.4" height="8" fill="#E8112D" />
        </svg>
      );
    case "CI":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="8" height="16" fill="#F77F00" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#009E60" />
        </svg>
      );
    case "TZ":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <polygon points="0,0 24,0 0,16" fill="#1EB53A" />
          <polygon points="24,0 24,16 0,16" fill="#00A3DD" />
          <polygon points="0,16 6,16 24,4 24,0 18,0 0,12" fill="#FCD116" />
          <polygon points="0,16 4,16 24,2.5 24,0 20,0 0,13.5" fill="#000" />
        </svg>
      );
    case "CD":
      return (
        <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[2px] shadow-xs border border-black/10 overflow-hidden`}>
          <rect width="24" height="16" fill="#007FFF" />
          <polygon points="0,16 4,16 24,2 24,0 20,0 0,14" fill="#F7D618" />
          <polygon points="0,16 2.5,16 24,1 24,0 21.5,0 0,15" fill="#CE1021" />
          <polygon points="3.5,2 4,3.2 5.2,3.2 4.2,4 4.6,5.2 3.5,4.5 2.4,5.2 2.8,4 1.8,3.2 3,3.2" fill="#F7D618" />
        </svg>
      );
    default:
      return <span className="text-sm">🌐</span>;
  }
}

export default function ProductsCatalog({ initialNetwork }: { initialNetwork?: string }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [outOfStockModal, setOutOfStockModal] = useState<ProductItem | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (initialNetwork) {
      const found = PRODUCTS.find((p) => p.networkId === initialNetwork);
      if (found) setSelectedProduct(found);
    }
  }, [initialNetwork]);

  // Close country dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries for the search dropdown
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.networks.some((n) => n.toLowerCase().includes(q))
    );
  }, [countrySearch]);

  // Filter products by country networks and search query
  const filteredProducts = useMemo(() => {
    let inStockList = PRODUCTS.filter((p) => p.inStock);
    if (selectedCountry.networks && selectedCountry.networks.length > 0) {
      inStockList = inStockList.filter((p) => selectedCountry.networks.includes(p.networkId));
    }
    if (!searchQuery.trim()) return inStockList;
    const query = searchQuery.toLowerCase();
    return inStockList.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.range.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedCountry]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    const detected = detectOperator(phoneNumber);
    const countryProducts = PRODUCTS.filter(
      (p) => p.inStock && selectedCountry.networks.includes(p.networkId)
    );
    const matchedProduct =
      countryProducts.find((p) => p.networkId === detected) ||
      countryProducts[0] ||
      PRODUCTS[0];
    
    // Select and open purchase modal
    setSelectedProduct(matchedProduct);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("bitbundle:select-network", {
          detail: { id: matchedProduct.networkId },
        })
      );
    }, 100);
  };

  const handleCardClick = (product: ProductItem) => {
    if (!product.inStock) {
      setOutOfStockModal(product);
      setWaitlistSuccess(false);
      return;
    }
    setSelectedProduct(product);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("bitbundle:select-network", {
          detail: { id: product.networkId },
        })
      );
    }, 100);
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSuccess(true);
    }
  };

  return (
    <div className="w-full bg-[#F4F6F8] text-gray-900 font-sans pt-20">
      {selectedProduct ? (
        <RefillDetailsView
          operatorId={selectedProduct.networkId as any}
          initialPhone={phoneNumber}
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <>
          {/* ──────────────────────────────────────────────────────────
              1. HERO BANNER (Dark Pine / Emerald Background with Input)
          ────────────────────────────────────────────────────────── */}
          <section className="relative bg-[#010C24] text-white pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Subtle radial ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle at 50% 25%, rgba(0, 229, 153, 0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-white tracking-tight mb-10 sm:mb-14 max-w-3xl mx-auto">
            Top up prepaid mobile phones with USDT and other cryptocurrencies from anywhere in the world
          </h1>

          {/* Hand-drawn style note with curved arrow */}
          <div className="relative inline-block w-full max-w-[340px] mx-auto">
            <div className="absolute -top-10 -left-6 sm:-left-12 flex items-center gap-1.5 text-white/90 select-none pointer-events-none">
              <span className="font-serif italic font-semibold text-sm sm:text-base tracking-wide rotate-[-6deg] text-emerald-200">
                Type in number
              </span>
              {/* Hand-drawn curvy arrow pointing down-right */}
              <svg
                className="w-7 h-7 text-emerald-200 stroke-current transform rotate-12 -mt-1"
                viewBox="0 0 40 40"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 5 12 Q 22 10 26 26" />
                <path d="M 18 24 L 26 27 L 27 19" />
              </svg>
            </div>

            {/* Input Bar Pill */}
            <form
              onSubmit={handlePhoneSubmit}
              className="w-full flex items-stretch bg-white rounded-lg shadow-xl transition-all focus-within:ring-4 focus-within:ring-emerald-400/30 relative z-30"
            >
              {/* Country selector */}
              <div className="relative flex items-center" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-800 border-r border-gray-200 cursor-pointer hover:bg-gray-100/70 rounded-l-lg transition-colors select-none focus:outline-none"
                  aria-expanded={isCountryDropdownOpen}
                  aria-label={`Select country, currently ${selectedCountry.name}`}
                >
                  <CountryFlag code={selectedCountry.code} className="w-5 h-3.5" />
                  <span className="text-sm font-bold tracking-wide text-gray-900">{selectedCountry.code}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      isCountryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Country Dropdown Menu */}
                {isCountryDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 max-h-72 overflow-y-auto bg-white border border-gray-200 shadow-xl z-[100] text-left">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryDropdownOpen(false);
                        }}
                        className={`w-full flex items-baseline gap-1.5 px-3 py-2 text-sm text-left cursor-pointer transition-colors ${
                          selectedCountry.code === c.code
                            ? "bg-[#1a73e8] text-white"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <span className="font-normal">{c.name}</span>
                        <span className={`font-normal ${selectedCountry.code === c.code ? "text-white" : "text-gray-500"}`}>({c.dialCode})</span>
                        <span className={`text-xs uppercase font-normal ${selectedCountry.code === c.code ? "text-white/80" : "text-gray-400"}`}>{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedCountry.placeholder}
                className="flex-1 min-w-0 px-3 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 font-medium focus:outline-none bg-transparent border-0"
              />

              {/* Submit Red Button with arrow */}
              <button
                type="submit"
                aria-label="Submit phone number for top-up"
                className="bg-[#DE1D35] hover:bg-[#c21429] active:bg-[#b01024] text-white w-12 sm:w-14 rounded-r-lg flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 self-stretch border-0"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. POPULAR TOP-UP PRODUCTS IN NIGERIA (Catalog Grid)
      ────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto">
        {/* Section Header + Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Top-up products in {selectedCountry.name}
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for operators..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-9">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                className="group flex flex-col cursor-pointer transition-all duration-200"
              >
                {/* Visual Card Canvas */}
                <div
                  className={`relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl flex items-center justify-center ${
                    product.logoType === "mtn" ? "p-0 overflow-hidden" : "p-6"
                  } transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1 ${product.cardBg} ${product.cardBorder || ""}`}
                >
                  {/* Top-left badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      {product.badgeType === "discount" ? (
                        <span className="inline-flex items-center gap-1 bg-[#FFD700] text-black text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Brand Logo Presentation: straight and enlarged */}
                  {product.logoType === "mtn" && (
                    <Image
                      src="/assets/mtn_banner.jpg"
                      alt="MTN"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover rounded-2xl group-hover:scale-105 transition-transform"
                      priority
                    />
                  )}

                  {product.logoType === "airtel" && (
                    <div className="flex items-center justify-center w-full px-4 select-none">
                      <Image
                        src="/assets/airtel-brand-logo.png"
                        alt="Airtel"
                        width={250}
                        height={92}
                        className="w-auto h-12 sm:h-14 object-contain"
                      />
                    </div>
                  )}

                  {product.logoType === "glo" && (
                    <div className="flex items-center justify-center select-none">
                      <Image
                        src="/assets/glo.jpg"
                        alt="Glo"
                        width={120}
                        height={120}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {product.logoType === "9mobile" && (
                    <div className="flex items-center justify-center w-full px-4 select-none">
                      <Image
                        src="/assets/9mobile-brand-logo.png"
                        alt="9mobile"
                        width={200}
                        height={200}
                        className="w-auto h-20 sm:h-24 object-contain hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>

                {/* Card Meta below */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">
                      {product.name}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                        <span>{product.rating.toFixed(1)}</span>
                        <Star className="w-3 h-3 fill-black text-black" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 mt-4">
            <p className="text-base font-semibold text-gray-700">No operators found matching &quot;{searchQuery}&quot;</p>
            <p className="text-xs text-gray-400 mt-1">
              Try searching for {selectedCountry.networks.map((n) => n.toUpperCase()).join(", ")}.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. HOW TOP-UP WORKS SECTION
      ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F4F6F8] pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-12 sm:mb-16 text-left">
            How top-up works
          </h2>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Step 1 */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              {/* Header Badge & Step */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 tracking-wider uppercase font-mono">
                  Step 01
                </span>
                <span className="text-xs font-semibold text-gray-400">Select & Input</span>
              </div>

              {/* Visual Mockup Area */}
              <div className="w-full bg-gradient-to-br from-emerald-50/60 via-gray-50 to-slate-100/80 rounded-2xl p-5 border border-emerald-100/50 flex flex-col items-center justify-center gap-3 min-h-[170px] shadow-inner relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl pointer-events-none" />

                {/* Simulated Phone Input Bar */}
                <div className="w-full max-w-[240px] bg-white rounded-xl px-3 py-2 border border-gray-200/80 shadow-sm flex items-center gap-2">
                  <span className="text-sm">🇳🇬</span>
                  <span className="text-xs font-mono font-bold text-gray-800 tracking-wide">+234 803 ••• ••••</span>
                  <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full animate-pulse ml-auto" />
                </div>

                {/* Amount Pill */}
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <span>₦5,000 Airtime</span>
                  </div>
                  <div className="bg-white text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 shadow-xs">
                    MTN Nigeria
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-6 sm:mt-7">
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Enter phone number & amount
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Choose your preferred operator, type in the recipient phone number and select your top-up amount.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              {/* Header Badge & Step */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 tracking-wider uppercase font-mono">
                  Step 02
                </span>
                <span className="text-xs font-semibold text-gray-400">Crypto Checkout</span>
              </div>

              {/* Visual Mockup Area */}
              <div className="w-full bg-gradient-to-br from-blue-50/60 via-gray-50 to-slate-100/80 rounded-2xl p-5 border border-blue-100/50 flex flex-col items-center justify-center gap-3 min-h-[170px] shadow-inner relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />

                {/* Floating Token Icons Row */}
                <div className="flex items-center justify-center -space-x-2">
                  <Image src="/assets/token icons/cusd.png" alt="cUSD" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  <Image src="/assets/token icons/gooddollar_logo.jfif" alt="GoodDollar" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  <Image src="/assets/token icons/usdt.png" alt="USDT" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  <Image src="/assets/token icons/celo.png" alt="CELO" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                </div>

                {/* Simulated Payment Confirmation Chip */}
                <div className="bg-white rounded-xl px-3.5 py-1.5 border border-gray-200/80 shadow-sm flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-gray-800">Connect Wallet</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">0% Fee</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-6 sm:mt-7">
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                  Pay with crypto or wallet
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Connect your Web3 wallet to pay using cUSD, Gooddollar, USDT, or CELO in seconds.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              {/* Header Badge & Step */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200/60 tracking-wider uppercase font-mono">
                  Step 03
                </span>
                <span className="text-xs font-semibold text-gray-400">Instant Delivery</span>
              </div>

              {/* Visual Mockup Area */}
              <div className="w-full bg-gradient-to-br from-amber-50/60 via-gray-50 to-slate-100/80 rounded-2xl p-5 border border-amber-100/50 flex flex-col items-center justify-center gap-2.5 min-h-[170px] shadow-inner relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

                {/* Simulated SMS / Push Notification Card */}
                <div className="w-full max-w-[240px] bg-white rounded-xl p-2.5 border border-gray-200/80 shadow-sm flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-900 leading-tight">Top-up Successful!</span>
                      <span className="text-[9px] font-medium text-gray-400">now</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">₦5,000 sent to +234 803 ••• ••••</p>
                  </div>
                </div>

                {/* Speed badge */}
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-200/50">
                  <Clock className="w-3 h-3" />
                  <span>Delivered in under 60 seconds</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-6 sm:mt-7">
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-amber-800 transition-colors">
                  Instant top-up delivered
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  As soon as your transaction is confirmed on-chain, airtime or data is credited directly to the phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL: OUT OF STOCK ITEM
      ────────────────────────────────────────────────────────── */}
      {outOfStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-900 border border-gray-100">
            <button
              onClick={() => setOutOfStockModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {outOfStockModal.name} is currently out of stock
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              We are currently restocking {outOfStockModal.name} PINs and vouchers. Leave your email to be notified instantly when stock arrives.
            </p>

            {waitlistSuccess ? (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold">
                  You&apos;re on the waitlist! We&apos;ll email you when restocked.
                </span>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="mt-5 flex gap-2">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">Need airtime right away?</span>
              <button
                type="button"
                onClick={() => {
                  setOutOfStockModal(null);
                  setSelectedProduct(PRODUCTS[0]);
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Choose MTN or Airtel →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Modal */}
      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
