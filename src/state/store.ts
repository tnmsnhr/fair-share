// src/state/store.ts
import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  ThemePref,
  CurrencyCode,
  User,
  Contact,
  Group,
  TransactionEntry,
  Store,
} from "./types";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createContactsSlice, type ContactsSlice } from "./slices/contacts";
import { createExpensesSlice, type ExpensesSlice } from "./slices/expenses";

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector<Store>((set, get) => ({
        ...createUserSlice(set, get, undefined as any),
        ...createContactsSlice(set, get, undefined as any),
        ...createExpensesSlice(set, get, undefined as any),

        _hydrated: false,
        _setHydrated: (b) => set({ _hydrated: b }),
      })),
      {
        name: "fs.root",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (s) => ({
          me: s.me,
          contacts: s.contacts,
          groups: s.groups,
          transactions: s.transactions,
        }),
        onRehydrateStorage: () => (state) => state?._setHydrated(true),
      }
    )
  )
);
