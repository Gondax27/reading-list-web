import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIBRARY_FILTERS } from '@/constants/openLibraryFilters';
import type { OpenLibraryDoc, OpenLibrarySearchResponse } from '@/types/library';
import {
  buildAuthorClause,
  buildOpenLibraryQuery,
  buildOpenLibrarySearchUrl,
  buildSubjectClause,
  escapeSolrValue,
  normalizeGenre,
  requestBooksPage,
  resolveYearRange,
  transformOpenLibraryDocToBook,
} from './library';

describe('Open Library Service', () => {
  describe('escapeSolrValue', () => {
    it('escapes double quotes and backslashes in Solr values', () => {
      expect(escapeSolrValue('Say "Hello"')).toBe('Say \\"Hello\\"');
      expect(escapeSolrValue('path\\to')).toBe('path\\\\to');
    });
  });

  describe('resolveYearRange', () => {
    it('returns null when no years are provided', () => {
      expect(resolveYearRange('', '')).toBeNull();
    });

    it('swaps inverted year ranges', () => {
      expect(resolveYearRange('2020', '1990')).toEqual({ from: '1990', to: '2020' });
    });
  });

  describe('buildAuthorClause', () => {
    it('uses author: for single-token names', () => {
      expect(buildAuthorClause('Tolkien')).toBe('author:Tolkien');
    });

    it('uses quoted author: for multi-word names', () => {
      expect(buildAuthorClause('Gabriel Garcia')).toBe('author:"Gabriel Garcia"');
    });
  });

  describe('buildSubjectClause', () => {
    it('returns default fiction query when subject is empty', () => {
      expect(buildSubjectClause('')).toBe('subject:fiction');
    });

    it('uses subject: fuzzy search for catalog values', () => {
      expect(buildSubjectClause('fantasy')).toBe('subject:fantasy');
    });
  });

  describe('buildOpenLibraryQuery', () => {
    it('uses subject:fiction as default base query', () => {
      expect(buildOpenLibraryQuery({ ...DEFAULT_LIBRARY_FILTERS })).toBe('subject:fiction');
    });

    it('combines language, author and search filters', () => {
      const query = buildOpenLibraryQuery({
        ...DEFAULT_LIBRARY_FILTERS,
        subject: 'fantasy',
        language: 'spa',
        author: 'Tolkien',
        search: 'hobbit',
      });

      expect(query).toContain('subject:fantasy');
      expect(query).toContain('language:spa');
      expect(query).toContain('author:Tolkien');
      expect(query).toContain('hobbit');
    });

    it('adds year range and ebook access when provided', () => {
      const query = buildOpenLibraryQuery({
        ...DEFAULT_LIBRARY_FILTERS,
        yearFrom: '1990',
        yearTo: '2020',
        ebookAccess: 'public',
      });

      expect(query).toContain('first_publish_year:[1990 TO 2020]');
      expect(query).toContain('ebook_access:public');
    });

    it('ignores search terms shorter than 3 characters', () => {
      const query = buildOpenLibraryQuery({
        ...DEFAULT_LIBRARY_FILTERS,
        search: 'ab',
      });

      expect(query).toBe('subject:fiction');
    });
  });

  describe('buildOpenLibrarySearchUrl', () => {
    it('includes pagination, sort and ISO 639-1 lang parameter', () => {
      const url = buildOpenLibrarySearchUrl(
        { ...DEFAULT_LIBRARY_FILTERS, sort: 'new', language: 'spa' },
        30
      );

      expect(url).toContain('offset=30');
      expect(url).toContain('limit=30');
      expect(url).toContain('sort=new');
      expect(url).toContain('lang=es');
      expect(url).not.toContain('lang=spa');
    });

    it('omits sort when relevance is selected', () => {
      const url = buildOpenLibrarySearchUrl({ ...DEFAULT_LIBRARY_FILTERS }, 0);
      expect(url).not.toContain('sort=');
    });
  });

  describe('normalizeGenre', () => {
    it('returns "Ficción" when subjects array is empty or undefined', () => {
      expect(normalizeGenre()).toBe('Ficción');
      expect(normalizeGenre([])).toBe('Ficción');
    });

    it('identifies Fantasía correctly', () => {
      expect(normalizeGenre(['High Fantasy', 'Epic'])).toBe('Fantasía');
      expect(normalizeGenre(['magic', 'adventure'])).toBe('Fantasía');
    });

    it('identifies Ciencia Ficción correctly', () => {
      expect(normalizeGenre(['Science Fiction', 'Space exploration'])).toBe('Ciencia Ficción');
      expect(normalizeGenre(['sci-fi', 'aliens'])).toBe('Ciencia Ficción');
    });

    it('identifies Terror correctly', () => {
      expect(normalizeGenre(['Horror tales', 'ghosts'])).toBe('Terror');
      expect(normalizeGenre(['vampire stories'])).toBe('Terror');
    });

    it('identifies Misterio correctly', () => {
      expect(normalizeGenre(['Detective fiction', 'thriller'])).toBe('Misterio');
      expect(normalizeGenre(['Crime mystery'])).toBe('Misterio');
    });

    it('identifies Romance correctly', () => {
      expect(normalizeGenre(['Love story', 'Drama'])).toBe('Romance');
    });

    it('identifies Historia correctly', () => {
      expect(normalizeGenre(['Historical fiction'])).toBe('Historia');
    });

    it('falls back to capitalized first subject when no pattern matches', () => {
      expect(normalizeGenre(['biography, memoires'])).toBe('Biography');
    });
  });

  describe('transformOpenLibraryDocToBook', () => {
    it('transforms a full Open Library doc into a valid Book object', () => {
      const mockDoc: OpenLibraryDoc = {
        key: '/works/OL12345W',
        title: 'The Hobbit',
        author_name: ['J.R.R. Tolkien'],
        first_publish_year: 1937,
        number_of_pages_median: 310,
        isbn: ['9780261103343'],
        cover_i: 84321,
        subject: ['Fantasy fiction', 'Middle-earth'],
        first_sentence: ['In a hole in the ground there lived a hobbit.'],
      };

      const book = transformOpenLibraryDocToBook(mockDoc);

      expect(book.title).toBe('The Hobbit');
      expect(book.author.name).toBe('J.R.R. Tolkien');
      expect(book.year).toBe(1937);
      expect(book.pages).toBe(310);
      expect(book.ISBN).toBe('9780261103343');
      expect(book.cover).toBe('https://covers.openlibrary.org/b/id/84321-M.jpg');
      expect(book.genre).toBe('Fantasía');
      expect(book.synopsis).toBe('In a hole in the ground there lived a hobbit.');
    });

    it('handles missing cover_i by using isbn when available', () => {
      const mockDoc: OpenLibraryDoc = {
        key: '/works/OL67890W',
        title: 'Unknown Tales',
        isbn: ['1234567890'],
      };

      const book = transformOpenLibraryDocToBook(mockDoc);
      expect(book.cover).toBe('https://covers.openlibrary.org/b/isbn/1234567890-M.jpg');
    });

    it('uses fallback placeholder when both cover_i and isbn are missing', () => {
      const mockDoc: OpenLibraryDoc = {
        key: '/works/OL99999W',
        title: 'No Cover Book',
      };

      const book = transformOpenLibraryDocToBook(mockDoc);
      expect(book.cover).toContain('placehold.co');
      expect(book.ISBN).toBe('OL99999W');
      expect(book.author.name).toBe('Autor Anónimo');
      expect(book.pages).toBe(280);
    });
  });

  describe('requestBooksPage', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('fetches and maps a paginated response from Open Library', async () => {
      const mockResponse: OpenLibrarySearchResponse = {
        numFound: 100,
        start: 30,
        docs: [
          {
            key: '/works/OL100W',
            title: 'Dune',
            author_name: ['Frank Herbert'],
            first_publish_year: 1965,
            number_of_pages_median: 412,
            isbn: ['9780441172719'],
            cover_i: 55443,
            subject: ['Science Fiction', 'Arrakis'],
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      vi.stubGlobal('fetch', mockFetch);

      const page = await requestBooksPage({ ...DEFAULT_LIBRARY_FILTERS }, 30);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('offset=30'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(page.books).toHaveLength(1);
      expect(page.books[0].title).toBe('Dune');
      expect(page.numFound).toBe(100);
      expect(page.hasMore).toBe(true);
    });

    it('returns hasMore false when all results have been fetched', async () => {
      const mockResponse: OpenLibrarySearchResponse = {
        numFound: 1,
        start: 0,
        docs: [{ key: '/works/OL1W', title: 'Book' }],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const page = await requestBooksPage({ ...DEFAULT_LIBRARY_FILTERS }, 0);
      expect(page.hasMore).toBe(false);
    });

    it('rejects when Open Library returns a validation error payload', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              detail: [{ msg: 'Invalid query' }],
            }),
        })
      );

      await expect(requestBooksPage({ ...DEFAULT_LIBRARY_FILTERS }, 0)).rejects.toThrow(
        'La consulta de Open Library no es válida'
      );
    });

    it('rejects when response is not ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          statusText: 'Service Unavailable',
        })
      );

      await expect(requestBooksPage({ ...DEFAULT_LIBRARY_FILTERS }, 0)).rejects.toThrow();
    });
  });
});
