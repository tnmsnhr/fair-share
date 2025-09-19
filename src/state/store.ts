import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** ---- Slices (types) ---- */
type ThemePref = "system" | "light" | "dark";

type SessionSlice = {
  token?: string;
  setToken: (t?: string) => void;
  clearSession: () => void;
};

type UISlice = {
  themePreference: ThemePref;
  setThemePreference: (p: ThemePref) => void;

  bottomSheetOpen: boolean;
  setBottomSheetOpen: (open: boolean) => void;
};

type SyncSlice = {
  /** number of offline operations waiting to sync */
  offlineQueue: number;
  setOfflineQueue: (n: number) => void;
  incOfflineQueue: () => void;
  decOfflineQueue: () => void;
};

type Hydration = {
  /** turns true after rehydration from storage */
  _hydrated: boolean;
  _setHydrated: (b: boolean) => void;
};

export type Store = SessionSlice & UISlice & SyncSlice & Hydration;

/** ---- Store ---- */
export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Session
        token: undefined,
        setToken: (t) => set({ token: t }),
        clearSession: () => set({ token: undefined }),

        // UI
        themePreference: "system",
        setThemePreference: (p) => set({ themePreference: p }),

        bottomSheetOpen: false,
        setBottomSheetOpen: (open) => set({ bottomSheetOpen: open }),

        // Sync
        offlineQueue: 0,
        setOfflineQueue: (n) => set({ offlineQueue: n }),
        incOfflineQueue: () =>
          set((s) => ({ offlineQueue: s.offlineQueue + 1 })),
        decOfflineQueue: () =>
          set((s) => ({ offlineQueue: Math.max(0, s.offlineQueue - 1) })),

        // Hydration flag
        _hydrated: false,
        _setHydrated: (b) => set({ _hydrated: b }),
      }),
      {
        name: "fs.store", // storage key
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage: () => (state) => {
          // called after hydration completes
          state?._setHydrated(true);
        },
        // (optional) only persist some keys:
        // partialize: (s) => ({ token: s.token, themePreference: s.themePreference }),
      }
    )
  )
);
