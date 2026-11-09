"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDropdown from "./CartDropdown";
import CheckoutModal from "./CheckoutModal";
import ReferFriendModal from "./ReferFriendModal";

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isProductsPage = pathname === "/products" || (pathname?.startsWith("/products") ?? false);

  const { address, isSignedIn, isLoading, signOut } = useAuth();
  const { itemCount, totalUsd, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#010C24]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <nav className="relative flex items-center justify-between h-20" aria-label="Main navigation">
          {/* Logo - aligned with footer logo on the left */}
          <Link
            href="/"
            id="header-logo"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity pl-2 sm:pl-6 lg:pl-8"
          >
            <Image
              src="/assets/logo-header.png"
              alt="Bitbundle"
              width={145}
              height={32}
              className="h-6 sm:h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav - centralized */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/products"
              id="nav-products-btn"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors py-2"
            >
              Top up
            </Link>

            <Link
              href="/#faq"
              id="nav-faqs"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              FAQs
            </Link>

            <button
              type="button"
              id="nav-refer-a-friend"
              onClick={() => setIsReferOpen(true)}
              className="text-sm font-medium text-white hover:text-white/80 transition-colors py-2 cursor-pointer"
            >
              Refer a friend
            </button>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Icon on Product Page - Top Right Corner */}
            {isProductsPage && (
              <div className="relative">
                <button
                  type="button"
                  id="header-cart-btn"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:border-white/30"
                  aria-label="View shopping cart"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-[#00F0A0]" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-[#DE1D35] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    {itemCount > 0 ? `${itemCount} ($${totalUsd.toFixed(2)})` : "Cart (0)"}
                  </span>
                </button>

                <CartDropdown onCheckout={() => setIsCheckoutOpen(true)} />
              </div>
            )}

            {isLoading ? (
              <div className="w-24 h-9 bg-white/10 rounded-full animate-pulse" />
            ) : isSignedIn && address ? (
              <>
                <Link
                  href="/dashboard"
                  id="header-dashboard-btn"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00d4ff]/25 bg-[#00d4ff]/10">
                  <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse-dot" />
                  <span id="header-wallet-address" className="text-xs font-mono font-semibold text-[#00d4ff]">
                    {shortAddress(address)}
                  </span>
                </div>
                <button
                  id="header-signout-btn"
                  onClick={() => signOut()}
                  className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : !isProductsPage ? (
              <Link
                href="/products"
                id="header-buy-airtime-btn"
                className="text-base font-semibold bg-[#00F0A0] hover:bg-[#05e598] text-[#030A16] px-10 py-3 min-w-[170px] text-center rounded-full shadow-[0_2px_12px_rgba(0,240,160,0.25)] hover:shadow-[0_2px_18px_rgba(0,240,160,0.4)] cursor-pointer transition-all duration-200"
              >
                Buy airtime
              </Link>
            ) : null}
          </div>

          {/* Mobile Right Corner: Cart (on product page) + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {isProductsPage && (
              <div className="relative">
                <button
                  type="button"
                  id="mobile-header-cart-btn"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative p-2 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer border border-white/10"
                  aria-label="View shopping cart"
                >
                  <ShoppingCart className="w-5 h-5 text-[#00F0A0]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DE1D35] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </button>
                <CartDropdown onCheckout={() => setIsCheckoutOpen(true)} />
              </div>
            )}

            <button
              id="header-menu-toggle"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/8 transition-colors"
              onClick={() => setIsOpen((v) => !v)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#060B18]/98 backdrop-blur-xl animate-slide-down">
          <div className="container-page py-5 flex flex-col gap-2">
            {/* Top up link */}
            <Link
              href="/products"
              id="mobile-nav-products-btn"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/6 transition-colors"
            >
              Top up
            </Link>

            <Link
              href="/#faq"
              id="mobile-nav-faqs"
              className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/6 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              FAQs
            </Link>

            <button
              type="button"
              id="mobile-nav-refer-a-friend"
              onClick={() => {
                setIsOpen(false);
                setIsReferOpen(true);
              }}
              className="text-base font-medium text-white py-2.5 px-3 rounded-lg hover:bg-white/6 transition-colors text-left cursor-pointer"
            >
              Refer a friend
            </button>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
              {isSignedIn && address ? (
                <>
                  <Link
                    href="/dashboard"
                    id="mobile-dashboard-btn"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-200 py-2.5 px-3 rounded-lg hover:bg-white/6 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 text-xs font-mono font-semibold text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-center">
                    {shortAddress(address)}
                  </div>
                  <button
                    id="mobile-signout-btn"
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-sm font-semibold text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : !isProductsPage ? (
                <Link
                  href="/products"
                  id="mobile-buy-airtime-btn"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold bg-[#00F0A0] hover:bg-[#05e598] text-[#030A16] py-3.5 px-8 rounded-full text-center shadow-[0_2px_12px_rgba(0,240,160,0.25)] hover:shadow-[0_2px_18px_rgba(0,240,160,0.4)] cursor-pointer transition-all duration-200"
                >
                  Buy airtime
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Refer a Friend Modal */}
      <ReferFriendModal isOpen={isReferOpen} onClose={() => setIsReferOpen(false)} />
    </header>
  );
}
