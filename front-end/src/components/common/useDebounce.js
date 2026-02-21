import { useEffect, useState } from "react";

/*
========================================
Reusable Debounce Hook
Prevents filtering on every keystroke
Improves performance
========================================
*/

export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
