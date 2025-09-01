import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlus = ({ color, height, width, ...props }: SvgProps) => (
  <Svg viewBox="0 0 24 24" height={height} width={width} {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h14m-7 7V5"
    />
  </Svg>
);
export default SvgPlus;
