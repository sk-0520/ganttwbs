import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";

import Overlay from "@/components/elements/Overlay";
import { Color } from "@/models/Color";
import { Colors } from "@/models/Colors";
import { ColorString } from "@/models/data/Setting";
import style from "@/styles/modules/components/elements/PlainColorPicker.module.scss";


interface Props {
	color: Color;
	callbackChanging?: (color: Color) => void | undefined;
	callbackChanged?: (color: Color) => void | undefined;
}

const PlainColorPicker: FC<Props> = (props: Props) => {
	const [isVisible, setIsVisible] = useState(false);
	//const [color, setColor] = useState(props.color);
	const refPicker = useRef<HTMLDivElement>(null);

	const presetColors = new Array<PresetColor>();

	useEffect(() => {
		if (refPicker.current) {
			if (isVisible) {
				refPicker.current.scrollIntoView({
					block: "center",
					behavior: "smooth",
				});
			}
		}
	}, [isVisible, refPicker]);

	function handleChanging(value: ColorString): void {
		if (props.callbackChanging) {
			const color = Color.parse(value);
			props.callbackChanging(color);
		}
	}

	function handleChanged(value: ColorString): void {
		if (props.callbackChanged) {
			const color = Color.parse(value);
			props.callbackChanged(color);
		}
	}

	const boxStyle: CSSProperties = {
		background: props.color.toHtml(),
		borderColor: Colors.getAutoColor(props.color).toHtml(),
	};

	return (
		<>
			<span className={style.wrapper}>
				<button
					className={style.button}
					type="button"
					onClick={ev => setIsVisible(true)}
				>
					<span className={style.box} style={boxStyle}>&nbsp;</span>
					<code>{props.color.toHtml()}</code>
				</button>
				<Overlay
					isVisible={isVisible}
					callBackHidden={() => setIsVisible(false)}
				>
					<div
						ref={refPicker}
					>
						<SketchPicker
							className={style.picker}
							color={props.color.toHtml()}
							disableAlpha={false}
							presetColors={presetColors}
							onChange={(cr, _) => handleChanging(cr.hex)}
							onChangeComplete={(cr, _) => handleChanged(cr.hex)}
						/>

					</div>
				</Overlay>
			</span>
		</>
	);
};

export default PlainColorPicker;
