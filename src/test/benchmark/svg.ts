import { add, complete, cycle, save, suite } from "benny";
import path from "path";
import sharp from "sharp";

suite(
	"SVG",

	add("wumpus svg to png", async () => {
		await sharp(
			path.join(__dirname, "..", "..", "..", "assets", "backgrounds", "discordassets", "wumpus_watching.svg")
		)
			.png()
			.toBuffer();
	}),
	add("rankcard to png", async () => {
		await sharp(path.join(__dirname, "..", "..", "..", "assets", "templates", "discord", "rankcard.svg"))
			.png()
			.toBuffer();
	}),

	save({
		file: "svg",
		folder: path.join(__dirname, "results"),
		version: require("../../../package.json").version,
		details: true,
		format: "chart.html",
	})
);
