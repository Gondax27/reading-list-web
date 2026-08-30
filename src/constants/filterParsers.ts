import { parseAsString, parseAsStringEnum } from 'nuqs';

import type { EbookAccess, LibrarySort } from '@/types/library';

const SORT_VALUES: LibrarySort[] = ['relevance', 'new', 'old', 'random'];
const EBOOK_VALUES: EbookAccess[] = ['', 'public', 'borrowable', 'no_ebook'];

export const filterParsers = {
  search: parseAsString.withDefault(''),
  subject: parseAsString.withDefault(''),
  author: parseAsString.withDefault(''),
  language: parseAsString.withDefault(''),
  sort: parseAsStringEnum<LibrarySort>(SORT_VALUES).withDefault('relevance'),
  yearFrom: parseAsString.withDefault(''),
  yearTo: parseAsString.withDefault(''),
  ebookAccess: parseAsStringEnum<EbookAccess>(EBOOK_VALUES).withDefault(''),
};
