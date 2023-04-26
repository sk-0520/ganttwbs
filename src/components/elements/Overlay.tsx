
import { FC, ReactNode, useEffect, useRef, MouseEvent } from "react";

import style from "@/styles/modules/components/elements/Overlay.module.scss";


interface Props {
	isVisible: boolean;

	customClassName?: string;

	callBackHidden?: () => void;

	/** 子要素 */
	children: ReactNode;
}

/**
 * @param props
 */
const Overlay: FC<Props> = (props: Props) => {

	const refChildren = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (refChildren.current) {
			refChildren.current.addEventListener("wheel", ev => {
				ev.preventDefault();
			}, { passive: false });
		}
	}, []);

	function handleHide(): void {
		if (props.callBackHidden) {
			props.callBackHidden();
		}
	}

	function handleMouseDown(ev: MouseEvent): void {
		// ほんまかいな: https://developer.mozilla.org/ja/docs/Web/API/MouseEvent/button#%E5%80%A4
		if (ev.button === 1) {
			ev.preventDefault();
		}
	}

	return (
		<>
			{props.isVisible && (
				<>
					<div
						className={style.overlay}
						onClick={handleHide}
						onMouseDown={handleMouseDown}
					>
						{props.customClassName && <div className={props.customClassName} />}
					</div>
					<span
						ref={refChildren}
						className={style.children}
						onMouseDown={handleMouseDown}
					>
						{props.children}
					</span>
				</>
			)}
		</>
	);
};

export default Overlay;
