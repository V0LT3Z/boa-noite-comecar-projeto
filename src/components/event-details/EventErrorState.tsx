
import React from "react";
import { BackButton } from "./EventImageHeader";

const EventErrorState = () => {
  return (
    <div className="text-center w-full flex flex-col justify-center items-center px-2">
      <div className="rounded-xl bg-white/80 shadow-lg px-6 py-7 max-w-md mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-xl md:text-2xl text-primary mb-1">Evento não encontrado</p>
        <p className="text-gray-500 text-base">Não foi possível encontrar os detalhes para este evento.</p>
      </div>
      <BackButton onClick={() => window.location.href = '/'} />
    </div>
  );
};

export default EventErrorState;
