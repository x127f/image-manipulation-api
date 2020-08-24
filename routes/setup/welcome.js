const fontList = require("font-list");
const { createCanvas, loadImage, Image, registerFont } = require("canvas");
const fs = require("fs");

registerFont(__dirname + "/../../assets/whitney.ttf", { family: "Whitney Medium" });

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var { user_tag, user_id, user_avatar, guild_name, guild_avatar, guild_id, member_count, background, status, greet_user } = req.query;
		if (
			!user_tag ||
			!user_id ||
			!guild_name ||
			!guild_avatar ||
			!guild_id ||
			!member_count ||
			!user_avatar ||
			!background ||
			!status ||
			!greet_user
		) {
			throw "query invalid";
		}

		var back = new Image();
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
			case "minecraft":
				back.src = __dirname + "/../../assets/backgrounds/welcome/minecraft_1.png";
				break;
			case "fortnite":
				back.src = __dirname + "/../../assets/backgrounds/welcome/fortnite_1.png";
				break;
			default:
				back = await loadImage(background);
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
			case "offline":
				style = "#747f8d";
		}
		let statusarray = ["online", "dnd", "idle", "offline"];

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

		// if (status in statusarray) {
		if (status != "none") {
			if (background == "discord") {
				// draw grey background circle below status indicator
				ctx.beginPath();
				ctx.arc(557, 309, 40, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = "#2c2f33";
				ctx.fill();
			}

			//status
			ctx.beginPath();
			ctx.arc(557, 309, 25, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = style;
			ctx.fill();

			// make moon (slice edge with grey circle)
			if (status == "idle" && background == "discord") {
				ctx.beginPath();
				ctx.arc(545, 294, 21, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = "#2c2f33";
				ctx.fill();
			}

			if (status == "offline") {
				//slice middle of status indi
				ctx.beginPath();
				ctx.arc(557, 309, 12.5, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = "#2c2f33";
				ctx.fill();
			}

			if (status == "dnd") {
				// draw small brush onto circle
				ctx.beginPath();
				ctx.lineCap = "round";
				ctx.lineWidth = 12;
				ctx.moveTo(544, 309);
				ctx.lineTo(570, 309);
				// ctx.closePath();
				ctx.strokeStyle = "#2c2f33";
				ctx.stroke();
			}
		}
		// }

		ctx.fillStyle = "white";
		ctx.font = `50px "Whitney Medium"`;
		if (greet_user.toLowerCase() === "true") {
			ctx.fillText(`Welcome ${user_tag}`, width / 2, 100);
		} else {
			ctx.fillText(`Welcome to ${guild_name}`, width / 2, 100);
		}

		ctx.fillText(`Member #${member_count}`, width / 2, 400);

		let buffer = canvas.toBuffer();
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};
