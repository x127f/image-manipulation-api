const drawCircleImage = require("./drawCircleImage");
const { loadImage } = require("canvas");
var mobile;
var streaming;
loadImage(__dirname + "/../assets/mobile.png").then((img) => (mobile = img));
loadImage(__dirname + "/../assets/streaming.png").then((img) => (streaming = img));
const CanvasRenderingContext2d = require("canvas/lib/context2d");

CanvasRenderingContext2d.prototype.drawStatusIndicator = (x, y, status, native) => {
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

	var background = "#36393f";
	this.fillStyle = background;

	if (native && status === "mobile") {
		let w = 51;
		let h = 66;
		this.roundRect(x - w / 2, y - h / 2, w, h, 15);
		this.fill();
	} else if (native) {
		// draw grey background circle below status indicator
		this.beginPath();
		this.arc(x, y, 40, 0, Math.PI * 2, true);
		this.closePath();
		this.fill();
	}

	if (status === "mobile") {
		let w = 31;
		let h = 46;
		this.drawImage(mobile, 0, 0, mobile.width, mobile.height, x - w / 2, y - h / 2, w, h);
	} else if (status === "streaming") {
		let w = 46;
		let h = 46;
		this.drawImage(streaming, 0, 0, streaming.width, streaming.height, x - w / 2, y - h / 2, w, h);
	} else {
		//color status circle (green, red, yellow, black)
		this.beginPath();
		this.arc(x, y, 25, 0, Math.PI * 2, true);
		this.closePath();
		this.fillStyle = color;
		this.fill();
	}

	// make moon (slice edge with grey circle)
	if (status == "idle" && native) {
		this.beginPath();
		this.arc(x - 12, y - 15, 21, 0, Math.PI * 2, true);
		this.closePath();
		this.fillStyle = background;
		this.fill();
	}

	if (status == "offline") {
		//slice middle of status indicator
		this.beginPath();
		this.arc(x, y, 12.5, 0, Math.PI * 2, true);
		this.closePath();
		this.fillStyle = background;
		this.fill();
	}

	if (status == "dnd") {
		// draw small brush onto circle
		this.beginPath();
		this.lineCap = "round";
		this.lineWidth = 12;
		this.moveTo(x - 13, y);
		this.lineTo(x + 13, y);
		this.strokeStyle = background;
		this.stroke();
	}
};
