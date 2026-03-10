import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryBanner from "@/components/CategoryBanner";
import BestSellers from "@/components/BestSellers";
import SpecialOffer from "@/components/SpecialOffer";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <CategoryBanner />
      <SpecialOffer />
      <BestSellers />
      <Footer />
    </div>
  );
};

export default Index;
