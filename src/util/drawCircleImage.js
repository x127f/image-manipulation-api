const CanvasRenderingContext2d = require("canvas/lib/context2d");

CanvasRenderingContext2d.prototype.drawCircleImage = function (image, x, y, radius) {
	// TODO drop shadow
	this.save();
	this.beginPath();
	this.arc(x, y, radius / 2, 0, Math.PI * 2, true);
	this.closePath();
	this.clip();
	this.drawImage(image, x - radius / 2, y - radius / 2, radius, radius);
	this.restore();
};
