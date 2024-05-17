import BookCard from '@/components/BookCard';

import { useLibraryStore } from '@/store/library';

const ReadingList = () => {
  const readingList = useLibraryStore(state => state.readingList);
  const removeReadingBook = useLibraryStore(state => state.removeReadingBook);

  return (
    readingList.length > 0 && (
      <section className='p-5 rounded-md shadow-lg bg-slate-700/50'>
        <h2 className='font-mono text-3xl font-semibold text-center text-white'>Lista de Lectura</h2>
        <hr className='mt-3 mb-4 border-dashed' />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2'>
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
