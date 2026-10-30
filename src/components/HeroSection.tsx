"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HeroSection() {
  const { signIn, isSignedIn } = useAuth();

  const handleCta = () => {
    if (isSignedIn) {
      const topup = document.getElementById("how-it-works");
      topup?.scrollIntoView({ behavior: "smooth" });
    } else {
      signIn();
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#060B18]"
      aria-labelledby="hero-heading"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(0, 229, 153, 0.25) 0%, rgba(0, 200, 255, 0.15) 35%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-0 right-10 w-[500px] h-[400px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0, 100, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Subtle background tech grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-page relative z-10 w-full">
        {/* Main hero card stage */}
        <div className="relative max-w-4xl mx-auto text-center py-12 px-4 sm:px-6">

          {/* ── Floating Network Cards (Surrounding) ── */}

          {/* 1. Airtel - Top Left */}
          <div className="hidden lg:block absolute -top-4 -left-12 xl:-left-20 animate-float z-20">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] -rotate-6 hover:rotate-0 transition-transform duration-300 w-44 sm:w-48 border border-white/20">
              <Image
                src="/assets/airtel-logo.png"
                alt="Airtel"
                width={160}
                height={60}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* 2. Glo - Bottom Left */}
          <div className="hidden lg:block absolute bottom-2 -left-16 xl:-left-24 animate-float-delayed z-20">
            <div className="-rotate-12 hover:rotate-0 transition-transform duration-300 w-48 sm:w-56 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
              <Image
                src="/assets/glo-card.png"
                alt="Glo"
                width={220}
                height={140}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* 3. MTN - Top Right */}
          <div className="hidden lg:block absolute -top-2 -right-12 xl:-right-20 animate-float-slow z-20">
            <div className="rotate-6 hover:rotate-0 transition-transform duration-300 w-48 sm:w-56 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
              <Image
                src="/assets/mtn-card.png"
                alt="MTN"
                width={220}
                height={140}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* 4. 9mobile - Bottom Right */}
          <div className="hidden lg:block absolute bottom-4 -right-16 xl:-right-24 animate-float z-20">
            <div className="-rotate-6 hover:rotate-0 transition-transform duration-300 w-48 sm:w-56 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
              <Image
                src="/assets/9mobile-card.png"
                alt="9mobile"
                width={220}
                height={140}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* ── Headline with Floating Airplane & Gift ── */}
          <div className="relative inline-block mx-auto mb-6">
            {/* Origami Paper Airplane (Left) */}
            <div className="absolute -top-10 -left-10 sm:-top-14 sm:-left-16 w-12 sm:w-16 h-auto animate-float pointer-events-none">
              <Image
                src="/assets/paper-plane.png"
                alt="Origami paper airplane"
                width={70}
                height={70}
                className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(0,229,153,0.4)]"
              />
            </div>

            {/* Celebratory Gift Box (Right) */}
            <div className="absolute -top-10 -right-10 sm:-top-14 sm:-right-16 w-12 sm:w-16 h-auto animate-float-delayed pointer-events-none">
              <Image
                src="/assets/gift-box.png"
                alt="Celebratory gift box"
                width={70}
                height={70}
                className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,204,0,0.4)]"
              />
            </div>

            <h1
              id="hero-heading"
              className="font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl text-white leading-[1.15]"
            >
              Buy airtime using Crypto
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E599] via-[#00DFBD] to-[#00C8FF]">
                Instantly.
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300/90 max-w-xl mx-auto leading-relaxed mb-9">
            Top up MTN, Airtel, Glo or 9mobile with crypto — for yourself
            <br className="hidden sm:inline" /> or someone you love.
          </p>

          {/* Center CTA Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={handleCta}
              id="hero-cta-btn"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#00E599] via-[#00DFBD] to-[#00C8FF] text-[#060B18] font-bold text-base sm:text-lg px-8 py-3.5 rounded-full shadow-[0_0_35px_rgba(0,229,153,0.45)] hover:shadow-[0_0_50px_rgba(0,229,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Get started</span>
              <span className="w-7 h-7 rounded-full bg-[#060B18] text-[#00E599] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
              </span>
            </button>
          </div>

          {/* Mobile Network Cards Grid (Visible on smaller screens) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:hidden mt-4 pt-6 border-t border-white/10">
            <div className="bg-white rounded-xl p-3 shadow-lg flex items-center justify-center">
              <Image src="/assets/airtel-logo.png" alt="Airtel" width={90} height={35} className="h-6 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center">
              <Image src="/assets/glo-card.png" alt="Glo" width={110} height={70} className="h-12 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center">
              <Image src="/assets/mtn-card.png" alt="MTN" width={110} height={70} className="h-12 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center">
              <Image src="/assets/9mobile-card.png" alt="9mobile" width={110} height={70} className="h-12 w-auto object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
