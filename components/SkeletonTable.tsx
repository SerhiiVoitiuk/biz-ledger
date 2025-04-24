import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rowCount: number;
}

export function SkeletonTable({ rowCount = 1 }: SkeletonTableProps) {
  const rowsToRender = Math.min(rowCount ?? 1, 5);

  return (
    <div className="mt-7 w-full overflow-hidden bg-white p-4 rounded-2xl">

      <div className="flex justify-between mb-4">
        <Skeleton className="h-10 w-100 rounded-md" />
      </div>

      <div className="flex flex-col gap-2">
        {[...Array(rowsToRender)].map((_, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <Skeleton className="h-10 w-60 rounded-md" />
            <Skeleton className="h-10 w-50 rounded-md" />
            <Skeleton className="h-10 w-30 rounded-md" />
            <Skeleton className="h-10 w-30 rounded-md" />
            <Skeleton className="h-10 w-30 rounded-md" />
            <Skeleton className="h-10 w-30 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4 gap-5">
        <Skeleton className="h-10 w-30 rounded-md" />
        <Skeleton className="h-10 w-30 rounded-md" />
      </div>
    </div>
  );
}

export default SkeletonTable;