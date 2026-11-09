import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata: Metadata = {
  title: "Top Up & Refills — Bitbundle",
  description:
    "Top up prepaid mobile phones with Bitcoin and other cryptocurrencies from anywhere in the world. MTN, Airtel, Glo, 9mobile, and Spectranet supported.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between">
      {/* Dark navy strip behind the transparent header — matches landing page */}
      <div className="fixed top-0 inset-x-0 h-20 bg-[#010C24] z-40 pointer-events-none" />
      <Header />
      <main id="main-content" className="flex-1">
        <ProductsCatalog />
      </main>
      <Footer />
    </div>
  );
}
