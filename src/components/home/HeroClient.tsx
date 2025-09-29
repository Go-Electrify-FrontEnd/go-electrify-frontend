"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroClient() {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div
      className={`animate-slide-up grid w-full items-center gap-12 lg:grid-cols-2`}
    >
      <div className="order-2 flex justify-center lg:order-1">
        <div className="relative">
          <Image
            src="/assets/images/hero.jpg"
            alt="Modern urban EV charging stations under bridge with city skyline"
            width={512}
            height={384}
            className="w-full max-w-lg rounded-2xl shadow-2xl"
          />
          <div className="bg-primary/20 absolute -top-4 -right-4 h-20 w-20 animate-pulse rounded-full blur-xl"></div>
          <div
            className="bg-secondary/20 absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full blur-xl"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <div className="order-1 flex flex-col items-center gap-8 text-center lg:order-2 lg:items-start lg:text-left">
        <h1 className="text-4xl leading-tight font-bold md:text-6xl">
          <span className={isDark ? "text-white" : "text-black"}>
            Manage your
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            EV Charging Stations
          </span>
          <br />
          <span className={isDark ? "text-white" : "text-black"}>
            Effectively
          </span>
        </h1>

        <p
          className={`max-w-2xl text-xl leading-relaxed md:text-2xl ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          Optimize operations, reduce costs, and deliver a seamless charging
          experience for your customers with our comprehensive management
          platform.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:flex-row lg:w-auto">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`flex-1 rounded-xl border px-6 py-4 transition-all duration-300 focus:ring-2 focus:ring-green-500/20 focus:outline-none sm:w-80 ${isDark ? "border-gray-600 bg-gray-800 text-white placeholder-gray-400" : "border-gray-300 bg-white text-black placeholder-gray-500"}`}
            />
            <button
              onClick={handleSubmit}
              className={`bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 rounded-xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 ${isDark ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}
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
  );
}
