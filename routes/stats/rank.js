const { createCanvas, loadImage } = require("canvas");
const { text } = require("express");

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var {
			mode,
			rank,
			level,
			xp,
			status,
			primary_color,
			text_color,
			max,
			shadow,
			background,
			progress_background,
			user_id,
			user_tag,
			user_avatar,
			font,
		} = req.query;
		if (!rank || !level || !xp || !user_avatar || !user_id || !user_tag || !max) {
			throw "query invalid";
		}

		if (!mode) mode = "left";
		if (!background) background = "rankcard";
		if (!progress_background) progress_background = "#43474e";
		if (!status) status = "none";
		if (!shadow) shadow = 20;
		if (!primary_color) primary_color = "dodgerblue";
		if (!text_color) text_color = "white";
		if (!font) font = "Whitney Medium";
		xp = parseInt(xp);
		max = parseInt(max);
		if (isNaN(xp)) throw "XP must be number";
		if (isNaN(max)) throw "Max XP must be number";
		var width = 0;
		var height = 0;

		if (mode === "card") {
			width = 800;
			height = 400;
		} else if (mode === "left") {
			width = 1000;
			height = 250;
		} else {
			throw "invalid mode";
		}

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");
		var widthStep = width / 100;
		var heightStep = height / 100;

		var percent = xp / max;
		if (percent > 100) percent = 100;
		if (isNaN(percent)) percent = 0;
		var progress = lerp(0, 60, percent);

		ctx.shadowColor = "#00000051";
		ctx.shadowBlur = shadow;
		ctx.shadowOffsetX = shadow;
		ctx.shadowOffsetY = shadow;

		await ctx.drawBackground(background);
		let avatar = await ctx.loadAvatar(user_id, user_avatar, user_tag, 256);

		if (mode === "card") {
			var barX = widthStep * 10;
			var barY = heightStep * 65;
			var barHeight = heightStep * 15;
			var barWidth = widthStep * 80;

			var xpTextY = heightStep * 96;
			var xpTextX = widthStep * 2;
			var rankLevelY = heightStep * 15;
			var userTextY = heightStep * 38;
			var userTextX = width / 2 + 175 / 2;

			var avatarX = 175 / 2;
			var avatarY = avatarX;

			ctx.fillStyle = primary_color;

			ctx.font = `40px "${font}"`;
			ctx.textAlign = "center";
			ctx.fillText(user_tag, userTextX, userTextY);

			ctx.textAlign = "left";
			ctx.font = `35px "${font}"`;
			var textWidth = widthStep * 27;
			ctx.fillText("LEVEL", textWidth, rankLevelY);
			textWidth += ctx.measureText("LEVEL ").width;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`${level}`, textWidth, rankLevelY);

			ctx.textAlign = "right";
			var textWidth = widthStep * 95;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`#${rank}`, textWidth, rankLevelY);
			textWidth -= ctx.measureText(`#${rank} `).width;

			ctx.font = `35px "${font}"`;
			ctx.fillText("RANK", textWidth, rankLevelY);

			ctx.font = `30px "${font}"`;
			ctx.textAlign = "left";
			ctx.fillStyle = primary_color;
			ctx.fillText(xp, xpTextX, xpTextY); // max xp
			ctx.fillStyle = "grey";
			var maxXPtext = `/ ${max} XP`;
			ctx.fillText(maxXPtext, xpTextX + ctx.measureText(xp).width, xpTextY); // current xp
		} else if (mode === "left") {
			var barHeight = heightStep * 15;
			var barX = widthStep * 25;
			var barY = heightStep * 80;
			var barWidth = widthStep * 70;

			var xpTextY = heightStep * 63;
			var xpTextX = barX + barWidth;

			var avatarX = width / 9;
			var avatarY = height / 2;

			var textWidth = widthStep * 60;
			var textHeight = heightStep * 26;

			ctx.fillStyle = text_color;
			ctx.font = `40px "${font}"`;
			ctx.textAlign = "left";
			ctx.fillText(user_tag, barX, heightStep * 63);

			ctx.font = `35px "${font}"`;
			ctx.fillText("RANK", textWidth, textHeight);
			textWidth += ctx.measureText("RANK").width;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`#${rank}`, textWidth, textHeight);
			textWidth += ctx.measureText(`#${rank} `).width;

			ctx.fillStyle = primary_color;
			ctx.font = `35px "${font}"`;
			ctx.fillText("LEVEL", textWidth, textHeight);
			textWidth += ctx.measureText("LEVEL").width;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`#${level}`, textWidth, textHeight);

			ctx.font = `30px "${font}"`;
			ctx.textAlign = "right";
			ctx.fillStyle = "grey";
			var maxXPtext = `/ ${max} XP`;
			ctx.fillText(maxXPtext, xpTextX, xpTextY); // current xp
			ctx.fillStyle = primary_color;
			ctx.fillText(xp, xpTextX - ctx.measureText(maxXPtext).width, xpTextY); // max xp
		}

		ctx.drawCircleImage(avatar, avatarX, avatarY, 175); // avatar
		ctx.drawStatusIndicator(avatarX + 60, avatarY + 60, status, background == "discord"); // status

		bar(ctx, barX, barY, barWidth, barHeight, progress_background);
		bar(ctx, barX, barY, widthStep * progress, barHeight, primary_color);

		let buffer = canvas.toBuffer("image/png");
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
};

function bar(ctx, x, y, w, h, color) {
	ctx.lineWidth = h;
	ctx.lineCap = "round";
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + w, y);
	ctx.stroke();
}

function lerp(start, stop, amt) {
	return amt * (stop - start) + start;
}
