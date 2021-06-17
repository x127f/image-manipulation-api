import { Canvas } from "canvas";

/**
 * @param {Canvas} canvas
 */
export function getBuffer(canvas, opts) {
	await sharp(canvas.toBuffer("raw"), { raw: { width: canvas.width, height: canvas.height, channels: 4 } })
		.jpeg({})
		.toBuffer();
}
