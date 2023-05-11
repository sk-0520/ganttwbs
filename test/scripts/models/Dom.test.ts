/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Dom } from "@/models/Dom";

describe("Dom", () => {
	test("requireElementById", () => {
		document.body.innerHTML = `
			<span id="id1">id1:1</span>
			<span id="id2">id2:1</span>
		`;

		expect(Dom.requireElementById("id1").textContent!).toBe("id1:1");
		expect(Dom.requireElementById("id2").textContent!).toBe("id2:1");
		expect(Dom.requireElementById("id2", HTMLSpanElement).textContent!).toBe("id2:1");

		expect(() => Dom.requireElementById("id3")).toThrowError();
		expect(() => Dom.requireElementById("id2", HTMLDivElement)).toThrowError();
	});

	test("requireSelector", () => {
		document.body.innerHTML = `
			<div>
				<div data-name="x">X1</div>
				<div name="x">X2</div>
			</div>
		`;

		expect(Dom.requireSelector("[data-name=\"x\"]").textContent!).toBe("X1");
		expect(Dom.requireSelector("[name=\"x\"]").textContent!).toBe("X2");

		expect(() => Dom.requireSelector(".x")).toThrowError();
		expect(() => Dom.requireSelector("[data-name=\"x\"]", HTMLSpanElement)).toThrowError();

		const rootDiv = Dom.requireSelector("div");
		expect(Dom.requireSelector(rootDiv, "div").textContent!).toBe("X1");
		expect(() => Dom.requireSelector(rootDiv, "div", HTMLSpanElement)).toThrowError();
	});

	test("requireSelectorAll", () => {
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

		expect(Dom.requireSelectorAll("*").length).toBe(8 /* html + head + body = 3 */ + 3);
		expect(Dom.requireSelectorAll(document.body, "*").length).toBe(8);

		expect(Dom.requireSelectorAll("div").length).toBe(3);

		expect(Dom.requireSelectorAll("div *").length).toBe(3);
		expect(Dom.requireSelectorAll("div div").length).toBe(2);

		expect(() => Dom.requireSelectorAll("div *", HTMLDivElement)).toThrowError();
		expect(Dom.requireSelectorAll("div *", HTMLElement).length).toBe(3);
		expect(Dom.requireSelectorAll("div div", HTMLDivElement).length).toBe(2);

		expect(Dom.requireSelectorAll("ul *").length).toBe(3);
		expect(Dom.requireSelectorAll("ul li").length).toBe(3);

	});

	test("requireClosest", () => {
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

		expect(Dom.requireClosest(a, "*").id).toBe("a");
		expect(Dom.requireClosest(b, "#a").id).toBe("a");
		expect(Dom.requireClosest(c, "#b").id).toBe("b");
		expect(Dom.requireClosest(d, "#b").id).toBe("b");
		expect(Dom.requireClosest(d, "#a > div").id).toBe("b");
		expect(Dom.requireClosest(d, "#a > div > div").id).toBe("c");

		expect(() => Dom.requireClosest(d, "#a span")).toThrowError();

		expect(Dom.requireClosest(a, "*", HTMLDivElement).id).toBe("a");
		expect(() => Dom.requireClosest(a, "*", HTMLSpanElement)).toThrowError();
	});

	test("getParentForm", () => {
		document.body.innerHTML = `
			<form data-key="a">
				<div id="a"></div>
			</form>
			<form data-key="b">
				<div id="b"></div>
			</form>
			<div>
				<div id="c"></div>
			</div>
		`;

		const a = document.getElementById("a") as HTMLElement;
		const b = document.getElementById("b") as HTMLElement;
		const c = document.getElementById("c") as HTMLElement;

		expect(Dom.getParentForm(a).dataset["key"]!).toBe("a");
		expect(Dom.getParentForm(b).dataset["key"]!).toBe("b");

		expect(() => Dom.getParentForm(c)).toThrowError(Error);
	});
});
