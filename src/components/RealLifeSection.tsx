"use client";

import Image from "next/image";

export default function RealLifeSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#060B18] text-white relative overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[450px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0, 150, 255, 0.25) 0%, rgba(0, 229, 153, 0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left Column: Text */}
          <div className="lg:col-span-6">
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

          {/* Right Column: Composite Network Cards Graphic */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/assets/reallife-cards.png"
                alt="Supported telecom networks: MTN, 9mobile, Glo, Airtel"
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
