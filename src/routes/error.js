const { createCanvas, loadImage, Image } = require("canvas");
const e = require("express");
const fs = require("fs").promises;
var background;
(async () => {
	background = await loadImage(__dirname + "/../assets/404.png");
})();

module.exports = async (err, req, res, next) => {
	if (err) {
		console.error(err);
		res.set("Content-Type", "image/png");
		var file = err
			.toString()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.replace(/\s/g, "_");

		var path = `${__dirname}/../cache/errors/${file}.png`;

		try {
			var file = await fs.readFile(path);
			res.send(file);
		} catch (error) {
			const canvas = createCanvas(404, 404);
			var { width, height } = canvas;
			const ctx = canvas.getContext("2d");

			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

			var height = 30;
			ctx.fillStyle = "#b9bbbe";
			ctx.font = `${height}px Arial`;
			ctx.textAlign = "left";
			var lines = fragmentText(ctx, err.toString(), 200);
			lines.forEach((line, index) => {
				ctx.fillText(line, 30, 50 + index * height);
			});

			let buffer = canvas.toBuffer();
			fs.writeFile(path, buffer, { encoding: "binary" });
			res.send(buffer);
		}
	}
};

function fragmentText(ctx, text, maxWidth) {
	var words = text.split(" "),
		lines = [],
		line = "";
	if (ctx.measureText(text).width < maxWidth) {
		return [text];
	}
	while (words.length > 0) {
		var split = false;
		while (ctx.measureText(words[0]).width >= maxWidth) {
			var tmp = words[0];
			words[0] = tmp.slice(0, -1);
			if (!split) {
				split = true;
				words.splice(1, 0, tmp.slice(-1));
			} else {
				words[1] = tmp.slice(-1) + words[1];
			}
		}
		if (ctx.measureText(line + words[0]).width < maxWidth) {
			line += words.shift() + " ";
		} else {
			lines.push(line);
			line = "";
		}
		if (words.length === 0) {
			lines.push(line);
		}
	}
	return lines;
}
