import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata: Metadata = {
  title: "Products & Refills — Bitbundle",
  description:
    "Top up prepaid mobile phones with Bitcoin and other cryptocurrencies from anywhere in the world. MTN, Airtel, Glo, 9mobile, and Spectranet supported.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between">
      <Header />
      <main id="main-content" className="flex-1">
        <ProductsCatalog />
      </main>
      <Footer />
    </div>
  );
}
