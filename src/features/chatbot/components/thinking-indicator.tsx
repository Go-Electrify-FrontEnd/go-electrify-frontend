"use client";

import { Brain } from "lucide-react";
import { motion } from "framer-motion";

interface ThinkingIndicatorProps {
  variant?: "simple" | "detailed";
  thinkingText?: string;
}

export function ThinkingIndicator({
  variant = "simple",
  thinkingText,
}: ThinkingIndicatorProps) {
  if (variant === "simple") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-lg bg-muted px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.15,
                }}
              />
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant with expandable reasoning (for future use)
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2">
        {/* Thinking card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Brain className="size-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">
                  Reasoning
                </span>
                <div className="flex gap-1">
                  <motion.span
                    className="size-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.span
                    className="size-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                  <motion.span
                    className="size-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </div>
              </div>
              {thinkingText && (
                <p className="text-xs text-muted-foreground">{thinkingText}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Response is being generated indicator */}
        <div className="rounded-lg bg-muted px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.span
                className="size-2 rounded-full bg-foreground/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Generating response...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
