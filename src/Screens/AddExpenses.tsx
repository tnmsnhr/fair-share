import {
  InteractionManager,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@/theme/theme";
import {
  Card,
  Chip,
  Icon,
  Input,
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
import { colors } from "@/theme/colors";
import { Body2, Body3, Header5 } from "@/ui-components/Typography";

type AddExpensesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREEN.ADD_EXPENSES
>;

type SelectableContact = Contact & { selected: boolean };

const ACCESSORY_ID = "kbd-accessory";

const AddExpenses: React.FC<AddExpensesScreenProps> = ({
  navigation,
  route,
}) => {
  const s = useStyles();

  const [participants, setParticipants] = useState<SelectableContact[]>([]);
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
    setParticipants(contacts);
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

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    const { key } = e.nativeEvent;
    console.log(query?.length, e.nativeEvent);

    const updatedParticipants = [...participants];

    if (query?.length === 0 && key == "Backspace") {
      if (!updatedParticipants[updatedParticipants?.length - 1].selected) {
        updatedParticipants[updatedParticipants?.length - 1].selected = true;
      } else {
        updatedParticipants.pop();
      }
    }

    setParticipants(updatedParticipants);
  };

  return (
    <>
      <ScreenKAV>
        <View style={s.root}>
          <View style={s.splitWithContainer}>
            <Card style={{}}>
              <Body2 weight="semibold" style={{ marginBottom: 16 }}>
                Participants:
              </Body2>
              <View style={s.splitWith}>
                {participants?.length > 0 &&
                  participants?.map((el) => (
                    <Chip
                      label={el?.name}
                      key={el?.id}
                      style={[el?.selected && s.selectedParticipant]}
                    />
                  ))}
                <TextInput
                  placeholder={
                    participants?.length === 0
                      ? "Enter names, emails or phone#"
                      : ""
                  }
                  style={s.splitWithInput}
                  ref={nameRef}
                  returnKeyType="next"
                  onSubmitEditing={handleContactNext}
                  onKeyPress={handleKeyPress}
                  onChangeText={handleQuery}
                  value={query}
                />
              </View>
            </Card>
          </View>

          {participants?.length > 0 && !query?.trim() && (
            <ScrollView
              contentContainerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 16,
              }}
            >
              <Card style={{ padding: 0 }}>
                <View style={s.topAmountSection}>
                  <View style={s.amountContainerHeader}>
                    <Body2 weight="semibold" tone="primary">
                      Amount:
                    </Body2>
                    <TouchableOpacity style={s.payConfig} activeOpacity={0.7}>
                      <Body3>Paid by you and split equally</Body3>
                      <Icon name="chevronDown" size={16} />
                    </TouchableOpacity>
                  </View>
                  <View style={s.amountBox}>
                    <TouchableOpacity style={s.currency}>
                      <Header5
                        weight="semibold"
                        tone="inverse"
                        style={{ marginRight: 4 }}
                      >
                        ₹
                      </Header5>
                      <Icon name="chevronDown" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Enter Amount"
                      ref={amountRef}
                      style={s.amountInput}
                      placeholderTextColor={"#ddddddff"}
                      inputAccessoryViewID={
                        Platform.OS === "ios" ? ACCESSORY_ID : undefined
                      }
                    />
                  </View>
                </View>
                <Separator />
                <View style={s.noteSection}>
                  <Body2 weight="semibold">Notes(Optional):</Body2>
                  <Input
                    placeholder="Add description"
                    containerStyle={s.noteInput}
                  />
                </View>
              </Card>

              {/* <KeyboardAccessory nativeID={ACCESSORY_ID} label="Next" /> */}
              <Separator />
            </ScrollView>
          )}
          {(participants?.length === 0 || !!query?.trim()) && (
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 16,
                flex: 1,
              }}
            >
              <ContactPicker
                // UNSAFE_STYLE={s.contactPicker}
                onSelect={onContactSelect}
                selected={participants}
                query={query}
              />
            </View>
          )}
        </View>
      </ScreenKAV>
    </>
  );
};

export default AddExpenses;

const useStyles = makeStyles((t) => {
  return {
    root: {
      flex: 1,
      backgroundColor: colors.gray50,
      paddingTop: s("md"),
    },
    splitWithContainer: {
      paddingHorizontal: s("md"),
      flexDirection: "row",
      gap: s("xs"),
      flexWrap: "wrap",
    },
    splitWith: {
      flexDirection: "row",
      gap: s("xs"),
      flexWrap: "wrap",
      alignItems: "center",
    },
    selectedParticipant: {
      backgroundColor: colors.tertiary950,
    },
    splitWithInput: {
      height: s("2xl"),
      minWidth: 50,
      flex: 1,
    },
    topAmountSection: {
      padding: s("lg"),
    },
    amountContainerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    payConfig: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.border,
      padding: s("xs"),
      borderRadius: 10,
    },
    amountBox: {
      height: 72,
      marginTop: 16,
      borderWidth: 1,
      borderColor: t.primary,
      borderRadius: 16,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    amountInput: {
      fontSize: 24,
      fontFamily: "Inter_600SemiBold",
      flex: 1,
      color: t.primary,
    },
    currency: {
      backgroundColor: t.primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: s("sm"),
      paddingVertical: 2,
      borderRadius: 16,
      marginRight: s("md"),
    },
    noteSection: {
      padding: s("lg"),
    },
    noteInput: {
      marginTop: s("md"),
    },
  };
});
