const Canvas = require("canvas");
const { add, complete, cycle, save, suite } = require("benny");
const path = require("path");
const sharp = require("sharp");

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
	add("blank png data url full hd", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toDataURL();
	}),

	add("png with background", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		const ctx = canvas.getContext("2d");
		const image = await Canvas.loadImage(
			path.join(__dirname, "..", "..", "assets", "backgrounds", "discord_basic.png")
		);

		ctx.drawImage(image, 0, 0);

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
	add("blank jpeg data url full hd", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toDataURL("image/jpeg", 1);
	}),
	add("jpeg with background", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		const ctx = canvas.getContext("2d");
		const image = await Canvas.loadImage(
			path.join(__dirname, "..", "..", "assets", "backgrounds", "discord_basic.png")
		);

		ctx.drawImage(image, 0, 0);

		canvas.toBuffer("image/jpeg", { quality: 1 });
	}),
	add("blank RAW buffer full hd", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("raw");
	}),
	add("blank RAW buffer full hd -> converted to png with sharp", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);

		await sharp(canvas.toBuffer("raw"), { raw: { width: 1920, height: 1080, channels: 4 } })
			.png()
			.toBuffer();
	}),

	save({
		file: "canvas",
		folder: path.join(__dirname, "results"),
		version: require("../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
