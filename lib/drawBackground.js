const CanvasRenderingContext2d = require("canvas/lib/context2d");
const { loadImage } = require("canvas");

CanvasRenderingContext2d.prototype.drawBackground = async function (background) {
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
		var back = await loadImage(file);
		// this.drawImage(back, 0, 0, back.width, back.height, 0, 0, this.canvas.width, this.canvas.height);
		drawImageScaled(back, this);
		return back;
	} catch (error) {
		this.fillStyle = background;
		this.rect(0, 0, this.canvas.width, this.canvas.height);
		this.fill();
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
