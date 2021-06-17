import { Canvas, Image, JpegConfig, NodeCanvasRenderingContext2D, PdfConfig, PngConfig } from "canvas";
import sharp, { JpegOptions, PngOptions } from "sharp";
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type RenderMode = "corner" | "corners" | "center" | "radius";
export type Radius = number | { topLeft?: number; topRight?: number; bottomLeft?: number; bottomRight?: number };

export class Render {
	public ctx: NodeCanvasRenderingContext2D;
	public width: number;
	public height: number;
	public mode: RenderMode;

	constructor(public canvas: Canvas) {
		this.ctx = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
	}

	render(callback: (frame?: number, ...args: any[]) => any, frameRate: number = 60, amount: number = 0) {
		var i = 0;
		const interval = setInterval(
			async (frame) => {
				try {
					if (amount > 0) i++;
					if (i > amount) {
						return clearInterval(interval);
					}
					await callback(frame);
				} catch (error) {
					console.error(error);
					return clearInterval(interval);
				}
			},
			1000 / frameRate,
			i
		);
		return interval;
	}

	renderMode(mode: RenderMode) {
		this.mode = mode;
	}

	dropshadow(opts: { blur?: number; color?: string; x?: number; y?: number }) {
		this.ctx.shadowBlur = opts.blur ?? 5;
		this.ctx.shadowOffsetX = opts.x ?? 5;
		this.ctx.shadowOffsetY = opts.y ?? 5;
		this.ctx.shadowColor = opts.color || "black";
	}

	smooth(value: boolean = true) {
		this.ctx.imageSmoothingEnabled = value;
	}

	static percentage(max: number, percentage?: string) {
		if (typeof percentage !== "string" || !percentage.includes("%")) return percentage;

		const val = Number(percentage.match(/\d+/)?.[0]) || 50;

		return (max / 100) * val;
	}

	text(opts: {
		text: string;
		align?: CanvasTextAlign;
		baseline?: CanvasTextBaseline;
		style?: string;
		size?: number;
		font?: string;
		x?: number;
		y?: number;
		maxWidth?: number;
		measure?: boolean;
	}): Render | TextMetrics {
		this.ctx.font = `${opts.style || "normal"} ${opts.size || 15}px ${opts.font || "sans-serif"}`;
		if (!opts.x) opts.x = 0;
		if (!opts.y) opts.y = 0;
		this.ctx.textAlign = opts.align || "left";
		this.ctx.textBaseline = opts.baseline || "alphabetic";

		if (opts.measure) return this.ctx.measureText(opts.text);
		if (this.ctx.strokeStyle) this.ctx.strokeText(opts.text, opts.x, opts.y, opts.maxWidth);
		if (this.ctx.fillStyle) this.ctx.fillText(opts.text, opts.x, opts.y, opts.maxWidth);
		return this;
	}

	background(color: string) {
		const fillStyle = this.ctx.fillStyle;
		this.ctx.fillStyle = color;
		this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fill();
		this.ctx.fillStyle = fillStyle;
	}

	fill(color: string) {
		this.ctx.fillStyle = color;
		return this;
	}

	stroke(value: LiteralUnion<CanvasLineJoin | CanvasLineCap, string | CanvasGradient | CanvasPattern>) {
		if (typeof value == "number") this.ctx.lineWidth = value;
		if (["bevel", "miter", "round"].includes(value as string)) this.ctx.lineJoin = value as CanvasLineJoin;
		if (["butt", "round", "square"].includes(value as string)) this.ctx.lineCap = value as CanvasLineCap;

		this.ctx.strokeStyle = value;
		return this;
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		return this;
	}

	scale(x: number, y?: number) {
		if (!y) y = x;
		this.ctx.scale(x, y);
		return this;
	}

	pixelDensity(val: number) {
		this.canvas.width = this.width * val;
		this.canvas.height = this.height * val;

		this.ctx.scale(val, val);
		return this;
	}

	modeAdjust<T>(mode: RenderMode, opts: T & { x: number; y: number; width: number; height: number }): T {
		if (mode === "corner" || !mode) {
			return { ...opts, x: opts.x, y: opts.y, w: opts.width, h: opts.height };
		} else if (mode === "corners") {
			return { ...opts, x: opts.x, y: opts.y, w: opts.x - opts.width, h: opts.height - opts.y };
		} else if (mode === "radius") {
			return { ...opts, x: opts.x - opts.width, y: opts.y - opts.height, w: opts.width * 2, h: opts.height * 2 };
		} else if (mode === "center") {
			return {
				...opts,
				x: opts.x - opts.width * 0.5,
				y: opts.y - opts.height * 0.5,
				w: opts.width,
				h: opts.height,
			};
		}
	}

	rect(opts: { x: number; y: number; width: number; height: number; radius?: Radius }) {
		var { height, radius, y, x, width } = this.modeAdjust(this.mode, opts);
		this.ctx.beginPath();

		if (!radius) radius = 0;
		if (typeof radius === "number")
			radius = { bottomLeft: radius, bottomRight: radius, topLeft: radius, topRight: radius };

		this.ctx.moveTo(x + radius.topLeft, y);
		this.ctx.arcTo(x + width, y, x + width, y + height, radius.topRight);
		this.ctx.arcTo(x + width, y + height, x, y + height, radius.bottomRight);
		this.ctx.arcTo(x, y + height, x, y, radius.bottomLeft);
		this.ctx.arcTo(x, y, x + width, y, radius.topLeft);
		this.ctx.closePath();

		if (this.ctx.fillStyle) this.ctx.fill();
		if (this.ctx.strokeStyle) this.ctx.stroke();
		return this;
	}

	image(opts: {
		image: Canvas | Image;
		x: number;
		y: number;
		width?: number;
		height?: number;
		radius?: number;
		cropX?: number;
		cropY?: number;
		cropWidth?: number;
		cropHeight?: number;
		scale?: number;
	}) {
		if (!opts.scale) opts.scale = 1;
		opts.width = opts.width * opts.scale;
		opts.height = opts.height * opts.scale;

		if (!opts.cropX) opts.cropX = 0;
		if (!opts.cropY) opts.cropY = 0;
		if (!opts.cropHeight) opts.cropHeight = opts.image.height;
		if (!opts.cropWidth) opts.cropWidth = opts.image.width;

		if (opts.radius) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(opts.x, opts.y, opts.radius / 2, 0, Math.PI * 2, true);
			this.ctx.closePath();
			this.ctx.clip();
		}

		this.ctx.drawImage(
			opts.image,
			opts.cropX,
			opts.cropY,
			opts.cropWidth,
			opts.cropHeight,
			opts.x,
			opts.y,
			opts.width,
			opts.height
		);
		if (opts.radius) this.ctx.restore();

		return this;
	}

	toSharp() {
		return sharp(this.canvas.toBuffer("raw"), {
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
		// @ts-ignore
		return this.canvas.toBuffer(mimeType, config);
	}
}
