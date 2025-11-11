"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  ComponentProps,
  createContext,
  HTMLAttributes,
  useContext,
  useState,
} from "react";

type ReasoningContextType = {
  isOpen: boolean;
  toggle: () => void;
  isStreaming: boolean;
};

const ReasoningContext = createContext<ReasoningContextType | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  defaultOpen?: boolean;
};

export const Reasoning = ({
  children,
  className,
  isStreaming = false,
  defaultOpen = false,
  ...props
}: ReasoningProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <ReasoningContext.Provider value={{ isOpen, toggle, isStreaming }}>
      <div
        className={cn(
          "rounded-lg border border-muted bg-muted/50 overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = ComponentProps<typeof Button>;

export const ReasoningTrigger = ({
  children,
  className,
  ...props
}: ReasoningTriggerProps) => {
  const { isOpen, toggle, isStreaming } = useReasoning();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={cn(
        "w-full justify-between px-3 py-2 h-auto font-normal text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {isStreaming ? (
          <>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:0.2s]" />
              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]" />
            </span>
            {children || "Thinking..."}
          </>
        ) : (
          children || "View reasoning"
        )}
      </span>
      <ChevronDown
        className={cn(
          "size-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </Button>
  );
};

export type ReasoningContentProps = HTMLAttributes<HTMLDivElement>;

export const ReasoningContent = ({
  children,
  className,
  ...props
}: ReasoningContentProps) => {
  const { isOpen } = useReasoning();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "border-t border-muted px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
