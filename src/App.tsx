import AvailableBooks from '@/components/AvailableBooks';
import ReadingList from '@/components/ReadingList';
import Sidebar from './components/sidebar';
import Spinner from '@/components/Spinner';

import useBooksQuery from '@/hooks/useBooksQuery';

const App = () => {
  const { booksQuery, showMenu, setShowMenu } = useBooksQuery();

  return (
    booksQuery.isLoading
      ? (
        <main className='grid w-full min-h-dvh place-content-center'>
          <Spinner />
        </main>
      )

      : (
        <>
          <main className='grid grid-cols-1 gap-6 p-10 lg:grid-cols-3'>
            <AvailableBooks />

            <ReadingList
              className='p-5 rounded-md shadow-lg bg-slate-700/50 transition-[opacity] animation-fade-in hidden lg:block'
              wrapperImagesClassName='grid grid-cols-2 gap-4 lg:grid-cols-1 xl:grid-cols-2'
            />
          </main>

          <Sidebar
            element={
              <ReadingList
                className='transition-[opacity] animation-fade-in'
                wrapperImagesClassName='grid grid-cols-2 gap-4'
              />
            }
            show={showMenu}
            allowOutsideClick
            setShow={setShowMenu}
          />
        </>
      )
  );
};

export default App;
