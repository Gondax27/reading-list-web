import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpenLibraryDoc, OpenLibrarySearchResponse } from '@/types/library';
import {
  normalizeGenre,
  OPEN_LIBRARY_API_URL,
  requestBooks,
  transformOpenLibraryDocToBook,
} from './library';

describe('Open Library Service', () => {
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

  describe('requestBooks', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('fetches and maps books successfully from Open Library', async () => {
      const mockResponse: OpenLibrarySearchResponse = {
        numFound: 1,
        start: 0,
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

      const books = await requestBooks();

      expect(mockFetch).toHaveBeenCalledWith(
        OPEN_LIBRARY_API_URL,
        expect.objectContaining({ method: 'GET' })
      );
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Dune');
      expect(books[0].genre).toBe('Ciencia Ficción');
    });

    it('rejects when response is not ok', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Service Unavailable',
      });

      vi.stubGlobal('fetch', mockFetch);

      await expect(requestBooks()).rejects.toThrow();
    });
  });
});
