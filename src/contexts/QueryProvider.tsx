// src/api/QueryProvider.tsx
import React from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: { retry: 1 },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "fs.react-query-cache",
  throttleTime: 1000,
});

// Network/focus wiring
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((s) => setOnline(!!s.isConnected))
);

focusManager.setEventListener((setFocused) => {
  const sub = AppState.addEventListener("change", (st) =>
    setFocused(st === "active")
  );
  return () => sub.remove();
});

export const QueryProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    {children}
  </PersistQueryClientProvider>
);
