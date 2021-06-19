import Canvas from "canvas";
import { Render } from "./Render";
const { loadImage } = require("canvas");
var mobile;
var streaming;
loadImage(__dirname + "/../../assets/indicator/mobile.png").then((img) => (mobile = img));
loadImage(__dirname + "/../../assets/indicator/streaming.png").then((img) => (streaming = img));

export async function loadAvatar(user_id: string, user_avatar: string, user_discriminator: string, size) {
	if (!size) size = 128;
	try {
		if (!user_avatar || !user_id) throw "";
		return Canvas.loadImage(`https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.png?size=${size}`);
	} catch {
		return Canvas.loadImage(
			`https://cdn.discordapp.com/embed/avatars/${Number(user_discriminator) % 5}.png?size=${size}`
		);
	}
}

export function drawStatusIndicator({
	r,
	status,
	background,
	y,
	x,
}: {
	r: Render;
	x: number;
	y: number;
	status: string;
	background?: any;
}) {
	const native = typeof background == "string";

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
		case "none":
			return;
		default:
			throw "invalid status, possible status: online, dnd, idle, offline, mobile, streaming, none";
	}

	var shadow = r.ctx.shadowColor;
	r.ctx.shadowColor = "#00000000";

	r.fill(background);

	if (native && status === "mobile") {
		let w = 51;
		let h = 66;
		r.rect({ x: x - w / 2, y: y - h / 2, width: w, height: h, radius: 15 });
	} else if (native) {
		// draw grey background circle below status indicator
		r.circle({ x, y, radius: 19 });
	}

	if (status === "mobile") {
		let w = 31;
		let h = 46;
		r.ctx.drawImage(mobile, 0, 0, mobile.width, mobile.height, x - w / 2, y - h / 2, w, h);
	} else if (status === "streaming") {
		let w = 46;
		let h = 46;
		r.ctx.drawImage(streaming, 0, 0, streaming.width, streaming.height, x - w / 2, y - h / 2, w, h);
	} else {
		//color status circle (green, red, yellow, black)
		r.fill(color).circle({ x, y, radius: 12 });
	}

	// make moon (slice edge with grey circle)
	if (status == "idle" && native) {
		r.fill(background).arc({ x: x - 12, y: y - 12, radius: 21 });
	}

	if (status == "offline") {
		//slice middle of status indicator
		r.fill(background).arc({ x, y, radius: 12.5 });
	}

	if (status == "dnd") {
		// draw small brush onto circle
		r.stroke("round").stroke(12);
		r.ctx.moveTo(x - 13, y);
		r.ctx.lineTo(x + 13, y);
		r.ctx.strokeStyle = background;
		r.ctx.stroke();
	}
	r.ctx.closePath();
	r.ctx.shadowColor = shadow;
}
