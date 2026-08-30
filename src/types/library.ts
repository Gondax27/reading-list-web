export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  first_sentence?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
}

export interface LibraryRequest {
  default: {
    library: {
      book: Book;
    }[];
  };
}

export type BookReadStatus = 'unread' | 'reading' | 'completed';

export interface Book {
  title: string;
  pages: number;
  genre: string;
  cover: string;
  synopsis: string;
  year: number;
  ISBN: string;
  author: Author;
  readStatus?: BookReadStatus;
}

export interface Author {
  name: string;
  otherBooks: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export type LibrarySort = 'relevance' | 'new' | 'old' | 'random';

export type EbookAccess = '' | 'public' | 'borrowable' | 'no_ebook';

export interface LibraryFilter {
  search: string;
  subject: string;
  author: string;
  language: string;
  sort: LibrarySort;
  yearFrom: string;
  yearTo: string;
  ebookAccess: EbookAccess;
}

export interface BooksPageResult {
  books: Book[];
  numFound: number;
  start: number;
  hasMore: boolean;
}

export interface LibraryStore {
  availableBooks: Book[];
  readingList: Book[];
  filters: LibraryFilter;
  totalFound: number;
  setFilters: (filters: LibraryFilter) => void;
  syncBooksFromQuery: (books: Book[], totalFound: number) => void;
  addReadingBook: (book: Book) => void;
  removeReadingBook: (book: Book) => void;
  updateBookStatus: (isbn: string, status: BookReadStatus) => void;
  clearReadingList: () => void;
}
