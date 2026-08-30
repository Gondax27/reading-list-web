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

export interface Book {
  title: string;
  pages: number;
  genre: string;
  cover: string;
  synopsis: string;
  year: number;
  ISBN: string;
  author: Author;
}

export interface Author {
  name: string;
  otherBooks: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface LibraryFilter {
  category: string;
  search: string;
  author: string;
}

export interface LibraryStore {
  allBooks: Book[];
  availableBooks: Book[];
  readingList: Book[];
  authorList: FilterOption[];
  categoryList: FilterOption[];
  filters: LibraryFilter;
  initializeBooks: (books: Book[]) => void;
  addReadingBook: (book: Book) => void;
  removeReadingBook: (book: Book) => void;
  onApplyFilter: (filters: LibraryFilter) => void;
}
