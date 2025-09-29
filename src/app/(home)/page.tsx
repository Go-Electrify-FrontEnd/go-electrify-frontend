import Image from "next/image";
import { Card } from "@/components/ui/card";
import FeaturesSection from "@/components/features-section";
import NavbarClient from "@/components/home/NavbarClient";
import HeroClient from "@/components/home/HeroClient";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

function TestimonialCard({
  name,
  role,
  company,
  content,
  avatar,
}: TestimonialCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="mr-4 rounded-full"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-muted-foreground text-sm">
            {role} at {company}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground">{content}</p>
    </Card>
  );
}

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <Image
                src="/assets/images/logo01.png"
                alt="Electrify Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold">Electrify</span>
            </div>

            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Empowering the future of electric vehicle charging with
              intelligent management solutions and sustainable technology.
            </p>

            <div className="flex items-center gap-4">
              {[
                {
                  icon: (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.073 4.073 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  ),
                  href: "#",
                  label: "Twitter",
                },
                {
                  icon: (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  href: "#",
                  label: "GitHub",
                },
                {
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  href: "#",
                  label: "Email",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-card hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg p-2 transition-all duration-300 hover:scale-110"
                >
                  <div className="h-4 w-4">{social.icon}</div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-6 font-semibold">Product</h3>
            <ul className="space-y-4">
              {[
                "Features",
                "Pricing",
                "API",
                "Documentation",
                "Integrations",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary text-sm transition-all duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-6 font-semibold">Company</h3>
            <ul className="space-y-4">
              {["About", "Blog", "Careers", "Press", "Partners"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary text-sm transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-6 font-semibold">Support</h3>
            <ul className="space-y-4">
              {["Help Center", "Contact", "Status", "Security", "Privacy"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary text-sm transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground mt-4 text-sm md:mt-0">
            © 2025 Electrify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  const testimonials = [
    {
      content: "Great service and reliable charging stations!",
      name: "John Doe",
      role: "CEO",
      company: "ABC Corp",
      avatar: "/assets/images/avatar01.jpg",
    },
    {
      content: "Effortless management and excellent support.",
      name: "Jane Smith",
      role: "CTO",
      company: "XYZ Inc",
      avatar: "/assets/images/avatar2.png",
    },
    {
      content: "Highly recommend for any EV charging needs.",
      name: "Alice Johnson",
      role: "Manager",
      company: "DEF Ltd",
      avatar: "/assets/images/avatar3.png",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col pt-16 font-sans">
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-20 px-8 py-20">
          {/* Hero Section */}
          <HeroClient />

          {/* Features Section */}
          <section id="features" className="mb-20">
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                Everything you need to manage EV charging
              </h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                Comprehensive tools and insights to optimize your charging
                infrastructure and enhance customer experience.
              </p>
            </div>
            <FeaturesSection />
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="w-full">
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                How It Work
              </h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                A simple step-by-step process to understand how our platform
                helps you manage charging stations efficiently.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Connect Your Stations",
                  description:
                    "Integrate your existing charging infrastructure with our platform in minutes.",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                  ),
                  bgColor: "bg-white dark:bg-black",
                },
                {
                  step: "02",
                  title: "Monitor & Analyze",
                  description:
                    "Track real-time usage, performance metrics, and customer behavior patterns.",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  ),
                  bgColor: "bg-white dark:bg-black",
                },
                {
                  step: "03",
                  title: "Optimize & Scale",
                  description:
                    "Use insights to improve efficiency, reduce costs, and expand your network.",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  bgColor: "bg-white dark:bg-black",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${item.bgColor} rounded-2xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-6xl font-bold text-black opacity-80 dark:text-white">
                      {item.step}
                    </span>
                    <div className="h-12 w-12 text-black dark:text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-black opacity-90 dark:text-white">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="w-full">
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                Trusted by industry leaders
              </h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                See what our customers say about their experience with EVCharge.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full">
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                Pricing
              </h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
                Choose the perfect plan for your EV charging needs. All plans
                include our core features with scalable options.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              {/* Starter Plan */}
              <div className="bg-card border-border hover:border-primary/20 relative rounded-2xl border p-8 transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-card-foreground mb-2 text-2xl font-bold">
                    Starter
                  </h3>
                  <div className="text-card-foreground mb-2 text-4xl font-bold">
                    $19
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Perfect for occasional EV drivers who need reliable access
                    to standard charging.
                  </p>

                  <ul className="mb-8 space-y-4 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Access to standard charging stations
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Charging speed up to 11kW
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        10 charging sessions per month
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Mobile app usage tracking
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Email customer support
                      </span>
                    </li>
                  </ul>

                  <button className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300">
                    Get Starter
                  </button>
                </div>
              </div>

              {/* Pro Plan - Most Popular */}
              <div className="bg-card border-foreground hover:border-foreground/80 relative scale-105 transform rounded-2xl border-2 p-8 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="bg-foreground text-background rounded-full px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-card-foreground mb-2 text-2xl font-bold">
                    Pro
                  </h3>
                  <div className="text-card-foreground mb-2 text-4xl font-bold">
                    $49
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Ideal for frequent drivers who want faster charging and more
                    benefits.
                  </p>

                  <ul className="mb-8 space-y-4 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Access to fast charging stations (up to 50kW)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Unlimited charging sessions
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Priority station booking
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        24/7 customer support
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Real-time station availability
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Monthly usage analytics
                      </span>
                    </li>
                  </ul>

                  <button className="bg-foreground text-background hover:bg-foreground/90 border-foreground w-full rounded-xl border-2 px-6 py-3 font-semibold shadow-lg transition-all duration-300">
                    Choose Pro
                  </button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-card border-border hover:border-primary/20 relative rounded-2xl border p-8 transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-card-foreground mb-2 text-2xl font-bold">
                    Enterprise
                  </h3>
                  <div className="text-card-foreground mb-2 text-4xl font-bold">
                    $35
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Designed for businesses and EV fleets that need scalable
                    charging solutions.
                  </p>

                  <ul className="mb-8 space-y-4 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Ultra-fast charging (up to 350kW)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Dedicated fleet management tools
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Custom billing & invoices
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-card-foreground">
                        Dedicated account manager
                      </span>
                    </li>
                  </ul>

                  <button className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="from-primary/10 to-secondary/10 w-full rounded-3xl bg-gradient-to-r p-16 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Ready to revolutionize your EV charging?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Join hundreds of businesses already using EVCharge to optimize
              their charging infrastructure.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 transform rounded-xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button className="border-border text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border bg-transparent px-8 py-4 font-semibold transition-all duration-300">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16a3 3 0 006 0v-2"
                  />
                </svg>
                Watch Demo
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
