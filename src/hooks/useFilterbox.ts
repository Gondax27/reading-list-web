import { useMemo } from 'react';

import { useLibraryStore } from '@/store/library';

import type { LibraryFilter } from '@/types/library';

const useFilterbox = () => {
  const authorList = useLibraryStore(state => state.authorList);
  const categoryList = useLibraryStore(state => state.categoryList);
  const filters = useLibraryStore(state => state.filters);
  const onApplyFilter = useLibraryStore(state => state.onApplyFilter);

  const selectedAuthor = useMemo(() => (
    filters.author ? { label: filters.author, value: filters.author } : { label: 'Todas', value: '' }
  ), [filters.author]);

  const selectedCategory = useMemo(() => (
    filters.category ? { label: filters.category, value: filters.category } : { label: 'Todas', value: '' }
  ), [filters.category]);

  /**
   * Función que aplica el tipo de filtro realizado por el usuario
   * @param key
   * @param value
   * @returns
   */
  const handleChangeFilter = (key: keyof LibraryFilter, value?: string) => (
    onApplyFilter({
      ...filters,
      [key]: value || ''
    })
  );

  return {
    /** States */
    authorList,
    categoryList,
    filters,
    selectedAuthor,
    selectedCategory,

    /** Funciones */
    handleChangeFilter
  }
}

export default useFilterbox