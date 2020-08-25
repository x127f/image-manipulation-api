const CanvasRenderingContext2d = require("canvas/lib/context2d");
const { loadImage } = require("canvas");

CanvasRenderingContext2d.prototype.loadBackground = async function (background) {
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
		default:
			file = background;
	}
	return await loadImage(file);
};
