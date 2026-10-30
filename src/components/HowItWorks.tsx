"use client";

import TopupCard from "./TopupCard";

export default function HowItWorks() {
  return (
    <section
      id="products"
      className="py-24 lg:py-32 bg-[#060B18] relative overflow-hidden text-white"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0, 229, 153, 0.25) 0%, rgba(0, 200, 255, 0.1) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-page relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2
            id="how-it-works-heading"
            className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-3"
          >
            From wallet to hello
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E599] to-[#00C8FF]">
              made simple
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
            Three quick steps to turn your crypto into talk time in seconds.
          </p>
        </div>

        {/* 2-Column layout: App Interface on Left, Steps on Right */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left Column: Interactive App Preview */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-md bg-[#0D152A]/90 border border-white/10 rounded-3xl p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <TopupCard />
            </div>
          </div>

          {/* Right Column: 3 Steps */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl transition-all duration-200 hover:bg-white/[0.02]">
              <span className="text-xs font-semibold text-gray-500 block mb-1">
                01
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Choose Airtime
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select your network provider and enter recipient cell number and amount.
              </p>
            </div>

            {/* Step 2 (Highlighted with glowing green border box) */}
            <div className="p-6 rounded-2xl border border-[#00E599]/60 bg-[#00E599]/[0.04] shadow-[0_0_30px_rgba(0,229,153,0.12)] relative">
              <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-[#00E599] animate-pulse-dot" />
              <span className="text-xs font-bold text-[#00E599] block mb-1">
                02
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Pay with Crypto
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connect your preferred crypto wallet: USDT on Polygon or Ethereum, confirm your transaction and you are done.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl transition-all duration-200 hover:bg-white/[0.02]">
              <span className="text-xs font-semibold text-gray-500 block mb-1">
                03
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Receive Your Recharge
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Once your payment is confirmed, airtime hits your mobile phone line within seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
