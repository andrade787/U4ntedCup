import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';


export default function LoadingCardPlayers() {
  return (
    <Skeleton className="rounded-xl w-full">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <Skeleton className='rounded-l-xl rounded-r-none bg-zinc-700 w-25 h-25' />
          <div className="flex-col">
            <Skeleton className='bg-zinc-700 w-40 h-7 mb-2' />
            <Skeleton className="flex items-center justify-center gap-2 bg-zinc-700 rounded-xl p-1">
              <Skeleton className='bg-zinc-500 rounded-full w-5 h-5' />
              <Skeleton className='bg-zinc-500 w-32 h-4' />
            </Skeleton>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

