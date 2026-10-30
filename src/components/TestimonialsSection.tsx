"use client";

import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  date: string;
  text: string;
  network: string;
  badgeType: "mtn" | "airtel" | "glo" | "9mobile";
  reviews: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "08145446766yes",
    date: "Nov 2026",
    text: "This app is highly recommendable for any transactions because it doesn't take minutes to respond.That's why I gave a five star ratings 🤩🤩🤩🤩🤩",
    network: "MTN",
    badgeType: "mtn",
    reviews: "12 reviews",
  },
  {
    id: "2",
    name: "@theparabolicguy",
    date: "Nov 2026",
    text: "Very fast and reliable! Instant top-up with zero slippage. This is the future of utility payments. Credited before I even refreshed the wallet. Highly recommend!",
    network: "Airtel",
    badgeType: "airtel",
    reviews: "8 reviews",
  },
  {
    id: "3",
    name: "@amina_tech99",
    date: "Nov 2026",
    text: "Everything fast and successful! Never had to stress looking for naira to buy recharge card again. Direct swap from crypto to airtime without delay.",
    network: "Glo",
    badgeType: "glo",
    reviews: "15 reviews",
  },
  {
    id: "4",
    name: "@david_crypto",
    date: "Nov 2026",
    text: "I've tried so many crypto off-ramps, but Bitbundle is by far the simplest. Sent crypto, received airtime in 15 seconds. Top notch service! ❤️",
    network: "9mobile",
    badgeType: "9mobile",
    reviews: "6 reviews",
  },
];

const telecomLogos: Record<
  Testimonial["badgeType"],
  { src: string; alt: string; width: number; height: number; rotate: string; scale?: string }
> = {
  mtn: {
    src: "/assets/mtn-card.png",
    alt: "MTN",
    width: 1160,
    height: 760,
    rotate: "rotate(8.8deg)",
    scale: "scale(1.05)",
  },
  airtel: {
    src: "/assets/airtel-logo.png",
    alt: "Airtel",
    width: 896,
    height: 648,
    rotate: "rotate(-6.5deg)",
    scale: "scale(1.05)",
  },
  glo: {
    src: "/assets/glo-card.png",
    alt: "Glo",
    width: 1272,
    height: 980,
    rotate: "rotate(14deg)",
    scale: "scale(1.08)",
  },
  "9mobile": {
    src: "/assets/9mobile-card.png",
    alt: "9mobile",
    width: 1264,
    height: 800,
    rotate: "rotate(-5.8deg)",
    scale: "scale(1.05)",
  },
};

function TelecomLogo({ type }: { type: Testimonial["badgeType"] }) {
  const logo = telecomLogos[type];
  return (
    <div className="w-13 h-9 sm:w-14 sm:h-9.5 flex items-center justify-center shrink-0">
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `${logo.rotate} ${logo.scale || ""}`,
        }}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          unoptimized
          className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
        />
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-36 lg:py-48 bg-white text-gray-900 border-t border-b border-gray-100">
      <div className="container-page max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-18 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            CLIENT TESTIMONIALS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
            What Our Clients Say
          </h2>
        </div>

        {/* Carousel / Grid container */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-[10px] p-4.5 sm:p-5 flex flex-col justify-between shadow-none min-h-[225px]"
              >
                <div>
                  {/* Top: Avatar + Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#555E67] flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        viewBox="0 0 36 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Doodle hair */}
                        <path d="M12 12c.8-2 2.6-3 4.5-2 1.2-.8 3.2-.8 4.4.4 1.2-.8 3.2-.4 3.8 1.6" />
                        {/* Eyes */}
                        <circle cx="14.5" cy="16" r="1.2" fill="currentColor" />
                        <circle cx="21.5" cy="16" r="1.2" fill="currentColor" />
                        {/* Nose */}
                        <path d="M18 17v2" />
                        {/* Smile */}
                        <path d="M13.5 21.5c2 2.5 7 2.5 9 0" />
                      </svg>
                    </div>

                    <p className="text-sm sm:text-[14.5px] font-bold text-gray-900 leading-tight truncate">
                      {item.name}
                    </p>
                  </div>

                  {/* Middle: Review text */}
                  <p className="text-[13.5px] sm:text-sm text-gray-700 leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>

                {/* Bottom: Divider + Telecom Logo Badge & Reviews */}
                <div>
                  <hr className="border-t border-gray-100 my-3.5" />
                  <div className="flex items-center gap-3">
                    <TelecomLogo type={item.badgeType} />
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {item.network}
                      </p>
                      <p className="text-xs text-gray-500 font-normal leading-tight mt-0.5">
                        {item.reviews}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
