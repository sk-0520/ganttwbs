import { FC, useEffect, useRef } from "react";

import { useLocale } from "@/locales/locale";

type ButtonType = "close" | "submit" | "none";

interface Props {
	title: string;
	button: ButtonType;

	preSubmit?: () => boolean;
	callbackClose: (type: ButtonType) => void;

	/** 子要素 */
	children: React.ReactNode;
}

const Dialog: FC<Props> = (props: Props) => {
	const locale = useLocale();

	const refDialog = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (refDialog.current) {
			refDialog.current.removeAttribute("open");
			refDialog.current.showModal();
		}
	}, [refDialog]);


	function handleClose(type: ButtonType): void {
		if (type === "submit") {
			if (props.preSubmit) {
				if (!props.preSubmit()) {
					return;
				}
			}
		}

		props.callbackClose(type);
	}

	return (
		<dialog ref={refDialog}>
			<div className="content">
				<div className="header">
					<h1>{props.title}</h1>
				</div>
				<div className="main">
					{props.children}
				</div>
				<div className="footer">
					{props.button === "close" ? (
						<ul className="buttons">
							<li>
								<button
									className="close"
									type="button"
									onClick={ev => handleClose("close")}
								>
									{locale.common.dialog.close}
								</button>
							</li>
						</ul>
					) : props.button === "submit" ? (
						<ul className="buttons submit">
							<li>
								<button
									className="submit"
									type="button"
									onClick={ev => handleClose("submit")}
									data-submit
								>
									{locale.common.dialog.submit}
								</button>
							</li>
							<li>
								<button
									className="cancel"
									type="button"
									onClick={ev => handleClose("close")}
								>
									{locale.common.dialog.cancel}
								</button>
							</li>
						</ul>
					) : null
					}
				</div>
			</div>
		</dialog>
	);
};

export default Dialog;
