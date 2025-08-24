import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import TabBar from "./TabBar";
import Friends from "@/screens/Friends";
import AddExpenses from "@/screens/AddExpenses";
import Group from "@/screens/Group";
import Activity from "@/screens/Activity";
import { Screen } from "./type";

export type RootTabParamList = {
  [Screen.HOME]: undefined;
  [Screen.FRIENDS]: undefined;
  [Screen.GROUPS]: undefined;
  [Screen.ADD_EXPENSES]: undefined;
  [Screen.ACTIVITY]: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs() {
  return (
    <Tab.Navigator
      id="root-tabs"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name={Screen.HOME} component={Home} />
      <Tab.Screen name={Screen.FRIENDS} component={Friends} />
      <Tab.Screen name={Screen.ADD_EXPENSES} component={AddExpenses} />
      <Tab.Screen name={Screen.GROUPS} component={Group} />
      <Tab.Screen name={Screen.ACTIVITY} component={Activity} />
    </Tab.Navigator>
  );
}
