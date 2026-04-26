import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'prism-dex-favorites';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStorage);

  const addFavorite = useCallback(
    (id, name) => {
      const idNum = Number(id);
      if (!Number.isFinite(idNum) || !name) return;
      setFavorites((prev) => {
        if (prev.some((p) => p.id === idNum)) return prev;
        const next = [...prev, { id: idNum, name: String(name) }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback((id) => {
    const idNum = Number(id);
    setFavorites((prev) => {
      const next = prev.filter((p) => p.id !== idNum);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (id, name) => {
      const idNum = Number(id);
      if (!Number.isFinite(idNum) || !name) return;
      setFavorites((prev) => {
        const exists = prev.some((p) => p.id === idNum);
        const next = exists
          ? prev.filter((p) => p.id !== idNum)
          : [...prev, { id: idNum, name: String(name) }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === Number(id)),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites dentro de FavoritesProvider');
  return ctx;
}
