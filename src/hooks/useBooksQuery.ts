import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useLibraryStore } from '@/store/library';
import { getBooks } from '@/utils/library';

const useBooksQuery = () => {
  const [showMenu, setShowMenu] = useState(false);

  const initializeBooks = useLibraryStore(state => state.initializeBooks);

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: () => getBooks(initializeBooks)
  });

  return {
    /** States */
    booksQuery,
    showMenu,

    /** Funciones */
    setShowMenu
  };
};

export default useBooksQuery;
