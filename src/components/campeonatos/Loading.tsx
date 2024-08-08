import { Skeleton } from "../ui/skeleton";

export const LoadingPlayers = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="gap-2 py-2 w-full grid grid-cols-4 rounded-none justify-center items-center">
          <div className='flex justify-center'>
            <Skeleton className='w-10 h-10 object-cover rounded-full bg-zinc-700' />
          </div>
          <div className='col-span-3 flex flex-col gap-1'>
            <Skeleton className="w-28 h-5 bg-zinc-700" />
            <div className="flex items-center gap-1 mt-0">
              <Skeleton className="rounded-full h-4 w-4 bg-zinc-700" />
              <Skeleton className="rounded-full h-4 w-16 bg-zinc-700" />
            </div>
          </div>
        </Skeleton>
      ))}
    </>
  );
}

export const LoadingRules = () => {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-lg"><Skeleton className='w-32 h-6 bg-zinc-700' /></h3>
        <Skeleton className='w-64 h-4 bg-zinc-700' />
        <Skeleton className='w-64 h-4 bg-zinc-700' />
        <Skeleton className='w-64 h-4 bg-zinc-700' />
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
        <p><Skeleton className='w-full h-4 bg-zinc-700' /></p>
      </section>
    </div>
  )
}



export const LoadingCardTournament = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="flex bg-zinc-900 flex-col rounded-xl border">
          <div className="relative flex flex-col rounded-xl">
            <Skeleton className="w-full h-48 rounded-t-xl bg-zinc-800" />
            <div className="absolute bottom-0 left-0 w-full text-xl font-semibold text-center flex justify-center items-center gap-2 bg-gradient-to-b pb-5 from-transparent to-background text-white mt-2">
              <Skeleton className="w-8 h-8 rounded-full bg-zinc-700" />
              <Skeleton className="w-3/4 h-6 bg-zinc-700" />
            </div>
          </div>

          <div className="flex flex-col p-2 space-y-1 mt-2">
            <div className="flex items-center flex-col">
              <Skeleton className="w-3/4 h-4 mb-2 bg-zinc-700" />
              <Skeleton className="w-3/4 h-4 mb-2 bg-zinc-700" />
              <Skeleton className="w-1/2 h-4 mb-2 bg-zinc-700" />
            </div>
            <hr className="py-1" />
            <div className="flex flex-col items-center">
              <Skeleton className="w-full h-8 mb-2 py-1 px-2 rounded-xl bg-zinc-700" />
              <Skeleton className="w-full h-10 bg-zinc-700" />
            </div>
          </div>
        </Skeleton>
      ))}
    </>
  );
}