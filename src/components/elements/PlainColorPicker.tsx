import { Color } from "@/models/data/Setting";
import { NextPage } from "next";
import { CSSProperties, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import Overlay from "./Overlay";
import { TinyColor } from "@ctrl/tinycolor";
import style from "../../styles/modules/components/elements/PlainColorPicker.module.scss";
import Colors from "@/models/Colors";

interface Props {
	color: Color;
	callbackChanging?: (color: Color) => void | undefined;
	callbackChanged?: (color: Color) => void | undefined;
}

const Component: NextPage<Props> = (props: Props) => {

	const [isVisible, setIsVisible] = useState(false);
	const [color, setColor] = useState(props.color);

	const presetColors = new Array<PresetColor>();

	useEffect(() => {
		setColor(props.color);
	}, [props.color]);

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

	const current = new TinyColor(color);

	const boxStyle: CSSProperties = {
		background: current.toHexString(),
		borderColor: Colors.getAutoColor(current).toHexString(),
	}

	return (
		<>
			<span className={style.wrapper}>
				<button
					className={style.button}
					type="button"
					onClick={ev => setIsVisible(true)}
				>
					<span className={style.box} style={boxStyle}>&nbsp;</span>
					<code>{current.toHexString()}</code>
				</button>
				<Overlay
					isVisible={isVisible}
					callBackHidden={() => setIsVisible(false)}
				>
					<SketchPicker
						className={style.picker}
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
