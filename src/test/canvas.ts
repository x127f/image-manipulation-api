import Canvas from "canvas";
import path from "path";
import fs from "fs/promises";
import { NodeRender } from "../util/NodeRender";
import * as Discord from "../templates/DiscordSkia";

async function test() {
	const r = await Discord.rankCard({
		max: 100,
		xp: 50,
		level: 1,
		rank: "10",
		user_name: "flam3rboy",
		user_id: "311129357362135041",
		user_avatar: false, //"448d0096873b63cc3eb2c21812bc60ba",
		user_discriminator: "0001",
		status: "online",
		scale: 0.4,
	});

	// @ts-ignore
	await fs.writeFile(path.join(__dirname, "result.svg"), await r.canvas.toBuffer("svg"));
	console.log("finished");
}

test();
setTimeout(() => {}, 1000000);
