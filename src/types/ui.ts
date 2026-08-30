export type Theme = 'dark' | 'light';

export interface UIStore {
  showMenu: boolean;
  setShowMenu: (state: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
