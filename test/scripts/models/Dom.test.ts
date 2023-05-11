/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Dom } from "@/models/Dom";

describe("Dom", () => {
	test("getElementById", () => {
		document.body.innerHTML = `
			<span id="id1">id1:1</span>
			<span id="id2">id2:1</span>
		`;

		expect(Dom.getElementById("id1").textContent!).toBe("id1:1");
		expect(Dom.getElementById("id2").textContent!).toBe("id2:1");
		expect(Dom.getElementById("id2", HTMLSpanElement).textContent!).toBe("id2:1");

		expect(() => Dom.getElementById("id3")).toThrowError();
		expect(() => Dom.getElementById("id2", HTMLDivElement)).toThrowError();
	});

	test("querySelector", () => {
		document.body.innerHTML = `
			<div>
				<div data-name="x">X1</div>
				<div name="x">X2</div>
			</div>
		`;

		expect(Dom.querySelector("[data-name=\"x\"]").textContent!).toBe("X1");
		expect(Dom.querySelector("[name=\"x\"]").textContent!).toBe("X2");

		expect(() => Dom.querySelector(".x")).toThrowError();
		expect(() => Dom.querySelector("[data-name=\"x\"]", HTMLSpanElement)).toThrowError();

		const rootDiv = Dom.querySelector("div");
		expect(Dom.querySelector(rootDiv, "div").textContent!).toBe("X1");
		expect(() => Dom.querySelector(rootDiv, "div", HTMLSpanElement)).toThrowError();
	});

	test("querySelectorAll", () => {
		document.body.innerHTML = `
			<div>
				<div data-name="x">X1</div>
				<div name="x">X2</div>
				<span>X3</span>
			</div>
			<ul>
				<li>A</li>
				<li>B</li>
				<li>C</li>
			</ul>
		`;

		expect(Dom.querySelectorAll("*").length).toBe(8 /* html + head + body = 3 */ + 3);
		expect(Dom.querySelectorAll(document.body, "*").length).toBe(8);

		expect(Dom.querySelectorAll("div").length).toBe(3);

		expect(Dom.querySelectorAll("div *").length).toBe(3);
		expect(Dom.querySelectorAll("div div").length).toBe(2);

		expect(() => Dom.querySelectorAll("div *", HTMLDivElement)).toThrowError();
		expect(Dom.querySelectorAll("div *", HTMLElement).length).toBe(3);
		expect(Dom.querySelectorAll("div div", HTMLDivElement).length).toBe(2);

		expect(Dom.querySelectorAll("ul *").length).toBe(3);
		expect(Dom.querySelectorAll("ul li").length).toBe(3);

	});

	test("closest", () => {
		document.body.innerHTML = `
			<div id="a">
				<div id="b">
					<div id="c">
						<div id="d">
						</div>
					</div>
				</div>
			</div>
		`;

		const a = document.getElementById("a") as HTMLElement;
		const b = document.getElementById("b") as HTMLElement;
		const c = document.getElementById("c") as HTMLElement;
		const d = document.getElementById("d") as HTMLElement;

		expect(Dom.closest(a, "*").id).toBe("a");
		expect(Dom.closest(b, "#a").id).toBe("a");
		expect(Dom.closest(c, "#b").id).toBe("b");
		expect(Dom.closest(d, "#b").id).toBe("b");
		expect(Dom.closest(d, "#a > div").id).toBe("b");
		expect(Dom.closest(d, "#a > div > div").id).toBe("c");

		expect(() => Dom.closest(d, "#a span")).toThrowError();

		expect(Dom.closest(a, "*", HTMLDivElement).id).toBe("a");
		expect(() => Dom.closest(a, "*", HTMLSpanElement)).toThrowError();
	});
});
