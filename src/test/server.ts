import express from "express";
import templates from "../templates/Template";
import { performance } from "perf_hooks";

const app = express();

app.get("/", async (req, res) => {
	const start = performance.now();
	const r = await templates.discord.rankCard({
		max: 100,
		xp: 50,
		level: 1,
		rank: "10",
		user_name: "Flam3rboy",
		user_id: "311129357362135041",
		user_avatar: "448d0096873b63cc3eb2c21812bc60ba",
		user_discriminator: "0001",
		status: "online",
		scale: 4,
	});

	res.contentType("image/png").send(await r.toPNG());
	console.log(`${performance.now() - start}ms`);
});

app.listen(3000, () => {
	console.log("server started on port 3000");
});
