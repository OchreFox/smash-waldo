import { useState, useEffect } from "react";

// Workaround for hydrating state from localStorage
// https://github.com/pmndrs/zustand/issues/324
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};
