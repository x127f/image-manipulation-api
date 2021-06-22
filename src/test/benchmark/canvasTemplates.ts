import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import * as DiscordCanvas from "../../templates/DiscordCanvas";
import * as DiscordSkia from "../../templates/DiscordSkia";

suite(
	"Canvas Templates",
	cycle((result) => console.log("finish", result.name)),

	add("rank card canvas", async () => {
		const r = await DiscordCanvas.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: false, //"448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});

		await r.toPNG();
	}),
	add("rank card skia", async () => {
		const r = await DiscordSkia.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: false, //"448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});

		// @ts-ignore
		const png = await r.canvas.toBuffer("png");
	}),
	add("rank card -> jpeg", async () => {
		const r = await DiscordCanvas.rankCard({
			max: 100,
			xp: 50,
			level: 1,
			rank: "10",
			user_name: "flam3rboy",
			user_id: "311129357362135041",
			user_avatar: false, //"448d0096873b63cc3eb2c21812bc60ba",
			user_discriminator: "0001",
			status: "online",
			scale: 1,
		});
		r.canvas.toBuffer("image/jpeg");
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
