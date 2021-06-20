// @ts-nocheck
import "missing-native-js-functions";

export default async function (url: string, opts: any) {
	const fetch = globalThis.fetch || require("node-fetch");
	const response = await fetch(url, opts);
	const arrayBuffer = await response.arrayBuffer();
	console.log(response, response.headers);
	globalThis.response = response;

	let image = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
	return `data:${response.headers.get("content-type")?.toLowerCase()};base64,${image}`;
}
