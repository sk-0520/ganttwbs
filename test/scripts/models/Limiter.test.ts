import { Limiter } from "@/models/Limiter";

describe("Limiter", () => {
	test.each([
		[0],
		[-1],
	])("invalid", (init: number) => {
		expect(() => new Limiter(init)).toThrowError();
	});

	test("increment", () => {
		const limiter = new Limiter(3);

		expect(limiter.count).toBe(0);
		expect(limiter.isLimit).toBeFalsy();

		expect(limiter.increment()).toBeFalsy();
		expect(limiter.count).toBe(1);
		expect(limiter.isLimit).toBeFalsy();

		expect(limiter.increment()).toBeFalsy();
		expect(limiter.count).toBe(2);
		expect(limiter.isLimit).toBeFalsy();

		expect(limiter.increment()).toBeFalsy();
		expect(limiter.count).toBe(3);
		expect(limiter.isLimit).toBeTruthy();

		expect(limiter.increment()).toBeTruthy();
		expect(limiter.count).toBe(3);
		expect(limiter.isLimit).toBeTruthy();
	});
});
