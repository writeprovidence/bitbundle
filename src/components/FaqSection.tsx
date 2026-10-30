"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

const faqs = [
  {
    q: "What is Bitbundle?",
    a: "Bitbundle is a non-custodial crypto utility protocol that allows anyone with a Web3 wallet to instantly purchase mobile airtime in Nigeria using USDT. We bridge decentralized cryptocurrency payments with direct telecom provider settlement without requiring centralized exchange accounts or bank accounts.",
  },
  {
    q: "How does Bitbundle work?",
    a: "Connect your Web3 wallet (MetaMask, Trust Wallet, etc.), select your network (MTN, Airtel, Glo, or 9mobile), enter the destination phone number and top-up amount. Confirm the USDT payment on Polygon or Ethereum, and our automated backend processes and delivers your airtime within 30 seconds.",
  },
  {
    q: "How much does it cost?",
    a: "There are zero hidden fees or markups. We provide live real-time USDT to NGN conversion rates. You pay the exact dollar equivalent of your chosen Naira airtime amount plus negligible network gas fees.",
  },
  {
    q: "Do I need coding experience or technical knowledge?",
    a: "Not at all! Bitbundle is designed for everyday ease. If you can click a button and sign a transaction in your mobile wallet, you can top up airtime in seconds.",
  },
  {
    q: "What happens if a transaction fails?",
    a: "If telecom provider downtime prevents airtime dispatch after your crypto transaction is confirmed, our automated refund engine will credit or return your funds to your wallet address without hassle.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white text-gray-900 border-t border-gray-100">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950 leading-[1.15]">
              Frequently
              <br />
              asked questions
            </h2>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 divide-y divide-gray-200 border-t border-b border-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-black">
                      {faq.q}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-700 shrink-0">
                      {isOpen ? (
                        <MinusCircle className="w-5 h-5 text-gray-800" strokeWidth={1.75} />
                      ) : (
                        <PlusCircle className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pr-8">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
