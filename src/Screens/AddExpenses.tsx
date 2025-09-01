import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { makeStyles } from "@/theme/theme";
import { Typo } from "@/ui-components";

const AddExpenses = () => {
  const styles = useStyles();
  return (
    <View>
      <Typo>ADD EXPENSES</Typo>
    </View>
  );
};

export default AddExpenses;

const useStyles = makeStyles((t) => ({}));
