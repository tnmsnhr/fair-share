import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener((setOnline) => {
  const unsub = NetInfo.addEventListener((s) => setOnline(!!s.isConnected));
  return () => unsub();
});
