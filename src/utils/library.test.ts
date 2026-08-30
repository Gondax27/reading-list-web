import { beforeEach, describe, expect, it } from 'vitest';
import type { Book } from '@/types/library';
import {
  buildAvailableBooks,
  dedupeBooksByIsbn,
  getReadingListFromStorage,
  persistReadingList,
} from './library';

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

  describe('persistReadingList / getReadingListFromStorage', () => {
    it('persists and restores full book objects', () => {
      persistReadingList([sampleBooks[0]]);
      expect(getReadingListFromStorage()).toHaveLength(1);
      expect(getReadingListFromStorage()[0].title).toBe('El Señor de los Anillos');
    });

    it('returns empty array for legacy ISBN-only storage format', () => {
      localStorage.setItem('reading-list', JSON.stringify(['ISBN-001']));
      expect(getReadingListFromStorage()).toEqual([]);
    });
  });

  describe('buildAvailableBooks', () => {
    it('excludes books already in the reading list', () => {
      const available = buildAvailableBooks(sampleBooks, [sampleBooks[1]]);

      expect(available).toHaveLength(2);
      expect(available.map((book) => book.ISBN)).toEqual(['ISBN-001', 'ISBN-003']);
    });

    it('removes duplicate ISBNs from fetched pages', () => {
      const available = buildAvailableBooks([sampleBooks[0], sampleBooks[0]], []);

      expect(available).toHaveLength(1);
    });
  });

  describe('dedupeBooksByIsbn', () => {
    it('keeps first occurrence of each ISBN', () => {
      const deduped = dedupeBooksByIsbn([sampleBooks[0], sampleBooks[2], sampleBooks[0]]);

      expect(deduped).toHaveLength(2);
      expect(deduped[0].ISBN).toBe('ISBN-001');
      expect(deduped[1].ISBN).toBe('ISBN-003');
    });
  });
});
