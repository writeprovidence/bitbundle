"use client";

import Image from "next/image";
import Link from "next/link";

function TwitterIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.1H5.06v8.4h2.8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#050A18] text-white pt-32 sm:pt-40 lg:pt-48 pb-12 relative overflow-hidden"
    >
      <div className="container-page relative z-10 max-w-6xl mx-auto">
        {/* Top 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Column 1: Follow Us */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-tosh text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <TelegramIcon />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <DiscordIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-tosh text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="font-tosh space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  MTN
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Airtel
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Glo
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  9mobile
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-tosh text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="font-tosh space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a
                  href="https://address-patterns-jones-geometry.trycloudflare.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Help
                </a>
              </li>
              <li>
                <a href="mailto:support@bitbundle.xyz" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:support@bitbundle.xyz?subject=Product%20Request" className="hover:text-white transition-colors">
                  Product Request
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-tosh text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="font-tosh space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Refer a Friend
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 className="font-tosh text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="font-tosh space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Legal Line */}
        <div className="font-tosh flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-xs text-gray-500">
          <p>Copyright © Bitbundle 2026. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Massive Giant Bitbundle Brand Logo at Bottom */}
        <div className="pt-6 pb-2 flex justify-center">
          <div className="w-full max-w-4xl px-4">
            <Image
              src="/assets/logo-footer.png"
              alt="Bitbundle"
              width={1000}
              height={180}
              className="w-full h-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
