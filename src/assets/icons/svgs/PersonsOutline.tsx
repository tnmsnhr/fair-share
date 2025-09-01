import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SVGPersonOutline = ({ height, width, color, ...props }: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
    height={height}
    width={width}
    fill={"none"}
  >
    <Path
      stroke={color}
      strokeWidth={2}
      d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </Svg>
);
export default SVGPersonOutline;
