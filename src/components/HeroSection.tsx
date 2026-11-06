"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HeroSection() {
  const { signIn, isSignedIn } = useAuth();

  const handleCta = () => {
    const topup = document.getElementById("products") || document.getElementById("how-it-works");
    if (topup) {
      topup.scrollIntoView({ behavior: "smooth" });
    } else if (!isSignedIn) {
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

      {/* ── Extreme Left Cards (Sharp, High-Resolution, Tilted & Fanned like the design) ── */}

      {/* 1. Airtel Card - Upper Left (Netflix position: top-left, tilted clockwise ~+6deg) */}
      <div className="hidden lg:block absolute -left-6 lg:-left-10 xl:-left-14 2xl:-left-16 top-[285px] sm:top-[295px] lg:top-[315px] xl:top-[335px] z-10 pointer-events-auto">
        <div className="w-48 lg:w-56 xl:w-64 2xl:w-72 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)] [outline:1px_solid_transparent]">
          <Image
            src="/assets/airtel-logo.png"
            alt="Airtel card"
            width={896}
            height={648}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:auto]"
            priority
          />
        </div>
      </div>

      {/* 2. Glo Card - Lower Left (Airbnb position: bottom-left, tilted counter-clockwise ~-6deg, pointing inward toward CTA) */}
      <div className="hidden lg:block absolute -left-4 lg:-left-6 xl:-left-8 2xl:-left-10 top-[455px] sm:top-[475px] lg:top-[495px] xl:top-[520px] z-20 pointer-events-auto">
        <div className="w-52 lg:w-60 xl:w-68 2xl:w-76 -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_20px_36px_rgba(0,0,0,0.65)] [outline:1px_solid_transparent]">
          <Image
            src="/assets/glo-card.png"
            alt="Glo card"
            width={1272}
            height={980}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:auto]"
            priority
          />
        </div>
      </div>

      {/* ── Extreme Right Cards (Sharp, High-Resolution, Tilted & Fanned like the design) ── */}

      {/* 3. MTN Card - Upper Right (Starbucks position: upper-right, tilted counter-clockwise ~-6deg) */}
      <div className="hidden lg:block absolute -right-6 lg:-right-10 xl:-right-14 2xl:-right-16 top-[285px] sm:top-[295px] lg:top-[315px] xl:top-[335px] z-10 pointer-events-auto">
        <div className="w-52 lg:w-60 xl:w-68 2xl:w-76 -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)] [outline:1px_solid_transparent]">
          <Image
            src="/assets/mtn-card.png"
            alt="MTN card"
            width={1160}
            height={760}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:auto]"
            priority
          />
        </div>
      </div>

      {/* 4. 9mobile Card - Lower Right (Visa position: lower-right, tilted clockwise ~+6deg, extending further inward) */}
      <div className="hidden lg:block absolute right-2 lg:right-4 xl:right-6 2xl:right-8 top-[450px] sm:top-[470px] lg:top-[490px] xl:top-[515px] z-20 pointer-events-auto">
        <div className="w-52 lg:w-60 xl:w-68 2xl:w-76 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 drop-shadow-[0_20px_36px_rgba(0,0,0,0.65)] [outline:1px_solid_transparent]">
          <Image
            src="/assets/9mobile-card.png"
            alt="9mobile card"
            width={1264}
            height={800}
            unoptimized
            className="w-full h-auto object-contain select-none [image-rendering:auto]"
            priority
          />
        </div>
      </div>

      {/* ── Central Hero Content ── */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="relative flex flex-col items-center justify-center text-center">

          {/* Headline Block */}
          <div className="relative mx-auto mb-6">
            <h1
              id="hero-heading"
              className="font-tosh font-black tracking-tight text-white text-4xl sm:text-5xl lg:text-[60px] leading-[1.08]"
            >
              <span className="block sm:whitespace-nowrap font-black">Buy Airtime with Crypto.</span>
              <span className="relative inline-flex items-center justify-center font-black mt-0.5 sm:mt-1">
                {/* Origami Paper Airplane (Left of Instantly, securely, and) */}
                <span className="hidden sm:block absolute right-full top-1/2 -translate-y-1/2 mr-3.5 sm:mr-4.5 lg:mr-5.5 w-14 sm:w-18 lg:w-22 xl:w-24 pointer-events-none z-30">
                  <Image
                    src="/assets/paper-plane.png"
                    alt="Origami paper airplane"
                    width={484}
                    height={484}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(101,239,189,0.35)] [image-rendering:-webkit-optimize-contrast]"
                    priority
                  />
                </span>

                <span className="whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#65EFBD] via-[#74E5E3] to-[#95CCFF]">
                  Instantly, securely, and
                </span>

                {/* Celebratory Gift Box (Right of Instantly, securely, and) */}
                <span className="hidden sm:block absolute left-full top-1/2 -translate-y-1/2 ml-3.5 sm:ml-4.5 lg:ml-5.5 w-14 sm:w-18 lg:w-22 xl:w-24 pointer-events-none z-10">
                  <Image
                    src="/assets/gift-box.png"
                    alt="Celebratory gift box"
                    width={384}
                    height={432}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(194,168,255,0.35)] [image-rendering:-webkit-optimize-contrast]"
                    priority
                  />
                </span>
              </span>
              <span className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-[#9CC5FF] via-[#B1B6FF] to-[#C2A8FF] mt-1">
                effortlessly.
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="font-mori text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Top up MTN, Airtel, Glo or 9mobile with crypto – for yourself
            <br className="hidden sm:inline" /> or someone you love.
          </p>

          {/* Center CTA Button */}
          <div className="flex justify-center mb-6">
            <Link
              href="/products"
              id="hero-cta-btn"
              className="font-mori group inline-flex items-center gap-3.5 bg-[#00F0A0] hover:bg-[#05e598] text-[#030A16] font-semibold text-lg sm:text-xl px-10 py-4 rounded-full shadow-[0_4px_18px_rgba(0,240,160,0.28)] hover:shadow-[0_4px_24px_rgba(0,240,160,0.45)] cursor-pointer transition-all duration-200"
            >
              <span>Buy airtime</span>
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-200 group-hover:translate-x-2">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </span>
            </Link>
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
