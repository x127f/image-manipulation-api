// @ts-nocheck
import "missing-native-js-functions";
import f from "node-fetch";

export async function fetchBase64(url: string, opts: any) {
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

	return `data:${response.headers.get("content-type")?.toLowerCase()};base64,${image}`;
}
