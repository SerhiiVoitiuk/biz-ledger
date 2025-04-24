import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDashboardInfo() {
  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-45 rounded-lg" />
        <div className="flex flex-row gap-3">
          <Skeleton className="h-10 w-45 rounded-lg" />
          <Skeleton className="h-10 w-45 rounded-lg" />
          <Skeleton className="h-10 w-45 rounded-lg" />
          <Skeleton className="h-10 w-45 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-row gap-4 w-full">
        <Skeleton className="h-35 flex-1 rounded-2xl" />
        <Skeleton className="h-35 flex-1 rounded-2xl" />
        <Skeleton className="h-35 flex-1 rounded-2xl" />
      </div>
    </div>
  );
}

export default SkeletonDashboardInfo;
