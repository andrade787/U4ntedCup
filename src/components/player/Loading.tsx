import { Skeleton } from "../ui/skeleton";

export const GameAccountLoading = () => {
  return (
    <div className="mt-10">
      <div className='flex justify-between items-center'>
        <Skeleton className='h-5 w-44' />
        <Skeleton className='h-9 w-44' />
      </div>
      <hr className='w-full my-2' />
      <div className='flex justify-between bg-zinc-900/50 items-center border rounded-xl mt-2 transition-colors animate-in slide-in-from-top-5'>
        <div className='flex items-center gap-4'>
          <Skeleton className="w-40 h-40 rounded-l-xl" />
          <div className='flex flex-col p-3'>
            <Skeleton className='h-6 w-48 mb-3' />
            <div className=' space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-4 w-48' />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mr-4">
          <Skeleton className='w-20 h-20' />
        </div>
      </div>
    </div>
  );

}
