module.exports = (ctx, image, x, y, radius) => {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, radius / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(image, x - radius / 2, y - radius / 2, radius, radius);
	ctx.restore();
};
