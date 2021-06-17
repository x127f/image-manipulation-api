const Canvas = require("canvas");
const { add, complete, cycle, save, suite } = require("benny");
const path = require("path");

suite(
	/**
	 * Name of the suite - required
	 */
	"Canvas",

	/**
	 * If the code that you want to benchmark has no setup,
	 * you can run it directly:
	 */
	add("blank png buffer full hd", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer();
	}),
	add("blank jpeg buffer full hd full quality", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("image/jpeg", { quality: 1 });
	}),
	add("blank jpeg buffer full hd low quality", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("image/jpeg", { quality: 0.5 });
	}),

	save({
		file: "canvas",
		folder: path.join(__dirname, "results"),
		version: require("../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
