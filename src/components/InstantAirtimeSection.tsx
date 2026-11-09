"use client";

export default function InstantAirtimeSection() {
  return (
    <section className="relative bg-transparent py-14 sm:py-18 lg:py-20 text-white text-center z-10">
      <div className="container-page max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Headline */}
        <h2 className="font-tosh font-black tracking-tight text-white text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] leading-[1.14]">
          <span>Mobile airtime </span>
          <span
            className="whitespace-nowrap inline-block"
            style={{
              background: "linear-gradient(90deg, #65efbd 26.67%, #7fddff 60%, #c5a5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            in seconds
          </span>
        </h2>

        {/* Subtitle text - 2 lines, color white and size 18 */}
        <p className="font-mori text-white text-[18px] font-normal leading-relaxed max-w-2xl mx-auto mt-4 sm:mt-5 opacity-90">
          <span className="block">The easiest and fastest way to recharge your mobile phone with crypto.</span>
          <span className="block">Pay with USDT or cUSD and get airtime instantly.</span>
        </p>
      </div>
    </section>
  );
}
