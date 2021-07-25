import { createCanvas, loadImage } from "canvas";
import path from "path";
import fs from "fs/promises";

const width = 1000;
const height = 300;
const RankCardCenter = path.join(__dirname, "..", "..", "assets", "templates", "discord", "RankCardCenter.svg");

async function test() {
	const canvas = createCanvas(width, height);
	const image = await loadImage(RankCardCenter);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

	await fs.writeFile(path.join(__dirname, "result.png"), canvas.toBuffer());
	console.log("finished");
}

test();
setTimeout(() => {}, 1000000);
