// @ts-nocheck
import "missing-native-js-functions";
import path from "path";

function checkFileExists(file: string) {
	return require("fs")
		.promises.access(file)
		.then(() => true)
		.catch(() => false);
}

const cache = path.join(__dirname, "..", "..", "cache", "download");
if (!globalThis.window) {
	require("fs-extra").ensureDirSync(cache);
}

export async function fetchBase64(url: string, opts: any) {
	const file = path.join(cache, url.split("://")[1].replaceAll("/", "-"));
	if (!globalThis.window) {
		if (await checkFileExists(file)) {
			return require("fs").promises.readFile(file, { encoding: "utf8" });
		}
	}

	const fetch = globalThis.fetch || require("node-fetch");
	const FileReader = globalThis.FileReader || require("filereader");
	const response = await fetch(url, opts);
	var image;

	if (globalThis.window) {
		// browser
		const arrayBuffer = await response.arrayBuffer();
		image = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
	} else {
		// nodejs
		const body = await response.buffer();
		image = body.toString("base64");
	}

	const result = `data:${response.headers.get("content-type")?.toLowerCase()};base64,${image}`;
	if (!globalThis.window) require("fs").promises.writeFile(file, result, { encoding: "utf8" }).caught(); // do not await file to be written for lower latency
	if (response.status !== 200) throw new Error("not found");
	return result;
}
