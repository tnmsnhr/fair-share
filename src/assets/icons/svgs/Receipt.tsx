import Svg, { Path, G, Rect } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SvgReceipt = ({ height, width, color, ...props }: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
    height={height}
    width={width}
    fill={color}
  >
    <Path
      fillRule="evenodd"
      d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgReceipt;
