import Svg, { Path, G, Rect } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SVGCancel = ({ height, width, color, ...props }: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
    height={height}
    width={width}
    fill={"none"}
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18 17.94 6M18 18 6.06 6"
    />
  </Svg>
);
export default SVGCancel;
