import { create } from 'zustand';

import { buildAuthors, buildCategories, buildStateBooks } from '@/utils/library';

import type { Book, LibraryFilter, LibraryStore } from '@/types/library';

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  /** States */
  allBooks: [],
  availableBooks: [],
  readingList: [],
  authorList: [],
  categoryList: [],
  filters: { category: '', search: '', author: '' },

  /** Funciones */
  initializeBooks: (books: Book[]) => {
    const { newAvailableBooks, newReadingList } = buildStateBooks(books);
    const authorList = buildAuthors(books);
    const categoryList = buildCategories(books);

    set({
      allBooks: books,
      availableBooks: newAvailableBooks,
      readingList: newReadingList,
      authorList,
      categoryList
    });
  },
  addReadingBook: (book: Book) => {
    const newReadingList = [...get().readingList, book];
    const localReading = newReadingList.map((book) => book.ISBN);
    localStorage.setItem('reading-list', JSON.stringify(localReading));

    set((prevState) => ({
      ...prevState,
      availableBooks: prevState.availableBooks.filter((_book) => _book.ISBN !== book.ISBN),
      readingList: newReadingList
    }));
  },
  removeReadingBook: (book: Book) => {
    const newReadingList = get().readingList.filter((_book) => _book.ISBN !== book.ISBN);
    const localReading = newReadingList.map((book) => book.ISBN);
    localStorage.setItem('reading-list', JSON.stringify(localReading));

    set((prevState) => ({
      ...prevState,
      availableBooks: [...prevState.availableBooks, book],
      readingList: newReadingList
    }));
  },
  onApplyFilter: (filters: LibraryFilter) => {
    const localBooks = get().readingList.map(book => book.ISBN);

    set(prevState => ({
      ...prevState,
      filters,
      availableBooks: prevState.allBooks.filter(book => (
        !localBooks.includes(book.ISBN) &&
        book.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        book.genre.includes(filters.category) &&
        book.author.name.includes(filters.author)
      ))
    }));
  }
}));
