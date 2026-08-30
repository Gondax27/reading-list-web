import { useQueryStates } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { filterParsers } from '@/constants/filterParsers';
import {
  EBOOK_OPTIONS,
  LANGUAGE_OPTIONS,
  SORT_OPTIONS,
  SUBJECT_OPTIONS,
} from '@/constants/openLibraryFilters';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useLibraryStore } from '@/store/library';

import type { FilterOption, LibraryFilter } from '@/types/library';

export type FilterKey = keyof LibraryFilter | 'yearRange';

export interface ActiveFilterItem {
  key: FilterKey;
  label: string;
}

const findSelectedOption = (options: FilterOption[], value: string): FilterOption =>
  options.find((option) => option.value === value) ?? options[0];

const useFilterbox = () => {
  const [urlFilters, setUrlFilters] = useQueryStates(filterParsers, {
    history: 'replace',
    throttleMs: 350,
  });

  const setFilters = useLibraryStore((state) => state.setFilters);

  const [searchInput, setSearchInput] = useState(urlFilters.search);
  const [authorInput, setAuthorInput] = useState(urlFilters.author);

  const debouncedSearch = useDebouncedValue(searchInput);
  const debouncedAuthor = useDebouncedValue(authorInput);

  useEffect(() => {
    if (urlFilters.search !== debouncedSearch || urlFilters.author !== debouncedAuthor) {
      setUrlFilters({
        search: debouncedSearch,
        author: debouncedAuthor,
      });
    }
  }, [debouncedSearch, debouncedAuthor, urlFilters.search, urlFilters.author, setUrlFilters]);

  useEffect(() => {
    setSearchInput(urlFilters.search);
  }, [urlFilters.search]);

  useEffect(() => {
    setAuthorInput(urlFilters.author);
  }, [urlFilters.author]);

  useEffect(() => {
    setFilters(urlFilters as LibraryFilter);
  }, [urlFilters, setFilters]);

  const handleChangeFilter = useCallback(
    (key: keyof LibraryFilter, value?: string) => {
      if (key === 'search') {
        setSearchInput(value || '');
        return;
      }

      if (key === 'author') {
        setAuthorInput(value || '');
        return;
      }

      setUrlFilters({
        [key]: value || '',
      });
    },
    [setUrlFilters]
  );

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setAuthorInput('');
    setUrlFilters({
      search: '',
      subject: '',
      author: '',
      language: '',
      sort: 'relevance',
      yearFrom: '',
      yearTo: '',
      ebookAccess: '',
    });
  }, [setUrlFilters]);

  const handleResetSecondaryFilters = useCallback(() => {
    setAuthorInput('');
    setUrlFilters({
      subject: '',
      author: '',
      language: '',
      sort: 'relevance',
      yearFrom: '',
      yearTo: '',
      ebookAccess: '',
    });
  }, [setUrlFilters]);

  const handleClearFilter = useCallback(
    (key: FilterKey) => {
      if (key === 'search') {
        setSearchInput('');
        setUrlFilters({ search: '' });
        return;
      }

      if (key === 'author') {
        setAuthorInput('');
        setUrlFilters({ author: '' });
        return;
      }

      if (key === 'yearRange') {
        setUrlFilters({ yearFrom: '', yearTo: '' });
        return;
      }

      setUrlFilters({
        [key]: key === 'sort' ? 'relevance' : '',
      });
    },
    [setUrlFilters]
  );

  const selectedLanguage = useMemo(
    () => findSelectedOption(LANGUAGE_OPTIONS, urlFilters.language),
    [urlFilters.language]
  );

  const selectedSubject = useMemo(
    () => findSelectedOption(SUBJECT_OPTIONS, urlFilters.subject),
    [urlFilters.subject]
  );

  const selectedSort = useMemo(
    () => findSelectedOption(SORT_OPTIONS, urlFilters.sort),
    [urlFilters.sort]
  );

  const selectedEbook = useMemo(
    () => findSelectedOption(EBOOK_OPTIONS, urlFilters.ebookAccess),
    [urlFilters.ebookAccess]
  );

  const activeSecondaryCount = useMemo(() => {
    let count = 0;
    if (urlFilters.subject) count++;
    if (urlFilters.language) count++;
    if (urlFilters.sort && urlFilters.sort !== 'relevance') count++;
    if (authorInput) count++;
    if (urlFilters.yearFrom || urlFilters.yearTo) count++;
    if (urlFilters.ebookAccess) count++;
    return count;
  }, [urlFilters, authorInput]);

  const activeFiltersList = useMemo<ActiveFilterItem[]>(() => {
    const list: ActiveFilterItem[] = [];

    if (searchInput) {
      list.push({ key: 'search', label: `Búsqueda: "${searchInput}"` });
    }

    if (urlFilters.subject) {
      list.push({ key: 'subject', label: `Materia: ${selectedSubject.label}` });
    }

    if (urlFilters.language) {
      list.push({ key: 'language', label: `Idioma: ${selectedLanguage.label}` });
    }

    if (urlFilters.sort && urlFilters.sort !== 'relevance') {
      list.push({ key: 'sort', label: `Orden: ${selectedSort.label}` });
    }

    if (authorInput) {
      list.push({ key: 'author', label: `Autor: "${authorInput}"` });
    }

    if (urlFilters.yearFrom && urlFilters.yearTo) {
      list.push({ key: 'yearRange', label: `Años: ${urlFilters.yearFrom} - ${urlFilters.yearTo}` });
    } else if (urlFilters.yearFrom) {
      list.push({ key: 'yearFrom', label: `Desde: ${urlFilters.yearFrom}` });
    } else if (urlFilters.yearTo) {
      list.push({ key: 'yearTo', label: `Hasta: ${urlFilters.yearTo}` });
    }

    if (urlFilters.ebookAccess) {
      list.push({ key: 'ebookAccess', label: `Ebook: ${selectedEbook.label}` });
    }

    return list;
  }, [
    urlFilters,
    searchInput,
    authorInput,
    selectedSubject,
    selectedLanguage,
    selectedSort,
    selectedEbook,
  ]);

  return {
    filters: { ...urlFilters, search: searchInput, author: authorInput } as LibraryFilter,
    languageOptions: LANGUAGE_OPTIONS,
    subjectOptions: SUBJECT_OPTIONS,
    sortOptions: SORT_OPTIONS,
    ebookOptions: EBOOK_OPTIONS,
    selectedLanguage,
    selectedSubject,
    selectedSort,
    selectedEbook,
    activeSecondaryCount,
    activeFiltersList,
    handleChangeFilter,
    handleResetFilters,
    handleResetSecondaryFilters,
    handleClearFilter,
  };
};

export default useFilterbox;
