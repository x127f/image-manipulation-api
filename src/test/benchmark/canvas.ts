import Canvas from "canvas";
import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import sharp from "sharp";
import p5 from "p5js-node";
import { Render } from "../../util/Render";

const p = new p5();

suite(
	"Canvas",
	add("png buffer", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer();
	}),
	add("png data url", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toDataURL();
	}),
	add("png with background", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		const ctx = canvas.getContext("2d");
		const image = await Canvas.loadImage(
			path.join(__dirname, "..", "..", "..", "assets", "backgrounds", "discord_basic.png")
		);

		ctx.drawImage(image, 0, 0);

		canvas.toBuffer();
	}),
	add("jpeg buffer full quality", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("image/jpeg", { quality: 1 });
	}),
	add("jpeg buffer low quality", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("image/jpeg", { quality: 0.5 });
	}),
	add("jpeg data url", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toDataURL("image/jpeg", 1);
	}),
	add("jpeg with background", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		const ctx = canvas.getContext("2d");
		const image = await Canvas.loadImage(
			path.join(__dirname, "..", "..", "..", "assets", "backgrounds", "discord_basic.png")
		);

		ctx.drawImage(image, 0, 0);

		canvas.toBuffer("image/jpeg", { quality: 1 });
	}),
	add("p5js raw", () => {
		return new Promise((resolve, reject) => {
			p.createCanvas(1920, 1080);

			p.background(0);
			p.fill(255);
			p.rect(10, 10, 50, 50);
			p.noLoop();
			resolve(p.canvas.toBuffer("raw"));
		});
	}),
	add("p5js -> sharp png", () => {
		return new Promise(async (resolve, reject) => {
			p.createCanvas(1920, 1080);

			p.background(0);
			p.fill(255);
			p.rect(10, 10, 50, 50);
			p.noLoop();

			resolve(await new Render(p.canvas).toPNG());
		});
	}),
	add("own Renderer raw", () => {
		const canvas = Canvas.createCanvas(1920, 1080);

		return new Render(canvas)
			.fill("black")
			.rect({ x: 200, y: 500, width: 250, height: 250, radius: 125 })
			.toBuffer("raw");
	}),

	add("RAW buffer", () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		canvas.toBuffer("raw");
	}),
	add("own Renderer -> sharp png", () => {
		const canvas = Canvas.createCanvas(1920, 1080);

		return new Render(canvas).fill("black").rect({ x: 200, y: 500, width: 250, height: 250, radius: 125 }).toPNG();
	}),
	add("RAW -> sharp png", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);

		await new Render(canvas).toPNG();
	}),
	add("RAW -> sharp jpeg", async () => {
		const canvas = Canvas.createCanvas(1920, 1080);
		await new Render(canvas).toJPEG();
	}),

	save({
		file: "canvas",
		folder: path.join(__dirname, "results"),
		version: require("../../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
