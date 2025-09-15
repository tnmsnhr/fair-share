import {
  Pressable,
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { makeStyles, useTheme } from "@/theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tone, Typo, Variant } from "./Typography";
import { s } from "@/theme/spacing";

type RootProps = {
  UNSAFE_STYLE?: ViewStyle;
  children: React.ReactNode;
  withBorder?: boolean;
};

type SideProps = {
  children?: React.ReactNode;
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

type TitleProps = {
  children?: React.ReactNode;
  variant?: Variant;
  tone?: Tone;
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

const HeaderLeft: React.FC<SideProps> = ({
  children,
  pressable,
  onPress,
  style,
}) => {
  const s = useStyles();
  const boxStyle = [s.sideBox, style];
  if (pressable) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={boxStyle}
        onPress={onPress}
        hitSlop={10}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={boxStyle}>{children}</View>;
};

(HeaderLeft as any)._HEADER_SLOT = "left";

const HeaderRight: React.FC<SideProps> = ({
  children,
  pressable,
  onPress,
  style,
}) => {
  const s = useStyles();
  const boxStyle = [s.sideBox, style];
  if (pressable) {
    return (
      <TouchableOpacity
        style={boxStyle}
        activeOpacity={0.6}
        onPress={onPress}
        hitSlop={10}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={boxStyle}>{children}</View>;
};
(HeaderRight as any)._HEADER_SLOT = "right";

const HeaderTitle: React.FC<TitleProps> = ({
  children,
  variant = "title",
  tone = "inverse",
  pressable,
  onPress,
  style,
}) => {
  const s = useStyles();

  const content = (
    <Typo variant={variant} tone={tone} align="center" inline>
      {children}
    </Typo>
  );
  if (pressable) {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={[s.titleWrap, style]}>{content}</View>;
};

(HeaderTitle as any)._HEADER_SLOT = "title";

export const Header: React.FC<RootProps> & {
  Left: typeof HeaderLeft;
  Right: typeof HeaderRight;
  Title: typeof HeaderTitle;
} = ({ children, UNSAFE_STYLE, ...props }) => {
  const s = useStyles();
  const inset = useSafeAreaInsets();

  let leftEl: React.ReactNode,
    rightEl: React.ReactNode,
    titleEl: React.ReactNode;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const type: any = child.type;

    if (type?._HEADER_SLOT === "left") leftEl = child;
    if (type?._HEADER_SLOT === "right") rightEl = child;
    if (type?._HEADER_SLOT === "title") titleEl = child;
  });

  return (
    <View style={[s.container, { paddingTop: inset?.top }, UNSAFE_STYLE]}>
      <View style={[s.side, { marginLeft: 16 }]}>{leftEl}</View>
      <View pointerEvents="box-none" style={[s.centerContent]}>
        {titleEl}
      </View>
      <View style={[s.side, { marginRight: 16 }]}>{rightEl}</View>
    </View>
  );
};

Header.Left = HeaderLeft;
Header.Right = HeaderRight;
Header.Title = HeaderTitle;

const useStyles = makeStyles((t) => ({
  container: {
    position: "relative",
    flexDirection: "row",
    paddingBottom: s("xs"),
    justifyContent: "space-between",
  },
  side: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  sideBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    position: "absolute",
    bottom: s("xs"),
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
}));
