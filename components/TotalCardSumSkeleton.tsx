import { Skeleton } from "@/components/ui/skeleton";

export const TotalCardSumSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 mt-7 basis-0 flex-grow">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-[#ffffff] p-3 shadow-sm space-y-2"
        >
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
};