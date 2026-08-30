import { useEffect, useState } from 'react';

/**
 * Retorna un valor debounced para evitar requests excesivos al escribir en filtros
 */
const useDebouncedValue = <T>(value: T, delayMs = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
};

export default useDebouncedValue;
