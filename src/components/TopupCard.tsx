"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";

const networks = [
  { id: "mtn", label: "MTN", color: "#ffcc00", textColor: "#1a1a00" },
  { id: "airtel", label: "Airtel", color: "#e40000", textColor: "#fff" },
  { id: "glo", label: "Glo", color: "#48b834", textColor: "#fff" },
  { id: "9mobile", label: "9mobile", color: "#006633", textColor: "#fff" },
];

const amounts = [100, 200, 500, 1000, 2000, 5000];

// Approximate USDT/NGN rate (real-time in prod)
const USDT_PER_NGN = 0.00065;

// USDT contract on Ethereum mainnet (ERC-20)
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const;
// Bitbundle treasury address (replace with real one)
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

type TxStatus = "idle" | "signing" | "confirming" | "submitting" | "success" | "error";

export default function TopupCard() {
  const { isSignedIn, isLoading: authLoading, signIn } = useAuth();
  const { writeContractAsync } = useWriteContract();

  const [network, setNetwork] = useState(networks[0]);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { isLoading: isTxLoading } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  const selectedAmount = amount ?? (customAmount ? Number(customAmount) : 0);
  const usdtAmount = (selectedAmount * USDT_PER_NGN).toFixed(4);

  const isPhoneValid = phone.length >= 10 && phone.length <= 11;
  const canPay = isSignedIn && isPhoneValid && selectedAmount > 0;

  async function handleSignIn() {
    try { await signIn(); } catch (err) { console.error(err); }
  }

  async function handlePay() {
    if (!canPay) return;
    setErrorMsg(null);

    try {
      setTxStatus("signing");
      const usdtInUnits = parseUnits(usdtAmount, 6);

      const hash = await writeContractAsync({
        address: USDT_CONTRACT,
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, usdtInUnits],
      });

      setTxHash(hash);
      setTxStatus("confirming");
      setTxStatus("submitting");

      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: network.id,
          phoneNumber: `+234${phone}`,
          amountNgn: selectedAmount,
          amountUsdt: Number(usdtAmount),
          txHash: hash,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error ?? "Order failed");
      }

      const data = (await res.json()) as { orderId: string };
      setOrderId(data.orderId);
      setTxStatus("success");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(message.includes("User rejected") ? "Transaction cancelled." : message);
      setTxStatus("error");
    }
  }

  function reset() {
    setTxStatus("idle");
    setTxHash(null);
    setErrorMsg(null);
    setOrderId(null);
    setPhone("");
    setAmount(null);
    setCustomAmount("");
  }

  // ─── Success state ─────────────────────────────────────────────────────────
  if (txStatus === "success") {
    return (
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm mx-auto flex flex-col items-center gap-4 text-center border-[#00e676]/25"
        style={{ boxShadow: "0 0 40px rgba(0,230,118,0.1)" }}>
        <CheckCircle className="w-14 h-14" style={{ color: "#00e676" }} />
        <h2 className="text-lg font-bold text-white">Airtime on its way!</h2>
        <p className="text-sm text-gray-400">
          ₦{selectedAmount.toLocaleString()} of {network.label} airtime is being delivered to{" "}
          <span className="font-semibold text-white">+234{phone}</span>.
        </p>
        {orderId && (
          <p className="text-xs text-gray-600">
            Order ref: <span className="font-mono text-gray-400">{orderId.slice(0, 8)}...</span>
          </p>
        )}
        <button
          id="topup-reset-btn"
          onClick={reset}
          className="gradient-btn w-full py-3 rounded-xl text-sm"
        >
          Buy more airtime
        </button>
      </div>
    );
  }

  // ─── Main card ─────────────────────────────────────────────────────────────
  return (
    <div
      className="glass-card rounded-2xl p-6 w-full max-w-sm mx-auto"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white">Buy airtime</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse-dot" />
          <span className="text-xs font-medium text-[#00e676]">Live rates</span>
        </div>
      </div>

      {/* Network selector */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Network
        </label>
        <div className="relative">
          <button
            id="network-selector-btn"
            type="button"
            onClick={() => setShowNetworkPicker((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: network.color, color: network.textColor }}
              >
                {network.label.slice(0, 1)}
              </span>
              <span className="font-semibold text-sm text-white">{network.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${showNetworkPicker ? "rotate-180" : ""}`}
            />
          </button>

          {showNetworkPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/10 bg-[#0d1225] shadow-2xl z-10 overflow-hidden animate-slide-down">
              {networks.map((n) => (
                <button
                  key={n.id}
                  id={`network-option-${n.id}`}
                  type="button"
                  onClick={() => { setNetwork(n); setShowNetworkPicker(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: n.color, color: n.textColor }}
                  >
                    {n.label.slice(0, 1)}
                  </span>
                  <span className="font-medium text-sm text-gray-200">{n.label}</span>
                  {n.id === network.id && <Check className="w-4 h-4 ml-auto" style={{ color: "#00e676" }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phone input */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Phone number
        </label>
        <div className="flex items-center rounded-xl border border-white/10 hover:border-white/20 focus-within:border-[#00d4ff]/50 transition-colors bg-white/5 overflow-hidden">
          <span className="pl-4 pr-2 text-sm font-semibold text-gray-500 shrink-0">+234</span>
          <input
            id="phone-input"
            type="tel"
            inputMode="numeric"
            placeholder="8012345678"
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="flex-1 py-3 pr-4 text-sm text-white outline-none bg-transparent placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Amount grid */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Amount (NGN)
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {amounts.map((a) => (
            <button
              key={a}
              id={`amount-btn-${a}`}
              type="button"
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors border ${
                amount === a
                  ? "border-[#00d4ff]/50 bg-[#00d4ff]/12 text-[#00d4ff]"
                  : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              ₦{a.toLocaleString()}
            </button>
          ))}
        </div>
        <input
          id="custom-amount-input"
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 focus:border-[#00d4ff]/50 outline-none text-sm text-white placeholder:text-gray-600 transition-colors bg-white/5"
        />
      </div>

      {/* USDT preview */}
      {selectedAmount > 0 && (
        <div className="mb-5 px-4 py-3 bg-white/5 border border-white/8 rounded-xl flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">You pay</span>
          <span className="text-base font-bold text-white">
            {usdtAmount}{" "}
            <span style={{ color: "#26a17b" }}>USDT</span>
          </span>
        </div>
      )}

      {/* Error */}
      {txStatus === "error" && errorMsg && (
        <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl">
          <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* CTA */}
      {authLoading ? (
        <div className="w-full h-12 bg-white/8 rounded-xl animate-pulse" />
      ) : !isSignedIn ? (
        <button
          id="topup-cta-btn"
          type="button"
          onClick={handleSignIn}
          className="gradient-btn w-full py-3.5 rounded-xl text-sm shadow-[0_0_30px_rgba(0,200,83,0.25)]"
        >
          Sign up to continue →
        </button>
      ) : (
        <button
          id="topup-pay-btn"
          type="button"
          onClick={handlePay}
          disabled={!canPay || txStatus === "signing" || txStatus === "confirming" || txStatus === "submitting" || isTxLoading}
          className="gradient-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          {txStatus === "signing" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Confirm in wallet…</>
          ) : txStatus === "confirming" || isTxLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Confirming tx…</>
          ) : txStatus === "submitting" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing order…</>
          ) : (
            <>Pay {selectedAmount > 0 ? `${usdtAmount} USDT` : ""} →</>
          )}
        </button>
      )}

      {!isSignedIn && (
        <p className="text-center text-xs text-gray-600 mt-3">
          No account?{" "}
          <button type="button" onClick={handleSignIn} className="hover:underline font-medium"
            style={{ color: "#00d4ff" }}>
            Create one free
          </button>
        </p>
      )}
    </div>
  );
}
