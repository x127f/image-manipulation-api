// @ts-nocheck
process.on("uncaughtException", console.error);
setTimeout(() => {}, 100000);

const webgl = require("webgl-raub");
const { Document } = require("glfw-raub");

Document.setWebgl(webgl); // plug this WebGL impl into the Document

const { performance } = require("perf_hooks");

const doc = new Document({ ignoreQuit: false, autoFullscreen: false });
global.document = global.window = doc;
window.performance = performance;
global.screen = { width: window.innerWidth, height: window.innerHeight };
global.navigator = { userAgent: "" };
document.getElementById = () => null;

function setup() {
	createCanvas(1920, 1080, WEBGL);

	frameRate(60);
}

function draw() {
	// translate(-width/2,-height/2)
	background("#2f3136");
	// rotateY(map(mouseX, 0, width, 0, 3));
	// rotateX(map(mouseY, 0, height, 0, 2));

	text("Level", 0, 0);
}

globalThis.draw = draw;
globalThis.setup = setup;

require("p5js-node");
