const { createCanvas, loadImage, Image, registerFont } = require("canvas");

module.exports = (app) => {
	app.get("/", (req, res) => {
		var { rank, level, xp, username, tag, avatar, status, max, background, padding } = req.query;
		if (false) {
			throw "query invalid";
		}

		const canvas = createCanvas(1000, 300);
		const { width, height } = canvas;
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		console.time("gen");

		let buffer = canvas.createPNGStream();
		buffer.on("finish", () => {
			console.timeEnd("gen");
		});
		// to buffer:
		// 15ms png
		// 1ms jpg
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
