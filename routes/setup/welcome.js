const fontList = require("font-list");
const { createCanvas, loadImage, Image, registerFont } = require("canvas");
const fs = require("fs");
const { createContext } = require("vm");

registerFont(__dirname + "/../../assets/whitney.ttf", { family: "Whitney Medium" });

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { user_tag, user_id, user_avatar, guild_name, guild_avatar, guild_id, member_count, background, status } = req.query;
		if (!user_tag || !user_id || !guild_name || !guild_avatar || !guild_id || !member_count || !user_avatar || !background) throw "query invalid";

		const back = new Image();
		switch (background) {
			case "default":
				back.src = __dirname + "/../../assets/backgrounds/welcome/background.png";
				break;
			case "default_small":
				back.src = __dirname + "/../../assets/backgrounds/welcome/backgroundSmall.png";
				break;
			case "discord":
				back.src = __dirname + "/../../assets/backgrounds/welcome/discordSmall.png";
				break;
		}
		let style;
		switch (status) {
			case "online":
				style = "#43b581";
				break;
			case "dnd":
				style = "#f04747";
				break;
			case "idle":
				style = "#faa61a";
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

		// var fonts = await fontList.getFonts();
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

		ctx.beginPath();
		ctx.arc(557, 309, 40, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = "#2c2f33";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(557, 309, 25, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = style;
		ctx.fill();

		ctx.fillStyle = "white";
		ctx.font = `50px "Whitney Medium"`;
		ctx.fillText(`Welcome to ${guild_name}`, width / 2, 100);
		ctx.fillText(`Member #${member_count}`, width / 2, 400);

		let buffer = canvas.toBuffer();
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
