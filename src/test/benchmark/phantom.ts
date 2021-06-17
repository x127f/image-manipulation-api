// @ts-ignore
import phantom from "phantom";
import { add, complete, cycle, save, suite } from "benny";
import path from "path";

(async function () {
	const instance = await phantom.create();
	const page = await instance.createPage();

	await page.open("https://blank.org/");

	suite(
		"Phantom",
		add("render blank page PNG", async () => {
			await page.renderBuffer({ format: "png" });
		}),
		add("render blank page JPEG", async () => {
			await page.renderBuffer({ format: "jpeg" });
		}),
		save({
			file: "phantom",
			folder: path.join(__dirname, "results"),
			version: require("../../package.json").version,
			details: true,
			format: "chart.html",
		})
	);

	await instance.exit();
})();
