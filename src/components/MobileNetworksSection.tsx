"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserCountry, COUNTRY_DATA } from "@/lib/geo";

interface NetworkCard {
  id: string;
  name: string;
  networkId: string;
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
  {
    id: "telecel-network",
    name: "Telecel / Vodafone",
    networkId: "telecel",
    range: "5 GHS - 500 GHS",
    rating: 4.7,
    cardBg: "bg-[#E40000]",
  },
  {
    id: "safaricom-network",
    name: "Safaricom",
    networkId: "safaricom",
    range: "50 KES - 10,000 KES",
    rating: 4.9,
    cardBg: "bg-[#009E49]",
  },
  {
    id: "vodacom-network",
    name: "Vodacom",
    networkId: "vodacom",
    range: "10 ZAR - 2,000 ZAR",
    rating: 4.8,
    cardBg: "bg-[#E60000]",
  },
  {
    id: "cellc-network",
    name: "Cell C",
    networkId: "cellc",
    range: "10 ZAR - 2,000 ZAR",
    rating: 4.5,
    cardBg: "bg-black",
  },
  {
    id: "telkom-network",
    name: "Telkom",
    networkId: "telkom",
    range: "10 ZAR - 2,000 ZAR",
    rating: 4.6,
    cardBg: "bg-[#0089CF]",
  },
  {
    id: "tigo-network",
    name: "Tigo",
    networkId: "tigo",
    range: "1,000 TZS - 100,000 TZS",
    rating: 4.7,
    cardBg: "bg-[#0033A0]",
  },
  {
    id: "halotel-network",
    name: "Halotel",
    networkId: "halotel",
    range: "1,000 TZS - 100,000 TZS",
    rating: 4.6,
    cardBg: "bg-[#FF6600]",
  },
];

export default function MobileNetworksSection() {
  const { countryCode } = useUserCountry();
  const currentCountry = COUNTRY_DATA[countryCode] || COUNTRY_DATA.NG;

  // Filter networks strictly to those that operate in the user's detected country
  const displayedNetworks = useMemo(() => {
    const list = NETWORKS.filter((net) => currentCountry.networks.includes(net.networkId));
    return list.length > 0 ? list : NETWORKS.slice(0, 4);
  }, [currentCountry]);

  return (
    <section className="bg-[#FAFAFA] text-gray-900 pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 min-h-[750px] lg:min-h-[850px] flex flex-col justify-center">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Top Header Row: Title & See all on Left, Telecom Photo on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-16 lg:mb-20">
          
          {/* Left: Heading and See all link */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center">
            <h2 className="font-tosh font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight text-[#071F18] leading-[1.15] mb-2">
              For Your Mobile Needs
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Operators in</span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200/80">
                <span>{currentCountry.flag}</span>
                <span>{currentCountry.name}</span>
              </span>
            </div>
            <Link
              href={`/products?country=${currentCountry.code}`}
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

        {/* Dynamic Mobile Networks Grid matching detected country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {displayedNetworks.map((network) => {
            return (
              <Link
                key={network.id}
                href={`/products/${network.networkId}?country=${currentCountry.code}`}
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

                  {network.networkId === "telecel" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="flex items-center gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">telecel</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                      <span className="text-[11px] font-semibold text-white/80 tracking-wide uppercase mt-1">Vodafone Ghana</span>
                    </div>
                  )}

                  {network.networkId === "safaricom" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="w-9 h-9 rounded-full border-[3.5px] border-[#E40000] bg-white flex items-center justify-center mb-1 shadow-xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#009E49]" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">Safaricom</span>
                    </div>
                  )}

                  {network.networkId === "vodacom" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-[#E60000] flex items-center justify-center">
                          <div className="w-3.5 h-3.5 rounded-full bg-white -translate-y-0.5 -translate-x-0.5" />
                        </div>
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">vodacom</span>
                    </div>
                  )}

                  {network.networkId === "cellc" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="w-12 h-12 rounded-full border-[4px] border-white flex items-center justify-center mb-1">
                        <span className="text-xl font-black text-white">C</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black tracking-widest text-white">CELL C</span>
                    </div>
                  )}

                  {network.networkId === "telkom" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="w-10 h-10 border-3 border-white rounded-md rotate-45 flex items-center justify-center mb-1">
                        <div className="w-3 h-3 bg-white -rotate-45" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Telkom</span>
                    </div>
                  )}

                  {network.networkId === "tigo" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight lowercase">tigo</span>
                        <span className="w-3 h-3 rounded-full bg-[#FFD700]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#FFD700] tracking-widest uppercase mt-0.5">Tanzania</span>
                    </div>
                  )}

                  {network.networkId === "halotel" && (
                    <div className="flex flex-col items-center justify-center w-full px-4 select-none group-hover:scale-105 transition-transform">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight lowercase">halotel</span>
                      <div className="w-12 h-1 bg-white/70 rounded-full mt-1.5" />
                    </div>
                  )}
                </div>

                {/* Card Meta below card canvas */}
                <div className="mt-3.5 px-0.5">
                  <div>
                    <span className="text-base font-bold text-gray-900 group-hover:text-black transition-colors">
                      {network.name}
                    </span>
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
