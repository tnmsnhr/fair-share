import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SessionState = {
  token?: string;
  setToken: (t?: string) => void;
  // put other global flags/preferences here
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (t) => set({ token: t }),
    }),
    { name: "fs.session", storage: createJSONStorage(() => AsyncStorage) }
  )
);
