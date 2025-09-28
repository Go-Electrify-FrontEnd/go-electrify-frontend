"use client";

import { useState } from "react";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import FeaturesSection from "@/components/features-section";

interface ModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ModeToggle = ({ isDark, onToggle }: ModeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-full bg-card/80 backdrop-blur-md border border-border hover:bg-muted transition-all duration-300 hover:scale-110"
    >
      {isDark ? (
        <svg
          className="h-5 w-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

interface NavbarProps {
  isDark: boolean;
  onToggle: () => void;
}

const Navbar = ({ isDark, onToggle }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/images/logo01.png"
                alt="Electrify Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-foreground">
                Electrify
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle isDark={isDark} onToggle={onToggle} />
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300">
              Sign In
            </button>
            <button className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ModeToggle isDark={isDark} onToggle={onToggle} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              {isMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 text-left">
                  Sign In
                </button>
                <button className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 text-left">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

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
      <div className="flex items-start mb-4">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/assets/images/logo01.png"
                alt="Electrify Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold">Electrify</span>
            </div>

            <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
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
                  className="p-2 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <div className="h-4 w-4">{social.icon}</div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-foreground">Product</h3>
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
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-foreground">Company</h3>
            <ul className="space-y-4">
              {["About", "Blog", "Careers", "Press", "Partners"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-foreground">Support</h3>
            <ul className="space-y-4">
              {["Help Center", "Contact", "Status", "Security", "Privacy"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-12 border-t border-border">
          <p className="text-sm mt-4 md:mt-0 text-muted-foreground">
            © 2025 Electrify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Email submitted:", email);
    setEmail("");
  };

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
    <div
      className={`min-h-screen bg-background text-foreground ${
        isDark ? "dark" : ""
      }`}
    >
      <Navbar isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      <div className="relative z-10 font-sans flex flex-col min-h-screen pt-16">
        <main className="flex flex-col gap-20 items-center max-w-7xl w-full mx-auto px-8 py-20 flex-1">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full animate-slide-up">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="Modern urban EV charging stations under bridge with city skyline"
                  width={512}
                  height={384}
                  className="rounded-2xl shadow-2xl w-full max-w-lg"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className={isDark ? "text-white" : "text-black"}>
                  Manage your
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                  EV Charging Stations
                </span>
                <br />
                <span className={isDark ? "text-white" : "text-black"}>
                  Effectively
                </span>
              </h1>

              <p
                className={`text-xl md:text-2xl max-w-2xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Optimize operations, reduce costs, and deliver a seamless
                charging experience for your customers with our comprehensive
                management platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full lg:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300 flex-1 sm:w-80 ${
                      isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    }`}
                  />
                  <button
                    onClick={handleSubmit}
                    className={`px-8 py-4 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-300 shadow-lg flex items-center gap-2 ${
                      isDark
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Get Started
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section id="features" className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Everything you need to manage EV charging
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools and insights to optimize your charging
                infrastructure and enhance customer experience.
              </p>
            </div>
            <FeaturesSection />
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                How It Work
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A simple step-by-step process to understand how our platform
                helps you manage charging stations efficiently.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
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
                  className={`${item.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-6xl font-bold text-black dark:text-white opacity-80">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 text-black dark:text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-black dark:text-white opacity-90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Trusted by industry leaders
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what our customers say about their experience with EVCharge.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your EV charging needs. All plans
                include our core features with scalable options.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 relative">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                    Starter
                  </h3>
                  <div className="text-4xl font-bold mb-2 text-card-foreground">
                    $19
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Perfect for occasional EV drivers who need reliable access
                    to standard charging.
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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

                  <button className="w-full px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-300 shadow-lg">
                    Get Starter
                  </button>
                </div>
              </div>

              {/* Pro Plan - Most Popular */}
              <div className="p-8 rounded-2xl bg-card border-2 border-foreground hover:border-foreground/80 transition-all duration-300 relative transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-foreground text-background px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                    Pro
                  </h3>
                  <div className="text-4xl font-bold mb-2 text-card-foreground">
                    $49
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Ideal for frequent drivers who want faster charging and more
                    benefits.
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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

                  <button className="w-full px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-300 shadow-lg border-2 border-foreground">
                    Choose Pro
                  </button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 relative">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                    Enterprise
                  </h3>
                  <div className="text-4xl font-bold mb-2 text-card-foreground">
                    $35
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Designed for businesses and EV fleets that need scalable
                    charging solutions.
                  </p>

                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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
                        className="h-5 w-5 text-green-500 flex-shrink-0"
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

                  <button className="w-full px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all duration-300 shadow-lg">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to revolutionize your EV charging?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses already using EVCharge to optimize
              their charging infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-xl bg-transparent border border-border text-foreground font-semibold hover:bg-muted transition-all duration-300 flex items-center gap-2">
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
