
import React from "react";
import GradientCard from "@/components/GradientCard";
import EventInfoBadges from "./EventInfoBadges";

interface EventHeaderProps {
  title: string;
  date: string;
  time: string;
  location: string;
}

const EventHeader = ({ title, date, time, location }: EventHeaderProps) => {
  return (
    <GradientCard className="w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg md:text-xl font-bold text-primary leading-tight">
          {title}
        </h1>
        <EventInfoBadges date={date} time={time} location={location} />
      </div>
    </GradientCard>
  );
};

export default EventHeader;
