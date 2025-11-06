import FooterSection from "@/features/landing/footer";
import HeroSection from "@/features/landing/hero-section";
import TeamSection from "@/features/landing/team";
import {
  CheaperPriceCard,
  OnlinePaymentCard,
  ReservationSlotCard,
  SupportCard,
} from "@/components/ui/feature-cards-canvas";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <HeroSection />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CheaperPriceCard />
            <ReservationSlotCard />
            <SupportCard />
            <OnlinePaymentCard />
          </div>
        </div>
      </section>
      <TeamSection />
      <FooterSection />
    </main>
  );
}
