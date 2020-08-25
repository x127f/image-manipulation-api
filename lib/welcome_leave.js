const fontList = require("font-list");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

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
		font,
	} = req.query;
	if (!user_tag || !user_id || !guild_name || !guild_avatar || !guild_id || !user_avatar || !background) {
		throw "query invalid";
	}

	if (!background) background = "default";
	if (!font) font = "Whitney Medium";
	if (!shadow) shadow = 0;
	if (!status) status = "none";
	if (!greet_user) greet_user = true;
	else greet_user = greet_user.toLowerCase() === "true";
	if (member_count && isNaN(parseInt(member_count))) throw "member count must be a number";

	const canvas = createCanvas(1000, 500);
	const ctx = canvas.getContext("2d");
	let { width, height } = canvas;
	ctx.textAlign = "center";
	ctx.fillStyle = "white";

	await ctx.drawBackground(background);

	ctx.shadowColor = "black";
	ctx.shadowBlur = shadow;
	ctx.shadowOffsetX = shadow;
	ctx.shadowOffsetY = shadow;

	let avatar = await ctx.loadAvatar(user_id, user_avatar, user_tag);
	var x = width / 2;
	var y = height / 2;

	ctx.drawCircleImage(avatar, x, y, 150);
	ctx.drawStatusIndicator(x + 57, y + 69, status, background === "discord");

	ctx.fillStyle = "white";
	ctx.font = `50px "${font}"`;

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

	let buffer = canvas.toBuffer("image/png");
	res.set("Content-Type", "image/png");
	res.send(buffer);
};
