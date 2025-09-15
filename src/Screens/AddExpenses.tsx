import {
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@/theme/theme";
import {
  Chip,
  Header,
  Icon,
  KeyboardAccessory,
  ScreenKAV,
  Separator,
  Typo,
} from "@/ui-components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, SCREEN } from "@/navigation/type";
import ContactPicker from "@/components/ContactPicker";
import { s } from "@/theme/spacing";
import { useFocusEffect } from "@react-navigation/native";
import { Contact } from "expo-contacts";

type AddExpensesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREEN.ADD_EXPENSES
>;

const ACCESSORY_ID = "kbd-accessory";

const AddExpenses: React.FC<AddExpensesScreenProps> = ({
  navigation,
  route,
}) => {
  const s = useStyles();

  const [sharedWith, setSharedWith] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");

  const amountRef = useRef(null);
  const nameRef = useRef(null);

  const handleBack = () => {
    navigation?.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsub = navigation.addListener("transitionEnd", () => {
        requestAnimationFrame(() => {
          InteractionManager.runAfterInteractions(() => {
            nameRef.current?.focus();
          });
        });
      });
      return unsub;
    }, [navigation])
  );

  const onContactSelect = (contacts: Contact[]) => {
    setSharedWith(contacts);
    setQuery("");
    amountRef?.current?.focus();
    console.log("onContactSelect", amountRef?.current);
  };

  const handleQuery = (q: string) => {
    setQuery(q);
  };

  const handleContactNext = (e) => {
    e.preventDefault();
    amountRef?.current?.focus();
  };

  return (
    <View style={{ flex: 1 }}>
      <Header UNSAFE_STYLE={s.topBar}>
        <Header.Left pressable onPress={handleBack}>
          <Icon name="chevronLeft" color="#fff" />
        </Header.Left>
        <Header.Title pressable>
          <Typo tone="inverse" variant="bodyStrong">
            Add an expense
          </Typo>
        </Header.Title>
        <Header.Right>
          <View style={s.currency}>
            <Typo variant="bodySmall" tone="inverse">
              ₹
            </Typo>
            <Icon name="chevronDown" size={14} color={"#fff"} />
          </View>
        </Header.Right>
      </Header>

      <ScreenKAV>
        <View style={s.splitWithContainer}>
          <View style={s.splitWith}>
            {sharedWith?.length > 0 &&
              sharedWith?.map((el) => (
                <Chip label={el?.name} pressable key={el?.id} />
              ))}
            <TextInput
              placeholder={
                sharedWith?.length === 0 ? "Enter names, emails or phone#" : ""
              }
              style={s.splitWithInput}
              ref={nameRef}
              returnKeyType="next"
              onSubmitEditing={handleContactNext}
              onChangeText={handleQuery}
              value={query}
            />
          </View>
        </View>
        <Separator />
        {sharedWith?.length > 0 && !query?.trim() && (
          // <KeyboardAvoidingView>
          <>
            <View style={s.amountContainer}>
              <Typo>Amount</Typo>
              <View style={s.amount}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0.00"
                  allowFontScaling
                  ref={amountRef}
                  style={s.amountInput}
                  placeholderTextColor={"#ddddddff"}
                  inputAccessoryViewID={
                    Platform.OS === "ios" ? ACCESSORY_ID : undefined
                  }
                />
              </View>
            </View>
            <KeyboardAccessory nativeID={ACCESSORY_ID} label="Next" />
          </>
        )}
        <Separator />
        {(sharedWith?.length === 0 || !!query?.trim()) && (
          <ContactPicker
            UNSAFE_STYLE={s.contactPicker}
            onSelect={onContactSelect}
            selected={sharedWith}
            query={query}
          />
        )}
      </ScreenKAV>
    </View>
  );
};

export default AddExpenses;

const useStyles = makeStyles((t) => {
  return {
    topBar: {
      backgroundColor: t.primary,
    },
    topbarTitle: {
      alignSelf: "center",
    },
    splitWithContainer: {
      paddingHorizontal: s("md"),
      marginVertical: s("sm"),
      flexDirection: "row",
      gap: s("xs"),
      flexWrap: "wrap",
    },
    splitWith: {
      flexDirection: "row",
      gap: s("xs"),
      flexWrap: "wrap",
      alignItems: "center",
      flex: 1,
    },
    splitWithInput: {
      height: s("xl"),
      minWidth: 50,
      flex: 1,
    },
    amountContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: s("md"),
    },
    amount: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    amountInput: {
      fontSize: 40,
      fontWeight: "bold",
      alignSelf: "center",
      color: t.primary,
      marginTop: s("xs"),
      minWidth: 80,
    },
    currency: {
      backgroundColor: "rgba(255,255,2545,0.2)",
      paddingHorizontal: s("sm"),
      paddingVertical: 2,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    contactPicker: {
      // paddingTop: 20,
    },
  };
});
