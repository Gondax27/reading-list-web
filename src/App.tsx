import AvailableBooks from '@/components/AvailableBooks';
import ReadingList from '@/components/ReadingList';
import { useUIStore } from '@/store/ui';
import Sidebar from './components/sidebar';

const App = () => {
  const showMenu = useUIStore((state) => state.showMenu);
  const setShowMenu = useUIStore((state) => state.setShowMenu);

  return (
    <>
      <main className='grid grid-cols-1 gap-6 p-10 lg:grid-cols-3'>
        <AvailableBooks />

        <ReadingList
          className='p-6 rounded-2xl shadow-lg bg-card/60 backdrop-blur-md border border-border transition-[opacity] animation-fade-in hidden lg:block'
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
  );
};

export default App;
