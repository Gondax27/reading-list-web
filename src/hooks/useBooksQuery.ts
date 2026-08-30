import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { PAGE_SIZE } from '@/constants/openLibraryFilters';
import { requestBooksPage } from '@/services/library';
import { useLibraryStore } from '@/store/library';
import { useUIStore } from '@/store/ui';
import { dedupeBooksByIsbn } from '@/utils/library';

const useBooksQuery = () => {
  const showMenu = useUIStore((state) => state.showMenu);
  const setShowMenu = useUIStore((state) => state.setShowMenu);
  const filters = useLibraryStore((state) => state.filters);
  const syncBooksFromQuery = useLibraryStore((state) => state.syncBooksFromQuery);

  const booksQuery = useInfiniteQuery({
    queryKey: ['books', filters],
    queryFn: ({ pageParam = 0 }) => requestBooksPage(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.start + PAGE_SIZE;
    },
  });

  const allFetchedBooks = useMemo(
    () => dedupeBooksByIsbn(booksQuery.data?.pages.flatMap((page) => page.books) ?? []),
    [booksQuery.data]
  );

  const totalFound = booksQuery.data?.pages[0]?.numFound ?? 0;
  useEffect(() => {
    syncBooksFromQuery([], 0);
  }, [filters, syncBooksFromQuery]);

  useEffect(() => {
    if (booksQuery.data) {
      syncBooksFromQuery(allFetchedBooks, totalFound);
    }
  }, [allFetchedBooks, totalFound, booksQuery.data, syncBooksFromQuery]);

  const fetchNextPage = useCallback(() => {
    if (booksQuery.hasNextPage && !booksQuery.isFetchingNextPage) {
      booksQuery.fetchNextPage();
    }
  }, [booksQuery]);

  return {
    booksQuery,
    showMenu,
    setShowMenu,
    fetchNextPage,
    hasNextPage: booksQuery.hasNextPage ?? false,
    isFetchingNextPage: booksQuery.isFetchingNextPage,
    isRefetching: booksQuery.isFetching && !booksQuery.isFetchingNextPage,
    totalFound,
  };
};

export default useBooksQuery;
