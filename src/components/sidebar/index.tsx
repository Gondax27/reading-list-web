import { X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import useBreakpoint from '@/hooks/useBreakpoints';

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
  }, [isSmallDisplay, show, setShow]);

  const handleClose = useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      setShow(!show);
    },
    [show, setShow]
  );

  return (
    show && (
      <div className='absolute inset-0'>
        <div
          className={`absolute inset-0 z-[3] bg-black/40 backdrop-blur-xs ${
            !allowOutsideClick ? 'pointer-events-none' : ''
          }`}
          onClick={handleClose}
        />

        <aside className='animation-sidebar-in absolute inset-y-0 right-0 z-[4] h-dvh w-full overflow-y-auto border-l border-border bg-card p-6 shadow-2xl sm:w-[35rem]'>
          <header className='flex w-full items-start justify-end'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'
              onClick={handleClose}
              aria-label='Cerrar barra lateral'
            >
              <X className='size-5' />
            </Button>
          </header>

          <section>{element}</section>
        </aside>
      </div>
    )
  );
};

const Sidebar = React.memo(SidebarElement);

export default Sidebar;
