module.exports = (ctx, x, y, status, native) => {
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
		case "none":
			return;
		default:
			throw "invalid status, possible status: online, dnd, idle, offline, none";
	}

	var background = "#36393f";

	if (native) {
		// draw grey background circle below status indicator
		ctx.beginPath();
		ctx.arc(x, y, 40, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = background;
		ctx.fill();
	}

	//status
	ctx.beginPath();
	ctx.arc(x, y, 25, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();

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
};
