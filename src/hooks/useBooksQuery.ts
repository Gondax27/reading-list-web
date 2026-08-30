import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { requestBooks } from '@/services/library';
import { useLibraryStore } from '@/store/library';
import { useUIStore } from '@/store/ui';

const useBooksQuery = () => {
  const showMenu = useUIStore((state) => state.showMenu);
  const setShowMenu = useUIStore((state) => state.setShowMenu);
  const initializeBooks = useLibraryStore((state) => state.initializeBooks);

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: requestBooks,
  });

  useEffect(() => {
    if (booksQuery.data && booksQuery.data.length > 0) {
      initializeBooks(booksQuery.data);
    }
  }, [booksQuery.data, initializeBooks]);

  return {
    /** States */
    booksQuery,
    showMenu,

    /** Funciones */
    setShowMenu,
  };
};

export default useBooksQuery;
