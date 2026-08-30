import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_LIBRARY_FILTERS,
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
  const filters = useLibraryStore((state) => state.filters);
  const setFilters = useLibraryStore((state) => state.setFilters);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [authorInput, setAuthorInput] = useState(filters.author);

  const debouncedSearch = useDebouncedValue(searchInput);
  const debouncedAuthor = useDebouncedValue(authorInput);

  useEffect(() => {
    const currentFilters = useLibraryStore.getState().filters;

    if (currentFilters.search === debouncedSearch && currentFilters.author === debouncedAuthor) {
      return;
    }

    setFilters({
      ...currentFilters,
      search: debouncedSearch,
      author: debouncedAuthor,
    });
  }, [debouncedSearch, debouncedAuthor, setFilters]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setAuthorInput(filters.author);
  }, [filters.author]);

  const handleChangeFilter = (key: keyof LibraryFilter, value?: string) => {
    if (key === 'search') {
      setSearchInput(value || '');
      return;
    }

    if (key === 'author') {
      setAuthorInput(value || '');
      return;
    }

    setFilters({
      ...filters,
      [key]: value || '',
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setAuthorInput('');
    setFilters({ ...DEFAULT_LIBRARY_FILTERS });
  };

  const handleResetSecondaryFilters = () => {
    setAuthorInput('');
    setFilters({
      ...DEFAULT_LIBRARY_FILTERS,
      search: searchInput,
    });
  };

  const handleClearFilter = (key: FilterKey) => {
    if (key === 'search') {
      setSearchInput('');
      setFilters({ ...filters, search: '' });
      return;
    }

    if (key === 'author') {
      setAuthorInput('');
      setFilters({ ...filters, author: '' });
      return;
    }

    if (key === 'yearRange') {
      setFilters({ ...filters, yearFrom: '', yearTo: '' });
      return;
    }

    setFilters({
      ...filters,
      [key]: key === 'sort' ? DEFAULT_LIBRARY_FILTERS.sort : '',
    });
  };

  const selectedLanguage = useMemo(
    () => findSelectedOption(LANGUAGE_OPTIONS, filters.language),
    [filters.language]
  );

  const selectedSubject = useMemo(
    () => findSelectedOption(SUBJECT_OPTIONS, filters.subject),
    [filters.subject]
  );

  const selectedSort = useMemo(
    () => findSelectedOption(SORT_OPTIONS, filters.sort),
    [filters.sort]
  );

  const selectedEbook = useMemo(
    () => findSelectedOption(EBOOK_OPTIONS, filters.ebookAccess),
    [filters.ebookAccess]
  );

  const activeSecondaryCount = useMemo(() => {
    let count = 0;
    if (filters.subject) count++;
    if (filters.language) count++;
    if (filters.sort && filters.sort !== 'relevance') count++;
    if (filters.author) count++;
    if (filters.yearFrom || filters.yearTo) count++;
    if (filters.ebookAccess) count++;
    return count;
  }, [filters]);

  const activeFiltersList = useMemo<ActiveFilterItem[]>(() => {
    const list: ActiveFilterItem[] = [];

    if (filters.search) {
      list.push({ key: 'search', label: `Búsqueda: "${filters.search}"` });
    }

    if (filters.subject) {
      list.push({ key: 'subject', label: `Materia: ${selectedSubject.label}` });
    }

    if (filters.language) {
      list.push({ key: 'language', label: `Idioma: ${selectedLanguage.label}` });
    }

    if (filters.sort && filters.sort !== 'relevance') {
      list.push({ key: 'sort', label: `Orden: ${selectedSort.label}` });
    }

    if (filters.author) {
      list.push({ key: 'author', label: `Autor: "${filters.author}"` });
    }

    if (filters.yearFrom && filters.yearTo) {
      list.push({ key: 'yearRange', label: `Años: ${filters.yearFrom} - ${filters.yearTo}` });
    } else if (filters.yearFrom) {
      list.push({ key: 'yearFrom', label: `Desde: ${filters.yearFrom}` });
    } else if (filters.yearTo) {
      list.push({ key: 'yearTo', label: `Hasta: ${filters.yearTo}` });
    }

    if (filters.ebookAccess) {
      list.push({ key: 'ebookAccess', label: `Ebook: ${selectedEbook.label}` });
    }

    return list;
  }, [filters, selectedSubject, selectedLanguage, selectedSort, selectedEbook]);

  return {
    filters: { ...filters, search: searchInput, author: authorInput },
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
