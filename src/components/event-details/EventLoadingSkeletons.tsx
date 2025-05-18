
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonsProps {
  isMobile: boolean;
}

const EventLoadingSkeletons = ({ isMobile }: LoadingSkeletonsProps) => {
  if (isMobile) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div>
          <Skeleton className="h-7 w-3/5 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-32 mb-1" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>

        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <Skeleton className="h-60 w-full mb-3 rounded-xl" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <div className="mb-4">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-6 w-32 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-9 w-full mt-3" />
        </div>
        <Skeleton className="h-44 w-full mt-5 rounded-xl" />
      </div>
    </div>
  );
};

export default EventLoadingSkeletons;
