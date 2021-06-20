import path from "path";
import fs from "fs/promises";
import * as Discord from "../templates/Discord";
import { Gradient, Pattern, Template } from "../templates/Template";
import fetch from "node-fetch";

async function main() {
	console.log("generating ...");
	const t = new Discord.RankCard("center");

	const gradient = new Gradient().add("#5865F2", 0).add("#0000ff", 100);

	t.setRank(1);
	t.setLevel(1);
	t.setMax(100);
	t.setXP(50);
	t.setBackground(await (await fetch("https://ak.picdn.net/shutterstock/videos/1033186691/thumb/1.jpg")).buffer());
	t.setUsername("Flam3rboy");
	t.setDiscriminator("3490");
	t.setColor("primary_color", "#5865F2");
	t.setGradient("progress", gradient);
	await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");
	await fs.writeFile(path.join(__dirname, "result.svg"), t.dom.xml());
	await fs.writeFile(path.join(__dirname, "result.png"), await t.toPNG());
	console.log("finished");
}

main();
