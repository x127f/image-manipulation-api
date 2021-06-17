import puppeteer from "puppeteer";
import { add, complete, cycle, save, suite } from "benny";
import path from "path";

(async () => {
	const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1920,
			height: 1080,
			deviceScaleFactor: 1,
		},
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const prePage = await browser.newPage();

	const page = suite(
		"Puppeteer",

		add("blank png full latency", async () => {
			const page = await browser.newPage();
			await page.screenshot({ type: "png" });
		}),

		add("blank png reduced latency", async () => {
			await prePage.screenshot({ type: "png" });
		}),

		add("blank jpeg full quality", async () => {
			const page = await browser.newPage();
			await page.screenshot({ type: "jpeg" });
		}),
		add("blank jpeg low quality", async () => {
			const page = await browser.newPage();
			await page.screenshot({ type: "jpeg", quality: 50 });
		}),
		save({
			file: "puppeteer",
			folder: path.join(__dirname, "results"),
			version: require("../../package.json").version,
			details: true,
			format: "chart.html",
		})
	);
})();
