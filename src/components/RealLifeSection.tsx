"use client";

import Image from "next/image";

export default function RealLifeSection() {
  return (
    <section className="py-36 sm:py-44 lg:py-56 bg-gradient-to-b from-[#020818] via-[#040C22] to-[#01040E] text-white relative overflow-hidden min-h-[620px] lg:min-h-[720px] flex items-center">
      {/* Background ambient lighting with darker deep blue & cyan glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 85% 50%, rgba(0, 150, 255, 0.18) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(0, 229, 153, 0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(10, 30, 80, 0.25) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="container-page relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text */}
          <div className="lg:col-span-6 xl:col-span-5 max-w-xl">
            <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.2] mb-5">
              Made for real life.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E599] via-[#00DFBD] to-[#00C8FF]">
                Not just your wallet.
              </span>
            </h2>
            <p className="text-gray-300/85 text-base sm:text-lg leading-relaxed max-w-md">
              A simple airtime app built for crypto to fiat that keeps you connected.
            </p>
          </div>

          {/* Mobile only graphic: centered */}
          <div className="lg:hidden flex justify-center">
            <div className="relative w-full max-w-md hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/assets/reallife-cards.png"
                alt="Supported telecom networks: MTN, 9mobile, Glo, Airtel"
                width={586}
                height={622}
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Graphic: Placed at the extreme right edge of the page */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
        <div className="w-[460px] xl:w-[540px] 2xl:w-[620px] hover:scale-[1.02] transition-transform duration-300 flex justify-end">
          <Image
            src="/assets/reallife-cards.png"
            alt="Supported telecom networks: MTN, 9mobile, Glo, Airtel"
            width={586}
            height={622}
            className="w-full h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)] select-none"
            priority
          />
        </div>
      </div>
    </section>
  );
}
