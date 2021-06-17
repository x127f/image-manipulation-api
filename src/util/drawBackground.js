const CanvasRenderingContext2d = require("canvas/lib/context2d");
const Canvas = require("canvas");

Canvas.getBackground = async function (background) {
	let file;
	switch (background) {
		case "default":
			file = __dirname + "/../assets/backgrounds/welcome/background.png";
			break;
		case "default_small":
			file = __dirname + "/../assets/backgrounds/welcome/backgroundSmall.png";
			break;
		case "discord":
			file = __dirname + "/../assets/backgrounds/welcome/discordSmall.png";
			break;
		case "rankcard":
			file = __dirname + "/../assets/backgrounds/rankcard_v1_transparent.png";
			break;
		case "discord_basic":
			file = __dirname + "/../assets/backgrounds/discord_basic.png";
			break;
		case "minecraft":
			file = __dirname + "/../assets/backgrounds/welcome/minecraft_1.png";
			break;
		case "fortnite":
			file = __dirname + "/../assets/backgrounds/welcome/fortnite_1.png";
			break;
		case "transparent":
			return;
		default:
			file = background;
	}

	try {
		return await Canvas.loadImage(file);
	} catch (error) {
		return false;
	}
};

CanvasRenderingContext2d.prototype.drawBackground = async function (background) {
	if (background instanceof Canvas.Image) {
		var back = background;
	} else {
		var back = await Canvas.getBackground(background);
	}

	if (back) {
		drawImageScaled(back, this);
	} else {
		var old = this.fillStyle;
		this.fillStyle = background;
		this.rect(0, 0, this.canvas.width, this.canvas.height);
		this.fill();
		this.fillStyle = old;
		return { width: this.canvas.width, height: this.canvas.height };
	}
};

function drawImageScaled(img, ctx) {
	var canvas = ctx.canvas;
	var hRatio = canvas.width / img.width;
	var vRatio = canvas.height / img.height;
	var ratio = Math.max(hRatio, vRatio);
	var centerShift_x = (canvas.width - img.width * ratio) / 2;
	var centerShift_y = (canvas.height - img.height * ratio) / 2;
	ctx.drawImage(
		img,
		0,
		0,
		img.width,
		img.height,
		centerShift_x,
		centerShift_y,
		img.width * ratio,
		img.height * ratio
	);
}
