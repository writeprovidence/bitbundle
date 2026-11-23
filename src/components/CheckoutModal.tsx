"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Shield,
  Mail,
  Share2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Check as CheckIcon,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount, useWriteContract } from "wagmi";
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
  const router = useRouter();
  const { items, totalUsd, totalNgn, clearCart, removeItem } = useCart();
  const { isSignedIn, address, signIn } = useAuth();
  const { isConnected, address: wagmiAddress } = useAccount();
  const activeAddress = address || wagmiAddress;
  const isWalletConnected = isSignedIn || isConnected;
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

  // Transaction state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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

  // Lock body scroll when modal is open so page stays completely static
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    setPaymentError(null);
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

    try {
      if (isSignedIn) {
        const usdtUnits = parseUnits(totalUsd.toFixed(6), 6);
        const hash = await writeContractAsync({
          address: USDT_CONTRACT,
          abi: ERC20_TRANSFER_ABI,
          functionName: "transfer",
          args: [TREASURY_ADDRESS, usdtUnits],
        });

        // Only show pending once user approves in wallet and tx is broadcast
        setStep("pending");

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
        setStep("pending");
        await new Promise((resolve) => setTimeout(resolve, 3200));
        setOrderRef(`BB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      }

      setStep("completed");
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err || "");
      const isUserRejected =
        message.includes("User rejected") ||
        message.includes("denied transaction signature") ||
        message.includes("User denied");

      if (isUserRejected) {
        // User cancelled in their wallet - polite feedback without dev overlay
        setPaymentError("Transaction cancelled in wallet. You can try again whenever you're ready.");
      } else {
        console.error(err);
        setPaymentError(
          message.length > 120
            ? "Payment could not be completed. Please check your wallet balance and network."
            : message
        );
      }
    } finally {
      setIsPaying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bitbundle.io/order/${invoiceId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClose = () => {
    if (isPaying || step === "pending") return;
    if (step === "completed") {
      setStep("email");
      router.push("/products");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs select-none"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] md:h-[620px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navbar in Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/40 shrink-0">
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
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-10 flex-1 min-h-0 overflow-y-auto flex flex-col justify-center">
          {step === "completed" ? (
            <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 shadow-xs">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2]" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Order completed
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-sm">
                Thank you for your purchase
              </p>
            </div>
          ) : (
            <>
              {step === "payment_method" && (
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B1527] tracking-tight mb-4 sm:mb-6">
                  Payment
                </h2>
              )}

              {step === "pay" && (
                <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold text-sm">
                    ₮
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Pay with USDT on Base
                  </h2>
                </div>
              )}

              <div className="flex flex-col min-h-full">
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleContinueFromEmail();
                        }
                      }}
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
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${isSendAsGift ? "bg-slate-900 justify-end" : "bg-slate-200 justify-start"
                        }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  {/* Continue button */}
                  <div className="space-y-2.5 flex flex-col">
                    <button
                      type="button"
                      onClick={handleContinueFromEmail}
                      disabled={!email.trim() || !email.includes("@")}
                      className="w-full py-3 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-none transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      Continue
                    </button>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-center">
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
                      {primaryItem.networkId === "vodafone" ? (
                        <div className="w-9 h-7 rounded-md relative overflow-hidden shrink-0 shadow-xs border border-gray-100">
                          <Image
                            src="/assets/telecom-card/vodafone.webp"
                            alt="Vodafone"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : primaryItem.networkId === "vodacom" ? (
                        <div className="w-9 h-7 rounded-md relative overflow-hidden shrink-0 shadow-xs border border-gray-100">
                          <Image
                            src="/assets/telecom-card/vodacom-new.png"
                            alt="Vodacom"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-7 rounded-md bg-[#FFCC00] flex items-center justify-center p-0.5 border border-black/10 shrink-0">
                          <span className="text-[8px] font-black tracking-tight text-black">MTN</span>
                        </div>
                      )}
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

                  {/* Continue button */}
                  <button
                    type="button"
                    onClick={handleContinueFromGift}
                    className="w-full py-3 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-none transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* ── STEP 2: PAYMENT & WALLET CONNECTION ── */}
              {step === "payment_method" && (
                <div className="animate-in fade-in duration-150">
                  {/* Wallet Connection / Pay Action */}
                  <div>
                    {!isWalletConnected ? (
                      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-xs">
                        <div className="w-14 h-14 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                          <Wallet className="w-7 h-7 stroke-[1.75]" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            Connect your wallet
                          </h3>

                        </div>

                        <div className="pt-2 flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => signIn()}
                            className="w-full sm:w-auto min-w-[220px] py-3.5 px-8 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold text-sm rounded-none transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            <span>Connect Wallet</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Connected Wallet
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-base">🦊</span>
                              <span className="font-mono text-sm font-bold text-slate-900">
                                {activeAddress
                                  ? `${activeAddress.slice(0, 6)}••••${activeAddress.slice(-4)}`
                                  : "0xb404••••ea49"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                              Base Ready
                            </span>
                            <button
                              type="button"
                              onClick={() => signIn()}
                              className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1"
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        {paymentError && (
                          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900 leading-relaxed text-center animate-in fade-in">
                            {paymentError}
                          </div>
                        )}

                        <div>
                          <button
                            type="button"
                            disabled={isPaying}
                            onClick={handleExecutePayment}
                            className="w-full py-4 bg-[#DE1D35] hover:bg-[#c21429] text-white font-extrabold text-sm sm:text-base rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                          >
                            {isPaying ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Confirming in wallet...</span>
                              </>
                            ) : (
                              <>
                                <span>Pay ${totalUsd.toFixed(2)} USDT</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                          <p className="text-xs text-center text-slate-500 mt-2.5 font-medium">
                            Click to open your wallet and confirm the payment
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 3: PAY WITH ETH ON BASE ── */}
              {step === "pay" && (
                <div className="space-y-6 animate-in fade-in duration-150">
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

                    {paymentError && (
                      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900 leading-relaxed text-center animate-in fade-in">
                        {paymentError}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isPaying}
                        onClick={handleExecutePayment}
                        className="w-full py-4 bg-[#DE1D35] hover:bg-[#c21429] text-white font-extrabold text-sm sm:text-base rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
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
                    We have detected your payment of <strong className="text-slate-900">${totalUsd.toFixed(2)} USDT</strong> and are waiting for it to be confirmed on the network. We will send you an email once confirmed.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
    </div>
  </div>
</div>
);
}
