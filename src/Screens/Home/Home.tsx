import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card, Icon, Layout, Separator } from "@/ui-components";
import { Body1, Body2, Body3, Header3 } from "@/ui-components/Typography";
import { makeStyles } from "@/theme/theme";
import { colors } from "@/theme/colors";
import { s } from "@/theme/spacing";
import Bg from "../../assets/images/radial_gradient.svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, SCREEN } from "@/navigation/type";
import { useHydrated, useRecentTransactions } from "@/state/selectors";

const { width } = Dimensions.get("window");
const SUMMARY_CARD = 4;

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, SCREEN.HOME>;

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const s = useStyles();
  const tx = useRecentTransactions(10);
  const hydrated = useHydrated();

  const handleProfileTap = () => {
    navigation?.navigate(SCREEN.MY_PROFILE);
  };

  console.log(tx);

  return (
    <Layout scroll>
      <View style={s.topBar}>
        <View style={s.topBarLeft}>
          <TouchableOpacity
            style={s.avatar}
            activeOpacity={0.6}
            onPress={handleProfileTap}
          >
            <Icon name="person" variant="outline" color="#fff" />
          </TouchableOpacity>
          <View style={s.namePhone}>
            <Body2 weight="semibold">Good evening, Tanmoy</Body2>
            <Body3 tone="debug">+91-8910115736</Body3>
          </View>
        </View>
        {/* <TouchableOpacity style={s.topBarRight} activeOpacity={0.6}>
          <Icon name="person" size={32} color={colors.primary900} />
        </TouchableOpacity> */}
      </View>

      <Card variant="primary">
        <Bg style={[s.cardSvg]} preserveAspectRatio="xMaxYMin slice" />
        <View style={s.cardRow}>
          <View>
            <Body2 style={{ color: colors.primary400 }}>My Balance</Body2>
            <Header3 weight="semibold" tone="inverse">
              $61,295.40
            </Header3>
          </View>
          <TouchableOpacity activeOpacity={0.6} style={s.cardRight}>
            <Body3>View Spending</Body3>
            <Icon name="chevronRight" style={{ marginLeft: 4 }} size={12} />
          </TouchableOpacity>
        </View>

        <View style={[s.cardRow, { marginTop: 16, marginBottom: 12 }]}>
          <View>
            <Body2 style={{ color: colors.primary400 }}>You are owed</Body2>
            <Body2 weight="semibold" tone="inverse">
              $61,295.40
            </Body2>
          </View>
        </View>
        <View style={[s.cardRow]}>
          <View>
            <Body2 style={{ color: colors.primary400 }}>You owe</Body2>
            <Body2 weight="semibold" tone="inverse">
              $61,295.40
            </Body2>
          </View>
        </View>
      </Card>

      <View style={s.spendingSummary}>
        <Body1 weight="medium">Spending summary:</Body1>
        <View style={s.summaryCardContainer}>
          <View style={s.summaryCard}>
            <Icon name="receipt" size={32} color={colors.primary900} />
          </View>
          <View style={s.summaryCard}>
            <Icon name="receipt" size={32} color={colors.primary900} />
          </View>
          <View style={s.summaryCard}>
            <Icon name="receipt" size={32} color={colors.primary900} />
          </View>
          <View style={s.summaryCard}>
            <Icon name="receipt" size={32} color={colors.primary900} />
          </View>
        </View>
      </View>

      <View style={s.recentTransactionsContainer}>
        <Body1 weight="medium">Recent Transactions:</Body1>
        <View style={s.recentTransactions}>
          <TouchableOpacity style={s.transactionItem}>
            <View style={s.transactionLeft}>
              <View
                style={[
                  s.transactionAvatar,
                  { backgroundColor: colors.tertiary900 },
                ]}
              >
                <Icon name="receipt" color="#fff" size={20} />
              </View>
              <View>
                <Body2 weight="medium">Interest</Body2>
                <Body3 tone="muted">Saving Interest</Body3>
                <Body3 tone="muted">25 Oct 2024 01:30 PM</Body3>
              </View>
            </View>
            <Body2 weight="bold" tone="primary">
              + $27.39
            </Body2>
          </TouchableOpacity>
          <Separator color={colors.gray200} />
          <TouchableOpacity style={s.transactionItem}>
            <View style={s.transactionLeft}>
              <View
                style={[
                  s.transactionAvatar,
                  { backgroundColor: colors.tertiary900 },
                ]}
              >
                <Icon name="receipt" color="#fff" size={20} />
              </View>
              <View>
                <Body2 weight="medium">Interest</Body2>
                <Body3 tone="muted">Saving Interest</Body3>
                <Body3 tone="muted">25 Oct 2024 01:30 PM</Body3>
              </View>
            </View>
            <Body2 weight="bold" tone="tertiary">
              - $27.39
            </Body2>
          </TouchableOpacity>
          <Separator color={colors.gray200} />
          <TouchableOpacity style={s.transactionItem}>
            <View style={s.transactionLeft}>
              <View
                style={[
                  s.transactionAvatar,
                  { backgroundColor: colors.tertiary900 },
                ]}
              >
                <Icon name="receipt" color="#fff" size={20} />
              </View>
              <View>
                <Body2 weight="medium">Interest</Body2>
                <Body3 tone="muted">Saving Interest</Body3>
                <Body3 tone="muted">25 Oct 2024 01:30 PM</Body3>
              </View>
            </View>
            <Body2 weight="bold" tone="tertiary">
              - $27.39
            </Body2>
          </TouchableOpacity>
          <Separator color={colors.gray200} />
          <TouchableOpacity style={s.transactionItem}>
            <View style={s.transactionLeft}>
              <View
                style={[
                  s.transactionAvatar,
                  { backgroundColor: colors.tertiary900 },
                ]}
              >
                <Icon name="receipt" color="#fff" size={20} />
              </View>
              <View>
                <Body2 weight="medium">Interest</Body2>
                <Body3 tone="muted">Saving Interest</Body3>
                <Body3 tone="muted">25 Oct 2024 01:30 PM</Body3>
              </View>
            </View>
            <Body2 weight="bold" tone="tertiary">
              - $27.39
            </Body2>
          </TouchableOpacity>
          <Separator color={colors.gray200} />
          <TouchableOpacity style={s.transactionItem}>
            <View style={s.transactionLeft}>
              <View
                style={[
                  s.transactionAvatar,
                  { backgroundColor: colors.tertiary900 },
                ]}
              >
                <Icon name="receipt" color="#fff" size={20} />
              </View>
              <View>
                <Body2 weight="medium">Interest</Body2>
                <Body3 tone="muted">Saving Interest</Body3>
                <Body3 tone="muted">25 Oct 2024 01:30 PM</Body3>
              </View>
            </View>
            <Body2 weight="bold" tone="tertiary">
              - $27.39
            </Body2>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default Home;

const useStyles = makeStyles((t) => ({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: s("lg"),
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    height: 52,
    width: 52,
    backgroundColor: t.primary,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  namePhone: {
    marginLeft: s("md"),
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 52,
    borderWidth: 1,
    borderRadius: 26,
    borderColor: t.borderDark,
  },
  cardRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardSvg: {
    position: "absolute",
    right: 0,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary900,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  spendingSummary: {
    marginTop: s("2xl"),
  },
  summaryCardContainer: {
    marginTop: s("md"),
    flexDirection: "row",
    gap: s("md"),
  },
  summaryCard: {
    height: (width - (SUMMARY_CARD + 1) * 16) / SUMMARY_CARD,
    width: (width - (SUMMARY_CARD + 1) * 16) / SUMMARY_CARD,
    backgroundColor: colors.primary50,
    borderRadius: s("md"),
    justifyContent: "center",
    alignItems: "center",
  },
  recentTransactionsContainer: {
    marginTop: 32,
  },
  recentTransactions: {
    marginTop: s("md"),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: s("xs"),
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s("sm"),
  },
}));
