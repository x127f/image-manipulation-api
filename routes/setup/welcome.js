const fontList = require("font-list");
const { createCanvas, loadImage, Image } = require("canvas");
const fs = require("fs");

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { user_tag, user_id, user_avatar, guild_name, guild_avatar, guild_id, member_count, background } = req.query;
		if (!user_tag || !user_id || !guild_name || !guild_avatar || !guild_id || !member_count || !user_avatar || !background) throw "query invalid";

		const back = new Image();
		switch (background) {
			case "default":
				back.src = __dirname + "/../../assets/backgrounds/background.png";
				break;
			case "default_small":
				back.src = __dirname + "/../../assets/backgrounds/backgroundSmall.png";
				break;
		}

		const canvas = createCanvas(1000, 500);
		const ctx = canvas.getContext("2d");

		var { width, height } = canvas;
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		let avatar;
		try {
			avatar = await loadImage(`https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=128`);
		} catch {
			avatar = await loadImage(`https://cdn.discordapp.com/embed/avatars/${user_tag.split("#")[1] % 5}.png?size=128`);
		}

		var fonts = await fontList.getFonts();
		ctx.drawImage(back, 0, 0, width, height);

		var avatarWidth = 150;
		var x = width / 2 - avatarWidth / 2;
		var y = height / 2 - avatarWidth / 2;
		ctx.save();
		ctx.beginPath();
		ctx.arc(x + avatarWidth / 2, y + avatarWidth / 2, avatarWidth / 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, x, y, avatarWidth, avatarWidth);
		ctx.restore();

		ctx.font = `50px "Arial", ${fonts.join(", ")}`;
		ctx.fillText(`Welcome to ${guild_name}`, width / 2, 100);
		ctx.fillText(`Member #${member_count}`, width / 2, 400);

		let buffer = canvas.toBuffer();
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
