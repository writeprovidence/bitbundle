"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

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
    a: "We support Celo Dollar (cUSD), GoodDollar (G$), and CELO, with more currencies coming soon.",
  },
  {
    q: "Which crypto wallets do you support?",
    a: "We support any standard Web3 wallet including MetaMask, MiniPay, Valora, Trust Wallet, Coinbase Wallet, Rainbow, and any wallet compatible with WalletConnect.",
  },
  {
    q: "How does the crypto payment process work?",
    a: "Connect your Web3 wallet, select your telecom network (MTN, Airtel, Glo, or 9mobile), enter the recipient phone number, and choose your top-up amount. Confirm the crypto payment in your wallet, and our automated backend processes and delivers your airtime within 30 seconds.",
  },
  {
    q: "How quickly will my airtime arrive after I order it?",
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
          className="text-[#00A859] hover:text-[#00E599] font-semibold underline underline-offset-2 transition-colors"
        >
          our help center
        </a>{" "}
        and we&apos;ll be happy to assist you.
      </>
    ),
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 lg:py-36 bg-white text-gray-900 border-t border-gray-100">
      <div className="container-page max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading (exact typography from reference, strictly 2 lines) */}
          <div className="lg:col-span-5 sticky top-28">
            <h2 className="font-tosh font-black text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] tracking-tight text-gray-950 leading-[1.08]">
              <span className="block">Frequently</span>
              <span className="block whitespace-nowrap">asked questions</span>
            </h2>
          </div>

          {/* Right Column: Accordion with full-width dark divider lines & circular arrows */}
          <div className="lg:col-span-7 border-t border-gray-900">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.q} className="border-b border-gray-900 py-6 sm:py-7">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left gap-6 group cursor-pointer"
                  >
                    <span className="font-tosh text-xl sm:text-2xl font-bold text-gray-950 tracking-tight group-hover:text-black leading-snug">
                      {faq.q}
                    </span>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 sm:border-[2.5px] border-black flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                      {isOpen ? (
                        <ArrowUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-black stroke-[3.5]" />
                      ) : (
                        <ArrowDown className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-black stroke-[3.5]" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 sm:mt-5 pr-4 sm:pr-8 animate-slide-down">
                      <p className="font-mori text-[15px] sm:text-base text-gray-700 leading-relaxed font-normal">
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
