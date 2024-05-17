import TrashIcon from '@/assets/TrashIcon';

import type { Book } from '@/types/library';

interface BookCardProps {
  book: Book;
  type: 'available-list' | 'reading-list';
  idx: number;
  handleChangeBook: (book: Book) => void;
}

const BookCard = ({ book, type, idx, handleChangeBook }: BookCardProps) => (
  <article
    className={
      type === 'available-list'
        ? 'cursor-pointer hover:saturate-200 hover:scale-105 transition-[transform,filter,opacity] animation-fade-in'
        : 'animation-fade-in transition-[opacity]'
    }
    onClick={
      type === 'available-list'
        ? () => handleChangeBook(book)
        : () => null
    }
  >
    <div className='relative flex flex-col'>
      <img
        src={book.cover}
        alt={`Imagén del cover del libro ${book.title}`}
        className='w-auto rounded-md h-96 aspect-[1594/2541] flex-auto'
        loading={type === 'available-list' ? idx > 7 ? 'lazy' : 'eager' : idx > 5 ? 'lazy' : 'eager'}
      />

      {type === 'reading-list' && (
        <button
          className='absolute inline-flex items-center justify-center p-1 font-bold text-white transition-colors bg-red-600 rounded-md shadow-md top-2 right-2 hover:bg-red-400'
          onClick={() => handleChangeBook(book)}
        >
          <TrashIcon className='size-7' />
          <span className='sr-only'>Delete</span>
        </button>
      )}
    </div>
  </article>
);

export default BookCard;
