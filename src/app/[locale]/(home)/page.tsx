import LandingHeader from "@/components/landing/landing-header";
import LandingHero from "@/components/landing/landing-hero";
import LandingLocations from "@/components/landing/landing-locations";
import LandingPricing from "@/components/landing/landing-pricing";
import LandingFooter from "@/components/landing/landing-footer";
import { LandingGuaranteeCarousel } from "@/components/landing/landing-guruantee-carousel";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale as "en" | "vi");

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
