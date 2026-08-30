import { toast } from 'sonner';
import { create } from 'zustand';

import { DEFAULT_LIBRARY_FILTERS } from '@/constants/openLibraryFilters';
import type { Book, BookReadStatus, LibraryFilter, LibraryStore } from '@/types/library';
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
    const currentList = get().readingList;
    if (currentList.some((b) => b.ISBN === book.ISBN)) {
      return;
    }

    const bookWithStatus: Book = { ...book, readStatus: book.readStatus ?? 'unread' };
    const newReadingList = [...currentList, bookWithStatus];
    persistReadingList(newReadingList);

    set((prevState) => ({
      readingList: newReadingList,
      availableBooks: prevState.availableBooks.filter((_book) => _book.ISBN !== book.ISBN),
    }));

    toast.success(`"${book.title}" añadido a tu lista`, {
      description: book.author.name,
      action: {
        label: 'Deshacer',
        onClick: () => {
          get().removeReadingBook(book);
        },
      },
    });
  },

  removeReadingBook: (book: Book) => {
    const newReadingList = get().readingList.filter((_book) => _book.ISBN !== book.ISBN);
    persistReadingList(newReadingList);

    set((prevState) => ({
      readingList: newReadingList,
      availableBooks: buildAvailableBooks([book, ...prevState.availableBooks], newReadingList),
    }));

    toast.info(`"${book.title}" eliminado de tu lista`, {
      action: {
        label: 'Deshacer',
        onClick: () => {
          get().addReadingBook(book);
        },
      },
    });
  },

  updateBookStatus: (isbn: string, status: BookReadStatus) => {
    const updatedList = get().readingList.map((book) =>
      book.ISBN === isbn ? { ...book, readStatus: status } : book
    );
    persistReadingList(updatedList);
    set({ readingList: updatedList });
  },

  clearReadingList: () => {
    const prevList = get().readingList;
    persistReadingList([]);
    set((prevState) => ({
      readingList: [],
      availableBooks: buildAvailableBooks([...prevList, ...prevState.availableBooks], []),
    }));

    toast.info('Se ha vaciado tu lista de lectura', {
      action: {
        label: 'Deshacer',
        onClick: () => {
          persistReadingList(prevList);
          set((prevState) => ({
            readingList: prevList,
            availableBooks: buildAvailableBooks(prevState.availableBooks, prevList),
          }));
        },
      },
    });
  },
}));
