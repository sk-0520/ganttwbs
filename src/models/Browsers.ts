export abstract class Browsers {

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
