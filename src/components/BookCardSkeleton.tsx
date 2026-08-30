import { Skeleton } from '@/components/ui/skeleton';

const BookCardSkeleton = () => {
  return (
    <div className='flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-0 shadow-xs'>
      <div className='aspect-[2/3] w-full border-b border-border/50 bg-muted/40'>
        <Skeleton className='h-full w-full rounded-none' />
      </div>

      <div className='flex flex-col gap-2 p-4 pb-2'>
        <div className='flex items-center justify-between gap-2'>
          <Skeleton className='h-5 w-20 rounded-md' />
          <Skeleton className='h-4 w-10 rounded-md' />
        </div>
        <Skeleton className='h-5 w-4/5 rounded-md' />
        <Skeleton className='h-4 w-1/2 rounded-md' />
      </div>

      <div className='flex flex-1 flex-col gap-1.5 px-4 py-0 pb-3'>
        <Skeleton className='h-3.5 w-full rounded-sm' />
        <Skeleton className='h-3.5 w-3/4 rounded-sm' />
      </div>

      <div className='mt-auto flex items-center gap-2 p-4 pt-0'>
        <Skeleton className='h-8 flex-1 rounded-lg' />
        <Skeleton className='h-8 flex-1 rounded-lg' />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
