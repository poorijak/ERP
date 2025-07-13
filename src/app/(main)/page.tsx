import FeatureProduct from "@/components/customer-page/home/feature-product";
import HeroSection from "@/components/customer-page/home/hero";

const HomePage = async () => {
  return (
    <div className="flex flex-col gap-6 md:gap-12">
      <HeroSection />
      <FeatureProduct />
    </div>
  );
};
export default HomePage;
