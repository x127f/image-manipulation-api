import Canvas from "canvas";
import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import p5 from "p5js-node";
import { NodeRender } from "../../util/NodeRender";
import templates from "../../templates/Template";

const p = new p5();

suite(
	"Canvas Templates",
	cycle((result) => console.log("finish", result.name)),

	add("blank", async () => {
		await new NodeRender().resize(1920, 1080).toPNG();
	}),

	add("rank card", async () => {
		const r = await templates.discord.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: "448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});

		await r.toPNG();
	}),
	add("rank card slow png", async () => {
		const r = await templates.discord.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: "448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});

		r.canvas.toBuffer("image/png");
	}),

	add("rank card without avatar", async () => {
		const r = await templates.discord.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: false,
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});

		await r.toPNG();
	}),

	add("rank card density: 0.5", async () => {
		const r = await templates.discord.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: "448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 0.5,
		});

		await r.toPNG();
	}),
	complete(),

	save({
		file: "canvasTemplates",
		folder: path.join(__dirname, "results"),
		version: require("../../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
