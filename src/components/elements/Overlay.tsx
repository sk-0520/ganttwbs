
import { FC } from "react";

import style from "@/styles/modules/components/elements/Overlay.module.scss";


interface Props {
	isVisible: boolean;

	customClassName?: string;

	callBackHidden?: () => void;

	/** 子要素 */
	children: React.ReactNode;
}

/**
 * @param props
 */
const Overlay: FC<Props> = (props: Props) => {

	function handleHide() {
		if(props.callBackHidden) {
			props.callBackHidden();
		}
	}

	return (
		<>
			{props.isVisible && (
				<>
					<div className={style.overlay} onClick={handleHide}>
						{props.customClassName && <div className={props.customClassName} />}
					</div>
					<span className={style.children}>{props.children}</span>
				</>
			)}
		</>
	);
};

export default Overlay;
