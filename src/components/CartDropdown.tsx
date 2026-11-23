"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, CheckCircle2, X, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartDropdownProps {
  onCheckout: () => void;
}

export default function CartDropdown({ onCheckout }: CartDropdownProps) {
  const { items, isCartOpen, setIsCartOpen, removeItem, totalUsd, totalNgn } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;
      if (
        target.closest("[data-cart-dropdown]") ||
        target.closest("#header-cart-btn") ||
        target.closest("#mobile-header-cart-btn")
      ) {
        return;
      }
      setIsCartOpen(false);
    }
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      ref={dropdownRef}
      data-cart-dropdown="true"
      className="absolute right-0 top-full mt-2 w-[350px] sm:w-[380px] max-h-[calc(100vh-96px)] flex flex-col bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-gray-100 p-5 sm:p-6 text-gray-900 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header - Fixed at top */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#00875A] stroke-[2.2]" />
          <span className="font-extrabold text-lg text-[#042825]">Added to Cart</span>
        </div>
        <button
          type="button"
          onClick={() => setIsCartOpen(false)}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close cart"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Items List - Scrollable middle section */}
      {items.length === 0 ? (
        <div className="py-8 text-center text-gray-500 shrink-0">
          <CheckCircle2 className="w-9 h-9 mx-auto text-gray-300 mb-2.5 stroke-[1.5]" />
          <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
          <p className="text-xs text-gray-400 mt-1">Add mobile airtime or gifts to checkout.</p>
          <Link
            href="/products"
            onClick={() => setIsCartOpen(false)}
            className="mt-5 w-full py-3.5 bg-[#EAEFF5] hover:bg-[#dfe5ec] text-[#042825] font-bold text-sm sm:text-base rounded-full transition-colors cursor-pointer text-center block"
          >
            Keep Shopping
          </Link>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 overscroll-contain">
          {items.map((item) => {
            const displayName = item.networkName;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-1"
              >
                {/* Left side: Logo & details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Operator Logo Thumbnail */}
                  <div className="shrink-0">
                    {item.networkId === "mtn" ? (
                      <div className="w-12 h-12 rounded-lg bg-[#FFCC00] flex items-center justify-center p-1 border border-black/5 shadow-xs">
                        <div className="w-9 h-6 border-2 border-black rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-black tracking-tight text-black">MTN</span>
                        </div>
                      </div>
                    ) : item.networkId === "airtel" ? (
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1.5 shadow-xs">
                        <Image
                          src="/assets/airtel-brand-logo.png"
                          alt="Airtel"
                          width={40}
                          height={20}
                          className="w-auto h-5 object-contain"
                        />
                      </div>
                    ) : item.networkId === "vodacom" ? (
                      <div className="w-12 h-12 rounded-lg relative overflow-hidden border border-gray-100 shadow-xs shrink-0">
                        <Image
                          src="/assets/telecom-card/vodacom-new.png"
                          alt="Vodacom"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : item.networkId === "glo" ? (
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs">
                        <Image
                          src="/assets/glo.jpg"
                          alt="Glo"
                          width={36}
                          height={36}
                          className="w-8 h-8 object-cover rounded-xs"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#045F40] flex items-center justify-center p-1 shadow-xs">
                        <span className="text-[11px] font-black text-white">9mobile</span>
                      </div>
                    )}
                  </div>

                  {/* Item text */}
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-[#042825] truncate">
                      {displayName}
                      <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.topupType === "data" ? "Data" : "Airtime"}
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500 font-normal mt-0.5">
                      {item.dataPlan && <span className="font-semibold text-emerald-700 mr-1">{item.dataPlan.dataAmount} ({item.dataPlan.validity}) •</span>}
                      {item.amountNgn.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      value
                    </p>
                    <p className="text-xs text-[#042825] font-medium mt-0.5">
                      {item.phoneNumber}
                    </p>
                    {item.isGift && (
                      <span className="inline-flex items-center gap-1 bg-[#DE1D35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-xs">
                        <Gift className="w-2.5 h-2.5" />
                        Gift
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Delete button */}
                <div className="shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label={`Remove ${item.networkName}`}
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Summary & Actions - Fixed at bottom */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-gray-100 mt-4 shrink-0">
          <div className="flex items-center justify-between py-1 mb-3 px-1">
            <span className="text-sm font-semibold text-gray-600">Total</span>
            <div className="text-right">
              <span className="text-sm sm:text-base font-extrabold text-gray-900">
                ${totalUsd.toFixed(2)}
              </span>
              <span className="text-[11px] text-gray-400 block font-mono">
                ≈ {totalNgn.toLocaleString()} NGN
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/products"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3.5 bg-[#EAEFF5] hover:bg-[#dfe5ec] text-[#042825] font-bold text-sm sm:text-base rounded-full transition-colors cursor-pointer text-center block"
            >
              Keep Shopping
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                onCheckout();
              }}
              className="w-full py-3.5 bg-[#DE1D35] hover:bg-[#c21429] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-full shadow-md transition-all flex items-center justify-center cursor-pointer text-center"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
