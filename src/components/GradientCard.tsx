
import React from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradientHeight?: string;
  gradientClassName?: string;
}

export default function GradientCard({
  children,
  className,
  gradientHeight = "h-2.5",
  gradientClassName
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
          "bg-gradient-to-r from-primary to-secondary",
          gradientClassName
        )}
      />
      <div className="p-5 md:p-7">{children}</div>
    </div>
  );
}
