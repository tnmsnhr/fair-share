import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList, SCREEN } from "./type";
import RootTabs from "./RootTabs";
import AddExpenses from "@/screens/AddExpenses";
import { Header, Icon } from "@/ui-components";
import { Body1 } from "@/ui-components/Typography";
import { makeStyles } from "@/theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const s = useStyles();
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
          // presentation: "formSheet",
          // gestureEnabled: false,
          headerShown: true,
          // headerBackTitle: "",
          header: ({ navigation, options }) => (
            <Header UNSAFE_STYLE={s.topBar}>
              <Header.Left
                pressable
                onPress={() => navigation.canGoBack() && navigation.goBack()}
              >
                <Icon name="chevronLeft" color="#fff" />
              </Header.Left>
              <Header.Title pressable>
                <Body1 tone="inverse" weight="medium">
                  Add an expense
                </Body1>
              </Header.Title>
            </Header>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const useStyles = makeStyles((t) => ({
  topBar: {
    backgroundColor: t.primary,
  },
}));
