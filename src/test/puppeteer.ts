import { launch } from "puppeteer";

async function main() {
	const browser = await launch({
		headless: true,
		args: ["--no-sandbox"],
	});

	const page = await browser.newPage();
	await page.goto("https://example.com");
	await page.screenshot({ path: "example.png" });
	await browser.close();
}
