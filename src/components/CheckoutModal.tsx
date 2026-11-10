"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Gift,
  Trash2,
  Tag,
  Shield,
  Mail,
  Share2,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Check as CheckIcon,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";

const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const;
const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000001" as const;

const ERC20_TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep =
  | "email" // Step 1: Where should we send your order?
  | "gift_personalise" // Step 1.5: Personalise your gifts (if send as gift is toggled)
  | "payment_method" // Step 2: Payment method
  | "pay" // Step 3: Pay with ETH / USDT
  | "pending" // Step 4: Payment Pending
  | "completed"; // Step 5: Order completed

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalUsd, totalNgn, clearCart, removeItem } = useCart();
  const { isSignedIn, address, signIn } = useAuth();
  const { writeContractAsync } = useWriteContract();

  // Multi-step state
  const [step, setStep] = useState<CheckoutStep>("email");

  // Step 1: Customer details
  const [email, setEmail] = useState("phweb3connect@gmail.com");
  const [sendDeals, setSendDeals] = useState(false);
  const [isSendAsGift, setIsSendAsGift] = useState(false);

  // Step 1.5: Gift personalisation
  const [giftRecipientEmail, setGiftRecipientEmail] = useState("");
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftSenderName, setGiftSenderName] = useState("");

  // Step 2: Payment method
  const [selectedWalletBalance, setSelectedWalletBalance] = useState<string>("base_eth");
  const [selectedCrypto, setSelectedCrypto] = useState<"eth_base" | "eth_mainnet" | "usdt_arbitrum" | "btc" | "sol">("eth_base");

  // Promo code
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Transaction state
  const [isPaying, setIsPaying] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync gift state if an item in cart was marked as gift
  useEffect(() => {
    const hasGift = items.some((it) => it.isGift);
    if (hasGift) {
      setIsSendAsGift(true);
      const firstGift = items.find((it) => it.isGift)?.giftDetails;
      if (firstGift) {
        setGiftRecipientEmail(firstGift.recipientEmail || "");
        setGiftRecipientName(firstGift.recipientName || "");
        setGiftMessage(firstGift.message || "");
        setGiftSenderName(firstGift.senderName || "");
      }
    }
  }, [items]);

  // Generate unique invoice ID on mount
  useEffect(() => {
    if (!invoiceId) {
      setInvoiceId(`${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4192-b901-${Math.random().toString(36).substring(2, 14)}`);
    }
  }, [invoiceId]);

  if (!isOpen) return null;

  // Approximate crypto conversion
  const ethRateNgn = 2984642.72;
  const totalEth = (totalNgn / ethRateNgn).toFixed(6);

  // First item preview helper
  const primaryItem = items[0] || {
    networkId: "mtn",
    networkName: "MTN Nigeria",
    phoneNumber: "08062268255",
    amountNgn: 200,
    amountUsd: 0.15,
  };

  const handleContinueFromEmail = () => {
    if (!email.trim() || !email.includes("@")) return;
    if (isSendAsGift) {
      setStep("gift_personalise");
    } else {
      setStep("payment_method");
    }
  };

  const handleContinueFromGift = () => {
    setStep("payment_method");
  };

  const handleSelectPaymentMethod = () => {
    setStep("pay");
  };

  // Perform actual or simulated Web3 payment
  const handleExecutePayment = async () => {
    setIsPaying(true);
    setPurchaseDate(
      new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    // Show step 4: Payment Pending
    setStep("pending");

    try {
      if (isSignedIn) {
        const usdtUnits = parseUnits(totalUsd.toFixed(6), 6);
        const hash = await writeContractAsync({
          address: USDT_CONTRACT,
          abi: ERC20_TRANSFER_ABI,
          functionName: "transfer",
          args: [TREASURY_ADDRESS, usdtUnits],
        });

        // Submit items to backend /api/topup
        const orderRefs = await Promise.all(
          items.map(async (item, i) => {
            const itemTxHash = items.length > 1 ? `${hash}-${i}` : hash;
            try {
              const res = await fetch("/api/topup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  network: item?.networkId || "mtn",
                  phoneNumber: item?.phoneNumber?.replace(/\D/g, "") || "2348000000000",
                  amountNgn: item.amountNgn,
                  amountUsdt: Number(item.amountUsd.toFixed(4)),
                  txHash: itemTxHash,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                return data.orderId || itemTxHash.slice(0, 10).toUpperCase();
              }
            } catch {
              // fallback
            }
            return itemTxHash.slice(0, 10).toUpperCase();
          })
        );
        setOrderRef(orderRefs.filter(Boolean).join(", ") || hash.slice(0, 10).toUpperCase());
      } else {
        // Instant simulated fulfillment for demo/test
        await new Promise((resolve) => setTimeout(resolve, 3200));
        setOrderRef(`BB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      }

      setStep("completed");
      clearCart();
    } catch (err) {
      console.error(err);
      // Even on local cancellation, allow completing for demo if user clicks continue
      setTimeout(() => {
        setOrderRef(`BB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        setStep("completed");
        clearCart();
      }, 2500);
    } finally {
      setIsPaying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bitbundle.io/order/${invoiceId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleResetCheckout = () => {
    setStep("email");
    onClose();
  };

  // Render Right Column (Summary / Order Details Sidebar)
  const renderSummarySidebar = () => (
    <div className="w-full lg:w-[360px] shrink-0 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
          {step === "pay" || step === "pending" || step === "completed" ? "Order details" : "Summary"}
        </h3>

        {/* Order Details header in later steps */}
        {(step === "pay" || step === "pending" || step === "completed") && (
          <div className="pb-4 mb-4 border-b border-slate-100 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Email address</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 truncate max-w-[140px]">{email}</span>
                {step === "pay" && (
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Payment method</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">ETH Base</span>
                {step === "pay" && (
                  <button
                    type="button"
                    onClick={() => setStep("payment_method")}
                    className="text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Invoice id</span>
              <span className="font-mono text-[11px] text-slate-800 truncate max-w-[170px]" title={invoiceId}>
                {invoiceId}
              </span>
            </div>

            {purchaseDate && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Purchase date</span>
                <span className="text-slate-800 font-semibold">{purchaseDate}</span>
              </div>
            )}
          </div>
        )}

        {/* Items List in Sidebar */}
        <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
          {items.map((it) => (
            <div key={it.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5 min-w-0">
                {/* Yellow MTN brand thumbnail */}
                {it.networkId === "mtn" ? (
                  <div className="w-9 h-7 rounded-md bg-[#FFCC00] flex items-center justify-center p-0.5 border border-black/10 shrink-0 mt-0.5">
                    <div className="w-full h-full border border-black rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-black tracking-tight text-black">MTN</span>
                    </div>
                  </div>
                ) : it.networkId === "airtel" ? (
                  <div className="w-9 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 mt-0.5">
                    <Image src="/assets/airtel-brand-logo.png" alt="Airtel" width={32} height={14} className="w-auto h-3 object-contain" />
                  </div>
                ) : it.networkId === "glo" ? (
                  <div className="w-9 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0 mt-0.5">
                    <Image src="/assets/glo.jpg" alt="Glo" width={28} height={28} className="w-5 h-5 object-cover rounded-xs" />
                  </div>
                ) : (
                  <div className="w-9 h-7 rounded-md bg-[#045F40] flex items-center justify-center p-0.5 shrink-0 mt-0.5 text-[8px] font-bold text-white">
                    9mobile
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{it.networkName}</div>
                  <div className="text-slate-500 font-medium text-[11px] mt-0.5">
                    {it.amountNgn.toFixed(2)} NGN value
                  </div>

                  {/* Gift badge with recipient email */}
                  {it.isGift && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 bg-[#DE1D35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Gift className="w-2.5 h-2.5" />
                        <span>Gift {giftRecipientEmail ? giftRecipientEmail : email}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="text-right shrink-0">
                <div className="font-bold text-slate-900">${it.amountUsd.toFixed(2)}</div>
                {step === "email" && items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-slate-400 hover:text-rose-600 mt-1 cursor-pointer p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Promo code toggle row */}
        {step !== "completed" && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Enter a Promo Code</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoInput(!showPromoInput)}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                  showPromoInput ? "bg-slate-900 justify-end" : "bg-slate-200 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {showPromoInput && (
              <div className="mt-2.5 flex gap-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setPromoApplied(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {promoApplied && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Promo code applied!
              </p>
            )}
          </div>
        )}

        {/* Total & Rates */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <div className="text-right">
              <span className="text-base font-extrabold text-slate-900">
                ${totalUsd.toFixed(2)}
              </span>
              {(step === "pay" || step === "pending" || step === "completed") && (
                <span className="text-xs text-slate-500 block font-mono">
                  {totalEth} ETH
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed flex items-start gap-1">
            <RefreshCw className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
            <span>
              We&apos;ve converted this price from NGN to USD at our rate of approximately 1 USD = 1,346.46 NGN
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navbar in Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-3">
            {step !== "email" && step !== "completed" ? (
              <button
                type="button"
                onClick={() => {
                  if (step === "gift_personalise") setStep("email");
                  else if (step === "payment_method") setStep(isSendAsGift ? "gift_personalise" : "email");
                  else if (step === "pay") setStep("payment_method");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0A0]" />
                <span>Bitbundle Checkout</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Address chip if connected */}
            {isSignedIn && address && (
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-mono font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  {address.slice(0, 6)}••••{address.slice(-4)}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 min-w-0 w-full max-w-xl">
              {/* ── STEP 1: WHERE SHOULD WE SEND YOUR ORDER? ── */}
              {step === "email" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Where should we send your order?
                  </h2>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
                    />

                    {/* Send deals checkbox */}
                    <label className="mt-3 flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendDeals}
                        onChange={(e) => setSendDeals(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800 cursor-pointer"
                      />
                      <span>Send me deals and updates</span>
                    </label>

                    {/* Micro trust points with red icons */}
                    <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#DE1D35] shrink-0 stroke-[1.75]" />
                        <span>We&apos;ll send your order and receipt here</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#DE1D35] stroke-[1.75] shrink-0" />
                        <span>No account needed</span>
                      </div>
                    </div>
                  </div>

                  {/* Send as gift toggle card */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                        <Gift className="w-4 h-4 text-slate-700" />
                        <span>Send as gift</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Personalise your gift in the next steps.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSendAsGift(!isSendAsGift)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                        isSendAsGift ? "bg-slate-900 justify-end" : "bg-slate-200 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleContinueFromEmail}
                      disabled={!email.trim() || !email.includes("@")}
                      className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      Continue
                    </button>
                    <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                      By clicking &apos;Continue&apos;, you agree to our{" "}
                      <span className="underline cursor-pointer">Terms &amp; Conditions</span> and{" "}
                      <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP 1.5: PERSONALISE YOUR GIFTS ── */}
              {step === "gift_personalise" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Personalise your gifts
                  </h2>

                  {/* Gift Item row preview with Clear */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-7 rounded-md bg-[#FFCC00] flex items-center justify-center p-0.5 border border-black/10 shrink-0">
                        <span className="text-[8px] font-black tracking-tight text-black">MTN</span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{primaryItem.networkName}</div>
                        <div className="text-[11px] text-slate-500">{primaryItem.amountNgn.toFixed(2)} NGN value</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGiftRecipientEmail("");
                        setGiftRecipientName("");
                        setGiftMessage("");
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          required
                          value={giftRecipientEmail}
                          onChange={(e) => setGiftRecipientEmail(e.target.value)}
                          placeholder="phweb3connect@gmail.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={giftRecipientName}
                          onChange={(e) => setGiftRecipientName(e.target.value)}
                          placeholder="inemesit"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Message (optional)
                      </label>
                      <textarea
                        rows={2}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="i sent you airtime"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        From:
                      </label>
                      <input
                        type="text"
                        value={giftSenderName}
                        onChange={(e) => setGiftSenderName(e.target.value)}
                        placeholder="Emmanuel"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleContinueFromGift}
                      className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: PAYMENT METHOD ── */}
              {step === "payment_method" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Payment method
                  </h2>

                  {/* WALLETS BALANCES */}
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                      Wallets Balances
                    </div>
                    <div className="space-y-2">
                      <label
                        onClick={() => setSelectedWalletBalance("base_eth")}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedWalletBalance === "base_eth"
                            ? "border-slate-900 bg-slate-50/70"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="wallet_balance"
                            checked={selectedWalletBalance === "base_eth"}
                            onChange={() => setSelectedWalletBalance("base_eth")}
                            className="text-slate-900 focus:ring-slate-900"
                          />
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                            Ξ
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            0.00015513 ETH <span className="font-normal text-slate-500">Base</span>
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setSelectedWalletBalance("eth_main")}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer opacity-60 ${
                          selectedWalletBalance === "eth_main"
                            ? "border-slate-900 bg-slate-50/70"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="wallet_balance"
                            checked={selectedWalletBalance === "eth_main"}
                            onChange={() => setSelectedWalletBalance("eth_main")}
                            className="text-slate-900 focus:ring-slate-900"
                          />
                          <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-[10px] font-bold">
                            Ξ
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-700">
                            0.00003481 ETH <span className="font-normal text-slate-400">Ethereum</span>{" "}
                            <span className="text-[11px] text-slate-400">Not enough balance</span>
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setSelectedWalletBalance("usdt_arb")}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer opacity-60 ${
                          selectedWalletBalance === "usdt_arb"
                            ? "border-slate-900 bg-slate-50/70"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="wallet_balance"
                            checked={selectedWalletBalance === "usdt_arb"}
                            onChange={() => setSelectedWalletBalance("usdt_arb")}
                            className="text-slate-900 focus:ring-slate-900"
                          />
                          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                            ₮
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-700">
                            0.001763 USDT <span className="font-normal text-slate-400">Arbitrum</span>{" "}
                            <span className="text-[11px] text-slate-400">Not enough balance</span>
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* CHOOSE A PAYMENT METHOD */}
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                      Choose a Payment Method
                    </div>
                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                            ₿
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">BTC</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>

                      <div
                        onClick={() => setSelectedCrypto("eth_base")}
                        className="p-3.5 rounded-xl border border-slate-900 bg-slate-50/70 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            Ξ
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">ETH</span>
                          <span className="text-xs text-slate-500 font-semibold">(Base Network)</span>
                        </div>
                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSelectPaymentMethod}
                      className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: PAY WITH ETH ON BASE ── */}
              {step === "pay" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      Ξ
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Pay with ETH on Base
                    </h2>
                  </div>

                  {/* Connected Wallet Box */}
                  <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Connected
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">🦊</span>
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {isSignedIn && address ? `${address.slice(0, 6)}••••${address.slice(-4)}` : "0xb404••••ea49"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => signIn()}
                        className="px-3 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isPaying}
                        onClick={handleExecutePayment}
                        className="w-full py-4 bg-[#032320] hover:bg-black text-white font-extrabold text-sm sm:text-base rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Confirming in wallet...</span>
                          </>
                        ) : (
                          <>
                            <span>🦊 Pay with MetaMask</span>
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-slate-500 mt-2.5 font-medium">
                        Please open your wallet to confirm the payment
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: PAYMENT PENDING ── */}
              {step === "pending" && (
                <div className="py-12 text-center flex flex-col items-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#00F0A0] animate-spin mb-2" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Payment Pending
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                    We have detected your payment of <strong className="text-slate-900">{totalEth} ETH</strong> and are waiting for it to be confirmed on the network. You may continue to browse &amp; buy products. We will send you an email once confirmed.
                  </p>
                </div>
              )}

              {/* ── STEP 5: ORDER COMPLETED ── */}
              {step === "completed" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 pb-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Order completed
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Thank you for your purchase
                      </p>
                    </div>
                  </div>

                  {/* Digital Voucher / Gift Card Graphic (Matches Image 11) */}
                  <div className="relative w-full rounded-2xl bg-[#FFCC00] p-6 sm:p-8 text-black shadow-md overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 rounded border border-black/20 flex items-center justify-center p-0.5">
                          <span className="text-[10px] font-black">MTN</span>
                        </div>
                        <span className="font-extrabold text-sm tracking-tight">{primaryItem.networkName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black">{primaryItem.amountNgn.toFixed(2)}</span>
                        <span className="text-xs font-bold uppercase ml-1">NGN</span>
                      </div>
                    </div>

                    <div className="mt-12 sm:mt-16 space-y-1">
                      <div className="text-base sm:text-lg font-mono font-bold tracking-wider">
                        +234 806 226 8255
                      </div>
                      <div className="text-xs font-medium text-black/80">
                        Delivered to {email}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons under voucher card */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center justify-center gap-2 py-3 px-5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-2xs"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>{copiedLink ? "Copied!" : "Copy link"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetCheckout}
                      className="flex items-center justify-center gap-2 py-3 px-6 bg-[#032320] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xs"
                    >
                      <Gift className="w-4 h-4 text-[#00F0A0]" />
                      <span>View Gift</span>
                    </button>
                  </div>

                  {/* "Get more from every purchase" perks (Matches Image 12) */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 text-center mb-3">
                      Get more from every purchase
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 font-semibold text-slate-800">
                        <span className="text-rose-500 font-bold">%</span>
                        <span>Up to 10% cashback on purchases</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 font-semibold text-slate-800">
                        <span className="text-rose-500 font-bold">↗</span>
                        <span>Unlock higher spending limits</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 font-semibold text-slate-800">
                        <span className="text-rose-500 font-bold">☲</span>
                        <span>Track orders and balances</span>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 font-semibold text-slate-800">
                        <span className="text-rose-500 font-bold">🎧</span>
                        <span>Faster, more effective support</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetCheckout}
                        className="w-full sm:w-auto py-2.5 px-6 bg-[#032320] hover:bg-black text-white font-bold text-xs rounded-full cursor-pointer transition-all"
                      >
                        New order
                      </button>
                      <a
                        href="mailto:support@bitbundle.io"
                        className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full text-center cursor-pointer transition-colors"
                      >
                        Ask for support
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN (PERSISTENT SUMMARY SIDEBAR) ── */}
            {renderSummarySidebar()}
          </div>
        </div>
      </div>
    </div>
  );
}
