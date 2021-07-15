import path from "path";
import fs from "fs";
import sharp from "sharp";
import GL from "gl";
console.time("gl");

const width = 1920;
const height = 1080;
const gl = GL(width, height, { preserveDrawingBuffer: true, powerPreference: "high-performance" });

var frameCount = 0;
var elapsedTime = 0;
var lastTime = Date.now();
var pixels = new Uint8Array(width * height * 4);

gl.viewport(0, 0, width, height);

while (true) {
	gl.clearColor(0, 0.5, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const now = new Date().getTime();

	frameCount++;
	elapsedTime += now - lastTime;

	lastTime = now;

	if (elapsedTime >= 1000) {
		elapsedTime -= 1000;

		console.log(frameCount);
		frameCount = 0;
	}

	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	gl.finish();
}
