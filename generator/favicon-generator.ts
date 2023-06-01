import * as fs from "fs";
import * as path from "path";

//import * as sharp from "sharp";
import sharp from "sharp";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const minifyXML = require("minify-xml").minify;

const iconSizes = [16, 32, 48, 64, 128, 256, 512];

const rootDirectoryPath = path.resolve(__dirname, "..");
const faviconSourceFilePath = path.join(rootDirectoryPath, "resource", "ganttwbs.svg");
const faviconOutputSvgFilePath = path.join(rootDirectoryPath, "public", "favicon.svg");

const faviconSourceFileContent = fs.readFileSync(faviconSourceFilePath);
const outputXml = minifyXML(faviconSourceFileContent.toString());
fs.writeFileSync(faviconOutputSvgFilePath, outputXml);

iconSizes.map(async a => {
	const faviconOutputPngFilePath = path.join(rootDirectoryPath, "public", `favicon-${a}x${a}.png`);

	const buffer = await sharp(Buffer.from(outputXml))
		.resize(a, a)
		.png()
		.toBuffer()
		;
	fs.writeFileSync(faviconOutputPngFilePath, buffer);
});
