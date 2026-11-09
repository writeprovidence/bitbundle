"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface NetworkCard {
  id: string;
  name: string;
  networkId: "mtn" | "airtel" | "glo" | "9mobile";
  range: string;
  rating?: number;
  badge?: string;
  badgeType?: "discount" | "feature";
  cardBg: string;
  cardBorder?: string;
}

const NETWORKS: NetworkCard[] = [
  {
    id: "mtn-network",
    name: "MTN",
    networkId: "mtn",
    range: "50 NGN - 10,000 NGN",
    rating: 4.8,
    cardBg: "bg-[#FFCC00]",
  },
  {
    id: "airtel-network",
    name: "Airtel",
    networkId: "airtel",
    range: "50 NGN - 10,000 NGN",
    rating: 4.9,
    cardBg: "bg-white",
    cardBorder: "border border-gray-200/90",
  },
  {
    id: "glo-network",
    name: "GLO",
    networkId: "glo",
    range: "100 NGN - 10,000 NGN",
    rating: 4.8,
    cardBg: "bg-white",
    cardBorder: "border border-gray-200/90",
  },
  {
    id: "9mobile-network",
    name: "9mobile",
    networkId: "9mobile",
    range: "50 NGN - 10,000 NGN",
    rating: 4.5,
    badge: "⚡ -2%",
    badgeType: "discount",
    cardBg: "bg-[#045F40]",
  },
];

export default function MobileNetworksSection() {
  return (
    <section className="bg-[#FAFAFA] text-gray-900 pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 min-h-[750px] lg:min-h-[850px] flex flex-col justify-center">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Header Row: Title & See all on Left, Telecom Photo on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-16 lg:mb-20">
          
          {/* Left: Heading and See all link */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center">
            <h2 className="font-tosh font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight text-[#071F18] leading-[1.15] mb-4">
              For Your Mobile Needs
            </h2>
            <Link
              href="/products"
              className="inline-block text-sm sm:text-base font-bold text-[#071F18] hover:text-[#00A859] underline underline-offset-4 transition-colors w-fit"
            >
              See all
            </Link>
          </div>

          {/* Right: Telecom Lifestyle/Connected Banner (Square, slightly larger, shifted down) */}
          <div className="md:col-span-6 lg:col-span-6 flex justify-end translate-y-6 sm:translate-y-8 lg:translate-y-12">
            <div className="relative w-full max-w-[540px] h-[230px] sm:h-[260px] lg:h-[285px] rounded-none overflow-hidden shadow-sm border border-gray-200/80">
              <Image
                src="/assets/telecom.jpg"
                alt="Telecom mobile networks"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover rounded-none"
                priority
              />
            </div>
          </div>
        </div>

        {/* 4 Mobile Networks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {NETWORKS.map((network) => {
            return (
              <Link
                key={network.id}
                href={`/products?network=${network.networkId}`}
                className="group flex flex-col cursor-pointer transition-all duration-200"
              >
                {/* Visual Card Canvas with rounded corners & shadow */}
                <div
                  className={`relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl flex items-center justify-center ${
                    network.networkId === "mtn" ? "p-0 overflow-hidden" : "p-6"
                  } transition-all duration-200 group-hover:shadow-2xl group-hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
                    network.cardBg
                  } ${network.cardBorder || ""}`}
                >
                  {/* Top-left badge (like the 1% badge on FlixBus) */}
                  {network.badge && (
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="inline-flex items-center gap-1 bg-[#FFD700] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {network.badge}
                      </span>
                    </div>
                  )}

                  {/* Brand Logo Presentation */}
                  {network.networkId === "mtn" && (
                    <Image
                      src="/assets/mtn_banner.jpg"
                      alt="MTN"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover rounded-2xl group-hover:scale-105 transition-transform"
                      priority
                    />
                  )}

                  {network.networkId === "airtel" && (
                    <div className="flex items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <Image
                        src="/assets/airtel-brand-logo.png"
                        alt="Airtel"
                        width={240}
                        height={88}
                        className="w-auto h-12 sm:h-14 object-contain"
                      />
                    </div>
                  )}

                  {network.networkId === "glo" && (
                    <div className="flex items-center justify-center select-none">
                      <Image
                        src="/assets/glo.jpg"
                        alt="Glo"
                        width={120}
                        height={120}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {network.networkId === "9mobile" && (
                    <div className="flex items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <Image
                        src="/assets/9mobile-brand-logo.png"
                        alt="9mobile"
                        width={180}
                        height={180}
                        className="w-auto h-16 sm:h-20 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Card Meta below card canvas */}
                <div className="mt-3.5 px-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900 group-hover:text-black transition-colors">
                      {network.name}
                    </span>
                    {network.rating && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                        <span>{network.rating.toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    {network.range}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
