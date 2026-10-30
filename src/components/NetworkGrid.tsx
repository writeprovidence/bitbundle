"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const features = [
  {
    id: "airtime",
    title: "Airtime top-up",
    description:
      "Instantly top up any Nigerian number with USDT. The exact Naira equivalent is credited within 30 seconds.",
    color: "#ffcc00",
  },
  {
    id: "delivery",
    title: "Fast & reliable delivery",
    description:
      "Our direct telco integration ensures your airtime arrives before you close the tab. Sub-30 second median.",
    color: "#00e676",
  },
  {
    id: "security",
    title: "Secure on-chain payments",
    description:
      "Every transaction is verified on-chain. We never custody your funds — you pay directly from your wallet.",
    color: "#00d4ff",
  },
  {
    id: "networks",
    title: "All major networks",
    description:
      "MTN, Airtel, Glo and 9mobile — every major Nigerian telco in one place. More networks coming soon.",
    color: "#9333ea",
  },
];

const networkCards = [
  { name: "MTN", tagline: "Largest network", bg: "#ffcc00", text: "#1a1a00", initial: "M" },
  { name: "Airtel", tagline: "Fast coverage", bg: "#e40000", text: "#ffffff", initial: "A" },
  { name: "Glo", tagline: "Data grandmaster", bg: "#48b834", text: "#ffffff", initial: "G" },
  { name: "9mobile", tagline: "4G everywhere", bg: "#006633", text: "#ffffff", initial: "9" },
];

export default function NetworkGrid() {
  const [open, setOpen] = useState<string | null>("airtime");

  return (
    <section
      id="networks"
      className="relative py-24 lg:py-32 overflow-hidden"
      aria-labelledby="networks-heading"
    >
      {/* Orbs */}
      <div
        className="orb-purple"
        style={{ width: "500px", height: "500px", top: "10%", right: "-100px" }}
      />
      <div
        className="orb-green"
        style={{ width: "400px", height: "400px", bottom: "5%", left: "-80px" }}
      />

      <div className="container-page relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#9333ea]/30 bg-[#9333ea]/8 text-xs font-bold text-[#9333ea] uppercase tracking-wider">
            Supported networks
          </span>
          <h2
            id="networks-heading"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            One wallet,{" "}
            <span className="gradient-text">endless airtime</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            All major Nigerian telcos. Live rates. Instant delivery. Zero friction.
          </p>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: accordion */}
          <div className="space-y-3">
            {features.map((f) => (
              <div
                key={f.id}
                id={`feature-${f.id}`}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
                style={
                  open === f.id
                    ? { borderColor: `${f.color}30`, boxShadow: `0 0 30px ${f.color}10` }
                    : {}
                }
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="font-semibold text-white">{f.title}</span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{
                      color: open === f.id ? f.color : "#64748b",
                      transform: open === f.id ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {open === f.id && (
                  <div className="px-5 pb-4 animate-slide-down">
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l-2"
                      style={{ borderColor: `${f.color}50` }}>
                      {f.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: brand cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {networkCards.map((n) => (
              <div
                key={n.name}
                id={`network-card-${n.name.toLowerCase()}`}
                className="relative group glass-card rounded-2xl p-6 overflow-hidden card-hover cursor-default"
                style={{ minHeight: "140px" }}
              >
                {/* Colored glow blob */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${n.bg}20 0%, transparent 60%)`,
                  }}
                />

                {/* Network initial badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mb-4 shadow-lg"
                  style={{
                    backgroundColor: n.bg,
                    color: n.text,
                    boxShadow: `0 8px 24px ${n.bg}50`,
                  }}
                >
                  {n.initial}
                </div>

                <h3 className="text-white font-extrabold text-lg leading-none">{n.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{n.tagline}</p>

                {/* Bottom colored bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: n.bg }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
