import { Types } from "@/models/Types";

export abstract class Browsers {

	/**
	 * ブラウザで実行中か。
	 */
	public static get running(): boolean {
		return !Types.isUndefined(global.window);
	}

	/**
	 * ブラウザで実行されている子を強制。
	 */
	public static enforceRunning(): void {
		if(!this.running) {
			throw new Error("not running in the browser");
		}
	}

	public static download(fileName: string, blob: Blob): void {
		const anchorElement = document.createElement("a");
		anchorElement.href = window.URL.createObjectURL(blob);
		anchorElement.download = fileName;
		anchorElement.click();
		anchorElement.remove();
	}

	public static downloadJson(fileName: string, obj: object, space?: number | string | undefined) {
		const json = JSON.stringify(obj, undefined, space);

		const blob = new Blob([json], { type: "application/json" });
		this.download(fileName, blob);
	}

	public static copyText(s: string) {
		navigator.clipboard.writeText(s);
	}
}
