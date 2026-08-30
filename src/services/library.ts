import {
  DEFAULT_SUBJECT_QUERY,
  LANGUAGE_LANG_PARAM,
  PAGE_SIZE,
  SEARCH_FIELDS,
} from '@/constants/openLibraryFilters';
import type {
  Book,
  BooksPageResult,
  LibraryFilter,
  OpenLibraryDoc,
  OpenLibrarySearchResponse,
} from '@/types/library';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org/search.json';

const FETCH_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'reading-list-web/1.0 (https://github.com/Gondax27/reading-list-web)',
};

interface OpenLibraryErrorResponse {
  detail?: unknown;
}

/**
 * Escapa caracteres especiales de Solr en valores de búsqueda
 */
export const escapeSolrValue = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/**
 * Resuelve el rango de años, corrigiendo rangos invertidos
 */
export const resolveYearRange = (
  yearFrom: string,
  yearTo: string
): { from: string; to: string } | null => {
  if (!yearFrom && !yearTo) {
    return null;
  }

  if (yearFrom && yearTo && Number(yearFrom) > Number(yearTo)) {
    return { from: yearTo, to: yearFrom };
  }

  return {
    from: yearFrom || '*',
    to: yearTo || '*',
  };
};

/**
 * Construye la cláusula de autor según la guía oficial (`author:`).
 * @see https://openlibrary.org/search/howto/more
 */
export const buildAuthorClause = (author: string): string => {
  const value = escapeSolrValue(author.trim());

  if (value.includes(' ')) {
    return `author:"${value}"`;
  }

  return `author:${value}`;
};

/**
 * Construye la cláusula de materia con `subject:` (búsqueda difusa, método principal).
 * @see https://openlibrary.org/search/howto — Subject Search
 */
export const buildSubjectClause = (subject: string): string => {
  if (!subject) {
    return DEFAULT_SUBJECT_QUERY;
  }

  return `subject:${subject}`;
};

/**
 * Construye la query Solr a partir de los filtros del usuario
 */
export const buildOpenLibraryQuery = (filters: LibraryFilter): string => {
  const parts: string[] = [buildSubjectClause(filters.subject)];

  if (filters.language) {
    parts.push(`language:${filters.language}`);
  }

  if (filters.author.trim()) {
    parts.push(buildAuthorClause(filters.author));
  }

  if (filters.search.trim().length >= 3) {
    parts.push(escapeSolrValue(filters.search.trim()));
  }

  const yearRange = resolveYearRange(filters.yearFrom, filters.yearTo);
  if (yearRange) {
    parts.push(`first_publish_year:[${yearRange.from} TO ${yearRange.to}]`);
  }

  if (filters.ebookAccess) {
    parts.push(`ebook_access:${filters.ebookAccess}`);
  }

  return parts.join(' AND ');
};

/**
 * Construye la URL de búsqueda paginada de Open Library
 */
export const buildOpenLibrarySearchUrl = (filters: LibraryFilter, offset: number): string => {
  const params = new URLSearchParams({
    q: buildOpenLibraryQuery(filters),
    fields: SEARCH_FIELDS,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  });

  if (filters.sort !== 'relevance') {
    params.set('sort', filters.sort);
  }

  const langParam = filters.language ? LANGUAGE_LANG_PARAM[filters.language] : undefined;
  if (langParam) {
    params.set('lang', langParam);
  }

  return `${OPEN_LIBRARY_BASE_URL}?${params.toString()}`;
};

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

const isOpenLibraryError = (
  payload: OpenLibrarySearchResponse | OpenLibraryErrorResponse
): payload is OpenLibraryErrorResponse => 'detail' in payload && !('docs' in payload);

/**
 * Solicita una página de libros desde Open Library
 */
export const requestBooksPage = async (
  filters: LibraryFilter,
  offset = 0
): Promise<BooksPageResult> => {
  const url = buildOpenLibrarySearchUrl(filters, offset);

  const request = await fetch(url, {
    method: 'GET',
    headers: FETCH_HEADERS,
  });

  if (!request.ok) {
    throw new Error(`Error fetching books: ${request.statusText}`);
  }

  const payload = (await request.json()) as OpenLibrarySearchResponse | OpenLibraryErrorResponse;

  if (isOpenLibraryError(payload)) {
    throw new Error('La consulta de Open Library no es válida. Revisa los filtros aplicados.');
  }

  const response = payload;

  if (!response.docs || !Array.isArray(response.docs)) {
    return { books: [], numFound: 0, start: offset, hasMore: false };
  }

  const books = response.docs
    .filter((doc) => Boolean(doc?.title))
    .map(transformOpenLibraryDocToBook);

  const numFound = response.numFound ?? 0;
  const start = response.start ?? offset;
  const fetchedCount = response.docs.length;

  return {
    books,
    numFound,
    start,
    hasMore: start + fetchedCount < numFound,
  };
};
