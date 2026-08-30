import type { Book } from '@/types/library';

const READING_LIST_KEY = 'reading-list';

/**
 * Lee la lista de lectura desde localStorage.
 * Soporta el formato legado (array de ISBNs) y el nuevo (array de Book).
 */
export const getReadingListFromStorage = (): Book[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]') as unknown;

    if (!Array.isArray(raw) || raw.length === 0) {
      return [];
    }

    if (typeof raw[0] === 'string') {
      return [];
    }

    return raw as Book[];
  } catch {
    return [];
  }
};

/**
 * Persiste la lista de lectura completa en localStorage
 */
export const persistReadingList = (readingList: Book[]): void => {
  localStorage.setItem(READING_LIST_KEY, JSON.stringify(readingList));
};

/**
 * Separa libros cargados de la API excluyendo los que ya están en la lista de lectura
 */
export const buildAvailableBooks = (books: Book[], readingList: Book[]): Book[] => {
  const readingIsbns = new Set(readingList.map((book) => book.ISBN));
  const seen = new Set<string>();

  return books.filter((book) => {
    if (readingIsbns.has(book.ISBN) || seen.has(book.ISBN)) {
      return false;
    }

    seen.add(book.ISBN);
    return true;
  });
};

/**
 * Elimina duplicados por ISBN preservando el orden de aparición
 */
export const dedupeBooksByIsbn = (books: Book[]): Book[] => {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.ISBN)) {
      return false;
    }

    seen.add(book.ISBN);
    return true;
  });
};
