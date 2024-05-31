import { useQuery } from '@tanstack/react-query';

import { useLibraryStore } from '@/store/library';
import { useUIStore } from '@/store/ui';
import { getBooks } from '@/utils/library';

const useBooksQuery = () => {
  const showMenu = useUIStore(state => state.showMenu);
  
  const setShowMenu = useUIStore(state => state.setShowMenu);
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
