import React, { useCallback, useEffect } from 'react';

import CloseIcon from '@/assets/CloseIcon';

import './styles.css';

interface SidebarProps {
  allowOutsideClick?: boolean;
  element: React.ReactNode;
  show: boolean;
  setShow: (state: boolean) => void;
}

const SidebarElement = ({ allowOutsideClick, element, show, setShow }: SidebarProps) => {
  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [show]);

  const handleClose = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    setShow(!show)
  }, [show, setShow]);

  return (
    show && (
      <div className='absolute inset-0'>
        <div
          className={`absolute inset-0 z-[3] bg-black/30 ${
            !allowOutsideClick ? 'pointer-events-none' : ''
          }`}
          onClick={handleClose}
        />

        <aside className='animation-sidebar-in absolute inset-y-0 right-0 w-[35rem] z-[4] bg-slate-800 p-8'>
          <header className='flex items-start justify-end w-full'>
            <button
              className='p-2 text-white hover:text-purple-900 transition-[color] w-fit'
              onClick={handleClose}
            >
              <CloseIcon className='size-5' />
            </button>
          </header>

          <section>{element}</section>
        </aside>
      </div>
    )
  );
};

const Sidebar = React.memo(SidebarElement);

export default Sidebar;
