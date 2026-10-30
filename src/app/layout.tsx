import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

const toshB = localFont({
  src: [
    {
      path: "../fonts/TRYToshB-Thin-BF677df27a680ff.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Light-BF677df27a54b9d.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Regular-BF677df27a4c491.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Medium-BF677df27a667bb.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Bold-BF677df279b315e.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Bold-BF677df279b315e.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Black-BF677df279930bb.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/TRYToshB-Black-BF677df279930bb.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-tosh",
  display: "swap",
});

const ppMori = localFont({
  src: [
    {
      path: "../fonts/PPMori-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/PPMori-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PPMori-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/PPMori-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/PPMori-SemiBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/PPMori-SemiBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-mori",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bitbundle — Buy Airtime with Crypto",
  description:
    "Pay with crypto and get mobile airtime in seconds. MTN, Airtel, Glo, and 9mobile supported. Fast, secure, and decentralized.",
  keywords: ["airtime", "crypto", "MTN", "Airtel", "Glo", "9mobile", "blockchain"],
  openGraph: {
    title: "Bitbundle — Buy Airtime with Crypto",
    description: "Pay with crypto. Get airtime in seconds.",
    type: "website",
    locale: "en_US",
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
    <html lang="en" className={`${toshB.variable} ${ppMori.variable} h-full`}>
      <body className={`${ppMori.className} min-h-full flex flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
