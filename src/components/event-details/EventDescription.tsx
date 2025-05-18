
import React from "react";
import GradientCard from "@/components/GradientCard";

interface EventDescriptionProps {
  description: string;
  isMobile: boolean;
}

const EventDescription = ({ description, isMobile }: EventDescriptionProps) => {
  return (
    <GradientCard className="w-full">
      <h2 className={`text-${isMobile ? 'base' : 'lg'} font-semibold mb-2 text-gray-800`}>Descrição</h2>
      <p className={`text-gray-700 text-${isMobile ? 'sm' : 'base'} leading-relaxed`}>{description}</p>
    </GradientCard>
  );
};

export default EventDescription;
