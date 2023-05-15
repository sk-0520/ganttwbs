import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const minifyXML = require("minify-xml").minify;

const rootDirectoryPath = path.resolve(__dirname, "..");
const faviconSourceFilePath = path.join(rootDirectoryPath, "resource", "ganttwbs.svg");
const faviconOutputFilePath = path.join(rootDirectoryPath, "public", "favicon.svg");

const faviconSourceFileContent = fs.readFileSync(faviconSourceFilePath);

const outputXml = minifyXML(faviconSourceFileContent.toString());

fs.writeFileSync(faviconOutputFilePath, outputXml);
