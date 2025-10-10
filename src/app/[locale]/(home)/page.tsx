import LandingHeader from "@/components/landing/landing-header";
import LandingHero from "@/components/landing/landing-hero";
import LandingLocations from "@/components/landing/landing-locations";
import LandingPricing from "@/components/landing/landing-pricing";
import LandingFooter from "@/components/landing/landing-footer";
import { LandingGuaranteeCarousel } from "@/components/landing/landing-guruantee-carousel";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <LandingHeader />
      <LandingHero />
      <LandingLocations />
      <LandingGuaranteeCarousel />
      <LandingPricing />
      <LandingFooter />
    </div>
  );
}
