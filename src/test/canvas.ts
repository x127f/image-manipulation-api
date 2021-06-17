import Canvas from "canvas";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { Render } from "../util/Render";

const canvas = Canvas.createCanvas(1920, 1080);

const r = new Render(canvas);

r.pixelDensity(1)
	.rect({ x: 200, y: 500, width: 250, height: 250, radius: 125 })
	.toPNG()
	.then((png) => fs.writeFile(path.join(__dirname, "result.png"), png))
	.then(() => console.log("finished"));

setTimeout(() => {}, 1000000);
