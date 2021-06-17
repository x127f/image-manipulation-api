const { createCanvas, loadImage } = require("canvas");
const { text } = require("express");

module.exports = (app) => {
	app.get("/", async (req, res) => {
		var {
			mode,
			rank,
			level,
			xp,
			round,
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
		if (!shadow) shadow = 30;
		if (!primary_color) primary_color = "dodgerblue";
		if (!text_color) text_color = "white";
		if (!font) font = "Montserrat Medium";
		shadow = parseInt(shadow);
		xp = parseInt(xp);
		max = parseInt(max);
		if (isNaN(shadow)) throw "shadow must be number";
		if (isNaN(xp)) throw "XP must be number";
		if (isNaN(max)) throw "Max XP must be number";

		var width = 0;
		var height = 0;
		var discriminator = user_tag.split("#")[1];
		var user_name = user_tag.split("#")[0];

		if (mode === "center") {
			width = 1000;
			height = 300;
		} else if (mode === "left" || mode === "right") {
			width = 1000;
			height = 250;
		} else {
			throw "invalid mode";
		}

		width += shadow * 2;
		height += shadow * 2;

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.shadowColor = "#00000050";
		ctx.shadowBlur = shadow;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		// dropshadow
		ctx.fillStyle = "#00000000";
		ctx.rect(shadow + 5, shadow + 5, width - shadow * 2 - 5, height - shadow * 2 - 5);
		ctx.fill();
		ctx.translate(shadow, shadow);
		width -= shadow * 2;
		height -= shadow * 2;

		var widthStep = width / 100;
		var heightStep = height / 100;

		// progress percentage
		var percent = xp / max;
		percent = Math.min(1, Math.max(0, percent)); // constrain percent number between 1 and 0
		if (isNaN(percent)) percent = 0;

		// radius around canvas
		ctx.save();
		ctx.roundRect(0, 0, width, height, 30);
		ctx.clip();

		await ctx.drawBackground(background);
		let avatar = await ctx.loadAvatar(user_id, user_avatar, user_tag, 256);

		if (mode === "center") {
			var barX = widthStep * 6;
			var barY = heightStep * 82;
			var barHeight = heightStep * 12;
			var percentageBarWidth = 86;
			var barWidth = widthStep * percentageBarWidth;

			var xpTextY = heightStep * 69;
			var xpTextX = widthStep * 95;
			var rankLevelY = heightStep * 30;

			var userTextY = xpTextY;
			var userTextX = widthStep * 5;
			var maxUserTextWidth = widthStep * 28;

			var avatarX = width / 2;
			var avatarY = heightStep * 40;
			var avatarRadius = 150;

			ctx.font = `36px "${font}"`;
			ctx.textAlign = "left";
			ctx.fillStyle = text_color;
			ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
			ctx.fillStyle = primary_color;
			ctx.fillText(
				"#" + discriminator,
				userTextX + Math.min(ctx.measureText(user_name).width, maxUserTextWidth),
				userTextY
			);

			ctx.textAlign = "left";
			ctx.font = `35px "${font}"`;
			var textWidth = widthStep * 5;
			ctx.fillStyle = text_color;
			ctx.fillText("LEVEL", textWidth, rankLevelY);
			ctx.fillStyle = primary_color;
			textWidth += ctx.measureText("LEVEL ").width;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`${level}`, textWidth, rankLevelY);

			ctx.textAlign = "right";
			var textWidth = widthStep * 95;
			ctx.font = `50px "${font}"`;
			ctx.fillStyle = primary_color;
			ctx.fillText(`#${rank}`, textWidth, rankLevelY);
			textWidth -= ctx.measureText(`#${rank} `).width;

			ctx.fillStyle = text_color;
			ctx.font = `35px "${font}"`;
			ctx.fillText("RANK", textWidth, rankLevelY);

			ctx.font = `30px "${font}"`;
			ctx.textAlign = "right";
			ctx.fillStyle = text_color;
			var maxXPtext = ` / ${max} XP`;
			ctx.fillText(maxXPtext, xpTextX, xpTextY); // current xp
			ctx.fillStyle = primary_color;
			ctx.fillText(xp, xpTextX - ctx.measureText(maxXPtext).width, xpTextY); // max xp
		} else if (mode === "left") {
			var barHeight = heightStep * 15;
			var barX = widthStep * 25;
			var barY = heightStep * 80;
			var percentageBarWidth = 70;
			var barWidth = widthStep * percentageBarWidth;

			var xpTextY = heightStep * 63;
			var xpTextX = barX + barWidth;

			var userTextY = xpTextY;
			var userTextX = barX;
			var maxUserTextWidth = widthStep * 30;

			var avatarX = width / 9;
			var avatarY = height / 2;
			var avatarRadius = 150;

			var textWidth = widthStep * 95;
			var textHeight = heightStep * 26;

			ctx.font = `36px "${font}"`;
			ctx.textAlign = "left";
			ctx.fillStyle = text_color;
			ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
			ctx.fillStyle = primary_color;
			ctx.fillText(
				"#" + discriminator,
				userTextX + Math.min(ctx.measureText(user_name).width, maxUserTextWidth),
				userTextY
			);

			ctx.textAlign = "right";

			ctx.font = `50px "${font}"`;
			ctx.fillStyle = primary_color;
			ctx.fillText(`#${level}`, textWidth, textHeight);
			textWidth -= ctx.measureText(`#${level}`).width;
			ctx.font = `35px "${font}"`;
			ctx.fillStyle = text_color;
			ctx.fillText("LEVEL", textWidth, textHeight);
			textWidth -= ctx.measureText(`  LEVEL`).width;

			ctx.fillStyle = primary_color;
			ctx.font = `50px "${font}"`;
			ctx.fillText(`#${rank}`, textWidth, textHeight);
			textWidth -= ctx.measureText(`#${rank} `).width;
			ctx.fillStyle = text_color;
			ctx.font = `35px "${font}"`;
			ctx.fillText("RANK", textWidth, textHeight);

			ctx.font = `30px "${font}"`;
			ctx.textAlign = "right";
			ctx.fillStyle = "grey";
			var maxXPtext = `/ ${max} XP`;
			ctx.fillText(maxXPtext, xpTextX, xpTextY); // current xp
			ctx.fillStyle = primary_color;
			ctx.fillText(xp, xpTextX - ctx.measureText(maxXPtext).width, xpTextY); // max xp
		} else if (mode === "right") {
			var barHeight = heightStep * 15;
			var barX = widthStep * 5;
			var barY = heightStep * 80;
			var percentageBarWidth = 70;
			var barWidth = widthStep * percentageBarWidth;

			var xpTextY = heightStep * 63;
			var xpTextX = barX + barWidth;

			var userTextY = xpTextY;
			var userTextX = barX;
			var maxUserTextWidth = widthStep * 30;

			var avatarX = (width / 9) * 8;
			var avatarY = height / 2;
			var avatarRadius = 150;

			var textWidth = widthStep * 5;
			var textHeight = heightStep * 26;

			ctx.font = `36px "${font}"`;
			ctx.textAlign = "left";
			ctx.fillStyle = text_color;
			ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
			ctx.fillStyle = primary_color;
			ctx.fillText(
				"#" + discriminator,
				userTextX + Math.min(ctx.measureText(user_name).width, maxUserTextWidth),
				userTextY
			);

			ctx.fillStyle = text_color;
			ctx.font = `30px "${font}"`;
			ctx.fillText("RANK", textWidth, textHeight);
			textWidth += ctx.measureText("RANK ").width;
			ctx.font = `50px "${font}"`;
			ctx.fillStyle = primary_color;
			ctx.fillText(`#${rank}`, textWidth, textHeight);
			textWidth += ctx.measureText(`#${rank} `).width;

			ctx.fillStyle = text_color;
			ctx.font = `30px "${font}"`;
			ctx.fillText("LEVEL", textWidth, textHeight);
			textWidth += ctx.measureText("LEVEL ").width;
			ctx.fillStyle = primary_color;
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

		ctx.drawCircleImage(avatar, avatarX, avatarY, avatarRadius); // avatar
		ctx.drawStatusIndicator(avatarX + 50, avatarY + 50, status, background); // status

		var progress = lerp(0, percentageBarWidth, percent);

		bar(ctx, barX, barY, barWidth, barHeight, progress_background);
		bar(ctx, barX, barY, widthStep * progress, barHeight, primary_color);
		ctx.restore();

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
