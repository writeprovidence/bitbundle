"use client";

import { useState } from "react";
import TopupCard from "./TopupCard";

const steps = [
  {
    number: "01",
    title: "Choose Airtime",
    description:
      "Select your network provider and enter recipient cell number and amount.",
  },
  {
    number: "02",
    title: "Pay with Crypto",
    description:
      "Connect your preferred crypto wallet, confirm your transaction and you are done.",
  },
  {
    number: "03",
    title: "Receive Your Recharge",
    description:
      "Once your payment is confirmed, airtime hits your mobile phone line within seconds.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section
      id="products"
      className="pt-16 sm:pt-20 lg:pt-24 pb-24 lg:pb-32 bg-transparent relative overflow-hidden text-white"
      aria-labelledby="how-it-works-heading"
    >
      {/* Subtle hairline divider between the second and third blue sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Reloadly-style gradient blend on the third section - calibrated so it is clearly visible without being overpowering */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1250px] lg:w-[1600px] h-[500px] lg:h-[650px] pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 70% at 30% 30%, #26267D 0%, #1B1B62 18%, #421B6F 38%, rgba(9, 250, 163, 0.22) 58%, #1B1B62 80%, transparent 100%)",
          opacity: 0.52,
          backgroundBlendMode: "color-dodge",
          filter: "blur(85px)",
        }}
      />

      {/* Soft atmospheric depth glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(38, 38, 125, 0.25) 0%, rgba(66, 27, 111, 0.16) 45%, transparent 75%)",
          filter: "blur(65px)",
        }}
      />

      <div className="container-page relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2
            id="how-it-works-heading"
            className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-8 sm:mb-10"
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

        {/* 2-Column layout: App Interface on Left, Interactive Steps on Right */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left Column: Interactive App Preview */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-md bg-[#0D152A]/90 border border-white/10 rounded-3xl p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <TopupCard />
            </div>
          </div>

          {/* Right Column: Steps Accordion inspired by reference design */}
          <div className="lg:col-span-6 flex flex-col space-y-8 sm:space-y-10 pl-2 lg:pl-6">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={step.number}
                  className="relative pl-6 text-left transition-all duration-300"
                >
                  {/* Vertical left accent bar for active step */}
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-[3.5px] bg-[#00E599] rounded-full shadow-[0_0_12px_rgba(0,229,153,0.5)] transition-all duration-300" />
                  )}

                  {/* Header Button: Clickable to toggle and display content */}
                  <button
                    type="button"
                    onClick={() => setActiveStep(isActive ? -1 : index)}
                    className="w-full text-left group focus:outline-none cursor-pointer"
                    aria-expanded={isActive}
                  >
                    <span
                      className={`block font-mono text-xs sm:text-sm font-bold tracking-wider mb-1.5 transition-colors ${
                        isActive
                          ? "text-[#00E599]"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    >
                      {step.number}
                    </span>
                    <h3
                      className={`text-2xl sm:text-[28px] font-extrabold tracking-tight transition-colors leading-snug ${
                        isActive
                          ? "text-white"
                          : "text-gray-300/80 group-hover:text-white"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </button>

                  {/* Step Description: only appears when active */}
                  {isActive && (
                    <div className="mt-3 animate-slide-down">
                      <p className="text-base text-gray-300 leading-relaxed font-normal max-w-md">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
