import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { makeStyles } from "@/theme/theme";
import { Icon } from "@/ui-components";
import { Body1, Body3 } from "@/ui-components/Typography";
import { colors } from "@/theme/colors";
import Bg from "../assets/images/radial_gradient.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s } from "@/theme/spacing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, SCREEN } from "@/navigation/type";

type MyProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREEN.MY_PROFILE
>;

const MyProfile: React.FC<MyProfileScreenProps> = ({ navigation }) => {
  const s = useStyles();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.profileTop]}>
        {/* <Bg style={[s.patternBg]} preserveAspectRatio="xMaxYMin " /> */}
        <TouchableOpacity
          onPress={() => {
            navigation?.canGoBack() && navigation?.goBack();
          }}
          activeOpacity={0.6}
          style={{
            marginTop: top - 16,
            alignSelf: "flex-start",
            padding: 16,
            marginBottom: 32,
          }}
        >
          <Icon name="chevronLeft" color="#fff" />
        </TouchableOpacity>
        <View style={s.profileInfo}>
          <TouchableOpacity activeOpacity={0.6} style={s.avatar}>
            <Icon name="person" size={40} color="#fff" variant="outline" />
          </TouchableOpacity>
          <Body1 weight="semibold" tone="inverse">
            Tanmoy Singha Roy
          </Body1>
          <Body3 tone="inverse">+91-8910115736</Body3>
        </View>
      </View>
    </View>
  );
};

export default MyProfile;

const useStyles = makeStyles((t) => ({
  profileTop: {
    backgroundColor: colors.primaryDark,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: s("4xl"),
    borderBottomRightRadius: s("2xl"),
    borderBottomLeftRadius: s("2xl"),
  },
  patternBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 200,
    left: "20%",
    transform: [{ rotate: "-90deg" }],
  },
  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: t.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: s("md"),
  },
}));
