"use client";

import { useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  text: string;
  network: string;
  networkColor: string;
  networkTextColor: string;
  amountText: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "@richard_hendricks",
    avatarBg: "bg-slate-300 text-slate-800",
    avatarText: "RH",
    text: "The swap was lightning fast and worked without any issues when I sent airtime to my sister in Lagos. Truly a life saver! 🙌",
    network: "MTN",
    networkColor: "bg-[#FFCC00]",
    networkTextColor: "text-neutral-900",
    amountText: "2k5 airtime",
  },
  {
    id: "2",
    name: "@theparabolicguy",
    avatarBg: "bg-amber-100 text-amber-800",
    avatarText: "PG",
    text: "Very fast and reliable! Instant top-up with zero slippage. This is the future of utility payments.",
    network: "Airtel",
    networkColor: "bg-[#E40000]",
    networkTextColor: "text-white",
    amountText: "5k airtime",
  },
  {
    id: "3",
    name: "@amina_tech99",
    avatarBg: "bg-emerald-100 text-emerald-900",
    avatarText: "AT",
    text: "Everything fast and successful! Never had to stress looking for naira to buy recharge card again.",
    network: "Glo",
    networkColor: "bg-[#00A859]",
    networkTextColor: "text-white",
    amountText: "1k airtime",
  },
  {
    id: "4",
    name: "@david_crypto",
    avatarBg: "bg-neutral-800 text-white",
    avatarText: "DC",
    text: "I've tried so many crypto off-ramps, but Bitbundle is by far the simplest. Sent 10 USDT, received airtime in 15 seconds. Top notch service! ❤️",
    network: "9mobile",
    networkColor: "bg-[#E6007E]",
    networkTextColor: "text-white",
    amountText: "1k airtime",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white text-gray-900 border-t border-b border-gray-100">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            CLIENT TESTIMONIALS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
            What Our Clients Say
          </h2>
        </div>

        {/* Carousel / Grid container */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Avatar + Handle */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-full ${item.avatarBg} font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {item.avatarText}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {item.name}
                      </p>
                      {/* 5 Stars */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {item.text}
                  </p>
                </div>

                {/* Bottom Network Badge */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${item.networkColor} ${item.networkTextColor}`}
                  >
                    {item.network}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {item.amountText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2">
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
