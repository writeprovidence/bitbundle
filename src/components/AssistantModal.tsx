"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, User } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AssistantModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your Bitbundle assistant. Need help choosing an operator, top-up amount, or paying with crypto?",
    },
  ]);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    // Smart automated reply
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = "You can top up MTN, Airtel, Glo, and 9mobile instantly.";

      if (lower.includes("mtn")) {
        botResponse = "MTN top-ups start from 5 NGN up to 50,000 NGN. Average delivery time is under 30 seconds!";
      } else if (lower.includes("gift")) {
        botResponse = "Yes! You can click 'Purchase as gift' to send airtime directly to a loved one with a personalized note and email notification.";
      } else if (lower.includes("crypto") || lower.includes("pay") || lower.includes("wallet")) {
        botResponse = "We support Web3 wallets (MetaMask, Rabby, Coinbase Wallet) as well as direct QR deposits with USDT, CELO, cUSD, BTC, and ETH.";
      } else if (lower.includes("airtel") || lower.includes("glo") || lower.includes("9mobile")) {
        botResponse = "All Nigerian networks (MTN, Airtel, Glo, 9mobile) are supported 24/7 with instant automated top-ups.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[520px] overflow-hidden text-gray-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Bitbundle Assistant</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAFA]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === "user" ? "bg-gray-900 text-white" : "bg-emerald-600 text-white"
                }`}
              >
                {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-gray-900 text-white rounded-tr-xs"
                    : "bg-white text-gray-800 border border-gray-200/70 shadow-xs rounded-tl-xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setInput("How does gift purchase work?")}
            className="text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
          >
            How does gift work?
          </button>
          <button
            onClick={() => setInput("What tokens are supported?")}
            className="text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
          >
            Supported tokens
          </button>
          <button
            onClick={() => setInput("MTN top-up delivery speed")}
            className="text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
          >
            Delivery speed
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="p-2 bg-[#DE1D35] hover:bg-[#c21429] text-white rounded-xl transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
