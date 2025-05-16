
import React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradientHeight?: string;
  gradientClassName?: string;
  gradientColors?: string;
  noGradient?: boolean; // Option to disable gradient completely
}

export default function GradientCard({
  children,
  className,
  gradientHeight = "h-1", // Thin default height
  gradientClassName,
  gradientColors = "from-primary to-secondary", // Allow custom gradient colors
  noGradient = false
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl shadow-md bg-white/90 border border-transparent overflow-hidden transition-colors font-gooddog",
        className
      )}
    >
      {/* Top gradient bar - only if not disabled */}
      {!noGradient && (
        <div
          className={cn(
            "w-full",
            gradientHeight,
            `bg-gradient-to-r ${gradientColors}`,
            gradientClassName
          )}
        />
      )}
      <div className="p-5 md:p-7">{children}</div>
    </div>
  );
}
