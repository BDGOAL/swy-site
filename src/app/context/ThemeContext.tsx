/**
 * Theme Context
 * Single visual mode: ocean. Type retains 'noir' for shared prop typings only.
 */

import { createContext, useContext, ReactNode } from 'react';

export type ThemeMode = 'noir' | 'ocean';

interface ThemeContextType {
  mode: ThemeMode;
}

const themeContextValue: ThemeContextType = { mode: 'ocean' };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
