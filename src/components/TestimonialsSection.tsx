"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CommunityTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: CommunityTestimonial[] = [
  {
    id: "1",
    quote:
      "I never have to off-ramp USDT to a local bank just to buy data bundles. Bitbundle dispatches the recharge directly to my line before I even close the tab.",
    author: "Amina Bello",
    role: "Freelance Product Designer, Lagos",
    avatar: "/testimonials/amina-bello.jpg",
  },
  {
    id: "2",
    quote:
      "Fast, zero slippage, and no tedious KYC steps just to top up a phone number. This is what everyday crypto utility is actually supposed to feel like.",
    author: "David Kiprop",
    role: "DeFi Researcher & Trader, Nairobi",
    avatar: "/testimonials/david-kiprop.jpg",
  },
  {
    id: "3",
    quote:
      "The stablecoin checkout on Base is ultra-fast and gas fees are practically pennies. One click in my wallet and my line is instantly credited.",
    author: "Sipho Dlamini",
    role: "Software Engineer, Johannesburg",
    avatar: "/testimonials/sipho-dlamini.jpg",
  },
  {
    id: "4",
    quote:
      "Bitbundle has completely transformed how our creative team handles airtime and connectivity across borders. Smooth, instant, and reliable.",
    author: "Kyle Weznick",
    role: "Media Director, Turn Around Music Group",
    avatar: "/testimonials/kyle-weznick.jpg",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section
      id="community"
      aria-label="Community Testimonials"
      className="py-24 sm:py-32 lg:py-40 bg-white text-slate-900 border-t border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Subtitle & Arrow Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between min-h-[260px]">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-950 leading-[1.08]">
                From our <br className="hidden sm:inline" />
                community.
              </h2>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-sm">
                Here&apos;s what other subscribers had to say about Bitbundle.
              </p>
            </div>

            {/* Circular Carousel Arrow Navigation */}
            <div className="flex items-center gap-3.5 mt-8 lg:mt-16">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-800 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
              >
                <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-800 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
              >
                <ArrowRight className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* Right Column: Navy Quote Mark, Large Editorial Quote & User Card */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[300px]">
            {/* Deep Navy/Blue Quotation Mark */}
            <div className="mb-4 sm:mb-6 text-[#1A2E68] select-none" aria-hidden="true">
              <svg
                className="w-12 h-9 sm:w-14 sm:h-10 fill-current"
                viewBox="0 0 48 40"
                fill="none"
              >
                <path d="M0 24C0 10.7452 8.9543 0 20 0V8C13.3726 8 8 13.3726 8 20H20V40H0V24ZM28 24C28 10.7452 36.9543 0 48 0V8C41.3726 8 36 13.3726 36 20H48V40H28V24Z" />
              </svg>
            </div>

            {/* Large Statement Quote */}
            <div className="min-h-[160px] sm:min-h-[180px] flex items-center">
              <blockquote
                key={current.id}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-medium tracking-tight text-slate-900 leading-[1.3] animate-in fade-in duration-300"
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </div>

            {/* Author Profile */}
            <div
              key={`author-${current.id}`}
              className="mt-8 sm:mt-12 flex items-center gap-4 animate-in fade-in duration-200"
            >
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                <Image
                  src={current.avatar}
                  alt={current.author}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                  {current.author}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-normal mt-0.5">
                  {current.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
