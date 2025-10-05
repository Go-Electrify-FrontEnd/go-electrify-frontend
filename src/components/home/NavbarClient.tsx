"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ModeToggle } from "../shared/mode-toggle";

export default function NavbarClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/images/logo01.png"
                alt="Electrify Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-foreground text-2xl font-bold">
                Electrify
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <ModeToggle />
            <Link
              href="/login"
              prefetch={false}
              className={buttonVariants({ variant: "default" })}
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="bg-card/80 border-border hover:bg-muted rounded-full border p-3 backdrop-blur-md transition-all duration-300 hover:scale-110"
            >
              {isDark ? (
                <svg
                  className="text-primary h-5 w-5"
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
                  className="text-foreground h-5 w-5"
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-all duration-300"
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
          <div className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary text-sm font-medium transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="border-border flex flex-col space-y-2 border-t pt-4">
                <button className="text-muted-foreground hover:text-foreground px-4 py-2 text-left text-sm font-medium transition-all duration-300">
                  Sign In
                </button>
                <button className="text-primary-foreground bg-primary hover:bg-primary/90 transform rounded-lg px-6 py-2 text-left text-sm font-semibold transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
