// src/state/slices/user.ts
import type { StateCreator } from "zustand";
import type { Store, User, ThemePref, CurrencyCode } from "../types";

export type UserSlice = {
  me: User;
  setThemePreference: (p: ThemePref) => void;
  setCurrency: (c: CurrencyCode) => void;
  updateProfile: (p: Partial<User>) => void;
};

export const createUserSlice: StateCreator<
  Store,
  [
    ["zustand/devtools", never],
    ["zustand/persist", unknown],
    ["zustand/subscribeWithSelector", never]
  ],
  [],
  UserSlice
> = (set, get) => ({
  // Seed a local user (no API yet)
  me: {
    id: "me",
    username: "tanmoy",
    fullName: "Tanmoy",
    email: "",
    phone: "",
    avatarUrl: "",
    currency: "INR",
    themePreference: "system",
  },

  setThemePreference: (p) =>
    set(
      (s) => ({ me: { ...s.me, themePreference: p } }),
      false,
      "user/setTheme"
    ),

  setCurrency: (c) =>
    set((s) => ({ me: { ...s.me, currency: c } }), false, "user/setCurrency"),

  updateProfile: (p) =>
    set((s) => ({ me: { ...s.me, ...p } }), false, "user/updateProfile"),
});
