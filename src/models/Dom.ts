import { Constructor, Types } from "@/models/Types";

export class Dom {
	/**
	 * ID から要素取得を強制。
	 *
	 * @param elementId
	 * @param elementType
	 * @returns
	 * @throws {throws.NotFoundDomSelectorError} セレクタから要素が見つからない
	 * @throws {throws.ElementTypeError} 要素に指定された型が合わない
	 */
	public static getElementById<THtmlElement extends HTMLElement>(elementId: string, elementType?: Constructor<THtmlElement>): THtmlElement {
		const result = document.getElementById(elementId);
		if (!result) {
			throw new Error(elementId);
		}

		if (elementType) {
			if (!Types.instanceOf(result, elementType)) {
				throw new Error(`${result.constructor.name} != ${elementType.prototype.constructor.name}`);
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
	public static querySelector<K extends keyof HTMLElementTagNameMap>(element: ParentNode, selectors: K): HTMLElementTagNameMap[K];
	public static querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
	public static querySelector<K extends keyof SVGElementTagNameMap>(element: ParentNode, selectors: K): SVGElementTagNameMap[K];
	public static querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
	public static querySelector<TElement extends Element = Element>(selectors: string, elementType?: Constructor<TElement>): TElement;
	public static querySelector<TElement extends Element = Element>(element: ParentNode, selectors: string, elementType?: Constructor<TElement>): TElement;
	public static querySelector<TElement extends Element = Element>(element: ParentNode | string | null, selectors?: string | Constructor<TElement>, elementType?: Constructor<TElement>): TElement {
		if (Types.isString(element)) {
			if (selectors) {
				if (Types.isString(selectors)) {
					throw new Error("selectors");
				} else {
					// eslint-disable-next-line no-param-reassign
					elementType = selectors;
				}
			}
			// eslint-disable-next-line no-param-reassign
			selectors = element;
			// eslint-disable-next-line no-param-reassign
			element = null;
		} else {
			if (Types.isUndefined(selectors)) {
				throw new Error("selectors");
			} else if (!Types.isString(selectors)) {
				throw new Error("selectors");
			}
		}

		const result = (element ?? document).querySelector(selectors);
		if (!result) {
			throw new Error(selectors);
		}

		if (elementType) {
			if (!Types.instanceOf(result, elementType)) {
				throw new Error(`${result.constructor.name} != ${elementType.prototype.constructor.name}`);
			}
		}

		return result as TElement;
	}

	/**
	 * セレクタに一致する要素リストの取得を強制。
	 * @param element
	 * @param selectors
	 */
	public static querySelectorAll<K extends keyof HTMLElementTagNameMap>(element: ParentNode, selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof SVGElementTagNameMap>(element: ParentNode, selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
	public static querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
	public static querySelectorAll<TElement extends Element = Element>(selectors: string, elementType?: Constructor<TElement>): NodeListOf<TElement>;
	public static querySelectorAll<TElement extends Element = Element>(element: ParentNode, selectors: string, elementType?: Constructor<TElement>): NodeListOf<TElement>;
	public static querySelectorAll<TElement extends Element = Element>(element: ParentNode | string | null, selectors?: string | Constructor<TElement>, elementType?: Constructor<TElement>): NodeListOf<TElement> {
		if (Types.isString(element)) {
			if (selectors) {
				if (Types.isString(selectors)) {
					throw new Error("selectors");
				} else {
					// eslint-disable-next-line no-param-reassign
					elementType = selectors;
				}
			}
			// eslint-disable-next-line no-param-reassign
			selectors = element;
			// eslint-disable-next-line no-param-reassign
			element = null;
		} else {
			if (Types.isUndefined(selectors)) {
				throw new Error("selectors");
			} else if (!Types.isString(selectors)) {
				throw new Error("selectors");
			}
		}

		const result = (element ?? document).querySelectorAll<TElement>(selectors);
		if (!result) {
			throw new Error(selectors);
		}

		if (elementType) {
			for (const elm of result) {
				if (!Types.instanceOf(elm, elementType)) {
					throw new Error(`elm ${elm} != ${elementType.prototype.constructor.name}`);
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
	public static closest<K extends keyof HTMLElementTagNameMap>(element: Element, selectors: K): HTMLElementTagNameMap[K];
	public static closest<K extends keyof SVGElementTagNameMap>(element: Element, selectors: K): SVGElementTagNameMap[K];
	public static closest<E extends Element = Element>(element: Element, selectors: string, elementType?: Constructor<E>): E;
	public static closest<TElement extends Element = Element>(element: Element, selectors: string, elementType?: Constructor<TElement>): Element {
		const result = element.closest(selectors);
		if (!result) {
			throw new Error(selectors);
		}

		if (elementType) {
			if (!Types.instanceOf(result, elementType)) {
				throw new Error(`${result.constructor.name} != ${elementType.prototype.constructor.name}`);
			}
		}

		return result;
	}
}
