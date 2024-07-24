import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPartidasdoTime() {
  return (
    <Skeleton className="flex rounded-xl w-full">
      <div className="flex w-full z-20 p-2 justify-evenly">
        <div className="flex flex-col items-center">
          <Skeleton className="w-25 h-25 bg-zinc-700 rounded-xl mb-2" />
          <Skeleton className="w-32 h-5 bg-zinc-700" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="flex gap-5 mb-2">
              <Skeleton className="w-10 h-8 rounded-xl bg-zinc-700" />
              <Skeleton className="w-10 h-8 rounded-xl bg-zinc-700" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-32 h-5 bg-zinc-700" />
              <Skeleton className="w-28 h-5 bg-zinc-700" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="w-25 h-25 bg-zinc-700 rounded-xl mb-2" />
          <Skeleton className="w-32 h-5 bg-zinc-700" />
        </div>
      </div>
    </Skeleton>
  );
}