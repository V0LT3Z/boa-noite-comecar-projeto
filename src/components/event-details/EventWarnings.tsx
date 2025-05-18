
import React from "react";
import GradientCard from "@/components/GradientCard";

interface EventWarningsProps {
  warnings: string[];
  isMobile: boolean;
}

const EventWarnings = ({ warnings, isMobile }: EventWarningsProps) => {
  return (
    <GradientCard className="w-full">
      <h2 className={`text-${isMobile ? 'base' : 'lg'} font-semibold mb-2 text-gray-800`}>Avisos</h2>
      {warnings && warnings.length > 0 ? (
        <ul className={`list-disc pl-5 text-gray-700 text-${isMobile ? 'sm' : 'base'} space-y-${isMobile ? '1' : '1.5'}`}>
          {warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      ) : (
        <p className={`text-gray-700 text-${isMobile ? 'sm' : 'base'}`}>Nenhum aviso especial para este evento.</p>
      )}
    </GradientCard>
  );
};

export default EventWarnings;
