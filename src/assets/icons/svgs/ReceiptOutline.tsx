import Svg, { Path, G, Rect } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SvgReceiptOutline = ({ height, width, color, ...props }: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
    height={height}
    width={width}
    fill={"none"}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z"
    />
  </Svg>
);
export default SvgReceiptOutline;
