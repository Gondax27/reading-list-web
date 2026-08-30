import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFilterbox from '@/hooks/useFilterbox';

const ALL_VALUE = '__all__';

const Filterbox = () => {
  const {
    filters,
    languageOptions,
    subjectOptions,
    sortOptions,
    ebookOptions,
    activeSecondaryCount,
    activeFiltersList,
    handleChangeFilter,
    handleResetFilters,
    handleResetSecondaryFilters,
    handleClearFilter,
  } = useFilterbox();

  return (
    <section className='mt-4 flex w-full flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            id='searchbox-book'
            type='text'
            value={filters.search}
            placeholder='Buscar por título o palabras clave (mín. 3 caracteres)...'
            className='h-10 rounded-md border-input bg-card/80 pr-9 pl-9 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring'
            onChange={(ev) => handleChangeFilter('search', ev.target.value)}
          />
          {filters.search && (
            <button
              type='button'
              onClick={() => handleClearFilter('search')}
              className='absolute top-1/2 right-3 -translate-y-1/2 rounded-xs text-muted-foreground transition-colors hover:text-foreground'
              aria-label='Limpiar búsqueda'
            >
              <X className='size-4' />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant={activeSecondaryCount > 0 ? 'default' : 'outline'}
              className='h-10 shrink-0 gap-2 font-mono text-sm'
              aria-label='Filtros de búsqueda'
            >
              <SlidersHorizontal className='size-4' />
              <span className='hidden sm:inline'>Filtros</span>
              {activeSecondaryCount > 0 && (
                <Badge
                  variant={activeSecondaryCount > 0 ? 'secondary' : 'default'}
                  className='h-5 min-w-5 px-1 font-mono text-xs font-bold'
                >
                  {activeSecondaryCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align='end'
            className='max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto p-4 sm:w-[480px]'
          >
            <PopoverHeader className='flex flex-row items-center justify-between border-b border-border pb-3'>
              <div>
                <PopoverTitle className='text-sm font-semibold'>Filtros de búsqueda</PopoverTitle>
                <PopoverDescription className='text-xs'>
                  Refina los libros mostrados en el catálogo
                </PopoverDescription>
              </div>

              {activeSecondaryCount > 0 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={handleResetSecondaryFilters}
                  className='h-7 px-2 text-xs text-muted-foreground hover:text-destructive'
                >
                  <RotateCcw className='mr-1 size-3' />
                  Restablecer
                </Button>
              )}
            </PopoverHeader>

            <div className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2'>
              {/* Materia / Género */}
              <div className='space-y-1.5'>
                <Label
                  htmlFor='subject-filter-trigger'
                  className='text-xs font-medium text-muted-foreground'
                >
                  Materia / Género
                </Label>
                <Select
                  value={filters.subject || ALL_VALUE}
                  onValueChange={(val) =>
                    handleChangeFilter('subject', val === ALL_VALUE ? '' : val)
                  }
                >
                  <SelectTrigger id='subject-filter-trigger' className='w-full font-mono text-xs'>
                    <SelectValue placeholder='Todas las materias' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {subjectOptions.map((opt) => (
                      <SelectItem
                        key={opt.value || ALL_VALUE}
                        value={opt.value || ALL_VALUE}
                        className='font-mono text-xs'
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Idioma */}
              <div className='space-y-1.5'>
                <Label
                  htmlFor='language-filter-trigger'
                  className='text-xs font-medium text-muted-foreground'
                >
                  Idioma
                </Label>
                <Select
                  value={filters.language || ALL_VALUE}
                  onValueChange={(val) =>
                    handleChangeFilter('language', val === ALL_VALUE ? '' : val)
                  }
                >
                  <SelectTrigger id='language-filter-trigger' className='w-full font-mono text-xs'>
                    <SelectValue placeholder='Todos los idiomas' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {languageOptions.map((opt) => (
                      <SelectItem
                        key={opt.value || ALL_VALUE}
                        value={opt.value || ALL_VALUE}
                        className='font-mono text-xs'
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenar por */}
              <div className='space-y-1.5'>
                <Label
                  htmlFor='sort-filter-trigger'
                  className='text-xs font-medium text-muted-foreground'
                >
                  Ordenar por
                </Label>
                <Select
                  value={filters.sort || 'relevance'}
                  onValueChange={(val) => handleChangeFilter('sort', val)}
                >
                  <SelectTrigger id='sort-filter-trigger' className='w-full font-mono text-xs'>
                    <SelectValue placeholder='Ordenar por...' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className='font-mono text-xs'>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Acceso ebook */}
              <div className='space-y-1.5'>
                <Label
                  htmlFor='ebook-filter-trigger'
                  className='text-xs font-medium text-muted-foreground'
                >
                  Acceso ebook
                </Label>
                <Select
                  value={filters.ebookAccess || ALL_VALUE}
                  onValueChange={(val) =>
                    handleChangeFilter('ebookAccess', val === ALL_VALUE ? '' : val)
                  }
                >
                  <SelectTrigger id='ebook-filter-trigger' className='w-full font-mono text-xs'>
                    <SelectValue placeholder='Todos los tipos' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {ebookOptions.map((opt) => (
                      <SelectItem
                        key={opt.value || ALL_VALUE}
                        value={opt.value || ALL_VALUE}
                        className='font-mono text-xs'
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Autor */}
              <div className='space-y-1.5 sm:col-span-2'>
                <Label
                  htmlFor='author-input-filter'
                  className='text-xs font-medium text-muted-foreground'
                >
                  Autor
                </Label>
                <Input
                  id='author-input-filter'
                  type='text'
                  value={filters.author}
                  placeholder='Apellido o nombre (búsqueda parcial)...'
                  className='h-8 font-mono text-xs'
                  onChange={(ev) => handleChangeFilter('author', ev.target.value)}
                />
              </div>

              {/* Rango de años */}
              <div className='space-y-1.5 sm:col-span-2'>
                <Label className='text-xs font-medium text-muted-foreground'>
                  Año de publicación
                </Label>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Input
                      id='year-from-filter'
                      type='number'
                      min={1000}
                      max={2100}
                      value={filters.yearFrom}
                      placeholder='Desde ej. 1990'
                      className='h-8 font-mono text-xs'
                      onChange={(ev) => handleChangeFilter('yearFrom', ev.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id='year-to-filter'
                      type='number'
                      min={1000}
                      max={2100}
                      value={filters.yearTo}
                      placeholder='Hasta ej. 2024'
                      className='h-8 font-mono text-xs'
                      onChange={(ev) => handleChangeFilter('yearTo', ev.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t border-border pt-3'>
              <PopoverClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='w-full font-mono text-xs'
                >
                  Aplicar filtros
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Chips de filtros activos */}
      {activeFiltersList.length > 0 && (
        <div className='flex flex-wrap items-center gap-1.5 pt-1'>
          <span className='mr-1 font-mono text-xs text-muted-foreground'>Filtros activos:</span>
          {activeFiltersList.map((item) => (
            <Badge
              key={item.key}
              variant='secondary'
              className='flex items-center gap-1 border border-border bg-secondary/80 px-2 py-0.5 font-mono text-xs text-secondary-foreground transition-colors hover:bg-secondary'
            >
              <span>{item.label}</span>
              <button
                type='button'
                onClick={() => handleClearFilter(item.key)}
                className='rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                aria-label={`Quitar filtro ${item.label}`}
              >
                <X className='size-3' />
              </button>
            </Badge>
          ))}
          {activeFiltersList.length > 1 && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleResetFilters}
              className='h-6 px-1.5 font-mono text-xs text-muted-foreground hover:text-destructive'
            >
              Limpiar todos
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export default Filterbox;
