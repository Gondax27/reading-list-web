export interface LibraryRequest {
  default: Default;
}

export interface Default {
  library: Library[];
}

export interface Library {
  book: Book;
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
