import LandingHeader from "@/components/landing/landing-header";
import LandingHero from "@/components/landing/landing-hero";
import LandingBrands from "@/components/landing/landing-brands";
import LandingLocations from "@/components/landing/landing-locations";
import LandingPricing from "@/components/landing/landing-pricing";
import LandingFooter from "@/components/landing/landing-footer";
import { LandingGuaranteeCarousel } from "@/components/landing/landing-guruantee-carousel";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <LandingHero />
      <LandingLocations />
      <LandingGuaranteeCarousel />
      <LandingBrands />
      <LandingPricing />
      <LandingFooter />
    </div>
  );
}
