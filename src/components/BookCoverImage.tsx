import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const PLACEHOLDER_COVER = 'https://placehold.co/400x600/1e293b/ffffff?text=Sin+Portada';

interface BookCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  loading?: 'lazy' | 'eager';
}

const BookCoverImage = ({
  src,
  alt,
  className,
  aspectClassName = 'aspect-[2/3]',
  loading = 'lazy',
}: BookCoverImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <div className={cn('relative w-full overflow-hidden bg-muted/40', aspectClassName)}>
      {!isLoaded && <Skeleton className='absolute inset-0 size-full rounded-none' />}

      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (currentSrc !== PLACEHOLDER_COVER) {
            setCurrentSrc(PLACEHOLDER_COVER);
            setIsLoaded(true);
          }
        }}
        className={cn(
          'size-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
};

export default BookCoverImage;
