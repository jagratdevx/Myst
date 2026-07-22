import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetConfig, DEFAULT_WIDGETS } from '../types/widget';

const STORAGE_KEY = '@myst_widget_config';

interface WidgetStore {
  widgets: WidgetConfig[];
  loading: boolean;
  fetchWidgets: () => Promise<void>;
  toggleWidget: (id: string) => Promise<void>;
  reorderWidgets: (fromIndex: number, toIndex: number) => Promise<void>;
  resetWidgets: () => Promise<void>;
}

export const useWidgetStore = create<WidgetStore>((set, get) => ({
  widgets: DEFAULT_WIDGETS,
  loading: false,

  fetchWidgets: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ widgets: JSON.parse(raw), loading: false });
      } else {
        set({ loading: false });
      }
    } catch { set({ loading: false }); }
  },

  toggleWidget: async (id) => {
    const widgets = get().widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    set({ widgets });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  },

  reorderWidgets: async (fromIndex, toIndex) => {
    const widgets = [...get().widgets];
    const [removed] = widgets.splice(fromIndex, 1);
    widgets.splice(toIndex, 0, removed);
    const reindexed = widgets.map((w, i) => ({ ...w, order: i }));
    set({ widgets: reindexed });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
  },

  resetWidgets: async () => {
    set({ widgets: DEFAULT_WIDGETS });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));
