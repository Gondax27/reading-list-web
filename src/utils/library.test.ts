import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as libraryService from '@/services/library';
import type { Book } from '@/types/library';
import { buildAuthors, buildCategories, buildStateBooks, getBooks } from './library';

const sampleBooks: Book[] = [
  {
    title: 'El Señor de los Anillos',
    pages: 1200,
    genre: 'Fantasía',
    cover: 'https://example.com/cover1.jpg',
    synopsis: 'Un anillo para gobernarlos a todos.',
    year: 1954,
    ISBN: 'ISBN-001',
    author: { name: 'J.R.R. Tolkien', otherBooks: [] },
  },
  {
    title: 'Fundación',
    pages: 255,
    genre: 'Ciencia Ficción',
    cover: 'https://example.com/cover2.jpg',
    synopsis: 'La caída del Imperio Galáctico.',
    year: 1951,
    ISBN: 'ISBN-002',
    author: { name: 'Isaac Asimov', otherBooks: [] },
  },
  {
    title: 'El Hobbit',
    pages: 310,
    genre: 'Fantasía',
    cover: 'https://example.com/cover3.jpg',
    synopsis: 'Una gran aventura en la Tierra Media.',
    year: 1937,
    ISBN: 'ISBN-003',
    author: { name: 'J.R.R. Tolkien', otherBooks: [] },
  },
];

describe('Library Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('buildAuthors', () => {
    it('extracts unique authors and includes "Todos" option at index 0', () => {
      const authors = buildAuthors(sampleBooks);
      expect(authors).toHaveLength(3); // "Todos", "J.R.R. Tolkien", "Isaac Asimov"
      expect(authors[0]).toEqual({ label: 'Todos', value: '' });
      expect(authors[1]).toEqual({ label: 'J.R.R. Tolkien', value: 'J.R.R. Tolkien' });
      expect(authors[2]).toEqual({ label: 'Isaac Asimov', value: 'Isaac Asimov' });
    });
  });

  describe('buildCategories', () => {
    it('extracts unique genres and includes "Todas" option at index 0', () => {
      const categories = buildCategories(sampleBooks);
      expect(categories).toHaveLength(3); // "Todas", "Fantasía", "Ciencia Ficción"
      expect(categories[0]).toEqual({ label: 'Todas', value: '' });
      expect(categories[1]).toEqual({ label: 'Fantasía', value: 'Fantasía' });
      expect(categories[2]).toEqual({ label: 'Ciencia Ficción', value: 'Ciencia Ficción' });
    });
  });

  describe('buildStateBooks', () => {
    it('separates books into available and reading list based on localStorage', () => {
      localStorage.setItem('reading-list', JSON.stringify(['ISBN-002']));

      const { newAvailableBooks, newReadingList } = buildStateBooks(sampleBooks);

      expect(newReadingList).toHaveLength(1);
      expect(newReadingList[0].title).toBe('Fundación');
      expect(newAvailableBooks).toHaveLength(2);
      expect(newAvailableBooks.map((b) => b.ISBN)).toEqual(['ISBN-001', 'ISBN-003']);
    });

    it('places all books in available when localStorage is empty', () => {
      const { newAvailableBooks, newReadingList } = buildStateBooks(sampleBooks);

      expect(newReadingList).toHaveLength(0);
      expect(newAvailableBooks).toHaveLength(3);
    });
  });

  describe('getBooks', () => {
    it('invokes requestBooks and passes result to initializeBooks callback', async () => {
      const spyRequest = vi.spyOn(libraryService, 'requestBooks').mockResolvedValue(sampleBooks);

      const mockInit = vi.fn();
      const result = await getBooks(mockInit);

      expect(spyRequest).toHaveBeenCalled();
      expect(mockInit).toHaveBeenCalledWith(sampleBooks);
      expect(result).toEqual(sampleBooks);
    });
  });
});
