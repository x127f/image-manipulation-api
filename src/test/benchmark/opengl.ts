import path from "path";
import fs from "fs";
import sharp from "sharp";
import GL from "gl";
import { add, complete, cycle, save, suite } from "benny";

const width = 1920;
const height = 1080;

suite(
	"OpenGL",
	add("raw red image", () => {
		const gl = GL(width, height, { preserveDrawingBuffer: true });

		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const pixels = new Uint8Array(width * height * 4);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	}),
	add("raw red image + convert", async () => {
		const gl = GL(width, height, { preserveDrawingBuffer: true });

		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const pixels = new Uint8Array(width * height * 4);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

		sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } })
			.png()
			.pipe(fs.createWriteStream(path.resolve("test.png")));
	}),
	save({
		file: "opengl",
		folder: path.join(__dirname, "results"),
		version: require("../../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
