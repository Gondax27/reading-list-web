import { BookOpen, Moon, Sun } from 'lucide-react';

import MenuIcon from '@/assets/MenuIcon';
import BookCard from '@/components/BookCard';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useBooksQuery from '@/hooks/useBooksQuery';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useLibraryStore } from '@/store/library';
import { useUIStore } from '@/store/ui';
import Filterbox from './Filterbox';

const formatCount = (value: number): string => value.toLocaleString('es-ES');

const SKELETON_COUNT = 8;
const PAGINATION_SKELETON_COUNT = 4;

const AvailableBooks = () => {
  const availableBooks = useLibraryStore((state) => state.availableBooks);
  const readingList = useLibraryStore((state) => state.readingList);
  const addReadingBook = useLibraryStore((state) => state.addReadingBook);
  const setShowMenu = useUIStore((state) => state.setShowMenu);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const { booksQuery, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching, totalFound } =
    useBooksQuery();

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  const isInitialLoading = booksQuery.isPending && !booksQuery.data;

  return (
    <section className='col-span-1 lg:col-span-2'>
      <header className='mb-6'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3.5'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs sm:size-12'>
              <BookOpen className='size-6' />
            </div>
            <div>
              <h1 className='font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                Reading List
              </h1>
              <p className='font-mono text-xs text-muted-foreground sm:text-sm'>
                {totalFound > 0
                  ? `${formatCount(totalFound)} libros disponibles en Open Library`
                  : 'Catálogo de libros en Open Library'}
              </p>
              <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
                {totalFound > 0
                  ? `Se encontraron ${formatCount(totalFound)} libros disponibles en Open Library`
                  : 'No hay libros disponibles con los filtros actuales'}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={toggleTheme}
                    aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                  >
                    {theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {readingList.length > 0 && (
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='relative lg:hidden'
                onClick={() => setShowMenu(true)}
                aria-label={`Ver lista de lectura (${readingList.length} libros)`}
              >
                <MenuIcon className='size-5 stroke-2' />
                <span className='absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
                  {readingList.length}
                </span>
              </Button>
            )}
          </div>
        </div>

        <Filterbox />
      </header>

      {booksQuery.isError && (
        <p className='mb-4 font-mono text-sm text-destructive'>
          {booksQuery.error instanceof Error
            ? booksQuery.error.message
            : 'No se pudieron cargar los libros. Intenta ajustar los filtros.'}
        </p>
      )}

      {isInitialLoading ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static loading placeholders
            <BookCardSkeleton key={`initial-skeleton-${idx}`} />
          ))}
        </div>
      ) : (
        <TooltipProvider>
          {isRefetching && (
            <p className='mb-4 font-mono text-sm text-muted-foreground'>Actualizando resultados…</p>
          )}

          {availableBooks.length === 0 && !isRefetching ? (
            <p className='font-mono text-muted-foreground'>
              No hay libros para mostrar con estos filtros. Prueba ampliar la búsqueda, cambiar el
              género o quitar el rango de años.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
              {availableBooks.map((book, idx) => (
                <BookCard
                  key={book.ISBN}
                  book={book}
                  type='available-list'
                  idx={idx}
                  handleChangeBook={addReadingBook}
                />
              ))}

              {isFetchingNextPage &&
                Array.from({ length: PAGINATION_SKELETON_COUNT }).map((_, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static loading placeholders
                  <BookCardSkeleton key={`page-skeleton-${idx}`} />
                ))}
            </div>
          )}

          <div ref={sentinelRef} className='flex justify-center py-8' aria-hidden={!hasNextPage}>
            {!hasNextPage && availableBooks.length > 0 && (
              <p className='font-mono text-sm text-muted-foreground'>
                Has llegado al final de los resultados
              </p>
            )}
          </div>
        </TooltipProvider>
      )}
    </section>
  );
};

export default AvailableBooks;
