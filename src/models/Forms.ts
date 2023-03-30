import { KeyboardEvent } from "react";

export abstract class Forms {

	public static handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Tab") {
			event.preventDefault();

			const element = event.target as HTMLTextAreaElement;

			// カーソル位置
			const cursorPosition = element.selectionStart;
			// カーソルの左右の文字列値
			const leftString = element.value.substring(0, cursorPosition);
			const rightString = element.value.substring(cursorPosition, element.value.length);

			element.value = leftString + "\t" + rightString;
			// カーソル位置をタブスペースの後ろにする
			element.selectionEnd = cursorPosition + 1;
		}
	}

}
