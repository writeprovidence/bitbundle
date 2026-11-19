"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Choose Airtime",
    description:
      "Select your network provider and enter recipient cell number and amount.",
    image: "/landing-page-image/pic1.png",
  },
  {
    number: "02",
    title: "Pay with Crypto",
    description:
      "Connect your preferred crypto wallet, confirm your transaction and you are done.",
    image: "/landing-page-image/pic2.png",
  },
  {
    number: "03",
    title: "Receive Your Recharge",
    description:
      "Once your payment is confirmed, airtime hits your mobile phone line within seconds.",
    image: "/landing-page-image/pic3.png",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section
      id="products"
      className="pt-16 sm:pt-20 lg:pt-24 pb-28 sm:pb-36 lg:pb-40 bg-transparent relative overflow-hidden text-white"
      aria-labelledby="how-it-works-heading"
    >
      {/* Subtle light blue hairline divider between sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#38BDF8]/40 via-[#60A5FA]/30 to-transparent" />
      </div>

      {/* Atmospheric gradient blend - calibrated to match the brand gradient palette */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1250px] lg:w-[1600px] h-[500px] lg:h-[650px] pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 70% at 30% 30%, #26267D 0%, #1B1B62 18%, #421B6F 38%, rgba(101, 239, 189, 0.22) 58%, #1B1B62 80%, transparent 100%)",
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

      {/* Bottom atmospheric glow matching brand gradient */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] lg:w-[1500px] h-[320px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(101, 239, 189, 0.16) 0%, rgba(116, 229, 227, 0.11) 32%, rgba(194, 168, 255, 0.08) 64%, transparent 100%)",
          filter: "blur(75px)",
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65EFBD] via-[#74E5E3] via-[#95CCFF] to-[#C2A8FF]">
              made simple
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
            Three quick steps to turn your crypto into talk time in seconds.
          </p>
        </div>

        {/* 2-Column layout: Step Preview Image on Left, Interactive Steps on Right */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column: Plain, rounded preview image - shifted left, sleek height */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-start order-2 lg:order-1 lg:-translate-x-6 xl:-translate-x-10">
            <div className="relative w-full max-w-2xl xl:max-w-3xl aspect-[16/9.5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/20 bg-white flex items-center justify-center">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`absolute inset-0 transition-all duration-300 ease-out ${
                    activeStep === index
                      ? "opacity-100 scale-100 z-10 pointer-events-auto"
                      : "opacity-0 scale-95 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={`${step.title} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 760px"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Steps Accordion */}
          <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-8 pl-2 lg:pl-4 order-1 lg:order-2">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className="relative pl-6 sm:pl-7 text-left transition-all duration-300 cursor-pointer py-1"
                >
                  {/* Vertical left accent bar for active step */}
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-[3.5px] bg-[#00E599] rounded-full shadow-[0_0_12px_rgba(0,229,153,0.5)] transition-all duration-300" />
                  )}

                  {/* Header Button: Clickable to activate and display corresponding picture */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStep(index);
                    }}
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
