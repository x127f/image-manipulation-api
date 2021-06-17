const { createCanvas, loadImage } = require("canvas");

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { user_tag } = req.query;
		if (!user_tag) {
			throw "query invalid";
		}

		const canvas = createCanvas(1000, 300);
		const { width, height } = canvas;
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);

		let buffer = canvas.toBuffer("image/jpeg");
		res.set("Content-Type", "image/jpeg");
		res.send(buffer);
	});
};
