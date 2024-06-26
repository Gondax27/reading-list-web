import React, { useCallback, useEffect, useMemo } from 'react';

import useBreakpoint from '@/hooks/useBreakpoints';

import CloseIcon from '@/assets/CloseIcon';

import './styles.css';

interface SidebarProps {
  allowOutsideClick?: boolean;
  element: React.ReactNode;
  show: boolean;
  setShow: (state: boolean) => void;
}

const SidebarElement = ({ allowOutsideClick, element, show, setShow }: SidebarProps) => {
  const breakpoint = useBreakpoint();
  const isSmallDisplay = useMemo(() => ['xs', 'sm', 'md'].includes(breakpoint || ''), [breakpoint]);

  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [show]);

  useEffect(() => {
    if (!isSmallDisplay && show) setShow(false);
  }, [isSmallDisplay]); // eslint-disable-line

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

        <aside className='animation-sidebar-in absolute inset-y-0 right-0 w-full sm:w-[35rem] z-[4] bg-slate-800 p-8 !overflow-y-auto h-dvh'>
          <header className='flex items-start justify-end w-full'>
            <button
              className='p-1 text-white hover:text-purple-700 transition-[border,color] w-fit border rounded-md hover:border-purple-700 shadow-md'
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
