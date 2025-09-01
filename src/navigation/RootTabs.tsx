import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import TabBar from "./TabBar";
import Friends from "@/screens/Friends";
import AddExpenses from "@/screens/AddExpenses";
import Group from "@/screens/Group";
import Activity from "@/screens/Activity";
import { SCREEN } from "./type";

export type RootTabParamList = {
  [SCREEN.HOME]: undefined;
  [SCREEN.FRIENDS]: undefined;
  [SCREEN.GROUPS]: undefined;
  [SCREEN.ADD_EXPENSES]: undefined;
  [SCREEN.ACTIVITY]: undefined;
};

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      id="root-tabs"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <TabBar
          {...props}
          onPlusPress={() =>
            props.navigation.navigate(SCREEN.ADD_EXPENSES as never)
          }
        />
      )}
    >
      <Tab.Screen name={SCREEN.HOME} component={Home} />
      <Tab.Screen name={SCREEN.FRIENDS} component={Friends} />
      <Tab.Screen name={SCREEN.GROUPS} component={Group} />
      <Tab.Screen name={SCREEN.ACTIVITY} component={Activity} />
    </Tab.Navigator>
  );
}
