export enum SCREEN {
  HOME = "Home",
  ACTIVITY = "Activity",
  GROUPS = "Groups",
  ADD_EXPENSES = "AddExpenses",
  FRIENDS = "Friends",
  MY_PROFILE = "MyProfile",
}

export type RootStackParamList = {
  Tabs: undefined;
  [SCREEN.ADD_EXPENSES]: undefined;
  [SCREEN.MY_PROFILE]: undefined;
  [SCREEN.HOME]: undefined;
};
