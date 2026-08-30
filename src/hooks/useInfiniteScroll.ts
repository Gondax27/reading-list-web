import { useEffect, useRef } from 'react';

/**
 * Observa un elemento sentinel y ejecuta callback cuando entra en viewport
 */
const useInfiniteScroll = (onLoadMore: () => void, enabled: boolean) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onLoadMore, enabled]);

  return sentinelRef;
};

export default useInfiniteScroll;
