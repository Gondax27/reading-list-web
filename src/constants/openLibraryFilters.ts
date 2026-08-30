import type { FilterOption } from '@/types/library';

/** @see https://openlibrary.org/dev/docs/api/search */
export const PAGE_SIZE = 30;

export const SEARCH_FIELDS =
  'key,title,author_name,first_publish_year,number_of_pages_median,isbn,cover_i,subject,first_sentence';

/**
 * Códigos ISO 639-2 para el filtro `language:` en la query Solr.
 * @see https://openlibrary.org/search/howto/more
 */
export const LANGUAGE_OPTIONS: FilterOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Español', value: 'spa' },
  { label: 'Inglés', value: 'eng' },
  { label: 'Francés', value: 'fre' },
  { label: 'Alemán', value: 'ger' },
  { label: 'Portugués', value: 'por' },
];

/**
 * Mapeo ISO 639-2 (query) → ISO 639-1 (param `lang` de la Search API).
 * @see https://openlibrary.org/dev/docs/api/search — param `lang`
 */
export const LANGUAGE_LANG_PARAM: Record<string, string> = {
  spa: 'es',
  eng: 'en',
  fre: 'fr',
  ger: 'de',
  por: 'pt',
};

/**
 * Materias normalizadas para `subject_key:` (minúsculas, guiones bajos).
 * @see https://openlibrary.org/search/howto — Subject Search
 */
export const SUBJECT_OPTIONS: FilterOption[] = [
  { label: 'Todas', value: '' },
  { label: 'Literatura', value: 'literature' },
  { label: 'Ficción', value: 'fiction' },
  { label: 'Fantasía', value: 'fantasy' },
  { label: 'Ciencia ficción', value: 'science_fiction' },
  { label: 'Misterio', value: 'mystery' },
  { label: 'Romance', value: 'romance' },
  { label: 'Terror', value: 'horror' },
  { label: 'Historia', value: 'history' },
  { label: 'Biografía', value: 'biography' },
  { label: 'Poesía', value: 'poetry' },
];

/** @see https://openlibrary.org/dev/docs/api/search — sort facets */
export const SORT_OPTIONS: FilterOption[] = [
  { label: 'Relevancia', value: 'relevance' },
  { label: 'Más recientes', value: 'new' },
  { label: 'Más antiguos', value: 'old' },
  { label: 'Aleatorio', value: 'random' },
];

/**
 * Valores oficiales de `ebook_access`.
 * @see https://openlibrary.org/search/howto — Filter by Availability
 */
export const EBOOK_OPTIONS: FilterOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Acceso público', value: 'public' },
  { label: 'Prestable', value: 'borrowable' },
  { label: 'Sin ebook', value: 'no_ebook' },
];

export const DEFAULT_LIBRARY_FILTERS = {
  search: '',
  subject: '',
  author: '',
  language: '',
  sort: 'relevance',
  yearFrom: '',
  yearTo: '',
  ebookAccess: '',
} as const;

export const DEFAULT_SUBJECT_QUERY = 'subject:fiction';
