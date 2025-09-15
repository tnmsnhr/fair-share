export enum SCREEN {
  HOME = "Home",
  ACTIVITY = "Activity",
  GROUPS = "Groups",
  ADD_EXPENSES = "AddExpenses",
  FRIENDS = "Friends",
}

export type RootStackParamList = {
  Tabs: undefined;
  [SCREEN.ADD_EXPENSES]: undefined;
};
