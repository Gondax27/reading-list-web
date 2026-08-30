import { useEffect } from 'react';

import BookCard from '@/components/BookCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useLibraryStore } from '@/store/library';
import { useUIStore } from '@/store/ui';

interface ReadingListProps {
  className: string;
  wrapperImagesClassName: string;
}

const ReadingList = ({ className, wrapperImagesClassName }: ReadingListProps) => {
  const readingList = useLibraryStore((state) => state.readingList);
  const showMenu = useUIStore((state) => state.showMenu);

  const removeReadingBook = useLibraryStore((state) => state.removeReadingBook);
  const setShowMenu = useUIStore((state) => state.setShowMenu);

  useEffect(() => {
    if (readingList.length === 0 && showMenu) setShowMenu(false);
  }, [readingList.length, showMenu, setShowMenu]);

  return (
    readingList.length > 0 && (
      <section className={className}>
        <h2
          style={{ whiteSpace: 'nowrap' }}
          className='max-w-full overflow-hidden font-mono text-2xl font-semibold text-center text-foreground text-ellipsis text-nowrap sm:text-3xl'
          title='Lista de Lectura'
        >
          Lista de Lectura
        </h2>

        <hr className='mt-3 mb-5 border-border' />

        <TooltipProvider>
          <div className={wrapperImagesClassName}>
            {readingList.map((book, idx) => (
              <BookCard
                key={book.ISBN}
                book={book}
                type='reading-list'
                idx={idx}
                handleChangeBook={removeReadingBook}
              />
            ))}
          </div>
        </TooltipProvider>
      </section>
    )
  );
};

export default ReadingList;
