import { Color } from "@/models/data/Setting";
import { NextPage } from "next";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import Overlay from "./Overlay";
import { TinyColor } from "@ctrl/tinycolor";

interface Props {
	color: Color;
	callbackChanging?: (color: Color) => void | undefined;
	callbackChanged?: (color: Color) => void | undefined;
}

const Component: NextPage<Props> = (props: Props) => {

	const [isVisible, setIsVisible] = useState(false);
	const [color, setColor] = useState(props.color);

	const presetColors = new Array<PresetColor>();

	function handleChanging(value: Color): void {
		setColor(value);
		if (props.callbackChanging) {
			props.callbackChanging(value);
		}
	}

	function handleChanged(value: Color): void {
		setColor(value);
		if (props.callbackChanged) {
			props.callbackChanged(value);
		}
	}

	return (
		<>
			<span>
				<button
					type="button"
					onClick={ev => setIsVisible(true)}
				>
					{(new TinyColor(color)).toHexString()}
				</button>
				<Overlay
					isVisible={isVisible}
					callBackHidden={() => setIsVisible(false)}
				>
					<SketchPicker
						color={color}
						disableAlpha={false}
						presetColors={presetColors}
						onChange={(cr, _) => handleChanging(cr.hex)}
						onChangeComplete={(cr, _) => handleChanged(cr.hex)}
					/>
				</Overlay>
			</span>
		</>
	);
};

export default Component;
