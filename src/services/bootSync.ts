import NetInfo from "@react-native-community/netinfo";
import { flushExpenseQueue } from "./api/expenses";
import { queryClient } from "@/contexts/QueryProvider";

export function installOnlineSync() {
  NetInfo.addEventListener((s) => {
    if (s.isConnected) {
      flushExpenseQueue().finally(() => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      });
    }
  });
}
