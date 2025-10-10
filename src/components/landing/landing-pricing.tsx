"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Battery } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type PlanKey = "payg" | "basic" | "pro" | "enterprise";

type PlanContent = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  note: string;
  features: string[];
  ctaLabel: string;
  ctaVariant: "default" | "outline";
  highlightLabel?: string;
};

export default function LandingPricing() {
  const pricing = useTranslations("landing.pricing");
  const planOrder: PlanKey[] = ["payg", "basic", "pro", "enterprise"];
  const plans = planOrder.map((key) => {
    const content = pricing.raw(`plans.${key}`) as PlanContent;
    return { key, content };
  });

  return (
    <section id="pricing" className="container mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {pricing("title")}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {pricing("description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map(({ key, content }) => (
          <div key={key}>
            <Card
              className={
                key === "pro"
                  ? "border-primary bg-card hover:shadow-3xl relative flex flex-col border-2 p-8 shadow-2xl transition-all"
                  : "border-border/50 bg-card relative flex flex-col p-8 shadow-lg transition-all hover:shadow-xl"
              }
            >
              {content.highlightLabel ? (
                <div className="bg-primary text-muted absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold">
                  {content.highlightLabel}
                </div>
              ) : null}

              <div className="mb-6">
                <h3 className="text-foreground mb-2 text-2xl font-bold">
                  {content.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {content.tagline}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{content.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {content.unit}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {content.note}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {content.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={
                  content.ctaVariant === "outline" ? "outline" : "default"
                }
              >
                {content.ctaLabel}
              </Button>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          {pricing("disclaimer")}{" "}
          <Link
            href="#contact"
            className="text-primary font-semibold hover:underline"
          >
            {pricing("contactLink")}
          </Link>{" "}
          {pricing("disclaimerSuffix")}
        </p>
      </div>
    </section>
  );
}
