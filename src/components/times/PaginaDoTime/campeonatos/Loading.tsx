import { ValorantIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Dot } from "lucide-react";

export default function LoadingCampeonatosdoTime() {
  return (
    <Skeleton className='flex-1 flex w-full rounded-xl'>
      <Skeleton className='rounded-xl w-48 h-36 rounded-r-none bg-zinc-700' />

      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col w-full'>
          <div className='flex items-center justify-between p-2 mb-2 border-b'>
            <div className='flex gap-2 items-center'>
              <Skeleton className='w-40 h-6 bg-zinc-700' />
              <Skeleton className='w-1 h-1 rounded-full bg-zinc-700' />
              <Skeleton className='w-32 h-6 bg-zinc-700' />
            </div>
            <Skeleton className='w-20 h-5 mb-1 bg-zinc-700' />
          </div>
          <div className='flex items-center pb-2 w-full'>
            <div className='grid grid-cols-3 gap-2 flex-1'>

              <div className='flex flex-col items-center pr-2'>
                <Skeleton className='w-25 h-5 mb-1 bg-zinc-700' />
                <Skeleton className='w-10 h-5 mb-1 bg-zinc-700' />
              </div>

              <div className='flex flex-col items-center pr-2'>
                <Skeleton className='w-32 h-5 mb-1 bg-zinc-700' />
                <Skeleton className='w-20 h-5 mb-1 bg-zinc-700' />
              </div>

              <div className='flex flex-col items-center pr-2'>
                <Skeleton className='w-32 h-5 mb-1 bg-zinc-700' />
                <Skeleton className='w-20 h-5 mb-1 bg-zinc-700' />
              </div>

            </div>

            <Skeleton className='w-11 h-11 mr-2 mb-1 bg-zinc-700' />
          </div>
        </div>
      </div>
    </Skeleton>
  );
}