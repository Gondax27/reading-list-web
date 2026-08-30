import { create } from 'zustand';

import type { Theme, UIStore } from '@/types/ui';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const useUIStore = create<UIStore>((set, get) => ({
  showMenu: false,
  setShowMenu: (state: boolean) => set({ showMenu: state }),
  theme: initialTheme,
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyThemeToDOM(nextTheme);
    set({ theme: nextTheme });
  },
}));
