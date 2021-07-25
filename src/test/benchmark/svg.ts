import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import sharp from "sharp";
import * as Discord from "../../templates/Discord";
import fs from "fs";
import { execSync, execFile, execFileSync } from "child_process";
import { createCanvas, loadImage } from "canvas";
import { NodeRender } from "../../util/NodeRender";
sharp.cache(false);

const RankCardCenter = path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "RankCardCenter.svg");
const stream = fs.readFileSync(RankCardCenter);
const width = 1000;
const height = 300;

async function main() {
	const t = new Discord.RankCard({ type: "center" });
	await t.init();

	const image = await loadImage(RankCardCenter);

	suite(
		"SVG",
		add("blank svg -> png (sharp)", async () => {
			await sharp(
				Buffer.from(
					`<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com"></svg>`
				)
			)
				.png()
				.toBuffer();
		}),
		add("rank svg -> png (canvas)", async () => {
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

			await new NodeRender(canvas).toPNG();
		}),
		add("rank svg -> png (sharp)", async () => {
			await sharp(stream).png().toBuffer();
		}),
		add("dynamic rank -> png (sharp)", async () => {
			console.time("png");
			t.setRank(1);
			t.setLevel(1);
			t.setMax(100);
			t.setXP(50);
			t.setUsername("Flam3rboy");
			t.setDiscriminator("3490");
			t.setColor("primary_color", "#5865F2");

			await t.toPNG();
			console.timeEnd("png");
		}),
		add("rank -> png (librsvg)", async () => {
			console.time("librsvg");

			execFileSync(`rsvg-convert`, { input: stream });

			console.timeEnd("librsvg");
		}),
		add("rank -> png (cairosvg)", () => {
			console.time("cairosvg");
			// execFileSync(`rsvg-convert`, { input: stream });
			execSync(`cairosvg ${RankCardCenter} -o result.png`);
			console.timeEnd("cairosvg");
		}),

		save({
			file: "svg",
			folder: path.join(__dirname, "results"),
			version: require("../../../package.json").version,
			details: true,
			format: "chart.html",
		})
	);
}

main();
