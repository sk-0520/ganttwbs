import { type Constructor, Types } from "@/models/Types";

export class Dom {
	/**
	 * ID から要素取得を強制。
	 *
	 * @param elementId
	 * @param elementType
	 * @returns
	 * @throws {Error} セレクタから要素が見つからない, 要素に指定された型が合わない
	 */
	public static getElementById<THtmlElement extends HTMLElement>(
		elementId: string,
		elementType?: Constructor<THtmlElement>,
	): THtmlElement {
		const result = document.getElementById(elementId);
		if (!result) {
			throw new Error(elementId);
		}

		if (elementType) {
			if (!Types.instanceOf(result, elementType)) {
				throw new Error(
					`${result.constructor.name} != ${elementType.prototype.constructor.name}`,
				);
			}
		}

		return result as THtmlElement;
	}

	/**
	 * セレクタから要素取得を強制。
	 *
	 * @param element
	 * @param selectors
	 * @returns
	 */
	public static querySelector<K extends keyof HTMLElementTagNameMap>(
		element: ParentNode,
		selectors: K,
	): HTMLElementTagNameMap[K];
	public static querySelector<K extends keyof HTMLElementTagNameMap>(
		selectors: K,
	): HTMLElementTagNameMap[K];
	public static querySelector<K extends keyof SVGElementTagNameMap>(
		element: ParentNode,
		selectors: K,
	): SVGElementTagNameMap[K];
	public static querySelector<K extends keyof SVGElementTagNameMap>(
		selectors: K,
	): SVGElementTagNameMap[K];
	public static querySelector<TElement extends Element = Element>(
		selectors: string,
		elementType?: Constructor<TElement>,
	): TElement;
	public static querySelector<TElement extends Element = Element>(
		element: ParentNode,
		selectors: string,
		elementType?: Constructor<TElement>,
	): TElement;
	public static querySelector<TElement extends Element = Element>(
		element: ParentNode | string | null,
		selectors?: string | Constructor<TElement>,
		elementType?: Constructor<TElement>,
	): TElement {
		let workElement = element;
		let workSelectors = selectors;
		let workElementType = elementType;
		if (Types.isString(workElement)) {
			if (workSelectors) {
				if (Types.isString(workSelectors)) {
					throw new Error("selectors");
				}
				workElementType = workSelectors;
			}
			workSelectors = workElement;
			workElement = null;
		} else {
			if (Types.isUndefined(workSelectors)) {
				throw new Error("selectors");
			}
			if (!Types.isString(workSelectors)) {
				throw new Error("selectors");
			}
		}

		const result = (workElement ?? document).querySelector(workSelectors);
		if (!result) {
			throw new Error(workSelectors);
		}

		if (workElementType) {
			if (!Types.instanceOf(result, workElementType)) {
				throw new Error(
					`${result.constructor.name} != ${workElementType.prototype.constructor.name}`,
				);
			}
		}

		return result as TElement;
	}

	/**
	 * セレクタに一致する要素リストの取得を強制。
	 * @param element
	 * @param selectors
	 */
	public static querySelectorAll<K extends keyof HTMLElementTagNameMap>(
		element: ParentNode,
		selectors: K,
	): NodeListOf<HTMLElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof HTMLElementTagNameMap>(
		selectors: K,
	): NodeListOf<HTMLElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof SVGElementTagNameMap>(
		element: ParentNode,
		selectors: K,
	): NodeListOf<SVGElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof SVGElementTagNameMap>(
		selectors: K,
	): NodeListOf<SVGElementTagNameMap[K]>;
	public static querySelectorAll<TElement extends Element = Element>(
		selectors: string,
		elementType?: Constructor<TElement>,
	): NodeListOf<TElement>;
	public static querySelectorAll<TElement extends Element = Element>(
		element: ParentNode,
		selectors: string,
		elementType?: Constructor<TElement>,
	): NodeListOf<TElement>;
	public static querySelectorAll<TElement extends Element = Element>(
		element: ParentNode | string | null,
		selectors?: string | Constructor<TElement>,
		elementType?: Constructor<TElement>,
	): NodeListOf<TElement> {
		let workElement = element;
		let workSelectors = selectors;
		let workElementType = elementType;

		if (Types.isString(workElement)) {
			if (workSelectors) {
				if (Types.isString(workSelectors)) {
					throw new Error("selectors");
				}
				workElementType = workSelectors;
			}
			workSelectors = workElement;
			workElement = null;
		} else {
			if (Types.isUndefined(workSelectors)) {
				throw new Error("selectors");
			}
			if (!Types.isString(workSelectors)) {
				throw new Error("selectors");
			}
		}

		const result = (workElement ?? document).querySelectorAll<TElement>(
			workSelectors,
		);
		if (!result) {
			throw new Error(workSelectors);
		}

		if (workElementType) {
			for (const elm of result) {
				if (!Types.instanceOf(elm, workElementType)) {
					throw new Error(
						`elm ${elm} != ${workElementType.prototype.constructor.name}`,
					);
				}
			}
		}

		return result;
	}

	/**
	 * セレクタから先祖要素を取得。
	 *
	 * @param selectors
	 * @param element
	 * @returns
	 */
	public static closest<K extends keyof HTMLElementTagNameMap>(
		element: Element,
		selectors: K,
	): HTMLElementTagNameMap[K];
	public static closest<K extends keyof SVGElementTagNameMap>(
		element: Element,
		selectors: K,
	): SVGElementTagNameMap[K];
	public static closest<E extends Element = Element>(
		element: Element,
		selectors: string,
		elementType?: Constructor<E>,
	): E;
	public static closest<TElement extends Element = Element>(
		element: Element,
		selectors: string,
		elementType?: Constructor<TElement>,
	): Element {
		const result = element.closest(selectors);
		if (!result) {
			throw new Error(selectors);
		}

		if (elementType) {
			if (!Types.instanceOf(result, elementType)) {
				throw new Error(
					`${result.constructor.name} != ${elementType.prototype.constructor.name}`,
				);
			}
		}

		return result;
	}
}
