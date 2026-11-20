"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface Faq {
  q: string;
  a: React.ReactNode;
}

const faqs: Faq[] = [
  {
    q: "What is Bitbundle?",
    a: "Bitbundle is a non-custodial crypto utility protocol that allows anyone with a Web3 wallet to instantly purchase mobile airtime using crypto. We bridge decentralized cryptocurrency payments with direct telecom provider settlement without requiring centralized exchange accounts or bank accounts.",
  },
  {
    q: "Which cryptocurrencies do you support?",
    a: "We exclusively accept stablecoins across multiple chains (USDT, USDC, and cUSD) to guarantee zero price volatility during checkout.",
  },
  {
    q: "Which crypto wallets do you support?",
    a: "We support any standard Web3 wallet including MetaMask, MiniPay, Valora, Trust Wallet, Coinbase Wallet, Rainbow, as well as social & email logins powered by Privy.",
  },
  {
    q: "How does the crypto payment process work?",
    a: "Connect your Web3 wallet, select your telecom network (MTN, Airtel, Glo, or 9mobile), enter the recipient phone number, and choose your top-up amount. Confirm the crypto payment in your wallet, and our automated backend processes and delivers your airtime within 30 seconds.",
  },
  {
    q: "How quickly will my airtime arrive after I order?",
    a: "Airtime arrives in under 30 seconds! Once your blockchain transaction is confirmed, our automated telecom provider integration instantly dispatches the recharge directly to your line.",
  },
  {
    q: "How much does it cost?",
    a: "There are zero hidden fees or markups. We provide live real-time conversion rates. You pay the exact equivalent of your chosen airtime amount plus negligible network gas fees.",
  },
  {
    q: "What happens if a transaction fails?",
    a: "If telecom provider downtime prevents airtime dispatch after your crypto transaction is confirmed, our automated refund engine will credit or return your funds to your wallet address without hassle.",
  },
  {
    q: "I have a question not answered here. How can I get help?",
    a: (
      <>
        If you have a question that&apos;s not answered here you can visit{" "}
        <a
          href="https://address-patterns-jones-geometry.trycloudflare.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00A859] hover:text-[#00c96a] font-semibold underline underline-offset-2 transition-colors"
        >
          our help center
        </a>{" "}
        and we&apos;ll be happy to assist you.
      </>
    ),
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F5F3F7] text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Left Column: Heading + subtitle + help link ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="font-tosh font-black text-5xl sm:text-6xl lg:text-[64px] xl:text-[72px] leading-[1.0] tracking-tight text-gray-950 mb-5">
              Questions People{" "}
              <span className="block mt-1">
                Ask{" "}
                <span className="text-[#00A859]">Before Buying.</span>
              </span>
            </h2>

            <p className="font-manrope text-base sm:text-lg text-gray-500 leading-relaxed mb-8">
              Straight answers. No corporate hedging.
            </p>

          </div>

          {/* ── Right Column: Clean accordion ── */}
          <div className="lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.q}
                  className="border-b border-gray-200 first:border-t first:border-gray-200"
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left gap-6 py-7 sm:py-8 group cursor-pointer"
                  >
                    <span className="font-manrope text-xl sm:text-2xl lg:text-[26px] font-semibold text-gray-900 group-hover:text-gray-950 leading-snug tracking-tight transition-colors">
                      {faq.q}
                    </span>

                    {/* Rounded square + / - button matching the reference */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-gray-300 bg-white flex items-center justify-center shrink-0 group-hover:border-[#00A859] transition-colors duration-200">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-gray-500 group-hover:text-[#00A859] transition-colors" strokeWidth={2} />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-500 group-hover:text-[#00A859] transition-colors" strokeWidth={2} />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-7 sm:pb-8 pr-14 animate-slide-down">
                      <p className="font-manrope text-base sm:text-[16px] text-gray-500 leading-relaxed">
                        {faq.a}
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
