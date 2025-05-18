
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventDetails } from "@/hooks/useEventDetails";
import EventLoadingSkeletons from "@/components/event-details/EventLoadingSkeletons";
import EventErrorState from "@/components/event-details/EventErrorState";
import EventHeader from "@/components/event-details/EventHeader";
import EventDescription from "@/components/event-details/EventDescription";
import EventVenueInfo from "@/components/event-details/EventVenueInfo";
import EventWarnings from "@/components/event-details/EventWarnings";
import EventMap from "@/components/EventMap";
import TicketSelector from "@/components/TicketSelector";
import GradientCard from "@/components/GradientCard";
import { BackButton } from "@/components/event-details/EventImageHeader";

const EventDetails = () => {
  const { 
    event, 
    isLoading, 
    error, 
    isPurchasing,
    handleBackToHome, 
    handlePurchase 
  } = useEventDetails();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-6 px-4">
        <EventLoadingSkeletons isMobile={isMobile} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <EventErrorState />
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col w-full gap-5">
          <div className="relative w-full mb-2">
            <div className="relative pt-4 pl-4">
              <BackButton onClick={handleBackToHome} />
            </div>
          </div>
          
          <div className="relative w-full rounded-2xl overflow-hidden h-56 shadow-md mb-1">
            <img
              src={event.image || '/placeholder.svg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <EventHeader
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
          />
          
          <GradientCard className="w-full">
            <TicketSelector 
              tickets={event.tickets} 
              onPurchase={handlePurchase} 
              isPurchasing={isPurchasing}
            />
          </GradientCard>
          
          <EventDescription description={event.description} isMobile={true} />
          
          <EventVenueInfo venue={event.venue} isMobile={true} />
          
          <EventWarnings warnings={event.warnings} isMobile={true} />
          
          <div className="mt-2">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="relative w-full mb-1">
            <div className="relative pt-4 pl-4">
              <BackButton onClick={handleBackToHome} />
            </div>
          </div>
          
          <div className="relative w-full rounded-2xl overflow-hidden h-72 shadow-lg mb-2">
            <img
              src={event.image || '/placeholder.svg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <EventHeader
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
          />
          
          <EventDescription description={event.description} isMobile={false} />
          
          <EventVenueInfo venue={event.venue} isMobile={false} />
          
          <EventWarnings warnings={event.warnings} isMobile={false} />
          
          <div className="mt-2">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
        
        <div className="col-span-1 flex flex-col gap-4 h-fit">
          <GradientCard className="w-full">
            <TicketSelector 
              tickets={event.tickets} 
              onPurchase={handlePurchase}
              isPurchasing={isPurchasing} 
            />
          </GradientCard>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] w-full px-2 sm:px-0 lg:px-0 py-5 max-w-[1800px] mx-auto bg-soft-gray">
      {renderContent()}
    </div>
  );
};

export default EventDetails;
