import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAddPlayerTime() {
  return (
    <Skeleton className="flex items-center rounded-none px-2 py-2 gap-2 justify-between ">
      <div className="flex w-full">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full bg-zinc-700 " />

          <Skeleton className="w-32 h-5 bg-zinc-700 " />
        </div>
      </div>
      <div className="p-1">
        <Skeleton className="w-6 h-6 p-1 rounded-full bg-zinc-700" />
      </div>
      <div className="p-1">
        <Skeleton className="w-6 h-6 p-1 rounded-full bg-zinc-700" />
      </div>
    </Skeleton>
  );

}