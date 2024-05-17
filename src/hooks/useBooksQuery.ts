import { useQuery } from '@tanstack/react-query';

import { useLibraryStore } from '@/store/library';
import { getBooks } from '@/utils/library';

const useBooksQuery = () => {
  const initializeBooks = useLibraryStore(state => state.initializeBooks);

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: () => getBooks(initializeBooks)
  });

  return { booksQuery };
};

export default useBooksQuery;
