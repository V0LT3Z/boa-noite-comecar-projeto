
import React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradientHeight?: string;
  gradientClassName?: string;
  gradientColors?: string;
  noGradient?: boolean;
}

export default function GradientCard({
  children,
  className,
  gradientHeight = "h-1", 
  gradientClassName,
  gradientColors = "from-primary to-primary/80", // Updated to use purple shades
  noGradient = false
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl shadow-md bg-white/90 border border-transparent overflow-hidden transition-colors",
        className
      )}
    >
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
