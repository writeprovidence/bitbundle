"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "FAQs", href: "#faq" },
  { label: "Invite a friend", href: "#invite" },
];

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { address, isSignedIn, isLoading, signIn, signOut } = useAuth();

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
          {/* Logo */}
          <Link
            href="/"
            id="header-logo"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
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
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
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
            ) : (
              <>
                <button
                  id="header-signin-btn"
                  onClick={() => signIn()}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-white/90 hover:text-white px-6 py-2.5 rounded-full border-[1.5px] border-white/50 hover:border-white/80 hover:bg-white/5 transition-all"
                >
                  <User className="w-[18px] h-[18px] text-white/85" />
                  <span>Log in</span>
                </button>
                <a
                  href="#faq"
                  id="header-help-btn"
                  className="text-[15px] font-semibold bg-[#00F0A0] text-[#030A16] px-6 py-2.5 rounded-full shadow-[0_0_24px_rgba(0,240,160,0.5)] hover:shadow-[0_0_32px_rgba(0,240,160,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Need Help?
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="header-menu-toggle"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/8 transition-colors"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#060B18]/98 backdrop-blur-xl animate-slide-down">
          <div className="container-page py-5 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-base font-medium text-gray-200 py-2.5 px-3 rounded-lg hover:bg-white/6 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
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
              ) : (
                <>
                  <button
                    id="mobile-signin-btn"
                    onClick={() => { signIn(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2.5 text-[15px] font-medium text-white border-[1.5px] border-white/50 hover:border-white/80 py-3 px-5 rounded-full hover:bg-white/5 transition-colors text-center"
                  >
                    <User className="w-[18px] h-[18px] text-white/85" />
                    <span>Log in</span>
                  </button>
                  <a
                    href="#faq"
                    id="mobile-help-btn"
                    onClick={() => setIsOpen(false)}
                    className="text-[15px] font-semibold bg-[#00F0A0] text-[#030A16] py-3 px-5 rounded-full text-center shadow-[0_0_24px_rgba(0,240,160,0.5)]"
                  >
                    Need Help?
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
