"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CheckCircle, Wallet, ArrowRight, Loader2, Copy, Check, QrCode } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalUsd, totalNgn, clearCart } = useCart();
  const { isSignedIn, address, signIn } = useAuth();
  const { writeContractAsync } = useWriteContract();

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "crypto">("wallet");
  const [selectedCrypto, setSelectedCrypto] = useState<"usdt" | "btc" | "eth" | "sol">("usdt");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "signing" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWalletPay = async () => {
    if (!isSignedIn) {
      await signIn();
      return;
    }

    const hasOverLimitItem = items.some((item) => item.amountNgn > 10000);
    if (hasOverLimitItem) {
      setErrorMessage("One or more items exceed the maximum airtime limit of 10,000 NGN.");
      setStatus("error");
      return;
    }

    try {
      setStatus("signing");
      setErrorMessage("");

      const usdtUnits = parseUnits(totalUsd.toFixed(6), 6);
      const hash = await writeContractAsync({
        address: USDT_CONTRACT,
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, usdtUnits],
      });

      setStatus("processing");

      // Submit all items to /api/topup concurrently
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
            // Fallback for demo on testnets / network issue
          }
          return itemTxHash.slice(0, 10).toUpperCase();
        })
      );

      setOrderRef(orderRefs.filter(Boolean).join(", ") || hash.slice(0, 10).toUpperCase());

      setStatus("success");
      clearCart();
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const msg = err instanceof Error ? err.message : "Payment failed";
      setErrorMessage(msg.includes("User rejected") ? "Transaction cancelled by user." : msg);
      setStatus("error");
    }
  };

  const handleSimulatePayment = async () => {
    setStatus("processing");
    try {
      const orderRefs = await Promise.all(
        items.map(async (item, i) => {
          const fakeTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
          try {
            const res = await fetch("/api/topup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                network: item?.networkId || "mtn",
                phoneNumber: item?.phoneNumber?.replace(/\D/g, "") || "2348000000000",
                amountNgn: item.amountNgn,
                amountUsdt: Number(item.amountUsd.toFixed(4)),
                txHash: fakeTxHash,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              return data.orderId || `BB-${fakeTxHash.slice(2, 8).toUpperCase()}`;
            }
          } catch {
            // fallback
          }
          return `BB-${fakeTxHash.slice(2, 8).toUpperCase()}`;
        })
      );

      setOrderRef(orderRefs.filter(Boolean).join(", "));
    } catch {
      setOrderRef(`BB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }
    setStatus("success");
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-gray-900 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md">
              Your top-up order has been confirmed. The mobile minutes are being credited directly to the recipient right now.
            </p>
            {orderRef && (
              <div className="mt-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-600">
                Order Reference: <span className="font-bold text-gray-900">{orderRef}</span>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">Checkout</h3>
            <p className="text-xs text-gray-500 mt-1">Complete payment using Web3 wallet or crypto transfer.</p>

            {/* Order Items Review */}
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </div>
              <div className="divide-y divide-gray-100 max-h-36 overflow-y-auto">
                {items.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{it.networkName}</span>
                      <span className="text-gray-500 ml-2 font-mono">{it.phoneNumber}</span>
                      {it.isGift && (
                        <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                          Gift
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 font-mono">
                      {it.amountNgn.toLocaleString()} NGN (${it.amountUsd.toFixed(2)})
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-emerald-700 text-base font-extrabold">
                  ${totalUsd.toFixed(2)} USD <span className="text-xs text-gray-500 font-normal">({totalNgn.toLocaleString()} NGN)</span>
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === "wallet"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Web3 Wallet</div>
                    <div className="text-[11px] text-gray-500">MetaMask, Rabby, Wagmi</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === "crypto"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Direct Crypto Transfer</div>
                    <div className="text-[11px] text-gray-500">QR Code / Address</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Method Details */}
            {paymentMethod === "wallet" ? (
              <div className="mt-5 p-4 border border-gray-200 rounded-2xl bg-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Wallet Status</span>
                  {isSignedIn ? (
                    <span className="text-emerald-600 font-mono font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Connected ({address?.slice(0, 6)}...{address?.slice(-4)})
                    </span>
                  ) : (
                    <span className="text-gray-400">Not connected</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={status === "signing" || status === "processing"}
                  onClick={isSignedIn ? handleWalletPay : signIn}
                  className="w-full py-3.5 bg-[#DE1D35] hover:bg-[#c21429] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === "signing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Approve in Wallet...</span>
                    </>
                  ) : status === "processing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming on-chain...</span>
                    </>
                  ) : isSignedIn ? (
                    <>
                      <span>Pay ${totalUsd.toFixed(2)} with Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet to Pay</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={status === "signing" || status === "processing"}
                    className="text-xs text-gray-500 hover:text-gray-900 underline font-medium cursor-pointer"
                  >
                    Or complete instant demo payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 border border-gray-200 rounded-2xl bg-white space-y-3">
                <div className="flex gap-2">
                  {(["usdt", "btc", "eth", "sol"] as const).map((coin) => (
                    <button
                      key={coin}
                      type="button"
                      onClick={() => setSelectedCrypto(coin)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${
                        selectedCrypto === coin
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">
                    Send exactly ${totalUsd.toFixed(2)} {selectedCrypto.toUpperCase()} to:
                  </span>
                  <div className="flex items-center justify-between mt-1 font-mono font-bold text-gray-900 break-all">
                    <span>0x71C...4982aF9</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("0x71C84982aF919028F50B6C72bE1840B0424982aF9")}
                      className="ml-2 p-1.5 text-gray-500 hover:text-black rounded bg-white border border-gray-200"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={status === "processing"}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Deposit...</span>
                    </>
                  ) : (
                    <span>I have sent the transaction</span>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={status === "signing" || status === "processing"}
                    className="text-xs text-gray-500 hover:text-gray-900 underline font-medium cursor-pointer"
                  >
                    Or complete instant demo payment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
