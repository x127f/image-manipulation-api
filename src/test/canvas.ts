import Canvas from "canvas";
import path from "path";
import fs from "fs/promises";
import { NodeRender } from "../util/NodeRender";
import Templates from "../templates/Template";

async function main() {
	const canvas = Canvas.createCanvas(1200, 630);

	const r = new NodeRender(canvas);

	r.pixelDensity(4)
		.stroke(null)
		.image({
			image: await Canvas.loadImage("https://discord.com/assets/652f40427e1f5186ad54836074898279.png"),
			x: 0,
			y: 0,
		})
		.fill("red")
		.renderMode("center")
		.circle({ x: r.centerX, y: r.centerY, radius: 50 })
		.renderMode("corner")
		.fill("white")
		.rect({ x: 0, y: 0, width: r.width, height: 10 })
		.rect({ x: 0, y: r.height - 10, width: r.width, height: 10 })
		.rect({ x: 0, y: 0, width: 10, height: r.height })
		.rect({ x: r.width - 10, y: 0, width: 10, height: r.height })
		.toPNG()
		.then((png) => fs.writeFile(path.join(__dirname, "result.png"), png))
		.then(() => console.log("finished"));
}

async function test() {
	const r = await Templates.discord.rankCard({
		max: 100,
		xp: 50,
		level: 1,
		rank: "10",
		user_name: "flam3rboy",
		user_id: "311129357362135041",
		user_avatar: "448d0096873b63cc3eb2c21812bc60ba",
		user_discriminator: "0001",
		status: "online",
		scale: 0.4,
	});

	await fs.writeFile(path.join(__dirname, "result.png"), await r.toPNG());
	console.log("finished");
}

test();
setTimeout(() => {}, 1000000);
