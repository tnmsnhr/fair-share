import { useTheme } from "@/theme/theme";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typo } from "./Typography";
// import Animated from "react-native-reanimated";
import React from "react";
import { PrimaryButton } from "./Button";

type Props = {
  /** For iOS: match TextInput.inputAccessoryViewID */
  nativeID?: string; // default: 'kbd-accessory'
  label?: string; // default: 'Next'
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export const KeyboardAccessory: React.FC<Props> = ({
  nativeID = "kbd-accessory",
  label = "Next",
  onPress,
  disabled,
  style,
}) => {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  if (Platform.OS === "ios") {
    return (
      <InputAccessoryView backgroundColor={"transparent"} nativeID={nativeID}>
        <View
          style={[
            styles.bar,
            {
              paddingBottom: 10,
              backgroundColor: t.card,
              borderTopColor: t.border,
            },
            style,
          ]}
        >
          <PrimaryButton
            label={label}
            onPress={() => {}}
            disabled={disabled}
            style={styles.btn}
          />
        </View>
      </InputAccessoryView>
    );
  }

  const [visible, setVisible] = React.useState(false);
  const bottom = React.useRef(new Animated.Value(0)).current;
  const kbH = React.useRef(0);

  React.useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      kbH.current = e.endCoordinates?.height ?? 0;
      setVisible(true);
      Animated.timing(bottom, {
        toValue: kbH.current,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(bottom, {
        toValue: 0,
        duration: 160,
        useNativeDriver: false,
      }).start(({ finished }) => finished && setVisible(false));
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [bottom]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.androidWrap, { bottom }]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: t.card,
            borderTopColor: t.border,
            paddingBottom: Math.max(insets.bottom - 4, 0),
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          style={[
            styles.btn,
            { backgroundColor: disabled ? t.border : t.primary },
          ]}
        >
          {/* Replace with Typo if you prefer */}
          {/* <Typo inline tone="inverse" weight="700">{label}</Typo> */}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  androidWrap: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  btn: {
    minWidth: 88,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
