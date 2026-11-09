"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Sparkles, MessageSquare } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartDropdown from "./CartDropdown";

interface CategoryNavbarProps {
  activeCategory?: "gift-cards" | "esims" | "phone-refills";
  onSelectCategory?: (category: "gift-cards" | "esims" | "phone-refills") => void;
  onOpenAssistant?: () => void;
  onCheckout?: () => void;
}

export default function CategoryNavbar({
  activeCategory = "phone-refills",
  onSelectCategory,
  onOpenAssistant,
  onCheckout,
}: CategoryNavbarProps) {
  const { itemCount, isCartOpen, setIsCartOpen } = useCart();
  const [currentTab, setCurrentTab] = useState<"gift-cards" | "esims" | "phone-refills">(activeCategory);

  const handleTabClick = (tab: "gift-cards" | "esims" | "phone-refills") => {
    setCurrentTab(tab);
    if (onSelectCategory) onSelectCategory(tab);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Navigation Categories */}
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2">
            <button
              type="button"
              onClick={() => handleTabClick("gift-cards")}
              className={`text-sm sm:text-base font-bold transition-all relative py-3 whitespace-nowrap cursor-pointer ${
                currentTab === "gift-cards"
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Gift Cards
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("esims")}
              className={`text-sm sm:text-base font-bold transition-all relative py-3 whitespace-nowrap cursor-pointer ${
                currentTab === "esims"
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              eSIMs
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("phone-refills")}
              className={`text-sm sm:text-base font-bold transition-all relative py-3 whitespace-nowrap cursor-pointer ${
                currentTab === "phone-refills"
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Phone Top-ups
            </button>
          </nav>

          {/* Right actions: Ask Assistant & Cart Button with Popover */}
          <div className="relative flex items-center gap-3 shrink-0">
            {/* Ask Assistant button */}
            <button
              type="button"
              onClick={onOpenAssistant}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Assistant</span>
            </button>

            {/* Cart Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DE1D35] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Cart flyout dropdown */}
              <CartDropdown onCheckout={onCheckout || (() => {})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
