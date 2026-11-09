"use client";

import { useState } from "react";
import { Gift, X } from "lucide-react";
import Image from "next/image";

export interface GiftModalData {
  networkId: string;
  networkName: string;
  amountNgn: number;
  amountUsd: number;
  phoneNumber: string;
}

interface PurchaseAsGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GiftModalData;
  onAddToCart: (giftDetails: {
    recipientName: string;
    recipientEmail: string;
    senderName: string;
    message?: string;
  }) => void;
}

export default function PurchaseAsGiftModal({
  isOpen,
  onClose,
  data,
  onAddToCart,
}: PurchaseAsGiftModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError("Please enter the recipient's name");
      return;
    }
    if (!senderName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!recipientEmail.trim() || !recipientEmail.includes("@")) {
      setError("Please enter a valid recipient email");
      return;
    }

    onAddToCart({
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      recipientEmail: recipientEmail.trim(),
      message: message.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-gray-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Purchase as gift
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview line */}
        <div className="flex items-center gap-3.5 py-4 border-t border-b border-gray-100 my-2">
          {data.networkId === "mtn" ? (
            <div className="w-10 h-7 rounded-md bg-[#FFCC00] flex items-center justify-center p-1 border border-black/10 shrink-0">
              <div className="w-full h-full border border-black rounded-full flex items-center justify-center">
                <span className="text-[9px] font-black tracking-tighter text-black">MTN</span>
              </div>
            </div>
          ) : data.networkId === "airtel" ? (
            <div className="w-10 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center p-1 shrink-0">
              <Image
                src="/assets/airtel-brand-logo.png"
                alt="Airtel"
                width={36}
                height={16}
                className="w-auto h-4 object-contain"
              />
            </div>
          ) : data.networkId === "glo" ? (
            <div className="w-10 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center p-0.5 shrink-0">
              <Image
                src="/assets/glo.jpg"
                alt="Glo"
                width={32}
                height={32}
                className="w-6 h-6 object-cover rounded-sm"
              />
            </div>
          ) : (
            <div className="w-10 h-7 rounded-md bg-[#045F40] flex items-center justify-center p-1 shrink-0">
              <span className="text-[10px] font-bold text-white">9mobile</span>
            </div>
          )}

          <div>
            <div className="text-sm font-bold text-gray-900 leading-tight">
              {data.networkName}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">
              {data.amountNgn.toFixed(2)} NGN
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 px-3.5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* 2x2 Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  setError("");
                }}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);
                  setError("");
                }}
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  setError("");
                }}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Message (optional)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enjoy your airtime!"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
              />
            </div>
          </div>

          {/* Continue to gift checkout button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-6 bg-[#00F0A0] hover:bg-[#05e598] active:scale-[0.99] text-[#030A16] font-extrabold text-sm sm:text-base rounded-full shadow-[0_4px_16px_rgba(0,240,160,0.3)] hover:shadow-[0_4px_22px_rgba(0,240,160,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 fill-current" />
              <span>Continue to gift checkout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
