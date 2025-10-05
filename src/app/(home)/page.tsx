import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Battery } from "lucide-react";
import Image from "next/image";
import { HelpCircle, Globe, User } from "lucide-react";
import FeatureCarousel from "@/components/FeatureCarousel";
import GlobeDemo from "@/components/test";
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="absolute top-10 right-0 left-0 z-10 bg-transparent">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          {/* Giữ khoảng trống bên trái */}
          <div className="w-1/3"></div>

          {/* Menu ở giữa */}
          <nav className="flex flex-6 justify-center space-x-20 pt-4">
            <a href="#" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              HIW
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          {/* 3 Icon bên phải */}
          <div className="flex w-1/3 items-center justify-end space-x-6 pt-4">
            <HelpCircle className="text-primary-foreground hover:text-primary h-6 w-6 cursor-pointer" />
            <Globe className="text-primary-foreground hover:text-primary h-6 w-6 cursor-pointer" />
            <User className="text-primary-foreground hover:text-primary h-6 w-6 cursor-pointer" />
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/charging-station-clean.jpg"
            alt="Hero Background"
            fill
            priority
            className="brightness-[0.2]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-[800px] space-y-8 text-center">
            <h2 className="text-6xl font-bold tracking-tight text-white">
              Fast Charging <br />
              <span className="text-primary">for Everyone</span>
            </h2>

            <p className="text-muted-foreground mx-auto max-w-[600px] text-xl">
              Join the largest network of electric vehicle charging stations.
              Quick, reliable, and everywhere you need to be.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Find Stations
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-primary text-4xl font-bold">70k+</div>
                <div className="text-muted-foreground">Global Stations</div>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-4xl font-bold">15m</div>
                <div className="text-muted-foreground">Average Charge</div>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-4xl font-bold">60%</div>
                <div className="text-muted-foreground">Cost Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section with Image + Text */}
      <section className="bg-background w-full pt-10">
        <div className="grid grid-cols-[40%_60%]">
          {/* Left text */}
          <div className="flex flex-col justify-center px-12 py-20">
            <h2 className="text-primary mb-4 text-3xl font-bold">Locations</h2>
            <h3 className="text-primary-foreground mb-4 text-xl font-semibold">
              Go Anywhere
            </h3>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              With over 70,000 fast-charging stations worldwide, we operate one
              of the largest global networks for electric vehicles.
              Strategically located along major routes and near convenient
              amenities, our chargers keep you powered wherever you travel.
              Simply plug in, recharge, and continue your journey with ease.
            </p>
            <Button className="hover:bg-primary/80">Find Us</Button>
          </div>

          {/* Right image full area */}
          <div className="h-full w-full">
            <GlobeDemo />
          </div>
        </div>
      </section>

      {/* Hero Product Section */}
      <>
        <FeatureCarousel />
      </>

      {/* Charging Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Power Your Journey with
            <br />
            Smart Charging Solutions
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Experience the future of electric vehicle charging with our
            comprehensive ecosystem of services.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <Card className="border-accent-foreground bg-background p-8 text-center">
            <div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-primary mb-3 text-xl font-semibold">
              SMART CHARGING
            </h3>
            <p className="text-muted-foreground">
              AI-powered charging optimization that adapts to your schedule and
              energy costs for maximum efficiency.
            </p>
          </Card>

          <Card className="border-accent-foreground p-8 text-center">
            <div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-primary mb-3 text-xl font-semibold">
              SMART CHARGING
            </h3>
            <p className="text-muted-foreground">
              AI-powered charging optimization that adapts to your schedule and
              energy costs for maximum efficiency.
            </p>
          </Card>

          <Card className="border-accent-foreground p-8 text-center">
            <div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-primary mb-3 text-xl font-semibold">
              SMART CHARGING
            </h3>
            <p className="text-muted-foreground">
              AI-powered charging optimization that adapts to your schedule and
              energy costs for maximum efficiency.
            </p>
          </Card>
        </div>
      </section>

      {/* Case Study */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12">
            <h3 className="mb-6 text-3xl font-bold">
              REDUCE CHARGING
              <br />
              TIME BY 60%
              <br />
              WITH SMART ROUTING
            </h3>
            <p className="mb-8 text-lg">
              See how our intelligent charging network helped drivers save time
              and reduce costs across the country.
            </p>
            <Button className="bg-background text-primary-foreground hover:bg-accent">
              Read Case Study
            </Button>
          </div>
          <div className="bg-accent flex items-center justify-center rounded-2xl p-12">
            <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-full">
              <Play className="text-muted-foreground h-12 w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-primary-foreground mb-6 text-4xl font-bold">
            FINALLY, EV CHARGING
            <br />
            THAT WORKS FOR
            <br />
            YOUR LIFESTYLE.
          </h2>
          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl leading-relaxed">
            We dont just provide charging stations, we create an ecosystem that
            understands your driving patterns, optimizes your routes, and
            ensures youre always powered up. Experience the difference of truly
            intelligent charging infrastructure.
          </p>
        </div>

        {/* Company Logos */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            "TESLA",
            "BMW",
            "AUDI",
            "MERCEDES",
            "NISSAN",
            "VOLKSWAGEN",
            "FORD",
            "HYUNDAI",
          ].map((company) => (
            <div
              key={company}
              className="border-accent bg-background flex items-center justify-center rounded-lg border p-6"
            >
              <span className="text-muted-foreground font-semibold">
                {company}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-primary-foreground mb-6 text-3xl font-bold">
            DRIVE THE FUTURE
            <br />
            WITH CHARGINGSTATION.
          </h3>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            The ChargingStation network provides comprehensive coverage across
            the nation with smart technology that adapts to your needs. Join the
            electric revolution today.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            Start Charging Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-accent border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              {/* <div className="mb-4 text-xl font-bold">ChargingStation</div> */}
              <Image
                src="/assets/images/logo01.png"
                alt="Logo"
                width={100}
                height={60}
                className="h-20 w-20"
              />
              <span className="text-primary-foreground text-2xl font-bold">
                Electrify
              </span>
              <p className="text-muted-foreground">
                The future of electric vehicle charging is here.
              </p>
            </div>
            <div>
              <h4 className="text-primary mb-4 font-semibold">Services</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Find Stations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Business Solutions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary mb-4 font-semibold">Company</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary mb-4 font-semibold">Support</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Mobile App
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    24/7 Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-accent text-muted-foreground mt-12 border-t pt-8 text-center">
            <p>&copy; 2025 ChargingStation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
