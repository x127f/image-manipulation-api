const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const sharp = require("sharp");
const config = {
	width: 1000,
	height: 300,
	shadow: 30,
	widthShadow: 1060,
	heightShadow: 360,
};

class ReactCache {
	cache: any;

	constructor() {
		this.cache = {};
	}

	async get(background) {
		if (!this.cache[background]) {
			await this.create(background);
		}
		return this.cache[background];
	}

	async create(background) {
		const canvas = createCanvas(config.widthShadow, config.heightShadow);
		const ctx = canvas.getContext("2d");
		ctx.shadowColor = "#00000050";
		ctx.shadowBlur = config.shadow;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		// dropshadow
		ctx.fillStyle = "#00000000";
		ctx.rect(config.shadow + 5, config.shadow + 5, config.width - 5, config.height - 5);
		ctx.fill();
		ctx.translate(config.shadow, config.shadow);

		// radius around canvas
		ctx.save();
		roundRect(ctx, 0, 0, config.width, config.height, 30);
		ctx.fillStyle = background;
		ctx.rect(0, 0, config.width, config.height);
		ctx.fill();
		const buffer = await sharp(canvas.toBuffer("raw"), {
			raw: {
				width: canvas.width,
				height: canvas.height,
				channels: 4,
			},
		})
			.png()
			.toBuffer();
		this.cache[background] = await loadImage(buffer);
	}
}

const cache = new ReactCache();

const default_values = {
	background: "black",
	progress_background: "#43474e",
	status: "no-status",
	primary_color: "dodgerblue",
	text_color: "white",
	font: "Montserrat Medium",
	level: 1,
	rank: 1,
	xp: 50,
	max: 100,
	user_discriminator: "",
	user_name: "",
	load_avatar: false,
	user_id: "",
	user_avatar: "",
};

export async function RankCard(query: typeof default_values) {
	console.time("generate rank card");
	const {
		background,
		progress_background,
		status,
		primary_color,
		text_color,
		font,
		level,
		rank,
		xp,
		max,
		user_discriminator,
		user_name,
		load_avatar,
		user_id,
		user_avatar,
	} = { ...default_values, ...query };

	var widthStep = config.width / 100;
	var heightStep = config.height / 100;

	const canvas = createCanvas(config.widthShadow, config.heightShadow);
	const ctx = canvas.getContext("2d");
	const backgroundImage = await cache.get(background);
	ctx.drawImage(backgroundImage, 0, 0);
	ctx.translate(config.shadow, config.shadow);
	if (load_avatar) var avatar = await loadAvatar(user_id, user_avatar, user_discriminator, 256);

	// progress percentage
	let percent = xp / max;
	percent = Math.min(1, Math.max(0, percent)); // constrain percent number between 1 and 0
	if (isNaN(percent)) percent = 0;

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

	var avatarX = widthStep * 50;
	var avatarY = heightStep * 40;
	var avatarRadius = 150;

	ctx.font = `36px "${font}"`;
	ctx.textAlign = "left";
	ctx.fillStyle = text_color;
	ctx.fillText(user_name, userTextX, userTextY, maxUserTextWidth);
	ctx.fillStyle = primary_color;
	ctx.fillText(
		"#" + user_discriminator,
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

	if (avatar) drawCircleImage(ctx, avatar, avatarX, avatarY, avatarRadius); // avatar
	drawStatusIndicator(ctx, avatarX + 50, avatarY + 50, status, background); // status

	var progress = lerp(0, percentageBarWidth, percent);

	bar(ctx, barX, barY, barWidth, barHeight, progress_background);
	bar(ctx, barX, barY, widthStep * progress, barHeight, primary_color);
	ctx.restore();

	let buffer = canvas.toBuffer("raw");
	for (let i = 0; i < buffer.length; i += 4) {
		const r = buffer[i];
		buffer[i] = buffer[i + 2];
		buffer[i + 2] = r;
	}
	buffer = await sharp(buffer, { raw: { width: canvas.width, height: canvas.height, channels: 4 } })
		.png()
		.toBuffer();
	console.timeEnd("generate rank card");

	return buffer;
}

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

function drawCircleImage(ctx, image, x, y, radius) {
	// TODO drop shadow
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, radius / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(image, x - radius / 2, y - radius / 2, radius, radius);
	ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
	return ctx;
}

async function loadAvatar(user_id, user_avatar, user_discriminator, size) {
	if (!size) size = 128;
	const url = `https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=${size}`;
	try {
		return loadImage();
	} catch {
		return loadImage(`https://cdn.discordapp.com/embed/avatars/${Number(user_discriminator) % 5}.png?size=${size}`);
	}
}

var mobile;
var streaming;
loadImage(__dirname + "/../../assets/indicator/mobile.png").then((img) => (mobile = img));
loadImage(__dirname + "/../../assets/indicator/streaming.png").then((img) => (streaming = img));

function drawStatusIndicator(ctx, x, y, status, native) {
	native = ["discord", "discord_basic"].includes(native);

	let color;
	switch (status) {
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
		case "no-status":
			return;
		default:
			throw "invalid status, possible status: online, dnd, idle, offline, mobile, streaming, no-status";
	}

	const shadow = ctx.shadowColor;
	ctx.shadowColor = "#00000000";

	const background = "#2f3136";
	ctx.fillStyle = background;

	if (native && status === "mobile") {
		let w = 51;
		let h = 66;
		ctx.roundRect(x - w / 2, y - h / 2, w, h, 15);
		ctx.fill();
	} else if (native) {
		// draw grey background circle below status indicator
		ctx.beginPath();
		ctx.arc(x, y, 40, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

	if (status === "mobile") {
		let w = 31;
		let h = 46;
		ctx.drawImage(mobile, 0, 0, mobile.width, mobile.height, x - w / 2, y - h / 2, w, h);
	} else if (status === "streaming") {
		let w = 46;
		let h = 46;
		ctx.drawImage(streaming, 0, 0, streaming.width, streaming.height, x - w / 2, y - h / 2, w, h);
	} else {
		//color status circle (green, red, yellow, black)
		ctx.beginPath();
		ctx.arc(x, y, 25, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
	}

	// make moon (slice edge with grey circle)
	if (status == "idle" && native) {
		ctx.beginPath();
		ctx.arc(x - 12, y - 15, 21, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = background;
		ctx.fill();
	}

	if (status == "offline") {
		//slice middle of status indicator
		ctx.beginPath();
		ctx.arc(x, y, 12.5, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = background;
		ctx.fill();
	}

	if (status == "dnd") {
		// draw small brush onto circle
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineWidth = 12;
		ctx.moveTo(x - 13, y);
		ctx.lineTo(x + 13, y);
		ctx.strokeStyle = background;
		ctx.stroke();
	}
	ctx.shadowColor = shadow;
}
