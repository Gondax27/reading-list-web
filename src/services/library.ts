import type { Book, OpenLibraryDoc, OpenLibrarySearchResponse } from '@/types/library';

export const OPEN_LIBRARY_API_URL =
  'https://openlibrary.org/search.json?q=language:spa+OR+language:eng&subject=fiction&fields=key,title,author_name,first_publish_year,number_of_pages_median,isbn,cover_i,subject,first_sentence&limit=30';

/**
 * Normaliza los temas o subjects devueltos por Open Library a una categoría en español
 */
export const normalizeGenre = (subjects?: string[]): string => {
  if (!subjects || subjects.length === 0) return 'Ficción';

  const lowerSubs = subjects.map((s) => s.toLowerCase());

  if (
    lowerSubs.some((s) => s.includes('fantasy') || s.includes('fantasía') || s.includes('magic'))
  ) {
    return 'Fantasía';
  }
  if (
    lowerSubs.some(
      (s) =>
        s.includes('science fiction') ||
        s.includes('ciencia ficción') ||
        s.includes('sci-fi') ||
        s.includes('space')
    )
  ) {
    return 'Ciencia Ficción';
  }
  if (
    lowerSubs.some(
      (s) =>
        s.includes('horror') ||
        s.includes('terror') ||
        s.includes('ghost') ||
        s.includes('vampire') ||
        s.includes('zombie')
    )
  ) {
    return 'Terror';
  }
  if (
    lowerSubs.some(
      (s) =>
        s.includes('thriller') ||
        s.includes('mystery') ||
        s.includes('misterio') ||
        s.includes('detective') ||
        s.includes('crime')
    )
  ) {
    return 'Misterio';
  }
  if (lowerSubs.some((s) => s.includes('romance') || s.includes('love') || s.includes('amor'))) {
    return 'Romance';
  }
  if (
    lowerSubs.some(
      (s) => s.includes('history') || s.includes('historical') || s.includes('histórica')
    )
  ) {
    return 'Historia';
  }

  const firstSubject = subjects[0].split(',')[0].trim();
  return firstSubject.charAt(0).toUpperCase() + firstSubject.slice(1);
};

/**
 * Transforma un documento de Open Library al modelo de dominio Book
 */
export const transformOpenLibraryDocToBook = (doc: OpenLibraryDoc): Book => {
  const isbn = doc.isbn?.[0] || doc.key.replace('/works/', '');

  let cover = 'https://placehold.co/400x600?text=No+Cover';
  if (doc.cover_i) {
    cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  } else if (doc.isbn?.[0]) {
    cover = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`;
  }

  const synopsis =
    doc.first_sentence?.[0] ||
    doc.subject?.slice(0, 3).join(', ') ||
    'Obra literaria destacada disponible en el catálogo de Open Library.';

  return {
    title: doc.title || 'Título Desconocido',
    pages: doc.number_of_pages_median || 280,
    genre: normalizeGenre(doc.subject),
    cover,
    synopsis,
    year: doc.first_publish_year || new Date().getFullYear(),
    ISBN: isbn,
    author: {
      name: doc.author_name?.[0] || 'Autor Anónimo',
      otherBooks: [],
    },
  };
};

/**
 * Solicitud que obtiene los libros disponibles desde Open Library
 */
export const requestBooks = async (): Promise<Book[]> => {
  try {
    const request = await fetch(OPEN_LIBRARY_API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'reading-list-web/1.0 (https://github.com/Gondax27/reading-list-web)',
      },
    });

    if (!request.ok) {
      return Promise.reject(new Error(`Error fetching books: ${request.statusText}`));
    }

    const response: OpenLibrarySearchResponse = await request.json();

    if (!response.docs || !Array.isArray(response.docs)) {
      return Promise.resolve([]);
    }

    const formatBooks: Book[] = response.docs
      .filter((doc) => Boolean(doc?.title))
      .map(transformOpenLibraryDocToBook);

    return Promise.resolve(formatBooks);
  } catch (error) {
    console.error('Failed to request books from Open Library:', error);
    return Promise.reject(error);
  }
};
