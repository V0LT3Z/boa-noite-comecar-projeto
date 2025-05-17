
import { Skeleton } from "@/components/ui/skeleton";

const TicketsLoading = () => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-center">
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
};

export default TicketsLoading;
