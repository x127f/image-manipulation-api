const { createCanvas, registerFont, loadImage } = require("canvas");

registerFont(__dirname + "/../../assets/lypix-font.ttf", {
	family: "lypix-font",
});

registerFont(__dirname + "/../../assets/BurbankBigCondensedBlack.ttf", {
	family: "Burbank Big Condensed Black",
	weight: "900",
	style: "normal",
});

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { text, background, font, size, x, y, color, shadow } = req.query;
		if (!text) throw "missing query parameter";

		if (!font) font = "Arial";
		if (!shadow) shadow = 0;
		if (!color) color = "black";
		if (background) {
			background = await loadImage(background);

			if (!size) size = font === "lypix-font" ? background.width / (text.length / 1.3) : background.width / (text.length / 1.5);
			if (!x) x = background.width / 2;
			if (!y) y = background.height / 2 - size / 1.5;
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

		if (background) {
			height = background.height;
			width = background.width;
		} else {
			height = size + size / 3;

			var test = createCanvas(0, 0).getContext("2d");
			test.font = `${size}px ${font}`;
			width = test.measureText(text).width + size;
		}

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.textAlign = background ? "center" : "left";
		ctx.fillStyle = color;
		ctx.font = `${size}px ${font}`;

		ctx.shadowColor = "black";
		ctx.shadowBlur = shadow;
		ctx.shadowOffsetX = shadow;
		ctx.shadowOffsetY = shadow;

		if (background) {
			ctx.drawImage(background, 0, 0);
		} else {
			x += size / 2;
		}
		ctx.fillText(text, x, y + size);

		let buffer = canvas.toBuffer("image/png");
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
