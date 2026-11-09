import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InstantAirtimeSection from "@/components/InstantAirtimeSection";
import HowItWorks from "@/components/HowItWorks";
import MobileNetworksSection from "@/components/MobileNetworksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#010C24] text-white selection:bg-[#00E599]/30 selection:text-[#00E599]">
      <Header />
      <main id="main-content">
        {/* Solid dark navy background matching reference - seamless with no dividing line or gradients */}
        <div className="relative bg-[#010C24]">
          <HeroSection />
          <InstantAirtimeSection />
          <HowItWorks />
        </div>

        <MobileNetworksSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
