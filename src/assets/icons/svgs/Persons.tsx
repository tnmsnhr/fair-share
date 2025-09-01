import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SVGPerson = ({ height, width, color, ...props }: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props} height={height} width={width}>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SVGPerson;
