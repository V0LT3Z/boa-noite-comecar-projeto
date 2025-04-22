
import React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradientHeight?: string;
  gradientClassName?: string;
  gradientColors?: string;
}

export default function GradientCard({
  children,
  className,
  gradientHeight = "h-1", // Reduced default height
  gradientClassName,
  gradientColors = "from-primary to-secondary" // Allow custom gradient colors
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl shadow-md bg-white/90 border border-transparent overflow-hidden transition-colors",
        className
      )}
    >
      {/* Top gradient bar */}
      <div
        className={cn(
          "w-full",
          gradientHeight,
          `bg-gradient-to-r ${gradientColors}`,
          gradientClassName
        )}
      />
      <div className="p-5 md:p-7">{children}</div>
    </div>
  );
}
