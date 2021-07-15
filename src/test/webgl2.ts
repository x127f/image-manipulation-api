import webgl from "webgl-raub";
import { Document } from "glfw-raub";

Document.setWebgl(webgl); // plug this WebGL impl into the Document

const doc = new Document({
	width: 800,
	height: 600,
	ignoreQuit: false,
	autoFullscreen: false,
});
// @ts-ignore
global.document = global.window = doc;

const canvas = document.createElement("canvas"); // === doc
const gl = canvas.getContext("webgl"); // === webgl
var elapsedTime = 0;
var frameCount = 0;
var lastTime = Date.now();

function animation() {
	gl.viewport(0, 0, canvas.width, canvas.height);
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

	gl.finish();

	doc.requestAnimationFrame(animation);
}

doc.requestAnimationFrame(animation);
