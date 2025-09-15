import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const ChevronRight = ({ height, width, color, ...props }: SvgProps) => (
  <Svg width={height} height={width} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 5 7 7-7 7"
    />
  </Svg>
);
export default ChevronRight;
