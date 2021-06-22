import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import sharp from "sharp";
import * as Discord from "../../templates/Discord";
import fs from "fs";
import { execSync, execFile } from "child_process";
sharp.cache(false);

const stream = fs.readFileSync(
	path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "RankCardCenter.svg")
);

async function main() {
	const t = new Discord.RankCard({ type: "center" });
	await t.init();

	suite(
		"SVG",
		// add("blank svg -> png sync", async () => {
		// 	await sharp(
		// 		Buffer.from(
		// 			`<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com"></svg>`
		// 		)
		// 	)
		// 		.png()
		// 		.toBuffer();
		// }),
		// add("svg -> png (fs)", async () => {
		// 	await sharp(
		// 		fs.readFileSync(
		// 			path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "RankCardCenter.svg")
		// 		)
		// 	)
		// 		.png()
		// 		.toBuffer();
		// }),
		// add("svg -> png (path)", async () => {
		// 	await sharp(path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "RankCardCenter.svg"))
		// 		.png()
		// 		.toBuffer();
		// }),
		// add("rank template -> png", async () => {
		// 	await sharp(
		// 		fs.readFileSync(
		// 			path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "RankCardCenter.svg")
		// 		)
		// 	)
		// 		.png()
		// 		.toBuffer();
		// }),
		// add("rankcard -> path", async () => {
		// 	console.time("init");
		// 	const t = new Discord.RankCard({ type: "center" });
		// 	await t.init();

		// 	t.setRank(1);
		// 	t.setLevel(1);
		// 	t.setMax(100);
		// 	t.setXP(50);
		// 	t.setUsername("Flam3rboy");
		// 	t.setDiscriminator("3490");
		// 	t.setColor("primary_color", "#5865F2");
		// 	fs.writeFileSync(path.join(__dirname, "temp.svg"), t.toXML());
		// 	console.timeEnd("init");

		// 	console.time("png");
		// 	await sharp(path.join(__dirname, "temp.svg")).png().toBuffer();
		// 	console.timeEnd("png");
		// }),
		// add("rankcard -> buffer", async () => {
		// 	console.time("init");

		// 	t.setRank(1);
		// 	t.setLevel(1);
		// 	t.setMax(100);
		// 	t.setXP(50);
		// 	t.setUsername("Flam3rboy");
		// 	t.setDiscriminator("3490");
		// 	t.setColor("primary_color", "#5865F2");

		// 	console.timeEnd("init");

		// 	console.time("png");
		// 	await t.toPNG();
		// 	console.timeEnd("png");
		// }),
		// add("librsvg", () => {
		// 	console.time("librsvg");
		// 	// execFileSync(`rsvg-convert`, { input: stream });
		// 	const child = execFile(`rsvg-convert`);
		// 	child.stdout.setEncoding("utf8").on("data", (d) => console.log(d.toString()));
		// 	child.stderr.setEncoding("utf8").on("data", (d) => console.log(d.toString()));
		// 	child.stdin.write(stream);
		// 	child.on("exit", (code) => console.log("exit", code));
		// 	console.timeEnd("librsvg");
		// }),
		add("cairosvg", () => {
			console.time("cairosvg");
			// execFileSync(`rsvg-convert`, { input: stream });
			execSync(`cairosvg ../../assets/templates/discord/RankCardCenter.svg -o result.png`);
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
