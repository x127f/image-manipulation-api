const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

module.exports = async (app) => {
	var images = {
		types: {},
	};
	var path = __dirname + "/../../assets/fortnite/types/";

	await Promise.all(
		fs.readdirSync(path).map(async (type) => {
			images.types[type.replace(".png", "")] = await loadImage(path + type);
		})
	);
	images.trenitelogo = await loadImage(path + "../trenitelogo.png");
	images.background = await loadImage(path + "../background.png");
	images.logo = await loadImage(path + "../logo.png");
	images.vbucks = await loadImage(path + "../vbucks.png");

	app.get("/", async (req, res) => {
		var { shop, background, logo } = req.query;

		if (!background) background = images.background;
		else background = await loadImage(background);

		if (!logo) logo = images.trenitelogo;
		else logo = await loadImage(logo);

		var { weekly, daily } = JSON.parse(shop);

		var colors = {
			epic: "#e95eff",
			rare: "#36d1ff",
			uncommon: "#86e239",
			common: "#7b7b7b",
			legendary: "#e88d4a",
			marvel: "#c53334",
			mythic: "#fce959",
			starwars: "#0e0e0e",
			icon: "#00000000",
		};

		var width = 1920;
		var height = 1080;

		var cols = 3;
		var rows = Math.ceil(weekly.length / cols);
		var imgWidth = 180;
		var imgHeight = imgWidth;
		var space = 1.2;
		var ySpace = 200;
		var xSpace = 100;
		var rectSpace = 10;
		var arr = weekly;
		var max = Math.max(daily.length, weekly.length);

		if (max > 12) {
			height += Math.ceil((max - 12) / 3) * ySpace;
		}

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(background, 0, 0, width, height);

		var logoWH = 250;
		var logoWidth = width / 2 - logoWH / 2;
		var logoHeight = height / 2 - logoWH / 2;

		ctx.drawImage(logo, logoWidth, logoHeight, logoWH, logoWH);

		ctx.font = '70px "Burbank Big Condensed Black"';
		ctx.fillStyle = "white";
		ctx.fillText("FEATURED", 280, 150);
		ctx.fillText("DAILY", 1450, 150);

		// item shop logo
		var fnWidth = images.logo.width / 1.5;
		var fnHeight = images.logo.height / 1.5;

		ctx.drawImage(images.logo, width / 2 - fnWidth / 2, 50, fnWidth, fnHeight);

		for (var test = 0; test < 2; test++) {
			if (test === 1) {
				xSpace = 1200;
				rows = Math.ceil(daily.length / cols);
				arr = daily;
			}
			for (var row = 0; row < rows; row++) {
				for (var col = 0; col < cols; col++) {
					var i = cols * row + col;
					if (i < arr.length) {
						var im = arr[i];
						var typ = im.rarity.toLowerCase();
						var type = images.types[typ];
						if (!type) {
							console.error("unkown fn shop type:" + typ);
							break;
						}
						var x = xSpace + col * imgWidth * space;
						var y = ySpace + row * imgHeight * space;

						ctx.drawImage(type, x, y, imgWidth, imgHeight);

						try {
							var img = await loadImage(im.image);

							ctx.drawImage(
								img,
								x + rectSpace / 2,
								y + rectSpace / 2,
								imgWidth - rectSpace,
								imgHeight - rectSpace
							);
						} catch (error) {
							if (im.image !== "unknown") {
								console.error("img not defined: ", im.image);
							}
						}

						var descHeight = imgHeight / 3;
						ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
						ctx.fillRect(x, y + imgHeight - descHeight, imgWidth, descHeight);

						ctx.strokeStyle = colors[typ];
						ctx.lineWidth = 5;
						ctx.strokeRect(x, y, imgHeight, imgWidth);
						ctx.fillStyle = "white";
						ctx.textAlign = "center";
						ctx.font = '27px "Burbank Big Condensed Black"';
						ctx.fillText(im.name, x + imgWidth / 2, y + imgHeight - imgHeight / 5);
						ctx.font = '20px "Burbank Big Condensed Black"';
						y = y + imgHeight - imgHeight / 15;
						x = x + imgWidth / 2;
						ctx.fillText(im.vbucks, x, y);
						ctx.drawImage(
							images.vbucks,
							x - imgWidth / 4,
							y - imgHeight / 12,
							imgWidth / 10,
							imgHeight / 10
						);
					}
				}
			}
		}

		return res.set("content-type", "image/png").send(canvas.toBuffer());
	});
};
