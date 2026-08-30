import { create } from 'zustand';

import { DEFAULT_LIBRARY_FILTERS } from '@/constants/openLibraryFilters';
import type { Book, LibraryFilter, LibraryStore } from '@/types/library';
import {
  buildAvailableBooks,
  getReadingListFromStorage,
  persistReadingList,
} from '@/utils/library';

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  availableBooks: [],
  readingList: getReadingListFromStorage(),
  filters: { ...DEFAULT_LIBRARY_FILTERS },
  totalFound: 0,

  setFilters: (filters: LibraryFilter) => {
    set({ filters });
  },

  syncBooksFromQuery: (books: Book[], totalFound: number) => {
    const readingList = get().readingList;

    set({
      availableBooks: buildAvailableBooks(books, readingList),
      totalFound,
    });
  },

  addReadingBook: (book: Book) => {
    const newReadingList = [...get().readingList, book];
    persistReadingList(newReadingList);

    set((prevState) => ({
      readingList: newReadingList,
      availableBooks: prevState.availableBooks.filter((_book) => _book.ISBN !== book.ISBN),
    }));
  },

  removeReadingBook: (book: Book) => {
    const newReadingList = get().readingList.filter((_book) => _book.ISBN !== book.ISBN);
    persistReadingList(newReadingList);

    set((prevState) => ({
      readingList: newReadingList,
      availableBooks: buildAvailableBooks([book, ...prevState.availableBooks], newReadingList),
    }));
  },
}));
