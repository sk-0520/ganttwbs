export abstract class Prices {

	public static displayPercent(numerator: number, denominator: number): string {
		return ((numerator / denominator) * 100).toFixed(2) + "%";
	}

}
