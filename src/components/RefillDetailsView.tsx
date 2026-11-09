"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Gift,
  Link2,
  Heart,
  UserCheck,
  Mail,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import PurchaseAsGiftModal from "./PurchaseAsGiftModal";
import { OPERATORS, type RefillOperator } from "@/lib/operators";

export { OPERATORS, type RefillOperator };

const USD_RATE = 0.00065; // ~1538 NGN per USD

interface RefillDetailsViewProps {
  operatorId?: "mtn" | "airtel" | "glo" | "9mobile";
  initialPhone?: string;
  initialAmount?: number;
  onBack?: () => void;
}

export default function RefillDetailsView({
  operatorId = "mtn",
  initialPhone = "08062268255",
  initialAmount,
  onBack,
}: RefillDetailsViewProps) {
  const operator = OPERATORS[operatorId] || OPERATORS.mtn;
  const { addItem } = useCart();

  const [amount, setAmount] = useState<number>(initialAmount ?? operator.defaultAmount);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // Accordion state
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);

  // Calculation
  const usdAmount = useMemo(() => {
    return (amount * USD_RATE).toFixed(2);
  }, [amount]);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (amount > 10000) return;
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} Nigeria`,
      phoneNumber: phone.trim() || "08062268255",
      amountNgn: amount,
      amountUsd: Number(usdAmount),
      isGift: false,
    });
  };

  const handleAddGiftToCart = (giftDetails: {
    recipientName: string;
    recipientEmail: string;
    senderName: string;
    message?: string;
  }) => {
    if (amount > 10000) return;
    addItem({
      networkId: operator.id,
      networkName: `${operator.name} Nigeria`,
      phoneNumber: phone.trim() || "08062268255",
      amountNgn: amount,
      amountUsd: Number(usdAmount),
      isGift: true,
      giftDetails,
    });
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-gray-900 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumbs Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 mr-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Back to catalog"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold">Catalog</span>
              </button>
            )}
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline"
            >
              Nigeria
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800 font-semibold">Prepaid phones</span>
          </div>
        </div>

        {/* Main 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ──────────────────────────────────────────────────────────
              LEFT COLUMN: Product Card with floating Share & Heart
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[480px] bg-[#E8EAE8] rounded-3xl p-8 sm:p-12 flex items-center justify-center shadow-xs border border-black/5 overflow-hidden">
              {/* Floating Action Buttons top right */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {/* Share Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  className="w-9 h-9 rounded-full bg-white text-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer relative"
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  {linkCopied && (
                    <span className="absolute -bottom-8 right-0 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>

                {/* Heart Favorite Button */}
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label="Add to favorites"
                  className="w-9 h-9 rounded-full bg-white text-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFavorite ? "fill-[#DE1D35] text-[#DE1D35]" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>

              {/* Center Operator Visual */}
              {operator.logoType === "mtn" && (
                <div className="relative w-[240px] h-[155px] sm:w-[280px] sm:h-[180px] rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="/assets/mtn_banner.jpg"
                    alt="MTN"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              )}

              {operator.logoType === "airtel" && (
                <div className="w-[240px] h-[155px] sm:w-[280px] sm:h-[180px] bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-md p-6">
                  <Image
                    src="/assets/airtel-brand-logo.png"
                    alt="Airtel"
                    width={220}
                    height={80}
                    className="w-auto h-16 sm:h-20 object-contain"
                  />
                </div>
              )}

              {operator.logoType === "glo" && (
                <div className="w-[240px] h-[155px] sm:w-[280px] sm:h-[180px] bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-md p-6">
                  <Image
                    src="/assets/glo.jpg"
                    alt="Glo"
                    width={140}
                    height={140}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm"
                  />
                </div>
              )}

              {operator.logoType === "9mobile" && (
                <div className="w-[240px] h-[155px] sm:w-[280px] sm:h-[180px] bg-[#045F40] rounded-2xl flex items-center justify-center shadow-md p-6">
                  <Image
                    src="/assets/9mobile-brand-logo.png"
                    alt="9mobile"
                    width={200}
                    height={100}
                    className="w-auto h-16 sm:h-20 object-contain brightness-0 invert"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT COLUMN: Product Info, Form, Buttons & Features
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0B1528] tracking-tight leading-tight">
              {operator.fullName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">
                {operator.rating.toFixed(1)} ({operator.reviewsCount})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mt-4">
              {operator.description}
            </p>

            {/* Works in */}
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-gray-700">
              <span>Works in:</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                <span>{operator.countryFlag}</span>
                <span>{operator.countryName}</span>
              </span>
            </div>

            {/* Form Fields Section */}
            <div className="mt-6 space-y-4">
              {/* Enter Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Enter amount
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 font-bold text-sm text-gray-500 pointer-events-none">
                    NGN
                  </div>
                  <input
                    type="number"
                    min={operator.minAmount}
                    max={operator.maxAmount}
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder={`${operator.minAmount} - ${operator.maxAmount}`}
                    className="w-full pl-16 pr-24 py-3 bg-white border border-gray-300 rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all shadow-2xs"
                  />
                  {/* Converted USD price */}
                  <div className="absolute right-4 font-bold text-sm text-gray-900 font-mono">
                    ${usdAmount}
                  </div>
                </div>

                {amount > 10000 && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5">
                    The maximum airtime you can buy is 10,000 NGN.
                  </p>
                )}

                {/* Preset quick chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        amount === q
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {q.toLocaleString()} NGN
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  The phone number to refill
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08062268255"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base font-mono font-bold text-gray-900 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to cart & Purchase as gift */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={amount > 10000 || amount < operator.minAmount}
                className="w-full sm:flex-1 py-3.5 px-6 bg-[#DE1D35] hover:bg-[#c21429] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to cart</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGiftModalOpen(true)}
                disabled={amount > 10000 || amount < operator.minAmount}
                className="w-full sm:w-auto py-3.5 px-6 bg-[#EBEBEB] hover:bg-[#dedede] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] text-gray-800 font-bold text-sm sm:text-base rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Gift className="w-4 h-4 text-gray-700" />
                <span>Purchase as gift</span>
              </button>
            </div>

            {/* ──────────────────────────────────────────────────────────
                CRYPTO PAYMENT ICONS ROW (Image 2)
            ────────────────────────────────────────────────────────── */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Bitcoin */}
                <div
                  className="w-7 h-7 rounded-full bg-[#F7931A] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  title="Bitcoin"
                >
                  ₿
                </div>
                {/* Lightning */}
                <div
                  className="w-7 h-7 rounded-full bg-[#F5A623] text-black flex items-center justify-center font-bold text-xs shadow-xs"
                  title="Lightning"
                >
                  ⚡
                </div>
                {/* Ethereum */}
                <div
                  className="w-7 h-7 rounded-full bg-[#627EEA] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  title="Ethereum"
                >
                  Ξ
                </div>
                {/* USDC */}
                <div
                  className="w-7 h-7 rounded-full bg-[#2775CA] text-white flex items-center justify-center font-bold text-[11px] shadow-xs"
                  title="USDC"
                >
                  $
                </div>
                {/* USDT */}
                <div
                  className="w-7 h-7 rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold text-[11px] shadow-xs"
                  title="USDT"
                >
                  ₮
                </div>
                {/* Solana */}
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-white flex items-center justify-center font-bold text-[10px] shadow-xs"
                  title="Solana"
                >
                  ◎
                </div>
                {/* Base */}
                <div
                  className="w-7 h-7 rounded-full bg-[#0052FF] text-white flex items-center justify-center font-bold text-[11px] shadow-xs"
                  title="Base"
                >
                  🔵
                </div>
                {/* Polygon */}
                <div
                  className="w-7 h-7 rounded-full bg-[#8247E5] text-white flex items-center justify-center font-bold text-[11px] shadow-xs"
                  title="Polygon"
                >
                  💜
                </div>
                {/* Binance Pay / More */}
                <div
                  className="w-7 h-7 rounded-full bg-[#F3BA2F] text-black flex items-center justify-center font-bold text-[11px] shadow-xs"
                  title="Binance Pay"
                >
                  B
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
                3 TRUST VALUE PILLARS (Image 2)
            ────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 py-5 border-t border-b border-gray-200">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <UserCheck className="w-5 h-5 text-[#DE1D35] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                  No Account Required
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center border-x border-gray-200 px-2">
                <Mail className="w-5 h-5 text-[#DE1D35] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                  Instant Delivery
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-[#DE1D35] mb-1.5" />
                <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                  Private and Safe
                </span>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
                ACCORDIONS (Description & How to Redeem) (Image 2)
            ────────────────────────────────────────────────────────── */}
            <div className="mt-6 divide-y divide-gray-200">
              {/* Description Accordion */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-base text-gray-900 cursor-pointer"
                >
                  <span>Description</span>
                  {isDescOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {isDescOpen && (
                  <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-2 animate-in fade-in duration-150">
                    <p>
                      {operator.name} mobile allows you to refill your mobile minutes and data instantly
                      with cryptocurrency.
                    </p>
                    <p>
                      Buy {operator.fullName} with crypto such as Bitcoin, Ethereum, USDT, USDC,
                      Solana, Binance Pay and many more.
                    </p>
                  </div>
                )}
              </div>

              {/* How to Redeem Accordion */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => setIsRedeemOpen(!isRedeemOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-base text-gray-900 cursor-pointer"
                >
                  <span>How to Redeem</span>
                  {isRedeemOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {isRedeemOpen && (
                  <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-2 animate-in fade-in duration-150">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Type in the destination Nigerian mobile phone number.</li>
                      <li>Select the refill amount (NGN) and add to cart.</li>
                      <li>Checkout using your preferred cryptocurrency or Web3 wallet.</li>
                      <li>The airtime or data bundle will be credited immediately to the phone.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      <PurchaseAsGiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        data={{
          networkId: operator.id,
          networkName: `${operator.name} Nigeria`,
          amountNgn: amount,
          amountUsd: Number(usdAmount),
          phoneNumber: phone,
        }}
        onAddToCart={handleAddGiftToCart}
      />
    </div>
  );
}
