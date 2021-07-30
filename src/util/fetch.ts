// @ts-nocheck
import "missing-native-js-functions";
import path from "path";

export function checkFileExists(file: string) {
	return require("fs")
		.promises.access(file)
		.then(() => true)
		.catch(() => false);
}

const cache = path.join(__dirname, "..", "..", "cache", "download");
if (!globalThis.window) {
	require("fs-extra").ensureDirSync(cache);
}

export async function fetchBase64(url: string, opts?: any) {
	if (url.startsWith("data:")) return url;
	if (globalThis.window) {
		return url;
	}

	const file = path.join(
		cache,
		url.split("://")[1].replaceAll("/", "-").replaceAll("?", ".").replaceAll("=", "_").replaceAll("&", ",")
	);

	try {
		return await require("fs").promises.readFile(file, { encoding: "utf8" });
	} catch (e) {
		const fetch = globalThis.fetch || require("node-fetch");
		const response = await fetch(`https://proxy.flam3rboy.workers.dev/${url}`, opts);
		var image;

		// nodejs
		const body = await response.buffer();
		image = body.toString("base64");

		const result = `data:${response.headers.get("content-type")?.toLowerCase()};base64,${image}`;
		require("fs").promises.writeFile(file, result, { encoding: "utf8" }).caught(); // do not await file to be written for lower latency
		if (response.status !== 200) throw new Error("not found");
		return result;
	}
}
