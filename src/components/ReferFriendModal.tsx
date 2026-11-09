"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ReferFriendCardProps {
  onClose?: () => void;
  className?: string;
}

export function ReferFriendCard({ onClose, className = "" }: ReferFriendCardProps) {
  const { address } = useAuth();
  const [copied, setCopied] = useState(false);

  // Generate referral link based on user address or default code
  const referralCode = address
    ? `${address.slice(0, 6)}${address.slice(-4)}`.toLowerCase()
    : "bitbundle";

  const [referralUrl, setReferralUrl] = useState("https://bitbundle.xyz");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReferralUrl(`${window.location.origin}/?ref=${referralCode}`);
    }
  }, [referralCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    "Top up mobile airtime instantly with crypto on Bitbundle! Get up to 2% discount on your first top-up using my link:"
  );
  const encodedUrl = encodeURIComponent(referralUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return (
    <div
      className={`relative w-full max-w-[420px] bg-white rounded-[32px] p-7 pt-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-center ${className}`}
    >
      {/* Floating Top Badge (Two Interlocking Metallic Chain Links) */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-[86px] h-[86px] rounded-full bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] p-1.5 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#F5F8FC] to-[#E9EFF7] flex items-center justify-center border border-white">
          <svg
            viewBox="0 0 64 64"
            className="w-12 h-12 drop-shadow-[0_3px_5px_rgba(0,0,0,0.18)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Silver/Chrome Metallic Gradient */}
              <linearGradient id="metalGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#D8E2EC" />
                <stop offset="50%" stopColor="#7B8B9B" />
                <stop offset="75%" stopColor="#D5DFEA" />
                <stop offset="100%" stopColor="#556475" />
              </linearGradient>
              <linearGradient id="metalGrad2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#CFD9E4" />
                <stop offset="55%" stopColor="#6C7C8D" />
                <stop offset="85%" stopColor="#C8D4E1" />
                <stop offset="100%" stopColor="#4F5D6D" />
              </linearGradient>
              <filter id="chainShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#1e293b" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Link 1 (Upper-left ring, tilted 45deg) */}
            <g transform="rotate(-45 32 32)">
              <rect
                x="15"
                y="24"
                width="22"
                height="16"
                rx="8"
                stroke="url(#metalGrad1)"
                strokeWidth="4.5"
                fill="none"
                filter="url(#chainShadow)"
              />
              {/* Link 2 (Lower-right ring, interlocking) */}
              <rect
                x="27"
                y="24"
                width="22"
                height="16"
                rx="8"
                stroke="url(#metalGrad2)"
                strokeWidth="4.5"
                fill="none"
                filter="url(#chainShadow)"
              />
              {/* Overlap mask cut to show interlocking depth */}
              <path
                d="M 27 28 A 4 4 0 0 1 31 24 H 36"
                stroke="url(#metalGrad1)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Circular Close Button (optional if onClose provided) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* Heading */}
      <h2 id="refer-modal-title" className="text-xl sm:text-[22px] font-extrabold text-gray-900 tracking-tight">
        Share with Friends
      </h2>

      {/* Subtitle */}
      <p className="mt-2 text-xs sm:text-[13px] text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
        Topping up airtime with crypto is more rewarding when you connect with friends!
      </p>

      {/* Share your link input */}
      <div className="mt-6 text-left">
        <label
          htmlFor="referral-link-input"
          className="block text-xs sm:text-[13px] font-bold text-gray-900 mb-2"
        >
          Share your link
        </label>

        <div className="relative flex items-center bg-[#F4F6FA] border border-gray-200/70 rounded-xl px-3.5 py-2.5 focus-within:border-gray-400 transition-colors">
          <input
            id="referral-link-input"
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 bg-transparent text-xs sm:text-[13px] text-gray-800 font-medium focus:outline-none select-all truncate pr-2"
          />
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy referral link"
            title={copied ? "Copied!" : "Copy link"}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-200/50 cursor-pointer shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            ) : (
              /* Two overlapping rounded rectangle copy icon matching screenshot */
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round"
              >
                <rect x="9" y="9" width="12" height="12" rx="3" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Share to social icons */}
      <div className="mt-6 text-left">
        <span className="block text-xs sm:text-[13px] font-bold text-gray-900 mb-3">
          Share to
        </span>

        <div className="grid grid-cols-5 gap-2 text-center">
          {/* 1. Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5 group-hover:text-gray-800 transition-colors">
              Facebook
            </span>
          </a>

          {/* 2. X */}
          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5 group-hover:text-gray-800 transition-colors">
              X
            </span>
          </a>

          {/* 3. Whatsapp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-10.416c-5.523 0-10 4.477-10 10 0 1.765.459 3.487 1.332 5.006l-1.417 5.176 5.309-1.392c1.458.796 3.109 1.21 4.776 1.21 5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5 group-hover:text-gray-800 transition-colors">
              Whatsapp
            </span>
          </a>

          {/* 4. Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#24A1DE] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5 group-hover:text-gray-800 transition-colors">
              Telegram
            </span>
          </a>

          {/* 5. Linkedin */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.1H5.06v8.4h2.8z" />
              </svg>
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1.5 group-hover:text-gray-800 transition-colors">
              Linkedin
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

interface ReferFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferFriendModal({ isOpen, onClose }: ReferFriendModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="refer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] animate-in zoom-in-95 duration-200">
        <ReferFriendCard onClose={onClose} />
      </div>
    </div>
  );
}
