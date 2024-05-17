import type { Book, LibraryRequest } from '@/types/library';

const URL_API = 'https://jelou-prueba-tecnica1-frontend.rsbmk.workers.dev';

/**
 * Solicitud que obtiene los libros disponibles desde la base de datos
 * @returns
 */
export const requestBooks = async (): Promise<Book[]> => {
  try {
    const request = await fetch(URL_API, { method: 'GET' });
    const response: LibraryRequest = await request.json();

    if (!request.ok) return Promise.reject([]);
    
    const formatBooks: Book[] = response.default.library.map(({ book }) => book);
    return Promise.resolve(formatBooks);
  } catch (error) {
    return Promise.reject([]);
  }
};