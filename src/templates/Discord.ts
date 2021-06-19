/*
case "online":
			color = "#43b581";
			break;
		case "dnd":
			color = "#f04747";
			break;
		case "idle":
			color = "#faa61a";
			break;
		case "offline":
			color = "#747f8d";
			break;
		case "mobile":
			color = "#43b581";
			break;
		case "streaming":
			color = "#593695";
			break;
		case "none":
			*/

import Canvas, { Image } from "canvas";
import { loadAvatar, drawStatusIndicator } from "../util/Discord";
import { NodeRender } from "../util/NodeRender";

export async function rankCard(opts: {
	max: number;
	xp: number;
	scale?: number;
	type?: "left" | "center" | "right";
	rank?: string;
	level?: number;
	round?: boolean;
	status?: "online" | "dnd" | "idle" | "offline" | "mobile" | "streaming";
	primary_color?: string;
	text_color?: string;
	shadow?: number;
	background?: Image | string;
	progress_background?: string;
	user_id?: string;
	user_discriminator?: string;
	user_name?: string;
	user_avatar?: string | boolean;
	r?: NodeRender;
}) {
	opts = {
		type: "center",
		background: "#2f3136",
		progress_background: "#43474e",
		shadow: 30,
		scale: 1,
		primary_color: "dodgerblue",
		text_color: "white",
		...opts,
	};

	if (!opts.r) var r = new NodeRender();
	else var r = opts.r;

	var width = 0;
	var height = 0;

	if (opts.type === "center") {
		width = 1000;
		height = 300;
	} else if (opts.type === "left" || opts.type === "right") {
		width = 1000;
		height = 250;
	} else {
		throw "invalid mode";
	}

	r.resize(width + opts.shadow * 2, height + opts.shadow * 2).pixelDensity(opts.scale);

	if (!opts.r) r.stroke(null);

	r.width = width;
	r.height = height;

	const dropshadowOffset = 0;

	r.dropshadow({
		blur: opts.shadow,
		color: "#00000050",
		x: 0,
		y: 0,
	})
		.fill("transparent")
		.rect({
			x: opts.shadow + dropshadowOffset,
			y: opts.shadow + dropshadowOffset,
			width: width - dropshadowOffset * 2,
			height: height - dropshadowOffset * 2,
		})
		.dropshadow({ color: "transparent" });
	r.ctx.translate(opts.shadow, opts.shadow);

	// progress percentage
	var percent = opts.xp / opts.max;
	percent = Math.min(1, Math.max(0, percent)); // constrain percent number between 1 and 0
	if (isNaN(percent)) percent = 0;

	// radius around canvas
	r.ctx.save();
	r.rect({ x: 0, y: 0, width, height, radius: 30 });
	r.ctx.clip();

	r.background(opts.background || "blue");
	if (opts.user_avatar !== false) {
		// @ts-ignore
		var avatar = await loadAvatar(opts.user_id, opts.user_avatar, opts.user_discriminator, 256);
	}

	var avatarX = r.centerX;
	var avatarY = r.percentage(40, r.height);
	var avatarSize = 150;

	const paddingPercentage = 6;

	const barPaddingPercentage = paddingPercentage + 1;
	var barX = r.percentage(barPaddingPercentage, r.width);
	var barY = r.percentage(85, r.height);
	var barHeight = r.percentage(12, r.height);
	const maxBarWidth = 100 - barPaddingPercentage * 2;
	var barWidth = r.percentage(maxBarWidth, r.width);
	var barProgressWidth = r.percentage(r.percentage(opts.xp, opts.max), maxBarWidth);

	if (opts.type === "center") {
		const xpTextY = r.percentage(69, r.height);
		const xpTextX = r.percentage(100 - paddingPercentage, r.width);
		const rankLevelY = r.percentage(25, r.height);
		const rankX = r.percentage(100 - paddingPercentage, r.width);
		const levelX = r.percentage(5, r.width);

		const userTextY = xpTextY;
		const userTextX = r.percentage(5, r.width);
		const maxUserTextWidth = r.percentage(28, r.width);

		const userNameWidth =
			r.fill(opts.text_color).textSize(36).text({
				text: opts.user_name,
				x: userTextX,
				y: userTextY,
				maxWidth: maxUserTextWidth,
				measure: true,
			}).width + userTextX;

		r.fill(opts.primary_color).text({
			text: `#${opts.user_discriminator}`,
			x: userNameWidth,
			y: userTextY,
		});

		const levelWidth =
			r.fill(opts.text_color).text({
				text: "LEVEL ",
				x: levelX,
				y: rankLevelY,
				measure: true,
			}).width + levelX;

		r.text({ color: opts.primary_color, size: 50, text: `${opts.level}`, x: levelWidth, y: rankLevelY });

		const rankWidth =
			rankX -
			r.text({
				align: "right",
				text: `${opts.rank}`,
				size: 50,
				x: rankX,
				y: rankLevelY,
				color: opts.primary_color,
				measure: true,
			}).width;

		r.text({
			size: 35,
			text: "RANK ",
			x: rankWidth,
			y: rankLevelY,
			measure: true,
			color: opts.text_color,
		}).width;

		const maxXpWidth =
			xpTextX -
			r.text({
				align: "right",
				text: ` / ${opts.max} XP`,
				x: xpTextX,
				y: xpTextY,
				measure: true,
				color: opts.text_color,
			}).width;

		r.text({ text: `${opts.xp}`, size: 30, color: opts.primary_color, x: maxXpWidth, y: xpTextY });
	} else if (opts.type === "left") {
		// var barHeight = heightStep * 15;
		// var barX = widthStep * 25;
		// var barY = heightStep * 80;
		// var percentageBarWidth = 70;
		// var barWidth = widthStep * percentageBarWidth;
		// var xpTextY = heightStep * 63;
		// var xpTextX = barX + barWidth;
		// var userTextY = xpTextY;
		// var userTextX = barX;
		// var maxUserTextWidth = widthStep * 30;
		// var avatarX = width / 9;
		// var avatarY = height / 2;
		// var avatarRadius = 150;
		// var textWidth = widthStep * 95;
		// var textHeight = heightStep * 26;
		// r.ctx.font = `36px "${font}"`;
		// r.ctx.textAlign = "left";
		// r.ctx.fillStyle = text_color;
		// r.ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(
		// 	"#" + discriminator,
		// 	userTextX + Math.min(r.ctx.measureText(user_name).width, maxUserTextWidth),
		// 	userTextY
		// );
		// r.ctx.textAlign = "right";
		// r.ctx.font = `50px "${font}"`;
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(`#${level}`, textWidth, textHeight);
		// textWidth -= r.ctx.measureText(`#${level}`).width;
		// r.ctx.font = `35px "${font}"`;
		// r.ctx.fillStyle = text_color;
		// r.ctx.fillText("LEVEL", textWidth, textHeight);
		// textWidth -= r.ctx.measureText(`  LEVEL`).width;
		// r.ctx.fillStyle = primary_color;
		// r.ctx.font = `50px "${font}"`;
		// r.ctx.fillText(`#${rank}`, textWidth, textHeight);
		// textWidth -= r.ctx.measureText(`#${rank} `).width;
		// r.ctx.fillStyle = text_color;
		// r.ctx.font = `35px "${font}"`;
		// r.ctx.fillText("RANK", textWidth, textHeight);
		// r.ctx.font = `30px "${font}"`;
		// r.ctx.textAlign = "right";
		// r.ctx.fillStyle = "grey";
		// var maxXPtext = `/ ${max} XP`;
		// r.ctx.fillText(maxXPtext, xpTextX, xpTextY); // current xp
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(xp, xpTextX - r.ctx.measureText(maxXPtext).width, xpTextY); // max xp
	} else if (opts.type === "right") {
		// var barHeight = heightStep * 15;
		// var barX = widthStep * 5;
		// var barY = heightStep * 80;
		// var percentageBarWidth = 70;
		// var barWidth = widthStep * percentageBarWidth;
		// var xpTextY = heightStep * 63;
		// var xpTextX = barX + barWidth;
		// var userTextY = xpTextY;
		// var userTextX = barX;
		// var maxUserTextWidth = widthStep * 30;
		// var avatarX = (width / 9) * 8;
		// var avatarY = height / 2;
		// var avatarRadius = 150;
		// var textWidth = widthStep * 5;
		// var textHeight = heightStep * 26;
		// r.ctx.font = `36px "${font}"`;
		// r.ctx.textAlign = "left";
		// r.ctx.fillStyle = text_color;
		// r.ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(
		// 	"#" + discriminator,
		// 	userTextX + Math.min(r.ctx.measureText(user_name).width, maxUserTextWidth),
		// 	userTextY
		// );
		// r.ctx.fillStyle = text_color;
		// r.ctx.font = `30px "${font}"`;
		// r.ctx.fillText("RANK", textWidth, textHeight);
		// textWidth += r.ctx.measureText("RANK ").width;
		// r.ctx.font = `50px "${font}"`;
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(`#${rank}`, textWidth, textHeight);
		// textWidth += r.ctx.measureText(`#${rank} `).width;
		// r.ctx.fillStyle = text_color;
		// r.ctx.font = `30px "${font}"`;
		// r.ctx.fillText("LEVEL", textWidth, textHeight);
		// textWidth += r.ctx.measureText("LEVEL ").width;
		// r.ctx.fillStyle = primary_color;
		// r.ctx.font = `50px "${font}"`;
		// r.ctx.fillText(`#${level}`, textWidth, textHeight);
		// r.ctx.font = `30px "${font}"`;
		// r.ctx.textAlign = "right";
		// r.ctx.fillStyle = "grey";
		// var maxXPtext = `/ ${max} XP`;
		// r.ctx.fillText(maxXPtext, xpTextX, xpTextY); // current xp
		// r.ctx.fillStyle = primary_color;
		// r.ctx.fillText(xp, xpTextX - r.ctx.measureText(maxXPtext).width, xpTextY); // max xp
	}

	r.renderMode("center").stroke(null).fill(null);
	if (opts.user_avatar !== false) {
		r.image({ image: avatar, x: avatarX, y: avatarY, circle: true, width: avatarSize });
	}

	drawStatusIndicator({
		r: r as any,
		x: avatarX + 50,
		y: avatarY + 50,
		status: opts.status,
		background: opts.background,
	});

	// var progress = lerp(0, percentageBarWidth, percent);

	r.stroke("round")
		.stroke(12)
		.stroke(opts.progress_background)
		.line({ x: barX, y: barY, width: barWidth, height: barHeight });
	r.stroke(opts.primary_color).line({ x: barX, y: barY, width: barProgressWidth, height: barHeight });

	// bar(r.ctx, barX, barY, barWidth, barHeight, progress_background);
	// bar(r.ctx, barX, barY, widthStep * progress, barHeight, primary_color);

	return r;
}
