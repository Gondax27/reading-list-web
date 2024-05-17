import Select from 'react-select';

import useFilterbox from '@/hooks/useFilterbox';

const Filterbox = () => {
  const {
    authorList, categoryList, filters, selectedAuthor, selectedCategory,
    handleChangeFilter
  } = useFilterbox();

  return (
    <section className='grid w-full grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3'>
      <search className='w-full col-span-2 md:col-span-1'>
        <label className='mb-2 font-mono text-white text-md'>Buscar</label>
        <input
          type='text'
          value={filters.search}
          className='w-full h-[38px] rounded-sm px-2 font-mono outline-none'
          placeholder='Digita el titulo del libro'
          onChange={(ev) => handleChangeFilter('search', ev.target.value)}
        />
      </search>

      <div className='w-full col-span-2 sm:col-span-1'>
        <label className='mb-2 font-mono text-white text-md'>Filtro por Categoría</label>
        <Select
          className='font-mono'
          options={categoryList}
          value={selectedCategory}
          onChange={item => handleChangeFilter('category', item?.value)}
        />
      </div>

      <div className='w-full col-span-2 sm:col-span-1'>
        <label className='mb-2 font-mono text-white text-md'>Filtro por Autor</label>
        <Select
          className='font-mono'
          options={authorList}
          value={selectedAuthor}
          onChange={item => handleChangeFilter('author', item?.value)}
        />
      </div>
    </section>
  );
};

export default Filterbox;
