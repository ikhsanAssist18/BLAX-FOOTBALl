import Navbar from "@/components/organisms/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SchedulesCarousel from "@/components/organisms/SchedulesCarousel";
import NewsSection from "@/components/organisms/News";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar useScrollEffect={true} />
      <Hero />
      <SchedulesCarousel />
      <NewsSection />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}
