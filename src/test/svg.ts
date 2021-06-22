import path from "path";
import fs from "fs/promises";
import * as Discord from "../templates/Discord";
import { Gradient, Pattern, Template } from "../templates/Template";
import fetch from "node-fetch";

async function main() {
	console.log("generating ...");
	await new Discord.RankCard({ type: "center" }).init();
	const t = new Discord.RankCard({ type: "center" });

	const gradient = new Gradient().add("#5865F2", 0).add("#0000ff", 100);
	console.time("init");
	await t.init();
	console.timeEnd("init");

	t.setRank(1);
	t.setLevel(1);
	t.setMax(100);
	t.setXP(50);
	// t.setBackground(await (await fetch("https://ak.picdn.net/shutterstock/videos/1033186691/thumb/1.jpg")).buffer());
	t.setUsername("Flam3rboy");
	t.setDiscriminator("3490");
	t.setColor("primary_color", "#5865F2");
	t.setGradient("progress", gradient);
	console.time("avatar");
	await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");
	console.timeEnd("avatar");
	console.time("png");
	// await fs.writeFile(path.join(__dirname, "result.svg"), t.dom.xml());
	const png = await t.toPNG();
	console.timeEnd("png");

	await fs.writeFile(path.join(__dirname, "result.png"), png);
	console.log("finished");
}

main();
