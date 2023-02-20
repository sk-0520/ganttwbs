import { KeyboardEvent } from "react";

export function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
	if (event.key === 'Tab') {
		event.preventDefault();

		var element = event.target as HTMLTextAreaElement;

		// カーソル位置
		var cursorPosition = element.selectionStart;
		// カーソルの左右の文字列値
		var leftString = element.value.substring(0, cursorPosition);
		var rightString = element.value.substring(cursorPosition, element.value.length);

		element.value = leftString + "\t" + rightString;
		// カーソル位置をタブスペースの後ろにする
		element.selectionEnd = cursorPosition + 1;
	}
}
