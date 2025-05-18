
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface EventImageHeaderProps {
  image: string;
  handleBackToHome: () => void;
  isMobile: boolean;
}

export const EventImageHeader = ({ image, handleBackToHome, isMobile }: EventImageHeaderProps) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden h-56 shadow-md mb-1">
      <div className="relative pt-4 pl-4 absolute z-10">
        <BackButton onClick={handleBackToHome} />
      </div>
      <img
        src={image || '/placeholder.svg'}
        alt="Event"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const BackButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="flex items-center gap-1.5 py-1.5 px-4 rounded-md bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 text-primary shadow-sm border border-white/40"
  >
    <ArrowLeft className="h-4 w-4" />
    <span className="font-medium">Voltar</span>
  </Button>
);
