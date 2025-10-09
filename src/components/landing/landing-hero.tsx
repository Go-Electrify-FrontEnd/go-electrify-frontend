"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LandingHero() {
  const hero = useTranslations("landing.hero");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/charging-station-clean.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-[800px] space-y-12 text-center">
          <h1 className="text-5xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
            <span className="bg-green-400 bg-gradient-to-r bg-clip-text text-transparent">
              {hero("highlight")}
            </span>
            <br />
            <span className="text-white drop-shadow-lg">
              {hero("headline")}
            </span>
          </h1>

          <p className="mx-auto max-w-[600px] text-lg leading-relaxed font-medium text-white/95 drop-shadow-lg md:text-xl">
            {hero("description")}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="border border-green-500/20 bg-green-600 text-white shadow-2xl transition-all hover:scale-105 hover:bg-green-700 hover:shadow-green-500/25"
            >
              {hero("primaryCta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md hover:border-white/60 hover:bg-white/25"
            >
              {hero("secondaryCta")}
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                {hero("stats.locations.value")}
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                {hero("stats.locations.label")}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                {hero("stats.averageSession.value")}
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                {hero("stats.averageSession.label")}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                {hero("stats.savings.value")}
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                {hero("stats.savings.label")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
