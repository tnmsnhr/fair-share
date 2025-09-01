import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SCREEN } from "./type";
import RootTabs from "./RootTabs";
import AddExpenses from "@/screens/AddExpenses";

export type RootStackParamList = {
  Tabs: undefined;
  [SCREEN.ADD_EXPENSES]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      id="root-navigator"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={RootTabs} />
      <Stack.Screen
        name={SCREEN.ADD_EXPENSES}
        component={AddExpenses}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
