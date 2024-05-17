import { requestBooks } from '@/services/library';

import type { Book } from '@/types/library';

/**
 * Función que obtiene todos los libros disponibles y los añade dentro del estado global
 * @param initializeBooks
 * @returns
 */
export const getBooks = async (initializeBooks: (books: Book[]) => void) => {
  try {
    const books = await requestBooks();
    initializeBooks(books);
    return Promise.resolve(books);
  } catch (error) {
    return Promise.reject([]);
  }
};

/**
 * Función que construye los libros disponibles y la lista de lectura dentro del state global de la app
 * @param books
 * @returns
 */
export const buildStateBooks = (books: Book[]) => {
  const localLibrary: string[] = JSON.parse(localStorage.getItem('reading-list') || '[]');
  let newAvailableBooks: Book[] = [];
  let newReadingList: Book[] = [];

  for (let idx = 0; idx < books.length; idx++) {
    const book = books[idx];

    if (localLibrary.includes(book.ISBN)) {
      newReadingList = [...newReadingList, book];
      continue;
    }

    newAvailableBooks = [...newAvailableBooks, book];
  }

  return { newAvailableBooks, newReadingList };
}

/**
 * Función que construye la lista de autores disponibles, de acuerdo a los libros ingresados
 * @param books
 * @returns
 */
export const buildAuthors = (books: Book[]) => {
  const allAuthors = [...new Set(books.map((book) => book.author.name))];
  const authors = allAuthors.map((category) => ({ label: category, value: category }));
  return [{ label: 'Todos', value: '' }, ...authors];
};

/**
 * Función que construye la lista de categorías disponibles, de acuerdo a los libros ingresados
 * @param books
 * @returns
 */
export const buildCategories = (books: Book[]) => {
  const allCategories = [...new Set(books.map(book => book.genre))];
  const categories = allCategories.map(category => ({ label: category, value: category }));
  return [{ label: 'Todas', value: '' }, ...categories];
};