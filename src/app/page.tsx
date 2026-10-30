import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorks from "@/components/HowItWorks";
import RealLifeSection from "@/components/RealLifeSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#060B18] text-white selection:bg-[#00E599]/30 selection:text-[#00E599]">
      <Header />
      <main id="main-content">
        <HeroSection />
        <TestimonialsSection />
        <HowItWorks />
        <RealLifeSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
