import { mostReadable, random, TinyColor } from "@ctrl/tinycolor";

import { ParseResult, ResultFactory } from "@/models/data/Result";
import { ColorString } from "@/models/data/Setting";
import { Types } from "@/models/Types";

type ColorParseResult = ParseResult<Color, Error>;

/**
 * 色。
 */
export class Color {

	private constructor(private readonly raw: TinyColor) {
		if (!raw.isValid) {
			throw new Error();
		}
	}

	//#region property

	/** 赤(0-255) */
	public get r(): number {
		return this.raw.r;
	}

	/** 緑(0-255) */
	public get g(): number {
		return this.raw.g;
	}

	/** 青(0-255) */
	public get b(): number {
		return this.raw.b;
	}

	/** 透明度(0-1) */
	public get a(): number {
		return this.raw.a;
	}

	//#endregion

	//#region function

	private static parseCore(input: ColorString): ColorParseResult {
		const color = new TinyColor(input);
		if (color.isValid) {
			return ResultFactory.success(new Color(color));
		}

		return ResultFactory.failure(new Error(input));
	}

	public static parse(input: string): Color {
		return ResultFactory.parseErrorIsThrow(input, s => this.parseCore(s));
	}

	public static tryParse(input: string): Color | null {
		return ResultFactory.parseErrorIsReturnNull(input, s => this.parseCore(s));
	}

	public static create(r: number, g: number, b: number, a?: number): Color {
		function enforce(v: number, name: "r" | "g" | "b" | "a"): number {
			if (name === "a") {
				if (v < 0 || 1 < v) {
					throw new Error(name + ":" + v.toString());
				}
			} else {
				if (v < 0 || 0xff < v) {
					throw new Error(name + ":" + v.toString());
				}
			}

			return v;
		}

		const colorImpl = new TinyColor({
			r: enforce(r, "r"),
			g: enforce(g, "g"),
			b: enforce(b, "b"),
			a: Types.isUndefined(a) ? undefined : enforce(a, "a")
		});

		return new Color(colorImpl);
	}

	public equals(color: Color): boolean {
		return this.raw.equals(color.raw);
	}

	/**
	 * HTMLで用いられる色に変換する。
	 * @returns #RRGGBB
	 */
	public toHtml(): ColorString {
		return this.raw.toHexString();
	}

	/**
	 * 現在の色に対して読みやすい(?)色を取得
	 * @param color
	 * @returns
	 */
	public getAutoColor(): Color {
		const autoColors = [Colors.Black, Colors.White];
		const result = mostReadable(
			this.raw,
			autoColors,
			{
				includeFallbackColors: true
			}
		);

		return result ? new Color(result) : Colors.Black;
	}

	private static generateRgbGradient(start: Color, end: Color, count: number): Array<Color> {
		const a = start.raw.toRgb();
		const z = end.raw.toRgb();

		const result = new Array<Color>();

		for (let i = 0; i < count; i++) {
			const zp = (i / (count - 1)) * 100;
			const ap = 100 - zp;
			const color = new Color(new TinyColor({
				r: (a.r * ap / 100) + (z.r * zp / 100),
				g: (a.g * ap / 100) + (z.g * zp / 100),
				b: (a.b * ap / 100) + (z.b * zp / 100),
			}));
			result.push(color);
		}

		return result;
	}

	/**
	 * 単純グラデーションの作成
	 * @param start 開始色
	 * @param end 終了色
	 * @param count 色数
	 * @returns グラデーション配列
	 */
	public static generateGradient(start: Color, end: Color, count: number): Array<Color> {
		if (count <= 1) {
			throw new Error(`${count}`);
		}

		// RGB と HSL で処理できるようにした方がいいかも
		// RGB だと灰色がなぁ

		return this.generateRgbGradient(start, end, count);
	}

	public analogous(count: number): Array<Color> {
		return this.raw.analogous(count).map(a => new Color(a));
	}

	public monochromatic(count: number): Array<Color> {
		return this.raw.monochromatic(count).map(a => new Color(a));
	}

	public static random(): Color {
		return new Color(random());
	}

	//#endregion
}

export abstract class Colors {
	/** Air Force Blue (Raf) */
	public static readonly AirForceBlueRaf = Color.create(0x5d, 0x8a, 0xa8);
	/** Air Force Blue (Usaf) */
	public static readonly AirForceBlueUsaf = Color.create(0x00, 0x30, 0x8f);
	/** Air Superiority Blue */
	public static readonly AirSuperiorityBlue = Color.create(0x72, 0xa0, 0xc1);
	/** Alabama Crimson */
	public static readonly AlabamaCrimson = Color.create(0xa3, 0x26, 0x38);
	/** Alice Blue */
	public static readonly AliceBlue = Color.create(0xf0, 0xf8, 0xff);
	/** Alizarin Crimson */
	public static readonly AlizarinCrimson = Color.create(0xe3, 0x26, 0x36);
	/** Alloy Orange */
	public static readonly AlloyOrange = Color.create(0xc4, 0x62, 0x10);
	/** Almond */
	public static readonly Almond = Color.create(0xef, 0xde, 0xcd);
	/** Amaranth */
	public static readonly Amaranth = Color.create(0xe5, 0x2b, 0x50);
	/** Amber */
	public static readonly Amber = Color.create(0xff, 0xbf, 0x00);
	/** Amber (Sae/Ece) */
	public static readonly AmberSaeEce = Color.create(0xff, 0x7e, 0x00);
	/** American Rose */
	public static readonly AmericanRose = Color.create(0xff, 0x03, 0x3e);
	/** Amethyst */
	public static readonly Amethyst = Color.create(0x99, 0x66, 0xcc);
	/** Android Green */
	public static readonly AndroidGreen = Color.create(0xa4, 0xc6, 0x39);
	/** Anti-Flash White */
	public static readonly AntiFlashWhite = Color.create(0xf2, 0xf3, 0xf4);
	/** Antique Brass */
	public static readonly AntiqueBrass = Color.create(0xcd, 0x95, 0x75);
	/** Antique Fuchsia */
	public static readonly AntiqueFuchsia = Color.create(0x91, 0x5c, 0x83);
	/** Antique Ruby */
	public static readonly AntiqueRuby = Color.create(0x84, 0x1b, 0x2d);
	/** Antique White */
	public static readonly AntiqueWhite = Color.create(0xfa, 0xeb, 0xd7);
	/** Ao (English) */
	public static readonly AoEnglish = Color.create(0x00, 0x80, 0x00);
	/** Apple Green */
	public static readonly AppleGreen = Color.create(0x8d, 0xb6, 0x00);
	/** Apricot */
	public static readonly Apricot = Color.create(0xfb, 0xce, 0xb1);
	/** Aqua */
	public static readonly Aqua = Color.create(0x00, 0xff, 0xff);
	/** Aquamarine */
	public static readonly Aquamarine = Color.create(0x7f, 0xff, 0xd4);
	/** Army Green */
	public static readonly ArmyGreen = Color.create(0x4b, 0x53, 0x20);
	/** Arsenic */
	public static readonly Arsenic = Color.create(0x3b, 0x44, 0x4b);
	/** Arylide Yellow */
	public static readonly ArylideYellow = Color.create(0xe9, 0xd6, 0x6b);
	/** Ash Grey */
	public static readonly AshGrey = Color.create(0xb2, 0xbe, 0xb5);
	/** Asparagus */
	public static readonly Asparagus = Color.create(0x87, 0xa9, 0x6b);
	/** Atomic Tangerine */
	public static readonly AtomicTangerine = Color.create(0xff, 0x99, 0x66);
	/** Auburn */
	public static readonly Auburn = Color.create(0xa5, 0x2a, 0x2a);
	/** Aureolin */
	public static readonly Aureolin = Color.create(0xfd, 0xee, 0x00);
	/** Aurometalsaurus */
	public static readonly Aurometalsaurus = Color.create(0x6e, 0x7f, 0x80);
	/** Avocado */
	public static readonly Avocado = Color.create(0x56, 0x82, 0x03);
	/** Azure */
	public static readonly Azure = Color.create(0x00, 0x7f, 0xff);
	/** Azure Mist/Web */
	public static readonly AzureMistWeb = Color.create(0xf0, 0xff, 0xff);
	/** Baby Blue */
	public static readonly BabyBlue = Color.create(0x89, 0xcf, 0xf0);
	/** Baby Blue Eyes */
	public static readonly BabyBlueEyes = Color.create(0xa1, 0xca, 0xf1);
	/** Baby Pink */
	public static readonly BabyPink = Color.create(0xf4, 0xc2, 0xc2);
	/** Ball Blue */
	public static readonly BallBlue = Color.create(0x21, 0xab, 0xcd);
	/** Banana Mania */
	public static readonly BananaMania = Color.create(0xfa, 0xe7, 0xb5);
	/** Banana Yellow */
	public static readonly BananaYellow = Color.create(0xff, 0xe1, 0x35);
	/** Barn Red */
	public static readonly BarnRed = Color.create(0x7c, 0xa, 0x02);
	/** Battleship Grey */
	public static readonly BattleshipGrey = Color.create(0x84, 0x84, 0x82);
	/** Bazaar */
	public static readonly Bazaar = Color.create(0x98, 0x77, 0x7b);
	/** Beau Blue */
	public static readonly BeauBlue = Color.create(0xbc, 0xd4, 0xe6);
	/** Beaver */
	public static readonly Beaver = Color.create(0x9f, 0x81, 0x70);
	/** Beige */
	public static readonly Beige = Color.create(0xf5, 0xf5, 0xdc);
	/** Big Dip O’Ruby */
	public static readonly BigDipORuby = Color.create(0x9c, 0x25, 0x42);
	/** Bisque */
	public static readonly Bisque = Color.create(0xff, 0xe4, 0xc4);
	/** Bistre */
	public static readonly Bistre = Color.create(0x3d, 0x2b, 0x1f);
	/** Bittersweet */
	public static readonly Bittersweet = Color.create(0xfe, 0x6f, 0x5e);
	/** Bittersweet Shimmer */
	public static readonly BittersweetShimmer = Color.create(0xbf, 0x4f, 0x51);
	/** Black */
	public static readonly Black = Color.create(0x00, 0x00, 0x00);
	/** Black Bean */
	public static readonly BlackBean = Color.create(0x3d, 0xc, 0x02);
	/** Black Leather Jacket */
	public static readonly BlackLeatherJacket = Color.create(0x25, 0x35, 0x29);
	/** Black Olive */
	public static readonly BlackOlive = Color.create(0x3b, 0x3c, 0x36);
	/** Blanched Almond */
	public static readonly BlanchedAlmond = Color.create(0xff, 0xeb, 0xcd);
	/** Blast-Off Bronze */
	public static readonly BlastOffBronze = Color.create(0xa5, 0x71, 0x64);
	/** Bleu De France */
	public static readonly BleuDeFrance = Color.create(0x31, 0x8c, 0xe7);
	/** Blizzard Blue */
	public static readonly BlizzardBlue = Color.create(0xac, 0xe5, 0xee);
	/** Blond */
	public static readonly Blond = Color.create(0xfa, 0xf0, 0xbe);
	/** Blue */
	public static readonly Blue = Color.create(0x00, 0x00, 0xff);
	/** Blue Bell */
	public static readonly BlueBell = Color.create(0xa2, 0xa2, 0xd0);
	/** Blue (Crayola) */
	public static readonly BlueCrayola = Color.create(0x1f, 0x75, 0xfe);
	/** Blue Gray */
	public static readonly BlueGray = Color.create(0x66, 0x99, 0xcc);
	/** Blue-Green */
	public static readonly BlueGreen = Color.create(0xd, 0x98, 0xba);
	/** Blue (Munsell) */
	public static readonly BlueMunsell = Color.create(0x00, 0x93, 0xaf);
	/** Blue (Ncs) */
	public static readonly BlueNcs = Color.create(0x00, 0x87, 0xbd);
	/** Blue (Pigment) */
	public static readonly BluePigment = Color.create(0x33, 0x33, 0x99);
	/** Blue (Ryb) */
	public static readonly BlueRyb = Color.create(0x02, 0x47, 0xfe);
	/** Blue Sapphire */
	public static readonly BlueSapphire = Color.create(0x12, 0x61, 0x80);
	/** Blue-Violet */
	public static readonly BlueViolet = Color.create(0x8a, 0x2b, 0xe2);
	/** Blush */
	public static readonly Blush = Color.create(0xde, 0x5d, 0x83);
	/** Bole */
	public static readonly Bole = Color.create(0x79, 0x44, 0x3b);
	/** Bondi Blue */
	public static readonly BondiBlue = Color.create(0x00, 0x95, 0xb6);
	/** Bone */
	public static readonly Bone = Color.create(0xe3, 0xda, 0xc9);
	/** Boston University Red */
	public static readonly BostonUniversityRed = Color.create(0xcc, 0x00, 0x00);
	/** Bottle Green */
	public static readonly BottleGreen = Color.create(0x00, 0x6a, 0x4e);
	/** Boysenberry */
	public static readonly Boysenberry = Color.create(0x87, 0x32, 0x60);
	/** Brandeis Blue */
	public static readonly BrandeisBlue = Color.create(0x00, 0x70, 0xff);
	/** Brass */
	public static readonly Brass = Color.create(0xb5, 0xa6, 0x42);
	/** Brick Red */
	public static readonly BrickRed = Color.create(0xcb, 0x41, 0x54);
	/** Bright Cerulean */
	public static readonly BrightCerulean = Color.create(0x1d, 0xac, 0xd6);
	/** Bright Green */
	public static readonly BrightGreen = Color.create(0x66, 0xff, 0x00);
	/** Bright Lavender */
	public static readonly BrightLavender = Color.create(0xbf, 0x94, 0xe4);
	/** Bright Maroon */
	public static readonly BrightMaroon = Color.create(0xc3, 0x21, 0x48);
	/** Bright Pink */
	public static readonly BrightPink = Color.create(0xff, 0x00, 0x7f);
	/** Bright Turquoise */
	public static readonly BrightTurquoise = Color.create(0x08, 0xe8, 0xde);
	/** Bright Ube */
	public static readonly BrightUbe = Color.create(0xd1, 0x9f, 0xe8);
	/** Brilliant Lavender */
	public static readonly BrilliantLavender = Color.create(0xf4, 0xbb, 0xff);
	/** Brilliant Rose */
	public static readonly BrilliantRose = Color.create(0xff, 0x55, 0xa3);
	/** Brink Pink */
	public static readonly BrinkPink = Color.create(0xfb, 0x60, 0x7f);
	/** British Racing Green */
	public static readonly BritishRacingGreen = Color.create(0x00, 0x42, 0x25);
	/** Bronze */
	public static readonly Bronze = Color.create(0xcd, 0x7f, 0x32);
	/** Brown (Traditional) */
	public static readonly BrownTraditional = Color.create(0x96, 0x4b, 0x00);
	/** Brown (Web) */
	public static readonly BrownWeb = Color.create(0xa5, 0x2a, 0x2a);
	/** Bubble Gum */
	public static readonly BubbleGum = Color.create(0xff, 0xc1, 0xcc);
	/** Bubbles */
	public static readonly Bubbles = Color.create(0xe7, 0xfe, 0xff);
	/** Buff */
	public static readonly Buff = Color.create(0xf0, 0xdc, 0x82);
	/** Bulgarian Rose */
	public static readonly BulgarianRose = Color.create(0x48, 0x06, 0x07);
	/** Burgundy */
	public static readonly Burgundy = Color.create(0x80, 0x00, 0x20);
	/** Burlywood */
	public static readonly Burlywood = Color.create(0xde, 0xb8, 0x87);
	/** Burnt Orange */
	public static readonly BurntOrange = Color.create(0xcc, 0x55, 0x00);
	/** Burnt Sienna */
	public static readonly BurntSienna = Color.create(0xe9, 0x74, 0x51);
	/** Burnt Umber */
	public static readonly BurntUmber = Color.create(0x8a, 0x33, 0x24);
	/** Byzantine */
	public static readonly Byzantine = Color.create(0xbd, 0x33, 0xa4);
	/** Byzantium */
	public static readonly Byzantium = Color.create(0x70, 0x29, 0x63);
	/** Cadet */
	public static readonly Cadet = Color.create(0x53, 0x68, 0x72);
	/** Cadet Blue */
	public static readonly CadetBlue = Color.create(0x5f, 0x9e, 0xa0);
	/** Cadet Grey */
	public static readonly CadetGrey = Color.create(0x91, 0xa3, 0xb0);
	/** Cadmium Green */
	public static readonly CadmiumGreen = Color.create(0x00, 0x6b, 0x3c);
	/** Cadmium Orange */
	public static readonly CadmiumOrange = Color.create(0xed, 0x87, 0x2d);
	/** Cadmium Red */
	public static readonly CadmiumRed = Color.create(0xe3, 0x00, 0x22);
	/** Cadmium Yellow */
	public static readonly CadmiumYellow = Color.create(0xff, 0xf6, 0x00);
	/** Café Au Lait */
	public static readonly CafAuLait = Color.create(0xa6, 0x7b, 0x5b);
	/** Café Noir */
	public static readonly CafNoir = Color.create(0x4b, 0x36, 0x21);
	/** Cal Poly Green */
	public static readonly CalPolyGreen = Color.create(0x1e, 0x4d, 0x2b);
	/** Cambridge Blue */
	public static readonly CambridgeBlue = Color.create(0xa3, 0xc1, 0xad);
	/** Camel */
	public static readonly Camel = Color.create(0xc1, 0x9a, 0x6b);
	/** Cameo Pink */
	public static readonly CameoPink = Color.create(0xef, 0xbb, 0xcc);
	/** Camouflage Green */
	public static readonly CamouflageGreen = Color.create(0x78, 0x86, 0x6b);
	/** Canary Yellow */
	public static readonly CanaryYellow = Color.create(0xff, 0xef, 0x00);
	/** Candy Apple Red */
	public static readonly CandyAppleRed = Color.create(0xff, 0x08, 0x00);
	/** Candy Pink */
	public static readonly CandyPink = Color.create(0xe4, 0x71, 0x7a);
	/** Capri */
	public static readonly Capri = Color.create(0x00, 0xbf, 0xff);
	/** Caput Mortuum */
	public static readonly CaputMortuum = Color.create(0x59, 0x27, 0x20);
	/** Cardinal */
	public static readonly Cardinal = Color.create(0xc4, 0x1e, 0x3a);
	/** Caribbean Green */
	public static readonly CaribbeanGreen = Color.create(0x00, 0xcc, 0x99);
	/** Carmine */
	public static readonly Carmine = Color.create(0x96, 0x00, 0x18);
	/** Carmine (M&P) */
	public static readonly CarmineMP = Color.create(0xd7, 0x00, 0x40);
	/** Carmine Pink */
	public static readonly CarminePink = Color.create(0xeb, 0x4c, 0x42);
	/** Carmine Red */
	public static readonly CarmineRed = Color.create(0xff, 0x00, 0x38);
	/** Carnation Pink */
	public static readonly CarnationPink = Color.create(0xff, 0xa6, 0xc9);
	/** Carnelian */
	public static readonly Carnelian = Color.create(0xb3, 0x1b, 0x1b);
	/** Carolina Blue */
	public static readonly CarolinaBlue = Color.create(0x99, 0xba, 0xdd);
	/** Carrot Orange */
	public static readonly CarrotOrange = Color.create(0xed, 0x91, 0x21);
	/** Catalina Blue */
	public static readonly CatalinaBlue = Color.create(0x06, 0x2a, 0x78);
	/** Ceil */
	public static readonly Ceil = Color.create(0x92, 0xa1, 0xcf);
	/** Celadon */
	public static readonly Celadon = Color.create(0xac, 0xe1, 0xaf);
	/** Celadon Blue */
	public static readonly CeladonBlue = Color.create(0x00, 0x7b, 0xa7);
	/** Celadon Green */
	public static readonly CeladonGreen = Color.create(0x2f, 0x84, 0x7c);
	/** Celeste (Colour) */
	public static readonly CelesteColour = Color.create(0xb2, 0xff, 0xff);
	/** Celestial Blue */
	public static readonly CelestialBlue = Color.create(0x49, 0x97, 0xd0);
	/** Cerise */
	public static readonly Cerise = Color.create(0xde, 0x31, 0x63);
	/** Cerise Pink */
	public static readonly CerisePink = Color.create(0xec, 0x3b, 0x83);
	/** Cerulean */
	public static readonly Cerulean = Color.create(0x00, 0x7b, 0xa7);
	/** Cerulean Blue */
	public static readonly CeruleanBlue = Color.create(0x2a, 0x52, 0xbe);
	/** Cerulean Frost */
	public static readonly CeruleanFrost = Color.create(0x6d, 0x9b, 0xc3);
	/** Cg Blue */
	public static readonly CgBlue = Color.create(0x00, 0x7a, 0xa5);
	/** Cg Red */
	public static readonly CgRed = Color.create(0xe0, 0x3c, 0x31);
	/** Chamoisee */
	public static readonly Chamoisee = Color.create(0xa0, 0x78, 0x5a);
	/** Champagne */
	public static readonly Champagne = Color.create(0xfa, 0xd6, 0xa5);
	/** Charcoal */
	public static readonly Charcoal = Color.create(0x36, 0x45, 0x4f);
	/** Charm Pink */
	public static readonly CharmPink = Color.create(0xe6, 0x8f, 0xac);
	/** Chartreuse (Traditional) */
	public static readonly ChartreuseTraditional = Color.create(0xdf, 0xff, 0x00);
	/** Chartreuse (Web) */
	public static readonly ChartreuseWeb = Color.create(0x7f, 0xff, 0x00);
	/** Cherry */
	public static readonly Cherry = Color.create(0xde, 0x31, 0x63);
	/** Cherry Blossom Pink */
	public static readonly CherryBlossomPink = Color.create(0xff, 0xb7, 0xc5);
	/** Chestnut */
	public static readonly Chestnut = Color.create(0xcd, 0x5c, 0x5c);
	/** China Pink */
	public static readonly ChinaPink = Color.create(0xde, 0x6f, 0xa1);
	/** China Rose */
	public static readonly ChinaRose = Color.create(0xa8, 0x51, 0x6e);
	/** Chinese Red */
	public static readonly ChineseRed = Color.create(0xaa, 0x38, 0x1e);
	/** Chocolate (Traditional) */
	public static readonly ChocolateTraditional = Color.create(0x7b, 0x3f, 0x00);
	/** Chocolate (Web) */
	public static readonly ChocolateWeb = Color.create(0xd2, 0x69, 0x1e);
	/** Chrome Yellow */
	public static readonly ChromeYellow = Color.create(0xff, 0xa7, 0x00);
	/** Cinereous */
	public static readonly Cinereous = Color.create(0x98, 0x81, 0x7b);
	/** Cinnabar */
	public static readonly Cinnabar = Color.create(0xe3, 0x42, 0x34);
	/** Cinnamon */
	public static readonly Cinnamon = Color.create(0xd2, 0x69, 0x1e);
	/** Citrine */
	public static readonly Citrine = Color.create(0xe4, 0xd0, 0xa);
	/** Classic Rose */
	public static readonly ClassicRose = Color.create(0xfb, 0xcc, 0xe7);
	/** Cobalt */
	public static readonly Cobalt = Color.create(0x00, 0x47, 0xab);
	/** Cocoa Brown */
	public static readonly CocoaBrown = Color.create(0xd2, 0x69, 0x1e);
	/** Coffee */
	public static readonly Coffee = Color.create(0x6f, 0x4e, 0x37);
	/** Columbia Blue */
	public static readonly ColumbiaBlue = Color.create(0x9b, 0xdd, 0xff);
	/** Congo Pink */
	public static readonly CongoPink = Color.create(0xf8, 0x83, 0x79);
	/** Cool Black */
	public static readonly CoolBlack = Color.create(0x00, 0x2e, 0x63);
	/** Cool Grey */
	public static readonly CoolGrey = Color.create(0x8c, 0x92, 0xac);
	/** Copper */
	public static readonly Copper = Color.create(0xb8, 0x73, 0x33);
	/** Copper (Crayola) */
	public static readonly CopperCrayola = Color.create(0xda, 0x8a, 0x67);
	/** Copper Penny */
	public static readonly CopperPenny = Color.create(0xad, 0x6f, 0x69);
	/** Copper Red */
	public static readonly CopperRed = Color.create(0xcb, 0x6d, 0x51);
	/** Copper Rose */
	public static readonly CopperRose = Color.create(0x99, 0x66, 0x66);
	/** Coquelicot */
	public static readonly Coquelicot = Color.create(0xff, 0x38, 0x00);
	/** Coral */
	public static readonly Coral = Color.create(0xff, 0x7f, 0x50);
	/** Coral Pink */
	public static readonly CoralPink = Color.create(0xf8, 0x83, 0x79);
	/** Coral Red */
	public static readonly CoralRed = Color.create(0xff, 0x40, 0x40);
	/** Cordovan */
	public static readonly Cordovan = Color.create(0x89, 0x3f, 0x45);
	/** Corn */
	public static readonly Corn = Color.create(0xfb, 0xec, 0x5d);
	/** Cornell Red */
	public static readonly CornellRed = Color.create(0xb3, 0x1b, 0x1b);
	/** Cornflower Blue */
	public static readonly CornflowerBlue = Color.create(0x64, 0x95, 0xed);
	/** Cornsilk */
	public static readonly Cornsilk = Color.create(0xff, 0xf8, 0xdc);
	/** Cosmic Latte */
	public static readonly CosmicLatte = Color.create(0xff, 0xf8, 0xe7);
	/** Cotton Candy */
	public static readonly CottonCandy = Color.create(0xff, 0xbc, 0xd9);
	/** Cream */
	public static readonly Cream = Color.create(0xff, 0xfd, 0xd0);
	/** Crimson */
	public static readonly Crimson = Color.create(0xdc, 0x14, 0x3c);
	/** Crimson Glory */
	public static readonly CrimsonGlory = Color.create(0xbe, 0x00, 0x32);
	/** Cyan */
	public static readonly Cyan = Color.create(0x00, 0xff, 0xff);
	/** Cyan (Process) */
	public static readonly CyanProcess = Color.create(0x00, 0xb7, 0xeb);
	/** Daffodil */
	public static readonly Daffodil = Color.create(0xff, 0xff, 0x31);
	/** Dandelion */
	public static readonly Dandelion = Color.create(0xf0, 0xe1, 0x30);
	/** Dark Blue */
	public static readonly DarkBlue = Color.create(0x00, 0x00, 0x8b);
	/** Dark Brown */
	public static readonly DarkBrown = Color.create(0x65, 0x43, 0x21);
	/** Dark Byzantium */
	public static readonly DarkByzantium = Color.create(0x5d, 0x39, 0x54);
	/** Dark Candy Apple Red */
	public static readonly DarkCandyAppleRed = Color.create(0xa4, 0x00, 0x00);
	/** Dark Cerulean */
	public static readonly DarkCerulean = Color.create(0x08, 0x45, 0x7e);
	/** Dark Chestnut */
	public static readonly DarkChestnut = Color.create(0x98, 0x69, 0x60);
	/** Dark Coral */
	public static readonly DarkCoral = Color.create(0xcd, 0x5b, 0x45);
	/** Dark Cyan */
	public static readonly DarkCyan = Color.create(0x00, 0x8b, 0x8b);
	/** Dark Electric Blue */
	public static readonly DarkElectricBlue = Color.create(0x53, 0x68, 0x78);
	/** Dark Goldenrod */
	public static readonly DarkGoldenrod = Color.create(0xb8, 0x86, 0xb);
	/** Dark Gray */
	public static readonly DarkGray = Color.create(0xa9, 0xa9, 0xa9);
	/** Dark Green */
	public static readonly DarkGreen = Color.create(0x01, 0x32, 0x20);
	/** Dark Imperial Blue */
	public static readonly DarkImperialBlue = Color.create(0x00, 0x41, 0x6a);
	/** Dark Jungle Green */
	public static readonly DarkJungleGreen = Color.create(0x1a, 0x24, 0x21);
	/** Dark Khaki */
	public static readonly DarkKhaki = Color.create(0xbd, 0xb7, 0x6b);
	/** Dark Lava */
	public static readonly DarkLava = Color.create(0x48, 0x3c, 0x32);
	/** Dark Lavender */
	public static readonly DarkLavender = Color.create(0x73, 0x4f, 0x96);
	/** Dark Magenta */
	public static readonly DarkMagenta = Color.create(0x8b, 0x00, 0x8b);
	/** Dark Midnight Blue */
	public static readonly DarkMidnightBlue = Color.create(0x00, 0x33, 0x66);
	/** Dark Olive Green */
	public static readonly DarkOliveGreen = Color.create(0x55, 0x6b, 0x2f);
	/** Dark Orange */
	public static readonly DarkOrange = Color.create(0xff, 0x8c, 0x00);
	/** Dark Orchid */
	public static readonly DarkOrchid = Color.create(0x99, 0x32, 0xcc);
	/** Dark Pastel Blue */
	public static readonly DarkPastelBlue = Color.create(0x77, 0x9e, 0xcb);
	/** Dark Pastel Green */
	public static readonly DarkPastelGreen = Color.create(0x03, 0xc0, 0x3c);
	/** Dark Pastel Purple */
	public static readonly DarkPastelPurple = Color.create(0x96, 0x6f, 0xd6);
	/** Dark Pastel Red */
	public static readonly DarkPastelRed = Color.create(0xc2, 0x3b, 0x22);
	/** Dark Pink */
	public static readonly DarkPink = Color.create(0xe7, 0x54, 0x80);
	/** Dark Powder Blue */
	public static readonly DarkPowderBlue = Color.create(0x00, 0x33, 0x99);
	/** Dark Raspberry */
	public static readonly DarkRaspberry = Color.create(0x87, 0x26, 0x57);
	/** Dark Red */
	public static readonly DarkRed = Color.create(0x8b, 0x00, 0x00);
	/** Dark Salmon */
	public static readonly DarkSalmon = Color.create(0xe9, 0x96, 0x7a);
	/** Dark Scarlet */
	public static readonly DarkScarlet = Color.create(0x56, 0x03, 0x19);
	/** Dark Sea Green */
	public static readonly DarkSeaGreen = Color.create(0x8f, 0xbc, 0x8f);
	/** Dark Sienna */
	public static readonly DarkSienna = Color.create(0x3c, 0x14, 0x14);
	/** Dark Slate Blue */
	public static readonly DarkSlateBlue = Color.create(0x48, 0x3d, 0x8b);
	/** Dark Slate Gray */
	public static readonly DarkSlateGray = Color.create(0x2f, 0x4f, 0x4f);
	/** Dark Spring Green */
	public static readonly DarkSpringGreen = Color.create(0x17, 0x72, 0x45);
	/** Dark Tan */
	public static readonly DarkTan = Color.create(0x91, 0x81, 0x51);
	/** Dark Tangerine */
	public static readonly DarkTangerine = Color.create(0xff, 0xa8, 0x12);
	/** Dark Taupe */
	public static readonly DarkTaupe = Color.create(0x48, 0x3c, 0x32);
	/** Dark Terra Cotta */
	public static readonly DarkTerraCotta = Color.create(0xcc, 0x4e, 0x5c);
	/** Dark Turquoise */
	public static readonly DarkTurquoise = Color.create(0x00, 0xce, 0xd1);
	/** Dark Violet */
	public static readonly DarkViolet = Color.create(0x94, 0x00, 0xd3);
	/** Dark Yellow */
	public static readonly DarkYellow = Color.create(0x9b, 0x87, 0xc);
	/** Dartmouth Green */
	public static readonly DartmouthGreen = Color.create(0x00, 0x70, 0x3c);
	/** Davy'S Grey */
	public static readonly DavySGrey = Color.create(0x55, 0x55, 0x55);
	/** Debian Red */
	public static readonly DebianRed = Color.create(0xd7, 0xa, 0x53);
	/** Deep Carmine */
	public static readonly DeepCarmine = Color.create(0xa9, 0x20, 0x3e);
	/** Deep Carmine Pink */
	public static readonly DeepCarminePink = Color.create(0xef, 0x30, 0x38);
	/** Deep Carrot Orange */
	public static readonly DeepCarrotOrange = Color.create(0xe9, 0x69, 0x2c);
	/** Deep Cerise */
	public static readonly DeepCerise = Color.create(0xda, 0x32, 0x87);
	/** Deep Champagne */
	public static readonly DeepChampagne = Color.create(0xfa, 0xd6, 0xa5);
	/** Deep Chestnut */
	public static readonly DeepChestnut = Color.create(0xb9, 0x4e, 0x48);
	/** Deep Coffee */
	public static readonly DeepCoffee = Color.create(0x70, 0x42, 0x41);
	/** Deep Fuchsia */
	public static readonly DeepFuchsia = Color.create(0xc1, 0x54, 0xc1);
	/** Deep Jungle Green */
	public static readonly DeepJungleGreen = Color.create(0x00, 0x4b, 0x49);
	/** Deep Lilac */
	public static readonly DeepLilac = Color.create(0x99, 0x55, 0xbb);
	/** Deep Magenta */
	public static readonly DeepMagenta = Color.create(0xcc, 0x00, 0xcc);
	/** Deep Peach */
	public static readonly DeepPeach = Color.create(0xff, 0xcb, 0xa4);
	/** Deep Pink */
	public static readonly DeepPink = Color.create(0xff, 0x14, 0x93);
	/** Deep Ruby */
	public static readonly DeepRuby = Color.create(0x84, 0x3f, 0x5b);
	/** Deep Saffron */
	public static readonly DeepSaffron = Color.create(0xff, 0x99, 0x33);
	/** Deep Sky Blue */
	public static readonly DeepSkyBlue = Color.create(0x00, 0xbf, 0xff);
	/** Deep Tuscan Red */
	public static readonly DeepTuscanRed = Color.create(0x66, 0x42, 0x4d);
	/** Denim */
	public static readonly Denim = Color.create(0x15, 0x60, 0xbd);
	/** Desert */
	public static readonly Desert = Color.create(0xc1, 0x9a, 0x6b);
	/** Desert Sand */
	public static readonly DesertSand = Color.create(0xed, 0xc9, 0xaf);
	/** Dim Gray */
	public static readonly DimGray = Color.create(0x69, 0x69, 0x69);
	/** Dodger Blue */
	public static readonly DodgerBlue = Color.create(0x1e, 0x90, 0xff);
	/** Dogwood Rose */
	public static readonly DogwoodRose = Color.create(0xd7, 0x18, 0x68);
	/** Dollar Bill */
	public static readonly DollarBill = Color.create(0x85, 0xbb, 0x65);
	/** Drab */
	public static readonly Drab = Color.create(0x96, 0x71, 0x17);
	/** Duke Blue */
	public static readonly DukeBlue = Color.create(0x00, 0x00, 0x9c);
	/** Earth Yellow */
	public static readonly EarthYellow = Color.create(0xe1, 0xa9, 0x5f);
	/** Ebony */
	public static readonly Ebony = Color.create(0x55, 0x5d, 0x50);
	/** Ecru */
	public static readonly Ecru = Color.create(0xc2, 0xb2, 0x80);
	/** Eggplant */
	public static readonly Eggplant = Color.create(0x61, 0x40, 0x51);
	/** Eggshell */
	public static readonly Eggshell = Color.create(0xf0, 0xea, 0xd6);
	/** Egyptian Blue */
	public static readonly EgyptianBlue = Color.create(0x10, 0x34, 0xa6);
	/** Electric Blue */
	public static readonly ElectricBlue = Color.create(0x7d, 0xf9, 0xff);
	/** Electric Crimson */
	public static readonly ElectricCrimson = Color.create(0xff, 0x00, 0x3f);
	/** Electric Cyan */
	public static readonly ElectricCyan = Color.create(0x00, 0xff, 0xff);
	/** Electric Green */
	public static readonly ElectricGreen = Color.create(0x00, 0xff, 0x00);
	/** Electric Indigo */
	public static readonly ElectricIndigo = Color.create(0x6f, 0x00, 0xff);
	/** Electric Lavender */
	public static readonly ElectricLavender = Color.create(0xf4, 0xbb, 0xff);
	/** Electric Lime */
	public static readonly ElectricLime = Color.create(0xcc, 0xff, 0x00);
	/** Electric Purple */
	public static readonly ElectricPurple = Color.create(0xbf, 0x00, 0xff);
	/** Electric Ultramarine */
	public static readonly ElectricUltramarine = Color.create(0x3f, 0x00, 0xff);
	/** Electric Violet */
	public static readonly ElectricViolet = Color.create(0x8f, 0x00, 0xff);
	/** Electric Yellow */
	public static readonly ElectricYellow = Color.create(0xff, 0xff, 0x00);
	/** Emerald */
	public static readonly Emerald = Color.create(0x50, 0xc8, 0x78);
	/** English Lavender */
	public static readonly EnglishLavender = Color.create(0xb4, 0x83, 0x95);
	/** Eton Blue */
	public static readonly EtonBlue = Color.create(0x96, 0xc8, 0xa2);
	/** Fallow */
	public static readonly Fallow = Color.create(0xc1, 0x9a, 0x6b);
	/** Falu Red */
	public static readonly FaluRed = Color.create(0x80, 0x18, 0x18);
	/** Fandango */
	public static readonly Fandango = Color.create(0xb5, 0x33, 0x89);
	/** Fashion Fuchsia */
	public static readonly FashionFuchsia = Color.create(0xf4, 0x00, 0xa1);
	/** Fawn */
	public static readonly Fawn = Color.create(0xe5, 0xaa, 0x70);
	/** Feldgrau */
	public static readonly Feldgrau = Color.create(0x4d, 0x5d, 0x53);
	/** Fern Green */
	public static readonly FernGreen = Color.create(0x4f, 0x79, 0x42);
	/** Ferrari Red */
	public static readonly FerrariRed = Color.create(0xff, 0x28, 0x00);
	/** Field Drab */
	public static readonly FieldDrab = Color.create(0x6c, 0x54, 0x1e);
	/** Fire Engine Red */
	public static readonly FireEngineRed = Color.create(0xce, 0x20, 0x29);
	/** Firebrick */
	public static readonly Firebrick = Color.create(0xb2, 0x22, 0x22);
	/** Flame */
	public static readonly Flame = Color.create(0xe2, 0x58, 0x22);
	/** Flamingo Pink */
	public static readonly FlamingoPink = Color.create(0xfc, 0x8e, 0xac);
	/** Flavescent */
	public static readonly Flavescent = Color.create(0xf7, 0xe9, 0x8e);
	/** Flax */
	public static readonly Flax = Color.create(0xee, 0xdc, 0x82);
	/** Floral White */
	public static readonly FloralWhite = Color.create(0xff, 0xfa, 0xf0);
	/** Fluorescent Orange */
	public static readonly FluorescentOrange = Color.create(0xff, 0xbf, 0x00);
	/** Fluorescent Pink */
	public static readonly FluorescentPink = Color.create(0xff, 0x14, 0x93);
	/** Fluorescent Yellow */
	public static readonly FluorescentYellow = Color.create(0xcc, 0xff, 0x00);
	/** Folly */
	public static readonly Folly = Color.create(0xff, 0x00, 0x4f);
	/** Forest Green (Traditional) */
	public static readonly ForestGreenTraditional = Color.create(0x01, 0x44, 0x21);
	/** Forest Green (Web) */
	public static readonly ForestGreenWeb = Color.create(0x22, 0x8b, 0x22);
	/** French Beige */
	public static readonly FrenchBeige = Color.create(0xa6, 0x7b, 0x5b);
	/** French Blue */
	public static readonly FrenchBlue = Color.create(0x00, 0x72, 0xbb);
	/** French Lilac */
	public static readonly FrenchLilac = Color.create(0x86, 0x60, 0x8e);
	/** French Lime */
	public static readonly FrenchLime = Color.create(0xcc, 0xff, 0x00);
	/** French Raspberry */
	public static readonly FrenchRaspberry = Color.create(0xc7, 0x2c, 0x48);
	/** French Rose */
	public static readonly FrenchRose = Color.create(0xf6, 0x4a, 0x8a);
	/** Fuchsia */
	public static readonly Fuchsia = Color.create(0xff, 0x00, 0xff);
	/** Fuchsia (Crayola) */
	public static readonly FuchsiaCrayola = Color.create(0xc1, 0x54, 0xc1);
	/** Fuchsia Pink */
	public static readonly FuchsiaPink = Color.create(0xff, 0x77, 0xff);
	/** Fuchsia Rose */
	public static readonly FuchsiaRose = Color.create(0xc7, 0x43, 0x75);
	/** Fulvous */
	public static readonly Fulvous = Color.create(0xe4, 0x84, 0x00);
	/** Fuzzy Wuzzy */
	public static readonly FuzzyWuzzy = Color.create(0xcc, 0x66, 0x66);
	/** Gainsboro */
	public static readonly Gainsboro = Color.create(0xdc, 0xdc, 0xdc);
	/** Gamboge */
	public static readonly Gamboge = Color.create(0xe4, 0x9b, 0xf);
	/** Ghost White */
	public static readonly GhostWhite = Color.create(0xf8, 0xf8, 0xff);
	/** Ginger */
	public static readonly Ginger = Color.create(0xb0, 0x65, 0x00);
	/** Glaucous */
	public static readonly Glaucous = Color.create(0x60, 0x82, 0xb6);
	/** Glitter */
	public static readonly Glitter = Color.create(0xe6, 0xe8, 0xfa);
	/** Gold (Metallic) */
	public static readonly GoldMetallic = Color.create(0xd4, 0xaf, 0x37);
	/** Gold (Web) (Golden) */
	public static readonly GoldWebGolden = Color.create(0xff, 0xd7, 0x00);
	/** Golden Brown */
	public static readonly GoldenBrown = Color.create(0x99, 0x65, 0x15);
	/** Golden Poppy */
	public static readonly GoldenPoppy = Color.create(0xfc, 0xc2, 0x00);
	/** Golden Yellow */
	public static readonly GoldenYellow = Color.create(0xff, 0xdf, 0x00);
	/** Goldenrod */
	public static readonly Goldenrod = Color.create(0xda, 0xa5, 0x20);
	/** Granny Smith Apple */
	public static readonly GrannySmithApple = Color.create(0xa8, 0xe4, 0xa0);
	/** Gray */
	public static readonly Gray = Color.create(0x80, 0x80, 0x80);
	/** Gray-Asparagus */
	public static readonly GrayAsparagus = Color.create(0x46, 0x59, 0x45);
	/** Gray (Html/Css Gray) */
	public static readonly GrayHtmlCssGray = Color.create(0x80, 0x80, 0x80);
	/** Gray (X11 Gray) */
	public static readonly GrayX11Gray = Color.create(0xbe, 0xbe, 0xbe);
	/** Green (Color Wheel) (X11 Green) */
	public static readonly GreenColorWheelX11Green = Color.create(0x00, 0xff, 0x00);
	/** Green (Crayola) */
	public static readonly GreenCrayola = Color.create(0x1c, 0xac, 0x78);
	/** Green (Html/Css Green) */
	public static readonly GreenHtmlCssGreen = Color.create(0x00, 0x80, 0x00);
	/** Green (Munsell) */
	public static readonly GreenMunsell = Color.create(0x00, 0xa8, 0x77);
	/** Green (Ncs) */
	public static readonly GreenNcs = Color.create(0x00, 0x9f, 0x6b);
	/** Green (Pigment) */
	public static readonly GreenPigment = Color.create(0x00, 0xa5, 0x50);
	/** Green (Ryb) */
	public static readonly GreenRyb = Color.create(0x66, 0xb0, 0x32);
	/** Green-Yellow */
	public static readonly GreenYellow = Color.create(0xad, 0xff, 0x2f);
	/** Grullo */
	public static readonly Grullo = Color.create(0xa9, 0x9a, 0x86);
	/** Guppie Green */
	public static readonly GuppieGreen = Color.create(0x00, 0xff, 0x7f);
	/** Halayà úBe */
	public static readonly HalayBe = Color.create(0x66, 0x38, 0x54);
	/** Han Blue */
	public static readonly HanBlue = Color.create(0x44, 0x6c, 0xcf);
	/** Han Purple */
	public static readonly HanPurple = Color.create(0x52, 0x18, 0xfa);
	/** Hansa Yellow */
	public static readonly HansaYellow = Color.create(0xe9, 0xd6, 0x6b);
	/** Harlequin */
	public static readonly Harlequin = Color.create(0x3f, 0xff, 0x00);
	/** Harvard Crimson */
	public static readonly HarvardCrimson = Color.create(0xc9, 0x00, 0x16);
	/** Harvest Gold */
	public static readonly HarvestGold = Color.create(0xda, 0x91, 0x00);
	/** Heart Gold */
	public static readonly HeartGold = Color.create(0x80, 0x80, 0x00);
	/** Heliotrope */
	public static readonly Heliotrope = Color.create(0xdf, 0x73, 0xff);
	/** Hollywood Cerise */
	public static readonly HollywoodCerise = Color.create(0xf4, 0x00, 0xa1);
	/** Honeydew */
	public static readonly Honeydew = Color.create(0xf0, 0xff, 0xf0);
	/** Honolulu Blue */
	public static readonly HonoluluBlue = Color.create(0x00, 0x7f, 0xbf);
	/** Hooker'S Green */
	public static readonly HookerSGreen = Color.create(0x49, 0x79, 0x6b);
	/** Hot Magenta */
	public static readonly HotMagenta = Color.create(0xff, 0x1d, 0xce);
	/** Hot Pink */
	public static readonly HotPink = Color.create(0xff, 0x69, 0xb4);
	/** Hunter Green */
	public static readonly HunterGreen = Color.create(0x35, 0x5e, 0x3b);
	/** Iceberg */
	public static readonly Iceberg = Color.create(0x71, 0xa6, 0xd2);
	/** Icterine */
	public static readonly Icterine = Color.create(0xfc, 0xf7, 0x5e);
	/** Imperial Blue */
	public static readonly ImperialBlue = Color.create(0x00, 0x23, 0x95);
	/** Inchworm */
	public static readonly Inchworm = Color.create(0xb2, 0xec, 0x5d);
	/** India Green */
	public static readonly IndiaGreen = Color.create(0x13, 0x88, 0x08);
	/** Indian Red */
	public static readonly IndianRed = Color.create(0xcd, 0x5c, 0x5c);
	/** Indian Yellow */
	public static readonly IndianYellow = Color.create(0xe3, 0xa8, 0x57);
	/** Indigo */
	public static readonly Indigo = Color.create(0x6f, 0x00, 0xff);
	/** Indigo (Dye) */
	public static readonly IndigoDye = Color.create(0x00, 0x41, 0x6a);
	/** Indigo (Web) */
	public static readonly IndigoWeb = Color.create(0x4b, 0x00, 0x82);
	/** International Klein Blue */
	public static readonly InternationalKleinBlue = Color.create(0x00, 0x2f, 0xa7);
	/** International Orange (Aerospace) */
	public static readonly InternationalOrangeAerospace = Color.create(0xff, 0x4f, 0x00);
	/** International Orange (Engineering) */
	public static readonly InternationalOrangeEngineering = Color.create(0xba, 0x16, 0xc);
	/** International Orange (Golden Gate Bridge) */
	public static readonly InternationalOrangeGoldenGateBridge = Color.create(0xc0, 0x36, 0x2c);
	/** Iris */
	public static readonly Iris = Color.create(0x5a, 0x4f, 0xcf);
	/** Isabelline */
	public static readonly Isabelline = Color.create(0xf4, 0xf0, 0xec);
	/** Islamic Green */
	public static readonly IslamicGreen = Color.create(0x00, 0x90, 0x00);
	/** Ivory */
	public static readonly Ivory = Color.create(0xff, 0xff, 0xf0);
	/** Jade */
	public static readonly Jade = Color.create(0x00, 0xa8, 0x6b);
	/** Jasmine */
	public static readonly Jasmine = Color.create(0xf8, 0xde, 0x7e);
	/** Jasper */
	public static readonly Jasper = Color.create(0xd7, 0x3b, 0x3e);
	/** Jazzberry Jam */
	public static readonly JazzberryJam = Color.create(0xa5, 0xb, 0x5e);
	/** Jet */
	public static readonly Jet = Color.create(0x34, 0x34, 0x34);
	/** Jonquil */
	public static readonly Jonquil = Color.create(0xfa, 0xda, 0x5e);
	/** June Bud */
	public static readonly JuneBud = Color.create(0xbd, 0xda, 0x57);
	/** Jungle Green */
	public static readonly JungleGreen = Color.create(0x29, 0xab, 0x87);
	/** Kelly Green */
	public static readonly KellyGreen = Color.create(0x4c, 0xbb, 0x17);
	/** Kenyan Copper */
	public static readonly KenyanCopper = Color.create(0x7c, 0x1c, 0x05);
	/** Khaki (Html/Css) (Khaki) */
	public static readonly KhakiHtmlCssKhaki = Color.create(0xc3, 0xb0, 0x91);
	/** Khaki (X11) (Light Khaki) */
	public static readonly KhakiX11LightKhaki = Color.create(0xf0, 0xe6, 0x8c);
	/** Ku Crimson */
	public static readonly KuCrimson = Color.create(0xe8, 0x00, 0xd);
	/** La Salle Green */
	public static readonly LaSalleGreen = Color.create(0x08, 0x78, 0x30);
	/** Languid Lavender */
	public static readonly LanguidLavender = Color.create(0xd6, 0xca, 0xdd);
	/** Lapis Lazuli */
	public static readonly LapisLazuli = Color.create(0x26, 0x61, 0x9c);
	/** Laser Lemon */
	public static readonly LaserLemon = Color.create(0xfe, 0xfe, 0x22);
	/** Laurel Green */
	public static readonly LaurelGreen = Color.create(0xa9, 0xba, 0x9d);
	/** Lava */
	public static readonly Lava = Color.create(0xcf, 0x10, 0x20);
	/** Lavender Blue */
	public static readonly LavenderBlue = Color.create(0xcc, 0xcc, 0xff);
	/** Lavender Blush */
	public static readonly LavenderBlush = Color.create(0xff, 0xf0, 0xf5);
	/** Lavender (Floral) */
	public static readonly LavenderFloral = Color.create(0xb5, 0x7e, 0xdc);
	/** Lavender Gray */
	public static readonly LavenderGray = Color.create(0xc4, 0xc3, 0xd0);
	/** Lavender Indigo */
	public static readonly LavenderIndigo = Color.create(0x94, 0x57, 0xeb);
	/** Lavender Magenta */
	public static readonly LavenderMagenta = Color.create(0xee, 0x82, 0xee);
	/** Lavender Mist */
	public static readonly LavenderMist = Color.create(0xe6, 0xe6, 0xfa);
	/** Lavender Pink */
	public static readonly LavenderPink = Color.create(0xfb, 0xae, 0xd2);
	/** Lavender Purple */
	public static readonly LavenderPurple = Color.create(0x96, 0x7b, 0xb6);
	/** Lavender Rose */
	public static readonly LavenderRose = Color.create(0xfb, 0xa0, 0xe3);
	/** Lavender (Web) */
	public static readonly LavenderWeb = Color.create(0xe6, 0xe6, 0xfa);
	/** Lawn Green */
	public static readonly LawnGreen = Color.create(0x7c, 0xfc, 0x00);
	/** Lemon */
	public static readonly Lemon = Color.create(0xff, 0xf7, 0x00);
	/** Lemon Chiffon */
	public static readonly LemonChiffon = Color.create(0xff, 0xfa, 0xcd);
	/** Lemon Lime */
	public static readonly LemonLime = Color.create(0xe3, 0xff, 0x00);
	/** Licorice */
	public static readonly Licorice = Color.create(0x1a, 0x11, 0x10);
	/** Light Apricot */
	public static readonly LightApricot = Color.create(0xfd, 0xd5, 0xb1);
	/** Light Blue */
	public static readonly LightBlue = Color.create(0xad, 0xd8, 0xe6);
	/** Light Brown */
	public static readonly LightBrown = Color.create(0xb5, 0x65, 0x1d);
	/** Light Carmine Pink */
	public static readonly LightCarminePink = Color.create(0xe6, 0x67, 0x71);
	/** Light Coral */
	public static readonly LightCoral = Color.create(0xf0, 0x80, 0x80);
	/** Light Cornflower Blue */
	public static readonly LightCornflowerBlue = Color.create(0x93, 0xcc, 0xea);
	/** Light Crimson */
	public static readonly LightCrimson = Color.create(0xf5, 0x69, 0x91);
	/** Light Cyan */
	public static readonly LightCyan = Color.create(0xe0, 0xff, 0xff);
	/** Light Fuchsia Pink */
	public static readonly LightFuchsiaPink = Color.create(0xf9, 0x84, 0xef);
	/** Light Goldenrod Yellow */
	public static readonly LightGoldenrodYellow = Color.create(0xfa, 0xfa, 0xd2);
	/** Light Gray */
	public static readonly LightGray = Color.create(0xd3, 0xd3, 0xd3);
	/** Light Green */
	public static readonly LightGreen = Color.create(0x90, 0xee, 0x90);
	/** Light Khaki */
	public static readonly LightKhaki = Color.create(0xf0, 0xe6, 0x8c);
	/** Light Pastel Purple */
	public static readonly LightPastelPurple = Color.create(0xb1, 0x9c, 0xd9);
	/** Light Pink */
	public static readonly LightPink = Color.create(0xff, 0xb6, 0xc1);
	/** Light Red Ochre */
	public static readonly LightRedOchre = Color.create(0xe9, 0x74, 0x51);
	/** Light Salmon */
	public static readonly LightSalmon = Color.create(0xff, 0xa0, 0x7a);
	/** Light Salmon Pink */
	public static readonly LightSalmonPink = Color.create(0xff, 0x99, 0x99);
	/** Light Sea Green */
	public static readonly LightSeaGreen = Color.create(0x20, 0xb2, 0xaa);
	/** Light Sky Blue */
	public static readonly LightSkyBlue = Color.create(0x87, 0xce, 0xfa);
	/** Light Slate Gray */
	public static readonly LightSlateGray = Color.create(0x77, 0x88, 0x99);
	/** Light Taupe */
	public static readonly LightTaupe = Color.create(0xb3, 0x8b, 0x6d);
	/** Light Thulian Pink */
	public static readonly LightThulianPink = Color.create(0xe6, 0x8f, 0xac);
	/** Light Yellow */
	public static readonly LightYellow = Color.create(0xff, 0xff, 0xe0);
	/** Lilac */
	public static readonly Lilac = Color.create(0xc8, 0xa2, 0xc8);
	/** Lime (Color Wheel) */
	public static readonly LimeColorWheel = Color.create(0xbf, 0xff, 0x00);
	/** Lime Green */
	public static readonly LimeGreen = Color.create(0x32, 0xcd, 0x32);
	/** Lime (Web) (X11 Green) */
	public static readonly LimeWebX11Green = Color.create(0x00, 0xff, 0x00);
	/** Limerick */
	public static readonly Limerick = Color.create(0x9d, 0xc2, 0x09);
	/** Lincoln Green */
	public static readonly LincolnGreen = Color.create(0x19, 0x59, 0x05);
	/** Linen */
	public static readonly Linen = Color.create(0xfa, 0xf0, 0xe6);
	/** Lion */
	public static readonly Lion = Color.create(0xc1, 0x9a, 0x6b);
	/** Little Boy Blue */
	public static readonly LittleBoyBlue = Color.create(0x6c, 0xa0, 0xdc);
	/** Liver */
	public static readonly Liver = Color.create(0x53, 0x4b, 0x4f);
	/** Lust */
	public static readonly Lust = Color.create(0xe6, 0x20, 0x20);
	/** Magenta */
	public static readonly Magenta = Color.create(0xff, 0x00, 0xff);
	/** Magenta (Dye) */
	public static readonly MagentaDye = Color.create(0xca, 0x1f, 0x7b);
	/** Magenta (Process) */
	public static readonly MagentaProcess = Color.create(0xff, 0x00, 0x90);
	/** Magic Mint */
	public static readonly MagicMint = Color.create(0xaa, 0xf0, 0xd1);
	/** Magnolia */
	public static readonly Magnolia = Color.create(0xf8, 0xf4, 0xff);
	/** Mahogany */
	public static readonly Mahogany = Color.create(0xc0, 0x40, 0x00);
	/** Maize */
	public static readonly Maize = Color.create(0xfb, 0xec, 0x5d);
	/** Majorelle Blue */
	public static readonly MajorelleBlue = Color.create(0x60, 0x50, 0xdc);
	/** Malachite */
	public static readonly Malachite = Color.create(0xb, 0xda, 0x51);
	/** Manatee */
	public static readonly Manatee = Color.create(0x97, 0x9a, 0xaa);
	/** Mango Tango */
	public static readonly MangoTango = Color.create(0xff, 0x82, 0x43);
	/** Mantis */
	public static readonly Mantis = Color.create(0x74, 0xc3, 0x65);
	/** Mardi Gras */
	public static readonly MardiGras = Color.create(0x88, 0x00, 0x85);
	/** Maroon (Crayola) */
	public static readonly MaroonCrayola = Color.create(0xc3, 0x21, 0x48);
	/** Maroon (Html/Css) */
	public static readonly MaroonHtmlCss = Color.create(0x80, 0x00, 0x00);
	/** Maroon (X11) */
	public static readonly MaroonX11 = Color.create(0xb0, 0x30, 0x60);
	/** Mauve */
	public static readonly Mauve = Color.create(0xe0, 0xb0, 0xff);
	/** Mauve Taupe */
	public static readonly MauveTaupe = Color.create(0x91, 0x5f, 0x6d);
	/** Mauvelous */
	public static readonly Mauvelous = Color.create(0xef, 0x98, 0xaa);
	/** Maya Blue */
	public static readonly MayaBlue = Color.create(0x73, 0xc2, 0xfb);
	/** Meat Brown */
	public static readonly MeatBrown = Color.create(0xe5, 0xb7, 0x3b);
	/** Medium Aquamarine */
	public static readonly MediumAquamarine = Color.create(0x66, 0xdd, 0xaa);
	/** Medium Blue */
	public static readonly MediumBlue = Color.create(0x00, 0x00, 0xcd);
	/** Medium Candy Apple Red */
	public static readonly MediumCandyAppleRed = Color.create(0xe2, 0x06, 0x2c);
	/** Medium Carmine */
	public static readonly MediumCarmine = Color.create(0xaf, 0x40, 0x35);
	/** Medium Champagne */
	public static readonly MediumChampagne = Color.create(0xf3, 0xe5, 0xab);
	/** Medium Electric Blue */
	public static readonly MediumElectricBlue = Color.create(0x03, 0x50, 0x96);
	/** Medium Jungle Green */
	public static readonly MediumJungleGreen = Color.create(0x1c, 0x35, 0x2d);
	/** Medium Lavender Magenta */
	public static readonly MediumLavenderMagenta = Color.create(0xdd, 0xa0, 0xdd);
	/** Medium Orchid */
	public static readonly MediumOrchid = Color.create(0xba, 0x55, 0xd3);
	/** Medium Persian Blue */
	public static readonly MediumPersianBlue = Color.create(0x00, 0x67, 0xa5);
	/** Medium Purple */
	public static readonly MediumPurple = Color.create(0x93, 0x70, 0xdb);
	/** Medium Red-Violet */
	public static readonly MediumRedViolet = Color.create(0xbb, 0x33, 0x85);
	/** Medium Ruby */
	public static readonly MediumRuby = Color.create(0xaa, 0x40, 0x69);
	/** Medium Sea Green */
	public static readonly MediumSeaGreen = Color.create(0x3c, 0xb3, 0x71);
	/** Medium Slate Blue */
	public static readonly MediumSlateBlue = Color.create(0x7b, 0x68, 0xee);
	/** Medium Spring Bud */
	public static readonly MediumSpringBud = Color.create(0xc9, 0xdc, 0x87);
	/** Medium Spring Green */
	public static readonly MediumSpringGreen = Color.create(0x00, 0xfa, 0x9a);
	/** Medium Taupe */
	public static readonly MediumTaupe = Color.create(0x67, 0x4c, 0x47);
	/** Medium Turquoise */
	public static readonly MediumTurquoise = Color.create(0x48, 0xd1, 0xcc);
	/** Medium Tuscan Red */
	public static readonly MediumTuscanRed = Color.create(0x79, 0x44, 0x3b);
	/** Medium Vermilion */
	public static readonly MediumVermilion = Color.create(0xd9, 0x60, 0x3b);
	/** Medium Violet-Red */
	public static readonly MediumVioletRed = Color.create(0xc7, 0x15, 0x85);
	/** Mellow Apricot */
	public static readonly MellowApricot = Color.create(0xf8, 0xb8, 0x78);
	/** Mellow Yellow */
	public static readonly MellowYellow = Color.create(0xf8, 0xde, 0x7e);
	/** Melon */
	public static readonly Melon = Color.create(0xfd, 0xbc, 0xb4);
	/** Midnight Blue */
	public static readonly MidnightBlue = Color.create(0x19, 0x19, 0x70);
	/** Midnight Green (Eagle Green) */
	public static readonly MidnightGreenEagleGreen = Color.create(0x00, 0x49, 0x53);
	/** Mikado Yellow */
	public static readonly MikadoYellow = Color.create(0xff, 0xc4, 0xc);
	/** Mint */
	public static readonly Mint = Color.create(0x3e, 0xb4, 0x89);
	/** Mint Cream */
	public static readonly MintCream = Color.create(0xf5, 0xff, 0xfa);
	/** Mint Green */
	public static readonly MintGreen = Color.create(0x98, 0xff, 0x98);
	/** Misty Rose */
	public static readonly MistyRose = Color.create(0xff, 0xe4, 0xe1);
	/** Moccasin */
	public static readonly Moccasin = Color.create(0xfa, 0xeb, 0xd7);
	/** Mode Beige */
	public static readonly ModeBeige = Color.create(0x96, 0x71, 0x17);
	/** Moonstone Blue */
	public static readonly MoonstoneBlue = Color.create(0x73, 0xa9, 0xc2);
	/** Mordant Red 19 */
	public static readonly MordantRed19 = Color.create(0xae, 0xc, 0x00);
	/** Moss Green */
	public static readonly MossGreen = Color.create(0xad, 0xdf, 0xad);
	/** Mountain Meadow */
	public static readonly MountainMeadow = Color.create(0x30, 0xba, 0x8f);
	/** Mountbatten Pink */
	public static readonly MountbattenPink = Color.create(0x99, 0x7a, 0x8d);
	/** Msu Green */
	public static readonly MsuGreen = Color.create(0x18, 0x45, 0x3b);
	/** Mulberry */
	public static readonly Mulberry = Color.create(0xc5, 0x4b, 0x8c);
	/** Mustard */
	public static readonly Mustard = Color.create(0xff, 0xdb, 0x58);
	/** Myrtle */
	public static readonly Myrtle = Color.create(0x21, 0x42, 0x1e);
	/** Nadeshiko Pink */
	public static readonly NadeshikoPink = Color.create(0xf6, 0xad, 0xc6);
	/** Napier Green */
	public static readonly NapierGreen = Color.create(0x2a, 0x80, 0x00);
	/** Naples Yellow */
	public static readonly NaplesYellow = Color.create(0xfa, 0xda, 0x5e);
	/** Navajo White */
	public static readonly NavajoWhite = Color.create(0xff, 0xde, 0xad);
	/** Navy Blue */
	public static readonly NavyBlue = Color.create(0x00, 0x00, 0x80);
	/** Neon Carrot */
	public static readonly NeonCarrot = Color.create(0xff, 0xa3, 0x43);
	/** Neon Fuchsia */
	public static readonly NeonFuchsia = Color.create(0xfe, 0x41, 0x64);
	/** Neon Green */
	public static readonly NeonGreen = Color.create(0x39, 0xff, 0x14);
	/** New York Pink */
	public static readonly NewYorkPink = Color.create(0xd7, 0x83, 0x7f);
	/** Non-Photo Blue */
	public static readonly NonPhotoBlue = Color.create(0xa4, 0xdd, 0xed);
	/** North Texas Green */
	public static readonly NorthTexasGreen = Color.create(0x05, 0x90, 0x33);
	/** Ocean Boat Blue */
	public static readonly OceanBoatBlue = Color.create(0x00, 0x77, 0xbe);
	/** Ochre */
	public static readonly Ochre = Color.create(0xcc, 0x77, 0x22);
	/** Office Green */
	public static readonly OfficeGreen = Color.create(0x00, 0x80, 0x00);
	/** Old Gold */
	public static readonly OldGold = Color.create(0xcf, 0xb5, 0x3b);
	/** Old Lace */
	public static readonly OldLace = Color.create(0xfd, 0xf5, 0xe6);
	/** Old Lavender */
	public static readonly OldLavender = Color.create(0x79, 0x68, 0x78);
	/** Old Mauve */
	public static readonly OldMauve = Color.create(0x67, 0x31, 0x47);
	/** Old Rose */
	public static readonly OldRose = Color.create(0xc0, 0x80, 0x81);
	/** Olive */
	public static readonly Olive = Color.create(0x80, 0x80, 0x00);
	/** Olive Drab #7 */
	public static readonly OliveDrab7 = Color.create(0x3c, 0x34, 0x1f);
	/** Olive Drab (Web) (Olive Drab #3) */
	public static readonly OliveDrabWebOliveDrab3 = Color.create(0x6b, 0x8e, 0x23);
	/** Olivine */
	public static readonly Olivine = Color.create(0x9a, 0xb9, 0x73);
	/** Onyx */
	public static readonly Onyx = Color.create(0x35, 0x38, 0x39);
	/** Opera Mauve */
	public static readonly OperaMauve = Color.create(0xb7, 0x84, 0xa7);
	/** Orange (Color Wheel) */
	public static readonly OrangeColorWheel = Color.create(0xff, 0x7f, 0x00);
	/** Orange Peel */
	public static readonly OrangePeel = Color.create(0xff, 0x9f, 0x00);
	/** Orange-Red */
	public static readonly OrangeRed = Color.create(0xff, 0x45, 0x00);
	/** Orange (Ryb) */
	public static readonly OrangeRyb = Color.create(0xfb, 0x99, 0x02);
	/** Orange (Web Color) */
	public static readonly OrangeWebColor = Color.create(0xff, 0xa5, 0x00);
	/** Orchid */
	public static readonly Orchid = Color.create(0xda, 0x70, 0xd6);
	/** Otter Brown */
	public static readonly OtterBrown = Color.create(0x65, 0x43, 0x21);
	/** Ou Crimson Red */
	public static readonly OuCrimsonRed = Color.create(0x99, 0x00, 0x00);
	/** Outer Space */
	public static readonly OuterSpace = Color.create(0x41, 0x4a, 0x4c);
	/** Outrageous Orange */
	public static readonly OutrageousOrange = Color.create(0xff, 0x6e, 0x4a);
	/** Oxford Blue */
	public static readonly OxfordBlue = Color.create(0x00, 0x21, 0x47);
	/** Pakistan Green */
	public static readonly PakistanGreen = Color.create(0x00, 0x66, 0x00);
	/** Palatinate Blue */
	public static readonly PalatinateBlue = Color.create(0x27, 0x3b, 0xe2);
	/** Palatinate Purple */
	public static readonly PalatinatePurple = Color.create(0x68, 0x28, 0x60);
	/** Pale Aqua */
	public static readonly PaleAqua = Color.create(0xbc, 0xd4, 0xe6);
	/** Pale Blue */
	public static readonly PaleBlue = Color.create(0xaf, 0xee, 0xee);
	/** Pale Brown */
	public static readonly PaleBrown = Color.create(0x98, 0x76, 0x54);
	/** Pale Carmine */
	public static readonly PaleCarmine = Color.create(0xaf, 0x40, 0x35);
	/** Pale Cerulean */
	public static readonly PaleCerulean = Color.create(0x9b, 0xc4, 0xe2);
	/** Pale Chestnut */
	public static readonly PaleChestnut = Color.create(0xdd, 0xad, 0xaf);
	/** Pale Copper */
	public static readonly PaleCopper = Color.create(0xda, 0x8a, 0x67);
	/** Pale Cornflower Blue */
	public static readonly PaleCornflowerBlue = Color.create(0xab, 0xcd, 0xef);
	/** Pale Gold */
	public static readonly PaleGold = Color.create(0xe6, 0xbe, 0x8a);
	/** Pale Goldenrod */
	public static readonly PaleGoldenrod = Color.create(0xee, 0xe8, 0xaa);
	/** Pale Green */
	public static readonly PaleGreen = Color.create(0x98, 0xfb, 0x98);
	/** Pale Lavender */
	public static readonly PaleLavender = Color.create(0xdc, 0xd0, 0xff);
	/** Pale Magenta */
	public static readonly PaleMagenta = Color.create(0xf9, 0x84, 0xe5);
	/** Pale Pink */
	public static readonly PalePink = Color.create(0xfa, 0xda, 0xdd);
	/** Pale Plum */
	public static readonly PalePlum = Color.create(0xdd, 0xa0, 0xdd);
	/** Pale Red-Violet */
	public static readonly PaleRedViolet = Color.create(0xdb, 0x70, 0x93);
	/** Pale Robin Egg Blue */
	public static readonly PaleRobinEggBlue = Color.create(0x96, 0xde, 0xd1);
	/** Pale Silver */
	public static readonly PaleSilver = Color.create(0xc9, 0xc0, 0xbb);
	/** Pale Spring Bud */
	public static readonly PaleSpringBud = Color.create(0xec, 0xeb, 0xbd);
	/** Pale Taupe */
	public static readonly PaleTaupe = Color.create(0xbc, 0x98, 0x7e);
	/** Pale Violet-Red */
	public static readonly PaleVioletRed = Color.create(0xdb, 0x70, 0x93);
	/** Pansy Purple */
	public static readonly PansyPurple = Color.create(0x78, 0x18, 0x4a);
	/** Papaya Whip */
	public static readonly PapayaWhip = Color.create(0xff, 0xef, 0xd5);
	/** Paris Green */
	public static readonly ParisGreen = Color.create(0x50, 0xc8, 0x78);
	/** Pastel Blue */
	public static readonly PastelBlue = Color.create(0xae, 0xc6, 0xcf);
	/** Pastel Brown */
	public static readonly PastelBrown = Color.create(0x83, 0x69, 0x53);
	/** Pastel Gray */
	public static readonly PastelGray = Color.create(0xcf, 0xcf, 0xc4);
	/** Pastel Green */
	public static readonly PastelGreen = Color.create(0x77, 0xdd, 0x77);
	/** Pastel Magenta */
	public static readonly PastelMagenta = Color.create(0xf4, 0x9a, 0xc2);
	/** Pastel Orange */
	public static readonly PastelOrange = Color.create(0xff, 0xb3, 0x47);
	/** Pastel Pink */
	public static readonly PastelPink = Color.create(0xde, 0xa5, 0xa4);
	/** Pastel Purple */
	public static readonly PastelPurple = Color.create(0xb3, 0x9e, 0xb5);
	/** Pastel Red */
	public static readonly PastelRed = Color.create(0xff, 0x69, 0x61);
	/** Pastel Violet */
	public static readonly PastelViolet = Color.create(0xcb, 0x99, 0xc9);
	/** Pastel Yellow */
	public static readonly PastelYellow = Color.create(0xfd, 0xfd, 0x96);
	/** Patriarch */
	public static readonly Patriarch = Color.create(0x80, 0x00, 0x80);
	/** Payne'S Grey */
	public static readonly PayneSGrey = Color.create(0x53, 0x68, 0x78);
	/** Peach */
	public static readonly Peach = Color.create(0xff, 0xe5, 0xb4);
	/** Peach (Crayola) */
	public static readonly PeachCrayola = Color.create(0xff, 0xcb, 0xa4);
	/** Peach-Orange */
	public static readonly PeachOrange = Color.create(0xff, 0xcc, 0x99);
	/** Peach Puff */
	public static readonly PeachPuff = Color.create(0xff, 0xda, 0xb9);
	/** Peach-Yellow */
	public static readonly PeachYellow = Color.create(0xfa, 0xdf, 0xad);
	/** Pear */
	public static readonly Pear = Color.create(0xd1, 0xe2, 0x31);
	/** Pearl */
	public static readonly Pearl = Color.create(0xea, 0xe0, 0xc8);
	/** Pearl Aqua */
	public static readonly PearlAqua = Color.create(0x88, 0xd8, 0xc0);
	/** Pearly Purple */
	public static readonly PearlyPurple = Color.create(0xb7, 0x68, 0xa2);
	/** Peridot */
	public static readonly Peridot = Color.create(0xe6, 0xe2, 0x00);
	/** Periwinkle */
	public static readonly Periwinkle = Color.create(0xcc, 0xcc, 0xff);
	/** Persian Blue */
	public static readonly PersianBlue = Color.create(0x1c, 0x39, 0xbb);
	/** Persian Green */
	public static readonly PersianGreen = Color.create(0x00, 0xa6, 0x93);
	/** Persian Indigo */
	public static readonly PersianIndigo = Color.create(0x32, 0x12, 0x7a);
	/** Persian Orange */
	public static readonly PersianOrange = Color.create(0xd9, 0x90, 0x58);
	/** Persian Pink */
	public static readonly PersianPink = Color.create(0xf7, 0x7f, 0xbe);
	/** Persian Plum */
	public static readonly PersianPlum = Color.create(0x70, 0x1c, 0x1c);
	/** Persian Red */
	public static readonly PersianRed = Color.create(0xcc, 0x33, 0x33);
	/** Persian Rose */
	public static readonly PersianRose = Color.create(0xfe, 0x28, 0xa2);
	/** Persimmon */
	public static readonly Persimmon = Color.create(0xec, 0x58, 0x00);
	/** Peru */
	public static readonly Peru = Color.create(0xcd, 0x85, 0x3f);
	/** Phlox */
	public static readonly Phlox = Color.create(0xdf, 0x00, 0xff);
	/** Phthalo Blue */
	public static readonly PhthaloBlue = Color.create(0x00, 0xf, 0x89);
	/** Phthalo Green */
	public static readonly PhthaloGreen = Color.create(0x12, 0x35, 0x24);
	/** Piggy Pink */
	public static readonly PiggyPink = Color.create(0xfd, 0xdd, 0xe6);
	/** Pine Green */
	public static readonly PineGreen = Color.create(0x01, 0x79, 0x6f);
	/** Pink */
	public static readonly Pink = Color.create(0xff, 0xc0, 0xcb);
	/** Pink Lace */
	public static readonly PinkLace = Color.create(0xff, 0xdd, 0xf4);
	/** Pink-Orange */
	public static readonly PinkOrange = Color.create(0xff, 0x99, 0x66);
	/** Pink Pearl */
	public static readonly PinkPearl = Color.create(0xe7, 0xac, 0xcf);
	/** Pink Sherbet */
	public static readonly PinkSherbet = Color.create(0xf7, 0x8f, 0xa7);
	/** Pistachio */
	public static readonly Pistachio = Color.create(0x93, 0xc5, 0x72);
	/** Platinum */
	public static readonly Platinum = Color.create(0xe5, 0xe4, 0xe2);
	/** Plum (Traditional) */
	public static readonly PlumTraditional = Color.create(0x8e, 0x45, 0x85);
	/** Plum (Web) */
	public static readonly PlumWeb = Color.create(0xdd, 0xa0, 0xdd);
	/** Portland Orange */
	public static readonly PortlandOrange = Color.create(0xff, 0x5a, 0x36);
	/** Powder Blue (Web) */
	public static readonly PowderBlueWeb = Color.create(0xb0, 0xe0, 0xe6);
	/** Princeton Orange */
	public static readonly PrincetonOrange = Color.create(0xff, 0x8f, 0x00);
	/** Prune */
	public static readonly Prune = Color.create(0x70, 0x1c, 0x1c);
	/** Prussian Blue */
	public static readonly PrussianBlue = Color.create(0x00, 0x31, 0x53);
	/** Psychedelic Purple */
	public static readonly PsychedelicPurple = Color.create(0xdf, 0x00, 0xff);
	/** Puce */
	public static readonly Puce = Color.create(0xcc, 0x88, 0x99);
	/** Pumpkin */
	public static readonly Pumpkin = Color.create(0xff, 0x75, 0x18);
	/** Purple Heart */
	public static readonly PurpleHeart = Color.create(0x69, 0x35, 0x9c);
	/** Purple (Html/Css) */
	public static readonly PurpleHtmlCss = Color.create(0x80, 0x00, 0x80);
	/** Purple Mountain Majesty */
	public static readonly PurpleMountainMajesty = Color.create(0x96, 0x78, 0xb6);
	/** Purple (Munsell) */
	public static readonly PurpleMunsell = Color.create(0x9f, 0x00, 0xc5);
	/** Purple Pizzazz */
	public static readonly PurplePizzazz = Color.create(0xfe, 0x4e, 0xda);
	/** Purple Taupe */
	public static readonly PurpleTaupe = Color.create(0x50, 0x40, 0x4d);
	/** Purple (X11) */
	public static readonly PurpleX11 = Color.create(0xa0, 0x20, 0xf0);
	/** Quartz */
	public static readonly Quartz = Color.create(0x51, 0x48, 0x4f);
	/** Rackley */
	public static readonly Rackley = Color.create(0x5d, 0x8a, 0xa8);
	/** Radical Red */
	public static readonly RadicalRed = Color.create(0xff, 0x35, 0x5e);
	/** Rajah */
	public static readonly Rajah = Color.create(0xfb, 0xab, 0x60);
	/** Raspberry */
	public static readonly Raspberry = Color.create(0xe3, 0xb, 0x5d);
	/** Raspberry Glace */
	public static readonly RaspberryGlace = Color.create(0x91, 0x5f, 0x6d);
	/** Raspberry Pink */
	public static readonly RaspberryPink = Color.create(0xe2, 0x50, 0x98);
	/** Raspberry Rose */
	public static readonly RaspberryRose = Color.create(0xb3, 0x44, 0x6c);
	/** Raw Umber */
	public static readonly RawUmber = Color.create(0x82, 0x66, 0x44);
	/** Razzle Dazzle Rose */
	public static readonly RazzleDazzleRose = Color.create(0xff, 0x33, 0xcc);
	/** Razzmatazz */
	public static readonly Razzmatazz = Color.create(0xe3, 0x25, 0x6b);
	/** Red */
	public static readonly Red = Color.create(0xff, 0x00, 0x00);
	/** Red-Brown */
	public static readonly RedBrown = Color.create(0xa5, 0x2a, 0x2a);
	/** Red Devil */
	public static readonly RedDevil = Color.create(0x86, 0x01, 0x11);
	/** Red (Munsell) */
	public static readonly RedMunsell = Color.create(0xf2, 0x00, 0x3c);
	/** Red (Ncs) */
	public static readonly RedNcs = Color.create(0xc4, 0x02, 0x33);
	/** Red-Orange */
	public static readonly RedOrange = Color.create(0xff, 0x53, 0x49);
	/** Red (Pigment) */
	public static readonly RedPigment = Color.create(0xed, 0x1c, 0x24);
	/** Red (Ryb) */
	public static readonly RedRyb = Color.create(0xfe, 0x27, 0x12);
	/** Red-Violet */
	public static readonly RedViolet = Color.create(0xc7, 0x15, 0x85);
	/** Redwood */
	public static readonly Redwood = Color.create(0xab, 0x4e, 0x52);
	/** Regalia */
	public static readonly Regalia = Color.create(0x52, 0x2d, 0x80);
	/** Resolution Blue */
	public static readonly ResolutionBlue = Color.create(0x00, 0x23, 0x87);
	/** Rich Black */
	public static readonly RichBlack = Color.create(0x00, 0x40, 0x40);
	/** Rich Brilliant Lavender */
	public static readonly RichBrilliantLavender = Color.create(0xf1, 0xa7, 0xfe);
	/** Rich Carmine */
	public static readonly RichCarmine = Color.create(0xd7, 0x00, 0x40);
	/** Rich Electric Blue */
	public static readonly RichElectricBlue = Color.create(0x08, 0x92, 0xd0);
	/** Rich Lavender */
	public static readonly RichLavender = Color.create(0xa7, 0x6b, 0xcf);
	/** Rich Lilac */
	public static readonly RichLilac = Color.create(0xb6, 0x66, 0xd2);
	/** Rich Maroon */
	public static readonly RichMaroon = Color.create(0xb0, 0x30, 0x60);
	/** Rifle Green */
	public static readonly RifleGreen = Color.create(0x41, 0x48, 0x33);
	/** Robin Egg Blue */
	public static readonly RobinEggBlue = Color.create(0x00, 0xcc, 0xcc);
	/** Rose */
	public static readonly Rose = Color.create(0xff, 0x00, 0x7f);
	/** Rose Bonbon */
	public static readonly RoseBonbon = Color.create(0xf9, 0x42, 0x9e);
	/** Rose Ebony */
	public static readonly RoseEbony = Color.create(0x67, 0x48, 0x46);
	/** Rose Gold */
	public static readonly RoseGold = Color.create(0xb7, 0x6e, 0x79);
	/** Rose Madder */
	public static readonly RoseMadder = Color.create(0xe3, 0x26, 0x36);
	/** Rose Pink */
	public static readonly RosePink = Color.create(0xff, 0x66, 0xcc);
	/** Rose Quartz */
	public static readonly RoseQuartz = Color.create(0xaa, 0x98, 0xa9);
	/** Rose Taupe */
	public static readonly RoseTaupe = Color.create(0x90, 0x5d, 0x5d);
	/** Rose Vale */
	public static readonly RoseVale = Color.create(0xab, 0x4e, 0x52);
	/** Rosewood */
	public static readonly Rosewood = Color.create(0x65, 0x00, 0xb);
	/** Rosso Corsa */
	public static readonly RossoCorsa = Color.create(0xd4, 0x00, 0x00);
	/** Rosy Brown */
	public static readonly RosyBrown = Color.create(0xbc, 0x8f, 0x8f);
	/** Royal Azure */
	public static readonly RoyalAzure = Color.create(0x00, 0x38, 0xa8);
	/** Royal Blue (Traditional) */
	public static readonly RoyalBlueTraditional = Color.create(0x00, 0x23, 0x66);
	/** Royal Blue (Web) */
	public static readonly RoyalBlueWeb = Color.create(0x41, 0x69, 0xe1);
	/** Royal Fuchsia */
	public static readonly RoyalFuchsia = Color.create(0xca, 0x2c, 0x92);
	/** Royal Purple */
	public static readonly RoyalPurple = Color.create(0x78, 0x51, 0xa9);
	/** Royal Yellow */
	public static readonly RoyalYellow = Color.create(0xfa, 0xda, 0x5e);
	/** Rubine Red */
	public static readonly RubineRed = Color.create(0xd1, 0x00, 0x56);
	/** Ruby */
	public static readonly Ruby = Color.create(0xe0, 0x11, 0x5f);
	/** Ruby Red */
	public static readonly RubyRed = Color.create(0x9b, 0x11, 0x1e);
	/** Ruddy */
	public static readonly Ruddy = Color.create(0xff, 0x00, 0x28);
	/** Ruddy Brown */
	public static readonly RuddyBrown = Color.create(0xbb, 0x65, 0x28);
	/** Ruddy Pink */
	public static readonly RuddyPink = Color.create(0xe1, 0x8e, 0x96);
	/** Rufous */
	public static readonly Rufous = Color.create(0xa8, 0x1c, 0x07);
	/** Russet */
	public static readonly Russet = Color.create(0x80, 0x46, 0x1b);
	/** Rust */
	public static readonly Rust = Color.create(0xb7, 0x41, 0xe);
	/** Rusty Red */
	public static readonly RustyRed = Color.create(0xda, 0x2c, 0x43);
	/** Sacramento State Green */
	public static readonly SacramentoStateGreen = Color.create(0x00, 0x56, 0x3f);
	/** Saddle Brown */
	public static readonly SaddleBrown = Color.create(0x8b, 0x45, 0x13);
	/** Safety Orange (Blaze Orange) */
	public static readonly SafetyOrangeBlazeOrange = Color.create(0xff, 0x67, 0x00);
	/** Saffron */
	public static readonly Saffron = Color.create(0xf4, 0xc4, 0x30);
	/** Salmon */
	public static readonly Salmon = Color.create(0xff, 0x8c, 0x69);
	/** Salmon Pink */
	public static readonly SalmonPink = Color.create(0xff, 0x91, 0xa4);
	/** Sand */
	public static readonly Sand = Color.create(0xc2, 0xb2, 0x80);
	/** Sand Dune */
	public static readonly SandDune = Color.create(0x96, 0x71, 0x17);
	/** Sandstorm */
	public static readonly Sandstorm = Color.create(0xec, 0xd5, 0x40);
	/** Sandy Brown */
	public static readonly SandyBrown = Color.create(0xf4, 0xa4, 0x60);
	/** Sandy Taupe */
	public static readonly SandyTaupe = Color.create(0x96, 0x71, 0x17);
	/** Sangria */
	public static readonly Sangria = Color.create(0x92, 0x00, 0xa);
	/** Sap Green */
	public static readonly SapGreen = Color.create(0x50, 0x7d, 0x2a);
	/** Sapphire */
	public static readonly Sapphire = Color.create(0xf, 0x52, 0xba);
	/** Sapphire Blue */
	public static readonly SapphireBlue = Color.create(0x00, 0x67, 0xa5);
	/** Satin Sheen Gold */
	public static readonly SatinSheenGold = Color.create(0xcb, 0xa1, 0x35);
	/** Scarlet */
	public static readonly Scarlet = Color.create(0xff, 0x24, 0x00);
	/** Scarlet (Crayola) */
	public static readonly ScarletCrayola = Color.create(0xfd, 0xe, 0x35);
	/** School Bus Yellow */
	public static readonly SchoolBusYellow = Color.create(0xff, 0xd8, 0x00);
	/** Screamin' Green */
	public static readonly ScreaminGreen = Color.create(0x76, 0xff, 0x7a);
	/** Sea Blue */
	public static readonly SeaBlue = Color.create(0x00, 0x69, 0x94);
	/** Sea Green */
	public static readonly SeaGreen = Color.create(0x2e, 0x8b, 0x57);
	/** Seal Brown */
	public static readonly SealBrown = Color.create(0x32, 0x14, 0x14);
	/** Seashell */
	public static readonly Seashell = Color.create(0xff, 0xf5, 0xee);
	/** Selective Yellow */
	public static readonly SelectiveYellow = Color.create(0xff, 0xba, 0x00);
	/** Sepia */
	public static readonly Sepia = Color.create(0x70, 0x42, 0x14);
	/** Shadow */
	public static readonly Shadow = Color.create(0x8a, 0x79, 0x5d);
	/** Shamrock Green */
	public static readonly ShamrockGreen = Color.create(0x00, 0x9e, 0x60);
	/** Shocking Pink */
	public static readonly ShockingPink = Color.create(0xfc, 0xf, 0xc0);
	/** Shocking Pink (Crayola) */
	public static readonly ShockingPinkCrayola = Color.create(0xff, 0x6f, 0xff);
	/** Sienna */
	public static readonly Sienna = Color.create(0x88, 0x2d, 0x17);
	/** Silver */
	public static readonly Silver = Color.create(0xc0, 0xc0, 0xc0);
	/** Sinopia */
	public static readonly Sinopia = Color.create(0xcb, 0x41, 0xb);
	/** Skobeloff */
	public static readonly Skobeloff = Color.create(0x00, 0x74, 0x74);
	/** Sky Blue */
	public static readonly SkyBlue = Color.create(0x87, 0xce, 0xeb);
	/** Sky Magenta */
	public static readonly SkyMagenta = Color.create(0xcf, 0x71, 0xaf);
	/** Slate Blue */
	public static readonly SlateBlue = Color.create(0x6a, 0x5a, 0xcd);
	/** Slate Gray */
	public static readonly SlateGray = Color.create(0x70, 0x80, 0x90);
	/** Smalt (Dark Powder Blue) */
	public static readonly SmaltDarkPowderBlue = Color.create(0x00, 0x33, 0x99);
	/** Smokey Topaz */
	public static readonly SmokeyTopaz = Color.create(0x93, 0x3d, 0x41);
	/** Smoky Black */
	public static readonly SmokyBlack = Color.create(0x10, 0xc, 0x08);
	/** Snow */
	public static readonly Snow = Color.create(0xff, 0xfa, 0xfa);
	/** Spiro Disco Ball */
	public static readonly SpiroDiscoBall = Color.create(0xf, 0xc0, 0xfc);
	/** Spring Bud */
	public static readonly SpringBud = Color.create(0xa7, 0xfc, 0x00);
	/** Spring Green */
	public static readonly SpringGreen = Color.create(0x00, 0xff, 0x7f);
	/** St. Patrick'S Blue */
	public static readonly StPatrickSBlue = Color.create(0x23, 0x29, 0x7a);
	/** Steel Blue */
	public static readonly SteelBlue = Color.create(0x46, 0x82, 0xb4);
	/** Stil De Grain Yellow */
	public static readonly StilDeGrainYellow = Color.create(0xfa, 0xda, 0x5e);
	/** Stizza */
	public static readonly Stizza = Color.create(0x99, 0x00, 0x00);
	/** Stormcloud */
	public static readonly Stormcloud = Color.create(0x4f, 0x66, 0x6a);
	/** Straw */
	public static readonly Straw = Color.create(0xe4, 0xd9, 0x6f);
	/** Sunglow */
	public static readonly Sunglow = Color.create(0xff, 0xcc, 0x33);
	/** Sunset */
	public static readonly Sunset = Color.create(0xfa, 0xd6, 0xa5);
	/** Tan */
	public static readonly Tan = Color.create(0xd2, 0xb4, 0x8c);
	/** Tangelo */
	public static readonly Tangelo = Color.create(0xf9, 0x4d, 0x00);
	/** Tangerine */
	public static readonly Tangerine = Color.create(0xf2, 0x85, 0x00);
	/** Tangerine Yellow */
	public static readonly TangerineYellow = Color.create(0xff, 0xcc, 0x00);
	/** Tango Pink */
	public static readonly TangoPink = Color.create(0xe4, 0x71, 0x7a);
	/** Taupe */
	public static readonly Taupe = Color.create(0x48, 0x3c, 0x32);
	/** Taupe Gray */
	public static readonly TaupeGray = Color.create(0x8b, 0x85, 0x89);
	/** Tea Green */
	public static readonly TeaGreen = Color.create(0xd0, 0xf0, 0xc0);
	/** Tea Rose (Orange) */
	public static readonly TeaRoseOrange = Color.create(0xf8, 0x83, 0x79);
	/** Tea Rose (Rose) */
	public static readonly TeaRoseRose = Color.create(0xf4, 0xc2, 0xc2);
	/** Teal */
	public static readonly Teal = Color.create(0x00, 0x80, 0x80);
	/** Teal Blue */
	public static readonly TealBlue = Color.create(0x36, 0x75, 0x88);
	/** Teal Green */
	public static readonly TealGreen = Color.create(0x00, 0x82, 0x7f);
	/** Telemagenta */
	public static readonly Telemagenta = Color.create(0xcf, 0x34, 0x76);
	/** Tenné (Tawny) */
	public static readonly TennTawny = Color.create(0xcd, 0x57, 0x00);
	/** Terra Cotta */
	public static readonly TerraCotta = Color.create(0xe2, 0x72, 0x5b);
	/** Thistle */
	public static readonly Thistle = Color.create(0xd8, 0xbf, 0xd8);
	/** Thulian Pink */
	public static readonly ThulianPink = Color.create(0xde, 0x6f, 0xa1);
	/** Tickle Me Pink */
	public static readonly TickleMePink = Color.create(0xfc, 0x89, 0xac);
	/** Tiffany Blue */
	public static readonly TiffanyBlue = Color.create(0xa, 0xba, 0xb5);
	/** Tiger'S Eye */
	public static readonly TigerSEye = Color.create(0xe0, 0x8d, 0x3c);
	/** Timberwolf */
	public static readonly Timberwolf = Color.create(0xdb, 0xd7, 0xd2);
	/** Titanium Yellow */
	public static readonly TitaniumYellow = Color.create(0xee, 0xe6, 0x00);
	/** Tomato */
	public static readonly Tomato = Color.create(0xff, 0x63, 0x47);
	/** Toolbox */
	public static readonly Toolbox = Color.create(0x74, 0x6c, 0xc0);
	/** Topaz */
	public static readonly Topaz = Color.create(0xff, 0xc8, 0x7c);
	/** Tractor Red */
	public static readonly TractorRed = Color.create(0xfd, 0xe, 0x35);
	/** Trolley Grey */
	public static readonly TrolleyGrey = Color.create(0x80, 0x80, 0x80);
	/** Tropical Rain Forest */
	public static readonly TropicalRainForest = Color.create(0x00, 0x75, 0x5e);
	/** True Blue */
	public static readonly TrueBlue = Color.create(0x00, 0x73, 0xcf);
	/** Tufts Blue */
	public static readonly TuftsBlue = Color.create(0x41, 0x7d, 0xc1);
	/** Tumbleweed */
	public static readonly Tumbleweed = Color.create(0xde, 0xaa, 0x88);
	/** Turkish Rose */
	public static readonly TurkishRose = Color.create(0xb5, 0x72, 0x81);
	/** Turquoise */
	public static readonly Turquoise = Color.create(0x30, 0xd5, 0xc8);
	/** Turquoise Blue */
	public static readonly TurquoiseBlue = Color.create(0x00, 0xff, 0xef);
	/** Turquoise Green */
	public static readonly TurquoiseGreen = Color.create(0xa0, 0xd6, 0xb4);
	/** Tuscan Red */
	public static readonly TuscanRed = Color.create(0x7c, 0x48, 0x48);
	/** Twilight Lavender */
	public static readonly TwilightLavender = Color.create(0x8a, 0x49, 0x6b);
	/** Tyrian Purple */
	public static readonly TyrianPurple = Color.create(0x66, 0x02, 0x3c);
	/** Ua Blue */
	public static readonly UaBlue = Color.create(0x00, 0x33, 0xaa);
	/** Ua Red */
	public static readonly UaRed = Color.create(0xd9, 0x00, 0x4c);
	/** Ube */
	public static readonly Ube = Color.create(0x88, 0x78, 0xc3);
	/** Ucla Blue */
	public static readonly UclaBlue = Color.create(0x53, 0x68, 0x95);
	/** Ucla Gold */
	public static readonly UclaGold = Color.create(0xff, 0xb3, 0x00);
	/** Ufo Green */
	public static readonly UfoGreen = Color.create(0x3c, 0xd0, 0x70);
	/** Ultra Pink */
	public static readonly UltraPink = Color.create(0xff, 0x6f, 0xff);
	/** Ultramarine */
	public static readonly Ultramarine = Color.create(0x12, 0xa, 0x8f);
	/** Ultramarine Blue */
	public static readonly UltramarineBlue = Color.create(0x41, 0x66, 0xf5);
	/** Umber */
	public static readonly Umber = Color.create(0x63, 0x51, 0x47);
	/** Unbleached Silk */
	public static readonly UnbleachedSilk = Color.create(0xff, 0xdd, 0xca);
	/** United Nations Blue */
	public static readonly UnitedNationsBlue = Color.create(0x5b, 0x92, 0xe5);
	/** University Of California Gold */
	public static readonly UniversityOfCaliforniaGold = Color.create(0xb7, 0x87, 0x27);
	/** Unmellow Yellow */
	public static readonly UnmellowYellow = Color.create(0xff, 0xff, 0x66);
	/** Up Forest Green */
	public static readonly UpForestGreen = Color.create(0x01, 0x44, 0x21);
	/** Up Maroon */
	public static readonly UpMaroon = Color.create(0x7b, 0x11, 0x13);
	/** Upsdell Red */
	public static readonly UpsdellRed = Color.create(0xae, 0x20, 0x29);
	/** Urobilin */
	public static readonly Urobilin = Color.create(0xe1, 0xad, 0x21);
	/** Usafa Blue */
	public static readonly UsafaBlue = Color.create(0x00, 0x4f, 0x98);
	/** Usc Cardinal */
	public static readonly UscCardinal = Color.create(0x99, 0x00, 0x00);
	/** Usc Gold */
	public static readonly UscGold = Color.create(0xff, 0xcc, 0x00);
	/** Utah Crimson */
	public static readonly UtahCrimson = Color.create(0xd3, 0x00, 0x3f);
	/** Vanilla */
	public static readonly Vanilla = Color.create(0xf3, 0xe5, 0xab);
	/** Vegas Gold */
	public static readonly VegasGold = Color.create(0xc5, 0xb3, 0x58);
	/** Venetian Red */
	public static readonly VenetianRed = Color.create(0xc8, 0x08, 0x15);
	/** Verdigris */
	public static readonly Verdigris = Color.create(0x43, 0xb3, 0xae);
	/** Vermilion (Cinnabar) */
	public static readonly VermilionCinnabar = Color.create(0xe3, 0x42, 0x34);
	/** Vermilion (Plochere) */
	public static readonly VermilionPlochere = Color.create(0xd9, 0x60, 0x3b);
	/** Veronica */
	public static readonly Veronica = Color.create(0xa0, 0x20, 0xf0);
	/** Violet */
	public static readonly Violet = Color.create(0x8f, 0x00, 0xff);
	/** Violet-Blue */
	public static readonly VioletBlue = Color.create(0x32, 0x4a, 0xb2);
	/** Violet (Color Wheel) */
	public static readonly VioletColorWheel = Color.create(0x7f, 0x00, 0xff);
	/** Violet (Ryb) */
	public static readonly VioletRyb = Color.create(0x86, 0x01, 0xaf);
	/** Violet (Web) */
	public static readonly VioletWeb = Color.create(0xee, 0x82, 0xee);
	/** Viridian */
	public static readonly Viridian = Color.create(0x40, 0x82, 0x6d);
	/** Vivid Auburn */
	public static readonly VividAuburn = Color.create(0x92, 0x27, 0x24);
	/** Vivid Burgundy */
	public static readonly VividBurgundy = Color.create(0x9f, 0x1d, 0x35);
	/** Vivid Cerise */
	public static readonly VividCerise = Color.create(0xda, 0x1d, 0x81);
	/** Vivid Tangerine */
	public static readonly VividTangerine = Color.create(0xff, 0xa0, 0x89);
	/** Vivid Violet */
	public static readonly VividViolet = Color.create(0x9f, 0x00, 0xff);
	/** Warm Black */
	public static readonly WarmBlack = Color.create(0x00, 0x42, 0x42);
	/** Waterspout */
	public static readonly Waterspout = Color.create(0xa4, 0xf4, 0xf9);
	/** Wenge */
	public static readonly Wenge = Color.create(0x64, 0x54, 0x52);
	/** Wheat */
	public static readonly Wheat = Color.create(0xf5, 0xde, 0xb3);
	/** White */
	public static readonly White = Color.create(0xff, 0xff, 0xff);
	/** White Smoke */
	public static readonly WhiteSmoke = Color.create(0xf5, 0xf5, 0xf5);
	/** Wild Blue Yonder */
	public static readonly WildBlueYonder = Color.create(0xa2, 0xad, 0xd0);
	/** Wild Strawberry */
	public static readonly WildStrawberry = Color.create(0xff, 0x43, 0xa4);
	/** Wild Watermelon */
	public static readonly WildWatermelon = Color.create(0xfc, 0x6c, 0x85);
	/** Wine */
	public static readonly Wine = Color.create(0x72, 0x2f, 0x37);
	/** Wine Dregs */
	public static readonly WineDregs = Color.create(0x67, 0x31, 0x47);
	/** Wisteria */
	public static readonly Wisteria = Color.create(0xc9, 0xa0, 0xdc);
	/** Wood Brown */
	public static readonly WoodBrown = Color.create(0xc1, 0x9a, 0x6b);
	/** Xanadu */
	public static readonly Xanadu = Color.create(0x73, 0x86, 0x78);
	/** Yale Blue */
	public static readonly YaleBlue = Color.create(0xf, 0x4d, 0x92);
	/** Yellow */
	public static readonly Yellow = Color.create(0xff, 0xff, 0x00);
	/** Yellow-Green */
	public static readonly YellowGreen = Color.create(0x9a, 0xcd, 0x32);
	/** Yellow (Munsell) */
	public static readonly YellowMunsell = Color.create(0xef, 0xcc, 0x00);
	/** Yellow (Ncs) */
	public static readonly YellowNcs = Color.create(0xff, 0xd3, 0x00);
	/** Yellow Orange */
	public static readonly YellowOrange = Color.create(0xff, 0xae, 0x42);
	/** Yellow (Process) */
	public static readonly YellowProcess = Color.create(0xff, 0xef, 0x00);
	/** Yellow (Ryb) */
	public static readonly YellowRyb = Color.create(0xfe, 0xfe, 0x33);
	/** Zaffre */
	public static readonly Zaffre = Color.create(0x00, 0x14, 0xa8);
	/** Zinnwaldite Brown */
	public static readonly ZinnwalditeBrown = Color.create(0x2c, 0x16, 0x08);
}
