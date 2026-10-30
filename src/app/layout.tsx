import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = localFont({
  src: [
    {
      path: "../fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bitbundle — Buy Airtime with Crypto",
  description:
    "Pay with USDT and get Nigerian airtime in seconds. MTN, Airtel, Glo, and 9mobile supported. Fast, secure, and decentralized.",
  keywords: ["airtime", "crypto", "USDT", "Nigeria", "MTN", "Airtel", "Glo", "9mobile", "blockchain"],
  openGraph: {
    title: "Bitbundle — Buy Airtime with Crypto",
    description: "Pay with crypto. Get airtime in seconds.",
    type: "website",
    locale: "en_NG",
    siteName: "Bitbundle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitbundle — Buy Airtime with Crypto",
    description: "Pay with crypto. Get airtime in seconds.",
  },
  metadataBase: new URL("https://bitbundle.xyz"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
