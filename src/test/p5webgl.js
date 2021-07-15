const webgl = require("webgl-raub");
const fetch = require("node-fetch");
const { Document } = require("glfw-raub");
const opentype = require("opentype.js");
const { createCanvas } = require("canvas");
Document.setWebgl(webgl); // plug this WebGL impl into the Document

const { performance } = require("perf_hooks");

const doc = new Document({ ignoreQuit: false, autoFullscreen: false });
global.document = global.window = doc;
window.performance = performance;
global.screen = { width: window.innerWidth, height: window.innerHeight };
global.navigator = { userAgent: "" };
document.getElementById = () => null;
const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (kind) {
	if (kind === "2d") return createCanvas(this.width, this.height);
	return getContext(kind);
};
var myFont;

async function main() {
	var font = opentype.parse(
		await (await fetch("https://cdnjs.cloudflare.com/ajax/libs/bwip-js/1.7.4/OCRB.otf")).arrayBuffer()
	);

	function setup() {
		createCanvas(1000, 300, WEBGL);
		frameRate(60);
	}

	function draw() {
		textFont("arial");
		// textFont(myFont);
		textSize(100);
		textAlign(CENTER, CENTER);
		background(100);
		text("test", 100, 100);
	}

	globalThis.draw = draw;
	globalThis.setup = setup;

	require("p5js-node");

	myFont = new p5.Font();
	myFont.font = font;
}

main();
