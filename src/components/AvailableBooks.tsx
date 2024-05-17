import BookCard from '@/components/BookCard';

import Filterbox from './Filterbox';

import { useLibraryStore } from '@/store/library';

const AvailableBooks = () => {
  const availableBooks = useLibraryStore(state => state.availableBooks);
  const readingList = useLibraryStore(state => state.readingList);
  const addReadingBook = useLibraryStore(state => state.addReadingBook);

  return (
    <section className='col-span-1 lg:col-span-2'>
      <header className='mb-6'>
        <h1 className='font-mono text-4xl font-bold text-white'>
          {availableBooks.length} Libros disponibles
        </h1>

        {readingList.length > 0 && (
          <h2 className='mt-1 font-mono text-xl text-white'>
            {readingList.length} en la lista de lectura
          </h2>
        )}

        <Filterbox />
      </header>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {availableBooks.map((book, idx) => (
          <BookCard
            key={book.ISBN}
            book={book}
            type='available-list'
            idx={idx}
            handleChangeBook={addReadingBook}
          />
        ))}
      </div>
    </section>
  );
};

export default AvailableBooks;
