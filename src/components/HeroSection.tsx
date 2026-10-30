"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HeroSection() {
  const { signIn, isSignedIn } = useAuth();

  const handleCta = () => {
    if (isSignedIn) {
      const topup = document.getElementById("products") || document.getElementById("how-it-works");
      topup?.scrollIntoView({ behavior: "smooth" });
    } else {
      signIn();
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[96vh] lg:min-h-[110vh] flex items-center justify-center pt-28 pb-28 lg:pt-36 lg:pb-44 xl:pb-52 overflow-hidden bg-[#010C24]"
      aria-labelledby="hero-heading"
    >
      {/* Background ambient lighting - primary deep blue radial bloom */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] lg:w-[1300px] h-[800px] lg:h-[1050px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(24, 65, 145, 0.5) 0%, rgba(12, 36, 92, 0.3) 50%, transparent 80%)",
          filter: "blur(50px)",
        }}
      />

      {/* Extended downward blue lighting - casts soft, luminous blue through the lower half */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1500px] h-[600px] lg:h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% 75%, rgba(20, 62, 145, 0.45) 0%, rgba(10, 32, 88, 0.28) 45%, rgba(1, 12, 36, 0.1) 75%, transparent 100%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Extreme Left Cards (Sharp, High-Resolution, Flush to Margin) ── */}

      {/* 1. Airtel Card - Upper Extreme Left */}
      <div className="hidden lg:block absolute left-0 lg:-left-2 xl:-left-4 2xl:-left-8 top-44 lg:top-48 xl:top-52 z-10 pointer-events-auto">
        <div className="w-48 lg:w-56 xl:w-64 2xl:w-72 drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300 [transform:translateZ(0)] [backface-visibility:hidden]">
          <Image
            src="/assets/airtel-logo.png"
            alt="Airtel card"
            width={896}
            height={648}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:-webkit-optimize-contrast]"
            priority
          />
        </div>
      </div>

      {/* 2. Glo Card - Lower Extreme Left */}
      <div className="hidden lg:block absolute left-0 lg:-left-1 xl:-left-2 2xl:-left-6 bottom-4 lg:bottom-6 xl:bottom-8 z-20 pointer-events-auto">
        <div className="w-48 lg:w-56 xl:w-64 2xl:w-72 drop-shadow-[0_16px_28px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300 [transform:translateZ(0)] [backface-visibility:hidden]">
          <Image
            src="/assets/glo-card.png"
            alt="Glo card"
            width={1272}
            height={980}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:-webkit-optimize-contrast]"
            priority
          />
        </div>
      </div>

      {/* ── Extreme Right Cards (Sharp, High-Resolution, Flush to Margin) ── */}

      {/* 3. MTN Card - Upper Extreme Right */}
      <div className="hidden lg:block absolute right-0 lg:-right-2 xl:-right-4 2xl:-right-8 top-48 lg:top-52 xl:top-56 z-20 pointer-events-auto">
        <div className="w-52 lg:w-60 xl:w-68 2xl:w-76 drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300 [transform:translateZ(0)] [backface-visibility:hidden]">
          <Image
            src="/assets/mtn-card.png"
            alt="MTN card"
            width={1160}
            height={760}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:-webkit-optimize-contrast]"
            priority
          />
        </div>
      </div>

      {/* 4. 9mobile Card - Lower Extreme Right */}
      <div className="hidden lg:block absolute right-0 sm:right-1 lg:right-2 xl:right-4 2xl:right-6 bottom-2 lg:bottom-4 xl:bottom-6 z-10 pointer-events-auto">
        <div className="w-52 lg:w-60 xl:w-68 2xl:w-76 drop-shadow-[0_16px_28px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300 [transform:translateZ(0)] [backface-visibility:hidden]">
          <Image
            src="/assets/9mobile-card.png"
            alt="9mobile card"
            width={1264}
            height={800}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:-webkit-optimize-contrast]"
            priority
          />
        </div>
      </div>

      {/* ── Central Hero Content ── */}
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="relative flex flex-col items-center justify-center text-center">

          {/* Headline Block */}
          <div className="relative mx-auto mb-6">
            <h1
              id="hero-heading"
              className="font-tosh font-black tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px] leading-[1.14]"
            >
              <span className="block whitespace-nowrap font-black">Buy airtime using Crypto</span>
              <span className="relative inline-flex items-center justify-center mt-1">
                {/* Origami Paper Airplane (Left of Instantly.) */}
                <span className="hidden sm:block absolute -left-16 sm:-left-20 lg:-left-24 top-1/2 -translate-y-1/2 w-14 sm:w-16 lg:w-20 pointer-events-none z-30">
                  <Image
                    src="/assets/paper-plane.png"
                    alt="Origami paper airplane"
                    width={484}
                    height={484}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,229,153,0.35)] [image-rendering:-webkit-optimize-contrast]"
                    priority
                  />
                </span>

                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#38E09D] via-[#5DE6DC] to-[#7ED4FD]">
                  Instantly.
                </span>

                {/* Celebratory Gift Box (Right of Instantly.) */}
                <span className="hidden sm:block absolute -right-16 sm:-right-20 lg:-right-24 top-1/2 -translate-y-1/2 w-14 sm:w-16 lg:w-20 pointer-events-none z-10">
                  <Image
                    src="/assets/gift-box.png"
                    alt="Celebratory gift box"
                    width={384}
                    height={432}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(255,204,0,0.35)] [image-rendering:-webkit-optimize-contrast]"
                    priority
                  />
                </span>
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="font-mori text-base sm:text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Top up MTN, Airtel, Glo or 9mobile with crypto – for yourself
            <br className="hidden sm:inline" /> or someone you love.
          </p>

          {/* Center CTA Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleCta}
              id="hero-cta-btn"
              className="font-mori group inline-flex items-center gap-3 bg-[#00F0A0] text-[#030A16] font-semibold text-base sm:text-lg px-8 py-3.5 rounded-full shadow-[0_0_32px_rgba(0,240,160,0.45)] hover:shadow-[0_0_48px_rgba(0,240,160,0.7)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Get started</span>
              <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </button>
          </div>

          {/* Mobile & Tablet Network Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:hidden mt-10 pt-8 border-t border-white/10 w-full max-w-md mx-auto">
            <div className="flex items-center justify-center p-1">
              <Image
                src="/assets/airtel-logo.png"
                alt="Airtel"
                width={896}
                height={648}
                unoptimized
                className="w-full max-w-[130px] h-auto object-contain drop-shadow-md [image-rendering:-webkit-optimize-contrast]"
              />
            </div>
            <div className="flex items-center justify-center p-1">
              <Image
                src="/assets/glo-card.png"
                alt="Glo"
                width={1272}
                height={980}
                unoptimized
                className="w-full max-w-[130px] h-auto object-contain drop-shadow-md [image-rendering:-webkit-optimize-contrast]"
              />
            </div>
            <div className="flex items-center justify-center p-1">
              <Image
                src="/assets/mtn-card.png"
                alt="MTN"
                width={1160}
                height={760}
                unoptimized
                className="w-full max-w-[130px] h-auto object-contain drop-shadow-md [image-rendering:-webkit-optimize-contrast]"
              />
            </div>
            <div className="flex items-center justify-center p-1">
              <Image
                src="/assets/9mobile-card.png"
                alt="9mobile"
                width={1264}
                height={800}
                unoptimized
                className="w-full max-w-[130px] h-auto object-contain drop-shadow-md [image-rendering:-webkit-optimize-contrast]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
