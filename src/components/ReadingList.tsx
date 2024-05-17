import BookCard from '@/components/BookCard';

import { useLibraryStore } from '@/store/library';

interface ReadingListProps {
  className: string;
  wrapperImagesClassName: string;
}

const ReadingList = ({ className, wrapperImagesClassName }: ReadingListProps) => {
  const readingList = useLibraryStore(state => state.readingList);
  const removeReadingBook = useLibraryStore(state => state.removeReadingBook);

  return (
    readingList.length > 0 && (
      <section className={className}>
        <h2
          style={{ whiteSpace: 'nowrap' }}
          className='max-w-full overflow-hidden font-mono text-3xl font-semibold text-center text-white text-ellipsis text-nowrap'
          title='Lista de Lectura'
        >
          Lista de Lectura
        </h2>

        <hr className='mt-3 mb-4 border-dashed' />

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
      </section>
    )
  );
};

export default ReadingList;
