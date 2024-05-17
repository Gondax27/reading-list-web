import { useEffect, useMemo, useState } from 'react';

/**
 * Función que retorna el tamaño actual de la pantalla
 * @param width
 * @returns
 */
const getCurrentBreakpoint = (width: number) => {
  if (width < 640) return 'xs';
  else if (width >= 640 && width < 768) return 'sm';
  else if (width >= 768 && width < 1024) return 'md';
  else if (width >= 1024 && width < 1280) return 'lg';
  else if (width >= 1280 && width < 1536) return 'xl';
  else if (width >= 1536) return '2xl';
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getCurrentBreakpoint(window.innerWidth));

  useEffect(() => {
    const calcInnerWidth = () => {
      const currentWidth = window.innerWidth
      setBreakpoint(() => getCurrentBreakpoint(currentWidth));
    };

    window.addEventListener('resize', calcInnerWidth);

    return () => {
      window.removeEventListener('resize', calcInnerWidth);
    };
  }, []);

  return useMemo(() => breakpoint, [breakpoint]);
};

export default useBreakpoint;