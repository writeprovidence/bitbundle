import { ArrowRight, Rocket } from "lucide-react";

export default function CtaBanner() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative py-24 lg:py-36 overflow-hidden"
    >
      {/* Vivid gradient blobs */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,230,118,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse 70% 60% at 80% 40%, rgba(147,51,234,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse 60% 50% at 50% 10%, rgba(0,212,255,0.12) 0%, transparent 60%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-page relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/15 bg-white/5">
          <Rocket className="w-3.5 h-3.5 text-[#00e676]" />
          <span className="text-xs font-semibold text-gray-300">
            Free to sign up · No KYC required
          </span>
        </div>

        {/* Big gradient headline */}
        <h2
          id="cta-heading"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
        >
          <span className="gradient-text-cta">Sign up for free</span>
          <br />
          <span className="text-white">to start buying airtime</span>
          <br />
          <span className="text-white">today!</span>{" "}
          <span className="inline-block animate-float" style={{ animationDelay: "0.5s" }}>🚀</span>
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of people using crypto to stay connected.
          Connect your wallet and get airtime in under 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="cta-getstarted-btn"
            className="gradient-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base shadow-[0_0_40px_rgba(0,200,83,0.35)]"
          >
            Get started — it&apos;s free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            id="cta-learnmore-btn"
            className="glass-card inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-gray-300 hover:text-white transition-colors glass-card-hover"
          >
            Learn more
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Supports MetaMask · Trust Wallet · Coinbase Wallet · Rainbow · and more
        </p>

        {/* Floating network chips below the text */}
        <div className="flex flex-wrap gap-3 justify-center mt-10 opacity-60">
          {[
            { name: "MTN", color: "#ffcc00", text: "#1a1a00" },
            { name: "Airtel", color: "#e40000", text: "#fff" },
            { name: "Glo", color: "#48b834", text: "#fff" },
            { name: "9mobile", color: "#006633", text: "#fff" },
            { name: "Crypto", color: "#26a17b", text: "#fff" },
          ].map((n) => (
            <span
              key={n.name}
              className="px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                backgroundColor: n.color,
                color: n.text,
                boxShadow: `0 4px 16px ${n.color}40`,
              }}
            >
              {n.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
