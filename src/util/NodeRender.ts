// @ts-nocheck
import { Filter, ImageOptions, Render } from "./Render";
import sharp, { JpegOptions, PngOptions } from "sharp";
import { Canvas, Image, JpegConfig, NodeCanvasRenderingContext2D, PdfConfig, PngConfig, createCanvas } from "canvas";

const gaussian_kernel = [
	[1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
	[4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
	[6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
	[4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
	[1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
];

const kernel = gaussian_kernel;
const half = 2;

// @ts-ignore
export class NodeRender extends Render {
	public ctx: NodeCanvasRenderingContext2D;

	// @ts-ignore
	constructor(public canvas?: Canvas) {
		if (!canvas) canvas = createCanvas(0, 0);
		// @ts-ignore
		super(canvas);
	}

	filter(name: Filter, value: number = 1) {
		const id = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		const data = id.data;
		const channels = 4;
		var iterations = 1;
		if (name === "blur") iterations = value;

		for (var iter = 0; iter < iterations; iter++) {
			console.log("iter", iter);
			for (var y = 0; y < this.canvas.height; y++) {
				for (var x = 0; x < this.canvas.width; x++) {
					const i = (y * this.canvas.width + x) * 4;
					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];
					const a = data[i + 3];

					switch (name) {
						case "grayscale":
							let val = 0.299 * r + 0.587 * g + 0.114 * b;
							data[i] = val;
							data[i + 1] = val;
							data[i + 2] = val;
							break;
						case "blur":
							if (x > this.canvas.width - kernel.length || y > this.canvas.height - kernel.length) break;

							const acc = [0, 0, 0, 0];
							for (let a = 0; a < kernel.length; a++) {
								for (let b = 0; b < kernel.length; b++) {
									const j = i + (b - half + (a - half) * kernel.length) * 4;
									const kA = a % kernel.length;
									const kB = b % kernel.length;

									acc[0] += data[j] * kernel[kA][kB];
									acc[1] += data[j + 1] * kernel[kA][kB];
									acc[2] += data[j + 2] * kernel[kA][kB];
									acc[3] += data[j + 3] * kernel[kA][kB];
								}
							}

							data[i] = acc[0];
							data[i + 1] = acc[1];
							data[i + 2] = acc[2];
							data[i + 3] = acc[3];

							break;
						default:
							throw new Error("filter not supported");
					}
				}
			}
		}

		this.ctx.putImageData(id, 0, 0);

		return this;
	}

	toSharp() {
		return sharp(this.toBuffer("raw"), {
			raw: { width: this.canvas.width, height: this.canvas.height, channels: 4 },
		});
	}

	toPNG(options?: PngOptions) {
		return this.toSharp().png(options).toBuffer();
	}

	toJPEG(options?: JpegOptions) {
		return this.toSharp().jpeg(options).toBuffer();
	}

	toBuffer(
		mimeType?: "image/png" | "image/jpeg" | "application/pdf" | "raw",
		config?: PngConfig | JpegConfig | PdfConfig
	) {
		if (mimeType === "raw") {
			// @ts-ignore
			const buffer = this.canvas.toBuffer("raw", config);
			// fix swap red/blue https://github.com/Automattic/node-canvas/issues/168

			for (let i = 0; i < buffer.length; i += 4) {
				const r = buffer[i];
				buffer[i] = buffer[i + 2];
				buffer[i + 2] = r;
			}

			return buffer;
		}
		// @ts-ignore
		return this.canvas.toBuffer(mimeType, config);
	}

	async toPromiseBuffer(
		mimeType?: "image/png" | "image/jpeg" | "application/pdf" | "raw",
		config?: PngConfig | JpegConfig | PdfConfig
	) {
		return this.toBuffer(mimeType, config);
	}

	// @ts-ignore
	image(
		opts:
			| ImageOptions
			| {
					image: Image;
			  }
	) {
		// @ts-ignore
		return super.image(opts);
	}

	// @ts-ignore
	background(color: string | Image) {
		// @ts-ignore
		return super.background(color);
	}
}
