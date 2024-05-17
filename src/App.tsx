import AvailableBooks from '@/components/AvailableBooks';
import ReadingList from '@/components/ReadingList';
import Spinner from '@/components/Spinner';

import useBooksQuery from '@/hooks/useBooksQuery';

const App = () => {
  const { booksQuery } = useBooksQuery();

  return (
    booksQuery.isLoading
      ? (
        <main className='grid w-full min-h-dvh place-content-center'>
          <Spinner />
        </main>
      )
      : (
        <main className='grid grid-cols-1 gap-6 p-10 lg:grid-cols-3'>
          <AvailableBooks />
          <ReadingList />
        </main>
      )
  );
};

export default App;
