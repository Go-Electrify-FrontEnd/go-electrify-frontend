"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThinkingIndicator } from "./thinking-indicator";

/**
 * Demo component to visualize both thinking indicator variants
 * This is for development/testing purposes only
 *
 * Usage: Import this in a test page to see the animations
 */
export function ThinkingDemo() {
  const [showSimple, setShowSimple] = useState(true);
  const [showDetailed, setShowDetailed] = useState(true);

  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Thinking Indicator Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Simple variant */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Simple Variant</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSimple(!showSimple)}
            >
              {showSimple ? "Hide" : "Show"}
            </Button>
          </div>
          {showSimple && (
            <div className="rounded-lg border p-4">
              <ThinkingIndicator variant="simple" />
            </div>
          )}
        </div>

        {/* Detailed variant */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Detailed Variant (Future: With Reasoning)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailed(!showDetailed)}
            >
              {showDetailed ? "Hide" : "Show"}
            </Button>
          </div>
          {showDetailed && (
            <div className="rounded-lg border p-4">
              <ThinkingIndicator
                variant="detailed"
                thinkingText="Let me analyze this question about EV charging stations. First, I need to consider the user's location, then check available stations nearby, and finally provide recommendations based on charging speed and availability."
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">About these variants:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Simple:</strong> Currently used in production. Shows basic
              thinking animation.
            </li>
            <li>
              <strong>Detailed:</strong> Ready for when AI models expose
              reasoning tokens (e.g., OpenAI o1, DeepSeek R1).
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
