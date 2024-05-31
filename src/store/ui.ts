import { create } from 'zustand';

import type { UIStore } from '@/types/ui';

export const useUIStore = create<UIStore>(set => ({
  showMenu: false,
  setShowMenu: (state: boolean) => set({ showMenu: state })
}));
