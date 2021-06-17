const Canvas = require("canvas");

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { text, background, font, size, x, y, color, shadow } = req.query;
		if (!text) throw "missing query parameter";

		if (!font) font = "Arial";
		if (!shadow) shadow = 0;
		if (!color) color = "black";

		try {
			var back = await Canvas.getBackground(background);
		} catch (error) {}

		if (background && back) {
			var height = back.height;
			var width = back.width;
			if (!size) {
				size = font === "lypix-font" ? width / (text.length / 1.3) : width / (text.length / 1.5);
			}
			if (!x) x = width / 2;
			if (!y) y = height / 2 - size / 1.5;
		} else {
			if (!x) x = 0;
			if (!y) y = 0;
			if (!size) size = 300;
		}

		size = parseInt(size);
		if (isNaN(size)) throw "size is not a number";

		x = parseInt(x);
		if (isNaN(x)) throw "x is not a number";

		y = parseInt(y);
		if (isNaN(y)) throw "y is not a number";

		if (!back) {
			var test = Canvas.createCanvas(0, 0).getContext("2d");
			var height = size + size / 3;

			test.font = `${size}px ${font}`;
			var width = test.measureText(text).width + size;
		}

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.textAlign = back ? "center" : "left";
		ctx.font = `${size}px ${font}`;
		ctx.fillStyle = color;

		ctx.shadowColor = "black";
		ctx.shadowBlur = shadow;
		ctx.shadowOffsetX = shadow;
		ctx.shadowOffsetY = shadow;

		if (back) {
			await ctx.drawBackground(back);
		} else {
			if (background) await ctx.drawBackground(background);
			x += size / 2;
		}
		ctx.fillText(text, x, y + size);

		let buffer = canvas.toBuffer("image/png");
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
