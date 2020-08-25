const fontList = require("font-list");
const { createCanvas, loadImage, Image, registerFont } = require("canvas");
const fs = require("fs");
const drawCircleImage = require("./drawCircleImage");
const drawStatusIndicator = require("./drawStatusIndicator");

registerFont(__dirname + "/../assets/whitney.ttf", { family: "Whitney Medium" });

module.exports = (type) => async (req, res) => {
	var {
		user_tag,
		user_id,
		user_avatar,
		guild_name,
		guild_avatar,
		guild_id,
		member_count,
		background,
		status,
		greet_user,
		custom_text,
		shadow,
	} = req.query;
	if (!user_tag || !user_id || !guild_name || !guild_avatar || !guild_id || !user_avatar || !background) {
		throw "query invalid";
	}

	let statusarray = ["online", "dnd", "idle", "offline", "none"];

	if (!shadow) shadow = 0;
	if (!status) status = "none";
	if (!greet_user) greet_user = false;
	else greet_user = greet_user.toLowerCase() === "true";
	if (member_count && isNaN(parseInt(member_count))) throw "member count must be a number";

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
	let back = await loadImage(file);

	const canvas = createCanvas(1000, 500);
	const ctx = canvas.getContext("2d");

	let { width, height } = canvas;
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	let avatar;

	try {
		avatar = await loadImage(`https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=128`);
	} catch {
		avatar = await loadImage(`https://cdn.discordapp.com/embed/avatars/${user_tag.split("#")[1] % 5}.png?size=128`);
	}

	ctx.drawImage(back, 0, 0, width, height);

	var x = width / 2;
	var y = height / 2;

	drawCircleImage(ctx, avatar, x, y, 150);
	drawStatusIndicator(ctx, x + 57, y + 69, status, background === "discord");

	ctx.fillStyle = "white";
	ctx.font = `50px "Whitney Medium"`;

	var welcome = type == "welcome";
	if (!welcome && type !== "leave") throw "invalid type of event";

	if (custom_text) {
		text = custom_text;
	} else if (greet_user) {
		text = welcome ? `Welcome ${user_tag}` : `Goodbye ${user_tag}`;
	} else {
		text = welcome ? `Welcome to ${guild_name}` : `${user_tag} left ${guild_name}`;
	}

	ctx.fillText(text, width / 2, 100);

	if (member_count) {
		ctx.fillText(`Member #${member_count}`, width / 2, 425);
	}

	let buffer = canvas.toBuffer();
	res.set("Content-Type", "image/png");
	res.send(buffer);
};
