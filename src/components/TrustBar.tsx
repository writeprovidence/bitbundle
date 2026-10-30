const marqueeItems = [
  "MTN", "Airtel", "Glo", "9mobile",
  "Crypto", "TRC20", "ERC20",
  "Non-custodial", "Instant delivery", "On-chain verified",
  "10,000+ top-ups", "< 30s delivery", "No KYC",
  "MetaMask", "Trust Wallet", "WalletConnect",
  // duplicate for seamless loop
  "MTN", "Airtel", "Glo", "9mobile",
  "Crypto", "TRC20", "ERC20",
  "Non-custodial", "Instant delivery", "On-chain verified",
  "10,000+ top-ups", "< 30s delivery", "No KYC",
  "MetaMask", "Trust Wallet", "WalletConnect",
];

const networkColors: Record<string, string> = {
  MTN: "#ffcc00",
  Airtel: "#e40000",
  Glo: "#48b834",
  "9mobile": "#006633",
  Crypto: "#26a17b",
};

export default function TrustBar() {
  return (
    <section
      id="trust"
      aria-label="Supported networks and features"
      className="relative overflow-hidden border-y border-white/6 bg-[#0a0e1c] py-5"
    >
      {/* Fade masks on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0a0e1c 0%, transparent 100%)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0a0e1c 0%, transparent 100%)" }} />

      <div className="animate-marquee gap-4">
        {marqueeItems.map((item, i) => {
          const color = networkColors[item];
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap mx-2 border"
              style={
                color
                  ? {
                      backgroundColor: `${color}18`,
                      borderColor: `${color}40`,
                      color: color,
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#94a3b8",
                    }
              }
            >
              {color && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
              )}
              {item}
            </span>
          );
        })}
      </div>
    </section>
  );
}
