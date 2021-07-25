import canvacord from "canvacord";
import { add, complete, cycle, save, suite } from "benny";
import path from "path";

suite(
	"Canvacord",
	cycle((result) => console.log("finish", result.name)),
	add("canvacord", async () => {
		const rank = new canvacord.Rank()
			.setAvatar(
				"https://cdn.discordapp.com/avatars/480933736276426763/a_8de0b87142b0295ee76a35b61755a99e.png?size=256"
			)
			.setCurrentXP(100)
			.setRequiredXP(200)
			.setStatus("dnd")
			.setProgressBar("#FFFFFF", "COLOR")
			.setUsername("Snowflake")
			.setDiscriminator("0007");

		await rank.build();
	}),
	// add("blank svg -> png", async () => {
	// 	await sharp(
	// 		Buffer.from(
	// 			`<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 934 282" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`
	// 		)
	// 	)
	// 		.png()
	// 		.toBuffer();
	// }),
	// add("rank card svg -> png", async () => {
	// 	const t = new RankCard({ type: "center" });
	// 	await t.init();
	// 	t.setRank(1);
	// 	t.setLevel(1);
	// 	t.setMax(100);
	// 	t.setXP(50);
	// 	t.setUsername("Flam3rboy");
	// 	t.setDiscriminator("3490");
	// 	t.setColor("primary_color", "#5865F2");
	// 	// await t.setAvatar("311129357362135041", "448d0096873b63cc3eb2c21812bc60ba");

	// 	await t.toPNG();
	// }),

	save({
		file: "canvacord",
		folder: path.join(__dirname, "results"),
		version: require("../../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
