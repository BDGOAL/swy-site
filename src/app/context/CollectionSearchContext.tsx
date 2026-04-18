import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SearchableCollectionItem } from "../utils/collectionSearch";

type CollectionSearchContextValue = {
  items: SearchableCollectionItem[];
  setItems: (items: SearchableCollectionItem[]) => void;
  isOpen: boolean;
  query: string;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
};

const CollectionSearchContext = createContext<CollectionSearchContextValue | null>(
  null
);

export function CollectionSearchProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<SearchableCollectionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const setItems = useCallback((next: SearchableCollectionItem[]) => {
    setItemsState(next);
  }, []);

  const openSearch = useCallback(() => setIsOpen(true), []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const value = useMemo(
    () => ({
      items,
      setItems,
      isOpen,
      query,
      openSearch,
      closeSearch,
      setQuery,
    }),
    [items, setItems, isOpen, query, openSearch, closeSearch]
  );

  return (
    <CollectionSearchContext.Provider value={value}>
      {children}
    </CollectionSearchContext.Provider>
  );
}

export function useCollectionSearch() {
  const ctx = useContext(CollectionSearchContext);
  if (!ctx) {
    throw new Error("useCollectionSearch must be used within CollectionSearchProvider");
  }
  return ctx;
}
