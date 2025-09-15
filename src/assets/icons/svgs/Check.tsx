import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const Check = ({ height, width, color, ...props }: SvgProps) => (
  <Svg width={height} height={width} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 11.917 9.724 16.5 19 7.5"
    />
  </Svg>
);
export default Check;
