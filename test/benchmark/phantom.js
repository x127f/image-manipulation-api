const phantom = require("phantom");
const { add, complete, cycle, save, suite } = require("benny");

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
