"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Trash2, Gift, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartDropdownProps {
  onCheckout: () => void;
}

export default function CartDropdown({ onCheckout }: CartDropdownProps) {
  const { items, isCartOpen, setIsCartOpen, removeItem, totalUsd, totalNgn } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
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
      className="absolute right-0 top-full mt-2 w-80 sm:w-92 bg-white rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] border border-gray-100 p-4 text-gray-900 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gray-700" />
          <span className="font-extrabold text-sm text-gray-900">Your Cart</span>
          <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => setIsCartOpen(false)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close cart"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2 stroke-[1.5]" />
          <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
          <p className="text-xs text-gray-400 mt-1">Add mobile airtime or gifts to checkout.</p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100"
            >
              {/* Operator Logo Thumbnail */}
              <div className="shrink-0 mt-0.5">
                {item.networkId === "mtn" ? (
                  <div className="w-9 h-7 rounded-md bg-[#FFCC00] flex items-center justify-center p-0.5 border border-black/10 shadow-xs">
                    <div className="w-full h-full border border-black rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-black tracking-tighter text-black">MTN</span>
                    </div>
                  </div>
                ) : item.networkId === "airtel" ? (
                  <div className="w-9 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs">
                    <Image
                      src="/assets/airtel-brand-logo.png"
                      alt="Airtel"
                      width={32}
                      height={14}
                      className="w-auto h-3.5 object-contain"
                    />
                  </div>
                ) : item.networkId === "glo" ? (
                  <div className="w-9 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center p-0.5 shadow-xs">
                    <Image
                      src="/assets/glo.jpg"
                      alt="Glo"
                      width={28}
                      height={28}
                      className="w-5 h-5 object-cover rounded-xs"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-7 rounded-md bg-[#045F40] flex items-center justify-center p-0.5 shadow-xs">
                    <span className="text-[9px] font-bold text-white">9mobile</span>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.networkName}</h4>
                </div>

                <p className="text-xs text-gray-500 font-mono mt-0.5">{item.phoneNumber}</p>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold text-gray-900">
                    {item.amountNgn.toLocaleString()} NGN
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    ${item.amountUsd.toFixed(2)}
                  </span>
                </div>

                {/* Gift tag */}
                {item.isGift && (
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 bg-[#DE1D35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      <Gift className="w-2.5 h-2.5" />
                      Gift
                    </span>
                  </div>
                )}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                aria-label={`Remove ${item.networkName} from cart`}
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary & Checkout */}
      {items.length > 0 && (
        <div className="pt-3 border-t border-gray-100 mt-3">
          <div className="flex items-center justify-between py-1 mb-3">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <div className="text-right">
              <span className="text-sm font-extrabold text-gray-900">${totalUsd.toFixed(2)}</span>
              <span className="text-[11px] text-gray-400 block font-mono">
                ≈ {totalNgn.toLocaleString()} NGN
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCartOpen(false);
              onCheckout();
            }}
            className="w-full py-3 bg-[#DE1D35] hover:bg-[#c21429] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
